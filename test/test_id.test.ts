// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_id.py

import { describe, expect, test } from "bun:test";
import { num2words } from "../src/index.ts";

describe("Num2WordsIDTest", () => {
  test("test_cardinal_for_natural_number", () => {
    expect(num2words(10, { lang: "id" })).toBe("sepuluh");
    expect(num2words(11, { lang: "id" })).toBe("sebelas");
    expect(num2words(108, { lang: "id" })).toBe("seratus delapan");
    expect(num2words(1075, { lang: "id" })).toBe("seribu tujuh puluh lima");
    expect(num2words(1087231, { lang: "id" })).toBe(
      "satu juta delapan puluh tujuh ribu dua ratus tiga puluh satu",
    );
    expect(num2words(1000000408, { lang: "id" })).toBe("satu miliar empat ratus delapan");
  });

  test("test_cardinal_for_decimal_number", () => {
    expect(num2words(12.234, { lang: "id" })).toBe("dua belas koma dua tiga empat");
    expect(num2words(9.076, { lang: "id" })).toBe("sembilan koma nol tujuh enam");
  });

  test("test_cardinal_for_negative_number", () => {
    expect(num2words(-923, { lang: "id" })).toBe("min sembilan ratus dua puluh tiga");
    expect(num2words(-0.234, { lang: "id" })).toBe("min nol koma dua tiga empat");
  });

  test("test_ordinal_for_natural_number", () => {
    expect(num2words(1, { ordinal: true, lang: "id" })).toBe("pertama");
    expect(num2words(10, { ordinal: true, lang: "id" })).toBe("kesepuluh");
  });

  test("test_ordinal_for_negative_number", () => {
    expect(() => num2words(-12, { ordinal: true, lang: "id" })).toThrow(TypeError);
  });

  test("test_ordinal_for_floating_number", () => {
    expect(() => num2words(3.243, { ordinal: true, lang: "id" })).toThrow(TypeError);
  });
});
