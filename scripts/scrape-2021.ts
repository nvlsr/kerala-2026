import * as fs from "fs"
import * as path from "path"

const OUT_DIR = "data/scraped-2021"
const URL_BASE =
  "http://keralaassembly.org/election/2021/assembly_poll.php?year=2021&no="

fs.mkdirSync(OUT_DIR, { recursive: true })

type ScrapedCandidate = {
  name: string
  party: string
  votes: number
  pct: number
}

type ScrapedSeat = {
  seat: number
  constituencyName: string
  electorate: number | null
  validVotesPolled: number | null
  pollingPct: number | null
  nota: number | null
  margin: number | null
  candidates: ScrapedCandidate[]
  sourceUrl: string
  fetchedAt: string
}

type Result =
  | { n: number; status: "ok"; cands: number; total: number }
  | { n: number; status: "skipped" }
  | { n: number; status: "error"; reason: string }

function pickInt(html: string, re: RegExp): number | null {
  const m = html.match(re)
  if (!m) return null
  return parseInt(m[1].replace(/,/g, ""), 10)
}

function pickFloat(html: string, re: RegExp): number | null {
  const m = html.match(re)
  if (!m) return null
  return parseFloat(m[1])
}

function parseSeat(n: number, html: string): ScrapedSeat {
  // Constituency name appears like:  <font color='#009900'>\n1. Manjeshwar <br></font>
  const cMatch = html.match(
    /<font color='#009900'>\s*\n?\s*\d+\.\s+([^<]+?)\s*<br\s*\/?>/i
  )
  const constituencyName = cMatch ? cMatch[1].trim() : ""

  const electorate = pickInt(html, /Electorate:\s*([\d,]+)/)
  const validVotesPolled = pickInt(html, /Valid Votes Polled:\s*([\d,]+)/)
  const pollingPct = pickFloat(html, /Polling Percentage:\s*([\d.]+)/)
  const nota = pickInt(html, /NOTA:\s*([\d,]+)/)
  const margin = pickInt(
    html,
    /elected with a margin of\s*<b>([\d,]+)<\/b>\s*votes/
  )

  // Candidates table — bordered table with rows of (name, party, votes, pct)
  const candidates: ScrapedCandidate[] = []
  const tableMatch = html.match(/<table border='1'[^>]*>([\s\S]*?)<\/table>/)
  if (tableMatch) {
    const rows = tableMatch[1].match(/<tr>[\s\S]*?<\/tr>/g) || []
    for (const row of rows) {
      if (row.includes("<b>Name") || row.includes("<b>Total")) continue
      const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) =>
        m[1]
          .replace(/<[^>]+>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      )
      if (cells.length < 4) continue
      const votes = parseInt(cells[2].replace(/,/g, ""), 10)
      if (Number.isNaN(votes)) continue
      candidates.push({
        name: cells[0],
        party: cells[1],
        votes,
        pct: parseFloat(cells[3]) || 0,
      })
    }
  }

  return {
    seat: n,
    constituencyName,
    electorate,
    validVotesPolled,
    pollingPct,
    nota,
    margin,
    candidates,
    sourceUrl: `${URL_BASE}${n}`,
    fetchedAt: new Date().toISOString(),
  }
}

async function scrapeSeat(n: number): Promise<Result> {
  const outFile = path.join(OUT_DIR, `seat-${n}.json`)
  if (fs.existsSync(outFile)) {
    return { n, status: "skipped" }
  }
  try {
    const res = await fetch(`${URL_BASE}${n}`, {
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      return { n, status: "error", reason: `HTTP ${res.status}` }
    }
    const html = await res.text()
    const data = parseSeat(n, html)
    if (!data.constituencyName || data.candidates.length === 0) {
      return {
        n,
        status: "error",
        reason: "parse failed (no name or no candidates)",
      }
    }
    fs.writeFileSync(outFile, JSON.stringify(data, null, 2) + "\n")
    return {
      n,
      status: "ok",
      cands: data.candidates.length,
      total: data.candidates.reduce((s, c) => s + c.votes, 0),
    }
  } catch (e: unknown) {
    return { n, status: "error", reason: String(e) }
  }
}

async function main() {
  const args = process.argv.slice(2)
  const start = parseInt(args[0] || "1", 10)
  const end = parseInt(args[1] || "140", 10)
  const concurrency = parseInt(args[2] || "5", 10)

  const ns: number[] = []
  for (let i = start; i <= end; i++) ns.push(i)

  let okCount = 0
  let skipCount = 0
  const errors: Array<{ n: number; reason: string }> = []

  for (let i = 0; i < ns.length; i += concurrency) {
    const batch = ns.slice(i, i + concurrency)
    const results = await Promise.all(batch.map(scrapeSeat))
    for (const r of results) {
      if (r.status === "ok") okCount++
      else if (r.status === "skipped") skipCount++
      else errors.push({ n: r.n, reason: r.reason })
    }
    const last = batch[batch.length - 1]
    process.stdout.write(
      `...up to seat ${last}: ${okCount} ok / ${skipCount} skipped / ${errors.length} errors\n`
    )
  }

  console.log("")
  console.log(
    `Done. ${okCount} fetched, ${skipCount} skipped, ${errors.length} errors`
  )
  if (errors.length > 0) {
    console.log("\nErrors:")
    for (const e of errors) console.log(`  Seat ${e.n}: ${e.reason}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
