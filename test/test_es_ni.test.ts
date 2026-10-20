// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_es_ni.py

import { expect } from "bun:test";
import { asFloat, type Num2WordsInput, num2words } from "../src/index.ts";
import * as test_es from "./test_es_cases.ts";

const TEST_NIO: [Num2WordsInput, string][] = [
  [asFloat(1), "un córdoba con cero centavos"],
  [asFloat(2), "dos córdobas con cero centavos"],
  [asFloat(8), "ocho córdobas con cero centavos"],
  [asFloat(12), "doce córdobas con cero centavos"],
  [asFloat(21), "veintiun córdobas con cero centavos"],
  [81.25, "ochenta y un córdobas con veinticinco centavos"],
  [asFloat(100), "cien córdobas con cero centavos"],
];

// class Num2WordsESNITest(test_es.Num2WordsESTest)
test_es.runTestCase("Num2WordsESNITest", {
  ...test_es.Num2WordsESTest,
  test_currency() {
    for (const test of TEST_NIO) {
      expect(num2words(test[0], { lang: "es_NI", to: "currency" })).toBe(test[1]);
    }
  },
});
