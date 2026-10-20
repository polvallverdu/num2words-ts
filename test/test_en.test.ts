// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_en.py

import { describe, expect, test } from "bun:test";
import { num2words, OverflowError } from "../src/index.ts";

describe("Num2WordsENTest", () => {
  test("test_and_join_199", () => {
    // ref https://github.com/savoirfairelinux/num2words/issues/8
    expect(num2words(199)).toBe("one hundred and ninety-nine");
  });

  test("test_ordinal", () => {
    expect(num2words(0, { lang: "en", to: "ordinal" })).toBe("zeroth");
    expect(num2words(1, { lang: "en", to: "ordinal" })).toBe("first");
    expect(num2words(13, { lang: "en", to: "ordinal" })).toBe("thirteenth");
    expect(num2words(22, { lang: "en", to: "ordinal" })).toBe("twenty-second");
    expect(num2words(12, { lang: "en", to: "ordinal" })).toBe("twelfth");
    expect(num2words(130, { lang: "en", to: "ordinal" })).toBe("one hundred and thirtieth");
    expect(num2words(1003, { lang: "en", to: "ordinal" })).toBe("one thousand and third");
  });

  test("test_ordinal_num", () => {
    expect(num2words(10, { lang: "en", to: "ordinal_num" })).toBe("10th");
    expect(num2words(21, { lang: "en", to: "ordinal_num" })).toBe("21st");
    expect(num2words(102, { lang: "en", to: "ordinal_num" })).toBe("102nd");
    expect(num2words(73, { lang: "en", to: "ordinal_num" })).toBe("73rd");
  });

  test("test_cardinal_for_float_number", () => {
    // issue 24
    expect(num2words(12.5)).toBe("twelve point five");
    expect(num2words(12.51)).toBe("twelve point five one");
    expect(num2words(12.53)).toBe("twelve point five three");
    expect(num2words(12.59)).toBe("twelve point five nine");
  });

  test("test_overflow", () => {
    expect(() =>
      num2words(
        "1000000000000000000000000000000000000000000000000000000" +
          "0000000000000000000000000000000000000000000000000000000" +
          "0000000000000000000000000000000000000000000000000000000" +
          "0000000000000000000000000000000000000000000000000000000" +
          "0000000000000000000000000000000000000000000000000000000" +
          "00000000000000000000000000000000",
      ),
    ).toThrow(OverflowError);
  });

  test("test_to_currency", () => {
    expect(
      num2words("38.4", {
        lang: "en",
        to: "currency",
        separator: " and",
        cents: false,
        currency: "USD",
      }),
    ).toBe("thirty-eight dollars and 40 cents");
    expect(
      num2words("0", {
        lang: "en",
        to: "currency",
        separator: " and",
        cents: false,
        currency: "USD",
      }),
    ).toBe("zero dollars and 00 cents");

    expect(
      num2words("1.01", {
        lang: "en",
        to: "currency",
        separator: " and",
        cents: true,
        currency: "USD",
      }),
    ).toBe("one dollar and one cent");

    expect(
      num2words("4778.00", {
        lang: "en",
        to: "currency",
        separator: " and",
        cents: true,
        currency: "USD",
        adjective: true,
      }),
    ).toBe("four thousand, seven hundred and seventy-eight US dollars" + " and zero cents");

    expect(
      num2words("4778.00", {
        lang: "en",
        to: "currency",
        separator: " and",
        cents: true,
        currency: "USD",
      }),
    ).toBe("four thousand, seven hundred and seventy-eight dollars and" + " zero cents");

    expect(
      num2words("1.1", {
        lang: "en",
        to: "currency",
        separator: " and",
        cents: true,
        currency: "MXN",
      }),
    ).toBe("one peso and ten cents");

    expect(
      num2words("158.3", {
        lang: "en",
        to: "currency",
        separator: " and",
        cents: true,
        currency: "MXN",
      }),
    ).toBe("one hundred and fifty-eight pesos and thirty cents");

    expect(
      num2words("2000.00", {
        lang: "en",
        to: "currency",
        separator: " and",
        cents: true,
        currency: "MXN",
      }),
    ).toBe("two thousand pesos and zero cents");

    expect(
      num2words("4.01", {
        lang: "en",
        to: "currency",
        separator: " and",
        cents: true,
        currency: "MXN",
      }),
    ).toBe("four pesos and one cent");

    expect(
      num2words("2000.00", {
        lang: "en",
        to: "currency",
        separator: " and",
        cents: true,
        currency: "UZS",
      }),
    ).toBe("two thousand sums and zero tiyins");
  });

  test("test_to_year", () => {
    // issue 141
    // "e2 e2"
    expect(num2words(1990, { lang: "en", to: "year" })).toBe("nineteen ninety");
    expect(num2words(5555, { lang: "en", to: "year" })).toBe("fifty-five fifty-five");
    expect(num2words(2017, { lang: "en", to: "year" })).toBe("twenty seventeen");
    expect(num2words(1066, { lang: "en", to: "year" })).toBe("ten sixty-six");
    expect(num2words(1865, { lang: "en", to: "year" })).toBe("eighteen sixty-five");
    // "e3 and e1"; "e2 oh-e1"; "e3"
    expect(num2words(3000, { lang: "en", to: "year" })).toBe("three thousand");
    expect(num2words(2001, { lang: "en", to: "year" })).toBe("two thousand and one");
    expect(num2words(1901, { lang: "en", to: "year" })).toBe("nineteen oh-one");
    expect(num2words(2000, { lang: "en", to: "year" })).toBe("two thousand");
    expect(num2words(905, { lang: "en", to: "year" })).toBe("nine oh-five");
    // "e2 hundred"; "e3"
    expect(num2words(6600, { lang: "en", to: "year" })).toBe("sixty-six hundred");
    expect(num2words(1900, { lang: "en", to: "year" })).toBe("nineteen hundred");
    expect(num2words(600, { lang: "en", to: "year" })).toBe("six hundred");
    expect(num2words(50, { lang: "en", to: "year" })).toBe("fifty");
    expect(num2words(0, { lang: "en", to: "year" })).toBe("zero");
    // suffixes
    expect(num2words(-44, { lang: "en", to: "year" })).toBe("forty-four BC");
    expect(num2words(-44, { lang: "en", to: "year", suffix: "BCE" })).toBe("forty-four BCE");
    expect(num2words(1, { lang: "en", to: "year", suffix: "AD" })).toBe("one AD");
    expect(num2words(66, { lang: "en", to: "year", suffix: "m.y.a." })).toBe("sixty-six m.y.a.");
    expect(num2words(-66000000, { lang: "en", to: "year" })).toBe("sixty-six million BC");
  });
});
