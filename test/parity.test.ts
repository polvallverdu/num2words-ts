// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Replays the corpus generated from upstream Python num2words
// (tools/gen_fixtures.py) and requires identical output or the same exception.

import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import {
  asFloat,
  CONVERTER_CLASSES,
  Decimal,
  type Num2WordsInput,
  num2words,
} from "../src/index.ts";

interface Case {
  input: { kind: "int" | "float" | "decimal" | "str"; value: string };
  to: string;
  kwargs: Record<string, unknown>;
  out?: string;
  error?: string;
}

const dir = new URL("./fixtures/", import.meta.url);

function decode(input: Case["input"]): Num2WordsInput {
  switch (input.kind) {
    case "int":
      return BigInt(input.value);
    case "float":
      return asFloat(Number(input.value));
    case "decimal":
      return new Decimal(input.value);
    case "str":
      return input.value;
  }
}

function camel(kwargs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(kwargs).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()),
      v,
    ]),
  );
}

const langs = readdirSync(dir)
  .filter((f) => f.endsWith(".json") && f !== "index.json")
  .map((f) => f.slice(0, -5));

describe("parity with Python num2words", () => {
  for (const lang of langs) {
    const converter = CONVERTER_CLASSES[lang];
    if (!converter || (converter.constructor as { STUB?: boolean }).STUB) {
      test.todo(`${lang} (not ported yet)`);
      continue;
    }
    const run = (cases: Case[]) => {
      const mismatches: string[] = [];
      for (const c of cases) {
        if ("skip" in c) continue;
        let got: string;
        try {
          got = num2words(decode(c.input), { lang, to: c.to as never, ...camel(c.kwargs) });
        } catch (e) {
          got = `!${(e as Error).name}`;
        }
        const want = c.error !== undefined ? `!${c.error}` : (c.out as string);
        if (got !== want) {
          mismatches.push(
            `${c.to}(${c.input.kind} ${c.input.value}${Object.keys(c.kwargs).length ? ` ${JSON.stringify(c.kwargs)}` : ""}): want ${JSON.stringify(want)} got ${JSON.stringify(got)}`,
          );
        }
      }
      if (mismatches.length) {
        throw new Error(
          `${mismatches.length}/${cases.length} mismatches:\n${mismatches.slice(0, 25).join("\n")}`,
        );
      }
      expect(mismatches.length).toBe(0);
    };
    const load = (): Case[] => JSON.parse(readFileSync(new URL(`${lang}.json`, dir), "utf8"));
    test(lang, () => run(load()));
    // Converters are shared singletons: a call that raises must not change
    // what later calls return. After each failing call, replay a sample of
    // successful cases (every conversion type) and require upstream's output.
    test(`${lang} (unchanged after errors)`, () => {
      const cases = load();
      const ok = cases.filter((c) => c.error === undefined && !("skip" in c));
      const step = Math.max(1, Math.floor(ok.length / 60));
      const probes = ok.filter((_, i) => i % step === 0);
      const leaks: string[] = [];
      for (const c of cases) {
        if (c.error === undefined) continue;
        try {
          num2words(decode(c.input), { lang, to: c.to as never, ...camel(c.kwargs) });
        } catch {}
        for (const p of probes) {
          let got: string;
          try {
            got = num2words(decode(p.input), { lang, to: p.to as never, ...camel(p.kwargs) });
          } catch (e) {
            got = `!${(e as Error).name}`;
          }
          if (got !== p.out) {
            leaks.push(
              `after ${c.to}(${c.input.value} ${JSON.stringify(c.kwargs)}): ${p.to}(${p.input.value}) want ${JSON.stringify(p.out)} got ${JSON.stringify(got)}`,
            );
            break;
          }
        }
        if (leaks.length >= 10) break;
      }
      if (leaks.length) throw new Error(`failing calls changed later output:\n${leaks.join("\n")}`);
    });
  }
});
