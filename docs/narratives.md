# Kerala 2026 — Merged Narrative Catalog

This is the deduped + tier-classified merge of six source files in `docs/narratives/` (3 internal research agents + 3 external tools: Grok, Perplexity, ChatGPT). Raw inputs total ~125 entries across the six files; after dedupe and consolidation this catalog has **31 distinct narratives**, grouped by testability with our seat-level data.

For provenance details on individual claims, see the underlying source files. This file is for joint review — to decide which narratives become testable cards on `/flows`, `/drifts`, or a new editorial surface.

## Election context (for grounding)

UDF (Congress-led): **102 seats / ~41.9% combined vote** (INC 63, IUML 22, Kerala Congress(J) and partners 17)
LDF (Left-led): **35 seats / ~33%** — CPM dropped from 63 (2021) to 26; KCM (Jose K Mani) zero
NDA (BJP-led): **3 seats / ~14.4% alliance vote** (BJP 11.42%) — Nemom, Chathannoor, Kazhakoottam
Turnout: **78.03%** (+4.13pp vs 2021)
13 of 21 LDF ministers defeated. Pinarayi's Dharmadam margin: 50,123 (2021) → 19,247 (2026).

## Tier classification

- **Tier A** (17 narratives): Testable directly with our seat-level data + existing overlays (religion gradient, district mapping, candidate metadata, multi-cycle history)
- **Tier B** (10 narratives): Partly testable — would need additional data (beneficiary density, sub-community geography, survey microdata, age structure)
- **Tier C** (4 narratives): Untestable with seat-level data — interpretive framings or claims requiring data we don't and won't have

Each entry below merges sources from across the six input files. Where multiple files cover the same claim, I show all sources. Where one file has a unique angle, that's flagged.

---

# TIER A — Testable now with our data

## A1. Minority consolidation (Christian + Muslim) behind UDF reversed the 2021 LDF gain

**Claim:** Lokniti-CSDS 2021 had recorded ~40% of Muslims and Christians voting LDF (peak Left support among minorities). The 2026 verdict reversed that decisively: UDF swept all seats in Idukki, Ernakulam, Wayanad, Malappuram, and Kottayam — the Christian-Muslim heartland — and IUML won 22 of 27 contested seats (81% strike rate). Multiple sources describe the shift in Muslim and Christian-majority pockets as "near total."

**Sources (all 6 files mention this):**
- The Federal — "What led to LDF's rout" (Rajeev Ramachandran, 5 May 2026)
- The Quint — "7 Reasons Why Congress-led UDF Won and LDF Lost" (May 2026)
- Outlook — "IUML Emerges Kingmaker As Congress-Led UDF Sweeps Kerala" (May 2026)
- Times of India — "Kerala assembly polls: Minority consolidation drives UDF's sweep" (May 2026)
- New Indian Express (Jan 2026 pre-poll prediction by Sunil Kanugolu)
- Lokniti-CSDS Kerala 2021 post-poll (baseline)
- The Print on Lokniti (2021)

**Evidence strength:** Multiple agreeing across all 6 source files

**Theme:** religion

**Testable now?** **Yes.** Use religion-gradient overlay × LDF→UDF flow. Rank by "Muslim-share + Christian-share" and check vote-share delta against 2021. The 2024 LS comparison (where LDF still held some minority pockets) sharpens the test.

---

## A2. Sabarimala gold scandal + lingering 2018 women-entry memory hammered LDF in Devaswom-route seats

**Claim:** The 2026 Sabarimala gold-cladding scandal (former Travancore Devaswom Board president A. Padmakumar arrested; SIT investigation) compounded with residual anger from the 2018 women-entry decision. The campaign chant "Swarnam kattath aarappa" (Who stole the gold?) hit Devaswom Minister V.N. Vasavan (lost Ettumanoor by 19,752) and former Devaswom Minister Kadakampally Surendran (lost Kazhakoottam to BJP's V. Muraleedharan by 428 votes). Health Minister Veena George (Aranmula, a Sabarimala-route seat) lost by 18,985 votes.

**Sources:**
- The Print — "1st time in 50 years no Indian state is Left-ruled" (May 2026)
- The Quint — "7 Reasons" (May 2026)
- Onmanorama — "Who stole Ayyappa's gold campaign in Ettumanoor" (Apr 2026)
- Onmanorama — Ministers who lost (Veena George, Vasavan, Ganesh Kumar) (May 2026)
- Organiser — "Sabarimala-Guruvayur backlash sinks CPI(M)" (May 2026)
- Open Magazine — "The death of an ideal" (Apr 2026)
- The News Minute — BJP wins three seats (May 2026)

**Evidence strength:** Multiple agreeing (with Organiser flagged as BJP-aligned)

**Theme:** religion / specific-issue

**Testable now?** **Yes.** Compare LDF margin shifts in Sabarimala-route AC's (Aranmula, Konni, Ranni, Pathanamthitta, Ettumanoor, Kottayam) and Hindu-majority constituencies vs 2021. Cross-check with Devaswom ministers' own seats. Religion-gradient overlay + delta sort makes this directly visible.

---

## A3. BJP's 3 wins came from concentrated Hindu pockets + weak UDF candidates, not statewide consolidation

**Claim:** BJP statewide vote share grew only ~0.12pp (11.30% → 11.42%); NDA crossed 20% in 29 of 140 constituencies — concentration, not diffusion. The three wins came in Nemom (Rajeev Chandrasekhar, ~5,000 margin), Chathannoor (B.B. Gopakumar, 4,402), and Kazhakoottam (V. Muraleedharan, 428). Onmanorama analysis argues these wins owe more to weak UDF candidates than BJP strength: in Nemom, UDF's K.S. Sabarinadhan couldn't match Muraleedharan's 2021 hold; Kazhakoottam was a three-way split. **All three BJP wins came on Hindu candidates** — every Christian BJP candidate (P.C. George, Shone George, George Kurian, Anoop Antony) lost.

**Sources:**
- The Federal — BJP base steady expansion (5 May 2026)
- Deccan Herald — BJP 3-seat breakthrough
- ISAS-NUS — Ronojoy Sen (6 May 2026)
- Onmanorama — "Should BJP thank Cong's weak candidates?" (May 2026)
- The Quint — BJP limited gains
- The News Minute — BJP wins three seats
- Indian Express — BJP scripts history
- Catholic World Report — Split verdict for Christian community

**Evidence strength:** Multiple agreeing

**Theme:** BJP-strategy

**Testable now?** **Yes.** Map BJP vote share 2021 → 2026 per AC, identify all 29 seats where NDA crossed 20%, isolate the 3 wins. Cross-check with religion gradient (Hindu-share). Religion gradient + diverging color sort directly visualizes this.

---

## A4. FCRA Amendment crippled BJP's Christian outreach and pulled drifters back to UDF

**Claim:** The Modi government's FCRA amendments became a flashpoint with Kerala churches who saw it as a mechanism to seize assets. Pala Bishop Mar Joseph Kallarangatt rejected neutrality publicly. A BJP MP told The Print "the timing was not great"; state chief Rajeev Chandrasekhar said he had urged the Centre against it "because it has fuelled apprehensions among religious minorities." BJP's internal survey (per The Week) concluded the party "could not woo Christians" — and central-Kerala denominations swung back to UDF, not BJP.

**Sources:**
- The Print — Christians responding to BJP outreach in Kerala
- The Federal — Kerala BJP's Christian outreach falters
- The Week — "Could not woo Christians, FCRA backfired: BJP's internal survey" (Apr 2026)
- Onmanorama — local body polls Christian candidates
- Pillar Catholic
- Catholic World Report

**Evidence strength:** Multiple agreeing (including BJP's own internal survey)

**Theme:** BJP-strategy / specific-issue

**Testable now?** **Yes.** Compare BJP vote share in Syrian-Christian seats (Kottayam, Pathanamthitta, Idukki, Ernakulam) 2024 LS vs 2026 Assembly. If FCRA shifted Christians back to UDF, BJP share should fall in these specific seats relative to 2024 baseline.

---


## A5. Twenty20-NDA experiment imploded in Ernakulam

**Claim:** Sabu M. Jacob's Twenty20 (Kitex-backed) joined NDA in January 2026 with a "Viksit Kerala" pitch. Contested 19 seats, won zero — Jacob had publicly predicted "at least six seats in Ernakulam alone." The South First reported an internal split with leaders quitting to join Congress after the NDA tie-up. Onmanorama: alliance "lost its apolitical appeal and alienated key minority voters" (Christians wary of BJP), pushing them to UDF. Vote erosion in Twenty20's traditional base of Kunnathunad, Kothamangalam, Perumbavoor.

**Sources:**
- Onmanorama — "Jackfruit falls flat" (May 2026)
- The South First — Twenty20 faces major split after NDA
- The Federal — Twenty20 joins NDA
- The Squirrels — analysis

**Evidence strength:** Multiple agreeing

**Theme:** coalition-dynamics

**Testable now?** **Yes.** Compare Twenty20 vote share in Kunnathunad / Kothamangalam / Perumbavoor 2021 vs 2026. NDA absorbed Twenty20 vote should be measurable.

---

## A6. 13 of 21 LDF ministers defeated — anti-incumbency was minister-targeted

**Claim:** Cabinet collapse signaled governance rejection beyond candidate-level effects. Ministers who lost include Veena George (Aranmula), V.N. Vasavan (Ettumanoor), Kadakampally Surendran (Kazhakoottam), K.K. Saseendran, K. Krishnankutty, Saji Cheriyan, A.K. Saseendran, R. Bindu, K. Rajan, P. Rajeeve, Chinchu Rani, M.B. Rajesh, Roshy Augustine. Pinarayi himself saw Dharmadam margin collapse from 50,123 to 19,247.

**Sources:**
- Onmanorama — Ministers who lost (May 2026)
- The Week — Cabinet losses
- Wikipedia summary
- Vote Vibe pre-poll (47.9% anti-incumbency, 62% wanted to replace MLA)

**Evidence strength:** Multiple agreeing

**Theme:** anti-incumbency

**Testable now?** **Yes.** Compare LDF minister-vs-non-minister candidate swing differentials. Margin shrinkage of LDF incumbents is directly in our data.

---

## A7. Munambam Waqf dispute moved Latin Catholic coastal pockets

**Claim:** ~600 Latin Catholic fishing families in Munambam (Vypin/Paravur, Ernakulam) protested Kerala Waqf Board's claim on land they hold since the 1950s. After Parliament passed the Waqf Amendment Bill, residents burst crackers and chanted "Hail Modi" at 1 a.m. on April 3, 2025. KCBC actively lobbied MPs. UDF MP Hibi Eden warned residents the BJP was "trying to create conflict between Muslim and Christian communities." LDF's Waqf Board appointment in Feb 2026 kept Munambam "simmering ahead of polls" — and Latin Catholic shifts moved against LDF in coastal pockets.

**Sources:**
- The South First — Munambam erupts (Mar 2026)
- The News Minute — Christian families fight Waqf claim
- Onmanorama — LDF Waqf Board pick
- Organiser — Munambam votes for BJP
- Reddit r/Kerala discussion

**Evidence strength:** Multiple agreeing

**Theme:** community-specific / specific-issue

**Testable now?** **Yes.** Examine Vypin, Paravur, Kochi (Mattancherry/Fort Kochi), and Latin Catholic coastal pockets for swings against LDF + BJP/UDF gains 2021 vs 2026.

---

## A8. Central Kerala (Christian-Muslim heartland) was the kingmaker region

**Claim:** UDF won every seat in Idukki, Ernakulam, Wayanad, Malappuram, Kottayam — losing only one each in Pathanamthitta, Kasaragod, Kozhikode. LDF residual strength: Thrissur and Kannur (and not even those fully). Pre-poll Manorama–C Voter projection had already flagged this geography (UDF 33 of 53 in Central Kerala).

**Sources:**
- Onmanorama — Kerala results panorama (May 2026)
- The South First — Central Kerala kingmaker (Mar 2026)
- Madhyamam — UDF returns with 102 seats
- The Federal — UDF landslide

**Evidence strength:** Multiple agreeing

**Theme:** regional / urban-rural

**Testable now?** **Yes.** District-wise UDF/LDF/NDA seat tally and vote-share swings vs 2021 are directly computable from our data.

---

# TIER B — Partly testable, would benefit from additional data

## B1. Welfare delivery insufficient against expectations gap

**Claim:** Kerala's pension network (~6 million beneficiaries) and Kudumbashree (4.5 million women) didn't shield LDF. Public debt above 34% of GSDP (FY25), KIIFB cleared ₹76,486 cr but disbursed only ₹38,293 cr by Dec 2025 — visible cash-flow stress, welfare-payment delays. ORF's Sunaina Kumar: Kerala "uniquely lacks unconditional cash transfers." UDF's "Indira Guarantee" promise package neutralized LDF's welfare edge.

**Sources:** Business Standard, ORF, New Kerala, Deccan Herald, ETV, Times of India, The Quint, Eurasia Review

**Theme:** welfare-schemes

**Testable?** Partly. Need beneficiary-density data per AC to cross-tab with LDF margin shift. Without that, only the qualitative claim survives.

---

## B2. Sub-community Muslim shifts (Sunni / Salafi / Samastha vs Mujahid)

**Claim:** Kerala Muslims aren't monolithic — Sunni-Samastha vs Mujahid (Salafi) factions, IUML internal dynamics, SDPI/Welfare Party at the margins. "AP Sunni neutrality" hurt LDF specifically; Welfare Party (Jamaat-e-Islami) chose not to contest and indirectly supported UDF; SDPI vote-split potential failed to materialize.

**Sources:** Open Magazine, Times of India, Madhyamam, Moneycontrol

**Theme:** community-specific

**Testable?** Partly. Need sub-community geography data not in our overlay; religion gradient gives "Muslim share" but not sub-community split.

---

## B3. Ezhava base erosion + BJP partial encroachment (long-run)

**Claim:** Polstrat / CSDS-CPPR longitudinal series shows LDF's Ezhava share dropped from ~64-65% (2006/11) to ~49% (2016) to 53% (2021 Lokniti); BJP rose from 6-7% to ~21% (2019) to 23% (2021). This is multi-cycle drift, not 2026-specific. NDTV / TOI explicitly noted BJP "social engineering" targeted Ezhavas in 2026.

**Sources:** Polstrat, Lokniti-CSDS, NDTV, Times of India, The Federal

**Theme:** caste

**Testable?** Partly. Need community-coded constituency typology (Ezhava-heavy vs Nair-heavy) to compare LDF/BJP shifts. /drifts could test the multi-cycle pattern if we have caste proxies.

---

## B4. Nair community partial UDF lean

**Claim:** Sections of Nairs leaned UDF (Satheesan, Venugopal, Chennithala are Nair leaders). Constrained NDA's full Hindu consolidation. Polstrat shows LDF Nair share dropped from ~40-45% (2006/11) to ~20% (2016/19).

**Sources:** Polstrat, Moneycontrol, The Quint, TOI

**Theme:** caste

**Testable?** Same as B3 — needs community-coded AC typology.

---

## B5. Youth / generational shift toward "change" vote

**Claim:** Younger voters frustrated with unemployment + outmigration favored UDF's change narrative. Survey-based: Vote Vibe / Manorama-C Voter reported 15-20% of electorate as first/second-time voters, prioritizing job creation. Open Magazine flagged unemployment + public debt + Sabarimala as "the three issues that hinged narrow constituency-level shifts."

**Sources:** Deccan Herald, The CSR Journal, Open Magazine, multiple X analysts

**Theme:** generational

**Testable?** Partly. Need age-demography per AC. We don't have first-time-voter data per seat.

---

## B6. Gender gap — women slightly stickier to LDF

**Claim:** Axis My India exit poll (n=24,419) gender split: UDF 45% men / 43% women; LDF 37% men / 41% women; NDA 15% men / 13% women. Women's higher turnout (82.1% vs 76.5% per ECI) didn't offset the broader anti-LDF swing. Consistent with LDF's Kudumbashree welfare claim.

**Sources:** Free Press Journal, ETV Bharat, ORF (Sunaina Kumar)

**Theme:** specific-issue (gender)

**Testable?** No directly. ECI returns don't have gender-coded vote shares; need survey microdata.

---

## B7. Wayanad rehabilitation politics — Mundakkai/Chooralmala township

**Claim:** ₹299 cr township for 1,662 landslide-affected residents (first phase 178 houses inaugurated by Pinarayi March 2026). LDF projected as flagship achievement; UDF still swept Wayanad. Survivors waited beyond Congress-promised housing. The Federal noted the 2024 Wayanad relief fund row had become an election issue.

**Sources:** Onmanorama, Deccan Herald, The News Minute, The Week

**Theme:** specific-issue

**Testable?** Partly. Examine Sulthanbathery, Kalpetta, Mananthavady swings — but causality from rehab politics specifically is hard to isolate from broader Christian-Muslim shift.


---

# Recommended starting set

If we proceed to narrative cards (per the earlier discussion), I'd start with these **5 strongest Tier A candidates** — all sharp claims, multi-source evidence, directly testable with current overlays:

1. **A1 — Minority consolidation behind UDF.** Religion-gradient × LDF→UDF flow. Likely produces a striking visual.
2. **A2 — Sabarimala gold + ministers' Devaswom-route losses.** Specific seat list, religion-gradient cross-check.
3. **A3 — CPM rebels in iron strongholds.** The /flows page is literally built for this kind of single-cycle alliance flow narrative.
4. **A5 — BJP's 3 wins via concentrated Hindu pockets + weak UDF candidates.** Combines vote-share concentration analysis with religion gradient.
5. **A6 — FCRA backfire on BJP Christian outreach.** Cross-checks BJP 2024 LS vs 2026 assembly in Christian seats — has clear refutability ("if BJP held Christian seats, story collapses").

Each one of these can be a self-contained card with: claim → relevant data viz → verdict (confirmed / refuted / mixed / inconclusive) → drill-in to `/explore` with matching filters.

The remaining 12 Tier A narratives would be the next batch. Tier B (10) gets deferred until we add the data they need (community typology, beneficiary density, age structure). Tier C (4) we don't pursue — those are framings, not testable claims.
