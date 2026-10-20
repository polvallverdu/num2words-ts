// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_ar.py

import { describe, expect, test } from "bun:test";
import { num2words, OverflowError } from "../src/index.ts";

describe("Num2WordsARTest", () => {
  // unittest runs test methods in alphabetical order, and the converter is
  // stateful (to_currency(currency="TND") leaves partPrecision at 3 for later
  // calls), so the tests are listed in that order.
  test("test_big_numbers", () => {
    expect(
      num2words(1000000045000000000000003000000002000000300n, { to: "cardinal", lang: "ar" }),
    ).toBe("تريديسيليون و خمسة و أربعون ديسيليوناً و ثلاثة كوينتليونات و ملياران و ثلاثمائة");
    expect(
      num2words(-1000000000000000000000003000000002000000302n, { to: "cardinal", lang: "ar" }),
    ).toBe("سالب تريديسيليون و ثلاثة كوينتليونات و ملياران و ثلاثمائة و اثنان");
    expect(
      num2words(9999999999999999999999999999999999999999999999992n, { to: "cardinal", lang: "ar" }),
    ).toBe(
      "تسعة كوينتينيليونات و تسعمائة و تسعة و تسعون كوادريسيليوناً و تسعمائة و تسعة و تسعون تريديسيليوناً و تسعمائة و تسعة و تسعون دوديسيليوناً و تسعمائة و تسعة و تسعون أندسيليوناً و تسعمائة و تسعة و تسعون ديسيليوناً و تسعمائة و تسعة و تسعون نونيليوناً و تسعمائة و تسعة و تسعون أوكتيليوناً و تسعمائة و تسعة و تسعون سبتيليوناً و تسعمائة و تسعة و تسعون سكستيليوناً و تسعمائة و تسعة و تسعون كوينتليوناً و تسعمائة و تسعة و تسعون كوادريليوناً و تسعمائة و تسعة و تسعون تريليوناً و تسعمائة و تسعة و تسعون ملياراً و تسعمائة و تسعة و تسعون مليوناً و تسعمائة و تسعة و تسعون ألفاً و تسعمائة و اثنان و تسعون",
    );
  });

  test("test_cardinal", () => {
    expect(num2words(0n, { to: "cardinal", lang: "ar" })).toBe("صفر");
    expect(num2words(12n, { to: "cardinal", lang: "ar" })).toBe("اثنا عشر");
    expect(num2words(12.3, { to: "cardinal", lang: "ar" })).toBe("اثنا عشر  , ثلاثون");
    expect(num2words(12.01, { to: "cardinal", lang: "ar" })).toBe("اثنا عشر  , إحدى");
    expect(num2words(12.02, { to: "cardinal", lang: "ar" })).toBe("اثنا عشر  , اثنتان");
    expect(num2words(12.03, { to: "cardinal", lang: "ar" })).toBe("اثنا عشر  , ثلاث");
    expect(num2words(12.34, { to: "cardinal", lang: "ar" })).toBe("اثنا عشر  , أربع و ثلاثون");
    expect(num2words(12.345, { to: "cardinal", lang: "ar" })).toBe(
      num2words(12.34, { to: "cardinal", lang: "ar" }),
    );
    expect(num2words(-8324n, { to: "cardinal", lang: "ar" })).toBe(
      "سالب ثمانية آلاف و ثلاثمائة و أربعة و عشرون",
    );
    expect(num2words(200n, { to: "cardinal", lang: "ar" })).toBe("مئتا");
    expect(num2words(700n, { to: "cardinal", lang: "ar" })).toBe("سبعمائة");
    expect(num2words(101010n, { to: "cardinal", lang: "ar" })).toBe("مائة و ألف ألف و عشرة");
    expect(num2words(3431.12, { to: "cardinal", lang: "ar" })).toBe(
      "ثلاثة آلاف و أربعمائة و واحد و ثلاثون  , اثنتا عشرة",
    );
    expect(num2words(431n, { to: "cardinal", lang: "ar" })).toBe("أربعمائة و واحد و ثلاثون");
    expect(num2words(94231n, { to: "cardinal", lang: "ar" })).toBe(
      "أربعة و تسعون ألفاً و مئتان و واحد و ثلاثون",
    );
    expect(num2words(1431n, { to: "cardinal", lang: "ar" })).toBe("ألف و أربعمائة و واحد و ثلاثون");
    expect(num2words(740n, { to: "cardinal", lang: "ar" })).toBe("سبعمائة و أربعون");
    expect(num2words(741n, { to: "cardinal", lang: "ar" })).toBe("سبعمائة و واحد و أربعون");
    expect(num2words(262n, { to: "cardinal", lang: "ar" })).toBe("مئتان و اثنان و ستون");
    expect(num2words(798n, { to: "cardinal", lang: "ar" })).toBe("سبعمائة و ثمانية و تسعون");
    expect(num2words(710n, { to: "cardinal", lang: "ar" })).toBe("سبعمائة و عشرة");
    expect(num2words(711n, { to: "cardinal", lang: "ar" })).toBe("سبعمائة و أحد عشر");
    expect(num2words(700n, { to: "cardinal", lang: "ar" })).toBe("سبعمائة");
    expect(num2words(701n, { to: "cardinal", lang: "ar" })).toBe("سبعمائة و واحد");
    expect(num2words(1258888n, { to: "cardinal", lang: "ar" })).toBe(
      "مليون و مئتان و ثمانية و خمسون ألفاً و ثمانمائة و ثمانية و ثمانون",
    );
    expect(num2words(1100n, { to: "cardinal", lang: "ar" })).toBe("ألف و مائة");
    expect(num2words(1000000521n, { to: "cardinal", lang: "ar" })).toBe(
      "مليار و خمسمائة و واحد و عشرون",
    );
  });

  test("test_currency_parm", () => {
    expect(num2words(1n, { to: "currency", lang: "ar", currency: "KWD" })).toBe("واحد دينار");
    expect(num2words(10n, { to: "currency", lang: "ar", currency: "EGP" })).toBe("عشرة جنيهات");
    expect(num2words(20000.12, { to: "currency", lang: "ar", currency: "EGP" })).toBe(
      "عشرون ألف جنيه و اثنتا عشرة قرش",
    );
    expect(num2words(923411n, { to: "currency", lang: "ar", currency: "SR" })).toBe(
      "تسعمائة و ثلاثة و عشرون ألفاً و أربعمائة و أحد عشر ريالاً",
    );
    expect(num2words(1000000.99, { to: "currency", lang: "ar", currency: "KWD" })).toBe(
      "مليون دينار و تسع و تسعون فلس",
    );
    expect(num2words(1000.42, { to: "currency", lang: "ar", currency: "TND" })).toBe(
      "ألف دينار و أربعمائة و عشرون مليم",
    );
    expect(num2words(123.21, { to: "currency", lang: "ar", currency: "TND" })).toBe(
      "مائة و ثلاثة و عشرون ديناراً و مئتان و عشر مليمات",
    );
  });

  test("test_default_currency", () => {
    expect(num2words(1n, { to: "currency", lang: "ar" })).toBe("واحد ريال");
    expect(num2words(2n, { to: "currency", lang: "ar" })).toBe("اثنان ريالان");
    expect(num2words(10n, { to: "currency", lang: "ar" })).toBe("عشرة ريالات");
    expect(num2words(100n, { to: "currency", lang: "ar" })).toBe("مائة ريال");
    expect(num2words(652.12, { to: "currency", lang: "ar" })).toBe(
      "ستمائة و اثنان و خمسون ريالاً و اثنتا عشرة هللة",
    );
    expect(num2words(324n, { to: "currency", lang: "ar" })).toBe("ثلاثمائة و أربعة و عشرون ريالاً");
    expect(num2words(2000n, { to: "currency", lang: "ar" })).toBe("ألفا ريال");
    expect(num2words(541n, { to: "currency", lang: "ar" })).toBe("خمسمائة و واحد و أربعون ريالاً");
    expect(num2words(10000n, { to: "currency", lang: "ar" })).toBe("عشرة آلاف ريال");
    expect(num2words(20000.12, { to: "currency", lang: "ar" })).toBe(
      "عشرون ألف ريال و اثنتا عشرة هللة",
    );
    expect(num2words(1000000n, { to: "currency", lang: "ar" })).toBe("مليون ريال");
    const val = "تسعمائة و ثلاثة و عشرون ألفاً و أربعمائة و أحد عشر ريالاً";
    expect(num2words(923411n, { to: "currency", lang: "ar" })).toBe(val);
    expect(num2words(63411n, { to: "currency", lang: "ar" })).toBe(
      "ثلاثة و ستون ألفاً و أربعمائة و أحد عشر ريالاً",
    );
    expect(num2words(1000000.99, { to: "currency", lang: "ar" })).toBe(
      "مليون ريال و تسع و تسعون هللة",
    );
  });

  test("test_max_numbers", () => {
    for (const number of [
      1000000000000000000000000000000000000000000000000000n,
      1000000000000000000000000000000000000000000000000002n,
    ]) {
      let context: Error | undefined;
      try {
        num2words(number, { lang: "ar" });
      } catch (e) {
        context = e as Error;
      }
      expect(context).toBeInstanceOf(OverflowError);
      expect(String(context?.message).includes("must be less")).toBe(true);
    }
  });

  test("test_ordinal", () => {
    expect(num2words(1n, { to: "ordinal", lang: "ar" })).toBe("اول");
    expect(num2words(2n, { to: "ordinal", lang: "ar" })).toBe("ثاني");
    expect(num2words(3n, { to: "ordinal", lang: "ar" })).toBe("ثالث");
    expect(num2words(4n, { to: "ordinal", lang: "ar" })).toBe("رابع");
    expect(num2words(5n, { to: "ordinal", lang: "ar" })).toBe("خامس");
    expect(num2words(6n, { to: "ordinal", lang: "ar" })).toBe("سادس");
    expect(num2words(9n, { to: "ordinal", lang: "ar" })).toBe("تاسع");
    expect(num2words(20n, { to: "ordinal", lang: "ar" })).toBe("عشرون");
    expect(num2words(94n, { to: "ordinal", lang: "ar" })).toBe("أربع و تسعون");
    expect(num2words(102n, { to: "ordinal", lang: "ar" })).toBe("مائة و اثنان");
    expect(num2words(923411n, { to: "ordinal_num", lang: "ar" })).toBe(
      "تسعمائة و ثلاثة و عشرون ألفاً و أربعمائة و أحد عشر",
    );
    expect(num2words(23n, { lang: "ar" })).toBe("ثلاثة و عشرون");
    expect(num2words(23n, { to: "ordinal", lang: "ar" })).toBe("ثلاث و عشرون");
    expect(num2words(23n, { lang: "ar" })).toBe("ثلاثة و عشرون");
  });

  test("test_prefix_and_suffix", () => {
    expect(num2words(645n, { to: "currency", lang: "ar", prefix: "فقط", suffix: "لاغير" })).toBe(
      "فقط ستمائة و خمسة و أربعون ريالاً لاغير",
    );
  });

  test("test_year", () => {
    expect(num2words(2000n, { to: "year", lang: "ar" })).toBe("ألفا");
  });
});
