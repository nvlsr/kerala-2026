# Future investigations

Open analytical threads identified during catalog construction or page-review iterations that are worth picking up but aren't blocking current publishing work. Each item names what's missing, why it might matter, and the data we'd need to make progress.

---

## F1 — Religious-composition shape of BJP's Trivandrum cluster

**Question.** The 3 BJP wins (Nemom, Chathannoor, Kazhakoottam) sit in 65-72% Hindu seats whose non-Hindu portion is *Hindu + Muslim*, not *Hindu + Christian* — different from Pala / Thiruvalla / Kanjirappally where BJP also gained but didn't win. Does the *shape* of the religious mix (H+M vs H+C vs H,C,M) predict BJP outcomes independently of Hindu share alone?

**Why it might matter.** The current Arc-3 cluster claim says: "BJP won where Hindu share was high *and* something else." We've narrowed the "something else" to "we can't tell from AC-level data." A composition-shape analysis might recover signal that simple Hindu-share regressions miss. Specifically: in three-way contests, UDF performance against NDA may depend on whether the second-largest community is Muslim (where IUML is strong and UDF leans on coalition turnout) or Christian (where the church-political dynamics differ).

**What we'd need.**
- AC-level religion shares for all three communities (already have via `data/ac-demographics-2025.json`).
- A binning scheme: `H+M` (≥30% Muslim, <15% Christian), `H+C` (≥30% Christian, <15% Muslim), `H,C,M` (mixed), `H-only` (<15% of each).
- Per-bin BJP Δshare and UDF Δshare means; check whether the 3-wins cluster sits in a distinctive bin.
- Robustness: district fixed effects (knowing district FE will absorb most variation, but the within-district contrast may still be visible).

**Hypothesis to test.** BJP performs better in H+M than in H+C or H,C,M, holding Hindu share constant. UDF performs better in H+C than in H+M, also holding Hindu share constant.

**Why it's deferred.** The current page can stand without this — the cluster claim is descriptively defensible. But a composition-shape analysis would be a real refinement, and it's a feasible follow-up card.

---

## F2 — Region-level (vs district-level) cuts of BJP's 3-bucket strategy

**Question.** The Arc-3 page now slices BJP's gains/withdrawals/shrinkages by *district*, identifying 3 archetypes: push (Trivandrum, Kannur), swap (Kottayam, Kollam), retreat (Ernakulam, Thrissur, Pathanamthitta, Idukki). District boundaries are administratively-defined, not strategically-defined. Does a *region-level* cut (e.g. South / Central / North Kerala, or coastal / midland / hill, or Travancore / Cochin / Malabar) reveal a cleaner strategic shape?

**Why it might matter.** District is an arbitrary unit for political analysis. The strategic logic — where to push, where to swap, where to retreat — likely follows political-geographic boundaries (cultural-linguistic regions, historical administrative divisions, or campaign-organisational zones), not modern district lines. The district archetypes we surface may be artefacts of where district boundaries happen to fall vs the underlying strategic logic.

**What we'd need.**
- A region taxonomy (or several to compare):
  - **Travancore / Cochin / Malabar** (historical kingdoms, durable political identity)
  - **South / Central / North** (latitude bands)
  - **Coastal / Midland / Hill** (geographic zones)
  - Or: **NDA-strong / mixed / NDA-weak** belts (data-driven, not pre-imposed).
- Per-region: bucket-1 sums, bucket-2a sums, bucket-2b sums, plus T20-vs-BDJS substitution split.
- Cross-tab the archetypes against districts to see which framing has cleaner explanatory power.

**Hypothesis to test.** South Kerala (or Travancore) is the push region; central Kerala is the swap region; Malabar is mixed. The district-level archetypes may cluster within regions (e.g. Trivandrum + Kollam push and swap = "South push-and-swap"; Ernakulam + Thrissur retreat = "Cochin retreat").

**Why it's deferred.** The current Arc-3 page works at the district level because the chart we have is district-binned. A region cut would need recomputation and possibly a new chart. Worth doing if the district-archetype framing holds up under scrutiny but feels coarse.

---

## How to pick these up

Each item is scoped as a follow-up narrative card. The discipline:

1. Reproduce the analysis as a Python script under `scripts/`.
2. Write a card under `docs/narrative-cards/` with: claim, evidence, what-it-shows, what-it-doesn't-show, what-would-weaken.
3. Surface findings on the relevant arc page only after the card is written and the source-discipline is verified.

If a third or fourth investigation surfaces during ongoing review, append here with the same structure.


## BJP Growth
Initally
 - Kasargod
 - Palakkad

then expanded to:
- Thiruvanthapuram
- Thrissur

then expanded to:
- Kozhikode
- Kollam


Is BJP doing better in these urban vs rural?

1/ Christians traditioanlly vote for UDF     

When we compare UDF performance in rest of state against UDF performance in ACs with 40% or more Christian population, we see they consistently do better.

Christian premium = UDF at ≥40% Christian − UDF statewide:

Year	Premium
2011	+2.6pp
2016	+2.9pp
2021	+2.1pp
2026	+4.6pp

Christians have voted UDF more than statewide in every cycle since 2011 — the historical premium is real but modest, ~2–3pp.
The 2026 premium roughly doubled to +4.6pp. The size of the 2026 premium is the news


  2/ We need some color on the Christian majority seats which are reservered fro Christian parties.   
  what happens there, what has been happening   

The UDF list:
AC	District	Name	Chr%	Party vote 2021	Party vote 2026	Δ	UDF vote 2026	UDF Δ	Won?
4	Kasaragod	Kanhangad	12.1	0% (didn't contest)	37.0	+37.0	37.0	+2.5	lost
70	Thrissur	Irinjalakuda	26.6	36.4	43.8	+7.3	43.8	+7.3	won
85	Ernakulam	Piravom (KC-Jacob)	42.1	53.8	59.2	+5.4	59.2	+5.4	won
87	Ernakulam	Kothamangalam	29.2	42.2	53.1	+10.9	53.1	+10.9	won
90	Idukki	Thodupuzha	40.6	48.6	58.4	+9.7	58.4	+9.7	won
94	Kottayam	Kaduthuruthy	44.1	45.4	56.8	+11.4	56.8	+11.4	won
99	Kottayam	Changanassery	43.5	39.9	46.4	+6.5	46.4	+6.5	won
106	Alappuzha	Kuttanad	36.7	41.3	50.6	+9.3	50.6	+9.3	won
111	Pathanamthitta	Thiruvalla	47.8	36.4	38.0	+1.6	38.0	+1.6	won

The LDF list:
2.2 LDF Christian-party seats in 2026 (KC(M) + KC(B), 13 ACs)
AC	District	Name	Chr%	KCM/KCB 2021	KCM/KCB 2026	Δ	LDF Δ	Won?
9	Kannur	Irikkur	28.1	43.8	32.1	−11.6	−11.6	lost
72	Thrissur	Chalakudy	44.4	42.5	35.1	−7.4	−7.4	lost
74	Ernakulam	Perumbavoor	38.6	35.1	31.8	−3.3	−3.3	lost
85	Ernakulam	Piravom	42.1	37.8	29.7	−8.1	−8.1	lost
90	Idukki	Thodupuzha	40.6	34.0	27.9	−6.2	−6.2	lost
91	Idukki	Idukki	47.3	47.5	36.6	−10.9	−10.9	lost
93	Kottayam	Pala	52.0	39.3	35.3	−4.0	−4.0	lost
94	Kottayam	Kaduthuruthy	44.1	42.2	31.5	−10.6	−10.6	lost
99	Kottayam	Changanassery	43.5	44.8	39.5	−5.4	−5.4	lost
100	Kottayam	Kanjirappally	43.0	43.8	37.6	−6.2	−6.2	lost
101	Kottayam	Poonjar	41.5	41.9	34.8	−7.1	−7.1	lost
112	Pathanamthitta	Ranni	46.9	41.2	40.8	−0.4	−0.4	lost
120	Kollam	Pathanapuram (KC(B))	20.2	49.1	43.8	−5.3	−5.3	lost

[what is the common list?]
[what is the top 15 ACs by Christian population?]
[how does the UDF/LDF list above compared to christian population?]
[i imagine for the Christian signficant seats, UDF and LDF either user alliances, or they put christian candidates. So we need to now find out those seats where they have traditionally been attacking using christian candidates]


  3. in this election, UDF not only captured the UDF swing, but it got an additional Christian        
  premium (I wonder if that means Christians who voted for LDF before swung to UDF)     

  [this is already shown from section 1's data on the christian premium]

  4. we need to better understand pattern this time for Christian reserved seats and other seats in   
  this 5 districts. 
    a/ how did the Christian party seats perform: they switched cleanly from LDF to UDF (at the same swing as state-wide)
    b/ how did the Christian majority seats held by LDF/UDF (without alliance) switch? did they have the same swing?
    c/ What about the rest of the ACs in the 5 central districts

Subset	n	Mean Chr%	Mean Mus%	Mean ΔUDF
UDF Christian-party seat (KEC/KC-Jacob)	5	39.9	16.0	+8.8pp
LDF Christian-party only (KC(M)/KC(B), no UDF Christian)	5	44.5	12.1	+7.2pp
High-Christian (≥30%) but no Christian party either side	16	40.4	12.2	+11.9pp
Muslim-heavy (≥50%)	16	1.7	73.2	+9.0pp
Other Central-5 (Wayanad + Aluva + Vaikom)	5	22.6	26.9	+5.2pp

The Central-5 sweep is at least three different stories spatially co-located:
Muslim Malappuram (16 ACs): ΔUDF +9.0pp — the Muslim-heavy north of Malappuram swept clean, with IUML doing the work. This is a Muslim-community story, not a Christian one.
Christian Idukki/Kottayam/Ernakulam (~26 ACs): ΔUDF ranging from +7.2pp at KC(M) seats to +11.9pp at high-Christian no-party-contesting seats. This is the Christian-belt story.
Wayanad + scattered (5 ACs): ΔUDF +5.2pp — much closer to statewide wave, neither Christian-belt nor Muslim-belt. Wayanad's swing to UDF was real but unremarkable.

[let's split central kerala into two sections one focussing on christian and one focussing on muslim. We already have a muslim section. The central kerala one will turn into the christion section. let's drop the wayanad and other ACs since they don't cleanly fit in christian or muslim.]

The 16 "high-Christian, no-Christian-party" seats
These are the cleanest test of cross-community Christian-belt premium:

AC 75 ANGAMALY        (ernakulam)        chr 64.5%  ΔUDF  +8.3pp
AC 77 KALAMASSERY     (ernakulam)        chr 33.9%  ΔUDF +10.1pp
AC 78 PARAVUR         (ernakulam)        chr 33.5%  ΔUDF  -2.3pp ← only negative
AC 79 VYPEN           (ernakulam)        chr 41.0%  ΔUDF +15.5pp
AC 80 KOCHI           (ernakulam)        chr 40.0%  ΔUDF +16.7pp
AC 81 THRIPUNITHURA   (ernakulam)        chr 33.9%  ΔUDF  +3.7pp
AC 82 ERANAKULAM      (ernakulam)        chr 33.9%  ΔUDF +15.8pp
AC 83 THRIKKAKARA     (ernakulam)        chr 33.9%  ΔUDF +16.1pp
AC 84 KUNNATHUNAD     (ernakulam)        chr 34.7%  ΔUDF +11.9pp
AC 86 MUVATTUPUZHA    (ernakulam)        chr 40.4%  ΔUDF +16.4pp
AC 88 DEVIKULAM       (idukki)           chr 31.8%  ΔUDF  +1.2pp ← reserved (ST)?
AC 89 UDUMBANCHOLA    (idukki)           chr 48.3%  ΔUDF +22.6pp ← biggest swing in Kerala
AC 92 PEERUMADE       (idukki)           chr 41.3%  ΔUDF +11.4pp ← reserved (SC)
AC 96 ETTUMANOOR      (kottayam)         chr 44.6%  ΔUDF +17.5pp
AC 97 KOTTAYAM        (kottayam)         chr 41.1%  ΔUDF  +7.2pp
AC 98 PUTHUPPALLY     (kottayam)         chr 49.1%  ΔUDF +17.8pp ← Chandy legacy seat

13 of 16 swung +7pp or more (above statewide wave); 11 of 16 swung +10pp or more.

this indicates the christian seats swung at the same performance as non christian seats.
Now i wonder where the christian premium in the swing we found int he first section comes from.

ΔUDF by Christian-share bin (all 140 ACs)
Bin	n	ΔUDF	ΔLDF	ΔNDA
<5%	44	+6.83	−7.42	+1.47
5-15%	25	+5.38	−7.55	+3.42
15-30%	37	+6.95	−6.94	+0.92
30-40%	13	+9.45	−6.96	+3.19
≥40%	21	+9.78	−8.46	+2.94
The gradient is clear: above 30% Christian share, ΔUDF jumps from ~7pp to ~10pp. The +3pp premium on top of the statewide wave is real and visible in raw means before any regression.

5.2 ΔUDF by bin × Christian-party-seat flag
Christian bin	Christian-party seat (n, ΔUDF)	No Christian party (n, ΔUDF)
<5%	n=0, n/a	n=44, +6.83pp
5-15%	n=1, +2.53pp	n=24, +5.50pp
15-30%	n=4, +9.84pp	n=33, +6.60pp
30-40%	n=2, +11.71pp	n=11, +9.04pp
≥40%	n=11, +6.30pp	n=10, +13.61pp

At the highest Christian bin (≥40%), ACs WITHOUT any Christian party contesting swung +13.6pp — more than double the +6.3pp at Christian-party-contested seats.

I wonder if this is indicating the 'ill go get christian votes myself without alliances' strategy worked out well for UDF?

  5. I feel we should also do the correlation analysis (which currently is great) with above slices.  
  What happens in districts where Christians are a minority, not zero vs Christians a majority vs     
  Christian reserved.                                                                                 
  6. Once we do all this, we should have a shape of analysis that I feel will give  us insights to    
  analyze the similar muslim seat behavior.  

  6.2 UDF baseline by Muslim-share bin (multi-cycle)
Year	<10%	10-25%	25-50%	50-70%	≥70%	Statewide
2011	47.5	45.1	43.7	47.0	57.0	46.2
2016	39.5	37.3	38.2	41.6	50.0	39.3
2021	39.4	36.7	38.6	43.3	50.6	39.3
2026	48.3	43.8	44.7	50.4	59.4	46.6
6.3 Muslim premium = UDF at ≥70% Muslim − UDF statewide
Year	Premium
2011	+10.8pp
2016	+10.7pp
2021	+11.3pp
2026	+12.8pp
Findings
The Muslim premium is structurally larger than the Christian premium and much more stable. Muslim-heavy ACs have given UDF +10–13pp above statewide in every cycle since 2011.