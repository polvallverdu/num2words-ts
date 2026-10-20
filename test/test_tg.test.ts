// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_tg.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words, OverflowError } from "../src/index.ts";

describe("Num2WordsTGTest", () => {
  test("test_cardinal", () => {
    expect(() => num2words(1000000000000000000000000n, { lang: "tg" })).toThrow(OverflowError);
    expect(num2words(100, { lang: "tg" })).toBe("сад");
    expect(num2words(100000, { lang: "tg" })).toBe("сад ҳазор");
    expect(num2words(101, { lang: "tg" })).toBe("яксаду як");
    expect(num2words(110, { lang: "tg" })).toBe("яксаду даҳ");
    expect(num2words(115, { lang: "tg" })).toBe("яксаду понздаҳ");
    expect(num2words(123, { lang: "tg" })).toBe("яксаду бисту се");
    expect(num2words(1000, { lang: "tg" })).toBe("як ҳазор");
    expect(num2words(1001, { lang: "tg" })).toBe("як ҳазору як");
    expect(num2words(2012, { lang: "tg" })).toBe("ду ҳазору дувоздаҳ");
    expect(num2words(12519.85, { lang: "tg" })).toBe(
      "дувоздаҳ ҳазору панҷсаду нуздаҳ нуқта ҳашт панҷ",
    );
    expect(num2words(1234567890, { lang: "tg" })).toBe(
      "як миллиарду дусаду сию чор миллиону панҷсаду шасту ҳафт ҳазору ҳаштсаду навад",
    );
    expect(num2words(1000000, { lang: "tg" })).toBe("як миллион");
    expect(num2words(1000000000, { lang: "tg" })).toBe("як миллиард");
    expect(num2words(1000000000000, { lang: "tg" })).toBe("як триллион");
    expect(num2words(5, { lang: "tg" })).toBe("панҷ");
    expect(num2words(-1, { lang: "tg" })).toBe("минус як");
    expect(num2words(-15, { lang: "tg" })).toBe("минус понздаҳ");
    expect(num2words(-100, { lang: "tg" })).toBe("минус сад");
  });

  test("test_to_ordinal", () => {
    expect(num2words(1, { lang: "tg", to: "ordinal" })).toBe("якум");
    expect(num2words(2, { lang: "tg", to: "ordinal" })).toBe("дуюм");
    expect(num2words(3, { lang: "tg", to: "ordinal" })).toBe("сеюм");
    expect(num2words(30, { lang: "tg", to: "ordinal" })).toBe("сиюм");
    expect(num2words(13, { lang: "tg", to: "ordinal" })).toBe("сенздаҳум");
    expect(num2words(20, { lang: "tg", to: "ordinal" })).toBe("бистум");
    expect(num2words(23, { lang: "tg", to: "ordinal" })).toBe("бисту сеюм");
    expect(num2words(100, { lang: "tg", to: "ordinal" })).toBe("садум");
    expect(num2words(136, { lang: "tg", to: "ordinal" })).toBe("яксаду сию шашум");
    expect(num2words(500, { lang: "tg", to: "ordinal" })).toBe("панҷсадум");
    expect(num2words(1000, { lang: "tg", to: "ordinal" })).toBe("як ҳазорум");
    expect(num2words(1001, { lang: "tg", to: "ordinal" })).toBe("як ҳазору якум");
    expect(num2words(2000, { lang: "tg", to: "ordinal" })).toBe("ду ҳазорум");
    expect(num2words(1000000, { lang: "tg", to: "ordinal" })).toBe("як миллионум");
    expect(num2words(1000000000, { lang: "tg", to: "ordinal" })).toBe("як миллиардум");
  });

  test("test_to_currency", () => {
    expect(num2words(asFloat(1), { lang: "tg", to: "currency", currency: "EUR" })).toBe(
      "як евро, сифр сент",
    );
    expect(num2words(asFloat(1), { lang: "tg", to: "currency", currency: "TJS" })).toBe(
      "як сомонӣ, сифр дирам",
    );
    expect(num2words(1234.56, { lang: "tg", to: "currency", currency: "TJS" })).toBe(
      "як ҳазору дусаду сию чор сомонӣ, панҷову шаш дирам",
    );
    expect(num2words(1234.56, { lang: "tg", to: "currency", currency: "RUB" })).toBe(
      "як ҳазору дусаду сию чор рубл, панҷову шаш копейк",
    );
    expect(num2words(12519.85, { lang: "tg", to: "currency", currency: "TJS", cents: false })).toBe(
      "дувоздаҳ ҳазору панҷсаду нуздаҳ сомонӣ, 85 дирам",
    );
    expect(num2words("1230.56", { lang: "tg", to: "currency", currency: "USD" })).toBe(
      "як ҳазору дусаду си доллар, панҷову шаш сент",
    );
  });

  test("test_to_ordinal_num", () => {
    expect(num2words("100", { lang: "tg", to: "ordinal_num" })).toBe("100ум");
  });
});
