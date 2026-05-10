# Muslim-belt premium — deep dive (UDF strategy)

This arc analyses how UDF performed in Muslim Kerala in 2026 — the
strategies UDF used and how each performed. The analysis universe is
**Malappuram, non-reserved seats only (15 ACs)**. The Christian belt
arc covers three Central-5 districts (Idukki, Ernakulam, Kottayam).

> **Excluded from the universe** (filtered out before analysis):
>
> - **Wayanad's 3 ACs** (Mananthavady ST, Sulthanbathery ST, Kalpetta) —
>   Wayanad is mixed-demographic, not Muslim-belt; two of three are
>   ST-reserved.
> - **Wandoor (SC reserved)** — reservation forces an SC candidate, so
>   strategy choice is constrained, not voluntary.
>
> So Wayanad's 3 + Wandoor's 1 = 4 ACs out → 19 − 4 = **15** in scope.

> **Reproduce:** `bun run scripts/analyze-muslim-belt.ts`

---

## 1. The Muslim premium has been large and stable since 2011

Comparing UDF performance in the rest of state vs ACs with ≥70%
Muslim share (n = 11):

| Year | UDF ≥70% Mus | UDF statewide | Premium |
|---|---|---|---|
| 2011 | 57.0% | 46.2% | +10.8pp |
| 2016 | 50.0% | 39.3% | +10.7pp |
| 2021 | 50.6% | 39.3% | +11.3pp |
| **2026** | **59.4%** | **46.6%** | **+12.8pp** |

- **The Muslim premium has been ~+11pp since 2011** — much larger than the Christian premium (~+3pp historically).
- In 2026 it grew modestly to **+12.8pp** — the historical pattern continues.
- Unlike the Christian belt, **the 2026 Muslim swing was wave-sized**, not amplified. ΔUDF at ≥70% Muslim ACs was +8.77pp — barely above the +7pp statewide wave. Muslims rode the wave from a higher baseline; they didn't surge in 2026 the way Christian-heavy ACs did.

> The Muslim story is therefore the *opposite shape* of the Christian story: stable historic premium continuing, vs. a smaller historic premium that doubled this cycle.

---

## 2. The 15 ACs of Malappuram (non-reserved)

Sorted by Muslim share descending. **UDF won 15 of 15.**

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

---

## 3. UDF's strategies in non-reserved Malappuram

### 3a. Muslim Alliance — IUML (12 seats)

UDF gave the seat to its Muslim-affiliated alliance partner.

Mean ΔUDF: **+8.8pp**. **12 of 12 won.**

(Same 12-seat list as the Muslim-Alliance rows in §2.)

### 3b. INC-Muslim — INC fields a Muslim candidate (2 seats)

| Name | H/C/M | Candidate | UDF Δ |
|---|---|---|---|
| Ponnani | 33/0/67 | K.P. Noushad Ali | +10.4 |
| Nilambur | 31/8/61 | Aryadan Shoukath | +15.4 |

Mean ΔUDF: **+12.9pp**. **2 of 2 won.**

### 3c. INC-Hindu — *empty bucket*

**No non-reserved Muslim-majority Malappuram seat had a Hindu INC candidate.** The two seats where INC fielded a Hindu in this universe were both reservation seats (Wandoor SC + Wayanad's two ST seats), all now filtered out.

This empty bucket is itself a strategic finding (see §4).

### Special — Thavanur (1 seat)

| Name | H/C/M | Candidate | UDF Δ |
|---|---|---|---|
| Thavanur | 33/0/67 | Adv. V.S. Joy (Christian) — INC | +4.1 |

INC fielded a Christian candidate at a 67%-Muslim seat. Anomalous. Set aside.

---

## 4. Performance — and a structural finding

| Strategy | n | Won | Mean ΔUDF |
|---|---|---|---|
| **Muslim Alliance (IUML)** | 12 | 12 | **+8.8pp** |
| **INC-Muslim** | 2 | 2 | **+12.9pp** |
| **INC-Hindu** | **0** | — | — |
| Special — INC-Christian (Thavanur) | 1 | 1 | +4.1pp |
| **Total** | **15** | **15** | |

Statewide ΔUDF reference: ~+7pp.

### What the data says

**INC-Muslim (+12.9pp) ≫ Muslim Alliance (+8.8pp).** As in the Christian belt, INC contesting directly outperformed the alliance route — INC-Muslim picked up ~4pp more swing than IUML did.

**Empty INC-Hindu bucket is the headline finding.** UDF ran zero non-reserved Muslim-majority Malappuram seats with a Hindu candidate. The strategic menu was:

1. Give the seat to IUML (12/15)
2. Run an INC-Muslim candidate (2/15)
3. (Anomaly: 1 INC-Christian at Thavanur)

**This is the inverse of the Christian belt strategy.** In Christian-belt seats, UDF freely mixed candidate religions inside INC — Hindu INC and Christian INC both contested ≥40%-Christian seats and both swung +10–11pp. UDF was happy to put a Hindu in front of Christian voters.

In Malappuram, **UDF was not willing to put a Hindu in front of Muslim voters** at non-reserved seats. The choice was always "Muslim" — either via IUML alliance or an INC-Muslim candidate.

### Caveats

- **Small sample for INC-Muslim** (n=2). Both Ponnani and Nilambur swung above +10pp, but two seats can't bear too much weight on the mean.
- **Thavanur (INC-Christian, +4.1pp)** is the exception that proves the rule: INC tried a non-Muslim candidate at a 67%-Muslim seat and got a swing well below the wave. UDF still won, but barely improved.

---

## 5. Closing aphorism — candidate framings

The original Option C ("Inside Muslim-Kerala the candidate's religion did matter — the opposite of Christian-Kerala, where it didn't") doesn't quite fit the new universe — we can't observe candidate religion within INC because INC-Hindu is empty. The finding is now structural: UDF's strategy *menu* itself was different in Muslim Kerala.

Re-framings to consider:

- **A.** "In Christian-belt seats UDF's INC fielded any candidate — Hindu, Christian, both worked. In Malappuram non-reserved seats UDF fielded only Muslims, either via IUML or INC. Hindu INC was off the menu."
- **B.** "Christians voted Congress regardless of who Congress fielded. Muslims didn't get the choice — UDF only ever offered them a Muslim candidate or an IUML one."
- **C.** "The asymmetry is who UDF ran: a Hindu INC could win Christian-Kerala. UDF didn't even try the same in Muslim-Kerala."
- **D.** "In Muslim-Kerala UDF's playbook had two options — IUML or INC-Muslim. INC-Hindu wasn't on the menu."

---

## Open questions / next investigations

1. **Verify V.S. Joy's religion** (Thavanur INC) — Christian per current marking. If Hindu, that becomes the only INC-Hindu seat in non-reserved Malappuram (still n=1, still messy).
2. **Why didn't UDF field Hindu INC in Malappuram?** Strategic choice (IUML coalition agreement?), historical convention, or community-pressure read? The page can't answer this; just note the absence.
3. **Statewide INC-Hindu-at-Muslim-majority test** — beyond Malappuram, did INC field any Hindu candidates at ≥60% Muslim seats elsewhere in Kerala? If yes, we'd have a state-level INC-Hindu-Muslim-majority comparison cohort. This is outside the current arc's scope but flags whether Malappuram's pattern is universal or specific.

---

## Visualisations to build

Mirroring the Christian section:

1. **Scatter** — Muslim share (x) × UDF Δshare (y), all 140 ACs. Will show the Muslim-belt premium is broad and high but the swing is wave-sized at ≥70% Muslim.
2. **Choropleth** — Malappuram cropped (15 non-reserved ACs), coloured by strategy: Muslim Alliance (green), INC-Muslim (UDF blue), Special (gray). Reservation seats (Wandoor SC) and Wayanad excluded entirely from the visual.
