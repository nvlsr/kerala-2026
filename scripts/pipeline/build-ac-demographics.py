#!/usr/bin/env python3
"""
Build AC-level religion demographics for Kerala by joining:
  - SHRUG shrid → AC mapping (post-2008 delimitation)
  - SHRUG shrid → Census 2011 town/subdistrict codes
  - SHRUG shrid population (PCA totals)
  - Census 2011 Table C-01 religion shares (town + sub-district level)

Output: data/ac-demographics.json with religion shares per AC.

Resolution:
  - Urban shrids match towns directly (town-level religion data)
  - Rural shrids match sub-districts (sub-district-level religion data
    for the rural sub-population)
  - 26 of 140 ACs have no SHRUG match (mostly major urban centres) —
    they fall back to district-level religion for those entries.
"""
from __future__ import annotations

import json
import os
import sys
from collections import defaultdict
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent.parent
SHRUG = ROOT / "data" / "shrug"
KERALA_STATE_CODE = "32"  # Census 2011 state code for Kerala
RELIGIONS = ["hindu", "muslim", "christian", "sikh", "buddhist", "jain", "other"]
# Column indices in the C-01 XLS (PERSONS only — not males/females separately)
COL_DISTT = 2
COL_TEHSIL = 3
COL_TOWN = 4
COL_AREA_NAME = 5
COL_TOTAL_RURAL_URBAN = 6
COL_TOTAL_PERSONS = 7
COL_HINDU_PERSONS = 10
COL_MUSLIM_PERSONS = 13
COL_CHRISTIAN_PERSONS = 16
COL_SIKH_PERSONS = 19
COL_BUDDHIST_PERSONS = 22
COL_JAIN_PERSONS = 25
COL_OTHER_PERSONS = 28


def parse_c01() -> tuple[dict, dict, dict, dict, dict]:
    """Returns (district_total_religion, district_urban_religion,
    subdistrict_rural_religion, town_by_tehsil_religion,
    town_aggregate_religion).

    Most towns sit in a single sub-district and emit one C-01 row.
    Three Kerala cities (Trivandrum/Kochi/Kollam Corporations) span
    multiple sub-districts and emit per-tehsil-Part rows + an
    aggregate row. We key tehsil-Part data by (tehsil, town) so the
    correct Part is matched when a shrid sits in a specific
    sub-district. The aggregate map is the fallback for shrids whose
    (tehsil, town) lookup misses.

    district_urban_religion is used for the 26 fallback ACs which
    are urban-heavy — closer to their actual mix than district TOTAL
    (which averages rural + urban populations of the whole district).
    """
    df = pd.read_excel(
        ROOT / "data" / "raw" / "census-c01" / "DDW32C-01-MDDS.XLS",
        sheet_name="C01",
        header=None,
    )

    def safe_float(v) -> float | None:
        if pd.isna(v):
            return None
        try:
            return float(v)
        except (TypeError, ValueError):
            return None

    def religion_dict(row) -> dict | None:
        total = safe_float(row[COL_TOTAL_PERSONS])
        if total is None or total <= 0:
            return None
        cols = [
            ("hindu", COL_HINDU_PERSONS),
            ("muslim", COL_MUSLIM_PERSONS),
            ("christian", COL_CHRISTIAN_PERSONS),
            ("sikh", COL_SIKH_PERSONS),
            ("buddhist", COL_BUDDHIST_PERSONS),
            ("jain", COL_JAIN_PERSONS),
            ("other", COL_OTHER_PERSONS),
        ]
        out = {"population": total}
        for name, col in cols:
            v = safe_float(row[col])
            out[name] = (v or 0) / total * 100
        return out

    district_total_rel: dict[str, dict] = {}
    district_urban_rel: dict[str, dict] = {}
    subdist_rural_rel: dict[str, dict] = {}
    # Town religion keyed by (tehsil_id, town_id). Three Kerala cities
    # span multiple sub-districts and C-01 emits one row per (tehsil,
    # town) part PLUS an aggregate row with tehsil="00000". Keying by
    # tehsil too prevents the aggregate or the wrong part from
    # overwriting the right one (was a real bug — Vattiyoorkavu AC 133
    # ended up with the small "Part 2" of Trivandrum Corp's mix).
    town_rel: dict[tuple[str, str], dict] = {}
    # Aggregate town row (no tehsil split) — used as fallback if a
    # shrid's subdistrict_id doesn't match any specific tehsil-part row.
    town_rel_aggregate: dict[str, dict] = {}

    for _, row in df.iterrows():
        distt = str(row[COL_DISTT]) if pd.notna(row[COL_DISTT]) else ""
        tehsil = str(row[COL_TEHSIL]) if pd.notna(row[COL_TEHSIL]) else ""
        town = str(row[COL_TOWN]) if pd.notna(row[COL_TOWN]) else ""
        tru = str(row[COL_TOTAL_RURAL_URBAN]) if pd.notna(row[COL_TOTAL_RURAL_URBAN]) else ""
        if not distt or distt == "000" or distt == "Distt.":
            continue  # skip header / state-total rows

        rel = religion_dict(row)
        if rel is None:
            continue

        is_district = tehsil == "00000" and town == "000000"
        is_subdist = tehsil != "00000" and town == "000000"
        is_town = town != "000000"

        if is_district and tru == "Total":
            district_total_rel[distt] = rel
        elif is_district and tru == "Urban":
            district_urban_rel[distt] = rel
        elif is_subdist and tru == "Rural":
            subdist_rural_rel[tehsil] = rel
        elif is_town and tru == "Urban":
            if tehsil == "00000":
                # Aggregate row for the whole town — fallback only
                town_rel_aggregate[town] = rel
            else:
                # Tehsil-specific part of a town that spans sub-districts
                town_rel[(tehsil, town)] = rel

    # For towns that DON'T span sub-districts, C-01 emits only one row
    # (with tehsil != 00000). For towns that span, it emits a 00000
    # aggregate + per-tehsil parts. We've keyed parts by (tehsil, town);
    # for non-spanning towns, also expose them via the aggregate dict so
    # the lookup logic can fall back uniformly when subdistrict_id of a
    # shrid doesn't match any (tehsil, town) entry.
    for (tehsil, town), rel in town_rel.items():
        town_rel_aggregate.setdefault(town, rel)

    return (
        district_total_rel,
        district_urban_rel,
        subdist_rural_rel,
        town_rel,
        town_rel_aggregate,
    )


def load_kerala_shrug() -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Load SHRUG keys filtered to Kerala (state 32) and PCA population data."""

    def kerala_only(path: Path) -> pd.DataFrame:
        df = pd.read_csv(path, dtype=str)
        df = df[df["shrid2"].str.startswith("11-32-")]
        return df

    rural_keys = kerala_only(SHRUG / "shrug-pc-keys-csv" / "pc11r_shrid_key.csv")
    urban_keys = kerala_only(SHRUG / "shrug-pc-keys-csv" / "pc11u_shrid_key.csv")
    con_keys = pd.read_csv(
        SHRUG / "shrug-con-keys-csv" / "shrid_frag_con08_key.csv", dtype=str
    )
    con_keys = con_keys[con_keys["ac08_id"].str.startswith("2008-32-")]
    pca = pd.read_csv(
        SHRUG / "shrug-pca11-csv" / "pc11_pca_clean_shrid.csv",
        dtype={"shrid2": str},
        usecols=["shrid2", "pc11_pca_tot_p"],
    )
    pca = pca[pca["shrid2"].str.startswith("11-32-")]

    return rural_keys, urban_keys, con_keys, pca


def main() -> None:
    print("Parsing Census C-01...", file=sys.stderr)
    (
        district_total_rel,
        district_urban_rel,
        subdist_rel,
        town_rel_by_tehsil,
        town_rel_aggregate,
    ) = parse_c01()
    print(
        f"  → {len(district_total_rel)} districts (Total), "
        f"{len(district_urban_rel)} districts (Urban), "
        f"{len(subdist_rel)} sub-districts (Rural), "
        f"{len(town_rel_aggregate)} towns "
        f"({len(town_rel_by_tehsil)} (tehsil, town) parts)",
        file=sys.stderr,
    )

    print("Loading SHRUG Kerala keys...", file=sys.stderr)
    rural_keys, urban_keys, con_keys, pca = load_kerala_shrug()
    print(
        f"  → {len(rural_keys)} rural shrids, "
        f"{len(urban_keys)} urban shrids, "
        f"{len(con_keys)} AC-fragment rows, "
        f"{len(pca)} PCA rows",
        file=sys.stderr,
    )

    # Build shrid → religion-mix lookup
    shrid_religion: dict[str, dict] = {}

    # Rural shrids: use sub-district rural religion shares
    rural_misses = 0
    for _, r in rural_keys.iterrows():
        rel = subdist_rel.get(r["pc11_subdistrict_id"])
        if rel is None:
            rural_misses += 1
            continue
        shrid_religion[r["shrid2"]] = rel

    # Urban shrids: prefer (subdistrict, town) keyed lookup so that
    # tehsil-split city corporations (Trivandrum/Kochi/Kollam) get the
    # right Part of their religion data, not the last one written.
    # Falls back to the town aggregate if the (tehsil, town) miss; then
    # to the subdistrict rural mix; then unmatched.
    urban_misses = 0
    urban_aggregate_used = 0
    urban_fallbacks = 0
    for _, r in urban_keys.iterrows():
        key = (r["pc11_subdistrict_id"], r["pc11_town_id"])
        rel = town_rel_by_tehsil.get(key)
        if rel is None:
            rel = town_rel_aggregate.get(r["pc11_town_id"])
            if rel is not None:
                urban_aggregate_used += 1
        if rel is None:
            rel = subdist_rel.get(r["pc11_subdistrict_id"])
            if rel is None:
                urban_misses += 1
                continue
            urban_fallbacks += 1
        shrid_religion[r["shrid2"]] = rel

    print(
        f"  → matched {len(shrid_religion)} shrids to religion data "
        f"(rural misses: {rural_misses}, urban misses: {urban_misses}, "
        f"urban→aggregate fallbacks: {urban_aggregate_used}, "
        f"urban→subdist fallbacks: {urban_fallbacks})",
        file=sys.stderr,
    )

    # shrid population lookup
    pop_by_shrid = dict(zip(pca["shrid2"], pca["pc11_pca_tot_p"].astype(float)))

    # Aggregate to AC using fragment weights
    ac_totals: dict[str, dict] = defaultdict(
        lambda: {"population": 0.0, **{r: 0.0 for r in RELIGIONS}}
    )
    matched_ac_pop = 0.0

    for _, row in con_keys.iterrows():
        shrid = row["shrid2"]
        ac_id = row["ac08_id"]
        wt = float(row["fragment_wt_con08_norm"])
        rel = shrid_religion.get(shrid)
        pop = pop_by_shrid.get(shrid, 0.0)
        if rel is None or pop <= 0:
            continue
        contrib_pop = pop * wt
        ac_totals[ac_id]["population"] += contrib_pop
        for r in RELIGIONS:
            # rel[r] is a percent (0-100); we accumulate religion-weighted population
            ac_totals[ac_id][r] += contrib_pop * rel[r] / 100
        matched_ac_pop += contrib_pop

    print(
        f"  → matched population: {matched_ac_pop:,.0f} across {len(ac_totals)} ACs",
        file=sys.stderr,
    )

    # Build the AC → religion shares output
    output_acs: dict[int, dict] = {}
    for ac_id, totals in ac_totals.items():
        # ac_id is like "2008-32-001" → AC number 1
        ac_num = int(ac_id.split("-")[-1])
        pop = totals["population"]
        if pop <= 0:
            continue
        output_acs[ac_num] = {
            "matchedPopulation": round(pop),
            "religions": {
                r: round(totals[r] / pop * 100, 2) for r in RELIGIONS
            },
            "source": "shrug-c01-aggregated",
        }

    # For missing ACs (1..140 not in output), fall back to district-level
    # Need a map from AC → district. Read from existing data/districts.json
    districts_data = json.loads(
        (ROOT / "data" / "districts.json").read_text()
    )
    const_to_dist = {
        int(k): v for k, v in districts_data["constituencyToDistrict"].items()
    }

    # Our internal district id → Kerala Census 2011 district code (the
    # `Distt. Code` column in C-01). Codes verified by inspecting
    # `data/raw/census-c01/DDW32C-01-MDDS.XLS` directly — 14 stable
    # post-1956 districts; no boundary changes since the 2008
    # delimitation. Previously this map was derived at runtime from
    # SHRUG's `shrug-shrid-keys-csv/shrid_loc_names.csv` (~224 MB) just
    # to look up these 14 entries; hardcoding eliminates the
    # dependency.
    DISTRICT_ID_TO_CENSUS_CODE: dict[str, str] = {
        "kasaragod": "588",
        "kannur": "589",
        "wayanad": "590",
        "kozhikode": "591",
        "malappuram": "592",
        "palakkad": "593",
        "thrissur": "594",
        "ernakulam": "595",
        "idukki": "596",
        "kottayam": "597",
        "alappuzha": "598",
        "pathanamthitta": "599",
        "kollam": "600",
        "thiruvananthapuram": "601",
    }

    fallback_count = 0
    for ac_num in range(1, 141):
        if ac_num in output_acs:
            continue
        district_id = const_to_dist.get(ac_num)
        if not district_id:
            continue
        census_dist_code = DISTRICT_ID_TO_CENSUS_CODE.get(district_id)
        if not census_dist_code:
            print(f"  (no census code for district '{district_id}')", file=sys.stderr)
            continue

        # Prefer district URBAN religion for fallback ACs (these are
        # urban-heavy — SHRUG's spatial join failed precisely because
        # they sit in major city corporations). District URBAN is closer
        # to their actual mix than district TOTAL, which averages rural
        # + urban populations of the whole district.
        rel = district_urban_rel.get(census_dist_code)
        source = "district-urban-fallback"
        if not rel:
            rel = district_total_rel.get(census_dist_code)
            source = "district-total-fallback"
        if not rel:
            print(f"  (no district religion for code {census_dist_code})", file=sys.stderr)
            continue
        output_acs[ac_num] = {
            "matchedPopulation": None,
            "religions": {r: round(rel[r], 2) for r in RELIGIONS},
            "source": source,
        }
        fallback_count += 1

    print(f"  → {fallback_count} ACs filled from district fallback", file=sys.stderr)
    print(
        f"  → final coverage: {len(output_acs)} of 140 ACs",
        file=sys.stderr,
    )

    # Sort by AC number for stable output
    output = {
        "year": 2011,
        "source": "Census 2011 Table C-01 + SHRUG shrid → AC keys (post-2008 delimitation)",
        "note": (
            "Religion shares aggregated from sub-district (rural) and town (urban) "
            "Census 2011 data, weighted by shrid population and SHRUG fragment-weights "
            "to Kerala's 140 ACs. ACs with no SHRUG match are urban-heavy (major "
            "city corporations whose ward-level Census data isn't published) and "
            "fall back to district URBAN religion shares — flagged via "
            "`source: 'district-urban-fallback'`. See docs/data-pipeline.md."
        ),
        "constituencies": {
            str(k): output_acs[k] for k in sorted(output_acs.keys())
        },
    }

    out_path = ROOT / "data" / "ac-demographics.json"
    out_path.write_text(json.dumps(output, indent=2) + "\n")
    print(f"\nWrote {out_path}", file=sys.stderr)
    print(f"Total ACs: {len(output_acs)}/140", file=sys.stderr)
    aggregated = sum(1 for v in output_acs.values() if v["source"] == "shrug-c01-aggregated")
    urban_fb = sum(1 for v in output_acs.values() if v["source"] == "district-urban-fallback")
    total_fb = sum(1 for v in output_acs.values() if v["source"] == "district-total-fallback")
    print(f"  shrug-c01-aggregated:    {aggregated}", file=sys.stderr)
    print(f"  district-urban-fallback: {urban_fb}", file=sys.stderr)
    print(f"  district-total-fallback: {total_fb}", file=sys.stderr)


if __name__ == "__main__":
    main()
