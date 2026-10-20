// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_lt.py

import { describe, expect, test } from "bun:test";
import { asFloat, NotImplementedError, num2words } from "../src/index.ts";

describe("Num2WordsLTTest", () => {
  test("test_to_cardinal", () => {
    expect(num2words(100, { lang: "lt" })).toBe("vienas šimtas");
    expect(num2words(101, { lang: "lt" })).toBe("vienas šimtas vienas");
    expect(num2words(110, { lang: "lt" })).toBe("vienas šimtas dešimt");
    expect(num2words(115, { lang: "lt" })).toBe("vienas šimtas penkiolika");
    expect(num2words(123, { lang: "lt" })).toBe("vienas šimtas dvidešimt trys");
    expect(num2words(1000, { lang: "lt" })).toBe("vienas tūkstantis");
    expect(num2words(1001, { lang: "lt" })).toBe("vienas tūkstantis vienas");
    expect(num2words(2012, { lang: "lt" })).toBe("du tūkstančiai dvylika");
    expect(num2words(1234567890, { lang: "lt" })).toBe(
      "vienas milijardas du šimtai trisdešimt keturi milijonai penki šimtai šešiasdešimt septyni tūkstančiai aštuoni šimtai devyniasdešimt",
    );
    expect(num2words(215461407892039002157189883901676n, { lang: "lt" })).toBe(
      "du šimtai penkiolika naintilijonų keturi šimtai šešiasdešimt vienas oktilijonas keturi šimtai septyni septilijonai aštuoni šimtai devyniasdešimt du sikstilijonai trisdešimt devyni kvintilijonai du kvadrilijonai vienas šimtas penkiasdešimt septyni trilijonai vienas šimtas aštuoniasdešimt devyni milijardai aštuoni šimtai aštuoniasdešimt trys milijonai devyni šimtai vienas tūkstantis šeši šimtai septyniasdešimt šeši",
    );
    expect(num2words(719094234693663034822824384220291n, { lang: "lt" })).toBe(
      "septyni šimtai devyniolika naintilijonų devyniasdešimt keturi oktilijonai du šimtai trisdešimt keturi septilijonai šeši šimtai devyniasdešimt trys sikstilijonai šeši šimtai šešiasdešimt trys kvintilijonai trisdešimt keturi kvadrilijonai aštuoni šimtai dvidešimt du trilijonai aštuoni šimtai dvidešimt keturi milijardai trys šimtai aštuoniasdešimt keturi milijonai du šimtai dvidešimt tūkstančių du šimtai devyniasdešimt vienas",
    );
    expect(num2words(-5000, { lang: "lt" })).toBe("minus penki tūkstančiai");
    expect(num2words(-5000.22, { lang: "lt" })).toBe(
      "minus penki tūkstančiai kablelis dvidešimt du",
    );
    expect(num2words(10.02, { lang: "lt" })).toBe("dešimt kablelis nulis du");
    expect(num2words(15.007, { lang: "lt" })).toBe("penkiolika kablelis nulis nulis septyni");
  });

  test("test_to_ordinal", () => {
    expect(() => num2words(1, { lang: "lt", to: "ordinal" })).toThrow(NotImplementedError);
  });

  test("test_to_currency", () => {
    expect(num2words(asFloat(1), { lang: "lt", to: "currency", currency: "LTL" })).toBe(
      "vienas litas, nulis centų",
    );
    expect(num2words(10.01, { lang: "lt", to: "currency", currency: "LTL" })).toBe(
      "dešimt litų, vienas centas",
    );
    expect(num2words(1234.56, { lang: "lt", to: "currency", currency: "LTL" })).toBe(
      "vienas tūkstantis du šimtai trisdešimt keturi litai, penkiasdešimt šeši centai",
    );
    expect(num2words(-1251981, { lang: "lt", to: "currency", currency: "EUR", cents: false })).toBe(
      "minus dvylika tūkstančių penki šimtai devyniolika eurų, 81 centas",
    );
    expect(num2words(asFloat(1), { lang: "lt", to: "currency", currency: "EUR" })).toBe(
      "vienas euras, nulis centų",
    );
    expect(num2words(1234.56, { lang: "lt", to: "currency", currency: "EUR" })).toBe(
      "vienas tūkstantis du šimtai trisdešimt keturi eurai, penkiasdešimt šeši centai",
    );
    expect(num2words(1122.22, { lang: "lt", to: "currency", currency: "EUR" })).toBe(
      "vienas tūkstantis vienas šimtas dvidešimt du eurai, dvidešimt du centai",
    );
    expect(num2words(-1281, { lang: "lt", to: "currency", currency: "USD", cents: false })).toBe(
      "minus dvylika dolerių, 81 centas",
    );
    expect(num2words(asFloat(1), { lang: "lt", to: "currency", currency: "USD" })).toBe(
      "vienas doleris, nulis centų",
    );
    expect(num2words(5.06, { lang: "lt", to: "currency", currency: "USD" })).toBe(
      "penki doleriai, šeši centai",
    );
    expect(num2words(-1281, { lang: "lt", to: "currency", currency: "GBP", cents: false })).toBe(
      "minus dvylika svarų sterlingų, 81 pensas",
    );
    expect(num2words(asFloat(1), { lang: "lt", to: "currency", currency: "GBP" })).toBe(
      "vienas svaras sterlingų, nulis pensų",
    );
    expect(num2words(5.06, { lang: "lt", to: "currency", currency: "GBP" })).toBe(
      "penki svarai sterlingų, šeši pensai",
    );
    expect(num2words(-1281, { lang: "lt", to: "currency", currency: "PLN", cents: false })).toBe(
      "minus dvylika zlotų, 81 grašis",
    );
    expect(num2words(asFloat(1), { lang: "lt", to: "currency", currency: "PLN" })).toBe(
      "vienas zlotas, nulis grašių",
    );
    expect(num2words(5.06, { lang: "lt", to: "currency", currency: "PLN" })).toBe(
      "penki zlotai, šeši grašiai",
    );
    expect(num2words(-1281, { lang: "lt", to: "currency", currency: "RUB", cents: false })).toBe(
      "minus dvylika rublių, 81 kapeika",
    );
    expect(num2words(asFloat(1), { lang: "lt", to: "currency", currency: "RUB" })).toBe(
      "vienas rublis, nulis kapeikų",
    );
    expect(num2words(5.06, { lang: "lt", to: "currency", currency: "RUB" })).toBe(
      "penki rubliai, šešios kapeikos",
    );
    expect(num2words(-12.01, { lang: "lt", to: "currency", currency: "RUB" })).toBe(
      "minus dvylika rublių, viena kapeika",
    );
    expect(num2words(1122.22, { lang: "lt", to: "currency", currency: "RUB" })).toBe(
      "vienas tūkstantis vienas šimtas dvidešimt du rubliai, dvidešimt dvi kapeikos",
    );
  });
});
