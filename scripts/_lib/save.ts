/**
 * Compact JSON writer for bun scripts. All committed `data/*.json` is
 * stored compact (single-line, no indent) — pretty format was costing
 * ~30-40% per file (commit 88d0501). Use this whenever a pipeline
 * script writes a committed file.
 */
import { writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..")

export function saveJson(relPath: string, obj: unknown): void {
  const abs = join(ROOT, relPath)
  writeFileSync(abs, JSON.stringify(obj))
}
