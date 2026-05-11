# Muslim — findings reference

**Audience**: future analysis (agent + author). **Muslim walkthrough page not yet built** — this file is the planning + analysis reference for when it lands. Page name will be `/walkthroughs/muslim-walkthrough` (`src/pages/walkthroughs-muslim-page.tsx` + `src/pages/walkthroughs-muslim-data.ts`).

**Doc shape**: 4 substantive sections matching the planned walkthrough structure, plus appendices for methodology / glossary of factions / cross-references / external sources. Sprint-2 cohort analysis + community-relevance (CR) framework + external-commentary verification (May 2026) are integrated inline; each major claim flagged for source and confidence.

**New readers — start here**: §1 for the headline finding (Muslim political leverage decomposition), §2 for sub-sect background, §3-§4 for UDF/NDA strategy. If "EK Samasta" / "AP Samasta" / "Mujahid" / "Jamaat" are unfamiliar terms, **read Appendix B Glossary first**.

**Sources consolidated**: `muslim-walkthrough-draft.md` (early Sprint 2 era) + `muslim-belt-deep-dive.md` (pre-OSM UDF strategy analysis) (both deleted on consolidation).

---

## TL;DR

- **Muslim community is ~28 % of Kerala but politically consequential in 86 of 140 ACs (61 % — majority of all Kerala ACs)** — 21 outright-controlled (Muslim ≥ 50 %) + 65 swing-bloc / co-driver seats. **A demographically-uniform 28 % bloc would have 0 controlled seats** — leverage comes from geographic concentration, not headcount.
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

### 1c. Punch-above-weight mechanism in action — AC 53 KONGAD (Palakkad)

A worked example showing **how a 29 % minority Muslim community can be the decisive vote** in a 71 % Hindu-Christian AC:

**AC 53 Kongad context**:
- **Demographics**: Muslim 29 %, Christian 5 %, Hindu ~66 % (Palakkad cosmopolitan, no Hindu sub-caste lock).
- **History**: LDF won in 2016 and 2021 (Hindu Ezhava-Tiyya CPI(M) base). **2026: UDF flipped the seat by +2.5 pp.**
- **2026 vote split**: UDF 42.2 % / LDF 39.7 % / NDA 16.8 %.

**Decomposed within-community contribution to UDF** (illustrative assumptions: Muslim 70/20/10, Christian 60/30/10):

| Community | AC share | → UDF | → LDF | → NDA |
| --- | ---: | ---: | ---: | ---: |
| Muslim (29 %) | | **20.3** | 5.8 | 2.9 |
| Christian (5 %) | | 3.0 | 1.5 | 0.5 |
| Hindu (66 %, back-calculated) | | 18.9 | 32.4 | 13.4 |
| **2026 actual** | | **42.2 %** | **39.7 %** | **16.8 %** |

The Hindu vote splits **29 % UDF / 49 % LDF / 20 % NDA** — Hindu Kongad is fundamentally an LDF seat (almost half going LDF). UDF wins this AC because **Muslim community (29 %) delivers 20 of the 42 UDF pp** — almost half of UDF's total share.

**Counterfactual** — if the 29 % Muslim community had voted 50/50 UDF/LDF instead of 70/20/10:
- UDF: 14.5 (Muslim) + 3.0 (Christian) + 18.9 (Hindu) = **36.4 %**
- LDF: 14.5 + 1.5 + 32.4 = **48.4 %**
- LDF would win by **+12 pp** instead of losing by 2.5 pp.

**The Muslim community at 29 % of the AC delivered a 14 pp swing** (LDF +12 → UDF +2.5) — equivalent to roughly half the AC's effective political weight. **That's "punching above weight": 29 % of voters producing ~50 % of the effective political force.**

Same mechanism, less cleanly: AC 8 Taliparamba (Muslim 37 %, UDF +6.5 pp flipped), AC 73 Kodungallur (Muslim 22 % + Christian 22 % combined, UDF +5.6 pp flipped). The structural pattern: **bloc-organised Muslim community at 20-40 % AC share routinely punches at 40-60 % of effective political weight**, because they vote ~70-85 % UDF (bloc-style via IUML) while the Hindu majority splits roughly 3 ways.

---

## §2 — Sub-sects + Muslim sub-type taxonomy

### 2a. Three cross-cutting cleavages — only one is in our data

Kerala Muslim politics has at least three meaningful internal divisions (see Appendix B for full glossary):

| Cleavage | Distinction | Our data sees it? |
| --- | --- | --- |
| **Theological** | Sunni mainstream vs Salafi-reformist Mujahid (KNM) | ✅ Yes — OSM mosque tags |
| **Factional within Sunni** | EK Samasta (IUML/UDF-aligned) vs AP Samasta (Kanthapuram, LDF-tactical) | ❌ No |
| **Factional within Mujahid** | EK Mujahid (IUML-aligned) vs AP Mujahid (LDF-leaning; merged 2016) | ❌ No |
| **Organisational** | Jamaat-e-Islami (political wing: WPI / Welfare Party) — separate tradition | ❌ No |

The OSM-derived cohort layer (`subrite-bins.ts`) classifies ACs as Sunni (n=48) / Salafi-Mujahid (n=14) / below-threshold (n=78). **The politically-meaningful cleavage is the EK / AP factional split, which cross-cuts both theological cohorts.** Per India Seminar (R. Santhosh 2022): *"the A.P. Samasta faction forged a political affiliation to the LDF, especially to CPI(M), as a tactical move to checkmate the E.K. Samasta faction."*

### 2a-bis. Which of our findings are affected by this gap?

Honest accounting — the cleavage gap **invalidates some claims, refines others, leaves most untouched**:

| Finding category | Affected? | Why |
| --- | --- | --- |
| **Aggregate Muslim community claims** (§1 leverage, §1c Kongad mechanism, §3 UDF strategy menu, §4 NDA exclusion) | ✅ Robust | These claim "Muslim community" as a bloc; bloc-organisation is what matters, not internal sub-sect identity. EK/AP/Jamaat all vote UDF or LDF, not NDA — the aggregate is correct. |
| **Cohort-level direction** (Mujahid Δ +8.7 vs Sunni +6.5; Mujahid 36 % LDF retention vs Sunni 15 %) | ✅ Real signal | The numbers are real; cohort labels are clean buckets. The *direction* of "Mujahid more bipartisan" survives. |
| **Cohort-level MECHANISM** ("Mujahid voters swung harder", "IUML's Mujahid relationship is weaker") | ⚠️ Suspect | These attribute behaviour to theological identity. The actual mechanism is likely the AP-faction LDF-tactical alignment (cross-cuts both cohorts) + Jamaat/WPI 2026 consolidation. Per Appendix B, ~30-40 % of "Mujahid cohort behaviour" probably reflects AP-faction voters and Jamaat presence inside those ACs rather than Mujahid theological distinctiveness. |
| **Per-AC predictions** (§4d Kozhikode N math, §4c rising-NDA tier thresholds) | ⚠️ Margin of error | The assumed Muslim vote splits (70/20/10 for cosmopolitan, 85/12/3 for iuml-stronghold) ignore EK/AP variation. Real splits in mixed-cohort ACs could be 60/30/10 or 80/15/5 depending on factional mix. Conclusions are illustrative within ±5-10 pp uncertainty bands. |

**Bottom line**: structural claims (leverage, strategy menu, NDA exclusion, hereditary contrast) are not at risk. Claims that say *why* Muslim sub-cohorts behave differently are at risk and should be framed as "we observe X; the mechanism could be sub-sect, factional, or organisational — we can't directly attribute."

### 2a-ter. Why we still reference the un-measured cleavages

We acknowledge EK/AP and Jamaat in this doc even though we can't measure them, because:
1. **Mainstream commentary references them** (India Seminar, Wikipedia, Hudson Institute — see Appendix D); if we ignored them, our explanations would diverge from how the political world actually discusses Muslim Kerala.
2. **They're the most likely mechanism** for the cohort-level swing patterns we observe. Saying "Mujahid swung harder, mechanism unknown" is worse than saying "Mujahid swung harder, likely partially driven by AP-faction LDF alignment + Jamaat consolidation, which we can't directly measure."
3. **The walkthrough page needs them as glossary** — readers will encounter "AP-Samasta" / "Kanthapuram faction" / "Welfare Party" in Kerala election coverage; the doc should explain them even if we can't precisely quantify their electoral impact.

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

### 3a. UDF's strategic playbook in Muslim Kerala — summary

UDF's approach to Muslim Kerala is built around three structural choices: **IUML alliance, candidate-religion discipline, institutional (not personal) candidate selection**. All three together produce the consistent UDF performance in Muslim-majority ACs.

| Dimension | UDF's choice in Muslim Kerala | UDF's choice in Christian belt | What it reveals |
| --- | --- | --- | --- |
| **Coalition partner** | IUML (institutional alliance, ~80 % strike rate) | KC factions + direct INC | UDF needs IUML; IUML is not just an ally but the entire Muslim-belt path |
| **Candidate religion at non-reserved minority-majority seats** | **Always Muslim** (IUML or INC-Muslim) | **Mixed freely** — INC-Hindu and INC-Christian both contest ≥40 %-Christian seats | UDF treats Muslim-Malappuram as a politically-defined-by-Muslim-identity zone; Christian belt as mix-and-match |
| **INC-direct vs alliance** | INC-Muslim swung +12.9 pp; IUML alliance swung +8.8 pp | INC-direct outperforms alliance route by ~3-4 pp | INC-direct premium holds across both belts |
| **Candidate selection logic** | Institutional party rotation | Personal coalition + family inheritance | Two distinct organisational models inside one UDF |
| **Hereditary seats (per `hereditary-seats.json` audit, 2011-2026)** | **0** | **5** (all in Christian belt) | Muslim Malappuram = institutional; Christian belt = dynastic |
| **2026 institutional performance** | IUML won 22/27 (80 %); Kunhalikutty +85,327; Fathima Thahiliya = first IUML woman MLA | KC + INC fields varies | IUML institutional machine remains the most reliable UDF vote-getter |

**The single most important strategic claim**: **UDF's strategy menu in Muslim Malappuram is structurally narrower than in the Christian belt** — IUML or INC-Muslim only. The "empty INC-Hindu bucket" is the structural fingerprint of how UDF treats Muslim political identity as non-substitutable. In 16 non-reserved Malappuram ACs across all of our data, **UDF never put a Hindu candidate in front of Muslim voters.** The one INC-Christian exception (Thavanur, Adv. V.S. Joy) swung only +4.1 pp vs the cohort's +8.8 pp — the rule punishes deviations.

### 3b. The 15 Malappuram non-reserved ACs (worked detail)

For completeness, the 15-AC analysis in `analyze-muslim-belt.ts`:

| Strategy | n | Won | Mean Δ UDF |
|---|---:|---:|---:|
| **Muslim Alliance (IUML)** | 12 | 12 | **+8.8 pp** |
| **INC-Muslim** | 2 | 2 | **+12.9 pp** |
| **INC-Hindu** | **0** | — | — |
| Special (INC-Christian: Thavanur) | 1 | 1 | +4.1 pp |
| **Total** | **15** | **15** | |

UDF won 15 of 15. INC-direct beat IUML alliance by ~4 pp (parallel to Christian-belt finding). The Thavanur exception underperformed the cohort — INC-Christian at a 67 %-Muslim seat doesn't get the same swing as INC-Muslim.

### 3c. Sampling caveat on the "no Muslim dynasties" claim

The hereditary audit is top-3-per-cycle 2011-2026 only. Muslim political families with cousins / second-generation politicians who don't break top-3 wouldn't appear. Kunhalikutty / Hameed / Madani / Basheer family lines worth manual sanity-check before publication. The "institutional vs dynastic" contrast is robust at the documented-hereditary level; deserves the caveat at the broader-family-political-influence level.

### 3d. Why Muslim Kerala is institutional (not dynastic) — interpretation

The Sunni-establishment-Samastha relationship with IUML enforces candidate selection at the party level rather than family level. IUML's institutional discipline produces:

- Multi-cycle candidate rotation (no figure becomes a permanent seat-owner the way Mani / Chandy / Jacob did in Kottayam / Ernakulam)
- Cross-AC candidate placement (P.K. Kunhalikutty has run from Vengara + Malappuram across cycles; not anchored to one constituency)
- Lower vulnerability to personality-based defections (the IUML structure absorbs candidate exit better than personal-coalition KC factions)

By contrast, Christian-belt UDF's KC + INC personal-coalition model concentrates political capital in family lines — strong when the founding figure is in their prime, vulnerable to succession discontinuities (the Pala 2021 KC(M) faction shift to LDF being the marquee case).

---

## §4 — NDA strategy

### 4a. What "NDA structurally blocked" actually means

**113 of 140 ACs (81 %)** have `NDA.blockFrom` set in the community-relevance framework. This number deserves precise unpacking because it doesn't mean *NDA is permanently barred from winning*. It means something narrower but more useful.

#### The block fires when one of these is true

| Block condition | Fires in n ACs | Mechanism |
| --- | ---: | --- |
| Muslim ≥ 25 % | 61 | Hindu-only NDA can't reach majority unless Muslim community defects or fragments (historically: ~5 % NDA share, "barring a minuscule minority" per Wikipedia) |
| Christian ≥ 20 % AND UDF-aligned coordinated (no CSI fragmentation) | 28 | Christian sub-rite voting direction is UDF-up; absent CSI fragmentation, NDA can't get Christian votes |
| Christian + Muslim combined ≥ 30 % | ~24 | Minority coalition absorbs enough vote share that Hindu-only NDA can't reach majority |

#### What the block IS — three things at once

1. **A floor on minority anti-NDA voting that's held across 3 cycles.** In 113 ACs, NDA share has stayed below the level needed to overtake the leading non-NDA alliance, every cycle since 2016. The block is *empirically observed* historical behaviour, not a theoretical assertion.
2. **A structural arithmetic constraint given current voting patterns.** With Muslim ≥ 25 % voting ~5 % NDA + Christian voting ~10 % NDA + Ezhava/Tiyya Hindu base voting ~10 % NDA, NDA's path to majority in these ACs requires either (a) breaking the minority bloc, (b) winning a super-majority of the Hindu vote, or (c) wave-level disruption.
3. **A framework-level prediction** that we apply uniformly. The block fires by mechanical rule (Muslim ≥ 25 %, etc.) — it's a *coarse classifier*, not a fine-grained forecast for any individual AC.

#### What the block is NOT — five things worth being clear about

1. **NOT a claim that NDA can never win these seats.** Nemom (currently `stableFor: NDA`) shows NDA can hold a Christian-fragmented + Nair-heavy seat. The 27 NDA-feasible ACs are where the structural conditions are absent; the other 113 are where they're present *under current patterns*.
2. **NOT a claim about NDA vote share, only about NDA victory.** §4c shows NDA share is *rising* in 11 of the 113 blocked ACs — Kozhikode N from 23 % to 28 % over 10 years. The block constrains *who wins the seat*, not *what NDA's vote share is*.
3. **NOT a permanent feature.** The block depends on (a) Muslim community continuing to vote ~5 % NDA, (b) Christian community continuing to vote ~10 % NDA, (c) the EK/AP factional dynamics keeping Muslim cohesion intact. If any of these change materially, the block weakens. The 11 rising-NDA-in-block ACs (§4c) are the early indicators.
4. **NOT independent of margin.** A 25 %-Muslim AC with a +25 pp UDF margin is robustly blocked; the same AC with a +1 pp UDF margin is only one-cycle-trend away from being competitive. The block is a *coarse classifier* — within "blocked," ACs vary in how close to flippable they are.
5. **NOT the same as "Muslim community is hostile to BJP."** It's an observation about the *electoral arithmetic* given current voting patterns. The Mujahid-BJP softening (§2f) is a behavioural signal that the underlying patterns are shifting; the block math will follow if the underlying behaviour shifts enough.

#### The honest framing for the walkthrough

The block claim is: "in 81 % of Kerala ACs, NDA's path to victory at current minority voting patterns is mathematically constrained — they need to either break the minority bloc, achieve unprecedented Hindu consolidation, or wait for a wave-level disruption. The block is not absolute; it describes the structural difficulty given today's behaviour. Some ACs are far from the boundary (Malappuram); some are close (Kozhikode N, Palakkad, Nattika — see §4c)."

This is consistent with the data without overstating the durability or overstating BJP's competitiveness.

### 4b. Inside-Malappuram NDA — no measurable progress

Of 16 non-reserved Malappuram ACs, NDA trend distribution: **0 rising, 11 flat (3-7 % share), 5 declining**. Wandoor (SC) went 6 → 4 → 0 %. The structural-exclusion finding is robust at the level of *alliance-victory math*.

⚠️ **Note on framing**: this doesn't mean Sangh outreach in Malappuram is producing nothing — just no measurable vote-share shift in our 3-cycle window. Worth softening "essentially noise" framing to "no measurable progress despite Sangh outreach" — leaves space for the trend to change in 2031.

### 4c. Rising NDA inside Muslim-blocked seats (12 ACs — with breakthrough math)

NDA share is rising in 12 Muslim-presence ACs while the mechanical Muslim block holds. The interesting question: **how much Hindu vote would NDA need to consolidate to actually break through?**

**Method**: assume Muslim community votes 70/20/10 UDF/LDF/NDA in cosmopolitan and mixed-muslim ACs (85/12/3 in iuml-stronghold); assume Christian votes 60/30/10; back-calculate Hindu vote split from actual 2026 AC vote shares; compute the Hindu-share NDA would need to overtake the current winner. ⚠️ These splits are **illustrative assumptions**, not measured — the within-Muslim and within-Christian distribution is not in our data layer.

| AC | M% / C% / H% | 2026 vote (U/L/N) | Hindu→NDA today | Hindu→NDA needed | Δ needed |
| --- | --- | --- | ---: | ---: | ---: |
| **27 Kozhikode N** | 41 / 2 / 57 | 36 / 35 / 28 | 42 % | 56 % | **+14 pp** |
| **56 Palakkad** | 34 / 3 / 63 | 42 / 23 / 33 | 47 % | 62 % | **+15 pp** |
| **68 Nattika** | 20 / 16 / 64 | 33 / 37 / 29 | 39 % | 54 % | **+14 pp** |
| **28 Kozhikode S** | 41 / 2 / 57 | 41 / 33 / 25 | 37 % | 66 % | +29 pp |
| 127 Varkala | 25 / 4 / 71 | 39 / 40 / 20 | 24 % | 53 % | +29 pp |
| 101 Poonjar | 16 / 41 / 42 | 39 / 35 / 25 | 45 % | 80 % | +35 pp |
| 52 Ottappalam | 44 / 2 / 54 | 29 / 44 / 25 | 38 % | 74 % | +37 pp |
| 61 Chelakkara | 29 / 10 / 61 | 29 / 47 / 23 | 31 % | 70 % | +40 pp |
| 84 Kunnathunad | 20 / 35 / 45 | 44 / 30 / 25 | 43 % | 86 % | +43 pp |
| 116 Karunagappally | 29 / 5 / 66 | 48 / 32 / 19 | 23 % | 68 % | +45 pp |
| 121 Punalur | 21 / 21 / 58 | 35 / 50 / 11 | 11 % | 81 % | +70 pp |
| 82 Eranakulam | 21 / 34 / 45 | 57 / 23 / 18 | 27 % | >100 % | impossible |

**Three patterns**:

1. **Within reach (Δ ≤ 15 pp)** — **Kozhikode N + Palakkad + Nattika**. NDA already has 28-33 % AC vote share and ~40-47 % of the Hindu vote. To win, they need to consolidate roughly two-thirds of Hindus (62 % at Palakkad, 56 % at Kozhikode N). Significant lift but **not implausible at 2031 trajectory**, especially given Mujahid-BJP softening (see §2f).

2. **Far reach (Δ 25-45 pp)** — **Kozhikode S, Varkala, Poonjar, Ottappalam, Chelakkara, Kunnathunad, Karunagappally**. NDA would need 65-86 % of the Hindu vote — would require both breaking the Ezhava-LDF alignment AND consolidating Nair vote behind BJP. Not impossible but unprecedented in Kerala.

3. **Out of reach (Δ > 50 pp)** — **Punalur, Eranakulam**. Punalur's NDA share collapsed to 11 % in 2026 (declining trajectory under noise). Eranakulam is structurally hostile to NDA (UDF 57 % from large Christian + Muslim minority).

**Implication**: even *rising* NDA in Muslim-blocked seats is mostly within-noise gain at current trajectories. **The 3 ACs in the "within reach" tier are the genuine 2031 watch-list seats** — and they're concentrated where Muslim is not the dominant minority blocker (Palakkad 34 %, Nattika 20 %, Kozhikode N 41 % mixed-muslim where Muslim community is internally split). The Malappuram iuml-stronghold zone has no AC in any reach tier.

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

BJP cannot win Muslim Kerala (mode (a) lock). Pure-Hindu Kerala is saturated (Ezhava-LDF + Nair-BJP-curious already polarised). **The actionable target is the Christian-Muslim coalition belt of central Kerala** — 44 ACs where Christian ≥ 15 % AND Muslim ≥ 10 % co-anchor a minority block.

**Quantitative test — what does a 10 % Christian defection from UDF actually do?**

We modelled: for each of the 44 coalition-belt ACs, shift 10 % of Christian voters from UDF to NDA. Result:

- **3 ACs flip outright** — Pala, Kanjirappally, Chirayinkeezhu.
- **Mechanism is mostly UDF→LDF (spoiler effect), not UDF→NDA direct.** Pala flips UDF→LDF because NDA gains push UDF below LDF in a 3-way race. Only in the highest-Christian ACs (Pala 52 %, Kanjirappally 43 %, Poonjar 41 %) does even a modest defection matter.
- **Most coalition-belt ACs are robust to 10 % Christian defection** — UDF margins are 8-25 pp, and 1.6-4.0 pp of NDA gain isn't enough.

| Outcome | n | Note |
| --- | ---: | --- |
| UDF wins → still UDF wins | 30 | Robust |
| LDF wins → still LDF wins | 9 | Robust |
| UDF wins → LDF wins (NDA spoiler) | 3 | **Pala, Kanjirappally, Chirayinkeezhu** |
| UDF wins → NDA wins (direct flip) | 0 | None |
| LDF wins → NDA wins | 0 | None |
| Other | 2 | Already-NDA seats unaffected |

**Honest finding**: 10 % Christian defection alone *doesn't dramatically flip the coalition belt*. Earlier drafts claimed "8-10 % Christian peel-off reduces the block from 'blocking' to 'competitive' in ~28 ACs" — **this overstated the effect**. The actual mechanism is more selective: only the heavily-Christian Kottayam-Idukki sub-belt (Pala / Kanjirappally / Poonjar / Thodupuzha / Pathanamthitta) is highly leveraged on Christian alignment.

**What would actually break the belt at scale**: ≥ 25-30 % Christian defection — which is what **Twenty20 demonstrated as conceptually feasible**.

### 4e-bis. The Twenty20 case — proof-of-concept for fragmentation

The Kitex / Sabu Jacob group launched Twenty20 (T20) as a state-level political experiment in 2015. In 2021, T20 contested 8 central-Kerala ACs and made a serious dent:

- **Kunnathunad 2021**: T20 came 2nd with **37 % vote share**. Conventional UDF vote share collapsed by ~25 pp. LDF won the seat from UDF.
- **Piravom 2021**: T20 came 3rd at 17 %, splitting the Christian vote.
- **Poonjar, Kothamangalam, etc.**: T20 picked up 10-25 % Christian/business-elite vote share.
- **In 2026**: T20 essentially absent. Those voters mostly went back to UDF — visible in our framework as the *post-T20 rebound* (Poonjar NDA 14 → 2 → 25 %, Kunnathunad NDA 11 → 5 → 25 %).

**Why this is strategic brilliance (from a fragment-the-coalition perspective)**:

1. **T20 didn't try to WIN — it tried to fragment.** Their candidates weren't expected to govern; their effect was to shatter UDF's Christian-business-elite coalition.
2. **The fragmentation actually worked.** Kunnathunad flipped UDF→LDF in 2021 because T20 absorbed 25 % of UDF's Christian base. That's 5× more defection than our 10 % modelling — and it produced exactly the outcome the model predicts at that magnitude.
3. **T20's voters didn't go to BJP** — they went to LDF or back to UDF. But BJP didn't need them to. T20 demonstrated that **Christian voters in central Kerala are moveable** with the right candidate, the right framing, and a religious-identity-adjacent appeal.
4. **BJP's CSI / Latin Catholic outreach is the second-generation version of the T20 playbook** — except BJP wants to ABSORB the voters rather than just fragment them. That's a harder ask, but T20 proved the underlying vote-share elasticity exists.

**Strategic implication**: T20's lesson for BJP isn't "build a proxy party" — it's "the Christian central-Kerala vote is the most actionable target in Kerala, and 25 % defection is achievable with the right vehicle." BJP's Christian play (CSI fragmentation per `christian.md` §3, Latin Catholic outreach via NDA candidates) operates on the same hypothesis with a harder absorption goal.

### 4e-ter. What this means for Muslim political influence

The Muslim community's two modes (per §1b) split sharply here:

- **Direct-majority mode (Malappuram)** — entirely unaffected by Christian shifts. NDA-block holds mechanically; the Muslim-establishment IUML axis is robust.
- **Coalition-partner mode (central Kerala)** — **highly exposed** if BJP succeeds at T20-magnitude Christian fragmentation. The coalition that gives Muslim community its swing-bloc leverage in 50 mixed-Christian-Muslim ACs depends on Christian community staying UDF-coalitional. Pala alone shows the mechanism: if Christian-business-elite fragments (T20-style or BJP-direct), Muslim community's coalitional contribution falls below the deciding threshold.

**Counter-intuitive implication**: the strongest defense of Muslim political influence in Kerala isn't a Muslim mobilisation campaign. It's **preserving Christian-Muslim coalitional alignment**. BJP's Christian sub-rite play (CSI fragmentation, Latin Catholic outreach) is **also the most effective indirect attack on Muslim coalitional leverage** — even though it never wins a Muslim vote.

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

## Appendix B — Glossary of Muslim factions + political alignments

Kerala Muslim political organisation has three cross-cutting axes that most readers (including the author) find confusing. This appendix gives a working definition for each, with political alignment.

### B.1 Theological axis — Sunni vs Mujahid

**Sunni** (mainstream Sunni Islam)
- ~80-85 % of Kerala Muslims by population estimate.
- Institutional body: **Samastha Kerala Jamiyathul Ulama** — the council of Sunni religious scholars / ulama.
- Theological tradition: classical Sufi-Sunni, accepts dargah veneration, established religious orthodoxy.
- Political alignment: mostly UDF via IUML, but see B.2.

**Mujahid** (also Kerala Nadvathul Mujahideen / KNM)
- ~10 % of Kerala Muslims. Founded 1950.
- Theological tradition: **Salafi-reformist** — calls for return to pure Islamic practice, rejects Sufi practices, anti-dargah-veneration, more textually conservative.
- Political alignment: mostly UDF via IUML, but with significant factional variation (see B.2).

**Jamaat-e-Islami** (separate ideological tradition)
- ~5 % of Kerala Muslims (estimate).
- Theological tradition: **political Islamist** — emphasises Islamic political/social order; ideologically distinct from both Sunni mainstream and Salafi-Mujahid.
- Political wing: **Welfare Party of India (WPI)** — founded 2011.
- Political alignment: historically critical of both UDF and LDF for not centring Muslim issues; **2026 saw WPI announce UDF support at the Nilambur by-poll** against IUML's wishes — a 2026-specific tactical consolidation.

### B.2 Factional axis — EK Samasta vs AP Samasta (the politically-meaningful split)

The Sunni community split institutionally in 1989 over leadership and political alignment:

**EK Samasta** (Samastha Kerala Jamiyathul Ulama-EK faction)
- Named after EK Aboobacker Musliyar (deceased).
- Larger, older establishment. Generally seen as the dominant Sunni institutional body.
- Political alignment: **firmly IUML / UDF-aligned**. "Mainstay of political support for the Muslim League" (R. Santhosh, India Seminar).

**AP Samasta** (Samastha Kerala Jamiyathul Ulama-AP faction)
- Named after Kanthapuram AP Aboobacker Musliyar.
- Broke away from EK faction. More independent/tactical posture.
- Political alignment: **LDF-tactical**. Per India Seminar: *"forged a political affiliation to the LDF, especially to CPI(M), as a tactical move to checkmate the E.K. Samasta faction."*

The same EK / AP factional split has historically existed within Mujahid (KNM) too:
- **EK Mujahid** (TP Abdulla Koya Madani faction) — IUML-aligned.
- **AP Mujahid** (Hussain Madavoor faction, broke away 2002) — LDF-leaning.
- **Merged in 2016** into one KNM. Political behaviour post-merger less internally divided but earlier voters retain factional loyalties.

### B.3 Political-alignment matrix

| Faction | Theological base | Political alignment |
| --- | --- | --- |
| EK Samasta (Sunni) | Sunni mainstream | IUML / UDF (firm) |
| AP Samasta / Kanthapuram (Sunni) | Sunni mainstream | LDF-tactical (broke from EK) |
| EK Mujahid (KNM) | Salafi-reformist | IUML / UDF |
| AP Mujahid (KNM, pre-2016) | Salafi-reformist | LDF-leaning |
| Jamaat-e-Islami / WPI | Political-Islamist | Historically independent; 2026 tactical UDF |

**What this means for our data**: the OSM-derived cohort layer classifies ACs by *theological* base (Sunni vs Mujahid) based on mosque tagging. It cannot directly observe the *factional* split (EK vs AP) which is the politically-meaningful cleavage. Per §2a, this is the largest known gap in our resolution.

**What "Mujahid more bipartisan" in §2b actually reflects**:
- Pre-2016 AP-Mujahid was LDF-tactical → some Mujahid-cohort ACs went LDF
- AP-Sunni voters who happen to live in Mujahid-cohort ACs added to the LDF share
- Jamaat / WPI voters in Mujahid-cohort ACs contributed to LDF (in 2021) or UDF (in 2026, post-Nilambur)
- The "cohort signal" is real but the mechanism is multi-causal.

### B.4 Other groupings (less politically central but referenced)

- **SDPI / SDPI India** — Social Democratic Party of India. Splinter from the now-banned PFI (Popular Front of India). Minor electoral presence; occasionally contests some seats.
- **INL (Indian National League)** — LDF-aligned Muslim party. Broke away from IUML in the 1990s. Significant in mixed-muslim Kannur/Kozhikode where they hold some local strength.
- **NSC (National Secular Conference)** — small LDF-aligned Muslim political grouping. Minor.
- **PMC (Public Movement of Kerala)** / similar minor outfits — Muslim regional parties; rarely significant at state level.

---

## Appendix C — Cross-references

- **`christian.md`** — sibling sub-rite analysis. The "INC-direct outperforms alliance" finding holds across both belts; the "empty INC-Hindu bucket" is the Muslim-specific structural asymmetry. CSI fragmentation findings are directly relevant to §4e (Christian-Muslim coalition belt).
- **`udf.md §4`** — Muslim-belt strategy section in the UDF reference. Captures the same 15-AC Malappuram analysis.
- **`ldf.md §6`** — Muslim-majority ACs absorbed 108 % of LDF loss to UDF (vs Christian-heavy's 122 %). Both lean overwhelmingly UDF in the flow decomposition.
- **`nda.md §7`** — Malappuram structural exclusion. 9 of 19 NDA structural-exclusion ACs are in Malappuram.
- **`community-relevance.md`** — per-AC framework powering §1d, §2d, §3f, §4a, §4c-f.
- **`data/raw/osm/README.md`** — full pipeline documentation for OSM POI classification.

---

## Appendix D — External-commentary sources (May 2026 web-search verification)

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
