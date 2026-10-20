// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_te.py

import { describe, expect, test } from "bun:test";
import { num2words } from "../src/index.ts";

describe("Num2WordsTETest", () => {
  test("test_numbers", () => {
    expect(num2words(66, { lang: "te" })).toBe("అరవై ఆరు");
    expect(num2words(1734, { lang: "te" })).toBe("ఒకటి వేయి ఏడు వందల ముప్పై నాలుగు");
    expect(num2words(134, { lang: "te" })).toBe("ఒకటి వందల ముప్పై నాలుగు");
    expect(num2words(54411, { lang: "te" })).toBe("యాభై నాలుగు వేయి నాలుగు వందల పదకొండు");
    expect(num2words(42, { lang: "te" })).toBe("నలభై రెండు");
    expect(num2words(893, { lang: "te" })).toBe("ఎనిమిది వందల తొంభై మూడు");
    expect(num2words(1729, { lang: "te" })).toBe("ఒకటి వేయి ఏడు వందల ఇరవై తొమ్మిది");
    expect(num2words(123, { lang: "te" })).toBe("ఒకటి వందల ఇరవై మూడు");
    expect(num2words(32211, { lang: "te" })).toBe("ముప్పై రెండు వేయి రెండు వందల పదకొండు");
  });

  test("test_cardinal_for_float_number", () => {
    expect(num2words(1.61803, { lang: "te" })).toBe("ఒకటి బిందువు  ఆరు ఒకటి ఎనిమిది సున్న మూడు");
    expect(num2words(34.876, { lang: "te" })).toBe("ముప్పై నాలుగు బిందువు  ఎనిమిది ఏడు ఆరు");
    expect(num2words(3.14, { lang: "te" })).toBe("మూడు బిందువు  ఒకటి నాలుగు");
  });

  test("test_ordinal", () => {
    expect(num2words(1, { lang: "te", to: "ordinal" })).toBe("ఒకటివ");
    expect(num2words(22, { lang: "te", to: "ordinal" })).toBe("ఇరవై రెండువ");
    expect(num2words(23, { lang: "te", to: "ordinal" })).toBe("ఇరవై మూడువ");
    expect(num2words(12, { lang: "te", to: "ordinal" })).toBe("పన్నెండువ");
    expect(num2words(130, { lang: "te", to: "ordinal" })).toBe("ఒకటి వందల ముప్పైవ");
    expect(num2words(1003, { lang: "te", to: "ordinal" })).toBe("ఒకటి వేయిల మూడువ");
    expect(num2words(4, { lang: "te", to: "ordinal" })).toBe("నాలుగువ");
  });

  test("test_ordinal_num", () => {
    expect(num2words(2, { lang: "te", to: "ordinal_num" })).toBe("2వ");
    expect(num2words(3, { lang: "te", to: "ordinal_num" })).toBe("3వ");
    expect(num2words(5, { lang: "te", to: "ordinal_num" })).toBe("5వ");
    expect(num2words(16, { lang: "te", to: "ordinal_num" })).toBe("16వ");
    expect(num2words(113, { lang: "te", to: "ordinal_num" })).toBe("113వ");
  });
});
