// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_vi.py

import { describe, expect, test } from "bun:test";
import { num2words } from "../src/index.ts";

describe("Num2WordsVITest", () => {
  test("test_0", () => {
    expect(num2words(0, { lang: "vi" })).toBe("không");
  });

  test("test_1_to_10", () => {
    expect(num2words(1, { lang: "vi" })).toBe("một");
    expect(num2words(2, { lang: "vi" })).toBe("hai");
    expect(num2words(7, { lang: "vi" })).toBe("bảy");
    expect(num2words(10, { lang: "vi" })).toBe("mười");
  });

  test("test_11_to_19", () => {
    expect(num2words(11, { lang: "vi" })).toBe("mười một");
    expect(num2words(13, { lang: "vi" })).toBe("mười ba");
    expect(num2words(14, { lang: "vi" })).toBe("mười bốn");
    expect(num2words(15, { lang: "vi" })).toBe("mười lăm");
    expect(num2words(16, { lang: "vi" })).toBe("mười sáu");
    expect(num2words(19, { lang: "vi" })).toBe("mười chín");
  });

  test("test_20_to_99", () => {
    expect(num2words(20, { lang: "vi" })).toBe("hai mươi");
    expect(num2words(23, { lang: "vi" })).toBe("hai mươi ba");
    expect(num2words(28, { lang: "vi" })).toBe("hai mươi tám");
    expect(num2words(31, { lang: "vi" })).toBe("ba mươi mốt");
    expect(num2words(40, { lang: "vi" })).toBe("bốn mươi");
    expect(num2words(66, { lang: "vi" })).toBe("sáu mươi sáu");
    expect(num2words(92, { lang: "vi" })).toBe("chín mươi hai");
  });

  test("test_100_to_999", () => {
    expect(num2words(100, { lang: "vi" })).toBe("một trăm");
    expect(num2words(150, { lang: "vi" })).toBe("một trăm năm mươi");
    expect(num2words(196, { lang: "vi" })).toBe("một trăm chín mươi sáu");
    expect(num2words(200, { lang: "vi" })).toBe("hai trăm");
    expect(num2words(210, { lang: "vi" })).toBe("hai trăm mười");
  });

  test("test_1000_to_9999", () => {
    expect(num2words(1000, { lang: "vi" })).toBe("một nghìn");
    expect(num2words(1500, { lang: "vi" })).toBe("một nghìn năm trăm");
    expect(num2words(7378, { lang: "vi" })).toBe("bảy nghìn ba trăm bảy mươi tám");
    expect(num2words(2000, { lang: "vi" })).toBe("hai nghìn");
    expect(num2words(2100, { lang: "vi" })).toBe("hai nghìn một trăm");
    expect(num2words(6870, { lang: "vi" })).toBe("sáu nghìn tám trăm bảy mươi");
    expect(num2words(10000, { lang: "vi" })).toBe("mười nghìn");
    expect(num2words(100000, { lang: "vi" })).toBe("một trăm nghìn");
    expect(num2words(523456, { lang: "vi" })).toBe(
      "năm trăm hai mươi ba nghìn bốn trăm năm mươi sáu",
    );
  });

  test("test_big", () => {
    expect(num2words(1000000, { lang: "vi" })).toBe("một triệu");
    expect(num2words(1200000, { lang: "vi" })).toBe("một triệu hai trăm nghìn");
    expect(num2words(3000000, { lang: "vi" })).toBe("ba triệu");
    expect(num2words(3800000, { lang: "vi" })).toBe("ba triệu tám trăm nghìn");
    expect(num2words(1000000000, { lang: "vi" })).toBe("một tỷ");
    expect(num2words(2000000000, { lang: "vi" })).toBe("hai tỷ");
    expect(num2words(2000001000, { lang: "vi" })).toBe("hai tỷ một nghìn");
    expect(num2words(1234567890, { lang: "vi" })).toBe(
      "một tỷ hai trăm ba mươi bốn triệu năm trăm sáu mươi bảy nghìn tám trăm chín mươi",
    );
  });

  test("test_decimal_number", () => {
    expect(num2words(1000.11, { lang: "vi" })).toBe("một nghìn phẩy mười một");
    expect(num2words(1000.21, { lang: "vi" })).toBe("một nghìn phẩy hai mươi mốt");
  });

  test("test_special_number", () => {
    // Some number will have some specail rule
    expect(num2words(21, { lang: "vi" })).toBe("hai mươi mốt");
    expect(num2words(25, { lang: "vi" })).toBe("hai mươi lăm");

    // >100
    expect(num2words(101, { lang: "vi" })).toBe("một trăm lẻ một");
    expect(num2words(105, { lang: "vi" })).toBe("một trăm lẻ năm");
    expect(num2words(701, { lang: "vi" })).toBe("bảy trăm lẻ một");
    expect(num2words(705, { lang: "vi" })).toBe("bảy trăm lẻ năm");

    // >1000
    expect(num2words(1001, { lang: "vi" })).toBe("một nghìn lẻ một");
    expect(num2words(1005, { lang: "vi" })).toBe("một nghìn lẻ năm");
    expect(num2words(98765, { lang: "vi" })).toBe("chín mươi tám nghìn bảy trăm sáu mươi lăm");

    // > 1000000
    expect(num2words(3000005, { lang: "vi" })).toBe("ba triệu lẻ năm");
    expect(num2words(1000007, { lang: "vi" })).toBe("một triệu lẻ bảy");

    // > 1000000000
    expect(num2words(1000000017, { lang: "vi" })).toBe("một tỷ lẻ mười bảy");
    expect(num2words(1000101017, { lang: "vi" })).toBe("một tỷ một trăm lẻ một nghìn lẻ mười bảy");
  });
});
