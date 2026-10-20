// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_sr.py

import { describe, expect, test } from "bun:test";
import { asFloat, NotImplementedError, num2words } from "../src/index.ts";

describe("Num2WordsSRTest", () => {
  test("test_cardinal", () => {
    expect("sto").toBe(num2words(100, { lang: "sr" }));
    expect("sto jedan").toBe(num2words(101, { lang: "sr" }));
    expect("sto deset").toBe(num2words(110, { lang: "sr" }));
    expect("sto petnaest").toBe(num2words(115, { lang: "sr" }));
    expect("sto dvadeset tri").toBe(num2words(123, { lang: "sr" }));
    expect("jedna hiljada").toBe(num2words(1000, { lang: "sr" }));
    expect("jedna hiljada jedan").toBe(num2words(1001, { lang: "sr" }));
    expect("dve hiljade dvanaest").toBe(num2words(2012, { lang: "sr" }));
    expect("dvanaest hiljada petsto devetnaest zapeta osamdeset pet").toBe(
      num2words(12519.85, { lang: "sr" }),
    );
    expect(
      "jedan bilion dvesta trideset četiri miliona petsto šezdeset sedam hiljada osamsto devedeset",
    ).toBe(num2words(1234567890, { lang: "sr" }));
    expect(
      "dvesta petnaest noniliona četristo šezdeset jedan oktilion četristo sedam septiliona osamsto devedeset dva sekstiliona trideset devet kvintiliona dva kvadriliona sto pedeset sedam triliona sto osamdeset devet biliona osamsto osamdeset tri miliona devetsto jedna hiljada šesto sedamdeset šest",
    ).toBe(num2words(215461407892039002157189883901676n, { lang: "sr" }));
    expect(
      "sedamsto devetnaest noniliona devedeset četiri oktiliona dvesta trideset četiri septiliona šesto devedeset tri sekstiliona šesto šezdeset tri kvintiliona trideset četiri kvadriliona osamsto dvadeset dva triliona osamsto dvadeset četiri biliona trista osamdeset četiri miliona dvesta dvadeset hiljada dvesta devedeset jedan",
    ).toBe(num2words(719094234693663034822824384220291n, { lang: "sr" }));
    expect("pet").toBe(num2words(5, { lang: "sr" }));
    expect("petnaest").toBe(num2words(15, { lang: "sr" }));
    expect("sto pedeset četiri").toBe(num2words(154, { lang: "sr" }));
    expect("jedna hiljada sto trideset pet").toBe(num2words(1135, { lang: "sr" }));
    expect("četristo osamnaest hiljada petsto trideset jedan").toBe(
      num2words(418531, { lang: "sr" }),
    );
    expect("jedan milion sto trideset devet").toBe(num2words(1000139, { lang: "sr" }));
  });

  test("test_floating_point", () => {
    expect("pet zapeta dva").toBe(num2words(5.2, { lang: "sr" }));
    expect(num2words(10.02, { lang: "sr" })).toBe("deset zapeta nula dva");
    expect(num2words(15.007, { lang: "sr" })).toBe("petnaest zapeta nula nula sedam");
    expect("petsto šezdeset jedan zapeta četrdeset dva").toBe(num2words(561.42, { lang: "sr" }));
  });

  test("test_to_ordinal", () => {
    expect(() => {
      num2words(1, { lang: "sr", to: "ordinal" });
    }).toThrow(NotImplementedError);
  });

  test("test_to_currency", () => {
    expect("jedan evro, nula centi").toBe(
      num2words(asFloat(1), { lang: "sr", to: "currency", currency: "EUR" }),
    );
    expect("dva evra, nula centi").toBe(
      num2words(asFloat(2), { lang: "sr", to: "currency", currency: "EUR" }),
    );
    expect("pet evra, nula centi").toBe(
      num2words(asFloat(5), { lang: "sr", to: "currency", currency: "EUR" }),
    );
    expect("dva evra, jedan cent").toBe(
      num2words(2.01, { lang: "sr", to: "currency", currency: "EUR" }),
    );
    expect("dva evra, dva centa").toBe(
      num2words(2.02, { lang: "sr", to: "currency", currency: "EUR" }),
    );
    expect("dva evra, pet centi").toBe(
      num2words(2.05, { lang: "sr", to: "currency", currency: "EUR" }),
    );
    expect("dve rublje, nula kopejki").toBe(
      num2words(asFloat(2), { lang: "sr", to: "currency", currency: "RUB" }),
    );
    expect("dve rublje, jedna kopejka").toBe(
      num2words(2.01, { lang: "sr", to: "currency", currency: "RUB" }),
    );
    expect("dve rublje, dve kopejke").toBe(
      num2words(2.02, { lang: "sr", to: "currency", currency: "RUB" }),
    );
    expect("dve rublje, pet kopejki").toBe(
      num2words(2.05, { lang: "sr", to: "currency", currency: "RUB" }),
    );
    expect("jedan dinar, nula para").toBe(
      num2words(asFloat(1), { lang: "sr", to: "currency", currency: "RSD" }),
    );
    expect("dva dinara, dve pare").toBe(
      num2words(2.02, { lang: "sr", to: "currency", currency: "RSD" }),
    );
    expect("pet dinara, pet para").toBe(
      num2words(5.05, { lang: "sr", to: "currency", currency: "RSD" }),
    );
    expect("jedanaest dinara, jedanaest para").toBe(
      num2words(11.11, { lang: "sr", to: "currency", currency: "RSD" }),
    );
    expect("dvadeset jedan dinar, dvadeset jedna para").toBe(
      num2words(21.21, { lang: "sr", to: "currency", currency: "RSD" }),
    );
    expect("dvadeset jedan evro, dvadeset jedan cent").toBe(
      num2words(21.21, { lang: "sr", to: "currency", currency: "EUR" }),
    );
    expect("dvadeset jedna rublja, dvadeset jedna kopejka").toBe(
      num2words(21.21, { lang: "sr", to: "currency", currency: "RUB" }),
    );
    expect("jedna hiljada dvesta trideset četiri evra, pedeset šest centi").toBe(
      num2words(1234.56, { lang: "sr", to: "currency", currency: "EUR" }),
    );
    expect("jedna hiljada dvesta trideset četiri rublje, pedeset šest kopejki").toBe(
      num2words(1234.56, { lang: "sr", to: "currency", currency: "RUB" }),
    );
    expect("sto jedan evro i jedanaest centi").toBe(
      num2words(10111, { lang: "sr", to: "currency", currency: "EUR", separator: " i" }),
    );
    expect("sto jedna rublja i dvadeset jedna kopejka").toBe(
      num2words(10121, { lang: "sr", to: "currency", currency: "RUB", separator: " i" }),
    );
    expect("sto jedna rublja i dvadeset dve kopejke").toBe(
      num2words(10122, { lang: "sr", to: "currency", currency: "RUB", separator: " i" }),
    );
    expect("sto jedan evro i dvadeset jedan cent").toBe(
      num2words(10121, { lang: "sr", to: "currency", currency: "EUR", separator: " i" }),
    );
    expect("minus dvanaest hiljada petsto devetnaest evra, 85 centi").toBe(
      num2words(-1251985, { lang: "sr", to: "currency", currency: "EUR", cents: false }),
    );
    expect("trideset osam evra i 40 centi").toBe(
      num2words("38.4", {
        lang: "sr",
        to: "currency",
        separator: " i",
        cents: false,
        currency: "EUR",
      }),
    );
  });
});
