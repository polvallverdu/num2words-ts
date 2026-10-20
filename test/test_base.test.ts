// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_base.py

import { beforeAll, describe, expect, test } from "bun:test";
import { Num2Word_Base } from "../src/base.ts";
import { Decimal, NotImplementedError } from "../src/py.ts";

describe("Num2WordBaseTest", () => {
  let base: Num2Word_Base;

  beforeAll(() => {
    base = new Num2Word_Base();
  });

  test("test_to_currency_not_implemented", () => {
    expect(() => base.toCurrency(new Decimal("1.00"), { currency: "EUR" })).toThrow(
      NotImplementedError,
    );
  });

  test("test_error_to_cardinal_float", () => {
    base = new Num2Word_Base();
    expect(() => base.toCardinalFloat("a")).toThrow(TypeError);
  });

  test("test_error_merge", () => {
    base = new Num2Word_Base();
    expect(() => base.merge(2 as never, 3 as never)).toThrow(NotImplementedError);
  });

  test("test_is_title", () => {
    base = new Num2Word_Base();
    expect(base.title("one")).toBe("one");
    base.isTitle = true;
    expect(base.title("one")).toBe("One");
    base.excludeTitle.push("one");
    expect(base.title("one")).toBe("one");
  });

  test("test_set_high_numwords_not_implemented", () => {
    expect(() => base.setHighNumwords()).toThrow(NotImplementedError);
  });

  test("test_to_ordinal_num", () => {
    base = new Num2Word_Base();
    expect(base.toOrdinalNum(1n)).toBe(1n);
    expect(base.toOrdinalNum(100n)).toBe(100n);
    expect(base.toOrdinalNum(1000n)).toBe(1000n);
  });

  test("test_pluralize_not_implemented", () => {
    expect(() => base.pluralize(null as never, null as never)).toThrow(NotImplementedError);
  });
});
