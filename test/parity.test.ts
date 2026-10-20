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
    test(lang, () => {
      const cases: Case[] = JSON.parse(readFileSync(new URL(`${lang}.json`, dir), "utf8"));
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
    });
  }
});
