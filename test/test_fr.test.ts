// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_fr.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words, OverflowError } from "../src/index.ts";

const TEST_CASES_CARDINAL = [
  [1n, "un"],
  [2n, "deux"],
  [3n, "trois"],
  [5.5, "cinq virgule cinq"],
  [11n, "onze"],
  [12n, "douze"],
  [16n, "seize"],
  [17.42, "dix-sept virgule quatre deux"],
  [19n, "dix-neuf"],
  [20n, "vingt"],
  [21n, "vingt et un"],
  [26n, "vingt-six"],
  [27.312, "vingt-sept virgule trois un deux"],
  [28n, "vingt-huit"],
  [30n, "trente"],
  [31n, "trente et un"],
  [40n, "quarante"],
  [44n, "quarante-quatre"],
  [50n, "cinquante"],
  [53.486, "cinquante-trois virgule quatre huit six"],
  [55n, "cinquante-cinq"],
  [60n, "soixante"],
  [67n, "soixante-sept"],
  [70n, "soixante-dix"],
  [79n, "soixante-dix-neuf"],
  [89n, "quatre-vingt-neuf"],
  [95n, "quatre-vingt-quinze"],
  [100n, "cent"],
  [101n, "cent un"],
  [199n, "cent quatre-vingt-dix-neuf"],
  [203n, "deux cent trois"],
  [287n, "deux cent quatre-vingt-sept"],
  [300.42, "trois cents virgule quatre deux"],
  [356n, "trois cent cinquante-six"],
  [400n, "quatre cents"],
  [434n, "quatre cent trente-quatre"],
  [578n, "cinq cent soixante-dix-huit"],
  [689n, "six cent quatre-vingt-neuf"],
  [729n, "sept cent vingt-neuf"],
  [894n, "huit cent quatre-vingt-quatorze"],
  [999n, "neuf cent quatre-vingt-dix-neuf"],
  [1000n, "mille"],
  [1001n, "mille un"],
  [1097n, "mille quatre-vingt-dix-sept"],
  [1104n, "mille cent quatre"],
  [1243n, "mille deux cent quarante-trois"],
  [2385n, "deux mille trois cent quatre-vingt-cinq"],
  [3766n, "trois mille sept cent soixante-six"],
  [4196n, "quatre mille cent quatre-vingt-seize"],
  [4196.42, "quatre mille cent quatre-vingt-seize virgule quatre deux"],
  [5846n, "cinq mille huit cent quarante-six"],
  [6459n, "six mille quatre cent cinquante-neuf"],
  [7232n, "sept mille deux cent trente-deux"],
  [8569n, "huit mille cinq cent soixante-neuf"],
  [9539n, "neuf mille cinq cent trente-neuf"],
  [1000000n, "un million"],
  [1000001n, "un million un"],
  [4000000n, "quatre millions"],
  [4000004n, "quatre millions quatre"],
  [4300000n, "quatre millions trois cent mille"],
  [80000000n, "quatre-vingts millions"],
  [300000000n, "trois cents millions"],
  [10000000000000n, "dix billions"],
  [10000000000010n, "dix billions dix"],
  [100000000000000n, "cent billions"],
  [1000000000000000000n, "un trillion"],
  [1000000000000000000000n, "un trilliard"],
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
  [1000000n, "un millionième"],
  [1000000000000000n, "un billiardième"],
  [1000000000000000000n, "un trillionième"],
] as const;

const TEST_CASES_ORDINAL_NUM = [
  [1n, "1er"],
  [8n, "8me"],
  [11n, "11me"],
  [12n, "12me"],
  [14n, "14me"],
  [21n, "21me"],
  [28n, "28me"],
  [100n, "100me"],
  [101n, "101me"],
  [1000n, "1000me"],
  [1000000n, "1000000me"],
] as const;

const TEST_CASES_TO_CURRENCY_EUR = [
  [asFloat(1.0), "un euro et zéro centimes"],
  [2.01, "deux euros et un centime"],
  [8.1, "huit euros et dix centimes"],
  [12.26, "douze euros et vingt-six centimes"],
  [21.29, "vingt et un euros et vingt-neuf centimes"],
  [81.25, "quatre-vingt-un euros et vingt-cinq centimes"],
  [asFloat(100.0), "cent euros et zéro centimes"],
] as const;

const TEST_CASES_TO_CURRENCY_FRF = [
  [asFloat(1.0), "un franc et zéro centimes"],
  [2.01, "deux francs et un centime"],
  [8.1, "huit francs et dix centimes"],
  [12.27, "douze francs et vingt-sept centimes"],
  [21.29, "vingt et un francs et vingt-neuf centimes"],
  [81.25, "quatre-vingt-un francs et vingt-cinq centimes"],
  [asFloat(100.0), "cent francs et zéro centimes"],
] as const;

const TEST_CASES_TO_CURRENCY_USD = [
  [asFloat(1.0), "un dollar et zéro cents"],
  [2.01, "deux dollars et un cent"],
  [8.1, "huit dollars et dix cents"],
  [12.26, "douze dollars et vingt-six cents"],
  [21.29, "vingt et un dollars et vingt-neuf cents"],
  [81.25, "quatre-vingt-un dollars et vingt-cinq cents"],
  [asFloat(100.0), "cent dollars et zéro cents"],
] as const;

describe("Num2WordsFRTest", () => {
  test("test_ordinal_special_joins", () => {
    // ref https://github.com/savoirfairelinux/num2words/issues/18
    expect(num2words(5, { ordinal: true, lang: "fr" })).toBe("cinquième");
    expect(num2words(35, { ordinal: true, lang: "fr" })).toBe("trente-cinquième");
    expect(num2words(9, { ordinal: true, lang: "fr" })).toBe("neuvième");
    expect(num2words(49, { ordinal: true, lang: "fr" })).toBe("quarante-neuvième");
  });

  test("test_number", () => {
    for (const t of TEST_CASES_CARDINAL) {
      expect(num2words(t[0], { lang: "fr" })).toBe(t[1]);
    }
  });

  test("test_ordinal", () => {
    for (const t of TEST_CASES_ORDINAL) {
      expect(num2words(t[0], { lang: "fr", ordinal: true })).toBe(t[1]);
    }
  });

  test("test_ordinal_num", () => {
    for (const t of TEST_CASES_ORDINAL_NUM) {
      expect(num2words(t[0], { lang: "fr", to: "ordinal_num" })).toBe(t[1]);
    }
  });

  test("test_currency_eur", () => {
    for (const t of TEST_CASES_TO_CURRENCY_EUR) {
      expect(num2words(t[0], { lang: "fr", to: "currency", currency: "EUR" })).toBe(t[1]);
    }
  });

  test("test_currency_frf", () => {
    for (const t of TEST_CASES_TO_CURRENCY_FRF) {
      expect(num2words(t[0], { lang: "fr", to: "currency", currency: "FRF" })).toBe(t[1]);
    }
  });

  test("test_currency_usd", () => {
    for (const t of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(t[0], { lang: "fr", to: "currency", currency: "USD" })).toBe(t[1]);
    }
  });

  test("test_max_numbers", () => {
    let error: unknown;
    try {
      num2words(10n ** 700n, { lang: "fr" });
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(OverflowError);
    expect(String((error as Error).message).includes("trop grand")).toBe(true);
  });
});
