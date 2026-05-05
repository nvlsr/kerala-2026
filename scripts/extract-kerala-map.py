#!/usr/bin/env python3
"""Extract Kerala district + assembly-constituency boundaries from datameet
shapefiles, simplify, write GeoJSON.

Source data is from https://github.com/datameet/maps (CC-BY 2.5 IN). The
shapefiles are not vendored in this repo — clone the upstream repo to
`data/maps-master/` if you want to re-run this script.

Reads:
  data/maps-master/Districts/Census_2011/2011_Dist.shp
  data/maps-master/assembly-constituencies/India_AC.shp

Writes:
  data/kerala-districts.geojson
  data/kerala-constituencies.geojson

Usage:
  git clone https://github.com/datameet/maps data/maps-master
  python3 scripts/extract-kerala-map.py

Notes:
  - AC #87 Kothamangalam appears twice in India_AC.shp (DT_CODE=8 ERNAKULAM
    + DT_CODE=9 IDUKKI from a PC mislabel). We dedupe by keeping the record
    whose district matches our authoritative data/districts.json mapping;
    Kothamangalam is administratively in Ernakulam.
"""

import json
import sys
from pathlib import Path

import shapefile
from shapely.geometry import shape, mapping
from shapely import simplify

ROOT = Path(__file__).resolve().parent.parent
DIST_SHP = ROOT / "data/maps-master/Districts/Census_2011/2011_Dist.shp"
AC_SHP = ROOT / "data/maps-master/assembly-constituencies/India_AC.shp"
DIST_OUT = ROOT / "data/kerala-districts.geojson"
AC_OUT = ROOT / "data/kerala-constituencies.geojson"
DISTRICTS_JSON = ROOT / "data/districts.json"

# District simplify is permissive (~500m); AC needs finer detail (~150m) since
# the polygons are smaller and over-simplification breaks adjacent boundaries.
DIST_TOLERANCE = 0.005
AC_TOLERANCE = 0.0015


def extract_districts(known_districts: dict[str, str]) -> None:
    sf = shapefile.Reader(str(DIST_SHP))
    field_names = [f[0] for f in sf.fields[1:]]
    features: list[dict] = []
    seen_ids: set[str] = set()
    skipped: list[str] = []

    for shp_record in sf.shapeRecords():
        rec = dict(zip(field_names, shp_record.record))
        if rec.get("ST_NM") != "Kerala":
            continue
        name = rec.get("DISTRICT", "")
        district_id = known_districts.get(name.lower())
        if not district_id:
            skipped.append(name)
            continue
        geom = shape(shp_record.shape.__geo_interface__)
        simplified = simplify(geom, DIST_TOLERANCE, preserve_topology=True)
        features.append({
            "type": "Feature",
            "properties": {
                "id": district_id,
                "name": name,
                "censuscode": rec.get("censuscode"),
            },
            "geometry": mapping(simplified),
        })
        seen_ids.add(district_id)

    missing = sorted(set(known_districts.values()) - seen_ids)
    if missing:
        print(f"WARN: missing districts: {missing}", file=sys.stderr)
    if skipped:
        print(f"WARN: skipped districts (no ID match): {skipped}", file=sys.stderr)

    out = {"type": "FeatureCollection", "features": features}
    DIST_OUT.write_text(json.dumps(out, separators=(",", ":")))
    print(f"✓ {DIST_OUT.relative_to(ROOT)}: {len(features)} features, {DIST_OUT.stat().st_size / 1024:.1f} KB")


def extract_acs(constituency_to_district: dict[str, str]) -> None:
    sf = shapefile.Reader(str(AC_SHP))
    field_names = [f[0] for f in sf.fields[1:]]
    by_ac: dict[int, dict] = {}
    duplicates: list[tuple[int, str]] = []

    for shp_record in sf.shapeRecords():
        rec = dict(zip(field_names, shp_record.record))
        if rec.get("ST_NAME") != "KERALA":
            continue

        ac_no = rec.get("AC_NO")
        if not isinstance(ac_no, int):
            continue
        expected_district = constituency_to_district.get(str(ac_no))
        shp_district = (rec.get("DIST_NAME") or "").lower()

        # Dedupe: when an AC_NO appears twice, keep the record whose district
        # matches our authoritative mapping. AC #87 Kothamangalam is the known
        # case (Ernakulam vs Idukki PC mislabel).
        if ac_no in by_ac:
            existing = by_ac[ac_no]
            existing_match = (
                existing.get("_dist_match", False) if isinstance(existing, dict) else False
            )
            this_match = expected_district and shp_district == expected_district
            duplicates.append((ac_no, rec.get("DIST_NAME") or ""))
            if this_match and not existing_match:
                pass  # fall through to overwrite
            else:
                continue

        geom = shape(shp_record.shape.__geo_interface__)
        simplified = simplify(geom, AC_TOLERANCE, preserve_topology=True)
        by_ac[ac_no] = {
            "type": "Feature",
            "properties": {
                "constituencyNumber": ac_no,
                "name": rec.get("AC_NAME"),
                "districtId": expected_district,
                "shapefileDistrict": rec.get("DIST_NAME"),
            },
            "geometry": mapping(simplified),
            "_dist_match": expected_district and shp_district == expected_district,
        }

    # Strip internal _dist_match field
    features = []
    for ac_no in sorted(by_ac.keys()):
        f = by_ac[ac_no]
        f.pop("_dist_match", None)
        features.append(f)

    missing = sorted(set(range(1, 141)) - set(by_ac.keys()))
    if missing:
        print(f"WARN: missing AC_NOs: {missing}", file=sys.stderr)
    if duplicates:
        print(f"INFO: deduped {len(duplicates)} duplicate AC record(s): {duplicates}", file=sys.stderr)

    out = {"type": "FeatureCollection", "features": features}
    AC_OUT.write_text(json.dumps(out, separators=(",", ":")))
    print(f"✓ {AC_OUT.relative_to(ROOT)}: {len(features)} features, {AC_OUT.stat().st_size / 1024:.1f} KB")


def main() -> int:
    districts_data = json.loads(DISTRICTS_JSON.read_text())
    known_districts = {
        d["name"].lower(): d["id"] for d in districts_data["districts"]
    }
    constituency_to_district: dict[str, str] = districts_data[
        "constituencyToDistrict"
    ]

    extract_districts(known_districts)
    extract_acs(constituency_to_district)
    return 0


if __name__ == "__main__":
    sys.exit(main())
