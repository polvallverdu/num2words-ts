// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_pl.py

import { describe, expect, test } from "bun:test";
import { asFloat, NotImplementedError, num2words } from "../src/index.ts";

describe("Num2WordsPLTest", () => {
  test("test_cardinal", () => {
    expect(num2words(90, { lang: "pl" })).toBe("dziewięćdziesiąt");
    expect(num2words(100, { lang: "pl" })).toBe("sto");
    expect(num2words(101, { lang: "pl" })).toBe("sto jeden");
    expect(num2words(110, { lang: "pl" })).toBe("sto dziesięć");
    expect(num2words(115, { lang: "pl" })).toBe("sto piętnaście");
    expect(num2words(123, { lang: "pl" })).toBe("sto dwadzieścia trzy");
    expect(num2words(400, { lang: "pl" })).toBe("czterysta");
    expect(num2words(1000, { lang: "pl" })).toBe("tysiąc");
    expect(num2words(1001, { lang: "pl" })).toBe("tysiąc jeden");
    expect(num2words(2012, { lang: "pl" })).toBe("dwa tysiące dwanaście");
    expect(num2words(10.02, { lang: "pl" })).toBe("dziesięć przecinek zero dwa");
    expect(num2words(15.007, { lang: "pl" })).toBe("piętnaście przecinek zero zero siedem");
    expect(num2words(12519.85, { lang: "pl" })).toBe(
      "dwanaście tysięcy pięćset dziewiętnaście przecinek osiemdziesiąt pięć",
    );
    expect(num2words(123.5, { lang: "pl" })).toBe("sto dwadzieścia trzy przecinek pięć");
    expect(num2words(1234567890, { lang: "pl" })).toBe(
      "miliard dwieście trzydzieści cztery miliony pięćset sześćdziesiąt siedem tysięcy osiemset dziewięćdziesiąt",
    );
    expect(num2words(10000000001000000100000n, { lang: "pl" })).toBe(
      "dziesięć tryliardów bilion sto tysięcy",
    );
    expect(num2words(215461407892039002157189883901676n, { lang: "pl" })).toBe(
      "dwieście piętnaście kwintylionów czterysta sześćdziesiąt jeden kwadryliardów czterysta siedem kwadrylionów osiemset dziewięćdziesiąt dwa tryliardy trzydzieści dziewięć trylionów dwa biliardy sto pięćdziesiąt siedem bilionów sto osiemdziesiąt dziewięć miliardów osiemset osiemdziesiąt trzy miliony dziewięćset jeden tysięcy sześćset siedemdziesiąt sześć",
    );
    expect(num2words(719094234693663034822824384220291n, { lang: "pl" })).toBe(
      "siedemset dziewiętnaście kwintylionów dziewięćdziesiąt cztery kwadryliardy dwieście trzydzieści cztery kwadryliony sześćset dziewięćdziesiąt trzy tryliardy sześćset sześćdziesiąt trzy tryliony trzydzieści cztery biliardy osiemset dwadzieścia dwa biliony osiemset dwadzieścia cztery miliardy trzysta osiemdziesiąt cztery miliony dwieście dwadzieścia tysięcy dwieście dziewięćdziesiąt jeden",
    );
    expect(
      num2words(963301000001918264129471001047146102n * 10n ** 30n + 1007n, {
        lang: "pl",
      }),
    ).toBe(
      "dziewięćset sześćdziesiąt trzy decyliardy trzysta jeden decylionów nonylion dziewięćset osiemnaście oktyliardów dwieście sześćdziesiąt cztery oktyliony sto dwadzieścia dziewięć septyliardów czterysta siedemdziesiąt jeden septylionów sekstyliard czterdzieści siedem sekstylionów sto czterdzieści sześć kwintyliardów sto dwa kwintyliony tysiąc siedem",
    );
  });

  test("test_to_ordinal", () => {
    expect(num2words(100, { lang: "pl", to: "ordinal" })).toBe("setny");
    expect(num2words(101, { lang: "pl", to: "ordinal" })).toBe("sto pierwszy");
    expect(num2words(120, { lang: "pl", to: "ordinal" })).toBe("sto dwudziesty");
    expect(num2words(20, { lang: "pl", to: "ordinal" })).toBe("dwudziesty");
    expect(num2words(121, { lang: "pl", to: "ordinal" })).toBe("sto dwudziesty pierwszy");
    expect(num2words(115, { lang: "pl", to: "ordinal" })).toBe("sto piętnasty");
    expect(num2words(25, { lang: "pl", to: "ordinal" })).toBe("dwudziesty piąty");
    expect(num2words(1021, { lang: "pl", to: "ordinal" })).toBe("tysiąc dwudziesty pierwszy");
    expect(num2words(120, { lang: "pl", to: "ordinal" })).toBe("sto dwudziesty");
    expect(num2words(1000021, { lang: "pl", to: "ordinal" })).toBe("milion dwudziesty pierwszy");
    expect(num2words(1000, { lang: "pl", to: "ordinal" })).toBe("tysięczny");
    expect(num2words(10000, { lang: "pl", to: "ordinal" })).toBe("dziesięciotysięczny");
    expect(num2words(100000000, { lang: "pl", to: "ordinal" })).toBe("stumilionowy");
    expect(num2words(1002000, { lang: "pl", to: "ordinal" })).toBe("milion dwutysięczny");
    expect(num2words(1001000, { lang: "pl", to: "ordinal" })).toBe("milion tysięczny");
    expect(num2words(1000000, { lang: "pl", to: "ordinal" })).toBe("milionowy");
  });

  test("test_to_ordinal_error", () => {
    expect(() => {
      num2words(1.5, { lang: "pl", to: "ordinal" });
    }).toThrow(NotImplementedError);
  });

  test("test_currency", () => {
    expect(num2words(asFloat(1), { lang: "pl", to: "currency", currency: "EUR" })).toBe(
      "jeden euro, zero centów",
    );
    expect(num2words(asFloat(1), { lang: "pl", to: "currency", currency: "PLN" })).toBe(
      "jeden złoty, zero groszy",
    );
    expect(num2words(1234.56, { lang: "pl", to: "currency", currency: "EUR" })).toBe(
      "tysiąc dwieście trzydzieści cztery euro, pięćdziesiąt sześć centów",
    );
    expect(num2words(1234.56, { lang: "pl", to: "currency", currency: "PLN" })).toBe(
      "tysiąc dwieście trzydzieści cztery złote, pięćdziesiąt sześć groszy",
    );
    expect(num2words(10111, { lang: "pl", to: "currency", currency: "EUR", separator: " i" })).toBe(
      "sto jeden euro i jedenaście centów",
    );
    expect(num2words(10121, { lang: "pl", to: "currency", currency: "PLN", separator: " i" })).toBe(
      "sto jeden złotych i dwadzieścia jeden groszy",
    );
    expect(num2words(-1251985, { lang: "pl", to: "currency", cents: false })).toBe(
      "minus dwanaście tysięcy pięćset dziewiętnaście euro, 85 centów",
    );
    expect(num2words(123.5, { lang: "pl", to: "currency", currency: "PLN", separator: " i" })).toBe(
      "sto dwadzieścia trzy złote i pięćdziesiąt groszy",
    );
    expect(num2words(1950, { lang: "pl", to: "currency", cents: false })).toBe(
      "dziewiętnaście euro, 50 centów",
    );
  });
});
