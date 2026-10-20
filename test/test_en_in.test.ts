// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_en_in.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words } from "../src/index.ts";

describe("Num2WordsENINTest", () => {
  test("test_cardinal", () => {
    expect(num2words(asFloat(1e5), { lang: "en_IN" })).toBe("one lakh");
    expect(num2words(asFloat(1e6), { lang: "en_IN" })).toBe("ten lakh");
    expect(num2words(asFloat(1e7), { lang: "en_IN" })).toBe("one crore");
  });
});
