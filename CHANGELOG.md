# Changelog

## 1.0.1 (2026-10-20)

- Top-level `main` and `types` in package.json, so npm shows the TypeScript badge and older
  tooling that ignores `exports` finds the entry point and its types.
- First release published from GitHub Actions with npm trusted publishing and provenance.

## 1.0.0 (2026-10-20)

- First release: a TypeScript port of num2words 0.5.14 (all 56 language codes).
- Output verified identical to the Python library on a 61,815-case corpus, plus the upstream test
  suite ported test by test.
- A failing call no longer changes later results (upstream leaks converter state after errors in
  ro/pt currency and da/sl ordinals); covered by a test that replays known-good cases after
  every failing case.
- Runs on Node, Bun, Deno, browsers and Cloudflare Workers; no dependencies.
