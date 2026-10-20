// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_tet.py

import { beforeEach, describe, expect, test } from "bun:test";
import { Decimal, NotImplementedError, num2words } from "../src/index.ts";
import { Num2Word_TET } from "../src/lang/TET.ts";
import { InvalidOperation } from "../src/py.ts";

describe("Num2WordsTETTest", () => {
  let n2w: Num2Word_TET;
  beforeEach(() => {
    n2w = new Num2Word_TET();
  });

  test("test_cardinal_integer", () => {
    expect(num2words(1n, { lang: "tet" })).toBe("ida");
    expect(num2words(2n, { lang: "tet" })).toBe("rua");
    expect(num2words(3n, { lang: "tet" })).toBe("tolu");
    expect(num2words(4n, { lang: "tet" })).toBe("haat");
    expect(num2words(5n, { lang: "tet" })).toBe("lima");
    expect(num2words(6n, { lang: "tet" })).toBe("neen");
    expect(num2words(7n, { lang: "tet" })).toBe("hitu");
    expect(num2words(8n, { lang: "tet" })).toBe("ualu");
    expect(num2words(9n, { lang: "tet" })).toBe("sia");
    expect(num2words(10n, { lang: "tet" })).toBe("sanulu");
    expect(num2words(11n, { lang: "tet" })).toBe("sanulu resin ida");
    expect(num2words(12n, { lang: "tet" })).toBe("sanulu resin rua");
    expect(num2words(13n, { lang: "tet" })).toBe("sanulu resin tolu");
    expect(num2words(14n, { lang: "tet" })).toBe("sanulu resin haat");
    expect(num2words(15n, { lang: "tet" })).toBe("sanulu resin lima");
    expect(num2words(16n, { lang: "tet" })).toBe("sanulu resin neen");
    expect(num2words(17n, { lang: "tet" })).toBe("sanulu resin hitu");
    expect(num2words(18n, { lang: "tet" })).toBe("sanulu resin ualu");
    expect(num2words(19n, { lang: "tet" })).toBe("sanulu resin sia");
    expect(num2words(20n, { lang: "tet" })).toBe("ruanulu");
    expect(num2words(21n, { lang: "tet" })).toBe("ruanulu resin ida");
    expect(num2words(22n, { lang: "tet" })).toBe("ruanulu resin rua");
    expect(num2words(35n, { lang: "tet" })).toBe("tolunulu resin lima");
    expect(num2words(99n, { lang: "tet" })).toBe("sianulu resin sia");
    expect(num2words(100n, { lang: "tet" })).toBe("atus ida");
    expect(num2words(101n, { lang: "tet" })).toBe("atus ida ida");
    expect(num2words(107n, { lang: "tet" })).toBe("atus ida hitu");
    expect(num2words(110n, { lang: "tet" })).toBe("atus ida sanulu");
    expect(num2words(114n, { lang: "tet" })).toBe("atus ida sanulu resin haat");
    expect(num2words(128n, { lang: "tet" })).toBe("atus ida ruanulu resin ualu");
    expect(num2words(151n, { lang: "tet" })).toBe("atus ida limanulu resin ida");
    expect(num2words(713n, { lang: "tet" })).toBe("atus hitu sanulu resin tolu");
    expect(num2words(999n, { lang: "tet" })).toBe("atus sia sianulu resin sia");
    expect(num2words(1000n, { lang: "tet" })).toBe("rihun ida");
    expect(num2words(1001n, { lang: "tet" })).toBe("rihun ida ida");
    expect(num2words(1011n, { lang: "tet" })).toBe("rihun ida sanulu resin ida");
    expect(num2words(1111n, { lang: "tet" })).toBe("rihun ida atus ida sanulu resin ida");
    expect(num2words(2357n, { lang: "tet" })).toBe("rihun rua atus tolu limanulu resin hitu");
    expect(num2words(2200n, { lang: "tet" })).toBe("rihun rua atus rua");
    expect(num2words(2230n, { lang: "tet" })).toBe("rihun rua atus rua tolunulu");
    expect(num2words(73400n, { lang: "tet" })).toBe("rihun hitunulu resin tolu atus haat");
    expect(num2words(73421n, { lang: "tet" })).toBe(
      "rihun hitunulu resin tolu atus haat ruanulu resin ida",
    );
    expect(num2words(100000n, { lang: "tet" })).toBe("rihun atus ida");
    expect(num2words(250050n, { lang: "tet" })).toBe("rihun atus rua limanulu limanulu");
    expect(num2words(6000000n, { lang: "tet" })).toBe("miliaun neen");
    expect(num2words(100000000n, { lang: "tet" })).toBe("miliaun atus ida");
    expect(num2words(19000000000n, { lang: "tet" })).toBe("miliaun rihun sanulu resin sia");
    expect(num2words(145000000002n, { lang: "tet" })).toBe(
      "miliaun rihun atus ida haatnulu resin lima resin rua",
    );
    expect(num2words(4635102n, { lang: "tet" })).toBe(
      "miliaun haat rihun atus neen tolunulu resin lima atus ida rua",
    );
    expect(num2words(145254635102n, { lang: "tet" })).toBe(
      "miliaun rihun atus ida haatnulu resin lima atus rua limanulu resin haat rihun atus neen tolunulu resin lima atus ida rua",
    );
    expect(num2words(1000000000000n, { lang: "tet" })).toBe("biliaun ida");
    expect(num2words(2000000000000n, { lang: "tet" })).toBe("biliaun rua");
    expect(num2words(1000000000000000n, { lang: "tet" })).toBe("biliaun rihun ida");
    expect(num2words(2000000000000000n, { lang: "tet" })).toBe("biliaun rihun rua");
    expect(num2words(1000000000000000000n, { lang: "tet" })).toBe("triliaun ida");
    expect(num2words(2000000000000000000n, { lang: "tet" })).toBe("triliaun rua");
  });

  test("test_cardinal_integer_negative", () => {
    expect(num2words(-1n, { lang: "tet" })).toBe("menus ida");
    expect(num2words(-256n, { lang: "tet" })).toBe("menus atus rua limanulu resin neen");
    expect(num2words(-1000n, { lang: "tet" })).toBe("menus rihun ida");
    expect(num2words(-1000000n, { lang: "tet" })).toBe("menus miliaun ida");
    expect(num2words(-1234567n, { lang: "tet" })).toBe(
      "menus miliaun ida rihun atus rua tolunulu resin haat atus lima neenulu resin hitu",
    );
  });

  test("test_cardinal_float", () => {
    expect(num2words(new Decimal("1.00"), { lang: "tet" })).toBe("ida");
    expect(num2words(new Decimal("1.01"), { lang: "tet" })).toBe("ida vírgula mamuk ida");
    expect(num2words(new Decimal("1.035"), { lang: "tet" })).toBe("ida vírgula mamuk tolu lima");
    expect(num2words(new Decimal("1.35"), { lang: "tet" })).toBe("ida vírgula tolu lima");
    expect(num2words(new Decimal("3.14159"), { lang: "tet" })).toBe(
      "tolu vírgula ida haat ida lima sia",
    );
    expect(num2words(new Decimal("101.22"), { lang: "tet" })).toBe("atus ida ida vírgula rua rua");
    expect(num2words(new Decimal("2345.75"), { lang: "tet" })).toBe(
      "rihun rua atus tolu haatnulu resin lima vírgula hitu lima",
    );
  });

  test("test_cardinal_float_negative", () => {
    expect(num2words(new Decimal("-2.34"), { lang: "tet" })).toBe("menus rua vírgula tolu haat");
    expect(num2words(new Decimal("-9.99"), { lang: "tet" })).toBe("menus sia vírgula sia sia");
    expect(num2words(new Decimal("-7.01"), { lang: "tet" })).toBe("menus hitu vírgula mamuk ida");
    expect(num2words(new Decimal("-222.22"), { lang: "tet" })).toBe(
      "menus atus rua ruanulu resin rua vírgula rua rua",
    );
  });

  test("test_ordinal", () => {
    expect(() => num2words("hello", { lang: "tet", ordinal: true })).toThrow(InvalidOperation);
    expect(() => num2words(5.1, { lang: "tet", ordinal: true })).toThrow(TypeError);
    expect(num2words(1n, { lang: "tet", ordinal: true })).toBe("dahuluk");
    expect(num2words(2n, { lang: "tet", ordinal: true })).toBe("daruak");
    expect(num2words(3n, { lang: "tet", ordinal: true })).toBe("datoluk");
    expect(num2words(4n, { lang: "tet", ordinal: true })).toBe("dahaat");
    expect(num2words(5n, { lang: "tet", ordinal: true })).toBe("dalimak");
    expect(num2words(6n, { lang: "tet", ordinal: true })).toBe("daneen");
    expect(num2words(7n, { lang: "tet", ordinal: true })).toBe("dahituk");
    expect(num2words(8n, { lang: "tet", ordinal: true })).toBe("daualuk");
    expect(num2words(9n, { lang: "tet", ordinal: true })).toBe("dasiak");
    expect(num2words(10n, { lang: "tet", ordinal: true })).toBe("dasanuluk");
    expect(num2words(11n, { lang: "tet", ordinal: true })).toBe("dasanulu resin idak");
    expect(num2words(12n, { lang: "tet", ordinal: true })).toBe("dasanulu resin ruak");
    expect(num2words(13n, { lang: "tet", ordinal: true })).toBe("dasanulu resin toluk");
    expect(num2words(14n, { lang: "tet", ordinal: true })).toBe("dasanulu resin haat");
    expect(num2words(15n, { lang: "tet", ordinal: true })).toBe("dasanulu resin limak");
    expect(num2words(16n, { lang: "tet", ordinal: true })).toBe("dasanulu resin neen");
    expect(num2words(17n, { lang: "tet", ordinal: true })).toBe("dasanulu resin hituk");
    expect(num2words(18n, { lang: "tet", ordinal: true })).toBe("dasanulu resin ualuk");
    expect(num2words(19n, { lang: "tet", ordinal: true })).toBe("dasanulu resin siak");
    expect(num2words(20n, { lang: "tet", ordinal: true })).toBe("daruanuluk");
    expect(num2words(21n, { lang: "tet", ordinal: true })).toBe("daruanulu resin idak");
    expect(num2words(22n, { lang: "tet", ordinal: true })).toBe("daruanulu resin ruak");
    expect(num2words(35n, { lang: "tet", ordinal: true })).toBe("datolunulu resin limak");
    expect(num2words(99n, { lang: "tet", ordinal: true })).toBe("dasianulu resin siak");
    expect(num2words(100n, { lang: "tet", ordinal: true })).toBe("dahatus idak");
    expect(num2words(101n, { lang: "tet", ordinal: true })).toBe("dahatus ida idak");
    expect(num2words(106n, { lang: "tet", ordinal: true })).toBe("dahatus ida neen");
    expect(num2words(128n, { lang: "tet", ordinal: true })).toBe("dahatus ida ruanulu resin ualuk");
    expect(num2words(600n, { lang: "tet", ordinal: true })).toBe("dahatus neen");
    expect(num2words(713n, { lang: "tet", ordinal: true })).toBe("dahatus hitu sanulu resin toluk");
    expect(num2words(1000n, { lang: "tet", ordinal: true })).toBe("darihun idak");
    expect(num2words(1001n, { lang: "tet", ordinal: true })).toBe("darihun ida idak");
    expect(num2words(1111n, { lang: "tet", ordinal: true })).toBe(
      "darihun ida atus ida sanulu resin idak",
    );
    expect(num2words(2114n, { lang: "tet", ordinal: true })).toBe(
      "darihun rua atus ida sanulu resin haat",
    );
    expect(num2words(73421n, { lang: "tet", ordinal: true })).toBe(
      "darihun hitunulu resin tolu atus haat ruanulu resin idak",
    );
    expect(num2words(100000n, { lang: "tet", ordinal: true })).toBe("darihun atus idak");
    expect(num2words(250050n, { lang: "tet", ordinal: true })).toBe(
      "darihun atus rua limanulu limanuluk",
    );
    expect(num2words(6000000n, { lang: "tet", ordinal: true })).toBe("damiliaun neen");
    expect(num2words(19000000000n, { lang: "tet", ordinal: true })).toBe(
      "damiliaun rihun sanulu resin siak",
    );
    expect(num2words(145000000002n, { lang: "tet", ordinal: true })).toBe(
      "damiliaun rihun atus ida haatnulu resin lima resin ruak",
    );
  });

  test("test_currency_integer", () => {
    expect(n2w.toCurrency(1)).toBe("dolar ida");
    expect(n2w.toCurrency(2)).toBe("dolar rua");
    expect(n2w.toCurrency(3)).toBe("dolar tolu");
    expect(n2w.toCurrency(4)).toBe("dolar haat");
    expect(n2w.toCurrency(5)).toBe("dolar lima");
    expect(n2w.toCurrency(6)).toBe("dolar neen");
    expect(n2w.toCurrency(7)).toBe("dolar hitu");
    expect(n2w.toCurrency(8)).toBe("dolar ualu");
    expect(n2w.toCurrency(9)).toBe("dolar sia");
    expect(n2w.toCurrency(10)).toBe("dolar sanulu");
    expect(n2w.toCurrency(11)).toBe("dolar sanulu resin ida");
    expect(n2w.toCurrency(12)).toBe("dolar sanulu resin rua");
    expect(n2w.toCurrency(13)).toBe("dolar sanulu resin tolu");
    expect(n2w.toCurrency(14)).toBe("dolar sanulu resin haat");
    expect(n2w.toCurrency(15)).toBe("dolar sanulu resin lima");
    expect(n2w.toCurrency(16)).toBe("dolar sanulu resin neen");
    expect(n2w.toCurrency(17)).toBe("dolar sanulu resin hitu");
    expect(n2w.toCurrency(18)).toBe("dolar sanulu resin ualu");
    expect(n2w.toCurrency(19)).toBe("dolar sanulu resin sia");
    expect(n2w.toCurrency(20)).toBe("dolar ruanulu");
    expect(n2w.toCurrency(21)).toBe("dolar ruanulu resin ida");
    expect(n2w.toCurrency(22)).toBe("dolar ruanulu resin rua");
    expect(n2w.toCurrency(35)).toBe("dolar tolunulu resin lima");
    expect(n2w.toCurrency(99)).toBe("dolar sianulu resin sia");
    expect(n2w.toCurrency(100)).toBe("dolar atus ida");
    expect(n2w.toCurrency(101)).toBe("dolar atus ida ida");
    expect(n2w.toCurrency(128)).toBe("dolar atus ida ruanulu resin ualu");
    expect(n2w.toCurrency(713)).toBe("dolar atus hitu sanulu resin tolu");
    expect(n2w.toCurrency(1000)).toBe("dolar rihun ida");
    expect(n2w.toCurrency(1001)).toBe("dolar rihun ida ida");
    expect(n2w.toCurrency(1111)).toBe("dolar rihun ida atus ida sanulu resin ida");
    expect(n2w.toCurrency(2114)).toBe("dolar rihun rua atus ida sanulu resin haat");
    expect(n2w.toCurrency(73421)).toBe(
      "dolar rihun hitunulu resin tolu atus haat ruanulu resin ida",
    );
    expect(n2w.toCurrency(100000)).toBe("dolar rihun atus ida");
    expect(n2w.toCurrency(250050)).toBe("dolar rihun atus rua limanulu limanulu");
    expect(n2w.toCurrency(6000000)).toBe("dolar miliaun neen");
    expect(n2w.toCurrency(19000000000)).toBe("dolar miliaun rihun sanulu resin sia");
    expect(n2w.toCurrency(145000000002)).toBe(
      "dolar miliaun rihun atus ida haatnulu resin lima resin rua",
    );
    expect(n2w.toCurrency(1, { currency: "USD" })).toBe("dolar ida");
    expect(n2w.toCurrency(1.5, { currency: "USD" })).toBe("dolar ida sentavu limanulu");
    expect(() => n2w.toCurrency(1, { currency: "CHF" })).toThrow(NotImplementedError);
  });

  test("test_currency_integer_negative", () => {
    expect(n2w.toCurrency(-1)).toBe("menus dolar ida");
    expect(n2w.toCurrency(-256)).toBe("menus dolar atus rua limanulu resin neen");
    expect(n2w.toCurrency(-1000)).toBe("menus dolar rihun ida");
    expect(n2w.toCurrency(-1000000)).toBe("menus dolar miliaun ida");
    expect(n2w.toCurrency(-1234567)).toBe(
      "menus dolar miliaun ida rihun atus rua tolunulu resin haat atus lima neenulu resin hitu",
    );
  });

  test("test_currency_float", () => {
    expect(n2w.toCurrency(new Decimal("1.00"))).toBe("dolar ida");
    expect(n2w.toCurrency(new Decimal("1.01"))).toBe("dolar ida sentavu ida");
    expect(n2w.toCurrency(new Decimal("1.03"))).toBe("dolar ida sentavu tolu");
    expect(n2w.toCurrency(new Decimal("1.35"))).toBe("dolar ida sentavu tolunulu resin lima");
    expect(n2w.toCurrency(new Decimal("3.14"))).toBe("dolar tolu sentavu sanulu resin haat");
    expect(n2w.toCurrency(new Decimal("101.22"))).toBe(
      "dolar atus ida ida sentavu ruanulu resin rua",
    );
    expect(n2w.toCurrency(new Decimal("2345.75"))).toBe(
      "dolar rihun rua atus tolu haatnulu resin lima sentavu hitunulu resin lima",
    );
  });

  test("test_currency_float_negative", () => {
    expect(n2w.toCurrency(new Decimal("-2.34"))).toBe(
      "menus dolar rua sentavu tolunulu resin haat",
    );
    expect(n2w.toCurrency(new Decimal("-9.99"))).toBe("menus dolar sia sentavu sianulu resin sia");
    expect(n2w.toCurrency(new Decimal("-7.01"))).toBe("menus dolar hitu sentavu ida");
    expect(n2w.toCurrency(new Decimal("-222.22"))).toBe(
      "menus dolar atus rua ruanulu resin rua sentavu ruanulu resin rua",
    );
  });

  test("test_year", () => {
    expect(n2w.toYear(1001n)).toBe("rihun ida ida");
    expect(n2w.toYear(1789n)).toBe("rihun ida atus hitu ualunulu resin sia");
    expect(n2w.toYear(1942n)).toBe("rihun ida atus sia haatnulu resin rua");
    expect(n2w.toYear(1984n)).toBe("rihun ida atus sia ualunulu resin haat");
    expect(n2w.toYear(2000n)).toBe("rihun rua");
    expect(n2w.toYear(2001n)).toBe("rihun rua ida");
    expect(n2w.toYear(2016n)).toBe("rihun rua sanulu resin neen");
  });

  test("test_year_negative", () => {
    expect(n2w.toYear(-30n)).toBe("tolunulu antes Kristu");
    expect(n2w.toYear(-744n)).toBe("atus hitu haatnulu resin haat antes Kristu");
    expect(n2w.toYear(-10000n)).toBe("rihun sanulu antes Kristu");
  });

  test("test_to_ordinal_num", () => {
    expect(n2w.toOrdinalNum(1n)).toBe("1º");
    expect(n2w.toOrdinalNum(100n)).toBe("100º");
  });
});
