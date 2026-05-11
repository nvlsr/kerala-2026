# Data sources

All data in this project comes from the two sources listed below. Every file under `data/` is derived from one or more of them.

## 1. Election Commission of India — 2026 Kerala results

Authoritative source for candidate names, parties, vote counts, and margins.

- Partywise summary: <https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S11.htm>
  - Saved raw at `data/raw/eci-html/partywiseresult-S11.htm`
- Partywise winners (per party): `https://results.eci.gov.in/ResultAcGenMay2026/partywisewinresult-{partyId}S11.htm`
  - BJP example saved raw at `data/raw/eci-html/partywisewinresult-369S11.htm`
- Constituency results: `https://results.eci.gov.in/ResultAcGenMay2026/candidateswise-S11{N}.htm` for `N = 1..140`
  - Aggregated into `data/results-2026.json` (all 140)
  - Per-seat intermediate files at `data/raw/constituencies/S11-{N}.json`

State code `S11` = Kerala. Party IDs are ECI's internal numbering (e.g. BJP = `369`).

Scraped via the in-page browser (Chrome) since direct curl/WebFetch returns HTTP 403. See `docs/scraping-requirements.md` for the full pipeline.

## 2. Wikipedia

Used for everything the ECI doesn't carry — political alliances, constituency-to-district mapping, and 2011 census demographics.

### 2a. Alliance composition

Source: <https://en.wikipedia.org/wiki/2026_Kerala_Legislative_Assembly_election#Summary>

The "Left Democratic Front", "United Democratic Front", "National Democratic Alliance", and "Others" lists were copied from this page and used to build:

- `data/alliances.json` — party abbreviations, party→current-alliance map (used for chart line colours), and alliance metadata (color, code, name, led-by). Per-cycle alliance assignment lives on each candidate record directly: `alliance` field on every entry in `data/results-2026.json` and `data/historical/S11-*.json`. Independent candidates and front-aligned mid-cycle defectors are tagged in the same place — no separate override block.

### 2b. Constituency → district mapping

Source: <https://en.wikipedia.org/wiki/2026_Kerala_Legislative_Assembly_election#Results_by_constituency>

The "Results by constituency" table on this page groups all 140 constituencies under their 14 districts. Used to build:

- `data/districts.json` — district list (id, name, display order) + the full constituency-number → district-id map

### 2c. District demographics (2011 census)

Per-district Wikipedia pages, Demographics → Religion subsection. Each page reports the 2011 Census religion breakdown and total population. Aggregated Christian sub-denominations (Catholic / Orthodox / Marthoma / etc.) into a single `christian` bucket.

| District | Source |
|---|---|
| Kasaragod | <https://en.wikipedia.org/wiki/Kasaragod_district> |
| Kannur | <https://en.wikipedia.org/wiki/Kannur_district> |
| Wayanad | <https://en.wikipedia.org/wiki/Wayanad_district> |
| Kozhikode | <https://en.wikipedia.org/wiki/Kozhikode_district> |
| Malappuram | <https://en.wikipedia.org/wiki/Malappuram_district> |
| Palakkad | <https://en.wikipedia.org/wiki/Palakkad_district> |
| Thrissur | <https://en.wikipedia.org/wiki/Thrissur_district> |
| Ernakulam | <https://en.wikipedia.org/wiki/Ernakulam_district> |
| Idukki | <https://en.wikipedia.org/wiki/Idukki_district> |
| Kottayam | <https://en.wikipedia.org/wiki/Kottayam_district> |
| Alappuzha | <https://en.wikipedia.org/wiki/Alappuzha_district> |
| Pathanamthitta | <https://en.wikipedia.org/wiki/Pathanamthitta_district> |
| Kollam | <https://en.wikipedia.org/wiki/Kollam_district> |
| Thiruvananthapuram | <https://en.wikipedia.org/wiki/Thiruvananthapuram_district> |

Output file: `data/district-religion.json` (population + Hindu/Muslim/Christian/Other percentages per district).

## 3. Datameet — district boundaries

Source: <https://projects.datameet.org/maps/> · repo: <https://github.com/datameet/maps>

Used for the interactive Kerala map at the top of the page. Specifically the `Districts/Census_2011/2011_Dist.shp` file (Census 2011 boundaries) is filtered to the 14 Kerala features and projected at build time.

Pipeline:
- `scripts/pipeline/extract-kerala-map.py` — reads the shapefile, simplifies geometry, writes `data/district.geojson`
- `scripts/pipeline/build-kerala-map-paths.ts` — projects with `d3-geo` and writes `data/district-paths.json` (the runtime artifact, no `d3-geo` dependency at runtime)

The source `data/maps-master/` directory is `.gitignore`d (486 MB) — re-clone the upstream repo if you need to re-run the extraction. Licensed CC-BY 2.5 IN.

The Assembly Constituencies layer (`assembly-constituencies/India_AC.shp`) is also available from the same repo and could power a per-constituency map; not yet used. Note the known datameet caveat *"there is some shift in the data"* (boundary precision varies) and our specific finding that AC #87 Kothamangalam appears twice in the file (Ernakulam vs Idukki — a PC-vs-district mislabel; Kothamangalam is administratively in Ernakulam).

## 4. Kerala Legislative Assembly database — past election results

Source: <http://keralaassembly.org/>

Used to backfill historical (2011 / 2016 / 2021) candidate lists where Wikipedia's article was incomplete or carried wrong values. Provides per-constituency tables matching ECI's official reporting format (electorate, votes polled, polling %, rejected votes, NOTA, full candidate list with party and percentages, margin of victory).

Particularly useful for the data audit pass where we discovered Wikipedia was missing minor candidates, had wrong vote counts, or in one case (Eravipuram 2021) had Lok Sabha data substituted for Assembly data. The keralaassembly.org tables resolved each of these.

Records sourced from this site are reflected in the patched `data/historical/S11-*.json` files. See `docs/data-issues.md` for the audit history.

## Notes

- 2011 is the latest available census; Census 2021 was postponed and has not been released.
- ECI scrapes were performed during the May 2026 result publication window. The pages may update post-publication once Form-20 data is finalised.