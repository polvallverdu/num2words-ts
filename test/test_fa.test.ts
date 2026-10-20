// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2020, Hamidreza Kalbasi.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_fa.py

import { describe, expect, test } from "bun:test";
import { num2words, OverflowError } from "../src/index.ts";

describe("Num2WordsFATest", () => {
  test("test_and_join_199", () => {
    expect(num2words(199, { lang: "fa" })).toBe("صد و نود و نه");
  });

  test("test_ordinal", () => {
    expect(num2words(0, { lang: "fa", to: "ordinal" })).toBe("صفرم");
    expect(num2words(1, { lang: "fa", to: "ordinal" })).toBe("یکم");
    expect(num2words(13, { lang: "fa", to: "ordinal" })).toBe("سیزدهم");
    expect(num2words(23, { lang: "fa", to: "ordinal" })).toBe("بیست و سوم");
    expect(num2words(12, { lang: "fa", to: "ordinal" })).toBe("دوازدهم");
    expect(num2words(113, { lang: "fa", to: "ordinal" })).toBe("صد و سیزدهم");
    expect(num2words(103, { lang: "fa", to: "ordinal" })).toBe("صد و سوم");
  });

  test("test_cardinal", () => {
    expect(num2words(130000, { lang: "fa" })).toBe("صد و سی هزار");
    expect(num2words(242, { lang: "fa" })).toBe("دویست و چهل و دو");
    expect(num2words(800, { lang: "fa" })).toBe("هشتصد");
    expect(num2words(-203, { lang: "fa" })).toBe("منفی دویست و سه");
    expect(num2words(1234567890, { lang: "fa" })).toBe(
      "یک میلیارد و دویست و سی و چهار میلیون و پانصد و شصت و هفت هزار و هشتصد و نود",
    );
  });

  test("test_year", () => {
    expect(num2words(1398, { lang: "fa", to: "year" })).toBe("هزار و سیصد و نود و هشت");
    expect(num2words(1399, { lang: "fa", to: "year" })).toBe("هزار و سیصد و نود و نه");
    expect(num2words(1400, { lang: "fa", to: "year" })).toBe("هزار و چهارصد");
  });

  test("test_currency", () => {
    expect(num2words(1000, { lang: "fa", to: "currency" })).toBe("هزار تومان");
    expect(num2words(1500000, { lang: "fa", to: "currency" })).toBe("یک میلیون و پانصد هزار تومان");
  });

  test("test_ordinal_num", () => {
    expect(num2words(10, { lang: "fa", to: "ordinal_num" })).toBe("10م");
    expect(num2words(21, { lang: "fa", to: "ordinal_num" })).toBe("21م");
    expect(num2words(102, { lang: "fa", to: "ordinal_num" })).toBe("102م");
    expect(num2words(73, { lang: "fa", to: "ordinal_num" })).toBe("73م");
  });

  test("test_cardinal_for_float_number", () => {
    expect(num2words(12.5, { lang: "fa" })).toBe("دوازده و نیم");
    expect(num2words(0.75, { lang: "fa" })).toBe("هفتاد و پنج صدم");
    expect(num2words(12.51, { lang: "fa" })).toBe("دوازده و پنجاه و یک صدم");
    expect(num2words(12.53, { lang: "fa" })).toBe("دوازده و پنجاه و سه صدم");
    expect(num2words(12.59, { lang: "fa" })).toBe("دوازده و پنجاه و نه صدم");
    expect(num2words(1e-6, { lang: "fa" })).toBe("یک میلیونیم");
  });

  test("test_overflow", () => {
    expect(() =>
      num2words(
        "1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      ),
    ).toThrow(OverflowError);
  });
});
