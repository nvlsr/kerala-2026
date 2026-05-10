# OSM Place-of-Worship Inventory (Phase 1 raw)

Raw Overpass-API dumps of religious POIs across Kerala. Files are gitignored
(re-fetchable via `scripts/fetch-osm-pow.ts`). This README captures the
snapshot date, exact queries, and coverage stats so the pull is reproducible.

## Snapshot

- **Fetched**: 2026-05-10
- **Endpoint**: `https://overpass-api.de/api/interpreter`
- **Area filter (full)**: `area["ISO3166-2"="IN-KL"]` (Kerala state)
- **Area filter (sample)**: `area["name"="Kottayam"]["admin_level"="5"]`

## Files

| File | Raw elements | Size | Purpose |
|---|---|---|---|
| `places-of-worship-kerala.json` | 25,647 | 7.2 MB | Full state pull |
| `places-of-worship-kottayam-sample.json` | 2,449 | 712 KB | District sample for iteration |

## Fetch query (full)

```overpassql
[out:json][timeout:600];
area["ISO3166-2"="IN-KL"]->.k;
(
  nwr["amenity"="place_of_worship"](area.k);
  nwr["building"="church"](area.k);
  nwr["building"="mosque"](area.k);
  nwr["building"="temple"](area.k);
  nwr["building"="chapel"](area.k);
  nwr["building"="cathedral"](area.k);
  nwr["building"="shrine"](area.k);
  nwr["building"="monastery"](area.k);
  nwr["building"="religious"](area.k);
  nwr["historic"="wayside_shrine"](area.k);
);
out center tags;
```

Three filter layers union to maximise coverage:

1. **`amenity=place_of_worship`** — the standard tag (~90% of all POIs)
2. **`building∈{church,mosque,temple,…}`** — building polygons missing the
   amenity tag (mappers who traced a building footprint but forgot to add an
   amenity node)
3. **`historic=wayside_shrine`** — small wayside Kurisupally / shrines

Result is a flat element list with some spatial duplication; the
`inspect-osm-pow.ts` script does a 30m BFS-cluster dedup pass on read.

## Re-fetching

```bash
bun run scripts/fetch-osm-pow.ts --sample   # Kottayam district
bun run scripts/fetch-osm-pow.ts --full     # entire Kerala state
```

## Coverage snapshot (Kerala-wide, after 30m dedup)

- **22,226 deduped sites** (13.3% dedup rate from 25,647 raw)
- **Source breakdown**: amenity 20,625 (93%) · building 1,382 (6%) · shrine 219 (1%)

### Religion distribution

| Religion | Sites | % of deduped |
|---|---|---|
| Hindu | 9,843 | 44.3% |
| Christian | 6,045 | 27.2% |
| Muslim | 3,851 | 17.3% |
| (none / unmapped) | 2,430 | 10.9% |
| Other (Sikh, Buddhist, Jewish, Jain) | 33 | 0.1% |
| Noise (parsing artefacts) | ~24 | — |

Christian POIs are **over-represented vs population share** (27% POI vs 18%
population in 2011 census) because Kerala Christianity has high church-per-
capita density (many small chapels, Kurisupally, sub-denomination splits).
Muslim mosques tend to be larger and fewer per capita.

### Tag coverage (deduped)

| Tag | Coverage | Notes |
|---|---|---|
| `religion` | 89.1% | The remaining 11% are building/shrine-tagged with no religion — need name-based inference |
| `name` | 84.0% | |
| `denomination` (Christians) | 32.3% | Headline signal for Phase 2 |
| `denomination` (Muslims) | 13.2% | Stronger than Kottayam sample suggested |
| `name:ml` | 3.5% | Malayalam transliterations sparse |
| `wikidata` | 1.7% | Cross-references to Wikidata |

### Christian sub-denomination signal

Hits from name-regex scan over all 6,045 Christian POIs:

| Pattern | Hits | Interpretation |
|---|---|---|
| `orthodox \| malankara` | 648 | Indian Orthodox |
| `catholic` (generic, no Syro prefix) | 343 | Needs diocesan spatial join to split Latin / Syro-Malabar / Syro-Malankara |
| `marthoma \| mar thoma` | 285 | Marthoma |
| `csi \| church of south india` | 245 | CSI |
| `jacobite` | 215 | Jacobite Syrian |
| `ipc \| pentecostal \| assemblies of god` | 158 | Pentecostal |
| `knanaya` | 45 | Knanaya (own community within Catholic + Jacobite) |
| `syro malabar` | 41 | Syro-Malabar (under-tagged — most appear as just "catholic") |
| `brethren` | 26 | Plymouth Brethren |
| `syro malankara` | 6 | Syro-Malankara |

### Muslim sub-denomination tags found (deduped)

| Value | Hits | Notes |
|---|---|---|
| `sunni` | 432 | Dominant tradition |
| `salafi` / `Salafi` | 9 | KNM / Mujahid affiliation |
| `mujahid` / `Mujahid` | 8 | Same as Salafi |
| `ahmadiyya` | 6 | Ahmadi community |
| `hanafi` / `Hanafi` | 5 | School of jurisprudence |
| `jamath_islami` / `jamat_islami` / variants | 8 | Jamaat-e-Islami |
| `shia` | 2 | Rare in Kerala |
| `sunni_ap` | 1 | AP Sunni faction (Kanthapuram vs E.K. split) |
| Total tagged | ~470 / 3,851 | 12% |

State-level Muslim sub-sect signal is **stronger than the Kottayam sample
implied**. Worth revisiting in Phase 2 — likely viable for AC-level
Mujahid-vs-Sunni split in north Kerala where mapping is denser.

### Data-quality issues to handle in Phase 2

1. **String normalization**: case + underscore variants
   (`marthoma` / `Marthoma` / `MARTHOMA` / `mar_thoma` / `mar thoma` /
   `marthoma_church` / `marthomite` / `martho` / `Marthomatie` / `mathoma`).
   Roughly 30 canonical buckets fed by ~150 surface variants.

2. **Deity-names leaked into denomination**: `Shiva`, `Hanuman`, `Ayyapan`,
   `Krishna`, `Lord_Dharma_Shasta`, `Sri Ayyappan`, etc. — these are not
   denominations. Strip them.

3. **Religion-field noise**: a few records have full names as the religion
   value (`Mannuthy_Mahallu_Jumma_Musjid`, `Farook_Juma_Sunni_Musjid_4.3_(7)`).
   Handful of cases; ignore or hand-correct.

4. **Catholic disambiguation**: 1,113 POIs are tagged just `catholic` or
   `roman_catholic` with no sub-Catholic specifier. Need a diocesan spatial
   prior to split into Latin / Syro-Malabar / Syro-Malankara. Diocesan
   boundaries are public (Wikipedia / Vatican GCatholic).

5. **No-religion building/shrine elements**: ~2,430 (11%) lack a `religion`
   tag entirely. Name-based inference can recover most:
   `Church/Chapel/Cathedral` → Christian; `Masjid/Mosque/Juma` → Muslim;
   `Temple/Kshetram/Devasthanam` → Hindu.
