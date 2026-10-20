// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_kz.py

import { describe, expect, test } from "bun:test";
import { NotImplementedError, num2words } from "../src/index.ts";

describe("Num2WordsKZTest", () => {
  test("test_to_cardinal", () => {
    expect(num2words(7, { lang: "kz" })).toBe("жеті");
    expect(num2words(23, { lang: "kz" })).toBe("жиырма үш");
    expect(num2words(145, { lang: "kz" })).toBe("жүз қырық бес");
    expect(num2words(2869, { lang: "kz" })).toBe("екі мың сегіз жүз алпыс тоғыз");
    expect(num2words(-789000125, { lang: "kz" })).toBe(
      "минус жеті жүз сексен тоғыз миллион жүз жиырма бес",
    );
    expect(num2words(84932, { lang: "kz" })).toBe("сексен төрт мың тоғыз жүз отыз екі");
  });

  test("test_to_cardinal_floats", () => {
    expect(num2words(100.67, { lang: "kz" })).toBe("жүз бүтін алпыс жеті");
    expect(num2words(0.7, { lang: "kz" })).toBe("нөл бүтін жеті");
    expect(num2words(1.73, { lang: "kz" })).toBe("бір бүтін жетпіс үш");
    expect(num2words(10.02, { lang: "kz" })).toBe("он бүтін нөл екі");
    expect(num2words(15.007, { lang: "kz" })).toBe("он бес бүтін нөл нөл жеті");
  });

  test("test_to_ordinal", () => {
    expect(() => num2words(1, { lang: "kz", to: "ordinal" })).toThrow(NotImplementedError);
  });

  test("test_to_currency", () => {
    expect(num2words(25.24, { lang: "kz", to: "currency", currency: "KZT" })).toBe(
      "жиырма бес теңге, жиырма төрт тиын",
    );
    expect(num2words(1996.4, { lang: "kz", to: "currency", currency: "KZT" })).toBe(
      "бір мың тоғыз жүз тоқсан алты теңге, қырық тиын",
    );
    expect(num2words(632924.51, { lang: "kz", to: "currency", currency: "KZT" })).toBe(
      "алты жүз отыз екі мың тоғыз жүз жиырма төрт теңге, елу бір тиын",
    );
    expect(num2words(632924.513, { lang: "kz", to: "currency", currency: "KZT" })).toBe(
      "алты жүз отыз екі мың тоғыз жүз жиырма төрт теңге, елу бір тиын",
    );
    expect(num2words(987654321.123, { lang: "kz", to: "currency", currency: "KZT" })).toBe(
      "тоғыз жүз сексен жеті миллион алты жүз елу төрт мың үш жүз жиырма бір теңге, он екі тиын",
    );
  });
});
