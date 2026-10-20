// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_az.py

import { describe, expect, test } from "bun:test";
import { asFloat, type Num2WordsInput, num2words } from "../src/index.ts";

const lang = "az";

const CARDINAL_TEST_CASES: [Num2WordsInput, string][] = [
  [0, "sıfır"],
  [1, "bir"],
  [2, "iki"],
  [3, "üç"],
  [4, "dörd"],
  [5, "beş"],
  [6, "altı"],
  [7, "yeddi"],
  [8, "səkkiz"],
  [9, "doqquz"],
  [10, "on"],
  [11, "on bir"],
  [20, "iyirmi"],
  [22, "iyirmi iki"],
  [30, "otuz"],
  [33, "otuz üç"],
  [40, "qırx"],
  [44, "qırx dörd"],
  [50, "əlli"],
  [55, "əlli beş"],
  [60, "altmış"],
  [66, "altmış altı"],
  [70, "yetmiş"],
  [77, "yetmiş yeddi"],
  [80, "səksən"],
  [88, "səksən səkkiz"],
  [90, "doxsan"],
  [99, "doxsan doqquz"],
  [100, "yüz"],
  [200, "iki yüz"],
  [678, "altı yüz yetmiş səkkiz"],
  [999, "doqquz yüz doxsan doqquz"],
  [1000, "min"],
  [100000, "yüz min"],
  [328914, "üç yüz iyirmi səkkiz min doqquz yüz on dörd"],
  [1000000, "bir milyon"],
  [1000000000, "bir milyard"],
  [1000000000000, "bir trilyon"],
  [1000000000000000, "bir katrilyon"],
  [1000000000000000000n, "bir kentilyon"],
  [1000000000000000000000n, "bir sekstilyon"],
  [1000000000000000000000000n, "bir septilyon"],
  [1000000000000000000000000000n, "bir oktilyon"],
  [1000000000000000000000000000000n, "bir nonilyon"],
  [1000000000000000000000000000000000n, "bir desilyon"],
  [1000000000000000000000000000000000000n, "bir undesilyon"],
  [1000000000000000000000000000000000000000n, "bir dodesilyon"],
  [1000000000000000000000000000000000000000000n, "bir tredesilyon"],
  [1000000000000000000000000000000000000000000000n, "bir katordesilyon"],
  [1000000000000000000000000000000000000000000000000n, "bir kendesilyon"],
  [1000000000000000000000000000000000000000000000000000n, "bir seksdesilyon"],
  [1000000000000000000000000000000000000000000000000000000n, "bir septendesilyon"],
  [1000000000000000000000000000000000000000000000000000000000n, "bir oktodesilyon"],
  [1000000000000000000000000000000000000000000000000000000000000n, "bir novemdesilyon"],
  [1000000000000000000000000000000000000000000000000000000000000000n, "bir vigintilyon"],
  [0, "sıfır"],
  [-1, "mənfi bir"],
  [-2, "mənfi iki"],
  [-3, "mənfi üç"],
  [-4, "mənfi dörd"],
  [-5, "mənfi beş"],
  [-6, "mənfi altı"],
  [-7, "mənfi yeddi"],
  [-8, "mənfi səkkiz"],
  [-9, "mənfi doqquz"],
  [-10, "mənfi on"],
  [-11, "mənfi on bir"],
  [-20, "mənfi iyirmi"],
  [-22, "mənfi iyirmi iki"],
  [-30, "mənfi otuz"],
  [-33, "mənfi otuz üç"],
  [-40, "mənfi qırx"],
  [-44, "mənfi qırx dörd"],
  [-50, "mənfi əlli"],
  [-55, "mənfi əlli beş"],
  [-60, "mənfi altmış"],
  [-66, "mənfi altmış altı"],
  [-70, "mənfi yetmiş"],
  [-77, "mənfi yetmiş yeddi"],
  [-80, "mənfi səksən"],
  [-88, "mənfi səksən səkkiz"],
  [-90, "mənfi doxsan"],
  [-99, "mənfi doxsan doqquz"],
  [-100, "mənfi yüz"],
  [-200, "mənfi iki yüz"],
  [-678, "mənfi altı yüz yetmiş səkkiz"],
  [-999, "mənfi doqquz yüz doxsan doqquz"],
  [-1000, "mənfi min"],
  [-100000, "mənfi yüz min"],
  [-328914, "mənfi üç yüz iyirmi səkkiz min doqquz yüz on dörd"],
  [-1000000, "mənfi bir milyon"],
  [-1000000000, "mənfi bir milyard"],
  [-1000000000000, "mənfi bir trilyon"],
  [-1000000000000000, "mənfi bir katrilyon"],
  [-1000000000000000000n, "mənfi bir kentilyon"],
  [-1000000000000000000000n, "mənfi bir sekstilyon"],
  [-1000000000000000000000000n, "mənfi bir septilyon"],
  [-1000000000000000000000000000n, "mənfi bir oktilyon"],
  [-1000000000000000000000000000000n, "mənfi bir nonilyon"],
  [-1000000000000000000000000000000000n, "mənfi bir desilyon"],
  [-1000000000000000000000000000000000000n, "mənfi bir undesilyon"],
  [-1000000000000000000000000000000000000000n, "mənfi bir dodesilyon"],
  [-1000000000000000000000000000000000000000000n, "mənfi bir tredesilyon"],
  [-1000000000000000000000000000000000000000000000n, "mənfi bir katordesilyon"],
  [-1000000000000000000000000000000000000000000000000n, "mənfi bir kendesilyon"],
  [-1000000000000000000000000000000000000000000000000000n, "mənfi bir seksdesilyon"],
  [-1000000000000000000000000000000000000000000000000000000n, "mənfi bir septendesilyon"],
  [-1000000000000000000000000000000000000000000000000000000000n, "mənfi bir oktodesilyon"],
  [-1000000000000000000000000000000000000000000000000000000000000n, "mənfi bir novemdesilyon"],
  [-1000000000000000000000000000000000000000000000000000000000000000n, "mənfi bir vigintilyon"],
];

const CARDINAL_FRACTION_TEST_CASES: [Num2WordsInput, string][] = [
  [0.2, "sıfır nöqtə iki"],
  [0.02, "sıfır nöqtə sıfır iki"],
  [0.23, "sıfır nöqtə iyirmi üç"],
  [0.0023, "sıfır nöqtə sıfır sıfır iyirmi üç"],
  [1.43, "bir nöqtə qırx üç"],
  [-0.2, "mənfi sıfır nöqtə iki"],
  [-0.02, "mənfi sıfır nöqtə sıfır iki"],
  [-0.23, "mənfi sıfır nöqtə iyirmi üç"],
  [-0.0023, "mənfi sıfır nöqtə sıfır sıfır iyirmi üç"],
  [-1.43, "mənfi bir nöqtə qırx üç"],
];

const ORDINAL_TEST_CASES: [Num2WordsInput, string][] = [
  [0, "sıfırıncı"],
  [1, "birinci"],
  [2, "ikinci"],
  [3, "üçüncü"],
  [4, "dördüncü"],
  [5, "beşinci"],
  [6, "altıncı"],
  [7, "yeddinci"],
  [8, "səkkizinci"],
  [9, "doqquzuncu"],
  [10, "onuncu"],
  [11, "on birinci"],
  [20, "iyirminci"],
  [22, "iyirmi ikinci"],
  [30, "otuzuncu"],
  [33, "otuz üçüncü"],
  [40, "qırxıncı"],
  [44, "qırx dördüncü"],
  [50, "əllinci"],
  [55, "əlli beşinci"],
  [60, "altmışıncı"],
  [66, "altmış altıncı"],
  [70, "yetmişinci"],
  [77, "yetmiş yeddinci"],
  [80, "səksəninci"],
  [88, "səksən səkkizinci"],
  [90, "doxsanıncı"],
  [99, "doxsan doqquzuncu"],
  [100, "yüzüncü"],
  [1000, "mininci"],
  [328914, "üç yüz iyirmi səkkiz min doqquz yüz on dördüncü"],
  [1000000, "bir milyonuncu"],
];

const ORDINAL_NUM_TEST_CASES: [Num2WordsInput, string][] = [
  [0, "0-cı"],
  [1, "1-ci"],
  [2, "2-ci"],
  [3, "3-cü"],
  [4, "4-cü"],
  [5, "5-ci"],
  [6, "6-cı"],
  [7, "7-ci"],
  [8, "8-ci"],
  [9, "9-cu"],
  [10, "10-cu"],
  [11, "11-ci"],
  [20, "20-ci"],
  [22, "22-ci"],
  [30, "30-cu"],
  [33, "33-cü"],
  [40, "40-cı"],
  [44, "44-cü"],
  [50, "50-ci"],
  [55, "55-ci"],
  [60, "60-cı"],
  [66, "66-cı"],
  [70, "70-ci"],
  [77, "77-ci"],
  [80, "80-ci"],
  [88, "88-ci"],
  [90, "90-cı"],
  [99, "99-cu"],
  [100, "100-cü"],
  [1000, "1000-ci"],
  [328914, "328914-cü"],
  [1000000, "1000000-cu"],
];

const YEAR_TEST_CASES: [Num2WordsInput, string][] = [
  [167, "yüz altmış yeddi"],
  [1552, "min beş yüz əlli iki"],
  [1881, "min səkkiz yüz səksən bir"],
  [2022, "iki min iyirmi iki"],
  [-1, "e.ə. bir"],
  [-500, "e.ə. beş yüz"],
  [-5000, "e.ə. beş min"],
];

const CURRENCY_TEST_CASES: [Num2WordsInput, string][] = [
  [asFloat(0), "sıfır manat, sıfır qəpik"],
  [0.01, "sıfır manat, bir qəpik"],
  [0.1, "sıfır manat, on qəpik"],
  [1.5, "bir manat, əlli qəpik"],
  [1.94, "bir manat, doxsan dörd qəpik"],
  [17.82, "on yeddi manat, səksən iki qəpik"],
];

describe("Num2WordAZTest", () => {
  test("test_cardinal", () => {
    // Test cardinal conversion for integer numbers.
    for (const [number, expected] of CARDINAL_TEST_CASES) {
      const actual = num2words(number, { lang, to: "cardinal" });
      expect(actual).toBe(expected);
    }
  });

  test("test_cardinal_fracion", () => {
    // Test cardinal conversion for numbers with fraction.
    for (const [number, expected] of CARDINAL_FRACTION_TEST_CASES) {
      const actual = num2words(number, { lang, to: "cardinal" });
      expect(actual).toBe(expected);
    }
  });

  test("test_ordinal", () => {
    // Test ordinal conversion.
    for (const [number, expected] of ORDINAL_TEST_CASES) {
      const actual = num2words(number, { lang, to: "ordinal" });
      expect(actual).toBe(expected);
    }
  });

  test("test_ordinal_num", () => {
    // Test 'ordinal_num' conversion.
    for (const [number, expected] of ORDINAL_NUM_TEST_CASES) {
      const actual = num2words(number, { lang, to: "ordinal_num" });
      expect(actual).toBe(expected);
    }
  });

  test("test_year", () => {
    // Test year conversion.
    for (const [number, expected] of YEAR_TEST_CASES) {
      const actual = num2words(number, { lang, to: "year" });
      expect(actual).toBe(expected);
    }
  });

  test("test_currency", () => {
    // Test currency conversion.
    for (const [number, expected] of CURRENCY_TEST_CASES) {
      const actual = num2words(number, { lang, currency: "AZN", to: "currency" });
      expect(actual).toBe(expected);
    }
  });
});
