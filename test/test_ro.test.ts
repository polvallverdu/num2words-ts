// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_ro.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words, OverflowError } from "../src/index.ts";

describe("Num2WordsROTest", () => {
  test("test_ordinal", () => {
    expect(num2words(1, { lang: "ro", to: "ordinal" })).toBe("primul");
    expect(num2words(22, { lang: "ro", to: "ordinal" })).toBe("al douăzeci și doilea");
    expect(num2words(21, { lang: "ro", to: "ordinal" })).toBe("al douăzeci și unulea");
    expect(num2words(12, { lang: "ro", to: "ordinal" })).toBe("al doisprezecelea");
    expect(num2words(130, { lang: "ro", to: "ordinal" })).toBe("al o sută treizecilea");
    expect(num2words(1003, { lang: "ro", to: "ordinal" })).toBe("al o mie treilea");
  });

  test("test_ordinal_num", () => {
    expect(num2words(1, { lang: "ro", to: "ordinal_num" })).toBe("1-ul");
    expect(num2words(10, { lang: "ro", to: "ordinal_num" })).toBe("al 10-lea");
    expect(num2words(21, { lang: "ro", to: "ordinal_num" })).toBe("al 21-lea");
    expect(num2words(102, { lang: "ro", to: "ordinal_num" })).toBe("al 102-lea");
    expect(num2words(73, { lang: "ro", to: "ordinal_num" })).toBe("al 73-lea");
  });

  test("test_cardinal_for_float_number", () => {
    expect(num2words(12.5, { lang: "ro" })).toBe("doisprezece virgulă cinci");
    expect(num2words(12.51, { lang: "ro" })).toBe("doisprezece virgulă cinci unu");
    expect(num2words(12.53, { lang: "ro" })).toBe("doisprezece virgulă cinci trei");
    expect(num2words(12.59, { lang: "ro" })).toBe("doisprezece virgulă cinci nouă");
  });

  test("test_big_numbers", () => {
    expect(num2words(1000000, { lang: "ro" })).toBe("un milion");
    expect(num2words(1000000000, { lang: "ro" })).toBe("un miliard");
    expect(num2words(33000000, { lang: "ro" })).toBe("treizeci și trei milioane");
    expect(num2words(247000000000, { lang: "ro" })).toBe(
      "două sute patruzeci și șapte de miliarde",
    );
  });

  test("test_overflow", () => {
    expect(() =>
      num2words(
        "1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      ),
    ).toThrow(OverflowError);
  });

  test("test_to_currency", () => {
    expect(num2words(1000, { lang: "ro", to: "currency" })).toBe("una mie de lei");
    expect(num2words(101, { lang: "ro", to: "currency" })).toBe("una sută unu lei");
    expect(num2words(100, { lang: "ro", to: "currency" })).toBe("una sută de lei");
    expect(num2words(38.4, { lang: "ro", to: "currency" })).toBe(
      "treizeci și opt de lei și patruzeci de bani",
    );
    expect(num2words(1.01, { lang: "ro", to: "currency" })).toBe("un leu și un ban");
    expect(num2words(asFloat(4778), { lang: "ro", to: "currency" })).toBe(
      "patru mii șapte sute șaptezeci și opt de lei",
    );
    expect(num2words(4778.32, { lang: "ro", to: "currency" })).toBe(
      "patru mii șapte sute șaptezeci și opt de lei și treizeci și doi de bani",
    );
    expect(num2words(1207, { lang: "ro", to: "currency" })).toBe("una mie două sute șapte lei");
    expect(num2words(22000, { lang: "ro", to: "currency" })).toBe("douăzeci și două de mii de lei");
    expect(num2words(80000, { lang: "ro", to: "currency" })).toBe("optzeci de mii de lei");
    expect(num2words(123456789, { lang: "ro", to: "currency" })).toBe(
      "una sută douăzeci și trei milioane patru sute cincizeci și șase de mii șapte sute optzeci și nouă de lei",
    );
  });

  test("test_to_year", () => {
    expect(num2words(1989, { lang: "ro", to: "year" })).toBe("o mie nouă sute optzeci și nouă");
    expect(num2words(1984, { lang: "ro", to: "year" })).toBe("o mie nouă sute optzeci și patru");
    expect(num2words(2018, { lang: "ro", to: "year" })).toBe("două mii optsprezece");
    expect(num2words(1066, { lang: "ro", to: "year" })).toBe("o mie șaizeci și șase");
    expect(num2words(5000, { lang: "ro", to: "year" })).toBe("cinci mii");
    expect(num2words(2001, { lang: "ro", to: "year" })).toBe("două mii unu");
    expect(num2words(905, { lang: "ro", to: "year" })).toBe("nouă sute cinci");
    expect(num2words(6600, { lang: "ro", to: "year" })).toBe("șase mii șase sute");
    expect(num2words(1600, { lang: "ro", to: "year" })).toBe("o mie șase sute");
    expect(num2words(700, { lang: "ro", to: "year" })).toBe("șapte sute");
    expect(num2words(50, { lang: "ro", to: "year" })).toBe("cincizeci");
    expect(num2words(0, { lang: "ro", to: "year" })).toBe("zero");
    expect(num2words(10, { lang: "ro", to: "year" })).toBe("zece");
    expect(num2words(-44, { lang: "ro", to: "year" })).toBe("patruzeci și patru î.Hr.");
    expect(num2words(-44, { lang: "ro", to: "year", suffix: "î.e.n." })).toBe(
      "patruzeci și patru î.e.n.",
    );
    expect(num2words(1, { lang: "ro", to: "year", suffix: "d.Hr." })).toBe("unu d.Hr.");
    expect(num2words(-66000000, { lang: "ro", to: "year" })).toBe("șaizeci și șase milioane î.Hr.");
  });
});
