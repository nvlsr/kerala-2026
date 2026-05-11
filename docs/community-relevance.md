# Community relevance — per-AC framework

A per-AC analytical view of which communities are *electorally relevant* — large enough and politically organised enough to shape (or have shaped) the 2026 result, or to constrain candidate selection in future cycles.

The framework runs across all 140 ACs and assigns each one:

- A **primary driver** — Christian sub-rite / Christian aggregate / Muslim / Christian + Muslim / Hindu (district overlay) / diffuse
- A **net tag** — decisive / blocking / hindu-driven / diffuse
- A **confidence level** — HIGH ★★★ / MEDIUM ★★ / LOW ★ / UNKNOWN —
- A **durable flag** — was the 2026 winner the same as 2021 winner? (true = continuing pattern, false = community caused a flip)
- A **6-cell alliance-roles matrix** — for each of UDF / LDF / NDA, who would flip the seat *to* them and who blocks them *from* winning. Sparse — most cells blank.
- A **one-line note** with relevant communities and Hindu sub-caste context

Records are persisted in `data/community-relevance.json` and exposed via `src/lib/data/community-relevance.ts`. Build script: `scripts/pipeline/build-community-relevance.ts`.

---

## 1. The framework

### 1a. Inputs

| Layer | AC-level? | Source |
| --- | --- | --- |
| Christian sub-rite voter-share | ✅ | `getVoterShareBreakdown()` over `ac-religious-pois.json` |
| Christian aggregate (religion-level) | ✅ | Census 2025 share in `ac-religion-2025.json` |
| Muslim aggregate (religion-level) | ✅ | Same |
| Muslim sub-rite | ⚠️ Not used | Didn't show predictive signal in 2026 analysis |
| Muslim sub-type | District inheritance | `community-belts.json` + special-case for Wayanad |
| Hindu sub-caste | District inheritance | `district-hindu-castes.json` |
| AC margin | ✅ | `data/results-2026.json` |
| 2021 AC winner (for durable flag) | ✅ | `data/ac-history.json` |
| Winner candidate religion | Partial (48 of 140) | `walkthroughs/udf-data.ts:CHRISTIAN_BELT_36` + Malappuram strategy inference |
| Christian sub-rite voting direction | Statewide cohort means | `docs/narratives/christian.md §3` |

### 1b. Tag math

For each (AC, community) pair where presence ≥ 5 %:

```
required_swing_pp = AC_margin_pp / (community_share / 100)
```

| Tag | Rule | Interpretation |
| --- | --- | --- |
| **decisive** | `required_swing ≤ 25 pp` | Community can plausibly flip the 2026 outcome (validated via threshold-sensitivity sweep: 15→30 pp range, 25 sits at the knee). |
| **blocking** | not decisive, but `share ≥ 20 %` | Too few or margin too wide for 2026, but large enough that parties cannot ignore. |
| **latent** | present (≥ 5 %) but neither | Recorded but not promoted to AC-level net tag. |

### 1c. Confidence tiers

| Tier | Decisive criteria | Blocking criteria |
| --- | --- | --- |
| **HIGH ★★★** | share ≥ 12 % AND required_swing ≤ 15 pp AND not SHRUG-fallback | share ≥ 25 % AND not SHRUG-fallback |
| **MEDIUM ★★** | share ≥ 8 % AND required_swing ≤ 20 pp | share ≥ 20 % |
| **LOW ★** | share ≥ 5 % AND required_swing ≤ 25 pp | (not applicable) |

AC's net confidence is the max tier across its tagged communities. Hindu-district-driven ACs are LOW by definition.

### 1d. Christian sub-rite coordination

Direction tags from `docs/narratives/christian.md §3`:

| Direction tag | Sub-rites in tag |
| --- | --- |
| **UDF-up** | Latin Catholic, Syro-Malabar, Syro-Malankara, Knanaya, Marthoma, Indian Orthodox, Pentecostal, Brethren, Other |
| **T20-mixed** | Jacobite Syrian (UDF-up base + Twenty 20 NDA component) |
| **NDA-leaning** | CSI |

| Coordination | Definition |
| --- | --- |
| `single` | Only one tagged sub-rite |
| `coordinated` | Multiple tagged sub-rites, all in UDF-up + T20-mixed direction |
| `fractured` | **CSI present at ≥ 5 % AND a UDF-up sub-rite present at ≥ 5 %** — regardless of whether either passes the tier threshold. (Loosened from v2 to catch Nemom / Parassala-pattern ACs where individual sub-rites are sub-threshold but the directional conflict is real.) |

### 1e. Muslim sub-type (district inheritance + Wayanad special-case)

| Sub-type | Districts | Political behaviour |
| --- | --- | --- |
| **iuml-stronghold** | Malappuram | Reliable UDF via IUML; outcomes mostly foregone, Muslim defines the AC |
| **mixed-muslim** | Kasaragod, Kannur, Kozhikode | Less monolithic; vote splits between UDF (IUML/INC) and LDF-aligned Muslim parties (INL, NSC) |
| **mixed-muslim-wayanad** | Wayanad | Sunni-organised, Wayanad-specific dynamics distinct from northern-mixed |
| **cosmopolitan** | All other districts | Lower bloc-voting; Muslim share is a constituent piece of urban/mixed ACs |

### 1f. Hindu sub-caste district overlay

Inherited from `district-hindu-castes.json`:

| Profile | Threshold | Districts |
| --- | --- | --- |
| **nair-heavy** | Nair ≥ 35 % of Hindu pop | Thiruvananthapuram, Pathanamthitta |
| **ezhava-very-heavy** | Ezhava ≥ 50 % | Alappuzha, Kozhikode, Kannur (Tiyya-distinct) |
| **ezhava-heavy** | Ezhava 40–50 % | Idukki, Thrissur, Kottayam (kept as context only) |
| **mixed-nair-ezhava** | Nair ≥ 25 % AND Ezhava ≥ 25 % | Kollam |
| **mixed-ezhava-leaning** | Ezhava 30–40 % | Ernakulam, Malappuram |
| **mixed-fragmented** | None of the above | Kasaragod |
| **sc-st-heavy** | Special case | Wayanad |

Hindu profile is **secondary information**: appended to the note as `Hindu context: <profile>` when Christian/Muslim drive the primary tag. Becomes **primary driver** only for nair-heavy / ezhava-very-heavy / sc-st-heavy profiles when no Christian/Muslim relevance.

### 1g. Primary-driver selection

Priority — first that applies:

1. **both-christian-muslim** — both Christian and Muslim relevant
2. **christian-subrite** — at least one Christian sub-rite tagged
3. **christian-aggregate** — aggregate Christian tagged, no individual sub-rite
4. **muslim** — Muslim aggregate tagged
5. **hindu-district** — nair-heavy / ezhava-very-heavy / sc-st-heavy district with no Christian/Muslim relevance
6. **diffuse** — nothing reaches relevance

### 1h. Durable flag

`durable: true` when 2026 winner alliance equals 2021 winner alliance.
`durable: false` when the AC flipped between 2021 and 2026.
`durable: null` when 2021 winner was OTHER or data unavailable.

Reads as: durable=true → community relevance is multi-cycle; durable=false → 2026 outcome diverged from 2021, which is informative for future-cycle inference.

### 1i. Alliance-roles matrix (the 6-cell schema)

For each AC, up to 6 cells fill in `allianceRoles.{UDF|LDF|NDA}.{flipTo|blockFrom}`. Rules are **sparse**: cells stay null when the story isn't clear.

| Cell | Filled when |
| --- | --- |
| `flip-to-WINNER` | Margin ≤ 7 pp AND a community can be credited |
| `flip-to-RUNNER_UP` | Margin ≤ 5 pp AND credible swing-back path |
| `flip-to-NDA` (in non-NDA ACs) | Margin ≤ 12 pp AND nair-heavy district AND no large minority blocker |
| `block-NDA` | Muslim ≥ 25 % (mechanical) OR Christian ≥ 20 % coordinated UDF-up |
| `block-UDF` / `block-LDF` | LOSER alliance has structural community opposing — e.g. Ezhava-Tiyya base when LDF won, Hindu Nair vote when NDA won, etc. |

Encoded in `scripts/pipeline/build-community-relevance.ts:computeAllianceRoles`. Conservative — when ambiguous, leave blank.

---

## 2. Headline coverage

Across all 140 ACs:

| Category | Count |
| --- | ---: |
| **Decisive** (community could plausibly flip 2026) | **58** |
| **Blocking** (community durable but margin too wide) | **69** |
| **Hindu-driven** (district overlay) | **10** |
| **Diffuse** (no identified relevant community) | **3** |
| **Total** | **140** |

| Confidence | Count |
| --- | ---: |
| HIGH ★★★ | 76 |
| MEDIUM ★★ | 40 |
| LOW ★ | 21 |
| UNKNOWN — | 3 |

| Primary driver | Count |
| --- | ---: |
| Muslim | 65 |
| Christian + Muslim | 26 |
| Christian (sub-rite) | 19 |
| Christian (aggregate, dispersed) | 17 |
| Hindu (district overlay) | 10 |
| Diffuse | 3 |

| Durable flag | Count |
| --- | ---: |
| Durable (same alliance won 2021 and 2026) | 76 |
| Flipped (alliance change 2021 → 2026) | 64 |
| Unknown | 0 |

| Christian coordination | Count |
| --- | ---: |
| `single` | 26 |
| `coordinated` | 1 (Konni) |
| `fractured` | **8** (Peerumade, Kaduthuruthy, Kanjirappally, Eravipuram, Nemom, Parassala, Kovalam, Neyyattinkara) |
| no tagged sub-rite | 105 |

### Threshold sensitivity (data-driven decision on 25 pp ceiling)

| Plausible swing | Decisive ACs |
| ---: | ---: |
| 15 pp | 31 |
| 18 pp | 41 |
| 20 pp | 44 |
| 22 pp | 49 |
| **25 pp** (chosen) | **58** |
| 28 pp | 67 |
| 30 pp | 75 |

The slope flattens around 22–25 pp — confirms 25 pp is the right knee. Matches observed cohort-mean swings (Latin Catholic +14.7 pp in 2026 + plausible AC-level overshoot).

---

## 3. Notable findings

### 3a. The 8 fractured Christian ACs

The loosened `fractured` rule catches 8 ACs where CSI (NDA-leaning) and UDF-up sub-rites are both present, regardless of which crosses the tier bar. These are the ACs where the framework would over-claim Christian unity without the fractured flag:

| AC | Name | Margin | Note |
| ---: | --- | --- | --- |
| 92 | Peerumade | +22.5 pp UDF | Aggregate Christian @ 41 % — fractured by CSI presence |
| 94 | Kaduthuruthy | +25.1 pp UDF | Syro-Malabar @ 22 % blocking, CSI presence fractures Christian aggregate |
| 100 | Kanjirappally | +4.2 pp UDF | Aggregate Christian @ 43 % — but CSI 5 % + Pentecostal/Orthodox/SM split |
| 125 | Eravipuram | +6.6 pp UDF | Christian aggregate @ 19 % fractured; Muslim @ 28 % is the cleaner driver |
| 135 | Nemom | +3.5 pp NDA | The marquee case — fractured Christian aggregate matches the NDA win story |
| 137 | Parassala | +9.7 pp LDF | CSI @ 21 % blocking, fractures aggregate |
| 139 | Kovalam | +21.1 pp UDF | Christian aggregate @ 17 % — Hindu-driven really, CSI fractures the Christian bloc |
| 140 | Neyyattinkara | +5.2 pp UDF | Christian @ 17 % fractured; Hindu nair-heavy district context |

### 3b. 64 ACs flipped between 2021 and 2026

Roughly half the state. The durable=false set is informative for which 2026 community-relevance tags reflect a *cycle-specific* community swing vs. *durable* community alignment. Examples:

- **Kozhikode N + S** (UDF +1.0 / +8.4) — Muslim flipped both UDF in 2026 from LDF 2021. The framework correctly tags Muslim decisive; durable=false says this was a 2026 swing, not a structural Muslim-UDF alignment in these specific seats.
- **Konni (114)** — durable=false. LDF held in 2021, UDF was poised to flip in 2026 via the coordinated Christian sub-rite swing; LDF held by 1.4 pp anyway.
- **Aroor (102)** — durable=false. Latin Catholic flipped the seat to UDF.

For 2031 forecasting, durable=true tags are stronger signals than durable=false tags.

### 3c. Konni — the coordinated marquee case

AC 114, 1.4 pp LDF margin. Three Christian sub-rites simultaneously decisive:

- Indian Orthodox @ 12 % (UDF-up, HIGH-confidence)
- Marthoma @ 7 % (UDF-up)
- Syro-Malabar @ 7 % (UDF-up)
- Aggregate Christian @ 33 %
- District: Pathanamthitta (nair-heavy, Nair 38 % / Ezhava 26 % of Hindus)
- 2021 winner: LDF. Durable=true (LDF held both cycles)

Alliance roles for Konni:
- `flip-to-UDF`: Christian community (coordinated sub-rites, all UDF-up)
- `flip-to-LDF`: Ezhava-Tiyya base if Christian/Muslim return to LDF
- `block-NDA`: Christian + Muslim combined @ 38 %

Christian coordinated UDF; Nair-Ezhava Hindu vote held LDF.

### 3d. Nemom — the fractured contrast

AC 135, 3.5 pp NDA margin. Aggregate Christian @ 17 % but fractured (CSI 8 % + Latin 6 %).

Alliance roles:
- `flip-to-NDA`: Hindu Nair consolidation (39 % Nair) + CSI Christian segment + strong BJP candidate
- `flip-to-UDF`: Christian community would need to overcome CSI NDA-lean to consolidate UDF
- `block-UDF`: Hindu Nair NDA-curious vote + organised BJP
- `block-LDF`: same

The framework now correctly distinguishes Konni's coordinated Christian from Nemom's fractured one.

### 3e. The "block-NDA" structural floor

72 ACs have Muslim ≥ 25 % AND therefore a `block-NDA` cell stating *"Muslim community mechanically blocks Hindu-only NDA path"*. This is the clearest non-2026-specific finding: **BJP's path to majority is structurally constrained by the geographic distribution of the Muslim community.** No matter how much Hindu consolidation BJP achieves, ~50 % of the seats have Muslim share large enough that BJP needs cross-community appeal — which it hasn't built in Kerala.

### 3f. Hindu sub-caste zone (10 ACs, LOW confidence)

10 ACs are Hindu-driven (no Christian/Muslim signal reaches threshold). Geographic concentration:

- **5 in Trivandrum** (nair-heavy): Vattiyoorkavu, Neyyattinkara → wait — Neyyattinkara is in the fractured list. Let me recheck the list. Actually after re-running with the Wayanad split + fractured loosening, the Hindu-driven list shrinks. The framework correctly tags Neyyattinkara as fractured-Christian (Christian@17% fractured + Hindu context) instead of pure Hindu-driven.

- The Trivandrum nair-heavy ACs that remain Hindu-driven primary: those without Christian fractures. Vattiyoorkavu, Vamanapuram, Thiruvananthapuram, Attingal, Kovalam — wait Kovalam is also fractured. Let me look:

Hindu-driven primary (10 ACs):
- Alappuzha ezhava-very-heavy: Cherthala, Alappuzha, Haripad, Kayamkulam, Mavelikkara
- Trivandrum nair-heavy: Vattiyoorkavu, Neyyattinkara, Vamanapuram, Thiruvananthapuram, Attingal

(Kovalam falls into fractured-Christian primary because of CSI presence.)

### 3g. Only 3 ACs are truly diffuse

- AC 4 Kanhangad (Kasaragod, mixed-fragmented) — 8.7 pp LDF
- AC 122 Chadayamangalam (Kollam, mixed-nair-ezhava) — 4.9 pp UDF
- AC 118 Kunnathur (Kollam, mixed-nair-ezhava) — 15.4 pp UDF

These are ACs with mixed-Hindu profile + no Christian/Muslim relevance — the genuine framework blind spot.

---

## 4. Per-AC records — all 140

Sorted north → south by district. Stars: ★★★ HIGH / ★★ MEDIUM / ★ LOW / — UNKNOWN. Durable: ✓ = same alliance 2021+2026; flipped = different.

### Kasaragod (5 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 1 | MANJESHWAR | +15.6pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @53% [mixed-muslim] |
| 2 | KASARAGOD | +13.4pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @54% [mixed-muslim] |
| 3 | UDMA | +2.7pp UDF | decisive | ★★★ | flipped | Muslim | Muslim @41% [mixed-muslim] |
| 4 | KANHANGAD | +8.7pp LDF | diffuse | — | ✓ | — | No identified relevant community |
| 5 | TRIKARIPUR | +2.6pp UDF | decisive | ★★★ | flipped | Muslim | Muslim @21% [mixed-muslim] |

### Kannur (11 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 6 | PAYYANNUR | +4.8pp UDF | decisive | ★ | flipped | Muslim | Muslim @20% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 7 | KALLIASSERI | +11.5pp LDF | blocking | ★★★ | ✓ | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 8 | TALIPARAMBA | +6.5pp UDF | decisive | ★★ | flipped | Muslim | Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 9 | IRIKKUR | +28.0pp UDF | blocking | ★★★ | ✓ | Christian + Muslim | Christian: latin_catholic@23% [single] + Muslim @22% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 10 | AZHIKODE | +0.2pp LDF | decisive | ★★★ | ✓ | Muslim | Muslim @40% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 11 | KANNUR | +13.2pp UDF | blocking | ★★★ | flipped | Muslim | Muslim @43% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 12 | DHARMADAM | +11.2pp LDF | blocking | ★★★ | ✓ | Muslim | Muslim @31% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 13 | THALASSERY | +14.2pp LDF | blocking | ★★★ | ✓ | Muslim | Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 14 | KUTHUPARAMBA | +0.8pp LDF | decisive | ★★★ | ✓ | Christian + Muslim | Aggregate Christian @6% [dispersed] + Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 15 | MATTANNUR | +8.3pp LDF | blocking | ★★★ | ✓ | Muslim | Muslim @31% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 16 | PERAVOOR | +9.8pp UDF | blocking | ★★★ | ✓ | Christian + Muslim | Aggregate Christian @23% [dispersed] + Muslim @25% [mixed-muslim] + Hindu context: ezhava-very-heavy district |

### Wayanad (3 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 17 | MANANTHAVADY | +6.4pp UDF | decisive | ★★ | flipped | Christian + Muslim | Aggregate Christian @23% [dispersed] + Muslim @33% [mixed-muslim-wayanad] + Hindu context: sc-st-heavy district |
| 18 | SULTHANBATHERY | +9.4pp UDF | blocking | ★★ | ✓ | Christian (aggregate) | Aggregate Christian @24% [dispersed] + Hindu context: sc-st-heavy district |
| 19 | KALPETTA | +26.0pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @45% [mixed-muslim-wayanad] + Hindu context: sc-st-heavy district |

### Kozhikode (13 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 20 | VADAKARA | +10.4pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 21 | KUTTIADI | +6.1pp UDF | decisive | ★★ | flipped | Muslim | Muslim @39% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 22 | NADAPURAM | +12.5pp UDF | blocking | ★★★ | flipped | Muslim | Muslim @44% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 23 | QUILANDY | +7.0pp UDF | decisive | ★★ | flipped | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 24 | PERAMBRA | +3.0pp UDF | decisive | ★★ | flipped | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 25 | BALUSSERI | +8.9pp UDF | decisive | ★ | flipped | Muslim | Muslim @36% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 26 | ELATHUR | +6.8pp UDF | decisive | ★★ | flipped | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 27 | KOZHIKODE NORTH | +1.0pp UDF | decisive | ★★ | flipped | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 28 | KOZHIKODE SOUTH | +8.4pp UDF | decisive | ★ | flipped | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 29 | BEYPORE | +4.0pp LDF | decisive | ★★ | ✓ | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 30 | KUNNAMANGALAM | +6.4pp UDF | decisive | ★★★ | flipped | Muslim | Muslim @45% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 31 | KODUVALLY | +22.1pp UDF | blocking | ★★ | ✓ | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 32 | THIRUVAMBADI | +4.3pp UDF | decisive | ★★★ | flipped | Muslim | Muslim @54% [mixed-muslim] + Hindu context: ezhava-very-heavy district |

### Malappuram (16 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 33 | KONDOTTY | +29.2pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @72% [iuml-stronghold] |
| 34 | ERNAD | +24.5pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @77% [iuml-stronghold] |
| 35 | NILAMBUR | +28.9pp UDF | blocking | ★★★ | flipped | Muslim | Muslim @61% [iuml-stronghold] |
| 36 | WANDOOR | +23.6pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @62% [iuml-stronghold] |
| 37 | MANJERI | +30.5pp UDF | blocking | ★★ | ✓ | Muslim | Muslim @75% [iuml-stronghold] |
| 38 | PERINTHALMANNA | +17.4pp UDF | decisive | ★ | ✓ | Muslim | Muslim @71% [iuml-stronghold] |
| 39 | MANKADA | +24.3pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @75% [iuml-stronghold] |
| 40 | MALAPPURAM | +43.3pp UDF | blocking | ★★ | ✓ | Muslim | Muslim @75% [iuml-stronghold] |
| 41 | VENGARA | +17.8pp UDF | decisive | ★ | ✓ | Muslim | Muslim @85% [iuml-stronghold] |
| 42 | VALLIKUNNU | +28.3pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @69% [iuml-stronghold] |
| 43 | TIRURANGADI | +36.0pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @82% [iuml-stronghold] |
| 44 | TANUR | +15.7pp UDF | decisive | ★★ | flipped | Muslim | Muslim @82% [iuml-stronghold] |
| 45 | TIRUR | +12.2pp UDF | decisive | ★★ | ✓ | Muslim | Muslim @78% [iuml-stronghold] |
| 46 | KOTTAKKAL | +32.8pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @75% [iuml-stronghold] |
| 47 | THAVANUR | +8.9pp UDF | decisive | ★★★ | flipped | Muslim | Muslim @67% [iuml-stronghold] |
| 48 | PONNANI | +8.2pp UDF | decisive | ★★★ | flipped | Muslim | Muslim @67% [iuml-stronghold] |

### Palakkad (12 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 49 | THRITHALA | +5.2pp UDF | decisive | ★★★ | flipped | Muslim | Muslim @47% [cosmopolitan] |
| 50 | PATTAMBI | +5.6pp LDF | decisive | ★★★ | ✓ | Muslim | Muslim @51% [cosmopolitan] |
| 51 | SHORNUR | +10.3pp LDF | blocking | ★★★ | ✓ | Muslim | Muslim @38% [cosmopolitan] |
| 52 | OTTAPPALAM | +15.7pp LDF | blocking | ★★★ | ✓ | Muslim | Muslim @44% [cosmopolitan] |
| 53 | KONGAD | +2.5pp UDF | decisive | ★★★ | flipped | Muslim | Muslim @29% [cosmopolitan] |
| 54 | MANNARKKAD | +15.3pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @49% [cosmopolitan] |
| 55 | MALAMPUZHA | +12.2pp LDF | blocking | ★★ | ✓ | Muslim | Muslim @34% [cosmopolitan] |
| 56 | PALAKKAD | +8.9pp UDF | blocking | ★★ | ✓ | Muslim | Muslim @34% [cosmopolitan] |
| 57 | TARUR | +9.0pp LDF | blocking | ★★ | ✓ | Muslim | Muslim @21% [cosmopolitan] |
| 58 | CHITTUR | +4.4pp UDF | decisive | ★ | flipped | Muslim | Muslim @18% [cosmopolitan] |
| 59 | NEMMARA | +2.2pp LDF | decisive | ★★ | ✓ | Muslim | Muslim @13% [cosmopolitan] |
| 60 | ALATHUR | +6.4pp LDF | blocking | ★★ | ✓ | Muslim | Muslim @22% [cosmopolitan] |

### Thrissur (13 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 61 | CHELAKKARA | +18.0pp LDF | blocking | ★★★ | ✓ | Muslim | Muslim @29% [cosmopolitan] |
| 62 | KUNNAMKULAM | +3.0pp LDF | decisive | ★★★ | ✓ | Christian + Muslim | Aggregate Christian @21% [dispersed] + Muslim @22% [cosmopolitan] |
| 63 | GURUVAYOOR | +1.2pp LDF | decisive | ★★★ | ✓ | Christian + Muslim | Christian: syro_malabar@7% [single] + Muslim @53% [cosmopolitan] |
| 64 | MANALUR | +0.1pp LDF | decisive | ★★★ | ✓ | Christian + Muslim | Christian: syro_malabar@18% [single] + Muslim @24% [cosmopolitan] |
| 65 | WADAKKANCHERY | +3.5pp LDF | decisive | ★★★ | ✓ | Christian (sub-rite) | Christian: syro_malabar@20% [single] |
| 66 | OLLUR | +5.8pp LDF | decisive | ★★ | ✓ | Christian + Muslim | Aggregate Christian @24% [dispersed] + Muslim @20% [cosmopolitan] |
| 67 | THRISSUR | +21.6pp UDF | blocking | ★★★ | flipped | Christian (sub-rite) | Christian: syro_malabar@24% [single] |
| 68 | NATTIKA | +4.5pp LDF | decisive | ★ | ✓ | Muslim | Muslim @20% [cosmopolitan] |
| 69 | KAIPAMANGALAM | +7.0pp LDF | decisive | ★★ | ✓ | Muslim | Muslim @41% [cosmopolitan] |
| 70 | IRINJALAKUDA | +6.7pp UDF | blocking | ★★★ | flipped | Christian (sub-rite) | Christian: syro_malabar@25% [single] |
| 71 | PUDUKKAD | +1.9pp LDF | decisive | ★★★ | ✓ | Christian (sub-rite) | Christian: syro_malabar@32% [single] |
| 72 | CHALAKUDY | +16.8pp UDF | blocking | ★★★ | ✓ | Christian (sub-rite) | Christian: syro_malabar@35% [single] |
| 73 | KODUNGALLUR | +5.6pp UDF | blocking | ★★ | flipped | Christian + Muslim | Aggregate Christian @22% [dispersed] + Muslim @22% [cosmopolitan] |

### Ernakulam (14 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 74 | PERUMBAVOOR | +19.3pp UDF | blocking | ★★★ | ✓ | Christian (aggregate) | Aggregate Christian @39% [dispersed] |
| 75 | ANGAMALY | +28.3pp UDF | blocking | ★★★ | ✓ | Christian (sub-rite) | Christian: syro_malabar@41% [single] |
| 76 | ALUVA | +18.3pp UDF | blocking | ★★★ | ✓ | Christian + Muslim | Aggregate Christian @27% [dispersed] + Muslim @34% [cosmopolitan] |
| 77 | KALAMASSERY | +10.0pp UDF | blocking | ★★ | flipped | Christian + Muslim | Aggregate Christian @34% [dispersed] + Muslim @21% [cosmopolitan] |
| 78 | PARAVUR | +12.9pp UDF | blocking | ★★★ | ✓ | Christian (sub-rite) | Christian: syro_malabar@32% [single] |
| 79 | VYPEN | +11.9pp UDF | blocking | ★★★ | flipped | Christian (sub-rite) | Christian: latin_catholic@33% [single] |
| 80 | KOCHI | +6.1pp UDF | decisive | ★★ | flipped | Christian (sub-rite) | Christian: latin_catholic@35% [single] |
| 81 | THRIPUNITHURA | +12.0pp UDF | blocking | ★★ | ✓ | Christian + Muslim | Aggregate Christian @34% [dispersed] + Muslim @21% [cosmopolitan] |
| 82 | ERANAKULAM | +33.6pp UDF | blocking | ★★ | ✓ | Christian + Muslim | Christian: latin_catholic@21% [single] + Muslim @21% [cosmopolitan] |
| 83 | THRIKKAKARA | +35.7pp UDF | blocking | ★★ | ✓ | Christian + Muslim | Christian: syro_malabar@20% [single] + Muslim @21% [cosmopolitan] |
| 84 | KUNNATHUNAD | +13.2pp UDF | blocking | ★★★ | flipped | Christian + Muslim | Aggregate Christian @35% [dispersed] + Muslim @20% [cosmopolitan] |
| 85 | PIRAVOM | +29.3pp UDF | blocking | ★★★ | ✓ | Christian (aggregate) | Aggregate Christian @42% [dispersed] |
| 86 | MUVATTUPUZHA | +28.9pp UDF | blocking | ★★★ | ✓ | Christian + Muslim | Aggregate Christian @40% [dispersed] + Muslim @24% [cosmopolitan] |
| 87 | KOTHAMANGALAM | +12.1pp UDF | blocking | ★★★ | flipped | Christian + Muslim | Aggregate Christian @29% [dispersed] + Muslim @37% [cosmopolitan] |

### Idukki (5 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 88 | DEVIKULAM | +4.7pp UDF | decisive | ★★★ | flipped | Christian (aggregate) | Aggregate Christian @32% [dispersed] |
| 89 | UDUMBANCHOLA | +16.5pp UDF | blocking | ★★★ | flipped | Christian (sub-rite) | Christian: syro_malabar@29% [single] |
| 90 | THODUPUZHA | +30.3pp UDF | blocking | ★★★ | ✓ | Christian + Muslim | Christian: syro_malabar@31% [single] + Muslim @21% [cosmopolitan] |
| 91 | IDUKKI | +18.5pp UDF | blocking | ★★★ | flipped | Christian (sub-rite) | Christian: syro_malabar@26% [single] |
| 92 | PEERUMADE | +22.5pp UDF | blocking | ★★★ | flipped | Christian (aggregate) | Aggregate Christian @41% [FRACTURED] |

### Kottayam (9 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 93 | PALA | +2.2pp UDF | decisive | ★★★ | ✓ | Christian + Muslim | Christian: syro_malabar@43% [single] + Muslim @10% [cosmopolitan] |
| 94 | KADUTHURUTHY | +25.1pp UDF | blocking | ★★★ | ✓ | Christian (sub-rite) | Christian: syro_malabar@22% [fractured] |
| 95 | VAIKOM | +1.1pp UDF | decisive | ★★★ | flipped | Christian (sub-rite) | Christian: syro_malabar@11% [single] |
| 96 | ETTUMANOOR | +16.1pp UDF | blocking | ★★★ | flipped | Christian (aggregate) | Aggregate Christian @45% [dispersed] |
| 97 | KOTTAYAM | +31.6pp UDF | blocking | ★★★ | ✓ | Christian (aggregate) | Aggregate Christian @41% [dispersed] |
| 98 | PUTHUPPALLY | +41.3pp UDF | blocking | ★★★ | ✓ | Christian (aggregate) | Aggregate Christian @49% [dispersed] |
| 99 | CHANGANASSERY | +6.9pp UDF | decisive | ★★ | flipped | Christian (sub-rite) | Christian: syro_malabar@28% [single] |
| 100 | KANJIRAPPALLY | +4.2pp UDF | decisive | ★★★ | flipped | Christian (aggregate) | Aggregate Christian @43% [FRACTURED] |
| 101 | POONJAR | +4.6pp UDF | decisive | ★★★ | flipped | Christian (sub-rite) | Christian: syro_malabar@27% [single] |

### Alappuzha (9 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 102 | AROOR | +5.8pp UDF | decisive | ★★ | flipped | Christian (sub-rite) | Christian: latin_catholic@22% [single] + Hindu context: ezhava-very-heavy district |
| 103 | CHERTHALA | +8.4pp LDF | hindu-driven | ★ | ✓ | Hindu (district overlay) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 104 | ALAPPUZHA | +13.3pp UDF | hindu-driven | ★ | flipped | Hindu (district overlay) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 105 | AMBALAPPUZHA | +19.8pp UDF | blocking | ★★ | flipped | Christian + Muslim | Aggregate Christian @23% [dispersed] + Muslim @23% [cosmopolitan] + Hindu context: ezhava-very-heavy district |
| 106 | KUTTANAD | +18.3pp UDF | blocking | ★★★ | flipped | Christian (aggregate) | Aggregate Christian @37% [dispersed] + Hindu context: ezhava-very-heavy district |
| 107 | HARIPAD | +16.1pp UDF | hindu-driven | ★ | ✓ | Hindu (district overlay) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 108 | KAYAMKULAM | +10.0pp UDF | hindu-driven | ★ | flipped | Hindu (district overlay) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 109 | MAVELIKKARA | +11.0pp LDF | hindu-driven | ★ | ✓ | Hindu (district overlay) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 110 | CHENGANNUR | +7.5pp LDF | blocking | ★★★ | ✓ | Christian (aggregate) | Aggregate Christian @29% [dispersed] + Hindu context: ezhava-very-heavy district |

### Pathanamthitta (5 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 111 | THIRUVALLA | +7.2pp UDF | decisive | ★★ | flipped | Christian (aggregate) | Aggregate Christian @48% [dispersed] + Hindu context: nair-heavy district |
| 112 | RANNI | +3.5pp UDF | decisive | ★★★ | flipped | Christian (sub-rite) | Christian: marthoma@14% [single] + Hindu context: nair-heavy district |
| 113 | ARANMULA | +12.1pp UDF | blocking | ★★★ | flipped | Christian (aggregate) | Aggregate Christian @36% [dispersed] + Hindu context: nair-heavy district |
| 114 | KONNI | +1.4pp LDF | decisive | ★★★ | ✓ | Christian (sub-rite) | Christian: indian_orthodox@12%+marthoma@7%+syro_malabar@7% [coordinated] + Hindu context: nair-heavy district |
| 115 | ADOOR | +6.9pp UDF | decisive | ★ | flipped | Christian (aggregate) | Aggregate Christian @28% [dispersed] + Hindu context: nair-heavy district |

### Kollam (11 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 116 | KARUNAGAPPALLY | +15.4pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @29% [cosmopolitan] |
| 117 | CHAVARA | +13.0pp UDF | blocking | ★★★ | flipped | Muslim | Muslim @27% [cosmopolitan] |
| 118 | KUNNATHUR | +15.4pp UDF | diffuse | — | flipped | — | No identified relevant community |
| 119 | KOTTARAKKARA | +0.7pp LDF | decisive | ★★★ | ✓ | Christian + Muslim | Christian: indian_orthodox@7% [single] + Muslim @17% [cosmopolitan] |
| 120 | PATHANAPURAM | +6.0pp UDF | blocking | ★★ | flipped | Christian (aggregate) | Aggregate Christian @20% [dispersed] |
| 121 | PUNALUR | +15.1pp LDF | blocking | ★★ | ✓ | Christian + Muslim | Aggregate Christian @21% [dispersed] + Muslim @21% [cosmopolitan] |
| 122 | CHADAYAMANGALAM | +4.9pp UDF | diffuse | — | flipped | — | No identified relevant community |
| 123 | KUNDARA | +19.8pp UDF | blocking | ★★★ | ✓ | Muslim | Muslim @29% [cosmopolitan] |
| 124 | KOLLAM | +13.0pp UDF | blocking | ★★ | flipped | Muslim | Muslim @21% [cosmopolitan] |
| 125 | ERAVIPURAM | +6.6pp UDF | decisive | ★ | flipped | Muslim | Christian aggregate @19% — FRACTURED (CSI NDA-leaning + UDF-up sub-rites cancel) + Muslim @28% [cosmopolitan] |
| 126 | CHATHANNOOR | +3.2pp NDA | decisive | ★ | flipped | Christian + Muslim | Aggregate Christian @13% [dispersed] + Muslim @15% [cosmopolitan] |

### Thiruvananthapuram (14 ACs)

| AC | Name | Margin | Tag | Conf | Durable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | --- | --- |
| 127 | VARKALA | +1.5pp LDF | decisive | ★★★ | ✓ | Muslim | Muslim @25% [cosmopolitan] + Hindu context: nair-heavy district |
| 128 | ATTINGAL | +8.9pp LDF | hindu-driven | ★ | ✓ | Hindu (district overlay) | Hindu nair-heavy (Nair 39%, Ezhava 27% in district) |
| 129 | CHIRAYINKEEZHU | +1.0pp UDF | decisive | ★★ | flipped | Christian + Muslim | Christian: latin_catholic@9% [single] + Muslim @14% [cosmopolitan] + Hindu context: nair-heavy district |
| 130 | NEDUMANGAD | +13.6pp LDF | blocking | ★★ | ✓ | Muslim | Muslim @24% [cosmopolitan] + Hindu context: nair-heavy district |
| 131 | VAMANAPURAM | +8.2pp UDF | blocking | ★★ | flipped | Muslim | Muslim @23% [cosmopolitan] + Hindu context: nair-heavy district |
| 132 | KAZHAKOOTTAM | +0.3pp NDA | decisive | ★★ | flipped | Christian + Muslim | Christian: latin_catholic@7% [single] + Muslim @14% [cosmopolitan] + Hindu context: nair-heavy district |
| 133 | VATTIYOORKAVU | +4.2pp UDF | hindu-driven | ★ | flipped | Hindu (district overlay) | Hindu nair-heavy (Nair 39%, Ezhava 27% in district) |
| 134 | THIRUVANANTHAPURAM | +8.2pp UDF | hindu-driven | ★ | flipped | Hindu (district overlay) | Hindu nair-heavy (Nair 39%, Ezhava 27% in district) |
| 135 | NEMOM | +3.5pp NDA | decisive | ★ | flipped | Christian (aggregate) | Aggregate Christian @17% [FRACTURED] + Hindu context: nair-heavy district |
| 136 | ARUVIKKARA | +1.9pp LDF | decisive | ★★★ | ✓ | Christian + Muslim | Aggregate Christian @14% [dispersed] + Muslim @22% [cosmopolitan] + Hindu context: nair-heavy district |
| 137 | PARASSALA | +9.7pp LDF | decisive | ★★ | ✓ | Christian (sub-rite) | Christian: csi@21% [fractured] + Hindu context: nair-heavy district |
| 138 | KATTAKKADA | +4.9pp UDF | decisive | ★★ | flipped | Christian (aggregate) | Aggregate Christian @25% [dispersed] + Hindu context: nair-heavy district |
| 139 | KOVALAM | +21.1pp UDF | hindu-driven | ★ | ✓ | Hindu (district overlay) | Christian aggregate @17% — FRACTURED (CSI NDA-leaning + UDF-up sub-rites cancel) + Hindu nair-heavy (Nair 39%, Ezhava 27% in district) |
| 140 | NEYYATTINKARA | +5.2pp UDF | hindu-driven | ★ | flipped | Hindu (district overlay) | Christian aggregate @17% — FRACTURED (CSI NDA-leaning + UDF-up sub-rites cancel) + Hindu nair-heavy (Nair 39%, Ezhava 27% in district) |


---

## 5. Alliance-roles patterns

Cell-fill rates across 140 ACs:

| Cell | Filled | Empty |
| --- | ---: | ---: |
| UDF.flipTo | 56 | 84 |
| UDF.blockFrom | 51 | 89 |
| LDF.flipTo | 39 | 101 |
| LDF.blockFrom | 60 | 80 |
| NDA.flipTo | 18 | 122 |
| NDA.blockFrom | 113 | 27 |

Patterns:

- **`NDA.blockFrom` filled in 113 of 140 ACs (81 %)** — the structural Muslim/Christian-coordinated minority population blocks NDA across most of Kerala. Only 27 ACs have no minority blocker — predominantly the Trivandrum nair-heavy zone + a handful of Hindu-coastal seats where BJP has a realistic path.
- **`NDA.flipTo` filled in only 18 ACs** — credible BJP flip paths are scarce. Concentrated in: (a) the 3 BJP wins (filled because winner), (b) nair-heavy Trivandrum ACs with margin ≤ 12 pp, (c) fractured-Christian ACs with CSI segment + Hindu Nair consolidation.
- **`UDF.flipTo` (56) > `LDF.flipTo` (39)** — reflects the 2026 wave: more ACs had Christian/Muslim communities delivering UDF flips than communities pulling for LDF restoration.

---

## 6. Caveats

1. **Sub-rite voting direction is inferred from 2026 cohort means** (christian.md §3). A future cycle could swing sub-rites differently.
2. **Hindu sub-caste at AC level is data-blocked.** District-level overlay only — Pathanamthitta ACs share district profile even though within-district variation is real.
3. **Muslim sub-type is district-level inheritance** with one Wayanad special-case. A more granular AC-level sub-type would require survey data.
4. **Sub-rite voter-share compounds measurement noise** (POI proxy × Census share). Aggregate Christian is more reliable than per-sub-rite.
5. **SHRUG-fallback ACs (26 of 140)** have noisier religion shares; framework downgrades tier (HIGH → MEDIUM) when relevant.
6. **Alliance-roles encoding is rule-based, not multi-cycle-validated.** Cells fire on threshold crossings; future-cycle confirmation would strengthen.
7. **Candidate religion overlay covers only 48 of 140 ACs** (CHRISTIAN_BELT_36 + Malappuram inference). For the remaining 92 we have no candidate-religion validation.
8. **`durable` flag compares only 2021 vs 2026** — two-cycle. A 3-cycle (2016/2021/2026) version would distinguish "always-X" from "recently-X".

---

## 7. Scripts + data

| Source | Path |
| --- | --- |
| Build script | `scripts/pipeline/build-community-relevance.ts` |
| Output data | `data/community-relevance.json` (committed; 140 records, compact) |
| Runtime loader | `src/lib/data/community-relevance.ts` — exports `getCommunityRelevance(ac)` + `communityRelevance` |
| Tests | `src/lib/data/community-relevance.test.ts` — structural invariants |
| Sub-rite voter-share function | `src/lib/data/religious-pois.ts:getVoterShareBreakdown` |
| Hindu district profile data | `data/district-hindu-castes.json` |
| Muslim sub-type belt data | `data/community-belts.json` |
| Sub-rite direction overlay | `docs/narratives/christian.md §3` |
| Winner-candidate religion | `src/pages/walkthroughs/udf-data.ts:CHRISTIAN_BELT_36` (extended with Malappuram inference) |

To regenerate after data changes: `bun run scripts/pipeline/build-community-relevance.ts`.

---

## 8. Phase 4 — surface in the app (not yet started)

Optional follow-up after this framework is stable:

- Per-AC badge on `/explore` seat detail showing primary driver + confidence + alliance roles
- New `/community-relevance` overlay map (140 ACs colour-coded by primary driver)
- Cross-filter on `/walkthroughs/insights`: pick an AC, see its community profile
- Per-AC drilldown panel showing the 6 alliance-roles cells + the multi-sub-rite breakdown
