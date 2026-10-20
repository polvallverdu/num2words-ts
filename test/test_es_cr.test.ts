// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2024, Randall Castro.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_es_cr.py

import { expect } from "bun:test";
import { type Num2WordsInput, num2words } from "../src/index.ts";
import * as test_es from "./test_es_cases.ts";

const TEST_CASES_TO_CURRENCY: [Num2WordsInput, string][] = [
  [1, "un colón"],
  [2, "dos colónes"],
  [8, "ocho colónes"],
  [12, "doce colónes"],
  [21, "veintiun colónes"],
  [81.25, "ochenta y un colónes y veinticinco céntimos"],
  [100, "cien colónes"],
];

// class Num2WordsESCOTest(test_es.Num2WordsESTest)
test_es.runTestCase("Num2WordsESCOTest", {
  ...test_es.Num2WordsESTest,
  test_number() {
    for (const test of test_es.TEST_CASES_CARDINAL) {
      expect(num2words(test[0], { lang: "es_CR" })).toBe(test[1]);
    }
  },
  test_ordinal() {
    for (const test of test_es.TEST_CASES_ORDINAL) {
      expect(num2words(test[0], { lang: "es_CR", ordinal: true })).toBe(test[1]);
    }
  },
  test_ordinal_num() {
    for (const test of test_es.TEST_CASES_ORDINAL_NUM) {
      expect(num2words(test[0], { lang: "es", to: "ordinal_num" })).toBe(test[1]);
    }
  },
  test_currency() {
    for (const test of TEST_CASES_TO_CURRENCY) {
      expect(num2words(test[0], { lang: "es_CR", to: "currency" })).toBe(test[1]);
    }
  },
});
