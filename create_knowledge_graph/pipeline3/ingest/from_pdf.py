"""
PDF → raw text extraction.

Primary:   PyMuPDF (fitz) — free, good for text-heavy PDFs
Optional:  Mathpix API    — accurate math OCR (set MATHPIX_KEY env var)

Output: plain text string, one page per section separated by blank lines.
Images are not extracted here; image_alt_text.py handles them later.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path


def extract_pdf(pdf_path: Path, mathpix_key: str | None = None) -> str:
    """
    Extract text from a PDF file.

    Args:
        pdf_path:    Path to the .pdf file.
        mathpix_key: Optional Mathpix API key for accurate math OCR.
                     If None, falls back to PyMuPDF.

    Returns:
        Extracted text as a string.
    """
    if mathpix_key:
        return _extract_mathpix(pdf_path, mathpix_key)
    return _extract_pymupdf(pdf_path)


# ── PyMuPDF ───────────────────────────────────────────────────────────────────

def _extract_pymupdf(pdf_path: Path) -> str:
    try:
        import fitz  # PyMuPDF
    except ImportError:
        raise ImportError(
            "PyMuPDF is required for PDF extraction: pip install pymupdf\n"
            "Alternatively, set MATHPIX_KEY for Mathpix API extraction."
        )

    doc = fitz.open(str(pdf_path))
    pages: list[str] = []

    for page_num, page in enumerate(doc, start=1):
        text = page.get_text("text")
        if text.strip():
            pages.append(f"<!-- page {page_num} -->\n{text}")

    doc.close()
    print(f"  PyMuPDF: extracted {len(pages)} pages from {pdf_path.name}",
          file=sys.stderr)
    return "\n\n".join(pages)


# ── Mathpix ───────────────────────────────────────────────────────────────────

def _extract_mathpix(pdf_path: Path, api_key: str) -> str:
    """
    Send PDF to Mathpix API for high-quality LaTeX/markdown extraction.
    Returns markdown string with proper LaTeX math.
    """
    try:
        import urllib.request
        import urllib.error
        import json
        import base64
    except ImportError as e:
        raise ImportError(f"Standard library missing: {e}")

    pdf_bytes = pdf_path.read_bytes()
    b64 = base64.b64encode(pdf_bytes).decode("ascii")

    payload = json.dumps({
        "src": f"data:application/pdf;base64,{b64}",
        "math_inline_delimiters": ["$", "$"],
        "math_display_delimiters": ["$$", "$$"],
        "rm_spaces": True,
        "formats": ["md"],
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.mathpix.com/v3/pdf",
        data=payload,
        headers={
            "app_id":  os.environ.get("MATHPIX_APP_ID", ""),
            "app_key": api_key,
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            result = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Mathpix API error {e.code}: {body}")

    md = result.get("md") or result.get("text", "")
    if not md:
        raise RuntimeError(f"Mathpix returned no markdown: {result}")

    print(f"  Mathpix: extracted {len(md)} chars from {pdf_path.name}",
          file=sys.stderr)
    return md
