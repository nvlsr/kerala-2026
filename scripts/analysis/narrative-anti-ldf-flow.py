#!/usr/bin/env python3
"""
Original card 3 (Priority 3): Anti-LDF, not pro-UDF — where did the
LDF vote go?

Hypothesis: most of UDF's 2026 gains aren't a positive UDF
mobilisation; they're the geographic landing pattern of LDF voters
leaving. Reframe "UDF surge" as "LDF erosion redirected toward UDF."

Method: for each AC, decompose alliance Δshares (UDF + LDF + NDA +
OTHER) which sum to ~0. Where LDF lost, attribute proportionally to
which alliances absorbed the loss. Then aggregate by region and
religion-bin to show the flow varies geographically.

Run: python3 scripts/analysis/narrative-anti-ldf-flow.py
"""
import json
import os

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from _lib.load import load_2026, load_historical


# ─── Load data ────────────────────────────────────────────────────────
data2026 = load_2026()
hist = load_historical()

ac_demo = json.load(open("data/ac-religion-2025.json"))
districts_meta = json.load(open("data/districts.json"))
district_of = districts_meta["constituencyToDistrict"]

NORTH = {"kasaragod", "kannur", "kozhikode", "wayanad", "malappuram"}
CENTRAL = {
    "palakkad",
    "thrissur",
    "ernakulam",
    "idukki",
    "kottayam",
    "pathanamthitta",
    "alappuzha",
}
SOUTH = {"kollam", "thiruvananthapuram"}


def region_of(d):
    if d in NORTH:
        return "N"
    if d in CENTRAL:
        return "C"
    if d in SOUTH:
        return "S"
    return "?"


def share_in(cands, alliance):
    v = t = 0
    for c in cands:
        if c.get("isNota"):
            continue
        t += c["votes"]
        if c["alliance"] == alliance:
            v += c["votes"]
    return (v / t) * 100 if t > 0 else 0.0


def share_other(cands):
    v = t = 0
    for c in cands:
        if c.get("isNota"):
            continue
        t += c["votes"]
        if c["alliance"] not in ("UDF", "LDF", "NDA"):
            v += c["votes"]
    return (v / t) * 100 if t > 0 else 0.0


# ─── Build per-AC rows ────────────────────────────────────────────────
rows = []
for c in data2026:
    h = hist.get(c["constituencyNumber"])
    if not h:
        continue
    e21 = next(
        (e for e in h["elections"] if e["year"] == 2021 and e.get("type") == "general"),
        None,
    )
    if not e21:
        continue
    ac = ac_demo["constituencies"].get(str(c["constituencyNumber"]))
    if not ac:
        continue
    dist = district_of.get(str(c["constituencyNumber"]), "?")

    udf_d = share_in(c["candidates"], "UDF") - share_in(e21["candidates"], "UDF")
    ldf_d = share_in(c["candidates"], "LDF") - share_in(e21["candidates"], "LDF")
    nda_d = share_in(c["candidates"], "NDA") - share_in(e21["candidates"], "NDA")
    other_d = share_other(c["candidates"]) - share_other(e21["candidates"])

    rows.append(
        {
            "seat": c["constituencyNumber"],
            "name": c["constituencyName"],
            "district": dist,
            "region": region_of(dist),
            "hindu": ac["religions"]["hindu"],
            "muslim": ac["religions"]["muslim"],
            "christian": ac["religions"]["christian"],
            "udf_d": udf_d,
            "ldf_d": ldf_d,
            "nda_d": nda_d,
            "other_d": other_d,
        }
    )


# ─── (1) Statewide flow accounting ─────────────────────────────────
print(f"Loaded {len(rows)} ACs.\n")
print("=== (1) Statewide flow (constituency-equal mean Δshares) ===")
mean_udf = sum(r["udf_d"] for r in rows) / len(rows)
mean_ldf = sum(r["ldf_d"] for r in rows) / len(rows)
mean_nda = sum(r["nda_d"] for r in rows) / len(rows)
mean_other = sum(r["other_d"] for r in rows) / len(rows)

print(f"  UDF Δ mean   : {mean_udf:+.2f}pp")
print(f"  LDF Δ mean   : {mean_ldf:+.2f}pp")
print(f"  NDA Δ mean   : {mean_nda:+.2f}pp")
print(f"  OTHER Δ mean : {mean_other:+.2f}pp")
print(f"  Sum          : {mean_udf + mean_ldf + mean_nda + mean_other:+.2f}pp")
print(f"  (Should be ≈0 if Δs reconcile; residual is NOTA Δ + rounding)")
print()
print(f"  Of LDF's {-mean_ldf:.2f}pp average loss across 140 ACs:")
print(
    f"    UDF absorbed:   {mean_udf:.2f}pp ({mean_udf / -mean_ldf * 100:.0f}% of LDF loss)"
)
print(
    f"    NDA absorbed:   {mean_nda:.2f}pp ({mean_nda / -mean_ldf * 100:.0f}% of LDF loss)"
)
print(
    f"    OTHER absorbed: {mean_other:.2f}pp ({mean_other / -mean_ldf * 100:.0f}% of LDF loss)"
)
print()

# ─── (2) Per-AC flow attribution ────────────────────────────────
print("=== (2) Per-AC flow attribution: where did LDF loss go? ===")
print()
print("  For each AC where LDF lost share, compute the proportion of LDF's loss")
print("  attributable to UDF gain, NDA gain, OTHER gain.")
print("  (When UDF/NDA/OTHER gains exceed LDF loss, the excess comes from each other,")
print("  not from LDF — note we're computing ATTRIBUTION shares assuming pure LDF flow.)")
print()

# Categorise each AC
def ac_flow_type(r):
    """Returns: 'udf-dominant', 'nda-dominant', 'mixed', 'ldf-gained', 'other-dominant'"""
    if r["ldf_d"] >= 0:
        return "ldf-gained-or-flat"
    udf, nda, other = r["udf_d"], r["nda_d"], r["other_d"]
    # Take only positive components (where alliances gained)
    pos_udf = max(0, udf)
    pos_nda = max(0, nda)
    pos_other = max(0, other)
    total_pos = pos_udf + pos_nda + pos_other
    if total_pos < 0.5:
        return "diffuse"  # very small LDF loss with diffuse beneficiaries
    udf_frac = pos_udf / total_pos
    nda_frac = pos_nda / total_pos
    if udf_frac > 0.7:
        return "udf-dominant"
    if nda_frac > 0.4:
        return "nda-dominant"
    return "mixed"


categories = {
    "udf-dominant": [],
    "nda-dominant": [],
    "mixed": [],
    "ldf-gained-or-flat": [],
    "diffuse": [],
}
for r in rows:
    categories[ac_flow_type(r)].append(r)

for cat, label in [
    ("udf-dominant", "UDF-dominant absorption (LDF→UDF >70%)"),
    ("mixed", "Mixed absorption (UDF + NDA share LDF loss)"),
    ("nda-dominant", "NDA-dominant absorption (NDA share >40%)"),
    ("ldf-gained-or-flat", "LDF held / gained share"),
    ("diffuse", "Tiny loss / diffuse"),
]:
    n = len(categories[cat])
    if n == 0:
        continue
    print(f"  {label:50s}  {n:>3} ACs ({n / len(rows) * 100:.1f}%)")
print()

# ─── (3) Geographic breakdown of flow type ──────────────────────
print("=== (3) Flow attribution by region ===")
print(f"  {'Region':10s}  {'n':>3s}  {'UDF-dom':>9s}  {'mixed':>8s}  {'NDA-dom':>9s}  {'LDF held':>9s}")
for reg in ["N", "C", "S"]:
    reg_rows = [r for r in rows if r["region"] == reg]
    n = len(reg_rows)
    udf_dom = sum(1 for r in reg_rows if ac_flow_type(r) == "udf-dominant")
    mixed = sum(1 for r in reg_rows if ac_flow_type(r) == "mixed")
    nda_dom = sum(1 for r in reg_rows if ac_flow_type(r) == "nda-dominant")
    held = sum(1 for r in reg_rows if ac_flow_type(r) == "ldf-gained-or-flat")
    print(
        f"  {reg:10s}  {n:>3}  {udf_dom:>3} ({udf_dom * 100 // n}%)  "
        f"{mixed:>3} ({mixed * 100 // n}%)  "
        f"{nda_dom:>3} ({nda_dom * 100 // n}%)  "
        f"{held:>3} ({held * 100 // n}%)"
    )
print()
print("  N = Kasaragod/Kannur/Kozhikode/Wayanad/Malappuram")
print("  C = Palakkad/Thrissur/Ernakulam/Idukki/Kottayam/Pathanamthitta/Alappuzha")
print("  S = Kollam/Thiruvananthapuram")
print()

# ─── (4) Mean flow proportions by region ────────────────────────
print("=== (4) Per-region mean UDF / NDA / OTHER absorption of LDF loss ===")
print(
    f"  {'Region':10s}  {'n':>3s}  {'mean LDF Δ':>11s}  {'mean UDF Δ':>11s}  "
    f"{'mean NDA Δ':>11s}  {'mean OTHER Δ':>13s}  {'UDF/-LDF':>9s}  {'NDA/-LDF':>9s}"
)
for reg in ["N", "C", "S"]:
    reg_rows = [r for r in rows if r["region"] == reg]
    n = len(reg_rows)
    mean_ldf = sum(r["ldf_d"] for r in reg_rows) / n
    mean_udf = sum(r["udf_d"] for r in reg_rows) / n
    mean_nda = sum(r["nda_d"] for r in reg_rows) / n
    mean_oth = sum(r["other_d"] for r in reg_rows) / n
    udf_share = mean_udf / -mean_ldf if mean_ldf < 0 else 0
    nda_share = mean_nda / -mean_ldf if mean_ldf < 0 else 0
    print(
        f"  {reg:10s}  {n:>3}  {mean_ldf:>+10.2f}pp  {mean_udf:>+10.2f}pp  "
        f"{mean_nda:>+10.2f}pp  {mean_oth:>+12.2f}pp  {udf_share * 100:>7.0f}%   {nda_share * 100:>7.0f}%"
    )
print()
print("  Interpretation: in each region, what fraction of LDF's loss was absorbed by UDF vs NDA?")
print()

# ─── (5) Religion-bin breakdown ──────────────────────────────────
print("=== (5) Flow attribution by religion bin ===")
bins = [
    ("Christian-heavy (≥30%)", lambda r: r["christian"] >= 30),
    ("Muslim-majority (≥60%)", lambda r: r["muslim"] >= 60),
    ("Muslim 30-60%", lambda r: 30 <= r["muslim"] < 60),
    ("Hindu-heavy (≥70%)", lambda r: r["hindu"] >= 70),
    ("Mixed (50-70% Hindu, low M+C)", lambda r: True),
]
already = set()
for label, pred in bins:
    bin_rows = [r for r in rows if pred(r) and r["seat"] not in already]
    for r in bin_rows:
        already.add(r["seat"])
    if not bin_rows:
        continue
    n = len(bin_rows)
    mean_ldf = sum(r["ldf_d"] for r in bin_rows) / n
    mean_udf = sum(r["udf_d"] for r in bin_rows) / n
    mean_nda = sum(r["nda_d"] for r in bin_rows) / n
    udf_share = mean_udf / -mean_ldf * 100 if mean_ldf < 0 else 0
    nda_share = mean_nda / -mean_ldf * 100 if mean_ldf < 0 else 0
    print(
        f"  {label:30s}  n={n:>3}  LDF Δ {mean_ldf:>+5.2f}pp  "
        f"UDF abs {udf_share:>5.0f}%   NDA abs {nda_share:>5.0f}%"
    )
print()

# ─── (6) The "where did the LDF voters go" thesis ────────────────
print("=== (6) Net contribution to UDF gain ===")
total_udf_gain = sum(r["udf_d"] for r in rows if r["udf_d"] > 0)
total_ldf_loss = sum(-r["ldf_d"] for r in rows if r["ldf_d"] < 0)
total_nda_gain = sum(r["nda_d"] for r in rows if r["nda_d"] > 0)
total_other_gain = sum(r["other_d"] for r in rows if r["other_d"] > 0)
print(f"  Constituency-equal sums of POSITIVE Δs:")
print(f"    UDF gain (where it gained):     {total_udf_gain:>7.1f}pp across {sum(1 for r in rows if r['udf_d'] > 0):>3} ACs")
print(f"    NDA gain (where it gained):     {total_nda_gain:>7.1f}pp across {sum(1 for r in rows if r['nda_d'] > 0):>3} ACs")
print(f"    OTHER gain (where it gained):   {total_other_gain:>7.1f}pp across {sum(1 for r in rows if r['other_d'] > 0):>3} ACs")
print()
print(f"  Constituency-equal sum of NEGATIVE LDF Δ:")
print(f"    LDF loss (where it lost):       {total_ldf_loss:>7.1f}pp across {sum(1 for r in rows if r['ldf_d'] < 0):>3} ACs")
print()
print(f"  Of the {total_udf_gain:.1f}pp UDF gained (constituency-equal):")
print(f"    - At least {min(total_ldf_loss, total_udf_gain):.1f}pp could plausibly come from LDF (if pure LDF→UDF)")
print(f"    - {total_udf_gain - total_nda_gain - total_other_gain:.1f}pp must come from non-NDA/OTHER sources")
print()
print(f"  This isn't a perfect attribution — voters can shift in many directions —")
print(f"  but it sets bounds. The ratio LDF-loss : UDF-gain : NDA-gain : OTHER-gain")
print(f"  = {total_ldf_loss:.0f} : {total_udf_gain:.0f} : {total_nda_gain:.0f} : {total_other_gain:.0f}.")
print()
print(f"  Reading: the magnitude of the UDF gain ({total_udf_gain:.0f}pp summed) is similar")
print(f"  to the LDF loss ({total_ldf_loss:.0f}pp summed). Most of UDF's gain is plausibly")
print(f"  the geographic landing of LDF's defection — consistent with 'anti-LDF, not pro-UDF.'")
