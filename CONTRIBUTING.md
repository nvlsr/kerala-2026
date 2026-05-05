# Contributing

Thanks for your interest in improving Kerala 2026. This guide is short on purpose — most of the project conventions live in `docs/architecture.md`; read that before you build anything non-trivial.

## Ways to contribute

- **Report a bug or data error** — open a [GitHub issue](https://github.com/nvlsr/kerala-2026/issues/new). Cite the constituency, candidate, or section so it can be reproduced.
- **Suggest a feature or visualization** — open an issue first to align on direction before writing code. UX changes that affect filter state or the shareable URL especially benefit from discussion.
- **Submit a pull request** — see "Workflow" below.

## Prerequisites

- [Bun](https://bun.sh) (runtime + package manager — there is no `npm` story here).
- A reasonably recent macOS / Linux / WSL shell. Windows native is untested.

## Setup

```bash
git clone https://github.com/nvlsr/kerala-2026.git
cd kerala-2026
bun install
bun run dev
```

The dev server runs at `http://localhost:5173`.

## Workflow

1. Pick or open an issue describing what you're going to change.
2. Branch from `main`: `git checkout -b feat/short-description` (or `fix/...`, `refactor/...`).
3. Make the change. Keep the change focused — one concern per PR. If you find unrelated cleanup along the way, save it for a follow-up.
4. Before pushing, run all four checks locally:
   ```bash
   bun run typecheck
   bun run lint
   bun run test
   bun run build
   ```
   PRs that don't pass these locally will fail CI too.
5. Open a PR against `main`. Describe what changed and why; link the issue if there is one.

## Code conventions

- **Read `docs/architecture.md` first.** It explains the section template, filter state model, data layer split, and naming conventions.
- **Match existing patterns over introducing new ones.** If you find two places already doing something three different ways, that's a signal to consolidate, not a license to add a fourth.
- **Don't invent abstractions for hypothetical future cases.** Three similar lines is better than a premature helper.
- **TypeScript strictness is non-negotiable.** No `any`, no untyped casts at trust boundaries.
- **Keep PRs reviewable.** Anything north of ~400 lines should probably be split.

## Tests

Unit tests for pure logic (data aggregation, sorting, filter parsing, encoding rules) live alongside the data layer in `src/lib/data/data.test.ts`. If you add a function with non-trivial branching, add a test for it.

UI behavior is currently verified by hand in the browser. If you change something user-visible, test it locally before opening the PR.

## Reporting data issues

The Kerala 2026 results dataset is curated by hand from ECI sources. If you find a mistake — wrong margin, a misclassified party alliance, a missing candidate — please open an issue with:

- The constituency number and name.
- The exact field that is wrong.
- A link or citation for the correct value.

Bulk corrections to historical cycles are welcome but should land in their own PR for easier review.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE) that covers the rest of the project.
