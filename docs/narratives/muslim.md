# Muslim — findings reference

**Audience**: future analysis (agent + author). **Muslim walkthrough page not yet built** — this file is the planning + analysis reference for when it lands. Page name will be `/walkthroughs/muslim-walkthrough` (`src/pages/walkthroughs-muslim-page.tsx` + `src/pages/walkthroughs-muslim-data.ts`).

**Doc shape**: 4 substantive sections matching the planned walkthrough structure, plus appendices for methodology / glossary of factions / cross-references / external sources. Sprint-2 cohort analysis + community-relevance (CR) framework + external-commentary verification (May 2026) are integrated inline; each major claim flagged for source and confidence.

**New readers — start here**: §1 for Muslim Kerala demographics + AC-level geography, §2 for sub-sect background, §3-§4 for UDF / NDA strategy. If "EK Samasta" / "AP Samasta" / "Mujahid" / "Jamaat" are unfamiliar terms, **read Appendix B Glossary first**.

**Sources consolidated**: `muslim-walkthrough-draft.md` (early Sprint 2 era) + `muslim-belt-deep-dive.md` (pre-OSM UDF strategy analysis) (both deleted on consolidation).

---

## TL;DR

- **Muslim community is ~28 % of Kerala**, **geographically concentrated**: Malappuram (~70 % Muslim across most ACs) is the heartland; significant presence in Kasaragod, Kannur, Kozhikode interior; dispersed in central Kerala. Total ACs with Muslim ≥ 10 %: 113 of 140; with Muslim ≥ 50 %: 21.
- **Kerala Muslims don't vote as one bloc.** Mujahid-cohort ACs swung harder toward UDF in 2026 (+8.7 pp) than Sunni-cohort (+6.5 pp); Mujahid 36 % LDF retention vs Sunni 15 %. **But the cohort signal is a noisy proxy** for the politically-meaningful **EK Samasta vs AP Samasta factional split** that cross-cuts both theological cohorts — our data sees the theological cleavage, not the factional one (per Appendix A.4).
- **UDF's strategic playbook in Muslim Malappuram is structurally narrower than in Christian belt**: IUML or INC-Muslim only. INC-Hindu was never on the menu in 16 non-reserved Muslim-majority ACs.
- **No Muslim hereditary seats** (0 of 6 documented family successions). All 5 UDF dynasties are Christian-belt. **Muslim Malappuram = institutional IUML rotation; Christian-belt UDF = personal-coalition dynasties.** Different organisational logic between the two UDF heartlands.
- **NDA is structurally locked out of Muslim Kerala** — 113 of 140 ACs block-NDA mechanically; 61 of those via Muslim ≥ 25 %. **0 always-NDA seats exist anywhere in our 3-cycle window with measurable Muslim presence.**
- **BJP is building Hindu vote share inside Muslim-blocked seats** in 11 ACs (Kozhikode N+S the headlines), but no measurable progress in Malappuram itself.
- **BJP's most strategically valuable Kerala target is the Christian-Muslim coalition belt**, not Muslim or pure-Hindu Kerala. The Twenty20 precedent (Kunnathunad 2021 — T20 absorbed 25 % vote share, seat flipped UDF→LDF) is the only real-data evidence we have that **Christian central-Kerala vote is moveable at meaningful magnitude**, indirectly weakening the minority-coalition block in ~28 central-Kerala ACs without ever needing to win a Muslim voter.

---

## §1 — Demographics + geography

### 1a. Muslim Kerala demographics

- Muslims **~28-29 %** of Kerala's population in the 2025 projection.
- **Geographic concentration**: Malappuram district (~70 % Muslim across most ACs) is the heartland. Significant populations also in Kasaragod, Kannur (esp. coastal), Kozhikode interior, and pockets in central Kerala (Ernakulam Mattancherry, Aluva).
- Major sub-sect distinctions (Kerala-specific) — covered in detail in §2 + Appendix B:
  - **Sunni** mainstream (split into EK Samasta and AP Samasta factions)
  - **Mujahid / KNM** (Salafi-reformist, EK + AP factions merged in 2016)
  - **Jamaat-e-Islami** (separate ideological tradition; political wing is Welfare Party of India)

### 1b. AC-level distribution of Muslim presence (CR sub-type taxonomy)

| Sub-type | Districts | n ACs | Description |
| --- | --- | ---: | --- |
| **iuml-stronghold** | Malappuram | 16 | Muslim community is the majority (60-85 %); IUML the political vehicle |
| **mixed-muslim** | Kasaragod, Kannur, Kozhikode | 29 | Muslim is 20-55 %; vote splits between IUML/UDF and LDF-aligned INL/NSC |
| **mixed-muslim-wayanad** | Wayanad | 3 | Sunni-organised, Wayanad-specific dynamics |
| **cosmopolitan** | All others | 65 | Muslim share is a constituent piece of mixed ACs |
| **Total ACs with Muslim ≥ 10 %** | | 113 | |
| **Total ACs with Muslim ≥ 50 %** | | 21 | |

Of 140 Kerala ACs, 113 (81 %) have Muslim share ≥ 10 % — Muslim community is geographically present in most of the state, with majority concentration in 21 (15 %).

### 1c. Two distinct types of AC where Muslim community shapes outcomes

**Type A — Muslim-majority ACs (~21 seats).** Muslim community is the majority of voters. UDF (via IUML or INC-Muslim) wins these almost without exception — NDA mechanically cannot reach a majority, LDF only when the Muslim community fractures along EK/AP factional lines. All 16 non-reserved Malappuram ACs are in this category; plus a few Muslim-majority mixed-muslim ACs (Manjeshwar, Kasaragod, Thiruvambadi).

**Type B — Mixed-muslim and cosmopolitan ACs with Muslim 15-50 % (~50 seats).** Muslim community is one of the constituencies; outcome depends on broader coalition dynamics + how the Hindu vote splits. UDF and LDF both compete in these ACs.

This is a descriptive breakdown, not a leverage claim. Whether the Muslim community's political influence is "disproportionate" to its 28 % share depends on the broader political dynamic — how organised other communities are, how the Hindu vote splits, etc. — and we don't have AC-level voter-behaviour data to quantify that precisely. The observable facts are: Muslim community is geographically concentrated, organised via IUML, and is the decisive demographic in ~21 ACs outright. The rest is downstream of those facts.

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
| **Aggregate Muslim community claims** (§1 demographic geography, §3 UDF strategy menu, §4 NDA exclusion) | ✅ Robust | These claim "Muslim community" as a bloc; bloc-organisation is what matters, not internal sub-sect identity. EK/AP/Jamaat all vote UDF or LDF, not NDA — the aggregate is correct. |
| **Cohort-level direction** (Mujahid Δ +8.7 vs Sunni +6.5; Mujahid 36 % LDF retention vs Sunni 15 %) | ✅ Real signal | The numbers are real; cohort labels are clean buckets. The *direction* of "Mujahid more bipartisan" survives. |
| **Cohort-level MECHANISM** ("Mujahid voters swung harder", "IUML's Mujahid relationship is weaker") | ⚠️ Suspect | These attribute behaviour to theological identity. The actual mechanism is likely the AP-faction LDF-tactical alignment (cross-cuts both cohorts) + Jamaat/WPI 2026 consolidation. Per Appendix B, ~30-40 % of "Mujahid cohort behaviour" probably reflects AP-faction voters and Jamaat presence inside those ACs rather than Mujahid theological distinctiveness. |
| **Per-AC predictions** (§4d Kozhikode N math, §4c rising-NDA tier thresholds) | ⚠️ Margin of error | The assumed Muslim vote splits (70/20/10 for cosmopolitan, 85/12/3 for iuml-stronghold) ignore EK/AP variation. Real splits in mixed-cohort ACs could be 60/30/10 or 80/15/5 depending on factional mix. Conclusions are illustrative within ±5-10 pp uncertainty bands. |

**Bottom line**: structural claims (demographic geography, strategy menu, NDA exclusion, hereditary contrast) are not at risk. Claims that say *why* Muslim sub-cohorts behave differently are at risk and should be framed as "we observe X; the mechanism could be sub-sect, factional, or organisational — we can't directly attribute."

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

⚠️ **Caveat on "no Muslim dynasties"**: the hereditary audit is top-3-per-cycle 2011-2026. Muslim political families with cousins / second-generation politicians who don't break top-3 wouldn't appear. Kunhalikutty / Hameed / Madani / Basheer family lines worth manual sanity-check before publication.

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

### 4c. Rising NDA inside Muslim-blocked seats (12 ACs — gap to winner)

NDA share is rising in 12 Muslim-presence ACs while the mechanical Muslim block holds. **Real-data observation only**: how big is NDA's current vote-share gap to the winning alliance? (Smaller gap = closer to flippable, given continued NDA growth + no major minority defection.)

| AC | M% / C% / H% | 2026 vote (U/L/N) | NDA gap to winner |
| --- | --- | --- | ---: |
| **27 Kozhikode N** | 41 / 2 / 57 | 36 / 35 / 28 (UDF) | **−8 pp** |
| **56 Palakkad** | 34 / 3 / 63 | 42 / 23 / 33 (UDF) | **−9 pp** |
| **68 Nattika** | 20 / 16 / 64 | 33 / 37 / 29 (LDF) | **−8 pp** |
| **28 Kozhikode S** | 41 / 2 / 57 | 41 / 33 / 25 (UDF) | −16 pp |
| 127 Varkala | 25 / 4 / 71 | 39 / 40 / 20 (LDF) | −20 pp |
| 101 Poonjar | 16 / 41 / 42 | 39 / 35 / 25 (UDF) | −14 pp |
| 52 Ottappalam | 44 / 2 / 54 | 29 / 44 / 25 (LDF) | −19 pp |
| 61 Chelakkara | 29 / 10 / 61 | 29 / 47 / 23 (LDF) | −24 pp |
| 84 Kunnathunad | 20 / 35 / 45 | 44 / 30 / 25 (UDF) | −19 pp |
| 116 Karunagappally | 29 / 5 / 66 | 48 / 32 / 19 (UDF) | −29 pp |
| 121 Punalur | 21 / 21 / 58 | 35 / 50 / 11 (LDF) | −39 pp |
| 82 Eranakulam | 21 / 34 / 45 | 57 / 23 / 18 (UDF) | −39 pp |

**Three observed patterns**:

1. **Closest gap (≤10 pp)** — **Kozhikode N + Palakkad + Nattika**. NDA at 28-33 % AC-share; the winning alliance at 36-42 %. Three of the closest-to-flippable seats among Muslim-presence ACs. **Genuine 2031 watch-list.**

2. **Medium gap (14-29 pp)** — **Kozhikode S, Varkala, Poonjar, Ottappalam, Chelakkara, Kunnathunad, Karunagappally**. NDA needs sustained multi-cycle growth to close. Not impossible but unprecedented in Kerala.

3. **Large gap (≥39 pp)** — **Punalur, Eranakulam**. NDA's vote share is structurally constrained by the very high UDF or LDF concentration here.

**What we don't claim**: we don't compute exact "Hindu vote share NDA needs to consolidate" because that requires assumed within-community voting splits we don't have. The gap-to-winner is the honest observable quantity. **Closing it requires NDA to gain at the expense of either UDF or LDF (or both) within a fixed AC voter pool — that's the structural challenge §1d describes.**

### 4d. Kozhikode N — observable structural read

**What we know from real data** (Kozhikode N, AC 27):
- Muslim 41 %, Christian 2 %, Hindu ~57 % (Kozhikode is ezhava-very-heavy at the district level — Ezhava-Tiyya CPI(M) base structurally dominates the Hindu vote here)
- 2026: UDF 36 / LDF 35 / NDA 28 (UDF won by 1 pp, flipping from 2021 LDF)
- NDA trajectory 23 → 23 → 28 % over 10 years — rising

**What we cannot directly observe**: the within-community vote splits (how much of UDF's 36 % comes from Muslim vs Hindu, etc.).

**What we can structurally infer**:
- The Muslim community here splits between IUML/UDF and LDF-aligned INL/NSC (mixed-muslim sub-type, §2d). The EK/AP factional dynamics (§2a) shape the split.
- LDF's traditional base in Kozhikode is the Ezhava-Tiyya CPI(M) alignment, which has been politically dominant for 70+ years in this region.
- NDA's growth from 23 → 28 % over 10 years has come substantially from within the Hindu vote (where else would it come from given Muslim/Christian vote against NDA?). Hindu-vote NDA growth at this rate is meaningful but not yet decisive.

**For NDA to win Kozhikode N**, the math is irreducible: NDA needs to overtake the winning alliance (UDF won by 1 pp in 2026; in 2031, either UDF or LDF will likely win again unless NDA breaks ~38 % AC vote). Achieving 38 % from today's 28 % requires NDA to gain 10 pp from somewhere — almost certainly the Hindu Ezhava-Tiyya LDF vote, which has been structurally aligned for decades.

**Honest read**: Kozhikode N is in the §4c "closest gap" tier, but NDA's path requires breaking a structural alignment (Ezhava-Tiyya ↔ CPI(M)/LDF) that has been the most durable feature of Hindu Kerala politics for half a century. Not impossible — Mujahid-BJP softening (§2f) and Sangh outreach hint at directional change — but **the historical record offers no precedent for a 10-pp single-decade Ezhava-LDF defection.** 2031 watch-list, not 2031 forecast.

### 4e. BJP's most strategically valuable Kerala target — Christian-Muslim coalition belt

BJP cannot win Muslim Kerala (mode (a) lock — see §1b). Pure-Hindu Kerala is constrained by the Hindu 3-way split (see §1d) — Sangh's Ezhava/Nair consolidation play is real but slow. **The most actionable BJP target is the Christian-Muslim coalition belt of central Kerala** — ~44 ACs where Christian ≥ 15 % AND Muslim ≥ 10 % co-anchor a minority block (concentrated in Kottayam / Ernakulam / Pathanamthitta / Idukki / Kollam / Alappuzha).

The strategic claim is structural: **if BJP fragments the Christian sub-rite vote in these ACs, the minority-coalition block weakens.** We don't model the precise effect with hypothetical defection scenarios (those depend on assumed within-community vote splits we don't have). Instead, we anchor the claim in real precedent.

### 4e-bis. The Twenty20 case — real precedent for Christian-vote fragmentation

The Kitex / Sabu Jacob group launched Twenty20 (T20) as a state-level political experiment in 2015. In 2021, T20 contested 8 central-Kerala ACs and produced measurable, ECI-recorded effects on Christian vote share:

- **Kunnathunad 2021** — T20 came 2nd with **37 % vote share**. Conventional UDF vote share collapsed ~25 pp from 2016. **LDF won the seat from UDF.**
- **Piravom 2021** — T20 came 3rd at 17 %.
- **Poonjar, Kothamangalam, etc.** — T20 picked up 10-25 % vote share.
- **In 2026** — T20 essentially absent. Those voters mostly went back to UDF, visible in our framework as the *post-T20 rebound* (Poonjar NDA 14 → 2 → 25 %, Kunnathunad NDA 11 → 5 → 25 %).

**What this real-precedent demonstrates** (no back-calc needed — all numbers from ECI):

1. **Christian voters in central Kerala are moveable** — the absorbing party doesn't need to win, only to demonstrate identity-adjacent appeal.
2. **At 25 % defection magnitude, UDF coalition breaks** — Kunnathunad flipped UDF→LDF in 2021, a real ECI-recorded outcome with T20 as the only meaningful change in the AC dynamic.
3. **Fragmentation effects are reversible if the alternative party vanishes** — T20's near-disappearance in 2026 saw the voters mostly return UDF, not migrate to NDA.

**BJP's CSI / Latin Catholic outreach (see `christian.md` §3)** operates on the same hypothesis as T20: Christian central-Kerala votes are moveable with the right framing. The harder problem for BJP is *absorbing* rather than *fragmenting* — T20's voters returned to UDF when T20 vanished, suggesting that fragmentation isn't durable without a sustained alternative vehicle.

### 4e-ter. Which Muslim-presence ACs are exposed vs robust

Using the §1b AC-type breakdown, BJP's Christian-fragmentation play has uneven effects across Muslim Kerala:

- **Muslim-majority ACs (Type A, Malappuram + a few Kasaragod / Wayanad)** — **entirely unaffected**. Christian share is essentially zero in iuml-stronghold ACs; the NDA-block holds mechanically; UDF wins regardless of Christian dynamics elsewhere.
- **Mixed-muslim and cosmopolitan ACs with Muslim 15-50 % (Type B)** — **exposed** if BJP succeeds at sustained T20-magnitude Christian fragmentation, specifically in the central-Kerala subset where Christian + Muslim co-anchor a minority block (~28 ACs in Kottayam / Ernakulam / Pathanamthitta / Idukki / Kollam / Alappuzha). The minority coalition weakens and NDA becomes plausibly competitive in some of these ACs.

**Counter-intuitive implication**: BJP's Christian sub-rite play (CSI fragmentation, Latin Catholic outreach) is the most effective indirect attack on UDF's central-Kerala coalition — even though it never wins a Muslim vote. The strategic target isn't the Muslim community directly; it's the broader minority coalition that UDF depends on.

### 4f. Where NDA already has a path

Only 27 of 140 ACs have NDA structurally unblocked. The 2 documented `stableFor: NDA` ACs are:

- **AC 135 NEMOM** (Trivandrum) — nair-heavy, Christian fractured (CSI 8 % + Latin 6 % cancel), Hindu Nair consolidation. NDA 47.5 → 35.5 → 40.7 %. Declining from 2016 peak but structural floor holds.
- **AC 132 KAZHAKOOTTAM** (Trivandrum) — same nair-heavy + cosmopolitan-Muslim (14 %) too small to block.

Plus a handful of additional Trivandrum/coastal-Hindu ACs where NDA is competitive but doesn't lock. Total NDA-feasible footprint is structurally <30 seats — even in BJP's best Kerala scenario.

---

## §5 — Open hypotheses (to revisit post-walkthrough)

**Re-tag**: per §2a-bis, hypotheses A / B / C are **mechanism hypotheses, not directly testable from our data**. They attribute observed cohort-level patterns to a specific cause (theological identity) when the actual cause may be a different cleavage (EK / AP factional split, Jamaat / WPI consolidation) that our OSM cohort layer cannot distinguish. Treat them as candidate explanations; the data confirms the *pattern* (cohort Δ direction + LDF retention rate) but not the *mechanism*. Hypothesis D is forward-looking and directly testable against 2031 actuals.

### Hypothesis A — Sunni stability + Mujahid swing (cohort-level pattern; mechanism hypothesis)

**Pattern (data-confirmed)**: Sunni cohort Δ UDF +6.5 pp; Mujahid cohort Δ UDF +8.7 pp; 36 % of Mujahid ACs went LDF vs 15 % Sunni — Mujahid-labelled ACs are structurally more competitive than Sunni-labelled ACs.

**Mechanism hypothesis (not directly testable from our data)**: 2026 Muslim-belt UDF margin reflects *Sunni stability + Mujahid swing* — i.e., Mujahid theological identity is the proximate cause of the differential.

**Alternative mechanisms (consistent with same pattern, equally unobserved)**:
- EK/AP factional split inside Mujahid: AP-Mujahid was LDF-tactical pre-2016 merger; post-merger residual loyalty may still pull LDF
- AP-Sunni voters residing in Mujahid-cohort ACs would also pull LDF in those cohorts
- Jamaat-e-Islami / WPI presence in Mujahid-cohort ACs followed by 2026 UDF consolidation (Nilambur precedent) would produce the same cohort signal

What we can say: *Mujahid-cohort ACs behave differently from Sunni-cohort ACs.* What we can't say: *because they're Mujahid.* Could be AP-faction, could be Jamaat, could be Mujahid identity, could be a mix.

### Hypothesis B — Mujahid as the swing voter (cohort-level pattern; mechanism hypothesis)

**Pattern**: The 14 Mujahid-cohort ACs are the marginal seats — both UDF and LDF win subsets, margins are tighter than in Sunni-cohort.

**Mechanism hypothesis (not directly testable)**: Whoever wins the Mujahid voter wins the Muslim-belt margin.

**Caveat**: Same as A. "Mujahid voter" may be a stand-in for "AP-faction voter" or "Jamaat-influenced voter" who happens to live in Mujahid-cohort ACs.

### Hypothesis C — Two Muslim Keralas vote differently (cohort-level pattern; mechanism hypothesis)

**Pattern**: Sunni-cohort ACs are UDF strongholds; Mujahid-cohort ACs are competitive.

**Mechanism hypothesis**: IUML's organisational reach is structurally different across theological sub-sects.

**Alternative reading consistent with institutional commentary** (Wikipedia / Organiser): the meaningful divide is *EK-Samasta-establishment-within-IUML* vs *Mujahid-as-pressure-group-within-IUML* — and crucially, the same EK/AP factional split exists *within* Sunni too (Kanthapuram AP-Samasta is LDF-tactical). Hypothesis C is directionally aligned with institutional observation but the cleanest framing is **two Muslim Keralas: institutional (EK Samasta + IUML, firm UDF) vs factional/dissident (AP Samasta + Mujahid + Jamaat, competitive)** — a cross-cutting cleavage our data cannot directly observe.

### Hypothesis D — 2031 NDA breakthrough watch-list (forward-looking, testable)

**Claim (testable against 2031 actuals)**: Of the 12 ACs where NDA share is rising despite a Muslim-presence structural block (§4c), three are in genuine breakthrough reach by 2031: **Kozhikode N, Palakkad, Nattika**. If 1-2 cross 35 % AC-vote in 2031, the structural-block reading needs revision. If none cross, the block reading holds.

**Why testable**: this is a specific quantitative prediction with a 5-year measurement window. Not subject to the mechanism-attribution problem because we're predicting AC-vote share, not within-community behaviour.

**Falsifiers**: any of the 3 reach-tier ACs crossing 35 % AC-vote by 2031 = block reading weakened; all 3 staying < 30 % = block reading strengthened.

### Why hypotheses A-C still matter despite mechanism uncertainty

We retain A-C because the *patterns* are real (cohort Δ direction + LDF retention rate), and any walkthrough page must explain them. The honest framing is: "Mujahid-cohort ACs behave differently from Sunni-cohort ACs in this measurable way; here are the candidate explanations; we cannot directly attribute." This is more useful than either omitting the finding (loses real signal) or overstating the mechanism (claims more than data supports).

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
