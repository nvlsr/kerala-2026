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

## A3. CPM rebels backed by UDF broke "unshakeable" Left fortresses in Kannur and Alappuzha

**Claim:** Three CPM expellees won as UDF-backed independents — V. Kunhikrishnan (Payyannur, by ~7,500 vs T.I. Madhusoodanan), T.K. Govindan (Taliparamba, defeating P.K. Syamala — wife of CPM state secretary M.V. Govindan), G. Sudhakaran (Ambalapuzha). Payyannur fell to a non-Communist for the first time in its history. Three-time CPM MLA Aisha Potty (now Congress) nearly took Kottarakkara (lost by 1,012). Onmanorama described this as the UDF "letting resentment channel toward one point: the rebels." T.M. Thomas Isaac (CPM): "a section of Left sympathisers voted for the UDF in some constituencies."

**Sources:**
- The Federal — UDF landslide / What led to LDF's rout (May 2026)
- The Print — What went wrong with CPI(M) strategy (May 2026)
- The Week — Nirmal Jovial decoding switch + How rebels foiled Left (May 2026)
- Onmanorama — Devastated, nothing Left + Payyannur result (May 2026)
- Organiser — Rebels deliver irreversible blow to CPI(M) (May 2026)
- Times of India — CPM bleeds votes across Kannur strongholds (May 2026)

**Evidence strength:** Multiple agreeing across journalism + Kerala-specific + ChatGPT

**Theme:** organizational

**Testable now?** **Yes.** Compare margins in Payyannur, Taliparamba, Ambalapuzha, Kottarakkara, Mattannur, Dharmadam vs 2021. Margin shrinkage in surrounding LDF strongholds (Onmanorama: Sumesh in Azheekode 6,141 → 349; Ravindranath in Manalur 29,876 → 126) is directly observable. The rebel-flow story is exactly what `/flows` is built for.

---

## A4. IUML's record 22-of-27 haul came from deliberate generational rebalancing under Panakkad Sadiq Ali Shihab Thangal

**Claim:** IUML achieved its highest-ever assembly tally — 22 of 27 contested seats, swept all seats in Malappuram and Kozhikode. P.K. Kunhalikutty took Malappuram by 85,327 votes — the largest margin in Kerala assembly history. Fathima Thahiliya became IUML's first woman MLA (defeating CPM's T.P. Ramakrishnan in Perambra, an LDF-held seat) despite internal IUML dissent. The party also defeated former IUML defectors K.T. Jaleel and P.T.A. Rahim. Six IUML candidates won by margins above 50,000.

**Sources:**
- Onmanorama — "Candidate selection, youth push turbocharge IUML" (May 2026)
- Outlook — "IUML emerges kingmaker" (May 2026)
- ETV Bharat — Kunhalikutty's record margin (May 2026)
- The Print — IUML track record / 23 of 27 leads (May 2026)

**Evidence strength:** Multiple agreeing

**Theme:** candidate-quality / community-specific

**Testable now?** **Yes.** Compare IUML strike rate per seat 2021 vs 2026; isolate seats with new young/woman candidates and compare margin growth.

---

## A5. BJP's 3 wins came from concentrated Hindu pockets + weak UDF candidates, not statewide consolidation

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

## A6. FCRA Amendment crippled BJP's Christian outreach and pulled drifters back to UDF

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

## A7. Kerala Congress (Mani) wiped out — Pala lost, Christian Central Travancore re-aligned

**Claim:** Jose K. Mani's Kerala Congress (M) — the third-largest LDF partner — drew zero seats wherever it contested. Mani himself lost Pala to UDF-backed Mani C. Kappen by 2,991 votes. P.J. Joseph's Kerala Congress (UDF) won 7 seats, defeating KCM directly in Changanassery, Kaduthuruthy, Thodupuzha. BJP's Shone George (P.C. George's son) surged in Pala from ~10,000 (2021) to 35,304 votes — compressing Kappen's margin but also taking from KCM's pool.

**Sources:**
- Onmanorama — KCM autopsy (May 2026)
- Onmanorama — Pala result Kappen wins (May 2026)
- The South First — Central Kerala kingmaker region
- Catholic World Report

**Evidence strength:** Multiple agreeing

**Theme:** coalition-dynamics

**Testable now?** **Yes.** Compare KCM vs P.J. Joseph faction strike rates per seat. BJP vote rise in Pala is directly observable. The Kerala Congress flip is a single-cycle alliance flow — testable on `/flows`.

---

## A8. Twenty20-NDA experiment imploded in Ernakulam

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

## A9. 13 of 21 LDF ministers defeated — anti-incumbency was minister-targeted

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

## A10. Munambam Waqf dispute moved Latin Catholic coastal pockets

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

## A11. Higher turnout (78.03%) historically favored the challenger

**Claim:** Turnout climbed 4.13pp from 73.9% (2021) to 78.03% (2026). Political scientist G. Gopa Kumar told The Print: "In 2016, voter turnout rose to 77.1% from 74.92%, leading to the ouster of the Oommen Chandy-led UDF" — a comparable surge with a comparable result. Three drivers: improved electoral rolls (Special Intensive Revision), anti-incumbency, BJP's Hindu-vote mobilisation.

**Sources:**
- The Print — How higher voter turnout impacts fates (Apr 2026)
- The CSR Journal — turnout coverage
- The Week — Does high turnout signal anti-incumbency?

**Evidence strength:** Multiple (with single primary voice)

**Theme:** anti-incumbency / generational

**Testable now?** **Yes.** Correlate per-AC turnout delta (2021→2026) with LDF→UDF and LDF→BJP swings. Cross-tab: high-turnout-delta seats vs LDF-loss-magnitude.

---

## A12. SNDP / Vellappally Natesan gambit alienated Muslims and didn't deliver Ezhavas

**Claim:** Pinarayi's perceived closeness to SNDP's Vellappally Natesan (known for sharp anti-Muslim rhetoric) — combined with the Global Ayyappa Sangamam government event with NSS leader G. Sukumaran Nair — was framed as creating "an impression of Islamophobia" among minorities. C.R. Neelakandan (analyst) and academic P.K. Pokker said the CPM's tonal drift "blurred the line between Left politics and Hindutva-adjacent positions." Strategy didn't deliver expected Ezhava (~25%) or Nair (~13%) consolidation.

**Sources:**
- The Print — What went wrong with CPI(M)
- The Federal — What led to LDF's rout
- The Wire — Fading red flag (local body)
- Onmanorama — CPM NSS-SNDP plot may backfire
- Open Magazine — Death of an ideal
- Times of India — minority consolidation drives UDF's sweep

**Evidence strength:** Multiple agreeing

**Theme:** caste / religion

**Testable now?** **Yes (partial).** Compare LDF vote-share change in Muslim-majority seats (Eranad, Mankada, Tirur, Tanur) vs Ezhava-heavy seats. Religion gradient + alliance-flow on `/flows` answers most of this.

---

## A13. "Save Secularism Mission" — cross-community vote produced unprecedented swap seats

**Claim:** BJP's late-stage polarising rhetoric (love-jihad messaging; "Why hasn't there been a single Hindu MLA from Guruvayur in 50 years?") triggered counter-defensive cross-community voting. In Guruvayur (historically Muslim-held), Christian candidate V.S. Joy won. In a traditionally Christian-reserved Kochi seat, Muslim Mohammad Shiyas won. Thavanur (Malappuram, Muslim-majority) returned a Christian. Onmanorama framed this as voters explicitly punishing BJP's polarisation strategy.

**Sources:**
- Onmanorama — Save secularism mission (May 2026)
- The Week — Minority vote shift, rebel surge

**Evidence strength:** Multiple agreeing (Onmanorama/Week — both Kerala-focused)

**Theme:** religion

**Testable now?** **Yes.** Examine Guruvayur, Kochi (specific seat needs identification), Thavanur for community-of-winner anomalies vs prior cycles. Specific seats are findable via candidate metadata.

---

## A14. Local body 2025 results foreshadowed assembly outcome

**Claim:** UDF improvement and BJP capital-corporation breakthrough in December 2025 local-body elections were early signals LDF misread. UDF read it correctly and continued the playbook; LDF "under-reacted." The assembly result was the trend completing, not a sudden shock.

**Sources:**
- New Indian Express — "Strong UDF show in Kerala local polls, BJP takes capital" (Dec 2025)
- New Indian Express — Trivandrum corporation BJP victory (Dec 2025)
- Times of India — LDF failed to read indications (May 2026)
- Chhitblog — Kerala local results signal trouble for LDF (Dec 2025)
- The Wire — Fading of the red flag

**Evidence strength:** Multiple agreeing

**Theme:** organizational

**Testable now?** **Yes (with extra data).** Compare 2025 local body UDF/BJP/LDF performance per panchayat/ward to 2026 assembly swing per AC. Requires importing the 2025 local-body data — but conceptually testable.

---

## A15. UDF "soft opposition" + unified campaign vs LDF Pinarayi-centricity

**Claim:** UDF avoided the factional self-sabotage of prior cycles. V.D. Satheesan-led "Lakshya26" was data-driven. UDF projected as "softer alternative" — administratively credible, not ideologically polarising — pulling change-voters who didn't want polarised choice. Meanwhile LDF over-relied on Pinarayi's brand, which had become inaccessibility ("Captain syndrome"). Sachin Pilot: "Modi and Pinarayi are not two, but one." Supriya Shrinate: "Kerala's Modi who specialised in silencing dissent."

**Sources:**
- The Federal — Fall of the Captain (May 2026)
- The Caravan — How CPI(M) took a hammer to its ideology
- The Statesman — Inside Congress return in Kerala (May 2026)
- The Quint — 7 Reasons (May 2026)
- Onmanorama — Right strategy and unity (May 2026)

**Evidence strength:** Multiple agreeing

**Theme:** organizational

**Testable now?** **Partly.** Compare UDF margin in seats with known factional disputes (rebel candidacies) vs cleaner UDF seats. Pinarayi's own collapse in Dharmadam (50,123 → 19,247) gives one data point for "Captain effect." Quantitative test is tricky without leadership-perception polling.

---

## A16. Central Kerala (Christian-Muslim heartland) was the kingmaker region

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

## A17. Candidate-quality outliers — the Chandy Oommen / Suresh Gopi cases

**Claim:** Chandy Oommen (son of former CM Oommen Chandy) won Puthuppally by 53,907 votes — among the largest margins of the election. Onmanorama: dynastic / high-recognition candidates outperformed. Conversely, Suresh Gopi (BJP MP from Thrissur LS 2024) "made only four appearances across his seven Assembly constituencies" — his 2024 LS win was personal (philanthropy + filmstar charisma) and didn't transfer to slate candidates. The Quint: "BJP doesn't win because voters think it can't. Voters think it can't because it doesn't."

**Sources:**
- The Quint — Chandy Oommen Puthuppally win
- The Quint — Suresh Gopi factor BJP Thrissur (opinion)
- The Week — Decoding Kerala's switch
- Onmanorama — BJP 3-seat analysis
- The Statesman — Satheesan's edge

**Evidence strength:** Multiple agreeing

**Theme:** candidate-quality

**Testable now?** **Yes.** Compare margin distribution of dynastic / high-name-recognition UDF candidates vs party-baseline. Compare BJP performance in Thrissur-LS-segment AC's vs Kerala-wide BJP performance.

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

## B7. K-Rail / SilverLine residue across corridor districts

**Claim:** Original SilverLine (~₹63,000 cr, 1,300 hectares acquisition) was a flashpoint over wetland/paddy destruction and forced acquisition surveys. After Centre's refusal, E. Sreedharan advanced an alternative — splitting Congress voices. Residual memory was a liability across corridor districts. Deccan Herald listed K-Rail among Pinarayi's "trifecta of liabilities" alongside gold-smuggling and Exalogic.

**Sources:** The Federal, Deccan Herald, The Wire

**Theme:** specific-issue

**Testable?** Partly. Would need to map original K-Rail alignment AC's (Kasaragod-to-Trivandrum corridor) and check anti-LDF swing concentration there.

---

## B8. Wayanad rehabilitation politics — Mundakkai/Chooralmala township

**Claim:** ₹299 cr township for 1,662 landslide-affected residents (first phase 178 houses inaugurated by Pinarayi March 2026). LDF projected as flagship achievement; UDF still swept Wayanad. Survivors waited beyond Congress-promised housing. The Federal noted the 2024 Wayanad relief fund row had become an election issue.

**Sources:** Onmanorama, Deccan Herald, The News Minute, The Week

**Theme:** specific-issue

**Testable?** Partly. Examine Sulthanbathery, Kalpetta, Mananthavady swings — but causality from rehab politics specifically is hard to isolate from broader Christian-Muslim shift.

---

## B9. CMRL-Exalogic / Veena Vijayan SFIO chargesheet

**Claim:** SFIO chargesheet (Apr 2025) named CM's daughter T. Veena and 26 others under Section 447 of the Companies Act for ₹2.73 cr in payments from CMRL to Exalogic "for non-existent services." UDF talking point throughout the campaign. Personal corruption framing. Pinarayi's reduced Dharmadam margin is the visible scar.

**Sources:** Onmanorama, Mathrubhumi, Bar & Bench, The South First

**Theme:** anti-incumbency

**Testable?** Partly. Pinarayi's Dharmadam margin shrinkage is observable. Isolating "scandal-effect" from "rebel-effect" + general anti-incumbency requires booth-level data.

---

## B10. Public debt + youth unemployment as voter concern

**Claim:** Kerala's debt above ₹4.5 lakh crore; one-in-three youth unemployment; outmigration. Pre-poll surveys converged on jobs (~17-23%) and inflation (~15-19%) as top voter concerns.

**Sources:** Vote Vibe, Manorama-C Voter, Zee News, Open Magazine, Business Today

**Theme:** specific-issue

**Testable?** No directly. Issue salience requires survey microdata.

---

# TIER C — Untestable with seat-level data

## C1. National context — Congress recovery + Left's national disappearance

**Claim:** Kerala win frames as part of broader Congress revival and the Left's complete loss of state power for the first time in 50 years. Interpretive national framing.

**Theme:** national-context. Inherently macro, not seat-coded.

---

## C2. CPM-BJP "B-team" mutual accusations

**Claim:** Both alliances accused each other of being BJP's "B-team." UDF's "BJP-CPI(M) understanding" claim ended up resonating more with minority voters than the Left's counter-charge.

**Theme:** national-context. Narrative-level claim, hard to isolate from broader minority consolidation.

---

## C3. CPM's "secular image" erosion

**Claim:** CPM's social engineering blurred its secular brand. Open Magazine: "death of an ideal." Interpretive framing.

**Theme:** religion. Too broad to test as a single claim — operationalized into specific sub-narratives (A1, A12, A13).

---

## C4. Kerala's "alternation pattern"

**Claim:** Voters traditionally alternate every 5 years; 2021 was the COVID exception; 2026 was the return to pattern.

**Theme:** anti-incumbency. Historical interpretive framing — describes the cycle but doesn't predict which seats moved.

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
