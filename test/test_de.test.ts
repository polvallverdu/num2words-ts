// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_de.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words } from "../src/index.ts";

const TEST_CASES_TO_CURRENCY_EUR = [
  [asFloat(1), "ein Euro und null Cent"],
  [2.01, "zwei Euro und ein Cent"],
  [8.1, "acht Euro und zehn Cent"],
  [12.26, "zwölf Euro und sechsundzwanzig Cent"],
  [21.29, "einundzwanzig Euro und neunundzwanzig Cent"],
  [81.25, "einundachtzig Euro und fünfundzwanzig Cent"],
  [asFloat(100), "einhundert Euro und null Cent"],
] as const;

const TEST_CASES_TO_CURRENCY_USD = [
  [asFloat(1), "ein Dollar und null Cent"],
  [2.01, "zwei Dollar und ein Cent"],
  [8.1, "acht Dollar und zehn Cent"],
  [12.26, "zwölf Dollar und sechsundzwanzig Cent"],
  [21.29, "einundzwanzig Dollar und neunundzwanzig Cent"],
  [81.25, "einundachtzig Dollar und fünfundzwanzig Cent"],
  [asFloat(100), "einhundert Dollar und null Cent"],
] as const;

const TEST_CASES_TO_CURRENCY_GBP = [
  [asFloat(1), "ein Pfund und null Pence"],
  [2.01, "zwei Pfund und ein Penny"],
  [8.1, "acht Pfund und zehn Pence"],
  [12.26, "zwölf Pfund und sechsundzwanzig Pence"],
  [21.29, "einundzwanzig Pfund und neunundzwanzig Pence"],
  [81.25, "einundachtzig Pfund und fünfundzwanzig Pence"],
  [asFloat(100), "einhundert Pfund und null Pence"],
] as const;

const TEST_CASES_TO_CURRENCY_DEM = [
  [asFloat(1), "ein Mark und null Pfennig"],
  [2.01, "zwei Mark und ein Pfennig"],
  [8.1, "acht Mark und zehn Pfennig"],
  [12.26, "zwölf Mark und sechsundzwanzig Pfennig"],
  [21.29, "einundzwanzig Mark und neunundzwanzig Pfennig"],
  [81.25, "einundachtzig Mark und fünfundzwanzig Pfennig"],
  [asFloat(100), "einhundert Mark und null Pfennig"],
] as const;

describe("Num2WordsDETest", () => {
  test("test_ordinal_less_than_twenty", () => {
    expect(num2words(0, { ordinal: true, lang: "de" })).toBe("nullte");
    expect(num2words(1, { ordinal: true, lang: "de" })).toBe("erste");
    expect(num2words(7, { ordinal: true, lang: "de" })).toBe("siebte");
    expect(num2words(8, { ordinal: true, lang: "de" })).toBe("achte");
    expect(num2words(12, { ordinal: true, lang: "de" })).toBe("zwölfte");
    expect(num2words(17, { ordinal: true, lang: "de" })).toBe("siebzehnte");
  });

  test("test_ordinal_more_than_twenty", () => {
    expect(num2words(81, { ordinal: true, lang: "de" })).toBe("einundachtzigste");
  });

  test("test_ordinal_at_crucial_number", () => {
    expect(num2words(100, { ordinal: true, lang: "de" })).toBe("hundertste");
    expect(num2words(1000, { ordinal: true, lang: "de" })).toBe("tausendste");
    expect(num2words(4000, { ordinal: true, lang: "de" })).toBe("viertausendste");
    expect(num2words(1000000, { ordinal: true, lang: "de" })).toBe("millionste");
    expect(num2words(2000000, { ordinal: true, lang: "de" })).toBe("zweimillionste");
    expect(num2words(1000000000, { ordinal: true, lang: "de" })).toBe("milliardste");
    expect(num2words(5000000000, { ordinal: true, lang: "de" })).toBe("fünfmilliardste");
  });

  test("test_cardinal_at_some_numbers", () => {
    expect(num2words(100, { lang: "de" })).toBe("einhundert");
    expect(num2words(1000, { lang: "de" })).toBe("eintausend");
    expect(num2words(5000, { lang: "de" })).toBe("fünftausend");
    expect(num2words(10000, { lang: "de" })).toBe("zehntausend");
    expect(num2words(1000000, { lang: "de" })).toBe("eine Million");
    expect(num2words(2000000, { lang: "de" })).toBe("zwei Millionen");
    expect(num2words(4000000000, { lang: "de" })).toBe("vier Milliarden");
    expect(num2words(1000000000, { lang: "de" })).toBe("eine Milliarde");
  });

  test("test_cardinal_for_decimal_number", () => {
    expect(num2words(3.486, { lang: "de" })).toBe("drei Komma vier acht sechs");
  });

  test("test_giant_cardinal_for_merge", () => {
    expect(num2words(4500072900000111, { lang: "de" })).toBe(
      "vier Billiarden fünfhundert Billionen " +
        "zweiundsiebzig Milliarden neunhundert Millionen einhundertelf",
    );
  });

  test("test_ordinal_num", () => {
    expect(num2words(7, { to: "ordinal_num", lang: "de" })).toBe("7.");
    expect(num2words(81, { to: "ordinal_num", lang: "de" })).toBe("81.");
  });

  test("test_ordinal_for_negative_numbers", () => {
    expect(() => num2words(-12, { ordinal: true, lang: "de" })).toThrow(TypeError);
  });

  test("test_ordinal_for_floating_numbers", () => {
    expect(() => num2words(2.453, { ordinal: true, lang: "de" })).toThrow(TypeError);
  });

  test("test_currency_eur", () => {
    for (const test of TEST_CASES_TO_CURRENCY_EUR) {
      expect(num2words(test[0], { lang: "de", to: "currency", currency: "EUR" })).toBe(test[1]);
    }
  });

  test("test_currency_usd", () => {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "de", to: "currency", currency: "USD" })).toBe(test[1]);
    }
  });

  test("test_currency_dem", () => {
    for (const test of TEST_CASES_TO_CURRENCY_DEM) {
      expect(num2words(test[0], { lang: "de", to: "currency", currency: "DEM" })).toBe(test[1]);
    }
  });

  test("test_currency_gbp", () => {
    for (const test of TEST_CASES_TO_CURRENCY_GBP) {
      expect(num2words(test[0], { lang: "de", to: "currency", currency: "GBP" })).toBe(test[1]);
    }
  });

  test("test_year", () => {
    expect(num2words(2002, { to: "year", lang: "de" })).toBe("zweitausendzwei");
  });

  test("test_year_before_2000", () => {
    expect(num2words(1780, { to: "year", lang: "de" })).toBe("siebzehnhundertachtzig");
  });
});
