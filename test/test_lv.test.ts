// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_lv.py

import { describe, expect, test } from "bun:test";
import { asFloat, NotImplementedError, num2words } from "../src/index.ts";

describe("Num2WordsLVTest", () => {
  test("test_to_cardinal", () => {
    expect(num2words(100, { lang: "lv" })).toBe("simts");
    expect(num2words(101, { lang: "lv" })).toBe("simtu viens");
    expect(num2words(110, { lang: "lv" })).toBe("simts desmit");
    expect(num2words(115, { lang: "lv" })).toBe("simts piecpadsmit");
    expect(num2words(123, { lang: "lv" })).toBe("simts divdesmit trīs");
    expect(num2words(1000, { lang: "lv" })).toBe("tūkstotis");
    expect(num2words(1001, { lang: "lv" })).toBe("tūkstotis viens");
    expect(num2words(2012, { lang: "lv" })).toBe("divi tūkstoši divpadsmit");
    expect(num2words(1234567890, { lang: "lv" })).toBe(
      "miljards divi simti trīsdesmit četri miljoni pieci simti sešdesmit septiņi tūkstoši astoņi simti deviņdesmit",
    );
    expect(num2words(215461407892039002157189883901676n, { lang: "lv" })).toBe(
      "divi simti piecpadsmit nontiljoni četri simti sešdesmit viens oktiljons četri simti septiņi septiljoni astoņi simti deviņdesmit divi sikstiljoni trīsdesmit deviņi kvintiljoni divi kvadriljoni simts piecdesmit septiņi triljoni simts astoņdesmit deviņi miljardi astoņi simti astoņdesmit trīs miljoni deviņi simti viens tūkstotis seši simti septiņdesmit seši",
    );
    expect(num2words(719094234693663034822824384220291n, { lang: "lv" })).toBe(
      "septiņi simti deviņpadsmit nontiljoni deviņdesmit četri oktiljoni divi simti trīsdesmit četri septiljoni seši simti deviņdesmit trīs sikstiljoni seši simti sešdesmit trīs kvintiljoni trīsdesmit četri kvadriljoni astoņi simti divdesmit divi triljoni astoņi simti divdesmit četri miljardi trīs simti astoņdesmit četri miljoni divi simti divdesmit tūkstoši divi simti deviņdesmit viens",
    );
    expect(num2words(-5000, { lang: "lv" })).toBe("mīnus pieci tūkstoši");
    expect(num2words(-5000.22, { lang: "lv" })).toBe("mīnus pieci tūkstoši komats divdesmit divi");
    expect(num2words(10.02, { lang: "lv" })).toBe("desmit komats nulle divi");
    expect(num2words(15.007, { lang: "lv" })).toBe("piecpadsmit komats nulle nulle septiņi");
    expect(num2words(0, { lang: "lv" })).toBe("nulle");
    expect(num2words(5, { lang: "lv" })).toBe("pieci");
    expect(num2words(15, { lang: "lv" })).toBe("piecpadsmit");
    expect(num2words(154, { lang: "lv" })).toBe("simts piecdesmit četri");
    expect(num2words(101, { lang: "lv" })).toBe("simtu viens");
    expect(num2words(1135, { lang: "lv" })).toBe("tūkstotis simts trīsdesmit pieci");
    expect(num2words(418531, { lang: "lv" })).toBe(
      "četri simti astoņpadsmit tūkstoši pieci simti trīsdesmit viens",
    );
    expect(num2words(1000139, { lang: "lv" })).toBe("miljons simts trīsdesmit deviņi");
  });

  test("test_to_ordinal", () => {
    expect(() => num2words(1, { lang: "lv", to: "ordinal" })).toThrow(NotImplementedError);
  });

  test("test_to_currency", () => {
    expect(num2words(asFloat(1), { lang: "lv", to: "currency", currency: "EUR" })).toBe(
      "viens eiro, nulle centu",
    );
    expect(num2words(asFloat(1), { lang: "lv", to: "currency", currency: "LVL" })).toBe(
      "viens lats, nulle santīmu",
    );
    expect(num2words(1234.56, { lang: "lv", to: "currency", currency: "EUR" })).toBe(
      "tūkstotis divi simti trīsdesmit četri eiro, piecdesmit seši centi",
    );
    expect(num2words(1234.56, { lang: "lv", to: "currency", currency: "LVL" })).toBe(
      "tūkstotis divi simti trīsdesmit četri lati, piecdesmit seši santīmi",
    );
    expect(
      num2words(10111, { lang: "lv", to: "currency", separator: " un", currency: "EUR" }),
    ).toBe("simtu viens eiro un vienpadsmit centi");
    expect(
      num2words(10121, { lang: "lv", to: "currency", separator: " un", currency: "LVL" }),
    ).toBe("simtu viens lats un divdesmit viens santīms");
    expect(num2words(-1251985, { lang: "lv", to: "currency", cents: false, currency: "EUR" })).toBe(
      "mīnus divpadsmit tūkstoši pieci simti deviņpadsmit eiro, 85 centi",
    );
    expect(
      num2words("38.4", {
        lang: "lv",
        to: "currency",
        separator: " un",
        cents: false,
        currency: "EUR",
      }),
    ).toBe("trīsdesmit astoņi eiro un 40 centi");
    expect(
      num2words("38.4", {
        lang: "lv",
        to: "currency",
        separator: " un",
        cents: false,
        currency: "EUR_LEGAL",
      }),
    ).toBe("trīsdesmit astoņi euro un 40 centi");
    expect(
      num2words("38.4", {
        lang: "lv",
        to: "currency",
        separator: " un",
        cents: false,
        currency: "USD",
        adjective: false,
      }),
    ).toBe("trīsdesmit astoņi dolāri un 40 centi");
    expect(
      num2words("38.4", {
        lang: "lv",
        to: "currency",
        separator: " un",
        cents: false,
        currency: "USD",
        adjective: true,
      }),
    ).toBe("trīsdesmit astoņi ASV dolāri un 40 centi");
  });

  test("test_fractions", () => {
    expect(num2words(5.2, { lang: "lv" })).toBe("pieci komats divi");
    expect(num2words(561.42, { lang: "lv" })).toBe(
      "pieci simti sešdesmit viens komats četrdesmit divi",
    );
  });
});
