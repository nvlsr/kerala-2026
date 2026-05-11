#!/usr/bin/env python3
"""
Session-3 standalone card: BJP's flat statewide aggregate (+0.18pp)
hides ±25pp AC-level reorganisation. Explore the geography of where
BJP grew vs ceded ground.

Run: python3 scripts/analysis/narrative-bjp-ac-growth.py
"""
import json
import os


# ─── Load data ────────────────────────────────────────────────────────
data2026 = json.load(open("data/kerala-2026.json"))
hist = {}
for f in os.listdir("data/historical"):
    if not f.startswith("S11-"):
        continue
    h = json.load(open(f"data/historical/{f}"))
    hist[h["constituencyNumber"]] = h

ac_demo = json.load(open("data/ac-demographics-2025.json"))
districts_meta = json.load(open("data/districts.json"))
district_of = districts_meta["constituencyToDistrict"]


def share_party(cands, party):
    """Party's share of total non-NOTA votes."""
    v = t = 0
    for c in cands:
        if c.get("isNota"):
            continue
        t += c["votes"]
        if c["party"] == party:
            v += c["votes"]
    return (v / t) * 100 if t > 0 else 0.0


def share_alliance(cands, alliance):
    v = t = 0
    for c in cands:
        if c.get("isNota"):
            continue
        t += c["votes"]
        if c["alliance"] == alliance:
            v += c["votes"]
    return (v / t) * 100 if t > 0 else 0.0


# ─── Build per-AC rows ────────────────────────────────────────────────
BJP = "Bharatiya Janata Party"
BDJS = "Bharath Dharma Jana Sena"

rows = []
for c in data2026:
    h = hist.get(c["constituencyNumber"])
    if not h:
        continue
    e21 = next(
        (e for e in h["elections"] if e["year"] == 2021 and e.get("type") == "general"),
        None,
    )
    e16 = next(
        (e for e in h["elections"] if e["year"] == 2016 and e.get("type") == "general"),
        None,
    )
    if not e21:
        continue
    ac = ac_demo["constituencies"].get(str(c["constituencyNumber"]))
    if not ac:
        continue

    bjp16 = share_party(e16["candidates"], BJP) if e16 else None
    bjp21 = share_party(e21["candidates"], BJP)
    bjp26 = share_party(c["candidates"], BJP)

    bdjs21 = share_party(e21["candidates"], BDJS)
    bdjs26 = share_party(c["candidates"], BDJS)

    nda21 = share_alliance(e21["candidates"], "NDA")
    nda26 = share_alliance(c["candidates"], "NDA")

    bjp_fielded_21 = any(
        cand["party"] == BJP and not cand.get("isNota") for cand in e21["candidates"]
    )
    bjp_fielded_26 = any(
        cand["party"] == BJP and not cand.get("isNota") for cand in c["candidates"]
    )

    rows.append(
        {
            "seat": c["constituencyNumber"],
            "name": c["constituencyName"],
            "district": district_of.get(str(c["constituencyNumber"]), "?"),
            "hindu": ac["religions"]["hindu"],
            "muslim": ac["religions"]["muslim"],
            "christian": ac["religions"]["christian"],
            "bjp16": bjp16,
            "bjp21": bjp21,
            "bjp26": bjp26,
            "bjp_delta_21_26": bjp26 - bjp21,
            "bjp_delta_16_21": (bjp21 - bjp16) if bjp16 is not None else None,
            "bdjs21": bdjs21,
            "bdjs26": bdjs26,
            "nda21": nda21,
            "nda26": nda26,
            "nda_delta": nda26 - nda21,
            "bjp_fielded_21": bjp_fielded_21,
            "bjp_fielded_26": bjp_fielded_26,
        }
    )

print(f"Loaded {len(rows)} ACs.\n")

# ─── (1) Statewide aggregate ──────────────────────────────────────
total_v_21 = sum(
    cd["votes"]
    for ac_num, h in hist.items()
    for e in h["elections"]
    if e["year"] == 2021 and e.get("type") == "general"
    for cd in e["candidates"]
    if not cd.get("isNota")
)
total_v_26 = sum(
    cd["votes"] for c in data2026 for cd in c["candidates"] if not cd.get("isNota")
)
total_bjp_21 = sum(
    cd["votes"]
    for ac_num, h in hist.items()
    for e in h["elections"]
    if e["year"] == 2021 and e.get("type") == "general"
    for cd in e["candidates"]
    if not cd.get("isNota") and cd["party"] == BJP
)
total_bjp_26 = sum(
    cd["votes"]
    for c in data2026
    for cd in c["candidates"]
    if not cd.get("isNota") and cd["party"] == BJP
)

print("=== (1) Statewide BJP aggregate ===")
print(
    f"  BJP votes:   {total_bjp_21:>10,} (2021)  →  {total_bjp_26:>10,} (2026)"
)
print(f"  Total votes: {total_v_21:>10,}        →  {total_v_26:>10,}")
print(
    f"  BJP share:   {(total_bjp_21 / total_v_21) * 100:.2f}%        →  "
    f"{(total_bjp_26 / total_v_26) * 100:.2f}%        Δ "
    f"{((total_bjp_26 / total_v_26) - (total_bjp_21 / total_v_21)) * 100:+.2f}pp"
)
print()

# ─── (2) Distribution of BJP party-share Δ ───────────────────────
deltas = [r["bjp_delta_21_26"] for r in rows]
print("=== (2) Distribution of BJP party-share Δ across 140 ACs ===")
print(f"  Min:    {min(deltas):+6.2f}pp")
print(f"  Max:    {max(deltas):+6.2f}pp")
print(f"  Mean:   {sum(deltas) / len(deltas):+6.2f}pp")
deltas_sorted = sorted(deltas)
print(f"  Median: {deltas_sorted[len(deltas) // 2]:+6.2f}pp")
print(
    f"  ACs with BJP Δ > +5pp:  {sum(1 for d in deltas if d > 5):>3}"
)
print(
    f"  ACs with BJP Δ > +10pp: {sum(1 for d in deltas if d > 10):>3}"
)
print(
    f"  ACs with BJP Δ > +15pp: {sum(1 for d in deltas if d > 15):>3}"
)
print(
    f"  ACs with BJP Δ < -5pp:  {sum(1 for d in deltas if d < -5):>3}"
)
print(
    f"  ACs with BJP Δ < -10pp: {sum(1 for d in deltas if d < -10):>3}"
)
print()

# ─── (3) Top 20 BJP gainers ───────────────────────────────────────
print("=== (3) Top 20 BJP party-share Δ gainers ===")
print(
    f"{'AC':>4}  {'name':18s}  {'district':16s}  {'H%':>4s}  {'C%':>4s}  "
    f"{'M%':>4s}  {'BJP21':>5s}  {'BJP26':>5s}  {'Δ':>7s}"
)
for r in sorted(rows, key=lambda x: -x["bjp_delta_21_26"])[:20]:
    print(
        f"{r['seat']:>4}  {r['name']:18s}  {r['district']:16s}  "
        f"{r['hindu']:>4.0f}  {r['christian']:>4.0f}  {r['muslim']:>4.0f}  "
        f"{r['bjp21']:>5.1f}  {r['bjp26']:>5.1f}  {r['bjp_delta_21_26']:>+7.2f}"
    )
print()

# ─── (4) Top 20 BJP losers (where BJP withdrew) ──────────────────
print("=== (4) Top 20 BJP party-share Δ LOSERS (cessions) ===")
print(
    f"{'AC':>4}  {'name':18s}  {'district':16s}  {'H%':>4s}  {'BDJS21':>6s}  "
    f"{'BDJS26':>6s}  {'BJP21':>5s}  {'BJP26':>5s}  {'Δ':>7s}  fielded"
)
for r in sorted(rows, key=lambda x: x["bjp_delta_21_26"])[:20]:
    fielded = (
        "21✓26✗"
        if (r["bjp_fielded_21"] and not r["bjp_fielded_26"])
        else "21✓26✓"
        if (r["bjp_fielded_21"] and r["bjp_fielded_26"])
        else "21✗26✗"
        if (not r["bjp_fielded_21"] and not r["bjp_fielded_26"])
        else "21✗26✓"
    )
    print(
        f"{r['seat']:>4}  {r['name']:18s}  {r['district']:16s}  "
        f"{r['hindu']:>4.0f}  {r['bdjs21']:>6.1f}  {r['bdjs26']:>6.1f}  "
        f"{r['bjp21']:>5.1f}  {r['bjp26']:>5.1f}  {r['bjp_delta_21_26']:>+7.2f}  {fielded}"
    )
print()

# ─── (5) Where did BJP withdraw? ──────────────────────────────────
withdrew = [
    r for r in rows if r["bjp_fielded_21"] and not r["bjp_fielded_26"]
]
fielded_both = [r for r in rows if r["bjp_fielded_21"] and r["bjp_fielded_26"]]
new_entries = [
    r for r in rows if not r["bjp_fielded_21"] and r["bjp_fielded_26"]
]

print("=== (5) BJP fielding pattern 2021 → 2026 ===")
print(
    f"  Fielded BJP in 2021 only (withdrew):       {len(withdrew):>3} ACs"
)
print(
    f"  Fielded BJP in both:                        {len(fielded_both):>3} ACs"
)
print(
    f"  Fielded BJP in 2026 only (new entries):    {len(new_entries):>3} ACs"
)
print(
    f"  Fielded in neither:                         "
    f"{sum(1 for r in rows if not r['bjp_fielded_21'] and not r['bjp_fielded_26']):>3} ACs"
)
print()
print("  Cessions (BJP withdrew, mostly to NDA allies):")
for r in sorted(withdrew, key=lambda x: -x["bjp21"])[:10]:
    print(
        f"    {r['seat']:>3} {r['name']:18s}  H{r['hindu']:>3.0f}%  "
        f"BJP21 {r['bjp21']:>5.1f}%  BDJS21 {r['bdjs21']:>4.1f}%  "
        f"BDJS26 {r['bdjs26']:>4.1f}%  NDA Δ {r['nda_delta']:>+5.1f}pp"
    )
print()

# ─── (6) Geography of growth: by district ────────────────────────
print("=== (6) BJP party-share Δ aggregated by district ===")
by_dist = {}
for r in rows:
    d = r["district"]
    if d not in by_dist:
        by_dist[d] = {"total": 0, "n": 0, "max": -100, "min": 100}
    by_dist[d]["total"] += r["bjp_delta_21_26"]
    by_dist[d]["n"] += 1
    by_dist[d]["max"] = max(by_dist[d]["max"], r["bjp_delta_21_26"])
    by_dist[d]["min"] = min(by_dist[d]["min"], r["bjp_delta_21_26"])

for d in sorted(by_dist.keys(), key=lambda x: -by_dist[x]["total"] / by_dist[x]["n"]):
    v = by_dist[d]
    print(
        f"  {d.title():18s}  n={v['n']:>2}  mean Δ {v['total'] / v['n']:>+6.2f}pp  "
        f"min {v['min']:>+5.1f}  max {v['max']:>+5.1f}"
    )
print()

# ─── (7) Religion-mix cross-tab ──────────────────────────────────
print("=== (7) BJP party-share Δ by religion bin ===")
bins = [
    ("Hindu ≥ 70%", lambda r: r["hindu"] >= 70),
    ("Hindu 50-70%", lambda r: 50 <= r["hindu"] < 70),
    ("Christian ≥ 30%", lambda r: r["christian"] >= 30),
    ("Muslim ≥ 60%", lambda r: r["muslim"] >= 60),
    ("Muslim 30-60%", lambda r: 30 <= r["muslim"] < 60),
    ("Mixed (none of above)", lambda r: True),
]
already = set()
for label, pred in bins:
    bin_rows = [r for r in rows if pred(r) and r["seat"] not in already]
    for r in bin_rows:
        already.add(r["seat"])
    if not bin_rows:
        continue
    deltas = [r["bjp_delta_21_26"] for r in bin_rows]
    print(
        f"  {label:24s}  n={len(bin_rows):>3}  "
        f"mean Δ {sum(deltas) / len(deltas):>+6.2f}pp  "
        f"max {max(deltas):>+5.1f}  min {min(deltas):>+5.1f}"
    )
print()

# ─── (8) Did 2026 growth come from prior toehold or from zero? ───
have_16 = [r for r in rows if r["bjp16"] is not None]
print(
    f"=== (8) 2026 BJP gainers — prior toehold check (n={len(have_16)} ACs with 2016 data) ==="
)
print(f"  ACs with BJP Δ ≥ +10pp (2021→2026):")
big_gainers = [r for r in have_16 if r["bjp_delta_21_26"] >= 10]
print(f"    n = {len(big_gainers)}")
print(f"    Mean BJP 2016 share in these ACs: {sum(r['bjp16'] for r in big_gainers) / len(big_gainers):.1f}%")
print(f"    Mean BJP 2021 share in these ACs: {sum(r['bjp21'] for r in big_gainers) / len(big_gainers):.1f}%")
print(f"    Mean BJP 2026 share in these ACs: {sum(r['bjp26'] for r in big_gainers) / len(big_gainers):.1f}%")
print()
print("  Were these growth ACs already non-zero in 2016?")
nonzero16 = [r for r in big_gainers if r["bjp16"] > 5]
zero16 = [r for r in big_gainers if r["bjp16"] <= 5]
print(
    f"    BJP > 5% in 2016: {len(nonzero16):>2} of {len(big_gainers):>2} "
    f"({len(nonzero16) * 100 / len(big_gainers):.0f}%) — gains built on prior toehold"
)
print(
    f"    BJP ≤ 5% in 2016: {len(zero16):>2} of {len(big_gainers):>2} "
    f"({len(zero16) * 100 / len(big_gainers):.0f}%) — gains from near-zero base"
)

# ─── (9) Statewide net: where did the votes come/go? ──────────────
print()
print("=== (9) Net BJP-share movement — where did it come/go? ===")
gain_total_pp = sum(d for d in (r["bjp_delta_21_26"] for r in rows) if d > 0)
loss_total_pp = sum(d for d in (r["bjp_delta_21_26"] for r in rows) if d < 0)
print(f"  Sum of positive Δ (where BJP gained): {gain_total_pp:+.1f}pp across all ACs")
print(f"  Sum of negative Δ (where BJP shrank): {loss_total_pp:+.1f}pp across all ACs")
print(f"  Net (sum of all Δ): {gain_total_pp + loss_total_pp:+.1f}pp")
print(
    f"  These are constituency-equal sums; vote-weighted statewide aggregate "
    f"is the +{((total_bjp_26 / total_v_26) - (total_bjp_21 / total_v_21)) * 100:.2f}pp number above."
)

# ─── (10) NDA absorption check on BJP cessions ───────────────────
print()
print("=== (10) NDA absorption check: in BJP-cession ACs, did NDA hold? ===")
cession_nda = [(r["nda21"], r["nda26"], r["nda_delta"]) for r in withdrew]
mean_nda21 = sum(x[0] for x in cession_nda) / len(cession_nda)
mean_nda26 = sum(x[1] for x in cession_nda) / len(cession_nda)
mean_nda_d = sum(x[2] for x in cession_nda) / len(cession_nda)
print(
    f"  {len(withdrew)} BJP-cession ACs:  mean NDA21 {mean_nda21:.1f}%  "
    f"NDA26 {mean_nda26:.1f}%  Δ {mean_nda_d:+.1f}pp"
)
print(
    f"  Interpretation: BJP withdrew, NDA allies (BDJS, KC(B), Twenty20) ran instead. "
    f"NDA aggregate held / grew (+{mean_nda_d:.1f}pp), so the cession was strategic "
    f"alliance-management, not voter-loss."
)
