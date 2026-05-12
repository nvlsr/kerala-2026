/**
 * Orchestrator: runs every phase that exists.
 *
 * Today: Phase 1 (AC dossiers + flat lookups). As later phases land, add their
 * entry points here.
 *
 * Usage:
 *   bun run scripts/analysis/tweet-dossiers/build-all.ts
 */

import { execSync } from "node:child_process"
import { resolve } from "node:path"

const HERE = resolve(__dirname)

const phases: Array<{ name: string; script: string; phase: string }> = [
  { phase: "1", name: "AC dossiers (140)", script: "build-ac-dossiers.ts" },
  { phase: "1", name: "Alliance dossiers (3)", script: "build-alliance-dossiers.ts" },
  { phase: "1", name: "Flat lookups (ac-table.tsv + party-alliance.json)", script: "build-lookups.ts" },
  { phase: "2", name: "Community dossiers (10)", script: "build-community-dossiers.ts" },
  { phase: "3", name: "District dossiers (14)", script: "build-district-dossiers.ts" },
  // Phase 4-5 scripts go here as they are built.
]

for (const p of phases) {
  console.log(`\n── Phase ${p.phase}: ${p.name} ──`)
  execSync(`bun run ${resolve(HERE, p.script)}`, { stdio: "inherit" })
}

console.log("\nAll available phases complete.")
