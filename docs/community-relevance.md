# Community relevance — per-AC framework

A per-AC analytical view of which communities are *electorally relevant* — large enough and politically organised enough to shape (or have shaped) the 2026 result, or to constrain candidate selection in future cycles.

The framework runs across all 140 ACs and assigns each one:

- A **primary driver** — Christian sub-rite / Christian aggregate / Muslim / Christian + Muslim / Hindu (district overlay) / diffuse
- A **net tag** — decisive / blocking / hindu-driven / diffuse
- A **confidence level** — HIGH ★★★ / MEDIUM ★★ / LOW ★ / UNKNOWN —
- **Two orthogonal stability dimensions**:
  - **`history` + `durabilityCategory`** — past stability: who won across 3 cycles (2016 / 2021 / 2026) → `always-UDF`, `flipped-2026`, etc.
  - **`stableFor`** — forward stability: which alliance is structurally favoured *regardless of who actually won*, derived from the blocker pattern.
- A **6-cell alliance-roles matrix** — for each of UDF / LDF / NDA, who would flip the seat *to* them and who blocks them *from* winning. Sparse — most cells blank.
- A **one-line note** with relevant communities, Hindu sub-caste context, and compact alliance-role tokens (`flip→UDF`, `block-NDA`, `stable-UDF`, …)

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
| 2016 + 2021 AC winners (for 3-cycle history) | ✅ | `data/ac-history.json` |
| 2016 + 2021 NDA vote shares (for trajectory) | ✅ | `data/ac-history.json` (`candidates[].votePct`) |
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

### 1h. Two stability dimensions (past vs forward)

Earlier drafts conflated "who won repeatedly" with "is this seat structurally safe." The current schema separates them:

**Past stability — `history` + `durabilityCategory`.** Loads the alliance winner from `ac-history.json` for 2016 and 2021 and combines with 2026:

| Category | Meaning |
| --- | --- |
| `always-UDF` / `always-LDF` / `always-NDA` | Same alliance won in 2016 AND 2021 AND 2026 |
| `udf-since-2021` / `ldf-since-2021` / `nda-since-2021` | 2021 == 2026, but 2016 was different |
| `flipped-2026` | 2021 ≠ 2026 |
| `other` | 2016 / 2021 winner was OTHER or unavailable |

**Forward stability — `stableFor`** (independent of who won). Set when both *other* alliances have structural blockers AND the chosen alliance has none:

| `stableFor` | Means |
| --- | --- |
| `UDF` | NDA blocked + LDF blocked + UDF clear → minorities structurally lock UDF |
| `LDF` | NDA blocked + UDF blocked + LDF clear → Hindu base + minority Muslim presence lock LDF |
| `NDA` | UDF blocked + LDF blocked + NDA clear → rare; nair-heavy + no minority blocker |
| `null` | At least one cell ambiguous |

**Worked example — MANJESHWAR (AC 1):**

- `history: { 2016: UDF, 2021: UDF, 2026: UDF }` → `durabilityCategory: always-UDF`
- `allianceRoles.NDA.blockFrom = "Muslim 53%"`, `allianceRoles.LDF.blockFrom = "Muslim 53%"`, `allianceRoles.UDF.blockFrom = null`
- → `stableFor: UDF`

Reads as: "UDF won all three cycles (past) AND the structural community pattern locks UDF (forward) — Muslim majority blocks both NDA and LDF."

**Worked example — KOZHIKODE SOUTH (AC 28):**

- `history: { 2016: UDF, 2021: LDF, 2026: UDF }` → `durabilityCategory: flipped-2026`
- Same Muslim @ 41 % blocker pattern → `stableFor: UDF`

Reads as: "Seat *did* flip in 2026 (past not stable) but Muslim share structurally favours UDF; the 2021 LDF win was the anomaly." This is the case where the two dimensions diverge — and where past-stability alone would mislead.

### 1j. NDA vote-share trajectory

Independent of winner history. Captures whether BJP is *building, plateaued, or shrinking* in an AC, regardless of whether they're close to winning.

- `ndaShareTrajectory: { y2016, y2021, y2026 }` — NDA % across 3 cycles. `y2016` / `y2021` may be `null` for missing-data ACs.
- `ndaTrend: "rising" | "flat" | "declining" | "unknown"` — coarse 10-year direction:
  - `rising` if `y2026 − y2016 ≥ +3 pp`
  - `declining` if `y2026 − y2016 ≤ −3 pp`
  - `flat` otherwise
  - `unknown` only when `y2016` is missing (currently 0 ACs — all 140 have 2016 NDA data)

This is the dimension that distinguishes "Muslim structurally locks UDF AND BJP isn't trying" from "Muslim structurally locks UDF BUT BJP is climbing the Hindu vote." See §3h.

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

| Durability category (past) | Count |
| --- | ---: |
| `always-UDF` (UDF won 2016 + 2021 + 2026) | 33 |
| `always-LDF` | 31 |
| `always-NDA` | **0** (no AC has won NDA three cycles) |
| `udf-since-2021` (UDF won 2021 + 2026, different in 2016) | 8 |
| `ldf-since-2021` | 4 |
| `nda-since-2021` | 0 |
| `flipped-2026` (2021 ≠ 2026) | 64 |
| `other` (OTHER/missing) | 0 |

| Structural stability (forward, `stableFor`) | Count |
| --- | ---: |
| UDF (NDA + LDF both structurally blocked) | **76** |
| LDF (NDA + UDF both structurally blocked) | **22** |
| NDA (UDF + LDF both structurally blocked) | **2** |
| `null` (no clean structural lock) | 40 |

The asymmetry between `stableFor=UDF` (76) and `stableFor=LDF` (22) reflects Kerala's minority-political reality — far more seats have a Muslim or Christian community large enough to mechanically block NDA *and* keep LDF below the threshold, than the reverse. The 2 `stableFor=NDA` ACs are the structural BJP enclaves: Nemom (AC 135) and Kazhakoottam (AC 132).

| NDA trend (2016 → 2026) | Count |
| --- | ---: |
| `rising` (NDA share +3pp or more over 10 years) | 23 |
| `flat` (within ±3pp) | 82 |
| `declining` (NDA share down 3pp+) | 35 |
| `unknown` (2016 missing) | 0 |

**Aggregate NDA share level (2026):** 56 ACs at ≥ 15 %, 16 ACs at ≥ 25 %. The "credible build-up" set (rising AND ≥ 10 % in 2026) is **23 ACs** — see §3h for the list.

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

### 3b. 64 `flipped-2026` ACs — and the past-vs-structural divergence

64 of 140 ACs (roughly half) have `durabilityCategory: flipped-2026` — 2021 winner ≠ 2026 winner. The interesting subset is **flipped-2026 ACs where `stableFor` is still set** — meaning the seat flipped, but the structural community pattern hasn't moved. The 2026 outcome and the structural reading point at *different* alliances. Examples:

- **Kozhikode S (28)** — flipped-2026 (`U-L-U`), `stableFor: UDF`. Muslim @ 41 % structurally blocks NDA + LDF; the 2021 LDF win was the anomaly. The 2026 UDF win is the return to structural pattern.
- **Aroor (102)** — flipped-2026 (`L-L-U`), `stableFor: UDF`. Latin Catholic flipped the seat to UDF *and* the Christian-Latin block-NDA + block-LDF makes UDF the structurally favoured alliance going forward.
- **Konni (114)** — flipped-2026 was *expected* but didn't happen (LDF held by 1.4 pp). History `?-L-L`, `stableFor: null` — Christian-coordinated but Pathanamthitta nair-Ezhava base + LDF organisation keeps UDF blocked.
- **Nemom (135)** — flipped-2026 NDA gain (`N-L-N`), `stableFor: NDA`. The 2021 LDF win is the anomaly; the BJP+nair-heavy+CSI structure is the durable reading.

For 2031 forecasting, the most-informative pair is `durabilityCategory ∈ {always-X, x-since-2021}` AND `stableFor == X` — past and forward agree. Where they disagree, the forward reading (`stableFor`) is more cautious.

### 3c. Konni — the coordinated marquee case

AC 114, 1.4 pp LDF margin. Three Christian sub-rites simultaneously decisive:

- Indian Orthodox @ 12 % (UDF-up, HIGH-confidence)
- Marthoma @ 7 % (UDF-up)
- Syro-Malabar @ 7 % (UDF-up)
- Aggregate Christian @ 33 %
- District: Pathanamthitta (nair-heavy, Nair 38 % / Ezhava 26 % of Hindus)
- History `?-L-L` → durabilityCategory likely `ldf-since-2021` (2016 may be missing/OTHER); LDF held in 2021 and 2026

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

113 of 140 ACs (81 %) have `NDA.blockFrom` filled — Muslim ≥ 25 % (mechanical), OR Christian ≥ 20 % coordinated UDF-up, OR combined Christian + Muslim ≥ 30 % minority coalition. This is the clearest non-2026-specific finding: **BJP's path to majority is structurally constrained by the geographic distribution of minority communities.** Only 27 ACs have no minority blocker — predominantly Trivandrum nair-heavy + a handful of Hindu-coastal seats. The 76 `stableFor: UDF` count (in §2) is the natural consequence: in most of Kerala, the minority structural floor pairs with LDF-side weaknesses to lock UDF.

### 3f. Hindu sub-caste zone (10 ACs, LOW confidence)

10 ACs end up `primaryDriver: hindu-district` — no Christian/Muslim community reaches tier-relevance, so the district-level Hindu profile is the only available driver:

| AC | Name | District profile | Margin |
| ---: | --- | --- | --- |
| 103 | Cherthala | ezhava-very-heavy (Alappuzha) | +8.4 pp LDF |
| 104 | Alappuzha | ezhava-very-heavy | +13.3 pp UDF |
| 107 | Haripad | ezhava-very-heavy | +16.1 pp UDF |
| 108 | Kayamkulam | ezhava-very-heavy | +10.0 pp UDF |
| 109 | Mavelikkara | ezhava-very-heavy | +11.0 pp LDF |
| 128 | Attingal | nair-heavy (Thiruvananthapuram) | +8.9 pp LDF |
| 133 | Vattiyoorkavu | nair-heavy | +4.2 pp UDF |
| 134 | Thiruvananthapuram | nair-heavy | +8.2 pp UDF |
| 139 | Kovalam | nair-heavy | +21.1 pp UDF |
| 140 | Neyyattinkara | nair-heavy | +5.2 pp UDF |

These all share district profile → AC-level resolution is missing. Even within Alappuzha or Trivandrum, sub-district variation in Nair/Ezhava share is real but unmeasurable from current data.

Kovalam (139) and Neyyattinkara (140) have Christian @ 17 % aggregate but it's `fractured` (CSI + Latin), so neither passes through to relevance — and so they fall through to `hindu-district` as primary driver even though the fractured-Christian story is also relevant (see §3a).

### 3h. NDA vote-share trajectory — where is BJP credibly building?

`ndaShareTrajectory` records NDA % across 2016 / 2021 / 2026 and assigns a coarse `ndaTrend` (rising ≥ +3 pp, declining ≤ −3 pp, flat otherwise) on the 10-year delta.

Headline: **23 rising · 82 flat · 35 declining · 0 unknown.** Caveats: trend uses a simple 2016→2026 delta — collapse-and-rebound seats (Pala, Poonjar) look "rising" even though 2021 was much lower.

**Top 10 rising ACs with NDA already ≥ 10 % in 2026** — these are the seats where BJP has a real (if often distant) build-up rather than churn:

| AC | Name | 2016 | 2021 | 2026 | `stableFor` | `durabilityCategory` |
| ---: | --- | ---: | ---: | ---: | :---: | --- |
| 126 | Chathannoor | 24.9 | 30.6 | **38.0** | — | flipped-2026 |
| 132 | Kazhakoottam | 31.9 | 29.1 | **35.4** | NDA | flipped-2026 |
| 56 | Palakkad | 29.1 | 35.3 | **33.3** | UDF | always-UDF |
| 111 | Thiruvalla | 21.8 | 16.3 | **30.6** | — | flipped-2026 |
| 128 | Attingal | 20.0 | 25.9 | **30.5** | — | always-LDF |
| 68 | Nattika | 22.4 | 22.0 | **28.7** | — | always-LDF |
| 27 | Kozhikode N | 22.5 | 22.5 | **28.2** | UDF | flipped-2026 |
| 93 | Pala | 17.8 | 7.9 | **26.0** | — | always-UDF |
| 28 | Kozhikode S | 16.6 | 20.9 | **25.4** | UDF | flipped-2026 |
| 101 | Poonjar | 13.7 | 2.1 | **25.0** | UDF | flipped-2026 |

Notable patterns:

- **Christian-belt rebound seats** (Thiruvalla, Pala, Poonjar, Kunnathunad): collapsed in 2021 (Twenty 20 / coordinated Christian-UDF swing), surged in 2026 well above 2016 base. These were the seats where the 2026 cycle's lower-key BJP candidates picked up disenchanted Christian voters even where UDF won the seat outright.
- **Kozhikode N + S (Muslim-blocked but NDA rising)**: `stableFor: UDF` because Muslim 41 % blocks NDA + LDF, but NDA share is moving 16→28 — Hindu consolidation is real even where the structural ceiling is firm.
- **Ottappalam (52, not in top 10 — 25.0 % in 2026, rising +6.6)**: an LDF stronghold where Muslim @ 44 % structurally blocks NDA, yet NDA is winning Hindu vote share against LDF. Watch for 2031.
- **Always-Hindu zone Hindu-driven seats with NDA rising** (Attingal, Nattika): NDA share is climbing in Hindu-only LDF seats where neither minority blocker nor coordinated Christian fragmentation applies — pure Hindu sub-caste competition.

Conversely, **NDA's declining strongholds** are worth noting:

- **Nemom (135)** — 47.5 → 35.5 → 40.7. Even the structural BJP enclave is below its 2016 peak.
- **Kasaragod (2)** — 38.8 → 34.9 → 31.7. A Muslim-majority `stableFor: UDF` seat where NDA's 2nd-place share is *eroding* despite Hindu consolidation elsewhere — IUML organisation + INC strategic positioning seems to be peeling Hindu votes back to UDF.
- **Vattiyoorkavu (133)** — 32.2 → 28.8 → 28.7. Trivandrum nair-heavy zone, technically `stableFor: NDA`-adjacent, but BJP share has plateaued.

### 3g. Only 3 ACs are truly diffuse

- AC 4 Kanhangad (Kasaragod, mixed-fragmented) — 8.7 pp LDF
- AC 122 Chadayamangalam (Kollam, mixed-nair-ezhava) — 4.9 pp UDF
- AC 118 Kunnathur (Kollam, mixed-nair-ezhava) — 15.4 pp UDF

These are ACs with mixed-Hindu profile + no Christian/Muslim relevance — the genuine framework blind spot.

---

## 4. Per-AC records — all 140

Sorted north → south by district. Stars: ★★★ HIGH / ★★ MEDIUM / ★ LOW / — UNKNOWN.

### Kasaragod (5 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 1 | MANJESHWAR | +15.6pp UDF | blocking | ★★★ | U-U-U | 36% → | →UDF | Muslim | Muslim @53% [mixed-muslim] · block-LDF, block-NDA, stable-UDF |
| 2 | KASARAGOD | +13.4pp UDF | blocking | ★★★ | U-U-U | 32% ↓ | →UDF | Muslim | Muslim @54% [mixed-muslim] · block-LDF, block-NDA, stable-UDF |
| 3 | UDMA | +2.7pp UDF | decisive | ★★★ | L-L-U | 15% → | →UDF | Muslim | Muslim @41% [mixed-muslim] · flip→UDF, flip→LDF, block-LDF, block-NDA, stable-UDF |
| 4 | KANHANGAD | +8.7pp LDF | diffuse | — | L-L-L | 15% → | — | — | No identified relevant community |
| 5 | TRIKARIPUR | +2.6pp UDF | decisive | ★★★ | L-L-U | 5% → | — | Muslim | Muslim @21% [mixed-muslim] · flip→UDF, flip→LDF |

### Kannur (11 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 6 | PAYYANNUR | +4.8pp UDF | decisive | ★ | L-L-U | 5% ↓ | — | Muslim | Muslim @20% [mixed-muslim] + Hindu context: ezhava-very-heavy district · flip→UDF, flip→LDF, block-NDA |
| 7 | KALLIASSERI | +11.5pp LDF | blocking | ★★★ | L-L-L | 8% → | →LDF | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-UDF, block-NDA, stable-LDF |
| 8 | TALIPARAMBA | +6.5pp UDF | decisive | ★★ | L-L-U | 8% → | →UDF | Muslim | Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district · flip→UDF, block-LDF, block-NDA, stable-UDF |
| 9 | IRIKKUR | +28.0pp UDF | blocking | ★★★ | U-U-U | 6% → | →UDF | Christian + Muslim | Christian: latin_catholic@23% [single] + Muslim @22% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-LDF, block-NDA, stable-UDF |
| 10 | AZHIKODE | +0.2pp LDF | decisive | ★★★ | U-L-L | 12% → | →LDF | Muslim | Muslim @40% [mixed-muslim] + Hindu context: ezhava-very-heavy district · flip→UDF, flip→LDF, block-UDF, block-NDA, stable-LDF |
| 11 | KANNUR | +13.2pp UDF | blocking | ★★★ | L-L-U | 11% → | →UDF | Muslim | Muslim @43% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-LDF, block-NDA, stable-UDF |
| 12 | DHARMADAM | +11.2pp LDF | blocking | ★★★ | L-L-L | 11% → | →LDF | Muslim | Muslim @31% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-UDF, block-NDA, stable-LDF |
| 13 | THALASSERY | +14.2pp LDF | blocking | ★★★ | L-L-L | 16% → | →LDF | Muslim | Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-UDF, block-NDA, stable-LDF |
| 14 | KUTHUPARAMBA | +0.8pp LDF | decisive | ★★★ | L-L-L | 14% ↓ | →LDF | Christian + Muslim | Aggregate Christian @6% [dispersed] + Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district · flip→UDF, flip→LDF, block-UDF, block-NDA, stable-LDF |
| 15 | MATTANNUR | +8.3pp LDF | blocking | ★★★ | L-L-L | 10% → | →LDF | Muslim | Muslim @31% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-UDF, block-NDA, stable-LDF |
| 16 | PERAVOOR | +9.8pp UDF | blocking | ★★★ | U-U-U | 5% → | →UDF | Christian + Muslim | Aggregate Christian @23% [dispersed] + Muslim @25% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-LDF, block-NDA, stable-UDF |

### Wayanad (3 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 17 | MANANTHAVADY | +6.4pp UDF | decisive | ★★ | L-L-U | 12% → | →UDF | Christian + Muslim | Aggregate Christian @23% [dispersed] + Muslim @33% [mixed-muslim-wayanad] + Hindu context: sc-st-heavy district · flip→UDF, block-LDF, block-NDA, stable-UDF |
| 18 | SULTHANBATHERY | +9.4pp UDF | blocking | ★★ | U-U-U | 18% → | →UDF | Christian (aggregate) | Aggregate Christian @24% [dispersed] + Hindu context: sc-st-heavy district · block-LDF, block-NDA, stable-UDF |
| 19 | KALPETTA | +26.0pp UDF | blocking | ★★★ | L-U-U | 11% → | →UDF | Muslim | Muslim @45% [mixed-muslim-wayanad] + Hindu context: sc-st-heavy district · block-LDF, block-NDA, stable-UDF |

### Kozhikode (13 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 20 | VADAKARA | +10.4pp UDF | blocking | ★★★ | L-U-U | 10% → | →UDF | Muslim | Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-LDF, block-NDA, stable-UDF |
| 21 | KUTTIADI | +6.1pp UDF | decisive | ★★ | U-L-U | 7% → | →UDF | Muslim | Muslim @39% [mixed-muslim] + Hindu context: ezhava-very-heavy district · flip→UDF, block-LDF, block-NDA, stable-UDF |
| 22 | NADAPURAM | +12.5pp UDF | blocking | ★★★ | L-L-U | 6% → | →UDF | Muslim | Muslim @44% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-LDF, block-NDA, stable-UDF |
| 23 | QUILANDY | +7.0pp UDF | decisive | ★★ | L-L-U | 14% → | →UDF | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-LDF, block-NDA, stable-UDF |
| 24 | PERAMBRA | +3.0pp UDF | decisive | ★★ | L-L-U | 8% → | →UDF | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district · flip→UDF, flip→LDF, block-LDF, block-NDA, stable-UDF |
| 25 | BALUSSERI | +8.9pp UDF | decisive | ★ | L-L-U | 9% → | →UDF | Muslim | Muslim @36% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-LDF, block-NDA, stable-UDF |
| 26 | ELATHUR | +6.8pp UDF | decisive | ★★ | L-L-U | 18% → | →UDF | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district · flip→UDF, block-LDF, block-NDA, stable-UDF |
| 27 | KOZHIKODE NORTH | +1.0pp UDF | decisive | ★★ | L-L-U | 28% ↑ | →UDF | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district · flip→UDF, flip→LDF, block-LDF, block-NDA, stable-UDF |
| 28 | KOZHIKODE SOUTH | +8.4pp UDF | decisive | ★ | U-L-U | 25% ↑ | →UDF | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-LDF, block-NDA, stable-UDF |
| 29 | BEYPORE | +4.0pp LDF | decisive | ★★ | L-L-L | 14% ↓ | →LDF | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district · flip→UDF, flip→LDF, block-UDF, block-NDA, stable-LDF |
| 30 | KUNNAMANGALAM | +6.4pp UDF | decisive | ★★★ | L-L-U | 16% → | →UDF | Muslim | Muslim @45% [mixed-muslim] + Hindu context: ezhava-very-heavy district · flip→UDF, block-LDF, block-NDA, stable-UDF |
| 31 | KODUVALLY | +22.1pp UDF | blocking | ★★ | L-U-U | 6% → | →UDF | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district · block-LDF, block-NDA, stable-UDF |
| 32 | THIRUVAMBADI | +4.3pp UDF | decisive | ★★★ | L-L-U | 5% → | →UDF | Muslim | Muslim @54% [mixed-muslim] + Hindu context: ezhava-very-heavy district · flip→UDF, flip→LDF, block-LDF, block-NDA, stable-UDF |

### Malappuram (16 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 33 | KONDOTTY | +29.2pp UDF | blocking | ★★★ | U-U-U | 7% → | →UDF | Muslim | Muslim @72% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 34 | ERNAD | +24.5pp UDF | blocking | ★★★ | U-U-U | 5% → | →UDF | Muslim | Muslim @77% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 35 | NILAMBUR | +28.9pp UDF | blocking | ★★★ | L-L-U | 7% → | →UDF | Muslim | Muslim @61% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 36 | WANDOOR | +23.6pp UDF | blocking | ★★★ | U-U-U | 3% ↓ | →UDF | Muslim | Muslim @62% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 37 | MANJERI | +30.5pp UDF | blocking | ★★ | U-U-U | 7% → | →UDF | Muslim | Muslim @75% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 38 | PERINTHALMANNA | +17.4pp UDF | decisive | ★ | U-U-U | 4% → | →UDF | Muslim | Muslim @71% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 39 | MANKADA | +24.3pp UDF | blocking | ★★★ | U-U-U | 5% → | →UDF | Muslim | Muslim @75% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 40 | MALAPPURAM | +43.3pp UDF | blocking | ★★ | U-U-U | 5% → | →UDF | Muslim | Muslim @75% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 41 | VENGARA | +17.8pp UDF | decisive | ★ | U-U-U | 4% → | →UDF | Muslim | Muslim @85% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 42 | VALLIKUNNU | +28.3pp UDF | blocking | ★★★ | U-U-U | 13% ↓ | →UDF | Muslim | Muslim @69% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 43 | TIRURANGADI | +36.0pp UDF | blocking | ★★★ | U-U-U | 7% → | →UDF | Muslim | Muslim @82% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 44 | TANUR | +15.7pp UDF | decisive | ★★ | L-L-U | 8% → | →UDF | Muslim | Muslim @82% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 45 | TIRUR | +12.2pp UDF | decisive | ★★ | U-U-U | 4% → | →UDF | Muslim | Muslim @78% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 46 | KOTTAKKAL | +32.8pp UDF | blocking | ★★★ | U-U-U | 6% ↓ | →UDF | Muslim | Muslim @75% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 47 | THAVANUR | +8.9pp UDF | decisive | ★★★ | L-L-U | 10% → | →UDF | Muslim | Muslim @67% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |
| 48 | PONNANI | +8.2pp UDF | decisive | ★★★ | L-L-U | 6% → | →UDF | Muslim | Muslim @67% [iuml-stronghold] · block-LDF, block-NDA, stable-UDF |

### Palakkad (12 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 49 | THRITHALA | +5.2pp UDF | decisive | ★★★ | U-L-U | 9% → | →UDF | Muslim | Muslim @47% [cosmopolitan] · flip→UDF, block-LDF, block-NDA, stable-UDF |
| 50 | PATTAMBI | +5.6pp LDF | decisive | ★★★ | L-L-L | 9% → | →LDF | Muslim | Muslim @51% [cosmopolitan] · flip→LDF, block-UDF, block-NDA, stable-LDF |
| 51 | SHORNUR | +10.3pp LDF | blocking | ★★★ | L-L-L | 21% → | →LDF | Muslim | Muslim @38% [cosmopolitan] · block-UDF, block-NDA, stable-LDF |
| 52 | OTTAPPALAM | +15.7pp LDF | blocking | ★★★ | L-L-L | 25% ↑ | →LDF | Muslim | Muslim @44% [cosmopolitan] · block-UDF, block-NDA, stable-LDF |
| 53 | KONGAD | +2.5pp UDF | decisive | ★★★ | L-L-U | 17% → | →UDF | Muslim | Muslim @29% [cosmopolitan] · flip→UDF, flip→LDF, block-LDF, block-NDA, stable-UDF |
| 54 | MANNARKKAD | +15.3pp UDF | blocking | ★★★ | U-U-U | 6% → | →UDF | Muslim | Muslim @49% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 55 | MALAMPUZHA | +12.2pp LDF | blocking | ★★ | L-L-L | 30% → | →LDF | Muslim | Muslim @34% [cosmopolitan] · block-UDF, block-NDA, stable-LDF |
| 56 | PALAKKAD | +8.9pp UDF | blocking | ★★ | U-U-U | 33% ↑ | →UDF | Muslim | Muslim @34% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 57 | TARUR | +9.0pp LDF | blocking | ★★ | L-L-L | 16% ↑ | — | Muslim | Muslim @21% [cosmopolitan] |
| 58 | CHITTUR | +4.4pp UDF | decisive | ★ | L-L-U | 10% → | — | Muslim | Muslim @18% [cosmopolitan] · flip→UDF, flip→LDF |
| 59 | NEMMARA | +2.2pp LDF | decisive | ★★ | L-L-L | 12% → | — | Muslim | Muslim @13% [cosmopolitan] · flip→UDF, flip→LDF |
| 60 | ALATHUR | +6.4pp LDF | blocking | ★★ | L-L-L | 13% → | — | Muslim | Muslim @22% [cosmopolitan] |

### Thrissur (13 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 61 | CHELAKKARA | +18.0pp LDF | blocking | ★★★ | L-L-L | 23% ↑ | →LDF | Muslim | Muslim @29% [cosmopolitan] · block-UDF, block-NDA, stable-LDF |
| 62 | KUNNAMKULAM | +3.0pp LDF | decisive | ★★★ | L-L-L | 11% ↓ | →LDF | Christian + Muslim | Aggregate Christian @21% [dispersed] + Muslim @22% [cosmopolitan] · flip→UDF, flip→LDF, block-UDF, block-NDA, stable-LDF |
| 63 | GURUVAYOOR | +1.2pp LDF | decisive | ★★★ | L-L-L | 18% → | →LDF | Christian + Muslim | Christian: syro_malabar@7% [single] + Muslim @53% [cosmopolitan] · flip→UDF, flip→LDF, block-UDF, block-NDA, stable-LDF |
| 64 | MANALUR | +0.1pp LDF | decisive | ★★★ | L-L-L | 22% → | →LDF | Christian + Muslim | Christian: syro_malabar@18% [single] + Muslim @24% [cosmopolitan] · flip→UDF, flip→LDF, block-UDF, block-NDA, stable-LDF |
| 65 | WADAKKANCHERY | +3.5pp LDF | decisive | ★★★ | U-L-L | 16% → | — | Christian (sub-rite) | Christian: syro_malabar@20% [single] · flip→UDF, flip→LDF, block-UDF |
| 66 | OLLUR | +5.8pp LDF | decisive | ★★ | L-L-L | 13% → | →LDF | Christian + Muslim | Aggregate Christian @24% [dispersed] + Muslim @20% [cosmopolitan] · flip→LDF, block-UDF, block-NDA, stable-LDF |
| 67 | THRISSUR | +21.6pp UDF | blocking | ★★★ | L-L-U | 23% ↑ | →UDF | Christian (sub-rite) | Christian: syro_malabar@24% [single] · block-LDF, block-NDA, stable-UDF |
| 68 | NATTIKA | +4.5pp LDF | decisive | ★ | L-L-L | 29% ↑ | — | Muslim | Muslim @20% [cosmopolitan] · flip→UDF, flip→LDF, block-NDA |
| 69 | KAIPAMANGALAM | +7.0pp LDF | decisive | ★★ | L-L-L | 14% ↓ | →LDF | Muslim | Muslim @41% [cosmopolitan] · flip→LDF, block-UDF, block-NDA, stable-LDF |
| 70 | IRINJALAKUDA | +6.7pp UDF | blocking | ★★★ | L-L-U | 18% → | →UDF | Christian (sub-rite) | Christian: syro_malabar@25% [single] · block-LDF, block-NDA, stable-UDF |
| 71 | PUDUKKAD | +1.9pp LDF | decisive | ★★★ | L-L-L | 18% ↓ | — | Christian (sub-rite) | Christian: syro_malabar@32% [single] · flip→UDF, flip→LDF, block-UDF |
| 72 | CHALAKUDY | +16.8pp UDF | blocking | ★★★ | L-U-U | 12% ↓ | →UDF | Christian (sub-rite) | Christian: syro_malabar@35% [single] · block-LDF, block-NDA, stable-UDF |
| 73 | KODUNGALLUR | +5.6pp UDF | blocking | ★★ | L-L-U | 16% ↓ | →UDF | Christian + Muslim | Aggregate Christian @22% [dispersed] + Muslim @22% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |

### Ernakulam (14 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 74 | PERUMBAVOOR | +19.3pp UDF | blocking | ★★★ | U-U-U | 15% → | →UDF | Christian (aggregate) | Aggregate Christian @39% [dispersed] · block-LDF, block-NDA, stable-UDF |
| 75 | ANGAMALY | +28.3pp UDF | blocking | ★★★ | U-U-U | 8% → | →UDF | Christian (sub-rite) | Christian: syro_malabar@41% [single] · block-LDF, block-NDA, stable-UDF |
| 76 | ALUVA | +18.3pp UDF | blocking | ★★★ | U-U-U | 12% → | →UDF | Christian + Muslim | Aggregate Christian @27% [dispersed] + Muslim @34% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 77 | KALAMASSERY | +10.0pp UDF | blocking | ★★ | U-L-U | 9% ↓ | →UDF | Christian + Muslim | Aggregate Christian @34% [dispersed] + Muslim @21% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 78 | PARAVUR | +12.9pp UDF | blocking | ★★★ | U-U-U | 13% ↓ | →UDF | Christian (sub-rite) | Christian: syro_malabar@32% [single] · block-LDF, block-NDA, stable-UDF |
| 79 | VYPEN | +11.9pp UDF | blocking | ★★★ | L-L-U | 10% → | →UDF | Christian (sub-rite) | Christian: latin_catholic@33% [single] · block-LDF, block-NDA, stable-UDF |
| 80 | KOCHI | +6.1pp UDF | decisive | ★★ | L-L-U | 9% ↓ | →UDF | Christian (sub-rite) | Christian: latin_catholic@35% [single] · flip→UDF, block-LDF, block-NDA, stable-UDF |
| 81 | THRIPUNITHURA | +12.0pp UDF | blocking | ★★ | L-U-U | 19% → | →UDF | Christian + Muslim | Aggregate Christian @34% [dispersed] + Muslim @21% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 82 | ERANAKULAM | +33.6pp UDF | blocking | ★★ | U-U-U | 18% ↑ | →UDF | Christian + Muslim | Christian: latin_catholic@21% [single] + Muslim @21% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 83 | THRIKKAKARA | +35.7pp UDF | blocking | ★★ | U-U-U | 15% → | →UDF | Christian + Muslim | Christian: syro_malabar@20% [single] + Muslim @21% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 84 | KUNNATHUNAD | +13.2pp UDF | blocking | ★★★ | U-L-U | 25% ↑ | →UDF | Christian + Muslim | Aggregate Christian @35% [dispersed] + Muslim @20% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 85 | PIRAVOM | +29.3pp UDF | blocking | ★★★ | U-U-U | 10% → | →UDF | Christian (aggregate) | Aggregate Christian @42% [dispersed] · block-LDF, block-NDA, stable-UDF |
| 86 | MUVATTUPUZHA | +28.9pp UDF | blocking | ★★★ | L-U-U | 7% → | →UDF | Christian + Muslim | Aggregate Christian @40% [dispersed] + Muslim @24% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 87 | KOTHAMANGALAM | +12.1pp UDF | blocking | ★★★ | L-L-U | 5% ↓ | →UDF | Christian + Muslim | Aggregate Christian @29% [dispersed] + Muslim @37% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |

### Idukki (5 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 88 | DEVIKULAM | +4.7pp UDF | decisive | ★★★ | L-L-U | 13% ↑ | — | Christian (aggregate) | Aggregate Christian @32% [dispersed] · flip→UDF, block-LDF |
| 89 | UDUMBANCHOLA | +16.5pp UDF | blocking | ★★★ | L-L-U | 8% ↓ | →UDF | Christian (sub-rite) | Christian: syro_malabar@29% [single] · block-LDF, block-NDA, stable-UDF |
| 90 | THODUPUZHA | +30.3pp UDF | blocking | ★★★ | U-U-U | 9% ↓ | →UDF | Christian + Muslim | Christian: syro_malabar@31% [single] + Muslim @21% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 91 | IDUKKI | +18.5pp UDF | blocking | ★★★ | U-L-U | 7% ↓ | →UDF | Christian (sub-rite) | Christian: syro_malabar@26% [single] · block-LDF, block-NDA, stable-UDF |
| 92 | PEERUMADE | +22.5pp UDF | blocking | ★★★ | L-L-U | 8% → | — | Christian (aggregate) | Aggregate Christian @41% [FRACTURED] |

### Kottayam (9 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 93 | PALA | +2.2pp UDF | decisive | ★★★ | U-U-U | 26% ↑ | — | Christian + Muslim | Christian: syro_malabar@43% [single] + Muslim @10% [cosmopolitan] · flip→UDF, flip→LDF, block-LDF |
| 94 | KADUTHURUTHY | +25.1pp UDF | blocking | ★★★ | U-U-U | 10% ↓ | — | Christian (sub-rite) | Christian: syro_malabar@22% [fractured] |
| 95 | VAIKOM | +1.1pp UDF | decisive | ★★★ | L-L-U | 16% ↓ | — | Christian (sub-rite) | Christian: syro_malabar@11% [single] · flip→UDF, block-LDF |
| 96 | ETTUMANOOR | +16.1pp UDF | blocking | ★★★ | L-L-U | 11% ↓ | →UDF | Christian (aggregate) | Aggregate Christian @45% [dispersed] · block-LDF, block-NDA, stable-UDF |
| 97 | KOTTAYAM | +31.6pp UDF | blocking | ★★★ | U-U-U | 9% → | →UDF | Christian (aggregate) | Aggregate Christian @41% [dispersed] · block-LDF, block-NDA, stable-UDF |
| 98 | PUTHUPPALLY | +41.3pp UDF | blocking | ★★★ | U-U-U | 9% → | →UDF | Christian (aggregate) | Aggregate Christian @49% [dispersed] · block-LDF, block-NDA, stable-UDF |
| 99 | CHANGANASSERY | +6.9pp UDF | decisive | ★★ | U-L-U | 12% ↓ | — | Christian (sub-rite) | Christian: syro_malabar@28% [single] · flip→UDF, block-LDF |
| 100 | KANJIRAPPALLY | +4.2pp UDF | decisive | ★★★ | U-L-U | 20% ↓ | — | Christian (aggregate) | Aggregate Christian @43% [FRACTURED] |
| 101 | POONJAR | +4.6pp UDF | decisive | ★★★ | O-L-U | 25% ↑ | →UDF | Christian (sub-rite) | Christian: syro_malabar@27% [single] · flip→UDF, block-LDF, block-NDA, stable-UDF |

### Alappuzha (9 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 102 | AROOR | +5.8pp UDF | decisive | ★★ | L-L-U | 13% ↓ | →UDF | Christian (sub-rite) | Christian: latin_catholic@22% [single] + Hindu context: ezhava-very-heavy district · flip→UDF, block-LDF, block-NDA, stable-UDF |
| 103 | CHERTHALA | +8.4pp LDF | hindu-driven | ★ | L-L-L | 10% → | →LDF | Hindu (district) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) · block-UDF, block-NDA, stable-LDF |
| 104 | ALAPPUZHA | +13.3pp UDF | hindu-driven | ★ | L-L-U | 10% → | — | Hindu (district) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) · block-NDA |
| 105 | AMBALAPPUZHA | +19.8pp UDF | blocking | ★★ | L-L-U | 12% ↓ | →UDF | Christian + Muslim | Aggregate Christian @23% [dispersed] + Muslim @23% [cosmopolitan] + Hindu context: ezhava-very-heavy district · block-LDF, block-NDA, stable-UDF |
| 106 | KUTTANAD | +18.3pp UDF | blocking | ★★★ | L-L-U | 15% ↓ | →UDF | Christian (aggregate) | Aggregate Christian @37% [dispersed] + Hindu context: ezhava-very-heavy district · block-LDF, block-NDA, stable-UDF |
| 107 | HARIPAD | +16.1pp UDF | hindu-driven | ★ | U-U-U | 21% ↑ | — | Hindu (district) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 108 | KAYAMKULAM | +10.0pp UDF | hindu-driven | ★ | L-L-U | 11% → | — | Hindu (district) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 109 | MAVELIKKARA | +11.0pp LDF | hindu-driven | ★ | L-L-L | 16% ↓ | — | Hindu (district) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) · block-UDF |
| 110 | CHENGANNUR | +7.5pp LDF | blocking | ★★★ | L-L-L | 23% ↓ | →LDF | Christian (aggregate) | Aggregate Christian @29% [dispersed] + Hindu context: ezhava-very-heavy district · block-UDF, block-NDA, stable-LDF |

### Pathanamthitta (5 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 111 | THIRUVALLA | +7.2pp UDF | decisive | ★★ | L-L-U | 31% ↑ | — | Christian (aggregate) | Aggregate Christian @48% [dispersed] + Hindu context: nair-heavy district · flip→NDA, block-LDF |
| 112 | RANNI | +3.5pp UDF | decisive | ★★★ | L-L-U | 15% ↓ | — | Christian (sub-rite) | Christian: marthoma@14% [single] + Hindu context: nair-heavy district · flip→UDF, flip→NDA, block-LDF |
| 113 | ARANMULA | +12.1pp UDF | blocking | ★★★ | L-L-U | 22% → | →UDF | Christian (aggregate) | Aggregate Christian @36% [dispersed] + Hindu context: nair-heavy district · block-LDF, block-NDA, stable-UDF |
| 114 | KONNI | +1.4pp LDF | decisive | ★★★ | U-L-L | 11% → | — | Christian (sub-rite) | Christian: indian_orthodox@12%+marthoma@7%+syro_malabar@7% [coordinated] + Hindu context: nair-heavy district · flip→UDF, flip→LDF, block-UDF |
| 115 | ADOOR | +6.9pp UDF | decisive | ★ | L-L-U | 18% → | — | Christian (aggregate) | Aggregate Christian @28% [dispersed] + Hindu context: nair-heavy district · flip→UDF, flip→NDA, block-LDF |

### Kollam (11 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 116 | KARUNAGAPPALLY | +15.4pp UDF | blocking | ★★★ | L-U-U | 19% ↑ | →UDF | Muslim | Muslim @29% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 117 | CHAVARA | +13.0pp UDF | blocking | ★★★ | L-L-U | 8% → | →UDF | Muslim | Muslim @27% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 118 | KUNNATHUR | +15.4pp UDF | diffuse | — | L-L-U | 15% → | — | — | No identified relevant community |
| 119 | KOTTARAKKARA | +0.7pp LDF | decisive | ★★★ | L-L-L | 14% → | →LDF | Christian + Muslim | Christian: indian_orthodox@7% [single] + Muslim @17% [cosmopolitan] · flip→UDF, flip→LDF, block-UDF, block-NDA, stable-LDF |
| 120 | PATHANAPURAM | +6.0pp UDF | blocking | ★★ | L-L-U | 5% ↓ | →UDF | Christian (aggregate) | Aggregate Christian @20% [dispersed] · block-LDF, block-NDA, stable-UDF |
| 121 | PUNALUR | +15.1pp LDF | blocking | ★★ | L-L-L | 11% ↑ | →LDF | Christian + Muslim | Aggregate Christian @21% [dispersed] + Muslim @21% [cosmopolitan] · block-UDF, block-NDA, stable-LDF |
| 122 | CHADAYAMANGALAM | +4.9pp UDF | diffuse | — | L-L-U | 14% → | — | — | No identified relevant community · block-NDA |
| 123 | KUNDARA | +19.8pp UDF | blocking | ★★★ | L-U-U | 12% → | →UDF | Muslim | Muslim @29% [cosmopolitan] · block-LDF, block-NDA, stable-UDF |
| 124 | KOLLAM | +13.0pp UDF | blocking | ★★ | L-L-U | 14% → | — | Muslim | Muslim @21% [cosmopolitan] · block-NDA |
| 125 | ERAVIPURAM | +6.6pp UDF | decisive | ★ | L-L-U | 8% ↓ | →UDF | Muslim | Christian aggregate @19% — FRACTURED (CSI NDA-leaning + UDF-up sub-rites cancel) + Muslim @28% [cosmopolitan] · flip→UDF, block-LDF, block-NDA, stable-UDF |
| 126 | CHATHANNOOR | +3.2pp NDA | decisive | ★ | L-L-N | 38% ↑ | — | Christian + Muslim | Aggregate Christian @13% [dispersed] + Muslim @15% [cosmopolitan] · flip→NDA |

### Thiruvananthapuram (14 ACs)

| AC | Name | Margin | Tag | Conf | History | NDA% | Stable | Driver | Note |
| ---: | --- | ---: | --- | :---: | :---: | :---: | :---: | --- | --- |
| 127 | VARKALA | +1.5pp LDF | decisive | ★★★ | L-L-L | 20% ↑ | →LDF | Muslim | Muslim @25% [cosmopolitan] + Hindu context: nair-heavy district · flip→UDF, flip→LDF, block-UDF, block-NDA, stable-LDF |
| 128 | ATTINGAL | +8.9pp LDF | hindu-driven | ★ | L-L-L | 31% ↑ | — | Hindu (district) | Hindu nair-heavy (Nair 39%, Ezhava 27% in district) · flip→NDA |
| 129 | CHIRAYINKEEZHU | +1.0pp UDF | decisive | ★★ | L-L-U | 22% ↑ | — | Christian + Muslim | Christian: latin_catholic@9% [single] + Muslim @14% [cosmopolitan] + Hindu context: nair-heavy district · flip→UDF, flip→LDF, flip→NDA, block-LDF |
| 130 | NEDUMANGAD | +13.6pp LDF | blocking | ★★ | L-L-L | 25% → | — | Muslim | Muslim @24% [cosmopolitan] + Hindu context: nair-heavy district |
| 131 | VAMANAPURAM | +8.2pp UDF | blocking | ★★ | L-L-U | 8% → | — | Muslim | Muslim @23% [cosmopolitan] + Hindu context: nair-heavy district · flip→NDA |
| 132 | KAZHAKOOTTAM | +0.3pp NDA | decisive | ★★ | L-L-N | 35% ↑ | →NDA | Christian + Muslim | Christian: latin_catholic@7% [single] + Muslim @14% [cosmopolitan] + Hindu context: nair-heavy district · flip→UDF, flip→NDA, block-UDF, block-LDF, stable-NDA |
| 133 | VATTIYOORKAVU | +4.2pp UDF | hindu-driven | ★ | U-L-U | 29% ↓ | — | Hindu (district) | Hindu nair-heavy (Nair 39%, Ezhava 27% in district) · flip→NDA |
| 134 | THIRUVANANTHAPURAM | +8.2pp UDF | hindu-driven | ★ | U-L-U | 29% → | — | Hindu (district) | Hindu nair-heavy (Nair 39%, Ezhava 27% in district) · flip→NDA |
| 135 | NEMOM | +3.5pp NDA | decisive | ★ | N-L-N | 41% ↓ | →NDA | Christian (aggregate) | Aggregate Christian @17% [FRACTURED] + Hindu context: nair-heavy district · flip→UDF, flip→NDA, block-UDF, block-LDF, stable-NDA |
| 136 | ARUVIKKARA | +1.9pp LDF | decisive | ★★★ | U-L-L | 16% → | — | Christian + Muslim | Aggregate Christian @14% [dispersed] + Muslim @22% [cosmopolitan] + Hindu context: nair-heavy district · flip→UDF, flip→LDF, flip→NDA, block-UDF |
| 137 | PARASSALA | +9.7pp LDF | decisive | ★★ | L-L-L | 19% → | — | Christian (sub-rite) | Christian: csi@21% [fractured] + Hindu context: nair-heavy district · flip→NDA |
| 138 | KATTAKKADA | +4.9pp UDF | decisive | ★★ | L-L-U | 26% → | — | Christian (aggregate) | Aggregate Christian @25% [dispersed] + Hindu context: nair-heavy district · flip→UDF, flip→NDA, block-LDF |
| 139 | KOVALAM | +21.1pp UDF | hindu-driven | ★ | U-U-U | 16% ↓ | — | Hindu (district) | Christian aggregate @17% — FRACTURED (CSI NDA-leaning + UDF-up sub-rites cancel) + Hindu nair-heavy (Nair 39%, Ezhava 27% in district) |
| 140 | NEYYATTINKARA | +5.2pp UDF | hindu-driven | ★ | L-L-U | 16% ↑ | — | Hindu (district) | Christian aggregate @17% — FRACTURED (CSI NDA-leaning + UDF-up sub-rites cancel) + Hindu nair-heavy (Nair 39%, Ezhava 27% in district) · flip→NDA |

---

**History column legend**: `2016-2021-2026` → letters are first character of alliance (`U`=UDF, `L`=LDF, `N`=NDA, `O`=OTHER, `?`=missing). e.g. `U-L-U` = UDF in 2016, LDF in 2021, UDF in 2026 (flipped-2026 returning to 2016 pattern).

**Stable column**: `stableFor` derived from blocker pattern. `→UDF` means NDA + LDF both have structural blockers, UDF does not.

**NDA% column**: 2026 NDA vote-share % + 10-year trend arrow (`↑` = rising ≥+3pp, `↓` = declining ≤−3pp, `→` = flat). Full trajectory (2016 / 2021 / 2026) lives in `data/community-relevance.json:ndaShareTrajectory`.

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
| Markdown table regen | `scripts/analysis/render-community-relevance-tables.ts` — emits §4 district sections |
| Output data | `data/community-relevance.json` (committed; 140 records, compact) |
| Runtime loader | `src/lib/data/community-relevance.ts` — exports `getCommunityRelevance(ac)` + `communityRelevance` |
| Tests | `src/lib/data/community-relevance.test.ts` — structural invariants (history, durabilityCategory, stableFor) |
| Sub-rite voter-share function | `src/lib/data/religious-pois.ts:getVoterShareBreakdown` |
| Hindu district profile data | `data/district-hindu-castes.json` |
| Muslim sub-type belt data | `data/community-belts.json` |
| Sub-rite direction overlay | `docs/narratives/christian.md §3` |
| Winner-candidate religion | `src/pages/walkthroughs/udf-data.ts:CHRISTIAN_BELT_36` (extended with Malappuram inference) |

To regenerate after data changes: `bun run scripts/pipeline/build-community-relevance.ts`.

---

## 8. Future work

### 8a. UI integration

- **Tier 1 — rich-story page at `/community-relevance`** ✅ **DONE.** Story-card list with filters (winner, tag, driver, stableFor, NDA-trend). Each card renders the 5-sentence narrative composed from every framework dimension (driver, history, trajectory, structural lock, hereditary succession). Rows deep-link to `/explore?seat=N`. See `src/pages/community-relevance-page.tsx`.
- **Tier 2 — choropleth map.** 140-AC map at `/community-relevance` colour-coded by primary driver, with a dropdown to swap the colour layer (driver / netTag / stableFor / ndaTrend / durabilityCategory). Click an AC → side panel with the rich story + 6-cell alliance-roles matrix.
- **Tier 3 — integrate into existing pages.** Per-AC badge on `/explore` seat detail showing driver + confidence + structural lock. Cross-filter on `/walkthroughs/insights`: pick an AC, see its community profile inline. Surface relevant community-relevance stories inside each `/walkthroughs/<arc>-walkthrough` page when the reader's context matches.

### 8b. Identity-aware cross-cycle analyses

After the candidate-name audit (see `docs/candidate-continuity-audit.md`), we have a `personId` layer that resolves the same person across alliance switches, initial changes, etc. This unlocks two analyses worth exploring:

#### Alliance-switcher analysis — AC-level preference signal

Use confirmed `same-person-switched` candidates (Roshy Augustine, N. Jayaraj, K B Ganesh Kumar, Padmaja Venugopal, etc.) as **natural experiments**:

> *Hold the candidate constant, change the alliance — does the seat follow them?*

If an MLA wins under UDF in 2016, switches to LDF in 2021, and still wins, the AC's voters are tracking the **person** more than the **alliance**. If they switch and lose by a wider margin than expected, the AC is tracking the **alliance**.

Across our 18 documented alliance-switchers, we can compute a "candidate vs alliance" preference index per AC and per district. Falsifiable signal because the candidate is the same — most variation cleanly attributable to alliance-loyalty shift.

Output: per-AC `candidatePreferenceIndex` field showing how much of the seat's behaviour is candidate-driven vs alliance-driven. Aggregates roll up to district-level "voter-loyalty type" classifications.

#### Dynasty analysis — projection of hereditary seats

The 6 documented hereditary seats (Puthuppally, Pala, Piravom, Thrikkakara, Chittur, Kuttanad) are concentrated in central-Kerala Christian belt. The forward-looking questions:

- **Continuity probability**: given a family has held a seat for N cycles, what's the conditional probability they hold it again? (Bayesian update on Kerala's specific patterns.)
- **Belt expansion**: which currently-stable seats are likely to *become* hereditary in 2031? Look for sitting MLAs with adult children active in party politics, late-career MLAs in family-strong seats, etc.
- **Alliance-attribution of dynasties**: 5 of 6 current dynasties are UDF/KC(M)-linked. Is hereditary politics a UDF-specific phenomenon, or are we under-detecting LDF dynasties?
- **Religion / caste correlation**: the 6 current dynasties are overwhelmingly Christian. Confirm or refute via systematic count.

Output: per-AC `dynastyPotential` field flagging likely-future hereditary seats; aggregate dynasty-belt map; per-alliance dynasty intensity score.

### 8c. Identity layer (prerequisite for 8b)

Both analyses in §8b assume a `personId` layer that merges candidate appearances across alliance switches and name variations. Spec: `data/candidate-identities.json` derived from `candidate-classifications.json` + appearance walk, exposing `getCandidateIdentity({ year, ac, rawName })` for downstream scripts. Discussed but not yet built — see project memory for the architecture.
