export const meta = {
  name: 'port',
  description: 'Port pending num2words languages and tests to TypeScript with exact parity against upstream Python',
  whenToUse: 'Porting the remaining num2words languages/tests. args: {maxLines, review}',
  phases: [
    { title: 'Plan', detail: 'pack pending languages + tests into units (tools/port/plan.py)' },
    { title: 'Port', detail: 'one porter per unit: languages, tests, parity' },
    { title: 'Review', detail: 'adversarial parity review against the Python source' },
    { title: 'Integrate', detail: 'typecheck, lint, full test suite, build, compat' },
  ],
}

const opts = Object.assign({ maxLines: 2600, review: true }, args || {})

const CONTEXT = `You are porting the Python library num2words (pinned checkout in .upstream/num2words) to
TypeScript in this repository (num2words-ts, repo root = current directory). Read CONVENTIONS.md in
full first, then the hand-ported reference files: src/py.ts, src/base.ts, src/currency.ts,
src/lang/EU.ts, src/lang/EN.ts, src/index.ts, test/parity.test.ts. They define every rule; the most
important: Python int -> bigint and float -> number (a number is ALWAYS a float), Python // % divmod
-> floordiv/mod/divmod helpers, Python truthiness and exceptions reproduced exactly, converter fields
assigned in setup() declared with \`declare\`, class attributes as static members, keyword arguments
as a camelCase options object, every upstream copyright line kept in the header.
Other agents port other languages at the same time. Only edit the files listed for you (plus new
helper files of your own under src/lang/ if a language needs one). Never edit src/index.ts,
src/languages.ts, src/py.ts, src/base.ts or test/parity.test.ts; if you believe a shared file is
wrong, say so in your notes instead.
The goal is IDENTICAL behavior to upstream: same output strings, same exception class names.
test/fixtures/<code>.json holds 1000+ cases recorded from the real Python library for each language;
\`bun tools/parity.ts <code>\` replays them and lists mismatches. A language is done when it reports
all cases matching and its upstream test file passes.`

const UNITS_SCHEMA = {
  type: 'object',
  properties: { json: { type: 'string', description: 'stdout of the command, verbatim' } },
  required: ['json'],
}

const PORT_SCHEMA = {
  type: 'object',
  properties: {
    languages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          parityMatched: { type: 'number' },
          parityTotal: { type: 'number' },
          notes: { type: 'string' },
        },
        required: ['code', 'parityMatched', 'parityTotal', 'notes'],
      },
    },
    tests: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          file: { type: 'string' },
          passed: { type: 'number' },
          failed: { type: 'number' },
          skipped: { type: 'number' },
          notes: { type: 'string' },
        },
        required: ['file', 'passed', 'failed', 'skipped', 'notes'],
      },
    },
    sharedFileConcerns: { type: 'array', items: { type: 'string' } },
  },
  required: ['languages', 'tests', 'sharedFileConcerns'],
}

const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    fixed: { type: 'array', items: { type: 'string' } },
    unresolved: { type: 'array', items: { type: 'string' } },
  },
  required: ['fixed', 'unresolved'],
}

const INTEGRATE_SCHEMA = {
  type: 'object',
  properties: {
    typeErrors: { type: 'number' },
    testsPassed: { type: 'number' },
    testsFailed: { type: 'number' },
    compatOk: { type: 'boolean' },
    summary: { type: 'string' },
  },
  required: ['typeErrors', 'testsPassed', 'testsFailed', 'compatOk', 'summary'],
}

phase('Plan')
const plan = await agent(
  `Run exactly: python3 -I tools/port/plan.py --max-lines ${opts.maxLines}
and return its stdout verbatim in the json field. Do nothing else.`,
  { label: 'plan', schema: UNITS_SCHEMA, effort: 'low' },
)
const units = JSON.parse(plan.json)
log(`${units.length} units, ${units.reduce((a, u) => a + u.lines, 0)} Python lines (languages + tests)`)

const results = await pipeline(
  units,
  (unit) => {
    const langs = unit.languages
      .map((l) => `- ${l.upstream} -> ${l.ts} (class ${l.classes.join(', ')}; codes ${l.codes.join(', ')}; ${l.lines} lines)`)
      .join('\n')
    const tests = unit.tests.map((t) => `- .upstream/num2words/${t.upstream} -> ${t.ts} (${t.lines} lines)`).join('\n')
    const cli = unit.tests.some((t) => t.upstream === 'tests/test_cli.py')
      ? `\nThis unit includes tests/test_cli.py: port the upstream CLI (.upstream/num2words/bin/num2words, which
uses docopt) to src/cli.ts with hand-written argument parsing that accepts the same flags and prints the
same output, add "bin": {"num2words-ts": "./dist/cli.js"} to package.json (keep the file executable via a
"#!/usr/bin/env node" shebang), and port the CLI tests to spawn \`bun src/cli.ts\`.`
      : ''
    return agent(
      `${CONTEXT}

Your unit ${unit.id}.
Languages to port (each file currently holds a STUB class; replace it entirely, keep the exported class
name, remove the STUB flag; port parent languages before their children):
${langs || '(none)'}

Upstream test files to port 1:1 with bun:test:
${tests || '(none)'}
${cli}
For each language: read the whole Python file, port it faithfully, then run \`bun tools/parity.ts <code>\`
for every code and fix the port until all cases match. Mismatches mean the TS differs from Python: read
the Python again (and run it: \`PYTHONPATH=.upstream/num2words python3 -c "from num2words import num2words; print(num2words(...))"\`)
instead of guessing. Then port and run the test files (\`bun test <file>\`). Finally run
\`bunx tsc --noEmit -p tsconfig.json\` and \`bunx biome check --write <your files>\` and fix your files.
Report real final numbers.`,
      { label: `port:${unit.id}`, phase: 'Port', schema: PORT_SCHEMA },
    )
  },
  (ported, unit) => {
    if (!opts.review || !ported) return ported
    const files = [...unit.languages.map((l) => `- .upstream/num2words/${l.upstream} -> ${l.ts}`), ...unit.tests.map((t) => `- .upstream/num2words/${t.upstream} -> ${t.ts}`)].join('\n')
    return agent(
      `${CONTEXT}

You are an adversarial reviewer. Another agent ported:
${files}

The parity corpus only samples inputs, so passing it does not prove the port is right. Compare each TS
file with its Python source line by line and hunt for divergences the corpus may not cover: kwargs and
their defaults (gender, case, plural, longval, prefer, reading, counter, ...) and every branch that
depends on them; Python truthiness (0, "", [], {} are falsy; [] and {} are truthy in JS); bigint vs
number mix-ups (a float must stay a float); // and % on negatives; string slicing with negative
indices; dict.get defaults vs KeyError; exception classes; Unicode handling (Python indexes code
points, JS code units: use [...s] for non-BMP text); copyright lines; tests that were weakened or
skipped without a DIVERGENCE note. For anything suspicious, run both implementations on the input
(Python via PYTHONPATH=.upstream/num2words) and fix the TS when they differ. Re-run
\`bun tools/parity.ts <code>\` and the test files afterwards. Do not restyle correct code.`,
      { label: `review:${unit.id}`, phase: 'Review', schema: REVIEW_SCHEMA },
    ).then((review) => ({ ...ported, review }))
  },
)
const ported = results.filter(Boolean)

phase('Integrate')
let integration = null
for (let round = 1; round <= 2; round++) {
  integration = await agent(
    `${CONTEXT}

All units were ported in parallel. Now integrate, in this order, fixing problems as you go (you may now
edit any file, but keep shared-file changes minimal and justified by upstream behavior):
1. \`bun install\`, then \`bunx tsc --noEmit -p tsconfig.json\` until clean.
2. \`bun test\` (includes the full parity corpus for every language) until everything passes or is
   an explicitly documented divergence.
3. \`bun run lint\` (biome + upstream copyright headers) until clean.
4. \`bun run build\` and \`bun run compat\` (dist/ on bun, node, deno, workerd).
Concerns other agents raised about shared files:
${ported.flatMap((r) => r.sharedFileConcerns || []).map((c) => `- ${c}`).join('\n') || '(none)'}
Round ${round}. Report real numbers from the final runs.`,
    { label: `integrate:${round}`, phase: 'Integrate', schema: INTEGRATE_SCHEMA },
  )
  log(`integrate ${round}: ${integration?.typeErrors} type errors, ${integration?.testsFailed} failing tests, compat ${integration?.compatOk ? 'ok' : 'failing'}`)
  if (integration && integration.typeErrors === 0 && integration.testsFailed === 0 && integration.compatOk) break
}

return {
  languages: ported.flatMap((r) => r.languages),
  tests: ported.flatMap((r) => r.tests),
  reviewFixes: ported.flatMap((r) => r.review?.fixed || []),
  unresolved: ported.flatMap((r) => r.review?.unresolved || []),
  integration,
}
