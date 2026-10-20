// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_currency.py

import { describe, expect, test } from "bun:test";
import { parseCurrencyParts } from "../src/currency.ts";
import { Decimal } from "../src/py.ts";

describe("CurrencyTestCase", () => {
  test("test_parse_currency_parts", () => {
    // integer with cents
    expect(parseCurrencyParts(101n)).toEqual([1n, 1n, false]);
    expect(parseCurrencyParts(-123n)).toEqual([1n, 23n, true]);

    // integer without cents
    expect(parseCurrencyParts(101n, false)).toEqual([101n, 0n, false]);
    expect(parseCurrencyParts(-123n, false)).toEqual([123n, 0n, true]);

    // float
    expect(parseCurrencyParts(1.01)).toEqual([1n, 1n, false]);
    expect(parseCurrencyParts(-1.23)).toEqual([1n, 23n, true]);
    expect(parseCurrencyParts(-1.2)).toEqual([1n, 20n, true]);
    expect(parseCurrencyParts(0.004)).toEqual([0n, 0n, false]);
    expect(parseCurrencyParts(0.005)).toEqual([0n, 1n, false]);
    expect(parseCurrencyParts(0.006)).toEqual([0n, 1n, false]);
    expect(parseCurrencyParts(0.0005)).toEqual([0n, 0n, false]);
    expect(parseCurrencyParts(0.984)).toEqual([0n, 98n, false]);
    expect(parseCurrencyParts(0.989)).toEqual([0n, 99n, false]);
    expect(parseCurrencyParts(0.994)).toEqual([0n, 99n, false]);
    expect(parseCurrencyParts(0.999)).toEqual([1n, 0n, false]);
    // expect(parseCurrencyParts(0.985)).toEqual([0n, 99n, false]);
    // expect(parseCurrencyParts(0.995)).toEqual([1n, 0n, false]);

    // decimal
    expect(parseCurrencyParts(new Decimal("1.01"))).toEqual([1n, 1n, false]);
    expect(parseCurrencyParts(new Decimal("-1.23"))).toEqual([1n, 23n, true]);
    expect(parseCurrencyParts(new Decimal("-1.233"))).toEqual([1n, 23n, true]);
    expect(parseCurrencyParts(new Decimal("-1.989"))).toEqual([1n, 99n, true]);

    // string
    expect(parseCurrencyParts("1.01")).toEqual([1n, 1n, false]);
    expect(parseCurrencyParts("-1.23")).toEqual([1n, 23n, true]);
    expect(parseCurrencyParts("-1.2")).toEqual([1n, 20n, true]);
    expect(parseCurrencyParts("1")).toEqual([1n, 0n, false]);
  });
});
