import fs from 'node:fs/promises';
import path from 'node:path';
import { Agent, CursorAgentError } from '@cursor/sdk';

const jobDir = process.argv[2];

if (!jobDir) {
  console.error(JSON.stringify({ ok: false, error: 'jobDir argument is required' }));
  process.exit(1);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function looksLikeHtml(text) {
  return /^\s*(<!doctype\s+html|<html[\s>]|<(div|svg|canvas|section|figure|style|script|body|head)[\s>])/i.test(text || '');
}

async function writeProgress(step, note) {
  const progressPath = path.join(jobDir, 'progress.json');
  let rows = [];
  try {
    rows = JSON.parse(await fs.readFile(progressPath, 'utf8'));
    if (!Array.isArray(rows)) rows = [];
  } catch {
    rows = [];
  }
  rows.push({ ts: new Date().toISOString(), step, note });
  await fs.writeFile(progressPath, JSON.stringify(rows.slice(-20), null, 2), 'utf8');
}

try {
  if (!process.env.CURSOR_API_KEY) {
    throw new Error('CURSOR_API_KEY is required to run the Cursor coding-agent figure editor.');
  }
  await writeProgress('starting', 'Loaded edit job and checking inputs.');

  const currentHtmlPath = path.join(jobDir, 'current.html');
  const editedHtmlPath = path.join(jobDir, 'edited.html');
  const requestPath = path.join(jobDir, 'request.txt');
  const metadataPath = path.join(jobDir, 'metadata.json');

  const [request, metadataRaw] = await Promise.all([
    fs.readFile(requestPath, 'utf8'),
    fs.readFile(metadataPath, 'utf8'),
  ]);
  const metadata = JSON.parse(metadataRaw);
  const files = await fs.readdir(jobDir);
  const originalImage = files.find(file => file.startsWith('original_figure.'));
  const currentScreenshot = files.find(file => file === 'current_screenshot.jpg');
  const attachments = files.filter(file => file.startsWith('attachment_'));
  await writeProgress('prepared', 'Found current.html, request.txt, and visual reference files.');

  const prompt = `You are a coding agent editing one self-contained interactive VisionBook HTML figure.

Workspace files:
- current.html: the existing generated figure to edit.
- request.txt: the user's requested change.
- metadata.json: figure stem, QMD chapter, source key, and context flags.
${originalImage ? `- ${originalImage}: the original static QMD figure image for visual reference.` : ''}
${currentScreenshot ? '- current_screenshot.jpg: screenshot of current.html before editing.' : ''}
${attachments.length ? `- Additional user attachments: ${attachments.join(', ')}` : ''}

Task:
1. First write progress.json with a short public note about what you inspected. Keep updating progress.json after each major step. Do not include private reasoning; only concise observable notes.
2. Read current.html and request.txt.
3. Make the smallest targeted HTML/CSS/JS changes needed for the request.
4. Preserve the interaction model, controls, scripts/imports, labels, and scientific meaning unless request.txt explicitly changes them.
5. If the request is about viewpoint, camera, crop, zoom, or matching the original, adjust camera/controls/object scale/initial view before changing geometry.
6. Direct 3D object editing is disabled in this product. Do not add selection handles, gumballs, gizmos, draggable objects, TransformControls, or move/rotate manipulators. If current.html already has them, remove them and replace any needed adjustment with explicit sliders/buttons.
7. Keep the output self-contained. Do not add external local file dependencies.
8. Write the complete final HTML document to edited.html as soon as it is valid.

Do not edit files outside this workspace. Do not write markdown to edited.html.

Figure metadata:
${JSON.stringify(metadata, null, 2)}

User request:
${request}`;

  await writeProgress('agent_prompted', 'Launching Cursor agent for targeted HTML edit.');
  const result = await Agent.prompt(prompt, {
    apiKey: process.env.CURSOR_API_KEY,
    model: { id: process.env.CURSOR_AGENT_MODEL || 'auto' },
    local: { cwd: jobDir },
  });

  if (result.status !== 'finished') {
    throw new Error(`Cursor agent run did not finish cleanly: ${result.status}`);
  }

  if (!(await exists(editedHtmlPath))) {
    const resultText = String(result.result || '').trim();
    if (looksLikeHtml(resultText)) {
      await fs.writeFile(editedHtmlPath, resultText, 'utf8');
      await writeProgress('artifact_written', 'Saved edited HTML from agent response.');
    }
  }

  if (!(await exists(editedHtmlPath))) {
    throw new Error('Cursor agent did not create edited.html');
  }

  const editedHtml = await fs.readFile(editedHtmlPath, 'utf8');
  if (!looksLikeHtml(editedHtml)) {
    throw new Error('Cursor agent created edited.html, but it does not look like HTML');
  }
  await writeProgress('validated', 'edited.html exists and has valid HTML structure.');

  console.log(JSON.stringify({
    ok: true,
    status: result.status,
    result: String(result.result || '').slice(0, 1200),
  }));
} catch (err) {
  if (err instanceof CursorAgentError) {
    console.error(JSON.stringify({
      ok: false,
      error: err.message,
      retryable: err.isRetryable,
      type: 'CursorAgentError',
    }));
  } else {
    console.error(JSON.stringify({ ok: false, error: err.message || String(err) }));
  }
  process.exit(1);
}
