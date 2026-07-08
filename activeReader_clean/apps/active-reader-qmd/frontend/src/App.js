import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import 'katex/dist/katex.min.css';
import './App.css';
import tutorAvatar from './tutor-avatar.png';
import tutorAvatar2 from './tutor-avatar-2.png'; // reserved for future use
import { detectChapter } from './lessonHelpers';
import { LessonRuntime } from './lessonRuntime';
import { ConceptStateMachine } from './conceptStateMachine';
import { LearnerStateMachine, LEARNER_STATES } from './learnerStateMachine';
import { LearnerModel } from './learnerModel';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const BACKEND = process.env.REACT_APP_ACTIVE_READER_BACKEND || 'http://localhost:3003';
const FIGURE_BACKEND = process.env.REACT_APP_FIGURE_BACKEND || 'http://localhost:3004';
const PREFER_PREGENERATED_AUGMENTATION = false;

const PREGENERATED_OVERLAY_LAYOUTS = {};

function qmdTitleFromFile(filename = '') {
  const stem = String(filename).replace(/\.qmd$/i, '');
  if (!stem) return 'VisionBook';
  return stem
    .replace(/^part_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, ch => ch.toUpperCase());
}

function chapterPreviewRenderUrl(qmdFile, figureSelections = {}) {
  if (!qmdFile) return '';
  const params = new URLSearchParams({ qmd: qmdFile });
  if (Object.keys(figureSelections).length) {
    params.set('selections', JSON.stringify(figureSelections));
  }
  return `${BACKEND}/api/visionbook/render?${params.toString()}`;
}

function qmdAssetUrl(path) {
  return `${BACKEND}/qmd-assets/${String(path || '').replace(/^\.?\//, '')}`;
}

function backendUrl(path) {
  if (!path) return '';
  return String(path).startsWith('http') ? path : `${BACKEND}${path}`;
}

function chapterNumberFromQmd(qmdFile = '') {
  const qmdToChapter = {
    'simplesystem.qmd': 2,
    'representing_the_image.qmd': 3,
    'fairness.qmd': 4,
    'imaging.qmd': 5,
    'lenses.qmd': 6,
    'camera_as_linsys.qmd': 7,
    'color.qmd': 8,
  };
  return qmdToChapter[qmdFile] || null;
}

function qmdFigureSelectionsKey(qmdFile = '') {
  return `visionbook:figureSelections:${qmdFile || 'default'}`;
}

function loadQmdFigureSelections(qmdFile) {
  if (!qmdFile) return {};
  try {
    const saved = JSON.parse(localStorage.getItem(qmdFigureSelectionsKey(qmdFile)) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function saveQmdFigureSelections(qmdFile, selections) {
  if (!qmdFile) return;
  try {
    const entries = Object.entries(selections || {});
    if (!entries.length) localStorage.removeItem(qmdFigureSelectionsKey(qmdFile));
    else localStorage.setItem(qmdFigureSelectionsKey(qmdFile), JSON.stringify(selections));
  } catch {}
}

// ── Viz renderer ─────────────────────────────────────────
const BG = '#1e1e1e';
const BG_INJECT = `<style>html,body{background:${BG}!important;margin:0}</style>`;

// ── CSS injected into every figure iframe on load ─────────
// Overrides popup/tooltip styles from cached old-generation figures
const FIGURE_OVERRIDE_CSS = `
#pop,#popup,.popup,.info-panel,.node-info,.detail-panel,
[id*="popup"],[id*="pop"],[class*="popup"],[class*="panel"],[class*="info"] {
  background:rgba(0,0,0,0.50)!important;
  color:#fff!important;font-size:11px!important;line-height:1.5!important;
  padding:8px 12px!important;max-height:26%!important;
  border:1px solid rgba(255,255,255,0.1)!important;
  border-radius:9px!important;box-shadow:0 4px 16px rgba(0,0,0,0.15)!important;
  backdrop-filter:blur(14px)!important;-webkit-backdrop-filter:blur(14px)!important;
}
#tt,.tooltip,[id*="tooltip"],[class*="tooltip"] {
  background:rgba(0,0,0,0.55)!important;color:#fff!important;
  font-size:11px!important;white-space:nowrap!important;
  padding:3px 8px!important;border-radius:4px!important;
  border:none!important;max-width:160px!important;
  box-shadow:0 2px 6px rgba(0,0,0,0.25)!important;
}
`;

function injectFigureOverrides(iframeEl, overlayId, pdfScale) {
  try {
    const doc = iframeEl?.contentDocument;
    if (!doc?.head) return;
    if (doc.getElementById('_alex_overrides')) return; // already injected
    const s = doc.createElement('style');
    s.id = '_alex_overrides';
    s.textContent = FIGURE_OVERRIDE_CSS;
    // For equation iframes: normalize font size to match current PDF zoom
    if (iframeEl.title?.startsWith('equation-') && pdfScale) {
      const px = (10 * pdfScale).toFixed(1);
      s.textContent += `\nbody{font-size:${px}px!important;line-height:1.5!important;padding:4px 6px!important}td{padding:0 3px!important}`;
    }
    doc.head.appendChild(s);
    // Inject overlay-ID tracker so parent keeps hoveredOverlayIdRef correct even when
    // mouse is inside the iframe (React onMouseLeave fires on the wrapper div when entering iframes).
    if (overlayId) {
      const enterScript = doc.createElement('script');
      enterScript.textContent = `(function(){
  var entered=false,id=${JSON.stringify(overlayId)};
  document.addEventListener('mouseover',function(){
    if(!entered){entered=true;window.parent.postMessage({type:'alex-iframe-enter',overlayId:id},'*');}
  });
  document.addEventListener('mouseleave',function(){
    entered=false;window.parent.postMessage({type:'alex-iframe-leave',overlayId:id},'*');
  });
})();`;
      doc.head.insertBefore(enterScript, doc.head.firstChild);
    }
    // Intercept inline popups in cached figures → forward via postMessage, then hide
    const script = doc.createElement('script');
    script.textContent = `
      var _popSel = '#pop,#popup,.popup,.info-panel,[id*="popup"],[class*="popup"],[id*="panel"],[class*="panel"]';
      function _isPopEl(el) {
        if (!el || el.nodeType !== 1) return false;
        var id = (el.id||'').toLowerCase(), cls = (el.className||'').toLowerCase();
        return id.includes('pop')||id.includes('panel')||id.includes('info')||
               cls.includes('pop')||cls.includes('panel')||cls.includes('info');
      }
      function _forwardAndHide(el) {
        var cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        var titleEl = el.querySelector('strong,b,h3,h4,[id*="title"],[id*="name"]');
        var title = titleEl ? titleEl.textContent.trim() : '';
        var body = el.textContent.trim().replace(title,'').replace(/press esc.*?close/gi,'').replace(/×/g,'').trim();
        if (title || body) window.parent.postMessage({type:'alex-popup',title:title||'Info',body:body},'*');
        el.style.setProperty('display','none','important');
      }
      // On load: silently hide any visible popup elements without forwarding them.
      // Only forward when the user triggers a visibility change (MutationObserver below).
      setTimeout(function() {
        document.querySelectorAll(_popSel).forEach(function(el) {
          var cs = window.getComputedStyle(el);
          if (cs.display !== 'none' && cs.visibility !== 'hidden') {
            el.style.setProperty('display','none','important');
          }
          new MutationObserver(function() { _forwardAndHide(el); })
            .observe(el, {attributes:true, attributeFilter:['style','class']});
        });
        // Intercept #tt tooltip (cached equations) → forward as alex-tooltip to parent
        var ttEl = document.getElementById('tt');
        if (ttEl) {
          var _lastMX = 0, _lastMY = 0;
          document.addEventListener('mousemove', function(ev) { _lastMX=ev.clientX; _lastMY=ev.clientY; });
          new MutationObserver(function() {
            var cs = window.getComputedStyle(ttEl);
            if (cs.display !== 'none' && cs.visibility !== 'hidden') {
              var text = ttEl.textContent.trim();
              if (text) window.parent.postMessage({type:'alex-tooltip', text:text, mx:_lastMX, my:_lastMY}, '*');
              ttEl.style.setProperty('display','none','important');
            } else {
              window.parent.postMessage({type:'alex-tooltip', text:null}, '*');
            }
          }).observe(ttEl, {attributes:true, attributeFilter:['style']});
        }
      }, 80);
      // Watch for dynamically created popup elements
      new MutationObserver(function(muts) {
        muts.forEach(function(m) {
          m.addedNodes.forEach(function(n) {
            if (_isPopEl(n)) _forwardAndHide(n);
            else if (n.querySelectorAll) n.querySelectorAll(_popSel).forEach(_forwardAndHide);
          });
        });
      }).observe(document.body||document.documentElement, {childList:true, subtree:true});
    `;
    doc.body?.appendChild(script);
  } catch {}
}

function injectBg(html) {
  if (html.includes('</head>')) return html.replace('</head>', BG_INJECT + '</head>');
  if (html.includes('<body')) return html.replace(/(<body[^>]*>)/, '$1' + BG_INJECT);
  return BG_INJECT + html;
}

function figureInlineHtmlUrl(figure) {
  const interactiveHtml = String(figure?.interactive_html || '');
  const latestExperiment = String(figure?.latest_result_experiment || '');

  if (figure?.latest_interactive_html_url && latestExperiment.startsWith('inline_aug_')) {
    return `${BACKEND}${figure.latest_interactive_html_url}`;
  }

  // For inline PDF replacement, prefer curated inline assets over the newest
  // generic FigureLLM experiment result. Explicit inline_aug_* result-cache
  // experiments are preferred above; otherwise the latest result cache is still
  // useful as a fallback for figures that do not have an inline-ready asset yet.
  if (interactiveHtml && !interactiveHtml.startsWith('figure-results/')) {
    return `${BACKEND}/lesson-assets/${interactiveHtml.replace(/^assets\//, '')}`;
  }

  if (figure?.latest_interactive_html_url) {
    return `${BACKEND}${figure.latest_interactive_html_url}`;
  }

  const resultMatch = interactiveHtml.match(/^figure-results\/(.+)\.html$/);
  if (resultMatch) {
    return `${BACKEND}/api/figure-results/${encodeURIComponent(resultMatch[1])}/html`;
  }

  return null;
}

function figureInlineHtmlSource(figure) {
  const interactiveHtml = String(figure?.interactive_html || '');
  const latestExperiment = String(figure?.latest_result_experiment || '');
  if (figure?.latest_interactive_html_url && latestExperiment.startsWith('inline_aug_')) return 'inline-aug-result-cache';
  if (interactiveHtml && !interactiveHtml.startsWith('figure-results/')) return 'curated-inline-asset';
  if (figure?.latest_interactive_html_url || interactiveHtml.startsWith('figure-results/')) return 'figure-result-cache';
  return 'unknown';
}


function inlineFigureHtml(html) {
  let normalized = html
    .replace(/--bg\s*:\s*#[0-9a-fA-F]{6}\s*;/g, '--bg: #ffffff;')
    .replace(/scene\.background\s*=\s*new THREE\.Color\((?:0x[0-9a-fA-F]{6}|['"][^'"]+['"])\)\s*;/g, 'scene.background = new THREE.Color(0xffffff);')
    .replace(/renderer\.setClearColor\((?:0x[0-9a-fA-F]{6}|['"][^'"]+['"])([^)]*)\)\s*;/g, 'renderer.setClearColor(0xffffff$1);');
  const css = `<style id="_alex_inline_figure">
html,body{margin:0!important;padding:0!important;width:100%!important;height:100%!important;overflow:hidden!important;background:#fff!important}
body{position:relative!important}
/* Keep parameter controls visible, but remove the distracting filled panel. */
#ui,.ui,.controls,.control-panel{display:flex!important;position:absolute!important;left:6px!important;bottom:6px!important;top:auto!important;right:auto!important;max-width:190px!important;max-height:34%!important;overflow:visible!important;flex-direction:column!important;gap:2px!important;padding:0!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;font:10px/1.2 system-ui,sans-serif!important;color:#222!important;opacity:.88!important;z-index:30!important;transform:none!important;transition:opacity .16s ease!important}
#ui:hover,#ui:focus-within,.ui:hover,.ui:focus-within,.controls:hover,.controls:focus-within,.control-panel:hover,.control-panel:focus-within{opacity:1!important}
#ui h1,#ui h2,#ui h3,#guide,#readout,.guide,.readout,.description,.narration,.legend,#legend,.buttons,#btnReset,.toolbar,.stepper,.demo,.steps,.caption,.instructions,[class*="legend"],[class*="narration"],[class*="description"],[class*="instruction"],[class*="toolbar"],[class*="step"]{display:none!important;visibility:hidden!important;pointer-events:none!important}
#ui .row,.ui .row,.controls .row,.control-panel .row{display:flex!important;align-items:center!important;gap:4px!important;margin:1px 0!important;font-size:10px!important;background:transparent!important}
#ui label,.ui label,.controls label,.control-panel label{font-size:10px!important;line-height:1.1!important;white-space:nowrap!important;background:transparent!important;text-shadow:0 1px 2px #fff,0 0 3px #fff!important}
#ui input[type=range],.ui input[type=range],.controls input[type=range],.control-panel input[type=range]{width:76px!important;accent-color:#4a7ef5!important}
#ui input[type=checkbox],.ui input[type=checkbox],.controls input[type=checkbox],.control-panel input[type=checkbox]{width:12px!important;height:12px!important}
#ui select,.ui select,.controls select,.control-panel select{max-width:90px!important;font-size:10px!important;background:transparent!important}
#ui button,.ui button,.controls button,.control-panel button{display:none!important}
canvas,svg,#app,#root{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important}
canvas,svg{display:block!important;object-fit:contain!important;background:#fff!important}
svg{overflow:visible!important}
.lbl,.label,[class*="label"]{font-size:12px!important;line-height:1!important}
</style>`;
  const script = `<script id="_alex_inline_figure_runtime">
(function(){
  function compactInlineFigure(){
    document.documentElement.style.background = '#fff';
    if (document.body) document.body.style.background = '#fff';
    document.querySelectorAll('svg').forEach(function(svg){
      if (!svg.getAttribute('preserveAspectRatio')) {
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      }
      svg.style.width = '100%';
      svg.style.height = '100%';
    });
    document.querySelectorAll('canvas').forEach(function(canvas){
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      canvas.style.background = '#fff';
    });
    var panels = document.querySelectorAll('#ui,.ui,.controls,.control-panel');
    panels.forEach(function(panel){
      panel.querySelectorAll('button').forEach(function(button){ button.style.setProperty('display','none','important'); });
      panel.querySelectorAll('h1,h2,h3,h4,p,.legend,.description,.narration,.instructions,.toolbar,.steps,.step,.demo').forEach(function(el){
        el.style.setProperty('display','none','important');
      });
      var controls = Array.from(panel.querySelectorAll('input,select')).filter(function(el) {
        return el.type !== 'hidden';
      });
      controls.slice(2).forEach(function(el) {
        var row = el.closest('label,.row,div') || el;
        row.style.setProperty('display','none','important');
      });
      var visibleControls = controls.slice(0, 2);
      if (!visibleControls.length) {
        panel.style.setProperty('display','none','important');
      } else {
        panel.style.setProperty('display','flex','important');
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', compactInlineFigure);
  } else {
    compactInlineFigure();
  }
  setTimeout(compactInlineFigure, 80);
  setTimeout(compactInlineFigure, 400);
})();
</script>`;
  if (normalized.includes('</head>')) normalized = normalized.replace('</head>', css + '</head>');
  else normalized = css + normalized;
  if (normalized.includes('</body>')) return normalized.replace('</body>', script + '</body>');
  return normalized + script;
}

// ── MCQ detection ─────────────────────────────────────────
function cleanChatText(text = '') {
  let cleaned = String(text)
    .replace(/&amp;nbsp;/gi, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ');
  if (typeof document !== 'undefined' && /&[a-zA-Z#0-9]+;/.test(cleaned)) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = cleaned;
    cleaned = textarea.value;
  }
  return cleaned.replace(/[ \t]{2,}/g, ' ').trim();
}

function MarkdownText({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {cleanChatText(children)}
    </ReactMarkdown>
  );
}

function parseMcq(text) {
  const matches = [...text.matchAll(/\b([A-D])\)\s+/g)];
  if (matches.length < 2) return null;
  const stem = cleanChatText(text.slice(0, matches[0].index));
  if (!stem) return null;
  const options = matches.map((m, i) => {
    const start = m.index + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    return { letter: m[1], content: cleanChatText(text.slice(start, end)) };
  });
  return { stem, options };
}

function MessageContent({ content, onChoice, selectedChoice = null }) {
  content = cleanChatText(content).replace(/—/g, ' - ');
  const [chosen, setChosen] = useState(selectedChoice);

  useEffect(() => {
    if (selectedChoice) setChosen(selectedChoice);
  }, [selectedChoice]);

  // Render as interactive MCQ if the message looks like a multiple-choice question
  const mcq = onChoice ? parseMcq(content) : null;
  if (mcq) {
    return (
      <div className="mcq">
        <div className="md"><MarkdownText>{mcq.stem}</MarkdownText></div>
        <div className="mcq-options">
          {mcq.options.map(opt => (
            <button
              key={opt.letter}
              className={`mcq-btn${chosen === opt.letter ? ' chosen' : ''}`}
              disabled={chosen !== null}
              onClick={() => { setChosen(opt.letter); onChoice(`${opt.letter}) ${opt.content}`); }}
            >
              <span className="mcq-letter">{opt.letter}</span>
              <span className="mcq-option-content"><MarkdownText>{opt.content}</MarkdownText></span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const parts = [];
  const regex = /```html\r?\n([\s\S]*?)```/g;
  let last = 0, match;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > last) parts.push({ type: 'md', content: content.slice(last, match.index) });
    parts.push({ type: 'html', content: match[1] });
    last = match.index + match[0].length;
  }
  if (last < content.length) parts.push({ type: 'md', content: content.slice(last) });

  // If there's any HTML visualization, show only the iframes — skip surrounding markdown
  const hasHtml = parts.some(p => p.type === 'html');

  return (
    <>
      {parts.map((part, i) =>
        part.type === 'html'
          ? <div key={i} className="viz-frame-wrap"><iframe className="viz-frame" srcDoc={injectBg(part.content)} sandbox="allow-scripts allow-same-origin" title="visualization" /></div>
          : hasHtml ? null
          : <div key={i} className="md"><MarkdownText>{part.content}</MarkdownText></div>
      )}
    </>
  );
}

// ── Parse / strip [HIGHLIGHT:"..."] tags from tutor replies ──
const HIGHLIGHT_RE = /\[HIGHLIGHT:\s*["“]([^"”]{3,400})["”]\]/gi;
const ANY_HIGHLIGHT_TAG_RE = /\[HIGHLIGHT:[^\]]*\]/gi;
const BROKEN_HIGHLIGHT_TAG_RE = /\[HIGHLIGHT:[^\n]*(?:\]|$)/gi;
function parseHighlights(text) {
  const out = [];
  let m;
  HIGHLIGHT_RE.lastIndex = 0;
  while ((m = HIGHLIGHT_RE.exec(text)) !== null) out.push(m[1]);
  return out;
}
function stripHighlights(text) {
  HIGHLIGHT_RE.lastIndex = 0;
  ANY_HIGHLIGHT_TAG_RE.lastIndex = 0;
  BROKEN_HIGHLIGHT_TAG_RE.lastIndex = 0;
  return text
    .replace(HIGHLIGHT_RE, '')
    .replace(ANY_HIGHLIGHT_TAG_RE, '')
    .replace(BROKEN_HIGHLIGHT_TAG_RE, '')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ── Parse / strip [GOTO:N] cross-page navigation tags ────
const GOTO_RE = /\[GOTO:(\d+)\]/;
function parseGoto(text) {
  const m = GOTO_RE.exec(text);
  return m ? parseInt(m[1], 10) : null;
}
function stripGoto(text) {
  return text.replace(GOTO_RE, '').replace(/\n{3,}/g, '\n\n').trim();
}

// ── Extract section text at a scroll fraction ────────────
function getSectionAtFraction(text, fraction) {
  if (!text) return '';
  const pos = Math.floor(fraction * text.length);
  const raw = text.slice(Math.max(0, pos - 50), Math.min(text.length, pos + 400));
  const dot = raw.indexOf('. ');
  return (dot > 0 && dot < 80) ? raw.slice(dot + 2) : raw;
}

// ── Flatten PDF outline into p.N: Title lines for tutor ──
function flattenOutline(items, depth = 0, out = []) {
  items.forEach(item => {
    if (item.pageNum) out.push(`p.${item.pageNum}: ${'  '.repeat(depth)}${item.title}`);
    if (item.items?.length) flattenOutline(item.items, depth + 1, out);
  });
  return out;
}

// ── Flatten all outline page numbers ─────────────────────
function collectPageNums(items, out = []) {
  items.forEach(item => {
    if (item.pageNum != null) out.push(item.pageNum);
    if (item.items?.length) collectPageNums(item.items, out);
  });
  return out;
}

// Returns the highest pageNum across ALL outline items that is ≤ currentPage
function getActivePageNum(outline, currentPage) {
  const all = collectPageNums(outline);
  const candidates = all.filter(p => p <= currentPage);
  return candidates.length ? Math.max(...candidates) : null;
}

function outlineTitleNeedle(title) {
  return normalizePdfMatchText(String(title || '').replace(/^\s*\d+(\.\d+)*\s+/, ''));
}

function collectOutlineEntries(items, prefix = '', depth = 0, out = []) {
  items.forEach((item, index) => {
    const key = prefix ? `${prefix}.${index}` : String(index);
    if (item.pageNum != null) out.push({ item, key, depth, pageNum: item.pageNum });
    if (item.items?.length) collectOutlineEntries(item.items, key, depth + 1, out);
  });
  return out;
}

function getActiveOutlineKey(items, currentPage, focusText = '') {
  const entries = collectOutlineEntries(items);
  const currentPageEntries = entries.filter(entry => entry.pageNum === currentPage);
  const focus = normalizePdfMatchText(focusText);
  if (focus) {
    const focused = currentPageEntries
      .filter(entry => {
        const needle = outlineTitleNeedle(entry.item.title);
        return needle.length >= 4 && focus.includes(needle);
      })
      .sort((a, b) => b.depth - a.depth || a.key.localeCompare(b.key))[0];
    if (focused) return focused;
  }

  const candidates = entries.filter(entry => entry.pageNum <= currentPage);
  if (!candidates.length) return null;
  const maxPage = Math.max(...candidates.map(entry => entry.pageNum));
  return candidates
    .filter(entry => entry.pageNum === maxPage)
    .sort((a, b) => a.depth - b.depth || a.key.localeCompare(b.key))[0];
}

function filterOutlineToDocument(items, numPages) {
  return items
    .map(item => {
      const pageInDoc = item.pageNum != null && item.pageNum >= 1 && item.pageNum <= numPages;
      const children = item.items?.length ? filterOutlineToDocument(item.items, numPages) : [];
      if (!pageInDoc && children.length === 0) return null;
      return { ...item, pageNum: pageInDoc ? item.pageNum : null, items: children };
    })
    .filter(Boolean);
}

async function readJsonResponse(res, fallbackMessage) {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  if (!contentType.includes('application/json')) {
    const snippet = text.trim().replace(/\s+/g, ' ').slice(0, 140);
    if (/Cannot\s+(POST|GET)\s+\/api\/(plan-2d|generate-2d-async|generate-status)/i.test(snippet)) {
      throw new Error(`${fallbackMessage}: figure backend is not running on ${FIGURE_BACKEND}. Start the FiguresLLM backend, then try again.`);
    }
    throw new Error(`${fallbackMessage}: expected JSON but received ${contentType || 'unknown content type'}${snippet ? ` (${snippet})` : ''}`);
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`${fallbackMessage}: invalid JSON response (${err.message})`);
  }
}

function normalizePdfMatchText(value) {
  return String(value || '')
    .replace(/\u00ad/g, '')
    .replace(/-\s+/g, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSpanTextIndex(spans) {
  let text = '';
  const entries = [];
  spans.forEach(span => {
    const normalized = normalizePdfMatchText(span.textContent);
    if (!normalized) return;
    if (text) text += ' ';
    const start = text.length;
    text += normalized;
    entries.push({ span, start, end: text.length });
  });
  return { text, entries };
}

function findPdfTextRange(pageText, phrase) {
  const target = normalizePdfMatchText(phrase);
  if (target.length < 3) return null;

  const exact = pageText.indexOf(target);
  if (exact >= 0) return { start: exact, end: exact + target.length };

  const candidates = [];
  if (target.length >= 48) {
    for (let len = Math.min(220, target.length); len >= 48; len -= 24) {
      candidates.push(target.slice(0, len).trim());
    }
    target
      .split(/(?<=[.!?])\s+/)
      .filter(sentence => sentence.length >= 48)
      .slice(0, 3)
      .forEach(sentence => candidates.push(sentence));
  }

  for (const candidate of candidates) {
    const idx = pageText.indexOf(candidate);
    if (idx >= 0) return { start: idx, end: idx + candidate.length };
  }
  return null;
}

function spansOverlappingRange(entries, range) {
  if (!range) return [];
  return entries
    .filter(entry => entry.end > range.start && entry.start < range.end)
    .map(entry => entry.span);
}

function learnerFacingQuestion(text) {
  return String(text || '')
    .replace(/^Can the learner explain\b/i, 'Can you explain')
    .replace(/\bthe learner\b/gi, 'you')
    .replace(/\btheir own words\b/gi, 'your own words');
}

function conciseConceptLabel(value) {
  return String(value || 'this idea')
    .replace(/\s+/g, ' ')
    .trim();
}

function isGenericExplainQuestion(text) {
  return /^Can you explain\b/i.test(String(text || ''))
    || /\bin your own words\??$/i.test(String(text || ''));
}

function buildDynamicGateQuestion(gate, promptIndex = 0) {
  const payload = gate?.payload || {};
  const original = learnerFacingQuestion(payload.question || 'What is the key idea here?');
  if (parseMcq(original) || !isGenericExplainQuestion(original)) return original;

  const titleText = conciseConceptLabel(payload.title || payload.concept_id);
  const oneLiner = conciseConceptLabel(payload.one_liner || payload.summary || '');
  const sectionText = conciseConceptLabel(payload.position?.section_title || payload.position?.section || '');
  const passageText = conciseConceptLabel(payload.key_passage?.quote || '');
  const contextHint = oneLiner || passageText || sectionText;
  const contextClause = contextHint ? ` Use the current text as evidence: "${contextHint.slice(0, 140)}"` : '';
  const templates = [
    `Imagine you are rendering a scene and **${titleText}** changes. What visible effect would you expect, and why?`,
    `A classmate mixes up **${titleText}** with a nearby idea. What example from this section would you use to separate them?${contextClause}`,
    `Suppose the author removed **${titleText}** from this explanation. What part of the image-formation story would become harder to explain?`,
    `In this section, what is **${titleText}** controlling or connecting? Answer with one concrete scenario, not a definition.`,
    `If you had to debug an image that looks wrong, how could **${titleText}** help you reason about the problem?`,
  ];
  return templates[promptIndex % templates.length];
}

async function imageFingerprintFromUrl(url) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.decoding = 'async';
  img.src = url;
  await img.decode();
  return imageFingerprint(img);
}

async function imageMetricsFromUrl(url) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.decoding = 'async';
  img.src = url;
  await img.decode();
  return {
    fingerprint: imageFingerprint(img),
    aspect: img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : null,
  };
}

function imageFingerprint(source) {
  const size = 24;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(source, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const gray = [];
  for (let i = 0; i < data.length; i += 4) {
    gray.push((data[i] + data[i + 1] + data[i + 2]) / 3);
  }
  const mean = gray.reduce((sum, v) => sum + v, 0) / gray.length;
  return gray.map(v => v > mean ? 1 : 0);
}

function fingerprintDistance(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) return Infinity;
  let diff = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
  return diff / a.length;
}

function figureContextScore(figure, contextText) {
  const stem = String(figure.filename || '').replace(/\.[^.]+$/, '').toLowerCase();
  const ctx = String(contextText || '').toLowerCase();
  if (!stem || !ctx) return 0;
  if (/^(figure|fig|image|img)[_\-\s]?\d+[a-z]?$/.test(stem)) return 0;
  const normalizedStem = stem
    .replace(/[_-]+/g, ' ')
    .replace(/\b([a-z]+)\d+\b/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  const tokens = normalizedStem.split(/\W+/).filter(Boolean);
  let score = 0;
  if (ctx.includes(stem)) score += 4;
  if (ctx.includes(stem.replace(/[_-]+/g, ' '))) score += 4;
  if (normalizedStem && ctx.includes(normalizedStem)) score += 5;
  for (const token of tokens) {
    if (token.length >= 4 && ctx.includes(token)) score += 1;
  }
  const rationale = String(figure.classification_rationale || '').toLowerCase();
  for (const token of tokens) {
    if (token.length >= 4 && rationale.includes(token) && ctx.includes(token)) score += 0.5;
  }
  return score;
}

// ── Annotation persistence ────────────────────────────────
function annKey(title) { return `annotations:${title}`; }

function loadAnnotations(title) {
  if (!title) return [];
  try { return JSON.parse(localStorage.getItem(annKey(title)) || '[]'); } catch { return []; }
}

function saveAnnotations(title, anns) {
  if (!title) return;
  try { localStorage.setItem(annKey(title), JSON.stringify(anns)); } catch {}
}

function makeAnnId() { return 'ann_' + Math.random().toString(36).slice(2, 9); }

// ── Chapter mastery — localStorage persistence ────────────
function masteryKey(title) { return `mastery:${title}`; }

function loadMastery(title) {
  if (!title) return { chapters: {} };
  try { return JSON.parse(localStorage.getItem(masteryKey(title)) || '{"chapters":{}}'); }
  catch { return { chapters: {} }; }
}

function saveMastery(title, data) {
  if (!title) return;
  try { localStorage.setItem(masteryKey(title), JSON.stringify(data)); } catch {}
}

// ── Learner runtime session — event stream persistence ─────
function learnerSessionKey(title) { return `learner_session:${title || 'untitled'}`; }

function createLearnerSession(title) {
  const now = Date.now();
  return {
    version: 1,
    sessionId: `session_${now}`,
    title: title || '',
    startedAt: now,
    updatedAt: now,
    currentLessonNode: null,
    currentLearnerState: 'idle',
    currentConceptMachine: null,
    currentPage: 1,
    visitedNodes: [],
    masteredNodes: [],
    totalReadingMs: 0,
    totalAnswerLatencyMs: 0,
    pageTimeMs: {},
    conceptTimeMs: {},
    events: [],
  };
}

function loadLearnerSession(title) {
  if (!title) return createLearnerSession(title);
  try {
    const saved = JSON.parse(localStorage.getItem(learnerSessionKey(title)) || 'null');
    return saved?.events ? saved : createLearnerSession(title);
  } catch {
    return createLearnerSession(title);
  }
}

function saveLearnerSession(title, session) {
  if (!title || !session) return;
  try { localStorage.setItem(learnerSessionKey(title), JSON.stringify(session)); } catch {}
}

function eventLabel(event) {
  return String(event || '')
    .replace(/^lesson_/, '')
    .replace(/^tutor_/, '')
    .replace(/_/g, ' ');
}

function formatDuration(ms) {
  if (!ms || ms < 1000) return '0s';
  const total = Math.round(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return minutes ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function learnerStepLabel(mode, conceptState) {
  if (['answering', 'prompted'].includes(mode)) return 'Answering check';
  if (mode === 'retrying') return 'Retrying answer';
  if (mode === 'stuck') return 'Stuck on check';
  if (mode === 'hinted') return 'Hint given';
  if (mode === 'evaluating') return 'Checking answer';
  if (['remediating', 'needs_support', 'reviewing'].includes(mode) || conceptState === 'support') return 'Reviewing support';
  if (['advancing', 'correct', 'resolved'].includes(mode)) return 'Answer accepted';
  if (mode === 'completed') return 'Chapter complete';
  return 'Reading';
}

function conceptStatusLabel(state, activeSubstate) {
  const substate = activeSubstate ? `: ${eventLabel(activeSubstate)}` : '';
  switch (state) {
    case 'active': return `Inside concept${substate}`;
    case 'gate': return 'At mastery gate';
    case 'support': return 'Support loop';
    case 'mastered': return 'Mastered';
    case 'available': return 'Ready';
    case 'locked': return 'Locked';
    default: return 'Not started';
  }
}

function tutorStatusLabel(mode, conceptMachine) {
  if (mode === 'evaluating') return 'Checking answer';
  if (['answering', 'prompted', 'retrying'].includes(mode) || conceptMachine?.activeGateId) return 'Waiting for learner';
  if (['remediating', 'needs_support', 'reviewing', 'stuck', 'hinted'].includes(mode) || conceptMachine?.state === 'support') return 'Giving support';
  if (mode === 'advancing') return 'Advancing lesson';
  return 'Guiding reading';
}

const LEARNER_IDLE_MS = 120000; // 2 min of no activity in `reading` -> idle

const LEARNER_EVENT_LABELS = {
  lesson_started: 'Started guided reading',
  page_reading_elapsed: 'Page reading time',
  concept_reading_elapsed: 'Concept reading time',
  lesson_state_enter: 'Entered concept',
  lesson_prompted: 'Tutor asked',
  quiz_prompted: 'Mastery check opened',
  user_message_sent: 'Learner answered',
  answer_submitted: 'Answer submitted',
  answer_scored: 'Answer scored',
  opening_question_answered: 'Opening question answered',
  gate_resolved: 'Gate result',
  support_branch_entered: 'Support path opened',
  remediation_started: 'Support hint started',
  remediation_hint_shown: 'Hint shown',
  remediation_reask: 'Follow-up asked',
  support_surfaced: 'Support surfaced',
  idle_timeout: 'Went idle (inactive)',
  lesson_completed: 'Chapter complete',
  page_changed: 'Page changed',
  concept_focus_changed: 'Reading focus moved',
};

function learnerTimelineLabel(eventName) {
  return LEARNER_EVENT_LABELS[eventName] || eventLabel(eventName);
}

function learnerEventIsVisible(event) {
  return Boolean(LEARNER_EVENT_LABELS[event?.event]);
}

// Summarises gaps for backend prompt injection (max ~500 chars)
function buildLearnerHistory(title) {
  const mastery = loadMastery(title);
  const session = loadLearnerSession(title);
  const entries = Object.entries(mastery.chapters || {});
  const gapLines = entries
    .filter(([, ch]) => ch.wrong > 0 || (ch.gaps || []).some(g => !g.resolved))
    .map(([pg, ch]) => {
      const openGaps = (ch.gaps || []).filter(g => !g.resolved).map(g => g.gap);
      return `p.${pg}: wrong=${ch.wrong}, gaps: ${openGaps.length ? openGaps.join('; ') : 'none'}`;
    });
  const eventLines = (session.events || []).slice(-8).map(e =>
    `${eventLabel(e.event)}${e.conceptTitle ? ` on ${e.conceptTitle}` : ''}${e.to ? ` -> ${e.to}` : ''}`,
  );
  return [...gapLines, ...eventLines].join('\n');
}

// ── Outline sidebar item ──────────────────────────────────
function OutlineItem({ item, activeKey, itemKey, onNavigate, depth = 0 }) {
  const [open, setOpen] = useState(depth === 0);
  const active = false && itemKey === activeKey;
  const hasKids = item.items?.length > 0;
  return (
    <div>
      <div
        className={`outline-item${active ? ' active' : ''}`}
        style={{ paddingLeft: `${8 + depth * 10}px` }}
        onClick={() => {
          if (item.pageNum) onNavigate(item.pageNum);
          if (hasKids) setOpen(o => !o);
        }}
      >
        <span className="outline-arrow">{hasKids ? (open ? '▾' : '▸') : ''}</span>
        <span className="outline-title">{item.title}</span>
      </div>
      {hasKids && open && item.items.map((child, i) => (
        <OutlineItem
          key={i}
          item={child}
          activeKey={activeKey}
          itemKey={`${itemKey}.${i}`}
          onNavigate={onNavigate}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

function createRoadmapProgress() {
  return {
    currentStateId: null,
    activeGateId: null,
    visited: {},
    gateResults: {},
    branchEdges: {},
    phase: 'idle',
  };
}

function RoadmapView({ plan, progress, selectedId, onSelect, currentPage, learnerSession, conceptMachineSnapshot, learnerModelSnapshot = {} }) {
  const roadmap = plan?.roadmap;
  const [roadmapScope, setRoadmapScope] = useState('concept');
  if (!roadmap) {
    return (
      <div className="roadmap-empty">
        <h2>Adaptive Roadmap</h2>
        <p>This chapter has not exposed a roadmap yet.</p>
      </div>
    );
  }

  const nodes = roadmap.nodes || [];
  const edges = roadmap.edges || [];
  const worldMap = roadmap.world_map || null;
  const worldNodes = worldMap?.nodes || [];
  const worldEdges = worldMap?.edges || [];
  const conceptNodes = nodes.filter(n => n.type === 'concept');
  const nodeById = Object.fromEntries([...nodes, ...worldNodes].map(n => [n.id, n]));
  const selected = nodeById[selectedId] || conceptNodes[0] || null;
  const visited = progress.visited || {};
  const gateResults = progress.gateResults || {};
  const conceptMachine = conceptMachineSnapshot || learnerSession?.currentConceptMachine || null;
  const currentStateNode = nodeById[progress.currentStateId] || null;
  const currentRuntimeConceptId = currentStateNode?.type === 'concept'
    ? currentStateNode.id
    : currentStateNode?.payload?.concept_id || null;
  const activeGateConceptId = progress.activeGateId?.startsWith('gate__')
    ? progress.activeGateId.replace(/^gate__/, '')
    : nodeById[progress.activeGateId]?.payload?.concept_id || null;

  const statusFor = (conceptId) => {
    const conceptState = nodeById[conceptId];
    const runtimeConceptId = conceptMachine?.conceptId;
    const runtimeState = conceptMachine?.state;
    if (activeGateConceptId === conceptId) return 'gate-open';
    if (currentRuntimeConceptId === conceptId) return 'current';
    if (!currentRuntimeConceptId && runtimeConceptId === conceptId && ['active', 'gate'].includes(runtimeState)) {
      return runtimeState === 'gate' ? 'gate-open' : 'current';
    }
    if (runtimeConceptId === conceptId && runtimeState === 'support') return 'support';
    if (
      (runtimeConceptId === conceptId && runtimeState === 'mastered')
      || gateResults[`gate__${conceptId}`] === 'pass'
    ) return 'mastered';
    if (visited[conceptId]) return 'visited';
    if (conceptState?.payload?.concept_id && visited[conceptState.payload.concept_id]) return 'visited';
    return 'not-started';
  };

  const knowledgeFor = (conceptId) => (conceptId ? learnerModelSnapshot?.[conceptId] : null) || null;
  const knowledgeClassFor = (conceptId) => {
    const m = knowledgeFor(conceptId);
    return m && m.knowledge && m.knowledge !== 'untouched' ? `km-${m.knowledge}` : '';
  };

  const relationEdges = edges.filter(e => ['prerequisite', 'concept_relation'].includes(e.kind));
  const selectedConceptId = selected?.type === 'concept'
    ? selected.id
    : selected?.parent || (selected?.id?.startsWith('gate__') ? selected.id.replace(/^gate__/, '') : conceptNodes[0]?.id);
  const selectedConcept = nodeById[selectedConceptId] || conceptNodes[0] || null;
  const selectedConceptIndex = conceptNodes.findIndex(n => n.id === selectedConcept?.id);
  const nextConcept = selectedConceptIndex >= 0 ? conceptNodes[selectedConceptIndex + 1] : null;
  const selectedEdges = selected
    ? [...edges, ...worldEdges].filter(e => e.from === selected.id || e.to === selected.id || e.from === `gate__${selectedConceptId}`)
    : [];
  const selectedRelations = selectedConcept
    ? relationEdges.filter(e => e.from === selectedConcept.id || e.to === selectedConcept.id)
    : [];
  const selectedGateId = selectedConcept ? `gate__${selectedConcept.id}` : null;
  const selectedGateResult = selectedGateId ? gateResults[selectedGateId] : null;
  const activeStatus = statusFor(selectedConcept?.id);
  const selectedMachineState = conceptMachine?.conceptId === selectedConcept?.id
    ? conceptMachine.state
    : activeStatus;
  const fsmHasEntered = ['active', 'gate', 'mastered', 'support', 'current', 'gate-open', 'visited'].includes(selectedMachineState);
  const fsmAtGateOrBeyond = ['gate', 'mastered', 'support'].includes(selectedMachineState);
  const fsmLockedOrBeyond = selectedMachineState === 'locked' || selectedMachineState === 'available' || fsmHasEntered;
  const fsmReadyOrBeyond = selectedMachineState === 'available' || fsmHasEntered;
  const fsmActiveOrBeyond = selectedMachineState === 'active' || fsmAtGateOrBeyond;
  const lockedStateClass = selectedMachineState === 'locked' ? 'current' : fsmReadyOrBeyond ? 'visited' : '';
  const readyStateClass = selectedMachineState === 'available' ? 'current' : fsmActiveOrBeyond ? 'visited' : '';
  const activeStateClass = selectedMachineState === 'active'
    ? 'current'
    : ['gate', 'mastered', 'support'].includes(selectedMachineState) ? 'visited' : activeStatus;
  const gateStateClass = selectedMachineState === 'gate'
    ? 'current'
    : selectedMachineState === 'mastered'
      ? 'pass'
      : selectedMachineState === 'support'
        ? 'fail'
        : '';
  const masteredStateClass = selectedMachineState === 'mastered' || selectedGateResult === 'pass' ? 'pass' : '';
  const supportStateClass = selectedMachineState === 'support' || selectedGateResult === 'fail' ? 'current' : '';
  const fsmStateLabel = selectedMachineState === 'gate-open' ? 'gate' : selectedMachineState || 'not started';
  const selectedActiveSubstates = conceptMachine?.conceptId === selectedConcept?.id
    ? conceptMachine.activeSubstates || []
    : [];
  const substateStatus = name => selectedActiveSubstates.find(step => step.name === name) || {};
  const substateClass = (name) => {
    const status = substateStatus(name);
    if (status.current && ['active', 'gate', 'support'].includes(selectedMachineState)) return 'current';
    if (status.reached) return 'visited';
    return '';
  };
  const evidenceStatus = progress.activeGateId === selectedGateId
    ? 'current'
    : selectedGateResult === 'pass'
      ? 'pass'
      : selectedGateResult === 'fail'
        ? 'fail'
        : '';
  const simpleWorldTypes = new Set(['start', 'section_level', 'concept_checkpoint', 'mastery_gate', 'chapter_complete']);
  const simpleWorldNodes = worldNodes.filter(n => simpleWorldTypes.has(n.type));
  const simpleWorldNodeById = Object.fromEntries(simpleWorldNodes.map(n => [n.id, n]));
  const simpleWorldEdges = worldEdges.filter(e => (
    ['main_path', 'mastery_check'].includes(e.kind)
    && simpleWorldNodeById[e.from]
    && simpleWorldNodeById[e.to]
  ));
  const mapXs = simpleWorldNodes.map(n => n.x || 0);
  const mapYs = simpleWorldNodes.map(n => n.y || 0);
  const worldStepX = worldMap?.layout?.step_x || 88;
  const worldStepY = worldMap?.layout?.step_y || 74;
  const worldPadX = worldStepX * 0.52;
  const worldPadY = worldStepY * 0.5;
  const worldMinX = Math.min(...mapXs) - worldPadX;
  const worldMinY = Math.min(...mapYs) - worldPadY;
  const worldMaxX = Math.max(...mapXs) + worldPadX;
  const worldMaxY = Math.max(...mapYs) + worldPadY;
  const worldWidth = worldMaxX - worldMinX;
  const worldHeight = worldMaxY - worldMinY;
  const worldScaleDown = 1.11;
  const worldCenterX = (worldMinX + worldMaxX) / 2;
  const worldCenterY = (worldMinY + worldMaxY) / 2;
  const worldScaledWidth = worldWidth * worldScaleDown;
  const worldScaledHeight = worldHeight * worldScaleDown;
  const worldViewMinX = worldCenterX - worldScaledWidth / 2;
  const worldViewMinY = worldCenterY - worldScaledHeight / 2;
  const worldViewMaxX = worldCenterX + worldScaledWidth / 2;
  const worldViewMaxY = worldCenterY + worldScaledHeight / 2;
  const worldViewBox = `${worldViewMinX} ${worldViewMinY} ${worldScaledWidth} ${worldScaledHeight}`;
  const gridOriginX = worldMap?.layout?.origin_x || 92;
  const gridOriginY = worldMap?.layout?.origin_y || 128;
  const worldGridVerticals = Array.from(
    { length: Math.ceil((worldViewMaxX - worldViewMinX) / worldStepX) + 1 },
    (_, i) => gridOriginX + (Math.floor((worldViewMinX - gridOriginX) / worldStepX) + i) * worldStepX,
  ).filter(x => x >= worldViewMinX && x <= worldViewMaxX);
  const worldGridHorizontals = Array.from(
    { length: Math.ceil((worldViewMaxY - worldViewMinY) / worldStepY) + 1 },
    (_, i) => gridOriginY + (Math.floor((worldViewMinY - gridOriginY) / worldStepY) + i) * worldStepY,
  ).filter(y => y >= worldViewMinY && y <= worldViewMaxY);
  const worldNodeStatus = (node) => {
    if (node.type === 'concept_checkpoint') return statusFor(node.conceptId);
    if (node.type === 'section_level') {
      const ids = node.concept_ids || [];
      const statuses = ids.map(id => statusFor(id));
      if (statuses.some(s => ['current', 'gate-open', 'support'].includes(s))) return 'current';
      if (statuses.some(s => s === 'mastered' || s === 'visited')) return 'visited';
    }
    if (node.type === 'mastery_gate') {
      const linkedConceptIds = [
        node.conceptId,
        node.concept_id,
        node.targetConceptId,
        ...(node.concept_ids || []),
      ].filter(Boolean);
      const linkedGateIds = [
        node.id,
        node.gateId,
        ...linkedConceptIds.map(id => `gate__${id}`),
      ].filter(Boolean);
      if (linkedGateIds.some(id => progress.activeGateId === id)) return 'gate-open';
      if (linkedGateIds.some(id => gateResults[id] === 'pass')) return 'mastered';
      if (linkedGateIds.some(id => gateResults[id] === 'fail')) return 'support';
    }
    if (node.type === 'chapter_complete' && progress.phase === 'done') return 'visited';
    return 'not-started';
  };
  const selectWorldNode = (node) => {
    if (node.conceptId) return onSelect(node.conceptId);
    if (node.targetConceptId) return onSelect(node.targetConceptId);
    if (node.prerequisiteId) return onSelect(node.prerequisiteId);
    return onSelect(node.id);
  };
  const worldPathFor = (edge) => {
    const a = simpleWorldNodeById[edge.from];
    const b = simpleWorldNodeById[edge.to];
    if (!a || !b) return '';
    const ax = a.x || 0;
    const ay = a.y || 0;
    const bx = b.x || 0;
    const by = b.y || 0;
    const midX = Math.round((ax + bx) / 2);
    return `M ${ax} ${ay} L ${midX} ${ay} L ${midX} ${by} L ${bx} ${by}`;
  };
  const splitSvgTitle = (value, maxLine = 17) => {
    const words = String(value || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (next.length > maxLine && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
      if (lines.length === 2) break;
    }
    if (line && lines.length < 2) lines.push(line);
    if (!lines.length) lines.push('');
    if (words.join(' ').length > lines.join(' ').length && lines.length) {
      const last = lines[lines.length - 1];
      lines[lines.length - 1] = last.length > maxLine - 3
        ? `${last.slice(0, maxLine - 3)}...`
        : `${last}...`;
    }
    return lines.slice(0, 2);
  };
  const learnerMode = learnerSession?.currentLearnerState || 'idle';
  const recentLearnerEvents = (learnerSession?.events || [])
    .filter(learnerEventIsVisible)
    .slice(-7)
    .reverse();
  const conceptState = conceptMachine?.state || 'not-started';
  const supportTitle = conceptMachine?.supportTargets?.length ? conceptMachine.supportTargets[0].title : 'None';
  const currentConceptTitle = conceptMachine?.conceptTitle
    || nodeById[progress.currentStateId]?.title
    || learnerSession?.currentConceptTitle
    || progress.currentStateId
    || 'not started';
  const reviewedCount = new Set((learnerSession?.events || [])
    .map(e => e.lessonNode)
    .filter(Boolean)).size;
  const supportCount = (learnerSession?.events || [])
    .filter(e => ['remediating', 'hinted', 'reviewing'].includes(e.to) || /remediation|hint|wrong|gap/.test(e.event || ''))
    .length;
  const learnerStep = learnerStepLabel(learnerMode, conceptState);
  const tutorStatus = tutorStatusLabel(learnerMode, conceptMachine);
  const conceptStatus = conceptStatusLabel(conceptState, conceptMachine?.activeSubstate);
  const currentConceptModel = knowledgeFor(conceptMachine?.conceptId)
    || knowledgeFor(selectedConcept?.id);
  const currentConceptIdForTime = conceptMachine?.conceptId || selectedConcept?.id;
  const currentConceptTimeMs = currentConceptIdForTime
    ? (learnerSession?.conceptTimeMs?.[currentConceptIdForTime] || 0)
    : 0;
  const currentPageTimeMs = learnerSession?.pageTimeMs?.[currentPage] || 0;
  const answerEventsWithLatency = (learnerSession?.events || []).filter(e => e.answerLatencyMs);
  const avgAnswerLatencyMs = answerEventsWithLatency.length
    ? answerEventsWithLatency.reduce((sum, e) => sum + (e.answerLatencyMs || 0), 0) / answerEventsWithLatency.length
    : 0;
  const chapterTitle = plan?.meta?.title || plan?.chapterTitle || roadmap.title || 'Chapter';

  return (
    <div className="roadmap-shell">
      <div className="roadmap-header">
        <div>
          <div className="roadmap-chapter-name">{chapterTitle}</div>
          <div className="roadmap-subtitle">
            {conceptNodes.length} concepts · {nodes.filter(n => n.type === 'gate').length} gates · {relationEdges.length} concept relations
          </div>
        </div>
        <div className="roadmap-state-pill">
          <span className={`roadmap-dot ${progress.phase || 'idle'}`} />
          {progress.phase || 'idle'}
        </div>
      </div>

      <div className="roadmap-body">
        <div className="roadmap-scroll">
          <div className="roadmap-clean">
            <section className="chapter-rail">
              <div className="roadmap-panel-title">Chapter Path</div>
              {conceptNodes.map((concept, index) => {
                const status = statusFor(concept.id);
                const km = knowledgeFor(concept.id);
                return (
                  <button
                    key={concept.id}
                    className={`rail-node ${status} ${knowledgeClassFor(concept.id)} ${selectedConcept?.id === concept.id ? 'selected' : ''}`}
                    onClick={() => onSelect(concept.id)}
                  >
                    <span>{index + 1}</span>
                    <strong>{concept.title}</strong>
                    <em>{km ? `${km.knowledgeMeta?.label || km.knowledge} · ${km.dispositionMeta?.label || km.disposition}` : concept.section}</em>
                  </button>
                );
              })}
            </section>

            <section className="concept-machine-panel">
              <div className="roadmap-panel-header">
                <div className="roadmap-panel-title">
                  {roadmapScope === 'concept' ? 'Concept State Machine' : 'Chapter World Map'}
                </div>
                <div className="roadmap-scope-toggle">
                  <button
                    className={roadmapScope === 'concept' ? 'active' : ''}
                    onClick={() => setRoadmapScope('concept')}
                  >
                    Concept state
                  </button>
                  <button
                    className={roadmapScope === 'chapter' ? 'active' : ''}
                    onClick={() => setRoadmapScope('chapter')}
                  >
                    Chapter roadmap
                  </button>
                </div>
              </div>

              {roadmapScope === 'chapter' && (
                <div className="chapter-world-map">
                  <svg
                    className="world-map-svg"
                    viewBox={worldViewBox}
                    preserveAspectRatio="xMidYMin meet"
                    role="img"
                    aria-label="Chapter curriculum world map state machine"
                  >
                    <g className="world-tile-grid">
                      {worldGridVerticals.map(x => (
                        <line key={`vx-${x}`} x1={x} y1={worldViewMinY} x2={x} y2={worldViewMaxY} />
                      ))}
                      {worldGridHorizontals.map(y => (
                        <line key={`hy-${y}`} x1={worldViewMinX} y1={y} x2={worldViewMaxX} y2={y} />
                      ))}
                    </g>

                    {simpleWorldEdges.map((edge, i) => (
                      <g key={`${edge.from}-${edge.to}-${i}`}>
                        <path
                          className={`world-edge ${edge.kind || ''}`}
                          d={worldPathFor(edge)}
                        />
                      </g>
                    ))}

                    {simpleWorldNodes.map((node) => {
                      const status = worldNodeStatus(node);
                      const isSelected = selectedConcept?.id === node.conceptId
                        || selected?.id === node.id
                        || (node.type === 'section_level' && (node.concept_ids || []).includes(selectedConcept?.id));
                      const titleLines = splitSvgTitle(node.title, node.type === 'section_level' ? 18 : 14);
                      return (
                        <g
                          key={node.id}
                          className={`world-node simple ${node.type} ${status} ${isSelected ? 'selected' : ''}`}
                          transform={`translate(${node.x}, ${node.y})`}
                          onClick={() => selectWorldNode(node)}
                        >
                          <title>{node.title}</title>
                          {node.type === 'concept_checkpoint' && (
                            <>
                              {['current', 'gate-open', 'support'].includes(status) && (
                                <circle className="world-current-halo" r="13" />
                              )}
                              <circle className="world-concept-dot" r="5.6" />
                              {(['current', 'gate-open', 'support'].includes(status) || isSelected) && (
                                <text className="world-label selected-concept" y="30">
                                  {titleLines.map((line, i) => (
                                    <tspan key={i} x="0" dy={i === 0 ? 0 : 13}>{line}</tspan>
                                  ))}
                                </text>
                              )}
                            </>
                          )}
                          {node.type === 'section_level' && (
                            <>
                              <rect x="-17" y="-17" width="34" height="34" />
                              <text className="world-icon section" y="1">{node.section}</text>
                              <text className="world-small" y="36">{(node.concept_ids || []).length} concepts</text>
                            </>
                          )}
                          {node.type === 'mastery_gate' && (
                            <>
                              <polygon points="0,-23 23,0 0,23 -23,0" />
                              <text className="world-icon gate" y="0">G</text>
                            </>
                          )}
                          {node.type === 'start' && (
                            <>
                              <circle r="8" />
                            </>
                          )}
                          {node.type === 'chapter_complete' && (
                            <>
                              <circle r="20" />
                              <text className="world-icon complete" y="0">C</text>
                            </>
                          )}
                          {['start', 'mastery_gate', 'chapter_complete'].includes(node.type) && (
                            <text className="world-label" y={node.type === 'mastery_gate' ? 34 : 38}>
                              {titleLines.map((line, i) => (
                                <tspan key={i} x="0" dy={i === 0 ? 0 : 13}>{line}</tspan>
                              ))}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}

              {roadmapScope === 'concept' && selectedConcept && (
                <div className="concept-machine uml-machine">
                  <svg className="lesson-state-svg concept-blueprint-svg" viewBox="0 0 900 430" role="img" aria-label={`Concept lifecycle state machine for ${selectedConcept.title}`}>
                    <defs>
                      <marker id="uml-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
                        <path d="M 0 0 L 7 3.5 L 0 7 z" className="uml-arrow-head" />
                      </marker>
                    </defs>

                    <text className={`uml-runtime-state ${fsmStateLabel}`} x="30" y="24">state: {eventLabel(fsmStateLabel)}</text>

                    <circle className="uml-start" cx="30" cy="79" r="9" />
                    <path className={`uml-edge ${fsmLockedOrBeyond ? 'taken' : ''}`} d="M 40 79 L 58 79" markerEnd="url(#uml-arrow)" />

                    <g className={`uml-node state lifecycle locked ${lockedStateClass}`}>
                      <rect x="62" y="48" width="86" height="62" rx="0" />
                      <text x="105" y="83">Locked</text>
                    </g>
                    <path className={`uml-edge ${fsmReadyOrBeyond ? 'taken' : ''}`} d="M 148 79 L 174 79" markerEnd="url(#uml-arrow)" />

                    <g className={`uml-node state lifecycle ready ${readyStateClass}`}>
                      <rect x="178" y="48" width="82" height="62" rx="0" />
                      <text x="219" y="83">Ready</text>
                    </g>
                    <path className={`uml-edge ${fsmActiveOrBeyond ? 'taken' : ''}`} d="M 260 79 L 286 79" markerEnd="url(#uml-arrow)" />

                    <g
                      className={`uml-node state active-container ${activeStateClass}`}
                      onClick={() => onSelect(selectedConcept.id)}
                    >
                      <rect x="290" y="48" width="360" height="150" rx="0" />
                      <text x="310" y="74" className="uml-kicker">ACTIVE CONCEPT</text>
                      <text x="310" y="96" className="uml-title">
                        {splitSvgTitle(selectedConcept.title, 22).map((line, i) => (
                          <tspan key={i} x="310" dy={i === 0 ? 0 : 15}>{line}</tspan>
                        ))}
                      </text>
                      <text x="310" y="118" className="active-mode-note">learner evidence selects the next teaching mode</text>
                      <g className={`active-substate ${substateClass('orient')}`}>
                        <rect x="312" y="132" width="72" height="32" rx="0" />
                        <text x="348" y="152">Orient</text>
                      </g>
                      <g className={`active-substate ${substateClass('explain')}`}>
                        <rect x="399" y="132" width="76" height="32" rx="0" />
                        <text x="437" y="152">Explain</text>
                      </g>
                      <g className={`active-substate ${substateClass('connect')}`}>
                        <rect x="490" y="132" width="78" height="32" rx="0" />
                        <text x="529" y="152">Connect</text>
                      </g>
                      <g className={`active-substate ${substateClass('practice')}`}>
                        <rect x="364" y="166" width="78" height="32" rx="0" />
                        <text x="403" y="186">Practice</text>
                      </g>
                      <g className={`active-substate support ${substateClass('support')}`}>
                        <rect x="462" y="166" width="78" height="32" rx="0" />
                        <text x="501" y="186">Support</text>
                      </g>
                    </g>

                    <path className={`uml-edge ${selectedMachineState === 'mastered' ? 'taken' : ''}`} d="M 650 79 L 724 79" markerEnd="url(#uml-arrow)" />
                    <text className="uml-edge-label" x="666" y="65">mastery</text>
                    <g
                      className={`uml-node state mastered ${masteredStateClass}`}
                      onClick={() => nextConcept && onSelect(nextConcept.id)}
                    >
                      <rect x="728" y="48" width="110" height="62" rx="0" />
                      <text x="783" y="75">Concept</text>
                      <text x="783" y="93">Mastered</text>
                    </g>

                    <path className={`uml-edge ${fsmAtGateOrBeyond ? 'taken' : ''}`} d="M 496 198 L 496 224" markerEnd="url(#uml-arrow)" />
                    <g
                      className={`uml-node gate-diamond ${gateStateClass || evidenceStatus}`}
                      onClick={() => selectedGateId && onSelect(selectedGateId)}
                    >
                      <polygon points="496,224 530,258 496,292 462,258" />
                      <text x="496" y="263">G</text>
                    </g>

                    <path className={`uml-edge success ${selectedMachineState === 'mastered' ? 'taken' : ''}`} d="M 530 258 L 700 258 L 700 111 L 724 111" markerEnd="url(#uml-arrow)" />
                    <text className="uml-edge-label success" x="620" y="246">pass</text>
                    <path className={`uml-edge branch ${selectedMachineState === 'support' ? 'taken' : ''}`} d="M 496 292 L 496 321 L 724 321" markerEnd="url(#uml-arrow)" />
                    <text className="uml-edge-label branch" x="568" y="309">weak</text>
                    <g className={`uml-node state review-due ${supportStateClass}`}>
                      <rect x="728" y="292" width="110" height="62" rx="0" />
                      <text x="783" y="319">Support</text>
                      <text x="783" y="337">Prereq</text>
                    </g>
                    <path className={`uml-edge loop ${selectedMachineState === 'support' ? 'taken' : ''}`} d="M 783 354 L 783 370 L 248 370 L 248 173 L 286 173" markerEnd="url(#uml-arrow)" />
                    <text className="uml-edge-label loop" x="382" y="386">support loop</text>
                  </svg>

                  {selectedRelations.length > 0 && (
                    <div className="selected-relations">
                      <div className="branch-title">Relevant concept graph edges</div>
                      {selectedRelations.slice(0, 6).map((edge, i) => (
                        <button
                          key={`${edge.from}-${edge.to}-${i}`}
                          className={`roadmap-relation ${edge.kind}`}
                          onClick={() => onSelect(edge.to === selectedConcept.id ? edge.from : edge.to)}
                          title={edge.rationale || edge.event}
                        >
                          <span>{nodeById[edge.from]?.title || edge.from}</span>
                          <b>{edge.event}</b>
                          <span>{nodeById[edge.to]?.title || edge.to}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>

        <aside className="roadmap-inspector">
          <div className="roadmap-player-card">
            <h3>Learner State</h3>
            <div className="roadmap-facts compact">
              <span>Current</span><strong>{currentConceptTitle}</strong>
              <span>Page</span><strong>{currentPage}</strong>
            </div>
            <div className="concept-runtime-panel">
              <div className="concept-runtime-row">
                <span>Learner step</span>
                <strong>{learnerStep}</strong>
              </div>
              <div className="concept-runtime-row">
                <span>Tutor</span>
                <strong>{tutorStatus}</strong>
              </div>
              <div className="concept-runtime-row">
                <span>Concept</span>
                <strong>{conceptStatus}</strong>
              </div>
              <div className="concept-runtime-row">
                <span>Support</span>
                <strong>{supportTitle}</strong>
              </div>
            </div>
            {currentConceptModel ? (
              <div className="learner-model-panel">
                <div className="lm-row">
                  <span>Knowledge</span>
                  <span className={`lm-badge k-${currentConceptModel.knowledge}`}>
                    {currentConceptModel.knowledgeMeta?.label || currentConceptModel.knowledge}
                  </span>
                </div>
                <div className="lm-meter" title={`${currentConceptModel.masteryPct}% understanding`}>
                  <div
                    className={`lm-meter-fill k-${currentConceptModel.knowledge}`}
                    style={{ width: `${currentConceptModel.masteryPct}%` }}
                  />
                </div>
                <div className="lm-row">
                  <span>Disposition</span>
                  <span className={`lm-badge d-${currentConceptModel.disposition}`}>
                    {currentConceptModel.dispositionMeta?.label || currentConceptModel.disposition}
                  </span>
                </div>
                {currentConceptModel.misconception && (
                  <div className="lm-flag">⚠ Possible misconception — confidently off-track</div>
                )}
                <div className="lm-time-grid">
                  <div><span>Concept time</span><strong>{formatDuration(currentConceptTimeMs)}</strong></div>
                  <div><span>Page time</span><strong>{formatDuration(currentPageTimeMs)}</strong></div>
                  <div><span>Avg answer</span><strong>{formatDuration(avgAnswerLatencyMs)}</strong></div>
                </div>
              </div>
            ) : (
              <div className="learner-model-panel empty">
                No evidence yet — answer a check to build the learner model.
              </div>
            )}
            <div className="learner-progress-panel">
              <div className={`learner-mode-card ${learnerMode} ${conceptState}`}>
                <span>Mode</span>
                <strong>{learnerStep}</strong>
                <em>{supportCount ? `${supportCount} support event${supportCount === 1 ? '' : 's'}` : `${reviewedCount} lesson step${reviewedCount === 1 ? '' : 's'} visited`}</em>
              </div>
              <div className="learner-history-list">
                {recentLearnerEvents.length ? recentLearnerEvents.map((event, i) => (
                  <div key={`${event.ts}-${i}`} className={`learner-history-item ${event.to || ''}`}>
                    <span>{new Date(event.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <strong>{learnerTimelineLabel(event.event)}</strong>
                    <em>
                      {event.conceptTitle || event.lessonNode || `p.${event.page || currentPage}`}
                      {event.durationMs ? ` · ${formatDuration(event.durationMs)}` : ''}
                      {event.answerLatencyMs ? ` · answer ${formatDuration(event.answerLatencyMs)}` : ''}
                    </em>
                  </div>
                )) : (
                  <div className="learner-history-empty">Interact with the PDF or tutor to start tracking runtime history.</div>
                )}
              </div>
            </div>
          </div>

          <div className="roadmap-player-card">
            <h3>Selected Node</h3>
            <div className="roadmap-selected-title">{selected?.title || 'No node selected'}</div>
            <div className="roadmap-selected-type">{selected?.type || '-'}</div>
            {selected?.substates?.length > 0 && (
              <div className="roadmap-substates">
                {selected.substates.map(s => <span key={s.id}>{s.kind}</span>)}
              </div>
            )}
            <div className="roadmap-edge-list">
              {selectedEdges.slice(0, 8).map((edge, i) => (
                <div key={`${edge.from}-${edge.to}-${i}`}>
                  <code>{edge.event}</code>
                  <span>{nodeById[edge.to]?.title || edge.to}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  // PDF state
  const [pdfUrl, setPdfUrl]           = useState(null);
  const [title, setTitle]             = useState('');
  const [numPages, setNumPages]       = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale]             = useState(1.2);
  const [pageInput, setPageInput]     = useState('1');
  const [pdfError, setPdfError]       = useState(null);
  const [pageHeight, setPageHeight]   = useState(null); // measured height of one rendered page
  const [pageWidth,  setPageWidth]    = useState(null); // measured width of one rendered page
  const [outline, setOutline]         = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [repoPdfPickerOpen, setRepoPdfPickerOpen] = useState(false);
  const [repoPdfs, setRepoPdfs]       = useState([]);
  const [repoPdfRoot, setRepoPdfRoot] = useState('');
  const [repoPdfStatus, setRepoPdfStatus] = useState('idle'); // idle | loading | ready | empty | error
  const [visionBookOpen, setVisionBookOpen] = useState(false);
  const [qmdFiles, setQmdFiles] = useState([]);
  const [selectedQmd, setSelectedQmd] = useState('');
  const [qmdStatus, setQmdStatus] = useState('idle'); // idle | loading | ready | error
  const [qmdFigureChoices, setQmdFigureChoices] = useState([]);
  const [qmdFigureSelections, setQmdFigureSelections] = useState({});
  const [qmdGalleryPreview, setQmdGalleryPreview] = useState(null);
  const [qmdFigureLineage, setQmdFigureLineage] = useState(null);
  const [qmdPreviewFrameLoaded, setQmdPreviewFrameLoaded] = useState(false);
  const [qmdFigureEdit, setQmdFigureEdit] = useState(null); // { item, candidate, prompt, status, error }

  // Tutor / page-awareness state
  const [tutorMode, setTutorMode]     = useState(true);
  const [pageText, setPageText]       = useState('');
  const pageTextCache                 = useRef(new Map()); // page# → extracted text
  const [ragStatus, setRagStatus]     = useState('idle'); // 'idle' | 'indexing' | 'ready'
  const [outlineFocusText, setOutlineFocusText] = useState('');

  // Chat state
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState('');
  const [selectedText, setSelectedText]   = useState('');
  const [pinnedContext, setPinnedContext] = useState('');
  const [loading, setLoading]             = useState(false);

  // ── Concept-graph awareness ───────────────────────────────────
  // The tutor uses the chapter's concept nodes as grounding context. There
  // is no "linear lesson" — transitions are event-driven (see lesson_state).
  const [availableChapters, setAvailableChapters] = useState([]); // /api/lessons/chapters
  const [detectedChapter, setDetectedChapter]     = useState(null);
  const [chapterConcepts, setChapterConcepts]     = useState([]); // raw concept nodes for current chapter
  const [activeConcepts, setActiveConcepts]       = useState([]); // concepts relevant to current PDF position
  const [chapterLessonPlan, setChapterLessonPlan] = useState(null);
  const [chapterLessonPhase, setChapterLessonPhase] = useState('idle');
  const [chapterLessonStateId, setChapterLessonStateId] = useState(null);
  const [guidedReadingActive, setGuidedReadingActive] = useState(false);
  const [workspaceView, setWorkspaceView] = useState('visionbook');
  const [roadmapProgress, setRoadmapProgress] = useState(createRoadmapProgress);
  const [learnerSession, setLearnerSession] = useState(() => createLearnerSession(''));
  const [conceptMachineSnapshot, setConceptMachineSnapshot] = useState(null);
  const [selectedRoadmapNodeId, setSelectedRoadmapNodeId] = useState(null);
  const tutorScenarioCountRef = useRef(0);
  const sendMessageRef = useRef(null);
  const triggerRemediationVizRef = useRef(null);
  const lessonRuntimeRef = useRef(null);
  const conceptMachineRef = useRef(null);
  const conceptMachineSnapshotRef = useRef(null);
  const lessonUnsubsRef = useRef([]);
  const lessonGateRef = useRef(null);
  const lessonStartedRef = useRef(false);
  const lessonLastPromptedStateRef = useRef(null);

  // Split
  const [splitPos, setSplitPos] = useState(58);
  const dragging = useRef(false);

  // Figure select
  const [selectMode, setSelectMode] = useState(false);
  const [selRect, setSelRect]       = useState(null);
  const [popupPos, setPopupPos]     = useState(null);
  const [capturing, setCapturing]   = useState(false);
  const dragStartRef = useRef(null);

  // Inline interactive figure overlays — persisted to localStorage keyed by PDF title
  const [figureOverlays, setFigureOverlaysRaw] = useState([]);
  const overlayIdRef = useRef(0);

  // Figure customization — tracks which overlay the user is currently modifying via chat
  const [customizeOverlayId, setCustomizeOverlayId] = useState(null);
  const btnDragRef = useRef(null);

  // PDF text highlights — phrases the tutor wants to highlight in the PDF
  const [pdfHighlights, setPdfHighlights] = useState([]);

  // ── Annotations (persistent, per book) ───────────────────
  const [annotations, setAnnotationsRaw] = useState([]);
  const [activeAnnotation, setActiveAnnotation] = useState(null); // { ann } — preview mode
  const annotationsRef = useRef([]);
  const setAnnotations = useCallback((updater) => {
    setAnnotationsRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      annotationsRef.current = next;
      saveAnnotations(titleRef.current, next);
      return next;
    });
  }, []);


  // Back-navigation state — saved before a cross-page jump so user can return
  const [backState, setBackState] = useState(null); // { page, scrollTop }

  // Figure popup — rendered OUTSIDE iframes so it never obstructs figure content
  const [figurePopup, setFigurePopup]     = useState(null); // { title, body, left, top }
  const [figureTooltip, setFigureTooltip] = useState(null); // { text, x, y }
  const [, setHoveredOverlayId] = useState(null);
  const hoveredOverlayIdRef = useRef(null);
  const figureOverlaysRef   = useRef([]);
  const mousePosRef         = useRef({ x: 0, y: 0 });
  const popupDismissTimer   = useRef(null);

  const setFigureOverlays = useCallback((updater) => {
    setFigureOverlaysRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      figureOverlaysRef.current = next;
      // Persist only completed overlays (not loading ones) keyed by document title
      try {
        const key = `overlays:${title || '_'}`;
        const toSave = next.filter(o => !o.loading && o.html);
        localStorage.setItem(key, JSON.stringify(toSave));
      } catch {}
      // ── Log newly completed overlays to chapter mastery ──
      try {
        if (titleRef.current) {
          const prevIds = new Set(prev.filter(o => !o.loading && o.html).map(o => o.id));
          const newlyDone = next.filter(o => !o.loading && o.html && !prevIds.has(o.id));
          if (newlyDone.length) {
            const mastery = loadMastery(titleRef.current);
            if (!mastery.chapters) mastery.chapters = {};
            newlyDone.forEach(o => {
              const pg = o.page || currentPageRef.current;
              const ch = mastery.chapters[pg] || { correct: 0, wrong: 0, gaps: [], timeMs: 0, augments: [] };
              ch.augments = [...(ch.augments || []), { type: o.type || 'figure', page: pg, ts: Date.now() }];
              mastery.chapters[pg] = ch;
            });
            saveMastery(titleRef.current, mastery);
          }
        }
      } catch {}
      return next;
    });
  }, [title]);

  const fileInputRef       = useRef(null);
  const pdfObjectUrlRef    = useRef(null);
  const chatBottomRef      = useRef(null);
  const chatInputRef       = useRef(null);
  const previewEditTextareaRef = useRef(null);
  const previewFigureFrameRef = useRef(null);
  const pageRefs           = useRef([]);
  const scrollContainerRef = useRef(null);
  const pageVisibility     = useRef(new Map());
  const pdfDocRef          = useRef(null);
  const tutorTimerRef       = useRef(null);
  const dwellTimerRef       = useRef(null);
  const scrollFractionRef   = useRef(0);
  const lastCheckinRef      = useRef(0);
  const chapterQCountRef    = useRef({});   // { chapterPage: count } — max 4 per chapter
  const totalTutorAsksRef   = useRef(0);    // total auto-questions fired this session

  // ── Tutor Gate FSM ────────────────────────────────────────
  // States: IDLE | QUESTION | SCORING | REMEDIATE | REASK | ADVANCE
  const [tutorGate, setTutorGate]   = useState('IDLE');
  const tutorGateRef                = useRef('IDLE');
  const pendingTutorQuestion        = useRef(null); // { text, chapterPage }
  const pendingGap                  = useRef(null); // gap string from last scoring

  // ── Learner tracking ──────────────────────────────────────
  const pageArrivalTimeRef          = useRef(Date.now()); // reset on page change
  const conceptArrivalTimeRef       = useRef(Date.now()); // reset on concept focus change

  // Stable refs so dwell callback reads current values without re-attaching scroll listeners
  const tutorModeRef        = useRef(tutorMode);
  const loadingRef          = useRef(loading);
  const messagesRef         = useRef(messages);
  const titleRef            = useRef(title);
  const currentPageRef      = useRef(currentPage);
  const pageTextRef         = useRef(pageText);
  const outlineRef          = useRef(outline);
  const activeConceptsRef   = useRef(activeConcepts);
  const learnerSessionRef   = useRef(learnerSession);
  const lastTrackedPageRef  = useRef(1);
  const lastTrackedConceptRef = useRef(null);
  const navigateWithBackRef = useRef(null); // filled after navigateWithBack is defined
  const learnerFsmRef       = useRef(new LearnerStateMachine(LEARNER_STATES.IDLE));
  const learnerModelRef     = useRef(new LearnerModel());
  const [learnerModelSnapshot, setLearnerModelSnapshot] = useState({});
  const promptAskedAtRef    = useRef(null);   // when the current check was posed (for latency)
  const hintsThisConceptRef = useRef(0);      // hints shown for the concept currently being assessed
  const idleTimerRef        = useRef(null);
  const appendLearnerEventRef = useRef(null);
  tutorModeRef.current   = tutorMode;
  tutorGateRef.current   = tutorGate;
  loadingRef.current     = loading;
  messagesRef.current    = messages;
  titleRef.current       = title;
  currentPageRef.current = currentPage;
  pageTextRef.current    = pageText;
  outlineRef.current     = outline;
  activeConceptsRef.current = activeConcepts;
  learnerSessionRef.current = learnerSession;
  conceptMachineSnapshotRef.current = conceptMachineSnapshot;

  const appendLearnerEvent = useCallback((eventName, options = {}) => {
    const activeConcept = options.concept || activeConceptsRef.current?.[0] || null;
    const lessonNode = options.lessonNode
      || lessonRuntimeRef.current?.currentStateId?.()
      || learnerSessionRef.current?.currentLessonNode
      || null;
    // Drive the learner state machine once, outside the setState updater
    // (so React StrictMode's double-invoke can't double-dispatch it).
    const fsm = learnerFsmRef.current;
    let fsmResult = null;
    if (fsm && options.fsmEvent) {
      fsmResult = fsm.dispatch(options.fsmEvent, { reason: eventName });
    }
    const fsmState = fsm ? fsm.state : null;
    setLearnerSession(prev => {
      // The FSM is the source of truth for currentLearnerState. Legacy `to`
      // strings are only used when no machine transition applies.
      const from = fsmResult ? fsmResult.from : (fsmState || options.from || prev.currentLearnerState || 'idle');
      const to = fsmState || options.to || from;
      const record = {
        ts: Date.now(),
        event: eventName,
        fsmEvent: options.fsmEvent || null,
        fsmAccepted: fsmResult ? fsmResult.accepted : null,
        from,
        to,
        page: options.page || currentPageRef.current || prev.currentPage || 1,
        conceptId: options.conceptId || activeConcept?.id || activeConcept?.concept_id || null,
        conceptTitle: options.conceptTitle || activeConcept?.title || null,
        lessonNode,
        tutorAction: options.tutorAction || null,
        durationMs: typeof options.durationMs === 'number' ? Math.max(0, Math.round(options.durationMs)) : null,
        answerLatencyMs: typeof options.answerLatencyMs === 'number' ? Math.max(0, Math.round(options.answerLatencyMs)) : null,
        readingMs: typeof options.readingMs === 'number' ? Math.max(0, Math.round(options.readingMs)) : null,
        payload: options.payload || null,
      };
      const visitedNodes = lessonNode && !prev.visitedNodes.includes(lessonNode)
        ? [...prev.visitedNodes, lessonNode]
        : prev.visitedNodes;
      const masteredNodes = options.masteredNode && !prev.masteredNodes.includes(options.masteredNode)
        ? [...prev.masteredNodes, options.masteredNode]
        : prev.masteredNodes;
      const next = {
        ...prev,
        title: titleRef.current || prev.title,
        updatedAt: record.ts,
        currentPage: record.page,
        currentLearnerState: to,
        currentConceptMachine: options.conceptMachine || prev.currentConceptMachine || null,
        currentLessonNode: lessonNode,
        currentConceptTitle: record.conceptTitle || prev.currentConceptTitle || null,
        visitedNodes,
        masteredNodes,
        totalReadingMs: (prev.totalReadingMs || 0) + (record.readingMs || 0),
        totalAnswerLatencyMs: (prev.totalAnswerLatencyMs || 0) + (record.answerLatencyMs || 0),
        pageTimeMs: record.page && record.durationMs
          ? { ...(prev.pageTimeMs || {}), [record.page]: ((prev.pageTimeMs || {})[record.page] || 0) + record.durationMs }
          : (prev.pageTimeMs || {}),
        conceptTimeMs: record.conceptId && record.durationMs
          ? { ...(prev.conceptTimeMs || {}), [record.conceptId]: ((prev.conceptTimeMs || {})[record.conceptId] || 0) + record.durationMs }
          : (prev.conceptTimeMs || {}),
        events: [...(prev.events || []), record].slice(-120),
      };
      saveLearnerSession(titleRef.current || prev.title, next);
      return next;
    });

    // Diagram "Timeout?": if the learner sits in `reading` with no further
    // activity, dispatch `timeout` (reading -> idle). Any real event resets it.
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (options.fsmEvent !== 'timeout') {
      idleTimerRef.current = setTimeout(() => {
        if (learnerFsmRef.current?.state === LEARNER_STATES.READING) {
          appendLearnerEventRef.current?.('idle_timeout', {
            fsmEvent: 'timeout',
            tutorAction: 'inactivity',
          });
          const disengagedConcept = conceptMachineSnapshotRef.current?.conceptId;
          if (disengagedConcept) {
            learnerModelRef.current.markDisengaged(
              disengagedConcept,
              conceptMachineSnapshotRef.current?.conceptTitle,
            );
            setLearnerModelSnapshot(learnerModelRef.current.all());
          }
        }
      }, LEARNER_IDLE_MS);
    }
  }, []);
  appendLearnerEventRef.current = appendLearnerEvent;

  const syncConceptMachine = useCallback((eventName, dispatch, learnerEvent = {}) => {
    const machine = conceptMachineRef.current;
    if (!machine) return null;
    const snapshot = dispatch(machine);
    conceptMachineSnapshotRef.current = snapshot;
    setConceptMachineSnapshot(snapshot);
    if (eventName) {
      appendLearnerEvent(eventName, {
        conceptId: snapshot?.conceptId,
        conceptTitle: snapshot?.conceptTitle,
        lessonNode: learnerEvent.lessonNode,
        tutorAction: learnerEvent.tutorAction || 'concept_fsm_transition',
        payload: {
          ...(learnerEvent.payload || {}),
          conceptState: snapshot?.state,
          activeGateId: snapshot?.activeGateId || null,
          prereqsSatisfied: snapshot?.prereqsSatisfied,
          supportTargets: snapshot?.supportTargets?.map(t => t.title || t.id) || [],
        },
        conceptMachine: snapshot,
        to: learnerEvent.to || learnerSessionRef.current?.currentLearnerState || 'reading',
      });
    }
    return snapshot;
  }, [appendLearnerEvent]);

  // ── File open ────────────────────────────────────────────
  const openPdfDocument = useCallback(({ url, docTitle, objectUrl = null }) => {
    if (pdfObjectUrlRef.current && pdfObjectUrlRef.current !== objectUrl) {
      URL.revokeObjectURL(pdfObjectUrlRef.current);
    }
    pdfObjectUrlRef.current = objectUrl;
    setPdfUrl(url);
    setTitle(docTitle);
    setCurrentPage(1); setPageInput('1'); setNumPages(null); setPageHeight(null); setPageWidth(null);
    setOutline([]); setMessages([]);
    lessonUnsubsRef.current.forEach(fn => fn?.());
    lessonUnsubsRef.current = [];
    lessonRuntimeRef.current = null;
    conceptMachineRef.current = null;
    conceptMachineSnapshotRef.current = null;
    setConceptMachineSnapshot(null);
    lessonGateRef.current = null;
    lessonStartedRef.current = false;
    lastTrackedPageRef.current = 1;
    lastTrackedConceptRef.current = null;
    setChapterLessonPlan(null);
    setChapterLessonPhase('idle');
    setChapterLessonStateId(null);
    setGuidedReadingActive(false);
    setWorkspaceView('reader');
    setRoadmapProgress(createRoadmapProgress());
    learnerFsmRef.current.reset(LEARNER_STATES.READING);
    const restoredSession = loadLearnerSession(docTitle);
    const openedSession = {
      ...restoredSession,
      title: docTitle,
      updatedAt: Date.now(),
      currentPage: 1,
      currentLearnerState: 'reading',
      currentConceptMachine: null,
      totalReadingMs: restoredSession.totalReadingMs || 0,
      totalAnswerLatencyMs: restoredSession.totalAnswerLatencyMs || 0,
      pageTimeMs: restoredSession.pageTimeMs || {},
      conceptTimeMs: restoredSession.conceptTimeMs || {},
      events: [...(restoredSession.events || []), {
        ts: Date.now(),
        event: 'pdf_opened',
        from: restoredSession.currentLearnerState || 'idle',
        to: 'reading',
        page: 1,
        conceptId: null,
        conceptTitle: null,
        lessonNode: null,
        tutorAction: null,
        payload: { url },
      }].slice(-120),
    };
    setLearnerSession(openedSession);
    saveLearnerSession(docTitle, openedSession);
    setSelectedRoadmapNodeId(null);
    setDetectedChapter(null);
    setChapterConcepts([]);
    setActiveConcepts([]);
    setSelectMode(false); setSelRect(null); setPopupPos(null);
    pageTextCache.current.clear(); setPageText('');
    setOutlineFocusText('');
    setActiveAnnotation(null);
    // Load saved annotations for this document
    const savedAnns = loadAnnotations(docTitle);
    setAnnotationsRaw(savedAnns);
    annotationsRef.current = savedAnns;
    // Reset tutor gate so first question fires promptly after PDF load
    lastCheckinRef.current = 0;
    totalTutorAsksRef.current = 0;
    chapterQCountRef.current = {};
    tutorScenarioCountRef.current = 0;
    pendingTutorQuestion.current = null;
    pendingGap.current = null;
    setTutorGate('IDLE');
    // Restore saved overlays for this document
    try {
      const saved = localStorage.getItem(`overlays:${docTitle}`);
      console.log(`[overlays] key="overlays:${docTitle}" found=${!!saved} length=${saved?.length ?? 0}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Pregenerated figure overlays embed a full srcDoc snapshot, so old
        // persisted ones can keep showing stale FigureLLM cache output. Drop
        // those on restore; the pregenerated overlay effect will refetch them
        // through the current curated-first inline loader.
        const restored = parsed.filter(o => o.source !== 'pregenerated');
        console.log(`[overlays] loaded ${restored.length}/${parsed.length} overlays:`, restored.map(o => ({ id: o.id, type: o.type, page: o.page })));
        setFigureOverlaysRaw(restored);
        overlayIdRef.current = restored.length ? Math.max(...restored.map(o => o.id)) : 0;
      } else {
        // Check what overlay keys exist in localStorage
        const allKeys = Object.keys(localStorage).filter(k => k.startsWith('overlays:'));
        console.log('[overlays] no match. existing overlay keys:', allKeys);
        setFigureOverlaysRaw([]);
      }
    } catch (err) { console.error('[overlays] parse error:', err); setFigureOverlaysRaw([]); }
  }, []);

  const onFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const docTitle = file.name.replace(/\.pdf$/i, '');
    openPdfDocument({ url, docTitle, objectUrl: url });
    e.target.value = '';
  }, [openPdfDocument]);

  const loadRepoPdfs = useCallback(async () => {
    setRepoPdfStatus('loading');
    try {
      const res = await fetch(`${BACKEND}/api/repo-pdfs`);
      if (!res.ok) throw new Error(`PDF list failed (${res.status})`);
      const data = await res.json();
      const files = Array.isArray(data.files) ? data.files : [];
      setRepoPdfs(files);
      setRepoPdfRoot(data.root || '');
      setRepoPdfStatus(files.length ? 'ready' : 'empty');
      return files;
    } catch (err) {
      console.error('[repo-pdfs] list error:', err);
      setRepoPdfStatus('error');
      setRepoPdfs([]);
      return [];
    }
  }, []);

  const handleOpenPdfClick = useCallback(async () => {
    setRepoPdfPickerOpen(true);
    await loadRepoPdfs();
  }, [loadRepoPdfs]);

  const openRepoPdfFolder = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND}/api/repo-pdfs/open-folder`, { method: 'POST' });
      if (!res.ok) throw new Error(`Open folder failed (${res.status})`);
    } catch (err) {
      console.error('[repo-pdfs] open folder error:', err);
    }
  }, []);

  const openRepoPdf = useCallback((file) => {
    const url = new URL(file.url, BACKEND).toString();
    const docTitle = file.name.replace(/\.pdf$/i, '');
    openPdfDocument({ url, docTitle });
    setRepoPdfPickerOpen(false);
  }, [openPdfDocument]);

  const loadVisionBook = useCallback(async () => {
    setQmdStatus('loading');
    try {
      const res = await fetch(`${BACKEND}/api/visionbook/qmds`);
      if (!res.ok) throw new Error(`QMD list failed (${res.status})`);
      const files = await res.json();
      const qmds = Array.isArray(files)
        ? files.filter(item => item?.file && String(item.file).endsWith('.qmd'))
        : [];
      const preferred = qmds.find(item => item.file === 'imaging.qmd')?.file || qmds[0]?.file || '';
      setQmdFiles(qmds);
      setSelectedQmd(prev => {
        const next = prev || preferred;
        setQmdFigureSelections(loadQmdFigureSelections(next));
        return next;
      });
      setVisionBookOpen(true);
      setWorkspaceView('visionbook');
      setTitle(preferred ? qmdTitleFromFile(preferred) : 'VisionBook');
      setQmdStatus(qmds.length ? 'ready' : 'error');

      learnerFsmRef.current.reset(LEARNER_STATES.READING);
      const restoredSession = loadLearnerSession('VisionBook');
      const openedSession = {
        ...restoredSession,
        title: 'VisionBook',
        updatedAt: Date.now(),
        currentLearnerState: 'reading',
        totalReadingMs: restoredSession.totalReadingMs || 0,
        totalAnswerLatencyMs: restoredSession.totalAnswerLatencyMs || 0,
        pageTimeMs: restoredSession.pageTimeMs || {},
        conceptTimeMs: restoredSession.conceptTimeMs || {},
        events: [...(restoredSession.events || []), {
          ts: Date.now(),
          event: 'visionbook_opened',
          from: restoredSession.currentLearnerState || 'idle',
          to: 'reading',
          page: currentPageRef.current || 1,
          conceptId: null,
          conceptTitle: null,
          lessonNode: null,
          tutorAction: null,
          payload: { qmd: preferred },
        }].slice(-120),
      };
      setLearnerSession(openedSession);
      saveLearnerSession('VisionBook', openedSession);
    } catch (err) {
      console.error('[visionbook] qmd list error:', err);
      setQmdStatus('error');
      setVisionBookOpen(true);
      setWorkspaceView('visionbook');
      setTitle('VisionBook');
    }
  }, []);

  useEffect(() => {
    loadVisionBook();
  }, [loadVisionBook]);

  const selectVisionBookQmd = useCallback((qmdFile) => {
    setSelectedQmd(qmdFile);
    setQmdFigureSelections(loadQmdFigureSelections(qmdFile));
    setQmdGalleryPreview(null);
    setTitle(qmdTitleFromFile(qmdFile));
    appendLearnerEvent('visionbook_chapter_selected', {
      to: 'reading',
      payload: { qmd: qmdFile },
    });
  }, [appendLearnerEvent]);

  useEffect(() => {
    if (!visionBookOpen || !selectedQmd) {
      setQmdFigureChoices([]);
      return;
    }
    let cancelled = false;
    fetch(`${BACKEND}/api/visionbook/substitutions?qmd=${encodeURIComponent(selectedQmd)}`)
      .then(res => {
        if (!res.ok) throw new Error(`Substitutions failed (${res.status})`);
        return res.json();
      })
      .then(items => {
        if (!cancelled) setQmdFigureChoices(Array.isArray(items) ? items : []);
      })
      .catch(err => {
        console.warn('[visionbook] substitutions error:', err);
        if (!cancelled) setQmdFigureChoices([]);
      });
    return () => { cancelled = true; };
  }, [selectedQmd, visionBookOpen]);

  useEffect(() => {
    if (!selectedQmd) return;
    saveQmdFigureSelections(selectedQmd, qmdFigureSelections);
  }, [selectedQmd, qmdFigureSelections]);

  useEffect(() => {
    if (!qmdFigureChoices.length) return;
    setQmdFigureSelections(prev => {
      let changed = false;
      const next = { ...prev };
      for (const group of qmdFigureChoices) {
        const selection = prev[group.stem] || {};
        if (selection.forceOriginal) continue;
        const selectedSourceKey = selection.sourceKey;
        if (!selectedSourceKey) continue;
        const candidates = group.candidates || [];
        const seen = new Set([selectedSourceKey]);
        let current = selectedSourceKey;
        while (current) {
          const parentSourceKey = current;
          const child = candidates.find(candidate =>
            candidate.edited && candidate.parentSourceKey === parentSourceKey && !seen.has(candidate.sourceKey)
          );
          if (!child) break;
          seen.add(child.sourceKey);
          current = child.sourceKey;
        }
        if (current && current !== selectedSourceKey) {
          next[group.stem] = { sourceKey: current };
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [qmdFigureChoices]);

  useEffect(() => {
    if (!visionBookOpen || !selectedQmd) return;
    const chapter = chapterNumberFromQmd(selectedQmd);
    setDetectedChapter(null);
    setChapterConcepts([]);
    setChapterLessonPlan(null);
    setChapterLessonPhase('idle');
    setChapterLessonStateId(null);
    setGuidedReadingActive(false);
    setRoadmapProgress(createRoadmapProgress());
    setSelectedRoadmapNodeId(null);
    lessonRuntimeRef.current = null;
    conceptMachineRef.current = null;
    conceptMachineSnapshotRef.current = null;
    setConceptMachineSnapshot(null);
    lessonGateRef.current = null;
    lessonStartedRef.current = false;
    lessonUnsubsRef.current.forEach(fn => fn?.());
    lessonUnsubsRef.current = [];
    if (!chapter) return;

    let cancelled = false;
    (async () => {
      try {
        const chap = await fetch(`${BACKEND}/api/lessons/chapter/${chapter}`).then(r => r.json());
        if (cancelled) return;
        setDetectedChapter({
          chapter,
          title: chap.chapter_title || qmdTitleFromFile(selectedQmd),
        });
        setChapterConcepts(chap.concepts || []);
        setChapterLessonPlan(chap.lesson_plan || null);
      } catch (e) {
        console.warn('[visionbook] chapter lesson fetch failed:', e.message);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedQmd, visionBookOpen]);

  // ── PDF load ─────────────────────────────────────────────
  // ── Extract text from a page ─────────────────────────────
  const extractPageText = useCallback(async (pageNum) => {
    const pdf = pdfDocRef.current;
    if (!pdf) return '';
    if (pageTextCache.current.has(pageNum)) return pageTextCache.current.get(pageNum);
    try {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const text = content.items.map(item => item.str).join(' ').replace(/\s+/g, ' ').trim().slice(0, 3000);
      pageTextCache.current.set(pageNum, text);
      return text;
    } catch { return ''; }
  }, []);

  const onLoadSuccess = useCallback(async (pdf) => {
    pageRefs.current = [];
    pageVisibility.current.clear();
    pdfDocRef.current = pdf;
    setNumPages(pdf.numPages);
    setPdfError(null);
    try {
      const raw = await pdf.getOutline();
      if (!raw?.length) { setOutline([]); return; }
      const resolve = async (items) =>
        Promise.all(items.map(async (item) => {
          let pageNum = null;
          try {
            let dest = item.dest;
            if (typeof dest === 'string') dest = await pdf.getDestination(dest);
            if (dest) pageNum = (await pdf.getPageIndex(dest[0])) + 1;
          } catch {}
          return { title: item.title, pageNum, items: item.items?.length ? await resolve(item.items) : [] };
        }));
      setOutline(filterOutlineToDocument(await resolve(raw), pdf.numPages));
    } catch { setOutline([]); }
  }, []);

  // ── Concept graph: fetch available chapters once ──────────
  useEffect(() => {
    fetch(`${BACKEND}/api/lessons/chapters`)
      .then(r => r.json())
      .then(setAvailableChapters)
      .catch(err => console.warn('[concepts] chapters fetch failed:', err.message));
  }, []);

  // ── Detect which chapter the open PDF maps to ─────────────
  useEffect(() => {
    setDetectedChapter(null);
    setChapterConcepts([]);
    setChapterLessonPlan(null);
    setChapterLessonPhase('idle');
    setChapterLessonStateId(null);
    setGuidedReadingActive(false);
    setRoadmapProgress(createRoadmapProgress());
    setSelectedRoadmapNodeId(null);
    lessonRuntimeRef.current = null;
    conceptMachineRef.current = null;
    conceptMachineSnapshotRef.current = null;
    setConceptMachineSnapshot(null);
    lessonGateRef.current = null;
    lessonStartedRef.current = false;
    lessonUnsubsRef.current.forEach(fn => fn?.());
    lessonUnsubsRef.current = [];
    if (!title || !availableChapters.length || !pdfDocRef.current) return;
    let cancelled = false;
    (async () => {
      let firstText = '';
      try {
        for (const p of [1, 2]) {
          if (p <= numPages) firstText += ' ' + (await extractPageText(p));
        }
      } catch {}
      if (cancelled) return;
      const match = detectChapter(title, firstText, availableChapters);
      if (!match) return;
      setDetectedChapter(match);
      try {
        const chap = await fetch(`${BACKEND}/api/lessons/chapter/${match.chapter}`).then(r => r.json());
        if (!cancelled) {
          setChapterConcepts(chap.concepts || []);
          setChapterLessonPlan(chap.lesson_plan || null);
        }
      } catch (e) { console.warn('[concepts] chapter fetch failed:', e.message); }
    })();
    return () => { cancelled = true; };
  }, [title, availableChapters, numPages, extractPageText]);

  // ── Tutor event logger (for student model + state transitions) ─
  const logTutorEvent = useCallback((concept_id, event, payload) => {
    fetch(`${BACKEND}/api/lessons/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: title || 'anon', concept_id, event, payload: payload || null }),
    }).catch(() => {});
  }, [title]);

  // ── Recompute active concepts whenever currentPage / pageText / chapter changes.
  // Heuristic: a concept is "active" for the current page if either
  //   (a) its position.section_title appears in the current page text, OR
  //   (b) its key_passage quote appears in the current page text.
  // We rank by overlap so the most-mentioned concept comes first.
  useEffect(() => {
    if (!chapterConcepts.length || !pageText) { setActiveConcepts([]); return; }
    const txt = pageText.toLowerCase();
    const scored = chapterConcepts.map(c => {
      let score = 0;
      const sectionTitle = (c.position?.section_title || '').toLowerCase();
      if (sectionTitle && txt.includes(sectionTitle)) score += 3;
      const title = (c.title || '').toLowerCase();
      if (title && txt.includes(title)) score += 4;
      const aliases = c.aliases || [];
      for (const a of aliases) if (a && txt.includes(a.toLowerCase())) score += 2;
      const kp = c.key_passage?.quote ? c.key_passage.quote.toLowerCase() : '';
      if (kp && txt.includes(kp.slice(0, 40))) score += 5;
      return { ...c, _score: score };
    }).filter(c => c._score > 0)
      .sort((a, b) => b._score - a._score);
    setActiveConcepts(scored.slice(0, 4));
  }, [chapterConcepts, pageText, currentPage]);

  useEffect(() => {
    if (!title || !currentPage || lastTrackedPageRef.current === currentPage) return;
    const now = Date.now();
    const previousPage = lastTrackedPageRef.current || currentPage;
    const durationMs = now - pageArrivalTimeRef.current;
    if (durationMs > 1500) {
      appendLearnerEvent('page_reading_elapsed', {
        to: 'reading',
        page: previousPage,
        durationMs,
        readingMs: durationMs,
        tutorAction: 'track_reading_time',
      });
    }
    appendLearnerEvent('page_changed', { to: 'reading', page: currentPage });
    lastTrackedPageRef.current = currentPage;
    pageArrivalTimeRef.current = now;
  }, [title, currentPage, appendLearnerEvent]);

  useEffect(() => {
    const primary = activeConcepts[0];
    const conceptId = primary?.id || primary?.concept_id;
    if (!title || !conceptId || lastTrackedConceptRef.current === conceptId) return;
    const now = Date.now();
    const previousConceptId = lastTrackedConceptRef.current;
    const durationMs = now - conceptArrivalTimeRef.current;
    if (previousConceptId && durationMs > 1500) {
      const previousTitle = learnerSessionRef.current?.currentConceptTitle || previousConceptId;
      appendLearnerEvent('concept_reading_elapsed', {
        to: 'reading',
        conceptId: previousConceptId,
        conceptTitle: previousTitle,
        durationMs,
        readingMs: durationMs,
        tutorAction: 'track_concept_time',
      });
      learnerModelRef.current.applyEvidence(previousConceptId, {
        conceptTitle: previousTitle,
        readingMs: durationMs,
      });
      setLearnerModelSnapshot(learnerModelRef.current.all());
      try {
        localStorage.setItem(
          `ar_learner_model::${titleRef.current || 'book'}`,
          JSON.stringify(learnerModelRef.current.serialize()),
        );
      } catch { /* ignore persistence failures */ }
    }
    appendLearnerEvent('concept_focus_changed', {
      to: 'reading',
      concept: primary,
      conceptId,
      conceptTitle: primary.title,
      tutorAction: 'track_focus',
    });
    lastTrackedConceptRef.current = conceptId;
    conceptArrivalTimeRef.current = now;
  }, [title, activeConcepts, appendLearnerEvent]);

  // ── Page nav ─────────────────────────────────────────────
  const goTo = useCallback((p) => {
    const clamped = Math.min(Math.max(1, p), numPages || 1);
    setCurrentPage(clamped); setPageInput(String(clamped));
    pageRefs.current[clamped - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [numPages]);

  // Navigate to a page (saving back state if changing page) and apply highlights
  const navigateWithBack = useCallback((targetPage, phrases) => {
    const curPage = currentPageRef.current;
    if (targetPage && targetPage !== curPage) {
      setBackState({ page: curPage, scrollTop: scrollContainerRef.current?.scrollTop || 0 });
      goTo(targetPage);
    }
    if (phrases?.length) {
      setPdfHighlights(phrases.map(p => typeof p === 'string' ? { phrase: p, page: targetPage || curPage } : p));
    }
  }, [goTo]);
  navigateWithBackRef.current = navigateWithBack;

  const goBack = useCallback(() => {
    if (!backState) return;
    const { page, scrollTop } = backState;
    goTo(page);
    // Restore scroll position after page renders
    setTimeout(() => {
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = scrollTop;
    }, 350);
    setBackState(null);
    setPdfHighlights([]);
  }, [backState, goTo]);

  const currentLessonStatePayload = useCallback(() => {
    const runtime = lessonRuntimeRef.current;
    const state = runtime?.currentState?.();
    return state?.payload || null;
  }, []);

  const promptCurrentLessonState = useCallback(() => {
    const runtime = lessonRuntimeRef.current;
    const id = runtime?.currentStateId?.();
    const state = runtime?.currentState?.();
    if (!id || !state || runtime.phase !== 'running') return;
    if (lessonLastPromptedStateRef.current === id) return;
    lessonLastPromptedStateRef.current = id;

    const payload = state?.payload || {};
    const titleText = payload.title || payload.concept_id || id;
    const section = payload.position?.section_title || payload.position?.section || '';
    const conceptPrompts = [
      `What do you think **${titleText}** is doing in this paragraph?`,
      `In one sentence, how would you describe **${titleText}** from the text?`,
      `What would change in the image if **${titleText}** changed?`,
      `What clues in this section tell you what **${titleText}** means?`,
    ];
    const remediationPrompts = [
      `Look back at the sentence around **${titleText}**: what quantity is it relating, and what stays fixed?`,
      `Try grounding **${titleText}** in the formula: which symbol is the input, and which is the output?`,
      `Use the figure/text together: what is **${titleText}** comparing?`,
    ];
    const promptIndex = Number(lessonLastPromptedStateRef.current === id);
    const promptText = state?.kind === 'REMEDIATION'
      ? remediationPrompts[promptIndex % remediationPrompts.length]
      : conceptPrompts[promptIndex % conceptPrompts.length];

    setChapterLessonStateId(id);
    setMessages(m => [...m, {
      role: 'assistant',
      content: promptText,
      _lessonState: true,
    }]);
    if (payload.key_passage?.quote) {
      setPdfHighlights([payload.key_passage.quote]);
    } else if (section) {
      setPdfHighlights([section]);
    }
    if (payload.concept_id) {
      logTutorEvent(payload.concept_id, state?.kind === 'REMEDIATION' ? 'lesson_remediation_enter' : 'lesson_state_enter', { state_id: id });
      syncConceptMachine('concept_fsm_active_substate', machine => machine.markActiveSubstate('explain', {
        conceptId: payload.concept_id,
        reason: state?.kind === 'REMEDIATION' ? 'remediation_prompt' : 'tutor_prompt',
      }), {
        to: state?.kind === 'REMEDIATION' ? 'remediating' : 'prompted',
        lessonNode: id,
        conceptId: payload.concept_id,
        conceptTitle: titleText,
        tutorAction: 'active_substate_explain',
      });
    }
    appendLearnerEvent('lesson_prompted', {
      to: state?.kind === 'REMEDIATION' ? 'remediating' : 'prompted',
      fsmEvent: state?.kind === 'REMEDIATION' ? 'help_requested' : 'tutor_prompt',
      lessonNode: id,
      conceptId: payload.concept_id,
      conceptTitle: titleText,
      tutorAction: state?.kind === 'REMEDIATION' ? 'remediate' : 'guide_reading',
    });
  }, [appendLearnerEvent, logTutorEvent, syncConceptMachine]);

  const renderLessonState = useCallback(({ id, state }) => {
    setChapterLessonStateId(id);
    const payload = state?.payload || {};
    if (payload.key_passage?.quote) {
      setPdfHighlights([payload.key_passage.quote]);
    } else if (payload.position?.section_title) {
      setPdfHighlights([payload.position.section_title]);
    }
  }, []);

  const startChapterLesson = useCallback(() => {
    if (!chapterLessonPlan || lessonStartedRef.current) return;
    lessonStartedRef.current = true;
    lessonUnsubsRef.current.forEach(fn => fn?.());
    lessonUnsubsRef.current = [];
    const runtime = new LessonRuntime(chapterLessonPlan);
    lessonRuntimeRef.current = runtime;
    const conceptMachine = new ConceptStateMachine(chapterLessonPlan);
    conceptMachineRef.current = conceptMachine;
    const initialConceptSnapshot = conceptMachine.snapshot();
    conceptMachineSnapshotRef.current = initialConceptSnapshot;
    setConceptMachineSnapshot(initialConceptSnapshot);
    lessonGateRef.current = null;
    lessonLastPromptedStateRef.current = null;
    setChapterLessonPhase('running');
    setGuidedReadingActive(true);
    setRoadmapProgress({ ...createRoadmapProgress(), phase: 'running' });

    lessonUnsubsRef.current.push(runtime.bus.on('phase:change', ({ to }) => {
      setChapterLessonPhase(to);
      setRoadmapProgress(prev => ({ ...prev, phase: to }));
    }));
    lessonUnsubsRef.current.push(runtime.bus.on('state:enter', payload => {
      renderLessonState(payload);
      if (payload.state?.kind === 'CONCEPT') {
        hintsThisConceptRef.current = 0;
        syncConceptMachine('concept_fsm_entered', machine => machine.enterConcept(payload), {
          to: 'reading',
          lessonNode: payload.id,
          tutorAction: 'enter_concept_state',
        });
      }
      appendLearnerEvent('lesson_state_enter', {
        to: 'reading',
        lessonNode: payload.id,
        conceptId: payload.state?.payload?.concept_id,
        conceptTitle: payload.state?.payload?.title,
        tutorAction: 'enter_node',
      });
      setRoadmapProgress(prev => ({
        ...prev,
        currentStateId: payload.id,
        activeGateId: null,
        visited: { ...prev.visited, [payload.id]: true },
      }));
      setSelectedRoadmapNodeId(payload.state?.payload?.concept_id || payload.id);
    }));
    lessonUnsubsRef.current.push(runtime.bus.on('gate:enter', ({ gate }) => {
      const scenarioIndex = tutorScenarioCountRef.current;
      tutorScenarioCountRef.current += 1;
      const question = buildDynamicGateQuestion(gate, scenarioIndex);
      lessonGateRef.current = gate;
      syncConceptMachine('concept_fsm_gate_entered', machine => machine.enterGate(gate), {
        to: 'prompted',
        lessonNode: gate.id,
        tutorAction: 'enter_assessment_gate',
      });
      setRoadmapProgress(prev => ({ ...prev, activeGateId: gate.id }));
      if (gate?.payload?.concept_id) setSelectedRoadmapNodeId(gate.payload.concept_id);
      pendingTutorQuestion.current = {
        text: question,
        chapterPage: currentPageRef.current,
        lessonGateId: gate.id,
      };
      setTutorGate('QUESTION');
      const gateMessage = {
        role: 'assistant',
        content: question,
        _tutorAsk: true,
        _lessonGate: true,
      };
      setMessages(m => {
        const next = [...m, gateMessage];
        messagesRef.current = next;
        return next;
      });
      appendLearnerEvent('quiz_prompted', {
        to: 'prompted',
        fsmEvent: 'tutor_prompt',
        lessonNode: gate.id,
        conceptId: gate?.payload?.concept_id,
        conceptTitle: gate?.payload?.title,
        tutorAction: 'ask_check',
      });
      if (gate?.payload?.concept_id) logTutorEvent(gate.payload.concept_id, 'lesson_gate_enter', { gate_id: gate.id });
    }));
    lessonUnsubsRef.current.push(runtime.bus.on('gate:resolve', ({ gate, verdict }) => {
      syncConceptMachine('concept_fsm_gate_resolved', machine => machine.resolveGate({ gate, verdict }), {
        to: verdict === 'pass' ? 'correct' : 'needs_support',
        lessonNode: gate.id,
        tutorAction: verdict === 'pass' ? 'mark_concept_mastered' : 'route_to_support_targets',
        payload: { verdict },
      });
      setRoadmapProgress(prev => ({
        ...prev,
        activeGateId: null,
        gateResults: { ...prev.gateResults, [gate.id]: verdict },
        branchEdges: verdict === 'fail' ? { ...prev.branchEdges, [gate.id]: true } : prev.branchEdges,
      }));
      if (gate?.payload?.concept_id) {
        logTutorEvent(gate.payload.concept_id, verdict === 'pass' ? 'gate_pass' : 'gate_fail', { gate_id: gate.id });
      }
      appendLearnerEvent('gate_resolved', {
        to: verdict === 'pass' ? 'correct' : 'needs_support',
        lessonNode: gate.id,
        conceptId: gate?.payload?.concept_id,
        conceptTitle: gate?.payload?.title,
        tutorAction: verdict === 'pass' ? 'advance' : 'choose_support',
        payload: { verdict },
        masteredNode: verdict === 'pass' ? gate.id : null,
      });
    }));
    lessonUnsubsRef.current.push(runtime.bus.on('branch:enter', ({ gate, branchIds }) => {
      syncConceptMachine('concept_fsm_support_entered', machine => machine.enterSupport({ gate, branchIds }), {
        to: 'reviewing',
        lessonNode: gate.id,
        tutorAction: 'enter_support_targets',
        payload: { branchIds },
      });
      appendLearnerEvent('support_branch_entered', {
        to: 'reviewing',
        lessonNode: gate.id,
        conceptId: gate?.payload?.concept_id,
        conceptTitle: gate?.payload?.title,
        tutorAction: 'support_branch',
        payload: { branchIds },
      });
      setRoadmapProgress(prev => ({
        ...prev,
        branchEdges: { ...prev.branchEdges, [gate.id]: true },
        visited: branchIds.reduce((acc, id) => ({ ...acc, [id]: true }), prev.visited),
      }));
    }));
    lessonUnsubsRef.current.push(runtime.bus.on('lesson:complete', () => {
      setChapterLessonPhase('done');
      setRoadmapProgress(prev => ({ ...prev, phase: 'done', activeGateId: null }));
      appendLearnerEvent('lesson_completed', { to: 'completed', tutorAction: 'complete_chapter' });
      setMessages(m => [...m, {
        role: 'assistant',
        content: 'Nice work. You made it through the main ideas I wanted to check in this chapter.',
        _lessonState: true,
      }]);
    }));

    runtime.start();
    appendLearnerEvent('lesson_started', { to: 'reading', tutorAction: 'start_guided_reading' });
    logTutorEvent('_chapter', 'lesson_started', { plan_id: chapterLessonPlan.meta?.id, title: chapterLessonPlan.meta?.title });
  }, [appendLearnerEvent, chapterLessonPlan, logTutorEvent, renderLessonState, syncConceptMachine]);

  const advanceChapterLesson = useCallback(() => {
    const runtime = lessonRuntimeRef.current;
    if (!runtime) return startChapterLesson();
    if (pendingTutorQuestion.current || ['QUESTION', 'REASK', 'SCORING', 'REMEDIATE'].includes(tutorGateRef.current)) return;
    if (runtime.phase === 'gating') return;
    if (lessonLastPromptedStateRef.current !== runtime.currentStateId()) return promptCurrentLessonState();
    runtime.advance();
  }, [promptCurrentLessonState, startChapterLesson]);

  useEffect(() => {
    if (!chapterLessonPlan || !detectedChapter || lessonRuntimeRef.current) return;
    if (lessonStartedRef.current) return;
    const isImaging = detectedChapter.chapter === 5
      || /imaging/i.test(detectedChapter.title || chapterLessonPlan.meta?.title || '');
    if (!isImaging) return;
    startChapterLesson();
  }, [chapterLessonPlan, detectedChapter, startChapterLesson]);

  useEffect(() => {
    const first = chapterLessonPlan?.roadmap?.nodes?.find(n => n.type === 'concept')?.id;
    if (first) setSelectedRoadmapNodeId(prev => prev || first);
  }, [chapterLessonPlan]);

  useEffect(() => () => {
    lessonUnsubsRef.current.forEach(fn => fn?.());
    lessonUnsubsRef.current = [];
  }, []);

  // ── Scroll → page tracking ───────────────────────────────
  useEffect(() => {
    if (!numPages || !scrollContainerRef.current) return;
    pageVisibility.current.clear();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => pageVisibility.current.set(Number(e.target.dataset.page), e.intersectionRatio));
      let best = 1, bestRatio = -1;
      pageVisibility.current.forEach((r, p) => { if (r > bestRatio) { bestRatio = r; best = p; } });
      if (bestRatio >= 0) { setCurrentPage(best); setPageInput(String(best)); }
    }, { root: scrollContainerRef.current, threshold: [0, 0.25, 0.5, 0.75, 1] });
    pageRefs.current.forEach((ref, i) => {
      if (ref) { ref.dataset.page = String(i + 1); observer.observe(ref); }
    });
    return () => observer.disconnect();
  }, [numPages]);

  useEffect(() => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [pdfUrl]);

  // ── Page text extraction ──────────────────────────────────
  useEffect(() => {
    if (!pdfDocRef.current) return;
    extractPageText(currentPage).then(text => {
      setPageText(text);
      setOutlineFocusText(scrollFractionRef.current < 0.16 ? '' : getSectionAtFraction(text, scrollFractionRef.current));
    });
  }, [currentPage, extractPageText]);

  // ── RAG: index all pages on PDF load ─────────────────────
  useEffect(() => {
    if (!numPages || !title || !pdfDocRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        // Skip if server already has this book indexed (same server session)
        const status = await fetch(`${BACKEND}/api/embed-status?title=${encodeURIComponent(title)}`).then(r => r.json()).catch(() => ({}));
        if (status.indexed) { setRagStatus('ready'); setTimeout(() => setRagStatus('idle'), 2000); return; }

        const pages = [];
        // Extract all pages concurrently in batches of 10
        for (let start = 1; start <= numPages; start += 10) {
          if (cancelled) return;
          const batch = Array.from({ length: Math.min(10, numPages - start + 1) }, (_, i) => start + i);
          const texts = await Promise.all(batch.map(p => extractPageText(p)));
          texts.forEach((text, i) => { if (text) pages.push({ pageNum: batch[i], text }); });
        }
        if (cancelled) return;
        const res = await fetch(`${BACKEND}/api/embed-pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, pages }),
        });
        if (!cancelled) { setRagStatus(res.ok ? 'ready' : 'idle'); if (res.ok) setTimeout(() => setRagStatus('idle'), 2000); }
      } catch { if (!cancelled) setRagStatus('idle'); }
    })();
    return () => { cancelled = true; };
  }, [numPages, title, extractPageText]);

  // ── Pre-generated interactive figure overlays ────────────
  useEffect(() => {
    const chapterKey = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const layouts = PREGENERATED_OVERLAY_LAYOUTS[chapterKey];
    if (!pdfUrl || !pageWidth || !pageHeight || !layouts?.length) return;

    let cancelled = false;
    (async () => {
      try {
        const index = await fetch(`${BACKEND}/api/lessons/figures`).then(r => r.json());
        const figures = Array.isArray(index.figures) ? index.figures : [];
        const overlays = [];

        for (const layout of layouts) {
          const figure = figures.find(f =>
            f.interactive_html &&
            (f.filename || '').replace(/\.[^.]+$/, '') === layout.figureStem
          );
          if (!figure) continue;

          const htmlUrl = figureInlineHtmlUrl(figure);
          if (!htmlUrl) continue;
          const html = await fetch(htmlUrl).then(r => r.text());
          if (!html.trimStart().startsWith('<')) continue;
          let figureAspect = null;
          try {
            const imagePath = figure.static_image || figure.thumbnail;
            if (imagePath) {
              const assetPath = imagePath.replace(/^assets\//, '');
              figureAspect = (await imageMetricsFromUrl(`${BACKEND}/lesson-assets/${assetPath}`)).aspect;
            }
          } catch {}

          const pageEl = pageRefs.current[layout.page - 1];
          const pageLeft = pageEl?.offsetLeft || 0;
          const pageTop = pageEl?.offsetTop || ((layout.page - 1) * ((pageHeight || 900) + 16));
          overlays.push({
            id: -1000 - overlays.length,
            source: 'pregenerated',
            htmlSource: figureInlineHtmlSource(figure),
            resultId: figure.result_id || figure.latest_result_id,
            figureStem: layout.figureStem,
            page: layout.page,
            scrollRect: {
              x: pageLeft + layout.rect.x * pageWidth,
              y: pageTop + layout.rect.y * pageHeight,
              w: layout.rect.w * pageWidth,
              h: layout.rect.h * pageHeight,
            },
            html: inlineFigureHtml(html),
            figureAspect,
            loading: false,
            visible: false,
            type: figure.category?.includes('2d') || figure.interactive_kind === '2d' ? 'figure-2d' : 'figure',
            linkedPage: layout.page,
            linkedPhrases: [layout.figureStem],
          });
        }

        if (cancelled || overlays.length === 0) return;
        setFigureOverlays(prev => {
          const withoutPreviousAuto = prev.filter(o => o.source !== 'pregenerated');
          const withoutLoadingPlaceholders = withoutPreviousAuto.filter(o => !o.loading);
          return [...overlays, ...withoutLoadingPlaceholders];
        });
      } catch (err) {
        console.warn('[pregenerated-overlays] failed:', err.message);
      }
    })();

    return () => { cancelled = true; };
  }, [pdfUrl, title, pageWidth, pageHeight, setFigureOverlays]);

  // ── PDF annotation highlights (amber, permanent, clickable) ─
  useEffect(() => {
    // Clear previous annotation marks
    document.querySelectorAll('.pdf-ann-hl').forEach(el => {
      el.style.backgroundColor = '';
      el.style.cursor = '';
      el.classList.remove('pdf-ann-hl');
      delete el.dataset.annId;
    });
    const pageAnns = annotationsRef.current.filter(a => a.page === currentPage);
    if (!pageAnns.length) return;

    const apply = setTimeout(() => {
      const pageRoot = pageRefs.current[currentPage - 1] || document;
      const spans = [...pageRoot.querySelectorAll('.react-pdf__Page__textContent span')];
      const spanIndex = buildSpanTextIndex(spans);
      pageAnns.forEach(ann => {
        const range = findPdfTextRange(spanIndex.text, ann.phrase);
        spansOverlappingRange(spanIndex.entries, range).forEach(span => {
          span.style.backgroundColor = 'rgba(251,191,36,0.35)';
          span.style.borderRadius = '2px';
          span.style.cursor = 'pointer';
          span.classList.add('pdf-ann-hl');
          span.dataset.annId = ann.id;
        });
      });
    }, 200);
    return () => clearTimeout(apply);
  }, [annotations, currentPage]);

  // ── PDF text highlighting (tutor — yellow, temporary) ────
  useEffect(() => {
    const clearHl = () => document.querySelectorAll('.pdf-hl').forEach(el => {
      el.style.backgroundColor = '';
      el.style.borderRadius = '';
      el.style.boxShadow = '';
      el.style.outline = '';
      el.classList.remove('pdf-hl');
    });
    clearHl();
    if (!pdfHighlights.length) return;

    let firstMarkedSpan = null;
    const markSpan = span => {
      span.style.backgroundColor = 'rgba(255,220,0,0.78)';
      span.style.borderRadius = '3px';
      span.style.boxShadow = '0 0 0 2px rgba(255,220,0,0.32), 0 0 12px rgba(255,220,0,0.45)';
      span.style.outline = '1px solid rgba(255,235,120,0.75)';
      span.classList.add('pdf-hl');
      if (!firstMarkedSpan) firstMarkedSpan = span;
    };

    const apply = setTimeout(() => {
      const pageRoot = pageRefs.current[currentPage - 1] || document;
      const spans = [...pageRoot.querySelectorAll('.react-pdf__Page__textContent span')]
        .filter(span => normalizePdfMatchText(span.textContent).length > 0);
      const spanIndex = buildSpanTextIndex(spans);
      const targets = pdfHighlights
        .map(h => typeof h === 'string' ? { phrase: h, page: null } : h)
        .filter(h => h?.phrase && (!h.page || h.page === currentPage));

      targets.forEach(({ phrase }) => {
        const range = findPdfTextRange(spanIndex.text, phrase);
        spansOverlappingRange(spanIndex.entries, range).forEach(markSpan);
      });
      firstMarkedSpan?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }, 150);

    // Auto-clear highlights after 8s — they are transient indicators, not permanent marks
    const autoClear = setTimeout(() => {
      clearHl();
      setPdfHighlights([]);
    }, 8000);

    return () => { clearTimeout(apply); clearTimeout(autoClear); };
  }, [pdfHighlights, currentPage]);

  // Blue figure-link PDF highlights removed — too noisy.

  // ── Draggable overlay buttons ─────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      if (!btnDragRef.current) return;
      const { overlayId, startX, startY, startOx, startOy } = btnDragRef.current;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      setFigureOverlays(prev => prev.map(o =>
        o.id === overlayId ? { ...o, btnOffset: { x: startOx + dx, y: startOy + dy } } : o
      ));
    };
    const onUp = () => { btnDragRef.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [setFigureOverlays]);

  // ── Track mouse position for tooltip placement ──────────────
  useEffect(() => {
    const onMove = (e) => { mousePosRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ── Figure popup + tooltip via postMessage (rendered outside iframe) ──
  useEffect(() => {
    const onMessage = (e) => {
      // Restore hoveredOverlayIdRef when mouse is inside an iframe (React onMouseLeave fires
      // on the wrapper div when the cursor crosses into the iframe's browsing context).
      if (e.data?.type === 'alex-iframe-enter') {
        hoveredOverlayIdRef.current = e.data.overlayId;
        return;
      }
      if (e.data?.type === 'alex-iframe-leave') {
        if (hoveredOverlayIdRef.current === e.data.overlayId) hoveredOverlayIdRef.current = null;
        return;
      }
      // Hover tooltip from equation iframe
      // Live cursor-move update from inside iframe
      if (e.data?.type === 'alex-tooltip-move') {
        const overlay = figureOverlaysRef.current.find(o => o.id === hoveredOverlayIdRef.current);
        const container = scrollContainerRef.current;
        if (overlay && container) {
          const cRect = container.getBoundingClientRect();
          const iframeLeft = cRect.left + overlay.scrollRect.x;
          const iframeTop  = cRect.top - container.scrollTop + overlay.scrollRect.y;
          const x = Math.min(iframeLeft + e.data.mx + 12, window.innerWidth - 228);
          const y = Math.max(4, iframeTop + e.data.my - 28);
          setFigureTooltip(prev => prev ? { ...prev, x, y } : prev);
        }
        return;
      }
      if (e.data?.type === 'alex-tooltip') {
        if (e.data.text) {
          // Use iframe cursor coords + overlay offset for accurate position
          const overlay = figureOverlaysRef.current.find(o => o.id === hoveredOverlayIdRef.current);
          const container = scrollContainerRef.current;
          let x = mousePosRef.current.x + 12;
          let y = mousePosRef.current.y - 28;
          if (overlay && container && e.data.mx !== undefined) {
            const cRect = container.getBoundingClientRect();
            const iframeLeft = cRect.left + overlay.scrollRect.x;
            const iframeTop  = cRect.top - container.scrollTop + overlay.scrollRect.y;
            x = iframeLeft + e.data.mx + 12;
            y = iframeTop  + e.data.my - 28;
          }
          x = Math.min(x, window.innerWidth - 228);
          y = Math.max(4, y);
          setFigureTooltip({ text: e.data.text, x, y });
        } else {
          setFigureTooltip(null);
        }
        return;
      }
      // Strip literal HTML tags from body (figure JS sometimes stores HTML as plain text)
      const stripHtml = (s) => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      // Click popup
      if (e.data?.type === 'alex-popup') {
        if (e.data.title !== null && e.data.title !== undefined) {
          // Compute position: equations → right side; figures → below
          const container = scrollContainerRef.current;
          const overlay = figureOverlaysRef.current.find(o => o.id === hoveredOverlayIdRef.current);
          let left = (container?.getBoundingClientRect().left ?? 16) + 8;
          let top  = null;
          if (overlay && container) {
            const cRect   = container.getBoundingClientRect();
            const scrollTop = container.scrollTop;
            const isEq    = overlay.type === 'equation';
            const oLeft   = cRect.left + overlay.scrollRect.x;
            const oTop    = cRect.top - scrollTop + overlay.scrollRect.y;
            const oRight  = oLeft + overlay.scrollRect.w;
            const oBottom = oTop  + overlay.scrollRect.h;
            if (isEq) {
              left = Math.max(8, Math.min(oLeft, window.innerWidth - 284));
              top  = oBottom + 6;
              if (top + 120 > window.innerHeight) top = Math.max(8, oTop - 126);
            } else {
              left = oLeft;
              top  = oBottom + 6;
              if (top + 160 > window.innerHeight) top = oTop - 164;
              top  = Math.max(8, top);
            }
          }
          clearTimeout(popupDismissTimer.current);
          setFigurePopup({ title: stripHtml(e.data.title), body: stripHtml(e.data.body), left, top });
          popupDismissTimer.current = setTimeout(() => setFigurePopup(null), 15000);
        } else {
          clearTimeout(popupDismissTimer.current);
          setFigurePopup(null);
        }
      }
    };
    const onDocClick = (e) => {
      // Close popup on click outside the popup panel
      if (!e.target.closest?.('.figure-popup-panel')) {
        clearTimeout(popupDismissTimer.current);
        setFigurePopup(null);
      }
    };
    window.addEventListener('message', onMessage);
    document.addEventListener('click', onDocClick, true);
    return () => {
      window.removeEventListener('message', onMessage);
      document.removeEventListener('click', onDocClick, true);
    };
  }, []);

  // ── Dwell-based tutor check-in ────────────────────────────
  // Fires ONE short question after the user has been on a section for 10s.
  // Resets whenever the user scrolls significantly (>5% of page height).
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const fireDwellCheckin = async () => {
      if (!tutorModeRef.current || loadingRef.current) return;
      if (!pdfDocRef.current) return; // no PDF loaded yet — don't burn the cooldown
      if (tutorGateRef.current !== 'IDLE') return; // gate is active — wait for current exchange to resolve
      const now = Date.now();
      if (now - lastCheckinRef.current < 120000) return; // 2min cooldown between auto-questions

      // Primary guard: never ask if the last message is ANY assistant message the user hasn't replied to
      const visible = messagesRef.current.filter(m => !m._tutorCheckin);
      const lastVisible = visible[visible.length - 1];
      if (lastVisible?.role === 'assistant') return; // wait for user to reply first

      // Limit: max 1 auto-question before user has replied at all this session
      const userReplies = visible.filter(m => m.role === 'user');
      if (userReplies.length === 0 && totalTutorAsksRef.current >= 1) return;

      // Limit: max 2 auto-questions per chapter section
      const chapterPage = getActivePageNum(outlineRef.current, currentPageRef.current) || 0;
      const chapterCount = chapterQCountRef.current[chapterPage] || 0;
      if (chapterCount >= 5) return;

      lastCheckinRef.current = now;

      const page = currentPageRef.current;
      const frac = scrollFractionRef.current;
      const text = await extractPageText(page);
      if (!text) return;
      const readingSection = getSectionAtFraction(text, frac);
      const lessonPayload = currentLessonStatePayload();
      const activePageConcept = activeConceptsRef.current?.[0] || null;
      const tutorFocusConcept = activePageConcept || lessonPayload || null;
      const tutorFocusTitle = tutorFocusConcept?.title || lessonPayload?.title || '';

      setLoading(true);
      const history = messagesRef.current.filter(m => !m._tutorCheckin);
      const needsUserEnd = history.length === 0 || history[history.length - 1].role !== 'user';
      const checkinMsg = { role: 'user', content: `[CHECKIN]`, _tutorCheckin: true };
      const apiMsgs = needsUserEnd ? [...history, checkinMsg] : history;

      try {
        const res = await fetch(`${BACKEND}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: apiMsgs,
            bookTitle: titleRef.current,
            currentPage: page,
            pageText: text,
            readingSection,
            activeLessonConcept: tutorFocusTitle || undefined,
            tutorMode: true,
            isTutorCheckin: true,
            outlineContext: flattenOutline(outlineRef.current).join('\n'),
            learnerHistory: buildLearnerHistory(titleRef.current),
          }),
        });
        const data = await res.json();
        if (res.ok && data.reply) {
          chapterQCountRef.current[chapterPage] = chapterCount + 1;
          totalTutorAsksRef.current++;
          const hlTutor = parseHighlights(data.reply);
          const gotoTutor = parseGoto(data.reply);
          const stripped = gotoTutor ? stripGoto(data.reply) : data.reply;
          const cleanTutor = stripHighlights(stripped);
          const msgPage = currentPageRef.current;
          const highlightTargets = hlTutor.map(phrase => ({ phrase, page: msgPage }));
          if (highlightTargets.length) setPdfHighlights(highlightTargets);
          setMessages(m => [...m, {
            role: 'assistant', content: cleanTutor, _tutorAsk: true,
            hlPhrases: highlightTargets.length ? highlightTargets : undefined,
            hlPage: msgPage,
          }]);
          appendLearnerEvent('auto_checkin_prompted', {
            to: 'prompted',
            fsmEvent: 'tutor_prompt',
            page: msgPage,
            concept: tutorFocusConcept,
            conceptTitle: tutorFocusTitle,
            tutorAction: 'dwell_checkin',
            payload: { readingSection: readingSection?.slice?.(0, 180) || null },
          });
          if (gotoTutor && gotoTutor !== msgPage) {
            setTimeout(() => navigateWithBackRef.current?.(gotoTutor, hlTutor), 900);
          }
          // ── Advance gate to QUESTION state — waiting for user reply ──
          pendingTutorQuestion.current = { text: cleanTutor, chapterPage };
          setTutorGate('QUESTION');
        }
      } catch {} finally { setLoading(false); }
    };

    const startDwellTimer = () => {
      clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = setTimeout(fireDwellCheckin, 15000); // 15s dwell before asking
    };

    const onScroll = () => {
      const ref = pageRefs.current[currentPageRef.current - 1];
      if (ref) {
        const cr = container.getBoundingClientRect();
        const pr = ref.getBoundingClientRect();
        const newFrac = Math.max(0, Math.min(1, (cr.top + cr.height * 0.4 - pr.top) / pr.height));
        const moved = Math.abs(newFrac - scrollFractionRef.current) > 0.05;
        scrollFractionRef.current = newFrac;
        setOutlineFocusText(newFrac < 0.16 ? '' : getSectionAtFraction(pageTextRef.current, newFrac));
        if (moved) startDwellTimer();
      }
    };

    // Also start timer on page arrival
    startDwellTimer();

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      clearTimeout(dwellTimerRef.current);
    };
  // Re-attach when page changes so startDwellTimer fires for the new page.
  // tutorMode changes are handled via ref — no re-attach needed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appendLearnerEvent, currentPage, extractPageText, title, currentLessonStatePayload]);

  // ── Annotation click / double-click on PDF text layer ────
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let lastClick = { target: null, time: 0 };

    const onClick = (e) => {
      const span = e.target.closest('.pdf-ann-hl');
      if (!span) return;
      const annId = span.dataset.annId;
      const ann = annotationsRef.current.find(a => a.id === annId);
      if (!ann) return;

      const now = Date.now();
      if (lastClick.target === span && now - lastClick.time < 400) {
        // Double-click → delete annotation
        setAnnotations(prev => prev.filter(a => a.id !== annId));
        setActiveAnnotation(cur => cur?.ann?.id === annId ? null : cur);
      } else {
        // Single click — check if live message exists in current session
        const liveEl = document.querySelector(`[data-ann-msg-id="${ann.msgId}"]`);
        if (liveEl) {
          // Same session: scroll to the message in chat
          liveEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          liveEl.classList.add('ann-flash');
          setTimeout(() => liveEl.classList.remove('ann-flash'), 1200);
        } else {
          // Future session: open the stored explainer preview panel
          setActiveAnnotation({ ann });
        }
      }
      lastClick = { target: span, time: now };
    };

    container.addEventListener('click', onClick);
    return () => container.removeEventListener('click', onClick);
  }, [setAnnotations]);

  // ── Figure select ─────────────────────────────────────────
  // Convert viewport coords → pdf-scroll-inner coords (accounts for padding + scroll)
  const toScrollCoords = (clientX, clientY) => {
    const c = scrollContainerRef.current;
    const r = c.getBoundingClientRect();
    const pl = parseFloat(getComputedStyle(c).paddingLeft) || 0;
    const pt = parseFloat(getComputedStyle(c).paddingTop) || 0;
    return {
      x: clientX - r.left - pl + c.scrollLeft,
      y: clientY - r.top  - pt + c.scrollTop,
    };
  };

  const onSelMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const { x, y } = toScrollCoords(e.clientX, e.clientY);
    dragStartRef.current = { x, y };
    setSelRect({ x, y, w: 0, h: 0 }); setPopupPos(null);
  }, []);

  const onSelMouseMove = useCallback((e) => {
    if (!dragStartRef.current) return;
    const { x: cx, y: cy } = toScrollCoords(e.clientX, e.clientY);
    const { x: sx, y: sy } = dragStartRef.current;
    setSelRect({ x: Math.min(sx, cx), y: Math.min(sy, cy), w: Math.abs(cx - sx), h: Math.abs(cy - sy) });
  }, []);

  const onSelMouseUp = useCallback((_e) => {
    if (!dragStartRef.current) return;
    dragStartRef.current = null;
    setSelRect(prev => {
      if (!prev || prev.w < 10 || prev.h < 10) { setPopupPos(null); return null; }
      setPopupPos({ x: prev.x, y: prev.y + prev.h + 8 });
      return prev;
    });
  }, []);

  useEffect(() => {
    if (!selectMode) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSelectMode(false); setSelRect(null); setPopupPos(null); dragStartRef.current = null;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectMode]);

  const captureAndSend = useCallback(async () => {
    if (!selRect || selRect.w < 10 || selRect.h < 10) return;
    setCapturing(true);
    try {
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const outCanvas = document.createElement('canvas');
      outCanvas.width  = Math.round(selRect.w);
      outCanvas.height = Math.round(selRect.h);
      const ctx = outCanvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, outCanvas.width, outCanvas.height);

      container.querySelectorAll('.pdf-page-wrapper').forEach(wrapper => {
        const canvas = wrapper.querySelector('canvas');
        if (!canvas) return;
        const cr = canvas.getBoundingClientRect();
        const pl = parseFloat(getComputedStyle(container).paddingLeft) || 0;
        const pt = parseFloat(getComputedStyle(container).paddingTop)  || 0;
        const canvasLeft = cr.left - containerRect.left - pl + container.scrollLeft;
        const canvasTop  = cr.top  - containerRect.top  - pt + container.scrollTop;
        const ix1 = Math.max(selRect.x, canvasLeft), iy1 = Math.max(selRect.y, canvasTop);
        const ix2 = Math.min(selRect.x + selRect.w, canvasLeft + cr.width);
        const iy2 = Math.min(selRect.y + selRect.h, canvasTop + cr.height);
        if (ix2 <= ix1 || iy2 <= iy1) return;
        const dpr = canvas.width / cr.width;
        ctx.drawImage(canvas,
          (ix1 - canvasLeft) * dpr, (iy1 - canvasTop) * dpr, (ix2 - ix1) * dpr, (iy2 - iy1) * dpr,
          ix1 - selRect.x, iy1 - selRect.y, ix2 - ix1, iy2 - iy1);
      });

      const imageData = outCanvas.toDataURL('image/png').split(',')[1];
      const userMsg = {
        role: 'user',
        content: 'Create an interactive 3D visualization of the figure in this image using Three.js with OrbitControls.',
        imageData, imageMimeType: 'image/png',
      };
      const next = [...messages, userMsg];
      setMessages(next);
      setSelectMode(false); setSelRect(null); setPopupPos(null);
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, bookTitle: title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally { setLoading(false); setCapturing(false); }
  }, [selRect, messages, title]);

  // ── Inline interactive figure overlay ─────────────────────
  // Shared canvas-capture helper: returns base64 PNG of selRect region
  const captureRegion = useCallback((rect) => {
    const container = scrollContainerRef.current;
    if (!container) return null;
    const containerRect = container.getBoundingClientRect();
    const outCanvas = document.createElement('canvas');
    outCanvas.width  = Math.round(rect.w);
    outCanvas.height = Math.round(rect.h);
    const ctx = outCanvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, outCanvas.width, outCanvas.height);
    container.querySelectorAll('.pdf-page-wrapper').forEach(wrapper => {
      const canvas = wrapper.querySelector('canvas');
      if (!canvas) return;
      const cr = canvas.getBoundingClientRect();
      const pl = parseFloat(getComputedStyle(container).paddingLeft) || 0;
      const pt = parseFloat(getComputedStyle(container).paddingTop)  || 0;
      const canvasLeft = cr.left - containerRect.left - pl + container.scrollLeft;
      const canvasTop  = cr.top  - containerRect.top  - pt + container.scrollTop;
      const ix1 = Math.max(rect.x, canvasLeft), iy1 = Math.max(rect.y, canvasTop);
      const ix2 = Math.min(rect.x + rect.w, canvasLeft + cr.width);
      const iy2 = Math.min(rect.y + rect.h, canvasTop + cr.height);
      if (ix2 <= ix1 || iy2 <= iy1) return;
      const dpr = canvas.width / cr.width;
      ctx.drawImage(canvas,
        (ix1 - canvasLeft) * dpr, (iy1 - canvasTop) * dpr, (ix2 - ix1) * dpr, (iy2 - iy1) * dpr,
        ix1 - rect.x, iy1 - rect.y, ix2 - ix1, iy2 - iy1);
    });
    return outCanvas.toDataURL('image/png').split(',')[1];
  }, []);

  const findPregeneratedFigure = useCallback(async (base64, contextText = '') => {
    const sourceImg = new Image();
    sourceImg.src = `data:image/png;base64,${base64}`;
    await sourceImg.decode();
    const selectedFingerprint = imageFingerprint(sourceImg);

    const index = await fetch(`${BACKEND}/api/lessons/figures`).then(r => r.json());
    const candidates = (Array.isArray(index.figures) ? index.figures : [])
      .filter(f => f.interactive_html && (f.static_image || f.thumbnail));

    const scored = [];
    for (const figure of candidates) {
      try {
        const imagePath = figure.static_image || figure.thumbnail;
        const assetPath = imagePath.replace(/^assets\//, '');
        const metrics = await imageMetricsFromUrl(`${BACKEND}/lesson-assets/${assetPath}`);
        const distance = fingerprintDistance(selectedFingerprint, metrics.fingerprint);
        const contextScore = figureContextScore(figure, contextText);
        const score = distance - contextScore * 0.12;
        scored.push({ figure, distance, contextScore, score, figureAspect: metrics.aspect });
      } catch (err) {
        console.warn('[pregenerated-match] candidate failed:', figure.filename, err.message);
      }
    }

    scored.sort((a, b) => a.score - b.score);
    const best = scored[0];
    const runnerUp = scored[1];
    console.log('[pregenerated-match]', scored.slice(0, 5).map(s => ({
      filename: s.figure.filename,
      distance: +s.distance.toFixed(3),
      contextScore: s.contextScore,
      score: +s.score.toFixed(3),
    })));

    if (!best) return null;
    const strongVisual = best.distance <= 0.26;
    const contextBacked = best.distance <= 0.48 && best.contextScore >= 3;
    const clearlyBetter = !runnerUp || (runnerUp.score - best.score) >= 0.055;
    const visuallyAcceptable = strongVisual || contextBacked;
    if (!visuallyAcceptable || !clearlyBetter) {
      console.warn('[pregenerated-match] rejected best candidate; refusing weak match', {
        filename: best.figure.filename,
        distance: +best.distance.toFixed(3),
        contextScore: best.contextScore,
        runnerUp: runnerUp?.figure?.filename,
        scoreGap: runnerUp ? +(runnerUp.score - best.score).toFixed(3) : null,
      });
      return null;
    }
    const htmlUrl = figureInlineHtmlUrl(best.figure);
    if (!htmlUrl) return null;
    const html = await fetch(htmlUrl).then(r => r.text());
    if (!html.trimStart().startsWith('<')) return null;
    return { ...best.figure, html: inlineFigureHtml(html), matchDistance: best.distance, figureAspect: best.figureAspect };
  }, []);

  const augmentFigureRect = useCallback(async (sourceRect, linkedPage = currentPageRef.current) => {
    if (!sourceRect || sourceRect.w < 10 || sourceRect.h < 10) return;
    setCapturing(true);
    const id = ++overlayIdRef.current;
    const rect = { ...sourceRect };

    // Capture link context for bidirectional navigation
    const STOP = new Set(['that','this','with','from','have','were','they','their','which','would','about','could','there','these','other','than','what','into','been','some','will','such','both','each','most','over','just','back','only','after','before','should','those','where','them','same','much','need','used','being','using','since','while','under','along']);
    const pageTextSnap = linkedPage === currentPageRef.current ? pageText : await extractPageText(linkedPage);
    const nearbyText = getSectionAtFraction(pageTextSnap, scrollFractionRef.current);
    const linkedPhrases = [...new Set(nearbyText.split(/\W+/).filter(w => w.length > 5 && !STOP.has(w.toLowerCase())))].slice(0, 6);

    try {
      const base64 = captureRegion(rect);
      if (!base64) return;

      // Remove any existing overlay that significantly overlaps this selection
      setFigureOverlays(prev => prev.filter(o => {
        if (!o.scrollRect) return true; // keep malformed entries rather than throw
        const a = o.scrollRect, b = rect;
        const ix = Math.max(0, Math.min(a.x+a.w, b.x+b.w) - Math.max(a.x, b.x));
        const iy = Math.max(0, Math.min(a.y+a.h, b.y+b.h) - Math.max(a.y, b.y));
        const smaller = Math.min(a.w*a.h, b.w*b.h);
        return !(smaller > 0 && (ix*iy)/smaller > 0.4);
      }));

      setFigureOverlays(prev => [...prev, {
        id, scrollRect: rect, html: null, loading: true, visible: true, type: 'classifying',
        source: 'detected', page: linkedPage, linkedPage, linkedPhrases,
      }]);
      setSelectMode(false); setSelRect(null); setPopupPos(null);

      if (PREFER_PREGENERATED_AUGMENTATION) {
        const pregenerated = await findPregeneratedFigure(base64, `${nearbyText}\n${pageTextSnap || ''}`);
        if (pregenerated) {
          setFigureOverlays(prev => prev.map(o =>
            o.id === id ? {
              ...o,
              source: 'detected',
              htmlSource: figureInlineHtmlSource(pregenerated),
              resultId: pregenerated.result_id,
              figureStem: (pregenerated.filename || '').replace(/\.[^.]+$/, ''),
              matchDistance: pregenerated.matchDistance,
              html: pregenerated.html,
              figureAspect: pregenerated.figureAspect,
              loading: false,
              type: pregenerated.category?.includes('2d') || pregenerated.interactive_kind === '2d' ? 'figure-2d' : 'figure',
              linkedPhrases: [(pregenerated.filename || '').replace(/\.[^.]+$/, ''), ...linkedPhrases],
            } : o
          ));
          return;
        }
        throw new Error('NO_PREGENERATED_MATCH');
      }

      // ── Step 1: fast classify (~300ms, Haiku) ─────────────
      const clsRes = await fetch(`${BACKEND}/api/classify-figure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64, imageMimeType: 'image/png' }),
      });
      const { type: contentType } = await readJsonResponse(clsRes, 'Classification failed');
      if (!clsRes.ok) throw new Error('Classification failed');

      if (contentType === 'equation') {
        // ── Equation path ──────────────────────────────────
        setFigureOverlays(prev => prev.map(o =>
          o.id === id ? { ...o, type: 'equation' } : o
        ));
        const eqRes = await fetch(`${BACKEND}/api/augment-equation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageData: base64, imageMimeType: 'image/png', bookTitle: title, pageText }),
        });
        const eqData = await readJsonResponse(eqRes, 'Equation augmentation failed');
        if (!eqRes.ok) throw new Error(eqData.error || 'Equation augmentation failed');
        setFigureOverlays(prev => prev.map(o =>
          o.id === id ? { ...o, html: eqData.html, loading: false } : o
        ));
        return;
      }

      // ── Step 2: not an equation — fall through to 2D figure ──
      setFigureOverlays(prev => prev.map(o =>
        o.id === id ? { ...o, type: 'figure' } : o
      ));

      const planRes = await fetch(`${FIGURE_BACKEND}/api/plan-2d`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: `figure_${id}`, base64, mediaType: 'image/png' }),
      });
      const plan = await readJsonResponse(planRes, 'Planning failed');
      if (!planRes.ok) throw new Error(plan.error || 'Planning failed');

      const genRes = await fetch(`${FIGURE_BACKEND}/api/generate-2d-async`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, mediaType: 'image/png', filename: `figure_${id}`, plan, model: 'claude-opus-4.6', iframeWidth: Math.round(rect.w), iframeHeight: Math.round(rect.h) }),
      });
      const genData = await readJsonResponse(genRes, 'Generation failed');
      if (!genRes.ok) throw new Error(genData.error || 'Generation failed');
      const { jobId } = genData;

      for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const statusRes = await fetch(`${FIGURE_BACKEND}/api/generate-status/${jobId}`);
        const statusData = await readJsonResponse(statusRes, 'Generation status failed');
        if (statusData.status === 'done') {
          const html = statusData.result?.html || statusData.html || '';
          setFigureOverlays(prev => prev.map(o =>
            o.id === id ? { ...o, html, loading: false, source: 'detected' } : o
          ));
          return;
        }
        if (statusData.status === 'error') throw new Error(statusData.error || 'Generation failed');
      }
      throw new Error('Generation timed out');
    } catch (err) {
      setFigureOverlays(prev => prev.filter(o => o.id !== id));
      const message = err.message === 'NO_PREGENERATED_MATCH'
        ? 'I could not confidently match this selection to a pre-generated interactive figure yet. I did not generate a new one.'
        : `Augmentation failed: ${err.message}`;
      setMessages(m => [...m, { role: 'assistant', content: message }]);
    } finally {
      setCapturing(false);
      setSelectMode(false); setSelRect(null); setPopupPos(null); // always close popup
    }
  }, [title, pageText, extractPageText, captureRegion, findPregeneratedFigure, setFigureOverlays]);

  const captureAndMakeInteractive = useCallback(async () => {
    if (!selRect || selRect.w < 10 || selRect.h < 10) return;
    await augmentFigureRect(selRect, currentPage);
  }, [selRect, currentPage, augmentFigureRect]);

  // ── Text selection ───────────────────────────────────────
  useEffect(() => {
    const onMouseUp = () => {
      if (selectMode) return;
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (text && text.length > 2) setSelectedText(text);
    };
    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [selectMode]);

  const useSelection = () => {
    if (!selectedText) return;
    setPinnedContext(selectedText);
    setSelectedText('');
    window.getSelection()?.removeAllRanges();
    setTimeout(() => chatInputRef.current?.focus(), 0);
  };

  // ── Figure customization via chat ────────────────────────
  const customizeFigure = useCallback(async (overlayId, request) => {
    // Find the overlay's html — look it up fresh each time, not via stale closure
    const currentHtml = figureOverlays.find(o => o.id === overlayId)?.html;
    if (!currentHtml) {
      setMessages(m => [...m, { role: 'assistant', content: "Figure HTML not available yet — try again once the figure has fully loaded." }]);
      setCustomizeOverlayId(null);
      return;
    }
    setLoading(true);
    setMessages(m => [...m, { role: 'user', content: request, displayContent: request }]);
    setInput(''); setPinnedContext(''); setCustomizeOverlayId(null);
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 90000);
      const res = await fetch(`${BACKEND}/api/modify-figure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentHtml, request, bookTitle: title, pageText }),
        signal: ctrl.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Modification failed');
      setFigureOverlays(prev => prev.map(o => o.id === overlayId ? { ...o, html: data.html } : o));
      setMessages(m => [...m, { role: 'assistant', content: 'Done — figure updated.' }]);
    } catch (err) {
      const msg = err.name === 'AbortError' ? 'Timed out — try a simpler request.' : err.message;
      setMessages(m => [...m, { role: 'assistant', content: `Couldn't update figure: ${msg}` }]);
    } finally { setLoading(false); }
  }, [figureOverlays, title, pageText]);

  // ── Mastery helpers ───────────────────────────────────────
  const updateMastery = useCallback((chapterPage, verdict, gap, resolvedGap, isResolved) => {
    const t = titleRef.current;
    if (!t || !chapterPage) return;
    const mastery = loadMastery(t);
    const ch = mastery.chapters[chapterPage] || { correct: 0, wrong: 0, gaps: [], timeMs: 0, augments: [] };
    if (verdict === 'correct') ch.correct = (ch.correct || 0) + 1;
    else if (verdict === 'wrong') {
      ch.wrong = (ch.wrong || 0) + 1;
      if (gap) ch.gaps = [...(ch.gaps || []), { gap, resolved: false, ts: Date.now() }];
    }
    if (resolvedGap && isResolved) {
      ch.gaps = (ch.gaps || []).map(g => g.gap === resolvedGap ? { ...g, resolved: true } : g);
    }
    mastery.chapters[chapterPage] = ch;
    saveMastery(t, mastery);
  }, []);

  // ── Fine-grained learner model: fold one evidence bundle in + persist ──
  const learnerModelStorageKey = (t) => `ar_learner_model::${t || 'book'}`;
  const recordLearnerEvidence = useCallback((ev = {}) => {
    const conceptId = ev.conceptId || conceptMachineSnapshotRef.current?.conceptId || null;
    if (!conceptId) return null;
    const conceptTitle = ev.conceptTitle || conceptMachineSnapshotRef.current?.conceptTitle || null;
    const snap = learnerModelRef.current.applyEvidence(conceptId, { ...ev, conceptId, conceptTitle });
    setLearnerModelSnapshot(learnerModelRef.current.all());
    try {
      localStorage.setItem(
        learnerModelStorageKey(titleRef.current),
        JSON.stringify(learnerModelRef.current.serialize()),
      );
    } catch { /* storage full / unavailable — model still lives in memory */ }
    return snap;
  }, []);

  // Restore the persisted learner model whenever the active book changes.
  useEffect(() => {
    if (!title) return;
    try {
      const raw = localStorage.getItem(learnerModelStorageKey(title));
      learnerModelRef.current = new LearnerModel(raw ? JSON.parse(raw) : null);
    } catch {
      learnerModelRef.current = new LearnerModel();
    }
    setLearnerModelSnapshot(learnerModelRef.current.all());
  }, [title]);

  // Stamp when a check is posed so we can measure answer latency.
  useEffect(() => {
    if (tutorGate === 'QUESTION' || tutorGate === 'REASK') {
      promptAskedAtRef.current = Date.now();
    }
  }, [tutorGate]);

  // ── Remediation viz generation (non-blocking, injected as chat message) ──
  const triggerRemediationViz = useCallback(async (gap) => {
    try {
      const pageTextSnap = await extractPageText(currentPageRef.current);
      const res = await fetch(`${BACKEND}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Create a compact interactive HTML visualization (fits 300×200 in a chat bubble) to illustrate: "${gap}". Dark bg #1e1e1e, light text. Self-contained with inline JS/CSS. Output ONLY the HTML code block.` }],
          bookTitle: titleRef.current,
          currentPage: currentPageRef.current,
          pageText: pageTextSnap,
          tutorMode: false,
        }),
      });
      const data = await res.json();
      if (res.ok && data.reply?.includes('```html')) {
        setMessages(m => [...m, { role: 'assistant', content: data.reply, _vizEmbed: true }]);
      }
    } catch {} // non-fatal
  }, [extractPageText]);
  triggerRemediationVizRef.current = triggerRemediationViz;

  // ── Tutor gate: remediation + re-ask after wrong/partial ──
  const triggerRemediation = useCallback(async (gap, chapterPage) => {
    // Diagram "Prereq gap?": if the active concept has an unmet prerequisite we
    // dispatch `prereq_gap` (retrying -> remediating). Otherwise there is no gap,
    // so we stay in `retrying` and the hint below moves us straight to `hinted`.
    const conceptSnap = conceptMachineSnapshotRef.current;
    const hasPrereqGap = !!(conceptSnap && conceptSnap.prereqsSatisfied === false);
    appendLearnerEvent('remediation_started', {
      to: hasPrereqGap ? 'remediating' : 'retrying',
      fsmEvent: hasPrereqGap ? 'prereq_gap' : undefined,
      page: chapterPage || currentPageRef.current,
      tutorAction: hasPrereqGap ? 'surface_prerequisite' : 'give_hint_or_new_angle',
      payload: { gap, prereqGap: hasPrereqGap },
    });
    setTutorGate('REMEDIATE');
    const pageTextSnap = await extractPageText(currentPageRef.current);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `[REMEDIATION] Student struggled with: "${gap}". Give a brief Socratic nudge — one short hint + a slightly different angle question. Do NOT give the answer. End with a question for them.`,
          }],
          bookTitle: titleRef.current,
          currentPage: currentPageRef.current,
          pageText: pageTextSnap,
          tutorMode: true,
          outlineContext: flattenOutline(outlineRef.current).join('\n'),
        }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        const hlTutor = parseHighlights(data.reply);
        const cleanReply = stripHighlights(data.reply);
        const msgPage = currentPageRef.current;
        if (hlTutor.length) setPdfHighlights(hlTutor.map(phrase => ({ phrase, page: msgPage })));
        const remediationMsg = {
          role: 'assistant',
          content: cleanReply,
          _tutorAsk: true,
          _isRemediation: true,
          hlPhrases: hlTutor.length ? hlTutor.map(phrase => ({ phrase, page: msgPage })) : undefined,
          hlPage: msgPage,
        };
        setMessages(m => [...m, remediationMsg]);
        hintsThisConceptRef.current += 1;
        appendLearnerEvent('remediation_hint_shown', {
          to: 'hinted',
          fsmEvent: 'hint_given',
          page: chapterPage || currentPageRef.current,
          tutorAction: 'show_hint',
          payload: { gap },
        });
        // Extract the follow-up question (last sentence containing ?)
        const sentences = cleanReply.split(/(?<=[.!?])\s+/);
        const newQ = sentences.filter(s => s.includes('?')).pop() || cleanReply;
        pendingTutorQuestion.current = { text: newQ, chapterPage };
        setTutorGate('REASK');
        appendLearnerEvent('remediation_reask', {
          to: 'prompted',
          fsmEvent: 'retry',
          page: chapterPage || currentPageRef.current,
          tutorAction: 'ask_followup',
          payload: { gap },
        });
      }
    } catch { setTutorGate('IDLE'); } finally { setLoading(false); }
    triggerRemediationViz(gap);
  }, [appendLearnerEvent, extractPageText, triggerRemediationViz]);

  // ── Tutor gate: score a user's reply to a tutor question ──
  const triggerScoring = useCallback(async (userAnswer, isReask) => {
    if (!pendingTutorQuestion.current) return;
    const { text: question, chapterPage, lessonGateId } = pendingTutorQuestion.current;
    const prevGapVal = isReask ? pendingGap.current : null;
    const latencyMs = promptAskedAtRef.current ? Date.now() - promptAskedAtRef.current : null;
    const readingMs = conceptArrivalTimeRef.current ? Date.now() - conceptArrivalTimeRef.current : null;
    appendLearnerEvent('answer_submitted', {
      to: 'answering',
      page: chapterPage || currentPageRef.current,
      lessonNode: lessonGateId,
      tutorAction: isReask ? 'answer_reask' : 'answer_check',
      answerLatencyMs: latencyMs,
      readingMs,
      payload: { answer: userAnswer.slice(0, 240) },
    });
    if (!lessonGateId) {
      pendingTutorQuestion.current = null;
      pendingGap.current = null;
      setTutorGate('IDLE');
      appendLearnerEvent('opening_question_answered', {
        to: 'reading',
        fsmEvent: 'resume_reading',
        page: chapterPage || currentPageRef.current,
        tutorAction: 'continue_guided_reading',
      });
      return;
    }
    setTutorGate('SCORING');
    try {
      const pageTextSnap = await extractPageText(currentPageRef.current);
      const res = await fetch(`${BACKEND}/api/score-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer: userAnswer, prevGap: prevGapVal, pageText: pageTextSnap }),
      });
      const score = await res.json();

      // ── Assemble the fine-grained evidence bundle for the learner model ──
      const selfUnsure = /\b(i\s*do?n'?t\s*know|idk|not\s*sure|no\s*idea|no\s*clue|unsure|dunno)\b/i.test(userAnswer || '');
      const isGate = !!(lessonGateId && lessonRuntimeRef.current?.phase === 'gating');
      const baseEvidence = {
        verdict: score.verdict,
        understanding: typeof score.understanding === 'number' ? score.understanding : undefined,
        confidence: score.confidence,
        misconception: !!score.misconception,
        attempt: isReask ? 2 : 1,
        hintsUsed: hintsThisConceptRef.current,
        latencyMs,
        readingMs,
        selfUnsure,
        mcq: !!parseMcq(question),
      };

      if (score.verdict === 'correct' || (isReask && score.verdict !== 'wrong')) {
        // Correct (or reask accepted) → update mastery, advance
        recordLearnerEvidence({ ...baseEvidence, gateVerdict: isGate ? 'pass' : undefined });
        appendLearnerEvent('answer_scored', {
          to: score.verdict === 'correct' ? 'correct' : 'resolved',
          fsmEvent: 'correct',
          page: chapterPage || currentPageRef.current,
          lessonNode: lessonGateId,
          tutorAction: 'accept_answer',
          answerLatencyMs: latencyMs,
          readingMs,
          payload: { verdict: score.verdict, gap: score.gap || prevGapVal || null },
          masteredNode: lessonGateId || null,
        });
        updateMastery(chapterPage, 'correct', null, prevGapVal, !!prevGapVal);
        if (lessonGateId && lessonRuntimeRef.current?.phase === 'gating') {
          lessonRuntimeRef.current.submitVerdict(lessonGateId, 'pass');
        }
        pendingTutorQuestion.current = null;
        lessonGateRef.current = null;
        pendingGap.current = null;
        setTutorGate('IDLE');
      } else {
        // wrong / partial → remediate (only if not already a reask)
        pendingGap.current = score.gap;
        recordLearnerEvidence({ ...baseEvidence, gateVerdict: isGate ? 'fail' : undefined });
        appendLearnerEvent('answer_scored', {
          to: 'needs_support',
          fsmEvent: isReask ? 'wrong_again' : 'wrong',
          page: chapterPage || currentPageRef.current,
          lessonNode: lessonGateId,
          tutorAction: 'diagnose_gap',
          answerLatencyMs: latencyMs,
          readingMs,
          payload: { verdict: score.verdict, gap: score.gap },
        });
        updateMastery(chapterPage, 'wrong', score.gap, null, false);
        if (lessonGateId && lessonRuntimeRef.current?.phase === 'gating') {
          lessonRuntimeRef.current.submitVerdict(lessonGateId, 'fail');
          lessonGateRef.current = null;
          pendingTutorQuestion.current = null;
          setTutorGate('IDLE');
          return;
        }
        if (!isReask) {
          await triggerRemediation(score.gap, chapterPage);
        } else {
          // Second failure: learner is stuck (wrong_again already moved FSM to
          // `stuck`). Diagram "Stuck -> Remediating": surface support instead of
          // silently looping, then stop re-asking.
          appendLearnerEvent('support_surfaced', {
            to: 'remediating',
            fsmEvent: 'help_requested',
            page: chapterPage || currentPageRef.current,
            lessonNode: lessonGateId,
            tutorAction: 'surface_support',
            payload: { gap: score.gap },
          });
          setTutorGate('IDLE');
          pendingTutorQuestion.current = null;
        }
      }
    } catch {
      pendingTutorQuestion.current = null;
      lessonGateRef.current = null;
      setTutorGate('IDLE');
    }
  }, [appendLearnerEvent, extractPageText, updateMastery, triggerRemediation, recordLearnerEvidence]);

  // ── Send message ─────────────────────────────────────────
  const sendMessage = useCallback(async (overrideText) => {
    const typed = overrideText !== undefined ? overrideText.trim() : input.trim();
    if (!typed || (loading && overrideText === undefined)) return;

    // If a figure is selected for customization, route to modify-figure instead of chat
    if (customizeOverlayId != null) {
      return customizeFigure(customizeOverlayId, typed);
    }

    const content = pinnedContext ? `> ${pinnedContext}\n\n${typed}` : typed;
    const userMsg = { role: 'user', content, displayContent: typed };
    const baseMessages = messagesRef.current?.length ? messagesRef.current : messages;
    const next = [...baseMessages, userMsg];

    // Capture gate state before async ops (it may change by the time scoring fires)
    const gateAtSend = tutorGateRef.current;
    const isGateActive = gateAtSend === 'QUESTION' || gateAtSend === 'REASK';
    appendLearnerEvent('user_message_sent', {
      to: isGateActive ? 'answering' : 'asking',
      tutorAction: isGateActive ? 'submit_answer' : 'ask_tutor',
      payload: { text: typed.slice(0, 240), gate: gateAtSend },
    });

    // Capture pinned context NOW (before it's cleared) — for annotation creation
    const pinnedForAnnotation = pinnedContext ? pinnedContext.trim() : null;

    setMessages(next); if (overrideText === undefined) setInput(''); setPinnedContext(''); setLoading(true);
    if (isGateActive) {
      try {
        await triggerScoring(typed, gateAtSend === 'REASK');
      } finally {
        setLoading(false);
      }
      return;
    }
    try {
      const res = await fetch(`${BACKEND}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next, bookTitle: title, currentPage, pageText, tutorMode,
          outlineContext: tutorMode ? flattenOutline(outline).join('\n') : undefined,
          learnerHistory: tutorMode ? buildLearnerHistory(title) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      const highlights = parseHighlights(data.reply);
      const gotoPage = parseGoto(data.reply);
      const stripped = gotoPage ? stripGoto(data.reply) : data.reply;
      const cleanReply = stripHighlights(stripped);
      const msgPage = currentPageRef.current;
      const highlightTargets = highlights.map(phrase => ({ phrase, page: msgPage }));
      if (highlightTargets.length) setPdfHighlights(highlightTargets);
      setMessages(m => [...m, {
        role: 'assistant', content: cleanReply,
        hlPhrases: highlightTargets.length ? highlightTargets : undefined,
        hlPage: msgPage,
        _tutorReply: isGateActive || undefined,
      }]);
      appendLearnerEvent('tutor_reply_received', {
        to: isGateActive ? 'evaluating' : learnerSessionRef.current?.currentLearnerState || 'reading',
        page: msgPage,
        tutorAction: isGateActive ? 'evaluate_answer' : 'respond_to_question',
        payload: { highlighted: highlightTargets.length, gotoPage: gotoPage || null },
      });

      // ── Enter QUESTION gate only when user explicitly asked for a quiz/question ──
      // (not on every reply ending with ?, which would keep the gate stuck)
      if (tutorMode && tutorGateRef.current === 'IDLE') {
        const quizRequest = /quiz|multiple.?choice|give me a question|test me|ask me/i.test(typed);
        if (quizRequest) {
          const stripped = cleanReply.trim();
          const chapterPage = getActivePageNum(outlineRef.current, currentPageRef.current) || 0;
          pendingTutorQuestion.current = { text: stripped, chapterPage };
          setTutorGate('QUESTION');
          appendLearnerEvent('quiz_requested', {
            to: 'prompted',
            fsmEvent: 'tutor_prompt',
            page: chapterPage || currentPageRef.current,
            tutorAction: 'ask_check',
            payload: { question: stripped.slice(0, 240) },
          });
        }
      }
      // Auto-navigate if tutor pointed to another page
      if (gotoPage && gotoPage !== msgPage) {
        setTimeout(() => navigateWithBack(gotoPage, highlights), 900);
      }

      // ── Create annotation if user sent a pinned selection ──
      if (pinnedForAnnotation && pinnedForAnnotation.length > 10) {
        const annId = makeAnnId();
        const msgId = 'msg_' + annId;
        // Stamp the msgId onto the last assistant message so same-session clicks can scroll to it
        setMessages(m => m.map((msg, i) =>
          i === m.length - 1 && msg.role === 'assistant' ? { ...msg, _annMsgId: msgId } : msg
        ));
        const newAnn = {
          id: annId,
          msgId,
          phrase: pinnedForAnnotation.slice(0, 120),
          page: msgPage,
          type: 'chat',
          chatSnippet: cleanReply.slice(0, 240),
          explainerHtml: null,  // filled async below
          ts: Date.now(),
        };
        setAnnotations(prev => [...prev, newAnn]);

        // Generate explainer in background — update annotation when ready
        const pageTextSnap = pageText;
        const titleSnap = title;
        const pageSnap = msgPage;
        fetch(`${BACKEND}/api/generate-explainer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedText: pinnedForAnnotation,
            pageText: pageTextSnap,
            bookTitle: titleSnap,
            currentPage: pageSnap,
          }),
        }).then(r => r.json()).then(data => {
          if (data.html) {
            setAnnotations(prev => prev.map(a =>
              a.id === annId ? { ...a, explainerHtml: data.html } : a
            ));
          }
        }).catch(() => {});
      }
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally { setLoading(false); }

  }, [appendLearnerEvent, input, pinnedContext, messages, loading, title, currentPage, pageText, tutorMode, outline, customizeOverlayId, customizeFigure, navigateWithBack, triggerScoring, setAnnotations]);
  sendMessageRef.current = sendMessage;

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Clear annotation preview on page navigation ──────────
  useEffect(() => { setActiveAnnotation(null); }, [currentPage]);

  // ── Time-on-page tracking ─────────────────────────────────
  // When currentPage changes, save elapsed time to the previous page's mastery entry.
  // The cleanup function runs before the effect re-runs (i.e. on page change).
  useEffect(() => {
    pageArrivalTimeRef.current = Date.now();
    return () => {
      const elapsed = Date.now() - pageArrivalTimeRef.current;
      if (elapsed < 5000 || !titleRef.current || !currentPage) return;
      const mastery = loadMastery(titleRef.current);
      if (!mastery.chapters) mastery.chapters = {};
      const ch = mastery.chapters[currentPage] || { correct: 0, wrong: 0, gaps: [], timeMs: 0, augments: [] };
      ch.timeMs = (ch.timeMs || 0) + elapsed;
      mastery.chapters[currentPage] = ch;
      saveMastery(titleRef.current, mastery);
    };
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Divider drag ─────────────────────────────────────────
  const onDividerMouseDown = (e) => { dragging.current = true; e.preventDefault(); };
  useEffect(() => {
    const onMove = (e) => { if (!dragging.current) return; setSplitPos(Math.min(Math.max(25, (e.clientX / window.innerWidth) * 100), 80)); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const hasReaderContent = Boolean(visionBookOpen);
  const hasChatContext = Boolean(pdfUrl || visionBookOpen);
  const qmdPreviewUrl = chapterPreviewRenderUrl(selectedQmd, qmdFigureSelections);
  const previewCandidate = qmdGalleryPreview?.candidate || null;
  const previewOriginal = previewCandidate?.versions?.[0] || null;
  const previewShowingOriginal = Boolean(qmdGalleryPreview?.showOriginal && previewOriginal);
  const previewFrameUrl = previewShowingOriginal
    ? (previewOriginal.htmlUrl || previewCandidate?.htmlUrl)
    : previewCandidate?.htmlUrl;
  const previewEditorFrameUrl = previewFrameUrl
    ? `${previewFrameUrl}${previewFrameUrl.includes('?') ? '&' : '?'}preview=1`
    : '';
  const lineageVersions = qmdFigureLineage?.versions || [];
  const lineageIndex = lineageVersions.findIndex(version => version.sourceKey === previewCandidate?.sourceKey);
  const lineageOriginal = lineageVersions[0] || null;
  const canPreviewOriginal = Boolean((previewCandidate?.edited && previewOriginal?.htmlUrl) || (lineageIndex > 0 && lineageOriginal?.htmlUrl));
  const previewEditSummary = previewCandidate?.editSummary || (lineageIndex >= 0 ? lineageVersions[lineageIndex]?.editSummary : null);
  const formatEditDuration = useCallback((ms) => {
    if (!ms) return '';
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  }, []);
  const formatEditSummary = useCallback((summary) => {
    if (!summary) return '';
    const areas = summary.changed_areas || summary.changedAreas || [];
    const count = summary.changed_line_count || summary.changedLineCount || 0;
    if (areas.length) return `${areas.join(', ')}${count ? ` (${count} changed lines)` : ''}`;
    return count ? `${count} changed lines` : '';
  }, []);
  useEffect(() => {
    setQmdPreviewFrameLoaded(false);
  }, [previewEditorFrameUrl]);

  const openFigurePreview = useCallback((item, candidate) => {
    setQmdPreviewFrameLoaded(false);
    setQmdFigureLineage(null);
    setQmdGalleryPreview({ item, candidate, showOriginal: false, editAttachments: [] });
  }, []);

  const openFigureEdit = useCallback((item, candidate) => {
    setQmdFigureEdit({ item, candidate, prompt: '', status: 'idle', error: '', progress: null, attachments: [] });
  }, []);

  useEffect(() => {
    const sourceKey = qmdGalleryPreview?.candidate?.sourceKey;
    const stem = qmdGalleryPreview?.item?.stem;
    if (!sourceKey || !stem) {
      setQmdFigureLineage(null);
      return;
    }
    let cancelled = false;
    const params = new URLSearchParams({ sourceKey, stem });
    fetch(`${BACKEND}/api/visionbook/figure-lineage?${params.toString()}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!cancelled) setQmdFigureLineage(data?.versions ? data : null);
      })
      .catch(() => {
        if (!cancelled) setQmdFigureLineage(null);
      });
    return () => { cancelled = true; };
  }, [qmdGalleryPreview?.candidate?.sourceKey, qmdGalleryPreview?.item?.stem]);

  const showPreviewVersion = useCallback((version) => {
    if (!version || !qmdGalleryPreview?.item) return;
    const candidate = (qmdGalleryPreview.item.candidates || []).find(item => item.sourceKey === version.sourceKey) || {
      ...version,
      sourceType: version.edited ? 'edit' : 'result',
      hasThumb: Boolean(version.thumbUrl),
    };
    setQmdGalleryPreview(prev => prev ? {
      ...prev,
      candidate,
      showOriginal: false,
      editOpen: false,
      editError: '',
      editProgress: null,
    } : prev);
  }, [qmdGalleryPreview?.item]);

  const showOriginalPreviewVersion = useCallback(() => {
    if (lineageIndex > 0 && lineageOriginal?.htmlUrl) {
      showPreviewVersion(lineageOriginal);
      return;
    }
    setQmdGalleryPreview(prev => prev ? { ...prev, showOriginal: !prev.showOriginal } : prev);
  }, [lineageIndex, lineageOriginal, showPreviewVersion]);

  const restorePreviewOriginal = useCallback(() => {
    setQmdGalleryPreview(prev => {
      if (!prev?.item || !prev?.candidate?.versions?.[0]) return prev;
      const original = {
        ...prev.candidate.versions[0],
        versions: prev.candidate.versions,
        edited: false,
        editPrompt: '',
      };
      setQmdFigureChoices(groups => groups.map(group => {
        if (group.stem !== prev.item.stem) return group;
        return {
          ...group,
          candidates: (group.candidates || []).map(c =>
            c.sourceKey === prev.candidate.sourceKey ? original : c
          ),
        };
      }));
      setQmdFigureSelections(selections => ({
        ...selections,
        [prev.item.stem]: { sourceKey: original.sourceKey, forceOriginal: true },
      }));
      return {
        ...prev,
        candidate: original,
        showOriginal: false,
        editOpen: false,
        editPrompt: '',
        editStatus: 'idle',
        editError: '',
        editAttachments: [],
      };
    });
  }, []);

  const agentProgressLabel = useCallback((job) => {
    if (!job) return '';
    const elapsed = Math.max(0, Math.round((job.elapsedMs || 0) / 1000));
    return `${job.message || job.stage || 'Working'}${elapsed ? ` (${elapsed}s)` : ''}`;
  }, []);

  const renderAgentProgress = useCallback((job) => {
    if (!job) return null;
    return (
      <div className={`visionbook-edit-progress ${job.status === 'error' ? 'error' : ''}`}>
        <div className="visionbook-edit-progress-current">{agentProgressLabel(job)}</div>
        {(job.logs || []).slice(-4).map((log, idx) => (
          <div key={`${log.ts || idx}-${idx}`} className="visionbook-edit-progress-line">
            {log.message}
          </div>
        ))}
      </div>
    );
  }, [agentProgressLabel]);

  const mergeEditedFigureCandidate = useCallback((item, candidate, data, prompt) => {
    const originalVersion = candidate.versions?.[0] || {
      sourceKey: candidate.originalSourceKey || candidate.sourceKey,
      htmlUrl: candidate.originalHtmlUrl || candidate.htmlUrl,
      thumbUrl: candidate.originalThumbUrl || candidate.thumbUrl,
      model: candidate.originalModel || candidate.model,
      experiment: candidate.originalExperiment || candidate.experiment,
      score: candidate.originalScore ?? candidate.score,
      timestamp: candidate.originalTimestamp || candidate.timestamp,
      label: 'Original',
    };
    const priorVersions = candidate.versions?.length ? candidate.versions : [originalVersion];
    const editedCandidate = {
      ...candidate,
      ...(data.candidate || {}),
      editSummary: data.candidate?.editSummary || data.editSummary || null,
      versions: [
        ...priorVersions,
        {
          ...(data.candidate || {}),
          editSummary: data.candidate?.editSummary || data.editSummary || null,
          label: `Edit ${priorVersions.length}`,
          prompt,
        },
      ],
      edited: true,
      editPrompt: prompt,
    };

    setQmdFigureChoices(prev => prev.map(group => {
      if (group.stem !== item.stem) return group;
      return {
        ...group,
        candidates: (group.candidates || []).map(c =>
          c.sourceKey === candidate.sourceKey ? editedCandidate : c
        ),
      };
    }));
    setQmdFigureSelections(prev => ({
      ...prev,
      [item.stem]: { sourceKey: editedCandidate.sourceKey },
    }));
    setQmdGalleryPreview(prev => {
      if (!prev?.candidate || prev.candidate.sourceKey !== candidate.sourceKey) return prev;
      return {
        ...prev,
        candidate: editedCandidate,
        showOriginal: false,
        editOpen: false,
        editPrompt: '',
        editStatus: 'idle',
        editError: '',
        editAttachments: [],
      };
    });
    return editedCandidate;
  }, []);

  const fileToEditAttachment = useCallback((file, source = 'drop') => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      resolve({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name || 'attachment',
        mimeType: file.type || 'application/octet-stream',
        data: dataUrl.split(',')[1] || '',
        previewUrl: file.type?.startsWith('image/') ? dataUrl : '',
        source,
      });
    };
    reader.onerror = () => reject(reader.error || new Error('Could not read attachment.'));
    reader.readAsDataURL(file);
  }), []);

  const addEditAttachments = useCallback(async (target, files) => {
    const fileList = Array.from(files || []).slice(0, 6);
    if (!fileList.length) return;
    const attachments = await Promise.all(fileList.map(file => fileToEditAttachment(file, 'drop')));
    if (target === 'preview') {
      setQmdGalleryPreview(prev => prev ? {
        ...prev,
        editAttachments: [...(prev.editAttachments || []), ...attachments].slice(-6),
        editError: '',
      } : prev);
    } else {
      setQmdFigureEdit(prev => prev ? {
        ...prev,
        attachments: [...(prev.attachments || []), ...attachments].slice(-6),
        error: '',
      } : prev);
    }
  }, [fileToEditAttachment]);

  const removeEditAttachment = useCallback((target, id) => {
    if (target === 'preview') {
      setQmdGalleryPreview(prev => prev ? {
        ...prev,
        editAttachments: (prev.editAttachments || []).filter(item => item.id !== id),
      } : prev);
    } else {
      setQmdFigureEdit(prev => prev ? {
        ...prev,
        attachments: (prev.attachments || []).filter(item => item.id !== id),
      } : prev);
    }
  }, []);

  const renderEditAttachments = useCallback((target, attachments = [], disabled = false, options = {}) => (
    <div
      className="visionbook-edit-dropzone"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (!disabled) addEditAttachments(target, e.dataTransfer.files);
      }}
    >
      <div className="visionbook-edit-dropzone-row">
        <span>Drop images/files for edit context</span>
        <label className={`visionbook-edit-file-btn ${disabled ? 'disabled' : ''}`}>
          Add file
          <input
            type="file"
            multiple
            disabled={disabled}
            onChange={(e) => {
              addEditAttachments(target, e.target.files);
              e.target.value = '';
            }}
          />
        </label>
        {options.onScreenshot && (
          <button type="button" disabled={disabled || options.screenshotDisabled} onClick={options.onScreenshot}>
            {options.capturing ? 'Capturing...' : 'Screenshot view'}
          </button>
        )}
      </div>
      {attachments.length > 0 && (
        <div className="visionbook-edit-attachments">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="visionbook-edit-attachment">
              {attachment.previewUrl ? (
                <img src={attachment.previewUrl} alt="" />
              ) : (
                <span className="visionbook-edit-attachment-file">file</span>
              )}
              <span className="visionbook-edit-attachment-name">{attachment.name}</span>
              <button type="button" disabled={disabled} onClick={() => removeEditAttachment(target, attachment.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  ), [addEditAttachments, removeEditAttachment]);

  const capturePreviewFigureScreenshot = useCallback(() => new Promise((resolve, reject) => {
    const frame = previewFigureFrameRef.current;
    if (!frame?.contentWindow) {
      reject(new Error('Open the figure preview first.'));
      return;
    }
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const timer = window.setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error('Could not capture this figure view.'));
    }, 3500);
    function onMessage(event) {
      if (event.source !== frame.contentWindow) return;
      const msg = event.data || {};
      if (msg.type !== 'visionbook:capture-screenshot-result' || msg.requestId !== requestId) return;
      window.clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      if (!msg.ok || !msg.dataUrl) {
        reject(new Error(msg.error || 'The figure did not return a screenshot.'));
        return;
      }
      const dataUrl = String(msg.dataUrl);
      resolve({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: `current-view-${new Date().toISOString().replace(/[:.]/g, '-')}.png`,
        mimeType: dataUrl.startsWith('data:image/svg') ? 'image/svg+xml' : 'image/png',
        data: dataUrl.split(',')[1] || '',
        previewUrl: dataUrl,
        source: 'preview_screenshot',
        note: `Captured from the current preview viewpoint (${msg.source || 'figure'}).`,
      });
    }
    window.addEventListener('message', onMessage);
    frame.contentWindow.postMessage({ type: 'visionbook:capture-screenshot', requestId }, '*');
  }), []);

  const addPreviewScreenshotAttachment = useCallback(async () => {
    setQmdGalleryPreview(prev => prev ? { ...prev, editCaptureStatus: 'capturing', editError: '' } : prev);
    try {
      const attachment = await capturePreviewFigureScreenshot();
      setQmdGalleryPreview(prev => prev ? {
        ...prev,
        editCaptureStatus: 'idle',
        editAttachments: [...(prev.editAttachments || []), attachment].slice(-6),
      } : prev);
    } catch (err) {
      setQmdGalleryPreview(prev => prev ? {
        ...prev,
        editCaptureStatus: 'idle',
        editError: err.message || String(err),
      } : prev);
    }
  }, [capturePreviewFigureScreenshot]);

  const serializeEditAttachments = useCallback((attachments = []) => attachments.map((item) => ({
    name: item.name,
    mimeType: item.mimeType,
    data: item.data,
    note: item.note,
    source: item.source,
  })).filter(item => item.data), []);

  const runFigureAgentEdit = useCallback(async (item, candidate, prompt, attachments = [], onProgress) => {
    const startRes = await fetch(`${BACKEND}/api/visionbook/edit-figure-agent-start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qmd: selectedQmd,
        stem: item.stem,
        sourceKey: candidate.sourceKey,
        request: prompt,
        attachments,
      }),
    });
    const startData = await startRes.json().catch(() => ({}));
    if (!startRes.ok) throw new Error(startData.error || `Edit failed (${startRes.status})`);
    const statusUrl = startData.statusUrl || `/api/visionbook/edit-figure-agent-status/${encodeURIComponent(startData.jobId)}`;
    const startedAt = Date.now();
    while (Date.now() - startedAt < 5 * 60 * 1000) {
      const statusRes = await fetch(`${BACKEND}${statusUrl}`);
      const job = await statusRes.json().catch(() => ({}));
      if (!statusRes.ok) throw new Error(job.error || `Could not read edit status (${statusRes.status})`);
      onProgress?.(job);
      if (job.status === 'completed') return { candidate: job.candidate, job };
      if (job.status === 'error') throw new Error(job.error || job.message || 'Coding-agent edit failed');
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
    throw new Error('Coding-agent edit timed out before completion.');
  }, [selectedQmd]);

  const runFigureApiEdit = useCallback(async (item, candidate, prompt, attachments = []) => {
    const res = await fetch(`${BACKEND}/api/visionbook/edit-figure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qmd: selectedQmd,
        stem: item.stem,
        sourceKey: candidate.sourceKey,
        request: prompt,
        attachments,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Edit failed (${res.status})`);
    return data;
  }, [selectedQmd]);

  const submitFigureEdit = useCallback(async (mode = 'api') => {
    if (!qmdFigureEdit?.item || !qmdFigureEdit?.candidate) return;
    const prompt = String(qmdFigureEdit.prompt || '').trim();
    if (!prompt) {
      setQmdFigureEdit(prev => prev ? { ...prev, error: 'Describe what should change first.' } : prev);
      return;
    }
    const { item, candidate } = qmdFigureEdit;
    const attachments = serializeEditAttachments(qmdFigureEdit.attachments || []);
    setQmdFigureEdit(prev => prev ? {
      ...prev,
      status: 'editing',
      mode,
      error: '',
      progress: mode === 'agent' ? null : {
        status: 'running',
        message: 'Claude API is editing the figure',
        elapsedMs: 0,
        logs: [{ ts: Date.now(), message: 'Sending current HTML, original image, and edit request.' }],
      },
    } : prev);
    try {
      const data = mode === 'agent'
        ? await runFigureAgentEdit(item, candidate, prompt, attachments, (job) => {
          setQmdFigureEdit(prev => prev ? { ...prev, progress: job } : prev);
        })
        : await runFigureApiEdit(item, candidate, prompt, attachments);
      mergeEditedFigureCandidate(item, candidate, data, prompt);
      setQmdFigureEdit(null);
    } catch (err) {
      setQmdFigureEdit(prev => prev ? { ...prev, status: 'error', error: err.message || String(err) } : prev);
    }
  }, [mergeEditedFigureCandidate, qmdFigureEdit, runFigureAgentEdit, runFigureApiEdit, serializeEditAttachments]);

  const submitPreviewFigureEdit = useCallback(async (mode = 'api') => {
    if (!qmdGalleryPreview?.item || !qmdGalleryPreview?.candidate) return;
    const prompt = String(qmdGalleryPreview.editPrompt || '').trim();
    if (!prompt) {
      setQmdGalleryPreview(prev => prev ? { ...prev, editError: 'Describe what should change first.' } : prev);
      return;
    }
    const { item, candidate } = qmdGalleryPreview;
    const attachments = serializeEditAttachments(qmdGalleryPreview.editAttachments || []);
    setQmdGalleryPreview(prev => prev ? {
      ...prev,
      editStatus: 'editing',
      editMode: mode,
      editError: '',
      editProgress: mode === 'agent' ? null : {
        status: 'running',
        message: 'Claude API is editing the figure',
        elapsedMs: 0,
        logs: [{ ts: Date.now(), message: 'Sending current HTML, original image, and edit request.' }],
      },
    } : prev);
    try {
      const data = mode === 'agent'
        ? await runFigureAgentEdit(item, candidate, prompt, attachments, (job) => {
          setQmdGalleryPreview(prev => prev ? { ...prev, editProgress: job } : prev);
        })
        : await runFigureApiEdit(item, candidate, prompt, attachments);
      const editedCandidate = mergeEditedFigureCandidate(item, candidate, data, prompt);
      setQmdGalleryPreview(prev => prev ? {
        ...prev,
        candidate: editedCandidate,
        showOriginal: false,
        editOpen: false,
        editPrompt: '',
        editStatus: 'idle',
        editMode: 'api',
        editError: '',
        editProgress: null,
      } : prev);
    } catch (err) {
      setQmdGalleryPreview(prev => prev ? { ...prev, editStatus: 'error', editError: err.message || String(err) } : prev);
    }
  }, [mergeEditedFigureCandidate, qmdGalleryPreview, runFigureAgentEdit, runFigureApiEdit, serializeEditAttachments]);

  useEffect(() => {
    if (qmdGalleryPreview?.editOpen) {
      requestAnimationFrame(() => previewEditTextareaRef.current?.focus());
    }
  }, [qmdGalleryPreview?.editOpen]);

  return (
    <div className="app">
      {/* Toolbar */}
      <header className="toolbar">
        <div className="toolbar-left">
          {title && <span className="doc-title">{title}</span>}
          {hasReaderContent && (
            <div className="roadmap-tabs">
              <button
                className={`roadmap-tab${workspaceView === 'visionbook' ? ' active' : ''}`}
                onClick={() => setWorkspaceView('visionbook')}
                disabled={!visionBookOpen}
              >
                VisionBook
              </button>
              <button
                className={`roadmap-tab${workspaceView === 'figure-gallery' ? ' active' : ''}`}
                onClick={() => setWorkspaceView('figure-gallery')}
                disabled={!visionBookOpen || !selectedQmd}
              >
                Figure Editor
              </button>
              <button
                className={`roadmap-tab${workspaceView === 'roadmap' ? ' active' : ''}`}
                onClick={() => setWorkspaceView('roadmap')}
                disabled={!visionBookOpen && !chapterLessonPlan?.roadmap}
              >
                Roadmap
              </button>
            </div>
          )}
        </div>
        {pdfUrl && (
          <div className="toolbar-center">
            <button className="nav-btn" onClick={() => goTo(currentPage - 1)} disabled={currentPage <= 1}>‹</button>
            <span className="page-indicator">
              <input
                className="page-input"
                value={pageInput}
                onChange={e => setPageInput(e.target.value)}
                onBlur={() => { const p = parseInt(pageInput, 10); if (!isNaN(p)) goTo(p); else setPageInput(String(currentPage)); }}
                onKeyDown={e => e.key === 'Enter' && e.target.blur()}
              />
              <span className="page-of"> / {numPages ?? '…'}</span>
            </span>
            <button className="nav-btn" onClick={() => goTo(currentPage + 1)} disabled={currentPage >= numPages}>›</button>
          </div>
        )}
        {pdfUrl && (
          <div className="toolbar-right">
            <button className="zoom-btn" onClick={() => { setScale(s => Math.max(0.5, +(s - 0.1).toFixed(1))); setPageHeight(null); setPageWidth(null); }}>−</button>
            <span className="zoom-label">{Math.round(scale * 100)}%</span>
            <button className="zoom-btn" onClick={() => { setScale(s => Math.min(3, +(s + 0.1).toFixed(1))); setPageHeight(null); setPageWidth(null); }}>+</button>
          </div>
        )}
      </header>

      {repoPdfPickerOpen && (
        <div className="repo-pdf-backdrop" onClick={() => setRepoPdfPickerOpen(false)}>
          <div className="repo-pdf-picker" onClick={e => e.stopPropagation()}>
            <div className="repo-pdf-header">
              <div>
                <div className="repo-pdf-title">Open optional local PDF</div>
                <div className="repo-pdf-root">{repoPdfRoot || 'Local PDF folder'}</div>
              </div>
              <button className="repo-pdf-close" onClick={() => setRepoPdfPickerOpen(false)}>×</button>
            </div>
            <div className="repo-pdf-list">
              {repoPdfStatus === 'loading' && <div className="repo-pdf-muted">Scanning PDFs...</div>}
              {repoPdfStatus === 'error' && <div className="repo-pdf-muted">Could not load repo PDFs.</div>}
              {repoPdfStatus === 'empty' && (
                <div className="repo-pdf-muted">This folder is empty right now. Add PDFs here, then refresh.</div>
              )}
              {repoPdfs.map(file => (
                <button key={file.path} className="repo-pdf-row" onClick={() => openRepoPdf(file)}>
                  <span className="repo-pdf-name">{file.name}</span>
                  {file.path !== file.name && <span className="repo-pdf-path">{file.path}</span>}
                </button>
              ))}
            </div>
            <div className="repo-pdf-actions">
              <button className="repo-pdf-secondary" onClick={loadRepoPdfs}>Refresh</button>
              <button className="repo-pdf-secondary" onClick={openRepoPdfFolder}>Open folder in Finder</button>
              <button
                className="repo-pdf-secondary"
                onClick={() => {
                  setRepoPdfPickerOpen(false);
                  fileInputRef.current?.click();
                }}
              >
                Choose another PDF...
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="main">
        {/* PDF pane */}
        <div className="pdf-pane" style={{ width: `${splitPos}%` }}>
          {workspaceView === 'reader' && pdfUrl && outline.length > 0 && (
            <div className={`outline-sidebar${sidebarOpen ? '' : ' collapsed'}`}>
              <div className="outline-header">
                {sidebarOpen && <span className="outline-label">Contents</span>}
                <button className="outline-toggle-btn" onClick={() => setSidebarOpen(o => !o)}>
                  {sidebarOpen ? '‹' : '›'}
                </button>
              </div>
              {sidebarOpen && (
                <div className="outline-list">
                  {(() => {
                    const activeOutlineKey = getActiveOutlineKey(outline, currentPage, outlineFocusText)?.key || null;
                    return outline.map((item, i) => (
                      <OutlineItem
                        key={i}
                        item={item}
                        activeKey={activeOutlineKey}
                        itemKey={String(i)}
                        onNavigate={goTo}
                      />
                    ));
                  })()}
                </div>
              )}
            </div>
          )}

          {workspaceView === 'roadmap' ? (
            <RoadmapView
              plan={chapterLessonPlan}
              progress={roadmapProgress}
              selectedId={selectedRoadmapNodeId}
              onSelect={setSelectedRoadmapNodeId}
              currentPage={currentPage}
              learnerSession={learnerSession}
              conceptMachineSnapshot={conceptMachineSnapshot}
              learnerModelSnapshot={learnerModelSnapshot}
            />
          ) : workspaceView === 'figure-gallery' ? (
            <div className="visionbook-gallery-pane">
              <div className="visionbook-gallery-header">
                <div>
                  <div className="visionbook-gallery-title">Generated Figure Editor</div>
                  <div className="visionbook-gallery-subtitle">
                    Editing generated options for {selectedQmd ? qmdTitleFromFile(selectedQmd) : 'the current chapter'}.
                  </div>
                </div>
                <select
                  className="visionbook-select"
                  value={selectedQmd}
                  onChange={e => selectVisionBookQmd(e.target.value)}
                  disabled={!qmdFiles.length}
                >
                  {qmdFiles.map(({ file, title: qmdTitle }) => (
                    <option key={file} value={file}>{qmdTitle || qmdTitleFromFile(file)}</option>
                  ))}
                </select>
              </div>
              <div className="visionbook-gallery-scroll">
                {!qmdFigureChoices.length && (
                  <div className="visionbook-gallery-empty">No figure metadata loaded for this chapter yet.</div>
                )}
                {qmdFigureChoices.map(item => {
                  const savedSourceKey = qmdFigureSelections[item.stem]?.sourceKey || '';
                  const selectedSourceKey = (item.candidates || []).some(candidate => candidate.sourceKey === savedSourceKey)
                    ? savedSourceKey
                    : item.candidates?.[0]?.sourceKey || '';
                  return (
                    <section key={item.stem} className="visionbook-gallery-group">
                      <div className="visionbook-gallery-original">
                        <div className="visionbook-gallery-stem">{item.stem}</div>
                        <img src={qmdAssetUrl(item.path)} alt={item.alt || item.stem} />
                        <div className="visionbook-gallery-original-label">Original QMD image</div>
                      </div>
                      <div className="visionbook-gallery-candidates">
                        {item.candidates?.length ? item.candidates.map(candidate => {
                          const isSelected = selectedSourceKey === candidate.sourceKey;
                          return (
                            <article key={candidate.sourceKey} className={`visionbook-candidate-card${isSelected ? ' selected' : ''}`}>
                              <button
                                className="visionbook-candidate-thumb"
                                onClick={() => openFigurePreview(item, candidate)}
                                title="Open generated figure"
                              >
                                {candidate.thumbUrl ? (
                                  <>
                                    <div className="visionbook-candidate-thumb-loading">Loading thumbnail...</div>
                                    <img
                                      src={backendUrl(candidate.thumbUrl)}
                                      alt={`${item.stem} generated option`}
                                      decoding="async"
                                      onLoad={e => e.currentTarget.classList.add('loaded')}
                                      onError={e => {
                                        e.currentTarget.classList.add('failed');
                                        e.currentTarget.previousSibling.textContent = 'Thumbnail unavailable';
                                      }}
                                    />
                                  </>
                                ) : (
                                  <div className="visionbook-candidate-placeholder">Open Preview</div>
                                )}
                              </button>
                              <div className="visionbook-candidate-meta">
                                <div className="visionbook-candidate-title">
                                  {candidate.edited ? 'Edited' : candidate.preferred ? 'Preferred' : candidate.model || candidate.sourceType}
                                </div>
                                <div className="visionbook-candidate-subtitle">
                                  {candidate.score != null ? `score ${Number(candidate.score).toFixed(2)}` : 'no score'}
                                  {candidate.experiment ? ` · ${candidate.experiment}` : ''}
                                  {candidate.editPrompt ? ` · ${candidate.editPrompt.slice(0, 42)}${candidate.editPrompt.length > 42 ? '...' : ''}` : ''}
                                </div>
                              </div>
                              <div className="visionbook-candidate-actions">
                                <button onClick={() => openFigurePreview(item, candidate)}>Open</button>
                                <button
                                  className={isSelected ? 'active' : ''}
                                  onClick={() => {
                                    setQmdFigureSelections(prev => ({
                                      ...prev,
                                      [item.stem]: { sourceKey: candidate.sourceKey },
                                    }));
                                  }}
                                >
                                  {isSelected ? 'Selected' : 'Use'}
                                </button>
                                <button onClick={() => openFigureEdit(item, candidate)}>Edit</button>
                              </div>
                            </article>
                          );
                        }) : (
                          <div className="visionbook-gallery-no-candidates">No generated candidates found.</div>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
              {qmdFigureEdit?.candidate && (
                <div className="visionbook-preview-modal" role="dialog" aria-label="Edit generated figure">
                  <div className="visionbook-edit-card">
                    <div className="visionbook-preview-header">
                      <div>
                        <div className="visionbook-preview-title">Edit {qmdFigureEdit.item?.stem}</div>
                        <div className="visionbook-preview-subtitle">Default edit uses the fast Claude API. Agent edit is available for testing.</div>
                      </div>
                      <button disabled={qmdFigureEdit.status === 'editing'} onClick={() => setQmdFigureEdit(null)}>Close</button>
                    </div>
                    <div className="visionbook-edit-body">
                      <label className="visionbook-edit-label" htmlFor="figure-edit-prompt">What should be changed?</label>
                      <textarea
                        id="figure-edit-prompt"
                        className="visionbook-edit-textarea"
                        value={qmdFigureEdit.prompt}
                        disabled={qmdFigureEdit.status === 'editing'}
                        placeholder="Example: Make labels larger, add arrows showing the light path, and reduce clutter."
                        onChange={e => setQmdFigureEdit(prev => prev ? { ...prev, prompt: e.target.value, error: '' } : prev)}
                      />
                      {renderEditAttachments('modal', qmdFigureEdit.attachments || [], qmdFigureEdit.status === 'editing')}
                      {qmdFigureEdit.progress && renderAgentProgress(qmdFigureEdit.progress)}
                      {qmdFigureEdit.error && <div className="visionbook-edit-error">{qmdFigureEdit.error}</div>}
                    </div>
                    <div className="visionbook-preview-actions">
                      <button disabled={qmdFigureEdit.status === 'editing'} onClick={() => setQmdFigureEdit(null)}>Cancel</button>
                      <button disabled={qmdFigureEdit.status === 'editing'} onClick={() => submitFigureEdit('api')}>
                        {qmdFigureEdit.status === 'editing' && qmdFigureEdit.mode !== 'agent' ? 'Editing...' : 'Run Edit'}
                      </button>
                      <button disabled={qmdFigureEdit.status === 'editing'} onClick={() => submitFigureEdit('agent')}>
                        {qmdFigureEdit.status === 'editing' && qmdFigureEdit.mode === 'agent' ? 'Agent Editing...' : 'Try Agent'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {qmdGalleryPreview?.candidate && (
                <div className="visionbook-preview-modal" role="dialog" aria-label="Generated figure preview">
                  <div className="visionbook-preview-card">
                    <div className="visionbook-preview-header">
                      <div>
                        <div className="visionbook-preview-title">{qmdGalleryPreview.item?.stem}</div>
                        <div className="visionbook-preview-subtitle">
                          {qmdGalleryPreview.candidate.model || qmdGalleryPreview.candidate.sourceType}
                          {qmdGalleryPreview.candidate.score != null ? ` · score ${Number(qmdGalleryPreview.candidate.score).toFixed(2)}` : ''}
                          {qmdGalleryPreview.candidate.edited ? ' · edited' : ''}
                          {previewShowingOriginal ? ' · viewing original' : ''}
                        </div>
                        {lineageVersions.length > 1 && (
                          <div className="visionbook-version-bar">
                            <button
                              disabled={lineageIndex <= 0}
                              onClick={() => showPreviewVersion(lineageVersions[lineageIndex - 1])}
                              title="Previous figure version"
                            >
                              Previous version
                            </button>
                            <span>
                              Version {Math.max(lineageIndex + 1, 1)}/{lineageVersions.length}
                              {qmdFigureLineage?.promptCount ? ` · ${qmdFigureLineage.promptCount} prompts` : ''}
                              {qmdFigureLineage?.totalDurationMs ? ` · ${formatEditDuration(qmdFigureLineage.totalDurationMs)}` : ''}
                            </span>
                            <button
                              disabled={lineageIndex < 0 || lineageIndex >= lineageVersions.length - 1}
                              onClick={() => showPreviewVersion(lineageVersions[lineageIndex + 1])}
                              title="Next figure version"
                            >
                              Next version
                            </button>
                            {previewCandidate?.editPrompt && (
                              <span className="visionbook-version-prompt">
                                {previewCandidate.editPrompt}
                              </span>
                            )}
                          </div>
                        )}
                        {formatEditSummary(previewEditSummary) && (
                          <div className="visionbook-edit-summary">
                            Changed: {formatEditSummary(previewEditSummary)}
                          </div>
                        )}
                      </div>
                      <div className="visionbook-preview-header-actions">
                        {canPreviewOriginal && (
                          <button
                            onClick={showOriginalPreviewVersion}
                          >
                            {previewShowingOriginal ? 'Show latest edit' : 'Show original'}
                          </button>
                        )}
                        {previewShowingOriginal && (
                          <button onClick={restorePreviewOriginal}>Restore Original</button>
                        )}
                        <button onClick={() => setQmdGalleryPreview(null)}>Close</button>
                      </div>
                    </div>
                    <div className="visionbook-preview-frame-wrap">
                      {!qmdPreviewFrameLoaded && qmdGalleryPreview.candidate?.thumbUrl && (
                        <div className="visionbook-preview-loading">
                          <img
                            src={backendUrl(qmdGalleryPreview.candidate.thumbUrl)}
                            alt={`${qmdGalleryPreview.item?.stem || 'figure'} thumbnail`}
                          />
                          <span>Loading interactive figure...</span>
                        </div>
                      )}
                      <iframe
                        ref={previewFigureFrameRef}
                        className="visionbook-preview-frame"
                        src={backendUrl(previewEditorFrameUrl)}
                        title={`Generated figure preview: ${qmdGalleryPreview.item?.stem}`}
                        sandbox="allow-scripts allow-same-origin allow-popups"
                        onLoad={() => setQmdPreviewFrameLoaded(true)}
                      />
                    </div>
                    {qmdGalleryPreview.editOpen && (
                      <div className="visionbook-preview-inline-edit">
                        <div className="visionbook-inline-edit-top">
                          <label className="visionbook-edit-label" htmlFor="figure-preview-edit-prompt">
                            What should the coding agent change in this open figure?
                          </label>
                          <div className="visionbook-inline-edit-actions">
                            <button
                              disabled={qmdGalleryPreview.editStatus === 'editing'}
                              onClick={() => setQmdGalleryPreview(prev => prev ? {
                                ...prev,
                                editOpen: false,
                                editPrompt: '',
                                editStatus: 'idle',
                                editError: '',
                                editProgress: null,
                              } : prev)}
                            >
                              Cancel
                            </button>
                            <button
                              disabled={qmdGalleryPreview.editStatus === 'editing'}
                              onClick={() => submitPreviewFigureEdit('api')}
                            >
                              {qmdGalleryPreview.editStatus === 'editing' && qmdGalleryPreview.editMode !== 'agent' ? 'Editing...' : 'Run Edit'}
                            </button>
                            <button
                              disabled={qmdGalleryPreview.editStatus === 'editing'}
                              onClick={() => submitPreviewFigureEdit('agent')}
                            >
                              {qmdGalleryPreview.editStatus === 'editing' && qmdGalleryPreview.editMode === 'agent' ? 'Agent Editing...' : 'Try Agent'}
                            </button>
                          </div>
                        </div>
                        <textarea
                          ref={previewEditTextareaRef}
                          id="figure-preview-edit-prompt"
                          className="visionbook-edit-textarea"
                          value={qmdGalleryPreview.editPrompt || ''}
                          disabled={qmdGalleryPreview.editStatus === 'editing'}
                          placeholder="Example: Match the original camera perspective and make the labels larger."
                          onChange={e => setQmdGalleryPreview(prev => prev ? {
                            ...prev,
                            editPrompt: e.target.value,
                            editError: '',
                          } : prev)}
                        />
                        {renderEditAttachments('preview', qmdGalleryPreview.editAttachments || [], qmdGalleryPreview.editStatus === 'editing', {
                          onScreenshot: addPreviewScreenshotAttachment,
                          capturing: qmdGalleryPreview.editCaptureStatus === 'capturing',
                          screenshotDisabled: !qmdPreviewFrameLoaded || previewShowingOriginal,
                        })}
                        {qmdGalleryPreview.editError && (
                          <div className="visionbook-edit-error">{qmdGalleryPreview.editError}</div>
                        )}
                        {qmdGalleryPreview.editProgress && renderAgentProgress(qmdGalleryPreview.editProgress)}
                      </div>
                    )}
                    <div className="visionbook-preview-actions">
                      {previewFrameUrl && !qmdGalleryPreview.editOpen && (
                        <a
                          href={backendUrl(previewEditorFrameUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="visionbook-preview-link"
                        >
                          Open in New Tab
                        </a>
                      )}
                      {!qmdGalleryPreview.editOpen ? (
                        <>
                          <button
                            onClick={() => {
                              setQmdGalleryPreview(prev => prev ? {
                                ...prev,
                                editOpen: true,
                                editPrompt: prev.editPrompt || '',
                                editStatus: 'idle',
                                editError: '',
                                editProgress: null,
                              } : prev);
                            }}
                            disabled={qmdGalleryPreview.editStatus === 'editing' || previewShowingOriginal}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setQmdFigureSelections(prev => ({
                                ...prev,
                                [qmdGalleryPreview.item.stem]: { sourceKey: qmdGalleryPreview.candidate.sourceKey },
                              }));
                              setQmdGalleryPreview(null);
                              setWorkspaceView('visionbook');
                            }}
                            disabled={previewShowingOriginal}
                          >
                            Use
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            disabled={qmdGalleryPreview.editStatus === 'editing'}
                            onClick={() => setQmdGalleryPreview(prev => prev ? {
                              ...prev,
                              editOpen: false,
                              editPrompt: '',
                              editStatus: 'idle',
                              editError: '',
                              editProgress: null,
                            } : prev)}
                          >
                            Cancel
                          </button>
                          <button
                            disabled={qmdGalleryPreview.editStatus === 'editing'}
                            onClick={() => submitPreviewFigureEdit('api')}
                          >
                            {qmdGalleryPreview.editStatus === 'editing' && qmdGalleryPreview.editMode !== 'agent' ? 'Editing...' : 'Run Edit'}
                          </button>
                          <button
                            disabled={qmdGalleryPreview.editStatus === 'editing'}
                            onClick={() => submitPreviewFigureEdit('agent')}
                          >
                            {qmdGalleryPreview.editStatus === 'editing' && qmdGalleryPreview.editMode === 'agent' ? 'Agent Editing...' : 'Try Agent'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : workspaceView === 'visionbook' ? (
            <div className="visionbook-pane">
              <div className="visionbook-toolbar">
                <div>
                  <div className="visionbook-title">VisionBook Preview</div>
                  <div className="visionbook-subtitle">Rendered directly from QMD, with book-style formatting</div>
                </div>
                <div className="visionbook-toolbar-actions">
                  <select
                    className="visionbook-select"
                    value={selectedQmd}
                    onChange={e => selectVisionBookQmd(e.target.value)}
                    disabled={!qmdFiles.length}
                  >
                    {qmdFiles.map(({ file, title: qmdTitle }) => (
                      <option key={file} value={file}>{qmdTitle || qmdTitleFromFile(file)}</option>
                    ))}
                  </select>
                </div>
              </div>
              {qmdStatus === 'loading' && (
                <div className="visionbook-status">Loading VisionBook chapters...</div>
              )}
              {qmdStatus === 'error' && (
                <div className="visionbook-status error">
                Could not load VisionBook QMD chapters. Make sure the ActiveReader backend is running on port 3003 and Pandoc/Quarto is installed.
                </div>
              )}
              {qmdPreviewUrl && qmdStatus !== 'error' && (
                <iframe
                  key={`${selectedQmd}:${JSON.stringify(qmdFigureSelections)}`}
                  className="visionbook-frame"
                  src={qmdPreviewUrl}
                  title={`VisionBook chapter: ${selectedQmd}`}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
              )}
            </div>
          ) : (
          <div className="pdf-content" style={{ position: 'relative' }}>
            {pdfUrl && (
              <div className="float-3d-btn-group">
                <button
                  className={`float-3d-btn${selectMode ? ' active' : ''}`}
                  onClick={() => { setSelectMode(m => !m); setSelRect(null); setPopupPos(null); }}
                  title="Select a region to augment (Esc to cancel)"
                >
                  {selectMode ? 'Cancel' : 'Select Figure'}
                </button>
                {figureOverlays.filter(o => !o.loading).length > 0 && (
                  <button
                    className="float-3d-btn"
                    onClick={() => {
                      const anyVisible = figureOverlays.some(o => o.visible !== false && !o.loading);
                      setFigureOverlays(prev => prev.map(o => ({ ...o, visible: !anyVisible })));
                    }}
                    title="Toggle all augmented figures"
                  >
                    {figureOverlays.some(o => o.visible !== false && !o.loading) ? '◉ Augmented on' : '○ Augmented off'}
                  </button>
                )}
                {backState && (
                <button
                  className="float-3d-btn back-nav-btn"
                  onClick={goBack}
                  title={`Return to where you were on p.${backState.page}`}
                >
                  ← back to p.{backState.page}
                </button>
                )}
              </div>
            )}
            {!pdfUrl ? (
              <div className="empty-state" onClick={handleOpenPdfClick}>
                <div className="empty-icon">📄</div>
                <div className="empty-text">Open a PDF to get started</div>
                <div className="empty-sub">Click here or use the button above</div>
              </div>
            ) : (
              <div className={`pdf-scroll${selectMode ? ' select-active' : ''}`} ref={scrollContainerRef}>
                <div className="pdf-scroll-inner">
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onLoadSuccess}
                    onLoadError={(err) => { console.error('PDF error:', err); setPdfError(err?.message || String(err)); }}
                    loading={<div className="loading">Loading PDF…</div>}
                    error={<div className="pdf-error">Failed to load PDF.<br/><small>{pdfError || 'Check console for details.'}</small></div>}
                  >
                    {numPages && Array.from({ length: numPages }, (_, i) => {
                      const pageNum = i + 1;
                      const WIN = 5; // render ±5 pages around current
                      const inWindow = Math.abs(pageNum - currentPage) <= WIN;
                      return (
                        <div key={pageNum} ref={el => { pageRefs.current[i] = el; }} className="pdf-page-wrapper">
                          {inWindow ? (
                            <Page
                              pageNumber={pageNum}
                              scale={scale}
                              renderAnnotationLayer
                              renderTextLayer
                              onRenderSuccess={() => {
                                // measure page dimensions once from first rendered page
                                if ((!pageHeight || !pageWidth) && pageRefs.current[i]) {
                                  const r = pageRefs.current[i].getBoundingClientRect();
                                  if (!pageHeight) setPageHeight(r.height);
                                  if (!pageWidth)  setPageWidth(r.width);
                                }
                              }}
                            />
                          ) : (
                            // placeholder keeps scroll position stable
                            <div style={{ height: pageHeight || 900, width: pageWidth || 'auto', background: '#fff', border: '1px solid #e0e0e0' }} />
                          )}
                        </div>
                      );
                    })}
                  </Document>

                  {selectMode && (
                    <div className="select-overlay" onMouseDown={onSelMouseDown} onMouseMove={onSelMouseMove} onMouseUp={onSelMouseUp}>
                      {selRect && (
                        <div className="sel-rect" style={{ left: selRect.x, top: selRect.y, width: selRect.w, height: selRect.h }} />
                      )}
                      {popupPos && selRect && (
                        <div className="sel-popup" style={{ left: popupPos.x, top: popupPos.y }} onMouseDown={e => e.stopPropagation()}>
                          <button className="make3d-btn" disabled={capturing} onClick={captureAndMakeInteractive}>
                            {capturing ? 'Detecting…' : '✦ Augment'}
                          </button>
                          <button className="make3d-btn" style={{ background: '#2a2a2a' }} disabled={capturing} onClick={captureAndSend}>
                            {capturing ? '…' : '3D → Chat'}
                          </button>
                          <button className="sel-cancel-btn" onClick={() => { setSelRect(null); setPopupPos(null); }}>✕</button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Inline interactive figure / equation overlays */}
                  {figureOverlays.map(overlay => {
                    const isVisible = overlay.visible !== false;
                    const isEq = overlay.type === 'equation';
                    const accentOn  = isEq ? 'rgba(86,182,194,0.85)' : 'rgba(60,120,220,0.85)';
                    const accentOff = 'rgba(80,80,80,0.7)';
                    const loadingMsg = overlay.type === 'classifying'
                      ? 'Analysing…'
                      : overlay.type === 'equation'
                        ? 'Annotating equation…'
                        : 'Building interactive figure…';
                    const isInlineFigure = overlay.source === 'pregenerated' || overlay.source === 'detected';
                    const frameAspect = !isEq && overlay.figureAspect > 0 ? overlay.figureAspect : null;
                    const rectAspect = overlay.scrollRect?.w && overlay.scrollRect?.h ? overlay.scrollRect.w / overlay.scrollRect.h : null;
                    const fittedFrame = frameAspect && rectAspect
                      ? (rectAspect > frameAspect
                        ? {
                          width: overlay.scrollRect.h * frameAspect,
                          height: overlay.scrollRect.h,
                          left: (overlay.scrollRect.w - overlay.scrollRect.h * frameAspect) / 2,
                          top: 0,
                        }
                        : {
                          width: overlay.scrollRect.w,
                          height: overlay.scrollRect.w / frameAspect,
                          left: 0,
                          top: (overlay.scrollRect.h - overlay.scrollRect.w / frameAspect) / 2,
                        })
                      : { width: overlay.scrollRect.w, height: overlay.scrollRect.h, left: 0, top: 0 };
                    return (
                      <div key={overlay.id}
                        onMouseEnter={() => { setHoveredOverlayId(overlay.id); hoveredOverlayIdRef.current = overlay.id; }}
                        onMouseLeave={() => { setHoveredOverlayId(null); hoveredOverlayIdRef.current = null; }}
                      >
                        {/* The overlay — hidden when toggled off, revealing original PDF */}
                        <div
                          style={{
                            position: 'absolute',
                            left: overlay.scrollRect.x,
                            top: overlay.scrollRect.y,
                            width: overlay.scrollRect.w,
                            height: overlay.scrollRect.h,
                            zIndex: 20,
                            overflow: 'hidden',
                            background: '#fff',
                            display: isVisible ? 'block' : 'none',
                          }}
                        >
                          <button
                            className="figure-overlay-delete"
                            onMouseDown={e => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFigureOverlays(prev => prev.filter(o => o.id !== overlay.id));
                              if (customizeOverlayId === overlay.id) setCustomizeOverlayId(null);
                            }}
                            title="Delete augmented figure"
                            aria-label="Delete augmented figure"
                          >
                            x
                          </button>
                          {overlay.loading ? (
                            <div style={{
                              display: 'flex', flexDirection: 'column',
                              alignItems: 'center', justifyContent: 'center',
                              height: '100%',
                              background: '#fafafa',
                              color: '#999',
                              gap: 10,
                            }}>
                              <div style={{
                                width: 22, height: 22,
                                border: `2px solid ${isEq ? '#2a2a4e' : '#ddd'}`,
                                borderTopColor: '#555',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                              }} />
                              <span style={{ fontSize: 11 }}>{loadingMsg}</span>
                            </div>
                          ) : overlay.html ? (
                            <div
                              style={{
                                position: 'absolute',
                                left: fittedFrame.left,
                                top: fittedFrame.top,
                                width: fittedFrame.width,
                                height: fittedFrame.height,
                              }}
                            >
                              <iframe
                                srcDoc={overlay.html}
                                sandbox="allow-scripts allow-same-origin"
                                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                                title={isEq ? `equation-${overlay.id}` : `interactive-figure-${overlay.id}`}
                                onLoad={e => injectFigureOverrides(e.target, overlay.id, scale)}
                              />
                            </div>
                          ) : null}
                        </div>

                        {/* Toggle pill + customize "?" button — always visible, top-right of overlay */}
                        {!overlay.loading && overlay.html && (() => {
                          const btnOff = overlay.btnOffset || { x: 0, y: 0 };
                          if (isInlineFigure) return null;
                          return (
                          <div
                            style={{
                              position: 'absolute',
                              left: overlay.scrollRect.x + overlay.scrollRect.w - (isEq ? 146 : 138) + btnOff.x,
                              top: overlay.scrollRect.y + btnOff.y,
                              zIndex: 25,
                              display: 'flex',
                              gap: 2,
                              cursor: 'grab',
                              userSelect: 'none',
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              btnDragRef.current = {
                                overlayId: overlay.id,
                                startX: e.clientX,
                                startY: e.clientY,
                                startOx: btnOff.x,
                                startOy: btnOff.y,
                              };
                            }}
                          >
                            {/* ? customize button */}
                            <button
                              onMouseDown={e => e.stopPropagation()}
                              onClick={() => {
                                setCustomizeOverlayId(prev => prev === overlay.id ? null : overlay.id);
                                setTimeout(() => chatInputRef.current?.focus(), 50);
                              }}
                              className={`overlay-ask-btn${customizeOverlayId === overlay.id ? ' active' : ''}`}
                              title={overlay.figureStem ? `Customize ${overlay.figureStem}` : 'Customize this figure in chat'}
                            >
                              ?
                            </button>
                            {/* toggle pill */}
                            <button
                              onMouseDown={e => e.stopPropagation()}
                              onClick={() => setFigureOverlays(prev =>
                                prev.map(o => o.id === overlay.id ? { ...o, visible: !isVisible } : o)
                              )}
                              style={{
                                background: isVisible ? accentOn : accentOff,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0 4px 4px 0',
                                fontSize: 9,
                                padding: '2px 7px',
                                cursor: 'pointer',
                                backdropFilter: 'blur(4px)',
                                letterSpacing: '0.03em',
                              }}
                              title={isVisible ? 'Show original' : isEq ? 'Show annotated equation' : 'Show interactive'}
                            >
                              {isVisible
                                ? (isEq ? '∑ eq' : '◉ live')
                                : (isEq ? '○ orig' : '○ orig')}
                            </button>
                          </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          {/* Figure tooltip — hover symbol info */}
          {figureTooltip && (
            <div className="figure-tooltip-el" style={{ left: figureTooltip.x, top: figureTooltip.y }}>
              {figureTooltip.text}
            </div>
          )}
          {/* Figure popup — click row info, rendered outside iframes */}
          {figurePopup && (
            <div className="figure-popup-panel" style={{
              left: figurePopup.left ?? 16,
              ...(figurePopup.top != null ? { top: figurePopup.top, bottom: 'auto' } : {}),
            }}>
              <strong className="figure-popup-title">{figurePopup.title}</strong>
              <span className="figure-popup-body">{figurePopup.body}</span>
            </div>
          )}
          </div>
          )}
        </div>

        {/* Divider */}
        <div className="divider" onMouseDown={onDividerMouseDown} />

        {/* Chat pane */}
        <div className="chat-pane" style={{ width: `${100 - splitPos}%` }}>
          <div className="chat-header">
            <span>Chat</span>
            {title && <span className="chat-doc-label">— p.{currentPage}</span>}
            {ragStatus === 'ready' && <span style={{ fontSize: 10, color: '#3a7', marginLeft: 6 }}>✦ rag</span>}
            {tutorMode && <span className="tutor-glow-dot" title="Tutor is active" />}
            {chapterLessonPlan && (
              <div className="lesson-demo-controls">
                <button
                  className="lesson-step-btn"
                  onClick={advanceChapterLesson}
                  disabled={chapterLessonPhase === 'gating' || tutorGate !== 'IDLE'}
                  title={chapterLessonPhase === 'idle' ? 'Turn on guided reading' : 'Ask for a check-in when you are ready'}
                >
                  {chapterLessonPhase === 'idle' ? 'Guide me' : chapterLessonPhase === 'done' ? 'Done' : 'Check me'}
                </button>
              </div>
            )}
            {guidedReadingActive && (
              <span className="chat-doc-label">tracking reading</span>
            )}
            <div className="tutor-toggle" onClick={() => setTutorMode(m => !m)} title={tutorMode ? 'Tutor mode on — click to turn off' : 'Turn on tutor mode'}>
              <div className={`tutor-toggle-track${tutorMode ? ' on' : ''}`}>
                <div className="tutor-toggle-thumb" />
              </div>
              <span className="tutor-label">Tutor</span>
            </div>
          </div>

          <div className="chat-messages">
            {/* ── Annotation preview mode ── */}
            {activeAnnotation && (
              <div className="ann-preview">
                <div className="ann-preview-header">
                  <span className="ann-preview-badge">📌 p.{activeAnnotation.ann.page}</span>
                  <span className="ann-preview-phrase">"{activeAnnotation.ann.phrase.slice(0, 60)}{activeAnnotation.ann.phrase.length > 60 ? '…' : ''}"</span>
                  <button className="ann-preview-close" onClick={() => setActiveAnnotation(null)} title="Back to chat">✕</button>
                </div>
                {activeAnnotation.ann.explainerHtml ? (
                  <div className="viz-frame-wrap">
                    <iframe className="viz-frame" srcDoc={activeAnnotation.ann.explainerHtml} sandbox="allow-scripts" title="annotation-explainer" />
                  </div>
                ) : (
                  <div className="ann-preview-snippet">{activeAnnotation.ann.chatSnippet}</div>
                )}
                <div className="ann-preview-footer">
                  <span style={{ color: '#555', fontSize: 11 }}>Double-click highlight on PDF to delete · {new Date(activeAnnotation.ann.ts).toLocaleDateString()}</span>
                  <button className="ann-ask-again" onClick={() => {
                    setActiveAnnotation(null);
                    setPinnedContext(activeAnnotation.ann.phrase);
                    setTimeout(() => chatInputRef.current?.focus(), 50);
                  }}>Ask again ↩</button>
                </div>
              </div>
            )}
            {!activeAnnotation && messages.length === 0 && (
              <div className="chat-empty">
                <p>Ask questions about the current VisionBook chapter. The tutor can also guide you through the roadmap.</p>
              </div>
            )}
            {messages.filter(m => !m._tutorCheckin).map((m, i) => (
              <div
                key={i}
                data-ann-msg-id={m._annMsgId || undefined}
                className={`message ${m.role}${m.content?.includes?.('```html') ? ' has-viz' : ''}${m._tutorAsk ? ' tutor-ask' : ''}${m.hlPhrases ? ' has-hl-link' : ''}`}
                onClick={() => m.hlPhrases?.length && navigateWithBack(m.hlPage, m.hlPhrases)}
                title={m.hlPhrases ? `Click to go to p.${m.hlPage} and re-highlight` : undefined}
              >
                {(m._tutorAsk || m._isRemediation || m._tutorReply) && <img src={tutorAvatar} alt="" className="tutor-ask-dot" />}
                <div className="message-bubble">
                  {m.imageData ? (
                    <img src={`data:${m.imageMimeType || 'image/png'};base64,${m.imageData}`} className="msg-thumb" alt="figure" />
                  ) : (
                    <MessageContent
                      content={m.displayContent ?? m.content ?? ''}
                      onChoice={m.role === 'assistant' ? (text) => sendMessage(text) : undefined}
                      selectedChoice={null}
                    />
                  )}
                  {m.hlPhrases && <span className="msg-hl-badge" title={`Highlights on p.${m.hlPage}`}>📍 p.{m.hlPage}</span>}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-bubble typing"><span /><span /><span /></div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {selectedText && (
            <div className="selection-bar">
              <span className="selection-preview">"{selectedText.slice(0, 80)}{selectedText.length > 80 ? '…' : ''}"</span>
              <button className="use-selection-btn" onClick={useSelection}>Use selection</button>
              <button className="dismiss-btn" onClick={() => setSelectedText('')}>✕</button>
            </div>
          )}

          {pinnedContext && (
            <div className="pinned-context">
              <span className="pinned-quote">"{pinnedContext.slice(0, 120)}{pinnedContext.length > 120 ? '…' : ''}"</span>
              <button className="dismiss-btn" onClick={() => setPinnedContext('')}>✕</button>
            </div>
          )}

          {customizeOverlayId != null && (
            <div className="customize-chip">
              <span className="customize-chip-icon">◈</span>
              <span>Customizing figure — describe your changes below</span>
              <button className="dismiss-btn" onClick={() => setCustomizeOverlayId(null)}>✕</button>
            </div>
          )}

          <div className="chat-input-row">
            <textarea
              ref={chatInputRef}
              className="chat-input"
              placeholder={customizeOverlayId != null
                ? 'e.g. "make the nodes larger" or "add labels to the arrows"…'
                : pdfUrl ? (pinnedContext ? 'Ask about the selection…' : 'Ask anything about this PDF…') : 'Ask about this VisionBook chapter…'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={!hasChatContext || loading}
              rows={3}
            />
            <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || !hasChatContext || loading}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
