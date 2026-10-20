// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_fr_be.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words } from "../src/index.ts";

const TEST_CASES_CARDINAL = [
  [70n, "septante"],
  [79n, "septante-neuf"],
  [89n, "quatre-vingt-neuf"],
  [95n, "nonante-cinq"],
  [729n, "sept cents vingt-neuf"],
  [894n, "huit cents nonante-quatre"],
  [999n, "neuf cents nonante-neuf"],
  [7232n, "sept mille deux cents trente-deux"],
  [8569n, "huit mille cinq cents soixante-neuf"],
  [9539n, "neuf mille cinq cents trente-neuf"],
  [1000000n, "un millions"],
  [1000001n, "un millions un"],
  [4000000n, "quatre millions"],
  [10000000000000n, "dix billions"],
  [100000000000000n, "cent billions"],
  [1000000000000000000n, "un trillions"],
  [1000000000000000000000n, "un trilliards"],
  [10000000000000000000000000n, "dix quadrillions"],
] as const;

const TEST_CASES_ORDINAL = [
  [1n, "premier"],
  [8n, "huitième"],
  [12n, "douzième"],
  [14n, "quatorzième"],
  [28n, "vingt-huitième"],
  [100n, "centième"],
  [1000n, "millième"],
  [1000000n, "un millionsième"],
  [1000000000000000n, "un billiardsième"],
  [1000000000000000000n, "un trillionsième"],
] as const;

const TEST_CASES_TO_CURRENCY_EUR = [
  [asFloat(1.0), "un euro et zéro centimes"],
  [2.01, "deux euros et un centime"],
  [8.1, "huit euros et dix centimes"],
  [12.26, "douze euros et vingt-six centimes"],
  [21.29, "vingt et un euros et vingt-neuf centimes"],
  [81.25, "quatre-vingt et un euros et vingt-cinq centimes"],
  [asFloat(100.0), "cent euros et zéro centimes"],
] as const;

const TEST_CASES_TO_CURRENCY_FRF = [
  [asFloat(1.0), "un franc et zéro centimes"],
  [2.01, "deux francs et un centime"],
  [8.1, "huit francs et dix centimes"],
  [12.27, "douze francs et vingt-sept centimes"],
  [21.29, "vingt et un francs et vingt-neuf centimes"],
  [81.25, "quatre-vingt et un francs et vingt-cinq centimes"],
  [asFloat(100.0), "cent francs et zéro centimes"],
] as const;

// Lang to execute current test
const LANG = "fr_BE";

describe("Num2WordsENTest", () => {
  test("test_ordinal_special_joins", () => {
    expect(num2words(5, { ordinal: true, lang: LANG })).toBe("cinquième");
    expect(num2words(6, { ordinal: true, lang: LANG })).toBe("sixième");
    expect(num2words(35, { ordinal: true, lang: LANG })).toBe("trente-cinquième");
    expect(num2words(9, { ordinal: true, lang: LANG })).toBe("neuvième");
    expect(num2words(49, { ordinal: true, lang: LANG })).toBe("quarante-neuvième");
    expect(num2words(71, { lang: LANG })).toBe("septante et un");
    expect(num2words(81, { lang: LANG })).toBe("quatre-vingt et un");
    expect(num2words(80, { lang: LANG })).toBe("quatre-vingt");
    expect(num2words(880, { lang: LANG })).toBe("huit cents quatre-vingt");
    expect(num2words(91, { ordinal: true, lang: LANG })).toBe("nonante et unième");
    expect(num2words(53, { lang: LANG })).toBe("cinquante-trois");
  });

  test("test_number", () => {
    for (const t of TEST_CASES_CARDINAL) {
      expect(num2words(t[0], { lang: LANG })).toBe(t[1]);
    }
  });

  test("test_ordinal", () => {
    for (const t of TEST_CASES_ORDINAL) {
      expect(num2words(t[0], { lang: LANG, ordinal: true })).toBe(t[1]);
    }
  });

  test("test_currency_eur", () => {
    for (const t of TEST_CASES_TO_CURRENCY_EUR) {
      expect(num2words(t[0], { lang: LANG, to: "currency" })).toBe(t[1]);
    }
  });

  test("test_currency_frf", () => {
    for (const t of TEST_CASES_TO_CURRENCY_FRF) {
      expect(num2words(t[0], { lang: LANG, to: "currency", currency: "FRF" })).toBe(t[1]);
    }
  });
});
