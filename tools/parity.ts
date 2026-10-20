// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Run the parity corpus for one language against a converter module, before
// it is registered in src/index.ts:
//
//   bun tools/parity.ts <lang> [src/lang/XX.ts] [ClassName]
//
// Prints the mismatch count and the first mismatches.

import { readFileSync } from "node:fs";
import type { Num2Word_Base } from "../src/base.ts";
import { asFloat, CONVERTER_CLASSES, Decimal, type Float, num2words } from "../src/index.ts";

const [lang, modulePath, className] = process.argv.slice(2);
if (!lang) throw new Error("usage: bun tools/parity.ts <lang> [module] [ClassName]");

if (modulePath && className && !(lang in CONVERTER_CLASSES)) {
  const mod = (await import(new URL(`../${modulePath}`, import.meta.url).href)) as Record<
    string,
    new () => Num2Word_Base
  >;
  const Converter = mod[className];
  if (!Converter) throw new Error(`${className} not exported by ${modulePath}`);
  CONVERTER_CLASSES[lang] = new Converter();
}

interface Case {
  input: { kind: string; value: string };
  to: string;
  kwargs: Record<string, unknown>;
  out?: string;
  error?: string;
  skip?: string;
}
const cases: Case[] = JSON.parse(readFileSync(`test/fixtures/${lang}.json`, "utf8"));
const camel = (k: string) => k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
const mismatches: string[] = [];
let run = 0;
for (const c of cases) {
  if (c.skip) continue;
  run++;
  const v =
    c.input.kind === "int"
      ? BigInt(c.input.value)
      : c.input.kind === "float"
        ? asFloat(Number(c.input.value))
        : c.input.kind === "decimal"
          ? new Decimal(c.input.value)
          : c.input.value;
  let got: string;
  try {
    got = num2words(v as bigint | Float | Decimal | string, {
      lang,
      to: c.to as never,
      ...Object.fromEntries(Object.entries(c.kwargs).map(([k, x]) => [camel(k), x])),
    });
  } catch (e) {
    got = `!${(e as Error).name}`;
  }
  const want = c.error !== undefined ? `!${c.error}` : (c.out as string);
  if (got !== want) {
    mismatches.push(
      `${c.to}(${c.input.kind} ${c.input.value} ${JSON.stringify(c.kwargs)}): want ${JSON.stringify(want)}, got ${JSON.stringify(got)}`,
    );
  }
}
console.log(`${lang}: ${run - mismatches.length}/${run} match`);
for (const m of mismatches.slice(0, 40)) console.log(`  ${m}`);
process.exit(mismatches.length ? 1 : 0);
