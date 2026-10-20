// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_sl.py

import { describe, expect, test } from "bun:test";
import { num2words } from "../src/index.ts";

describe("Num2WordsSLTest", () => {
  test("test_ordinal_less_than_twenty", () => {
    expect(num2words(2, { ordinal: true, lang: "sl" })).toBe("drugi");
    expect(num2words(4, { ordinal: true, lang: "sl" })).toBe("četrti");
    expect(num2words(7, { ordinal: true, lang: "sl" })).toBe("sedmi");
    expect(num2words(8, { ordinal: true, lang: "sl" })).toBe("osmi");
    expect(num2words(12, { ordinal: true, lang: "sl" })).toBe("dvanajsti");
    expect(num2words(17, { ordinal: true, lang: "sl" })).toBe("sedemnajsti");
  });

  test("test_ordinal_more_than_twenty", () => {
    expect(num2words(81, { ordinal: true, lang: "sl" })).toBe("enainosemdeseti");
  });

  test("test_ordinal_at_crucial_number", () => {
    expect(num2words(100, { ordinal: true, lang: "sl" })).toBe("stoti");
    expect(num2words(1000, { ordinal: true, lang: "sl" })).toBe("tisoči");
    expect(num2words(4000, { ordinal: true, lang: "sl" })).toBe("štiritisoči");
    expect(num2words(2000000, { ordinal: true, lang: "sl" })).toBe("dvamilijonti");
    expect(num2words(5000000000, { ordinal: true, lang: "sl" })).toBe("petmilijardti");
  });

  test("test_ordinal_numbers_from_repository_of_test_cases", () => {
    expect(num2words(1, { ordinal: true, lang: "sl" })).toBe("prvi");
    expect(num2words(2, { ordinal: true, lang: "sl" })).toBe("drugi");
    expect(num2words(3, { ordinal: true, lang: "sl" })).toBe("tretji");
    expect(num2words(4, { ordinal: true, lang: "sl" })).toBe("četrti");
    expect(num2words(5, { ordinal: true, lang: "sl" })).toBe("peti");
    expect(num2words(6, { ordinal: true, lang: "sl" })).toBe("šesti");
    expect(num2words(7, { ordinal: true, lang: "sl" })).toBe("sedmi");
    expect(num2words(8, { ordinal: true, lang: "sl" })).toBe("osmi");
    expect(num2words(9, { ordinal: true, lang: "sl" })).toBe("deveti");
    expect(num2words(10, { ordinal: true, lang: "sl" })).toBe("deseti");
    expect(num2words(100, { ordinal: true, lang: "sl" })).toBe("stoti");
    expect(num2words(101, { ordinal: true, lang: "sl" })).toBe("stoprvi");
    expect(num2words(102, { ordinal: true, lang: "sl" })).toBe("stodrugi");
    expect(num2words(103, { ordinal: true, lang: "sl" })).toBe("stotretji");
    expect(num2words(104, { ordinal: true, lang: "sl" })).toBe("stočetrti");
    expect(num2words(105, { ordinal: true, lang: "sl" })).toBe("stopeti");
    expect(num2words(106, { ordinal: true, lang: "sl" })).toBe("stošesti");
    expect(num2words(200, { ordinal: true, lang: "sl" })).toBe("dvestoti");
    expect(num2words(1000, { ordinal: true, lang: "sl" })).toBe("tisoči");
    expect(num2words(1001, { ordinal: true, lang: "sl" })).toBe("tisočprvi");
    expect(num2words(1002, { ordinal: true, lang: "sl" })).toBe("tisočdrugi");
    expect(num2words(1003, { ordinal: true, lang: "sl" })).toBe("tisočtretji");
    expect(num2words(1004, { ordinal: true, lang: "sl" })).toBe("tisoččetrti");
    expect(num2words(1005, { ordinal: true, lang: "sl" })).toBe("tisočpeti");
    expect(num2words(1006, { ordinal: true, lang: "sl" })).toBe("tisočšesti");
    expect(num2words(2000, { ordinal: true, lang: "sl" })).toBe("dvatisoči");
    expect(num2words(20000, { ordinal: true, lang: "sl" })).toBe("dvajsettisoči");
    expect(num2words(200000, { ordinal: true, lang: "sl" })).toBe("dvestotisoči");
    expect(num2words(1000000, { ordinal: true, lang: "sl" })).toBe("milijonti");
    expect(num2words(2000000, { ordinal: true, lang: "sl" })).toBe("dvamilijonti");
    expect(num2words(3000000, { ordinal: true, lang: "sl" })).toBe("trimilijonti");
    expect(num2words(101000000, { ordinal: true, lang: "sl" })).toBe("stoenmilijonti");
    expect(num2words(202000000, { ordinal: true, lang: "sl" })).toBe("dvestodvamilijonti");
    expect(num2words(1121, { ordinal: true, lang: "sl" })).toBe("tisočstoenaindvajseti");
    expect(num2words(2405, { ordinal: true, lang: "sl" })).toBe("dvatisočštiristopeti");
  });

  test("test_cardinal_at_some_numbers", () => {
    expect(num2words(2, { lang: "sl" })).toBe("dve");
    expect(num2words(4000, { lang: "sl" })).toBe("štiri tisoč");
    expect(num2words(2000000, { lang: "sl" })).toBe("dva milijona");
    expect(num2words(4000000000, { lang: "sl" })).toBe("štiri milijarde");
  });

  test("test_cardinal_numbers_from_repository_of_test_cases", () => {
    expect(num2words(0, { lang: "sl" })).toBe("nič");
    expect(num2words(1, { lang: "sl" })).toBe("ena");
    expect(num2words(2, { lang: "sl" })).toBe("dve");
    expect(num2words(3, { lang: "sl" })).toBe("tri");
    expect(num2words(4, { lang: "sl" })).toBe("štiri");
    expect(num2words(5, { lang: "sl" })).toBe("pet");
    expect(num2words(6, { lang: "sl" })).toBe("šest");
    expect(num2words(7, { lang: "sl" })).toBe("sedem");
    expect(num2words(8, { lang: "sl" })).toBe("osem");
    expect(num2words(9, { lang: "sl" })).toBe("devet");
    expect(num2words(10, { lang: "sl" })).toBe("deset");
    expect(num2words(11, { lang: "sl" })).toBe("enajst");
    expect(num2words(12, { lang: "sl" })).toBe("dvanajst");
    expect(num2words(13, { lang: "sl" })).toBe("trinajst");
    expect(num2words(14, { lang: "sl" })).toBe("štirinajst");
    expect(num2words(15, { lang: "sl" })).toBe("petnajst");
    expect(num2words(16, { lang: "sl" })).toBe("šestnajst");
    expect(num2words(17, { lang: "sl" })).toBe("sedemnajst");
    expect(num2words(18, { lang: "sl" })).toBe("osemnajst");
    expect(num2words(19, { lang: "sl" })).toBe("devetnajst");
    expect(num2words(20, { lang: "sl" })).toBe("dvajset");
    expect(num2words(21, { lang: "sl" })).toBe("enaindvajset");
    expect(num2words(22, { lang: "sl" })).toBe("dvaindvajset");
    expect(num2words(23, { lang: "sl" })).toBe("triindvajset");
    expect(num2words(24, { lang: "sl" })).toBe("štiriindvajset");
    expect(num2words(25, { lang: "sl" })).toBe("petindvajset");
    expect(num2words(26, { lang: "sl" })).toBe("šestindvajset");
    expect(num2words(27, { lang: "sl" })).toBe("sedemindvajset");
    expect(num2words(28, { lang: "sl" })).toBe("osemindvajset");
    expect(num2words(29, { lang: "sl" })).toBe("devetindvajset");
    expect(num2words(30, { lang: "sl" })).toBe("trideset");
    expect(num2words(40, { lang: "sl" })).toBe("štirideset");
    expect(num2words(50, { lang: "sl" })).toBe("petdeset");
    expect(num2words(60, { lang: "sl" })).toBe("šestdeset");
    expect(num2words(70, { lang: "sl" })).toBe("sedemdeset");
    expect(num2words(80, { lang: "sl" })).toBe("osemdeset");
    expect(num2words(90, { lang: "sl" })).toBe("devetdeset");
    expect(num2words(100, { lang: "sl" })).toBe("sto");
    expect(num2words(101, { lang: "sl" })).toBe("sto ena");
    expect(num2words(102, { lang: "sl" })).toBe("sto dve");
    expect(num2words(103, { lang: "sl" })).toBe("sto tri");
    expect(num2words(104, { lang: "sl" })).toBe("sto štiri");
    expect(num2words(105, { lang: "sl" })).toBe("sto pet");
    expect(num2words(106, { lang: "sl" })).toBe("sto šest");
    expect(num2words(200, { lang: "sl" })).toBe("dvesto");
    expect(num2words(300, { lang: "sl" })).toBe("tristo");
    expect(num2words(400, { lang: "sl" })).toBe("štiristo");
    expect(num2words(500, { lang: "sl" })).toBe("petsto");
    expect(num2words(600, { lang: "sl" })).toBe("šeststo");
    expect(num2words(700, { lang: "sl" })).toBe("sedemsto");
    expect(num2words(800, { lang: "sl" })).toBe("osemsto");
    expect(num2words(900, { lang: "sl" })).toBe("devetsto");
    expect(num2words(1000, { lang: "sl" })).toBe("tisoč");
    expect(num2words(1001, { lang: "sl" })).toBe("tisoč ena");
    expect(num2words(1002, { lang: "sl" })).toBe("tisoč dve");
    expect(num2words(1003, { lang: "sl" })).toBe("tisoč tri");
    expect(num2words(1004, { lang: "sl" })).toBe("tisoč štiri");
    expect(num2words(1005, { lang: "sl" })).toBe("tisoč pet");
    expect(num2words(1006, { lang: "sl" })).toBe("tisoč šest");
    expect(num2words(2000, { lang: "sl" })).toBe("dva tisoč");
    expect(num2words(20000, { lang: "sl" })).toBe("dvajset tisoč");
    expect(num2words(100000, { lang: "sl" })).toBe("sto tisoč");
    expect(num2words(101000, { lang: "sl" })).toBe("sto en tisoč");
    expect(num2words(200000, { lang: "sl" })).toBe("dvesto tisoč");
    expect(num2words(1000000, { lang: "sl" })).toBe("milijon");
    expect(num2words(2000000, { lang: "sl" })).toBe("dva milijona");
    expect(num2words(3000000, { lang: "sl" })).toBe("trije milijoni");
    expect(num2words(101000000, { lang: "sl" })).toBe("sto en milijon");
    expect(num2words(202000000, { lang: "sl" })).toBe("dvesto dva milijona");
    expect(num2words(303000000, { lang: "sl" })).toBe("tristo trije milijoni");
    expect(num2words(304000000, { lang: "sl" })).toBe("tristo štirje milijoni");
    expect(num2words(1000000000, { lang: "sl" })).toBe("milijarda");
    expect(num2words(2000000000, { lang: "sl" })).toBe("dve milijardi");
    expect(num2words(1121, { lang: "sl" })).toBe("tisoč sto enaindvajset");
    expect(num2words(2401, { lang: "sl" })).toBe("dva tisoč štiristo ena");
    expect(num2words(201001004, { lang: "sl" })).toBe("dvesto en milijon tisoč štiri");
    expect(num2words(1803603801, { lang: "sl" })).toBe(
      "milijarda osemsto trije milijoni šeststo tri tisoč osemsto ena",
    );
  });

  test("test_cardinal_for_decimal_number", () => {
    expect(num2words(3.48, { lang: "sl" })).toBe("tri celih štiri osem");
  });

  test("test_ordinal_for_negative_numbers", () => {
    expect(() => num2words(-12, { ordinal: true, lang: "sl" })).toThrow(TypeError);
  });

  test("test_ordinal_for_floating_numbers", () => {
    expect(() => num2words(2.453, { ordinal: true, lang: "sl" })).toThrow(TypeError);
  });
});
