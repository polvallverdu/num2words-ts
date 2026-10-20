// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_nl.py

import { describe, expect, test } from "bun:test";
import type { CurrencyForms } from "../src/base.ts";
import { num2words } from "../src/index.ts";
import { Num2Word_NL } from "../src/lang/NL.ts";

describe("Num2WordsNLTest", () => {
  test("test_ordinal_less_than_twenty", () => {
    expect(num2words(7, { ordinal: true, lang: "nl" })).toBe("zevende");
    expect(num2words(8, { ordinal: true, lang: "nl" })).toBe("achtste");
    expect(num2words(12, { ordinal: true, lang: "nl" })).toBe("twaalfde");
    expect(num2words(17, { ordinal: true, lang: "nl" })).toBe("zeventiende");
  });

  test("test_ordinal_more_than_twenty", () => {
    expect(num2words(81, { ordinal: true, lang: "nl" })).toBe("eenentachtigste");
  });

  test("test_ordinal_at_crucial_number", () => {
    expect(num2words(0, { ordinal: true, lang: "nl" })).toBe("nulde");
    expect(num2words(100, { ordinal: true, lang: "nl" })).toBe("honderdste");
    expect(num2words(1000, { ordinal: true, lang: "nl" })).toBe("duizendste");
    expect(num2words(4000, { ordinal: true, lang: "nl" })).toBe("vierduizendste");
    expect(num2words(2000000, { ordinal: true, lang: "nl" })).toBe("twee miljoenste");
    expect(num2words(5000000000, { ordinal: true, lang: "nl" })).toBe("vijf miljardste");
  });

  test("test_cardinal_at_some_numbers", () => {
    expect(num2words(82, { lang: "nl" })).toBe("tweeëntachtig");
    expect(num2words(1013, { lang: "nl" })).toBe("duizenddertien");
    expect(num2words(2000000, { lang: "nl" })).toBe("twee miljoen");
    expect(num2words(4000000000, { lang: "nl" })).toBe("vier miljard");
  });

  test("test_cardinal_for_decimal_number", () => {
    expect(num2words(3.486, { lang: "nl" })).toBe("drie komma vier acht zes");
  });

  test("test_ordinal_for_negative_numbers", () => {
    expect(() => num2words(-12, { ordinal: true, lang: "nl" })).toThrow(TypeError);
  });

  test("test_ordinal_for_floating_numbers", () => {
    expect(() => num2words(2.453, { ordinal: true, lang: "nl" })).toThrow(TypeError);
  });

  test("test_to_currency_eur", () => {
    expect(
      num2words("38.4", {
        lang: "nl",
        to: "currency",
        separator: " en",
        cents: false,
        currency: "EUR",
      }),
    ).toBe("achtendertig euro en 40 cent");
    expect(
      num2words("0", {
        lang: "nl",
        to: "currency",
        separator: " en",
        cents: false,
        currency: "EUR",
      }),
    ).toBe("nul euro en 00 cent");
    expect(
      num2words("1.01", {
        lang: "nl",
        to: "currency",
        separator: " en",
        cents: true,
        currency: "EUR",
      }),
    ).toBe("één euro en één cent");
    expect(
      num2words("4778.00", {
        lang: "nl",
        to: "currency",
        separator: " en",
        cents: true,
        currency: "EUR",
      }),
    ).toBe("vierduizendzevenhonderdachtenzeventig euro en nul cent");
  });

  test("test_to_currency_usd", () => {
    expect(
      num2words("38.4", {
        lang: "nl",
        to: "currency",
        separator: " en",
        cents: false,
        currency: "USD",
      }),
    ).toBe("achtendertig dollar en 40 cent");
    expect(
      num2words("0", {
        lang: "nl",
        to: "currency",
        separator: " en",
        cents: false,
        currency: "USD",
      }),
    ).toBe("nul dollar en 00 cent");
    expect(
      num2words("1.01", {
        lang: "nl",
        to: "currency",
        separator: " en",
        cents: true,
        currency: "USD",
      }),
    ).toBe("één dollar en één cent");
    expect(
      num2words("4778.00", {
        lang: "nl",
        to: "currency",
        separator: " en",
        cents: true,
        currency: "USD",
      }),
    ).toBe("vierduizendzevenhonderdachtenzeventig dollar en nul cent");
  });

  test("test_pluralize", () => {
    const n = new Num2Word_NL();
    // euros always singular
    const [cr1, cr2] = Num2Word_NL.CURRENCY_FORMS.EUR as CurrencyForms;
    expect(n.pluralize(1n, cr1)).toBe("euro");
    expect(n.pluralize(2n, cr1)).toBe("euro");
    expect(n.pluralize(1n, cr2)).toBe("cent");
    expect(n.pluralize(2n, cr2)).toBe("cent");

    // @TODO other currency
  });

  test("test_to_year", () => {
    expect(num2words(2018, { lang: "nl", to: "year" })).toBe("tweeduizendachttien");
    expect(num2words(2100, { lang: "nl", to: "year" })).toBe("eenentwintig honderd");
  });
});
