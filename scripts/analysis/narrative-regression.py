#!/usr/bin/env python3
"""
Session-1 methodology hardening: OLS regressions with district / region
fixed effects to test whether the simple-Pearson findings in our
narrative cards survive controls.

For each card, we run:
  Model 1: simple OLS without controls (replicates the card's headline)
  Model 2: + region FE (3 regions: North / Central / South)
  Model 3: + district FE (14 districts, one dropped as reference)

If a coefficient on the religion/caste predictor remains significant
(|t| > 1.96) and substantively similar after controls, the card's
finding survives. If it collapses to ~0, the original signal was
likely a regional-clustering artifact.

Caste is district-level data — within a district, all ACs share caste
values — so district FE absorbs caste perfectly. For B3+B4 we only
use region FE.

Run: python3 scripts/analysis/narrative-regression.py
"""
import json
import math
import os

import numpy as np


# ─── Load data ────────────────────────────────────────────────────────
data2026 = json.load(open("data/results-2026.json"))
hist = {}
for f in os.listdir("data/historical"):
    if not f.startswith("S11-"):
        continue
    h = json.load(open(f"data/historical/{f}"))
    hist[h["constituencyNumber"]] = h

ac_demo = json.load(open("data/ac-religion-2025.json"))
districts_meta = json.load(open("data/districts.json"))
caste_data = json.load(open("data/district-hindu-castes.json"))


# Region partition (3 belts of Kerala)
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

district_of = districts_meta["constituencyToDistrict"]


def region_of(district_id):
    if district_id in NORTH:
        return "N"
    if district_id in CENTRAL:
        return "C"
    if district_id in SOUTH:
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


def share_party(cands, party):
    v = t = 0
    for c in cands:
        if c.get("isNota"):
            continue
        t += c["votes"]
        if c["party"] == party:
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

    dist = district_of[str(c["constituencyNumber"])]
    caste = caste_data["districts"].get(dist)
    hindu_share = ac["religions"]["hindu"]

    udf21 = share_in(e21["candidates"], "UDF")
    udf26 = share_in(c["candidates"], "UDF")
    ldf21 = share_in(e21["candidates"], "LDF")
    ldf26 = share_in(c["candidates"], "LDF")
    nda21 = share_in(e21["candidates"], "NDA")
    nda26 = share_in(c["candidates"], "NDA")
    bjp21 = share_party(e21["candidates"], "Bharatiya Janata Party")
    bjp26 = share_party(c["candidates"], "Bharatiya Janata Party")

    rows.append(
        {
            "seat": c["constituencyNumber"],
            "name": c["constituencyName"],
            "district": dist,
            "region": region_of(dist),
            "hindu": hindu_share,
            "muslim": ac["religions"]["muslim"],
            "christian": ac["religions"]["christian"],
            "udf21": udf21,
            "udf_delta": udf26 - udf21,
            "ldf21": ldf21,
            "ldf_delta": ldf26 - ldf21,
            "nda21": nda21,
            "nda_delta": nda26 - nda21,
            "bjp21": bjp21,
            "bjp_delta": bjp26 - bjp21,
            # Caste data is district-level, reported as % of district Hindu pop.
            # Multiply by AC Hindu share to get % of total AC population —
            # same scaling used in /religion-map's caste maps.
            "nair": caste["nair"] * hindu_share / 100 if caste else 0,
            "ezhava": caste["ezhava"] * hindu_share / 100 if caste else 0,
        }
    )


# ─── OLS via numpy linalg ────────────────────────────────────────────
def ols(X, y):
    """Returns (beta, se, t, p, r2, n) for OLS X β = y."""
    X = np.asarray(X, dtype=float)
    y = np.asarray(y, dtype=float)
    n, p = X.shape
    XtX = X.T @ X
    XtX_inv = np.linalg.inv(XtX)
    beta = XtX_inv @ X.T @ y
    resid = y - X @ beta
    sigma2 = (resid @ resid) / (n - p)
    var_beta = sigma2 * XtX_inv
    se_beta = np.sqrt(np.diag(var_beta))
    t_stat = beta / se_beta
    # Two-sided p-value via normal approximation (df ~= 120 here, t ~ z)
    p_val = np.array(
        [math.erfc(abs(t) / math.sqrt(2)) for t in t_stat]
    )
    ss_res = resid @ resid
    ss_tot = ((y - y.mean()) ** 2).sum()
    r2 = 1 - ss_res / ss_tot
    return {
        "beta": beta,
        "se": se_beta,
        "t": t_stat,
        "p": p_val,
        "r2": r2,
        "n": n,
    }


def build_X(predictors, fe_kind=None):
    """Design matrix builder. fe_kind: None | 'region' | 'district'."""
    n = len(rows)
    columns = [np.ones(n)]
    labels = ["intercept"]

    for k in predictors:
        columns.append(np.array([r[k] for r in rows]))
        labels.append(k)

    if fe_kind == "district":
        # Reference: alappuzha (alphabetically first)
        all_dists = sorted({r["district"] for r in rows})
        ref = all_dists[0]
        for d in all_dists[1:]:
            columns.append(np.array([1 if r["district"] == d else 0 for r in rows]))
            labels.append(f"D_{d}")
    elif fe_kind == "region":
        # Reference: C (Central, the largest)
        for reg in ["N", "S"]:
            columns.append(np.array([1 if r["region"] == reg else 0 for r in rows]))
            labels.append(f"R_{reg}")

    X = np.column_stack(columns)
    return X, labels


def stars(p):
    if p < 0.01:
        return "***"
    if p < 0.05:
        return "**"
    if p < 0.10:
        return "*"
    return "  "


def report(label, predictors, dep_var, show_fe=False):
    print(f"\n=== {label}  (dep: {dep_var}) ===")
    y = np.array([r[dep_var] for r in rows])

    for fe_kind, fe_label in [
        (None, "Model 1: no controls"),
        ("region", "Model 2: + region FE (Central=ref)"),
        ("district", "Model 3: + district FE (Alappuzha=ref)"),
    ]:
        # Caste data + district FE are perfectly colinear (caste constant within
        # district). Skip district FE for caste predictors.
        if fe_kind == "district" and any(p in ("nair", "ezhava") for p in predictors):
            print(f"\n  {fe_label}: SKIPPED — caste is district-constant, FE absorbs perfectly")
            continue

        X, lbls = build_X(predictors, fe_kind=fe_kind)
        res = ols(X, y)
        print(f"\n  {fe_label}")
        print(
            f"    {'predictor':22s}  {'coef':>7s} {'SE':>6s} {'t':>6s} {'p':>5s}"
        )
        rows_to_show = len(predictors) + 1  # intercept + main predictors
        for i in range(rows_to_show):
            print(
                f"    {lbls[i]:22s}  {res['beta'][i]:+7.3f} {res['se'][i]:6.3f} "
                f"{res['t'][i]:+6.2f} {res['p'][i]:5.3f} {stars(res['p'][i])}"
            )
        if show_fe and fe_kind is not None:
            for i in range(rows_to_show, len(lbls)):
                print(
                    f"    {lbls[i]:22s}  {res['beta'][i]:+7.3f} {res['se'][i]:6.3f} "
                    f"{res['t'][i]:+6.2f} {res['p'][i]:5.3f} {stars(res['p'][i])}"
                )
        print(f"    R²={res['r2']:.3f}  n={res['n']}")


print(f"Loaded {len(rows)} ACs.")
print()
print("Region distribution:")
for reg in ["N", "C", "S"]:
    n = sum(1 for r in rows if r["region"] == reg)
    print(f"  {reg}: n={n}")
print()
print("Significance: *** p<0.01, ** p<0.05, * p<0.10")
print("=" * 70)

# ─── A1 — does the Christian-belt UDF effect survive controls? ───────
report(
    "A1 — Christian-belt UDF premium",
    predictors=["christian", "muslim", "udf21"],
    dep_var="udf_delta",
)

# Same dependent question, LDF side
report(
    "A1 — LDF collapse vs religion",
    predictors=["christian", "muslim", "ldf21"],
    dep_var="ldf_delta",
)

# ─── A3 — does the BJP-share growth pattern survive controls? ────────
report(
    "A3 — BJP party-share growth vs Hindu %",
    predictors=["hindu", "bjp21"],
    dep_var="bjp_delta",
)

report(
    "A3 — NDA alliance growth vs Hindu %",
    predictors=["hindu", "nda21"],
    dep_var="nda_delta",
)

# ─── B3+B4 — caste effect after controls (region only; FE absorbs) ───
report(
    "B3+B4 — Nair × UDF Δ",
    predictors=["nair", "ezhava"],
    dep_var="udf_delta",
)

report(
    "B3+B4 — Nair × NDA Δ",
    predictors=["nair", "ezhava"],
    dep_var="nda_delta",
)

# ─── For comparison: how much of UDF Δ is explained by region alone? ─
print()
print("=" * 70)
print("\n=== Reference: how much UDF Δ variance is region-explained? ===")
X, lbls = build_X([], fe_kind="region")
y = np.array([r["udf_delta"] for r in rows])
res = ols(X, y)
print(f"\n  Model: UDF_delta ~ region only")
for i, l in enumerate(lbls):
    print(
        f"    {l:18s}  β={res['beta'][i]:+.3f}  SE={res['se'][i]:.3f}  "
        f"t={res['t'][i]:+.2f}  p={res['p'][i]:.3f} {stars(res['p'][i])}"
    )
print(f"    R²={res['r2']:.3f}")

X, lbls = build_X([], fe_kind="district")
res = ols(X, y)
print(f"\n  Model: UDF_delta ~ district FE only")
print(f"    R²={res['r2']:.3f}  (n params: {len(lbls)})")
