#!/usr/bin/env python3
"""
Session-1 robustness check: how much of A1's Christian-belt UDF
premium survives if we strip KC(M) (Kerala Congress (M), Jose K. Mani
faction) candidates from both 2021 and 2026 vote totals?

Background: KC(M) is concentrated in central Kerala (Kottayam +
Idukki + Pathanamthitta), heavily Christian-Catholic. Their base is
exactly the Christian-belt voters our A1 finding centers on. The
external-review concern: if KC(M)'s base eroded mid-cycle (Christian
voters defecting from Jose K. Mani's LDF-aligned KC(M) to UDF), the
A1 "Christian consolidation" finding could partly be driven by
KC(M)-specific churn — which is a behavioral story, but a more
narrowly-scoped one than "Christian voters consolidated behind UDF
broadly."

Note: KC(M) was alliance-tagged LDF in BOTH 2021 AND 2026 in our
data (verified). The agent's original concern about a 2021→2026
alliance switch was a misremembering of the 2016→2020 switch.
There's no relabeling artifact between our two cycles. But the
voter-defection question remains live.

Method:
  - Strip all "Kerala Congress (M)" candidates from both years'
    candidate lists (zero votes from numerator AND denominator).
  - Recompute UDF/LDF/NDA alliance shares per AC.
  - Re-run A1's Christian-share Pearson correlations and Christian
    bin means on the KC(M)-stripped totals.

Interpretation:
  - If Christian-belt premium SHRINKS substantially → KC(M) churn
    is a meaningful component of A1's signal.
  - If it STAYS similar → there's a separate Christian-belt UDF
    surge beyond KC(M)-specific dynamics.

Run: python3 scripts/analysis/narrative-a1-no-kcm.py
"""
import json
import math
import os

import numpy as np


# ─── Load + filter ────────────────────────────────────────────────────
data2026 = json.load(open("data/kerala-2026.json"))
hist = {}
for f in os.listdir("data/historical"):
    if not f.startswith("S11-"):
        continue
    h = json.load(open(f"data/historical/{f}"))
    hist[h["constituencyNumber"]] = h

ac_demo = json.load(open("data/ac-demographics-2025.json"))


def share_in(cands, alliance, exclude_party=None):
    """Alliance share of total non-NOTA votes, optionally excluding a party."""
    v = t = 0
    for c in cands:
        if c.get("isNota"):
            continue
        if exclude_party and c["party"] == exclude_party:
            continue
        t += c["votes"]
        if c["alliance"] == alliance:
            v += c["votes"]
    return (v / t) * 100 if t > 0 else 0.0


def kcm_share(cands):
    """KC(M) share of total non-NOTA votes (no exclusion)."""
    v = t = 0
    for c in cands:
        if c.get("isNota"):
            continue
        t += c["votes"]
        if c["party"] == "Kerala Congress (M)":
            v += c["votes"]
    return (v / t) * 100 if t > 0 else 0.0


KCM = "Kerala Congress (M)"

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

    # Original (KC(M) included)
    udf21 = share_in(e21["candidates"], "UDF")
    udf26 = share_in(c["candidates"], "UDF")
    ldf21 = share_in(e21["candidates"], "LDF")
    ldf26 = share_in(c["candidates"], "LDF")
    # KC(M)-stripped
    udf21_x = share_in(e21["candidates"], "UDF", exclude_party=KCM)
    udf26_x = share_in(c["candidates"], "UDF", exclude_party=KCM)
    ldf21_x = share_in(e21["candidates"], "LDF", exclude_party=KCM)
    ldf26_x = share_in(c["candidates"], "LDF", exclude_party=KCM)
    # KC(M) own party share
    kcm21 = kcm_share(e21["candidates"])
    kcm26 = kcm_share(c["candidates"])

    rows.append(
        {
            "seat": c["constituencyNumber"],
            "name": c["constituencyName"],
            "christian": ac["religions"]["christian"],
            "muslim": ac["religions"]["muslim"],
            "hindu": ac["religions"]["hindu"],
            "udf_delta": udf26 - udf21,
            "ldf_delta": ldf26 - ldf21,
            "udf_delta_no_kcm": udf26_x - udf21_x,
            "ldf_delta_no_kcm": ldf26_x - ldf21_x,
            "kcm21": kcm21,
            "kcm26": kcm26,
            "kcm_delta": kcm26 - kcm21,
        }
    )


# ─── KC(M) presence summary ────────────────────────────────────────
kcm_seats_2021 = [r for r in rows if r["kcm21"] > 0]
kcm_seats_2026 = [r for r in rows if r["kcm26"] > 0]
kcm_either = [r for r in rows if r["kcm21"] > 0 or r["kcm26"] > 0]

print(f"Loaded {len(rows)} ACs.")
print()
print(f"KC(M) contested in 2021: {len(kcm_seats_2021)} ACs")
print(f"KC(M) contested in 2026: {len(kcm_seats_2026)} ACs")
print(f"KC(M) contested in either:  {len(kcm_either)} ACs")
print()

# What's the per-AC KC(M) share Δ?
print("=== KC(M) party share by AC (both cycles) ===")
print(f"{'AC':>4}  {'name':18s}  {'C%':>5s}  {'2021':>6s}  {'2026':>6s}  {'Δ':>7s}")
for r in sorted(kcm_either, key=lambda x: -max(x["kcm21"], x["kcm26"])):
    print(
        f"{r['seat']:>4}  {r['name']:18s}  {r['christian']:>5.1f}  "
        f"{r['kcm21']:>6.1f}  {r['kcm26']:>6.1f}  {r['kcm_delta']:>+7.2f}"
    )
mean_kcm21 = sum(r["kcm21"] for r in kcm_seats_2021) / len(kcm_seats_2021)
mean_kcm26 = sum(r["kcm26"] for r in kcm_seats_2026) / len(kcm_seats_2026)
print(
    f"\nMean KC(M) share where contested: {mean_kcm21:.1f}% (2021) → "
    f"{mean_kcm26:.1f}% (2026)"
)


# ─── Pearson correlation comparison ────────────────────────────────
def pearson(xs, ys):
    n = len(xs)
    mx = sum(xs) / n
    my = sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    dx = sum((x - mx) ** 2 for x in xs) ** 0.5
    dy = sum((y - my) ** 2 for y in ys) ** 0.5
    return num / (dx * dy) if dx > 0 and dy > 0 else 0


def corr_p(r, n):
    """t-stat-based two-sided p for Pearson r."""
    if abs(r) >= 1:
        return 0.0
    t = r * math.sqrt((n - 2) / (1 - r * r))
    return math.erfc(abs(t) / math.sqrt(2))


cols = [
    ("christian", "Christian share"),
    ("muslim", "Muslim share"),
    ("hindu", "Hindu share"),
]
deltas = [
    ("udf_delta", "udf_delta_no_kcm", "UDF Δ"),
    ("ldf_delta", "ldf_delta_no_kcm", "LDF Δ"),
]

print("\n=== Pearson r comparison: original vs KC(M)-stripped ===")
print(
    f"{'Predictor':16s}  {'Outcome':10s}  {'r (orig)':>10s}  {'r (no-KCM)':>11s}  {'Δr':>7s}"
)
for col, col_label in cols:
    xs = [r[col] for r in rows]
    for orig_key, x_key, dep_label in deltas:
        ys_orig = [r[orig_key] for r in rows]
        ys_x = [r[x_key] for r in rows]
        r1 = pearson(xs, ys_orig)
        r2 = pearson(xs, ys_x)
        print(
            f"{col_label:16s}  {dep_label:10s}  {r1:>+10.3f}  {r2:>+11.3f}  "
            f"{(r2 - r1):>+7.3f}"
        )

# ─── Bin means: Christian-heavy 30-50% bin ─────────────────────────
print("\n=== Christian-heavy bin (30 ≤ C < 50, n=?): UDF Δ comparison ===")
bin_rows = [r for r in rows if 30 <= r["christian"] < 50]
print(f"  n = {len(bin_rows)}")
mean_orig = sum(r["udf_delta"] for r in bin_rows) / len(bin_rows)
mean_x = sum(r["udf_delta_no_kcm"] for r in bin_rows) / len(bin_rows)
mean_kcm = sum(r["kcm21"] for r in bin_rows) / len(bin_rows)
mean_kcm26 = sum(r["kcm26"] for r in bin_rows) / len(bin_rows)
print(f"  Mean KC(M) share '21: {mean_kcm:.1f}%   '26: {mean_kcm26:.1f}%")
print(f"  Mean UDF Δ (original):       {mean_orig:+.2f}pp")
print(f"  Mean UDF Δ (KC(M)-stripped): {mean_x:+.2f}pp")
print(f"  Difference (artifact size):  {mean_x - mean_orig:+.2f}pp")

# Statewide control mean
all_orig = sum(r["udf_delta"] for r in rows) / len(rows)
all_x = sum(r["udf_delta_no_kcm"] for r in rows) / len(rows)
print(f"\n  Statewide mean UDF Δ (original):       {all_orig:+.2f}pp")
print(f"  Statewide mean UDF Δ (KC(M)-stripped): {all_x:+.2f}pp")
print(
    f"  Christian-heavy premium (orig):       "
    f"{mean_orig - all_orig:+.2f}pp"
)
print(
    f"  Christian-heavy premium (KC(M)-stripped): "
    f"{mean_x - all_x:+.2f}pp"
)

# ─── Top 8 KC(M) seats: where did the LDF→UDF shift happen? ─────────
print("\n=== KC(M)-contested ACs: where did the alliance Δ go? ===")
kcm_active = [r for r in rows if r["kcm21"] > 5 or r["kcm26"] > 5]
print(
    f"{'AC':>4}  {'name':18s}  {'C%':>5s}  {'KC(M) Δ':>9s}  "
    f"{'UDF Δ':>8s}  {'LDF Δ':>8s}  {'UDF Δ no-KC':>13s}  {'LDF Δ no-KC':>13s}"
)
for r in sorted(kcm_active, key=lambda x: -x["christian"]):
    print(
        f"{r['seat']:>4}  {r['name']:18s}  {r['christian']:>5.1f}  "
        f"{r['kcm_delta']:>+9.2f}  {r['udf_delta']:>+8.2f}  {r['ldf_delta']:>+8.2f}  "
        f"{r['udf_delta_no_kcm']:>+13.2f}  {r['ldf_delta_no_kcm']:>+13.2f}"
    )
