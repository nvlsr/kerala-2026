# Data sources

All data in this project comes from the two sources listed below. Every file under `data/` is derived from one or more of them.

## 1. Election Commission of India — 2026 Kerala results

Authoritative source for candidate names, parties, vote counts, and margins.

- Partywise summary: <https://results.eci.gov.in/ResultAcGenMay2026/partywiseresult-S11.htm>
  - Saved raw at `data/raw/partywiseresult-S11.htm`
  - Parsed into `data/parties-S11.json`
- Partywise winners (per party): `https://results.eci.gov.in/ResultAcGenMay2026/partywisewinresult-{partyId}S11.htm`
  - BJP example saved raw at `data/raw/partywisewinresult-369S11.htm`
- Constituency results: `https://results.eci.gov.in/ResultAcGenMay2026/candidateswise-S11{N}.htm` for `N = 1..140`
  - Aggregated into `data/kerala-2026.json` (all 140)
  - Split into `data/constituencies/S11-{N}.json` (one file per seat)

State code `S11` = Kerala. Party IDs are ECI's internal numbering (e.g. BJP = `369`).

Scraped via the in-page browser (Chrome) since direct curl/WebFetch returns HTTP 403. See `docs/scraping-requirements.md` for the full pipeline.

## 2. Wikipedia

Used for everything the ECI doesn't carry — political alliances, constituency-to-district mapping, and 2011 census demographics.

### 2a. Alliance composition

Source: <https://en.wikipedia.org/wiki/2026_Kerala_Legislative_Assembly_election#Summary>

The "Left Democratic Front", "United Democratic Front", "National Democratic Alliance", and "Others" lists were copied from this page and used to build:

- `data/alliances.json` — `partyToAlliance` map, party abbreviations, and alliance metadata (color, code, name, led-by)
- The 4 Independent winners (PAYYANNUR, TALIPARAMBA, PALA, AMBALAPPUZHA) are user-classified as UDF-aligned in the `independentOverrides` block of the same file

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

Output file: `data/demographics.json` (population + Hindu/Muslim/Christian/Other percentages per district).

## Notes

- 2011 is the latest available census; Census 2021 was postponed and has not been released.
- ECI scrapes were performed during the May 2026 result publication window. The pages may update post-publication once Form-20 data is finalised.