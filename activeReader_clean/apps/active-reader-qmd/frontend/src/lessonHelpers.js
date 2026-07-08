/* ─────────────────────────────────────────────────────────────────────
 * lessonHelpers.js
 *
 * Pure utilities for the lesson integration:
 *
 *   - detectChapter(filename, firstPageText, chaptersList) → match or null
 *   - rewriteAssetUrl(planAssetPath, apiBase)              → absolute URL
 *
 * Kept dependency-free so it can be reused/tested.
 * ────────────────────────────────────────────────────────────────────── */

/**
 * Try to identify which chapter a PDF corresponds to.
 *
 * Heuristics, in order of preference:
 *   1. Explicit chapter number in filename (e.g. "ch5", "ch_5", "ch05", "chapter5", "chapter-5")
 *   2. Title token in filename (e.g. "imaging" → "Imaging")
 *   3. Chapter title found in first-page text (case-insensitive)
 *
 * @param {string} filename — PDF filename without extension
 * @param {string} firstPageText — concatenated text of the first 1-2 PDF pages
 * @param {Array<{chapter:number, title:string, has_plans:boolean}>} chapters
 * @returns {{chapter, title, has_plans, confidence, reason} | null}
 */
export function detectChapter(filename, firstPageText, chapters) {
  if (!filename || !chapters || chapters.length === 0) return null;
  const fname = filename.toLowerCase();
  const firstText = (firstPageText || '').slice(0, 4000).toLowerCase();

  // 1. Filename number match
  const numMatch = fname.match(/(?:^|[\W_])(?:ch(?:apter)?[\s\-_]?)(\d{1,2})(?:[\W_]|$)/i)
                || fname.match(/(?:^|[\W_])(\d{1,2})[\W_]/);  // last resort: any leading 1-2 digit number
  if (numMatch) {
    const num = parseInt(numMatch[1], 10);
    const found = chapters.find(c => c.chapter === num);
    if (found) return { ...found, confidence: 0.95, reason: `chapter number ${num} in filename` };
  }

  // 2. Title token in filename
  // Strip "Ch N. " prefix from each chapter title to get the core
  const titled = chapters.map(c => {
    const core = c.title.replace(/^ch\s*\d+\.\s*/i, '').trim().toLowerCase();
    return { ...c, core, coreTokens: core.split(/[\s\-,]+/).filter(t => t.length >= 4) };
  });
  for (const c of titled) {
    if (!c.core) continue;
    // Exact phrase appearing in filename (after replacing _-/. with space)
    const fnameNorm = fname.replace(/[_\-.]/g, ' ');
    if (fnameNorm.includes(c.core)) {
      return { ...c, confidence: 0.85, reason: `title "${c.core}" appears in filename` };
    }
  }
  for (const c of titled) {
    for (const tok of c.coreTokens) {
      if (fname.includes(tok)) {
        return { ...c, confidence: 0.7, reason: `keyword "${tok}" in filename` };
      }
    }
  }

  // 3. First-page text match
  for (const c of titled) {
    if (!c.core) continue;
    if (firstText.includes(c.core)) {
      return { ...c, confidence: 0.6, reason: `title "${c.core}" found in PDF text` };
    }
  }
  for (const c of titled) {
    for (const tok of c.coreTokens) {
      if (firstText.includes(tok)) {
        return { ...c, confidence: 0.4, reason: `keyword "${tok}" found in PDF text` };
      }
    }
  }

  return null;
}

/**
 * Lesson plan figure assets are stored as relative paths like
 * "assets/figures/interactive/pinhole_geometry2.html". The backend serves
 * them under /lesson-assets/figures/... — rewrite the prefix.
 */
export function rewriteAssetUrl(p, apiBase) {
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  // Strip "assets/" prefix if present, then prepend the mount.
  const rel = p.replace(/^assets\//, '');
  return `${apiBase}/lesson-assets/${rel}`;
}
