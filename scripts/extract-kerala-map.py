#!/usr/bin/env python3
"""Extract Kerala districts from datameet shapefile, simplify, write GeoJSON.

Source data is from https://github.com/datameet/maps (CC-BY 2.5 IN). The
shapefile is not vendored in this repo — clone the upstream repo to
`data/maps-master/` if you want to re-run this script.

Reads:
  data/maps-master/Districts/Census_2011/2011_Dist.shp

Writes:
  data/kerala-districts.geojson

Usage:
  git clone https://github.com/datameet/maps data/maps-master
  python3 scripts/extract-kerala-map.py
"""

import json
import sys
from pathlib import Path

import shapefile
from shapely.geometry import shape, mapping
from shapely import simplify

ROOT = Path(__file__).resolve().parent.parent
SHP = ROOT / "data/maps-master/Districts/Census_2011/2011_Dist.shp"
OUT = ROOT / "data/kerala-districts.geojson"
DISTRICTS_JSON = ROOT / "data/districts.json"

SIMPLIFY_TOLERANCE = 0.005  # ~500m at Kerala latitudes


def main() -> int:
    known = {
        d["name"].lower(): d["id"]
        for d in json.loads(DISTRICTS_JSON.read_text())["districts"]
    }

    sf = shapefile.Reader(str(SHP))
    field_names = [f[0] for f in sf.fields[1:]]
    features: list[dict] = []
    seen_ids: set[str] = set()
    skipped: list[str] = []

    for shp_record in sf.shapeRecords():
        rec = dict(zip(field_names, shp_record.record))
        if rec.get("ST_NM") != "Kerala":
            continue

        district_name = rec.get("DISTRICT", "")
        district_id = known.get(district_name.lower())
        if not district_id:
            skipped.append(district_name)
            continue

        geom = shape(shp_record.shape.__geo_interface__)
        simplified = simplify(geom, SIMPLIFY_TOLERANCE, preserve_topology=True)

        features.append({
            "type": "Feature",
            "properties": {
                "id": district_id,
                "name": district_name,
                "censuscode": rec.get("censuscode"),
            },
            "geometry": mapping(simplified),
        })
        seen_ids.add(district_id)

    missing = sorted(set(known.values()) - seen_ids)
    if missing:
        print(f"WARN: missing districts in shapefile: {missing}", file=sys.stderr)
    if skipped:
        print(f"WARN: skipped (no ID match): {skipped}", file=sys.stderr)

    geojson = {"type": "FeatureCollection", "features": features}
    OUT.write_text(json.dumps(geojson, separators=(",", ":")))

    print(f"✓ Wrote {OUT.relative_to(ROOT)}")
    print(f"  Features: {len(features)}")
    print(f"  Size: {OUT.stat().st_size / 1024:.1f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
