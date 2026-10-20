// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_es_ve.py

import { expect } from "bun:test";
import { type Num2WordsInput, num2words } from "../src/index.ts";
import * as test_es from "./test_es_cases.ts";

const TEST_CASES_TO_CURRENCY: [Num2WordsInput, string][] = [
  [1, "un bolívar"],
  [2, "dos bolívares"],
  [8, "ocho bolívares"],
  [12, "doce bolívares"],
  [21, "veintiun bolívares"],
  [81.25, "ochenta y un bolívares y veinticinco centavos"],
  [100, "cien bolívares"],
];

// class Num2WordsESVETest(test_es.Num2WordsESTest)
test_es.runTestCase("Num2WordsESVETest", {
  ...test_es.Num2WordsESTest,
  test_number() {
    for (const test of test_es.TEST_CASES_CARDINAL) {
      expect(num2words(test[0], { lang: "es_VE" })).toBe(test[1]);
    }
  },
  test_ordinal() {
    for (const test of test_es.TEST_CASES_ORDINAL) {
      expect(num2words(test[0], { lang: "es_VE", ordinal: true })).toBe(test[1]);
    }
  },
  test_ordinal_num() {
    for (const test of test_es.TEST_CASES_ORDINAL_NUM) {
      expect(num2words(test[0], { lang: "es", to: "ordinal_num" })).toBe(test[1]);
    }
  },
  test_currency() {
    for (const test of TEST_CASES_TO_CURRENCY) {
      expect(num2words(test[0], { lang: "es_VE", to: "currency", old: true })).toBe(test[1]);
    }
  },
});
