#!/usr/bin/env python3
"""
Canonicalize party names in data/raw/scraped-2021/seat-N.json files.

The 2021 ECI scrape used short codes (BJP, T2P, INC, CPIM, ...) which
forced every cross-cycle script to remember to handle both forms — and
caused a real bug at least once (the T20 / T2P miss in the BJP-pocket
narrative pass). This script rewrites the source files in place to use
the canonical long-form names that the 2026 master and the historical
S11 files already use.

Run from repo root:
    python3 scripts/canonicalize-2021-parties.py

Idempotent: running multiple times produces the same result.

The canonical map is loaded from data/alliances.json (the existing
project-wide single source of truth for party metadata, including
`partyAliases` and `partyAbbreviation`). The same file is consumed by
the TypeScript data layer via src/lib/data/loaders.ts.
"""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
ALLIANCES_PATH = ROOT / "data" / "alliances.json"
SCRAPED_DIR = ROOT / "data" / "scraped-2021"


def build_variant_to_canonical(alliances_doc):
    """
    Builds {variant: canonical} from data/alliances.json. Combines:
      - direct partyAliases mappings (variant → canonical full name)
      - inverse of partyAbbreviation (abbreviation → canonical full name)
      - canonical names mapping to themselves (idempotency)

    Resolves transitive aliases at build time (e.g. ADHMPI → Anna DHRM
    → Democratic Human Rights Movement Party collapses to ADHMPI →
    Democratic Human Rights Movement Party).
    """
    party_aliases = {
        k: v for k, v in alliances_doc.get("partyAliases", {}).items()
        if not k.startswith("_")
    }
    party_abbrev = alliances_doc.get("partyAbbreviation", {})
    party_to_alliance = alliances_doc.get("partyToAlliance", {})

    out = {}
    # Canonicals → themselves (any party that has an alliance entry is
    # treated as a canonical full name).
    for canonical in party_to_alliance:
        out[canonical] = canonical
    for canonical in party_abbrev:
        out[canonical] = canonical
    # Targets of aliases are themselves canonical → self-map them.
    for canonical in party_aliases.values():
        out[canonical] = canonical
    # Abbreviation → canonical (auto-generated reverse).
    for canonical, abbrev in party_abbrev.items():
        if abbrev in out and out[abbrev] != canonical:
            raise ValueError(
                f"abbreviation {abbrev!r} maps to multiple canonicals: "
                f"{out[abbrev]!r} and {canonical!r}"
            )
        out[abbrev] = canonical
    # Direct aliases (highest priority — overrides auto-generated).
    for variant, canonical in party_aliases.items():
        out[variant] = canonical

    # Resolve transitive chains (variant → A → B → canonical).
    for variant in list(out):
        seen = {variant}
        target = out[variant]
        while target in out and out[target] != target and out[target] not in seen:
            seen.add(target)
            target = out[target]
        out[variant] = target

    return out


def canonicalize_file(path: Path, variant_to_canonical: dict, stats: dict):
    """Rewrites one seat-N.json file in place, canonicalizing party names."""
    with path.open() as f:
        data = json.load(f)

    changed = False
    for cand in data.get("candidates", []):
        original = cand.get("party")
        if original is None:
            continue
        canonical = variant_to_canonical.get(original)
        if canonical is None:
            stats["unmapped"][original] = stats["unmapped"].get(original, 0) + 1
            continue
        if canonical != original:
            cand["party"] = canonical
            changed = True
            key = f"{original} -> {canonical}"
            stats["renamed"][key] = stats["renamed"].get(key, 0) + 1

    if changed:
        with path.open("w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        stats["files_modified"] += 1
    else:
        stats["files_unchanged"] += 1


def main():
    if not ALLIANCES_PATH.exists():
        sys.exit(f"missing alliances metadata: {ALLIANCES_PATH}")
    alliances_doc = json.loads(ALLIANCES_PATH.read_text())
    variant_to_canonical = build_variant_to_canonical(alliances_doc)

    stats = {
        "files_modified": 0,
        "files_unchanged": 0,
        "renamed": {},
        "unmapped": {},
    }

    seat_files = sorted(SCRAPED_DIR.glob("seat-*.json"))
    if not seat_files:
        sys.exit(f"no seat-*.json files in {SCRAPED_DIR}")

    for path in seat_files:
        canonicalize_file(path, variant_to_canonical, stats)

    print(
        f"Files: {stats['files_modified']} modified, "
        f"{stats['files_unchanged']} unchanged "
        f"(of {len(seat_files)} total)"
    )
    print("\nRename counts (variant -> canonical):")
    for key, n in sorted(stats["renamed"].items(), key=lambda kv: -kv[1]):
        print(f"  {n:>4}  {key}")

    if stats["unmapped"]:
        print("\nUnmapped party labels (left as-is):")
        for label, n in sorted(stats["unmapped"].items(), key=lambda kv: -kv[1]):
            print(f"  {n:>4}  {label!r}")


if __name__ == "__main__":
    main()
