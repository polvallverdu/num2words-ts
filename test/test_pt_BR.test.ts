// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_pt_BR.py

import { beforeEach, describe, expect, test } from "bun:test";
import { Decimal, num2words } from "../src/index.ts";
import { Num2Word_PT_BR } from "../src/lang/PT_BR.ts";

describe("Num2WordsPTBRTest", () => {
  let n2w: Num2Word_PT_BR;
  beforeEach(() => {
    n2w = new Num2Word_PT_BR();
  });

  test("test_cardinal_integer", () => {
    expect(num2words(1n, { lang: "pt_BR" })).toBe("um");
    expect(num2words(2n, { lang: "pt_BR" })).toBe("dois");
    expect(num2words(3n, { lang: "pt_BR" })).toBe("três");
    expect(num2words(4n, { lang: "pt_BR" })).toBe("quatro");
    expect(num2words(5n, { lang: "pt_BR" })).toBe("cinco");
    expect(num2words(6n, { lang: "pt_BR" })).toBe("seis");
    expect(num2words(7n, { lang: "pt_BR" })).toBe("sete");
    expect(num2words(8n, { lang: "pt_BR" })).toBe("oito");
    expect(num2words(9n, { lang: "pt_BR" })).toBe("nove");
    expect(num2words(10n, { lang: "pt_BR" })).toBe("dez");
    expect(num2words(11n, { lang: "pt_BR" })).toBe("onze");
    expect(num2words(12n, { lang: "pt_BR" })).toBe("doze");
    expect(num2words(13n, { lang: "pt_BR" })).toBe("treze");
    expect(num2words(14n, { lang: "pt_BR" })).toBe("catorze");
    expect(num2words(15n, { lang: "pt_BR" })).toBe("quinze");
    expect(num2words(16n, { lang: "pt_BR" })).toBe("dezesseis");
    expect(num2words(17n, { lang: "pt_BR" })).toBe("dezessete");
    expect(num2words(18n, { lang: "pt_BR" })).toBe("dezoito");
    expect(num2words(19n, { lang: "pt_BR" })).toBe("dezenove");
    expect(num2words(20n, { lang: "pt_BR" })).toBe("vinte");
    expect(num2words(21n, { lang: "pt_BR" })).toBe("vinte e um");
    expect(num2words(22n, { lang: "pt_BR" })).toBe("vinte e dois");
    expect(num2words(35n, { lang: "pt_BR" })).toBe("trinta e cinco");
    expect(num2words(99n, { lang: "pt_BR" })).toBe("noventa e nove");
    expect(num2words(100n, { lang: "pt_BR" })).toBe("cem");
    expect(num2words(101n, { lang: "pt_BR" })).toBe("cento e um");
    expect(num2words(128n, { lang: "pt_BR" })).toBe("cento e vinte e oito");
    expect(num2words(713n, { lang: "pt_BR" })).toBe("setecentos e treze");
    expect(num2words(1000n, { lang: "pt_BR" })).toBe("mil");
    expect(num2words(1001n, { lang: "pt_BR" })).toBe("mil e um");
    expect(num2words(1111n, { lang: "pt_BR" })).toBe("mil, cento e onze");
    expect(num2words(2114n, { lang: "pt_BR" })).toBe("dois mil, cento e catorze");
    expect(num2words(73421n, { lang: "pt_BR" })).toBe(
      "setenta e três mil, quatrocentos e vinte e um",
    );
    expect(num2words(100000n, { lang: "pt_BR" })).toBe("cem mil");
    expect(num2words(250050n, { lang: "pt_BR" })).toBe("duzentos e cinquenta mil e cinquenta");
    expect(num2words(6000000n, { lang: "pt_BR" })).toBe("seis milhões");
    expect(num2words(100000000n, { lang: "pt_BR" })).toBe("cem milhões");
    expect(num2words(100000000000n, { lang: "pt_BR" })).toBe("cem bilhões");
    expect(num2words(19000000000n, { lang: "pt_BR" })).toBe("dezenove bilhões");
    expect(num2words(145000000002n, { lang: "pt_BR" })).toBe(
      "cento e quarenta e cinco bilhões e dois",
    );
  });

  test("test_cardinal_integer_negative", () => {
    expect(num2words(-1n, { lang: "pt_BR" })).toBe("menos um");
    expect(num2words(-256n, { lang: "pt_BR" })).toBe("menos duzentos e cinquenta e seis");
    expect(num2words(-1000n, { lang: "pt_BR" })).toBe("menos mil");
    expect(num2words(-1000000n, { lang: "pt_BR" })).toBe("menos um milhão");
    expect(num2words(-1234567n, { lang: "pt_BR" })).toBe(
      "menos um milhão, duzentos e trinta e quatro mil, quinhentos e sessenta e sete",
    );
  });

  test("test_cardinal_float", () => {
    expect(num2words(new Decimal("1.00"), { lang: "pt_BR" })).toBe("um");
    expect(num2words(new Decimal("1.01"), { lang: "pt_BR" })).toBe("um vírgula zero um");
    expect(num2words(new Decimal("1.035"), { lang: "pt_BR" })).toBe("um vírgula zero três cinco");
    expect(num2words(new Decimal("1.35"), { lang: "pt_BR" })).toBe("um vírgula três cinco");
    expect(num2words(new Decimal("3.14159"), { lang: "pt_BR" })).toBe(
      "três vírgula um quatro um cinco nove",
    );
    expect(num2words(new Decimal("101.22"), { lang: "pt_BR" })).toBe(
      "cento e um vírgula dois dois",
    );
    expect(num2words(new Decimal("2345.75"), { lang: "pt_BR" })).toBe(
      "dois mil, trezentos e quarenta e cinco vírgula sete cinco",
    );
  });

  test("test_cardinal_float_negative", () => {
    expect(num2words(new Decimal("-2.34"), { lang: "pt_BR" })).toBe(
      "menos dois vírgula três quatro",
    );
    expect(num2words(new Decimal("-9.99"), { lang: "pt_BR" })).toBe("menos nove vírgula nove nove");
    expect(num2words(new Decimal("-7.01"), { lang: "pt_BR" })).toBe("menos sete vírgula zero um");
    expect(num2words(new Decimal("-222.22"), { lang: "pt_BR" })).toBe(
      "menos duzentos e vinte e dois vírgula dois dois",
    );
  });

  test("test_ordinal", () => {
    expect(num2words(1n, { lang: "pt_BR", ordinal: true })).toBe("primeiro");
    expect(num2words(2n, { lang: "pt_BR", ordinal: true })).toBe("segundo");
    expect(num2words(3n, { lang: "pt_BR", ordinal: true })).toBe("terceiro");
    expect(num2words(4n, { lang: "pt_BR", ordinal: true })).toBe("quarto");
    expect(num2words(5n, { lang: "pt_BR", ordinal: true })).toBe("quinto");
    expect(num2words(6n, { lang: "pt_BR", ordinal: true })).toBe("sexto");
    expect(num2words(7n, { lang: "pt_BR", ordinal: true })).toBe("sétimo");
    expect(num2words(8n, { lang: "pt_BR", ordinal: true })).toBe("oitavo");
    expect(num2words(9n, { lang: "pt_BR", ordinal: true })).toBe("nono");
    expect(num2words(10n, { lang: "pt_BR", ordinal: true })).toBe("décimo");
    expect(num2words(11n, { lang: "pt_BR", ordinal: true })).toBe("décimo primeiro");
    expect(num2words(12n, { lang: "pt_BR", ordinal: true })).toBe("décimo segundo");
    expect(num2words(13n, { lang: "pt_BR", ordinal: true })).toBe("décimo terceiro");
    expect(num2words(14n, { lang: "pt_BR", ordinal: true })).toBe("décimo quarto");
    expect(num2words(15n, { lang: "pt_BR", ordinal: true })).toBe("décimo quinto");
    expect(num2words(16n, { lang: "pt_BR", ordinal: true })).toBe("décimo sexto");
    expect(num2words(17n, { lang: "pt_BR", ordinal: true })).toBe("décimo sétimo");
    expect(num2words(18n, { lang: "pt_BR", ordinal: true })).toBe("décimo oitavo");
    expect(num2words(19n, { lang: "pt_BR", ordinal: true })).toBe("décimo nono");
    expect(num2words(20n, { lang: "pt_BR", ordinal: true })).toBe("vigésimo");
    expect(num2words(21n, { lang: "pt_BR", ordinal: true })).toBe("vigésimo primeiro");
    expect(num2words(22n, { lang: "pt_BR", ordinal: true })).toBe("vigésimo segundo");
    expect(num2words(35n, { lang: "pt_BR", ordinal: true })).toBe("trigésimo quinto");
    expect(num2words(99n, { lang: "pt_BR", ordinal: true })).toBe("nonagésimo nono");
    expect(num2words(100n, { lang: "pt_BR", ordinal: true })).toBe("centésimo");
    expect(num2words(101n, { lang: "pt_BR", ordinal: true })).toBe("centésimo primeiro");
    expect(num2words(128n, { lang: "pt_BR", ordinal: true })).toBe("centésimo vigésimo oitavo");
    expect(num2words(713n, { lang: "pt_BR", ordinal: true })).toBe(
      "septigentésimo décimo terceiro",
    );
    expect(num2words(1000n, { lang: "pt_BR", ordinal: true })).toBe("milésimo");
    expect(num2words(1001n, { lang: "pt_BR", ordinal: true })).toBe("milésimo primeiro");
    expect(num2words(1111n, { lang: "pt_BR", ordinal: true })).toBe(
      "milésimo centésimo décimo primeiro",
    );
    expect(num2words(2114n, { lang: "pt_BR", ordinal: true })).toBe(
      "segundo milésimo centésimo décimo quarto",
    );
    expect(num2words(73421n, { lang: "pt_BR", ordinal: true })).toBe(
      "septuagésimo terceiro milésimo quadrigentésimo vigésimo primeiro",
    );
    expect(num2words(100000n, { lang: "pt_BR", ordinal: true })).toBe("centésimo milésimo");
    expect(num2words(250050n, { lang: "pt_BR", ordinal: true })).toBe(
      "ducentésimo quinquagésimo milésimo quinquagésimo",
    );
    expect(num2words(6000000n, { lang: "pt_BR", ordinal: true })).toBe("sexto milionésimo");
    expect(num2words(19000000000n, { lang: "pt_BR", ordinal: true })).toBe(
      "décimo nono bilionésimo",
    );
    expect(num2words(145000000002n, { lang: "pt_BR", ordinal: true })).toBe(
      "centésimo quadragésimo quinto bilionésimo segundo",
    );
  });

  test("test_currency_integer", () => {
    expect(n2w.toCurrency(1n)).toBe("um real");
    expect(n2w.toCurrency(2n)).toBe("dois reais");
    expect(n2w.toCurrency(3n)).toBe("três reais");
    expect(n2w.toCurrency(4n)).toBe("quatro reais");
    expect(n2w.toCurrency(5n)).toBe("cinco reais");
    expect(n2w.toCurrency(6n)).toBe("seis reais");
    expect(n2w.toCurrency(7n)).toBe("sete reais");
    expect(n2w.toCurrency(8n)).toBe("oito reais");
    expect(n2w.toCurrency(9n)).toBe("nove reais");
    expect(n2w.toCurrency(10n)).toBe("dez reais");
    expect(n2w.toCurrency(11n)).toBe("onze reais");
    expect(n2w.toCurrency(12n)).toBe("doze reais");
    expect(n2w.toCurrency(13n)).toBe("treze reais");
    expect(n2w.toCurrency(14n)).toBe("catorze reais");
    expect(n2w.toCurrency(15n)).toBe("quinze reais");
    expect(n2w.toCurrency(16n)).toBe("dezesseis reais");
    expect(n2w.toCurrency(17n)).toBe("dezessete reais");
    expect(n2w.toCurrency(18n)).toBe("dezoito reais");
    expect(n2w.toCurrency(19n)).toBe("dezenove reais");
    expect(n2w.toCurrency(20n)).toBe("vinte reais");
    expect(n2w.toCurrency(21n)).toBe("vinte e um reais");
    expect(n2w.toCurrency(22n)).toBe("vinte e dois reais");
    expect(n2w.toCurrency(35n)).toBe("trinta e cinco reais");
    expect(n2w.toCurrency(99n)).toBe("noventa e nove reais");
    expect(n2w.toCurrency(100n)).toBe("cem reais");
    expect(n2w.toCurrency(101n)).toBe("cento e um reais");
    expect(n2w.toCurrency(128n)).toBe("cento e vinte e oito reais");
    expect(n2w.toCurrency(713n)).toBe("setecentos e treze reais");
    expect(n2w.toCurrency(1000n)).toBe("mil reais");
    expect(n2w.toCurrency(1001n)).toBe("mil e um reais");
    expect(n2w.toCurrency(1111n)).toBe("mil, cento e onze reais");
    expect(n2w.toCurrency(2114n)).toBe("dois mil, cento e catorze reais");
    expect(n2w.toCurrency(73421n)).toBe("setenta e três mil, quatrocentos e vinte e um reais");
    expect(n2w.toCurrency(100000n)).toBe("cem mil reais");
    expect(n2w.toCurrency(250050n)).toBe("duzentos e cinquenta mil e cinquenta reais");
    expect(n2w.toCurrency(6000000n)).toBe("seis milhões de reais");
    expect(n2w.toCurrency(19000000000n)).toBe("dezenove bilhões de reais");
    expect(n2w.toCurrency(145000000002n)).toBe("cento e quarenta e cinco bilhões e dois reais");
  });

  test("test_currency_integer_negative", () => {
    expect(n2w.toCurrency(-1n)).toBe("menos um real");
    expect(n2w.toCurrency(-256n)).toBe("menos duzentos e cinquenta e seis reais");
    expect(n2w.toCurrency(-1000n)).toBe("menos mil reais");
    expect(n2w.toCurrency(-1000000n)).toBe("menos um milhão de reais");
    expect(n2w.toCurrency(-1234567n)).toBe(
      "menos um milhão, duzentos e trinta e quatro mil, quinhentos e sessenta e sete reais",
    );
  });

  test("test_currency_float", () => {
    expect(n2w.toCurrency(new Decimal("1.00"))).toBe("um real");
    expect(n2w.toCurrency(new Decimal("1.01"))).toBe("um real e um centavo");
    expect(n2w.toCurrency(new Decimal("1.03"))).toBe("um real e três centavos");
    expect(n2w.toCurrency(new Decimal("1.35"))).toBe("um real e trinta e cinco centavos");
    expect(n2w.toCurrency(new Decimal("3.14"))).toBe("três reais e catorze centavos");
    expect(n2w.toCurrency(new Decimal("101.22"))).toBe("cento e um reais e vinte e dois centavos");
    expect(n2w.toCurrency(new Decimal("2345.75"))).toBe(
      "dois mil, trezentos e quarenta e cinco reais e setenta e cinco centavos",
    );
  });

  test("test_currency_float_negative", () => {
    expect(n2w.toCurrency(new Decimal("-2.34"))).toBe(
      "menos dois reais e trinta e quatro centavos",
    );
    expect(n2w.toCurrency(new Decimal("-9.99"))).toBe("menos nove reais e noventa e nove centavos");
    expect(n2w.toCurrency(new Decimal("-7.01"))).toBe("menos sete reais e um centavo");
    expect(n2w.toCurrency(new Decimal("-222.22"))).toBe(
      "menos duzentos e vinte e dois reais e vinte e dois centavos",
    );
  });

  test("test_year", () => {
    expect(n2w.toYear(1001n)).toBe("mil e um");
    expect(n2w.toYear(1789n)).toBe("mil, setecentos e oitenta e nove");
    expect(n2w.toYear(1942n)).toBe("mil, novecentos e quarenta e dois");
    expect(n2w.toYear(1984n)).toBe("mil, novecentos e oitenta e quatro");
    expect(n2w.toYear(2000n)).toBe("dois mil");
    expect(n2w.toYear(2001n)).toBe("dois mil e um");
    expect(n2w.toYear(2016n)).toBe("dois mil e dezesseis");
  });

  test("test_year_negative", () => {
    expect(n2w.toYear(-30n)).toBe("trinta antes de Cristo");
    expect(n2w.toYear(-744n)).toBe("setecentos e quarenta e quatro antes de Cristo");
    expect(n2w.toYear(-10000n)).toBe("dez mil antes de Cristo");
  });
});
