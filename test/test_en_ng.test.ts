// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_en_ng.py

import { describe, expect, test } from "bun:test";
import { num2words } from "../src/index.ts";

describe("Num2WordsENNGTest", () => {
  // only the test for currency is writen as other
  // functions in the Class remains the
  // same and have been properly tested in the
  // test test_en which tests the parent class
  // upon which this class inherits

  test("test_to_currency", () => {
    const language = "en_NG";
    const separator = " and";

    expect(num2words("38.4", { lang: language, to: "currency", separator, kobo: false })).toBe(
      "thirty-eight naira and 40 kobo",
    );
    expect(num2words("0", { lang: language, to: "currency", separator, kobo: false })).toBe(
      "zero naira and 00 kobo",
    );

    expect(num2words("1.01", { lang: language, to: "currency", separator, kobo: true })).toBe(
      "one naira and one kobo",
    );

    expect(
      num2words("4778.00", {
        lang: language,
        to: "currency",
        separator,
        kobo: true,
        adjective: true,
      }),
    ).toBe("four thousand, seven hundred and seventy-eight Nigerian naira" + " and zero kobo");

    expect(num2words("4778.00", { lang: language, to: "currency", separator, kobo: true })).toBe(
      "four thousand, seven hundred and seventy-eight naira and" + " zero kobo",
    );

    expect(num2words("1.1", { lang: language, to: "currency", separator, kobo: true })).toBe(
      "one naira and ten kobo",
    );

    expect(num2words("158.3", { lang: language, to: "currency", separator, kobo: true })).toBe(
      "one hundred and fifty-eight naira and thirty kobo",
    );

    expect(num2words("2000.00", { lang: language, to: "currency", separator, kobo: true })).toBe(
      "two thousand naira and zero kobo",
    );

    expect(num2words("4.01", { lang: language, to: "currency", separator, kobo: true })).toBe(
      "four naira and one kobo",
    );

    expect(num2words("2000.00", { lang: language, to: "currency", separator, kobo: true })).toBe(
      "two thousand naira and zero kobo",
    );
  });
});
