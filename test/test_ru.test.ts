// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_ru.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words } from "../src/index.ts";

describe("Num2WordsRUTest", () => {
  test("test_cardinal", () => {
    expect(num2words(100, { lang: "ru" })).toBe("сто");
    expect(num2words(101, { lang: "ru" })).toBe("сто один");
    expect(num2words(110, { lang: "ru" })).toBe("сто десять");
    expect(num2words(115, { lang: "ru" })).toBe("сто пятнадцать");
    expect(num2words(123, { lang: "ru" })).toBe("сто двадцать три");
    expect(num2words(1000, { lang: "ru" })).toBe("одна тысяча");
    expect(num2words(1001, { lang: "ru" })).toBe("одна тысяча один");
    expect(num2words(2012, { lang: "ru" })).toBe("две тысячи двенадцать");
    expect(num2words(12519.85, { lang: "ru" })).toBe(
      "двенадцать тысяч пятьсот девятнадцать целых восемьдесят пять сотых",
    );
    expect(num2words(1234567890, { lang: "ru" })).toBe(
      "один миллиард двести тридцать четыре миллиона пятьсот шестьдесят семь тысяч восемьсот девяносто",
    );
    expect(num2words(215461407892039002157189883901676n, { lang: "ru" })).toBe(
      "двести пятнадцать нониллионов четыреста шестьдесят один октиллион четыреста семь септиллионов восемьсот девяносто два секстиллиона тридцать девять квинтиллионов два квадриллиона сто пятьдесят семь триллионов сто восемьдесят девять миллиардов восемьсот восемьдесят три миллиона девятьсот одна тысяча шестьсот семьдесят шесть",
    );
    expect(num2words(719094234693663034822824384220291n, { lang: "ru" })).toBe(
      "семьсот девятнадцать нониллионов девяносто четыре октиллиона двести тридцать четыре септиллиона шестьсот девяносто три секстиллиона шестьсот шестьдесят три квинтиллиона тридцать четыре квадриллиона восемьсот двадцать два триллиона восемьсот двадцать четыре миллиарда триста восемьдесят четыре миллиона двести двадцать тысяч двести девяносто один",
    );
    expect(num2words(5, { lang: "ru" })).toBe("пять");
    expect(num2words(15, { lang: "ru" })).toBe("пятнадцать");
    expect(num2words(154, { lang: "ru" })).toBe("сто пятьдесят четыре");
    expect(num2words(1135, { lang: "ru" })).toBe("одна тысяча сто тридцать пять");
    expect(num2words(418531, { lang: "ru" })).toBe(
      "четыреста восемнадцать тысяч пятьсот тридцать один",
    );
    expect(num2words(1000139, { lang: "ru" })).toBe("один миллион сто тридцать девять");
    expect(num2words(-1, { lang: "ru" })).toBe("минус один");
    expect(num2words(-15, { lang: "ru" })).toBe("минус пятнадцать");
    expect(num2words(-100, { lang: "ru" })).toBe("минус сто");
  });

  test("test_cardinal_feminine", () => {
    expect(num2words(1, { lang: "ru", gender: "f" })).toBe("одна");
    expect(num2words(2, { lang: "ru", gender: "f" })).toBe("две");
    expect(num2words(3, { lang: "ru", gender: "f" })).toBe("три");
    expect(num2words(100, { lang: "ru", gender: "f" })).toBe("сто");
    expect(num2words(101, { lang: "ru", gender: "f" })).toBe("сто одна");
    expect(num2words(110, { lang: "ru", gender: "f" })).toBe("сто десять");
    expect(num2words(115, { lang: "ru", gender: "f" })).toBe("сто пятнадцать");
    expect(num2words(122, { lang: "ru", gender: "f" })).toBe("сто двадцать две");
    expect(num2words(125.1, { lang: "ru", gender: "f" })).toBe(
      "сто двадцать пять целых одна десятая",
    );
    expect(num2words(-1, { lang: "ru", gender: "f" })).toBe("минус одна");
    expect(num2words(-100, { lang: "ru", gender: "f" })).toBe("минус сто");
  });

  test("test_cardinal_neuter", () => {
    expect(num2words(1, { lang: "ru", gender: "n" })).toBe("одно");
    expect(num2words(2, { lang: "ru", gender: "n" })).toBe("два");
    expect(num2words(3, { lang: "ru", gender: "n" })).toBe("три");
    expect(num2words(100, { lang: "ru", gender: "n" })).toBe("сто");
    expect(num2words(101, { lang: "ru", gender: "n" })).toBe("сто одно");
    expect(num2words(110, { lang: "ru", gender: "n" })).toBe("сто десять");
    expect(num2words(115, { lang: "ru", gender: "n" })).toBe("сто пятнадцать");
    expect(num2words(122, { lang: "ru", gender: "n" })).toBe("сто двадцать два");
    expect(num2words(125.1, { lang: "ru", gender: "n" })).toBe(
      "сто двадцать пять целых одна десятая",
    );
    expect(num2words(-1, { lang: "ru", gender: "n" })).toBe("минус одно");
    expect(num2words(-100, { lang: "ru", gender: "n" })).toBe("минус сто");
  });

  test("test_floating_point", () => {
    expect(num2words(5.2, { lang: "ru" })).toBe("пять целых две десятых");
    expect(num2words(asFloat(5), { lang: "ru" })).toBe("пять целых ноль десятых");
    expect(num2words(5.1, { lang: "ru" })).toBe("пять целых одна десятая");
    expect(num2words("5.10", { lang: "ru" })).toBe("пять целых десять сотых");
    expect(num2words(1.001, { lang: "ru" })).toBe("одна целая одна тысячная");
    expect(num2words(1.011, { lang: "ru" })).toBe("одна целая одиннадцать тысячных");
    expect(num2words(10.02, { lang: "ru" })).toBe("десять целых две сотых");
    expect(num2words(15.007, { lang: "ru" })).toBe("пятнадцать целых семь тысячных");
    expect(num2words(561.42, { lang: "ru" })).toBe("пятьсот шестьдесят одна целая сорок две сотых");
    expect(num2words(561.00001, { lang: "ru" })).toBe(
      "пятьсот шестьдесят одна целая одна стотысячная",
    );
  });

  test("test_to_ordinal", () => {
    expect(num2words(0, { lang: "ru", to: "ordinal" })).toBe("нулевой");
    expect(num2words(1, { lang: "ru", to: "ordinal" })).toBe("первый");
    expect(num2words(5, { lang: "ru", to: "ordinal" })).toBe("пятый");
    expect(num2words(10, { lang: "ru", to: "ordinal" })).toBe("десятый");
    expect(num2words(13, { lang: "ru", to: "ordinal" })).toBe("тринадцатый");
    expect(num2words(20, { lang: "ru", to: "ordinal" })).toBe("двадцатый");
    expect(num2words(23, { lang: "ru", to: "ordinal" })).toBe("двадцать третий");
    expect(num2words(40, { lang: "ru", to: "ordinal" })).toBe("сороковой");
    expect(num2words(70, { lang: "ru", to: "ordinal" })).toBe("семидесятый");
    expect(num2words(100, { lang: "ru", to: "ordinal" })).toBe("сотый");
    expect(num2words(136, { lang: "ru", to: "ordinal" })).toBe("сто тридцать шестой");
    expect(num2words(500, { lang: "ru", to: "ordinal" })).toBe("пятисотый");
    expect(num2words(1000, { lang: "ru", to: "ordinal" })).toBe("тысячный");
    expect(num2words(1001, { lang: "ru", to: "ordinal" })).toBe("тысяча первый");
    expect(num2words(1060, { lang: "ru", to: "ordinal" })).toBe("тысяча шестидесятый");
    expect(num2words(2000, { lang: "ru", to: "ordinal" })).toBe("двухтысячный");
    expect(num2words(10000, { lang: "ru", to: "ordinal" })).toBe("десятитысячный");
    expect(num2words(90000, { lang: "ru", to: "ordinal" })).toBe("девяностотысячный");
    expect(num2words(21000, { lang: "ru", to: "ordinal" })).toBe("двадцатиоднотысячный");
    expect(num2words(130000, { lang: "ru", to: "ordinal" })).toBe("стотридцатитысячный");
    expect(num2words(135000, { lang: "ru", to: "ordinal" })).toBe("стотридцатипятитысячный");
    expect(num2words(135100, { lang: "ru", to: "ordinal" })).toBe("сто тридцать пять тысяч сотый");
    expect(num2words(135120, { lang: "ru", to: "ordinal" })).toBe(
      "сто тридцать пять тысяч сто двадцатый",
    );
    expect(num2words(135121, { lang: "ru", to: "ordinal" })).toBe(
      "сто тридцать пять тысяч сто двадцать первый",
    );
    expect(num2words(190000, { lang: "ru", to: "ordinal" })).toBe("стодевяностотысячный");
    expect(num2words(1000000, { lang: "ru", to: "ordinal" })).toBe("миллионный");
    expect(num2words(2000000, { lang: "ru", to: "ordinal" })).toBe("двухмиллионный");
    expect(num2words(5135000, { lang: "ru", to: "ordinal" })).toBe(
      "пять миллионов стотридцатипятитысячный",
    );
    expect(num2words(21000000, { lang: "ru", to: "ordinal" })).toBe("двадцатиодномиллионный");
    expect(num2words(1000000000, { lang: "ru", to: "ordinal" })).toBe("миллиардный");
    expect(num2words(123456000000, { lang: "ru", to: "ordinal" })).toBe(
      "сто двадцать три миллиарда четырёхсотпятидесятишестимиллионный",
    );
  });

  test("test_to_ordinal_feminine", () => {
    expect(num2words(1, { lang: "ru", to: "ordinal", gender: "f" })).toBe("первая");
    expect(num2words(3, { lang: "ru", to: "ordinal", gender: "f" })).toBe("третья");
    expect(num2words(10, { lang: "ru", to: "ordinal", gender: "f" })).toBe("десятая");
    expect(num2words(23, { lang: "ru", to: "ordinal", gender: "f" })).toBe("двадцать третья");
    expect(num2words(1000, { lang: "ru", to: "ordinal", gender: "f" })).toBe("тысячная");
    expect(num2words(2000000, { lang: "ru", to: "ordinal", gender: "f" })).toBe("двухмиллионная");
  });

  test("test_to_ordinal_neuter", () => {
    expect(num2words(1, { lang: "ru", to: "ordinal", gender: "n" })).toBe("первое");
    expect(num2words(3, { lang: "ru", to: "ordinal", gender: "n" })).toBe("третье");
    expect(num2words(10, { lang: "ru", to: "ordinal", gender: "n" })).toBe("десятое");
    expect(num2words(23, { lang: "ru", to: "ordinal", gender: "n" })).toBe("двадцать третье");
    expect(num2words(1000, { lang: "ru", to: "ordinal", gender: "n" })).toBe("тысячное");
    expect(num2words(2000000, { lang: "ru", to: "ordinal", gender: "n" })).toBe("двухмиллионное");
  });

  test("test_cardinal_cases", () => {
    expect(num2words(1, { lang: "ru", case: "nominative" })).toBe("один");
    expect(num2words(1, { lang: "ru", case: "genitive" })).toBe("одного");
    expect(num2words(1, { lang: "ru", case: "a", plural: true, animate: false })).toBe("одни");
    expect(num2words(2, { lang: "ru", case: "a", gender: "f", animate: true })).toBe("двух");
    expect(num2words(2, { lang: "ru", case: "a", gender: "f", animate: false })).toBe("две");
    expect(num2words(100, { lang: "ru", case: "g" })).toBe("ста");
    expect(num2words(122, { lang: "ru", case: "d" })).toBe("ста двадцати двум");
    expect(num2words(1000, { lang: "ru", case: "p" })).toBe("одной тысяче");
    expect(num2words(1122, { lang: "ru", case: "p" })).toBe("одной тысяче ста двадцати двух");
    expect(num2words(1211, { lang: "ru", case: "i", gender: "f" })).toBe(
      "одной тысячей двумястами одиннадцатью",
    );
    expect(num2words(5121000, { lang: "ru", case: "i" })).toBe(
      "пятью миллионами ста двадцатью одной тысячей",
    );
  });

  test("test_ordinal_cases", () => {
    expect(num2words(1, { lang: "ru", to: "ordinal", case: "nominative" })).toBe("первый");
    expect(num2words(1, { lang: "ru", to: "ordinal", case: "genitive" })).toBe("первого");
    expect(
      num2words(1, { lang: "ru", to: "ordinal", case: "a", plural: true, animate: false }),
    ).toBe("первые");
    expect(num2words(2, { lang: "ru", to: "ordinal", case: "a", gender: "f", animate: true })).toBe(
      "вторую",
    );
    expect(
      num2words(2, { lang: "ru", to: "ordinal", case: "a", gender: "f", animate: false }),
    ).toBe("вторую");
    expect(num2words(100, { lang: "ru", to: "ordinal", case: "g" })).toBe("сотого");
    expect(num2words(122, { lang: "ru", to: "ordinal", case: "d" })).toBe("сто двадцать второму");
    expect(num2words(1000, { lang: "ru", to: "ordinal", case: "p" })).toBe("тысячном");
    expect(num2words(1122, { lang: "ru", to: "ordinal", case: "p" })).toBe(
      "тысяча сто двадцать втором",
    );
    expect(num2words(1211, { lang: "ru", to: "ordinal", case: "i", gender: "f" })).toBe(
      "тысяча двести одиннадцатой",
    );
    expect(num2words(5121000, { lang: "ru", to: "ordinal", case: "i" })).toBe(
      "пять миллионов стодвадцатиоднотысячным",
    );
  });

  test("test_to_currency", () => {
    expect(num2words(asFloat(1), { lang: "ru", to: "currency", currency: "EUR" })).toBe(
      "один евро, ноль центов",
    );
    expect(num2words(asFloat(1), { lang: "ru", to: "currency", currency: "RUB" })).toBe(
      "один рубль, ноль копеек",
    );
    expect(num2words(asFloat(1), { lang: "ru", to: "currency", currency: "UAH" })).toBe(
      "одна гривна, ноль копеек",
    );
    expect(num2words(1234.56, { lang: "ru", to: "currency", currency: "EUR" })).toBe(
      "одна тысяча двести тридцать четыре евро, пятьдесят шесть центов",
    );
    expect(num2words(1234.56, { lang: "ru", to: "currency", currency: "RUB" })).toBe(
      "одна тысяча двести тридцать четыре рубля, пятьдесят шесть копеек",
    );
    expect(num2words(1234.56, { lang: "ru", to: "currency", currency: "UAH" })).toBe(
      "одна тысяча двести тридцать четыре гривны, пятьдесят шесть копеек",
    );
    expect(num2words(10111, { lang: "ru", to: "currency", currency: "EUR", separator: " и" })).toBe(
      "сто один евро и одиннадцать центов",
    );
    expect(num2words(10111, { lang: "ru", to: "currency", currency: "RUB", separator: " и" })).toBe(
      "сто один рубль и одиннадцать копеек",
    );
    expect(num2words(10111, { lang: "ru", to: "currency", currency: "UAH", separator: " и" })).toBe(
      "сто одна гривна и одиннадцать копеек",
    );
    expect(num2words(10121, { lang: "ru", to: "currency", currency: "EUR", separator: " и" })).toBe(
      "сто один евро и двадцать один цент",
    );
    expect(num2words(10121, { lang: "ru", to: "currency", currency: "RUB", separator: " и" })).toBe(
      "сто один рубль и двадцать одна копейка",
    );
    expect(num2words(10121, { lang: "ru", to: "currency", currency: "UAH", separator: " и" })).toBe(
      "сто одна гривна и двадцать одна копейка",
    );
    expect(num2words(10122, { lang: "ru", to: "currency", currency: "EUR", separator: " и" })).toBe(
      "сто один евро и двадцать два цента",
    );
    expect(num2words(10122, { lang: "ru", to: "currency", currency: "RUB", separator: " и" })).toBe(
      "сто один рубль и двадцать две копейки",
    );
    expect(num2words(10122, { lang: "ru", to: "currency", currency: "UAH", separator: " и" })).toBe(
      "сто одна гривна и двадцать две копейки",
    );
    expect(num2words(-1251985, { lang: "ru", to: "currency", currency: "EUR", cents: false })).toBe(
      "минус двенадцать тысяч пятьсот девятнадцать евро, 85 центов",
    );
    expect(num2words(-1251985, { lang: "ru", to: "currency", currency: "RUB", cents: false })).toBe(
      "минус двенадцать тысяч пятьсот девятнадцать рублей, 85 копеек",
    );
    expect(num2words(-1251985, { lang: "ru", to: "currency", currency: "UAH", cents: false })).toBe(
      "минус двенадцать тысяч пятьсот девятнадцать гривен, 85 копеек",
    );
    expect(
      num2words("38.4", {
        lang: "ru",
        to: "currency",
        separator: " и",
        cents: false,
        currency: "EUR",
      }),
    ).toBe("тридцать восемь евро и 40 центов");
    expect(
      num2words("38.4", {
        lang: "ru",
        to: "currency",
        separator: " и",
        cents: false,
        currency: "RUB",
      }),
    ).toBe("тридцать восемь рублей и 40 копеек");
    expect(
      num2words("38.4", {
        lang: "ru",
        to: "currency",
        separator: " и",
        cents: false,
        currency: "UAH",
      }),
    ).toBe("тридцать восемь гривен и 40 копеек");
    expect(num2words("1230.56", { lang: "ru", to: "currency", currency: "USD" })).toBe(
      "одна тысяча двести тридцать долларов, пятьдесят шесть центов",
    );
    expect(num2words("1231.56", { lang: "ru", to: "currency", currency: "USD" })).toBe(
      "одна тысяча двести тридцать один доллар, пятьдесят шесть центов",
    );
    expect(num2words("1234.56", { lang: "ru", to: "currency", currency: "USD" })).toBe(
      "одна тысяча двести тридцать четыре доллара, пятьдесят шесть центов",
    );
    expect(num2words(10122, { lang: "ru", to: "currency", currency: "UZS", separator: " и" })).toBe(
      "сто один сум и двадцать два тийина",
    );
  });
});
