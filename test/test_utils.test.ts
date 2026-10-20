// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_utils.py

import { describe, expect, test } from "bun:test";
import { splitbyx } from "../src/utils.ts";

describe("TestUtils", () => {
  test("test_splitbyx", () => {
    expect([...splitbyx((12).toString(), 3)]).toEqual([12n]);
    expect([...splitbyx((1234).toString(), 3)]).toEqual([1n, 234n]);
    expect([...splitbyx((12345678900).toString(), 3)]).toEqual([12n, 345n, 678n, 900n]);
    expect([...splitbyx((1000000).toString(), 6)]).toEqual([1n, 0n]);

    expect([...splitbyx((12).toString(), 3, false)]).toEqual(["12"]);
    expect([...splitbyx((1234).toString(), 3, false)]).toEqual(["1", "234"]);
    expect([...splitbyx((12345678900).toString(), 3, false)]).toEqual(["12", "345", "678", "900"]);
    expect([...splitbyx((1000000).toString(), 6, false)]).toEqual(["1", "000000"]);
  });
});
