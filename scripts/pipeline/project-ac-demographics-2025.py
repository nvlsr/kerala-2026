#!/usr/bin/env python3
"""
Build a 2025-projected version of data/ac-religion.json by applying
state-level uniform multipliers to each AC's religion shares.

Multipliers come from the cohort projection in
scripts/cohort-project-2011-to-2025.py (used Wikipedia/CRS state-level
births by religion + Census 2011 starting populations + crude death
rate). State drift 2011 → 2025:
  Hindu     54.73% → 52.49%   (× 0.9591)
  Muslim    26.56% → 29.66%   (× 1.1166)
  Christian 18.38% → 17.85%   (× 0.9712)

Limitations baked into the output's `note` field:
  - Uniform state-level multiplier; assumes Kerala's geographic
    religion gradient hasn't shifted, only absolute shares.
  - Doesn't model AC-specific fertility differentials (Muslim TFR
    varies geographically — bigger in Malappuram than Trivandrum).
  - Census 2011 baseline + simple cohort progression; not a
    formally-validated demographic model.

Output: data/ac-religion-2025.json with same shape as the 2011
file (constituencies keyed by AC number, religion shares, source).
The renormalization step preserves the "other"/sikh/buddhist/jain
buckets and ensures every AC's shares sum to 100%.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent

# State-level uniform drift multipliers (2011 → 2025)
MULT = {
    "hindu": 0.9591,
    "muslim": 1.1166,
    "christian": 0.9712,
}
# Smaller religion buckets stay at their 2011 level — too noisy to
# project from state-level data; they re-normalise into the total.
PASSTHROUGH = ("sikh", "buddhist", "jain", "other")


def project(rel: dict) -> dict:
    """Apply state-level multipliers and renormalize to 100%."""
    h = rel["hindu"] * MULT["hindu"]
    m = rel["muslim"] * MULT["muslim"]
    c = rel["christian"] * MULT["christian"]
    others = {k: rel.get(k, 0.0) for k in PASSTHROUGH}
    total = h + m + c + sum(others.values())
    if total <= 0:
        return rel
    scale = 100 / total
    return {
        "hindu": round(h * scale, 2),
        "muslim": round(m * scale, 2),
        "christian": round(c * scale, 2),
        **{k: round(v * scale, 2) for k, v in others.items()},
    }


def main() -> None:
    src = json.loads((ROOT / "data" / "ac-religion.json").read_text())
    out_constituencies = {}
    for ac_num, entry in src["constituencies"].items():
        out_constituencies[ac_num] = {
            **entry,
            "religions": project(entry["religions"]),
        }

    output = {
        "year": 2025,
        "baseYear": 2011,
        "source": (
            "Projected from data/ac-religion.json (Census 2011 + SHRUG) "
            "using state-level uniform cohort multipliers derived from "
            "Kerala CRS births by religion 2011-2023 + Census 2011 "
            "starting populations + crude death rate ~7/1000."
        ),
        "multipliers": MULT,
        "note": (
            "STATE-LEVEL uniform projection. The geographic religion "
            "gradient is assumed unchanged from 2011; only absolute "
            "shares drift. AC-specific fertility differentials are NOT "
            "modelled (Muslim TFR varies geographically and is highest "
            "in already-Muslim-heavy areas like Malappuram). Use 2011 "
            "data for analytical claims about specific districts; use "
            "this 2025 file for visualisation only. See "
            "docs/data-pipeline.md for limitations."
        ),
        "constituencies": out_constituencies,
    }

    out_path = ROOT / "data" / "ac-religion-2025.json"
    out_path.write_text(json.dumps(output, indent=2) + "\n")
    print(f"Wrote {out_path}")
    print(f"  ACs projected: {len(out_constituencies)}")

    # Quick sanity: state aggregate after projection
    total_pop = total_h = total_m = total_c = 0.0
    for v in out_constituencies.values():
        if v["source"] != "shrug-c01-aggregated":
            continue
        p = v["matchedPopulation"]
        if p is None:
            continue
        total_pop += p
        total_h += p * v["religions"]["hindu"] / 100
        total_m += p * v["religions"]["muslim"] / 100
        total_c += p * v["religions"]["christian"] / 100
    print()
    print("=== State aggregate (across shrug-c01-aggregated ACs) ===")
    print(f"  matched pop: {total_pop:,.0f}")
    print(f"  H: {total_h/total_pop*100:.2f}%")
    print(f"  M: {total_m/total_pop*100:.2f}%")
    print(f"  C: {total_c/total_pop*100:.2f}%")
    print()
    print("=== Expected from cohort projection ===")
    print("  H: ~52.49%  M: ~29.66%  C: ~17.85%")


if __name__ == "__main__":
    main()
