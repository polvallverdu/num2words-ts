// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_da.py

import { describe, expect, test } from "bun:test";
import { num2words } from "../src/index.ts";
import { Num2Word_DA } from "../src/lang/DA.ts";

describe("Num2WordsDKTest", () => {
  test("test_ordinal", () => {
    expect(num2words(1, { to: "ordinal", lang: "da" })).toBe("første");
    expect(num2words(5, { to: "ordinal", lang: "da" })).toBe("femte");
  });

  test("test_cardinal", () => {
    expect(num2words(0, { to: "cardinal", lang: "da" })).toBe("nul");
    expect(num2words(1, { to: "cardinal", lang: "da" })).toBe("et");
    expect(num2words(2, { to: "cardinal", lang: "da" })).toBe("to");
    expect(num2words(5, { to: "cardinal", lang: "da" })).toBe("fem");
    expect(num2words(8, { to: "cardinal", lang: "da" })).toBe("otte");
    expect(num2words(18, { to: "cardinal", lang: "da" })).toBe("atten");
    expect(num2words(45, { to: "cardinal", lang: "da" })).toBe("femogfyrre");
  });

  test("test_to_ordinal_num", () => {
    const num2wordsDk = new Num2Word_DA();
    expect(num2wordsDk.toOrdinalNum(1n)).toBe("1te");
    expect(num2wordsDk.toOrdinalNum(2n)).toBe("2en");
    expect(num2wordsDk.toOrdinalNum(5n)).toBe("5te");
    expect(num2wordsDk.toOrdinalNum(10n)).toBe("10ende");
  });
});
