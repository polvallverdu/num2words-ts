// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_cs.py

import { describe, expect, test } from "bun:test";
import { asFloat, NotImplementedError, num2words } from "../src/index.ts";

describe("Num2WordsCSTest", () => {
  test("test_cardinal", () => {
    expect(num2words(100, { lang: "cs" })).toBe("sto");
    expect(num2words(101, { lang: "cs" })).toBe("sto jedna");
    expect(num2words(110, { lang: "cs" })).toBe("sto deset");
    expect(num2words(115, { lang: "cs" })).toBe("sto patnáct");
    expect(num2words(123, { lang: "cs" })).toBe("sto dvacet tři");
    expect(num2words(1000, { lang: "cs" })).toBe("tisíc");
    expect(num2words(1001, { lang: "cs" })).toBe("tisíc jedna");
    expect(num2words(2012, { lang: "cs" })).toBe("dva tisíce dvanáct");
    expect(num2words(10.02, { lang: "cs" })).toBe("deset celá nula dva");
    expect(num2words(15.007, { lang: "cs" })).toBe("patnáct celá nula nula sedm");
    expect(num2words(12519.85, { lang: "cs" })).toBe(
      "dvanáct tisíc pětset devatenáct celá osmdesát pět",
    );
    expect(num2words(123.5, { lang: "cs" })).toBe("sto dvacet tři celá pět");
    expect(num2words(1234567890, { lang: "cs" })).toBe(
      "miliarda dvěstě třicet čtyři miliony pětset šedesát sedm tisíc osmset devadesát",
    );
    expect(num2words(215461407892039002157189883901676n, { lang: "cs" })).toBe(
      "dvěstě patnáct quintillionů čtyřista šedesát jedna kvadriliard čtyřista sedm kvadrilionů osmset devadesát dva triliardy třicet devět trilionů dva biliardy sto padesát sedm bilionů sto osmdesát devět miliard osmset osmdesát tři miliony devětset jedna tisíc šestset sedmdesát šest",
    );
    expect(num2words(719094234693663034822824384220291n, { lang: "cs" })).toBe(
      "sedmset devatenáct quintillionů devadesát čtyři kvadriliardy dvěstě třicet čtyři kvadriliony šestset devadesát tři triliardy šestset šedesát tři triliony třicet čtyři biliardy osmset dvacet dva biliony osmset dvacet čtyři miliardy třista osmdesát čtyři miliony dvěstě dvacet tisíc dvěstě devadesát jedna",
    );
  });

  test("test_to_ordinal", () => {
    expect(() => num2words(1, { lang: "cs", to: "ordinal" })).toThrow(NotImplementedError);
  });

  test("test_currency", () => {
    expect(num2words(asFloat(10), { lang: "cs", to: "currency", currency: "EUR" })).toBe(
      "deset euro, nula centů",
    );
    expect(num2words(asFloat(1), { lang: "cs", to: "currency", currency: "CZK" })).toBe(
      "jedna koruna, nula haléřů",
    );
    expect(num2words(1234.56, { lang: "cs", to: "currency", currency: "EUR" })).toBe(
      "tisíc dvěstě třicet čtyři euro, padesát šest centů",
    );
    expect(num2words(1234.56, { lang: "cs", to: "currency", currency: "CZK" })).toBe(
      "tisíc dvěstě třicet čtyři koruny, padesát šest haléřů",
    );
    expect(
      num2words(101.11, { lang: "cs", to: "currency", currency: "EUR", separator: " a" }),
    ).toBe("sto jedna euro a jedenáct centů");
    expect(
      num2words(101.21, { lang: "cs", to: "currency", currency: "CZK", separator: " a" }),
    ).toBe("sto jedna korun a dvacet jedna haléřů");
    expect(num2words(-12519.85, { lang: "cs", to: "currency", cents: false })).toBe(
      "mínus dvanáct tisíc pětset devatenáct euro, 85 centů",
    );
    expect(num2words(123.5, { lang: "cs", to: "currency", currency: "CZK", separator: " a" })).toBe(
      "sto dvacet tři koruny a padesát haléřů",
    );
    expect(num2words(19.5, { lang: "cs", to: "currency", cents: false })).toBe(
      "devatenáct euro, 50 centů",
    );
  });
});
