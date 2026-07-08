require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk/index.js');
const { execFile, execFileSync, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3003;
const {
  ACTIVE_READER_POLICY,
  planLessonFromConceptGraph,
} = require('../lesson-engine/agenticPipeline');

app.use(cors({
  origin: (origin, cb) => cb(null, true), // allow all origins (local dev)
}));
app.use(express.json({ limit: '25mb' }));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const { OpenAI } = require('openai');
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// ── Semantic PDF index: title → [{ pageNum, text, embedding }] ──
const pdfIndexes = new Map();
const PDF_INDEX_LIMIT = 5; // evict oldest when over limit

function cosineSim(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // text-embedding-3-small vectors are unit-normalized
}

app.post('/api/chat', async (req, res) => {
  const { messages, bookTitle, currentPage, pageText, readingSection, tutorMode, isTutorCheckin, outlineContext, learnerHistory, activeLessonConcept, activeLessonHighlight } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  const hasImage = messages.some(m => m.imageData);

  // ── RAG: retrieve semantically relevant pages ──────────────
  let retrievedContext = '';
  const ragChunks = pdfIndexes.get(bookTitle);
  if (openai && ragChunks?.length && !isTutorCheckin) {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    const query = typeof lastUser?.content === 'string' ? lastUser.content : '';
    if (query.trim()) {
      try {
        const qEmbed = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: query.slice(0, 500),
        });
        const qVec = qEmbed.data[0].embedding;
        const hits = ragChunks
          .filter(c => c.pageNum !== currentPage)
          .map(c => ({ pageNum: c.pageNum, text: c.text, score: cosineSim(qVec, c.embedding) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .filter(c => c.score > 0.35);
        if (hits.length) {
          retrievedContext = '\n\nRELEVANT CONTEXT FROM OTHER PAGES (use [GOTO:N] to send user there if helpful):\n' +
            hits.map(c => `[p.${c.pageNum}] ${c.text.slice(0, 400)}`).join('\n\n');
        }
      } catch { /* non-fatal — continue without retrieval */ }
    }
  }

  const sectionCtx = readingSection
    ? `\n\nSection the user is reading:\n"""\n${readingSection.slice(0, 500)}\n"""`
    : '';

  const pageContext = currentPage
    ? `\n\nPage ${currentPage}${bookTitle ? ` of "${bookTitle}"` : ''}.${pageText ? `\n\nPage text:\n"""\n${pageText.slice(0, 2000)}\n"""` : ''}${sectionCtx}${retrievedContext}`
    : '';

  const outlineSection = outlineContext
    ? `\n\nBOOK OUTLINE (use these page numbers for [GOTO:N]):\n${outlineContext.slice(0, 1500)}`
    : '';

  const learnerCtx = learnerHistory
    ? `\n\nLEARNER HISTORY (pages where student struggled — use to calibrate difficulty):\n${learnerHistory}`
    : '';
  const lessonCtx = activeLessonConcept
    ? `\n\nINTERNAL TUTOR FOCUS (do not mention this label): the learner is currently reading about "${String(activeLessonConcept).slice(0, 120)}". Ask about this concept only; do not jump to nearby terms unless they are central to the current passage.`
    : '';
  const highlightCtx = activeLessonHighlight
    ? `\nPreferred exact PDF highlight phrase: "${String(activeLessonHighlight).slice(0, 140)}". If you include a highlight tag, use this exact phrase or a shorter exact substring.`
    : '';

  const tutorInstructions = tutorMode ? `\n\nTUTOR MODE — STRICT SOCRATIC METHOD.${outlineSection}${learnerCtx}${lessonCtx}${highlightCtx}

${isTutorCheckin
  ? `The user has been reading for a while. Ask ONE short question about what they're reading.
Hook + question only. Max 20 visible words. No explanation. Do NOT include [HIGHLIGHT] tags for routine check-in questions.
70% open-ended: "Here's a thought — why would adding more hidden units not always help?"
30% multiple choice: "Quick check — what does ReLU output for negative inputs? A) 0  B) the input  C) −1"
If an INTERNAL TUTOR FOCUS is provided, ask about that concept, not a different concept from the same paragraph.
If the learner history above shows gaps on topics in the current page, probe those topics.
Output ONLY the question. Nothing else.`
  : `━━━ RULES (non-negotiable) ━━━
1. NEVER give a direct answer or explanation unprompted. You are a Socratic guide, not a lecturer.
   - If the student asks "what is X?", respond with "What do you think X might mean based on the context?"
   - If they're clearly stuck, give ONE short hint (not the answer), then ask them to complete the thought.
   - Only after 3+ exchanges on the same concept may you give a direct explanation — and even then keep it brief.
2. MAX RESPONSE: 2 short sentences + 1 question. No bullet-point lectures. No walls of text.
3. When user asks about a concept:
   • If it's in the current page text → ask what they think it means. Use [HIGHLIGHT:"verbatim phrase"] ONLY when pointing them to read a specific passage (not on every reply).
   • If it's on a different page → [GOTO:N] to take them there, optionally [HIGHLIGHT:"phrase"] on that page.
   • Do NOT emit [HIGHLIGHT] on every response — only when explicitly directing them to read something.
4. Never apologize for page content or re-summarize the page. React only to what the user said.
5. Offer a visualization ONLY if the user explicitly asks for one.
6. CROSS-PAGE: Use the book outline above to find the right page number for [GOTO:N].
7. Sometimes (30% of replies in a question exchange) ask a MULTIPLE CHOICE question to test understanding:
   Format: "Quick check — [brief question]? A) [option]  B) [option]  C) [option]"

━━━ TONE ━━━
Warm, curious, brief. Like a good study partner — not a professor.
"Interesting — what would happen if φ₀ were zero? [HIGHLIGHT:"the offset φ₀ controls the height"]"
"Right track! Now look at [GOTO:28] — what does the figure there show you?"`}` : '';

  // For tutor check-ins: use a minimal system to avoid verbose responses
  const system = isTutorCheckin
    ? `You are a Socratic tutor. ${pageContext}${tutorInstructions}`
    : `You are an engaging tutor helping the user understand a PDF${bookTitle ? ` titled "${bookTitle}"` : ''}. When the user quotes text (prefixed with >), use it as context for their question.${pageContext}${tutorInstructions}

Respond in a way that feels alive and interactive:
- **Default to including a visualization** whenever it would help — diagrams for processes, interactive demos for math/physics concepts, animated flows for algorithms. Err on the side of building one rather than skipping it.
- After your explanation, **ask the user one short follow-up question** to check understanding or deepen engagement (e.g. "Does that click? What part feels fuzzy?" or a quick conceptual question for them to answer).
- Keep prose tight — no walls of text. Use headers, bold key terms, short bullet points.

PDF HIGHLIGHTING: When pointing the user to a specific passage in the PDF, or when explaining something that appears in the current page text, include [HIGHLIGHT:"exact text"] tags in your response using the verbatim wording from the page context. Max 3 highlights, each 3–12 words. These tags are invisible to the user — the PDF viewer will yellow-highlight those passages automatically. Example: [HIGHLIGHT:"activation function must be nonlinear"]

CROSS-PAGE NAVIGATION: If you need to refer the user to content on a specific different page (e.g., "this was defined back in section 2.1" or "let's look at figure 4.2"), include [GOTO:N] once at the end of your response where N is the page number. The reader will be automatically navigated there with a "back" button to return. Use sparingly — only when seeing that specific page adds real value to understanding. Do not use [GOTO:N] for the current page.

When a visualization would help, output a self-contained interactive HTML visualization in a fenced code block:
\`\`\`html
<!DOCTYPE html><html>...self-contained with inline CSS/JS...</html>
\`\`\`
Style with background color exactly #1e1e1e and light text (#e0e0e0).

━━━ VISUALIZATION LAYOUT RULES (every rule is mandatory) ━━━

STRUCTURE:
- body has THREE zones: controls strip (#ui) at top, canvas/chart in the middle (fills remaining space), concept narration line (#narration) at the bottom.
- Use flexbox: body { display:flex; flex-direction:column; height:100vh; margin:0; overflow:hidden; background:#1e1e1e; }
  #ui { flex:0 0 auto; }  #canvas-wrap { flex:1 1 0; min-height:0; }  #narration { flex:0 0 auto; }

CONTROLS (#ui strip):
- Keep controls minimal and subtle. Use small font (12px), compact padding (4px 8px).
- Labels should describe the interaction directly, e.g. "φ₀ (intercept): 1.0" — no separate instruction text.
- Max 3 controls visible at once. If more needed, hide secondary ones in a collapsed section.
- Do NOT put a legend inside the controls strip — if needed, draw the legend inside the canvas itself.
- Background MUST be #1e1e1e (same as body) — no border, no darker shade. Must be seamless.

CONCEPT NARRATION LINE (#narration) — mandatory on every visualization:
- Always include a <div id="narration"> at the bottom of the body.
- CSS: height:28px; padding:0 14px; display:flex; align-items:center; font:12px/1 system-ui,sans-serif; color:#aaa; background:#1e1e1e;
- Update its textContent on EVERY user interaction (slider change, click, hover) with a plain-English sentence explaining what the current state means conceptually.
  Examples: "slope too shallow — model under-predicts most points, loss is high"
            "near-optimal slope — residuals are small, loss approaching minimum"
            "layer 2 activating — this hidden unit detects edges in the input"
- This line is always visible and always current — it IS the explanation the user needs.
- Never leave it empty after the first render.

LABELS ON CHART:
- Axis labels: minimum 13px, color #ccc. Never smaller — tiny labels are unreadable.
- Data labels: 12px, same color as their element.
- All text must be within the canvas bounds — never clipped or overflowing the edge.
- Do NOT draw label backgrounds (no fillRect behind text) — just the text with a subtle shadow if needed.

POPUPS / TOOLTIPS:
- Hover tooltips: appear on mouseover, vanish on mouseleave. 13px, color #eee, no background box.
- No floating legend cards covering the chart. Draw the legend as small text in an empty corner.

SEAMLESS APPEARANCE — non-negotiable:
- body, #ui, #narration, and the canvas background must ALL be exactly #1e1e1e.
- NO borders, NO dividers, NO box-shadows anywhere in the layout.
- The visualization must look like it IS the chat, not a widget inside it.

When asked to create a 3D visualization from a figure image, your goal is NOT just to replicate the figure in 3D — it is to build an **interactive learning tool** around it. Think: what would help someone deeply understand the concept this figure illustrates?

Interactive learning features to include (pick what fits the concept):
- **Sliders or buttons** that animate or morph the scene — e.g. change a parameter and watch the shape/behavior update in real time
- **Clickable parts** that highlight and show a tooltip/label explaining that component
- **Step-through mode** — a "Next" button that walks through stages of a process (e.g. forward pass, each layer activating)
- **Toggle views** — e.g. show/hide connections, switch between "normal network" vs "residual network"
- **Animated flows** — particles or arrows flowing along paths to show data movement, gradient flow, etc.
- **Hover tooltips** using CSS2DObjects that appear on mouseover with a one-line explanation

UI controls: a thin strip at the TOP of the layout (not floating over the canvas). Use the flexbox structure below.

Critical rendering rules:
- Text labels: use CSS2DRenderer for crisp HTML labels (import CSS2DRenderer and CSS2DObject from three/addons/renderers/CSS2DRenderer.js). Style label divs with color:#ffffff, font-size:11px, no background — just text-shadow:0 1px 3px #000. CRITICAL: create each CSS2DObject ONCE during scene init and attach it to its mesh — NEVER create or add CSS2DObjects inside the animation loop. To update label text, mutate the existing div's textContent.
- Materials: always fully opaque (opacity:1, transparent:false) unless transparency is intentional. Use MeshStandardMaterial or MeshPhongMaterial.
- Lighting: AmbientLight (intensity 1.5) + DirectionalLight (intensity 2).
- renderer.setClearColor(0x1e1e1e, 1).
- Panels/planes: MeshBasicMaterial with solid color 0x2a2a2a, fully opaque.

Structure (copy this exactly — do not change the body/layout CSS):
\`\`\`html
<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #1e1e1e; display: flex; flex-direction: column; width: 100vw; height: 100vh; overflow: hidden; }
  #ui { flex: 0 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 6px 10px; background: #1e1e1e; }
  #ui button { background: #2a2a2a; color: #ccc; border: 1px solid #3a3a3a; border-radius: 4px; padding: 3px 10px; font-size: 12px; cursor: pointer; }
  #ui button:hover { background: #333; color: #fff; border-color: #4a7ef5; }
  #ui label { font-size: 12px; color: #bbb; display: flex; align-items: center; gap: 4px; }
  #ui input[type=range] { accent-color: #4a7ef5; width: 120px; }
  #canvas-wrap { flex: 1 1 0; min-height: 0; position: relative; }
  #canvas-wrap canvas { display: block; width: 100% !important; height: 100% !important; }
  #narration { flex: 0 0 auto; height: 28px; padding: 0 14px; display: flex; align-items: center; font: 12px/1 system-ui,sans-serif; color: #888; background: #1e1e1e; }
</style>
</head>
<body>
<div id="ui"><!-- compact controls only — no instructions, no legend --></div>
<div id="canvas-wrap"><!-- canvas or SVG goes here --></div>
<div id="narration"><!-- update textContent on every interaction with a plain-English concept explanation --></div>
<script type="importmap">
{"imports": {"three": "https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js", "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/"}}
</script>
<script type="module">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// CANVAS SIZING — always do this before drawing, or the canvas stays at 300x150:
// const wrap = document.getElementById('canvas-wrap');
// const canvas = document.createElement('canvas');
// wrap.appendChild(canvas);
// function resize() { canvas.width = wrap.clientWidth; canvas.height = wrap.clientHeight; redraw(); }
// new ResizeObserver(resize).observe(wrap);
// window.addEventListener('load', resize);
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
// scene, camera, renderer, labelRenderer, controls, interactive logic, animation loop
</script>
</body>
</html>
\`\`\`
Use OrbitControls. Make it visually faithful, interactive, and genuinely educational.`;

  // Reformat messages — convert imageData fields to Claude multipart format, strip internal fields
  const formattedMessages = messages
    .filter(m => !m._tutorCheckin) // strip internal check-in markers
    .map(m => {
      if (m.imageData) {
        return {
          role: m.role,
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: m.imageMimeType || 'image/png',
                data: m.imageData,
              },
            },
            { type: 'text', text: m.content },
          ],
        };
      }
      return { role: m.role, content: m.content };
    }).filter(m => m.content && (Array.isArray(m.content) ? m.content.length > 0 : m.content.trim()));

  // Ensure message list ends with a user turn (required by Claude API)
  const apiMessages = (() => {
    const msgs = [...formattedMessages];
    if (msgs.length === 0 || msgs[msgs.length - 1].role !== 'user') {
      msgs.push({ role: 'user', content: isTutorCheckin ? 'Ask me a question.' : 'Continue.' });
    }
    return msgs;
  })();

  try {
    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
      max_tokens: isTutorCheckin ? 80 : hasImage ? 8192 : 4096,
      system,
      messages: apiMessages,
    });

    const reply = response.content[0]?.text || '';
    res.json({ reply });
  } catch (err) {
    console.error('Claude error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/embed-pdf ───────────────────────────────────
// Embeds all pages of a PDF with text-embedding-3-small for RAG retrieval.
// Called once on PDF load from the frontend; stores index server-side in memory.
app.post('/api/embed-pdf', async (req, res) => {
  const { title, pages } = req.body; // pages: [{ pageNum, text }]
  if (!title || !Array.isArray(pages) || !pages.length) {
    return res.status(400).json({ error: 'title and pages[] required' });
  }
  if (!openai) {
    return res.json({ ok: false, skipped: true, reason: 'OPENAI_API_KEY not configured' });
  }
  try {
    const valid = pages.filter(p => p.text?.trim());
    const BATCH = 100;
    const chunks = [];
    for (let i = 0; i < valid.length; i += BATCH) {
      const batch = valid.slice(i, i + BATCH);
      const resp = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: batch.map(p => p.text),
      });
      resp.data.forEach((d, j) => {
        chunks.push({ pageNum: batch[j].pageNum, text: batch[j].text, embedding: d.embedding });
      });
    }
    if (pdfIndexes.size >= PDF_INDEX_LIMIT) {
      pdfIndexes.delete(pdfIndexes.keys().next().value);
    }
    pdfIndexes.set(title, chunks);
    console.log(`[embed-pdf] indexed "${title}" — ${chunks.length} pages`);
    res.json({ ok: true, pages: chunks.length });
  } catch (err) {
    console.error('[embed-pdf]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/classify-figure ─────────────────────────────
// Fast Haiku call: classifies an image as 'equation' or 'figure' in ~300ms
app.post('/api/classify-figure', async (req, res) => {
  const { imageData, imageMimeType = 'image/png' } = req.body;
  if (!imageData) return res.status(400).json({ error: 'imageData required' });

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 5,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: imageMimeType, data: imageData } },
          {
            type: 'text',
            text: `Is the PRIMARY content of this image a mathematical equation or formula block?

Answer YES only if:
- The image shows actual math notation (equations, formulas with =, +, variables, Greek letters)
- The dominant content is math text arranged as equations

Answer NO if:
- It is a diagram, figure, chart, flowchart, architecture, graph, or illustration
- It contains shapes, boxes, arrows, or node networks
- It references an equation number ("Eq. 7.9") in a title but is itself a diagram

Reply with only: YES or NO`,
          },
        ],
      }],
    });
    const answer = response.content[0]?.text?.trim().toUpperCase();
    res.json({ type: answer === 'YES' ? 'equation' : 'figure' });
  } catch (err) {
    console.error('[classify-figure] error:', err.message);
    // On error, assume figure (safer fallback)
    res.json({ type: 'figure' });
  }
});

// ── POST /api/augment-equation ─────────────────────────────
// Generates an interactive equation HTML. Call ONLY after classify-figure returns 'equation'.
app.post('/api/augment-equation', async (req, res) => {
  const { imageData, imageMimeType = 'image/png', bookTitle, pageText } = req.body;
  if (!imageData) return res.status(400).json({ error: 'imageData required' });

  const system = `You are augmenting a mathematical equation block from a PDF page.

Reproduce the equations as HTML matching the original visually (white bg, same small font, same table layout), then make every symbol and every equation row fully interactive.

━━━ FONT & SIZE (CRITICAL) ━━━
- body font-size: 12px. Do NOT use MathJax or KaTeX — use Unicode + <i><sub><sup> only.
- Line height: 1.9. Padding: 6px 10px. overflow-y: auto; width:100%; height:100%; background:#fff.

━━━ LAYOUT ━━━
- <table> with columns: LHS | = | RHS. Cell padding: 0 6px; vertical-align: middle; white-space: nowrap.
- Each <td> MUST have white-space:nowrap so equation terms never wrap to a new line.

━━━ COLOR CODING ━━━
- Variables/unknowns: #2563eb  • Parameters (β,ω,φ,θ): #b45309
- Functions (sin,exp,log…): #7c3aed  • Index letters (i,j,k): #16a34a
- Operators/delimiters: #94a3b8  • Numbers: #374151

━━━ USE THIS EXACT HTML STRUCTURE (fill in your content) ━━━

\`\`\`html
<!DOCTYPE html><html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;font:12px/1.9 Georgia,'Times New Roman',serif;color:#1a1a1a;padding:6px 10px;overflow-y:auto;width:100%;height:100%}
table{border-collapse:collapse;width:100%}
td{padding:1px 6px;vertical-align:middle;white-space:nowrap}
.sym{border-radius:2px;cursor:help;transition:background 0.12s}
.sym:hover,.sym.hl{background:rgba(74,126,245,0.15)}
tr.eq-row{cursor:pointer}
tr.eq-row:hover td{background:rgba(0,0,0,0.03)}
.guide-body{display:none;margin-top:6px}
.guide-hd{cursor:pointer;font-size:11px;color:#888;user-select:none}
</style></head><body>

<!-- YOUR EQUATIONS TABLE:
  Each <tr> gets class="eq-row" + data-title="equation meaning" + data-body="full explanation"
  Each meaningful symbol gets class="sym" + data-tip="what it means" + data-v="varname" (for cross-highlighting)
  Example fraction: <span class="sym" data-tip="partial derivative of loss w.r.t. f₂" data-v="li_f2">∂ℓᵢ/∂f₂</span>
-->
<table>
  FILL IN YOUR EQUATIONS HERE
</table>

<div style="border-top:1px dashed #ddd;margin-top:8px;padding-top:4px">
  <span class="guide-hd" onclick="var b=this.nextElementSibling;b.style.display=b.style.display==='block'?'none':'block';this.textContent=this.textContent[0]==='▸'?'▾ Symbol guide':'▸ Symbol guide'">▸ Symbol guide</span>
  <div class="guide-body" style="font-size:11px;color:#555;line-height:1.8">
    FILL IN SYMBOL GUIDE ROWS: <b>symbol</b> — meaning<br>
  </div>
</div>

<script>
document.addEventListener('keydown',e=>{if(e.key==='Escape')window.parent.postMessage({type:'alex-popup',title:null},'*')});

// Tooltip via postMessage — send cursor coords so parent can position accurately
document.querySelectorAll('.sym').forEach(el=>{
  el.addEventListener('mouseenter',e=>{
    const tip=el.dataset.tip||'';
    if(tip) window.parent.postMessage({type:'alex-tooltip',text:tip,mx:e.clientX,my:e.clientY},'*');
    if(el.dataset.v)document.querySelectorAll('[data-v="'+el.dataset.v+'"]').forEach(s=>s.classList.add('hl'));
  });
  el.addEventListener('mousemove',e=>{
    window.parent.postMessage({type:'alex-tooltip-move',mx:e.clientX,my:e.clientY},'*');
  });
  el.addEventListener('mouseleave',()=>{
    window.parent.postMessage({type:'alex-tooltip',text:null},'*');
    document.querySelectorAll('.hl').forEach(s=>s.classList.remove('hl'));
  });
});

// Click row → postMessage popup in parent (avoids cutoff inside short iframe)
document.querySelectorAll('.eq-row').forEach(row=>{
  row.addEventListener('click',()=>{
    const title=row.dataset.title||row.querySelector('td')?.textContent?.trim()||'Equation';
    const body=row.dataset.body||'';
    window.parent.postMessage({type:'alex-popup',title,body},'*');
  });
});
</script></body></html>
\`\`\`

MANDATORY — do NOT skip any of these:
1. Every <tr> MUST have class="eq-row" data-title="short equation name (≤6 words)" data-body="1-sentence explanation (≤20 words)" — no exceptions, even for simple rows.
2. Every meaningful symbol MUST be: <span class="sym" style="color:#HEXCODE" data-tip="what this means" data-v="key">symbol</span>
   Colors: variables/unknowns=#2563eb  parameters(β,ω,φ,θ,Ω)=#b45309  functions(σ,a,exp,log)=#7c3aed  indices(i,j,k,K)=#16a34a  operators=#94a3b8  numbers=#374151
   Every colored symbol needs BOTH style="color:..." AND class="sym" data-tip="..." — missing data-tip means no hover tooltip.
${bookTitle ? `Context: from "${bookTitle}".` : ''}
${pageText ? `Page context (use to write accurate explanations):\n"""\n${pageText.slice(0, 800)}\n"""` : ''}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2500,
      system,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: imageMimeType, data: imageData } },
          { type: 'text', text: 'Reproduce this equation block as interactive HTML. Font size MUST be 12px. Use Unicode math, not MathJax.' },
        ],
      }],
    });

    const reply = response.content[0]?.text?.trim() || '';
    let html = reply.replace(/^```html?\s*/i, '').replace(/\s*```\s*$/, '');
    if (!html.trimStart().startsWith('<')) {
      return res.status(500).json({ error: 'Model did not return valid HTML' });
    }

    // Haiku frequently omits the <script> block — always inject the canonical one.
    // Strip any partial script the model may have included, then re-inject.
    if (!html.includes('alex-popup')) {
      html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
      const EQ_SCRIPT = `<script>
document.addEventListener('keydown',e=>{if(e.key==='Escape')window.parent.postMessage({type:'alex-popup',title:null},'*')});
document.querySelectorAll('.sym').forEach(el=>{
  el.addEventListener('mouseenter',e=>{
    const tip=el.dataset.tip||'';
    if(tip) window.parent.postMessage({type:'alex-tooltip',text:tip,mx:e.clientX,my:e.clientY},'*');
    if(el.dataset.v)document.querySelectorAll('[data-v="'+el.dataset.v+'"]').forEach(s=>s.classList.add('hl'));
  });
  el.addEventListener('mousemove',e=>{
    window.parent.postMessage({type:'alex-tooltip-move',mx:e.clientX,my:e.clientY},'*');
  });
  el.addEventListener('mouseleave',()=>{
    window.parent.postMessage({type:'alex-tooltip',text:null},'*');
    document.querySelectorAll('.hl').forEach(s=>s.classList.remove('hl'));
  });
});
document.querySelectorAll('.eq-row').forEach(row=>{
  row.addEventListener('click',()=>{
    const title=row.dataset.title||row.querySelector('td')?.textContent?.trim()||'Equation';
    const body=row.dataset.body||'';
    window.parent.postMessage({type:'alex-popup',title,body},'*');
  });
});
<\/script>`;
      if (html.includes('</body>')) {
        html = html.replace('</body>', EQ_SCRIPT + '</body>');
      } else if (html.includes('</html>')) {
        html = html.replace('</html>', EQ_SCRIPT + '</html>');
      } else {
        html += EQ_SCRIPT;
      }
    }

    // Haiku also drops class="sym" from colored spans and class="eq-row" from <tr>.
    // Without these classes the event listeners above bind to nothing → no popups at all.
    html = html.replace(/<span([^>]*style="color:#[0-9a-fA-F]{6}"[^>]*)>/gi, (m, attrs) => {
      if (/\bsym\b/.test(attrs)) return m;
      if (/\bclass=/i.test(attrs)) return m.replace(/class="([^"]*)"/i, 'class="sym $1"');
      return `<span class="sym"${attrs}>`;
    });
    html = html.replace(/<tr([^>]*)>/gi, (m, attrs) => {
      if (/\beq-row\b/.test(attrs)) return m;
      if (/\bclass=/i.test(attrs)) return m.replace(/class="([^"]*)"/i, 'class="eq-row $1"');
      return `<tr class="eq-row"${attrs}>`;
    });

    res.json({ html });
  } catch (err) {
    console.error('[augment-equation] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/modify-figure ────────────────────────────────
// Takes an existing interactive figure HTML + a user request and returns modified HTML
app.post('/api/modify-figure', async (req, res) => {
  const { currentHtml, request, bookTitle, pageText } = req.body;
  if (!currentHtml || !request) return res.status(400).json({ error: 'currentHtml and request required' });

  const system = `You are modifying an existing interactive figure HTML document based on a user request.

Rules:
- Return ONLY the complete modified HTML document — no markdown, no explanation, no code fences
- Preserve all existing interactive features (Three.js scene, SVG structure, controls) unless the request changes them
- Make ONLY the changes the user asked for — don't refactor or redesign unrelated parts
- The output must be fully self-contained and valid HTML
- Keep background colors and overall style consistent with the original
${bookTitle ? `Context: figure is from "${bookTitle}".` : ''}
${pageText ? `Page context:\n"""\n${pageText.slice(0, 600)}\n"""` : ''}`;

  try {
    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
      max_tokens: 8192,
      system,
      messages: [{
        role: 'user',
        content: `User request: "${request}"\n\nCurrent HTML:\n${currentHtml}`,
      }],
    });

    const reply = response.content[0]?.text?.trim() || '';
    // Strip any accidental code fences
    const cleaned = reply.replace(/^```html?\s*/i, '').replace(/\s*```\s*$/, '');
    if (!cleaned.trimStart().startsWith('<')) {
      return res.status(500).json({ error: 'Model did not return valid HTML' });
    }
    res.json({ html: cleaned });
  } catch (err) {
    console.error('[modify-figure] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/generate-explainer ──────────────────────────
// Always generates an interactive HTML explainer for a selected passage.
// Stored in the annotation so it can be replayed in future sessions.
app.post('/api/generate-explainer', async (req, res) => {
  const { selectedText, pageText, bookTitle, currentPage } = req.body;
  if (!selectedText) return res.status(400).json({ error: 'selectedText required' });

  const system = `You are building a compact interactive HTML explainer for a specific passage a student highlighted in a textbook.

Your output is a single self-contained HTML file that will be shown in a 500px-wide chat bubble.

━━━ CONTENT GOAL ━━━
Make the core concept in the selected passage immediately intuitive through interaction.
- Identify the 1-2 key ideas in the passage
- Build ONE focused interactive element (slider, animation, toggle, or step-through) that makes those ideas tangible
- Add hover tooltips on key terms (mouseenter/mouseleave only — no persistent cards)

━━━ LAYOUT (mandatory) ━━━
- body: display:flex; flex-direction:column; height:100vh; margin:0; overflow:hidden; background:#1e1e1e; color:#e0e0e0
- #ui strip at top: flex:0 0 auto; max-height:52px; padding:6px 10px; background:#1e1e1e; display:flex; flex-wrap:wrap; gap:6px; align-items:center  (NO border, NO darker bg — must be seamless)
- #canvas-wrap fills rest: flex:1 1 0; min-height:0; position:relative
- #narration at bottom: flex:0 0 auto; height:28px; padding:0 14px; display:flex; align-items:center; font:12px system-ui; color:#888; background:#1e1e1e — update textContent on every interaction
- Controls: 12px font, compact. Axis labels: min 13px. NO borders or dividers. NO popups on load. NO floating legends blocking the chart.

━━━ STYLE ━━━
background:#1e1e1e; accent:#4a7ef5; text:#e0e0e0
Button: background:#252525; border:1px solid #3a3a3a; border-radius:4px; color:#ccc; font-size:11px; padding:3px 10px
Slider: accent-color:#4a7ef5; width:100px
${bookTitle ? `Book: "${bookTitle}", page ${currentPage || '?'}.` : ''}`;

  try {
    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
      max_tokens: 4096,
      system,
      messages: [{
        role: 'user',
        content: `Selected passage:\n"""\n${selectedText.slice(0, 600)}\n"""\n\n${pageText ? `Page context:\n"""\n${pageText.slice(0, 800)}\n"""` : ''}\n\nBuild the interactive explainer. Output ONLY the HTML — no markdown, no explanation.`,
      }],
    });

    const raw = response.content[0]?.text?.trim() || '';
    const html = raw.replace(/^```html?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    if (!html.startsWith('<')) return res.status(500).json({ error: 'Model did not return HTML' });
    res.json({ html });
  } catch (err) {
    console.error('[generate-explainer] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/embed-status', (req, res) => {
  res.json({ indexed: pdfIndexes.has(req.query.title) });
});

// ── POST /api/score-answer ────────────────────────────────
// Haiku call: scores whether a student's answer is correct, partial, or wrong.
// Returns: { verdict, gap, resolved, feedback }
app.post('/api/score-answer', async (req, res) => {
  const { question, answer, prevGap, pageText } = req.body;
  if (!question || !answer) return res.status(400).json({ error: 'question and answer required' });

  const system = `You are evaluating whether a student's answer demonstrates understanding of the concept in the question.

Respond with ONLY a JSON object — no markdown, no explanation, just the JSON:
{
  "verdict": "correct" | "partial" | "wrong",
  "understanding": 0.0 to 1.0 (how much of the concept the answer demonstrates: 0 = none, 0.5 = partial, 1 = full mastery),
  "confidence": "high" | "medium" | "low" (how confident the student SOUNDS, judged from wording/hedging — not whether they are right),
  "misconception": true or false (true only if the student confidently asserts something incorrect — a wrong mental model, not just "I don't know"),
  "gap": "one sentence: what specifically is missing or wrong (null if verdict is correct)",
  "resolved": true or false (true only if prevGap was provided and this answer clearly resolves it),
  "feedback": "one warm short sentence of encouragement or gentle redirect (max 12 words)"
}

Rules:
- "correct" = student clearly shows understanding of the core concept
- "partial" = student is on the right track but missing a key part
- "wrong" = student's answer is off-track or shows a misconception
- Be generous: if the student shows the right intuition even if imprecisely worded, score "correct"
- understanding should track verdict but be graded: a lucky/hedged correct answer is lower than a crisp one; a near-miss partial is higher than a blank wrong.
- confidence is about TONE, independent of correctness: "it's definitely X" = high; "maybe X? not sure" or "I don't know" = low.
- misconception is TRUE only when a wrong answer is stated confidently as if correct; hedged or "I don't know" answers are misconception=false.
- gap should be a concise description usable by a tutor to target follow-up (e.g. "confused about why gradient reverses sign in backpropagation")`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system,
      messages: [{
        role: 'user',
        content: `Question asked: "${question}"

Student's answer: "${answer}"
${prevGap ? `\nPrevious gap to resolve: "${prevGap}"` : ''}
${pageText ? `\nPage context:\n"""\n${pageText.slice(0, 600)}\n"""` : ''}

Evaluate the student's answer.`,
      }],
    });

    const raw = response.content[0]?.text?.trim() || '';
    // Strip code fences if model wraps it
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    const result = JSON.parse(jsonStr);
    res.json(result);
  } catch (err) {
    console.error('[score-answer] error:', err.message);
    // On parse/API error return a neutral result so frontend doesn't break
    res.json({ verdict: 'partial', understanding: 0.5, confidence: 'medium', misconception: false, gap: null, resolved: false, feedback: 'Good effort — keep going!' });
  }
});

/* ──────────────────────────────────────────────────────────────────────
 * LESSON-ENGINE INTEGRATION
 *
 * Serves the compiled lesson plans, figure assets, chapter index, and a
 * persistent student model from disk. Mounted under /api/lessons/* and
 * /lesson-assets/* — the existing chat endpoints above are untouched.
 *
 * Source of truth on disk:
 *   chapter_graphs/ch01.json … ch55.json   — concept nodes + edges
 *   active-reader-demo/lesson_plans/*.json — compiled state-machine plans
 *   active-reader-demo/assets/figures/     — figure HTML + static images
 *   active-reader-demo/figures_index.json  — figure index
 *
 * ────────────────────────────────────────────────────────────────────── */
const path = require('path');
const fs   = require('fs');
const fsp  = require('fs/promises');

const REPO_ROOT          = path.resolve(__dirname, '../../../');
const CONTENT_ROOT       = path.resolve(process.env.ACTIVE_READER_CONTENT_ROOT || path.join(REPO_ROOT, 'content', 'visionbook-qmd'));
const DEMO_DIR           = path.resolve(process.env.ACTIVE_READER_DEMO_DIR || path.join(REPO_ROOT, 'content', 'active-reader-demo'));
const CHAPTER_GRAPHS_DIR = path.resolve(process.env.CHAPTER_GRAPHS_DIR || path.join(REPO_ROOT, 'content', 'chapter_graphs'));
const PLANS_DIR          = path.join(DEMO_DIR, 'lesson_plans');
const ASSETS_DIR         = path.join(DEMO_DIR, 'assets');
const PROMPT_EXPERIMENTS_DIR = path.join(REPO_ROOT, 'prompt_experiments');
const FIGURE_RESULTS_DIR = path.resolve(
  process.env.FIGURE_RESULTS_DIR || path.join(REPO_ROOT, 'content', 'figure-results'),
);
const STUDENT_MODEL_DIR  = path.join(__dirname, 'student_model');
const FIGURES_INDEX_FILE = path.join(DEMO_DIR, 'figures_index.json');
const REPO_PDF_DIR       = path.resolve(process.env.ACTIVE_READER_PDF_DIR || path.join(REPO_ROOT, 'local-pdfs'));
const { materializeEvaluationViews } = require('./figure-compat/result_schema');
const { screenshotHtml } = require('./figure-compat/runtime-helpers');
const CURSOR_FIGURE_EDIT_SCRIPT = path.join(__dirname, 'cursor_figure_edit.mjs');
const CURSOR_FIGURE_EDIT_JOBS_DIR = path.join(__dirname, '.figure-edit-jobs');
let interactiveFigureIndexCache = null;
let interactiveFigureIndexCacheAt = 0;
const INTERACTIVE_FIGURE_INDEX_TTL_MS = 5 * 60 * 1000;
const MIN_GALLERY_FIGURE_SCORE = 3.5;
const VISIONBOOK_FIGURE_OVERRIDES = {
  no_picture_on_a_wall_aina: path.join(REPO_ROOT, 'content', 'figure-examples', 'pinhole.html'),
};
const thumbnailMemoryCache = new Map();
const thumbnailWarmQueue = [];
const thumbnailWarmQueued = new Set();
let thumbnailWarmRunning = false;
const activeFigureEditJobs = new Map();

if (!fs.existsSync(STUDENT_MODEL_DIR)) fs.mkdirSync(STUDENT_MODEL_DIR, { recursive: true });

// Static mount for figure assets used by VISUAL/HINT lesson states
app.use('/lesson-assets', express.static(ASSETS_DIR, { maxAge: '1h' }));

// Static mount for QMD-relative figures + a sibling endpoint to fetch the
// raw QMD source. Both rooted at the content root because the QMD figure
// links look like "figures/imaging/brdf.png" relative to the book root.
app.use('/qmd-assets', express.static(CONTENT_ROOT, {
  maxAge: '1h',
  setHeaders: (res) => res.set('Access-Control-Allow-Origin', '*'),
}));

app.get('/api/qmd/source', async (req, res) => {
  try {
    const name = String(req.query.name || '');
    if (!/^[a-z0-9_\-]+\.(qmd|md)$/i.test(name)) return res.status(400).json({ error: 'bad name' });
    const p = path.join(CONTENT_ROOT, name);
    if (!fs.existsSync(p)) return res.status(404).json({ error: 'not found' });
    res.json({ name, text: await fsp.readFile(p, 'utf8') });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function resolvePandocInvocation() {
  if (process.env.PANDOC_PATH) return { command: process.env.PANDOC_PATH, prefixArgs: [] };
  const candidates = [];
  if (process.platform === 'darwin') candidates.push('/Applications/quarto/bin/tools/pandoc');
  if (process.platform === 'win32') {
    if (process.env.LOCALAPPDATA) candidates.push(path.join(process.env.LOCALAPPDATA, 'Programs', 'Quarto', 'bin', 'tools', 'pandoc.exe'));
    if (process.env.ProgramFiles) candidates.push(path.join(process.env.ProgramFiles, 'Quarto', 'bin', 'tools', 'pandoc.exe'));
  }
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return { command: candidate, prefixArgs: [] };
  }
  return { command: 'quarto', prefixArgs: ['pandoc'] };
}

function qmdTitleFromFile(relPath) {
  const absPath = path.join(CONTENT_ROOT, relPath);
  if (!fs.existsSync(absPath)) return path.basename(relPath, '.qmd').replace(/_/g, ' ');
  try {
    const lines = fs.readFileSync(absPath, 'utf8').split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      const match = line.match(/^#\s+(.+)$/);
      if (match) return match[1].replace(/\s*\{[^}]*\}\s*$/, '').replace(/\s+/g, ' ').trim();
    }
  } catch {}
  return path.basename(relPath, '.qmd').replace(/_/g, ' ');
}

function listVisionBookQmds() {
  const files = fs.readdirSync(CONTENT_ROOT)
    .filter(file => /^[a-z0-9_\-]+\.qmd$/i.test(file))
    .filter(file => !file.startsWith('part_') && !['index.qmd', 'references.qmd', 'copyright.qmd', 'series.qmd', 'taxonomy.qmd'].includes(file))
    .map(file => ({
      file,
      title: qmdTitleFromFile(file),
      isChapter: true,
    }));
  const order = new Map([
    ['simplesystem.qmd', 2],
    ['representing_the_image.qmd', 3],
    ['fairness.qmd', 4],
    ['imaging.qmd', 5],
    ['lenses.qmd', 6],
    ['camera_as_linsys.qmd', 7],
    ['color.qmd', 8],
  ]);
  return files.sort((a, b) => {
    const ao = order.get(a.file) || Number.MAX_SAFE_INTEGER;
    const bo = order.get(b.file) || Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return a.title.localeCompare(b.title);
  });
}

function pickEvaluationModel(record) {
  const results = record?.evaluationResults || {};
  const meta = record?.evaluationMeta || {};
  const keys = Object.keys(results);
  if (!keys.length) return null;
  return [...keys].sort((a, b) => {
    const aTime = meta[a]?.evaluatedAt ? new Date(meta[a].evaluatedAt).getTime() : 0;
    const bTime = meta[b]?.evaluatedAt ? new Date(meta[b].evaluatedAt).getTime() : 0;
    return bTime - aTime;
  })[0] || keys[0];
}

function scoreOfFigureRecord(record) {
  const modelId = pickEvaluationModel(record);
  const evaluation = modelId ? record?.evaluationResults?.[modelId] : null;
  return evaluation?.overall_average ?? null;
}

function pushInteractiveFigureEntry(index, stem, entry) {
  if (!stem) return;
  if (!index[stem]) index[stem] = [];
  index[stem].push(entry);
}

function collectExperimentHtml(index, expName, modelName, dir, modelDir) {
  for (const file of fs.readdirSync(dir)) {
    const absPath = path.join(dir, file);
    if (fs.statSync(absPath).isDirectory()) {
      collectExperimentHtml(index, expName, modelName, absPath, modelDir);
      continue;
    }
    if (!file.endsWith('.html')) continue;
    const stem = path.basename(file, '.html');
    const evalPath = absPath.replace(/\.html$/, '.eval.json');
    let evaluation = {};
    if (fs.existsSync(evalPath)) {
      try {
        evaluation = materializeEvaluationViews(JSON.parse(fs.readFileSync(evalPath, 'utf8')));
      } catch {}
    }
    pushInteractiveFigureEntry(index, stem, {
      sourceType: 'experiment',
      sourceKey: `experiment:${expName}:${modelName}:${path.relative(modelDir, absPath)}`,
      htmlPath: absPath,
      hasThumb: true,
      model: modelName,
      experiment: expName,
      score: scoreOfFigureRecord(evaluation),
      timestamp: fs.statSync(absPath).mtime.toISOString(),
    });
  }
}

function addVisionBookFigureOverrides(index) {
  for (const [stem, htmlPath] of Object.entries(VISIONBOOK_FIGURE_OVERRIDES)) {
    if (!fs.existsSync(htmlPath)) continue;
    pushInteractiveFigureEntry(index, stem, {
      sourceType: 'override',
      sourceKey: `override:${stem}:${path.basename(htmlPath)}`,
      htmlPath,
      model: 'hand-selected',
      experiment: 'examples',
      score: 999,
      timestamp: fs.statSync(htmlPath).mtime.toISOString(),
      hasThumb: true,
      preferred: true,
    });
  }
}

function buildInteractiveFigureIndex() {
  const now = Date.now();
  if (interactiveFigureIndexCache && now - interactiveFigureIndexCacheAt < INTERACTIVE_FIGURE_INDEX_TTL_MS) {
    return interactiveFigureIndexCache;
  }

  const index = {};
  if (fs.existsSync(FIGURE_RESULTS_DIR)) {
    for (const file of fs.readdirSync(FIGURE_RESULTS_DIR)) {
      if (!file.endsWith('.json')) continue;
      const resultPath = path.join(FIGURE_RESULTS_DIR, file);
      try {
        const record = materializeEvaluationViews(JSON.parse(fs.readFileSync(resultPath, 'utf8')));
        const stem = path.basename(record.filename || '', path.extname(record.filename || ''));
        if (!stem || !record.html) continue;
        pushInteractiveFigureEntry(index, stem, {
          sourceType: 'result',
          sourceKey: `result:${record.id || file}`,
          resultId: record.id || null,
          html: record.html,
          _file: resultPath,
          hasThumb: Boolean(record.html),
          model: record.model || 'unknown',
          experiment: record.experiment || '',
          parentSourceKey: record.parent_source_key || '',
          editPrompt: record.edit_prompt || '',
          durationMs: record.edit_duration_ms ?? record.edit_log?.duration_ms ?? null,
          versionIndex: record.edit_version_index ?? record.edit_log?.version_index ?? null,
          score: scoreOfFigureRecord(record),
          timestamp: record.timestamp || fs.statSync(resultPath).mtime.toISOString(),
        });
      } catch {}
    }
  }

  if (fs.existsSync(PROMPT_EXPERIMENTS_DIR)) {
    for (const expName of fs.readdirSync(PROMPT_EXPERIMENTS_DIR)) {
      const expDir = path.join(PROMPT_EXPERIMENTS_DIR, expName);
      if (!fs.statSync(expDir).isDirectory()) continue;
      for (const modelName of fs.readdirSync(expDir)) {
        const modelDir = path.join(expDir, modelName);
        if (!fs.statSync(modelDir).isDirectory()) continue;
        collectExperimentHtml(index, expName, modelName, modelDir, modelDir);
      }
    }
  }

  addVisionBookFigureOverrides(index);

  for (const stem of Object.keys(index)) {
    index[stem].sort((a, b) => {
      const aEdit = /visionbook_(agent_)?edit/.test(a.experiment || '') ? 1 : 0;
      const bEdit = /visionbook_(agent_)?edit/.test(b.experiment || '') ? 1 : 0;
      if (aEdit !== bEdit) return bEdit - aEdit;
      if (aEdit && bEdit) return String(b.timestamp || '').localeCompare(String(a.timestamp || ''));
      const preferredDiff = Number(Boolean(b.preferred)) - Number(Boolean(a.preferred));
      if (preferredDiff !== 0) return preferredDiff;
      const scoreDiff = (b.score ?? -1) - (a.score ?? -1);
      if (scoreDiff !== 0) return scoreDiff;
      return String(b.timestamp || '').localeCompare(String(a.timestamp || ''));
    });
  }
  interactiveFigureIndexCache = index;
  interactiveFigureIndexCacheAt = now;
  return index;
}

function iframeHeightFromAttrs(attrs) {
  const widthMatch = String(attrs || '').match(/width:\s*([\d.]+)%/i);
  const widthPct = widthMatch ? parseFloat(widthMatch[1]) : 65;
  if (widthPct >= 95) return 520;
  if (widthPct >= 75) return 460;
  if (widthPct >= 45) return 380;
  return 320;
}

function parseQmdFigureRefs(qmdFile) {
  if (!/^[a-z0-9_\-]+\.qmd$/i.test(qmdFile)) throw new Error('bad qmd name');
  const qmdPath = path.resolve(path.join(CONTENT_ROOT, qmdFile));
  if (!qmdPath.startsWith(CONTENT_ROOT) || !fs.existsSync(qmdPath)) throw new Error('QMD file not found');
  const text = fs.readFileSync(qmdPath, 'utf8');
  const refs = [];
  const seen = new Set();
  const re = /!\[([^\]]*)\]\((figures\/[^)]+)\)(?:\{([^}]*)\})?/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    const figPath = match[2];
    const stem = path.basename(figPath, path.extname(figPath));
    if (seen.has(stem)) continue;
    seen.add(stem);
    refs.push({
      stem,
      path: figPath,
      alt: match[1] || '',
      attrs: match[3] || '',
    });
  }
  return refs;
}

function candidateSummary(entry) {
  const source = encodeURIComponent(entry.sourceKey || '');
  return {
    sourceType: entry.sourceType,
    sourceKey: entry.sourceKey,
    resultId: entry.resultId || null,
    model: entry.model || 'unknown',
    experiment: entry.experiment || '',
    score: entry.score ?? null,
    timestamp: entry.timestamp || '',
    preferred: Boolean(entry.preferred),
    parentSourceKey: entry.parentSourceKey || '',
    edited: /visionbook_(agent_)?edit/.test(entry.experiment || ''),
    editPrompt: entry.editPrompt || '',
    durationMs: entry.durationMs ?? null,
    versionIndex: entry.versionIndex ?? null,
    hasThumb: Boolean(entry.hasThumb || entry.html || entry.htmlPath),
    thumbUrl: (entry.hasThumb || entry.html || entry.htmlPath) ? `/api/visionbook/figure-thumb?sourceKey=${source}` : '',
    htmlUrl: entry.sourceKey ? `/api/visionbook/figure-html?sourceKey=${source}` : '',
  };
}

function is3DGeneratedEntry(entry) {
  const html = interactiveFigureHtml(entry);
  return /\bTHREE\b|three\/|WebGLRenderer|OrbitControls|PerspectiveCamera|OrthographicCamera|CSS2DRenderer/i.test(html);
}

function isVisionBookEditEntry(entry) {
  return /visionbook_(agent_)?edit/.test(entry?.experiment || '');
}

function collapseEditChains(entries = []) {
  const bySource = new Map(entries.map(entry => [entry.sourceKey, entry]));
  const rootOf = (entry) => {
    let current = entry;
    const seen = new Set();
    while (current?.parentSourceKey && !seen.has(current.sourceKey)) {
      seen.add(current.sourceKey);
      const parent = bySource.get(current.parentSourceKey);
      if (!parent) return current.parentSourceKey;
      current = parent;
    }
    return current?.sourceKey || entry.sourceKey;
  };

  const latestEditByRoot = new Map();
  for (const entry of entries) {
    if (!isVisionBookEditEntry(entry)) continue;
    const root = rootOf(entry);
    const current = latestEditByRoot.get(root);
    if (!current || String(entry.timestamp || '').localeCompare(String(current.timestamp || '')) > 0) {
      latestEditByRoot.set(root, entry);
    }
  }

  const editedRoots = new Set(latestEditByRoot.keys());
  const collapsed = [];
  const emitted = new Set();
  for (const entry of entries) {
    const root = rootOf(entry);
    if (editedRoots.has(root)) {
      const latest = latestEditByRoot.get(root);
      if (latest && !emitted.has(latest.sourceKey)) {
        collapsed.push(latest);
        emitted.add(latest.sourceKey);
      }
      continue;
    }
    if (!emitted.has(entry.sourceKey)) {
      collapsed.push(entry);
      emitted.add(entry.sourceKey);
    }
  }
  return collapsed;
}

function galleryApprovedFigureStems() {
  if (!fs.existsSync(FIGURES_INDEX_FILE)) return new Set();
  try {
    const index = JSON.parse(fs.readFileSync(FIGURES_INDEX_FILE, 'utf8'));
    return new Set((index.figures || [])
      .filter(figure => figure?.include_in_clean_gallery || Number(figure?.critique?.overall_average) > 4.0)
      .map(figure => path.basename(figure.filename || '', path.extname(figure.filename || '')))
      .filter(Boolean));
  } catch {
    return new Set();
  }
}

function getVisionBookSubstitutions(qmdFile) {
  const figureIndex = buildInteractiveFigureIndex();
  const approvedStems = galleryApprovedFigureStems();
  const warmEntries = [];
  const substitutions = parseQmdFigureRefs(qmdFile).map(ref => {
    const entries = (figureIndex[ref.stem] || [])
      .filter(entry => entry.preferred
        || entry.experiment === 'visionbook_edit'
        || entry.experiment === 'visionbook_agent_edit'
        || approvedStems.has(ref.stem)
        || (entry.score != null && entry.score >= MIN_GALLERY_FIGURE_SCORE));
    warmEntries.push(...entries);
    return {
      ...ref,
      candidates: entries.map(candidateSummary),
    };
  });
  enqueueThumbnailWarm(warmEntries);
  return substitutions;
}

function qmdFigureRefByStem(qmdFile, stem) {
  try {
    return parseQmdFigureRefs(qmdFile).find(ref => ref.stem === stem) || null;
  } catch {
    return null;
  }
}

function imageMimeFromPath(filePath) {
  const ext = path.extname(filePath || '').toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.svg') return 'image/svg+xml';
  return 'image/png';
}

function normalizeEditAttachments(input) {
  const attachments = Array.isArray(input) ? input : [];
  return attachments.slice(0, 6).map((item, index) => {
    const data = String(item?.data || '').replace(/^data:[^;]+;base64,/, '');
    return {
      name: String(item?.name || `attachment_${index + 1}`).replace(/[^\w.\-]+/g, '_').slice(0, 80),
      mimeType: String(item?.mimeType || item?.mediaType || 'application/octet-stream'),
      data,
      note: String(item?.note || '').slice(0, 500),
      source: String(item?.source || 'user_attachment').slice(0, 80),
    };
  }).filter(item => item.data);
}

function attachmentExt(mimeType = '') {
  if (/png/i.test(mimeType)) return 'png';
  if (/jpe?g/i.test(mimeType)) return 'jpg';
  if (/webp/i.test(mimeType)) return 'webp';
  if (/gif/i.test(mimeType)) return 'gif';
  if (/svg/i.test(mimeType)) return 'svg';
  if (/plain|text/i.test(mimeType)) return 'txt';
  if (/json/i.test(mimeType)) return 'json';
  return 'bin';
}

function readFigureResultRecordBySourceKey(sourceKey) {
  const id = String(sourceKey || '').replace(/^result:/, '');
  if (!id || id === sourceKey) return null;
  const resultPath = path.join(FIGURE_RESULTS_DIR, `${id}.json`);
  if (!fs.existsSync(resultPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(resultPath, 'utf8'));
  } catch {
    return null;
  }
}

function editVersionIndex(stem, parentSourceKey) {
  let index = 1;
  let current = readFigureResultRecordBySourceKey(parentSourceKey);
  const seen = new Set();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    const recordStem = path.basename(current.filename || '', path.extname(current.filename || ''));
    if (recordStem !== stem || !current.parent_source_key) break;
    index += 1;
    current = readFigureResultRecordBySourceKey(current.parent_source_key);
  }
  return index;
}

function injectFigureCaptureBridge(html, { disableDirectEdit = false } = {}) {
  const bridge = `<style id="visionbook-fake-transform-cleanup">
[class*="gumball" i],[id*="gumball" i],
[class*="gizmo" i],[id*="gizmo" i],
[class*="transform-controls" i],[id*="transform-controls" i],
[class*="manipulator" i],[id*="manipulator" i],
[class*="object-editor" i],[id*="object-editor" i],
[class*="direct-edit" i],[id*="direct-edit" i],
[class*="edit-handle" i],[id*="edit-handle" i],
[class*="rotate-handle" i],[id*="rotate-handle" i],
[class*="selection-handle" i],[id*="selection-handle" i],
[class*="selection-box" i],[id*="selection-box" i]{
  display:none!important;
  pointer-events:none!important;
}
</style>
<script>
(function(){
  if (window.__visionbookCaptureBridge) return;
  window.__visionbookCaptureBridge = true;
  var disableDirectEdit = ${disableDirectEdit ? 'true' : 'false'};
  var directEditSelector = [
    '[class*="gumball" i]', '[id*="gumball" i]',
    '[class*="gizmo" i]', '[id*="gizmo" i]',
    '[class*="transform-controls" i]', '[id*="transform-controls" i]',
    '[class*="manipulator" i]', '[id*="manipulator" i]',
    '[class*="object-editor" i]', '[id*="object-editor" i]',
    '[class*="direct-edit" i]', '[id*="direct-edit" i]',
    '[class*="edit-handle" i]', '[id*="edit-handle" i]',
    '[class*="rotate-handle" i]', '[id*="rotate-handle" i]',
    '[class*="selection-handle" i]', '[id*="selection-handle" i]',
    '[class*="selection-box" i]', '[id*="selection-box" i]'
  ].join(',');
  function cleanupDirectEditUi() {
    try {
      document.querySelectorAll(directEditSelector).forEach(function(el) {
        el.style.display = 'none';
        el.style.pointerEvents = 'none';
        el.setAttribute('aria-hidden', 'true');
      });
    } catch (e) {}
  }
  cleanupDirectEditUi();
  new MutationObserver(cleanupDirectEditUi).observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  if (disableDirectEdit) {
    ['pointerdown', 'mousedown', 'touchstart'].forEach(function(type) {
      window.addEventListener(type, function(event) {
        var target = event.target;
        if (target && target.closest && target.closest(directEditSelector)) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      }, true);
    });
  }
  window.addEventListener('message', function(event) {
    var msg = event.data || {};
    if (!msg || msg.type !== 'visionbook:capture-screenshot') return;
    var requestId = msg.requestId || '';
    function reply(payload) {
      event.source && event.source.postMessage(Object.assign({ type: 'visionbook:capture-screenshot-result', requestId: requestId }, payload), event.origin || '*');
    }
    try {
      var canvas = document.querySelector('canvas');
      if (canvas && canvas.toDataURL) {
        reply({ ok: true, dataUrl: canvas.toDataURL('image/png'), source: 'canvas' });
        return;
      }
      var svg = document.querySelector('svg');
      if (svg) {
        var text = new XMLSerializer().serializeToString(svg);
        reply({ ok: true, dataUrl: 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(text))), source: 'svg' });
        return;
      }
      var img = document.querySelector('img');
      if (img && (img.currentSrc || img.src)) {
        reply({ ok: true, dataUrl: img.currentSrc || img.src, source: 'img' });
        return;
      }
      reply({ ok: false, error: 'No canvas/svg/image found to capture.' });
    } catch (err) {
      reply({ ok: false, error: err && err.message ? err.message : String(err) });
    }
  });
})();
</script>`;
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${bridge}</body>`);
  if (/<\/html>/i.test(html)) return html.replace(/<\/html>/i, `${bridge}</html>`);
  return `${html}\n${bridge}`;
}

function loadOriginalQmdFigureImage(qmdFile, stem) {
  const ref = qmdFigureRefByStem(qmdFile, stem);
  if (!ref?.path) return null;
  const absPath = path.resolve(path.join(CONTENT_ROOT, ref.path));
  if (!absPath.startsWith(CONTENT_ROOT) || !fs.existsSync(absPath)) return null;
  return {
    data: fs.readFileSync(absPath).toString('base64'),
    mediaType: imageMimeFromPath(absPath),
    path: ref.path,
    alt: ref.alt || '',
  };
}

function findInteractiveFigureEntry(sourceKey) {
  if (!sourceKey) return null;
  const figureIndex = buildInteractiveFigureIndex();
  for (const matches of Object.values(figureIndex)) {
    const entry = matches.find(candidate => candidate.sourceKey === sourceKey);
    if (entry) return entry;
  }
  return null;
}

function interactiveFigureHtml(entry) {
  if (!entry) return '';
  return entry.html || (entry.htmlPath ? fs.readFileSync(entry.htmlPath, 'utf8') : '');
}

async function cachedFigureThumbnail(entry) {
  const sourceKey = entry?.sourceKey || '';
  if (!sourceKey) return null;
  const cached = thumbnailMemoryCache.get(sourceKey);
  if (cached) return cached;

  const html = interactiveFigureHtml(entry);
  if (!html) return null;

  if (entry?._file) {
    const record = JSON.parse(fs.readFileSync(entry._file, 'utf8'));
    if (record.generatedThumbBase64) {
      const thumb = {
        data: record.generatedThumbBase64,
        mediaType: record.generatedThumbMediaType || 'image/jpeg',
      };
      thumbnailMemoryCache.set(sourceKey, thumb);
      return thumb;
    }

    const shot = await screenshotHtml(html, 1200);
    if (!shot?.data) return null;
    record.generatedThumbBase64 = shot.data;
    record.generatedThumbMediaType = shot.mediaType || 'image/jpeg';
    record.generatedThumbAt = new Date().toISOString();
    await fsp.writeFile(entry._file, JSON.stringify(record, null, 2));
    const thumb = { data: shot.data, mediaType: record.generatedThumbMediaType };
    thumbnailMemoryCache.set(sourceKey, thumb);
    return thumb;
  }

  const shot = await screenshotHtml(html, 1200);
  if (!shot?.data) return null;
  const thumb = { data: shot.data, mediaType: shot.mediaType || 'image/jpeg' };
  thumbnailMemoryCache.set(sourceKey, thumb);
  return thumb;
}

async function runThumbnailWarmQueue() {
  if (thumbnailWarmRunning) return;
  thumbnailWarmRunning = true;
  try {
    while (thumbnailWarmQueue.length) {
      const entry = thumbnailWarmQueue.shift();
      thumbnailWarmQueued.delete(entry.sourceKey);
      try {
        await cachedFigureThumbnail(entry);
      } catch (e) {
        console.warn('[visionbook/thumb-warm] failed:', entry.sourceKey, e.message);
      }
    }
  } finally {
    thumbnailWarmRunning = false;
  }
}

function enqueueThumbnailWarm(entries = []) {
  for (const entry of entries) {
    if (!entry?.sourceKey || thumbnailMemoryCache.has(entry.sourceKey) || thumbnailWarmQueued.has(entry.sourceKey)) continue;
    thumbnailWarmQueued.add(entry.sourceKey);
    thumbnailWarmQueue.push(entry);
  }
  if (thumbnailWarmQueue.length) setImmediate(runThumbnailWarmQueue);
}

function extractHtmlFromModelText(text) {
  const raw = String(text || '').trim();
  const fenced = raw.match(/```(?:html)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : raw;
  const docStart = candidate.search(/<!doctype\s+html|<html[\s>]/i);
  if (docStart >= 0) {
    const doc = candidate.slice(docStart).trim();
    const htmlClose = doc.search(/<\/html\s*>/i);
    return htmlClose >= 0 ? doc.slice(0, htmlClose + doc.match(/<\/html\s*>/i)[0].length).trim() : doc;
  }
  const tagStart = candidate.search(/<(div|svg|canvas|section|figure|style|script|body|head)[\s>]/i);
  return tagStart >= 0 ? candidate.slice(tagStart).trim() : candidate;
}

function summarizeHtmlChanges(before = '', after = '') {
  const beforeLines = String(before || '').split('\n');
  const afterLines = String(after || '').split('\n');
  const maxLen = Math.max(beforeLines.length, afterLines.length);
  const changed = [];
  for (let i = 0; i < maxLen; i += 1) {
    if ((beforeLines[i] || '') !== (afterLines[i] || '')) {
      changed.push({
        line: i + 1,
        before: String(beforeLines[i] || '').trim().slice(0, 220),
        after: String(afterLines[i] || '').trim().slice(0, 220),
      });
    }
  }

  const changedText = changed.map(row => `${row.before}\n${row.after}`).join('\n').toLowerCase();
  const changedAreas = [];
  if (/\bcamera\b|orbitcontrols|controls\.target|position\.set|lookat|fov|zoom/.test(changedText)) changedAreas.push('camera/view');
  if (/\blabel|textcontent|innerhtml|annotation|caption|font-size/.test(changedText)) changedAreas.push('labels/annotations');
  if (/\bcolor|material|opacity|background|line|arrow|mesh|geometry|scale/.test(changedText)) changedAreas.push('visual styling/geometry');
  if (/\bslider|button|input|addeventlistener|onclick|control/.test(changedText)) changedAreas.push('interaction/controls');
  if (/<style|css|class=|style=/.test(changedText)) changedAreas.push('layout/css');
  if (/<script|function|const |let |var /.test(changedText)) changedAreas.push('javascript');

  return {
    changed_line_count: changed.length,
    changed_areas: [...new Set(changedAreas)],
    sample_changes: changed.slice(0, 10),
  };
}

function safeFigureResultId(stem) {
  const base = String(stem || 'figure').replace(/[^a-z0-9_\-]+/gi, '_').replace(/^_+|_+$/g, '') || 'figure';
  return `${base}_edit_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function extensionForMediaType(mediaType = '') {
  if (/jpe?g/i.test(mediaType)) return 'jpg';
  if (/webp/i.test(mediaType)) return 'webp';
  if (/gif/i.test(mediaType)) return 'gif';
  if (/svg/i.test(mediaType)) return 'svg';
  return 'png';
}

function parseJsonFromProcessOutput(output) {
  const lines = String(output || '').split('\n').map(line => line.trim()).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    try {
      return JSON.parse(lines[i]);
    } catch {}
  }
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function publicFigureEditJob(job) {
  if (!job) return null;
  return {
    id: job.id,
    status: job.status,
    stage: job.stage,
    message: job.message,
    startedAt: job.startedAt,
    updatedAt: job.updatedAt,
    elapsedMs: Date.now() - job.startedAt,
    logs: job.logs || [],
    candidate: job.candidate || null,
    error: job.error || '',
  };
}

function updateFigureEditJob(jobId, patch) {
  const job = activeFigureEditJobs.get(jobId);
  if (!job) return null;
  const next = {
    ...job,
    ...patch,
    updatedAt: Date.now(),
    logs: [
      ...(job.logs || []),
      ...(patch.message ? [{ ts: Date.now(), stage: patch.stage || job.stage, message: patch.message }] : []),
    ].slice(-20),
  };
  activeFigureEditJobs.set(jobId, next);
  return next;
}

async function readValidHtmlIfReady(filePath) {
  try {
    const html = await fsp.readFile(filePath, 'utf8');
    return html.trimStart().startsWith('<') ? html : null;
  } catch {
    return null;
  }
}

async function readAgentProgressNotes(jobDir) {
  try {
    const rows = JSON.parse(await fsp.readFile(path.join(jobDir, 'progress.json'), 'utf8'));
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function runCursorFigureEditJob({ stem, qmd, sourceKey, editRequest, currentHtml, originalImage, currentShot, attachments = [], jobId: existingJobId, onProgress = () => {} }) {
  if (!process.env.CURSOR_API_KEY) {
    throw new Error('CURSOR_API_KEY is required to run the coding-agent figure editor.');
  }

  const jobId = existingJobId || safeFigureResultId(`${stem}_agent`);
  const jobDir = path.join(CURSOR_FIGURE_EDIT_JOBS_DIR, jobId);
  await fsp.mkdir(jobDir, { recursive: true });
  onProgress('preparing', 'Preparing edit workspace');

  await Promise.all([
    fsp.writeFile(path.join(jobDir, 'current.html'), currentHtml, 'utf8'),
    fsp.writeFile(path.join(jobDir, 'request.txt'), editRequest, 'utf8'),
    fsp.writeFile(path.join(jobDir, 'metadata.json'), JSON.stringify({
      stem,
      qmd: qmd || null,
      sourceKey,
      hasOriginalImage: Boolean(originalImage),
      hasCurrentScreenshot: Boolean(currentShot?.data),
      attachments: attachments.map(({ name, mimeType, note, source }) => ({ name, mimeType, note, source })),
    }, null, 2), 'utf8'),
  ]);

  if (originalImage?.data) {
    await fsp.writeFile(
      path.join(jobDir, `original_figure.${extensionForMediaType(originalImage.mediaType)}`),
      Buffer.from(originalImage.data, 'base64')
    );
  }
  if (currentShot?.data) {
    await fsp.writeFile(path.join(jobDir, 'current_screenshot.jpg'), Buffer.from(currentShot.data, 'base64'));
  }
  for (const [idx, attachment] of attachments.entries()) {
    const ext = path.extname(attachment.name) || `.${attachmentExt(attachment.mimeType)}`;
    const fileName = `attachment_${idx + 1}_${path.basename(attachment.name, path.extname(attachment.name))}${ext}`.replace(/[^\w.\-]+/g, '_');
    await fsp.writeFile(path.join(jobDir, fileName), Buffer.from(attachment.data, 'base64'));
  }
  onProgress('prepared', 'Workspace ready; launching coding agent');

  const timeout = Number(process.env.CURSOR_FIGURE_EDIT_TIMEOUT_MS || 90 * 1000);
  const editedHtmlPath = path.join(jobDir, 'edited.html');
  const child = spawn(process.execPath, [CURSOR_FIGURE_EDIT_SCRIPT, jobDir], {
    cwd: __dirname,
    env: process.env,
  });
  onProgress('agent_running', 'Coding agent is editing the figure');
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', chunk => { stdout += chunk.toString(); });
  child.stderr.on('data', chunk => { stderr += chunk.toString(); });

  const startedAt = Date.now();
  let exitCode = null;
  child.on('exit', code => { exitCode = code; });
  let lastWaitLogAt = 0;
  let lastProgressKey = '';

  while (Date.now() - startedAt < timeout) {
    const html = await readValidHtmlIfReady(editedHtmlPath);
    if (html) {
      onProgress('artifact_ready', 'Edited HTML artifact is ready');
      if (exitCode == null) child.kill('SIGTERM');
      return {
        html,
        jobId,
        jobDir,
        agentOutput: parseJsonFromProcessOutput(stdout) || parseJsonFromProcessOutput(stderr) || {
          status: 'returned_after_edited_html_ready',
          stdoutPreview: stdout.slice(-1200),
          stderrPreview: stderr.slice(-1200),
        },
      };
    }

    if (exitCode != null) break;
    const progressNotes = await readAgentProgressNotes(jobDir);
    const lastNote = progressNotes[progressNotes.length - 1];
    const progressKey = lastNote ? `${lastNote.ts}:${lastNote.step}:${lastNote.note}` : '';
    if (lastNote && progressKey !== lastProgressKey) {
      lastProgressKey = progressKey;
      onProgress(lastNote.step || 'agent_progress', lastNote.note || 'Agent reported progress');
    }
    if (Date.now() - lastWaitLogAt > 10000) {
      lastWaitLogAt = Date.now();
      onProgress('waiting_for_artifact', 'Waiting for agent to write edited.html');
    }
    await sleep(1500);
  }

  const agentOutput = parseJsonFromProcessOutput(stdout) || parseJsonFromProcessOutput(stderr) || {};
  const html = await readValidHtmlIfReady(editedHtmlPath);
  if (!html && exitCode == null) child.kill('SIGKILL');
  if (!html && exitCode != null) {
    throw new Error(`Coding agent exited before creating valid edited.html. Exit ${exitCode}. ${stderr.slice(-500) || stdout.slice(-500)}`);
  }
  if (!html) {
    throw new Error(`Coding agent timed out before creating valid edited.html after ${Math.round(timeout / 1000)}s.`);
  }
  if (!html.trimStart().startsWith('<')) {
    throw new Error('Coding agent created edited.html, but it was not valid HTML.');
  }
  return {
    html,
    jobId,
    jobDir,
    agentOutput,
    progressNotes: await readAgentProgressNotes(jobDir),
  };
}

async function saveVisionBookEditedFigure({
  stem,
  html,
  originalHtml = '',
  sourceKey,
  editRequest,
  qmd,
  entry,
  model,
  experiment,
  editContext = {},
  generateThumb = true,
  progressNotes = [],
  editTiming = {},
}) {
  fs.mkdirSync(FIGURE_RESULTS_DIR, { recursive: true });
  const id = safeFigureResultId(stem);
  const thumb = generateThumb ? await screenshotHtml(html, 1200).catch(() => null) : null;
  const completedAtMs = editTiming.completedAtMs || Date.now();
  const startedAtMs = editTiming.startedAtMs || completedAtMs;
  const durationMs = Math.max(0, editTiming.durationMs ?? (completedAtMs - startedAtMs));
  const versionIndex = editVersionIndex(stem, sourceKey);
  const observedChangeSummary = summarizeHtmlChanges(originalHtml, html);
  const record = {
    id,
    filename: `${stem}.html`,
    html,
    timestamp: new Date().toISOString(),
    model,
    experiment,
    parent_source_key: sourceKey,
    edit_prompt: editRequest,
    source_qmd: qmd || null,
    edit_started_at: new Date(startedAtMs).toISOString(),
    edit_completed_at: new Date(completedAtMs).toISOString(),
    edit_duration_ms: durationMs,
    edit_version_index: versionIndex,
    edit_log: {
      requested_change: editRequest,
      engine: experiment,
      parent_source_key: sourceKey,
      source_qmd: qmd || null,
      created_at: new Date().toISOString(),
      started_at: new Date(startedAtMs).toISOString(),
      completed_at: new Date(completedAtMs).toISOString(),
      duration_ms: durationMs,
      version_index: versionIndex,
      observed_change_summary: observedChangeSummary,
      progress_notes: progressNotes,
    },
    edit_context: editContext,
    ...(thumb?.data ? {
      generatedThumbBase64: thumb.data,
      generatedThumbMediaType: thumb.mediaType || 'image/jpeg',
      generatedThumbAt: new Date().toISOString(),
    } : {}),
  };
  const resultPath = path.join(FIGURE_RESULTS_DIR, `${id}.json`);
  await fsp.writeFile(resultPath, JSON.stringify(record, null, 2));

  interactiveFigureIndexCache = null;
  interactiveFigureIndexCacheAt = 0;

  const newSourceKey = `result:${id}`;
  const encodedNew = encodeURIComponent(newSourceKey);
  return {
    record,
    candidate: {
      sourceType: 'edit',
      sourceKey: newSourceKey,
      resultId: id,
      model: record.model,
      experiment: 'edited',
      score: entry?.score ?? null,
      timestamp: record.timestamp,
      durationMs: record.edit_duration_ms,
      versionIndex: record.edit_version_index,
      editSummary: observedChangeSummary,
      preferred: false,
      hasThumb: true,
      thumbUrl: `/api/visionbook/figure-thumb?sourceKey=${encodedNew}`,
      htmlUrl: `/api/visionbook/figure-html?sourceKey=${encodedNew}`,
      edited: true,
      editPrompt: editRequest,
      parentSourceKey: sourceKey,
      originalSourceKey: sourceKey,
    },
  };
}

function pickFigureEntry(matches, selection) {
  if (!matches?.length) return null;
  if (selection?.sourceKey) {
    const selected = matches.find(entry => entry.sourceKey === selection.sourceKey);
    if (selected && !selection.forceOriginal) {
      const seen = new Set([selected.sourceKey]);
      let current = selected.sourceKey;
      while (current) {
        const child = matches.find(entry =>
          /visionbook_(agent_)?edit/.test(entry.experiment || '')
          && entry.parentSourceKey === current
          && !seen.has(entry.sourceKey)
        );
        if (!child) break;
        seen.add(child.sourceKey);
        current = child.sourceKey;
      }
      const latest = matches.find(entry => entry.sourceKey === current);
      if (latest) return latest;
    }
    if (selected) return selected;
  }
  if (selection?.resultId) {
    const selected = matches.find(entry => entry.resultId === selection.resultId);
    if (selected) return selected;
  }
  return matches[0];
}

function augmentVisionBookFigures(bodyHtml, selections = {}) {
  const figureIndex = buildInteractiveFigureIndex();
  return bodyHtml
    .replace(
      /<img\b([^>]*?)\bsrc="(?:\.\/)?(figures\/[^"]+)"([^>]*)>/gi,
      (match, preAttrs, figPath, postAttrs) => {
        const stem = path.basename(figPath, path.extname(figPath));
        const entry = pickFigureEntry((figureIndex[stem] || []).filter(is3DGeneratedEntry), selections[stem]);
        if (!entry) return match;
        const htmlContent = entry.html || (entry.htmlPath ? fs.readFileSync(entry.htmlPath, 'utf8') : '');
        if (!htmlContent) return match;
        const attrs = `${preAttrs || ''} ${postAttrs || ''}`;
        const height = iframeHeightFromAttrs(attrs);
        const src = `data:text/html;charset=utf-8;base64,${Buffer.from(htmlContent).toString('base64')}`;
        return [
          `<iframe class="visionbook-figure-frame" src="${src}"`,
          `style="width:100%;height:${height}px;border:0;display:block;background:transparent;"`,
          `scrolling="no" loading="lazy" allowfullscreen`,
          `data-figure-stem="${stem}" data-figure-score="${entry.score ?? ''}" data-figure-source="${entry.sourceKey}"></iframe>`,
        ].join(' ');
      }
    )
    .replace(/<p>\s*(<iframe class="visionbook-figure-frame"[^>]*><\/iframe>)\s*<\/p>/gs, '$1');
}

function wrapVisionBookHtml(bodyHtml, title) {
  const safeTitle = String(title || 'VisionBook')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<base href="/qmd-assets/">
<title>${safeTitle}</title>
<script>
MathJax = {
  tex: { inlineMath: [['\\\\(','\\\\)'], ['$', '$']], displayMath: [['\\\\[','\\\\]'], ['$$','$$']] },
  options: { skipHtmlTags: ['script','noscript','style','textarea','pre'] }
};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
<style>
:root{--page-bg:#ffffff;--paper:#ffffff;--ink:#231f1a;--muted:#6d6358;--rule:#ded4c5;--accent:#3867b7}
html,body{margin:0;padding:0;background:var(--page-bg);color:var(--ink)}
body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:17px;line-height:1.62}
.book-shell{max-width:880px;margin:0 auto;padding:42px 48px 72px;background:var(--paper);min-height:100vh;box-shadow:0 0 0 1px rgba(80,68,52,.08),0 16px 50px rgba(74,60,38,.10)}
h1,h2,h3,h4{font-family:Georgia,"Times New Roman",serif;color:#17120d;line-height:1.18;margin:1.5em 0 .55em}
h1{font-size:2.15rem;margin-top:.15em;padding-bottom:.4em;border-bottom:1px solid var(--rule)}
h2{font-size:1.55rem;border-bottom:1px solid rgba(222,212,197,.75);padding-bottom:.2em}
h3{font-size:1.2rem}
p{margin:.9em 0}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
img{max-width:100%;height:auto}
figure{margin:1.8em auto;text-align:center}
figcaption{font-size:.86em;color:var(--muted);margin-top:.55em;line-height:1.45}
table{border-collapse:collapse;margin:1.4em auto;max-width:100%;font-size:.95em}
th,td{border:1px solid var(--rule);padding:.45em .65em;vertical-align:top}
th{background:#f0ebe2}
code{font-family:"Fira Mono","SFMono-Regular",Consolas,monospace;font-size:.88em;background:#f1ece4;padding:1px 5px;border-radius:4px}
pre{overflow:auto;background:#f1ece4;border-radius:8px;padding:1em}
pre code{background:transparent;padding:0}
blockquote{border-left:4px solid #d0c2af;margin:1.2em 0;padding:.15em 1em;color:#4e443a;background:#faf6ee}
.column-margin{float:right;clear:right;width:210px;max-width:210px;margin:0 -245px 1.1em 1.6em;font-size:.82em;line-height:1.5;color:#51483f}
.column-margin img{width:100%;height:auto}
[data-layout-ncol],[data-layout-nrow]{display:grid;gap:18px;align-items:start;margin:1.8em 0}
[data-layout-ncol="2"]{grid-template-columns:repeat(2,minmax(0,1fr)) minmax(160px,.9fr)}
[data-layout-ncol="3"]{grid-template-columns:repeat(3,minmax(0,1fr)) minmax(160px,.9fr)}
[data-layout-ncol] > figure,[data-layout-ncol] > p{margin:0;min-width:0}
[data-layout-ncol] img{max-width:100%!important;height:auto}
[data-layout-ncol] .visionbook-figure-frame{height:320px!important}
[data-layout-ncol] figcaption{font-size:.8em}
.visionbook-figure-frame{border:0;background:transparent;box-shadow:none;border-radius:0;overflow:hidden}
@media(max-width:700px){.book-shell{max-width:none;margin:0;padding:28px 26px}.column-margin{float:none;width:auto;max-width:none;margin:1em 0}[data-layout-ncol="2"],[data-layout-ncol="3"]{grid-template-columns:1fr 1fr}[data-layout-ncol] > p:last-child{grid-column:1 / -1}}
</style>
</head>
<body><main class="book-shell">${bodyHtml}</main></body>
</html>`;
}

function renderVisionBookQmd(qmdFile, { augmentFigures = true, selections = {} } = {}) {
  if (!/^[a-z0-9_\-]+\.qmd$/i.test(qmdFile)) throw new Error('bad qmd name');
  const qmdPath = path.resolve(path.join(CONTENT_ROOT, qmdFile));
  if (!qmdPath.startsWith(CONTENT_ROOT) || !fs.existsSync(qmdPath)) throw new Error('QMD file not found');
  const { command, prefixArgs } = resolvePandocInvocation();
  let bodyHtml = execFileSync(command, [
    ...prefixArgs,
    qmdPath,
    '--from=markdown+tex_math_dollars+raw_html',
    '--to=html5',
    '--mathjax',
    '--resource-path', CONTENT_ROOT,
  ], {
    cwd: CONTENT_ROOT,
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  })
    .replace(/\s*\{#(?:eq|fig|tbl|sec|thm|lem|cor|prp|cnj|def|exm|exr|alg|hyp)-[^}]+\}/g, '');
  if (augmentFigures) bodyHtml = augmentVisionBookFigures(bodyHtml, selections);
  return wrapVisionBookHtml(bodyHtml, qmdTitleFromFile(qmdFile));
}

app.get('/api/visionbook/qmds', (_req, res) => {
  try {
    res.json(listVisionBookQmds());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/visionbook/substitutions', (req, res) => {
  try {
    const qmd = String(req.query.qmd || '');
    res.json(getVisionBookSubstitutions(qmd));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/visionbook/figure-html', (req, res) => {
  try {
    const entry = findInteractiveFigureEntry(String(req.query.sourceKey || ''));
    const html = interactiveFigureHtml(entry);
    if (!html) return res.status(404).send('Figure HTML not found');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(injectFigureCaptureBridge(html, {
      disableDirectEdit: String(req.query.preview || '') === '1',
    }));
  } catch (e) {
    res.status(500).send(String(e.message || e));
  }
});

app.get('/api/visionbook/figure-thumb', async (req, res) => {
  try {
    const entry = findInteractiveFigureEntry(String(req.query.sourceKey || ''));
    const thumb = await cachedFigureThumbnail(entry);
    if (!thumb?.data) return res.status(404).send('Thumbnail screenshot failed');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('Content-Type', thumb.mediaType || 'image/jpeg');
    res.send(Buffer.from(thumb.data, 'base64'));
  } catch (e) {
    res.status(500).send(String(e.message || e));
  }
});

app.get('/api/visionbook/edit-logs', (req, res) => {
  try {
    const qmd = String(req.query.qmd || '');
    const stem = String(req.query.stem || '');
    const sourceKey = String(req.query.sourceKey || '');
    const logs = [];
    if (!fs.existsSync(FIGURE_RESULTS_DIR)) return res.json([]);
    for (const file of fs.readdirSync(FIGURE_RESULTS_DIR)) {
      if (!file.endsWith('.json')) continue;
      try {
        const resultPath = path.join(FIGURE_RESULTS_DIR, file);
        const record = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
        if (!record.edit_log && !record.edit_prompt) continue;
        const recordStem = path.basename(record.filename || '', path.extname(record.filename || ''));
        const recordSourceKey = `result:${record.id || path.basename(file, '.json')}`;
        if (qmd && record.source_qmd !== qmd) continue;
        if (stem && recordStem !== stem) continue;
        if (sourceKey && recordSourceKey !== sourceKey && record.parent_source_key !== sourceKey) continue;
        logs.push({
          id: record.id || path.basename(file, '.json'),
          sourceKey: recordSourceKey,
          stem: recordStem,
          filename: record.filename || '',
          model: record.model || '',
          experiment: record.experiment || '',
          timestamp: record.timestamp || '',
          parent_source_key: record.parent_source_key || '',
          source_qmd: record.source_qmd || null,
          edit_log: record.edit_log || {
            requested_change: record.edit_prompt || '',
            engine: record.experiment || '',
            parent_source_key: record.parent_source_key || '',
            source_qmd: record.source_qmd || null,
            created_at: record.timestamp || '',
            observed_change_summary: null,
            progress_notes: [],
          },
        });
      } catch {}
    }
    logs.sort((a, b) => String(b.timestamp || '').localeCompare(String(a.timestamp || '')));
    res.json(logs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/visionbook/figure-lineage', (req, res) => {
  try {
    const requestedSourceKey = String(req.query.sourceKey || '');
    let stem = String(req.query.stem || '');
    if (!requestedSourceKey && !stem) return res.status(400).json({ error: 'sourceKey or stem is required' });

    const records = [];
    if (fs.existsSync(FIGURE_RESULTS_DIR)) {
      for (const file of fs.readdirSync(FIGURE_RESULTS_DIR)) {
        if (!file.endsWith('.json')) continue;
        if (stem && !file.startsWith(`${stem}_edit`) && !file.startsWith(`${stem}_agent`)) continue;
        try {
          const record = JSON.parse(fs.readFileSync(path.join(FIGURE_RESULTS_DIR, file), 'utf8'));
          const recordStem = path.basename(record.filename || '', path.extname(record.filename || ''));
          if (!recordStem || (stem && recordStem !== stem)) continue;
          records.push({ ...record, _sourceKey: `result:${record.id || path.basename(file, '.json')}`, _stem: recordStem });
        } catch {}
      }
    }

    if (!stem && requestedSourceKey) {
      const currentRecord = records.find(record => record._sourceKey === requestedSourceKey) || readFigureResultRecordBySourceKey(requestedSourceKey);
      stem = currentRecord ? path.basename(currentRecord.filename || '', path.extname(currentRecord.filename || '')) : '';
    }

    const stemRecords = records
      .filter(record => !stem || record._stem === stem)
      .sort((a, b) => String(b.timestamp || '').localeCompare(String(a.timestamp || '')));
    const bySource = new Map(stemRecords.map(record => [record._sourceKey, record]));

    let latestSourceKey = requestedSourceKey || stemRecords[0]?._sourceKey || '';
    const seenForward = new Set();
    while (latestSourceKey && !seenForward.has(latestSourceKey)) {
      seenForward.add(latestSourceKey);
      const child = stemRecords.find(record => record.parent_source_key === latestSourceKey);
      if (!child) break;
      latestSourceKey = child._sourceKey;
    }

    const versions = [];
    const seenBack = new Set();
    let current = latestSourceKey;
    while (current && !seenBack.has(current)) {
      seenBack.add(current);
      const record = bySource.get(current) || readFigureResultRecordBySourceKey(current);
      if (!record) {
        const entry = findInteractiveFigureEntry(current);
        if (entry) versions.push({ ...candidateSummary(entry), label: 'Original', durationMs: null, versionIndex: 0 });
        break;
      }
      const recordIsEdit = isVisionBookEditEntry(record);
      versions.push({
        sourceKey: current,
        resultId: record.id || '',
        label: recordIsEdit ? `Edit ${record.edit_version_index || versions.length + 1}` : 'Original',
        model: record.model || '',
        experiment: record.experiment || '',
        timestamp: record.timestamp || '',
        parentSourceKey: record.parent_source_key || '',
        editPrompt: recordIsEdit ? (record.edit_prompt || record.edit_log?.requested_change || '') : '',
        editSummary: recordIsEdit ? (record.edit_log?.observed_change_summary || null) : null,
        durationMs: recordIsEdit ? (record.edit_duration_ms ?? record.edit_log?.duration_ms ?? null) : null,
        versionIndex: recordIsEdit ? (record.edit_version_index ?? record.edit_log?.version_index ?? null) : 0,
        edited: recordIsEdit,
        htmlUrl: `/api/visionbook/figure-html?sourceKey=${encodeURIComponent(current)}`,
        thumbUrl: `/api/visionbook/figure-thumb?sourceKey=${encodeURIComponent(current)}`,
      });
      current = record.parent_source_key;
    }
    versions.reverse();

    const editVersions = versions.filter(version => version.edited);
    res.json({
      stem,
      currentSourceKey: latestSourceKey,
      promptCount: editVersions.length,
      totalDurationMs: editVersions.reduce((sum, version) => sum + (Number(version.durationMs) || 0), 0),
      versions,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/visionbook/edit-figure-agent-start', async (req, res) => {
  try {
    const { qmd, stem, sourceKey, request } = req.body || {};
    const editRequest = String(request || '').trim();
    if (!stem || !sourceKey || !editRequest) {
      return res.status(400).json({ error: 'stem, sourceKey, and request are required' });
    }

    const entry = findInteractiveFigureEntry(String(sourceKey));
    const currentHtml = interactiveFigureHtml(entry);
    if (!currentHtml) return res.status(404).json({ error: 'source figure HTML not found' });
    const attachments = normalizeEditAttachments(req.body?.attachments);

    const originalImage = loadOriginalQmdFigureImage(qmd, stem);
    const currentShot = null;
    const jobId = safeFigureResultId(`${stem}_agent`);
    const startedAt = Date.now();
    activeFigureEditJobs.set(jobId, {
      id: jobId,
      status: 'running',
      stage: 'queued',
      message: 'Queued coding-agent edit',
      startedAt,
      updatedAt: startedAt,
      logs: [{ ts: startedAt, stage: 'queued', message: 'Queued coding-agent edit' }],
    });

    res.json({ jobId, statusUrl: `/api/visionbook/edit-figure-agent-status/${encodeURIComponent(jobId)}` });

    (async () => {
      try {
        const progress = (stage, message) => updateFigureEditJob(jobId, { status: 'running', stage, message });
        progress('starting', 'Starting coding-agent edit');
        const editStartedAtMs = Date.now();
        const agentEdit = await runCursorFigureEditJob({
          stem,
          qmd,
          sourceKey,
          editRequest,
          currentHtml,
          originalImage,
          currentShot,
          attachments,
          jobId,
          onProgress: progress,
        });

        progress('saving', 'Saving edited figure candidate');
        const { candidate } = await saveVisionBookEditedFigure({
          stem,
          html: agentEdit.html,
          originalHtml: currentHtml,
          sourceKey,
          editRequest,
          qmd,
          entry,
          model: `cursor-agent:${process.env.CURSOR_AGENT_MODEL || 'auto'}`,
          experiment: 'visionbook_agent_edit',
          editContext: {
            engine: 'cursor_sdk_agent',
            job_id: agentEdit.jobId,
            job_dir: agentEdit.jobDir,
            agent_output: agentEdit.agentOutput,
            original_image_path: originalImage?.path || null,
            used_original_image: Boolean(originalImage),
            used_current_screenshot: Boolean(currentShot?.data),
            attachments: attachments.map(({ name, mimeType, note, source }) => ({ name, mimeType, note, source })),
          },
          generateThumb: false,
          progressNotes: agentEdit.progressNotes || [],
          editTiming: {
            startedAtMs: editStartedAtMs,
            completedAtMs: Date.now(),
          },
        });

        updateFigureEditJob(jobId, {
          status: 'completed',
          stage: 'complete',
          message: 'Edit complete',
          candidate,
        });
      } catch (e) {
        console.error('[visionbook/edit-figure-agent-start] job error:', e.message);
        updateFigureEditJob(jobId, {
          status: 'error',
          stage: 'error',
          message: 'Edit failed',
          error: e.message || String(e),
        });
      }
    })();
  } catch (e) {
    console.error('[visionbook/edit-figure-agent-start] error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/visionbook/edit-figure-agent-status/:jobId', (req, res) => {
  const job = activeFigureEditJobs.get(String(req.params.jobId || ''));
  if (!job) return res.status(404).json({ error: 'edit job not found' });
  res.json(publicFigureEditJob(job));
});

app.post('/api/visionbook/edit-figure-agent', async (req, res) => {
  try {
    const { qmd, stem, sourceKey, request } = req.body || {};
    const editRequest = String(request || '').trim();
    if (!stem || !sourceKey || !editRequest) {
      return res.status(400).json({ error: 'stem, sourceKey, and request are required' });
    }

    const entry = findInteractiveFigureEntry(String(sourceKey));
    const currentHtml = interactiveFigureHtml(entry);
    if (!currentHtml) return res.status(404).json({ error: 'source figure HTML not found' });
    const attachments = normalizeEditAttachments(req.body?.attachments);

    const originalImage = loadOriginalQmdFigureImage(qmd, stem);
    const currentShot = null;
    const editStartedAtMs = Date.now();
    console.log(`[visionbook/edit-figure-agent] start stem=${stem} source=${sourceKey} originalImage=${!!originalImage} currentShot=${!!currentShot?.data}`);

    const agentEdit = await runCursorFigureEditJob({
      stem,
      qmd,
      sourceKey,
      editRequest,
      currentHtml,
      originalImage,
      currentShot,
      attachments,
    });

    const { candidate } = await saveVisionBookEditedFigure({
      stem,
      html: agentEdit.html,
      originalHtml: currentHtml,
      sourceKey,
      editRequest,
      qmd,
      entry,
      model: `cursor-agent:${process.env.CURSOR_AGENT_MODEL || 'auto'}`,
      experiment: 'visionbook_agent_edit',
      editContext: {
        engine: 'cursor_sdk_agent',
        job_id: agentEdit.jobId,
        job_dir: agentEdit.jobDir,
        agent_output: agentEdit.agentOutput,
        original_image_path: originalImage?.path || null,
        used_original_image: Boolean(originalImage),
        used_current_screenshot: Boolean(currentShot?.data),
        attachments: attachments.map(({ name, mimeType, note, source }) => ({ name, mimeType, note, source })),
      },
      generateThumb: false,
      progressNotes: agentEdit.progressNotes || [],
      editTiming: {
        startedAtMs: editStartedAtMs,
        completedAtMs: Date.now(),
      },
    });

    console.log(`[visionbook/edit-figure-agent] saved stem=${stem} source=${candidate.sourceKey}`);
    res.json({ candidate, engine: 'cursor_sdk_agent', jobId: agentEdit.jobId });
  } catch (e) {
    console.error('[visionbook/edit-figure-agent] error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/visionbook/edit-figure', async (req, res) => {
  try {
    const { qmd, stem, sourceKey, request } = req.body || {};
    const editRequest = String(request || '').trim();
    if (!stem || !sourceKey || !editRequest) {
      return res.status(400).json({ error: 'stem, sourceKey, and request are required' });
    }

    const entry = findInteractiveFigureEntry(String(sourceKey));
    const currentHtml = interactiveFigureHtml(entry);
    if (!currentHtml) return res.status(404).json({ error: 'source figure HTML not found' });
    const attachments = normalizeEditAttachments(req.body?.attachments);

    const originalImage = loadOriginalQmdFigureImage(qmd, stem);
    const currentShot = null;
    const editStartedAtMs = Date.now();

    const system = `You are editing an existing self-contained interactive VisionBook figure HTML document.

Make a targeted code edit according to the user's request.

Rules:
- Return ONLY the complete modified HTML document. No markdown, no explanation, no code fences.
- Preserve the existing interaction model, controls, scripts, imports, labels, and layout unless the request explicitly changes them.
- Do not rewrite from scratch. Make the smallest code changes needed.
- Do not remove existing controls, labels, or annotations.
- If the request concerns viewpoint/camera/crop/zoom, prefer changing camera position, controls target, object scale, or initial zoom rather than changing scientific geometry.
- Use the ORIGINAL QMD IMAGE and CURRENT GENERATED SCREENSHOT when provided to judge visual matching.
- Make the figure clearer and more faithful, but do not change the scientific meaning.
- Keep it self-contained: inline CSS/JS only.
- Prefer precise visual improvements: labels, arrows, spacing, contrast, annotation hierarchy, and explanatory callouts.
- Direct 3D object editing is disabled in this product. Do not add selection handles, gumballs, gizmos, draggable objects, TransformControls, or move/rotate manipulators. If the current figure already has them, remove them and replace any needed adjustment with explicit sliders/buttons.
${qmd ? `QMD chapter: ${qmd}` : ''}
Figure stem: ${stem}`.trim();

    const userContent = [
      ...(originalImage ? [{
        type: 'image',
        source: { type: 'base64', media_type: originalImage.mediaType, data: originalImage.data },
      }, {
        type: 'text',
        text: `Original QMD image for ${stem} (${originalImage.path}). Match its viewpoint/composition when the user asks for visual faithfulness.`,
      }] : []),
      ...(currentShot?.data ? [{
        type: 'image',
        source: { type: 'base64', media_type: currentShot.mediaType, data: currentShot.data },
      }, {
        type: 'text',
        text: 'Current rendered screenshot of the generated interactive HTML before editing.',
      }] : []),
      ...attachments.flatMap((attachment, index) => {
        if (/^image\//i.test(attachment.mimeType)) {
          return [
            {
              type: 'image',
              source: { type: 'base64', media_type: attachment.mimeType, data: attachment.data },
            },
            {
              type: 'text',
              text: `User attachment ${index + 1}: ${attachment.name}${attachment.note ? ` — ${attachment.note}` : ''}`,
            },
          ];
        }
        let textPreview = '';
        try {
          textPreview = Buffer.from(attachment.data, 'base64').toString('utf8').slice(0, 4000);
        } catch {}
        return [{
          type: 'text',
          text: `User attachment ${index + 1}: ${attachment.name} (${attachment.mimeType})${attachment.note ? ` — ${attachment.note}` : ''}\n${textPreview}`,
        }];
      }),
      {
        type: 'text',
        text: `Edit request: ${editRequest}

Current figure HTML:
${currentHtml}`,
      },
    ];

    const editModel = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';
    console.log(`[visionbook/edit-figure] start stem=${stem} source=${sourceKey} originalImage=${!!originalImage} currentShot=${!!currentShot?.data}`);
    const response = await anthropic.messages.create({
      model: editModel,
      max_tokens: 12000,
      system,
      messages: [{ role: 'user', content: userContent }],
    });

    let modelText = response.content[0]?.text || '';
    let html = extractHtmlFromModelText(modelText);
    if (!html.trimStart().startsWith('<')) {
      console.warn('[visionbook/edit-figure] first invalid output preview:', modelText.slice(0, 500));
      const retry = await anthropic.messages.create({
        model: editModel,
        max_tokens: 12000,
        system: 'Extract or rewrite the previous answer as ONLY a complete valid self-contained HTML document. No markdown, no explanation, no code fences.',
        messages: [{ role: 'user', content: `Previous invalid response:\n${modelText}\n\nIf it contains HTML, output only that HTML. If it does not, apply this edit request to the current HTML and output only the full edited HTML.\n\nEdit request: ${editRequest}\n\nCurrent figure HTML:\n${currentHtml}` }],
      });
      modelText = retry.content[0]?.text || '';
      html = extractHtmlFromModelText(modelText);
      if (!html.trimStart().startsWith('<')) {
        console.warn('[visionbook/edit-figure] retry invalid output preview:', modelText.slice(0, 500));
        return res.status(500).json({
          error: 'coding agent did not return valid HTML',
          preview: modelText.slice(0, 500),
        });
      }
    }
    console.log(`[visionbook/edit-figure] valid html stem=${stem} bytes=${html.length}`);

    fs.mkdirSync(FIGURE_RESULTS_DIR, { recursive: true });
    const id = safeFigureResultId(stem);
    const editCompletedAtMs = Date.now();
    const editDurationMs = Math.max(0, editCompletedAtMs - editStartedAtMs);
    const versionIndex = editVersionIndex(stem, sourceKey);
    const observedChangeSummary = summarizeHtmlChanges(currentHtml, html);
    const record = {
      id,
      filename: `${stem}.html`,
      html,
      timestamp: new Date().toISOString(),
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
      experiment: 'visionbook_edit',
      parent_source_key: sourceKey,
      edit_prompt: editRequest,
      source_qmd: qmd || null,
      edit_started_at: new Date(editStartedAtMs).toISOString(),
      edit_completed_at: new Date(editCompletedAtMs).toISOString(),
      edit_duration_ms: editDurationMs,
      edit_version_index: versionIndex,
      edit_log: {
        requested_change: editRequest,
        engine: 'visionbook_edit',
        parent_source_key: sourceKey,
        source_qmd: qmd || null,
        created_at: new Date().toISOString(),
        started_at: new Date(editStartedAtMs).toISOString(),
        completed_at: new Date(editCompletedAtMs).toISOString(),
        duration_ms: editDurationMs,
        version_index: versionIndex,
        observed_change_summary: observedChangeSummary,
        progress_notes: [
          { step: 'api_edit', note: 'Claude API received the current HTML, original figure image when available, and edit request.' },
          { step: 'html_saved', note: 'Backend extracted valid HTML and saved it as a new figure candidate.' },
        ],
      },
      edit_context: {
        original_image_path: originalImage?.path || null,
        used_original_image: Boolean(originalImage),
        used_current_screenshot: Boolean(currentShot?.data),
        attachments: attachments.map(({ name, mimeType, note, source }) => ({ name, mimeType, note, source })),
      },
    };
    const resultPath = path.join(FIGURE_RESULTS_DIR, `${id}.json`);
    await fsp.writeFile(resultPath, JSON.stringify(record, null, 2));

    interactiveFigureIndexCache = null;
    interactiveFigureIndexCacheAt = 0;

    const newSourceKey = `result:${id}`;
    const encodedNew = encodeURIComponent(newSourceKey);
    res.json({
      candidate: {
        sourceType: 'edit',
        sourceKey: newSourceKey,
        resultId: id,
        model: record.model,
        experiment: 'edited',
        score: entry?.score ?? null,
        timestamp: record.timestamp,
        durationMs: record.edit_duration_ms,
        versionIndex: record.edit_version_index,
        editSummary: observedChangeSummary,
        preferred: false,
        hasThumb: true,
        thumbUrl: `/api/visionbook/figure-thumb?sourceKey=${encodedNew}`,
        htmlUrl: `/api/visionbook/figure-html?sourceKey=${encodedNew}`,
        edited: true,
        editPrompt: editRequest,
        parentSourceKey: sourceKey,
        originalSourceKey: sourceKey,
      },
    });
  } catch (e) {
    console.error('[visionbook/edit-figure] error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/visionbook/render', (req, res) => {
  try {
    const qmd = String(req.query.qmd || '');
    const augmentFigures = String(req.query.augment || '1') !== '0';
    const selections = req.query.selections ? JSON.parse(String(req.query.selections)) : {};
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderVisionBookQmd(qmd, { augmentFigures, selections }));
  } catch (e) {
    res.status(500).send(`<pre>VisionBook render error: ${String(e.message || e)}</pre>`);
  }
});

const PDF_SCAN_IGNORES = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.next',
  '.quarto',
  '__pycache__',
]);

function isInside(parent, child) {
  const rel = path.relative(parent, child);
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

async function scanPdfFiles(dir, root = dir, out = []) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.') continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (PDF_SCAN_IGNORES.has(entry.name)) continue;
      await scanPdfFiles(abs, root, out);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
      const rel = path.relative(root, abs);
      out.push({
        name: entry.name,
        path: rel,
        url: `/api/repo-pdfs/file?path=${encodeURIComponent(rel)}`,
      });
    }
  }
  return out;
}

app.get('/api/repo-pdfs', async (_req, res) => {
  try {
    const explicitPdfDir = Boolean(process.env.ACTIVE_READER_PDF_DIR);
    if (!explicitPdfDir && !isInside(CONTENT_ROOT, REPO_PDF_DIR) && REPO_PDF_DIR !== CONTENT_ROOT) {
      return res.status(400).json({ error: 'ACTIVE_READER_PDF_DIR must be inside ACTIVE_READER_CONTENT_ROOT unless explicitly configured' });
    }
    if (!fs.existsSync(REPO_PDF_DIR)) return res.json({ root: REPO_PDF_DIR, files: [] });
    const files = (await scanPdfFiles(REPO_PDF_DIR))
      .sort((a, b) => a.path.localeCompare(b.path));
    res.json({ root: REPO_PDF_DIR, files });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/repo-pdfs/file', (req, res) => {
  const rel = String(req.query.path || '');
  if (!rel || path.isAbsolute(rel) || rel.split(path.sep).includes('..') || !rel.toLowerCase().endsWith('.pdf')) {
    return res.status(400).json({ error: 'bad path' });
  }
  const abs = path.resolve(REPO_PDF_DIR, rel);
  if (!isInside(REPO_PDF_DIR, abs)) return res.status(400).json({ error: 'bad path' });
  if (!fs.existsSync(abs)) return res.status(404).json({ error: 'not found' });
  res.sendFile(abs);
});

app.post('/api/repo-pdfs/open-folder', (_req, res) => {
  if (!fs.existsSync(REPO_PDF_DIR)) fs.mkdirSync(REPO_PDF_DIR, { recursive: true });
  execFile('open', [REPO_PDF_DIR], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ ok: true, root: REPO_PDF_DIR });
  });
});

// Caches — chapter graphs and plan files are static on disk
const _chapterCache = new Map();
const _planCache    = new Map();
let   _figuresIndex = null;

async function loadChapter(n) {
  if (_chapterCache.has(n)) return _chapterCache.get(n);
  const filename = `ch${String(n).padStart(2, '0')}.json`;
  const p = path.join(CHAPTER_GRAPHS_DIR, filename);
  const raw = await fsp.readFile(p, 'utf8');
  const data = JSON.parse(raw);
  _chapterCache.set(n, data);
  return data;
}

function conceptPositionKey(concept) {
  const pos = concept.position || {};
  return [
    pos.book_order ?? Number.MAX_SAFE_INTEGER,
    pos.section_order ?? Number.MAX_SAFE_INTEGER,
    pos.concept_order_in_section ?? Number.MAX_SAFE_INTEGER,
    pos.first_line ?? Number.MAX_SAFE_INTEGER,
    concept.title || concept.id || '',
  ];
}

function orderChapterConcepts(concepts, edges = {}) {
  const ids = new Set(concepts.map(c => c.id).filter(Boolean));
  const byId = new Map(concepts.map(c => [c.id, c]));
  const graph = new Map();
  const indegree = new Map();
  for (const id of ids) {
    graph.set(id, new Set());
    indegree.set(id, 0);
  }
  for (const edge of edges.prereq || []) {
    const dependent = edge.from;
    const prerequisite = edge.to;
    if (!ids.has(dependent) || !ids.has(prerequisite) || dependent === prerequisite) continue;
    if (!graph.get(prerequisite).has(dependent)) {
      graph.get(prerequisite).add(dependent);
      indegree.set(dependent, (indegree.get(dependent) || 0) + 1);
    }
  }

  const cmp = (a, b) => {
    const ak = conceptPositionKey(byId.get(a) || {});
    const bk = conceptPositionKey(byId.get(b) || {});
    for (let i = 0; i < ak.length; i += 1) {
      if (ak[i] < bk[i]) return -1;
      if (ak[i] > bk[i]) return 1;
    }
    return 0;
  };

  let ready = [...ids].filter(id => (indegree.get(id) || 0) === 0).sort(cmp);
  const ordered = [];
  while (ready.length) {
    const id = ready.shift();
    ordered.push(id);
    for (const dep of [...(graph.get(id) || [])].sort(cmp)) {
      indegree.set(dep, indegree.get(dep) - 1);
      if (indegree.get(dep) === 0) ready.push(dep);
    }
    ready.sort(cmp);
  }
  const seen = new Set(ordered);
  const remaining = [...ids].filter(id => !seen.has(id)).sort(cmp);
  return [...ordered, ...remaining];
}

function buildAdaptiveRoadmap(chapter, orderedIds, byId) {
  const nodes = [];
  const edges = [];
  const sections = [];
  const seenSections = new Map();

  const addNode = (node) => nodes.push(node);
  const addEdge = (edge) => edges.push(edge);

  for (const [index, id] of orderedIds.entries()) {
    const c = byId.get(id);
    const pos = c.position || {};
    const sectionId = pos.section || 'chapter';
    const sectionTitle = pos.section_title || pos.chapter_title || 'Chapter';
    if (!seenSections.has(sectionId)) {
      seenSections.set(sectionId, {
        id: `section__${sectionId.replace(/[^a-z0-9]+/gi, '_')}`,
        section: sectionId,
        title: sectionTitle,
        concept_ids: [],
      });
    }
    seenSections.get(sectionId).concept_ids.push(id);

    addNode({
      id,
      type: 'concept',
      title: c.title || id,
      section: sectionId,
      section_title: sectionTitle,
      order: index + 1,
      status_model: ['not_started', 'current', 'practiced', 'mastered', 'needs_review', 'review_due'],
      substates: [
        { id: `${id}::hook`, kind: 'HOOK', source: 'slots.question' },
        { id: `${id}::motivate`, kind: 'MOTIVATE', source: 'motivation_md' },
        { id: `${id}::explain`, kind: 'EXPLAIN', source: 'content' },
        { id: `${id}::visual`, kind: 'VISUAL', source: 'item_ids.figures' },
        { id: `${id}::practice`, kind: 'PRACTICE', source: 'gate' },
        { id: `${id}::recap`, kind: 'RECAP', source: 'recap_md' },
      ],
    });
    addNode({
      id: `gate__${id}`,
      type: 'gate',
      title: 'understanding check',
      parent: id,
      branch_rules: [
        { event: 'correct', to: orderedIds[index + 1] || 'chapter_complete' },
        { event: 'partial', to: `${id}__probe` },
        { event: 'wrong_first', to: `${id}__hint` },
        { event: 'wrong_second', to: `${id}__worked_example` },
        { event: 'stuck', to: `${id}__remediate` },
      ],
    });
    addNode({ id: `${id}__probe`, type: 'probe', title: 'clarifying probe', parent: id });
    addNode({ id: `${id}__hint`, type: 'hint', title: 'targeted hint', parent: id });
    addNode({ id: `${id}__worked_example`, type: 'worked_example', title: 'worked example', parent: id });
    addNode({ id: `${id}__remediate`, type: 'remediation', title: 'remediation mini-lesson', parent: id });
    addNode({ id: `${id}__review`, type: 'review', title: 'spaced review', parent: id });

    addEdge({ from: id, to: `gate__${id}`, event: 'ready_for_check', kind: 'check' });
    addEdge({ from: `gate__${id}`, to: `${id}__probe`, event: 'partial', kind: 'adaptive_branch' });
    addEdge({ from: `gate__${id}`, to: `${id}__hint`, event: 'wrong_first', kind: 'adaptive_branch' });
    addEdge({ from: `gate__${id}`, to: `${id}__worked_example`, event: 'wrong_second', kind: 'adaptive_branch' });
    addEdge({ from: `gate__${id}`, to: `${id}__remediate`, event: 'stuck', kind: 'adaptive_branch' });
    addEdge({ from: `${id}__probe`, to: `gate__${id}`, event: 'retry', kind: 'loop' });
    addEdge({ from: `${id}__hint`, to: `gate__${id}`, event: 'retry', kind: 'loop' });
    addEdge({ from: `${id}__worked_example`, to: `gate__${id}`, event: 'retry', kind: 'loop' });
    addEdge({ from: `${id}__remediate`, to: `gate__${id}`, event: 'retry', kind: 'loop' });
    addEdge({ from: id, to: `${id}__review`, event: 'review_due', kind: 'scheduler_branch' });
    if (orderedIds[index + 1]) {
      addEdge({ from: `gate__${id}`, to: orderedIds[index + 1], event: 'correct', kind: 'advance' });
    }
  }

  for (const edgeGroup of Object.values(chapter.edges || {})) {
    if (!Array.isArray(edgeGroup)) continue;
    for (const edge of edgeGroup) {
      if (!byId.has(edge.from) || !byId.has(edge.to)) continue;
      addEdge({
        from: edge.to,
        to: edge.from,
        event: edge.kind || 'related',
        kind: edge.kind === 'requires' ? 'prerequisite' : 'concept_relation',
        rationale: edge.rationale || '',
        strength: edge.strength ?? null,
      });
    }
  }

  sections.push(...seenSections.values());
  const worldMap = buildChapterWorldMapFSM(chapter, orderedIds, byId, sections);
  return {
    version: 2,
    view: 'chapter_adaptive_roadmap',
    sections,
    nodes,
    edges,
    world_map: worldMap,
    exposed_to_user: {
      default: ['concept', 'gate', 'hint', 'worked_example', 'remediation', 'review'],
      advanced: ['probe', 'prerequisite', 'concept_relation', 'substates'],
    },
  };
}

function buildChapterWorldMapFSM(chapter, orderedIds, byId, sections) {
  const nodes = [];
  const edges = [];
  const addNode = (node) => nodes.push(node);
  const addEdge = (edge) => edges.push(edge);
  const safe = (value) => String(value || 'node').replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();
  const sectionOrder = new Map(sections.map((s, i) => [s.section, i]));
  const conceptsBySection = new Map();

  for (const id of orderedIds) {
    const c = byId.get(id);
    const section = c?.position?.section || 'chapter';
    if (!conceptsBySection.has(section)) conceptsBySection.set(section, []);
    conceptsBySection.get(section).push(id);
  }

  const laneY = [145, 265, 385, 505];
  const startX = 78;
  const sectionGap = 250;
  const coinGap = 86;

  addNode({
    id: 'chapter_start',
    type: 'start',
    title: 'Start Chapter',
    x: startX,
    y: laneY[0],
    state: 'start',
  });

  let prevExit = 'chapter_start';
  const conceptPositions = new Map();

  for (const section of sections) {
    const sectionIdx = sectionOrder.get(section.section) || 0;
    const concepts = conceptsBySection.get(section.section) || [];
    const lane = sectionIdx % laneY.length;
    const direction = sectionIdx % 2 === 0 ? 1 : -1;
    const baseX = startX + 150 + sectionIdx * sectionGap;
    const baseY = laneY[lane];
    const sectionNodeId = `level__${safe(section.section)}`;
    const gateNodeId = `section_gate__${safe(section.section)}`;

    addNode({
      id: sectionNodeId,
      type: 'section_level',
      title: `${section.section} ${section.title || ''}`.trim(),
      section: section.section,
      concept_ids: concepts,
      x: baseX,
      y: baseY,
      state: 'level_card',
    });
    addEdge({
      from: prevExit,
      to: sectionNodeId,
      kind: 'main_path',
      event: 'enter_section',
      route: 'orthogonal',
    });

    let prev = sectionNodeId;
    concepts.forEach((id, idx) => {
      const c = byId.get(id);
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const x = baseX + direction * (110 + col * coinGap);
      const y = baseY + row * 62;
      const coinId = `coin__${id}`;
      conceptPositions.set(id, { x, y, nodeId: coinId, section: section.section });
      addNode({
        id: coinId,
        type: 'concept_checkpoint',
        conceptId: id,
        title: c?.title || id,
        section: section.section,
        order: orderedIds.indexOf(id) + 1,
        x,
        y,
        state: 'concept_coin',
      });
      addEdge({
        from: prev,
        to: coinId,
        kind: 'main_path',
        event: idx === 0 ? 'start_concept' : 'mastered',
        route: 'orthogonal',
      });
      prev = coinId;
    });

    addNode({
      id: gateNodeId,
      type: 'mastery_gate',
      title: `${section.section} mastery gate`,
      section: section.section,
      x: baseX + direction * 390,
      y: baseY,
      state: 'section_gate',
    });
    addEdge({
      from: prev,
      to: gateNodeId,
      kind: 'mastery_check',
      event: 'section_check',
      route: 'orthogonal',
    });
    prevExit = gateNodeId;
  }

  const completeX = startX + 150 + sections.length * sectionGap;
  addNode({
    id: 'chapter_complete',
    type: 'chapter_complete',
    title: 'Chapter Mastery',
    x: completeX,
    y: laneY[(sections.length - 1 + laneY.length) % laneY.length],
    state: 'complete',
  });
  addEdge({
    from: prevExit,
    to: 'chapter_complete',
    kind: 'main_path',
    event: 'chapter_mastered',
    route: 'orthogonal',
  });

  const prereqEdges = [];
  for (const edge of chapter.edges?.prereq || []) {
    if (!byId.has(edge.from) || !byId.has(edge.to)) continue;
    const dependent = conceptPositions.get(edge.from);
    const prereq = conceptPositions.get(edge.to);
    if (!dependent || !prereq) continue;
    const lockId = `lock__${edge.from}__requires__${edge.to}`;
    const helpId = `help__${edge.to}`;
    const helpExists = nodes.some(n => n.id === helpId);

    addNode({
      id: lockId,
      type: 'locked_gate',
      title: 'Prerequisite lock',
      conceptId: edge.from,
      prerequisiteId: edge.to,
      x: dependent.x - 30,
      y: dependent.y - 48,
      state: 'locked_until_prereq',
    });
    if (!helpExists) {
      addNode({
        id: helpId,
        type: 'help_house',
        title: `Review ${byId.get(edge.to)?.title || edge.to}`,
        targetConceptId: edge.to,
        x: prereq.x,
        y: prereq.y + 72,
        state: 'remediation_route',
      });
    }
    addEdge({
      from: lockId,
      to: prereq.nodeId,
      kind: 'prerequisite_lock',
      event: 'requires',
      route: 'orthogonal',
      rationale: edge.rationale || '',
    });
    addEdge({
      from: lockId,
      to: helpId,
      kind: 'help_route',
      event: 'failed_prereq_check',
      route: 'orthogonal',
      rationale: edge.rationale || '',
    });
    addEdge({
      from: helpId,
      to: dependent.nodeId,
      kind: 'return_route',
      event: 'retry_after_review',
      route: 'orthogonal',
    });
    prereqEdges.push({ from: edge.from, to: edge.to });
  }

  return {
    version: 1,
    view: 'chapter_world_map_fsm',
    coordinate_system: {
      x: 'curriculum progression',
      y: 'section lane / remediation branch',
    },
    legend: {
      start: 'start chapter',
      section_level: 'level card / section',
      concept_checkpoint: 'coin / concept checkpoint',
      mastery_gate: 'section checkpoint',
      locked_gate: 'prerequisite lock',
      help_house: 'targeted remediation',
      chapter_complete: 'chapter mastery',
    },
    nodes,
    edges,
    prerequisite_edges: prereqEdges,
  };
}

function compileChapterLessonPlan(chapter) {
  return planLessonFromConceptGraph(chapter, {
    policy: ACTIVE_READER_POLICY,
    learner_context: {},
  });
}

async function listChapters() {
  const out = [];
  const dirents = await fsp.readdir(CHAPTER_GRAPHS_DIR);
  const matches = dirents.filter(f => /^ch\d{2}\.json$/.test(f)).sort();
  // Set of concept ids that have a compiled plan
  let compiledIds = new Set();
  try {
    const planFiles = (await fsp.readdir(PLANS_DIR)).filter(f => f.endsWith('.json'));
    compiledIds = new Set(planFiles.map(f => f.replace(/\.json$/, '')));
  } catch { /* no plans dir yet */ }
  for (const f of matches) {
    const n = parseInt(f.match(/^ch(\d{2})\.json$/)[1], 10);
    try {
      const ch = await loadChapter(n);
      const conceptIds = (ch.concepts || []).map(c => c.id);
      const matched = conceptIds.filter(id => compiledIds.has(id));
      // Title resolution: top-level `chapterTitle`, else first concept's
      // `position.chapter_title`, else just "Ch N". Display as "Ch N. Title".
      const rawTitle = ch.chapterTitle
                    || ch.meta?.title
                    || (ch.concepts?.[0]?.position?.chapter_title)
                    || '';
      // The raw title may already include "Ch N. " — strip it so we can
      // re-emit a consistent format.
      const bareTitle = rawTitle.replace(/^ch\s*\d+\.\s*/i, '').trim();
      const title = bareTitle ? `Ch ${n}. ${bareTitle}` : `Ch ${n}`;
      out.push({
        chapter: n,
        slug: `ch${String(n).padStart(2, '0')}`,
        title,
        concept_count: conceptIds.length,
        has_plans: matched.length > 0,
        compiled_concepts: matched.length,
      });
    } catch (e) {
      console.warn(`[lessons] failed to load ${f}:`, e.message);
    }
  }
  return out;
}

async function loadFiguresIndex() {
  if (_figuresIndex) return _figuresIndex;
  try {
    const index = JSON.parse(await fsp.readFile(FIGURES_INDEX_FILE, 'utf8'));
    _figuresIndex = await enrichFiguresWithFigureResults(enrichFiguresWithLatestExperiments(index));
  } catch (e) {
    console.warn('[lessons] figures_index.json missing:', e.message);
    _figuresIndex = { figures: [], by_concept: {} };
  }
  return _figuresIndex;
}

function stemVariants(stem) {
  const variants = new Set([stem]);
  variants.add(stem.replace(/_2$/, '2'));
  variants.add(stem.replace(/2$/, '_2'));
  return [...variants];
}

let _figureResultsByStem = null;
async function loadFigureResultIndex() {
  if (_figureResultsByStem) return _figureResultsByStem;
  const byStem = new Map();
  if (!fs.existsSync(FIGURE_RESULTS_DIR)) {
    _figureResultsByStem = byStem;
    return byStem;
  }

  const files = (await fsp.readdir(FIGURE_RESULTS_DIR)).filter(f => f.endsWith('.json'));
  for (const file of files) {
    try {
      const p = path.join(FIGURE_RESULTS_DIR, file);
      const data = JSON.parse(await fsp.readFile(p, 'utf8'));
      if (!data?.html || !data?.filename) continue;
      const stem = String(data.filename).replace(/\.[^.]+$/, '');
      const id = String(data.id || file.replace(/\.json$/, ''));
      const ts = Date.parse(data.timestamp || '') || 0;
      const renderingMode = data.plan?.renderingMode || data.plan?.type || data.type || null;
      const entry = {
        id,
        filename: data.filename,
        timestamp: ts,
        url: `/api/figure-results/${encodeURIComponent(id)}/html`,
        renderingMode,
        experiment: data.experiment || null,
        model: data.model || null,
      };
      for (const variant of stemVariants(stem)) {
        const existing = byStem.get(variant);
        if (!existing || entry.timestamp >= existing.timestamp) byStem.set(variant, entry);
      }
    } catch (e) {
      console.warn('[lessons] failed to index figure result:', file, e.message);
    }
  }
  _figureResultsByStem = byStem;
  return byStem;
}

function enrichFiguresWithLatestExperiments(index) {
  if (!fs.existsSync(PROMPT_EXPERIMENTS_DIR) || !Array.isArray(index.figures)) return index;
  const chapter = index.chapter_slug || index.chapter_label || 'imaging';
  const preferredExperimentOrder = ['04_limit_qmd', '03_with_qmd', '02_with_reqs', '01_one_line'];
  const preferredModelOrder = ['gpt-5.3-codex', 'gpt-5.1-codex', 'gpt-4o', 'claude-opus-4.6-with-base-code', 'gemini-3.1-pro'];

  const findLatest = (stem) => {
    for (const exp of preferredExperimentOrder) {
      for (const model of preferredModelOrder) {
        for (const variant of stemVariants(stem)) {
          const p = path.join(PROMPT_EXPERIMENTS_DIR, exp, model, chapter, `${variant}.html`);
          if (fs.existsSync(p)) {
            const rel = path.relative(REPO_ROOT, p).split(path.sep).join('/');
            return `/qmd-assets/${rel}`;
          }
        }
      }
    }
    return null;
  };

  return {
    ...index,
    figures: index.figures.map(fig => {
      const stem = String(fig.filename || '').replace(/\.[^.]+$/, '');
      const latest = stem ? findLatest(stem) : null;
      return latest ? { ...fig, latest_interactive_html_url: latest } : fig;
    }),
  };
}

async function enrichFiguresWithFigureResults(index) {
  if (!Array.isArray(index.figures)) return index;
  const resultsByStem = await loadFigureResultIndex();
  return {
    ...index,
    figures: index.figures.map(fig => {
      const stem = String(fig.filename || '').replace(/\.[^.]+$/, '');
      const latest = stem ? resultsByStem.get(stem) : null;
      if (!latest) return fig;
      const preferInlineAugResult = String(latest.experiment || '').startsWith('inline_aug_');
      return {
        ...fig,
        interactive_html: fig.interactive_html || `figure-results/${latest.id}.html`,
        latest_interactive_html_url: preferInlineAugResult ? latest.url : (fig.latest_interactive_html_url || latest.url),
        latest_result_html_url: latest.url,
        latest_result_id: latest.id,
        latest_result_experiment: latest.experiment,
        latest_result_model: latest.model,
        interactive_kind: latest.renderingMode || (String(fig.category || '').includes('3d') ? '3d' : '2d'),
      };
    }),
  };
}

app.get('/api/lessons/chapters', async (_req, res) => {
  try { res.json(await listChapters()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/lessons/chapter/:n', async (req, res) => {
  const n = parseInt(req.params.n, 10);
  if (!Number.isFinite(n)) return res.status(400).json({ error: 'bad chapter' });
  try {
    const ch = await loadChapter(n);
    const figuresIndex = await loadFiguresIndex();
    const figByConcept = figuresIndex.by_concept || {};

    let planIds = new Set();
    try {
      const planFiles = (await fsp.readdir(PLANS_DIR)).filter(f => f.endsWith('.json'));
      planIds = new Set(planFiles.map(f => f.replace(/\.json$/, '')));
    } catch {}

    const concepts = (ch.concepts || [])
      .filter(c => c && c.id)
      .map(c => ({
        id: c.id,
        title: c.title,
        kind: c.kind,
        one_liner: c.one_liner || '',
        content: c.content || '',
        key_passage: c.key_passage || c.slots?.key_passage || null,
        example: c.example || null,
        plan_file: planIds.has(c.id) ? `lesson_plans/${c.id}.json` : null,
        has_compiled_plan: planIds.has(c.id),
        position: c.position || {},
        section: c.position?.section || null,
        figure_count: (figByConcept[c.id] || []).length,
      }));
    const rawTitle = ch.chapterTitle
                  || ch.meta?.title
                  || (ch.concepts?.[0]?.position?.chapter_title)
                  || '';
    const bareTitle = rawTitle.replace(/^ch\s*\d+\.\s*/i, '').trim();
    res.json({
      chapter: n,
      chapter_title: bareTitle ? `Ch ${n}. ${bareTitle}` : `Ch ${n}`,
      concept_count: concepts.length,
      figures_index_size: (figuresIndex.figures || []).length,
      concepts,
      lesson_plan: compileChapterLessonPlan(ch),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/lessons/plan/:conceptId', async (req, res) => {
  const id = req.params.conceptId;
  if (!/^[a-z0-9_]+$/i.test(id)) return res.status(400).json({ error: 'bad id' });
  if (_planCache.has(id)) return res.json(_planCache.get(id));
  try {
    const p = path.join(PLANS_DIR, `${id}.json`);
    const raw = await fsp.readFile(p, 'utf8');
    const plan = JSON.parse(raw);
    _planCache.set(id, plan);
    res.json(plan);
  } catch (e) {
    res.status(404).json({ error: `plan not found: ${id}` });
  }
});

app.get('/api/lessons/figures', async (_req, res) => {
  try { res.json(await loadFiguresIndex()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/figure-results/:id/html', async (req, res) => {
  try {
    const id = String(req.params.id || '');
    if (!/^[a-z0-9_\-]+$/i.test(id)) return res.status(400).send('bad id');
    const p = path.join(FIGURE_RESULTS_DIR, `${id}.json`);
    if (!isInside(FIGURE_RESULTS_DIR, p) || !fs.existsSync(p)) return res.status(404).send('not found');
    const data = JSON.parse(await fsp.readFile(p, 'utf8'));
    if (!data?.html) return res.status(404).send('html not found');
    res.type('html').send(data.html);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// ── Student model: event-sourced JSONL on disk, aggregated on read ───
function safeUserFile(userId) {
  const safe = String(userId || 'anon').replace(/[^a-z0-9_\-]/gi, '_').slice(0, 60) || 'anon';
  return path.join(STUDENT_MODEL_DIR, `${safe}.jsonl`);
}

app.post('/api/lessons/event', async (req, res) => {
  try {
    const { user_id, concept_id, event, payload } = req.body || {};
    if (!event) return res.status(400).json({ error: 'event required' });
    const row = { ts: new Date().toISOString(), user_id: user_id || 'anon',
                  concept_id: concept_id || null, event, payload: payload || null };
    await fsp.appendFile(safeUserFile(user_id), JSON.stringify(row) + '\n');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/lessons/student-model', async (req, res) => {
  try {
    const userId = req.query.user_id || 'anon';
    const fp = safeUserFile(userId);
    if (!fs.existsSync(fp)) return res.json({ user_id: userId, per_concept: {}, events: 0 });
    const raw = await fsp.readFile(fp, 'utf8');
    const rows = raw.split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    const per = {};
    for (const r of rows) {
      const id = r.concept_id || '_';
      const slot = per[id] = per[id] || {
        attempts: 0, passes: 0, fails: 0, hints: 0, interrupts: 0,
        last_event: null, completed: false,
      };
      if (r.event === 'lesson_started')   slot.attempts++;
      if (r.event === 'gate_pass')        slot.passes++;
      if (r.event === 'gate_fail')        slot.fails++;
      if (r.event === 'hint_shown')       slot.hints++;
      if (r.event === 'lesson_complete')  slot.completed = true;
      if (r.event === 'interrupt')        slot.interrupts++;
      slot.last_event = r.event;
    }
    res.json({ user_id: userId, per_concept: per, events: rows.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Interrupt answer: LLM grounded in the active concept ─────────────
app.post('/api/lessons/answer-question', async (req, res) => {
  try {
    const { question, concept, state, history } = req.body || {};
    if (!question) return res.status(400).json({ error: 'question required' });

    const groundingBits = [];
    if (concept?.title)        groundingBits.push(`Concept: ${concept.title}`);
    if (concept?.one_liner)    groundingBits.push(`One-liner: ${concept.one_liner}`);
    if (concept?.content)      groundingBits.push(`Content:\n${concept.content.slice(0, 1500)}`);
    if (concept?.key_passage)  groundingBits.push(`Key passage: "${concept.key_passage.quote || ''}" (§${concept.key_passage.section || '?'})`);
    if (state?.kind)           groundingBits.push(`Student is currently in lesson state: ${state.kind}`);
    const grounding = groundingBits.join('\n\n');

    const systemPrompt = `You are a focused tutor answering a student's clarifying question DURING a structured lesson. Your reply should:
- Stay tightly grounded in the concept currently being taught (do not drift)
- Be short (≤4 sentences) so the lesson can resume quickly
- Use plain language; one concrete example if it helps
- Do NOT include any markdown code blocks unless absolutely necessary

${grounding}`.trim();

    const recent = Array.isArray(history) ? history.slice(-6) : [];
    const userBody = `Student question: ${question}`;
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 400,
      system: systemPrompt,
      messages: [...recent.map(h => ({ role: h.role, content: h.content })), { role: 'user', content: userBody }],
    });
    const reply = response.content[0]?.text?.trim() || '(no reply)';
    res.json({ reply });
  } catch (e) {
    console.error('[answer-question] error:', e.message);
    res.status(500).json({ error: e.message, reply: 'Sorry — I had trouble answering that. Try rephrasing?' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Lesson plans dir: ${PLANS_DIR}`);
  console.log(`Lesson assets dir: ${ASSETS_DIR}`);
});
