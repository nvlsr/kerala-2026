"""
Shared data loaders for python scripts.

Loads the trimmed JSON files in `data/` and rehydrates to the full
runtime shape (with derived candidate `alliance` / `status` / `margin` /
`isNota`) so analysis scripts can iterate per-candidate without
recomputing the same logic across 5+ scripts.

Mirrors `src/lib/data/constituencies.ts:hydrateConstituency` — kept
in sync by hand. The src/ runtime is the source of truth; scripts
are batch consumers.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent.parent


def _read(rel: str) -> Any:
    return json.loads((ROOT / rel).read_text())


def load_alliances() -> dict:
    return _read("data/alliances.json")


def load_ac_names() -> dict[str, dict]:
    raw = _read("data/ac-names.json")
    return {
        k: {"primary": v["primary"], "eci": v["primary"].upper()}
        for k, v in raw.items()
    }


def load_2026() -> list[dict]:
    """Return 2026 results as a list of {constituencyNumber, constituencyName,
    candidates: [{name, party, alliance, votes, margin, status, isNota}]} in
    AC order. Per-candidate alliance/status/margin/isNota are derived (the
    source JSON stores only name/party/votes — see commit ac1d440).
    """
    raw = _read("data/results-2026.json")
    alliances = load_alliances()
    pta = alliances["partyToAlliance"]
    names = load_ac_names()

    out = []
    for k, entry in raw.items():
        ac_num = int(k)
        sorted_c = sorted(entry["candidates"], key=lambda c: -c["votes"])
        winner_votes = sorted_c[0]["votes"] if sorted_c else 0
        second_votes = sorted_c[1]["votes"] if len(sorted_c) > 1 else 0
        cands = []
        for rank, c in enumerate(sorted_c):
            is_nota = c["name"] == "NOTA"
            status = "nota" if is_nota else "won" if rank == 0 else "lost"
            margin = (
                winner_votes - second_votes
                if rank == 0
                else c["votes"] - winner_votes
            )
            alliance = "NOTA" if is_nota else pta.get(c["party"], "OTHER")
            cands.append(
                {
                    "name": c["name"],
                    "party": c["party"],
                    "alliance": alliance,
                    "votes": c["votes"],
                    "margin": margin,
                    "status": status,
                    "isNota": is_nota,
                }
            )
        out.append(
            {
                "constituencyNumber": ac_num,
                "constituencyName": names.get(k, {}).get("eci", ""),
                "candidates": cands,
            }
        )
    out.sort(key=lambda c: c["constituencyNumber"])
    return out


def load_historical() -> dict[int, dict]:
    """Return {ac_num → {constituencyNumber, constituencyName, elections}}."""
    raw = _read("data/ac-history.json")
    names = load_ac_names()
    out = {}
    for k, v in raw.items():
        ac_num = int(k)
        out[ac_num] = {
            "constituencyNumber": ac_num,
            "constituencyName": names.get(k, {}).get("eci", ""),
            "elections": v["elections"],
        }
    return out


def save_json(rel_path: str, obj: Any) -> None:
    """Compact JSON write for committed data/*.json files."""
    (ROOT / rel_path).write_text(json.dumps(obj, separators=(",", ":")))
