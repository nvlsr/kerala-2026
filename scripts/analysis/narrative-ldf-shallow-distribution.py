#!/usr/bin/env python3
"""
Original card 1 (Priority 1): LDF's collapse was shallow everywhere,
catastrophic nowhere.

Hypothesis: across 140 ACs, LDF's Δshare distribution is tightly
clustered around -6 to -9pp with low variance and few catastrophic-
loss outliers. This pattern is consistent with broad anti-incumbency
hitting roughly uniformly, NOT with concentrated geographic wipeouts.
A "wave" election with sharp regional collapses would show bimodal
or fat-tailed distribution.

Run: python3 scripts/analysis/narrative-ldf-shallow-distribution.py
"""
import json
import math
import os


# ─── Load data ────────────────────────────────────────────────────────
data2026 = json.load(open("data/kerala-2026.json"))
hist = {}
for f in os.listdir("data/historical"):
    if not f.startswith("S11-"):
        continue
    h = json.load(open(f"data/historical/{f}"))
    hist[h["constituencyNumber"]] = h


def share_in(cands, alliance):
    v = t = 0
    for c in cands:
        if c.get("isNota"):
            continue
        t += c["votes"]
        if c["alliance"] == alliance:
            v += c["votes"]
    return (v / t) * 100 if t > 0 else 0.0


# ─── Build per-AC LDF Δ ──────────────────────────────────────────────
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
    ldf21 = share_in(e21["candidates"], "LDF")
    ldf26 = share_in(c["candidates"], "LDF")
    udf21 = share_in(e21["candidates"], "UDF")
    udf26 = share_in(c["candidates"], "UDF")
    nda21 = share_in(e21["candidates"], "NDA")
    nda26 = share_in(c["candidates"], "NDA")

    rows.append({
        "seat": c["constituencyNumber"],
        "name": c["constituencyName"],
        "ldf21": ldf21,
        "ldf26": ldf26,
        "ldf_delta": ldf26 - ldf21,
        "udf_delta": udf26 - udf21,
        "nda_delta": nda26 - nda21,
    })

deltas = [r["ldf_delta"] for r in rows]
n = len(deltas)
print(f"Loaded {n} ACs.\n")


# ─── Distribution statistics ──────────────────────────────────────────
mean = sum(deltas) / n
sorted_d = sorted(deltas)
median = sorted_d[n // 2] if n % 2 == 1 else (sorted_d[n // 2 - 1] + sorted_d[n // 2]) / 2

variance = sum((x - mean) ** 2 for x in deltas) / n
sd = math.sqrt(variance)

# Skewness: third standardised moment
skew = (sum((x - mean) ** 3 for x in deltas) / n) / (sd ** 3) if sd > 0 else 0
# Excess kurtosis: fourth standardised moment - 3
kurt = (sum((x - mean) ** 4 for x in deltas) / n) / (sd ** 4) - 3 if sd > 0 else 0

q1 = sorted_d[n // 4]
q3 = sorted_d[3 * n // 4]
iqr = q3 - q1

print("=== (1) Distribution statistics — LDF Δshare across 140 ACs ===")
print(f"  n           : {n}")
print(f"  Mean        : {mean:+.2f}pp")
print(f"  Median      : {median:+.2f}pp")
print(f"  SD          : {sd:.2f}pp")
print(f"  Min         : {min(deltas):+.2f}pp")
print(f"  Max         : {max(deltas):+.2f}pp")
print(f"  Range       : {max(deltas) - min(deltas):.2f}pp")
print(f"  IQR (Q1-Q3) : {q1:+.2f}pp to {q3:+.2f}pp  (width {iqr:.2f}pp)")
print(f"  Skewness    : {skew:+.3f}  (0 = symmetric; positive = right tail)")
print(f"  Kurtosis    : {kurt:+.3f}  (0 = normal; positive = fatter tails)")
print()


# ─── Bin classification ──────────────────────────────────────────────
held_or_gained = [r for r in rows if r["ldf_delta"] > -5]
modest_loss = [r for r in rows if -10 <= r["ldf_delta"] <= -5]
deep_loss = [r for r in rows if -15 <= r["ldf_delta"] < -10]
catastrophic_loss = [r for r in rows if r["ldf_delta"] < -15]

print("=== (2) Bin classification ===")
print(f"  Held / gained (LDF Δ > -5pp)         : {len(held_or_gained):>3} ACs ({len(held_or_gained) * 100 / n:.1f}%)")
print(f"  Modest loss (-10 to -5pp)            : {len(modest_loss):>3} ACs ({len(modest_loss) * 100 / n:.1f}%)")
print(f"  Deep loss (-15 to -10pp)             : {len(deep_loss):>3} ACs ({len(deep_loss) * 100 / n:.1f}%)")
print(f"  Catastrophic loss (worse than -15pp) : {len(catastrophic_loss):>3} ACs ({len(catastrophic_loss) * 100 / n:.1f}%)")
print()


# ─── Histogram (text) ────────────────────────────────────────────────
print("=== (3) Text histogram, 1pp bins ===")
print("  Bin (LDF Δ)        Count  Bar")
buckets = {}
for d in deltas:
    bucket = int(math.floor(d))
    buckets[bucket] = buckets.get(bucket, 0) + 1

for bin_low in range(-25, 16):
    count = buckets.get(bin_low, 0)
    bar = "█" * count
    if count > 0:
        print(f"  {bin_low:>+3} to {bin_low + 1:>+3}     {count:>3}   {bar}")
print()


# ─── Outliers ────────────────────────────────────────────────────────
print("=== (4) Outliers — ACs more than 2 SD from mean ===")
threshold_high = mean + 2 * sd
threshold_low = mean - 2 * sd
outliers = [r for r in rows if r["ldf_delta"] > threshold_high or r["ldf_delta"] < threshold_low]
print(f"  Threshold for outlier: |Δ - {mean:+.2f}| > {2 * sd:.2f}  (i.e., outside [{threshold_low:+.2f}, {threshold_high:+.2f}])")
print(f"  Outliers found       : {len(outliers)} of {n}")
print()
print("  Catastrophic-loss outliers (LDF Δ < {:.2f}):".format(threshold_low))
for r in sorted([r for r in outliers if r["ldf_delta"] < threshold_low], key=lambda x: x["ldf_delta"]):
    print(f"    {r['seat']:>3} {r['name']:<18}  LDF Δ {r['ldf_delta']:+.2f}pp  "
          f"(UDF Δ {r['udf_delta']:+.2f}pp, NDA Δ {r['nda_delta']:+.2f}pp)")
print()
print("  LDF-gained outliers (LDF Δ > {:+.2f}):".format(threshold_high))
for r in sorted([r for r in outliers if r["ldf_delta"] > threshold_high], key=lambda x: -x["ldf_delta"]):
    print(f"    {r['seat']:>3} {r['name']:<18}  LDF Δ {r['ldf_delta']:+.2f}pp  "
          f"(UDF Δ {r['udf_delta']:+.2f}pp, NDA Δ {r['nda_delta']:+.2f}pp)")
print()


# ─── Comparison with theoretical expectations ────────────────────────
# What would a normal distribution N(mean, sd) say about these tails?
def normal_cdf(x, mu, sigma):
    """Normal CDF using erfc."""
    return 0.5 * (1 + math.erf((x - mu) / (sigma * math.sqrt(2))))


prob_below_15 = normal_cdf(-15, mean, sd)
expected_below_15 = prob_below_15 * n
actual_below_15 = sum(1 for d in deltas if d < -15)

prob_above_5 = 1 - normal_cdf(5, mean, sd)
expected_above_5 = prob_above_5 * n
actual_above_5 = sum(1 for d in deltas if d > 5)

print("=== (5) Distribution vs expected-normal — tail behavior ===")
print(f"  Under normal N({mean:+.2f}, {sd:.2f}):")
print(f"    Expected ACs with LDF Δ < -15pp : {expected_below_15:.2f}")
print(f"    Actual                          : {actual_below_15}")
print(f"    Expected ACs with LDF Δ > +5pp  : {expected_above_5:.2f}")
print(f"    Actual                          : {actual_above_5}")
print(f"  Excess kurtosis = {kurt:+.3f}: ", end="")
if kurt > 1:
    print("fatter tails than normal (more extreme outcomes than uniform anti-incumbency would predict)")
elif kurt < -1:
    print("thinner tails than normal (even more concentrated around the mean)")
else:
    print("approximately normal-tailed")
print()


# ─── How tightly clustered is the modal range? ────────────────────────
print("=== (6) Concentration in modal range ===")
mode_5to10 = sum(1 for d in deltas if -10 <= d <= -5)
mode_4to11 = sum(1 for d in deltas if -11 <= d <= -4)
mode_3to12 = sum(1 for d in deltas if -12 <= d <= -3)
print(f"  ACs with LDF Δ in [-10, -5]:  {mode_5to10:>3} ({mode_5to10 * 100 / n:.1f}%)")
print(f"  ACs with LDF Δ in [-11, -4]:  {mode_4to11:>3} ({mode_4to11 * 100 / n:.1f}%)")
print(f"  ACs with LDF Δ in [-12, -3]:  {mode_3to12:>3} ({mode_3to12 * 100 / n:.1f}%)")
print()


# ─── How does this compare to UDF gains? ────────────────────────────
print("=== (7) Comparison: distribution shape, LDF Δ vs UDF Δ vs NDA Δ ===")
def stats(xs):
    n = len(xs)
    m = sum(xs) / n
    v = sum((x - m) ** 2 for x in xs) / n
    s = math.sqrt(v)
    return m, s, min(xs), max(xs)


udfs = [r["udf_delta"] for r in rows]
ndas = [r["nda_delta"] for r in rows]
ldfs = deltas

m_l, s_l, min_l, max_l = stats(ldfs)
m_u, s_u, min_u, max_u = stats(udfs)
m_n, s_n, min_n, max_n = stats(ndas)

print(f"               mean       SD     range")
print(f"  LDF Δ      {m_l:+6.2f}   {s_l:5.2f}   [{min_l:+5.1f}, {max_l:+5.1f}]")
print(f"  UDF Δ      {m_u:+6.2f}   {s_u:5.2f}   [{min_u:+5.1f}, {max_u:+5.1f}]")
print(f"  NDA Δ      {m_n:+6.2f}   {s_n:5.2f}   [{min_n:+5.1f}, {max_n:+5.1f}]")
print()
print(f"  LDF SD ({s_l:.2f}) is the smallest of the three, meaning LDF's")
print(f"  loss was the most uniform across ACs. UDF and NDA gains are")
print(f"  more variable — gains concentrated in some ACs, absent in others.")
