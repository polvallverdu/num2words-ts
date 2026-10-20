// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_ca.py

import { describe, expect, test } from "bun:test";
import { asFloat, type Num2WordsInput, num2words } from "../src/index.ts";

const TEST_CASES_CARDINAL = [
  [1n, "un"],
  [2n, "dos"],
  [3n, "tres"],
  [5.5, "cinc punt cinc"],
  [11n, "onze"],
  [12n, "dotze"],
  [16n, "setze"],
  [17.42, "disset punt quatre dos"],
  [19n, "dinou"],
  [20n, "vint"],
  [21n, "vint-i-un"],
  [26n, "vint-i-sis"],
  [27.312, "vint-i-set punt tres un dos"],
  [28n, "vint-i-vuit"],
  [30n, "trenta"],
  [31n, "trenta-un"],
  [40n, "quaranta"],
  [44n, "quaranta-quatre"],
  [50n, "cinquanta"],
  [53.486, "cinquanta-tres punt quatre vuit sis"],
  [55n, "cinquanta-cinc"],
  [60n, "seixanta"],
  [67n, "seixanta-set"],
  [70n, "setanta"],
  [79n, "setanta-nou"],
  [89n, "vuitanta-nou"],
  [95n, "noranta-cinc"],
  [100n, "cent"],
  [101n, "cent un"],
  [199n, "cent noranta-nou"],
  [203n, "dos-cents tres"],
  [287n, "dos-cents vuitanta-set"],
  [300.42, "tres-cents punt quatre dos"],
  [356n, "tres-cents cinquanta-sis"],
  [400n, "quatre-cents"],
  [434n, "quatre-cents trenta-quatre"],
  [555n, "cinc-cents cinquanta-cinc"],
  [578n, "cinc-cents setanta-vuit"],
  [666n, "sis-cents seixanta-sis"],
  [689n, "sis-cents vuitanta-nou"],
  [729n, "set-cents vint-i-nou"],
  [777n, "set-cents setanta-set"],
  [888n, "vuit-cents vuitanta-vuit"],
  [894n, "vuit-cents noranta-quatre"],
  [999n, "nou-cents noranta-nou"],
  [1000n, "mil"],
  [1001n, "mil un"],
  [1097n, "mil noranta-set"],
  [1104n, "mil cent quatre"],
  [1243n, "mil dos-cents quaranta-tres"],
  [2385n, "dos mil tres-cents vuitanta-cinc"],
  [3766n, "tres mil set-cents seixanta-sis"],
  [4196n, "quatre mil cent noranta-sis"],
  [4196.42, "quatre mil cent noranta-sis punt quatre dos"],
  [5846n, "cinc mil vuit-cents quaranta-sis"],
  [6459n, "sis mil quatre-cents cinquanta-nou"],
  [7232n, "set mil dos-cents trenta-dos"],
  [8569n, "vuit mil cinc-cents seixanta-nou"],
  [9539n, "nou mil cinc-cents trenta-nou"],
  [1000000n, "un milió"],
  [1000001n, "un milió un"],
  [4000000n, "quatre milions"],
  [10000000000000n, "deu bilions"],
  [100000000000000n, "cent bilions"],
  [1000000000000000000n, "un trilió"],
  [1000000000000000000000n, "mil trilions"],
  [10000000000000000000000000n, "deu quadrilions"],
] as const;

const TEST_CASES_ORDINAL = [
  [1n, "primer"],
  [2n, "segon"],
  [8n, "vuitè"],
  [12n, "dotzè"],
  [14n, "catorzè"],
  [28n, "vint-i-vuitè"],
  [33n, "trenta-tresè"],
  [88n, "vuitanta-vuitè"],
  [100n, "centè"],
  [128n, "cent vint-i-vuitè"],
  [199n, "cent noranta-novè"],
  [1000n, "milè"],
  [1827n, "mil vuit-cents vint-i-setè"],
  [12345n, "dotze mil tres-cents quaranta-cinquè"],
  [1000000n, "milionè"],
  [1000000000000000n, "mil bilionè"],
  [1000000000000000n, "mil bilionè"],
  [1000000000000000000n, "un trilionè"],
] as const;

const TEST_CASES_ORDINAL_NUM = [
  [1n, "1r"],
  [8n, "8è"],
  [12n, "12è"],
  [14n, "14è"],
  [28n, "28è"],
  [100n, "100è"],
  [1000n, "1000è"],
  [1000000n, "1000000è"],
] as const;

const TEST_CASES_TO_CURRENCY = [
  [asFloat(1), "un euro amb zero cèntims"],
  [1.01, "un euro amb un cèntim"],
  [asFloat(2), "dos euros amb zero cèntims"],
  [asFloat(8), "vuit euros amb zero cèntims"],
  [asFloat(12), "dotze euros amb zero cèntims"],
  [asFloat(21), "vint-i-un euros amb zero cèntims"],
  [81.25, "vuitanta-un euros amb vint-i-cinc cèntims"],
  [350.9, "tres-cents cinquanta euros amb noranta cèntims"],
  [asFloat(100), "cent euros amb zero cèntims"],
] as const;

const TEST_CASES_TO_CURRENCY_ESP = [
  [asFloat(1), "una pesseta amb zero cèntims"],
  [1.01, "una pesseta amb un cèntim"],
  [asFloat(2), "dues pessetes amb zero cèntims"],
  [asFloat(8), "vuit pessetes amb zero cèntims"],
  [asFloat(12), "dotze pessetes amb zero cèntims"],
  [asFloat(21), "vint-i-una pessetes amb zero cèntims"],
  [81.25, "vuitanta-una pessetes amb vint-i-cinc cèntims"],
  [350.9, "tres-centes cinquanta pessetes amb noranta cèntims"],
  [asFloat(100), "cent pessetes amb zero cèntims"],
] as const;

const TEST_CASES_TO_CURRENCY_USD = [
  [asFloat(1), "un dòlar amb zero centaus"],
  [asFloat(2), "dos dòlars amb zero centaus"],
  [asFloat(8), "vuit dòlars amb zero centaus"],
  [asFloat(12), "dotze dòlars amb zero centaus"],
  [asFloat(21), "vint-i-un dòlars amb zero centaus"],
  [81.25, "vuitanta-un dòlars amb vint-i-cinc centaus"],
  [350.9, "tres-cents cinquanta dòlars amb noranta centaus"],
  [asFloat(100), "cent dòlars amb zero centaus"],
] as const;

const TEST_CASES_TO_CURRENCY_GBP = [
  [asFloat(1), "una lliura amb zero penics"],
  [1.01, "una lliura amb un penic"],
  [asFloat(2), "dues lliures amb zero penics"],
  [asFloat(8), "vuit lliures amb zero penics"],
  [asFloat(12), "dotze lliures amb zero penics"],
  [asFloat(21), "vint-i-una lliures amb zero penics"],
  [81.25, "vuitanta-una lliures amb vint-i-cinc penics"],
  [350.9, "tres-centes cinquanta lliures amb noranta penics"],
  [asFloat(100), "cent lliures amb zero penics"],
] as const;

describe("TestNum2WordsCA", () => {
  function _testCases(
    cases: readonly (readonly [Num2WordsInput, string])[],
    lang = "ca",
    to = "cardinal",
    kwargs: Record<string, unknown> = {},
  ) {
    for (const [value, expected] of cases) {
      expect(num2words(value, { lang, to: to as never, ...kwargs })).toBe(expected);
    }
  }

  test("test_cardinal", () => {
    _testCases(TEST_CASES_CARDINAL);
  });

  test("test_ordinal", () => {
    _testCases(TEST_CASES_ORDINAL, "ca", "ordinal");
  });

  test("test_ordinal_num", () => {
    _testCases(TEST_CASES_ORDINAL_NUM, "ca", "ordinal_num");
  });

  test("test_currency", () => {
    _testCases(TEST_CASES_TO_CURRENCY, "ca", "currency", { currency: "EUR" });
  });

  test("test_currency_esp", () => {
    _testCases(TEST_CASES_TO_CURRENCY_ESP, "ca", "currency", { currency: "ESP" });
  });

  test("test_currency_usd", () => {
    _testCases(TEST_CASES_TO_CURRENCY_USD, "ca", "currency", { currency: "USD" });
  });

  test("test_currency_gbp", () => {
    _testCases(TEST_CASES_TO_CURRENCY_GBP, "ca", "currency", { currency: "GBP" });
  });
});
