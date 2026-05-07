# Kerala 2026 Election Narratives — Source Inventory

This directory collects narratives explaining why the Kerala 2026 Legislative Assembly election turned out the way it did. Goal: a comprehensive catalog of distinct claims/theories with sources, that can later be tested against our seat-level data.

## File organization

Each file is the output of one researcher (an AI agent or external tool). Files are kept separate so they don't overwrite each other. Merge happens later into a single `docs/narratives.md`.

| File | Researcher | Mandate |
|---|---|---|
| `agent-journalism.md` | Internal agent | National English-language journalism (The Hindu, Indian Express, The Print, Wire, Mint, Frontline, India Today, Scroll, Caravan) |
| `agent-academic.md` | Internal agent | Academic / institutional / data-driven (CSDS-Lokniti, ORF, CPR India, IIPS, papers, polling firms) |
| `agent-kerala.md` | Internal agent | Kerala-specific outlets + community/issue-driven coverage (Onmanorama, Mathrubhumi, Madhyamam, News Minute, community/issue threads) |
| `external-grok.md` | User → Grok | Twitter/X discourse; analysts and commentators tweeting about Kerala 2026 |
| `external-perplexity.md` | User → Perplexity | Citation-heavy web search; whatever Perplexity surfaces with sources |
| `external-chatgpt.md` | User → ChatGPT | Broad post-election coverage from ChatGPT's general knowledge + browsing |

## Schema (every entry must follow this format)

```markdown
### N. [Short title — 5-10 words capturing the claim]

**Claim:** [1-3 sentence faithful paraphrase or verbatim quote]

**Source(s):**
- [Outlet, Author, Date](URL)
- [Outlet, Author, Date](URL) (if multiple)

**Evidence strength:** Single voice | Multiple agreeing | Contested

**Theme:** religion | anti-incumbency | welfare-schemes | BJP-strategy | candidate-quality | caste | urban-rural | generational | specific-issue | coalition-dynamics | organizational | national-context | community-specific | other

**Testable with seat-level data?** Yes — by examining X | Partly — would need Y | No

---
```

## Coverage targets

Each file should aim for ~10 narratives. With 6 source files, total ~60 raw entries (with duplicates expected across files). After merge + dedupe in `docs/narratives.md`, expect 25-35 distinct narratives.

## Coverage dimensions to seek across the corpus

- Religion as voting axis (Muslim, Christian, Hindu shifts)
- Anti-incumbency vs continuity
- Welfare delivery (LDF's pension expansion, mission schemes)
- BJP's strategic inroads (or lack thereof)
- Caste dynamics (Ezhava, Nair, SC/ST)
- Generational / youth shifts
- Urban vs rural patterns
- Specific issues (Wakf bill, citizenship, gold smuggling, K-Rail, Sabarimala lingering, COVID memory)
- Coalition tensions within UDF or LDF
- Candidate quality / individual factors
- National context (Modi factor, Congress recovery)
- Community-specific swings (Latin Catholics, Syriac Christians, Sunni vs Salafi Muslims, Ezhava sub-groups)

## Quality discipline

- DO include partisan claims if attributed ("Congress spokesperson X claims...")
- DO include narratives even if contested or likely wrong — capture the full landscape
- DO NOT collapse narratives into vague generalities ("religion mattered" is too vague)
- DO NOT include unsourced speculation as if it were a documented narrative
- DO note where sources contradict each other
- ALWAYS cite the source URL

## Merge plan (later, after all 6 files are populated)

1. Aggregate everything into `docs/narratives.md`
2. Dedupe by claim — combine source lists for narratives appearing across multiple files
3. Tier-classify:
   - **Tier A**: testable with our data, sharp claim, credible source
   - **Tier B**: partly testable, would need data we don't have
   - **Tier C**: untestable, vague, or pure speculation
4. Pick Tier A subset (3-5 strongest) to design narrative cards for /flows or /drifts
