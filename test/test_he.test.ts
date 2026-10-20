// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_he.py

import { describe, expect, test } from "bun:test";
import type { CurrencyForms } from "../src/base.ts";
import { NotImplementedError, num2words, OverflowError } from "../src/index.ts";
import { int2word, Num2Word_HE } from "../src/lang/HE.ts";

describe("Num2WordsHETest", () => {
  test("test_negative", () => {
    expect(num2words(-1, { lang: "he" })).toBe("מינוס אחת");
  });

  test("test_0", () => {
    expect(num2words(0, { lang: "he" })).toBe("אפס");
  });

  test("test_1_to_10", () => {
    expect(num2words(1, { lang: "he" })).toBe("אחת");
    expect(num2words(2, { lang: "he" })).toBe("שתיים");
    expect(num2words(7, { lang: "he" })).toBe("שבע");
    expect(num2words(10, { lang: "he" })).toBe("עשר");
    expect(num2words(10, { lang: "he", gender: "m", construct: true })).toBe("עשרת");
  });

  test("test_11_to_19", () => {
    expect(num2words(11, { lang: "he" })).toBe("אחת עשרה");
    expect(num2words(11, { lang: "he", gender: "m" })).toBe("אחד עשר");
    expect(num2words(13, { lang: "he" })).toBe("שלוש עשרה");
    expect(num2words(13, { lang: "he", construct: true })).toBe("שלוש עשרה");
    expect(num2words(15, { lang: "he" })).toBe("חמש עשרה");
    expect(num2words(16, { lang: "he" })).toBe("שש עשרה");
    expect(num2words(16, { lang: "he", gender: "m" })).toBe("שישה עשר");
    expect(num2words(16, { lang: "he", gender: "m", construct: true })).toBe("שישה עשר");
    expect(num2words(19, { lang: "he" })).toBe("תשע עשרה");
  });

  test("test_20_to_99", () => {
    expect(num2words(20, { lang: "he" })).toBe("עשרים");
    expect(num2words(23, { lang: "he" })).toBe("עשרים ושלוש");
    expect(num2words(23, { lang: "he", gender: "m" })).toBe("עשרים ושלושה");
    expect(num2words(23, { lang: "he", construct: true })).toBe("עשרים ושלוש");
    expect(num2words(23, { lang: "he", gender: "m", construct: true })).toBe("עשרים ושלושה");
    expect(num2words(28, { lang: "he" })).toBe("עשרים ושמונה");
    expect(num2words(31, { lang: "he" })).toBe("שלושים ואחת");
    expect(num2words(40, { lang: "he" })).toBe("ארבעים");
    expect(num2words(66, { lang: "he" })).toBe("שישים ושש");
    expect(num2words(92, { lang: "he" })).toBe("תשעים ושתיים");
  });

  test("test_100_to_999", () => {
    expect(num2words(100, { lang: "he" })).toBe("מאה");
    expect(num2words(100, { lang: "he", construct: true })).toBe("מאת");
    expect(num2words(111, { lang: "he" })).toBe("מאה ואחת עשרה");
    expect(num2words(111, { lang: "he", construct: true })).toBe("מאה ואחת עשרה");
    expect(num2words(150, { lang: "he" })).toBe("מאה וחמישים");
    expect(num2words(196, { lang: "he" })).toBe("מאה תשעים ושש");
    expect(num2words(196, { lang: "he", gender: "m" })).toBe("מאה תשעים ושישה");
    expect(num2words(196, { lang: "he", gender: "m", construct: true })).toBe("מאה תשעים ושישה");
    expect(num2words(200, { lang: "he" })).toBe("מאתיים");
    expect(num2words(200, { lang: "he", construct: true })).toBe("מאתיים");
    expect(num2words(210, { lang: "he" })).toBe("מאתיים ועשר");
    expect(num2words(701, { lang: "he" })).toBe("שבע מאות ואחת");
  });

  test("test_1000_to_9999", () => {
    expect(num2words(1000, { lang: "he" })).toBe("אלף");
    expect(num2words(1000, { lang: "he", construct: true })).toBe("אלף");
    expect(num2words(1001, { lang: "he" })).toBe("אלף ואחת");
    expect(num2words(1002, { lang: "he" })).toBe("אלף ושתיים");
    expect(num2words(1002, { lang: "he", gender: "m" })).toBe("אלף ושניים");
    expect(num2words(1002, { lang: "he", gender: "m", construct: true })).toBe("אלף ושניים");
    expect(num2words(1003, { lang: "he" })).toBe("אלף ושלוש");
    expect(num2words(1003, { lang: "he", gender: "m" })).toBe("אלף ושלושה");
    expect(num2words(1003, { lang: "he", gender: "m", construct: true })).toBe("אלף ושלושה");
    expect(num2words(1010, { lang: "he" })).toBe("אלף ועשר");
    expect(num2words(1010, { lang: "he", gender: "m" })).toBe("אלף ועשרה");
    expect(num2words(1010, { lang: "he", gender: "m", construct: true })).toBe("אלף ועשרה");
    expect(num2words(1500, { lang: "he" })).toBe("אלף וחמש מאות");
    expect(num2words(2000, { lang: "he" })).toBe("אלפיים");
    expect(num2words(2000, { lang: "he", construct: true })).toBe("אלפיים");
    expect(num2words(2002, { lang: "he" })).toBe("אלפיים ושתיים");
    expect(num2words(2002, { lang: "he", construct: true })).toBe("אלפיים ושתיים");
    expect(num2words(3000, { lang: "he" })).toBe("שלושת אלפים");
    expect(num2words(3000, { lang: "he", construct: true })).toBe("שלושת אלפי");
    expect(num2words(3001, { lang: "he" })).toBe("שלושת אלפים ואחת");
    expect(num2words(3001, { lang: "he", construct: true })).toBe("שלושת אלפים ואחת");
    expect(num2words(3100, { lang: "he" })).toBe("שלושת אלפים ומאה");
    expect(num2words(3100, { lang: "he", construct: true })).toBe("שלושת אלפים ומאה");
    expect(num2words(6870, { lang: "he" })).toBe("ששת אלפים שמונה מאות ושבעים");
    expect(num2words(7378, { lang: "he" })).toBe("שבעת אלפים שלוש מאות שבעים ושמונה");
    expect(num2words(9999, { lang: "he" })).toBe("תשעת אלפים תשע מאות תשעים ותשע");
  });

  test("test_10000_to_99999", () => {
    expect(num2words(10000, { lang: "he" })).toBe("עשרת אלפים");
    expect(num2words(10000, { lang: "he", construct: true })).toBe("עשרת אלפי");
    expect(num2words(10001, { lang: "he" })).toBe("עשרת אלפים ואחת");
    expect(num2words(10001, { lang: "he", construct: true })).toBe("עשרת אלפים ואחת");
    expect(num2words(10999, { lang: "he" })).toBe("עשרת אלפים תשע מאות תשעים ותשע");
    expect(num2words(11000, { lang: "he" })).toBe("אחד עשר אלף");
    expect(num2words(15000, { lang: "he" })).toBe("חמישה עשר אלף");
    expect(num2words(15000, { lang: "he", gender: "m" })).toBe("חמישה עשר אלף");
    expect(num2words(20000, { lang: "he" })).toBe("עשרים אלף");
    expect(num2words(20000, { lang: "he", construct: true })).toBe("עשרים אלף");
    expect(num2words(21000, { lang: "he" })).toBe("עשרים ואחד אלף");
    expect(num2words(25000, { lang: "he" })).toBe("עשרים וחמישה אלף");
    expect(num2words(25000, { lang: "he", construct: true })).toBe("עשרים וחמישה אלף");
    expect(num2words(68700, { lang: "he" })).toBe("שישים ושמונה אלף ושבע מאות");
    expect(num2words(73781, { lang: "he" })).toBe("שבעים ושלושה אלף שבע מאות שמונים ואחת");
    expect(num2words(99999, { lang: "he" })).toBe("תשעים ותשעה אלף תשע מאות תשעים ותשע");
  });

  test("test_100000_to_999999", () => {
    expect(num2words(100000, { lang: "he" })).toBe("מאה אלף");
    expect(num2words(100000, { lang: "he", construct: true })).toBe("מאה אלף");
    expect(num2words(100001, { lang: "he" })).toBe("מאה אלף ואחת");
    expect(num2words(199999, { lang: "he" })).toBe("מאה תשעים ותשעה אלף תשע מאות תשעים ותשע");
    expect(num2words(110000, { lang: "he" })).toBe("מאה ועשרה אלף");
    expect(num2words(150000, { lang: "he" })).toBe("מאה וחמישים אלף");
    expect(num2words(200000, { lang: "he" })).toBe("מאתיים אלף");
    expect(num2words(210000, { lang: "he" })).toBe("מאתיים ועשרה אלף");
    expect(num2words(687000, { lang: "he" })).toBe("שש מאות שמונים ושבעה אלף");
    expect(num2words(687000, { lang: "he", construct: true })).toBe("שש מאות שמונים ושבעה אלף");
    expect(num2words(737812, { lang: "he" })).toBe(
      "שבע מאות שלושים ושבעה אלף שמונה מאות ושתים עשרה",
    );
    expect(num2words(999999, { lang: "he" })).toBe("תשע מאות תשעים ותשעה אלף תשע מאות תשעים ותשע");
  });

  test("test_1000000_to_999999999999999", () => {
    expect(num2words(1000000, { lang: "he" })).toBe("מיליון");
    expect(num2words(1000000, { lang: "he", construct: true })).toBe("מיליון");
    expect(num2words(1000002, { lang: "he" })).toBe("מיליון ושתיים");
    expect(num2words(1000002, { lang: "he", construct: true })).toBe("מיליון ושתיים");
    expect(num2words(2000000, { lang: "he" })).toBe("שני מיליון");
    expect(num2words(2000000, { lang: "he", construct: true })).toBe("שני מיליוני");
    expect(num2words(3000000, { lang: "he" })).toBe("שלושה מיליון");
    expect(num2words(3000000, { lang: "he", construct: true })).toBe("שלושת מיליוני");
    expect(num2words(3000002, { lang: "he" })).toBe("שלושה מיליון ושתיים");
    expect(num2words(3000002, { lang: "he", construct: true })).toBe("שלושה מיליון ושתיים");
    expect(num2words(10000000, { lang: "he" })).toBe("עשרה מיליון");
    expect(num2words(10000000, { lang: "he", construct: true })).toBe("עשרת מיליוני");
    expect(num2words(11000000, { lang: "he" })).toBe("אחד עשר מיליון");
    expect(num2words(11000000, { lang: "he", construct: true })).toBe("אחד עשר מיליוני");
    expect(num2words(1000000000, { lang: "he" })).toBe("מיליארד");
    expect(num2words(1000000000, { lang: "he", construct: true })).toBe("מיליארד");
    expect(num2words(1000000002, { lang: "he" })).toBe("מיליארד ושתיים");
    expect(num2words(1000000002, { lang: "he", construct: true })).toBe("מיליארד ושתיים");
    expect(num2words(2000000000, { lang: "he" })).toBe("שני מיליארד");
    expect(num2words(2000000000, { lang: "he", construct: true })).toBe("שני מיליארדי");
    expect(num2words(3000000000, { lang: "he" })).toBe("שלושה מיליארד");
    expect(num2words(3000000000, { lang: "he", construct: true })).toBe("שלושת מיליארדי");
    expect(num2words(3000000002, { lang: "he" })).toBe("שלושה מיליארד ושתיים");
    expect(num2words(3000000002, { lang: "he", construct: true })).toBe("שלושה מיליארד ושתיים");
    expect(num2words(10000000000, { lang: "he" })).toBe("עשרה מיליארד");
    expect(num2words(10000000000, { lang: "he", construct: true })).toBe("עשרת מיליארדי");
    expect(num2words(10000000002, { lang: "he" })).toBe("עשרה מיליארד ושתיים");
    expect(num2words(10000000002, { lang: "he", construct: true })).toBe("עשרה מיליארד ושתיים");
    expect(num2words(11000000000, { lang: "he" })).toBe("אחד עשר מיליארד");
    expect(num2words(11000000000, { lang: "he", construct: true })).toBe("אחד עשר מיליארדי");
    expect(num2words(1000000000000, { lang: "he" })).toBe("טריליון");
    expect(num2words(1000000000000, { lang: "he", construct: true })).toBe("טריליון");
    expect(num2words(1000000000002, { lang: "he" })).toBe("טריליון ושתיים");
    expect(num2words(1000000000002, { lang: "he", construct: true })).toBe("טריליון ושתיים");
    expect(num2words(2000000000000, { lang: "he" })).toBe("שני טריליון");
    expect(num2words(2000000000000, { lang: "he", construct: true })).toBe("שני טריליוני");
    expect(num2words(3000000000000, { lang: "he" })).toBe("שלושה טריליון");
    expect(num2words(3000000000000, { lang: "he", construct: true })).toBe("שלושת טריליוני");
    expect(num2words(3000000000002, { lang: "he" })).toBe("שלושה טריליון ושתיים");
    expect(num2words(3000000000002, { lang: "he", construct: true })).toBe("שלושה טריליון ושתיים");
    expect(num2words(10000000000000, { lang: "he" })).toBe("עשרה טריליון");
    expect(num2words(10000000000000, { lang: "he", construct: true })).toBe("עשרת טריליוני");
    expect(num2words(10000000000002, { lang: "he" })).toBe("עשרה טריליון ושתיים");
    expect(num2words(10000000000002, { lang: "he", construct: true })).toBe("עשרה טריליון ושתיים");
    expect(num2words(11000000000000, { lang: "he" })).toBe("אחד עשר טריליון");
    expect(num2words(11000000000000, { lang: "he", construct: true })).toBe("אחד עשר טריליוני");
    expect(num2words(999999999999999, { lang: "he" })).toBe(
      "תשע מאות תשעים ותשעה טריליון תשע מאות תשעים ותשעה מיליארד תשע מאות תשעים ותשעה מיליון תשע מאות תשעים ותשעה אלף תשע מאות תשעים ותשע",
    );
    expect(num2words(999999999999999, { lang: "he", gender: "m" })).toBe(
      "תשע מאות תשעים ותשעה טריליון תשע מאות תשעים ותשעה מיליארד תשע מאות תשעים ותשעה מיליון תשע מאות תשעים ותשעה אלף תשע מאות תשעים ותשעה",
    );
    expect(num2words(999999999999999, { lang: "he", construct: true })).toBe(
      "תשע מאות תשעים ותשעה טריליון תשע מאות תשעים ותשעה מיליארד תשע מאות תשעים ותשעה מיליון תשע מאות תשעים ותשעה אלף תשע מאות תשעים ותשע",
    );
    expect(num2words(999999999999999, { lang: "he", gender: "m", construct: true })).toBe(
      "תשע מאות תשעים ותשעה טריליון תשע מאות תשעים ותשעה מיליארד תשע מאות תשעים ותשעה מיליון תשע מאות תשעים ותשעה אלף תשע מאות תשעים ותשעה",
    );
  });

  test("test_pluralize", () => {
    const n = new Num2Word_HE();
    let [cr1, cr2] = n.cls.CURRENCY_FORMS.ILS as CurrencyForms;
    expect(n.pluralize(1n, cr1)).toBe("שקל");
    expect(n.pluralize(2n, cr1)).toBe("שקלים");
    expect(n.pluralize(1n, cr2)).toBe("אגורה");
    expect(n.pluralize(2n, cr2)).toBe("אגורות");
    [cr1, cr2] = n.cls.CURRENCY_FORMS.USD as CurrencyForms;
    expect(n.pluralize(1n, cr1)).toBe("דולר");
    expect(n.pluralize(2n, cr1)).toBe("דולרים");
    expect(n.pluralize(1n, cr2)).toBe("סנט");
    expect(n.pluralize(2n, cr2)).toBe("סנטים");
  });

  test("test_to_currency", () => {
    const n = new Num2Word_HE();
    expect(n.toCurrency(20, { currency: "ILS" })).toBe("עשרים שקלים ואפס אגורות");
    expect(n.toCurrency(100, { currency: "ILS" })).toBe("מאה שקלים ואפס אגורות");
    expect(n.toCurrency(100.5, { currency: "ILS" })).toBe("מאה שקלים וחמישים אגורות");
    expect(n.toCurrency(101.51, { currency: "ILS" })).toBe("מאה ואחד שקלים וחמישים ואחת אגורות");
    expect(n.toCurrency(-101.51, { currency: "ILS" })).toBe(
      "מינוס מאה ואחד שקלים וחמישים ואחת אגורות",
    );
    expect(n.toCurrency(-101.51, { currency: "ILS", preferSingular: true })).toBe(
      "מינוס מאה ואחד שקל וחמישים ואחת אגורות",
    );
    expect(n.toCurrency(-101.51, { currency: "ILS", preferSingularCents: true })).toBe(
      "מינוס מאה ואחד שקלים וחמישים ואחת אגורה",
    );
    expect(
      n.toCurrency(-101.51, { currency: "ILS", preferSingular: true, preferSingularCents: true }),
    ).toBe("מינוס מאה ואחד שקל וחמישים ואחת אגורה");
    expect(
      n.toCurrency(5.05, { currency: "ILS", preferSingular: true, preferSingularCents: true }),
    ).toBe("חמישה שקלים וחמש אגורות");
    expect(
      n.toCurrency(-5.05, { currency: "ILS", preferSingular: true, preferSingularCents: true }),
    ).toBe("מינוס חמישה שקלים וחמש אגורות");
    expect(n.toCurrency(-5.05, { currency: "ILS", cents: false })).toBe(
      "מינוס חמישה שקלים ו-05 אגורות",
    );
    expect(n.toCurrency(-5.05, { currency: "ILS", cents: false, separator: "ו" })).toBe(
      "מינוס חמישה שקלים ו-05 אגורות",
    );
    expect(n.toCurrency(-5.05, { currency: "ILS", cents: false, separator: "ו-" })).toBe(
      "מינוס חמישה שקלים ו-05 אגורות",
    );
    expect(n.toCurrency(-5.05, { currency: "ILS", cents: false, separator: "" })).toBe(
      "מינוס חמישה שקלים 05 אגורות",
    );
    expect(n.toCurrency(-5.05, { currency: "ILS", cents: false, separator: "ועוד " })).toBe(
      "מינוס חמישה שקלים ועוד 05 אגורות",
    );
    expect(n.toCurrency(-5.05, { currency: "ILS", cents: false, separator: " ו" })).toBe(
      "מינוס חמישה שקלים ו-05 אגורות",
    );
    expect(n.toCurrency(-5.05, { currency: "ILS", cents: false, separator: " ו-" })).toBe(
      "מינוס חמישה שקלים ו-05 אגורות",
    );
    expect(n.toCurrency(-5.05, { currency: "ILS", cents: false, separator: " " })).toBe(
      "מינוס חמישה שקלים 05 אגורות",
    );
    expect(n.toCurrency(-5.05, { currency: "ILS", cents: false, separator: " ועוד " })).toBe(
      "מינוס חמישה שקלים ועוד 05 אגורות",
    );
    expect(n.toCurrency(1.01, { currency: "ILS" })).toBe("שקל אחד ואגורה אחת");
    expect(n.toCurrency(-1.01, { currency: "ILS" })).toBe("מינוס שקל אחד ואגורה אחת");
    expect(n.toCurrency(2.02, { currency: "ILS" })).toBe("שני שקלים ושתי אגורות");
    expect(n.toCurrency(1002.02, { currency: "ILS" })).toBe("אלף ושניים שקלים ושתי אגורות");
    expect(n.toCurrency(1000002.02, { currency: "ILS" })).toBe("מיליון ושניים שקלים ושתי אגורות");
    expect(n.toCurrency(5.05, { currency: "USD" })).toBe("חמישה דולרים וחמישה סנטים");
    expect(n.toCurrency(5.05, { currency: "USD", preferSingular: true })).toBe(
      "חמישה דולר וחמישה סנטים",
    );
    expect(n.toCurrency(5.05, { currency: "USD", preferSingularCents: true })).toBe(
      "חמישה דולרים וחמישה סנט",
    );
    expect(
      n.toCurrency(5.05, { currency: "USD", preferSingular: true, preferSingularCents: true }),
    ).toBe("חמישה דולר וחמישה סנט");
    n.cls.CURRENCY_FORMS.pruta = [
      ["פרוטה", "פרוטות"],
      ["מאית", "מאיות"],
    ];
    expect(n.toCurrency(5.05, { currency: "pruta" })).toBe("חמש פרוטות וחמש מאיות");
  });

  test("test_to_currency_errors", () => {
    const n = new Num2Word_HE();
    expect(() => n.toCurrency(1n, { currency: "" })).toThrow(NotImplementedError);
  });

  test("test_to_cardinal", () => {
    const n = new Num2Word_HE();
    expect(n.toCardinal(1500n)).toBe("אלף וחמש מאות");
    expect(n.toCardinal(1501n)).toBe("אלף חמש מאות ואחת");
    expect(num2words(1, { lang: "he" })).toBe("אחת");
    expect(num2words(1, { lang: "he", gender: "m" })).toBe("אחד");
  });

  test("test_to_ordinal", () => {
    const n = new Num2Word_HE();
    expect(n.toOrdinal(1001n)).toBe("האלף ואחד");
    expect(n.toOrdinal(1500n)).toBe("האלף וחמש מאות");
    expect(n.toOrdinal(1501n)).toBe("האלף חמש מאות ואחד");
    expect(n.toOrdinal(1501n, { definite: true })).toBe("האלף חמש מאות ואחד");
    expect(n.toOrdinal(1n)).toBe("ראשון");
    expect(n.toOrdinal(1n, { definite: true })).toBe("הראשון");
    expect(n.toOrdinal(1n, { gender: "f" })).toBe("ראשונה");
    expect(n.toOrdinal(1n, { gender: "f", definite: true })).toBe("הראשונה");
    expect(n.toOrdinal(10n)).toBe("עשירי");
    expect(n.toOrdinal(10n, { definite: true })).toBe("העשירי");
    expect(n.toOrdinal(10n, { gender: "f" })).toBe("עשירית");
    expect(n.toOrdinal(10n, { gender: "f", definite: true })).toBe("העשירית");
    expect(n.toOrdinal(17n)).toBe("השבעה עשר");
    expect(n.toOrdinal(17n, { definite: true })).toBe("השבעה עשר");
    expect(n.toOrdinal(17n, { gender: "f" })).toBe("השבע עשרה");
    expect(n.toOrdinal(17n, { gender: "f", definite: true })).toBe("השבע עשרה");
    expect(n.toOrdinal(0n)).toBe("האפס");
    expect(n.toOrdinal(0n, { definite: true })).toBe("האפס");
    expect(n.toOrdinal(0n, { gender: "f" })).toBe("האפס");
    expect(n.toOrdinal(0n, { gender: "f", definite: true })).toBe("האפס");
    expect(n.toOrdinal(999999n)).toBe("התשע מאות תשעים ותשעה אלף תשע מאות תשעים ותשעה");
    expect(n.toOrdinal(999999n, { gender: "f" })).toBe(
      "התשע מאות תשעים ותשעה אלף תשע מאות תשעים ותשע",
    );
    expect(num2words(1, { ordinal: true, lang: "he" })).toBe("ראשון");
    expect(num2words(1, { ordinal: true, lang: "he", gender: "f" })).toBe("ראשונה");
    expect(num2words(1, { ordinal: true, lang: "he", definite: true })).toBe("הראשון");
    expect(num2words(1, { ordinal: true, lang: "he", gender: "f", definite: true })).toBe(
      "הראשונה",
    );
  });

  test("test_to_ordinal_plural", () => {
    const n = new Num2Word_HE();
    expect(n.toOrdinal(1001n, { plural: true })).toBe("האלף ואחד");
    expect(n.toOrdinal(1500n, { plural: true })).toBe("האלף וחמש מאות");
    expect(n.toOrdinal(1501n, { plural: true })).toBe("האלף חמש מאות ואחד");
    expect(n.toOrdinal(1501n, { definite: true, plural: true })).toBe("האלף חמש מאות ואחד");
    expect(n.toOrdinal(1n, { plural: true })).toBe("ראשונים");
    expect(n.toOrdinal(1n, { definite: true, plural: true })).toBe("הראשונים");
    expect(n.toOrdinal(1n, { gender: "f", plural: true })).toBe("ראשונות");
    expect(n.toOrdinal(1n, { gender: "f", definite: true, plural: true })).toBe("הראשונות");
    expect(n.toOrdinal(10n, { plural: true })).toBe("עשיריים");
    expect(n.toOrdinal(10n, { definite: true, plural: true })).toBe("העשיריים");
    expect(n.toOrdinal(10n, { gender: "f", plural: true })).toBe("עשיריות");
    expect(n.toOrdinal(10n, { gender: "f", definite: true, plural: true })).toBe("העשיריות");
    expect(n.toOrdinal(17n, { plural: true })).toBe("השבעה עשר");
    expect(n.toOrdinal(17n, { definite: true, plural: true })).toBe("השבעה עשר");
    expect(n.toOrdinal(17n, { gender: "f", plural: true })).toBe("השבע עשרה");
    expect(n.toOrdinal(17n, { gender: "f", definite: true, plural: true })).toBe("השבע עשרה");
    expect(n.toOrdinal(0n, { plural: true })).toBe("האפס");
    expect(n.toOrdinal(0n, { definite: true, plural: true })).toBe("האפס");
    expect(n.toOrdinal(0n, { gender: "f", plural: true })).toBe("האפס");
    expect(n.toOrdinal(0n, { gender: "f", definite: true, plural: true })).toBe("האפס");
    expect(n.toOrdinal(999999n, { plural: true })).toBe(
      "התשע מאות תשעים ותשעה אלף תשע מאות תשעים ותשעה",
    );
    expect(n.toOrdinal(999999n, { gender: "f", plural: true })).toBe(
      "התשע מאות תשעים ותשעה אלף תשע מאות תשעים ותשע",
    );
    expect(num2words(1, { ordinal: true, lang: "he", plural: true })).toBe("ראשונים");
    expect(num2words(1, { ordinal: true, lang: "he", gender: "f", plural: true })).toBe("ראשונות");
    expect(num2words(1, { ordinal: true, lang: "he", definite: true, plural: true })).toBe(
      "הראשונים",
    );
    expect(
      num2words(1, { ordinal: true, lang: "he", gender: "f", definite: true, plural: true }),
    ).toBe("הראשונות");
  });

  test("test_cardinal_for_float_number", () => {
    expect(num2words(12.5, { lang: "he" })).toBe("שתים עשרה נקודה חמש");
    expect(num2words(12.51, { lang: "he" })).toBe("שתים עשרה נקודה חמש אחת");
    expect(num2words(12.53, { lang: "he" })).toBe("שתים עשרה נקודה חמש שלוש");
    expect(num2words(12.59, { lang: "he" })).toBe("שתים עשרה נקודה חמש תשע");
    expect(num2words(12.5, { lang: "he", gender: "m" })).toBe("שנים עשר נקודה חמש");
    expect(num2words(12.51, { lang: "he", gender: "m" })).toBe("שנים עשר נקודה חמש אחת");
    expect(num2words(12.53, { lang: "he", gender: "m" })).toBe("שנים עשר נקודה חמש שלוש");
    expect(num2words(12.59, { lang: "he", gender: "m" })).toBe("שנים עשר נקודה חמש תשע");
    expect(num2words(12.594132, { lang: "he", gender: "m" })).toBe(
      "שנים עשר נקודה חמש תשע ארבע אחת שלוש שתיים",
    );
  });

  test("test_cardinal_float_precision", () => {
    const n = new Num2Word_HE();
    expect(n.toCardinalFloat("1.23")).toBe("אחת נקודה שתיים שלוש");
    n.precision = 1;
    expect(n.toCardinalFloat("1.2")).toBe("אחת נקודה שתיים");
  });

  test("test_error_to_cardinal_float", () => {
    const n = new Num2Word_HE();
    expect(() => n.toCardinalFloat("a")).toThrow(TypeError);
  });

  test("test_overflow", () => {
    const n = new Num2Word_HE();
    num2words(n.MAXVAL - 1n, { lang: "he" });
    num2words(n.MAXVAL - 1n, { ordinal: true, lang: "he" });
    expect(() => num2words(n.MAXVAL, { lang: "he" })).toThrow(OverflowError);
    expect(() => num2words(n.MAXVAL, { lang: "he", ordinal: true })).toThrow(OverflowError);
    expect(() => int2word(n.MAXVAL)).toThrow(OverflowError);
  });
});
