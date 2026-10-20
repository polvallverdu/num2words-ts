// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_fr_dz.py

import { describe, expect, test } from "bun:test";
import { num2words } from "../src/index.ts";

// from . import test_fr: the constants below are copied from tests/test_fr.py
// (importing test_fr.test.ts would register its tests here too).
const test_fr_TEST_CASES_CARDINAL = [
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
const test_fr_TEST_CASES_ORDINAL = [
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
const test_fr_TEST_CASES_ORDINAL_NUM = [
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

// biome-ignore lint/correctness/noUnusedVariables: unused upstream as well
const TEST_CASES_TO_CURRENCY = [
  [1n, "un dinard"],
  [2n, "deux dinards"],
  [8n, "huit dinards"],
  [12n, "douze dinards"],
  [21n, "vingt et un dinards"],
  [81.25, "quatre-vingt-un dinards et vingt-cinq centimes"],
  [100n, "cent dinards"],
] as const;

describe("Num2WordsPLTest", () => {
  test("test_currency", () => {
    expect(num2words(1234.12, { lang: "fr_DZ", to: "currency" })).toBe(
      "mille deux cent trente-quatre dinards et douze centimes",
    );
    expect(num2words(45689.89, { lang: "fr_DZ", to: "currency" })).toBe(
      "quarante-cinq mille six cent quatre-vingt-neuf dinards et " + "quatre-vingt-neuf centimes",
    );
  });

  test("test_number", () => {
    for (const t of test_fr_TEST_CASES_CARDINAL) {
      expect(num2words(t[0], { lang: "fr_DZ" })).toBe(t[1]);
    }
  });

  test("test_ordinal", () => {
    for (const t of test_fr_TEST_CASES_ORDINAL) {
      expect(num2words(t[0], { lang: "fr_DZ", ordinal: true })).toBe(t[1]);
    }
  });

  test("test_ordinal_num", () => {
    for (const t of test_fr_TEST_CASES_ORDINAL_NUM) {
      expect(num2words(t[0], { lang: "fr_DZ", to: "ordinal_num" })).toBe(t[1]);
    }
  });
});
