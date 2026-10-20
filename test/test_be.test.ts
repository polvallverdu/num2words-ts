// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2023, Sergei Ruzki/Ivan Shakh  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_be.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words } from "../src/index.ts";

describe("Num2WordsBYTest", () => {
  test("test_cardinal", () => {
    expect(num2words(100n, { lang: "be" })).toBe("сто");
    expect(num2words(101n, { lang: "be" })).toBe("сто адзін");
    expect(num2words(110n, { lang: "be" })).toBe("сто дзесяць");
    expect(num2words(115n, { lang: "be" })).toBe("сто пятнаццаць");
    expect(num2words(123n, { lang: "be" })).toBe("сто дваццаць тры");
    expect(num2words(1000n, { lang: "be" })).toBe("адна тысяча");
    expect(num2words(1001n, { lang: "be" })).toBe("адна тысяча адзін");
    expect(num2words(2012n, { lang: "be" })).toBe("дзве тысячы дванаццаць");
    expect(num2words(12519.85, { lang: "be" })).toBe(
      "дванаццаць тысяч пяцьсот дзевятнаццаць коска восемдзесят пяць",
    );
    expect(num2words(1234567890n, { lang: "be" })).toBe(
      "адзін мільярд дзвесце трыццаць чатыры мільёны пяцьсот шэсцьдзясят сем тысяч восемсот дзевяноста",
    );
    expect(num2words(461407892039002157189883901676n, { lang: "be" })).toBe(
      "чатырыста шэсцьдзясят адзін актыльён чатырыста сем сэптыльёнаў восемсот дзевяноста два секстыльёны трыццаць дзевяць квінтыльёнаў два квадрыльёны сто пяцьдзясят сем трыльёнаў сто восемдзесят дзевяць мільярдаў восемсот восемдзесят тры мільёны дзевяцьсот адна тысяча шэсцьсот семдзесят шэсць",
    );
    expect(num2words(94234693663034822824384220291n, { lang: "be" })).toBe(
      "дзевяноста чатыры актыльёны дзвесце трыццаць чатыры сэптыльёны шэсцьсот дзевяноста тры секстыльёны шэсцьсот шэсцьдзясят тры квінтыльёны трыццаць чатыры квадрыльёны восемсот дваццаць два трыльёны восемсот дваццаць чатыры мільярды трыста восемдзесят чатыры мільёны дзвесце дваццаць тысяч дзвесце дзевяноста адзін",
    );
    expect(num2words(5n, { lang: "be" })).toBe("пяць");
    expect(num2words(15n, { lang: "be" })).toBe("пятнаццаць");
    expect(num2words(154n, { lang: "be" })).toBe("сто пяцьдзясят чатыры");
    expect(num2words(1135n, { lang: "be" })).toBe("адна тысяча сто трыццаць пяць");
    expect(num2words(418531n, { lang: "be" })).toBe(
      "чатырыста васямнаццаць тысяч пяцьсот трыццаць адзін",
    );
    expect(num2words(1000139n, { lang: "be" })).toBe("адзін мільён сто трыццаць дзевяць");
    expect(num2words(-1n, { lang: "be" })).toBe("мінус адзін");
    expect(num2words(-15n, { lang: "be" })).toBe("мінус пятнаццаць");
    expect(num2words(-100n, { lang: "be" })).toBe("мінус сто");
  });

  test("test_floating_point", () => {
    expect(num2words(5.2, { lang: "be" })).toBe("пяць коска два");
    expect(num2words(10.02, { lang: "be" })).toBe("дзесяць коска нуль два");
    expect(num2words(15.007, { lang: "be" })).toBe("пятнаццаць коска нуль нуль сем");
    expect(num2words(561.42, { lang: "be" })).toBe("пяцьсот шэсцьдзясят адзін коска сорак два");
    expect(num2words(asFloat(561.0), { lang: "be" })).toBe("пяцьсот шэсцьдзясят адзін коска нуль");
  });

  test("test_to_ordinal", () => {
    expect(num2words(1n, { lang: "be", to: "ordinal" })).toBe("першы");
    expect(num2words(5n, { lang: "be", to: "ordinal" })).toBe("пяты");
    expect(num2words(6n, { lang: "be", to: "ordinal" })).toBe("шосты");
    expect(num2words(10n, { lang: "be", to: "ordinal" })).toBe("дзясяты");
    expect(num2words(13n, { lang: "be", to: "ordinal" })).toBe("трынаццаты");
    expect(num2words(20n, { lang: "be", to: "ordinal" })).toBe("дваццаты");
    expect(num2words(23n, { lang: "be", to: "ordinal" })).toBe("дваццаць трэці");
    expect(num2words(23n, { lang: "be", to: "ordinal", gender: "f" })).toBe("дваццаць трэцяя");
    expect(num2words(23n, { lang: "be", to: "ordinal", gender: true })).toBe("дваццаць трэцяя");
    expect(num2words(23n, { lang: "be", to: "ordinal", gender: "n" })).toBe("дваццаць трэцяе");
    expect(num2words(46n, { lang: "be", to: "ordinal", gender: "m" })).toBe("сорак шосты");
    expect(num2words(40n, { lang: "be", to: "ordinal" })).toBe("саракавы");
    expect(num2words(61n, { lang: "be", to: "ordinal" })).toBe("шэсцьдзясят першы");
    expect(num2words(70n, { lang: "be", to: "ordinal" })).toBe("сямідзясяты");
    expect(num2words(100n, { lang: "be", to: "ordinal" })).toBe("соты");
    expect(num2words(136n, { lang: "be", to: "ordinal" })).toBe("сто трыццаць шосты");
    expect(num2words(500n, { lang: "be", to: "ordinal" })).toBe("пяцісоты");
    expect(num2words(500n, { lang: "be", to: "ordinal", gender: "f" })).toBe("пяцісотая");
    expect(num2words(500n, { lang: "be", to: "ordinal", gender: "n" })).toBe("пяцісотае");
    expect(num2words(1000n, { lang: "be", to: "ordinal" })).toBe("тысячны");
    expect(num2words(1000n, { lang: "be", to: "ordinal", gender: "f" })).toBe("тысячная");
    expect(num2words(1000n, { lang: "be", to: "ordinal", gender: "n" })).toBe("тысячнае");
    expect(num2words(1001n, { lang: "be", to: "ordinal" })).toBe("тысяча першы");
    expect(num2words(3000n, { lang: "be", to: "ordinal" })).toBe("трохтысячны");
    expect(num2words(10000n, { lang: "be", to: "ordinal" })).toBe("дзесяцітысячны");
    expect(num2words(30000n, { lang: "be", to: "ordinal" })).toBe("трыццацітысячны");
    expect(num2words(42000n, { lang: "be", to: "ordinal" })).toBe("саракадвухтысячны");
    expect(num2words(75000n, { lang: "be", to: "ordinal" })).toBe("сямідзесяціпяцітысячны");
    expect(num2words(1000000n, { lang: "be", to: "ordinal" })).toBe("мільённы");
    expect(num2words(30000000n, { lang: "be", to: "ordinal" })).toBe("трыццацімільённы");
    expect(num2words(1000000000n, { lang: "be", to: "ordinal" })).toBe("мільярдны");
    expect(num2words(3000000000n, { lang: "be", to: "ordinal" })).toBe("трохмільярдны");
    expect(num2words(43000000000n, { lang: "be", to: "ordinal" })).toBe("саракатрохмільярдны");
    expect(num2words(333000000000n, { lang: "be", to: "ordinal" })).toBe(
      "трыстатрыццацітрохмільярдны",
    );
  });

  test("test_to_currency", () => {
    expect(num2words(asFloat(1.0), { lang: "be", to: "currency", currency: "EUR" })).toBe(
      "адзін еўра, нуль цэнтаў",
    );
    expect(num2words(asFloat(1.0), { lang: "be", to: "currency", currency: "RUB" })).toBe(
      "адзін расійскі рубель, нуль капеек",
    );
    expect(num2words(asFloat(1.0), { lang: "be", to: "currency", currency: "BYN" })).toBe(
      "адзін беларускі рубель, нуль капеек",
    );
    expect(num2words(asFloat(1.0), { lang: "be", to: "currency", currency: "UAH" })).toBe(
      "адна грыўна, нуль капеек",
    );
    expect(num2words(1234.56, { lang: "be", to: "currency", currency: "EUR" })).toBe(
      "адна тысяча дзвесце трыццаць чатыры еўра, пяцьдзясят шэсць цэнтаў",
    );
    expect(num2words(1234.56, { lang: "be", to: "currency", currency: "RUB" })).toBe(
      "адна тысяча дзвесце трыццаць чатыры расійскія рублі, пяцьдзясят шэсць капеек",
    );
    expect(num2words(1234.56, { lang: "be", to: "currency", currency: "BYN" })).toBe(
      "адна тысяча дзвесце трыццаць чатыры беларускія рублі, пяцьдзясят шэсць капеек",
    );
    expect(num2words(1234.56, { lang: "be", to: "currency", currency: "UAH" })).toBe(
      "адна тысяча дзвесце трыццаць чатыры грыўны, пяцьдзясят шэсць капеек",
    );
    expect(
      num2words(10111n, { lang: "be", to: "currency", currency: "EUR", separator: " і" }),
    ).toBe("сто адзін еўра і адзінаццаць цэнтаў");
    expect(
      num2words(10111n, { lang: "be", to: "currency", currency: "RUB", separator: " і" }),
    ).toBe("сто адзін расійскі рубель і адзінаццаць капеек");
    expect(
      num2words(10111n, { lang: "be", to: "currency", currency: "BYN", separator: " і" }),
    ).toBe("сто адзін беларускі рубель і адзінаццаць капеек");
    expect(
      num2words(10111n, { lang: "be", to: "currency", currency: "UAH", separator: " і" }),
    ).toBe("сто адна грыўна і адзінаццаць капеек");
    expect(
      num2words(10121n, { lang: "be", to: "currency", currency: "EUR", separator: " і" }),
    ).toBe("сто адзін еўра і дваццаць адзін цэнт");
    expect(
      num2words(10121n, { lang: "be", to: "currency", currency: "RUB", separator: " і" }),
    ).toBe("сто адзін расійскі рубель і дваццаць адна капейка");
    expect(
      num2words(10121n, { lang: "be", to: "currency", currency: "BYN", separator: " і" }),
    ).toBe("сто адзін беларускі рубель і дваццаць адна капейка");
    expect(
      num2words(10121n, { lang: "be", to: "currency", currency: "UAH", separator: " і" }),
    ).toBe("сто адна грыўна і дваццаць адна капейка");
    expect(
      num2words(10122n, { lang: "be", to: "currency", currency: "EUR", separator: " і" }),
    ).toBe("сто адзін еўра і дваццаць два цэнты");
    expect(
      num2words(10122n, { lang: "be", to: "currency", currency: "RUB", separator: " і" }),
    ).toBe("сто адзін расійскі рубель і дваццаць дзве капейкі");
    expect(
      num2words(10122n, { lang: "be", to: "currency", currency: "BYN", separator: " і" }),
    ).toBe("сто адзін беларускі рубель і дваццаць дзве капейкі");
    expect(
      num2words(10122n, { lang: "be", to: "currency", currency: "UAH", separator: " і" }),
    ).toBe("сто адна грыўна і дваццаць дзве капейкі");
    expect(
      num2words(10122n, { lang: "be", to: "currency", currency: "KZT", separator: " і" }),
    ).toBe("сто адзін тэнге і дваццаць два тыйіны");
    expect(
      num2words(-1251985n, { lang: "be", to: "currency", currency: "EUR", cents: false }),
    ).toBe("мінус дванаццаць тысяч пяцьсот дзевятнаццаць еўра, 85 цэнтаў");
    expect(
      num2words(-1251985n, { lang: "be", to: "currency", currency: "RUB", cents: false }),
    ).toBe("мінус дванаццаць тысяч пяцьсот дзевятнаццаць расійскіх рублёў, 85 капеек");
    expect(
      num2words(-1251985n, { lang: "be", to: "currency", currency: "BYN", cents: false }),
    ).toBe("мінус дванаццаць тысяч пяцьсот дзевятнаццаць беларускіх рублёў, 85 капеек");
    expect(
      num2words(-1251985n, { lang: "be", to: "currency", currency: "UAH", cents: false }),
    ).toBe("мінус дванаццаць тысяч пяцьсот дзевятнаццаць грыўнаў, 85 капеек");
    expect(
      num2words("38.4", {
        lang: "be",
        to: "currency",
        separator: " і",
        cents: false,
        currency: "EUR",
      }),
    ).toBe("трыццаць восем еўра і 40 цэнтаў");
    expect(
      num2words("38.4", {
        lang: "be",
        to: "currency",
        separator: " і",
        cents: false,
        currency: "RUB",
      }),
    ).toBe("трыццаць восем расійскіх рублёў і 40 капеек");
    expect(
      num2words("38.4", {
        lang: "be",
        to: "currency",
        separator: " і",
        cents: false,
        currency: "UAH",
      }),
    ).toBe("трыццаць восем грыўнаў і 40 капеек");
    expect(num2words("1230.56", { lang: "be", to: "currency", currency: "USD" })).toBe(
      "адна тысяча дзвесце трыццаць долараў, пяцьдзясят шэсць цэнтаў",
    );
    expect(num2words("1231.56", { lang: "be", to: "currency", currency: "USD" })).toBe(
      "адна тысяча дзвесце трыццаць адзін долар, пяцьдзясят шэсць цэнтаў",
    );
    expect(num2words("1234.56", { lang: "be", to: "currency", currency: "USD" })).toBe(
      "адна тысяча дзвесце трыццаць чатыры долары, пяцьдзясят шэсць цэнтаў",
    );
    expect(
      num2words(10122n, { lang: "be", to: "currency", currency: "UZS", separator: " і" }),
    ).toBe("сто адзін сум і дваццаць два тыйіны");
    expect(num2words(asFloat(1.0), { lang: "be", to: "currency", currency: "PLN" })).toBe(
      "адзін злоты, нуль грошаў",
    );
    expect(num2words(23.4, { lang: "be", to: "currency", currency: "PLN" })).toBe(
      "дваццаць тры злотых, сорак грошаў",
    );
    expect(num2words(9999.39, { lang: "be", to: "currency", currency: "PLN" })).toBe(
      "дзевяць тысяч дзевяцьсот дзевяноста дзевяць злотых, трыццаць дзевяць грошаў",
    );
  });
});
