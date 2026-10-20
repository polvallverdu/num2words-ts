// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_kn.py

import { describe, expect, test } from "bun:test";
import { num2words } from "../src/index.ts";

describe("Num2WordsKNTest", () => {
  test("test_numbers", () => {
    expect(num2words(42, { lang: "kn" })).toBe("ನಲವತ್ತ್ ಎರಡು");
    expect(num2words(893, { lang: "kn" })).toBe("ಎಂಟು ನೂರ ತೊಂಬತ್ತ ಮೂರು");
    expect(num2words(1729, { lang: "kn" })).toBe("ಒಂದು ಸಾವಿರ ಏಳು ನೂರ ಇಪ್ಪತ್ತ್ಒಂಬತ್ತು");
    expect(num2words(123, { lang: "kn" })).toBe("ಒಂದು ನೂರ ಇಪ್ಪತ್ತ್ ಮೂರು");
    expect(num2words(32211, { lang: "kn" })).toBe("ಮೂವತ್ತ್ಎರಡು ಸಾವಿರ ಎರಡು ನೂರ ಹನ್ನೊಂದು");
  });

  test("test_cardinal_for_float_number", () => {
    expect(num2words(3.14, { lang: "kn" })).toBe("ಮೂರು ಬಿಂದು ಒಂದು ನಾಲ್ಕು");
    expect(num2words(1.61803, { lang: "kn" })).toBe("ಒಂದು ಬಿಂದು ಆರು ಒಂದು ಎಂಟು ಸೊನ್ನೆ ಮೂರು");
  });

  test("test_ordinal", () => {
    expect(num2words(1, { lang: "kn", to: "ordinal" })).toBe("ಒಂದನೇ");
    expect(num2words(22, { lang: "kn", to: "ordinal" })).toBe("ಇಪ್ಪತ್ತ್ ಎರಡನೇ");
    expect(num2words(12, { lang: "kn", to: "ordinal" })).toBe("ಹನ್ನೆರಡನೇ");
    expect(num2words(130, { lang: "kn", to: "ordinal" })).toBe("ಒಂದು ನೂರ ಮೂವತ್ತನೇ");
    expect(num2words(1003, { lang: "kn", to: "ordinal" })).toBe("ಒಂದು ಸಾವಿರದ ಮೂರನೇ");
    expect(num2words(2, { lang: "kn", ordinal: true })).toBe("ಎರಡನೇ");
    expect(num2words(5, { lang: "kn", ordinal: true })).toBe("ಐದನೇ");
    expect(num2words(16, { lang: "kn", ordinal: true })).toBe("ಹದಿನಾರನೇ");
    expect(num2words(113, { lang: "kn", ordinal: true })).toBe("ಒಂದು ನೂರ ಹದಿಮೂರನೇ");
  });

  test("test_ordinal_num", () => {
    expect(num2words(2, { lang: "kn", to: "ordinal_num" })).toBe("2ಎರಡನೇ");
    expect(num2words(5, { lang: "kn", to: "ordinal_num" })).toBe("5ಐದನೇ");
    expect(num2words(16, { lang: "kn", to: "ordinal_num" })).toBe("16ಹದಿನಾರನೇ");
    expect(num2words(113, { lang: "kn", to: "ordinal_num" })).toBe("113ಒಂದು ನೂರ ಹದಿಮೂರನೇ");
  });
});
