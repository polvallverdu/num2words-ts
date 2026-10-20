// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_is.py

import { describe, expect, test } from "bun:test";
import { NotImplementedError, num2words, OverflowError } from "../src/index.ts";

describe("Num2WordsISTest", () => {
  test("test_cardinal", () => {
    expect(num2words(0, { to: "cardinal", lang: "is" })).toBe("núll");
    expect(num2words(1, { to: "cardinal", lang: "is" })).toBe("einn");
    expect(num2words(45, { to: "cardinal", lang: "is" })).toBe("fjörutíu og fimm");
    expect(num2words(145, { to: "cardinal", lang: "is" })).toBe("eitt hundrað fjörutíu og fimm");
    expect(num2words(-1245, { to: "cardinal", lang: "is" })).toBe(
      "mínus eitt þúsund tvö hundruð fjörutíu og fimm",
    );
    expect(num2words(2234045, { to: "cardinal", lang: "is" })).toBe(
      "tvær milljónir tvö hundruð þrjátíu og fjögur þúsund " + "fjörutíu og fimm",
    );
    expect(num2words(4002234045, { to: "cardinal", lang: "is" })).toBe(
      "fjórir milljarðar tvær milljónir tvö hundruð " + "þrjátíu og fjögur þúsund fjörutíu og fimm",
    );
  });

  test("test_cardinal_for_float_number", () => {
    expect(num2words(12.5, { to: "cardinal", lang: "is" })).toBe("tólf komma fimm");
    expect(num2words(12.51, { to: "cardinal", lang: "is" })).toBe("tólf komma fimm einn");
    expect(num2words(-12.53, { to: "cardinal", lang: "is" })).toBe("mínus tólf komma fimm þrír");
    expect(num2words(12.59, { to: "cardinal", lang: "is" })).toBe("tólf komma fimm níu");
  });

  test("test_overflow", () => {
    expect(() =>
      num2words(
        "1000000000000000000000000000000000000000000000000000000" +
          "0000000000000000000000000000000000000000000000000000000" +
          "0000000000000000000000000000000000000000000000000000000" +
          "0000000000000000000000000000000000000000000000000000000" +
          "0000000000000000000000000000000000000000000000000000000" +
          "00000000000000000000000000000000",
        { lang: "is" },
      ),
    ).toThrow(OverflowError);
  });

  test("test_not_implemented", () => {
    // Ordinals
    expect(() => num2words(1, { to: "ordinal", lang: "is" })).toThrow(NotImplementedError);

    // Ordinal num
    expect(() => num2words(1, { to: "ordinal_num", lang: "is" })).toThrow(NotImplementedError);

    // Year
    expect(() => num2words(1, { to: "year", lang: "is" })).toThrow(NotImplementedError);

    // Currency
    expect(() => num2words(1, { to: "currency", lang: "is" })).toThrow(NotImplementedError);
  });
});
