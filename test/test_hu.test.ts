// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_hu.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words, OverflowError } from "../src/index.ts";

describe("Num2WordsHUTest", () => {
  test("test_and_join_199", () => {
    expect(num2words(199)).toBe("one hundred and ninety-nine");
  });

  test("test_cardinal", () => {
    expect(num2words(-1, { lang: "hu" })).toBe("mínusz egy");
    expect(num2words(0, { lang: "hu" })).toBe("nulla");
    expect(num2words(1, { lang: "hu" })).toBe("egy");
    expect(num2words(13, { lang: "hu" })).toBe("tizenhárom");
    expect(num2words(22, { lang: "hu" })).toBe("huszonkettő");
    expect(num2words(75, { lang: "hu" })).toBe("hetvenöt");
    expect(num2words(124, { lang: "hu" })).toBe("százhuszonnégy");
    expect(num2words(651, { lang: "hu" })).toBe("hatszázötvenegy");
    expect(num2words(2232, { lang: "hu" })).toBe("kétezer-kétszázharminckettő");
    expect(num2words(16501, { lang: "hu" })).toBe("tizenhatezer-ötszázegy");
    expect(num2words(1900000000000, { lang: "hu" })).toBe("egybillió-kilencszázmilliárd");
    expect(num2words(24656451324564987566n, { lang: "hu" })).toBe(
      "huszonnégytrillió-hatszázötvenhatbilliárd-négyszázötvenegybillió-háromszázhuszonnégymilliárd-ötszázhatvannégymillió-kilencszáznyolcvanhétezer-ötszázhatvanhat",
    );
  });

  test("test_ordinal", () => {
    expect(num2words(0, { lang: "hu", to: "ordinal" })).toBe("nulladik");
    expect(num2words(1, { lang: "hu", to: "ordinal" })).toBe("első");
    expect(num2words(2, { lang: "hu", to: "ordinal" })).toBe("második");
    expect(num2words(-3, { lang: "hu", to: "ordinal" })).toBe("mínusz harmadik");
    expect(num2words(13, { lang: "hu", to: "ordinal" })).toBe("tizenharmadik");
    expect(num2words(22, { lang: "hu", to: "ordinal" })).toBe("huszonkettedik");
    expect(num2words(75, { lang: "hu", to: "ordinal" })).toBe("hetvenötödik");
    expect(num2words(124, { lang: "hu", to: "ordinal" })).toBe("százhuszonnegyedik");
    expect(num2words(1532, { lang: "hu", to: "ordinal" })).toBe("ezerötszázharminckettedik");
    expect(num2words(16501, { lang: "hu", to: "ordinal" })).toBe("tizenhatezer-ötszázegyedik");
    expect(num2words(458755640120000, { lang: "hu", to: "ordinal" })).toBe(
      "négyszázötvennyolcbillió-hétszázötvenötmilliárd-hatszáznegyvenmillió-százhúszezredik",
    );
  });

  test("test_ordinal_num", () => {
    expect(num2words(10, { lang: "hu", to: "ordinal_num" })).toBe("10.");
    expect(num2words(21, { lang: "hu", to: "ordinal_num" })).toBe("21.");
    expect(num2words(102, { lang: "hu", to: "ordinal_num" })).toBe("102.");
    expect(num2words(73, { lang: "hu", to: "ordinal_num" })).toBe("73.");
  });

  test("test_cardinal_for_float_number", () => {
    expect(num2words(12, { lang: "hu" })).toBe("tizenkettő");
    expect(num2words(asFloat(12), { lang: "hu" })).toBe("tizenkettő");
    expect(num2words(12.5, { lang: "hu" })).toBe("tizenkettő egész öt tized");
    expect(num2words(-12.5, { lang: "hu" })).toBe("mínusz tizenkettő egész öt tized");
    expect(num2words(12.51, { lang: "hu" })).toBe("tizenkettő egész ötvenegy század");
    expect(num2words(12.53, { lang: "hu" })).toBe("tizenkettő egész ötvenhárom század");
    expect(num2words(12.59, { lang: "hu" })).toBe("tizenkettő egész ötvenkilenc század");
    expect(num2words(12.005, { lang: "hu" })).toBe("tizenkettő egész öt ezred");
  });

  test("test_overflow", () => {
    expect(() => {
      num2words(
        "1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      );
    }).toThrow(OverflowError);
  });

  test("test_to_currency", () => {
    expect(
      num2words("38.4", {
        lang: "hu",
        to: "currency",
        separator: " és",
        cents: false,
        currency: "HUF",
      }),
    ).toBe("harmincnyolc forint és 40 fillér");
    expect(
      num2words("0", {
        lang: "hu",
        to: "currency",
        separator: " és",
        cents: false,
        currency: "HUF",
      }),
    ).toBe("nulla forint és 00 fillér");
    expect(
      num2words("1.01", {
        lang: "hu",
        to: "currency",
        separator: " és",
        cents: true,
        currency: "HUF",
      }),
    ).toBe("egy forint és egy fillér");
    expect(
      num2words("4778.00", {
        lang: "hu",
        to: "currency",
        separator: " és",
        cents: true,
        currency: "HUF",
        adjective: true,
      }),
    ).toBe("négyezer-hétszázhetvennyolc Hungarian forint és nulla fillér");
    expect(
      num2words("4778.00", {
        lang: "hu",
        to: "currency",
        separator: " és",
        cents: true,
        currency: "HUF",
      }),
    ).toBe("négyezer-hétszázhetvennyolc forint és nulla fillér");
  });

  test("test_to_year", () => {
    expect(num2words(1990, { lang: "hu", to: "year" })).toBe("ezerkilencszázkilencven");
    expect(num2words(5555, { lang: "hu", to: "year" })).toBe("ötezer-ötszázötvenöt");
    expect(num2words(2020, { lang: "hu", to: "year" })).toBe("kétezer-húsz");
    expect(num2words(905, { lang: "hu", to: "year" })).toBe("kilencszázöt");
    expect(num2words(0, { lang: "hu", to: "year" })).toBe("nulla");
    expect(num2words(-44, { lang: "hu", to: "year" })).toBe("i. e. negyvennégy");
    expect(num2words(-44, { lang: "hu", to: "year", suffix: "Kr. e." })).toBe("Kr. e. negyvennégy");
    expect(num2words(1, { lang: "hu", to: "year", suffix: "Kr. u." })).toBe("Kr. u. egy");
    expect(num2words(-66000000, { lang: "hu", to: "year" })).toBe("i. e. hatvanhatmillió");
  });
});
