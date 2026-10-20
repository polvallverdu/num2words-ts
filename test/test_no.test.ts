// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_no.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words } from "../src/index.ts";

describe("Num2WordsNOTest", () => {
  test("test_cardinal", () => {
    expect(num2words(0, { to: "cardinal", lang: "no" })).toBe("null");
    expect(num2words(1, { to: "cardinal", lang: "no" })).toBe("en");
    expect(num2words(3, { to: "cardinal", lang: "no" })).toBe("tre");
    expect(num2words(5, { to: "cardinal", lang: "no" })).toBe("fem");
    expect(num2words(18, { to: "cardinal", lang: "no" })).toBe("atten");
    expect(num2words(45, { to: "cardinal", lang: "no" })).toBe("førtifem");
    expect(num2words(92, { to: "cardinal", lang: "no" })).toBe("nittito");
    expect(num2words(1345, { to: "cardinal", lang: "no" })).toBe("en tusen tre hundre og førtifem");
    expect(num2words(4435, { to: "cardinal", lang: "no" })).toBe(
      "fire tusen fire hundre og trettifem",
    );
    expect(num2words(1004435, { to: "cardinal", lang: "no" })).toBe(
      "en million fire tusen fire hundre og trettifem",
    );
    expect(num2words(4335000, { to: "cardinal", lang: "no" })).toBe(
      "fire million tre hundre og trettifem tusen",
    );
    expect(num2words(14004535, { to: "cardinal", lang: "no" })).toBe(
      "fjorten million fire tusen fem hundre og trettifem",
    );
    expect(num2words(1.5, { to: "cardinal", lang: "no" })).toBe("en komma fem");
  });

  test("test_ordinal", () => {
    expect(num2words(1, { to: "ordinal", lang: "no" })).toBe("første");
    expect(num2words(5, { to: "ordinal", lang: "no" })).toBe("femte");
    expect(num2words(10, { to: "ordinal", lang: "no" })).toBe("tiende");
    expect(num2words(14, { to: "ordinal", lang: "no" })).toBe("fjortende");
    expect(num2words(30, { to: "ordinal", lang: "no" })).toBe("trettiende");
    expect(num2words(32, { to: "ordinal", lang: "no" })).toBe("trettiandre");
    expect(num2words(100, { to: "ordinal", lang: "no" })).toBe("en hundrede");
    expect(num2words(1000, { to: "ordinal", lang: "no" })).toBe("en tusende");
    expect(num2words(1435, { to: "ordinal", lang: "no" })).toBe(
      "en tusen fire hundre og trettifemte",
    );
    expect(num2words(1000000, { to: "ordinal", lang: "no" })).toBe("en millionte");
  });

  test("test_ordinal_num", () => {
    expect(num2words(1, { to: "ordinal_num", lang: "no" })).toBe("1.");
    expect(num2words(5, { to: "ordinal_num", lang: "no" })).toBe("5.");
    expect(num2words(10, { to: "ordinal_num", lang: "no" })).toBe("10.");
    expect(num2words(14, { to: "ordinal_num", lang: "no" })).toBe("14.");
    expect(num2words(32, { to: "ordinal_num", lang: "no" })).toBe("32.");
  });

  test("test_year", () => {
    expect(num2words(1835, { to: "year", lang: "no" })).toBe("atten hundre og trettifem");
    expect(num2words(2015, { to: "year", lang: "no" })).toBe("to tusen og femten");
  });

  test("test_currency", () => {
    expect(num2words(asFloat(1), { to: "currency", lang: "no" })).toBe("en krone");
    expect(num2words(asFloat(2), { to: "currency", lang: "no" })).toBe("to kroner");
    expect(num2words(2.5, { to: "currency", lang: "no" })).toBe("to kroner og femti øre");
    expect(num2words(asFloat(135), { to: "currency", lang: "no" })).toBe(
      "en hundre og trettifem kroner",
    );
    expect(num2words(135.59, { to: "currency", lang: "no" })).toBe(
      "en hundre og trettifem kroner og femtini øre",
    );
  });
});
