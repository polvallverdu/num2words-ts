// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_sk.py

import { describe, expect, test } from "bun:test";
import { asFloat, NotImplementedError, num2words } from "../src/index.ts";

describe("Num2WordsSKTest", () => {
  test("test_cardinal", () => {
    expect(num2words(100, { lang: "sk" })).toBe("sto");
    expect(num2words(101, { lang: "sk" })).toBe("stojeden");
    expect(num2words(110, { lang: "sk" })).toBe("stodesať");
    expect(num2words(115, { lang: "sk" })).toBe("stopätnásť");
    expect(num2words(123, { lang: "sk" })).toBe("stodvadsaťtri");
    expect(num2words(1000, { lang: "sk" })).toBe("tisíc");
    expect(num2words(1001, { lang: "sk" })).toBe("tisícjeden");
    expect(num2words(2012, { lang: "sk" })).toBe("dvetisícdvanásť");
    expect(num2words(10.02, { lang: "sk" })).toBe("desať celých nula dva");
    expect(num2words(15.007, { lang: "sk" })).toBe("pätnásť celých nula nula sedem");
    expect(num2words(12519.85, { lang: "sk" })).toBe(
      "dvanásťtisícpäťstodevätnásť celých osemdesiatpäť",
    );
    expect(num2words(123.5, { lang: "sk" })).toBe("stodvadsaťtri celých päť");
    expect(num2words(1234567890, { lang: "sk" })).toBe(
      "miliarda dvestotridsaťštyri miliónov päťstošesťdesiatsedemtisícosemstodeväťdesiat",
    );
    expect(num2words(215461407892039002157189883901676n, { lang: "sk" })).toBe(
      "dvestopätnásť kvintiliónov štyristošesťdesiatjeden kvadriliárd štyristosedem kvadriliónov osemstodeväťdesiatdva triliárd tridsaťdeväť triliónov dve biliardy stopäťdesiatsedem biliónov stoosemdesiatdeväť miliárd osemstoosemdesiattri miliónov deväťstojedentisícšesťstosedemdesiatšesť",
    );
    expect(num2words(719094234693663034822824384220291n, { lang: "sk" })).toBe(
      "sedemstodevätnásť kvintiliónov deväťdesiatštyri kvadriliárd dvestotridsaťštyri kvadriliónov šesťstodeväťdesiattri triliárd šesťstošesťdesiattri triliónov tridsaťštyri biliárd osemstodvadsaťdva biliónov osemstodvadsaťštyri miliárd tristoosemdesiatštyri miliónov dvestodvadsaťtisícdvestodeväťdesiatjeden",
    );
  });

  test("test_to_ordinal", () => {
    // @TODO: implement to_ordinal
    expect(() => num2words(1, { lang: "sk", to: "ordinal" })).toThrow(NotImplementedError);
  });

  test("test_currency", () => {
    expect(num2words(asFloat(10), { lang: "sk", to: "currency", currency: "EUR" })).toBe(
      "desať eur, nula centov",
    );
    expect(num2words(1234.56, { lang: "sk", to: "currency", currency: "EUR" })).toBe(
      "tisícdvestotridsaťštyri eur, päťdesiatšesť centov",
    );
    expect(
      num2words(101.11, { lang: "sk", to: "currency", currency: "EUR", separator: " a" }),
    ).toBe("stojeden eur a jedenásť centov");
    expect(num2words(-12519.85, { lang: "sk", to: "currency", cents: false })).toBe(
      "mínus dvanásťtisícpäťstodevätnásť eur, 85 centov",
    );
    expect(num2words(19.5, { lang: "sk", to: "currency", cents: false })).toBe(
      "devätnásť eur, 50 centov",
    );
  });
});
