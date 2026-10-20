// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_errors.py

import { describe, expect, test } from "bun:test";
import { NotImplementedError, num2words } from "../src/index.ts";

describe("Num2WordsErrorsTest", () => {
  test("test_NotImplementedError", () => {
    expect(() => num2words(100, { lang: "lalala" })).toThrow(NotImplementedError);
  });

  test("test_types_NotImplementedError", () => {
    expect(() => num2words(100, { lang: "en", to: "babidibibidiboo!" as never })).toThrow(
      NotImplementedError,
    );
  });
});
