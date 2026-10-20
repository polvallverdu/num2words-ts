// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_sv.py

import { describe, expect, test } from "bun:test";
import { NotImplementedError, num2words } from "../src/index.ts";

describe("Num2WordsSVTest", () => {
  test("test_ordinal", () => {
    expect(num2words(14, { to: "ordinal", lang: "sv" })).toBe("fjortonde");
    expect(num2words(1435, { to: "ordinal", lang: "sv" })).toBe("etttusen fyrahundratrettiofemte");
    expect(num2words(32, { to: "ordinal", lang: "sv" })).toBe("trettioandra");
    expect(num2words(1, { to: "ordinal", lang: "sv" })).toBe("första");
    expect(num2words(5, { to: "ordinal", lang: "sv" })).toBe("femte");
    expect(num2words(10, { to: "ordinal", lang: "sv" })).toBe("tionde");
  });

  test("test_cardinal", () => {
    expect(num2words(0, { to: "cardinal", lang: "sv" })).toBe("noll");
    expect(num2words(1, { to: "cardinal", lang: "sv" })).toBe("ett");
    expect(num2words(3, { to: "cardinal", lang: "sv" })).toBe("tre");
    expect(num2words(5, { to: "cardinal", lang: "sv" })).toBe("fem");
    expect(num2words(18, { to: "cardinal", lang: "sv" })).toBe("arton");
    expect(num2words(45, { to: "cardinal", lang: "sv" })).toBe("förtiofem");
    expect(num2words(1345, { to: "cardinal", lang: "sv" })).toBe("etttusen trehundraförtiofem");
    expect(num2words(4435, { to: "cardinal", lang: "sv" })).toBe("fyratusen fyrahundratrettiofem");
    expect(num2words(1004135, { to: "cardinal", lang: "sv" })).toBe(
      "en miljon fyratusen etthundratrettiofem",
    );
    expect(num2words(4335000, { to: "cardinal", lang: "sv" })).toBe(
      "fyra miljoner trehundratrettiofemtusen",
    );
    expect(num2words(14004535, { to: "cardinal", lang: "sv" })).toBe(
      "fjorton miljoner fyratusen femhundratrettiofem",
    );
    expect(num2words(1.5, { to: "cardinal", lang: "sv" })).toBe("ett komma fem");
  });

  test("test_not_implemented_options", () => {
    expect(() => num2words(1235, { to: "year", lang: "sv" })).toThrow(NotImplementedError);
    expect(() => num2words(1235, { to: "year", lang: "sv" })).toThrow(
      "'year' is not implemented for swedish language",
    );

    expect(() => num2words(1235, { to: "currency", lang: "sv" })).toThrow(NotImplementedError);
    expect(() => num2words(1235, { to: "currency", lang: "sv" })).toThrow(
      "'currency' is not implemented for swedish language",
    );

    expect(() => num2words(1235, { to: "ordinal_num", lang: "sv" })).toThrow(NotImplementedError);
    expect(() => num2words(1235, { to: "ordinal_num", lang: "sv" })).toThrow(
      "'ordinal_num' is not implemented for swedish language",
    );
  });
});
