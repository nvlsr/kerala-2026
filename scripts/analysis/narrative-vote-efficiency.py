#!/usr/bin/env python3
"""
Original card 2 (Priority 2): UDF won through vote-efficiency, not
just swing.

Hypothesis: UDF's 102-seat majority came from converting modest
statewide-share gains into outsized seat counts because the gains
landed in medium-margin, flippable seats. LDF's vote share remained
substantial (33%) but was inefficiently distributed — large surpluses
in stronghold ACs (Kannur, Thrissur) plus losing-effort votes
elsewhere produced 35 seats. NDA's 14% statewide produced just 3
seats — the most concentrated and inefficient distribution.

Key metrics:
- Seats-to-vote-share ratio per alliance (3-way Sainte-Laguë style)
- Wasted votes per alliance (losing-effort votes + winning surplus)
- Median winning margin per alliance
- Distribution of winning margins by alliance
- 2021 vs 2026 efficiency comparison

Run: python3 scripts/analysis/narrative-vote-efficiency.py
"""
import json
import math
import os

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from _lib.load import load_2026, load_historical


# ─── Load data ────────────────────────────────────────────────────────
data2026 = load_2026()
hist = load_historical()


def share_in(cands, alliance):
    v = t = 0
    for c in cands:
        if c.get("isNota"):
            continue
        t += c["votes"]
        if c["alliance"] == alliance:
            v += c["votes"]
    return (v / t) * 100 if t > 0 else 0.0


def alliance_votes(cands, alliance):
    return sum(c["votes"] for c in cands if not c.get("isNota") and c["alliance"] == alliance)


def total_votes(cands):
    return sum(c["votes"] for c in cands if not c.get("isNota"))


def winner_alliance(cands):
    """Best-vote alliance; tiebreaks alphabetically (n/a for our data)."""
    by_alliance = {}
    for c in cands:
        if c.get("isNota"):
            continue
        by_alliance.setdefault(c["alliance"], 0)
        by_alliance[c["alliance"]] += c["votes"]
    return max(by_alliance.items(), key=lambda kv: kv[1])[0] if by_alliance else None


def runner_up_alliance(cands, winner_alliance_code):
    by_alliance = {}
    for c in cands:
        if c.get("isNota"):
            continue
        if c["alliance"] == winner_alliance_code:
            continue
        by_alliance.setdefault(c["alliance"], 0)
        by_alliance[c["alliance"]] += c["votes"]
    if not by_alliance:
        return None
    return max(by_alliance.items(), key=lambda kv: kv[1])[0]


def alliance_share_per_seat_avg(cands_list, alliance):
    """Mean alliance share across all seats — constituency-equal."""
    shares = [share_in(cands, alliance) for cands in cands_list]
    return sum(shares) / len(shares) if shares else 0.0


# ─── Build per-AC analysis ────────────────────────────────────────────
ALLIANCES = ["UDF", "LDF", "NDA"]


def analyse_year(year):
    """Return dict with statewide aggregate stats + per-AC margin info."""
    if year == 2026:
        ac_iter = [(c["constituencyNumber"], c["candidates"]) for c in data2026]
    else:
        ac_iter = []
        for ac_num, h in hist.items():
            e = next(
                (e for e in h["elections"] if e["year"] == year and e.get("type") == "general"),
                None,
            )
            if not e:
                continue
            ac_iter.append((ac_num, e["candidates"]))

    if not ac_iter:
        return None

    total_v = sum(total_votes(cands) for _, cands in ac_iter)
    alliance_v = {a: sum(alliance_votes(cands, a) for _, cands in ac_iter) for a in ALLIANCES}
    seats_won = {a: 0 for a in ALLIANCES}
    other_seats = 0
    margin_data = {a: [] for a in ALLIANCES}  # winning margins for that alliance
    wasted_per_alliance = {a: 0 for a in ALLIANCES}

    for ac_num, cands in ac_iter:
        if not cands:
            continue
        winner = winner_alliance(cands)
        ac_total = total_votes(cands)

        # Tally seats won
        if winner in ALLIANCES:
            seats_won[winner] += 1
        else:
            other_seats += 1

        # Alliance vote totals in this AC
        ac_alliance_votes = {
            a: alliance_votes(cands, a) for a in ALLIANCES + ["OTHER"] + [winner]
        }
        ac_alliance_votes = {
            a: alliance_votes(cands, a)
            for a in set(c["alliance"] for c in cands if not c.get("isNota"))
        }

        # Compute wasted: for the winning alliance, surplus = winner_votes - runner_up_votes;
        # for losing alliances, wasted = their full votes in this AC.
        winner_votes = ac_alliance_votes.get(winner, 0)
        runner = runner_up_alliance(cands, winner)
        runner_votes = ac_alliance_votes.get(runner, 0) if runner else 0
        winner_surplus = max(0, winner_votes - runner_votes)

        for a in ALLIANCES:
            if a == winner:
                wasted_per_alliance[a] += winner_surplus
            else:
                wasted_per_alliance[a] += ac_alliance_votes.get(a, 0)

        # Margin for the winning alliance (in pp of total)
        if winner in ALLIANCES and ac_total > 0:
            margin_pp = (winner_votes - runner_votes) / ac_total * 100
            margin_data[winner].append(margin_pp)

    return {
        "year": year,
        "total_votes": total_v,
        "alliance_votes": alliance_v,
        "alliance_share": {a: alliance_v[a] / total_v * 100 for a in ALLIANCES},
        "seats_won": seats_won,
        "other_seats": other_seats,
        "margin_data": margin_data,
        "wasted_per_alliance": wasted_per_alliance,
    }


a2021 = analyse_year(2021)
a2026 = analyse_year(2026)

# ─── (1) Headline: vote share → seat share ────────────────────────
print("=" * 70)
print("=== (1) Vote share → seat share efficiency ===")
print()
print(f"{'':16s} {'2021':>10s} {'':>10s} {'':>3s} {'2026':>10s} {'':>10s}")
print(f"{'Alliance':16s} {'votes %':>10s} {'seats':>10s} {'':>3s} {'votes %':>10s} {'seats':>10s}")
total_seats = sum(a2026["seats_won"].values()) + a2026["other_seats"]
for a in ALLIANCES:
    print(
        f"{a:16s}  {a2021['alliance_share'][a]:>8.2f}%   "
        f"{a2021['seats_won'][a]:>3} / 140    "
        f"{a2026['alliance_share'][a]:>8.2f}%   "
        f"{a2026['seats_won'][a]:>3} / 140"
    )
print(f"{'OTHER (incl. NOTA, Indep)':16s}  {'':>9s}    "
      f"{a2021['other_seats']:>3} / 140    {'':>9s}    "
      f"{a2026['other_seats']:>3} / 140")
print()

# ─── (2) Seats:vote-share ratio (efficiency proxy) ────────────────
print("=== (2) Seats per percentage point of statewide vote share ===")
print(f"  Higher = more efficient (more seats per vote)")
print(f"  Lower  = less efficient (votes wasted in either strongholds or losing efforts)")
print()
print(f"{'Alliance':16s} {'2021':>15s} {'2026':>15s} {'Δ':>10s}")
for a in ALLIANCES:
    r21 = a2021["seats_won"][a] / a2021["alliance_share"][a] if a2021["alliance_share"][a] > 0 else 0
    r26 = a2026["seats_won"][a] / a2026["alliance_share"][a] if a2026["alliance_share"][a] > 0 else 0
    print(f"  {a:16s} {r21:>13.3f}   {r26:>13.3f}   {r26 - r21:>+9.3f}")
print()

# ─── (3) Wasted votes per alliance ─────────────────────────────────
print("=== (3) Wasted votes per alliance (2026) ===")
print("    Wasted = winning surplus (above runner-up) + all losing-effort votes")
print()
total_v_26 = a2026["total_votes"]
for a in ALLIANCES:
    w = a2026["wasted_per_alliance"][a]
    print(
        f"  {a:16s}  wasted: {w:>10,}  ({w / total_v_26 * 100:>5.2f}% of total)  "
        f"of {a2026['alliance_votes'][a]:>10,} cast"
    )
print()
print("  Interpretation: more wasted votes means votes 'didn't help win seats' —")
print("  either piled up in losing efforts or surplus in safe wins.")
print()

# ─── (4) Median + distribution of winning margins ────────────────
print("=== (4) Distribution of winning margins (pp of total votes) per alliance, 2026 ===")
print()
print(f"{'Alliance':16s} {'n won':>6s} {'min':>6s} {'25%':>6s} {'median':>7s} {'mean':>6s} {'75%':>6s} {'max':>6s}")
for a in ALLIANCES:
    m = sorted(a2026["margin_data"][a])
    if not m:
        print(f"  {a:16s} {'0':>6s}")
        continue
    n = len(m)
    p25 = m[n // 4] if n >= 4 else m[0]
    p50 = m[n // 2] if n % 2 else (m[n // 2 - 1] + m[n // 2]) / 2 if n >= 2 else m[0]
    p75 = m[3 * n // 4] if n >= 4 else m[-1]
    mean = sum(m) / n
    print(
        f"  {a:16s} {n:>6} {m[0]:>5.2f}  {p25:>5.2f}  {p50:>6.2f}  "
        f"{mean:>5.2f}  {p75:>5.2f}  {m[-1]:>5.2f}"
    )
print()

# ─── (5) Margin-distribution histogram by alliance ────────────────
print("=== (5) Histogram of winning margins by alliance, 5pp bins ===")
print()
bins = [(0, 5), (5, 10), (10, 15), (15, 20), (20, 25), (25, 30), (30, 40), (40, 100)]
print(f"{'Margin (pp)':12s}  {'UDF':>5s}  {'LDF':>5s}  {'NDA':>5s}")
for low, high in bins:
    udf_n = sum(1 for x in a2026["margin_data"]["UDF"] if low <= x < high)
    ldf_n = sum(1 for x in a2026["margin_data"]["LDF"] if low <= x < high)
    nda_n = sum(1 for x in a2026["margin_data"]["NDA"] if low <= x < high)
    print(f"  [{low:>2}, {high:>2})    {udf_n:>5}  {ldf_n:>5}  {nda_n:>5}")
print()

# ─── (6) The "efficient win zone" — UDF's marginal-seat conversion ─
print("=== (6) Efficient-win conversion: how many seats won by < 10pp margin? ===")
def under10(arr):
    return sum(1 for x in arr if x < 10)


for a in ALLIANCES:
    won = a2026["seats_won"][a]
    narrow = under10(a2026["margin_data"][a])
    pct = narrow / won * 100 if won > 0 else 0
    print(f"  {a:16s}  {narrow:>3} of {won:>3} won by <10pp  ({pct:>5.1f}% of {a} wins)")
print()
print("  Interpretation: UDF won a high % of its seats on tight margins — efficient")
print("  conversion. LDF won fewer seats overall but on bigger margins (strongholds).")
print()

# ─── (7) Counterfactual: what if UDF had only 38% (its 2021 share)? ─
print("=== (7) Counterfactual seat-share if alliances kept 2021 vote shares ===")
print()
print("  This is a thought experiment. Suppose every AC swung uniformly so that")
print("  statewide vote shares matched 2021. Estimate seats won under that")
print("  hypothesis using uniform-swing reweighting on each AC.")
print()
# Per-AC uniform swing: shift each AC's 2026 alliance share by (a2021 - a2026) statewide
shifts = {a: a2021["alliance_share"][a] - a2026["alliance_share"][a] for a in ALLIANCES}
print(f"  Shifts to apply to each AC (toward 2021 statewide):")
for a in ALLIANCES:
    print(f"    {a}: {shifts[a]:+.2f}pp")

cf_seats = {a: 0 for a in ALLIANCES}
cf_other = 0
for c in data2026:
    cands = c["candidates"]
    ac_total = total_votes(cands)
    if ac_total == 0:
        continue
    # Compute current alliance shares
    shares = {a: share_in(cands, a) for a in ALLIANCES}
    other_share = 100 - sum(shares.values())
    # Apply uniform shift
    new_shares = {a: shares[a] + shifts[a] for a in ALLIANCES}
    new_other = max(0, 100 - sum(new_shares.values()))
    # Pick winner
    candidates_alliances = list(new_shares.items()) + [("OTHER", new_other)]
    winner = max(candidates_alliances, key=lambda kv: kv[1])[0]
    if winner in ALLIANCES:
        cf_seats[winner] += 1
    else:
        cf_other += 1

print()
print(f"  Counterfactual seat counts under uniform-swing-back-to-2021:")
for a in ALLIANCES:
    actual = a2026["seats_won"][a]
    cf = cf_seats[a]
    print(f"    {a}: actual 2026 = {actual}, counterfactual = {cf} ({cf - actual:+} from 2021-shares)")
print(f"    OTHER: actual = {a2026['other_seats']}, counterfactual = {cf_other}")
print()
print("  Reading: how much of UDF's seat win is 'efficient distribution' vs 'shifting")
print("  the share'? If UDF still wins comfortably under 2021-shares, the geographic")
print("  distribution of votes mattered as much as the swing magnitude.")
