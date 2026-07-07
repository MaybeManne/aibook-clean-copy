"""
Thin LLM wrapper for the knowledge-graph pipeline.

Reuses the dispatch pattern from example_w_agent_calling.py: Gemini is primary
(structured JSON output via response_schema). Anthropic is supported as a fallback.
Gemini's JSON-Schema subset is narrow, so every schema goes through
`clean_schema_for_gemini` before the call.
"""
from __future__ import annotations

import json
import os
import time
from typing import Any

try:
    from google import genai
    from google.genai import types as genai_types
except ImportError:  # pragma: no cover
    genai = None
    genai_types = None

try:
    import anthropic
except ImportError:  # pragma: no cover
    anthropic = None


GEMINI_DEFAULT = "gemini-flash-latest"

# The google-genai client auto-detects GOOGLE_API_KEY or GEMINI_API_KEY.
# This project also uses GEMINI_API_KEY_SHADEN — if present, alias it into
# GEMINI_API_KEY so the client picks it up without code changes elsewhere.
_ALT_KEY_VARS = ("GEMINI_API_KEY_SHADEN",)
if not (os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")):
    for _var in _ALT_KEY_VARS:
        _val = os.environ.get(_var)
        if _val:
            os.environ["GEMINI_API_KEY"] = _val
            break


def _is_gemini(model: str) -> bool:
    return model.startswith("gemini-")


def call_llm_json(
    system_prompt: str,
    user_message: str,
    output_schema: dict,
    model: str = GEMINI_DEFAULT,
    max_output_tokens: int = 65536,
    thinking_budget: int = 8192,
    temperature: float = 0.3,
    retries: int = 2,
) -> dict:
    """Call an LLM for structured JSON. Returns a parsed dict."""
    last_err: Exception | None = None
    for attempt in range(retries + 1):
        try:
            if _is_gemini(model):
                return _call_gemini_json(
                    system_prompt, user_message, output_schema, model,
                    max_output_tokens=max_output_tokens,
                    thinking_budget=thinking_budget,
                    temperature=temperature,
                )
            return _call_anthropic_json(system_prompt, user_message, output_schema, model)
        except Exception as e:  # broad: Gemini/Anthropic exceptions vary
            last_err = e
            if attempt < retries:
                sleep = 2 ** attempt
                print(f"  [llm] call failed ({type(e).__name__}: {e}); retry in {sleep}s")
                time.sleep(sleep)
            else:
                raise
    raise RuntimeError(f"unreachable; last_err={last_err}")


def call_llm_json_with_image(
    system_prompt: str,
    user_message: str,
    image_bytes: bytes,
    image_mime: str,
    output_schema: dict,
    model: str = GEMINI_DEFAULT,
    max_output_tokens: int = 8192,
    thinking_budget: int = 2048,
    temperature: float = 0.3,
    retries: int = 2,
) -> dict:
    """Structured JSON call with a single image attached (Gemini vision)."""
    last_err: Exception | None = None
    for attempt in range(retries + 1):
        try:
            if genai is None or genai_types is None:
                raise RuntimeError("google-genai not installed")
            client = genai.Client()
            cleaned = clean_schema_for_gemini(output_schema)
            contents = [
                genai_types.Part.from_bytes(data=image_bytes, mime_type=image_mime),
                user_message,
            ]
            cfg_kwargs = dict(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                response_schema=cleaned,
                temperature=temperature,
                max_output_tokens=max_output_tokens,
            )
            if thinking_budget:
                cfg_kwargs["thinking_config"] = genai_types.ThinkingConfig(
                    thinking_budget=thinking_budget,
                )
            response = client.models.generate_content(
                model=model,
                contents=contents,
                config=genai_types.GenerateContentConfig(**cfg_kwargs),
            )
            text = response.text
            if not text:
                raise ValueError("empty response from Gemini vision")
            return json.loads(text)
        except Exception as e:
            last_err = e
            if attempt < retries:
                sleep = 2 ** attempt
                print(f"  [llm-vision] call failed ({type(e).__name__}: {e}); "
                      f"retry in {sleep}s")
                time.sleep(sleep)
            else:
                raise
    raise RuntimeError(f"unreachable; last_err={last_err}")


def _call_gemini_json(
    system_prompt: str,
    user_message: str,
    output_schema: dict,
    model: str,
    max_output_tokens: int,
    thinking_budget: int,
    temperature: float,
) -> dict:
    if genai is None:
        raise RuntimeError("google-genai not installed. pip install google-genai")

    client = genai.Client()
    cleaned = clean_schema_for_gemini(output_schema)

    cfg_kwargs = dict(
        system_instruction=system_prompt,
        response_mime_type="application/json",
        response_schema=cleaned,
        temperature=temperature,
        max_output_tokens=max_output_tokens,
    )
    if thinking_budget and genai_types is not None:
        cfg_kwargs["thinking_config"] = genai_types.ThinkingConfig(
            thinking_budget=thinking_budget,
        )

    response = client.models.generate_content(
        model=model,
        contents=user_message,
        config=genai_types.GenerateContentConfig(**cfg_kwargs),
    )

    text = response.text
    if not text:
        raise ValueError("empty response from Gemini")
    return json.loads(text)


def _call_anthropic_json(
    system_prompt: str,
    user_message: str,
    output_schema: dict,
    model: str,
) -> dict:
    if anthropic is None:
        raise RuntimeError("anthropic not installed. pip install anthropic")
    client = anthropic.Anthropic()
    response = client.messages.create(
        model=model,
        max_tokens=8192,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
        tools=[{
            "name": "output",
            "description": "Return structured output",
            "input_schema": output_schema,
        }],
        tool_choice={"type": "tool", "name": "output"},
    )
    for block in response.content:
        if block.type == "tool_use":
            return block.input
    raise ValueError("no tool_use block in Anthropic response")


# ──────────────────────────────────────────────────────────────────────
# Schema cleaner for Gemini's narrow JSON-Schema subset.
# Lifted from example_w_agent_calling.py::_clean_schema_for_gemini and
# extended to drop pattern/maxLength/minLength that our draft-2020 schemas use.
# ──────────────────────────────────────────────────────────────────────

_ALLOWED = {
    "type", "properties", "required", "items", "enum", "description",
    "format", "nullable", "minimum", "maximum", "minItems", "maxItems",
}


def clean_schema_for_gemini(schema: Any) -> Any:
    if not isinstance(schema, dict):
        return schema

    cleaned: dict = {}

    raw_type = schema.get("type")
    if isinstance(raw_type, list):
        non_null = [t for t in raw_type if t != "null"]
        has_null = "null" in raw_type
        cleaned["type"] = non_null[0] if non_null else "string"
        if has_null:
            cleaned["nullable"] = True
    elif raw_type:
        cleaned["type"] = raw_type

    for k, v in schema.items():
        if k == "type":
            continue
        if k not in _ALLOWED:
            continue
        if k == "properties" and isinstance(v, dict):
            cleaned[k] = {pk: clean_schema_for_gemini(pv) for pk, pv in v.items()}
        elif k == "items":
            cleaned[k] = clean_schema_for_gemini(v)
        elif k == "enum":
            clean_enum = [e for e in v if e is not None]
            if clean_enum:
                cleaned[k] = clean_enum
        else:
            cleaned[k] = v

    if "type" not in cleaned:
        cleaned["type"] = "object"

    if cleaned.get("type") == "array" and "items" not in cleaned:
        cleaned["items"] = {"type": "string"}

    return cleaned
