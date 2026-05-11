# Muslim — findings reference

**Audience**: future analysis (agent + author). **Muslim walkthrough page not yet built** — this file is the planning + analysis reference for when it lands. Page name will be `/walkthroughs/muslim-walkthrough` (`src/pages/walkthroughs-muslim-page.tsx` + `src/pages/walkthroughs-muslim-data.ts`).

**Doc shape**: 4 substantive sections matching the planned walkthrough structure, plus appendices for methodology / falsifiers / sources. Sprint-2 cohort analysis + community-relevance (CR) framework + external-commentary verification (May 2026) are integrated inline; each major claim flagged for source and confidence.

**Sources consolidated**: `muslim-walkthrough-draft.md` (early Sprint 2 era) + `muslim-belt-deep-dive.md` (pre-OSM UDF strategy analysis) (both deleted on consolidation).

---

## TL;DR

- **Muslim community is ~28 % of Kerala but politically consequential in ~66 of 140 ACs (47 %)** — 16 outright-controlled (Muslim ≥ 50 %) + ~50 swing-leverage seats. **A demographically-uniform 28 % bloc would have 0 controlled seats** — leverage comes from geographic concentration, not headcount.
- **Two distinct modes of Muslim political influence**: (a) **direct-majority lock** in Malappuram-style ACs where Muslim alone determines outcomes; (b) **coalition-partner swing** in mixed-muslim + central-Kerala ACs where Muslim is the deciding bloc in UDF-vs-LDF contests.
- **Kerala Muslims don't vote as one bloc.** Mujahid-cohort ACs swung harder toward UDF in 2026 (+8.7 pp) than Sunni-cohort (+6.5 pp); Mujahid 36 % LDF retention vs Sunni 15 %. **But the cohort signal is a noisy proxy** for the politically-meaningful **EK Samasta vs AP Samasta factional split** that cross-cuts both theological cohorts — our data sees the theological cleavage, not the factional one (per §A.4).
- **UDF's strategic playbook in Muslim Malappuram is structurally narrower than in Christian belt**: IUML or INC-Muslim only. INC-Hindu was never on the menu in 16 non-reserved Muslim-majority ACs.
- **No Muslim hereditary seats** (0 of 6 documented family successions). All 5 UDF dynasties are Christian-belt. **Muslim Malappuram = institutional IUML rotation; Christian-belt UDF = personal-coalition dynasties.** Different organisational logic between the two UDF heartlands.
- **NDA is structurally locked out of Muslim Kerala** — 113 of 140 ACs block-NDA mechanically; 61 of those via Muslim ≥ 25 %. **0 always-NDA seats exist anywhere in our 3-cycle window with measurable Muslim presence.**
- **BJP is building Hindu vote share inside Muslim-blocked seats** in 11 ACs (Kozhikode N+S the headlines), but no measurable progress in Malappuram itself.
- **BJP's most strategically valuable Kerala target is the Christian-Muslim coalition belt**, not Muslim or pure-Hindu Kerala. Peeling 8-10 % of Christian sub-rite voters in ~28 central-Kerala ACs would shrink the minority-coalition block from "blocking" to "competitive" — and **reduce Muslim coalitional leverage** without ever needing to win a Muslim voter.

---

## §1 — Demographics + political impact

### 1a. Muslim Kerala demographics

- Muslims ~28-29 % of Kerala's population in the 2025 projection.
- **Geographic concentration**: Malappuram district (~70 % Muslim across most ACs) is the heartland. Significant populations also in Kasaragod, Kannur (esp. coastal), Kozhikode interior, and pockets in central Kerala (Ernakulam Mattancherry, Aluva).
- Major sub-sect distinctions (Kerala-specific) — covered in detail in §2:
  - **Sunni** mainstream (split into EK Samasta and AP Samasta factions)
  - **Mujahid / KNM** (Salafi-reformist, EK + AP factions merged in 2016)
  - **Jamaat-e-Islami** (separate ideological tradition; political wing is Welfare Party of India)

### 1b. The mechanism: two modes of political influence

**Mode A — Direct-majority lock** (~16-26 ACs)

In Malappuram + a few Muslim-majority Kasaragod / Wayanad ACs, Muslim community alone determines outcomes. UDF must field a Muslim candidate or lose. NDA mechanically cannot win. LDF can win only when the Muslim community fractures along EK/AP factional lines.

CR sub-types where this mode applies:
- `iuml-stronghold` (Malappuram, n=16)
- `mixed-muslim-wayanad` (n=3)
- A handful of `mixed-muslim` ACs with Muslim ≥ 50 % (e.g., Thiruvambadi, Manjeshwar, Kasaragod)

**Mode B — Coalition-partner swing-bloc** (~50 ACs)

In central Kerala + Kannur + Kozhikode + Trivandrum cosmopolitan ACs, Muslim community is 15-45 % of voters — necessary but not sufficient for UDF wins. Both UDF and LDF compete for Muslim votes. **The Muslim community's political bargaining position is amplified by being the swing-bloc that determines which non-NDA alliance wins.**

CR sub-types where this mode applies:
- `mixed-muslim` Kannur + Kozhikode (n=22; mostly UDF-leaning but historically LDF-competitive via Ezhava-Tiyya Hindu base)
- `cosmopolitan` ACs with Muslim 15-45 % (n=~25)

### 1c. Quantified political leverage

| | Lock-in seats | Swing-leverage seats | Total leverage | Population share |
| --- | ---: | ---: | ---: | ---: |
| **Actual** (geographic concentration) | ~16 | ~50 | **~66 / 140** | 28 % |
| **Counterfactual** (uniform distribution of 28 %) | 0 | 0 | **0 / 140** | 28 % |

**Why this matters**: a uniformly-distributed 28 % bloc would have demographic *presence* in every AC but electoral *leverage* in none — they'd be outvoted everywhere. Muslim community's leverage comes from being able to elect 16 MLAs outright (because they're 60-85 % of those ACs) plus being the decisive vote in another 50.

**Suggestion** — the punchy "65 % of ACs" / "2.3× population share" framing in earlier drafts was misleading because it counted "ACs where Muslim presence is mentioned" (113), not "ACs where Muslim community has electoral leverage" (~66). The corrected framing trades a punchier number for a cleaner mechanism explanation. ⚠️ User to confirm preference.

### 1d. The "no dynasty" finding — institutional vs personal politics

Of 6 documented hereditary successions in `data/hereditary-seats.json`, **0 are Muslim**:

| AC | Family | Alliance | Muslim share |
| --- | --- | --- | ---: |
| Puthuppally | Oommen Chandy → son Chandy Oommen | UDF | 6 % |
| Pala | K. M. Mani → son Jose K. Mani | UDF→LDF (KC-M switch) | 8 % |
| Piravom | T. M. Jacob → son Anoop Jacob | UDF | 8 % |
| Thrikkakara | P. T. Thomas → wife Uma Thomas | UDF | 12 % |
| Chittur | K. Achuthan → son Sumesh Achuthan | UDF | 18 % |
| Kuttanad | Thomas Chandy → brother Thomas K. Thomas | LDF (NCP) | 8 % |

All 6 concentrate in central-Kerala Christian belt (Kottayam 2 + Ernakulam 2 + Palakkad 1 + Alappuzha 1).

**Interpretation**: Muslim Malappuram = institutional IUML politics where the party (Samastha-Sunni-backed) rotates candidates and families don't own seats. Christian-belt UDF = personal coalition through INC + KC factions where Mani / Chandy / Jacob / Achuthan families control specific seats across cycles. Different organisational logic.

⚠️ **Sampling caveat**: our hereditary audit is top-3-per-cycle 2011-2026. If Muslim political families have cousins / second-generation politicians who don't break top-3, we'd miss them (Kunhalikutty, Hameed, Madani family lines worth checking). Worth a manual sanity-check before stating this strongly in the walkthrough.

---

## §2 — Sub-sects + Muslim sub-type taxonomy

### 2a. Three cross-cutting cleavages — only one is in our data

Kerala Muslim politics has at least three meaningful internal divisions:

| Cleavage | Distinction | Our data sees it? |
| --- | --- | --- |
| **Theological** | Sunni mainstream vs Salafi-reformist Mujahid (KNM) | ✅ Yes — OSM mosque tags |
| **Factional within Sunni** | EK Samasta (IUML/UDF-aligned) vs AP Samasta (Kanthapuram, LDF-tactical) | ❌ No |
| **Factional within Mujahid** | EK Mujahid (IUML-aligned) vs AP Mujahid (LDF-leaning; merged 2016) | ❌ No |
| **Organisational** | Jamaat-e-Islami (political wing: WPI / Welfare Party) — separate tradition | ❌ No |

The OSM-derived cohort layer (`subrite-bins.ts`) classifies ACs as Sunni (n=48) / Salafi-Mujahid (n=14) / below-threshold (n=78). **The politically-meaningful cleavage is the EK / AP factional split, which cross-cuts both theological cohorts.** Per India Seminar (R. Santhosh 2022): *"the A.P. Samasta faction forged a political affiliation to the LDF, especially to CPI(M), as a tactical move to checkmate the E.K. Samasta faction."*

**Implication**: our Sprint-2 finding "Mujahid more bipartisan than Sunni" reflects EITHER (a) AP-Mujahid voters leaning LDF, (b) AP-Sunni voters who happen to live in Mujahid-cohort ACs, OR (c) genuine Mujahid theological-distinctiveness. The signal is real; the mechanism is multi-causal and we can't directly attribute.

### 2b. Sub-sect cohort × UDF performance (Sprint 2)

From `scripts/analysis/analyze-subrite-cohorts.ts`:

| Cohort | n | UDF 2026 | UDF 2021 | Δ UDF | LDF 2026 | LDF 2021 | Δ LDF | Wins (U/L/N) |
|---|---:|---:|---:|---:|---:|---:|---:|:---:|
| Sunni | 48 | 49.2 | 42.7 | **+6.5** | 36.5 | 43.6 | −7.1 | 40/7/1 |
| **Salafi/Mujahid** | **14** | 46.5 | 37.8 | **+8.7** | 36.5 | 44.0 | −7.5 | **9/5/0** |
| Below-threshold residual | 78 | 45.0 | 37.5 | +7.5 | 38.9 | 46.5 | −7.6 | 53/23/2 |

**Two findings**:

1. **Mujahid swung harder** (+8.7 vs +6.5 pp). Mujahid's UDF baseline was lower in 2021 (37.8 % vs 42.7 %), so part of the magnitude reflects regression toward the Muslim-bloc mean.

2. **Mujahid is more bipartisan**: 36 % LDF retention vs Sunni 15 %. **Mujahid-cohort ACs are structurally more competitive between UDF and LDF than Sunni-cohort.** Even with the bigger UDF swing, Mujahid didn't sweep.

### 2c. Variance-explained — sub-sect signal is mostly noise once you control for Muslim %

For 2026 UDF level among Muslim-cohort-labelled ACs (n=62):

| Predictor | R² |
|---|---:|
| Muslim sub-rite cohort (one-way ANOVA) | **0.014** |
| Muslim % of population (linear) | **0.237** |

**Religion-share crushes cohort by 17×.** The "Mujahid swung harder" finding survives this — it's about *swing direction* not *level* — but should be presented with appropriate humility: sub-sect identity explains very little of the *outcome* level.

### 2d. Community-relevance Muslim sub-type taxonomy

CR's sub-type layer is district-level inheritance (not POI-derived). Distinct from the Sprint-2 theological cohort:

| Sub-type | Districts | n | Political behaviour |
| --- | --- | ---: | --- |
| **iuml-stronghold** | Malappuram | 16 | Muslim community votes near-unanimously through IUML; outcome essentially foregone |
| **mixed-muslim** | Kasaragod, Kannur, Kozhikode | 29 | Muslim vote splits between IUML/UDF and LDF-aligned Muslim parties (INL, NSC); ratio determines outcome |
| **mixed-muslim-wayanad** | Wayanad | 3 | Sunni-organised, Wayanad-specific dynamics distinct from north-Kerala Muslim politics |
| **cosmopolitan** | All others | 65 | Muslim share is a constituent piece of mixed ACs; lower bloc-voting |

⚠️ **Methodology caveat**: this taxonomy is **district-level inheritance** — every AC in Malappuram is labelled `iuml-stronghold`, every AC in Kannur is `mixed-muslim`. AC-level resolution within a district is not directly visible. Some Malappuram ACs (e.g., Thavanur INC-Christian) deviate from the iuml-stronghold pattern despite carrying the label.

### 2e. The 2026 Welfare Party / Jamaat consolidation (new dynamic)

Per The Federal + Onmanorama (March 2026): **WPI announced UDF support at the Nilambur by-poll**, "displeased the IUML" and triggered "sharp criticism from Sunni leadership." UDF's arrangement with WPI brought a meaningful Muslim faction *that wasn't IUML* into the UDF column for 2026.

This is a **2026-specific factional consolidation** we cannot measure from our data. Part of the 2026 Muslim swing toward UDF is Jamaat / WPI voters — who in 2021 may have been politically homeless or LDF-aligned — entering the UDF coalition. This is a hypothesis from external commentary; magnitude unknown.

### 2f. Mujahid-BJP softening — watch-list

Per Hudson Institute + The Federal: *"KNM's softened stance towards the BJP has not gone down well with the majority of the other Muslim organisations."* Some KNM leaders are warming to BJP. This may partially explain **rising NDA share in Mujahid-cohort cosmopolitan ACs** (4 of 14 Mujahid ACs have rising NDA share, vs 4 of 48 Sunni-cohort).

Worth tracking but not yet a major electoral effect — Mujahid-cohort ACs still vote 9/14 UDF and 5/14 LDF in 2026.

---

## §3 — UDF strategy

### 3a. Strategy menu in Malappuram non-reserved (15 ACs)

Universe: Malappuram district minus Wandoor (SC reserved) and minus 3 Wayanad ST ACs (Wayanad excluded as mixed-demographic, not Muslim-belt).

**UDF won 15 of 15 in 2026.**

| Strategy | n | Won | Mean Δ UDF |
|---|---:|---:|---:|
| **Muslim Alliance (IUML)** | 12 | 12 | **+8.8 pp** |
| **INC-Muslim** | 2 | 2 | **+12.9 pp** |
| **INC-Hindu** | **0** | — | — |
| Special (INC-Christian: Thavanur) | 1 | 1 | +4.1 pp |
| **Total** | **15** | **15** | |

Statewide Δ UDF reference ~+7 pp. **INC-direct outperformed alliance route by ~4 pp** — INC-Muslim picked up more swing than IUML did, parallel to the Christian-belt finding.

### 3b. The empty INC-Hindu bucket — structural finding

In Christian-belt seats, UDF freely mixed candidate religions inside INC. Hindu INC and Christian INC both contested ≥40 %-Christian seats and both swung +10–11 pp. **UDF was happy to put a Hindu candidate in front of Christian voters.**

In Malappuram non-reserved, **UDF was NOT willing to put a Hindu in front of Muslim voters.** The choice was always Muslim — either via IUML alliance or INC-Muslim direct.

The Thavanur exception (INC-Christian, Δ UDF +4.1 pp, well below wave) is consistent with the rule: when INC tried a non-Muslim candidate at a 67 %-Muslim seat, swing was sub-baseline.

**Why this matters strategically**: UDF's playbook recognises Muslim-Malappuram as a politically-defined-by-Muslim-identity zone. The Christian-belt freedom to mix candidate religions doesn't transfer.

### 3c. IUML 2026 institutional performance

Per 2026 commentary (Outlook, Onmanorama):

- IUML 80 % strike rate, won 22 of 27 contested seats
- Malabar strongholds delivered consistent victories
- P. K. Kunhalikutty won Malappuram by **85,327 votes** (one of the highest margins in the state)
- **Fathima Thahiliya became the first IUML woman MLA** (Perambra, +5,087)

The "kingmaker" framing in mainstream commentary undersells the structural dimension — IUML isn't just a UDF coalition partner; it's UDF's only path to Muslim-majority Kerala.

### 3d. Cross-belt contrast — institutional vs dynastic

- **Muslim Malappuram UDF** = institutional politics through IUML. Samastha-Sunni-establishment-backed; candidates selected by party; families don't own seats.
- **Christian-belt UDF** = personal coalition politics through INC + KC factions. Mani / Chandy / Jacob / Achuthan / Thomas families control specific seats across cycles (see §1d).

Both heartlands are UDF; the political organisational logic is opposite.

### 3e. Muslim-belt UDF premium history (pre-OSM context)

Comparing UDF performance in rest-of-state vs ACs with ≥70 % Muslim share (n=11):

| Year | UDF ≥70 % Muslim | UDF statewide | Premium |
|---|---|---|---|
| 2011 | 57.0 % | 46.2 % | +10.8 pp |
| 2016 | 50.0 % | 39.3 % | +10.7 pp |
| 2021 | 50.6 % | 39.3 % | +11.3 pp |
| **2026** | **59.4 %** | **46.6 %** | **+12.8 pp** |

- Muslim-belt UDF premium ~+11 pp since 2011 — stable. Christian-belt premium was ~+3 pp historically and **doubled** to +6.4 pp in 2026; Muslim-belt grew modestly to +12.8 pp.
- **Opposite shape from Christian story**: stable historic premium continuing, vs Christian's smaller historic premium that doubled.
- **Wave-sized swing on stable high baseline**: Δ UDF at ≥70 % Muslim ACs was +8.77 pp — barely above statewide +7 pp.

### 3f. Three-cycle durability of Muslim ACs (CR)

Within the 113 ACs with Muslim ≥ 10 %:

| Durability | n | Notable concentration |
| --- | ---: | --- |
| **always-UDF** | **27** | Malappuram 12 of 16 — IUML structural dominance confirmed |
| **always-LDF** | **27** | Palakkad 7, Thrissur 7 — cosmopolitan-Muslim seats where LDF Hindu Ezhava base anchors |
| **always-NDA** | **0** | NDA has never won a Muslim-presence AC three cycles in a row |
| **udf-since-2021** | 7 | |
| **ldf-since-2021** | 3 | |
| **flipped-2026** | **49** | The 2026 wave — see §4 for the Kozhikode/Kannur sub-pattern |

**The 27 always-LDF Muslim-presence ACs are mostly Palakkad + Thrissur cosmopolitan** — Muslim is 20-45 % but **LDF's Ezhava-Tiyya Hindu base + CPI(M) organisation is structurally dominant**. Muslim community here is a constituent piece of the LDF coalition, not the driving force.

---

## §4 — NDA strategy

### 4a. Structural exclusion — 113 of 140 ACs block-NDA

The CR framework sets `NDA.blockFrom` when any of:
- Muslim ≥ 25 % (mechanical) — fires in **61 ACs**
- Christian ≥ 20 % UDF-aligned coordinated — fires in **28 ACs**
- Christian + Muslim combined ≥ 30 % (minority coalition) — fires in ~**24 ACs**

**Total**: 113 of 140 ACs (81 %) have NDA structurally blocked. Only 27 ACs are NDA-feasible at the alliance-victory level — predominantly Trivandrum nair-heavy zone + handful of Hindu-coastal seats.

### 4b. Inside-Malappuram NDA — no measurable progress

Of 16 non-reserved Malappuram ACs, NDA trend distribution: **0 rising, 11 flat (3-7 % share), 5 declining**. Wandoor (SC) went 6 → 4 → 0 %. The structural-exclusion finding is robust at the level of *alliance-victory math*.

⚠️ **Note on framing**: this doesn't mean Sangh outreach in Malappuram is producing nothing — just no measurable vote-share shift in our 3-cycle window. Worth softening "essentially noise" framing to "no measurable progress despite Sangh outreach" — leaves space for the trend to change in 2031.

### 4c. Rising NDA inside Muslim-blocked seats (11 ACs)

NDA share is rising in 11 Muslim-presence ACs while the seat remains structurally locked away from NDA. The mechanical block holds; the trajectory under it shifts.

| AC | Muslim % | NDA 2016 → 2021 → 2026 | Winner |
| --- | ---: | --- | --- |
| **27 Kozhikode N** | 41 % | 23 → 23 → 28 % (rising) | UDF 2026 (flipped) |
| **28 Kozhikode S** | 41 % | 17 → 21 → 25 % (rising) | UDF 2026 (flipped) |
| **52 Ottappalam** | 44 % | 18 → 16 → 25 % (rising) | LDF (always-LDF) |
| **56 Palakkad** | 34 % | 29 → 35 → 33 % | UDF (always-UDF) |
| 61 Chelakkara | 29 % | 16 → 16 → 23 % | LDF |
| 84 Kunnathunad | 20 % | 11 → 5 → 25 % | UDF (flipped, T20 rebound) |
| 101 Poonjar | 16 % | 14 → 2 → 25 % | UDF (flipped, T20 rebound) |
| 116 Karunagappally | 29 % | 12 → 7 → 19 % | UDF |
| 121 Punalur | 21 % | 7 → 14 → 11 % | LDF |
| 127 Varkala | 25 % | 16 → 8 → 20 % | LDF |
| 82 Eranakulam | 21 % | 13 → 15 → 18 % | UDF |

Three patterns:
1. **Kozhikode mixed-muslim duo (27, 28)** — BJP building Hindu consolidation in seats Muslim community structurally locks UDF (though see §4d below for caveat). NDA at 25-28 % is still distantly third, but trajectory is real.
2. **Cosmopolitan always-LDF seats (52, 61)** — BJP gaining vote share in LDF strongholds where Muslim is a constituent piece. Watch for 2031.
3. **Post-Twenty 20 rebound (84, 101)** — extreme 2016→2021 collapse → 2026 reset. Not really "BJP building" so much as recovery.

### 4d. Worked example — what does it take for NDA to win Kozhikode N?

**Kozhikode N 2026 actuals** (approximate):

| Voter group | Share of AC | UDF | LDF | NDA |
| --- | ---: | ---: | ---: | ---: |
| Muslim | 41 % | ~31 % AC | ~7 % AC | ~2 % AC |
| Christian | 4 % | ~3 % AC | ~1 % AC | ~0 % AC |
| Hindu | 55 % | ~2.5 % AC | ~26.5 % AC | ~26 % AC |
| **Total AC** | **100 %** | **~36.5 %** | **~35 %** | **~28 %** |

(Within-Hindu split: 5 % UDF / 48 % LDF / **47 % NDA** of the Hindu vote — already near-50/50 LDF vs NDA.)

**Implication**: **the Muslim community is the entire UDF base in Kozhikode N. Hindu vote is essentially LDF-vs-NDA contest with LDF barely edging.**

**For NDA to overtake UDF and win** (need NDA > UDF and NDA > LDF):
- At NDA = 35 % AC (62 % of Hindu vote — gaining from LDF), still loses by 1-2 pp
- **Breakpoint**: NDA ≈ 38 % AC = **~65 % of the Hindu vote**

⚠️ **The earlier "75 %" estimate was rough back-of-envelope; the corrected number is ~65 %.** Still substantial but not impossible — particularly given Mujahid-BJP softening (§2f) and ongoing Sangh outreach.

**What this analysis CANNOT model**:
- Within-Hindu sub-caste shifts (Ezhava-Tiyya defection from LDF, Nair consolidation behind BJP) — we have no AC-level Hindu sub-caste data
- Cross-cutting national-issue effects
- Jamaat / WPI 2031 behaviour (could move 5-10 % of Muslim vote either direction)

### 4e. BJP's most strategically valuable Kerala target — Christian-Muslim coalition belt

BJP cannot win Muslim Kerala. Pure-Hindu Kerala is saturated (Ezhava-LDF + Nair-BJP-curious already polarised). **The actionable target is the Christian-Muslim coalition belt of central Kerala** — ~28 ACs where the CR framework's `block-NDA via combined Christian + Muslim ≥ 30 %` rule fires.

| District | n ACs with combined-minority block |
| --- | ---: |
| Kottayam | 5 |
| Ernakulam | 6 |
| Pathanamthitta | 4 |
| Idukki | 5 |
| Kollam | 3 |
| Alappuzha | 5 |

If BJP peels off 8-10 % of Christian sub-rite voters (Latin Catholic, CSI) in these seats, the combined-minority threshold no longer fires. Result: NDA becomes plausibly competitive in seats where Muslim alone (15-25 %) isn't enough to block.

**Counter-intuitive implication**: the strongest defense of Muslim political influence in Kerala isn't a Muslim mobilisation campaign — it's **preserving the Christian-Muslim coalition**. BJP's Christian sub-rite play (CSI fragmentation, Latin Catholic outreach — see `christian.md`) is **also the most effective indirect attack on Muslim coalitional leverage**. Muslim community's two modes split here:
- **Direct-majority mode** (Malappuram) — unaffected by Christian shifts.
- **Coalition-partner mode** (central Kerala) — directly weakened. Muslim community's bargaining position contracts toward its direct-share when the coalition fragments.

### 4f. Where NDA already has a path

Only 27 of 140 ACs have NDA structurally unblocked. The 2 documented `stableFor: NDA` ACs are:

- **AC 135 NEMOM** (Trivandrum) — nair-heavy, Christian fractured (CSI 8 % + Latin 6 % cancel), Hindu Nair consolidation. NDA 47.5 → 35.5 → 40.7 %. Declining from 2016 peak but structural floor holds.
- **AC 132 KAZHAKOOTTAM** (Trivandrum) — same nair-heavy + cosmopolitan-Muslim (14 %) too small to block.

Plus a handful of additional Trivandrum/coastal-Hindu ACs where NDA is competitive but doesn't lock. Total NDA-feasible footprint is structurally <30 seats — even in BJP's best Kerala scenario.

---

## §5 — Open hypotheses (to revisit post-walkthrough)

### Hypothesis A — Sunni stability + Mujahid swing (preferred working thesis)

The 2026 Muslim-belt UDF margin reflects **Sunni stability + Mujahid swing**, not uniform mobilisation. Evidence:
- Sunni cohort Δ UDF +6.5 pp (close to statewide baseline)
- Mujahid cohort Δ UDF +8.7 pp (above baseline)
- 36 % of Mujahid ACs went LDF vs 15 % Sunni → Mujahid structurally more competitive

⚠️ Caveated by §2a multi-cleavage problem: the "cohort signal" may reflect EK/AP factional split + Jamaat consolidation, not pure Mujahid identity. Hypothesis remains directionally correct but mechanism is uncertain.

### Hypothesis B — Mujahid as the swing voter

The 14 Mujahid-cohort ACs are the marginal seats in Muslim Kerala. Whoever wins Mujahid wins the Muslim-belt margin.

⚠️ Same caveat — "Mujahid" here is the cohort label, which conflates theological and factional.

### Hypothesis C — Two Muslim Keralas vote differently

Sunni Kerala is a UDF stronghold; Mujahid Kerala is competitive. IUML's organisational reach is structurally different across sub-sects.

⚠️ Per Wikipedia + Organiser, the distinction *within* IUML is between Sunni-establishment (firm IUML control) and Mujahid (treated as a "pressure group within IUML"). Hypothesis C aligns with institutional observation.

### Hypothesis D (NEW — proposed for 2031 watch)

The 11 ACs where NDA share is rising despite structural block (§4c) are the early indicators of whether the structural-exclusion finding holds for 2031. If 2-3 of these cross the 35 % AC-vote threshold, the Kozhikode mixed-muslim cluster becomes genuinely competitive even with intact Muslim community support.

---

## §6 — Falsifiers / what would weaken these findings

- **Mujahid cohort geographically concentrated in 1-2 districts** → cohort might just be "this cluster" effect. ✅ Partially addressed in §2a: Mujahid-cohort ACs span 7 districts. Falsifier weakened.
- **The 14 Mujahid ACs include SC-reserved seats** → cohort label misleading. Worth checking.
- **OSM Mujahid signal too sparse** → cohort might capture "low Muslim density + 1-2 Mujahid mosques" rather than genuine Mujahid majority. Coverage of sub-sect tagging is thinner in southern Kerala.
- **2021 was anomalous for Mujahid** → if there was a one-off LDF push in Mujahid areas in 2021, the +8.7 in 2026 is a single-cycle correction.
- **Welfare Party / SDPI vote redistribution** → if WPI got 5-10 % in Mujahid ACs in 2021 but stood down behind UDF in 2026 (per §2e), the UDF swing might just be absorbing WPI's vote share, not converting LDF voters.
- **2031 cycle reversal** of the Mujahid Δ → 2026 was cycle-specific.
- **Survey microdata** showing Muslim voters in cohort ACs cited sub-sect-specific motivators at differential rates would strengthen the cohort claim; absence weakens it.
- **EK Sunni vs AP Sunni differential outcomes** would falsify the simple "Sunni stable" story by showing within-Sunni LDF support (consistent with §2a's caveat).
- **Christian-belt BJP push fails** → if BJP's CSI/Latin outreach yields nothing in 2031, §4e's "most actionable target" claim weakens.

---

## §7 — Open data needs (before walkthrough page-build)

- [ ] **Manual hereditary sanity-check** — verify no Muslim political families in Malappuram are missed by the top-3-per-cycle audit (Kunhalikutty, Hameed, Madani, Basheer family lines).
- [ ] **List ACs per Muslim cohort** with district, Muslim share, alliance shares 2021/2026. Sanity-check cohort assignments by hand. Analogous to `walkthroughs-christian-data.ts COHORT_AC_LIST`.
- [ ] **EK / AP factional proxy** — if any AC-level data exists on Samastha vs Kanthapuram dominance (madrasa networks, ulama council affiliations), build a faction layer.
- [ ] **Multi-cycle swing per cohort** — re-run cohort × UDF margin for 2011/2016/2021/2026. Is the +8.7 Mujahid 2026 swing unusual vs cohort history? Critical for §5 Hypothesis A.
- [ ] **Mujahid LDF-winner identification** — list the 5 LDF-winning Mujahid ACs by name/district/margin. Look for a common factor.
- [ ] **Welfare Party / SDPI / minor-Muslim-party share per cohort, 2021 vs 2026** — quantify the Jamaat-WPI consolidation effect.
- [ ] **Sunni LDF-winner identification** — list 7 LDF-winning Sunni ACs. Are they low-Muslim cosmopolitan ACs where Sunni is technically dominant by POI count but Muslim share is low?
- [ ] **Swing R² for Muslim cohort** — extend `analyze-subrite-cohorts.ts` to compute Δ UDF R² for Muslim cohort vs Muslim share. If cohort R² ≈ share R² for swing, sub-sect identity matters for direction even though it doesn't matter for level.
- [ ] **IUML / INC / WPI candidate breakdown by cohort** — did the UDF candidate in Mujahid ACs differ from the UDF candidate in Sunni ACs (party / Muslim-identity / etc.)?
- [ ] **Mitigation tests (M1/M2/M3) for Muslim cohort** — parallel to `analyze-christian-mitigations.ts`. Hindu-NDA absorption test, same-district control, within-cohort by Muslim-share heterogeneity.

---

## Appendix A — Methodology

### A.1 Data sources

| Layer | Source |
| --- | --- |
| Per-AC sub-sect cohort | `subrite-bins.ts` (`muslimSubRiteCohortFor`) |
| Per-AC voter-share | `religious-pois.ts` (`getReligiousSignatureForAC`) |
| Sprint 2 analysis | `scripts/analysis/analyze-subrite-cohorts.ts` |
| Muslim-belt premium (pre-OSM) | `scripts/analysis/analyze-muslim-belt.ts` |
| OSM raw | `data/raw/osm/places-of-worship-kerala.json` (gitignored) |
| OSM classified inventory | `data/ac-religious-pois.json` |
| Community-relevance per-AC | `data/community-relevance.json` + `src/lib/data/community-relevance.ts` |
| Tests | `src/lib/data/religious-pois.test.ts`, `community-relevance.test.ts` |
| Page (NOT YET BUILT) | `src/pages/walkthroughs-muslim-page.tsx` (planned) |

### A.2 Universe definitions

- `analyze-muslim-belt.ts` uses ≥ 70 % Muslim ACs (n=11) for premium history, Malappuram non-reserved (n=15) for strategy analysis.
- Excludes Wayanad's 3 ST seats + Wandoor SC seat (reservation forces candidate choice).
- Community-relevance "Muslim-presence" universe: Muslim ≥ 10 % OR primary driver in {muslim, both-christian-muslim} = 113 ACs.

### A.3 OSM cohort layer (POI-derived)

Same pipeline as Christian (`scripts/pipeline/classify-osm-pow.ts`). Muslim-specific notes:
- Mosque tagging less consistent than church tagging in OSM. Many mosques tagged just `amenity=place_of_worship + religion=muslim` without `denomination=*`.
- Sub-sect inference relies on `denomination` tag where present, plus name-regex patterns (e.g. "Mujahid", "Salafi", "Jamia", "Sunni").
- Coverage of sub-sect-specific tagging is thinner in southern Kerala than in Malappuram/Malabar. Northern Kerala mosques tend to have richer tagging.

### A.4 What our data CAN'T see

- **EK Sunni vs AP Sunni distinction** — politically meaningful (Kanthapuram vs SKSSF factions), but OSM tag coverage doesn't separate them.
- **EK Mujahid vs AP Mujahid pre-2016** — merged in 2016; historical data may need separate handling.
- **Jamaat-e-Islami / WPI penetration per AC** — separate organisational tradition, not captured by Sunni/Mujahid cohort.
- **Madrassa networks** (more denominationally distinct than mosques) — separate data source needed.
- **Wakf-board property records** — could provide ownership-by-faction data; not currently sourced.
- **AC-level Hindu sub-caste** — district-level overlay only; affects §4d's within-Hindu scenario modelling.

### A.5 District FE absorption finding

For Muslim share, district FE absorbs the Pearson signal entirely (β=+0.016, p=0.795). The simple-Pearson "Muslim share predicts UDF Δ" is driven by between-district variation (Malappuram clustering), not within-district. Cohort-level analysis is the only way to detect within-district sub-sect effects.

### A.6 Key constants

Locked in `religious-pois.ts`:

```
COHORT_YEAR = 2025
COHORT_VOTER_SHARE_THRESHOLD = 5      // % of voters
MIN_CLASSIFIED_FOR_COHORT = 3         // POIs of that religion
LOW_CONFIDENCE_CLASSIFIED_N = 10
```

---

## Appendix B — Cross-references

- **`christian.md`** — sibling sub-rite analysis. The "INC-direct outperforms alliance" finding holds across both belts; the "empty INC-Hindu bucket" is the Muslim-specific structural asymmetry. CSI fragmentation findings are directly relevant to §4e (Christian-Muslim coalition belt).
- **`udf.md §4`** — Muslim-belt strategy section in the UDF reference. Captures the same 15-AC Malappuram analysis.
- **`ldf.md §6`** — Muslim-majority ACs absorbed 108 % of LDF loss to UDF (vs Christian-heavy's 122 %). Both lean overwhelmingly UDF in the flow decomposition.
- **`nda.md §7`** — Malappuram structural exclusion. 9 of 19 NDA structural-exclusion ACs are in Malappuram.
- **`community-relevance.md`** — per-AC framework powering §1d, §2d, §3f, §4a, §4c-f.
- **`data/raw/osm/README.md`** — full pipeline documentation for OSM POI classification.

---

## Appendix C — External-commentary sources (May 2026 web-search verification)

Used to verify Sprint-2 + CR findings (per §10b in prior draft, now distributed inline):

- [The churn in Muslim politics in Kerala (R. Santhosh, India Seminar 2022)](https://india-seminar.com/2022/758/758-08%20R.%20SANTHOSH.htm) — primary source for the EK/AP factional cleavage claim.
- [Strategic Muslim Voting Patterns in Kerala (Organiser, 2024)](https://organiser.org/2024/07/14/247222/bharat/strategic-muslim-voting-patterns-in-kerala-how-community-interests-influence-local-state-and-national-elections/)
- [Salafism and Pragmatic Politics in India (Hudson Institute)](https://www.hudson.org/democracy/salafism-pragmatic-politics-india-mohammed-sinan-siyech)
- [Kerala Nadvathul Mujahideen — Wikipedia](https://en.wikipedia.org/wiki/Kerala_Nadvathul_Mujahideen) — KNM EK vs AP faction history + 2016 merger.
- [Indian Union Muslim League — Wikipedia](https://en.wikipedia.org/wiki/Indian_Union_Muslim_League)
- [Mujahid-BJP bonhomie causes tremors in Kerala (The Federal, 2024)](https://thefederal.com/states/south/kerala/kerala-knm-conference-sparks-fresh-debate-over-its-ties-with-sangh-parivar) — §2f Mujahid-BJP softening source.
- [Big deal: Merger of two factions of a Muslim group (Scroll, 2017)](https://scroll.in/article/865455/big-deal-merger-of-two-factions-of-a-muslim-group-could-realign-political-forces-in-kerala)
- [Why Samastha mum on Welfare Party's support to UDF? (Onmanorama, March 2026)](https://www.onmanorama.com/news/kerala/2026/03/29/jamaat-e-islami-politicak-wing-welfare-party-supports-udf-assembly-polls-samastha.html) — §2e source.
- [Nilambur by-poll campaign: Welfare Party offers support to UDF (The Federal)](https://thefederal.com/category/states/south/kerala/nilambur-by-poll-welfare-party-supports-udf-campaign-polarising-turn-191791)
- [IUML Emerges Kingmaker As Congress-Led UDF Sweeps Kerala (Outlook, May 2026)](https://www.outlookindia.com/national/iuml-emerges-kingmaker-as-congress-led-udf-sweeps-kerala) — Kozhikode "20-year-LDF-stronghold" framing that corrected our "structural restoration" claim.
- [Analysis | Candidate selection, youth push turbocharge IUML (Onmanorama, May 2026)](https://www.onmanorama.com/news/kerala/2026/05/05/analysis-candidate-selection-youth-push-turbocharge-iuml.html)
- [How A Century-Old Sunni Body's 'Warning Against Political Islam' (Swarajya)](https://swarajyamag.com/kerala/how-a-century-old-sunni-bodys-warning-against-political-islam-revealed-the-fault-lines-within-keralas-muslims) — Samastha-vs-Jamaat fault-line.
