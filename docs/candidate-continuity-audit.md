# Candidate-name normalisation audit

Auto-generated. Walks every top-3 finisher across 2011 / 2016 / 2019-bye / 2021 / 2026 cycles, normalises names via `scripts/_lib/names.ts:normalizeName()`, and reports cross-cycle matches the normaliser caught (§A) and likely-same-person pairs it missed (§B).

Run: `bun run scripts/analysis/audit-candidate-names.ts` — regenerates `data/candidate-continuity.json` and this file.

## Headline numbers

- Total top-3 appearances: **1731**
- Unique normalised keys: **1230**
- Candidates appearing ≥ 2 times: **340**
  - of which **multi-alliance** (priority review — likely different people sharing a normalised name): **24**
  - single-alliance multi-appearance: 316
- Suspected missed matches: **172**
  - same-AC: 44 (likely tenure-detection gaps)
  - cross-AC same-alliance: 128 (likely cross-constituency name drift)

### Caste-suffix distribution

Detected via `extractCasteSuffix()` (trailing token only). Recorded per-appearance in `data/candidate-continuity.json` for future analysis.

| Suffix | Count |
| --- | ---: |
| `NAIR` | 15 |
| `PILLAI` | 7 |
| `MENON` | 3 |
| `NAMBOOTHIRI` | 1 |

---

## A.1 Multi-alliance multi-appearance keys (priority review)

Normalised keys appearing under **≥ 2 main alliances** (UDF/LDF/NDA). Mix of (a) same person who genuinely switched fronts (Kerala Congress factions, defections), and (b) different people sharing a common name. Verdicts persisted in `data/candidate-classifications.json` — survive audit re-runs.

**24 classified · 0 unclassified · 24 total.**

### ✓ Already classified

### `K BABU` — 6 appearances · 3 ACs · alliances: **LDF / UDF / NDA**

**Verdict:** 🟰 different people · same name

> Confirmed via Wikipedia — Thripunithura's K. Babu (UDF, MLA 1991-2011, 2026) is a different person from Nemmara's K. Babu (LDF). Also a third K. Babu in Alappuzha 2009 by-poll.


- 2009 by-bye · AC 104 ALAPPUZHA (NDA, rank 3): `K. Babu`
- 2011 · AC 81 THRIPUNITHURA (UDF, rank 1): `K. Babu`
- 2016 · AC 59 NEMMARA (LDF, rank 1): `K. Babu`
- 2016 · AC 81 THRIPUNITHURA (UDF, rank 2): `K. Babu`
- 2021 · AC 59 NEMMARA (LDF, rank 1): `K. Babu`
- 2021 · AC 81 THRIPUNITHURA (UDF, rank 1): `K. Babu`

### `K C JOSEPH` — 4 appearances · 3 ACs · alliances: **UDF / LDF**

**Verdict:** 🟰 different people · same name

> Common Kerala Christian name; different ACs (Irikkur UDF, Kuttanad UDF, Changanassery LDF).


- 2011 · AC 9 IRIKKUR (UDF, rank 1): `K. C. Joseph`
- 2011 · AC 106 KUTTANAD (UDF, rank 2): `K. C. Joseph`
- 2016 · AC 9 IRIKKUR (UDF, rank 1): `K. C. Joseph`
- 2016 · AC 99 CHANGANASSERY (LDF, rank 2): `K. C. Joseph`

### `ROSHY AUGUSTINE` — 4 appearances · 1 AC · alliances: **UDF / LDF**

**Verdict:** ✅ same person (alliance switch)

> Kerala Congress(M) faction switch. Assembly history: 2001 UDF (won, +13,719) → 2006 UDF (won, +16,340) → 2011 UDF (won, +15,806) → 2016 UDF (won, +9,333) → 2021 LDF (won, +5,573) → 2026 LDF (lost by 23,822). All in Idukki.

Raw name variants: `Roshy Augustine`, `ROSHY AUGUSTINE`

- 2011 · AC 91 IDUKKI (UDF, rank 1): `Roshy Augustine`
- 2016 · AC 91 IDUKKI (UDF, rank 1): `Roshy Augustine`
- 2021 · AC 91 IDUKKI (LDF, rank 1): `Roshy Augustine`
- 2026 · AC 91 IDUKKI (LDF, rank 2): `ROSHY AUGUSTINE`

### `N JAYARAJ` — 4 appearances · 1 AC · alliances: **UDF / LDF**

**Verdict:** ✅ same person (alliance switch)

> Same KC(M) faction switch — Kanjirappally seat. UDF in 2011/2016, LDF in 2021/2026.

Raw name variants: `N. Jayaraj`, `DR. N. JAYARAJ`

- 2011 · AC 100 KANJIRAPPALLY (UDF, rank 1): `N. Jayaraj`
- 2016 · AC 100 KANJIRAPPALLY (UDF, rank 1): `N. Jayaraj`
- 2021 · AC 100 KANJIRAPPALLY (LDF, rank 1): `N. Jayaraj`
- 2026 · AC 100 KANJIRAPPALLY (LDF, rank 2): `DR. N. JAYARAJ`

### `K SIVADASAN` — 4 appearances · 2 ACs · alliances: **UDF / NDA**

**Verdict:** 🟰 different people · same name

> Aranmula UDF (K. Sivadasan Nair) is a different person from Chadayamangalam NDA (K. Sivadasan). Caste suffix mismatch supports the distinction.

Raw name variants: `K. Sivadasan Nair`, `K. Sivadasan`
Caste suffix(es) seen: `NAIR`

- 2011 · AC 113 ARANMULA (UDF, rank 1): `K. Sivadasan Nair`
- 2016 · AC 113 ARANMULA (UDF, rank 2): `K. Sivadasan Nair`
- 2016 · AC 122 CHADAYAMANGALAM (NDA, rank 3): `K. Sivadasan`
- 2021 · AC 113 ARANMULA (UDF, rank 2): `K. Sivadasan Nair`

### `K B GANESH KUMAR` — 4 appearances · 1 AC · alliances: **UDF / LDF**

**Verdict:** ✅ same person (alliance switch)

> Kerala Congress(B) joined LDF — Pathanapuram seat. UDF 2011, LDF 2016/2021/2026.

Raw name variants: `K. B. Ganesh Kumar`, `K B GANESH KUMAR`

- 2011 · AC 120 PATHANAPURAM (UDF, rank 1): `K. B. Ganesh Kumar`
- 2016 · AC 120 PATHANAPURAM (LDF, rank 1): `K. B. Ganesh Kumar`
- 2021 · AC 120 PATHANAPURAM (LDF, rank 1): `K. B. Ganesh Kumar`
- 2026 · AC 120 PATHANAPURAM (LDF, rank 2): `K B GANESH KUMAR`

### `R SELVARAJ` — 4 appearances · 1 AC · alliances: **LDF / UDF**

**Verdict:** ✅ same person (alliance switch)

> Won 2011 as LDF, defected, won 2012 by-poll as UDF; ran UDF in 2016/2021. Neyyattinkara seat.


- 2011 · AC 140 NEYYATTINKARA (LDF, rank 1): `R. Selvaraj`
- 2012 by-bye · AC 140 NEYYATTINKARA (UDF, rank 1): `R. Selvaraj`
- 2016 · AC 140 NEYYATTINKARA (UDF, rank 2): `R. Selvaraj`
- 2021 · AC 140 NEYYATTINKARA (UDF, rank 2): `R. Selvaraj`

### `K P MOHANAN` — 3 appearances · 1 AC · alliances: **UDF / LDF**

**Verdict:** ✅ same person (alliance switch)

> UDF 2011/2016, LDF 2021 — Kuthuparamba seat.


- 2011 · AC 14 KUTHUPARAMBA (UDF, rank 1): `K. P. Mohanan`
- 2016 · AC 14 KUTHUPARAMBA (UDF, rank 2): `K. P. Mohanan`
- 2021 · AC 14 KUTHUPARAMBA (LDF, rank 1): `K. P. Mohanan`

### `K RADHAKRISHNAN` — 3 appearances · 2 ACs · alliances: **LDF / NDA**

**Verdict:** 🟰 different people · same name

> Chelakkara LDF (SC-reserved) is a different person from Kothamangalam NDA.


- 2011 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`
- 2011 · AC 87 KOTHAMANGALAM (NDA, rank 3): `K. Radhakrishnan`
- 2021 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`

### `PADMAJA VENUGOPAL` — 3 appearances · 1 AC · alliances: **UDF / NDA**

**Verdict:** ✅ same person (alliance switch)

> INC → BJP defection (well-documented 2024). Thrissur seat. UDF 2016/2021 (rank 2), NDA 2026 (rank 3).

Raw name variants: `Padmaja Venugopal`, `PADMAJA VENUGOPAL`

- 2016 · AC 67 THRISSUR (UDF, rank 2): `Padmaja Venugopal`
- 2021 · AC 67 THRISSUR (UDF, rank 2): `Padmaja Venugopal`
- 2026 · AC 67 THRISSUR (NDA, rank 3): `PADMAJA VENUGOPAL`

### `S RAJENDRAN` — 3 appearances · 1 AC · alliances: **LDF / NDA**

**Verdict:** ✅ same person (alliance switch)

> Devikulam seat. LDF 2011/2016 (won), NDA 2026 (rank 3).

Raw name variants: `S. Rajendran`, `S.RAJENDRAN`

- 2011 · AC 88 DEVIKULAM (LDF, rank 1): `S. Rajendran`
- 2016 · AC 88 DEVIKULAM (LDF, rank 1): `S. Rajendran`
- 2026 · AC 88 DEVIKULAM (NDA, rank 3): `S.RAJENDRAN`

### `P C GEORGE` — 3 appearances · 1 AC · alliances: **UDF / NDA**

**Verdict:** ✅ same person (alliance switch)

> Poonjar seat. UDF 2011, OTHER (independent) 2016, NDA 2026.

Raw name variants: `P. C. George`, `P.C. GEORGE`

- 2011 · AC 101 POONJAR (UDF, rank 1): `P. C. George`
- 2016 · AC 101 POONJAR (OTHER, rank 1): `P. C. George`
- 2026 · AC 101 POONJAR (NDA, rank 3): `P.C. GEORGE`

### `G SUDHAKARAN` — 3 appearances · 1 AC · alliances: **LDF / UDF**

**Verdict:** ✅ same person (alliance switch)

> Ambalappuzha seat. LDF 2011/2016, UDF 2026.

Raw name variants: `G. Sudhakaran`, `G.SUDHAKARAN`

- 2011 · AC 105 AMBALAPPUZHA (LDF, rank 1): `G. Sudhakaran`
- 2016 · AC 105 AMBALAPPUZHA (LDF, rank 1): `G. Sudhakaran`
- 2026 · AC 105 AMBALAPPUZHA (UDF, rank 1): `G.SUDHAKARAN`

### `P AISHA POTTY` — 3 appearances · 1 AC · alliances: **LDF / UDF**

**Verdict:** ✅ same person (alliance switch)

> Kottarakkara seat. LDF 2011/2016 (won), UDF 2026 (rank 2).

Raw name variants: `P. Aisha Potty`, `ADV.P. AISHA POTTY`

- 2011 · AC 119 KOTTARAKKARA (LDF, rank 1): `P. Aisha Potty`
- 2016 · AC 119 KOTTARAKKARA (LDF, rank 1): `P. Aisha Potty`
- 2026 · AC 119 KOTTARAKKARA (UDF, rank 2): `ADV.P. AISHA POTTY`

### `K MOHANDAS` — 2 appearances · 2 ACs · alliances: **NDA / LDF**

**Verdict:** 🟰 different people · same name

> Mananthavady NDA and Manjeri LDF — different people, different districts.


- 2016 · AC 17 MANANTHAVADY (NDA, rank 3): `K. Mohandas`
- 2016 · AC 37 MANJERI (LDF, rank 2): `K. Mohandas`

### `P SARIN` — 2 appearances · 2 ACs · alliances: **UDF / LDF**

**Verdict:** 🟰 different people · same name

> Ottappalam UDF 2021 and Palakkad LDF 2024 by-poll — different people.


- 2021 · AC 52 OTTAPPALAM (UDF, rank 2): `P. Sarin`
- 2024 by-bye · AC 56 PALAKKAD (LDF, rank 3): `P. Sarin`

### `ROY VARICATTU` — 2 appearances · 1 AC · alliances: **LDF / NDA**

**Verdict:** ✅ same person (alliance switch)

> Thodupuzha seat. LDF 2016, NDA 2026.

Raw name variants: `Roy Varicattu`, `ADV. ROY VARICATTU`

- 2016 · AC 90 THODUPUZHA (LDF, rank 2): `Roy Varicattu`
- 2026 · AC 90 THODUPUZHA (NDA, rank 3): `ADV. ROY VARICATTU`

### `K FRANCIS GEORGE` — 2 appearances · 1 AC · alliances: **LDF / UDF**

**Verdict:** ✅ same person (alliance switch)

> Idukki seat. LDF 2016, UDF 2021. KC(J) → INC.


- 2016 · AC 91 IDUKKI (LDF, rank 2): `K. Francis George`
- 2021 · AC 91 IDUKKI (UDF, rank 2): `K. Francis George`

### `K AJITH` — 2 appearances · 1 AC · alliances: **LDF / NDA**

**Verdict:** ✅ same person (alliance switch)

> Vaikom seat. LDF 2011, NDA 2026.

Raw name variants: `K. Ajith`, `K AJITH`

- 2011 · AC 95 VAIKOM (LDF, rank 1): `K. Ajith`
- 2026 · AC 95 VAIKOM (NDA, rank 3): `K AJITH`

### `R RESMI` — 2 appearances · 1 AC · alliances: **UDF / NDA**

**Verdict:** ✅ same person (alliance switch)

> Kottarakkara seat. UDF 2021, NDA 2026.

Raw name variants: `R. Resmi`, `R. RESMI`

- 2021 · AC 119 KOTTARAKKARA (UDF, rank 2): `R. Resmi`
- 2026 · AC 119 KOTTARAKKARA (NDA, rank 3): `R. RESMI`

### `A A AZEEZ` — 2 appearances · 1 AC · alliances: **LDF / UDF**

**Verdict:** ✅ same person (alliance switch)

> Eravipuram seat. LDF 2011 (won), UDF 2016 (rank 2).


- 2011 · AC 125 ERAVIPURAM (LDF, rank 1): `A. A. Azeez`
- 2016 · AC 125 ERAVIPURAM (UDF, rank 2): `A. A. Azeez`

### `BABU DIVAKARAN` — 2 appearances · 2 ACs · alliances: **UDF / NDA**

**Verdict:** ✅ same person (alliance switch)

> Eravipuram UDF 2021 → Kunnathunad NDA 2026 (different ACs).

Raw name variants: `Babu Divakaran`, `BABU DIVAKARAN`

- 2021 · AC 125 ERAVIPURAM (UDF, rank 2): `Babu Divakaran`
- 2026 · AC 84 KUNNATHUNAD (NDA, rank 3): `BABU DIVAKARAN`

### `B S ANOOP` — 2 appearances · 1 AC · alliances: **UDF / NDA**

**Verdict:** ✅ same person (alliance switch)

> Chirayinkeezhu seat. UDF 2021, NDA 2026.

Raw name variants: `B. S. Anoop`, `B. S. ANOOP`

- 2021 · AC 129 CHIRAYINKEEZHU (UDF, rank 2): `B. S. Anoop`
- 2026 · AC 129 CHIRAYINKEEZHU (NDA, rank 3): `B. S. ANOOP`

### `V SURENDRAN` — 2 appearances · 2 ACs · alliances: **LDF / UDF**

**Verdict:** ✅ same person (alliance switch)

> Trivandrum LDF 2011 → Nemom UDF 2016 (V. Surendran Pillai). Two different ACs but same person.

Caste suffix(es) seen: `PILLAI`

- 2011 · AC 134 THIRUVANANTHAPURAM (LDF, rank 2): `V. Surendran Pillai`
- 2016 · AC 135 NEMOM (UDF, rank 3): `V. Surendran Pillai`

---

## A.2 Single-alliance multi-appearance candidates

Each block: one normalised key + every top-3 appearance attributed to it. All within a single main alliance (or OTHER/NOTA). Scan for **false positives** — different people the normaliser collapsed.

Showing the top 200 by appearance count.

### `K SURENDRAN` — 6 appearances across 2 ACs
Raw name variants: `K. Surendran`, `K SURENDRAN`

- 2011 · AC 1 MANJESHWAR (NDA, rank 2): `K. Surendran`
- 2016 · AC 1 MANJESHWAR (NDA, rank 2): `K. Surendran`
- 2019 by-bye · AC 114 KONNI (NDA, rank 3): `K. Surendran`
- 2021 · AC 1 MANJESHWAR (NDA, rank 2): `K. Surendran`
- 2021 · AC 114 KONNI (NDA, rank 3): `K. Surendran`
- 2026 · AC 1 MANJESHWAR (NDA, rank 2): `K SURENDRAN`

### `A N RADHAKRISHNAN` — 5 appearances across 3 ACs

- 2011 · AC 64 MANALUR (NDA, rank 3): `A. N. Radhakrishnan`
- 2011 · AC 69 KAIPAMANGALAM (NDA, rank 3): `A. N. Radhakrishnan`
- 2016 · AC 64 MANALUR (NDA, rank 3): `A. N. Radhakrishnan`
- 2021 · AC 64 MANALUR (NDA, rank 3): `A. N. Radhakrishnan`
- 2022 by-bye · AC 83 THRIKKAKARA (NDA, rank 3): `A. N. Radhakrishnan`

### `K M SHAJI` — 4 appearances across 2 ACs
Raw name variants: `K. M. Shaji`, `K.M. SHAJI`

- 2011 · AC 10 AZHIKODE (UDF, rank 1): `K. M. Shaji`
- 2016 · AC 10 AZHIKODE (UDF, rank 1): `K. M. Shaji`
- 2021 · AC 10 AZHIKODE (UDF, rank 2): `K. M. Shaji`
- 2026 · AC 41 VENGARA (UDF, rank 1): `K.M. SHAJI`

### `V K SAJEEVAN` — 4 appearances across 3 ACs
Raw name variants: `V. K. Sajeevan`, `ADV.V. K. SAJEEVAN`

- 2011 · AC 21 KUTTIADI (NDA, rank 3): `V. K. Sajeevan`
- 2016 · AC 13 THALASSERY (NDA, rank 3): `V. K. Sajeevan`
- 2021 · AC 30 KUNNAMANGALAM (NDA, rank 3): `V. K. Sajeevan`
- 2026 · AC 30 KUNNAMANGALAM (NDA, rank 3): `ADV.V. K. SAJEEVAN`

### `K K SHAILAJA` — 4 appearances across 3 ACs
Raw name variants: `K. K. Shailaja`, `K. K. Shailaja Teacher`, `K K SHAILAJA TEACHER`

- 2011 · AC 16 PERAVOOR (LDF, rank 2): `K. K. Shailaja`
- 2016 · AC 14 KUTHUPARAMBA (LDF, rank 1): `K. K. Shailaja`
- 2021 · AC 15 MATTANNUR (LDF, rank 1): `K. K. Shailaja Teacher`
- 2026 · AC 16 PERAVOOR (LDF, rank 2): `K K SHAILAJA TEACHER`

### `BIJU ELAKKUZHI` — 4 appearances across 1 AC
Raw name variants: `Biju Elakkuzhi`, `BIJU ELAKKUZHI`

- 2011 · AC 15 MATTANNUR (NDA, rank 3): `Biju Elakkuzhi`
- 2016 · AC 15 MATTANNUR (NDA, rank 3): `Biju Elakkuzhi`
- 2021 · AC 15 MATTANNUR (NDA, rank 3): `Biju Elakkuzhi`
- 2026 · AC 15 MATTANNUR (NDA, rank 3): `BIJU ELAKKUZHI`

### `SUNNY JOSEPH` — 4 appearances across 1 AC
Raw name variants: `Sunny Joseph`, `ADV. SUNNY JOSEPH`

- 2011 · AC 16 PERAVOOR (UDF, rank 1): `Sunny Joseph`
- 2016 · AC 16 PERAVOOR (UDF, rank 1): `Sunny Joseph`
- 2021 · AC 16 PERAVOOR (UDF, rank 1): `Sunny Joseph`
- 2026 · AC 16 PERAVOOR (UDF, rank 1): `ADV. SUNNY JOSEPH`

### `I C BALAKRISHNAN` — 4 appearances across 1 AC
Raw name variants: `I. C. Balakrishnan`, `I C BALAKRISHNAN`

- 2011 · AC 18 SULTHANBATHERY (UDF, rank 1): `I. C. Balakrishnan`
- 2016 · AC 18 SULTHANBATHERY (UDF, rank 1): `I. C. Balakrishnan`
- 2021 · AC 18 SULTHANBATHERY (UDF, rank 1): `I. C. Balakrishnan`
- 2026 · AC 18 SULTHANBATHERY (UDF, rank 1): `I C BALAKRISHNAN`

### `P T A RAHIM` — 4 appearances across 1 AC
Raw name variants: `P. T. A. Rahim`, `ADV. P T A RAHIM`

- 2011 · AC 30 KUNNAMANGALAM (LDF, rank 1): `P. T. A. Rahim`
- 2016 · AC 30 KUNNAMANGALAM (LDF, rank 1): `P. T. A. Rahim`
- 2021 · AC 30 KUNNAMANGALAM (LDF, rank 1): `P. T. A. Rahim`
- 2026 · AC 30 KUNNAMANGALAM (LDF, rank 2): `ADV. P T A RAHIM`

### `P K BASHEER` — 4 appearances across 1 AC
Raw name variants: `P. K. Basheer`, `P.K.BASHEER`

- 2011 · AC 34 ERNAD (UDF, rank 1): `P. K. Basheer`
- 2016 · AC 34 ERNAD (UDF, rank 1): `P. K. Basheer`
- 2021 · AC 34 ERNAD (UDF, rank 1): `P. K. Basheer`
- 2026 · AC 34 ERNAD (UDF, rank 1): `P.K.BASHEER`

### `P V ANVAR` — 4 appearances across 2 ACs
Alliances seen: OTHER, LDF

- 2011 · AC 34 ERNAD (OTHER, rank 2): `P. V. Anvar`
- 2016 · AC 35 NILAMBUR (LDF, rank 1): `P. V. Anvar`
- 2021 · AC 35 NILAMBUR (LDF, rank 1): `P. V. Anvar`
- 2025 by-bye · AC 35 NILAMBUR (OTHER, rank 3): `P. V. Anvar`

### `MANJALAMKUZHI ALI` — 4 appearances across 2 ACs
Raw name variants: `Manjalamkuzhi Ali`, `MANJALAMKUZHI ALI`

- 2011 · AC 38 PERINTHALMANNA (UDF, rank 1): `Manjalamkuzhi Ali`
- 2016 · AC 38 PERINTHALMANNA (UDF, rank 1): `Manjalamkuzhi Ali`
- 2021 · AC 39 MANKADA (UDF, rank 1): `Manjalamkuzhi Ali`
- 2026 · AC 39 MANKADA (UDF, rank 1): `MANJALAMKUZHI ALI`

### `P K KUNHALIKUTTY` — 4 appearances across 2 ACs
Raw name variants: `P. K. Kunhalikutty`, `P.K KUNHALIKUTTY`

- 2011 · AC 41 VENGARA (UDF, rank 1): `P. K. Kunhalikutty`
- 2016 · AC 41 VENGARA (UDF, rank 1): `P. K. Kunhalikutty`
- 2021 · AC 41 VENGARA (UDF, rank 1): `P. K. Kunhalikutty`
- 2026 · AC 40 MALAPPURAM (UDF, rank 1): `P.K KUNHALIKUTTY`

### `K T JALEEL` — 4 appearances across 1 AC
Raw name variants: `K. T. Jaleel`, `DR. K T JALEEL`

- 2011 · AC 47 THAVANUR (LDF, rank 1): `K. T. Jaleel`
- 2016 · AC 47 THAVANUR (LDF, rank 1): `K. T. Jaleel`
- 2021 · AC 47 THAVANUR (LDF, rank 1): `K. T. Jaleel`
- 2026 · AC 47 THAVANUR (LDF, rank 2): `DR. K T JALEEL`

### `C KRISHNAKUMAR` — 4 appearances across 2 ACs
Raw name variants: `C. Krishnakumar`, `C KRISHNAKUMAR`

- 2016 · AC 55 MALAMPUZHA (NDA, rank 2): `C. Krishnakumar`
- 2021 · AC 55 MALAMPUZHA (NDA, rank 2): `C. Krishnakumar`
- 2024 by-bye · AC 56 PALAKKAD (NDA, rank 2): `C. Krishnakumar`
- 2026 · AC 55 MALAMPUZHA (NDA, rank 2): `C KRISHNAKUMAR`

### `THOMAS UNNIYADAN` — 4 appearances across 1 AC
Raw name variants: `Thomas Unniyadan`, `ADV. THOMAS UNNIYADAN`

- 2011 · AC 70 IRINJALAKUDA (UDF, rank 1): `Thomas Unniyadan`
- 2016 · AC 70 IRINJALAKUDA (UDF, rank 2): `Thomas Unniyadan`
- 2021 · AC 70 IRINJALAKUDA (UDF, rank 2): `Thomas Unniyadan`
- 2026 · AC 70 IRINJALAKUDA (UDF, rank 1): `ADV. THOMAS UNNIYADAN`

### `ANWAR SADATH` — 4 appearances across 1 AC
Raw name variants: `Anwar Sadath`, `ANWAR SADATH`

- 2011 · AC 76 ALUVA (UDF, rank 1): `Anwar Sadath`
- 2016 · AC 76 ALUVA (UDF, rank 1): `Anwar Sadath`
- 2021 · AC 76 ALUVA (UDF, rank 1): `Anwar Sadath`
- 2026 · AC 76 ALUVA (UDF, rank 1): `ANWAR SADATH`

### `V D SATHEESAN` — 4 appearances across 1 AC
Raw name variants: `V. D. Satheesan`, `ADV.V.D.SATHEESAN`

- 2011 · AC 78 PARAVUR (UDF, rank 1): `V. D. Satheesan`
- 2016 · AC 78 PARAVUR (UDF, rank 1): `V. D. Satheesan`
- 2021 · AC 78 PARAVUR (UDF, rank 1): `V. D. Satheesan`
- 2026 · AC 78 PARAVUR (UDF, rank 1): `ADV.V.D.SATHEESAN`

### `ANOOP JACOB` — 4 appearances across 1 AC
Raw name variants: `Anoop Jacob`, `ANOOP JACOB`

- 2012 by-bye · AC 85 PIRAVOM (UDF, rank 1): `Anoop Jacob`
- 2016 · AC 85 PIRAVOM (UDF, rank 1): `Anoop Jacob`
- 2021 · AC 85 PIRAVOM (UDF, rank 1): `Anoop Jacob`
- 2026 · AC 85 PIRAVOM (UDF, rank 1): `ANOOP JACOB`

### `MONS JOSEPH` — 4 appearances across 1 AC
Raw name variants: `Mons Joseph`, `ADV.MONS JOSEPH`

- 2011 · AC 94 KADUTHURUTHY (UDF, rank 1): `Mons Joseph`
- 2016 · AC 94 KADUTHURUTHY (UDF, rank 1): `Mons Joseph`
- 2021 · AC 94 KADUTHURUTHY (UDF, rank 1): `Mons Joseph`
- 2026 · AC 94 KADUTHURUTHY (UDF, rank 1): `ADV.MONS JOSEPH`

### `THIRUVANCHOOR RADHAKRISHNAN` — 4 appearances across 1 AC
Raw name variants: `Thiruvanchoor Radhakrishnan`, `THIRUVANCHOOR RADHAKRISHNAN`

- 2011 · AC 97 KOTTAYAM (UDF, rank 1): `Thiruvanchoor Radhakrishnan`
- 2016 · AC 97 KOTTAYAM (UDF, rank 1): `Thiruvanchoor Radhakrishnan`
- 2021 · AC 97 KOTTAYAM (UDF, rank 1): `Thiruvanchoor Radhakrishnan`
- 2026 · AC 97 KOTTAYAM (UDF, rank 1): `THIRUVANCHOOR RADHAKRISHNAN`

### `M LIJU` — 4 appearances across 2 ACs
Raw name variants: `M. Liju`, `ADV.M.LIJU`

- 2011 · AC 105 AMBALAPPUZHA (UDF, rank 2): `M. Liju`
- 2016 · AC 108 KAYAMKULAM (UDF, rank 2): `M. Liju`
- 2021 · AC 105 AMBALAPPUZHA (UDF, rank 2): `M. Liju`
- 2026 · AC 108 KAYAMKULAM (UDF, rank 1): `ADV.M.LIJU`

### `RAMESH CHENNITHALA` — 4 appearances across 1 AC
Raw name variants: `Ramesh Chennithala`, `RAMESH CHENNITHALA`

- 2011 · AC 107 HARIPAD (UDF, rank 1): `Ramesh Chennithala`
- 2016 · AC 107 HARIPAD (UDF, rank 1): `Ramesh Chennithala`
- 2021 · AC 107 HARIPAD (UDF, rank 1): `Ramesh Chennithala`
- 2026 · AC 107 HARIPAD (UDF, rank 1): `RAMESH CHENNITHALA`

### `MATHEW T THOMAS` — 4 appearances across 1 AC
Raw name variants: `Mathew T. Thomas`, `ADV. MATHEW T THOMAS`

- 2011 · AC 111 THIRUVALLA (LDF, rank 1): `Mathew T. Thomas`
- 2016 · AC 111 THIRUVALLA (LDF, rank 1): `Mathew T. Thomas`
- 2021 · AC 111 THIRUVALLA (LDF, rank 1): `Mathew T. Thomas`
- 2026 · AC 111 THIRUVALLA (LDF, rank 3): `ADV. MATHEW T THOMAS`

### `SHIBU BABY JOHN` — 4 appearances across 1 AC
Raw name variants: `Shibu Baby John`, `SHIBU BABY JOHN`

- 2011 · AC 117 CHAVARA (UDF, rank 1): `Shibu Baby John`
- 2016 · AC 117 CHAVARA (UDF, rank 2): `Shibu Baby John`
- 2021 · AC 117 CHAVARA (UDF, rank 2): `Shibu Baby John`
- 2026 · AC 117 CHAVARA (UDF, rank 1): `SHIBU BABY JOHN`

### `KOVOOR KUNJUMON` — 4 appearances across 1 AC
Raw name variants: `Kovoor Kunjumon`, `KOVOOR  KUNJUMON`

- 2011 · AC 118 KUNNATHUR (LDF, rank 1): `Kovoor Kunjumon`
- 2016 · AC 118 KUNNATHUR (LDF, rank 1): `Kovoor Kunjumon`
- 2021 · AC 118 KUNNATHUR (LDF, rank 1): `Kovoor Kunjumon`
- 2026 · AC 118 KUNNATHUR (LDF, rank 2): `KOVOOR  KUNJUMON`

### `RAJI PRASAD` — 4 appearances across 2 ACs
Raw name variants: `Raji Prasad`, `RAJI  PRASAD`

- 2011 · AC 118 KUNNATHUR (NDA, rank 3): `Raji Prasad`
- 2016 · AC 128 ATTINGAL (NDA, rank 3): `Raji Prasad`
- 2021 · AC 118 KUNNATHUR (NDA, rank 3): `Raji Prasad`
- 2026 · AC 118 KUNNATHUR (NDA, rank 3): `RAJI  PRASAD`

### `K MURALEEDHARAN` — 4 appearances across 2 ACs
Raw name variants: `K. Muraleedharan`, `K. MURALEEDHARAN`

- 2011 · AC 133 VATTIYOORKAVU (UDF, rank 1): `K. Muraleedharan`
- 2016 · AC 133 VATTIYOORKAVU (UDF, rank 1): `K. Muraleedharan`
- 2021 · AC 135 NEMOM (UDF, rank 3): `K. Muraleedharan`
- 2026 · AC 133 VATTIYOORKAVU (UDF, rank 1): `K. MURALEEDHARAN`

### `V S SIVAKUMAR` — 4 appearances across 2 ACs
Raw name variants: `V. S. Sivakumar`, `V. S. SIVAKUMAR`

- 2011 · AC 134 THIRUVANANTHAPURAM (UDF, rank 1): `V. S. Sivakumar`
- 2016 · AC 134 THIRUVANANTHAPURAM (UDF, rank 1): `V. S. Sivakumar`
- 2021 · AC 134 THIRUVANANTHAPURAM (UDF, rank 2): `V. S. Sivakumar`
- 2026 · AC 136 ARUVIKKARA (UDF, rank 2): `V. S. SIVAKUMAR`

### `V SIVANKUTTY` — 4 appearances across 1 AC
Raw name variants: `V. Sivankutty`, `V SIVANKUTTY`

- 2011 · AC 135 NEMOM (LDF, rank 1): `V. Sivankutty`
- 2016 · AC 135 NEMOM (LDF, rank 2): `V. Sivankutty`
- 2021 · AC 135 NEMOM (LDF, rank 1): `V. Sivankutty`
- 2026 · AC 135 NEMOM (LDF, rank 2): `V SIVANKUTTY`

### `O RAJAGOPAL` — 4 appearances across 3 ACs

- 2011 · AC 135 NEMOM (NDA, rank 2): `O. Rajagopal`
- 2012 by-bye · AC 140 NEYYATTINKARA (NDA, rank 3): `O. Rajagopal`
- 2015 by-bye · AC 136 ARUVIKKARA (NDA, rank 3): `O. Rajagopal`
- 2016 · AC 135 NEMOM (NDA, rank 1): `O. Rajagopal`

### `P K KRISHNADAS` — 4 appearances across 1 AC
Raw name variants: `P. K. Krishnadas`, `P. K. KRISHNADAS`

- 2011 · AC 138 KATTAKKADA (NDA, rank 3): `P. K. Krishnadas`
- 2016 · AC 138 KATTAKKADA (NDA, rank 3): `P. K. Krishnadas`
- 2021 · AC 138 KATTAKKADA (NDA, rank 3): `P. K. Krishnadas`
- 2026 · AC 138 KATTAKKADA (NDA, rank 3): `P. K. KRISHNADAS`

### `C H KUNHAMBU` — 3 appearances across 2 ACs
Raw name variants: `C. H. Kunhambu`, `C H KUNHAMBU`

- 2011 · AC 1 MANJESHWAR (LDF, rank 3): `C. H. Kunhambu`
- 2016 · AC 1 MANJESHWAR (LDF, rank 3): `C. H. Kunhambu`
- 2026 · AC 3 UDMA (LDF, rank 2): `C H KUNHAMBU`

### `K KUNHIRAMAN` — 3 appearances across 2 ACs

- 2011 · AC 3 UDMA (LDF, rank 1): `K. Kunhiraman`
- 2011 · AC 5 TRIKARIPUR (LDF, rank 1): `K. Kunhiraman`
- 2016 · AC 3 UDMA (LDF, rank 1): `K. Kunhiraman`

### `E CHANDRASEKHARAN` — 3 appearances across 1 AC

- 2011 · AC 4 KANHANGAD (LDF, rank 1): `E. Chandrasekharan`
- 2016 · AC 4 KANHANGAD (LDF, rank 1): `E. Chandrasekharan`
- 2021 · AC 4 KANHANGAD (LDF, rank 1): `E. Chandrasekharan`

### `A P GANGADHARAN` — 3 appearances across 3 ACs
Raw name variants: `A. P. Gangadharan`, `A. P. GANGADHARAN`

- 2016 · AC 9 IRIKKUR (NDA, rank 3): `A. P. Gangadharan`
- 2021 · AC 8 TALIPARAMBA (NDA, rank 3): `A. P. Gangadharan`
- 2026 · AC 6 PAYYANNUR (NDA, rank 3): `A. P. GANGADHARAN`

### `PINARAYI VIJAYAN` — 3 appearances across 1 AC
Raw name variants: `Pinarayi Vijayan`, `PINARAYI VIJAYAN`

- 2016 · AC 12 DHARMADAM (LDF, rank 1): `Pinarayi Vijayan`
- 2021 · AC 12 DHARMADAM (LDF, rank 1): `Pinarayi Vijayan`
- 2026 · AC 12 DHARMADAM (LDF, rank 1): `PINARAYI VIJAYAN`

### `C K PADMANABHAN` — 3 appearances across 2 ACs

- 2011 · AC 30 KUNNAMANGALAM (NDA, rank 3): `C. K. Padmanabhan`
- 2016 · AC 30 KUNNAMANGALAM (NDA, rank 3): `C. K. Padmanabhan`
- 2021 · AC 12 DHARMADAM (NDA, rank 3): `C. K. Padmanabhan`

### `O R KELU` — 3 appearances across 1 AC
Raw name variants: `O. R. Kelu`, `O R KELU`

- 2016 · AC 17 MANANTHAVADY (LDF, rank 1): `O. R. Kelu`
- 2021 · AC 17 MANANTHAVADY (LDF, rank 1): `O. R. Kelu`
- 2026 · AC 17 MANANTHAVADY (LDF, rank 2): `O R KELU`

### `K K REMA` — 3 appearances across 1 AC
Raw name variants: `K. K. Rema`, `K K REMA`

- 2016 · AC 20 VADAKARA (UDF, rank 3): `K. K. Rema`
- 2021 · AC 20 VADAKARA (UDF, rank 1): `K. K. Rema`
- 2026 · AC 20 VADAKARA (UDF, rank 1): `K K REMA`

### `E K VIJAYAN` — 3 appearances across 1 AC

- 2011 · AC 22 NADAPURAM (LDF, rank 1): `E. K. Vijayan`
- 2016 · AC 22 NADAPURAM (LDF, rank 1): `E. K. Vijayan`
- 2021 · AC 22 NADAPURAM (LDF, rank 1): `E. K. Vijayan`

### `K DASAN` — 3 appearances across 1 AC
Raw name variants: `K. Dasan`, `K. DASAN`

- 2011 · AC 23 QUILANDY (LDF, rank 1): `K. Dasan`
- 2016 · AC 23 QUILANDY (LDF, rank 1): `K. Dasan`
- 2026 · AC 23 QUILANDY (LDF, rank 2): `K. DASAN`

### `T P RAMAKRISHNAN` — 3 appearances across 1 AC
Raw name variants: `T. P. Ramakrishnan`, `T. P. RAMAKRISHNAN`

- 2016 · AC 24 PERAMBRA (LDF, rank 1): `T. P. Ramakrishnan`
- 2021 · AC 24 PERAMBRA (LDF, rank 1): `T. P. Ramakrishnan`
- 2026 · AC 24 PERAMBRA (LDF, rank 2): `T. P. RAMAKRISHNAN`

### `A K SASEENDRAN` — 3 appearances across 1 AC

- 2011 · AC 26 ELATHUR (LDF, rank 1): `A. K. Saseendran`
- 2016 · AC 26 ELATHUR (LDF, rank 1): `A. K. Saseendran`
- 2021 · AC 26 ELATHUR (LDF, rank 1): `A. K. Saseendran`

### `M K MUNEER` — 3 appearances across 2 ACs

- 2011 · AC 28 KOZHIKODE SOUTH (UDF, rank 1): `M. K. Muneer`
- 2016 · AC 28 KOZHIKODE SOUTH (UDF, rank 1): `M. K. Muneer`
- 2021 · AC 31 KODUVALLY (UDF, rank 1): `M. K. Muneer`

### `T V IBRAHIM` — 3 appearances across 2 ACs
Raw name variants: `T. V. Ibrahim`, `T V IBRAHIM`

- 2016 · AC 33 KONDOTTY (UDF, rank 1): `T. V. Ibrahim`
- 2021 · AC 33 KONDOTTY (UDF, rank 1): `T. V. Ibrahim`
- 2026 · AC 42 VALLIKUNNU (UDF, rank 1): `T V IBRAHIM`

### `ARYADAN SHOUKATH` — 3 appearances across 1 AC
Raw name variants: `Aryadan Shoukath`, `ARYADAN SHOUKATH`

- 2016 · AC 35 NILAMBUR (UDF, rank 2): `Aryadan Shoukath`
- 2025 by-bye · AC 35 NILAMBUR (UDF, rank 1): `Aryadan Shoukath`
- 2026 · AC 35 NILAMBUR (UDF, rank 1): `ARYADAN SHOUKATH`

### `M SWARAJ` — 3 appearances across 2 ACs

- 2016 · AC 81 THRIPUNITHURA (LDF, rank 1): `M. Swaraj`
- 2021 · AC 81 THRIPUNITHURA (LDF, rank 2): `M. Swaraj`
- 2025 by-bye · AC 35 NILAMBUR (LDF, rank 2): `M. Swaraj`

### `P UBAIDULLA` — 3 appearances across 1 AC

- 2011 · AC 40 MALAPPURAM (UDF, rank 1): `P. Ubaidulla`
- 2016 · AC 40 MALAPPURAM (UDF, rank 1): `P. Ubaidulla`
- 2021 · AC 40 MALAPPURAM (UDF, rank 1): `P. Ubaidulla`

### `K N A KHADER` — 3 appearances across 3 ACs

- 2011 · AC 42 VALLIKUNNU (UDF, rank 1): `K. N. A. Khader`
- 2017 by-bye · AC 41 VENGARA (UDF, rank 1): `K. N. A. Khader`
- 2021 · AC 63 GURUVAYOOR (UDF, rank 2): `K. N. A. Khader`

### `RAVI THELATH` — 3 appearances across 2 ACs
Raw name variants: `Ravi Thelath`, `RAVI THELATH`

- 2011 · AC 44 TANUR (NDA, rank 3): `Ravi Thelath`
- 2016 · AC 47 THAVANUR (NDA, rank 3): `Ravi Thelath`
- 2026 · AC 47 THAVANUR (NDA, rank 3): `RAVI THELATH`

### `V ABDURAHIMAN` — 3 appearances across 2 ACs
Raw name variants: `V. Abdurahiman`, `V.ABDURAHIMAN`

- 2016 · AC 44 TANUR (LDF, rank 1): `V. Abdurahiman`
- 2021 · AC 44 TANUR (LDF, rank 1): `V. Abdurahiman`
- 2026 · AC 45 TIRUR (LDF, rank 2): `V.ABDURAHIMAN`

### `P T AJAY MOHAN` — 3 appearances across 2 ACs
Raw name variants: `P. T. Ajay Mohan`, `P T AJAY MOHAN`

- 2011 · AC 48 PONNANI (UDF, rank 2): `P. T. Ajay Mohan`
- 2016 · AC 48 PONNANI (UDF, rank 2): `P. T. Ajay Mohan`
- 2026 · AC 62 KUNNAMKULAM (UDF, rank 2): `P T AJAY MOHAN`

### `K P SURESH RAJ` — 3 appearances across 2 ACs

- 2011 · AC 50 PATTAMBI (LDF, rank 2): `K. P. Suresh Raj`
- 2016 · AC 54 MANNARKKAD (LDF, rank 2): `K. P. Suresh Raj`
- 2021 · AC 54 MANNARKKAD (LDF, rank 2): `K. P. Suresh Raj`

### `P VENUGOPALAN` — 3 appearances across 1 AC

- 2011 · AC 52 OTTAPPALAM (NDA, rank 3): `P. Venugopalan`
- 2016 · AC 52 OTTAPPALAM (NDA, rank 3): `P. Venugopalan`
- 2021 · AC 52 OTTAPPALAM (NDA, rank 3): `P. Venugopalan`

### `N SAMSUDHEEN` — 3 appearances across 1 AC
Raw name variants: `N. Samsudheen`, `ADV. N. SAMSUDHEEN`

- 2011 · AC 54 MANNARKKAD (UDF, rank 1): `N. Samsudheen`
- 2016 · AC 54 MANNARKKAD (UDF, rank 1): `N. Samsudheen`
- 2026 · AC 54 MANNARKKAD (UDF, rank 1): `ADV. N. SAMSUDHEEN`

### `SHAFI PARAMBIL` — 3 appearances across 1 AC

- 2011 · AC 56 PALAKKAD (UDF, rank 1): `Shafi Parambil`
- 2016 · AC 56 PALAKKAD (UDF, rank 1): `Shafi Parambil`
- 2021 · AC 56 PALAKKAD (UDF, rank 1): `Shafi Parambil`

### `SOBHA SURENDRAN` — 3 appearances across 2 ACs
Raw name variants: `Sobha Surendran`, `SOBHA SURENDRAN`

- 2011 · AC 71 PUDUKKAD (NDA, rank 3): `Sobha Surendran`
- 2016 · AC 56 PALAKKAD (NDA, rank 2): `Sobha Surendran`
- 2026 · AC 56 PALAKKAD (NDA, rank 2): `SOBHA SURENDRAN`

### `U R PRADEEP` — 3 appearances across 1 AC
Raw name variants: `U. R. Pradeep`, `U R PRADEEP`

- 2016 · AC 61 CHELAKKARA (LDF, rank 1): `U. R. Pradeep`
- 2024 by-bye · AC 61 CHELAKKARA (LDF, rank 1): `U. R. Pradeep`
- 2026 · AC 61 CHELAKKARA (LDF, rank 1): `U R PRADEEP`

### `C P JOHN` — 3 appearances across 2 ACs
Raw name variants: `C. P. John`, `C P JOHN`

- 2011 · AC 62 KUNNAMKULAM (UDF, rank 2): `C. P. John`
- 2016 · AC 62 KUNNAMKULAM (UDF, rank 2): `C. P. John`
- 2026 · AC 134 THIRUVANANTHAPURAM (UDF, rank 1): `C P JOHN`

### `A C MOIDEEN` — 3 appearances across 1 AC
Raw name variants: `A. C. Moideen`, `A C MOIDEEN`

- 2016 · AC 62 KUNNAMKULAM (LDF, rank 1): `A. C. Moideen`
- 2021 · AC 62 KUNNAMKULAM (LDF, rank 1): `A. C. Moideen`
- 2026 · AC 62 KUNNAMKULAM (LDF, rank 1): `A C MOIDEEN`

### `K K ANEESHKUMAR` — 3 appearances across 2 ACs
Raw name variants: `K. K. Aneeshkumar`, `ADV K K ANEESHKUMAR`

- 2016 · AC 62 KUNNAMKULAM (NDA, rank 3): `K. K. Aneeshkumar`
- 2021 · AC 62 KUNNAMKULAM (NDA, rank 3): `K. K. Aneeshkumar`
- 2026 · AC 64 MANALUR (NDA, rank 3): `ADV K K ANEESHKUMAR`

### `T S ULLAS BABU` — 3 appearances across 1 AC
Raw name variants: `T. S. Ullas Babu`, `ADV. T.S ULLAS BABU`

- 2016 · AC 65 WADAKKANCHERY (NDA, rank 3): `T. S. Ullas Babu`
- 2021 · AC 65 WADAKKANCHERY (NDA, rank 3): `T. S. Ullas Babu`
- 2026 · AC 65 WADAKKANCHERY (NDA, rank 3): `ADV. T.S ULLAS BABU`

### `K RAJAN` — 3 appearances across 1 AC
Raw name variants: `K. Rajan`, `K RAJAN`

- 2016 · AC 66 OLLUR (LDF, rank 1): `K. Rajan`
- 2021 · AC 66 OLLUR (LDF, rank 1): `K. Rajan`
- 2026 · AC 66 OLLUR (LDF, rank 1): `K RAJAN`

### `B GOPALAKRISHNAN` — 3 appearances across 3 ACs
Raw name variants: `B. Gopalakrishnan`, `ADV. B. GOPALAKRISHNAN`

- 2016 · AC 67 THRISSUR (NDA, rank 3): `B. Gopalakrishnan`
- 2021 · AC 66 OLLUR (NDA, rank 3): `B. Gopalakrishnan`
- 2026 · AC 63 GURUVAYOOR (NDA, rank 3): `ADV. B. GOPALAKRISHNAN`

### `E T TAISON` — 3 appearances across 2 ACs
Raw name variants: `E. T. Taison`, `E. T. Taison Master`, `E.T.TAISON MASTER`

- 2016 · AC 69 KAIPAMANGALAM (LDF, rank 1): `E. T. Taison`
- 2021 · AC 69 KAIPAMANGALAM (LDF, rank 1): `E. T. Taison Master`
- 2026 · AC 78 PARAVUR (LDF, rank 2): `E.T.TAISON MASTER`

### `K K RAMACHANDRAN` — 3 appearances across 2 ACs
Raw name variants: `K. K. Ramachandran`, `K. K. Ramachandran Nair`, `K K RAMACHANDRAN`
Caste suffix(es) seen: `NAIR`

- 2016 · AC 110 CHENGANNUR (LDF, rank 1): `K. K. Ramachandran Nair`
- 2021 · AC 71 PUDUKKAD (LDF, rank 1): `K. K. Ramachandran`
- 2026 · AC 71 PUDUKKAD (LDF, rank 1): `K K RAMACHANDRAN`

### `V R SUNIL KUMAR` — 3 appearances across 1 AC
Raw name variants: `V. R. Sunil Kumar`, `ADV. V R SUNIL KUMAR`

- 2016 · AC 73 KODUNGALLUR (LDF, rank 1): `V. R. Sunil Kumar`
- 2021 · AC 73 KODUNGALLUR (LDF, rank 1): `V. R. Sunil Kumar`
- 2026 · AC 73 KODUNGALLUR (LDF, rank 2): `ADV. V R SUNIL KUMAR`

### `SAJU PAUL` — 3 appearances across 2 ACs
Raw name variants: `Saju Paul`, `SAJU PAUL`

- 2011 · AC 74 PERUMBAVOOR (LDF, rank 1): `Saju Paul`
- 2016 · AC 74 PERUMBAVOOR (LDF, rank 2): `Saju Paul`
- 2026 · AC 75 ANGAMALY (LDF, rank 2): `SAJU PAUL`

### `ROJI M JOHN` — 3 appearances across 1 AC
Raw name variants: `Roji M. John`, `ROJI M JOHN`

- 2016 · AC 75 ANGAMALY (UDF, rank 1): `Roji M. John`
- 2021 · AC 75 ANGAMALY (UDF, rank 1): `Roji M. John`
- 2026 · AC 75 ANGAMALY (UDF, rank 1): `ROJI M JOHN`

### `T J VINOD` — 3 appearances across 1 AC
Raw name variants: `T. J. Vinod`, `T.J VINOD`

- 2019 by-bye · AC 82 ERANAKULAM (UDF, rank 1): `T. J. Vinod`
- 2021 · AC 82 ERANAKULAM (UDF, rank 1): `T. J. Vinod`
- 2026 · AC 82 ERANAKULAM (UDF, rank 1): `T.J VINOD`

### `M J JACOB` — 3 appearances across 1 AC

- 2011 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
- 2012 by-bye · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
- 2016 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`

### `JOSEPH VAZHACKAN` — 3 appearances across 2 ACs

- 2011 · AC 86 MUVATTUPUZHA (UDF, rank 1): `Joseph Vazhackan`
- 2016 · AC 86 MUVATTUPUZHA (UDF, rank 2): `Joseph Vazhackan`
- 2021 · AC 100 KANJIRAPPALLY (UDF, rank 2): `Joseph Vazhackan`

### `ANTONY JOHN` — 3 appearances across 1 AC
Raw name variants: `Antony John`, `ANTONY JOHN`

- 2016 · AC 87 KOTHAMANGALAM (LDF, rank 1): `Antony John`
- 2021 · AC 87 KOTHAMANGALAM (LDF, rank 1): `Antony John`
- 2026 · AC 87 KOTHAMANGALAM (LDF, rank 2): `ANTONY JOHN`

### `P J JOSEPH` — 3 appearances across 1 AC

- 2011 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`
- 2016 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`
- 2021 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`

### `MANI C KAPPAN` — 3 appearances across 1 AC

- 2011 · AC 93 PALA (LDF, rank 2): `Mani C. Kappan`
- 2016 · AC 93 PALA (LDF, rank 2): `Mani C. Kappan`
- 2019 by-bye · AC 93 PALA (LDF, rank 1): `Mani C. Kappan`

### `N HARI` — 3 appearances across 2 ACs

- 2016 · AC 93 PALA (NDA, rank 3): `N. Hari`
- 2019 by-bye · AC 93 PALA (NDA, rank 3): `N. Hari`
- 2021 · AC 98 PUTHUPPALLY (NDA, rank 3): `N. Hari`

### `V N VASAVAN` — 3 appearances across 2 ACs
Raw name variants: `V. N. Vasavan`, `V. N. VASAVAN`

- 2011 · AC 97 KOTTAYAM (LDF, rank 2): `V. N. Vasavan`
- 2021 · AC 96 ETTUMANOOR (LDF, rank 1): `V. N. Vasavan`
- 2026 · AC 96 ETTUMANOOR (LDF, rank 2): `V. N. VASAVAN`

### `OOMMEN CHANDY` — 3 appearances across 1 AC

- 2011 · AC 98 PUTHUPPALLY (UDF, rank 1): `Oommen Chandy`
- 2016 · AC 98 PUTHUPPALLY (UDF, rank 1): `Oommen Chandy`
- 2021 · AC 98 PUTHUPPALLY (UDF, rank 1): `Oommen Chandy`

### `JAICK C THOMAS` — 3 appearances across 1 AC

- 2016 · AC 98 PUTHUPPALLY (LDF, rank 2): `Jaick C. Thomas`
- 2021 · AC 98 PUTHUPPALLY (LDF, rank 2): `Jaick C. Thomas`
- 2023 by-bye · AC 98 PUTHUPPALLY (LDF, rank 2): `Jaick C. Thomas`

### `P PRASAD` — 3 appearances across 2 ACs
Raw name variants: `P. Prasad`, `P. PRASAD`

- 2016 · AC 107 HARIPAD (LDF, rank 2): `P. Prasad`
- 2021 · AC 103 CHERTHALA (LDF, rank 1): `P. Prasad`
- 2026 · AC 103 CHERTHALA (LDF, rank 1): `P. PRASAD`

### `U PRATHIBHA` — 3 appearances across 1 AC
Raw name variants: `U. Prathibha`, `ADV.U.PRATHIBHA`

- 2016 · AC 108 KAYAMKULAM (LDF, rank 1): `U. Prathibha`
- 2021 · AC 108 KAYAMKULAM (LDF, rank 1): `U. Prathibha`
- 2026 · AC 108 KAYAMKULAM (LDF, rank 2): `ADV.U.PRATHIBHA`

### `K K SHAJU` — 3 appearances across 2 ACs

- 2011 · AC 109 MAVELIKKARA (UDF, rank 2): `K. K. Shaju`
- 2016 · AC 115 ADOOR (UDF, rank 2): `K. K. Shaju`
- 2021 · AC 109 MAVELIKKARA (UDF, rank 2): `K. K. Shaju`

### `P C VISHNUNATH` — 3 appearances across 2 ACs

- 2011 · AC 110 CHENGANNUR (UDF, rank 1): `P. C. Vishnunath`
- 2016 · AC 110 CHENGANNUR (UDF, rank 2): `P. C. Vishnunath`
- 2021 · AC 123 KUNDARA (UDF, rank 1): `P. C. Vishnunath`

### `VEENA GEORGE` — 3 appearances across 1 AC
Raw name variants: `Veena George`, `VEENA GEORGE`

- 2016 · AC 113 ARANMULA (LDF, rank 1): `Veena George`
- 2021 · AC 113 ARANMULA (LDF, rank 1): `Veena George`
- 2026 · AC 113 ARANMULA (LDF, rank 2): `VEENA GEORGE`

### `K U JENISH KUMAR` — 3 appearances across 1 AC
Raw name variants: `K. U. Jenish Kumar`, `ADV K U JENISH KUMAR`

- 2019 by-bye · AC 114 KONNI (LDF, rank 1): `K. U. Jenish Kumar`
- 2021 · AC 114 KONNI (LDF, rank 1): `K. U. Jenish Kumar`
- 2026 · AC 114 KONNI (LDF, rank 1): `ADV K U JENISH KUMAR`

### `CHITTAYAM GOPAKUMAR` — 3 appearances across 1 AC

- 2011 · AC 115 ADOOR (LDF, rank 1): `Chittayam Gopakumar`
- 2016 · AC 115 ADOOR (LDF, rank 1): `Chittayam Gopakumar`
- 2021 · AC 115 ADOOR (LDF, rank 1): `Chittayam Gopakumar`

### `P SUDHEER` — 3 appearances across 2 ACs
Raw name variants: `P. Sudheer`, `ADV. P SUDHEER`

- 2016 · AC 115 ADOOR (NDA, rank 3): `P. Sudheer`
- 2021 · AC 128 ATTINGAL (NDA, rank 2): `P. Sudheer`
- 2026 · AC 128 ATTINGAL (NDA, rank 2): `ADV. P SUDHEER`

### `C R MAHESH` — 3 appearances across 1 AC
Raw name variants: `C. R. Mahesh`, `C.R. MAHESH`

- 2016 · AC 116 KARUNAGAPPALLY (UDF, rank 2): `C. R. Mahesh`
- 2021 · AC 116 KARUNAGAPPALLY (UDF, rank 1): `C. R. Mahesh`
- 2026 · AC 116 KARUNAGAPPALLY (UDF, rank 1): `C.R. MAHESH`

### `M NOUSHAD` — 3 appearances across 1 AC
Raw name variants: `M. Noushad`, `M.NOUSHAD`

- 2016 · AC 125 ERAVIPURAM (LDF, rank 1): `M. Noushad`
- 2021 · AC 125 ERAVIPURAM (LDF, rank 1): `M. Noushad`
- 2026 · AC 125 ERAVIPURAM (LDF, rank 2): `M.NOUSHAD`

### `G S JAYALAL` — 3 appearances across 1 AC

- 2011 · AC 126 CHATHANNOOR (LDF, rank 1): `G. S. Jayalal`
- 2016 · AC 126 CHATHANNOOR (LDF, rank 1): `G. S. Jayalal`
- 2021 · AC 126 CHATHANNOOR (LDF, rank 1): `G. S. Jayalal`

### `B B GOPAKUMAR` — 3 appearances across 1 AC
Raw name variants: `B. B. Gopakumar`, `B.B.GOPAKUMAR`

- 2016 · AC 126 CHATHANNOOR (NDA, rank 2): `B. B. Gopakumar`
- 2021 · AC 126 CHATHANNOOR (NDA, rank 2): `B. B. Gopakumar`
- 2026 · AC 126 CHATHANNOOR (NDA, rank 1): `B.B.GOPAKUMAR`

### `VARKALA KAHAR` — 3 appearances across 1 AC
Raw name variants: `Varkala Kahar`, `VARKALA KAHAR`

- 2011 · AC 127 VARKALA (UDF, rank 1): `Varkala Kahar`
- 2016 · AC 127 VARKALA (UDF, rank 2): `Varkala Kahar`
- 2026 · AC 127 VARKALA (UDF, rank 2): `VARKALA KAHAR`

### `V JOY` — 3 appearances across 1 AC
Raw name variants: `V. Joy`, `ADV.V JOY`

- 2016 · AC 127 VARKALA (LDF, rank 1): `V. Joy`
- 2021 · AC 127 VARKALA (LDF, rank 1): `V. Joy`
- 2026 · AC 127 VARKALA (LDF, rank 1): `ADV.V JOY`

### `V SASI` — 3 appearances across 1 AC

- 2011 · AC 129 CHIRAYINKEEZHU (LDF, rank 1): `V. Sasi`
- 2016 · AC 129 CHIRAYINKEEZHU (LDF, rank 1): `V. Sasi`
- 2021 · AC 129 CHIRAYINKEEZHU (LDF, rank 1): `V. Sasi`

### `V V RAJESH` — 3 appearances across 2 ACs

- 2011 · AC 133 VATTIYOORKAVU (NDA, rank 3): `V. V. Rajesh`
- 2016 · AC 130 NEDUMANGAD (NDA, rank 3): `V. V. Rajesh`
- 2021 · AC 133 VATTIYOORKAVU (NDA, rank 2): `V. V. Rajesh`

### `KADAKAMPALLY SURENDRAN` — 3 appearances across 1 AC
Raw name variants: `Kadakampally Surendran`, `KADAKAMPALLY SURENDRAN`

- 2016 · AC 132 KAZHAKOOTTAM (LDF, rank 1): `Kadakampally Surendran`
- 2021 · AC 132 KAZHAKOOTTAM (LDF, rank 1): `Kadakampally Surendran`
- 2026 · AC 132 KAZHAKOOTTAM (LDF, rank 2): `KADAKAMPALLY SURENDRAN`

### `KUMMANAM RAJASEKHARAN` — 3 appearances across 3 ACs
Raw name variants: `Kummanam Rajasekharan`, `KUMMANAM RAJASEKHARAN`

- 2016 · AC 133 VATTIYOORKAVU (NDA, rank 2): `Kummanam Rajasekharan`
- 2021 · AC 135 NEMOM (NDA, rank 2): `Kummanam Rajasekharan`
- 2026 · AC 113 ARANMULA (NDA, rank 3): `KUMMANAM RAJASEKHARAN`

### `V K PRASANTH` — 3 appearances across 1 AC
Raw name variants: `V. K. Prasanth`, `ADV. V.K PRASANTH`

- 2019 by-bye · AC 133 VATTIYOORKAVU (LDF, rank 1): `V. K. Prasanth`
- 2021 · AC 133 VATTIYOORKAVU (LDF, rank 1): `V. K. Prasanth`
- 2026 · AC 133 VATTIYOORKAVU (LDF, rank 2): `ADV. V.K PRASANTH`

### `C K HAREENDRAN` — 3 appearances across 1 AC
Raw name variants: `C. K. Hareendran`, `C K HAREENDRAN`

- 2016 · AC 137 PARASSALA (LDF, rank 1): `C. K. Hareendran`
- 2021 · AC 137 PARASSALA (LDF, rank 1): `C. K. Hareendran`
- 2026 · AC 137 PARASSALA (LDF, rank 1): `C K HAREENDRAN`

### `KARAMANA JAYAN` — 3 appearances across 2 ACs
Raw name variants: `Karamana Jayan`, `KARAMANA JAYAN`

- 2016 · AC 137 PARASSALA (NDA, rank 3): `Karamana Jayan`
- 2021 · AC 137 PARASSALA (NDA, rank 3): `Karamana Jayan`
- 2026 · AC 134 THIRUVANANTHAPURAM (NDA, rank 3): `KARAMANA JAYAN`

### `M VINCENT` — 3 appearances across 1 AC
Raw name variants: `M. Vincent`, `ADV. M.VINCENT`

- 2016 · AC 139 KOVALAM (UDF, rank 1): `M. Vincent`
- 2021 · AC 139 KOVALAM (UDF, rank 1): `M. Vincent`
- 2026 · AC 139 KOVALAM (UDF, rank 1): `ADV. M.VINCENT`

### `K ANSALAN` — 3 appearances across 1 AC
Raw name variants: `K. Ansalan`, `K. ANSALAN`

- 2016 · AC 140 NEYYATTINKARA (LDF, rank 1): `K. Ansalan`
- 2021 · AC 140 NEYYATTINKARA (LDF, rank 1): `K. Ansalan`
- 2026 · AC 140 NEYYATTINKARA (LDF, rank 2): `K. ANSALAN`

### `P B ABDUL RAZAK` — 2 appearances across 1 AC

- 2011 · AC 1 MANJESHWAR (UDF, rank 1): `P. B. Abdul Razak`
- 2016 · AC 1 MANJESHWAR (UDF, rank 1): `P. B. Abdul Razak`

### `A K M ASHRAF` — 2 appearances across 1 AC
Raw name variants: `A. K. M. Ashraf`, `A K M ASHRAF`

- 2021 · AC 1 MANJESHWAR (UDF, rank 1): `A. K. M. Ashraf`
- 2026 · AC 1 MANJESHWAR (UDF, rank 1): `A K M ASHRAF`

### `N A NELLIKKUNNU` — 2 appearances across 1 AC

- 2011 · AC 2 KASARAGOD (UDF, rank 1): `N. A. Nellikkunnu`
- 2016 · AC 2 KASARAGOD (UDF, rank 1): `N. A. Nellikkunnu`

### `C KRISHNAN` — 2 appearances across 1 AC

- 2011 · AC 6 PAYYANNUR (LDF, rank 1): `C. Krishnan`
- 2016 · AC 6 PAYYANNUR (LDF, rank 1): `C. Krishnan`

### `ANIAMMA` — 2 appearances across 2 ACs
Raw name variants: `Aniamma`, `Aniamma Teacher`

- 2016 · AC 6 PAYYANNUR (NDA, rank 3): `Aniamma`
- 2021 · AC 9 IRIKKUR (NDA, rank 3): `Aniamma Teacher`

### `T I MADHUSOODANAN` — 2 appearances across 1 AC
Raw name variants: `T. I. Madhusoodanan`, `T. I. MADHUSOODANAN`

- 2021 · AC 6 PAYYANNUR (LDF, rank 1): `T. I. Madhusoodanan`
- 2026 · AC 6 PAYYANNUR (LDF, rank 2): `T. I. MADHUSOODANAN`

### `T V RAJESH` — 2 appearances across 1 AC

- 2011 · AC 7 KALLIASSERI (LDF, rank 1): `T. V. Rajesh`
- 2016 · AC 7 KALLIASSERI (LDF, rank 1): `T. V. Rajesh`

### `M VIJIN` — 2 appearances across 1 AC
Raw name variants: `M. Vijin`, `M.VIJIN`

- 2021 · AC 7 KALLIASSERI (LDF, rank 1): `M. Vijin`
- 2026 · AC 7 KALLIASSERI (LDF, rank 1): `M.VIJIN`

### `JAMES MATHEW` — 2 appearances across 1 AC

- 2011 · AC 8 TALIPARAMBA (LDF, rank 1): `James Mathew`
- 2016 · AC 8 TALIPARAMBA (LDF, rank 1): `James Mathew`

### `V P ABDUL RASHEED` — 2 appearances across 2 ACs
Raw name variants: `V. P. Abdul Rasheed`, `ADV. V.P ABDUL RASHEED`

- 2021 · AC 8 TALIPARAMBA (UDF, rank 2): `V. P. Abdul Rasheed`
- 2026 · AC 12 DHARMADAM (UDF, rank 2): `ADV. V.P ABDUL RASHEED`

### `SAJEEV JOSEPH` — 2 appearances across 1 AC
Raw name variants: `Sajeev Joseph`, `ADV. SAJEEV JOSEPH`

- 2021 · AC 9 IRIKKUR (UDF, rank 1): `Sajeev Joseph`
- 2026 · AC 9 IRIKKUR (UDF, rank 1): `ADV. SAJEEV JOSEPH`

### `K V SUMESH` — 2 appearances across 1 AC
Raw name variants: `K. V. Sumesh`, `K. V. SUMESH`

- 2021 · AC 10 AZHIKODE (LDF, rank 1): `K. V. Sumesh`
- 2026 · AC 10 AZHIKODE (LDF, rank 1): `K. V. SUMESH`

### `K RANJITH` — 2 appearances across 2 ACs
Raw name variants: `K. Ranjith`, `K. RANJITH`

- 2021 · AC 10 AZHIKODE (NDA, rank 3): `K. Ranjith`
- 2026 · AC 12 DHARMADAM (NDA, rank 3): `K. RANJITH`

### `A P ABDULLAKUTTY` — 2 appearances across 2 ACs

- 2011 · AC 11 KANNUR (UDF, rank 1): `A. P. Abdullakutty`
- 2016 · AC 13 THALASSERY (UDF, rank 2): `A. P. Abdullakutty`

### `KADANNAPALLI RAMACHANDRAN` — 2 appearances across 1 AC

- 2011 · AC 11 KANNUR (LDF, rank 2): `Kadannapalli Ramachandran`
- 2016 · AC 11 KANNUR (LDF, rank 1): `Kadannapalli Ramachandran`

### `MAMBARAM DIVAKARAN` — 2 appearances across 1 AC

- 2011 · AC 12 DHARMADAM (UDF, rank 2): `Mambaram Divakaran`
- 2016 · AC 12 DHARMADAM (UDF, rank 2): `Mambaram Divakaran`

### `A N SHAMSEER` — 2 appearances across 1 AC

- 2016 · AC 13 THALASSERY (LDF, rank 1): `A. N. Shamseer`
- 2021 · AC 13 THALASSERY (LDF, rank 1): `A. N. Shamseer`

### `C SADANANDAN` — 2 appearances across 1 AC

- 2016 · AC 14 KUTHUPARAMBA (NDA, rank 3): `C. Sadanandan Master`
- 2021 · AC 14 KUTHUPARAMBA (NDA, rank 3): `C. Sadanandan Master`

### `E P JAYARAJAN` — 2 appearances across 1 AC

- 2011 · AC 15 MATTANNUR (LDF, rank 1): `E. P. Jayarajan`
- 2016 · AC 15 MATTANNUR (LDF, rank 1): `E. P. Jayarajan`

### `P K JAYALAKSHMI` — 2 appearances across 1 AC

- 2011 · AC 17 MANANTHAVADY (UDF, rank 1): `P. K. Jayalakshmi`
- 2016 · AC 17 MANANTHAVADY (UDF, rank 2): `P. K. Jayalakshmi`

### `C K JANU` — 2 appearances across 1 AC

- 2016 · AC 18 SULTHANBATHERY (NDA, rank 3): `C. K. Janu`
- 2021 · AC 18 SULTHANBATHERY (NDA, rank 3): `C. K. Janu`

### `M S VISWANATHAN` — 2 appearances across 1 AC
Raw name variants: `M. S. Viswanathan`, `M S VISWANATHAN`

- 2021 · AC 18 SULTHANBATHERY (LDF, rank 2): `M. S. Viswanathan`
- 2026 · AC 18 SULTHANBATHERY (LDF, rank 2): `M S VISWANATHAN`

### `M V SHREYAMS KUMAR` — 2 appearances across 1 AC

- 2011 · AC 19 KALPETTA (UDF, rank 1): `M. V. Shreyams Kumar`
- 2016 · AC 19 KALPETTA (UDF, rank 2): `M. V. Shreyams Kumar`

### `C K NANU` — 2 appearances across 1 AC

- 2011 · AC 20 VADAKARA (LDF, rank 1): `C. K. Nanu`
- 2016 · AC 20 VADAKARA (LDF, rank 1): `C. K. Nanu`

### `K K LATHIKA` — 2 appearances across 1 AC

- 2011 · AC 21 KUTTIADI (LDF, rank 1): `K. K. Lathika`
- 2016 · AC 21 KUTTIADI (LDF, rank 2): `K. K. Lathika`

### `PARAKKAL ABDULLA` — 2 appearances across 1 AC
Raw name variants: `Parakkal Abdulla`, `PARAKKAL ABDULLA`

- 2016 · AC 21 KUTTIADI (UDF, rank 1): `Parakkal Abdulla`
- 2026 · AC 21 KUTTIADI (UDF, rank 1): `PARAKKAL ABDULLA`

### `RAMADAS MANALERI` — 2 appearances across 1 AC
Raw name variants: `Ramadas Manaleri`, `RAMADAS MANALERI`

- 2016 · AC 21 KUTTIADI (NDA, rank 3): `Ramadas Manaleri`
- 2026 · AC 21 KUTTIADI (NDA, rank 3): `RAMADAS MANALERI`

### `K P PRAKASH BABU` — 2 appearances across 2 ACs

- 2011 · AC 22 NADAPURAM (NDA, rank 3): `K. P. Prakash Babu`
- 2019 by-bye · AC 102 AROOR (NDA, rank 3): `K. P. Prakash Babu`

### `M P RAJAN` — 2 appearances across 1 AC

- 2016 · AC 22 NADAPURAM (NDA, rank 3): `M. P. Rajan`
- 2021 · AC 22 NADAPURAM (NDA, rank 3): `M. P. Rajan`

### `K PRAVEEN KUMAR` — 2 appearances across 2 ACs
Raw name variants: `K. Praveen Kumar`, `ADV. K. PRAVEEN KUMAR`

- 2021 · AC 22 NADAPURAM (UDF, rank 2): `K. Praveen Kumar`
- 2026 · AC 23 QUILANDY (UDF, rank 1): `ADV. K. PRAVEEN KUMAR`

### `T P JAYACHANDRAN` — 2 appearances across 2 ACs
Raw name variants: `T. P. Jayachandran`, `T. P. Jayachandran Master`

- 2011 · AC 23 QUILANDY (NDA, rank 3): `T. P. Jayachandran`
- 2021 · AC 26 ELATHUR (NDA, rank 3): `T. P. Jayachandran Master`

### `K M SACHINDEV` — 2 appearances across 1 AC
Raw name variants: `K. M. Sachindev`, `ADV. K.M. SACHINDEV`

- 2021 · AC 25 BALUSSERI (LDF, rank 1): `K. M. Sachindev`
- 2026 · AC 25 BALUSSERI (LDF, rank 2): `ADV. K.M. SACHINDEV`

### `V V RAJAN` — 2 appearances across 1 AC

- 2011 · AC 26 ELATHUR (NDA, rank 3): `V. V. Rajan`
- 2016 · AC 26 ELATHUR (NDA, rank 3): `V. V. Rajan`

### `A PRADEEPKUMAR` — 2 appearances across 1 AC

- 2011 · AC 27 KOZHIKODE NORTH (LDF, rank 1): `A. Pradeepkumar`
- 2016 · AC 27 KOZHIKODE NORTH (LDF, rank 1): `A. Pradeepkumar`

### `K P SREESAN` — 2 appearances across 2 ACs

- 2011 · AC 29 BEYPORE (NDA, rank 3): `K. P. Sreesan`
- 2016 · AC 27 KOZHIKODE NORTH (NDA, rank 3): `K. P. Sreesan`

### `THOTTATHIL RAVINDRAN` — 2 appearances across 1 AC
Raw name variants: `Thottathil Ravindran`, `THOTTATHIL RAVINDRAN`

- 2021 · AC 27 KOZHIKODE NORTH (LDF, rank 1): `Thottathil Ravindran`
- 2026 · AC 27 KOZHIKODE NORTH (LDF, rank 2): `THOTTATHIL RAVINDRAN`

### `K M ABHIJITH` — 2 appearances across 2 ACs
Raw name variants: `K. M. Abhijith`, `K.M. ABHIJITH`

- 2021 · AC 27 KOZHIKODE NORTH (UDF, rank 2): `K. M. Abhijith`
- 2026 · AC 22 NADAPURAM (UDF, rank 1): `K.M. ABHIJITH`

### `M T RAMESH` — 2 appearances across 2 ACs

- 2016 · AC 113 ARANMULA (NDA, rank 3): `M. T. Ramesh`
- 2021 · AC 27 KOZHIKODE NORTH (NDA, rank 3): `M. T. Ramesh`

### `AHAMMAD DEVARKOVIL` — 2 appearances across 1 AC
Raw name variants: `Ahammad Devarkovil`, `AHAMMAD DEVARKOVIL`

- 2021 · AC 28 KOZHIKODE SOUTH (LDF, rank 1): `Ahammad Devarkovil`
- 2026 · AC 28 KOZHIKODE SOUTH (LDF, rank 2): `AHAMMAD DEVARKOVIL`

### `NAVYA HARIDAS` — 2 appearances across 2 ACs
Raw name variants: `Navya Haridas`, `NAVYA HARIDAS`

- 2021 · AC 28 KOZHIKODE SOUTH (NDA, rank 3): `Navya Haridas`
- 2026 · AC 27 KOZHIKODE NORTH (NDA, rank 3): `NAVYA HARIDAS`

### `PRAKASH BABU` — 2 appearances across 1 AC

- 2016 · AC 29 BEYPORE (NDA, rank 3): `Prakash Babu`
- 2021 · AC 29 BEYPORE (NDA, rank 3): `Prakash Babu`

### `U C RAMAN` — 2 appearances across 2 ACs

- 2011 · AC 30 KUNNAMANGALAM (UDF, rank 2): `U. C. Raman`
- 2021 · AC 53 KONGAD (UDF, rank 2): `U. C. Raman`

### `V M UMMER` — 2 appearances across 2 ACs

- 2011 · AC 31 KODUVALLY (UDF, rank 1): `V. M. Ummer`
- 2016 · AC 32 THIRUVAMBADI (UDF, rank 2): `V. M. Ummer`

### `KARAT RAZAK` — 2 appearances across 1 AC

- 2016 · AC 31 KODUVALLY (LDF, rank 1): `Karat Razak`
- 2021 · AC 31 KODUVALLY (LDF, rank 2): `Karat Razak`

### `M A RAZAK` — 2 appearances across 2 ACs
Raw name variants: `M. A. Razak`, `M.A. RAZAK MASTER`

- 2016 · AC 31 KODUVALLY (UDF, rank 2): `M. A. Razak`
- 2026 · AC 30 KUNNAMANGALAM (UDF, rank 1): `M.A. RAZAK MASTER`

### `GEORGE M THOMAS` — 2 appearances across 1 AC

- 2011 · AC 32 THIRUVAMBADI (LDF, rank 2): `George M. Thomas`
- 2016 · AC 32 THIRUVAMBADI (LDF, rank 1): `George M. Thomas`

### `GIRI PAMBANAL` — 2 appearances across 2 ACs
Raw name variants: `Giri Pambanal`, `GIRI PAMBANAL`

- 2016 · AC 32 THIRUVAMBADI (NDA, rank 3): `Giri Pambanal`
- 2026 · AC 31 KODUVALLY (NDA, rank 3): `GIRI PAMBANAL`

### `LINTO JOSEPH` — 2 appearances across 1 AC
Raw name variants: `Linto Joseph`, `LINTO JOSEPH`

- 2021 · AC 32 THIRUVAMBADI (LDF, rank 1): `Linto Joseph`
- 2026 · AC 32 THIRUVAMBADI (LDF, rank 2): `LINTO JOSEPH`

### `K P BABURAJ` — 2 appearances across 2 ACs
Raw name variants: `K. P. Baburaj`, `ADV. K.P BABURAJ`

- 2011 · AC 34 ERNAD (NDA, rank 3): `K. P. Baburaj`
- 2026 · AC 38 PERINTHALMANNA (NDA, rank 3): `ADV. K.P BABURAJ`

### `C DINESH` — 2 appearances across 2 ACs

- 2016 · AC 37 MANJERI (NDA, rank 3): `C. Dinesh`
- 2021 · AC 34 ERNAD (NDA, rank 3): `C. Dinesh`

### `V V PRAKASH` — 2 appearances across 2 ACs

- 2011 · AC 47 THAVANUR (UDF, rank 2): `V. V. Prakash`
- 2021 · AC 35 NILAMBUR (UDF, rank 2): `V. V. Prakash`

### `A P ANIL KUMAR` — 2 appearances across 1 AC

- 2011 · AC 36 WANDOOR (UDF, rank 1): `A. P. Anil Kumar`
- 2016 · AC 36 WANDOOR (UDF, rank 1): `A. P. Anil Kumar`

### `A P ANILKUMAR` — 2 appearances across 1 AC
Raw name variants: `A. P. Anilkumar`, `A.P ANILKUMAR`

- 2021 · AC 36 WANDOOR (UDF, rank 1): `A. P. Anilkumar`
- 2026 · AC 36 WANDOOR (UDF, rank 1): `A.P ANILKUMAR`

### `M UMMER` — 2 appearances across 1 AC

- 2011 · AC 37 MANJERI (UDF, rank 1): `M. Ummer`
- 2016 · AC 37 MANJERI (UDF, rank 1): `M. Ummer`

### `V SASIKUMAR` — 2 appearances across 1 AC

- 2011 · AC 38 PERINTHALMANNA (LDF, rank 2): `V. Sasikumar`
- 2016 · AC 38 PERINTHALMANNA (LDF, rank 2): `V. Sasikumar`

### `NAJEEB KANTHAPURAM` — 2 appearances across 1 AC
Raw name variants: `Najeeb Kanthapuram`, `NAJEEB KANTHAPURAM`

- 2021 · AC 38 PERINTHALMANNA (UDF, rank 1): `Najeeb Kanthapuram`
- 2026 · AC 38 PERINTHALMANNA (UDF, rank 1): `NAJEEB KANTHAPURAM`

### `T A AHMED KABIR` — 2 appearances across 1 AC

- 2011 · AC 39 MANKADA (UDF, rank 1): `T. A. Ahmed Kabir`
- 2016 · AC 39 MANKADA (UDF, rank 1): `T. A. Ahmed Kabir`

### `P P BASHEER` — 2 appearances across 1 AC

- 2016 · AC 41 VENGARA (LDF, rank 2): `P. P. Basheer`
- 2017 by-bye · AC 41 VENGARA (LDF, rank 2): `P. P. Basheer`

### `P T ALI HAJI` — 2 appearances across 2 ACs

- 2011 · AC 45 TIRUR (NDA, rank 3): `P. T. Ali Haji`
- 2016 · AC 41 VENGARA (NDA, rank 3): `P. T. Ali Haji`

### `P JIJI` — 2 appearances across 2 ACs
Raw name variants: `P. Jiji`, `DR. P. JIJI`

- 2021 · AC 41 VENGARA (LDF, rank 2): `P. Jiji`
- 2026 · AC 33 KONDOTTY (LDF, rank 2): `DR. P. JIJI`

### `P K ABDU RABB` — 2 appearances across 1 AC

- 2011 · AC 43 TIRURANGADI (UDF, rank 1): `P. K. Abdu Rabb`
- 2016 · AC 43 TIRURANGADI (UDF, rank 1): `P. K. Abdu Rabb`

### `ABDURAHIMAN RANDATHANI` — 2 appearances across 1 AC

- 2011 · AC 44 TANUR (UDF, rank 1): `Abdurahiman Randathani`
- 2016 · AC 44 TANUR (UDF, rank 2): `Abdurahiman Randathani`

### `P K FIROS` — 2 appearances across 2 ACs
Raw name variants: `P. K. Firos`, `P K FIROS`

- 2021 · AC 44 TANUR (UDF, rank 2): `P. K. Firos`
- 2026 · AC 31 KODUVALLY (UDF, rank 1): `P K FIROS`

### `K NARAYANAN` — 2 appearances across 2 ACs
Raw name variants: `K. Narayanan Master`, `K.NARAYANAN MASTER`

- 2021 · AC 44 TANUR (NDA, rank 3): `K. Narayanan Master`
- 2026 · AC 45 TIRUR (NDA, rank 3): `K.NARAYANAN MASTER`

### `C MAMMUTTY` — 2 appearances across 1 AC

- 2011 · AC 45 TIRUR (UDF, rank 1): `C. Mammutty`
- 2016 · AC 45 TIRUR (UDF, rank 1): `C. Mammutty`

### `KURUKKOLI MOIDEEN` — 2 appearances across 1 AC
Raw name variants: `Kurukkoli Moideen`, `KURUKKOLI MOIDEEN`

- 2021 · AC 45 TIRUR (UDF, rank 1): `Kurukkoli Moideen`
- 2026 · AC 45 TIRUR (UDF, rank 1): `KURUKKOLI MOIDEEN`

### `K K SURENDRAN` — 2 appearances across 2 ACs

- 2011 · AC 46 KOTTAKKAL (NDA, rank 3): `K. K. Surendran`
- 2016 · AC 48 PONNANI (NDA, rank 3): `K. K. Surendran`

### `V UNNIKRISHNAN` — 2 appearances across 2 ACs
Raw name variants: `V. Unnikrishnan Master`, `V UNNIKRISHNAN MASTER`

- 2016 · AC 46 KOTTAKKAL (NDA, rank 3): `V. Unnikrishnan Master`
- 2026 · AC 49 THRITHALA (NDA, rank 3): `V UNNIKRISHNAN MASTER`

### `ABID HUSSAIN THANGAL` — 2 appearances across 1 AC
Raw name variants: `Abid Hussain Thangal`, `PROF. ABID HUSSAIN THANGAL`

- 2021 · AC 46 KOTTAKKAL (UDF, rank 1): `Abid Hussain Thangal`
- 2026 · AC 46 KOTTAKKAL (UDF, rank 1): `PROF. ABID HUSSAIN THANGAL`

### `P SREERAMAKRISHNAN` — 2 appearances across 1 AC

- 2011 · AC 48 PONNANI (LDF, rank 1): `P. Sreeramakrishnan`
- 2016 · AC 48 PONNANI (LDF, rank 1): `P. Sreeramakrishnan`

### `V T BALARAM` — 2 appearances across 1 AC

- 2011 · AC 49 THRITHALA (UDF, rank 1): `V. T. Balaram`
- 2016 · AC 49 THRITHALA (UDF, rank 1): `V. T. Balaram`

### `M B RAJESH` — 2 appearances across 1 AC
Raw name variants: `M. B. Rajesh`, `M B RAJESH`

- 2021 · AC 49 THRITHALA (LDF, rank 1): `M. B. Rajesh`
- 2026 · AC 49 THRITHALA (LDF, rank 2): `M B RAJESH`

### `V T BALRAM` — 2 appearances across 1 AC
Raw name variants: `V. T. Balram`, `V T BALRAM`

- 2021 · AC 49 THRITHALA (UDF, rank 2): `V. T. Balram`
- 2026 · AC 49 THRITHALA (UDF, rank 1): `V T BALRAM`

### `SANKU T DAS` — 2 appearances across 2 ACs
Raw name variants: `Sanku T. Das`, `ADV. SANKU.T.DAS`

- 2021 · AC 49 THRITHALA (NDA, rank 3): `Sanku T. Das`
- 2026 · AC 51 SHORNUR (NDA, rank 3): `ADV. SANKU.T.DAS`

### `C P MOHAMMED` — 2 appearances across 1 AC

- 2011 · AC 50 PATTAMBI (UDF, rank 1): `C. P. Mohammed`
- 2016 · AC 50 PATTAMBI (UDF, rank 2): `C. P. Mohammed`

### `P MANOJ` — 2 appearances across 1 AC
Raw name variants: `P. Manoj`, `ADV. P. MANOJ`

- 2016 · AC 50 PATTAMBI (NDA, rank 3): `P. Manoj`
- 2026 · AC 50 PATTAMBI (NDA, rank 3): `ADV. P. MANOJ`

### `MUHAMMED MUHASSIN` — 2 appearances across 1 AC
Raw name variants: `Muhammed Muhassin`, `MUHAMMED MUHASSIN`

- 2021 · AC 50 PATTAMBI (LDF, rank 1): `Muhammed Muhassin`
- 2026 · AC 50 PATTAMBI (LDF, rank 1): `MUHAMMED MUHASSIN`

### `P MAMMIKUTTY` — 2 appearances across 1 AC
Raw name variants: `P. Mammikutty`, `P.MAMMIKUTTY`

- 2021 · AC 51 SHORNUR (LDF, rank 1): `P. Mammikutty`
- 2026 · AC 51 SHORNUR (LDF, rank 1): `P.MAMMIKUTTY`

### `SHANIMOL USMAN` — 2 appearances across 2 ACs

- 2016 · AC 52 OTTAPPALAM (UDF, rank 2): `Shanimol Usman`
- 2019 by-bye · AC 102 AROOR (UDF, rank 1): `Shanimol Usman`

### `K PREMKUMAR` — 2 appearances across 1 AC
Raw name variants: `K. Premkumar`, `ADV. K. PREMKUMAR`

- 2021 · AC 52 OTTAPPALAM (LDF, rank 1): `K. Premkumar`
- 2026 · AC 52 OTTAPPALAM (LDF, rank 1): `ADV. K. PREMKUMAR`

### `K V VIJAYADAS` — 2 appearances across 1 AC

- 2011 · AC 53 KONGAD (LDF, rank 1): `K. V. Vijayadas`
- 2016 · AC 53 KONGAD (LDF, rank 1): `K. V. Vijayadas`

### `PANDALAM SUDHAKARAN` — 2 appearances across 2 ACs

- 2011 · AC 115 ADOOR (UDF, rank 2): `Pandalam Sudhakaran`
- 2016 · AC 53 KONGAD (UDF, rank 2): `Pandalam Sudhakaran`

### `RENU SURESH` — 2 appearances across 1 AC
Raw name variants: `Renu Suresh`, `DR. RENU SURESH`

- 2016 · AC 53 KONGAD (NDA, rank 3): `Renu Suresh`
- 2026 · AC 53 KONGAD (NDA, rank 3): `DR. RENU SURESH`

### `K SANTHAKUMARI` — 2 appearances across 1 AC
Raw name variants: `K. Santhakumari`, `ADV. K.SANTHAKUMARI`

- 2021 · AC 53 KONGAD (LDF, rank 1): `K. Santhakumari`
- 2026 · AC 53 KONGAD (LDF, rank 2): `ADV. K.SANTHAKUMARI`

### `V S ACHUTHANANDAN` — 2 appearances across 1 AC

- 2011 · AC 55 MALAMPUZHA (LDF, rank 1): `V. S. Achuthanandan`
- 2016 · AC 55 MALAMPUZHA (LDF, rank 1): `V. S. Achuthanandan`

### `V S JOY` — 2 appearances across 2 ACs
Raw name variants: `V. S. Joy`, `ADV. V S JOY`

- 2016 · AC 55 MALAMPUZHA (UDF, rank 3): `V. S. Joy`
- 2026 · AC 47 THAVANUR (UDF, rank 1): `ADV. V S JOY`

### `A PRABHAKARAN` — 2 appearances across 1 AC
Raw name variants: `A. Prabhakaran`, `A PRABHAKARAN`

- 2021 · AC 55 MALAMPUZHA (LDF, rank 1): `A. Prabhakaran`
- 2026 · AC 55 MALAMPUZHA (LDF, rank 1): `A PRABHAKARAN`

### `A K BALAN` — 2 appearances across 1 AC

- 2011 · AC 57 TARUR (LDF, rank 1): `A. K. Balan`
- 2016 · AC 57 TARUR (LDF, rank 1): `A. K. Balan`

### `K ACHUTHAN` — 2 appearances across 1 AC

- 2011 · AC 58 CHITTUR (UDF, rank 1): `K. Achuthan`
- 2016 · AC 58 CHITTUR (UDF, rank 2): `K. Achuthan`

### `SUMESH ACHUTHAN` — 2 appearances across 1 AC
Raw name variants: `Sumesh Achuthan`, `ADV. SUMESH ACHUTHAN`

- 2021 · AC 58 CHITTUR (UDF, rank 2): `Sumesh Achuthan`
- 2026 · AC 58 CHITTUR (UDF, rank 1): `ADV. SUMESH ACHUTHAN`

### `N SIVARAJAN` — 2 appearances across 1 AC

- 2011 · AC 59 NEMMARA (NDA, rank 3): `N. Sivarajan`
- 2016 · AC 59 NEMMARA (NDA, rank 3): `N. Sivarajan`

### `A N ANURAG` — 2 appearances across 1 AC
Raw name variants: `A. N. Anurag`, `A.N.ANURAG`

- 2021 · AC 59 NEMMARA (NDA, rank 3): `A. N. Anurag`
- 2026 · AC 59 NEMMARA (NDA, rank 3): `A.N.ANURAG`

### `K KUSALAKUMAR` — 2 appearances across 1 AC

- 2011 · AC 60 ALATHUR (UDF, rank 2): `K. Kusalakumar`
- 2016 · AC 60 ALATHUR (UDF, rank 2): `K. Kusalakumar`

### `K D PRASENAN` — 2 appearances across 1 AC

- 2016 · AC 60 ALATHUR (LDF, rank 1): `K. D. Prasenan`
- 2021 · AC 60 ALATHUR (LDF, rank 1): `K. D. Prasenan`

### `THULASI` — 2 appearances across 2 ACs
Raw name variants: `Thulasi`, `THULASI TEACHER`

- 2016 · AC 61 CHELAKKARA (UDF, rank 2): `Thulasi`
- 2026 · AC 53 KONGAD (UDF, rank 1): `THULASI TEACHER`

### `RAMYA HARIDAS` — 2 appearances across 2 ACs
Raw name variants: `Ramya Haridas`, `RAMYA HARIDAS`

- 2024 by-bye · AC 61 CHELAKKARA (UDF, rank 2): `Ramya Haridas`
- 2026 · AC 129 CHIRAYINKEEZHU (UDF, rank 1): `RAMYA HARIDAS`

### `K BALAKRISHNAN` — 2 appearances across 1 AC
Raw name variants: `K. Balakrishnan`, `K BALAKRISHNAN`

- 2024 by-bye · AC 61 CHELAKKARA (NDA, rank 3): `K. Balakrishnan`
- 2026 · AC 61 CHELAKKARA (NDA, rank 3): `K BALAKRISHNAN`

_… and 116 more in `data/candidate-continuity.json`._

---

## B. Suspected missed matches (normaliser kept apart)

Pairs of different canonical keys with high token overlap (Jaccard ≥ 0.5 same-AC, ≥ 0.6 cross-AC). Each pair is **probably the same person but didn't merge** — review the patterns to extend `normalizeName()` rules.

### B.1 Same-AC suspected matches (44 — 0 classified · 44 unclassified)

Pairs of normalised keys with high token overlap in the same AC. Could be: (a) same person with word-order or initial drift (extend normaliser), (b) hereditary succession (father-son), or (c) coincidental surname-sharers.

#### ❓ Unclassified — needs review

- **`A RAJA`** ↔ **`F RAJA`** (Jaccard 1.00, shared: `RAJA`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 88 DEVIKULAM (LDF, rank 1): `A. Raja`
    - A: 2026 · AC 88 DEVIKULAM (LDF, rank 2): `ADV. A. RAJA`
    - B: 2026 · AC 88 DEVIKULAM (UDF, rank 1): `F. RAJA`
- **`ABDUL HAMEED`** ↔ **`P ABDUL HAMEED`** (Jaccard 1.00, shared: `ABDUL`, `HAMEED`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 42 VALLIKUNNU (UDF, rank 1): `Abdul Hameed Master`
    - B: 2016 · AC 42 VALLIKUNNU (UDF, rank 1): `P. Abdul Hameed`
- **`ABID HUSSAIN THANGAL`** ↔ **`K K ABID HUSSAIN THANGAL`** (Jaccard 1.00, shared: `ABID`, `HUSSAIN`, `THANGAL`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 46 KOTTAKKAL (UDF, rank 1): `Abid Hussain Thangal`
    - A: 2026 · AC 46 KOTTAKKAL (UDF, rank 1): `PROF. ABID HUSSAIN THANGAL`
    - B: 2016 · AC 46 KOTTAKKAL (UDF, rank 1): `K. K. Abid Hussain Thangal`
- **`ADAM MULSI M P`** ↔ **`M P ADAM MULSI`** (Jaccard 1.00, shared: `ADAM`, `MULSI`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 29 BEYPORE (UDF, rank 2): `Adam Mulsi M. P.`
    - B: 2016 · AC 29 BEYPORE (UDF, rank 2): `M. P. Adam Mulsi`
- **`AJI S R M`** ↔ **`S AJI`** (Jaccard 1.00, shared: `AJI`) — ❓ **NEEDS REVIEW**
    - A: 2016 · AC 127 VARKALA (NDA, rank 3): `Aji S. R. M.`
    - B: 2021 · AC 127 VARKALA (NDA, rank 3): `S. Aji`
- **`ANIYAPPAN`** ↔ **`T ANIYAPPAN`** (Jaccard 1.00, shared: `ANIYAPPAN`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 102 AROOR (NDA, rank 3): `Aniyappan`
    - B: 2016 · AC 102 AROOR (NDA, rank 3): `T. Aniyappan`
- **`C SIVANKUTTY`** ↔ **`SIVANKUTTY C`** (Jaccard 1.00, shared: `SIVANKUTTY`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 136 ARUVIKKARA (NDA, rank 3): `C. Sivankutty`
    - B: 2011 · AC 136 ARUVIKKARA (NDA, rank 3): `Sivankutty C.`
- **`CHANDY OOMMEN`** ↔ **`OOMMEN CHANDY`** (Jaccard 1.00, shared: `CHANDY`, `OOMMEN`) — ❓ **NEEDS REVIEW**
    - A: 2023 by-bye · AC 98 PUTHUPPALLY (UDF, rank 1): `Chandy Oommen`
    - A: 2026 · AC 98 PUTHUPPALLY (UDF, rank 1): `ADV. CHANDY OOMMEN`
    - B: 2011 · AC 98 PUTHUPPALLY (UDF, rank 1): `Oommen Chandy`
    - B: 2016 · AC 98 PUTHUPPALLY (UDF, rank 1): `Oommen Chandy`
    - B: 2021 · AC 98 PUTHUPPALLY (UDF, rank 1): `Oommen Chandy`
- **`CHENKAL RAJASEKHARAN`** ↔ **`CHENKAL S RAJASEKHARAN`** (Jaccard 1.00, shared: `CHENKAL`, `RAJASEKHARAN`) — ❓ **NEEDS REVIEW**
    - A: 2026 · AC 140 NEYYATTINKARA (NDA, rank 3): `CHENKAL RAJASEKHARAN`
    - B: 2021 · AC 140 NEYYATTINKARA (NDA, rank 3): `Chenkal S. Rajasekharan Nair`
- **`K A UNNIKRISHNAN`** ↔ **`UNNIKRISHNAN K A`** (Jaccard 1.00, shared: `UNNIKRISHNAN`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 72 CHALAKUDY (NDA, rank 3): `K. A. Unnikrishnan`
    - B: 2016 · AC 72 CHALAKUDY (NDA, rank 3): `Unnikrishnan K. A.`
- **`K ANILKUMAR`** ↔ **`P ANILKUMAR`** (Jaccard 1.00, shared: `ANILKUMAR`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 97 KOTTAYAM (LDF, rank 2): `K. Anilkumar`
    - A: 2026 · AC 97 KOTTAYAM (LDF, rank 2): `ADV.K. ANILKUMAR`
    - B: 2026 · AC 97 KOTTAYAM (NDA, rank 3): `P ANILKUMAR`
- **`K PADMAKUMAR`** ↔ **`PADMAKUMAR K`** (Jaccard 1.00, shared: `PADMAKUMAR`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 112 RANNI (NDA, rank 3): `K. Padmakumar`
    - B: 2016 · AC 112 RANNI (NDA, rank 3): `Padmakumar K.`
- **`M J JACOB`** ↔ **`T M JACOB`** (Jaccard 1.00, shared: `JACOB`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - A: 2012 by-bye · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - A: 2016 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - B: 2011 · AC 85 PIRAVOM (UDF, rank 1): `T. M. Jacob`
- **`P P SUMOD`** ↔ **`SUMOD`** (Jaccard 1.00, shared: `SUMOD`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 57 TARUR (LDF, rank 1): `P. P. Sumod`
    - B: 2026 · AC 57 TARUR (LDF, rank 1): `SUMOD`
- **`A D THOMAS`** ↔ **`T M THOMAS ISAAC`** (Jaccard 0.50, shared: `THOMAS`) — ❓ **NEEDS REVIEW**
    - A: 2026 · AC 104 ALAPPUZHA (UDF, rank 1): `A.D THOMAS`
    - B: 2011 · AC 104 ALAPPUZHA (LDF, rank 1): `T. M. Thomas Isaac`
    - B: 2016 · AC 104 ALAPPUZHA (LDF, rank 1): `T. M. Thomas Isaac`
- **`ABDURAHIMAN RANDATHANI`** ↔ **`V ABDURAHIMAN`** (Jaccard 0.50, shared: `ABDURAHIMAN`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 44 TANUR (UDF, rank 1): `Abdurahiman Randathani`
    - A: 2016 · AC 44 TANUR (UDF, rank 2): `Abdurahiman Randathani`
    - B: 2016 · AC 44 TANUR (LDF, rank 1): `V. Abdurahiman`
    - B: 2021 · AC 44 TANUR (LDF, rank 1): `V. Abdurahiman`
    - B: 2026 · AC 45 TIRUR (LDF, rank 2): `V.ABDURAHIMAN`
- **`ANOOP JACOB`** ↔ **`M J JACOB`** (Jaccard 0.50, shared: `JACOB`) — ❓ **NEEDS REVIEW**
    - A: 2012 by-bye · AC 85 PIRAVOM (UDF, rank 1): `Anoop Jacob`
    - A: 2016 · AC 85 PIRAVOM (UDF, rank 1): `Anoop Jacob`
    - A: 2021 · AC 85 PIRAVOM (UDF, rank 1): `Anoop Jacob`
    - B: 2011 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - B: 2012 by-bye · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - B: 2016 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
- **`ANOOP JACOB`** ↔ **`T M JACOB`** (Jaccard 0.50, shared: `JACOB`) — ❓ **NEEDS REVIEW**
    - A: 2012 by-bye · AC 85 PIRAVOM (UDF, rank 1): `Anoop Jacob`
    - A: 2016 · AC 85 PIRAVOM (UDF, rank 1): `Anoop Jacob`
    - A: 2021 · AC 85 PIRAVOM (UDF, rank 1): `Anoop Jacob`
    - B: 2011 · AC 85 PIRAVOM (UDF, rank 1): `T. M. Jacob`
- **`ARUN KAITHAPRAM`** ↔ **`K P ARUN`** (Jaccard 0.50, shared: `ARUN`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 7 KALLIASSERI (NDA, rank 3): `Arun Kaithapram`
    - B: 2016 · AC 7 KALLIASSERI (NDA, rank 3): `K. P. Arun`
- **`C P VIPIN CHANDRAN`** ↔ **`V M CHANDRAN`** (Jaccard 0.50, shared: `CHANDRAN`) — ❓ **NEEDS REVIEW**
    - A: 2026 · AC 22 NADAPURAM (NDA, rank 3): `C.P. VIPIN CHANDRAN`
    - B: 2011 · AC 22 NADAPURAM (UDF, rank 2): `V. M. Chandran`
- **`DHANYA SURESH`** ↔ **`P V SURESH`** (Jaccard 0.50, shared: `SURESH`) — ❓ **NEEDS REVIEW**
    - A: 2016 · AC 4 KANHANGAD (UDF, rank 2): `Dhanya Suresh`
    - B: 2021 · AC 4 KANHANGAD (UDF, rank 2): `P. V. Suresh`
- **`IRUMUTTOOR KUNHIRAMAN`** ↔ **`K C KUNHIRAMAN`** (Jaccard 0.50, shared: `KUNHIRAMAN`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 17 MANANTHAVADY (NDA, rank 3): `Irumuttoor Kunhiraman`
    - B: 2011 · AC 17 MANANTHAVADY (LDF, rank 2): `K. C. Kunhiraman`
- **`JOSE K MANI`** ↔ **`K M MANI`** (Jaccard 0.50, shared: `MANI`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 93 PALA (LDF, rank 2): `Jose K. Mani`
    - A: 2026 · AC 93 PALA (LDF, rank 2): `JOSE K MANI`
    - B: 2011 · AC 93 PALA (UDF, rank 1): `K. M. Mani`
    - B: 2016 · AC 93 PALA (UDF, rank 1): `K. M. Mani`
- **`JOSEPH AUGUSTINE`** ↔ **`P J JOSEPH`** (Jaccard 0.50, shared: `JOSEPH`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 90 THODUPUZHA (LDF, rank 2): `Joseph Augustine`
    - B: 2011 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`
    - B: 2016 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`
    - B: 2021 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`
- **`K ACHUTHAN`** ↔ **`SUMESH ACHUTHAN`** (Jaccard 0.50, shared: `ACHUTHAN`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 58 CHITTUR (UDF, rank 1): `K. Achuthan`
    - A: 2016 · AC 58 CHITTUR (UDF, rank 2): `K. Achuthan`
    - B: 2021 · AC 58 CHITTUR (UDF, rank 2): `Sumesh Achuthan`
    - B: 2026 · AC 58 CHITTUR (UDF, rank 1): `ADV. SUMESH ACHUTHAN`
- **`K C JOSEPH`** ↔ **`SAJEEV JOSEPH`** (Jaccard 0.50, shared: `JOSEPH`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 9 IRIKKUR (UDF, rank 1): `K. C. Joseph`
    - A: 2011 · AC 106 KUTTANAD (UDF, rank 2): `K. C. Joseph`
    - A: 2016 · AC 9 IRIKKUR (UDF, rank 1): `K. C. Joseph`
    - B: 2021 · AC 9 IRIKKUR (UDF, rank 1): `Sajeev Joseph`
    - B: 2026 · AC 9 IRIKKUR (UDF, rank 1): `ADV. SAJEEV JOSEPH`
- **`K M MANI`** ↔ **`MANI C KAPPAN`** (Jaccard 0.50, shared: `MANI`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 93 PALA (UDF, rank 1): `K. M. Mani`
    - A: 2016 · AC 93 PALA (UDF, rank 1): `K. M. Mani`
    - B: 2011 · AC 93 PALA (LDF, rank 2): `Mani C. Kappan`
    - B: 2016 · AC 93 PALA (LDF, rank 2): `Mani C. Kappan`
    - B: 2019 by-bye · AC 93 PALA (LDF, rank 1): `Mani C. Kappan`
- **`K M MANI`** ↔ **`MANI C KAPPEN`** (Jaccard 0.50, shared: `MANI`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 93 PALA (UDF, rank 1): `K. M. Mani`
    - A: 2016 · AC 93 PALA (UDF, rank 1): `K. M. Mani`
    - B: 2021 · AC 93 PALA (UDF, rank 1): `Mani C. Kappen`
    - B: 2026 · AC 93 PALA (UDF, rank 1): `MANI C KAPPEN`
- **`K N A KHADER`** ↔ **`K V ABDUL KHADER`** (Jaccard 0.50, shared: `KHADER`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 42 VALLIKUNNU (UDF, rank 1): `K. N. A. Khader`
    - A: 2017 by-bye · AC 41 VENGARA (UDF, rank 1): `K. N. A. Khader`
    - A: 2021 · AC 63 GURUVAYOOR (UDF, rank 2): `K. N. A. Khader`
    - B: 2011 · AC 63 GURUVAYOOR (LDF, rank 1): `K. V. Abdul Khader`
    - B: 2016 · AC 63 GURUVAYOOR (LDF, rank 1): `K. V. Abdul Khader`
- **`K R RAJENDRA PRASAD`** ↔ **`P PRASAD`** (Jaccard 0.50, shared: `PRASAD`) — ❓ **NEEDS REVIEW**
    - A: 2026 · AC 103 CHERTHALA (UDF, rank 2): `K.R. RAJENDRA PRASAD`
    - B: 2016 · AC 107 HARIPAD (LDF, rank 2): `P. Prasad`
    - B: 2021 · AC 103 CHERTHALA (LDF, rank 1): `P. Prasad`
    - B: 2026 · AC 103 CHERTHALA (LDF, rank 1): `P. PRASAD`
- **`KARAT RAZAK`** ↔ **`M A RAZAK`** (Jaccard 0.50, shared: `RAZAK`) — ❓ **NEEDS REVIEW**
    - A: 2016 · AC 31 KODUVALLY (LDF, rank 1): `Karat Razak`
    - A: 2021 · AC 31 KODUVALLY (LDF, rank 2): `Karat Razak`
    - B: 2016 · AC 31 KODUVALLY (UDF, rank 2): `M. A. Razak`
    - B: 2026 · AC 30 KUNNAMANGALAM (UDF, rank 1): `M.A. RAZAK MASTER`
- **`M A SURENDRAN`** ↔ **`SUJITH P SURENDRAN`** (Jaccard 0.50, shared: `SURENDRAN`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 84 KUNNATHUNAD (LDF, rank 2): `M. A. Surendran`
    - B: 2021 · AC 84 KUNNATHUNAD (OTHER, rank 3): `Sujith P. Surendran`
- **`M G KANNAN`** ↔ **`PRIJI KANNAN`** (Jaccard 0.50, shared: `KANNAN`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 115 ADOOR (UDF, rank 2): `M. G. Kannan`
    - B: 2026 · AC 115 ADOOR (LDF, rank 2): `PRIJI KANNAN`
- **`M J JACOB`** ↔ **`SABU K JACOB`** (Jaccard 0.50, shared: `JACOB`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - A: 2012 by-bye · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - A: 2016 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - B: 2026 · AC 85 PIRAVOM (LDF, rank 2): `SABU K JACOB`
- **`M J JACOB`** ↔ **`SINDHUMOL JACOB`** (Jaccard 0.50, shared: `JACOB`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - A: 2012 by-bye · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - A: 2016 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - B: 2021 · AC 85 PIRAVOM (LDF, rank 2): `Sindhumol Jacob`
- **`N SAJI KUMAR`** ↔ **`S SAJI`** (Jaccard 0.50, shared: `SAJI`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 83 THRIKKAKARA (NDA, rank 3): `N. Saji Kumar`
    - B: 2016 · AC 83 THRIKKAKARA (NDA, rank 3): `S. Saji`
    - B: 2021 · AC 83 THRIKKAKARA (NDA, rank 3): `S. Saji`
- **`P C GEORGE`** ↔ **`P C GEORGE PLATHOTTAM`** (Jaccard 0.50, shared: `GEORGE`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 101 POONJAR (UDF, rank 1): `P. C. George`
    - A: 2016 · AC 101 POONJAR (OTHER, rank 1): `P. C. George`
    - A: 2026 · AC 101 POONJAR (NDA, rank 3): `P.C. GEORGE`
    - B: 2021 · AC 101 POONJAR (OTHER, rank 2): `P. C. George Plathottam`
- **`P T THOMAS`** ↔ **`UMA THOMAS`** (Jaccard 0.50, shared: `THOMAS`) — ❓ **NEEDS REVIEW**
    - A: 2016 · AC 83 THRIKKAKARA (UDF, rank 1): `P. T. Thomas`
    - A: 2021 · AC 83 THRIKKAKARA (UDF, rank 1): `P. T. Thomas`
    - B: 2022 by-bye · AC 83 THRIKKAKARA (UDF, rank 1): `Uma Thomas`
    - B: 2026 · AC 83 THRIKKAKARA (UDF, rank 1): `UMA THOMAS`
- **`SABU K JACOB`** ↔ **`T M JACOB`** (Jaccard 0.50, shared: `JACOB`) — ❓ **NEEDS REVIEW**
    - A: 2026 · AC 85 PIRAVOM (LDF, rank 2): `SABU K JACOB`
    - B: 2011 · AC 85 PIRAVOM (UDF, rank 1): `T. M. Jacob`
- **`SEBASTIAN KULATHUNKAL`** ↔ **`SEBASTIAN M J`** (Jaccard 0.50, shared: `SEBASTIAN`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 101 POONJAR (LDF, rank 1): `Sebastian Kulathunkal`
    - A: 2026 · AC 101 POONJAR (LDF, rank 2): `ADV. SEBASTIAN KULATHUNKAL`
    - B: 2026 · AC 101 POONJAR (UDF, rank 1): `ADV.SEBASTIAN M.J`
- **`SHAJUMON P P`** ↔ **`SHAJUMON VATTEKKAD`** (Jaccard 0.50, shared: `SHAJUMON`) — ❓ **NEEDS REVIEW**
    - A: 2016 · AC 61 CHELAKKARA (NDA, rank 3): `Shajumon P. P.`
    - B: 2021 · AC 61 CHELAKKARA (NDA, rank 3): `Shajumon Vattekkad`
- **`SINDHUMOL JACOB`** ↔ **`T M JACOB`** (Jaccard 0.50, shared: `JACOB`) — ❓ **NEEDS REVIEW**
    - A: 2021 · AC 85 PIRAVOM (LDF, rank 2): `Sindhumol Jacob`
    - B: 2011 · AC 85 PIRAVOM (UDF, rank 1): `T. M. Jacob`
- **`T K RAMAN`** ↔ **`U C RAMAN PADANILAM`** (Jaccard 0.50, shared: `RAMAN`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 25 BALUSSERI (NDA, rank 3): `T. K. Raman`
    - B: 2016 · AC 25 BALUSSERI (UDF, rank 2): `U. C. Raman Padanilam`
- **`THOMAS CHANDY`** ↔ **`THOMAS K THOMAS`** (Jaccard 0.50, shared: `THOMAS`) — ❓ **NEEDS REVIEW**
    - A: 2011 · AC 106 KUTTANAD (LDF, rank 1): `Thomas Chandy`
    - A: 2016 · AC 106 KUTTANAD (LDF, rank 1): `Thomas Chandy`
    - B: 2021 · AC 106 KUTTANAD (LDF, rank 1): `Thomas K. Thomas`
    - B: 2026 · AC 106 KUTTANAD (LDF, rank 2): `THOMAS K. THOMAS`

### B.2 Cross-AC same-alliance suspected matches (128)

Same alliance, different ACs, high token overlap. Most useful for identifying candidates who appeared under different name spellings across constituencies (e.g. K. Surendran across multiple BJP runs).

- **`A B JAYAPRAKASH`** ↔ **`K JAYAPRAKASH`** (Jaccard 1.00, shared: `JAYAPRAKASH`)
    - A: 2021 · AC 78 PARAVUR (NDA, rank 3): `A. B. Jayaprakash`
    - B: 2011 · AC 8 TALIPARAMBA (NDA, rank 3): `K. Jayaprakash`
- **`A B JAYAPRAKASH`** ↔ **`V T JAYAPRAKASH`** (Jaccard 1.00, shared: `JAYAPRAKASH`)
    - A: 2021 · AC 78 PARAVUR (NDA, rank 3): `A. B. Jayaprakash`
    - B: 2011 · AC 48 PONNANI (NDA, rank 3): `V. T. Jayaprakash`
- **`A BALARAM`** ↔ **`V T BALARAM`** (Jaccard 1.00, shared: `BALARAM`)
    - A: 2011 · AC 25 BALUSSERI (UDF, rank 2): `A. Balaram`
    - B: 2011 · AC 49 THRITHALA (UDF, rank 1): `V. T. Balaram`
    - B: 2016 · AC 49 THRITHALA (UDF, rank 1): `V. T. Balaram`
- **`A D THOMAS`** ↔ **`C F THOMAS`** (Jaccard 1.00, shared: `THOMAS`)
    - A: 2026 · AC 104 ALAPPUZHA (UDF, rank 1): `A.D THOMAS`
    - B: 2011 · AC 99 CHANGANASSERY (UDF, rank 1): `C. F. Thomas`
    - B: 2016 · AC 99 CHANGANASSERY (UDF, rank 1): `C. F. Thomas`
- **`A D THOMAS`** ↔ **`P T THOMAS`** (Jaccard 1.00, shared: `THOMAS`)
    - A: 2026 · AC 104 ALAPPUZHA (UDF, rank 1): `A.D THOMAS`
    - B: 2016 · AC 83 THRIKKAKARA (UDF, rank 1): `P. T. Thomas`
    - B: 2021 · AC 83 THRIKKAKARA (UDF, rank 1): `P. T. Thomas`
- **`A K BALAN`** ↔ **`N R BALAN`** (Jaccard 1.00, shared: `BALAN`)
    - A: 2011 · AC 57 TARUR (LDF, rank 1): `A. K. Balan`
    - A: 2016 · AC 57 TARUR (LDF, rank 1): `A. K. Balan`
    - B: 2011 · AC 65 WADAKKANCHERY (LDF, rank 2): `N. R. Balan`
- **`A K SASEENDRAN`** ↔ **`C K SASEENDRAN`** (Jaccard 1.00, shared: `SASEENDRAN`)
    - A: 2011 · AC 26 ELATHUR (LDF, rank 1): `A. K. Saseendran`
    - A: 2016 · AC 26 ELATHUR (LDF, rank 1): `A. K. Saseendran`
    - A: 2021 · AC 26 ELATHUR (LDF, rank 1): `A. K. Saseendran`
    - B: 2016 · AC 19 KALPETTA (LDF, rank 1): `C. K. Saseendran`
- **`A N RADHAKRISHNAN`** ↔ **`K RADHAKRISHNAN`** (Jaccard 1.00, shared: `RADHAKRISHNAN`)
    - A: 2011 · AC 64 MANALUR (NDA, rank 3): `A. N. Radhakrishnan`
    - A: 2011 · AC 69 KAIPAMANGALAM (NDA, rank 3): `A. N. Radhakrishnan`
    - A: 2016 · AC 64 MANALUR (NDA, rank 3): `A. N. Radhakrishnan`
    - B: 2011 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`
    - B: 2011 · AC 87 KOTHAMANGALAM (NDA, rank 3): `K. Radhakrishnan`
    - B: 2021 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`
- **`A N RADHAKRISHNAN`** ↔ **`K S RADHAKRISHNAN`** (Jaccard 1.00, shared: `RADHAKRISHNAN`)
    - A: 2011 · AC 64 MANALUR (NDA, rank 3): `A. N. Radhakrishnan`
    - A: 2011 · AC 69 KAIPAMANGALAM (NDA, rank 3): `A. N. Radhakrishnan`
    - A: 2016 · AC 64 MANALUR (NDA, rank 3): `A. N. Radhakrishnan`
    - B: 2021 · AC 81 THRIPUNITHURA (NDA, rank 3): `K. S. Radhakrishnan`
- **`A N RADHAKRISHNAN`** ↔ **`N P RADHAKRISHNAN`** (Jaccard 1.00, shared: `RADHAKRISHNAN`)
    - A: 2011 · AC 64 MANALUR (NDA, rank 3): `A. N. Radhakrishnan`
    - A: 2011 · AC 69 KAIPAMANGALAM (NDA, rank 3): `A. N. Radhakrishnan`
    - A: 2016 · AC 64 MANALUR (NDA, rank 3): `A. N. Radhakrishnan`
    - B: 2021 · AC 23 QUILANDY (NDA, rank 3): `N. P. Radhakrishnan`
- **`A N RADHAKRISHNAN`** ↔ **`T RADHAKRISHNAN`** (Jaccard 1.00, shared: `RADHAKRISHNAN`)
    - A: 2011 · AC 64 MANALUR (NDA, rank 3): `A. N. Radhakrishnan`
    - A: 2011 · AC 69 KAIPAMANGALAM (NDA, rank 3): `A. N. Radhakrishnan`
    - A: 2016 · AC 64 MANALUR (NDA, rank 3): `A. N. Radhakrishnan`
    - B: 2011 · AC 5 TRIKARIPUR (NDA, rank 3): `T. Radhakrishnan`
- **`A P ANIL KUMAR`** ↔ **`K P ANIL KUMAR`** (Jaccard 1.00, shared: `ANIL`, `KUMAR`)
    - A: 2011 · AC 36 WANDOOR (UDF, rank 1): `A. P. Anil Kumar`
    - A: 2016 · AC 36 WANDOOR (UDF, rank 1): `A. P. Anil Kumar`
    - B: 2011 · AC 23 QUILANDY (UDF, rank 2): `K.P. Anil Kumar`
- **`A SREEDHARAN`** ↔ **`C K SREEDHARAN`** (Jaccard 1.00, shared: `SREEDHARAN`)
    - A: 2021 · AC 128 ATTINGAL (UDF, rank 3): `A. Sreedharan`
    - B: 2011 · AC 3 UDMA (UDF, rank 2): `C. K. Sreedharan`
- **`A SURESH`** ↔ **`P V SURESH`** (Jaccard 1.00, shared: `SURESH`)
    - A: 2026 · AC 55 MALAMPUZHA (UDF, rank 3): `A SURESH`
    - B: 2021 · AC 4 KANHANGAD (UDF, rank 2): `P. V. Suresh`
- **`A T GEORGE`** ↔ **`P C GEORGE`** (Jaccard 1.00, shared: `GEORGE`)
    - A: 2011 · AC 137 PARASSALA (UDF, rank 1): `A. T. George`
    - A: 2016 · AC 137 PARASSALA (UDF, rank 2): `A. T. George`
    - B: 2011 · AC 101 POONJAR (UDF, rank 1): `P. C. George`
    - B: 2016 · AC 101 POONJAR (OTHER, rank 1): `P. C. George`
    - B: 2026 · AC 101 POONJAR (NDA, rank 3): `P.C. GEORGE`
- **`A VELAYUDHAN`** ↔ **`K C VELAYUDHAN`** (Jaccard 1.00, shared: `VELAYUDHAN`)
    - A: 2021 · AC 3 UDMA (NDA, rank 3): `A. Velayudhan`
    - B: 2011 · AC 35 NILAMBUR (NDA, rank 3): `K. C. Velayudhan`
- **`A VELAYUDHAN`** ↔ **`P K VELAYUDHAN`** (Jaccard 1.00, shared: `VELAYUDHAN`)
    - A: 2021 · AC 3 UDMA (NDA, rank 3): `A. Velayudhan`
    - B: 2011 · AC 16 PERAVOOR (NDA, rank 3): `P. K. Velayudhan`
- **`A VELAYUDHAN`** ↔ **`P M VELAYUDHAN`** (Jaccard 1.00, shared: `VELAYUDHAN`)
    - A: 2021 · AC 3 UDMA (NDA, rank 3): `A. Velayudhan`
    - B: 2011 · AC 90 THODUPUZHA (NDA, rank 3): `P. M. Velayudhan`
    - B: 2016 · AC 109 MAVELIKKARA (NDA, rank 3): `P. M. Velayudhan`
- **`ABDURAHIMAN`** ↔ **`V ABDURAHIMAN`** (Jaccard 1.00, shared: `ABDURAHIMAN`)
    - A: 2016 · AC 34 ERNAD (LDF, rank 2): `Abdurahiman`
    - B: 2016 · AC 44 TANUR (LDF, rank 1): `V. Abdurahiman`
    - B: 2021 · AC 44 TANUR (LDF, rank 1): `V. Abdurahiman`
    - B: 2026 · AC 45 TIRUR (LDF, rank 2): `V.ABDURAHIMAN`
- **`B B GOPAKUMAR`** ↔ **`M V GOPAKUMAR`** (Jaccard 1.00, shared: `GOPAKUMAR`)
    - A: 2016 · AC 126 CHATHANNOOR (NDA, rank 2): `B. B. Gopakumar`
    - A: 2021 · AC 126 CHATHANNOOR (NDA, rank 2): `B. B. Gopakumar`
    - A: 2026 · AC 126 CHATHANNOOR (NDA, rank 1): `B.B.GOPAKUMAR`
    - B: 2021 · AC 110 CHENGANNUR (NDA, rank 3): `M. V. Gopakumar`
    - B: 2026 · AC 110 CHENGANNUR (NDA, rank 3): `M. V .GOPAKUMAR`
- **`B B GOPAKUMAR`** ↔ **`V G GOPAKUMAR`** (Jaccard 1.00, shared: `GOPAKUMAR`)
    - A: 2016 · AC 126 CHATHANNOOR (NDA, rank 2): `B. B. Gopakumar`
    - A: 2021 · AC 126 CHATHANNOOR (NDA, rank 2): `B. B. Gopakumar`
    - A: 2026 · AC 126 CHATHANNOOR (NDA, rank 1): `B.B.GOPAKUMAR`
    - B: 2011 · AC 96 ETTUMANOOR (NDA, rank 3): `V. G. Gopakumar`
- **`B B GOPAKUMAR`** ↔ **`V GOPAKUMAR`** (Jaccard 1.00, shared: `GOPAKUMAR`)
    - A: 2016 · AC 126 CHATHANNOOR (NDA, rank 2): `B. B. Gopakumar`
    - A: 2021 · AC 126 CHATHANNOOR (NDA, rank 2): `B. B. Gopakumar`
    - A: 2026 · AC 126 CHATHANNOOR (NDA, rank 1): `B.B.GOPAKUMAR`
    - B: 2016 · AC 77 KALAMASSERY (NDA, rank 3): `V. Gopakumar`
- **`BRIJESH KUMAR`** ↔ **`K BRIJESH KUMAR`** (Jaccard 1.00, shared: `BRIJESH`, `KUMAR`)
    - A: 2021 · AC 7 KALLIASSERI (UDF, rank 2): `Brijesh Kumar`
    - B: 2011 · AC 6 PAYYANNUR (UDF, rank 2): `K. Brijesh Kumar`
- **`C DIVAKARAN`** ↔ **`K K DIVAKARAN`** (Jaccard 1.00, shared: `DIVAKARAN`)
    - A: 2011 · AC 116 KARUNAGAPPALLY (LDF, rank 1): `C. Divakaran`
    - A: 2016 · AC 130 NEDUMANGAD (LDF, rank 1): `C. Divakaran`
    - B: 2011 · AC 56 PALAKKAD (LDF, rank 2): `K. K. Divakaran`
- **`C F THOMAS`** ↔ **`P T THOMAS`** (Jaccard 1.00, shared: `THOMAS`)
    - A: 2011 · AC 99 CHANGANASSERY (UDF, rank 1): `C. F. Thomas`
    - A: 2016 · AC 99 CHANGANASSERY (UDF, rank 1): `C. F. Thomas`
    - B: 2016 · AC 83 THRIKKAKARA (UDF, rank 1): `P. T. Thomas`
    - B: 2021 · AC 83 THRIKKAKARA (UDF, rank 1): `P. T. Thomas`
- **`C G RAJAGOPAL`** ↔ **`K R RAJAGOPAL`** (Jaccard 1.00, shared: `RAJAGOPAL`)
    - A: 2011 · AC 82 ERANAKULAM (NDA, rank 3): `C. G. Rajagopal`
    - A: 2019 by-bye · AC 82 ERANAKULAM (NDA, rank 3): `C. G. Rajagopal`
    - B: 2012 by-bye · AC 85 PIRAVOM (NDA, rank 3): `K. R. Rajagopal`
- **`C G RAJAGOPAL`** ↔ **`M B RAJAGOPAL`** (Jaccard 1.00, shared: `RAJAGOPAL`)
    - A: 2011 · AC 82 ERANAKULAM (NDA, rank 3): `C. G. Rajagopal`
    - A: 2019 by-bye · AC 82 ERANAKULAM (NDA, rank 3): `C. G. Rajagopal`
    - B: 2011 · AC 99 CHANGANASSERY (NDA, rank 3): `M. B. Rajagopal`
- **`C G RAJAGOPAL`** ↔ **`O RAJAGOPAL`** (Jaccard 1.00, shared: `RAJAGOPAL`)
    - A: 2011 · AC 82 ERANAKULAM (NDA, rank 3): `C. G. Rajagopal`
    - A: 2019 by-bye · AC 82 ERANAKULAM (NDA, rank 3): `C. G. Rajagopal`
    - B: 2011 · AC 135 NEMOM (NDA, rank 2): `O. Rajagopal`
    - B: 2012 by-bye · AC 140 NEYYATTINKARA (NDA, rank 3): `O. Rajagopal`
    - B: 2015 by-bye · AC 136 ARUVIKKARA (NDA, rank 3): `O. Rajagopal`
- **`C G RAJAGOPAL`** ↔ **`S RAJAGOPAL`** (Jaccard 1.00, shared: `RAJAGOPAL`)
    - A: 2011 · AC 82 ERANAKULAM (NDA, rank 3): `C. G. Rajagopal`
    - A: 2019 by-bye · AC 82 ERANAKULAM (NDA, rank 3): `C. G. Rajagopal`
    - B: 2011 · AC 88 DEVIKULAM (NDA, rank 3): `S. Rajagopal`
- **`C KRISHNAKUMAR`** ↔ **`G KRISHNAKUMAR`** (Jaccard 1.00, shared: `KRISHNAKUMAR`)
    - A: 2016 · AC 55 MALAMPUZHA (NDA, rank 2): `C. Krishnakumar`
    - A: 2021 · AC 55 MALAMPUZHA (NDA, rank 2): `C. Krishnakumar`
    - A: 2024 by-bye · AC 56 PALAKKAD (NDA, rank 2): `C. Krishnakumar`
    - B: 2021 · AC 134 THIRUVANANTHAPURAM (NDA, rank 3): `G. Krishnakumar`
- **`C N BALAKRISHNAN`** ↔ **`I C BALAKRISHNAN`** (Jaccard 1.00, shared: `BALAKRISHNAN`)
    - A: 2011 · AC 65 WADAKKANCHERY (UDF, rank 1): `C. N. Balakrishnan`
    - B: 2011 · AC 18 SULTHANBATHERY (UDF, rank 1): `I. C. Balakrishnan`
    - B: 2016 · AC 18 SULTHANBATHERY (UDF, rank 1): `I. C. Balakrishnan`
    - B: 2021 · AC 18 SULTHANBATHERY (UDF, rank 1): `I. C. Balakrishnan`
- **`C P SANGEETHA`** ↔ **`SANGEETHA`** (Jaccard 1.00, shared: `SANGEETHA`)
    - A: 2011 · AC 12 DHARMADAM (NDA, rank 3): `C. P. Sangeetha`
    - B: 2016 · AC 73 KODUNGALLUR (NDA, rank 3): `Sangeetha`
- **`C PRAKASH`** ↔ **`V V PRAKASH`** (Jaccard 1.00, shared: `PRAKASH`)
    - A: 2016 · AC 57 TARUR (UDF, rank 2): `C. Prakash`
    - B: 2011 · AC 47 THAVANUR (UDF, rank 2): `V. V. Prakash`
    - B: 2021 · AC 35 NILAMBUR (UDF, rank 2): `V. V. Prakash`
- **`C SADANANDAN`** ↔ **`K SADANANDAN`** (Jaccard 1.00, shared: `SADANANDAN`)
    - A: 2016 · AC 14 KUTHUPARAMBA (NDA, rank 3): `C. Sadanandan Master`
    - A: 2021 · AC 14 KUTHUPARAMBA (NDA, rank 3): `C. Sadanandan Master`
    - B: 2016 · AC 19 KALPETTA (NDA, rank 3): `K. Sadanandan`
- **`E K VIJAYAN`** ↔ **`N VIJAYAN`** (Jaccard 1.00, shared: `VIJAYAN`)
    - A: 2011 · AC 22 NADAPURAM (LDF, rank 1): `E. K. Vijayan`
    - A: 2016 · AC 22 NADAPURAM (LDF, rank 1): `E. K. Vijayan`
    - A: 2021 · AC 22 NADAPURAM (LDF, rank 1): `E. K. Vijayan`
    - B: 2016 · AC 117 CHAVARA (LDF, rank 1): `N. Vijayan Pillai`
- **`E SREEDHARAN`** ↔ **`K K SREEDHARAN`** (Jaccard 1.00, shared: `SREEDHARAN`)
    - A: 2021 · AC 56 PALAKKAD (NDA, rank 2): `E. Sreedharan`
    - B: 2021 · AC 6 PAYYANNUR (NDA, rank 3): `K. K. Sreedharan`
- **`E SREEDHARAN`** ↔ **`P S SREEDHARAN`** (Jaccard 1.00, shared: `SREEDHARAN`)
    - A: 2021 · AC 56 PALAKKAD (NDA, rank 2): `E. Sreedharan`
    - B: 2016 · AC 110 CHENGANNUR (NDA, rank 3): `P. S. Sreedharan Pillai`
    - B: 2018 by-bye · AC 110 CHENGANNUR (NDA, rank 3): `P. S. Sreedharan Pillai`
- **`G HARI`** ↔ **`N HARI`** (Jaccard 1.00, shared: `HARI`)
    - A: 2011 · AC 124 KOLLAM (NDA, rank 3): `G. Hari`
    - B: 2016 · AC 93 PALA (NDA, rank 3): `N. Hari`
    - B: 2019 by-bye · AC 93 PALA (NDA, rank 3): `N. Hari`
    - B: 2021 · AC 98 PUTHUPPALLY (NDA, rank 3): `N. Hari`
- **`G RAMAN`** ↔ **`T K RAMAN`** (Jaccard 1.00, shared: `RAMAN`)
    - A: 2021 · AC 99 CHANGANASSERY (NDA, rank 3): `G. Raman Nair`
    - B: 2011 · AC 25 BALUSSERI (NDA, rank 3): `T. K. Raman`
- **`G SUDHAKARAN`** ↔ **`K SUDHAKARAN`** (Jaccard 1.00, shared: `SUDHAKARAN`)
    - A: 2011 · AC 105 AMBALAPPUZHA (LDF, rank 1): `G. Sudhakaran`
    - A: 2016 · AC 105 AMBALAPPUZHA (LDF, rank 1): `G. Sudhakaran`
    - A: 2026 · AC 105 AMBALAPPUZHA (UDF, rank 1): `G.SUDHAKARAN`
    - B: 2016 · AC 3 UDMA (UDF, rank 2): `K. Sudhakaran`
- **`I R VIJAYAN`** ↔ **`P C VIJAYAN`** (Jaccard 1.00, shared: `VIJAYAN`)
    - A: 2011 · AC 73 KODUNGALLUR (NDA, rank 3): `I. R. Vijayan`
    - B: 2021 · AC 36 WANDOOR (NDA, rank 3): `P. C. Vijayan`
- **`J JACOB`** ↔ **`M J JACOB`** (Jaccard 1.00, shared: `JACOB`)
    - A: 2021 · AC 83 THRIKKAKARA (LDF, rank 2): `J. Jacob`
    - B: 2011 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - B: 2012 by-bye · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
    - B: 2016 · AC 85 PIRAVOM (LDF, rank 2): `M. J. Jacob`
- **`J R PADMAKUMAR`** ↔ **`K PADMAKUMAR`** (Jaccard 1.00, shared: `PADMAKUMAR`)
    - A: 2011 · AC 132 KAZHAKOOTTAM (NDA, rank 3): `J. R. Padmakumar`
    - A: 2021 · AC 130 NEDUMANGAD (NDA, rank 3): `J. R. Padmakumar`
    - B: 2021 · AC 112 RANNI (NDA, rank 3): `K. Padmakumar`
- **`J R PADMAKUMAR`** ↔ **`PADMAKUMAR K`** (Jaccard 1.00, shared: `PADMAKUMAR`)
    - A: 2011 · AC 132 KAZHAKOOTTAM (NDA, rank 3): `J. R. Padmakumar`
    - A: 2021 · AC 130 NEDUMANGAD (NDA, rank 3): `J. R. Padmakumar`
    - B: 2016 · AC 112 RANNI (NDA, rank 3): `Padmakumar K.`
- **`K A UNNIKRISHNAN`** ↔ **`V UNNIKRISHNAN`** (Jaccard 1.00, shared: `UNNIKRISHNAN`)
    - A: 2021 · AC 72 CHALAKUDY (NDA, rank 3): `K. A. Unnikrishnan`
    - B: 2016 · AC 46 KOTTAKKAL (NDA, rank 3): `V. Unnikrishnan Master`
    - B: 2026 · AC 49 THRITHALA (NDA, rank 3): `V UNNIKRISHNAN MASTER`
- **`K BABU`** ↔ **`K G BABU`** (Jaccard 1.00, shared: `BABU`)
    - A: 2009 by-bye · AC 104 ALAPPUZHA (NDA, rank 3): `K. Babu`
    - A: 2011 · AC 81 THRIPUNITHURA (UDF, rank 1): `K. Babu`
    - A: 2016 · AC 59 NEMMARA (LDF, rank 1): `K. Babu`
    - B: 2016 · AC 11 KANNUR (NDA, rank 3): `K. G. Babu`
- **`K BABU`** ↔ **`P J BABU`** (Jaccard 1.00, shared: `BABU`)
    - A: 2009 by-bye · AC 104 ALAPPUZHA (NDA, rank 3): `K. Babu`
    - A: 2011 · AC 81 THRIPUNITHURA (UDF, rank 1): `K. Babu`
    - A: 2016 · AC 59 NEMMARA (LDF, rank 1): `K. Babu`
    - B: 2016 · AC 75 ANGAMALY (NDA, rank 3): `P. J. Babu`
- **`K BABU`** ↔ **`T V BABU`** (Jaccard 1.00, shared: `BABU`)
    - A: 2009 by-bye · AC 104 ALAPPUZHA (NDA, rank 3): `K. Babu`
    - A: 2011 · AC 81 THRIPUNITHURA (UDF, rank 1): `K. Babu`
    - A: 2016 · AC 59 NEMMARA (LDF, rank 1): `K. Babu`
    - B: 2016 · AC 68 NATTIKA (NDA, rank 3): `T. V. Babu`
- **`K BALAKRISHNAN`** ↔ **`P BALAKRISHNAN`** (Jaccard 1.00, shared: `BALAKRISHNAN`)
    - A: 2024 by-bye · AC 61 CHELAKKARA (NDA, rank 3): `K. Balakrishnan`
    - A: 2026 · AC 61 CHELAKKARA (NDA, rank 3): `K BALAKRISHNAN`
    - B: 2016 · AC 8 TALIPARAMBA (NDA, rank 3): `P. Balakrishnan`
- **`K C JOSEPH`** ↔ **`M P JOSEPH`** (Jaccard 1.00, shared: `JOSEPH`)
    - A: 2011 · AC 9 IRIKKUR (UDF, rank 1): `K. C. Joseph`
    - A: 2011 · AC 106 KUTTANAD (UDF, rank 2): `K. C. Joseph`
    - A: 2016 · AC 9 IRIKKUR (UDF, rank 1): `K. C. Joseph`
    - B: 2021 · AC 5 TRIKARIPUR (UDF, rank 2): `M. P. Joseph`
- **`K C JOSEPH`** ↔ **`P J JOSEPH`** (Jaccard 1.00, shared: `JOSEPH`)
    - A: 2011 · AC 9 IRIKKUR (UDF, rank 1): `K. C. Joseph`
    - A: 2011 · AC 106 KUTTANAD (UDF, rank 2): `K. C. Joseph`
    - A: 2016 · AC 9 IRIKKUR (UDF, rank 1): `K. C. Joseph`
    - B: 2011 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`
    - B: 2016 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`
    - B: 2021 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`
- **`K C KUNHIRAMAN`** ↔ **`K KUNHIRAMAN`** (Jaccard 1.00, shared: `KUNHIRAMAN`)
    - A: 2011 · AC 17 MANANTHAVADY (LDF, rank 2): `K. C. Kunhiraman`
    - B: 2011 · AC 3 UDMA (LDF, rank 1): `K. Kunhiraman`
    - B: 2011 · AC 5 TRIKARIPUR (LDF, rank 1): `K. Kunhiraman`
    - B: 2016 · AC 3 UDMA (LDF, rank 1): `K. Kunhiraman`
- **`K C RAJAGOPALAN`** ↔ **`M RAJAGOPALAN`** (Jaccard 1.00, shared: `RAJAGOPALAN`)
    - A: 2011 · AC 113 ARANMULA (LDF, rank 2): `K. C. Rajagopalan`
    - B: 2016 · AC 5 TRIKARIPUR (LDF, rank 1): `M. Rajagopalan`
- **`K C VELAYUDHAN`** ↔ **`P K VELAYUDHAN`** (Jaccard 1.00, shared: `VELAYUDHAN`)
    - A: 2011 · AC 35 NILAMBUR (NDA, rank 3): `K. C. Velayudhan`
    - B: 2011 · AC 16 PERAVOOR (NDA, rank 3): `P. K. Velayudhan`
- **`K C VELAYUDHAN`** ↔ **`P M VELAYUDHAN`** (Jaccard 1.00, shared: `VELAYUDHAN`)
    - A: 2011 · AC 35 NILAMBUR (NDA, rank 3): `K. C. Velayudhan`
    - B: 2011 · AC 90 THODUPUZHA (NDA, rank 3): `P. M. Velayudhan`
    - B: 2016 · AC 109 MAVELIKKARA (NDA, rank 3): `P. M. Velayudhan`
- **`K C VENU`** ↔ **`VENU`** (Jaccard 1.00, shared: `VENU`)
    - A: 2011 · AC 70 IRINJALAKUDA (NDA, rank 3): `K. C. Venu`
    - B: 2026 · AC 131 VAMANAPURAM (NDA, rank 3): `VENU`
- **`K CHANDRAN`** ↔ **`M CHANDRAN`** (Jaccard 1.00, shared: `CHANDRAN`)
    - A: 2011 · AC 77 KALAMASSERY (LDF, rank 2): `K. Chandran Pillai`
    - B: 2011 · AC 60 ALATHUR (LDF, rank 1): `M. Chandran`
- **`K G BABU`** ↔ **`P J BABU`** (Jaccard 1.00, shared: `BABU`)
    - A: 2016 · AC 11 KANNUR (NDA, rank 3): `K. G. Babu`
    - B: 2016 · AC 75 ANGAMALY (NDA, rank 3): `P. J. Babu`
- **`K G BABU`** ↔ **`T V BABU`** (Jaccard 1.00, shared: `BABU`)
    - A: 2016 · AC 11 KANNUR (NDA, rank 3): `K. G. Babu`
    - B: 2016 · AC 68 NATTIKA (NDA, rank 3): `T. V. Babu`
- **`K HARIDAS`** ↔ **`K M HARIDAS`** (Jaccard 1.00, shared: `HARIDAS`)
    - A: 2011 · AC 113 ARANMULA (NDA, rank 3): `K. Haridas`
    - B: 2021 · AC 50 PATTAMBI (NDA, rank 3): `K. M. Haridas`
- **`K HARIDAS`** ↔ **`N HARIDAS`** (Jaccard 1.00, shared: `HARIDAS`)
    - A: 2011 · AC 113 ARANMULA (NDA, rank 3): `K. Haridas`
    - B: 2026 · AC 8 TALIPARAMBA (NDA, rank 3): `N HARIDAS`
- **`K JAYAPRAKASH`** ↔ **`V T JAYAPRAKASH`** (Jaccard 1.00, shared: `JAYAPRAKASH`)
    - A: 2011 · AC 8 TALIPARAMBA (NDA, rank 3): `K. Jayaprakash`
    - B: 2011 · AC 48 PONNANI (NDA, rank 3): `V. T. Jayaprakash`
- **`K K RAMACHANDRAN`** ↔ **`P RAMACHANDRAN`** (Jaccard 1.00, shared: `RAMACHANDRAN`)
    - A: 2016 · AC 110 CHENGANNUR (LDF, rank 1): `K. K. Ramachandran Nair`
    - A: 2021 · AC 71 PUDUKKAD (LDF, rank 1): `K. K. Ramachandran`
    - A: 2026 · AC 71 PUDUKKAD (LDF, rank 1): `K K RAMACHANDRAN`
    - B: 2011 · AC 130 NEDUMANGAD (LDF, rank 2): `P. Ramachandran Nair`
- **`K K RAMACHANDRAN`** ↔ **`R RAMACHANDRAN`** (Jaccard 1.00, shared: `RAMACHANDRAN`)
    - A: 2016 · AC 110 CHENGANNUR (LDF, rank 1): `K. K. Ramachandran Nair`
    - A: 2021 · AC 71 PUDUKKAD (LDF, rank 1): `K. K. Ramachandran`
    - A: 2026 · AC 71 PUDUKKAD (LDF, rank 1): `K K RAMACHANDRAN`
    - B: 2016 · AC 116 KARUNAGAPPALLY (LDF, rank 1): `R. Ramachandran`
    - B: 2021 · AC 116 KARUNAGAPPALLY (LDF, rank 2): `R. Ramachandran`
- **`K K SREEDHARAN`** ↔ **`P S SREEDHARAN`** (Jaccard 1.00, shared: `SREEDHARAN`)
    - A: 2021 · AC 6 PAYYANNUR (NDA, rank 3): `K. K. Sreedharan`
    - B: 2016 · AC 110 CHENGANNUR (NDA, rank 3): `P. S. Sreedharan Pillai`
    - B: 2018 by-bye · AC 110 CHENGANNUR (NDA, rank 3): `P. S. Sreedharan Pillai`
- **`K K SURENDRAN`** ↔ **`K SURENDRAN`** (Jaccard 1.00, shared: `SURENDRAN`)
    - A: 2011 · AC 46 KOTTAKKAL (NDA, rank 3): `K. K. Surendran`
    - A: 2016 · AC 48 PONNANI (NDA, rank 3): `K. K. Surendran`
    - B: 2011 · AC 1 MANJESHWAR (NDA, rank 2): `K. Surendran`
    - B: 2016 · AC 1 MANJESHWAR (NDA, rank 2): `K. Surendran`
    - B: 2019 by-bye · AC 114 KONNI (NDA, rank 3): `K. Surendran`
- **`K K SURENDRAN`** ↔ **`T G SURENDRAN`** (Jaccard 1.00, shared: `SURENDRAN`)
    - A: 2011 · AC 46 KOTTAKKAL (NDA, rank 3): `K. K. Surendran`
    - A: 2016 · AC 48 PONNANI (NDA, rank 3): `K. K. Surendran`
    - B: 2011 · AC 79 VYPEN (NDA, rank 3): `T. G. Surendran`
- **`K M HARIDAS`** ↔ **`N HARIDAS`** (Jaccard 1.00, shared: `HARIDAS`)
    - A: 2021 · AC 50 PATTAMBI (NDA, rank 3): `K. M. Haridas`
    - B: 2026 · AC 8 TALIPARAMBA (NDA, rank 3): `N HARIDAS`
- **`K M RADHAKRISHNAN`** ↔ **`K RADHAKRISHNAN`** (Jaccard 1.00, shared: `RADHAKRISHNAN`)
    - A: 2026 · AC 98 PUTHUPPALLY (LDF, rank 2): `K. M. RADHAKRISHNAN`
    - B: 2011 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`
    - B: 2011 · AC 87 KOTHAMANGALAM (NDA, rank 3): `K. Radhakrishnan`
    - B: 2021 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`
- **`K M SHAJI`** ↔ **`T P SHAJI`** (Jaccard 1.00, shared: `SHAJI`)
    - A: 2011 · AC 10 AZHIKODE (UDF, rank 1): `K. M. Shaji`
    - A: 2016 · AC 10 AZHIKODE (UDF, rank 1): `K. M. Shaji`
    - A: 2021 · AC 10 AZHIKODE (UDF, rank 2): `K. M. Shaji`
    - B: 2026 · AC 50 PATTAMBI (UDF, rank 2): `T. P. SHAJI`
- **`K M UNNIKRISHNAN`** ↔ **`K N UNNIKRISHNAN`** (Jaccard 1.00, shared: `UNNIKRISHNAN`)
    - A: 2021 · AC 79 VYPEN (LDF, rank 1): `K. M. Unnikrishnan`
    - B: 2026 · AC 81 THRIPUNITHURA (LDF, rank 2): `K N UNNIKRISHNAN`
- **`K MOHANDAS`** ↔ **`N K MOHANDAS`** (Jaccard 1.00, shared: `MOHANDAS`)
    - A: 2016 · AC 17 MANANTHAVADY (NDA, rank 3): `K. Mohandas`
    - A: 2016 · AC 37 MANJERI (LDF, rank 2): `K. Mohandas`
    - B: 2016 · AC 82 ERANAKULAM (NDA, rank 3): `N. K. Mohandas`
- **`K NARAYANAN`** ↔ **`NARAYANAN`** (Jaccard 1.00, shared: `NARAYANAN`)
    - A: 2021 · AC 44 TANUR (NDA, rank 3): `K. Narayanan Master`
    - A: 2026 · AC 45 TIRUR (NDA, rank 3): `K.NARAYANAN MASTER`
    - B: 2011 · AC 97 KOTTAYAM (NDA, rank 3): `Narayanan Namboothiri`
- **`K P MOHANAN`** ↔ **`T O MOHANAN`** (Jaccard 1.00, shared: `MOHANAN`)
    - A: 2011 · AC 14 KUTHUPARAMBA (UDF, rank 1): `K. P. Mohanan`
    - A: 2016 · AC 14 KUTHUPARAMBA (UDF, rank 2): `K. P. Mohanan`
    - A: 2021 · AC 14 KUTHUPARAMBA (LDF, rank 1): `K. P. Mohanan`
    - B: 2026 · AC 11 KANNUR (UDF, rank 1): `ADV.T.O. MOHANAN`
- **`K P PRAKASH BABU`** ↔ **`PRAKASH BABU`** (Jaccard 1.00, shared: `PRAKASH`, `BABU`)
    - A: 2011 · AC 22 NADAPURAM (NDA, rank 3): `K. P. Prakash Babu`
    - A: 2019 by-bye · AC 102 AROOR (NDA, rank 3): `K. P. Prakash Babu`
    - B: 2016 · AC 29 BEYPORE (NDA, rank 3): `Prakash Babu`
    - B: 2021 · AC 29 BEYPORE (NDA, rank 3): `Prakash Babu`
- **`K R RAJAGOPAL`** ↔ **`M B RAJAGOPAL`** (Jaccard 1.00, shared: `RAJAGOPAL`)
    - A: 2012 by-bye · AC 85 PIRAVOM (NDA, rank 3): `K. R. Rajagopal`
    - B: 2011 · AC 99 CHANGANASSERY (NDA, rank 3): `M. B. Rajagopal`
- **`K R RAJAGOPAL`** ↔ **`O RAJAGOPAL`** (Jaccard 1.00, shared: `RAJAGOPAL`)
    - A: 2012 by-bye · AC 85 PIRAVOM (NDA, rank 3): `K. R. Rajagopal`
    - B: 2011 · AC 135 NEMOM (NDA, rank 2): `O. Rajagopal`
    - B: 2012 by-bye · AC 140 NEYYATTINKARA (NDA, rank 3): `O. Rajagopal`
    - B: 2015 by-bye · AC 136 ARUVIKKARA (NDA, rank 3): `O. Rajagopal`
- **`K R RAJAGOPAL`** ↔ **`S RAJAGOPAL`** (Jaccard 1.00, shared: `RAJAGOPAL`)
    - A: 2012 by-bye · AC 85 PIRAVOM (NDA, rank 3): `K. R. Rajagopal`
    - B: 2011 · AC 88 DEVIKULAM (NDA, rank 3): `S. Rajagopal`
- **`K R RAJESH`** ↔ **`V V RAJESH`** (Jaccard 1.00, shared: `RAJESH`)
    - A: 2026 · AC 117 CHAVARA (NDA, rank 3): `K.R.RAJESH`
    - B: 2011 · AC 133 VATTIYOORKAVU (NDA, rank 3): `V. V. Rajesh`
    - B: 2016 · AC 130 NEDUMANGAD (NDA, rank 3): `V. V. Rajesh`
    - B: 2021 · AC 133 VATTIYOORKAVU (NDA, rank 2): `V. V. Rajesh`
- **`K RADHAKRISHNAN`** ↔ **`K S RADHAKRISHNAN`** (Jaccard 1.00, shared: `RADHAKRISHNAN`)
    - A: 2011 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`
    - A: 2011 · AC 87 KOTHAMANGALAM (NDA, rank 3): `K. Radhakrishnan`
    - A: 2021 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`
    - B: 2021 · AC 81 THRIPUNITHURA (NDA, rank 3): `K. S. Radhakrishnan`
- **`K RADHAKRISHNAN`** ↔ **`N P RADHAKRISHNAN`** (Jaccard 1.00, shared: `RADHAKRISHNAN`)
    - A: 2011 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`
    - A: 2011 · AC 87 KOTHAMANGALAM (NDA, rank 3): `K. Radhakrishnan`
    - A: 2021 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`
    - B: 2021 · AC 23 QUILANDY (NDA, rank 3): `N. P. Radhakrishnan`
- **`K RADHAKRISHNAN`** ↔ **`T RADHAKRISHNAN`** (Jaccard 1.00, shared: `RADHAKRISHNAN`)
    - A: 2011 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`
    - A: 2011 · AC 87 KOTHAMANGALAM (NDA, rank 3): `K. Radhakrishnan`
    - A: 2021 · AC 61 CHELAKKARA (LDF, rank 1): `K. Radhakrishnan`
    - B: 2011 · AC 5 TRIKARIPUR (NDA, rank 3): `T. Radhakrishnan`
- **`K S RADHAKRISHNAN`** ↔ **`N P RADHAKRISHNAN`** (Jaccard 1.00, shared: `RADHAKRISHNAN`)
    - A: 2021 · AC 81 THRIPUNITHURA (NDA, rank 3): `K. S. Radhakrishnan`
    - B: 2021 · AC 23 QUILANDY (NDA, rank 3): `N. P. Radhakrishnan`
- **`K S RADHAKRISHNAN`** ↔ **`T RADHAKRISHNAN`** (Jaccard 1.00, shared: `RADHAKRISHNAN`)
    - A: 2021 · AC 81 THRIPUNITHURA (NDA, rank 3): `K. S. Radhakrishnan`
    - B: 2011 · AC 5 TRIKARIPUR (NDA, rank 3): `T. Radhakrishnan`
- **`K SASIKUMAR`** ↔ **`SASIKUMAR M`** (Jaccard 1.00, shared: `SASIKUMAR`)
    - A: 2016 · AC 124 KOLLAM (NDA, rank 3): `K. Sasikumar`
    - B: 2016 · AC 58 CHITTUR (NDA, rank 3): `Sasikumar M.`
- **`K SURENDRAN`** ↔ **`T G SURENDRAN`** (Jaccard 1.00, shared: `SURENDRAN`)
    - A: 2011 · AC 1 MANJESHWAR (NDA, rank 2): `K. Surendran`
    - A: 2016 · AC 1 MANJESHWAR (NDA, rank 2): `K. Surendran`
    - A: 2019 by-bye · AC 114 KONNI (NDA, rank 3): `K. Surendran`
    - B: 2011 · AC 79 VYPEN (NDA, rank 3): `T. G. Surendran`
- **`K V GANGADHARAN`** ↔ **`P V GANGADHARAN`** (Jaccard 1.00, shared: `GANGADHARAN`)
    - A: 2011 · AC 5 TRIKARIPUR (UDF, rank 2): `K. V. Gangadharan`
    - B: 2011 · AC 27 KOZHIKODE NORTH (UDF, rank 2): `P. V. Gangadharan`
- **`K V SUDHEER`** ↔ **`P SUDHEER`** (Jaccard 1.00, shared: `SUDHEER`)
    - A: 2021 · AC 24 PERAMBRA (NDA, rank 3): `K. V. Sudheer`
    - B: 2016 · AC 115 ADOOR (NDA, rank 3): `P. Sudheer`
    - B: 2021 · AC 128 ATTINGAL (NDA, rank 2): `P. Sudheer`
    - B: 2026 · AC 128 ATTINGAL (NDA, rank 2): `ADV. P SUDHEER`
- **`L P JAYACHANDRAN`** ↔ **`T P JAYACHANDRAN`** (Jaccard 1.00, shared: `JAYACHANDRAN`)
    - A: 2016 · AC 105 AMBALAPPUZHA (NDA, rank 3): `L. P. Jayachandran`
    - B: 2011 · AC 23 QUILANDY (NDA, rank 3): `T. P. Jayachandran`
    - B: 2021 · AC 26 ELATHUR (NDA, rank 3): `T. P. Jayachandran Master`
- **`M A SURENDRAN`** ↔ **`V SURENDRAN`** (Jaccard 1.00, shared: `SURENDRAN`)
    - A: 2011 · AC 84 KUNNATHUNAD (LDF, rank 2): `M. A. Surendran`
    - B: 2011 · AC 134 THIRUVANANTHAPURAM (LDF, rank 2): `V. Surendran Pillai`
    - B: 2016 · AC 135 NEMOM (UDF, rank 3): `V. Surendran Pillai`
- **`M ANIL KUMAR`** ↔ **`P K ANIL KUMAR`** (Jaccard 1.00, shared: `ANIL`, `KUMAR`)
    - A: 2016 · AC 82 ERANAKULAM (LDF, rank 2): `M. Anil Kumar`
    - B: 2026 · AC 19 KALPETTA (LDF, rank 2): `P K ANIL KUMAR`
- **`M B RAJAGOPAL`** ↔ **`O RAJAGOPAL`** (Jaccard 1.00, shared: `RAJAGOPAL`)
    - A: 2011 · AC 99 CHANGANASSERY (NDA, rank 3): `M. B. Rajagopal`
    - B: 2011 · AC 135 NEMOM (NDA, rank 2): `O. Rajagopal`
    - B: 2012 by-bye · AC 140 NEYYATTINKARA (NDA, rank 3): `O. Rajagopal`
    - B: 2015 by-bye · AC 136 ARUVIKKARA (NDA, rank 3): `O. Rajagopal`
- **`M B RAJAGOPAL`** ↔ **`S RAJAGOPAL`** (Jaccard 1.00, shared: `RAJAGOPAL`)
    - A: 2011 · AC 99 CHANGANASSERY (NDA, rank 3): `M. B. Rajagopal`
    - B: 2011 · AC 88 DEVIKULAM (NDA, rank 3): `S. Rajagopal`
- **`M B RAJESH`** ↔ **`R RAJESH`** (Jaccard 1.00, shared: `RAJESH`)
    - A: 2021 · AC 49 THRITHALA (LDF, rank 1): `M. B. Rajesh`
    - A: 2026 · AC 49 THRITHALA (LDF, rank 2): `M B RAJESH`
    - B: 2011 · AC 109 MAVELIKKARA (LDF, rank 1): `R. Rajesh`
    - B: 2016 · AC 109 MAVELIKKARA (LDF, rank 1): `R. Rajesh`
- **`M B RAJESH`** ↔ **`T V RAJESH`** (Jaccard 1.00, shared: `RAJESH`)
    - A: 2021 · AC 49 THRITHALA (LDF, rank 1): `M. B. Rajesh`
    - A: 2026 · AC 49 THRITHALA (LDF, rank 2): `M B RAJESH`
    - B: 2011 · AC 7 KALLIASSERI (LDF, rank 1): `T. V. Rajesh`
    - B: 2016 · AC 7 KALLIASSERI (LDF, rank 1): `T. V. Rajesh`
- **`M K SUNIL`** ↔ **`M SUNIL`** (Jaccard 1.00, shared: `SUNIL`)
    - A: 2016 · AC 38 PERINTHALMANNA (NDA, rank 3): `M. K. Sunil`
    - B: 2016 · AC 117 CHAVARA (NDA, rank 3): `M. Sunil`
    - B: 2021 · AC 124 KOLLAM (NDA, rank 3): `M. Sunil`
- **`M MURALI`** ↔ **`N M MURALI`** (Jaccard 1.00, shared: `MURALI`)
    - A: 2011 · AC 108 KAYAMKULAM (UDF, rank 2): `M. Murali`
    - A: 2021 · AC 110 CHENGANNUR (UDF, rank 2): `M. Murali`
    - B: 2011 · AC 119 KOTTARAKKARA (UDF, rank 2): `N. M. Murali`
- **`M P JOSEPH`** ↔ **`P J JOSEPH`** (Jaccard 1.00, shared: `JOSEPH`)
    - A: 2021 · AC 5 TRIKARIPUR (UDF, rank 2): `M. P. Joseph`
    - B: 2011 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`
    - B: 2016 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`
    - B: 2021 · AC 90 THODUPUZHA (UDF, rank 1): `P. J. Joseph`
- **`M P RAJAN`** ↔ **`V V RAJAN`** (Jaccard 1.00, shared: `RAJAN`)
    - A: 2016 · AC 22 NADAPURAM (NDA, rank 3): `M. P. Rajan`
    - A: 2021 · AC 22 NADAPURAM (NDA, rank 3): `M. P. Rajan`
    - B: 2011 · AC 26 ELATHUR (NDA, rank 3): `V. V. Rajan`
    - B: 2016 · AC 26 ELATHUR (NDA, rank 3): `V. V. Rajan`
- **`M P VINCENT`** ↔ **`M VINCENT`** (Jaccard 1.00, shared: `VINCENT`)
    - A: 2011 · AC 66 OLLUR (UDF, rank 1): `M. P. Vincent`
    - A: 2016 · AC 66 OLLUR (UDF, rank 2): `M. P. Vincent`
    - B: 2016 · AC 139 KOVALAM (UDF, rank 1): `M. Vincent`
    - B: 2021 · AC 139 KOVALAM (UDF, rank 1): `M. Vincent`
    - B: 2026 · AC 139 KOVALAM (UDF, rank 1): `ADV. M.VINCENT`
- _… 28 more in `data/candidate-continuity.json`._
