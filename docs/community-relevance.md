# Community relevance — per-AC framework

A per-AC analytical view of which communities are *electorally relevant* — i.e., large enough and politically organised enough to shape (or have shaped) the 2026 result, or to constrain candidate selection in future cycles.

The framework runs across all 140 ACs and assigns each one:

- A **primary driver** — Christian sub-rite / Christian aggregate / Muslim / Christian + Muslim / Hindu (district overlay) / diffuse
- A **net tag** — decisive / blocking / hindu-driven / diffuse
- A **confidence level** — HIGH ★★★ / MEDIUM ★★ / LOW ★ / UNKNOWN —
- A **one-line note** describing the relevant communities and any Hindu sub-caste context

This document records both the framework (rules) and the output (140 per-AC records).

---

## 1. The framework

### 1a. Inputs

| Layer | AC-level data? | Source |
| --- | --- | --- |
| Christian sub-rite voter-share | ✅ | `getVoterShareBreakdown()` over `ac-religious-pois.json` |
| Christian aggregate (religion-level) | ✅ | Census 2025 share in `ac-religion-2025.json` |
| Muslim aggregate (religion-level) | ✅ | Same |
| Muslim sub-rite (Sunni / Mujahid / etc.) | ⚠️ Available but not used | Sub-rite distinction didn't show predictive signal in our 2026 analysis |
| Muslim sub-type (IUML / mixed / cosmopolitan) | District inheritance | Via `community-belts.json` |
| Hindu religion-level | ❌ Hindu vote not politically organised as a religion bloc | — |
| Hindu sub-caste (Nair / Ezhava / SC / etc.) | District inheritance only | `district-hindu-castes.json` |
| AC margin | ✅ | `data/results-2026.json` |
| Christian sub-rite voting direction | Statewide cohort means | `docs/narratives/christian.md §3` |

### 1b. Tag math

For each (AC, community) pair where the community is present at ≥ 5 % voter-share:

```
required_swing_pp = AC_margin_pp / (community_share / 100)
```

| Tag | Rule | Interpretation |
| --- | --- | --- |
| **decisive** | `required_swing ≤ 25 pp` | Community can plausibly flip the 2026 outcome given known cohesion limits. |
| **blocking** | not decisive, but `share ≥ 20 %` | Too few or margin too wide to flip 2026, but large enough that parties cannot ignore them. |
| **latent** | present (≥ 5 %) but neither | Tagged for completeness, not promoted in the net AC tag. |

### 1c. Confidence tiers

A community-tag earns a tier based on presence and required swing:

| Tier | Decisive criteria | Blocking criteria |
| --- | --- | --- |
| **HIGH ★★★** | share ≥ 12 % AND required_swing ≤ 15 pp AND not SHRUG-fallback | share ≥ 25 % AND not SHRUG-fallback |
| **MEDIUM ★★** | share ≥ 8 % AND required_swing ≤ 20 pp | share ≥ 20 % |
| **LOW ★** | share ≥ 5 % AND required_swing ≤ 25 pp | (not applicable) |

The AC's net confidence is the max tier across its relevant community tags. Hindu-district-driven ACs are LOW by definition (district-level inheritance is coarser than AC-level measurement).

### 1d. Christian sub-rite coordination

For ACs with multiple tagged Christian sub-rites, classify their joint behaviour using statewide direction tags from `docs/narratives/christian.md §3`:

| Direction tag | Sub-rites in tag |
| --- | --- |
| **UDF-up** | Latin Catholic, Syro-Malabar, Syro-Malankara, Knanaya, Marthoma, Indian Orthodox, Pentecostal, Brethren, Other |
| **T20-mixed** | Jacobite Syrian (UDF-up base + Twenty 20 NDA component) |
| **NDA-leaning** | CSI |

| Coordination | Definition |
| --- | --- |
| `single` | Only one tagged sub-rite |
| `coordinated` | Multiple tagged sub-rites, all in same direction tag (UDF-up + T20-mixed grouped as same direction) |
| `fractured` | Tagged CSI + tagged UDF-up sub-rite — votes likely cancel |

### 1e. Muslim sub-type (from district belt)

| Sub-type | Districts | Political behaviour |
| --- | --- | --- |
| **iuml-stronghold** | Malappuram | Reliable UDF via IUML; outcomes mostly foregone, but Muslim vote is the AC's defining feature |
| **mixed-muslim** | Kasaragod, Kannur, Kozhikode, Wayanad | Less monolithic — vote splits between IUML/UDF and LDF-aligned Muslim parties (INL, NSC); historically more competitive |
| **cosmopolitan** | All other districts | Lower bloc-voting; Muslim share is a constituent piece of urban/coastal mixed ACs |

### 1f. Hindu sub-caste district overlay

Inherited from `district-hindu-castes.json`. Profiles:

| Profile | Threshold | Districts |
| --- | --- | --- |
| **nair-heavy** | Nair ≥ 35 % of Hindu pop | Thiruvananthapuram, Pathanamthitta |
| **ezhava-very-heavy** | Ezhava ≥ 50 % | Alappuzha, Kozhikode, Kannur (Tiyya-distinct) |
| **ezhava-heavy** | Ezhava 40-50 % | Idukki, Thrissur, Kottayam (kept but not promoted to primary driver) |
| **mixed-nair-ezhava** | Nair ≥ 25 % AND Ezhava ≥ 25 % | Kollam |
| **mixed-ezhava-leaning** | Ezhava 30-40 % | Ernakulam, Malappuram |
| **mixed-fragmented** | None of the above | Kasaragod |
| **sc-st-heavy** | Special case | Wayanad |

The Hindu overlay is **secondary information**. When Christian or Muslim is a relevant community in an AC, the Hindu profile is added to the note as context (e.g. "Muslim @ 43 % + Hindu context: ezhava-very-heavy district"). When neither Christian nor Muslim reaches relevance, the Hindu profile **becomes the primary driver** for nair-heavy / ezhava-very-heavy / sc-st-heavy districts (LOW confidence).

### 1g. Primary-driver selection

Priority order — pick the first that applies:

1. **both-christian-muslim** — both Christian and Muslim communities relevant
2. **christian-subrite** — at least one Christian sub-rite tagged
3. **christian-aggregate** — aggregate Christian tagged but no individual sub-rite (Kanjirappally pattern)
4. **muslim** — Muslim aggregate tagged
5. **hindu-district** — none of above; district has clear Hindu profile (nair-heavy / ezhava-very-heavy / sc-st-heavy)
6. **diffuse** — nothing reaches relevance

---

## 2. Headline coverage

Across all 140 ACs:

| Category | Count |
| --- | ---: |
| **Decisive** (community could plausibly flip 2026) | **58** |
| **Blocking** (community durable but margin too wide) | **69** |
| **Hindu-driven** (district overlay, Christian/Muslim absent) | **10** |
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
| Christian (aggregate) | 17 |
| Hindu (district overlay) | 10 |
| Diffuse | 3 |

**137 of 140 ACs have an identified relevant community.** The 3 diffuse cases are flagged below. The Hindu-driven 10 are a low-confidence inference from district overlay.

---

## 3. Notable findings

### 3a. Konni is the marquee multi-sub-rite case

AC 114 Konni — 1.4 pp LDF margin, three Christian sub-rites simultaneously tagged HIGH-decisive:

- Indian Orthodox @ 12 % (UDF-up)
- Marthoma @ 7 % (UDF-up)
- Syro-Malabar @ 7 % (UDF-up)
- Aggregate Christian @ 33 %
- District: Pathanamthitta (nair-heavy, Nair 38 % / Ezhava 26 % among Hindus)

All three sub-rites moved UDF (per christian.md §3 statewide cohort means: +7-9pp UDF). LDF still won by 1.4 pp — Christian flipped together but Nair-Ezhava Hindu vote held LDF.

### 3b. The "Kanjirappally pattern" is real

17 ACs have aggregate Christian tagged decisive/blocking without any individual sub-rite reaching the bar — Christian community is electorally significant but distributed across 3-4 small sub-rites. Examples:

- Kanjirappally (100): aggregate 43 %, sub-rites SM 15 % + Orthodox 6 % + Pentecostal 6 % + CSI 5 %
- Thiruvalla (111): aggregate 48 %, sub-rites Orthodox 18 % + Marthoma 9 % + Malankara 6 % + Pentecostal 6 %
- Adoor (115): aggregate 28 %, dispersed across Orthodox + Marthoma
- Devikulam (88): aggregate 32 %, dispersed

The aggregate tag correctly identifies these as community-driven ACs. The note flags them as `[dispersed]` so they're not confused with single-sub-rite cases.

### 3c. Muslim is the largest single driver (91 of 140 ACs)

65 ACs are Muslim-only relevant; 26 are Christian + Muslim. By sub-type:

| Muslim sub-type | Decisive | Blocking | Total |
| --- | ---: | ---: | ---: |
| IUML-stronghold (Malappuram) | 6 | 10 | 16 |
| Mixed-Muslim (Kasaragod, Kannur, Kozhikode, Wayanad) | 22 | 25 | 47 |
| Cosmopolitan (other districts) | 13 | 15 | 28 |

The IUML-stronghold 16 ACs are mostly foregone-result safe seats where Muslim presence defines the AC but outcomes don't swing. The Mixed-Muslim 47 are where most Muslim-decisive swing seats sit. Cosmopolitan Muslim ACs are urban/coastal Muslim minorities (Kochi, parts of Trivandrum, Thrissur).

### 3d. The Hindu sub-caste overlay captures a coherent geographic zone

10 ACs are Hindu-driven (LOW confidence). All are concentrated:

- **5 in Trivandrum** (nair-heavy district): Vattiyoorkavu, Neyyattinkara, Vamanapuram, Thiruvananthapuram, Attingal — the Nair-NSS belt with no Christian/Muslim relevance reaching threshold
- **5 in Alappuzha** (ezhava-very-heavy district): Cherthala, Alappuzha, Haripad, Kayamkulam, Mavelikkara — the SNDP-Ezhava heartland
- Other Ezhava-very-heavy districts (Kannur, Kozhikode) have Muslim or Christian communities reaching relevance, so the Hindu overlay is added as *context* rather than promoted to primary driver.

### 3e. Only 3 ACs are truly diffuse

- AC 4 Kanhangad (Kasaragod, mixed-fragmented Hindu) — margin 8.7 pp LDF
- AC 122 Chadayamangalam (Kollam, mixed-nair-ezhava Hindu) — margin 4.9 pp UDF
- AC 118 Kunnathur (Kollam, mixed-nair-ezhava Hindu) — margin 15.4 pp UDF

These are ACs where Christian and Muslim are both < 20 % AND the district Hindu profile is "mixed" — no community cleanly dominates. Most likely the political dynamics involve candidate-personality, local SNDP/NSS organisation, or Ezhava-vs-Nair sub-caste tension we can't resolve at AC level.

---

## 4. Per-AC records — all 140

Sorted by district (north → south). Confidence stars: ★★★ HIGH / ★★ MEDIUM / ★ LOW / — UNKNOWN.

### Kasaragod (5 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 1 | MANJESHWAR | +15.6pp UDF | blocking | ★★★ | Muslim | Muslim @53% [mixed-muslim] |
| 2 | KASARAGOD | +13.4pp UDF | blocking | ★★★ | Muslim | Muslim @54% [mixed-muslim] |
| 3 | UDMA | +2.7pp UDF | decisive | ★★★ | Muslim | Muslim @41% [mixed-muslim] |
| 4 | KANHANGAD | +8.7pp LDF | diffuse | — | — | No identified relevant community |
| 5 | TRIKARIPUR | +2.6pp UDF | decisive | ★★★ | Muslim | Muslim @21% [mixed-muslim] |

### Kannur (11 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 6 | PAYYANNUR | +4.8pp UDF | decisive | ★ | Muslim | Muslim @20% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 7 | KALLIASSERI | +11.5pp LDF | blocking | ★★★ | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 8 | TALIPARAMBA | +6.5pp UDF | decisive | ★★ | Muslim | Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 9 | IRIKKUR | +28.0pp UDF | blocking | ★★★ | Christian + Muslim | Christian: latin_catholic@23% [single] + Muslim @22% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 10 | AZHIKODE | +0.2pp LDF | decisive | ★★★ | Muslim | Muslim @40% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 11 | KANNUR | +13.2pp UDF | blocking | ★★★ | Muslim | Muslim @43% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 12 | DHARMADAM | +11.2pp LDF | blocking | ★★★ | Muslim | Muslim @31% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 13 | THALASSERY | +14.2pp LDF | blocking | ★★★ | Muslim | Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 14 | KUTHUPARAMBA | +0.8pp LDF | decisive | ★★★ | Christian + Muslim | Aggregate Christian @6% [dispersed] + Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 15 | MATTANNUR | +8.3pp LDF | blocking | ★★★ | Muslim | Muslim @31% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 16 | PERAVOOR | +9.8pp UDF | blocking | ★★★ | Christian + Muslim | Aggregate Christian @23% [dispersed] + Muslim @25% [mixed-muslim] + Hindu context: ezhava-very-heavy district |

### Wayanad (3 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 17 | MANANTHAVADY | +6.4pp UDF | decisive | ★★ | Christian + Muslim | Aggregate Christian @23% [dispersed] + Muslim @33% [mixed-muslim] + Hindu context: sc-st-heavy district |
| 18 | SULTHANBATHERY | +9.4pp UDF | blocking | ★★ | Christian (aggregate) | Aggregate Christian @24% [dispersed] + Hindu context: sc-st-heavy district |
| 19 | KALPETTA | +26.0pp UDF | blocking | ★★★ | Muslim | Muslim @45% [mixed-muslim] + Hindu context: sc-st-heavy district |

### Kozhikode (13 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 20 | VADAKARA | +10.4pp UDF | blocking | ★★★ | Muslim | Muslim @37% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 21 | KUTTIADI | +6.1pp UDF | decisive | ★★ | Muslim | Muslim @39% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 22 | NADAPURAM | +12.5pp UDF | blocking | ★★★ | Muslim | Muslim @44% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 23 | QUILANDY | +7.0pp UDF | decisive | ★★ | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 24 | PERAMBRA | +3.0pp UDF | decisive | ★★ | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 25 | BALUSSERI | +8.9pp UDF | decisive | ★ | Muslim | Muslim @36% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 26 | ELATHUR | +6.8pp UDF | decisive | ★★ | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 27 | KOZHIKODE NORTH | +1.0pp UDF | decisive | ★★ | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 28 | KOZHIKODE SOUTH | +8.4pp UDF | decisive | ★ | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 29 | BEYPORE | +4.0pp LDF | decisive | ★★ | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 30 | KUNNAMANGALAM | +6.4pp UDF | decisive | ★★★ | Muslim | Muslim @45% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 31 | KODUVALLY | +22.1pp UDF | blocking | ★★ | Muslim | Muslim @41% [mixed-muslim] + Hindu context: ezhava-very-heavy district |
| 32 | THIRUVAMBADI | +4.3pp UDF | decisive | ★★★ | Muslim | Muslim @54% [mixed-muslim] + Hindu context: ezhava-very-heavy district |

### Malappuram (16 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 33 | KONDOTTY | +29.2pp UDF | blocking | ★★★ | Muslim | Muslim @72% [iuml-stronghold] |
| 34 | ERNAD | +24.5pp UDF | blocking | ★★★ | Muslim | Muslim @77% [iuml-stronghold] |
| 35 | NILAMBUR | +28.9pp UDF | blocking | ★★★ | Muslim | Muslim @61% [iuml-stronghold] |
| 36 | WANDOOR | +23.6pp UDF | blocking | ★★★ | Muslim | Muslim @62% [iuml-stronghold] |
| 37 | MANJERI | +30.5pp UDF | blocking | ★★ | Muslim | Muslim @75% [iuml-stronghold] |
| 38 | PERINTHALMANNA | +17.4pp UDF | decisive | ★ | Muslim | Muslim @71% [iuml-stronghold] |
| 39 | MANKADA | +24.3pp UDF | blocking | ★★★ | Muslim | Muslim @75% [iuml-stronghold] |
| 40 | MALAPPURAM | +43.3pp UDF | blocking | ★★ | Muslim | Muslim @75% [iuml-stronghold] |
| 41 | VENGARA | +17.8pp UDF | decisive | ★ | Muslim | Muslim @85% [iuml-stronghold] |
| 42 | VALLIKUNNU | +28.3pp UDF | blocking | ★★★ | Muslim | Muslim @69% [iuml-stronghold] |
| 43 | TIRURANGADI | +36.0pp UDF | blocking | ★★★ | Muslim | Muslim @82% [iuml-stronghold] |
| 44 | TANUR | +15.7pp UDF | decisive | ★★ | Muslim | Muslim @82% [iuml-stronghold] |
| 45 | TIRUR | +12.2pp UDF | decisive | ★★ | Muslim | Muslim @78% [iuml-stronghold] |
| 46 | KOTTAKKAL | +32.8pp UDF | blocking | ★★★ | Muslim | Muslim @75% [iuml-stronghold] |
| 47 | THAVANUR | +8.9pp UDF | decisive | ★★★ | Muslim | Muslim @67% [iuml-stronghold] |
| 48 | PONNANI | +8.2pp UDF | decisive | ★★★ | Muslim | Muslim @67% [iuml-stronghold] |

### Palakkad (12 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 49 | THRITHALA | +5.2pp UDF | decisive | ★★★ | Muslim | Muslim @47% [cosmopolitan] |
| 50 | PATTAMBI | +5.6pp LDF | decisive | ★★★ | Muslim | Muslim @51% [cosmopolitan] |
| 51 | SHORNUR | +10.3pp LDF | blocking | ★★★ | Muslim | Muslim @38% [cosmopolitan] |
| 52 | OTTAPPALAM | +15.7pp LDF | blocking | ★★★ | Muslim | Muslim @44% [cosmopolitan] |
| 53 | KONGAD | +2.5pp UDF | decisive | ★★★ | Muslim | Muslim @29% [cosmopolitan] |
| 54 | MANNARKKAD | +15.3pp UDF | blocking | ★★★ | Muslim | Muslim @49% [cosmopolitan] |
| 55 | MALAMPUZHA | +12.2pp LDF | blocking | ★★ | Muslim | Muslim @34% [cosmopolitan] |
| 56 | PALAKKAD | +8.9pp UDF | blocking | ★★ | Muslim | Muslim @34% [cosmopolitan] |
| 57 | TARUR | +9.0pp LDF | blocking | ★★ | Muslim | Muslim @21% [cosmopolitan] |
| 58 | CHITTUR | +4.4pp UDF | decisive | ★ | Muslim | Muslim @18% [cosmopolitan] |
| 59 | NEMMARA | +2.2pp LDF | decisive | ★★ | Muslim | Muslim @13% [cosmopolitan] |
| 60 | ALATHUR | +6.4pp LDF | blocking | ★★ | Muslim | Muslim @22% [cosmopolitan] |

### Thrissur (13 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 61 | CHELAKKARA | +18.0pp LDF | blocking | ★★★ | Muslim | Muslim @29% [cosmopolitan] |
| 62 | KUNNAMKULAM | +3.0pp LDF | decisive | ★★★ | Christian + Muslim | Aggregate Christian @21% [dispersed] + Muslim @22% [cosmopolitan] |
| 63 | GURUVAYOOR | +1.2pp LDF | decisive | ★★★ | Christian + Muslim | Christian: syro_malabar@7% [single] + Muslim @53% [cosmopolitan] |
| 64 | MANALUR | +0.1pp LDF | decisive | ★★★ | Christian + Muslim | Christian: syro_malabar@18% [single] + Muslim @24% [cosmopolitan] |
| 65 | WADAKKANCHERY | +3.5pp LDF | decisive | ★★★ | Christian (sub-rite) | Christian: syro_malabar@20% [single] |
| 66 | OLLUR | +5.8pp LDF | decisive | ★★ | Christian + Muslim | Aggregate Christian @24% [dispersed] + Muslim @20% [cosmopolitan] |
| 67 | THRISSUR | +21.6pp UDF | blocking | ★★★ | Christian (sub-rite) | Christian: syro_malabar@24% [single] |
| 68 | NATTIKA | +4.5pp LDF | decisive | ★ | Muslim | Muslim @20% [cosmopolitan] |
| 69 | KAIPAMANGALAM | +7.0pp LDF | decisive | ★★ | Muslim | Muslim @41% [cosmopolitan] |
| 70 | IRINJALAKUDA | +6.7pp UDF | blocking | ★★★ | Christian (sub-rite) | Christian: syro_malabar@25% [single] |
| 71 | PUDUKKAD | +1.9pp LDF | decisive | ★★★ | Christian (sub-rite) | Christian: syro_malabar@32% [single] |
| 72 | CHALAKUDY | +16.8pp UDF | blocking | ★★★ | Christian (sub-rite) | Christian: syro_malabar@35% [single] |
| 73 | KODUNGALLUR | +5.6pp UDF | blocking | ★★ | Christian + Muslim | Aggregate Christian @22% [dispersed] + Muslim @22% [cosmopolitan] |

### Ernakulam (14 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 74 | PERUMBAVOOR | +19.3pp UDF | blocking | ★★★ | Christian (aggregate) | Aggregate Christian @39% [dispersed] |
| 75 | ANGAMALY | +28.3pp UDF | blocking | ★★★ | Christian (sub-rite) | Christian: syro_malabar@41% [single] |
| 76 | ALUVA | +18.3pp UDF | blocking | ★★★ | Christian + Muslim | Aggregate Christian @27% [dispersed] + Muslim @34% [cosmopolitan] |
| 77 | KALAMASSERY | +10.0pp UDF | blocking | ★★ | Christian + Muslim | Aggregate Christian @34% [dispersed] + Muslim @21% [cosmopolitan] |
| 78 | PARAVUR | +12.9pp UDF | blocking | ★★★ | Christian (sub-rite) | Christian: syro_malabar@32% [single] |
| 79 | VYPEN | +11.9pp UDF | blocking | ★★★ | Christian (sub-rite) | Christian: latin_catholic@33% [single] |
| 80 | KOCHI | +6.1pp UDF | decisive | ★★ | Christian (sub-rite) | Christian: latin_catholic@35% [single] |
| 81 | THRIPUNITHURA | +12.0pp UDF | blocking | ★★ | Christian + Muslim | Aggregate Christian @34% [dispersed] + Muslim @21% [cosmopolitan] |
| 82 | ERANAKULAM | +33.6pp UDF | blocking | ★★ | Christian + Muslim | Christian: latin_catholic@21% [single] + Muslim @21% [cosmopolitan] |
| 83 | THRIKKAKARA | +35.7pp UDF | blocking | ★★ | Christian + Muslim | Christian: syro_malabar@20% [single] + Muslim @21% [cosmopolitan] |
| 84 | KUNNATHUNAD | +13.2pp UDF | blocking | ★★★ | Christian + Muslim | Aggregate Christian @35% [dispersed] + Muslim @20% [cosmopolitan] |
| 85 | PIRAVOM | +29.3pp UDF | blocking | ★★★ | Christian (aggregate) | Aggregate Christian @42% [dispersed] |
| 86 | MUVATTUPUZHA | +28.9pp UDF | blocking | ★★★ | Christian + Muslim | Aggregate Christian @40% [dispersed] + Muslim @24% [cosmopolitan] |
| 87 | KOTHAMANGALAM | +12.1pp UDF | blocking | ★★★ | Christian + Muslim | Aggregate Christian @29% [dispersed] + Muslim @37% [cosmopolitan] |

### Idukki (5 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 88 | DEVIKULAM | +4.7pp UDF | decisive | ★★★ | Christian (aggregate) | Aggregate Christian @32% [dispersed] |
| 89 | UDUMBANCHOLA | +16.5pp UDF | blocking | ★★★ | Christian (sub-rite) | Christian: syro_malabar@29% [single] |
| 90 | THODUPUZHA | +30.3pp UDF | blocking | ★★★ | Christian + Muslim | Christian: syro_malabar@31% [single] + Muslim @21% [cosmopolitan] |
| 91 | IDUKKI | +18.5pp UDF | blocking | ★★★ | Christian (sub-rite) | Christian: syro_malabar@26% [single] |
| 92 | PEERUMADE | +22.5pp UDF | blocking | ★★★ | Christian (aggregate) | Aggregate Christian @41% [dispersed] |

### Kottayam (9 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 93 | PALA | +2.2pp UDF | decisive | ★★★ | Christian + Muslim | Christian: syro_malabar@43% [single] + Muslim @10% [cosmopolitan] |
| 94 | KADUTHURUTHY | +25.1pp UDF | blocking | ★★★ | Christian (sub-rite) | Christian: syro_malabar@22% [single] |
| 95 | VAIKOM | +1.1pp UDF | decisive | ★★★ | Christian (sub-rite) | Christian: syro_malabar@11% [single] |
| 96 | ETTUMANOOR | +16.1pp UDF | blocking | ★★★ | Christian (aggregate) | Aggregate Christian @45% [dispersed] |
| 97 | KOTTAYAM | +31.6pp UDF | blocking | ★★★ | Christian (aggregate) | Aggregate Christian @41% [dispersed] |
| 98 | PUTHUPPALLY | +41.3pp UDF | blocking | ★★★ | Christian (aggregate) | Aggregate Christian @49% [dispersed] |
| 99 | CHANGANASSERY | +6.9pp UDF | decisive | ★★ | Christian (sub-rite) | Christian: syro_malabar@28% [single] |
| 100 | KANJIRAPPALLY | +4.2pp UDF | decisive | ★★★ | Christian (aggregate) | Aggregate Christian @43% [dispersed] |
| 101 | POONJAR | +4.6pp UDF | decisive | ★★★ | Christian (sub-rite) | Christian: syro_malabar@27% [single] |

### Alappuzha (9 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 102 | AROOR | +5.8pp UDF | decisive | ★★ | Christian (sub-rite) | Christian: latin_catholic@22% [single] + Hindu context: ezhava-very-heavy district |
| 103 | CHERTHALA | +8.4pp LDF | hindu-driven | ★ | Hindu (district overlay) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 104 | ALAPPUZHA | +13.3pp UDF | hindu-driven | ★ | Hindu (district overlay) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 105 | AMBALAPPUZHA | +19.8pp UDF | blocking | ★★ | Christian + Muslim | Aggregate Christian @23% [dispersed] + Muslim @23% [cosmopolitan] + Hindu context: ezhava-very-heavy district |
| 106 | KUTTANAD | +18.3pp UDF | blocking | ★★★ | Christian (aggregate) | Aggregate Christian @37% [dispersed] + Hindu context: ezhava-very-heavy district |
| 107 | HARIPAD | +16.1pp UDF | hindu-driven | ★ | Hindu (district overlay) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 108 | KAYAMKULAM | +10.0pp UDF | hindu-driven | ★ | Hindu (district overlay) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 109 | MAVELIKKARA | +11.0pp LDF | hindu-driven | ★ | Hindu (district overlay) | Hindu ezhava-very-heavy (Nair 20%, Ezhava 55% in district) |
| 110 | CHENGANNUR | +7.5pp LDF | blocking | ★★★ | Christian (aggregate) | Aggregate Christian @29% [dispersed] + Hindu context: ezhava-very-heavy district |

### Pathanamthitta (5 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 111 | THIRUVALLA | +7.2pp UDF | decisive | ★★ | Christian (aggregate) | Aggregate Christian @48% [dispersed] + Hindu context: nair-heavy district |
| 112 | RANNI | +3.5pp UDF | decisive | ★★★ | Christian (sub-rite) | Christian: marthoma@14% [single] + Hindu context: nair-heavy district |
| 113 | ARANMULA | +12.1pp UDF | blocking | ★★★ | Christian (aggregate) | Aggregate Christian @36% [dispersed] + Hindu context: nair-heavy district |
| 114 | KONNI | +1.4pp LDF | decisive | ★★★ | Christian (sub-rite) | Christian: indian_orthodox@12%+marthoma@7%+syro_malabar@7% [coordinated] + Hindu context: nair-heavy district |
| 115 | ADOOR | +6.9pp UDF | decisive | ★ | Christian (aggregate) | Aggregate Christian @28% [dispersed] + Hindu context: nair-heavy district |

### Kollam (11 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 116 | KARUNAGAPPALLY | +15.4pp UDF | blocking | ★★★ | Muslim | Muslim @29% [cosmopolitan] |
| 117 | CHAVARA | +13.0pp UDF | blocking | ★★★ | Muslim | Muslim @27% [cosmopolitan] |
| 118 | KUNNATHUR | +15.4pp UDF | diffuse | — | — | No identified relevant community |
| 119 | KOTTARAKKARA | +0.7pp LDF | decisive | ★★★ | Christian + Muslim | Christian: indian_orthodox@7% [single] + Muslim @17% [cosmopolitan] |
| 120 | PATHANAPURAM | +6.0pp UDF | blocking | ★★ | Christian (aggregate) | Aggregate Christian @20% [dispersed] |
| 121 | PUNALUR | +15.1pp LDF | blocking | ★★ | Christian + Muslim | Aggregate Christian @21% [dispersed] + Muslim @21% [cosmopolitan] |
| 122 | CHADAYAMANGALAM | +4.9pp UDF | diffuse | — | — | No identified relevant community |
| 123 | KUNDARA | +19.8pp UDF | blocking | ★★★ | Muslim | Muslim @29% [cosmopolitan] |
| 124 | KOLLAM | +13.0pp UDF | blocking | ★★ | Muslim | Muslim @21% [cosmopolitan] |
| 125 | ERAVIPURAM | +6.6pp UDF | decisive | ★ | Muslim | Muslim @28% [cosmopolitan] |
| 126 | CHATHANNOOR | +3.2pp NDA | decisive | ★ | Christian + Muslim | Aggregate Christian @13% [dispersed] + Muslim @15% [cosmopolitan] |

### Thiruvananthapuram (14 ACs)

| AC | Name | Margin | Tag | Conf | Driver | Note |
| ---: | --- | ---: | --- | :---: | --- | --- |
| 127 | VARKALA | +1.5pp LDF | decisive | ★★★ | Muslim | Muslim @25% [cosmopolitan] + Hindu context: nair-heavy district |
| 128 | ATTINGAL | +8.9pp LDF | hindu-driven | ★ | Hindu (district overlay) | Hindu nair-heavy (Nair 39%, Ezhava 27% in district) |
| 129 | CHIRAYINKEEZHU | +1.0pp UDF | decisive | ★★ | Christian + Muslim | Christian: latin_catholic@9% [single] + Muslim @14% [cosmopolitan] + Hindu context: nair-heavy district |
| 130 | NEDUMANGAD | +13.6pp LDF | blocking | ★★ | Muslim | Muslim @24% [cosmopolitan] + Hindu context: nair-heavy district |
| 131 | VAMANAPURAM | +8.2pp UDF | blocking | ★★ | Muslim | Muslim @23% [cosmopolitan] + Hindu context: nair-heavy district |
| 132 | KAZHAKOOTTAM | +0.3pp NDA | decisive | ★★ | Christian + Muslim | Christian: latin_catholic@7% [single] + Muslim @14% [cosmopolitan] + Hindu context: nair-heavy district |
| 133 | VATTIYOORKAVU | +4.2pp UDF | hindu-driven | ★ | Hindu (district overlay) | Hindu nair-heavy (Nair 39%, Ezhava 27% in district) |
| 134 | THIRUVANANTHAPURAM | +8.2pp UDF | hindu-driven | ★ | Hindu (district overlay) | Hindu nair-heavy (Nair 39%, Ezhava 27% in district) |
| 135 | NEMOM | +3.5pp NDA | decisive | ★ | Christian (aggregate) | Aggregate Christian @17% [dispersed] + Hindu context: nair-heavy district |
| 136 | ARUVIKKARA | +1.9pp LDF | decisive | ★★★ | Christian + Muslim | Aggregate Christian @14% [dispersed] + Muslim @22% [cosmopolitan] + Hindu context: nair-heavy district |
| 137 | PARASSALA | +9.7pp LDF | decisive | ★★ | Christian (sub-rite) | Christian: csi@21% [single] + Hindu context: nair-heavy district |
| 138 | KATTAKKADA | +4.9pp UDF | decisive | ★★ | Christian (aggregate) | Aggregate Christian @25% [dispersed] + Hindu context: nair-heavy district |
| 139 | KOVALAM | +21.1pp UDF | hindu-driven | ★ | Hindu (district overlay) | Hindu nair-heavy (Nair 39%, Ezhava 27% in district) |
| 140 | NEYYATTINKARA | +5.2pp UDF | hindu-driven | ★ | Hindu (district overlay) | Hindu nair-heavy (Nair 39%, Ezhava 27% in district) |


---

## 5. Caveats — what the framework still can't see

1. **Sub-rite-level voter behavior is inferred, not measured.** christian.md sub-rite cohort means are computed from AC-aggregate data assuming each cohort AC's Christian population behaves like the cohort's mean. We don't have individual-level or sub-rite-level voting data.

2. **The coordination tag is a 2026 inference.** Sub-rite "direction" comes from 2026 cohort means. A future cycle could swing different sub-rites in different directions and we wouldn't know without re-running the cohort analysis.

3. **Hindu sub-caste at AC level is data-blocked.** The district overlay treats all Pathanamthitta ACs as having identical Nair/Ezhava mix, even though within-district variation is certainly real. The overlay is descriptive ("this AC sits in a Nair-heavy district"), not measurement.

4. **The Muslim sub-type is also district-level inheritance.** Wayanad's "mixed-muslim" tag applies uniformly to all 3 ACs even though Wayanad is heterogeneous.

5. **Sub-rite voter-share has compounded measurement noise.** voter_share = (sub-rite POI share among classified Christian POIs) × (Christian share of AC population from Census). Each multiplicand has its own error. Aggregate Christian (Census-direct) is more reliable than per-sub-rite.

6. **SHRUG-fallback ACs (26 of 140)** use district-urban religion shares as a substitute for AC-level Census aggregation. The framework downgrades these from HIGH to MEDIUM tier when relevant, but the noise is still there.

7. **Latent (small-share) communities aren't surfaced.** A 6 % CSI presence in a Nemom-like AC is tagged latent because it's small and in a safe NDA seat. Latent tags exist in the JSON record but aren't promoted to the AC-level note.

8. **The framework doesn't model candidate effects.** Whether an AC fields a Christian / Hindu / Muslim candidate is independent of the community-relevance tag. The framework says "this community is large enough to matter"; whether the party acted on it is a separate observation.

---

## 6. Discussion points (open questions for Phase 3 decision)

Before persisting the framework as committed data + runtime module, a few thresholds and design choices to settle:

1. **Is the 25 pp plausible-swing threshold the right ceiling?** Set at the high end of observed 2026 cohort means; tightening to 20 pp would give a stricter "decisive" set (~35 ACs). Looser to 30 pp would catch more but with lower confidence.

2. **Should `ezhava-heavy` (40–50 %) districts get the Hindu primary-driver treatment** when no Christian/Muslim signal, or stay as context only? Current framework keeps Kottayam / Idukki / Thrissur as context. If promoted, the diffuse count would drop to 0 and a few more LOW-confidence Hindu-driven tags would appear.

3. **Should the framework include a "2026-specific" vs "durable" distinction?** Right now `decisive` mixes "could plausibly have flipped 2026" with "could flip a similar AC in any close cycle". Useful to separate?

4. **Should the coordination flag count `fractured` more aggressively?** It currently requires both CSI AND a UDF-up sub-rite to be *tagged* (not just present). Loosening to "CSI present at ≥ 5 % alongside a tagged UDF-up sub-rite" would catch Parassala and Nemom as fractured.

5. **What's the right Muslim sub-type for Wayanad specifically?** Wayanad's "mixed-muslim" tag uniformly applies, but the Muslim community in Wayanad is more Sunni-organised than Mujahid/Salafi — different from the Kasaragod / Kozhikode mix. A "wayanad" sub-type might be more accurate.

6. **Should we add candidate-community as a validation overlay?** When parties fielded a Christian candidate in an AC tagged Hindu-driven, the framework is missing something. Surname-based inference could surface ~20-30 mis-matches per cycle.

---

## 7. Scripts + data

| Source | Path |
| --- | --- |
| Framework computation | Transient (one-off `bun run` from chat); pending Phase 3 to commit as `scripts/pipeline/build-community-relevance.ts` |
| Per-AC structured records | `/tmp/community-relevance-records.json` (transient; pending Phase 3 to persist as `data/community-relevance.json`) |
| Sub-rite voter-share function | `src/lib/data/religious-pois.ts:getVoterShareBreakdown` |
| Hindu district profile data | `data/district-hindu-castes.json` |
| Muslim sub-type belt data | `data/community-belts.json` |
| Christian sub-rite direction overlay | `docs/narratives/christian.md §3` |
| AC margin | `data/results-2026.json` (computed at runtime via `winnerOf` + total votes) |

---

## 8. Next steps (after this pause)

Once the open questions in §6 are settled:

**Phase 3 — Persist as data + runtime module** (~1.5 hours)

- Commit framework as `scripts/pipeline/build-community-relevance.ts`
- Output `data/community-relevance.json` with per-AC schema
- `src/lib/data/community-relevance.ts` runtime loader
- Tests asserting tag consistency

**Phase 4 — Surface in the app** (~2-4 hours)

- Per-AC badge on `/explore` seat detail (community + tag + confidence)
- Optional `/community-relevance` overlay map (140 ACs colour-coded by driver)
- Per-cohort filter on `/walkthroughs/insights` insights page
