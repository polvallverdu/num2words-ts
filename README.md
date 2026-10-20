# num2words-ts

Convert numbers to words in 50+ languages: cardinals, ordinals, years and currency amounts.

A faithful TypeScript port of the Python library [num2words](https://github.com/savoirfairelinux/num2words):
the same words for the same inputs, verified against the original on 56,000+ recorded cases. No
dependencies; runs on Node, Bun, Deno, browsers and Cloudflare Workers.

```sh
npm install num2words-ts
```

```ts
import { asFloat, num2words } from "num2words-ts";

num2words(42);                                   // "forty-two"
num2words(42, { to: "ordinal" });                // "forty-second"
num2words(42, { to: "ordinal_num" });            // "42nd"
num2words(1999, { to: "year" });                 // "nineteen ninety-nine"
num2words(3.14);                                 // "three point one four"
num2words(42, { lang: "fr" });                   // "quarante-deux"
num2words(1234567n, { lang: "de" });             // bigints for numbers of any size
num2words(asFloat(12.5), { to: "currency", currency: "USD" });
// "twelve dollars, fifty cents"
```

## Options

`num2words(value, { lang, to, ...converterOptions })`

- `lang`: a language code such as `"en"`, `"es"`, `"pt_BR"`, `"fr_CH"` (default `"en"`). An
  unknown regional code falls back to its first two letters.
- `to`: `"cardinal"` (default), `"ordinal"`, `"ordinal_num"`, `"year"` or `"currency"`.
- Converter options are the Python keyword arguments in camelCase, e.g. `{ to: "currency",
  currency: "EUR", cents: false, adjective: true }`, or `{ lang: "ru", gender: "f" }` where
  the language supports it.

`value` can be a `number`, a `bigint`, a numeric string, or a `Decimal` (exported).

### Integers vs floats

JavaScript cannot tell `100` from `100.0`, but num2words treats them differently in currency mode
(an integer is read as **cents**, like upstream). Integer `number`s and `bigint`s are integers;
use `asFloat(100)` for a float:

```ts
num2words(100, { to: "currency", currency: "USD" });          // "one dollar, zero cents"
num2words(asFloat(100), { to: "currency", currency: "USD" }); // "one hundred dollars, zero cents"
```

### Smaller bundles

Every converter is also importable on its own, so a bundler only includes what you use:

```ts
import { Num2Word_ES } from "num2words-ts/lang/ES";

const es = new Num2Word_ES();
es.toCardinal(21n); // "veintiuno"
```

## Languages

The language table is upstream's: `am`, `ar`, `az`, `be`, `bn`, `ca`, `ce`, `cs`, `cy`, `da`, `de`,
`en`, `en_IN`, `en_NG`, `eo`, `es`, `es_CO`, `es_CR`, `es_GT`, `es_NI`, `es_VE`, `fa`, `fi`, `fr`,
`fr_BE`, `fr_CH`, `fr_DZ`, `he`, `hu`, `id`, `is`, `it`, `ja`, `kn`, `ko`, `kz`, `lt`, `lv`, `nl`,
`no`, `pl`, `pt`, `pt_BR`, `ro`, `ru`, `sk`, `sl`, `sr`, `sv`, `te`, `tet`, `tg`, `th`, `tr`, `uk`,
`vi`. Support for each conversion type varies by language, as upstream.

## How it stays faithful

- `test/fixtures/` holds the output (or the exception) of the real Python num2words for every
  language on a deterministic corpus of integers up to 10^100, negatives, floats, decimals, years and
  currency amounts with every option. `bun test` replays all of it.
- The upstream test suite is ported test by test.
- Python's numeric semantics are reproduced where num2words depends on them (`src/py.ts`):
  arbitrary-precision integers, float `repr`, `Decimal` rounding, banker's rounding, floor
  division.

Regenerate the corpus after an upstream bump with `bun run fixtures` (needs Python 3).

## Versioning

`num2words-ts` has its own semver. The num2words release it ports is recorded in `package.json`
(`"upstream": { "num2words": "0.5.14" }`) and in the changelog: a new upstream release is a new
minor (or major, if upstream changes output), and a fix to the port alone is a patch.

## License

LGPL-2.1-or-later, like num2words (Copyright (c) 2003 Taro Ogawa, (c) 2013 Savoir-faire Linux inc.,
and the per-language contributors named in each file). See [LICENSE](LICENSE) and [NOTICE](NOTICE).
Using this package from code under any license is fine; changes to the library itself stay LGPL.
