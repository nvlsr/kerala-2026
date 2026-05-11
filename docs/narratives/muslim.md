# Muslim — findings reference

**Audience**: future analysis (agent + author). **Muslim walkthrough page not yet built** — this file is the planning + analysis reference for when it lands. Page name will be `/walkthroughs/muslim-walkthrough` (`src/pages/walkthroughs-muslim-page.tsx` + `src/pages/walkthroughs-muslim-data.ts`).

**Sources consolidated**: `muslim-walkthrough-draft.md` (early Sprint 2 era) + `muslim-belt-deep-dive.md` (pre-OSM UDF strategy analysis) (both deleted on consolidation).

---

## TL;DR

Findings tagged `[Sprint 2]` predate the per-AC community-relevance framework. Findings tagged `[CR]` are surfaced by community-relevance (see `docs/community-relevance.md`). `[Joint]` = both views agree; `[NEW]` = community-relevance reveals something the cohort analysis didn't surface.

- `[Sprint 2]` **Kerala Muslims don't vote as one bloc — Mujahid-dominant ACs swung harder toward UDF in 2026 than Sunni-dominant ACs** (+8.7 vs +6.5pp), and were more bipartisan (36% LDF retention vs 15%).
- `[Sprint 2]` **Muslim-belt UDF premium has been ~+11pp since 2011** — large and stable. 2026 grew modestly to +12.8pp. **Wave-sized swing on stable high baseline** (ΔUDF at ≥70% Muslim ACs was +8.77pp, barely above statewide +7pp).
- `[Sprint 2]` **Opposite shape from Christian-belt**: Christian premium ~+3pp historically and **doubled** to +6.4pp in 2026; Muslim premium ~+11pp historically and **grew modestly** to +12.8pp.
- `[Sprint 2]` **UDF's strategy menu in Muslim Malappuram is structurally narrower than in Christian belt**: IUML alliance OR INC-Muslim. INC-Hindu was NEVER on the menu at non-reserved Muslim-majority seats. (Compare: Christian-belt UDF freely mixed INC-Hindu and INC-Christian.)
- `[Sprint 2]` **Variance-explained R² heavily favours religion-share over sub-sect cohort for Muslim level** (Muslim % R² 0.237 vs cohort R² 0.014). Sub-sect distinction is mostly noise once you control for Muslim %.
- `[Sprint 2]` **The empty INC-Hindu bucket in Muslim Malappuram is itself a structural finding** — UDF was not willing to put a Hindu candidate in front of Muslim voters at non-reserved seats.
- `[NEW · CR]` **The "Kozhikode/Kannur Muslim flip" was structural restoration, not a new swing.** 13 ACs flipped LDF→UDF; 12 of 13 are `stableFor: UDF` (Muslim ≥40% mechanically blocks NDA + Muslim-via-IUML blocks LDF). The 2021 LDF wins were anomalies; 2026 is a return to structural equilibrium.
- `[NEW · CR]` **No Muslim hereditary seats.** 0 of the 6 documented hereditary successions are Muslim. By contrast, 5 of 6 are Christian-belt UDF. Muslim politics is candidate-of-the-cycle, not dynasty-driven — a stark contrast to Christian-belt Kerala.
- `[NEW · CR]` **BJP is building Hindu vote share inside Muslim-blocked seats.** 11 Muslim-presence ACs have rising NDA share while structurally locked away from NDA — including Kozhikode N + S (Muslim 41 %, NDA 17→21→25 % and 23→23→28 %). The structural lock holds; the trajectory under it shifts.
- `[Joint]` **Standing political assumption**: IUML's Sunni-establishment relationship is firmer than its Mujahid-faction relationship. Cohort analysis and community-relevance both consistent with this — Sunni cohort 77 % stableFor:UDF vs Mujahid 64 %, and Sunni durability skews more to always-UDF.

---

## §1 — Muslim Kerala demographics

- Muslims ~28-29% of Kerala's population in 2025 projection.
- Geographic concentration: **Malappuram district** (Muslim-majority, ~70% Muslim across most ACs) is the heartland. Significant Muslim populations also in Kasaragod, Kannur, Kozhikode interior, and pockets in central Kerala (Ernakulam Mattancherry, Aluva).
- Major sub-sect distinctions (Kerala-specific):
  - **Sunni** (mainstream) — within this, two main factions: **EK Sunni** (Kanthapuram-AP-Aboobacker Musliyar group) and **AP Sunni** (Samastha Kerala Jamiyathul Ulama / SKSSF, the larger/older establishment). Both broadly aligned with IUML, though not perfectly.
  - **Mujahid** (Salafi-influenced, also called KNM — Kerala Nadvathul Mujahideen) — distinct from mainstream Sunni; closer to KNM-affiliated organisations.
  - **Jamaat-e-Islami** — separate ideological grouping; political wing is Welfare Party of India (WPI), which contested some seats in 2021.

OSM POI-based cohort layer (locked in `subrite-bins.ts`):

| Cohort | n |
|---|---:|
| Sunni | 48 |
| Salafi / Mujahid | 14 |
| No consequential Muslim sub-rite | 78 |
| **Total** | **140** |

Notable: Ahmadiyya cohort that appeared in pre-N≥3-gate visualisation fell out (all three Ahmadiyya-dominant ACs had ≤2 classified Muslim POIs).

---

## §2 — Muslim-belt premium history (pre-OSM)

Comparing UDF performance in rest-of-state vs ACs with ≥70% Muslim share (n=11):

| Year | UDF ≥70% Muslim | UDF statewide | Premium |
|---|---|---|---|
| 2011 | 57.0% | 46.2% | +10.8pp |
| 2016 | 50.0% | 39.3% | +10.7pp |
| 2021 | 50.6% | 39.3% | +11.3pp |
| **2026** | **59.4%** | **46.6%** | **+12.8pp** |

- Muslim premium ~+11pp since 2011 — much larger than Christian premium (~+3pp).
- In 2026 grew modestly to +12.8pp.
- **Wave-sized swing**: ΔUDF at ≥70% Muslim ACs was +8.77pp — barely above statewide +7pp.

**Opposite shape from Christian story**: stable historic premium continuing, vs Christian's smaller historic premium that doubled.

### AC-level (Sprint 2 data): Muslim share doesn't predict UDF swing

|  | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|
| Muslim share (AC-level) | r = **−0.01** | r = +0.04 | r = −0.09 |

### Bin means by Muslim share

| Bin | n | UDF Δ | LDF Δ | NDA Δ |
|---|---|---|---|---|
| Muslim-majority (≥60%) | 16 | +9.0 | −8.3 | +0.4 |
| Muslim-heavy (40–60%) | 23 | +5.8 | −6.8 | +2.2 |
| Muslim-mid (20–40%) | 44 | +7.8 | −7.4 | +2.0 |
| Low Muslim (<20%) | 57 | +7.0 | −7.5 | +2.5 |

No monotonic relationship. Muslim-heavy 40-60% bin gained UDF *less* than low-Muslim. Muslim-majority gained +9pp — above the statewide trend but not dramatically.

**Under district FE**: Muslim × UDF Δ collapses (β=+0.016, p=0.795). The simple-Pearson signal was driven by between-district variation (Malappuram clustering). Within a given district, Muslim share has no detectable predictive power for UDF Δ.

This is consistent with: ceiling effects in already-pro-UDF Muslim areas, IUML's strong incumbency flattening swing variation, or turnout effects rather than switching. **The data shows the *gradient* isn't there; doesn't tell us which mechanism explains its absence.**

---

## §3 — Sub-sect cohort × UDF performance (Sprint 2)

From `scripts/analysis/analyze-subrite-cohorts.ts`:

| Cohort | n | UDF 2026 | UDF 2021 | Δ UDF | LDF 2026 | LDF 2021 | Δ LDF | Wins (U/L/N) |
|---|---:|---:|---:|---:|---:|---:|---:|:---:|
| Sunni | 48 | 49.2 | 42.7 | +6.5 | 36.5 | 43.6 | −7.1 | 40/7/1 |
| **Salafi/Mujahid** | **14** | **46.5** | **37.8** | **+8.7** | 36.5 | 44.0 | −7.5 | **9/5/0** |
| Below-threshold residual | 78 | 45.0 | 37.5 | +7.5 | 38.9 | 46.5 | −7.6 | 53/23/2 |

### Two findings

1. **Mujahid swung HARDER than Sunni** (+8.7 vs +6.5pp). Contradicts the standing assumption that "IUML's Mujahid relationship is weaker, so Mujahid is less reliably UDF". Mujahid actually moved harder. BUT — Mujahid's UDF baseline was lower (37.8 vs 42.7 in 2021), so the swing magnitude reflects regression toward the Muslim-bloc mean.

2. **Mujahid is more bipartisan**: LDF retention rate 5/14 = **36%** vs Sunni's 7/48 = **15%**. **Mujahid ACs are structurally more competitive between alliances than Sunni ACs.** Even with the bigger UDF swing, Mujahid didn't sweep.

### Outliers (where cohort doesn't predict winner)

**Sunni cohort outliers (8 of 48; modal winner UDF)**:
- KANHANGAD (#4) — LDF: UDF 37 / LDF 45.7 / NDA 15.5 / ΔUDF +2.5
- KALLIASSERI (#7) — LDF: UDF 39.6 / LDF 51.2 / NDA 8.2 / ΔUDF +9.5
- AZHIKODE (#10) — LDF: UDF 43.7 / LDF 43.9 / NDA 11.8 / ΔUDF +2.5
- THALASSERY (#13) — LDF: UDF 34.3 / LDF 48.6 / NDA 15.8 / ΔUDF +0.4
- SHORNUR (#51) — LDF: UDF 34 / LDF 44.3 / NDA 20.9 / ΔUDF +9.1
- GURUVAYOOR (#63) — LDF: UDF 39.7 / LDF 40.9 / NDA 17.9 / ΔUDF −0.4
- KAIPAMANGALAM (#69) — LDF: UDF 39 / LDF 46 / NDA 13.8 / ΔUDF +2.0
- NEMOM (#135) — NDA: UDF 21.3 / LDF 37.4 / NDA 40.9 / ΔUDF −3.7

**Salafi/Mujahid cohort outliers (5 of 14; modal winner UDF)**:
- PATTAMBI (#50) — LDF: UDF 41.8 / LDF 47.4 / NDA 9.0 / ΔUDF +4.1
- MALAMPUZHA (#55) — LDF: UDF 26.3 / LDF 42.7 / NDA 30.4 / ΔUDF +4.6
- KUNNAMKULAM (#62) — LDF: UDF 42.6 / LDF 45.6 / NDA 11.2 / ΔUDF +11.0
- NATTIKA (#68) — LDF: UDF 33.2 / LDF 37.8 / NDA 29 / ΔUDF +4.3
- ATTINGAL (#128) — LDF: UDF 27.8 / LDF 39.8 / NDA 30.8 / ΔUDF +2.8

### Variance-explained

For 2026 UDF among Muslim-cohort-labelled ACs (n=62):

| Predictor | R² |
|---|---:|
| Muslim sub-rite cohort (one-way ANOVA) | **0.014** |
| Muslim % of population (linear) | **0.237** |

Religion-share crushes cohort. **Muslim sub-sect distinction is mostly noise** for predicting UDF level once you control for Muslim %.

NOT yet computed: cohort R² for Δ UDF (swing) — if cohort R² ≈ share R² for swing, sub-sect identity matters for swing direction even though it doesn't matter for level. Worth running.

---

## §4 — UDF strategy in Malappuram non-reserved (pre-OSM, 15 ACs)

Universe: Malappuram district minus Wandoor (SC reserved) and minus 3 Wayanad ST ACs.

> **Excluded from universe**:
> - Wayanad's 3 ACs (Mananthavady ST, Sulthanbathery ST, Kalpetta) — Wayanad is mixed-demographic, not Muslim-belt.
> - Wandoor (SC reserved) — reservation forces an SC candidate.

**UDF won 15 of 15.**

### UDF's strategy menu

| Strategy | n | Won | Mean ΔUDF |
|---|---:|---:|---:|
| **Muslim Alliance (IUML)** | 12 | 12 | **+8.8pp** |
| **INC-Muslim** | 2 | 2 | **+12.9pp** |
| **INC-Hindu** | **0** | — | — |
| Special (INC-Christian: Thavanur) | 1 | 1 | +4.1pp |
| **Total** | **15** | **15** | |

Statewide ΔUDF reference ~+7pp. **INC-direct outperformed alliance route** — INC-Muslim picked up ~4pp more swing than IUML did, parallel to the Christian-belt finding.

### The empty INC-Hindu bucket — structural finding

In Christian-belt seats, UDF freely mixed candidate religions inside INC. Hindu INC and Christian INC both contested ≥40%-Christian seats and both swung +10–11pp. **UDF was happy to put a Hindu candidate in front of Christian voters.**

In Malappuram non-reserved, **UDF was NOT willing to put a Hindu in front of Muslim voters**. The choice was always Muslim — either via IUML alliance or INC-Muslim.

The Thavanur exception (INC-Christian, ΔUDF +4.1, below wave) is consistent with the rule: when INC tried a non-Muslim candidate at a 67%-Muslim seat, swing was well below baseline.

### The 15 ACs (Malappuram non-reserved)

Sorted by Muslim share descending.

| Name | H/C/M | Candidate (party) | UDF Δ | Strategy |
|---|---|---|---|---|
| Vengara | 14/0/85 | K.M. Shaji (Muslim) — IUML | +3.2 | Muslim Alliance |
| Tirurangadi | 18/0/82 | P.M.A. Sameer (Muslim) — IUML | +14.1 | Muslim Alliance |
| Tanur | 18/0/82 | P.K. Navas (Muslim) — IUML | +7.9 | Muslim Alliance |
| Tirur | 21/1/78 | Kurukkoli Moideen (Muslim) — IUML | +5.4 | Muslim Alliance |
| Ernad | 22/1/77 | P.K. Basheer (Muslim) — IUML | +4.3 | Muslim Alliance |
| Kottakkal | 25/0/75 | Prof. Abid Hussain Thangal (Muslim) — IUML | +11.1 | Muslim Alliance |
| Mankada | 24/2/75 | Manjalamkuzhi Ali (Muslim) — IUML | +9.9 | Muslim Alliance |
| Manjeri | 24/1/75 | Adv. M. Rahmathulla (Muslim) — IUML | +10.6 | Muslim Alliance |
| Malappuram | 24/1/75 | P.K. Kunhalikutty (Muslim) — IUML | +9.8 | Muslim Alliance |
| Kondotty | 27/1/72 | T.P. Ashrafali (Muslim) — IUML | +9.9 | Muslim Alliance |
| Perinthalmanna | 27/2/71 | Najeeb Kanthapuram (Muslim) — IUML | +10.4 | Muslim Alliance |
| Vallikunnu | 30/1/69 | T.V. Ibrahim (Muslim) — IUML | +8.6 | Muslim Alliance |
| Thavanur | 33/0/67 | Adv. V.S. Joy (Christian) — INC | +4.1 | Special (INC-Christian) |
| Ponnani | 33/0/67 | K.P. Noushad Ali (Muslim) — INC | +10.4 | INC-Muslim |
| Nilambur | 31/8/61 | Aryadan Shoukath (Muslim) — INC | +15.4 | INC-Muslim |

### Caveats

- **Small sample for INC-Muslim (n=2)**. Both Ponnani and Nilambur swung above +10pp, but two seats can't bear too much weight.
- **Vengara is the only Muslim-majority AC where LDF gained** (+8.51pp). 85% Muslim; was already structurally an LDF holdout via local IUML-faction dynamics (P. Abdul Hameed faction). UDF candidate K.M. Shaji (IUML) got only +3.2pp UDF Δ — well below the cohort mean.

### Outlier-removal sensitivity

Same approach as Christian-belt — within INC-direct, candidate religion matters less than the act of contesting directly. The 4pp gap between INC-Muslim (+12.9) and IUML (+8.8) is comparable to the Christian-belt's +3-4pp INC-direct premium.

---

## §5 — NDA in Muslim Kerala: structural exclusion

From `nda.md §7` (BJP+BDJS aggregate <8% across 3 cycles):

13 of 19 structural-exclusion ACs are Muslim-dominant terrain (10 Muslim-majority + 3 Hindu+Muslim). **9 of 19 are in Malappuram alone — 56% of Malappuram's 16 ACs are persistently weak NDA across 3 cycles.**

Malappuram structural-exclusion ACs (within `nda.md §7`):

| AC | Seat | H/C/M | 2016 NDA | 2021 NDA | 2026 NDA |
|---|---|---|---|---|---|
| 34 | Ernad | 21/1/76 | 4.5% | 4.7% | 5.2% |
| 35 | Nilambur | 31/7/60 | 7.6% | 5.0% | 6.8% |
| 36 | Wandoor (SC) | 29/7/62 | 6.1% | 4.2% | 0.0% |
| 38 | Perinthalmanna | 26/1/71 | 4.0% | 4.8% | 3.9% |
| 39 | Mankada | 23/1/74 | 4.5% | 3.9% | 5.3% |
| 40 | Malappuram | 24/0/74 | 5.2% | 3.6% | 4.7% |
| 41 | Vengara | 14/0/85 | 6.0% | 4.5% | 3.6% |
| 43 | Tirurangadi | 17/0/81 | 6.1% | 5.6% | 6.6% |
| 45 | Tirur | 21/0/77 | 5.9% | 5.3% | 4.4% |

NDA share has been 3.6-7.6% across all 3 cycles. No traction.

NDA in Muslim Kerala is structurally a non-factor at the alliance level. Any 2026 NDA gain in Muslim-belt is essentially noise.

---

## §6 — Muslim sub-type taxonomy (community-relevance, AC-level)

Distinct from the Sunni/Mujahid cohort layer in §3. The cohort is *denominational* (which mosque tradition dominates the AC). The sub-type is *political-behaviour* (how Muslim voters cluster into outcome patterns). Sourced from `data/community-belts.json` + Wayanad special-case in `scripts/pipeline/build-community-relevance.ts`.

| Sub-type | Districts | n | Political behaviour |
| --- | --- | ---: | --- |
| **iuml-stronghold** | Malappuram | 16 | Muslim community votes near-unanimously through IUML; outcome essentially foregone, Muslim *defines* the AC |
| **mixed-muslim** | Kasaragod, Kannur, Kozhikode | 29 | Muslim vote splits between IUML/UDF and LDF-aligned Muslim parties (INL, NSC); ratio determines outcome |
| **mixed-muslim-wayanad** | Wayanad | 3 | Sunni-organised, Wayanad-specific dynamics distinct from north-Kerala Muslim politics |
| **cosmopolitan** | All others | 65 | Muslim share is a constituent piece of mixed ACs; lower bloc-voting; Hindu sub-caste base often dominates the dynamic |
| Total Muslim-presence ACs (Muslim ≥10 %) | | **113** | |

### §6a — Sub-type × Sunni/Mujahid cohort cross-tab

The two layers are orthogonal but not independent:

| Cohort | iuml-stronghold | mixed-muslim | mixed-wayanad | cosmopolitan | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sunni | 12 | 16 | 2 | 18 | 48 |
| Salafi/Mujahid | 3 | 1 | 0 | 10 | **14** |
| Below-threshold | 1 | 12 | 1 | 64 | 78 |

**Key finding**: the 14 Mujahid-cohort ACs are mostly `cosmopolitan` (10 of 14) — Muslim is a constituent share, not the politically-dominant force. This refines the §3 cohort claim: "Mujahid more bipartisan" is largely "Mujahid sits inside mixed Hindu-majority ACs where alliances compete on broader terms." Not pure-Muslim-belt competition.

### §6b — Mujahid cohort isn't district-clustered (addresses falsifier in §7)

`muslim.md §7` flagged the falsifier "Mujahid concentrated in 1-2 districts → district FE absorbs the swing." Empirically, the 14 Mujahid ACs span **7 districts**: Malappuram (3), Palakkad (3), Ernakulam (3), Thrissur (2), Kozhikode (1), Alappuzha (1), Thiruvananthapuram (1). Reasonably distributed. Falsifier partially addressed.

---

## §7 — Three-cycle durability of Muslim ACs (community-relevance)

`durabilityCategory` ∈ {always-UDF, always-LDF, always-NDA, udf-since-2021, ldf-since-2021, nda-since-2021, flipped-2026, other} per `scripts/pipeline/build-community-relevance.ts`.

Within the 113 Muslim-presence ACs:

| Durability | n | Notable concentration |
| --- | ---: | --- |
| **always-UDF** (UDF won 2016 + 2021 + 2026) | **27** | Malappuram 12 of 16 — IUML structural dominance confirmed |
| **always-LDF** | **27** | Palakkad 7, Thrissur 7 — cosmopolitan-Muslim seats where LDF Hindu Ezhava base anchors |
| **always-NDA** | **0** | NDA has never won the same Muslim-presence AC across 3 consecutive cycles |
| **udf-since-2021** | 7 | |
| **ldf-since-2021** | 3 | |
| **flipped-2026** (2021 ≠ 2026) | **49** | The wave — see §7a |
| Total | 113 | |

### §7a — The Kozhikode/Kannur "wave" is structural restoration

13 ACs in Kozhikode (10) + Kannur (3) flipped LDF→UDF in 2026 with Muslim ≥35 %:

| | 2016 | 2021 | 2026 | stableFor |
| --- | --- | --- | --- | --- |
| Muslim share + flip pattern across the 13-AC cluster | mostly UDF or split | LDF wave | UDF restored | **12 of 13 are stableFor: UDF** |

The community-relevance structural reading says: *Muslim ≥ 40 % mechanically blocks NDA, AND Muslim consolidation under IUML rather than LDF-aligned INL/NSC keeps LDF below threshold.* In other words, the seat is UDF-locked. The 2021 LDF wins violated the structural reading — and 2026 restored it.

**This recasts the Sprint-2 finding**: the "Muslim-belt UDF gain in 2026" wasn't a fresh swing; it was the 2021 LDF anomaly correcting back. Mechanism candidates for what made 2021 anomalous (and 2026 a restoration):

- Welfare Party / SDPI vote consolidation in 2021 that dissolved by 2026 (§7 falsifier from existing doc)
- 2021 Kozhikode-specific candidate effects (sitting CM Pinarayi-led LDF wave that reached further into mixed-muslim Kozhikode than usual)
- Cycle-specific national / state issue (CAA, hijab debates) that mobilised Muslim voters one way and then another

Worth investigating before page-build.

### §7b — The 27 always-UDF cores

- **Malappuram (12)**: all 12 non-reserved Malappuram ACs in our sample are always-UDF. Confirms IUML structural dominance — never lost a general election here across our 3-cycle window. (Wandoor SC + 3 Wayanad ST excluded as before.)
- **Ernakulam (4), Kasaragod (2), Kannur (2), others (7)**: scattered. These are mostly mixed-muslim or cosmopolitan ACs where UDF + Muslim community alignment + Christian aggregate (Ernakulam) creates a stable coalition.

### §7c — The 27 always-LDF cores

Geographic concentration: **Palakkad 7 + Thrissur 7 = 14 of 27 (52 %)**. These are **cosmopolitan-Muslim ACs** where Muslim is 20–45 % but **LDF's Ezhava-Tiyya Hindu base + CPI(M) organisation is structurally dominant**. Muslim community here is a *constituent piece* of the LDF coalition, not the driving force. This isn't a Muslim-belt phenomenon; it's a Hindu-base phenomenon with Muslim minority participation.

The remaining 13 always-LDF Muslim-presence ACs spread across Kannur (5) and Thiruvananthapuram (3), Kollam (2), Alappuzha (1), Kozhikode (1), Kasaragod (1).

---

## §8 — Structural blocking via stableFor (community-relevance, forward-looking)

`stableFor` is set when the two *other* alliances both have structural blockers and the chosen alliance has none. Independent of past-stability (`durabilityCategory`).

Within the 113 Muslim-presence ACs:

| stableFor | n | Notable |
| --- | ---: | --- |
| **UDF** | **62** | Muslim ≥ 25 % blocks NDA + Muslim-via-IUML blocks LDF |
| **LDF** | 21 | Muslim presence + Hindu Ezhava-Tiyya CPI(M) base blocks UDF and NDA (cosmopolitan-Muslim Palakkad/Thrissur) |
| **NDA** | 2 | Kazhakoottam, Nemom — Muslim too small to block; not really Muslim-driven |
| null (contested) | 28 | No clean structural lock |

**Statewide context**: 113 of 140 ACs total are stableFor-set; 76 of those are stableFor: UDF. Muslim-presence ACs drive ~62/76 (82 %) of all UDF structural locks. **Muslim community is the single largest force keeping UDF structurally above-water across Kerala.**

### §8a — Why stableFor: UDF dominates the Muslim story

The mechanical rule fires when:
- Muslim ≥ 25 % (blocks NDA mechanically), AND
- LDF has no other route — i.e., the Hindu Ezhava-Tiyya base isn't large enough OR the Muslim community is consolidated under IUML rather than LDF-aligned parties

In Malappuram (16 of 16) + Kasaragod (3 of 5) + Kannur (4 of 11) + Kozhikode (12 of 13) + Ernakulam (6 of 14), the structural reading is UDF. Geographic distribution mirrors the always-UDF count exactly.

---

## §9 — NDA in Muslim Kerala: structural exclusion + isolated rising trajectory

Extends §5. Community-relevance adds the **trajectory dimension**: even where NDA is structurally locked out, BJP's vote share might be growing.

### §9a — The mechanical floor (113 of 140 ACs block NDA)

Block-NDA cells are set in `allianceRoles.NDA.blockFrom` when:
- Muslim ≥ 25 % (mechanical, 61 cases) — Hindu-only NDA path can't beat the Muslim bloc
- Christian ≥ 20 %, UDF-aligned coordinated (28 cases) — Christian community delivers UDF
- Christian + Muslim combined ≥ 30 % (the rest) — minority coalition

**113 of 140 ACs (81 %) have NDA structurally blocked.** Only 27 ACs are NDA-feasible — predominantly Trivandrum nair-heavy zone + handful of Hindu-coastal seats.

### §9b — Where BJP is building inside the block (11 ACs, ndaTrend: rising while structurally locked)

| AC | Muslim % | NDA 2016 → 2021 → 2026 | Winner |
| --- | ---: | --- | --- |
| **27 Kozhikode N** | 41 % | 23 → 23 → 28 % (rising) | UDF 2026 (flipped from LDF) |
| **28 Kozhikode S** | 41 % | 17 → 21 → 25 % (rising) | UDF 2026 (flipped from LDF) |
| **52 Ottappalam** | 44 % | 18 → 16 → 25 % (rising) | LDF (always-LDF) |
| **56 Palakkad** | 34 % | 29 → 35 → 33 % | UDF (always-UDF) |
| 61 Chelakkara | 29 % | 16 → 16 → 23 % | LDF (always-LDF) |
| 84 Kunnathunad | 20 % | 11 → 5 → 25 % | UDF (flipped) |
| 101 Poonjar | 16 % | 14 → 2 → 25 % | UDF (flipped) |
| 116 Karunagappally | 29 % | 12 → 7 → 19 % | UDF |
| 121 Punalur | 21 % | 7 → 14 → 11 % | LDF |
| 127 Varkala | 25 % | 16 → 8 → 20 % | LDF |
| 82 Eranakulam | 21 % | 13 → 15 → 18 % | UDF |

**Three patterns**:
1. **Kozhikode mixed-muslim duo (27, 28)** — BJP building Hindu consolidation in seats Muslim community structurally locks UDF. NDA share at 25–28 % is still distantly third, but the trajectory is real.
2. **Cosmopolitan always-LDF seats (52, 61)** — BJP gaining vote share in LDF strongholds where Muslim is a constituent piece. Watch for 2031: if Muslim share contracts or Hindu Ezhava-Tiyya base fractures, these could go competitive.
3. **Post-Twenty 20 rebound (84, 101)** — extreme volatility 2016→2021 collapse → 2026 reset. Not really "BJP building" so much as recovery from the T20 disruption. (See `udf.md` for T20 context.)

### §9c — In Malappuram specifically, NDA is plateaued or declining

Of 16 Malappuram non-reserved ACs in our sample, NDA trend distribution: **0 rising, 11 flat (3–7 % share), 5 declining**. The structural-exclusion finding from §5 is reinforced: BJP isn't even *building* in Malappuram, let alone winning. Wandoor (NDA 6 → 4 → 0 %) is the most extreme declining case.

---

## §10 — No Muslim hereditary seats (community-relevance)

Among the 6 documented hereditary seats in `data/hereditary-seats.json`:

| AC | Family | Alliance | Muslim share |
| --- | --- | --- | ---: |
| Puthuppally | Oommen Chandy → son Chandy Oommen | UDF | 6 % |
| Pala | K. M. Mani → son Jose K. Mani | UDF→LDF (KC-M switch) | 8 % |
| Piravom | T. M. Jacob → son Anoop Jacob | UDF | 8 % |
| Thrikkakara | P. T. Thomas → wife Uma Thomas | UDF | 12 % |
| Chittur | K. Achuthan → son Sumesh Achuthan | UDF | 18 % |
| Kuttanad | Thomas Chandy → brother Thomas K. Thomas | LDF (NCP) | 8 % |

**Zero of the six hereditary seats have Muslim ≥ 20 %.** All six are concentrated in central-Kerala Christian belt (Kottayam 2 + Ernakulam 2 + Palakkad 1 + Alappuzha 1). The candidate-name audit found no analogous father-son or sibling successions in any Muslim-belt AC.

### Why this matters

Christian-belt UDF politics runs on dynasties (the Chandy and Mani names alone span ~50 years of central-Kerala politics). Muslim Malappuram doesn't — IUML rotates candidates more than it inherits them. Different organisational logic:

- **Christian-belt UDF** = personal-coalition politics through INC + KC factions; Mani / Chandy / Jacob / Achuthan families control specific seats across cycles
- **Muslim Malappuram UDF** = institutional politics through IUML; candidates selected by party, families don't own seats

This is a previously-undocumented contrast between the two UDF heartlands. Worth interrogating: is it (a) IUML's institutional discipline preventing dynasties, (b) Muslim socio-religious norms about family-political-inheritance, (c) sampling artefact (we only looked at 3 cycles), or some mix?

Falsifier: an audit including all Malappuram candidates over more cycles might surface within-IUML hereditary patterns (e.g., the Hameed family in some Malappuram seats, the P.K. Kunhalikutty / P.K. Basheer lineage if related). Current audit is 2011–2026 + top-3-per-cycle only; cousins / second-generation politicians who don't break top-3 wouldn't appear.

---

## §11 — Open hypotheses for the walkthrough

### Hypothesis A — Sunni stability + Mujahid swing (preferred working thesis)

The Muslim-belt UDF margin in 2026 was driven by **Sunni stability + Mujahid swing**, not by uniform mobilisation across the Muslim spectrum.

Evidence so far:
- Sunni cohort Δ UDF +6.5pp (close to statewide baseline ~+7pp).
- Mujahid cohort Δ UDF +8.7pp (above baseline).
- 36% of Mujahid ACs went LDF in 2026 vs 15% of Sunni ACs → Mujahid is structurally more competitive.

**Implication**: IUML's organisational reach extends fully into Sunni areas but more lightly into Mujahid areas. Voter behaviour reflects this.

### Hypothesis B — Mujahid is the swing voter

The 14 Mujahid ACs are the marginal seats in Muslim Kerala. Whoever wins Mujahid wins the Muslim-belt margin. In 2026, UDF won big in Mujahid (+8.7) but didn't sweep (5 LDF wins). In 2021, both were closer (regression hypothesis).

### Hypothesis C (alternative framing) — Two Muslim Keralas vote differently

Sunni Kerala is a UDF stronghold; Mujahid Kerala is competitive. IUML's organisational reach is structurally different across sub-sects.

---

## §12 — Falsifiers / what would weaken these hypotheses

- **Mujahid cohort geographically concentrated in 1-2 districts** → "Mujahid swung" might just be "this specific cluster swung" for local (non-Mujahid-identity) reasons. Need to check.
- **The 14 Mujahid ACs include several SC-reserved seats** → cohort label would be misleading (SC-Muslim joint areas, not pure Mujahid territory).
- **OSM Mujahid signal too sparse** → Salafi/Mujahid mosques tend to be smaller and may be under-mapped relative to mainstream Sunni mosques. The cohort might capture "low Muslim density + 1-2 Mujahid mosques" rather than genuine Mujahid majority.
- **2021 was anomalous for Mujahid** → if there was a one-off LDF push in Mujahid areas in 2021 (some local controversy), the +8.7 in 2026 is a single-cycle correction.
- **Welfare Party / SDPI / minor-Muslim-party vote redistribution** → if WPI got 5-10% in Mujahid ACs in 2021 but stood down in 2026, the UDF swing might just be absorbing WPI's vote share, not converting LDF voters.

---

## §13 — Open data needs (before walkthrough page-build)

- [ ] **List ACs per Muslim cohort with district, Muslim share, alliance shares 2021/2026.** Sanity-check cohort assignments by hand. (Analogous to `walkthroughs-christian-data.ts COHORT_AC_LIST`.)
- [ ] **District clustering audit** — for each cohort, what fraction of ACs are in one district vs spread. If Mujahid=Malappuram-only, district FE problem.
- [ ] **Multi-cycle swing per cohort** — re-run cohort × UDF margin for 2011/2016/2021/2026. Is the +8.7 Mujahid 2026 swing unusual vs cohort history?
- [ ] **Mujahid LDF-winner identification** — list the 5 LDF-winning Mujahid ACs by name/district/margin. Look for a common factor.
- [ ] **Welfare Party / SDPI / minor-Muslim-party share, per cohort, 2021** — did minor parties cluster in Mujahid ACs in 2021? Did they disappear in 2026?
- [ ] **Swing R² for Muslim cohort** — extend `scripts/analysis/analyze-subrite-cohorts.ts` to compute Δ UDF R² for Muslim cohort vs Muslim share.
- [ ] **Sunni LDF-winner identification** — list 7 LDF-winning Sunni ACs. Are they Muslim-minority ACs where Sunni is technically dominant but Muslim share is low?
- [ ] **OSM Mujahid coverage audit** — how many of 14 Mujahid-cohort ACs have classified Muslim N ≥ 10 (vs 3-9)? Robustness check.
- [ ] **IUML / INC / WPI candidate breakdown by cohort** — did the UDF candidate in Mujahid ACs differ from the UDF candidate in Sunni ACs (party / Muslim-identity / etc.)?
- [ ] **Mitigation tests (M1/M2/M3) for Muslim cohort** — parallel to `analyze-christian-mitigations.ts`. Hindu-NDA absorption test, same-district control, within-cohort by Muslim-share heterogeneity.

---

## §14 — Possible page outline (when built)

Mirror Christian walkthrough structure:

```
Title: How Kerala's Muslim sub-communities moved in 2026

Thesis (provisional, tentative confidence):
  "Kerala Muslims don't vote as one bloc. Sunni cohort showed
   stable UDF support with a wave-sized swing; Mujahid cohort
   swung harder but stayed more bipartisan. UDF's strategic
   playbook in Muslim Malappuram was structurally narrower than
   in the Christian belt."

CONTEXT:
  §1 Kerala Muslims: ~28% of population, geographically + sub-sect diverse
  §2 Each sub-sect lives in a distinct cluster (OSM categorical map)
  §3 Each sub-sect has its own multi-cycle alliance pattern
  §4 Sunni: stable UDF base (largest cohort)
  §5 Salafi / Mujahid: bipartisan, swung harder in 2026

THIS ELECTION:
  §6 Stable premium + wave-sized swing (Muslim-belt headline)
  §7 Sub-sect heterogeneity: Sunni vs Mujahid Δ
  §8 UDF's strategy menu: IUML / INC-Muslim / never INC-Hindu
  §9 NDA's structural exclusion from Malappuram

METHODOLOGY:
  §10 Confounder tests (when run)
  §11 What we can't tell — sub-sect data is sparse in southern Kerala
```

---

## §15 — Mechanism, what's open, what would weaken

### What's directly observable (so far)

- Muslim-belt UDF premium ~+11pp since 2011; grew modestly to +12.8 in 2026.
- Sunni cohort Δ UDF +6.5pp; Mujahid cohort Δ UDF +8.7pp.
- Mujahid LDF retention 36% vs Sunni 15% — Mujahid more bipartisan.
- 9 of 16 Malappuram ACs structurally-exclude NDA across 3 cycles.
- UDF strategic menu in Malappuram non-reserved: only Muslim candidates (IUML or INC-Muslim), no INC-Hindu.
- Muslim-share variation collapses under district FE (β=+0.016, p=0.795).

### What's inferred (structural assumption)

- "Muslim voters in Mujahid-dominant ACs swung more than in Sunni-dominant ACs" — community-level inference from AC-aggregate. Untested against confounders (M1/M2/M3 not yet run for Muslim cohort).
- "IUML's organisational reach is firmer in Sunni than in Mujahid areas" — standing assumption consistent with the data but not directly proven.

### What's NOT proven

- **Individual Muslim voter behaviour** — no exit polls or CSDS microdata.
- **Sub-sect identity (cohort) is causally distinct from district / Muslim-share clustering** — Mujahid cohort may be Malappuram-concentrated, in which case district FE absorbs it.
- **The Mujahid +8.7pp swing is durable.** May be 2026-specific (e.g., WPI vote consolidation, anti-incumbency wave). 2031 reversal would weaken.
- **EK Sunni vs AP Sunni split is invisible.** OSM cohort layer merges both into "sunni"; this distinction matters politically but is below the data's resolution.

### What would weaken the headline

- **Mujahid cohort all in 1-2 districts** → district effect, not Mujahid effect. (Need to check.)
- **2031 cycle reversal** of the Mujahid Δ → 2026 was cycle-specific.
- **Survey microdata** showing Muslim voters in cohort ACs cited sub-sect-specific motivators at differential rates.
- **Welfare Party vote redistribution** explaining the +8.7pp Mujahid swing without invoking Mujahid identity.

---

## Scripts + data

| Source | Path |
|---|---|
| Per-AC sub-sect cohort | `subrite-bins.ts` (`muslimSubRiteCohortFor`) |
| Per-AC voter-share | `religious-pois.ts` (`getReligiousSignatureForAC`) |
| Sprint 2 analysis | `scripts/analysis/analyze-subrite-cohorts.ts` |
| Muslim-belt premium (pre-OSM) | `scripts/analysis/analyze-muslim-belt.ts` |
| OSM raw | `data/raw/osm/places-of-worship-kerala.json` (gitignored) |
| OSM classified inventory | `data/ac-religious-pois.json` |
| Tests | `src/lib/data/religious-pois.test.ts` (cohort sizes assertions) |
| Page (NOT YET BUILT) | `src/pages/walkthroughs-muslim-page.tsx` (planned) |
| Page data (NOT YET BUILT) | `src/pages/walkthroughs-muslim-data.ts` (planned) |

### Key constants

Same as Christian — locked in `religious-pois.ts`:
```
COHORT_YEAR = 2025
COHORT_VOTER_SHARE_THRESHOLD = 5      // % of voters
MIN_CLASSIFIED_FOR_COHORT = 3         // POIs of that religion
LOW_CONFIDENCE_CLASSIFIED_N = 10
```

---

## Cross-references

- **`christian.md`** — sibling sub-rite analysis. The "INC-direct outperforms alliance" finding holds across both belts; the "empty INC-Hindu bucket" is the Muslim-specific structural asymmetry.
- **`udf.md §4`** — Muslim-belt strategy section in the UDF reference. Captures the same 15-AC Malappuram analysis.
- **`ldf.md §6`** — Muslim-majority ACs absorbed 108% of LDF loss to UDF (vs Christian-heavy's 122%). Both lean overwhelmingly UDF in the flow decomposition.
- **`nda.md §7`** — Malappuram structural exclusion. 9 of 19 NDA structural-exclusion ACs are in Malappuram.
- **`data/raw/osm/README.md`** — full pipeline documentation for OSM POI classification.

---

## Methodology notes

### Muslim-belt analysis universe

`scripts/analysis/analyze-muslim-belt.ts` uses:
- ≥70% Muslim ACs (n=11 across Kerala) for the "premium" history
- Malappuram non-reserved (n=15) for the strategy analysis
- Excludes Wayanad's 3 ST seats + Wandoor SC seat (reservation forces candidate choice)

### Cohort layer (OSM-derived)

Same pipeline as Christian (`scripts/pipeline/classify-osm-pow.ts`). Muslim-specific notes:
- Mosque tagging less consistent than church tagging in OSM. Many mosques tagged just `amenity=place_of_worship` + `religion=muslim` without `denomination=*`.
- Sub-sect inference relies on `denomination` tag where present, plus name-regex patterns (e.g. "Mujahid", "Salafi", "Jamia", "Sunni" in mosque names).
- Coverage of sub-sect-specific tagging is thinner in southern Kerala than in Malappuram/Malabar. Northern Kerala mosques tend to have richer tagging.

### District-FE absorption

For Muslim share, district FE absorbs the Pearson signal entirely (β=+0.016, p=0.795). Cohort-level analysis is the only way to detect within-district sub-sect effects. M1/M2/M3 mitigation tests parallel to Christian are NOT yet run for Muslim — high priority before page-build.

### What's not in scope

- **EK Sunni vs AP Sunni distinction** — politically meaningful (Kanthapuram vs SKSSF factions), but OSM tag coverage doesn't separate them. Both lumped into "Sunni" cohort.
- **Madrassa networks** (more denominationally distinct than mosques) — separate data source needed; not currently mapped.
- **Wakf-board property records** — could provide ownership-by-faction data; not currently sourced.
