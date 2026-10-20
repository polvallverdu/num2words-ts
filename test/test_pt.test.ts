// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_pt.py

import { beforeEach, describe, expect, test } from "bun:test";
import { Decimal, NotImplementedError, num2words } from "../src/index.ts";
import { Num2Word_PT } from "../src/lang/PT.ts";

describe("Num2WordsPTTest", () => {
  let n2w: Num2Word_PT;
  beforeEach(() => {
    n2w = new Num2Word_PT();
  });

  test("test_cardinal_integer", () => {
    expect(num2words(1n, { lang: "pt" })).toBe("um");
    expect(num2words(2n, { lang: "pt" })).toBe("dois");
    expect(num2words(3n, { lang: "pt" })).toBe("três");
    expect(num2words(4n, { lang: "pt" })).toBe("quatro");
    expect(num2words(5n, { lang: "pt" })).toBe("cinco");
    expect(num2words(6n, { lang: "pt" })).toBe("seis");
    expect(num2words(7n, { lang: "pt" })).toBe("sete");
    expect(num2words(8n, { lang: "pt" })).toBe("oito");
    expect(num2words(9n, { lang: "pt" })).toBe("nove");
    expect(num2words(10n, { lang: "pt" })).toBe("dez");
    expect(num2words(11n, { lang: "pt" })).toBe("onze");
    expect(num2words(12n, { lang: "pt" })).toBe("doze");
    expect(num2words(13n, { lang: "pt" })).toBe("treze");
    expect(num2words(14n, { lang: "pt" })).toBe("catorze");
    expect(num2words(15n, { lang: "pt" })).toBe("quinze");
    expect(num2words(16n, { lang: "pt" })).toBe("dezasseis");
    expect(num2words(17n, { lang: "pt" })).toBe("dezassete");
    expect(num2words(18n, { lang: "pt" })).toBe("dezoito");
    expect(num2words(19n, { lang: "pt" })).toBe("dezanove");
    expect(num2words(20n, { lang: "pt" })).toBe("vinte");
    expect(num2words(21n, { lang: "pt" })).toBe("vinte e um");
    expect(num2words(22n, { lang: "pt" })).toBe("vinte e dois");
    expect(num2words(35n, { lang: "pt" })).toBe("trinta e cinco");
    expect(num2words(99n, { lang: "pt" })).toBe("noventa e nove");
    expect(num2words(100n, { lang: "pt" })).toBe("cem");
    expect(num2words(101n, { lang: "pt" })).toBe("cento e um");
    expect(num2words(128n, { lang: "pt" })).toBe("cento e vinte e oito");
    expect(num2words(713n, { lang: "pt" })).toBe("setecentos e treze");
    expect(num2words(1000n, { lang: "pt" })).toBe("mil");
    expect(num2words(1001n, { lang: "pt" })).toBe("mil e um");
    expect(num2words(1111n, { lang: "pt" })).toBe("mil cento e onze");
    expect(num2words(2114n, { lang: "pt" })).toBe("dois mil cento e catorze");
    expect(num2words(2200n, { lang: "pt" })).toBe("dois mil e duzentos");
    expect(num2words(2230n, { lang: "pt" })).toBe("dois mil duzentos e trinta");
    expect(num2words(73400n, { lang: "pt" })).toBe("setenta e três mil e quatrocentos");
    expect(num2words(73421n, { lang: "pt" })).toBe("setenta e três mil quatrocentos e vinte e um");
    expect(num2words(100000n, { lang: "pt" })).toBe("cem mil");
    expect(num2words(250050n, { lang: "pt" })).toBe("duzentos e cinquenta mil e cinquenta");
    expect(num2words(6000000n, { lang: "pt" })).toBe("seis milhões");
    expect(num2words(100000000n, { lang: "pt" })).toBe("cem milhões");
    expect(num2words(19000000000n, { lang: "pt" })).toBe("dezanove mil milhões");
    expect(num2words(145000000002n, { lang: "pt" })).toBe(
      "cento e quarenta e cinco mil milhões e dois",
    );
    expect(num2words(4635102n, { lang: "pt" })).toBe(
      "quatro milhões seiscentos e trinta e cinco mil cento e dois",
    );
    expect(num2words(145254635102n, { lang: "pt" })).toBe(
      "cento e quarenta e cinco mil duzentos e cinquenta e quatro milhões seiscentos e trinta e cinco mil cento e dois",
    );
    expect(num2words(1000000000000n, { lang: "pt" })).toBe("um bilião");
    expect(num2words(2000000000000n, { lang: "pt" })).toBe("dois biliões");
    expect(num2words(1000000000000000n, { lang: "pt" })).toBe("mil biliões");
    expect(num2words(2000000000000000n, { lang: "pt" })).toBe("dois mil biliões");
    expect(num2words(1000000000000000000n, { lang: "pt" })).toBe("um trilião");
    expect(num2words(2000000000000000000n, { lang: "pt" })).toBe("dois triliões");
  });

  test("test_cardinal_integer_negative", () => {
    expect(num2words(-1n, { lang: "pt" })).toBe("menos um");
    expect(num2words(-256n, { lang: "pt" })).toBe("menos duzentos e cinquenta e seis");
    expect(num2words(-1000n, { lang: "pt" })).toBe("menos mil");
    expect(num2words(-1000000n, { lang: "pt" })).toBe("menos um milhão");
    expect(num2words(-1234567n, { lang: "pt" })).toBe(
      "menos um milhão duzentos e trinta e quatro mil quinhentos e sessenta e sete",
    );
  });

  test("test_cardinal_float", () => {
    expect(num2words(new Decimal("1.00"), { lang: "pt" })).toBe("um");
    expect(num2words(new Decimal("1.01"), { lang: "pt" })).toBe("um vírgula zero um");
    expect(num2words(new Decimal("1.035"), { lang: "pt" })).toBe("um vírgula zero três cinco");
    expect(num2words(new Decimal("1.35"), { lang: "pt" })).toBe("um vírgula três cinco");
    expect(num2words(new Decimal("3.14159"), { lang: "pt" })).toBe(
      "três vírgula um quatro um cinco nove",
    );
    expect(num2words(new Decimal("101.22"), { lang: "pt" })).toBe("cento e um vírgula dois dois");
    expect(num2words(new Decimal("2345.75"), { lang: "pt" })).toBe(
      "dois mil trezentos e quarenta e cinco vírgula sete cinco",
    );
  });

  test("test_cardinal_float_negative", () => {
    expect(num2words(new Decimal("-2.34"), { lang: "pt" })).toBe("menos dois vírgula três quatro");
    expect(num2words(new Decimal("-9.99"), { lang: "pt" })).toBe("menos nove vírgula nove nove");
    expect(num2words(new Decimal("-7.01"), { lang: "pt" })).toBe("menos sete vírgula zero um");
    expect(num2words(new Decimal("-222.22"), { lang: "pt" })).toBe(
      "menos duzentos e vinte e dois vírgula dois dois",
    );
  });

  test("test_ordinal", () => {
    expect(num2words(1n, { lang: "pt", ordinal: true })).toBe("primeiro");
    expect(num2words(2n, { lang: "pt", ordinal: true })).toBe("segundo");
    expect(num2words(3n, { lang: "pt", ordinal: true })).toBe("terceiro");
    expect(num2words(4n, { lang: "pt", ordinal: true })).toBe("quarto");
    expect(num2words(5n, { lang: "pt", ordinal: true })).toBe("quinto");
    expect(num2words(6n, { lang: "pt", ordinal: true })).toBe("sexto");
    expect(num2words(7n, { lang: "pt", ordinal: true })).toBe("sétimo");
    expect(num2words(8n, { lang: "pt", ordinal: true })).toBe("oitavo");
    expect(num2words(9n, { lang: "pt", ordinal: true })).toBe("nono");
    expect(num2words(10n, { lang: "pt", ordinal: true })).toBe("décimo");
    expect(num2words(11n, { lang: "pt", ordinal: true })).toBe("décimo primeiro");
    expect(num2words(12n, { lang: "pt", ordinal: true })).toBe("décimo segundo");
    expect(num2words(13n, { lang: "pt", ordinal: true })).toBe("décimo terceiro");
    expect(num2words(14n, { lang: "pt", ordinal: true })).toBe("décimo quarto");
    expect(num2words(15n, { lang: "pt", ordinal: true })).toBe("décimo quinto");
    expect(num2words(16n, { lang: "pt", ordinal: true })).toBe("décimo sexto");
    expect(num2words(17n, { lang: "pt", ordinal: true })).toBe("décimo sétimo");
    expect(num2words(18n, { lang: "pt", ordinal: true })).toBe("décimo oitavo");
    expect(num2words(19n, { lang: "pt", ordinal: true })).toBe("décimo nono");
    expect(num2words(20n, { lang: "pt", ordinal: true })).toBe("vigésimo");
    expect(num2words(21n, { lang: "pt", ordinal: true })).toBe("vigésimo primeiro");
    expect(num2words(22n, { lang: "pt", ordinal: true })).toBe("vigésimo segundo");
    expect(num2words(35n, { lang: "pt", ordinal: true })).toBe("trigésimo quinto");
    expect(num2words(99n, { lang: "pt", ordinal: true })).toBe("nonagésimo nono");
    expect(num2words(100n, { lang: "pt", ordinal: true })).toBe("centésimo");
    expect(num2words(101n, { lang: "pt", ordinal: true })).toBe("centésimo primeiro");
    expect(num2words(128n, { lang: "pt", ordinal: true })).toBe("centésimo vigésimo oitavo");
    expect(num2words(713n, { lang: "pt", ordinal: true })).toBe("septigentésimo décimo terceiro");
    expect(num2words(1000n, { lang: "pt", ordinal: true })).toBe("milésimo");
    expect(num2words(1001n, { lang: "pt", ordinal: true })).toBe("milésimo primeiro");
    expect(num2words(1111n, { lang: "pt", ordinal: true })).toBe(
      "milésimo centésimo décimo primeiro",
    );
    expect(num2words(2114n, { lang: "pt", ordinal: true })).toBe(
      "segundo milésimo centésimo décimo quarto",
    );
    expect(num2words(73421n, { lang: "pt", ordinal: true })).toBe(
      "septuagésimo terceiro milésimo quadrigentésimo vigésimo primeiro",
    );
    expect(num2words(100000n, { lang: "pt", ordinal: true })).toBe("centésimo milésimo");
    expect(num2words(250050n, { lang: "pt", ordinal: true })).toBe(
      "ducentésimo quinquagésimo milésimo quinquagésimo",
    );
    expect(num2words(6000000n, { lang: "pt", ordinal: true })).toBe("sexto milionésimo");
    expect(num2words(19000000000n, { lang: "pt", ordinal: true })).toBe(
      "décimo nono milésimo milionésimo",
    );
    expect(num2words(145000000002n, { lang: "pt", ordinal: true })).toBe(
      "centésimo quadragésimo quinto milésimo milionésimo segundo",
    );
  });

  test("test_currency_integer", () => {
    expect(n2w.toCurrency(1)).toBe("um euro");
    expect(n2w.toCurrency(2)).toBe("dois euros");
    expect(n2w.toCurrency(3)).toBe("três euros");
    expect(n2w.toCurrency(4)).toBe("quatro euros");
    expect(n2w.toCurrency(5)).toBe("cinco euros");
    expect(n2w.toCurrency(6)).toBe("seis euros");
    expect(n2w.toCurrency(7)).toBe("sete euros");
    expect(n2w.toCurrency(8)).toBe("oito euros");
    expect(n2w.toCurrency(9)).toBe("nove euros");
    expect(n2w.toCurrency(10)).toBe("dez euros");
    expect(n2w.toCurrency(11)).toBe("onze euros");
    expect(n2w.toCurrency(12)).toBe("doze euros");
    expect(n2w.toCurrency(13)).toBe("treze euros");
    expect(n2w.toCurrency(14)).toBe("catorze euros");
    expect(n2w.toCurrency(15)).toBe("quinze euros");
    expect(n2w.toCurrency(16)).toBe("dezasseis euros");
    expect(n2w.toCurrency(17)).toBe("dezassete euros");
    expect(n2w.toCurrency(18)).toBe("dezoito euros");
    expect(n2w.toCurrency(19)).toBe("dezanove euros");
    expect(n2w.toCurrency(20)).toBe("vinte euros");
    expect(n2w.toCurrency(21)).toBe("vinte e um euros");
    expect(n2w.toCurrency(22)).toBe("vinte e dois euros");
    expect(n2w.toCurrency(35)).toBe("trinta e cinco euros");
    expect(n2w.toCurrency(99)).toBe("noventa e nove euros");
    expect(n2w.toCurrency(100)).toBe("cem euros");
    expect(n2w.toCurrency(101)).toBe("cento e um euros");
    expect(n2w.toCurrency(128)).toBe("cento e vinte e oito euros");
    expect(n2w.toCurrency(713)).toBe("setecentos e treze euros");
    expect(n2w.toCurrency(1000)).toBe("mil euros");
    expect(n2w.toCurrency(1001)).toBe("mil e um euros");
    expect(n2w.toCurrency(1111)).toBe("mil cento e onze euros");
    expect(n2w.toCurrency(2114)).toBe("dois mil cento e catorze euros");
    expect(n2w.toCurrency(73421)).toBe("setenta e três mil quatrocentos e vinte e um euros");
    expect(n2w.toCurrency(100000)).toBe("cem mil euros");
    expect(n2w.toCurrency(250050)).toBe("duzentos e cinquenta mil e cinquenta euros");
    expect(n2w.toCurrency(6000000)).toBe("seis milhões de euros");
    expect(n2w.toCurrency(19000000000)).toBe("dezanove mil milhões de euros");
    expect(n2w.toCurrency(145000000002)).toBe("cento e quarenta e cinco mil milhões e dois euros");
    expect(n2w.toCurrency(1, { currency: "USD" })).toBe("um dólar");
    expect(n2w.toCurrency(1.5, { currency: "USD" })).toBe("um dólar e cinquenta cêntimos");
    expect(() => n2w.toCurrency(1, { currency: "CHF" })).toThrow(NotImplementedError);
  });

  test("test_currency_integer_negative", () => {
    expect(n2w.toCurrency(-1)).toBe("menos um euro");
    expect(n2w.toCurrency(-256)).toBe("menos duzentos e cinquenta e seis euros");
    expect(n2w.toCurrency(-1000)).toBe("menos mil euros");
    expect(n2w.toCurrency(-1000000)).toBe("menos um milhão de euros");
    expect(n2w.toCurrency(-1234567)).toBe(
      "menos um milhão duzentos e trinta e quatro mil quinhentos e sessenta e sete euros",
    );
  });

  test("test_currency_float", () => {
    expect(n2w.toCurrency(new Decimal("1.00"))).toBe("um euro");
    expect(n2w.toCurrency(new Decimal("1.01"))).toBe("um euro e um cêntimo");
    expect(n2w.toCurrency(new Decimal("1.03"))).toBe("um euro e três cêntimos");
    expect(n2w.toCurrency(new Decimal("1.35"))).toBe("um euro e trinta e cinco cêntimos");
    expect(n2w.toCurrency(new Decimal("3.14"))).toBe("três euros e catorze cêntimos");
    expect(n2w.toCurrency(new Decimal("101.22"))).toBe("cento e um euros e vinte e dois cêntimos");
    expect(n2w.toCurrency(new Decimal("2345.75"))).toBe(
      "dois mil trezentos e quarenta e cinco euros e setenta e cinco cêntimos",
    );
  });

  test("test_currency_float_negative", () => {
    expect(n2w.toCurrency(new Decimal("-2.34"))).toBe(
      "menos dois euros e trinta e quatro cêntimos",
    );
    expect(n2w.toCurrency(new Decimal("-9.99"))).toBe("menos nove euros e noventa e nove cêntimos");
    expect(n2w.toCurrency(new Decimal("-7.01"))).toBe("menos sete euros e um cêntimo");
    expect(n2w.toCurrency(new Decimal("-222.22"))).toBe(
      "menos duzentos e vinte e dois euros e vinte e dois cêntimos",
    );
  });

  test("test_year", () => {
    expect(n2w.toYear(1001n)).toBe("mil e um");
    expect(n2w.toYear(1789n)).toBe("mil setecentos e oitenta e nove");
    expect(n2w.toYear(1942n)).toBe("mil novecentos e quarenta e dois");
    expect(n2w.toYear(1984n)).toBe("mil novecentos e oitenta e quatro");
    expect(n2w.toYear(2000n)).toBe("dois mil");
    expect(n2w.toYear(2001n)).toBe("dois mil e um");
    expect(n2w.toYear(2016n)).toBe("dois mil e dezasseis");
  });

  test("test_year_negative", () => {
    expect(n2w.toYear(-30n)).toBe("trinta antes de Cristo");
    expect(n2w.toYear(-744n)).toBe("setecentos e quarenta e quatro antes de Cristo");
    expect(n2w.toYear(-10000n)).toBe("dez mil antes de Cristo");
  });

  test("test_to_ordinal_num", () => {
    expect(n2w.toOrdinalNum(1n)).toBe("1º");
    expect(n2w.toOrdinalNum(100n)).toBe("100º");
  });
});
