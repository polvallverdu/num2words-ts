// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_am.py

import { describe, expect, test } from "bun:test";
import { num2words, OverflowError } from "../src/index.ts";

describe("Num2WordsAMTest", () => {
  test("test_cardinal", () => {
    expect(num2words(100, { lang: "am" })).toBe("መቶ");
    expect(num2words(100000, { lang: "am" })).toBe("አንድ መቶ ሺህ");
    expect(num2words(101, { lang: "am" })).toBe("አንድ መቶ አንድ");
  });

  test("test_and_join_199", () => {
    expect(num2words(199, { lang: "am" })).toBe("አንድ መቶ ዘጠና ዘጠኝ");
  });

  test("test_to_ordinal", () => {
    expect(num2words(1, { lang: "am", to: "ordinal" })).toBe("አንደኛ");
    expect(num2words(13, { lang: "am", to: "ordinal" })).toBe("አሥራ ሦስተኛ");
    expect(num2words(22, { lang: "am", to: "ordinal" })).toBe("ሃያ ሁለተኛ");
    expect(num2words(10000, { lang: "am", to: "ordinal" })).toBe("አሥር ሺህኛ");
  });

  test("test_to_ordinal_num", () => {
    expect(num2words(10, { lang: "am", to: "ordinal_num" })).toBe("10ኛ");
    expect(num2words(21, { lang: "am", to: "ordinal_num" })).toBe("21ኛ");
    expect(num2words(102, { lang: "am", to: "ordinal_num" })).toBe("102ኛ");
  });

  test("test_cardinal_for_float_number", () => {
    expect(num2words(12.5, { lang: "am" })).toBe("አሥራ ሁለት ነጥብ አምስት");
    expect(num2words(12.51, { lang: "am" })).toBe("አሥራ ሁለት ነጥብ አምስት አንድ");
    expect(num2words(12.53, { lang: "am" })).toBe("አሥራ ሁለት ነጥብ አምስት ሦስት");
  });

  test("test_to_overflow", () => {
    expect(() =>
      num2words(
        "1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        { lang: "am" },
      ),
    ).toThrow(OverflowError);
  });

  test("test_to_currency", () => {
    expect(num2words("38.4", { lang: "am", to: "currency", cents: false, currency: "ETB" })).toBe(
      "ሠላሳ ስምንት ብር ከ 40 ሳንቲም",
    );
    expect(
      num2words("0", {
        lang: "am",
        to: "currency",
        separator: " እና",
        cents: true,
        currency: "ETB",
      }),
    ).toBe("ዜሮ ብር እና ዜሮ ሳንቲም");
    expect(num2words("1.50", { lang: "am", to: "currency", cents: true, currency: "ETB" })).toBe(
      "አንድ ብር ከ አምሳ ሳንቲም",
    );
  });

  test("test_to_year", () => {
    expect(num2words(1990, { lang: "am", to: "year" })).toBe("አሥራ ዘጠኝ መቶ ዘጠና");
    expect(num2words(5555, { lang: "am", to: "year" })).toBe("አምሳ አምስት መቶ አምሳ አምስት");
    expect(num2words(2017, { lang: "am", to: "year" })).toBe("ሁለት ሺህ አሥራ ሰባት");
    expect(num2words(1066, { lang: "am", to: "year" })).toBe("አንድ ሺህ ስድሳ ስድስት");
    expect(num2words(1865, { lang: "am", to: "year" })).toBe("አሥራ ስምንት መቶ ስድሳ አምስት");
  });
});
