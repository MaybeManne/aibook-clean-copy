#!/usr/bin/env python3
"""
Salvage Pass A hard failures that are safely repairable by a program.

Most common case fixable here: `duplicate_id` soft flag is already handled
inside the verified file (salvage only runs against hard failures now). The
only auto-fixable hard mode is really id collisions that somehow survived the
soft-flag path. Unfixable hard cases (whitespace span, span outside chunk,
malformed marker) move to review_queue.jsonl.

Input: data2/pass_a_verified/{concepts,items}.{verified,failures}.jsonl
Output: rewrites the verified files with any salvaged records appended;
        writes review_queue.jsonl for records that could not be salvaged.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def load_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open() as f:
        return [json.loads(l) for l in f if l.strip()]


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as f:
        for r in records:
            f.write(json.dumps(r) + "\n")


SLUG_RE_STRICT = re.compile(r"^[a-z][a-z0-9_]{1,63}$")


def sanitize_id(rid: str) -> str | None:
    """Coerce an ID into a valid slug by lowercasing and replacing runs of
    non-alphanumeric chars with single underscores. Returns None if nothing
    usable remains."""
    s = rid.lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = s.strip("_")
    if not s or not s[0].isalpha():
        return None
    if len(s) > 63:
        s = s[:63].rstrip("_")
    return s if SLUG_RE_STRICT.match(s) else None


def is_auto_fixable_hard(issues: list[str]) -> bool:
    # Fixable: only 'invalid id' issues (case/char fixup).
    return all(i.startswith("invalid id") for i in issues)


def salvage_record(rec: dict, used_ids: set[str]) -> dict | None:
    issues = rec.get("_hard_issues", [])
    if not is_auto_fixable_hard(issues):
        return None
    salvaged = dict(rec)
    salvaged.pop("_hard_issues", None)
    salvaged.pop("_soft_flags", None)
    orig_id = salvaged.get("id", "")
    new_id = sanitize_id(orig_id)
    if new_id is None:
        return None
    if new_id in used_ids:
        i = 2
        while f"{new_id}_{i}" in used_ids:
            i += 1
        new_id = f"{new_id}_{i}"
    salvaged["id"] = new_id
    used_ids.add(new_id)
    salvaged.setdefault("quality_flags", []).append(f"renamed_from:{orig_id}")
    return salvaged


def apply_dup_id_soft_flags(records: list[dict]) -> list[dict]:
    """Rename records whose quality_flags include 'duplicate_id' to <id>__<chunk_id>."""
    used: set[str] = set()
    first_seen: dict[str, dict] = {}
    for r in records:
        rid = r.get("id")
        if rid and rid not in first_seen:
            first_seen[rid] = r
            used.add(rid)

    out = []
    for r in records:
        flags = r.get("quality_flags") or []
        if "duplicate_id" not in flags:
            out.append(r)
            continue
        # Only rename if this isn't the first occurrence
        rid = r.get("id")
        if first_seen.get(rid) is r:
            out.append(r)
            continue
        chunk_id = r.get("chunk_id", "unk")
        new_id = f"{rid}__{chunk_id}"
        i = 2
        while new_id in used:
            new_id = f"{rid}__{chunk_id}_{i}"
            i += 1
        used.add(new_id)
        r2 = dict(r)
        r2["id"] = new_id
        r2["quality_flags"] = [f for f in flags if f != "duplicate_id"]
        r2.setdefault("quality_flags", []).append(f"renamed_from:{rid}")
        out.append(r2)
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--dir", type=Path, default=Path("data2/pass_a_verified"))
    args = ap.parse_args()

    c_ver  = load_jsonl(args.dir / "concepts.verified.jsonl")
    i_ver  = load_jsonl(args.dir / "items.verified.jsonl")
    c_fail = load_jsonl(args.dir / "concepts.failures.jsonl")
    i_fail = load_jsonl(args.dir / "items.failures.jsonl")

    # Merge+dedup by applying id-rename for the duplicate_id soft flag.
    # This may also rename exercise_group IDs; collect the rename map so we
    # can fix sub-exercise parent_group_id references below.
    rename_map: dict[str, str] = {}

    def remember_renames(records: list[dict]) -> list[dict]:
        before = {id(r): r.get("id") for r in records}
        out = apply_dup_id_soft_flags(records)
        for r in out:
            # Identify via 'renamed_from:*' flag
            for f in r.get("quality_flags", []):
                if f.startswith("renamed_from:"):
                    orig = f.split(":", 1)[1]
                    rename_map[orig] = r["id"]
        return out

    c_ver = remember_renames(c_ver)
    i_ver = remember_renames(i_ver)

    # Try to salvage hard failures; anything not salvageable goes to review
    used = {r["id"] for r in c_ver} | {r["id"] for r in i_ver}
    review: list[dict] = []
    n_c_salvaged = 0
    n_i_salvaged = 0
    for r in c_fail:
        orig = r.get("id")
        fixed = salvage_record(r, used)
        if fixed:
            if orig and orig != fixed["id"]:
                rename_map[orig] = fixed["id"]
            c_ver.append(fixed); used.add(fixed["id"]); n_c_salvaged += 1
        else:
            review.append({"record_kind": "concept", **r})
    for r in i_fail:
        orig = r.get("id")
        fixed = salvage_record(r, used)
        if fixed:
            if orig and orig != fixed["id"]:
                rename_map[orig] = fixed["id"]
            i_ver.append(fixed); used.add(fixed["id"]); n_i_salvaged += 1
        else:
            review.append({"record_kind": "item", **r})

    # Fix parent_group_id and sub_item_ids references after renames
    if rename_map:
        for r in i_ver:
            pgid = r.get("parent_group_id")
            if pgid in rename_map:
                r["parent_group_id"] = rename_map[pgid]
            subs = r.get("sub_item_ids")
            if subs:
                r["sub_item_ids"] = [rename_map.get(s, s) for s in subs]
        print(f"fixed {len(rename_map)} id references in parent/sub links")

    write_jsonl(args.dir / "concepts.verified.jsonl", c_ver)
    write_jsonl(args.dir / "items.verified.jsonl", i_ver)
    write_jsonl(args.dir / "review_queue.jsonl", review)

    print(f"salvaged: {n_c_salvaged} concepts, {n_i_salvaged} items from hard failures")
    print(f"review queue: {len(review)} records")
    print(f"now: {len(c_ver)} concepts, {len(i_ver)} items verified")


if __name__ == "__main__":
    main()
