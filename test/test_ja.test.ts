// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_ja.py

import { describe, expect, test } from "bun:test";
import {
  NotImplementedError,
  type Num2WordsInput,
  type Num2WordsOptions,
  num2words,
} from "../src/index.ts";
import { rendakuMergePairs } from "../src/lang/JA.ts";

function n2j(value: Num2WordsInput, options: Num2WordsOptions = {}): string {
  return num2words(value, { lang: "ja", ...options });
}

describe("Num2WordsJATest", () => {
  test("test_low", () => {
    expect(n2j(0)).toBe("零");
    expect(n2j(0, { prefer: ["〇"] })).toBe("〇");
    expect(n2j(0, { reading: true })).toBe("ゼロ");
    expect(n2j(0, { reading: true, prefer: ["れい"] })).toBe("れい");
    expect(n2j(1)).toBe("一");
    expect(n2j(1, { reading: true })).toBe("いち");
    expect(n2j(2)).toBe("二");
    expect(n2j(2, { reading: true })).toBe("に");
    expect(n2j(3)).toBe("三");
    expect(n2j(3, { reading: true })).toBe("さん");
    expect(n2j(4)).toBe("四");
    expect(n2j(4, { reading: true })).toBe("よん");
    expect(n2j(4, { reading: true, prefer: ["し"] })).toBe("し");
    expect(n2j(5)).toBe("五");
    expect(n2j(5, { reading: true })).toBe("ご");
    expect(n2j(6)).toBe("六");
    expect(n2j(6, { reading: true })).toBe("ろく");
    expect(n2j(7)).toBe("七");
    expect(n2j(7, { reading: true })).toBe("なな");
    expect(n2j(7, { reading: true, prefer: ["しち"] })).toBe("しち");
    expect(n2j(8)).toBe("八");
    expect(n2j(8, { reading: true })).toBe("はち");
    expect(n2j(9)).toBe("九");
    expect(n2j(9, { reading: true })).toBe("きゅう");
    expect(n2j(10)).toBe("十");
    expect(n2j(10, { reading: true })).toBe("じゅう");
    expect(n2j(11)).toBe("十一");
    expect(n2j(11, { reading: true })).toBe("じゅういち");
    expect(n2j(12)).toBe("十二");
    expect(n2j(12, { reading: true })).toBe("じゅうに");
    expect(n2j(13)).toBe("十三");
    expect(n2j(13, { reading: true })).toBe("じゅうさん");
    expect(n2j(14)).toBe("十四");
    expect(n2j(14, { reading: true })).toBe("じゅうよん");
    expect(n2j(14, { reading: true, prefer: ["し"] })).toBe("じゅうし");
    expect(n2j(15)).toBe("十五");
    expect(n2j(15, { reading: true })).toBe("じゅうご");
    expect(n2j(16)).toBe("十六");
    expect(n2j(16, { reading: true })).toBe("じゅうろく");
    expect(n2j(17)).toBe("十七");
    expect(n2j(17, { reading: true })).toBe("じゅうなな");
    expect(n2j(17, { reading: true, prefer: ["しち"] })).toBe("じゅうしち");
    expect(n2j(18)).toBe("十八");
    expect(n2j(18, { reading: true })).toBe("じゅうはち");
    expect(n2j(19)).toBe("十九");
    expect(n2j(19, { reading: true })).toBe("じゅうきゅう");
    expect(n2j(20)).toBe("二十");
    expect(n2j(20, { reading: true })).toBe("にじゅう");
  });

  test("test_mid", () => {
    expect(n2j(100)).toBe("百");
    expect(n2j(100, { reading: true })).toBe("ひゃく");
    expect(n2j(123)).toBe("百二十三");
    expect(n2j(123, { reading: true })).toBe("ひゃくにじゅうさん");
    expect(n2j(300)).toBe("三百");
    expect(n2j(300, { reading: true })).toBe("さんびゃく");
    expect(n2j(400)).toBe("四百");
    expect(n2j(400, { reading: true })).toBe("よんひゃく");
    expect(n2j(600)).toBe("六百");
    expect(n2j(600, { reading: true })).toBe("ろっぴゃく");
    expect(n2j(700, { reading: true, prefer: ["しち"] })).toBe("しちひゃく");
    expect(n2j(800, { reading: true })).toBe("はっぴゃく");
    expect(n2j(1000)).toBe("千");
    expect(n2j(1000, { reading: true })).toBe("せん");
    expect(n2j(3000, { reading: true })).toBe("さんぜん");
    expect(n2j(8000, { reading: true })).toBe("はっせん");
  });

  test("test_high", () => {
    expect(n2j(10000)).toBe("一万");
    expect(n2j(10000, { reading: true })).toBe("いちまん");
    expect(n2j(12345)).toBe("一万二千三百四十五");
    expect(n2j(12345, { reading: true })).toBe("いちまんにせんさんびゃくよんじゅうご");
    expect(n2j(100000000)).toBe("一億");
    expect(n2j(100000000, { reading: true })).toBe("いちおく");
    expect(n2j(123456789)).toBe("一億二千三百四十五万六千七百八十九");
    expect(n2j(123456789, { reading: true })).toBe(
      "いちおくにせんさんびゃくよんじゅうごまんろくせんななひゃくはちじゅうきゅう",
    );
    expect(n2j(1000000000000)).toBe("一兆");
    expect(n2j(1000000000000, { reading: true })).toBe("いっちょう");
    expect(n2j(1234567890123)).toBe("一兆二千三百四十五億六千七百八十九万百二十三");
    expect(n2j(1234567890123, { reading: true })).toBe(
      "いっちょうにせんさんびゃくよんじゅうごおくろくせんななひゃくはちじゅうきゅうまんひゃくにじゅうさん",
    );
  });

  test("test_cardinal_float", () => {
    expect(n2j(0.0123456789, { prefer: ["〇"] })).toBe("〇点〇一二三四五六七八九");
    expect(n2j(0.0123456789, { reading: true })).toBe(
      "れいてんれいいちにさんよんごろくななはちきゅう",
    );
    expect(n2j(100000000.01)).toBe("一億点零一");
    expect(n2j(100000000.01, { reading: true })).toBe("いちおくてんれいいち");
  });

  test("test_ordinal", () => {
    expect(n2j(0, { to: "ordinal" })).toBe("零番目");
    expect(n2j(0, { to: "ordinal", reading: true, prefer: ["れい"] })).toBe("れいばんめ");
    expect(n2j(2, { to: "ordinal", counter: "人" })).toBe("二人目");
    expect(n2j(3, { to: "ordinal", counter: "つ" })).toBe("三つ目");
    expect(() => n2j(4, { to: "ordinal", reading: true, counter: "人" })).toThrow(
      NotImplementedError,
    );
  });

  test("test_ordinal_num", () => {
    expect(n2j(0, { to: "ordinal_num" })).toBe("0番目");
    expect(n2j(0, { to: "ordinal_num", reading: true })).toBe("0ばんめ");
    expect(n2j(2, { to: "ordinal_num", counter: "人" })).toBe("2人目");
    expect(n2j(3, { to: "ordinal_num", counter: "つ" })).toBe("3つ目");
  });

  test("test_currency", () => {
    expect(n2j(123456789, { to: "currency" })).toBe("一億二千三百四十五万六千七百八十九円");
    expect(n2j(123456789, { to: "currency", reading: true })).toBe(
      "いちおくにせんさんびゃくよんじゅうごまんろくせんななひゃくはちじゅうきゅうえん",
    );
  });

  test("test_year", () => {
    expect(n2j(2021, { to: "year" })).toBe("令和三年");
    expect(n2j(2021, { to: "year", reading: true })).toBe("れいわさんねん");
    expect(n2j(2021, { to: "year", reading: "arabic" })).toBe("令和3年");
    expect(n2j(2019, { to: "year" })).toBe("令和元年");
    expect(n2j(2019, { to: "year", reading: true })).toBe("れいわがんねん");
    expect(n2j(2019, { to: "year", reading: "arabic" })).toBe("令和1年");
    expect(n2j(2018, { to: "year" })).toBe("平成三十年");
    expect(n2j(2018, { to: "year", reading: true })).toBe("へいせいさんじゅうねん");
    expect(n2j(2018, { to: "year", reading: "arabic" })).toBe("平成30年");
    expect(n2j(2017, { to: "year" })).toBe("平成二十九年");
    expect(n2j(2017, { to: "year", reading: true })).toBe("へいせいにじゅうくねん");
    expect(n2j(2017, { to: "year", reading: "arabic" })).toBe("平成29年");
    expect(n2j(2009, { to: "year", era: false })).toBe("二千九年");
    expect(n2j(2009, { to: "year", reading: true, era: false })).toBe("にせんくねん");
    expect(n2j(2000, { to: "year", era: false })).toBe("二千年");
    expect(n2j(2000, { to: "year", era: false, reading: true })).toBe("にせんねん");
    expect(n2j(645, { to: "year" })).toBe("大化元年");
    expect(n2j(645, { to: "year", reading: true })).toBe("たいかがんねん");
    expect(n2j(-99, { to: "year", era: false })).toBe("紀元前九十九年");
    expect(n2j(-99, { to: "year", era: false, reading: true })).toBe(
      "きげんぜんきゅうじゅうくねん",
    );
    expect(n2j(1375, { to: "year" })).toBe("天授元年");
    expect(n2j(1375, { to: "year", prefer: ["えいわ"] })).toBe("永和元年");
  });

  test("test_rendaku_merge_pairs", () => {
    expect(rendakuMergePairs(["はち", 8n], ["ちょう", 1000000000000n])).toEqual([
      "はっちょう",
      8000000000000n,
    ]);
    expect(rendakuMergePairs(["じゅう", 10n], ["ちょう", 1000000000000n])).toEqual([
      "じゅっちょう",
      10000000000000n,
    ]);
    expect(rendakuMergePairs(["いち", 1n], ["けい", 10000000000000000n])).toEqual([
      "いっけい",
      10000000000000000n,
    ]);
    expect(rendakuMergePairs(["ろく", 6n], ["けい", 10000000000000000n])).toEqual([
      "ろっけい",
      60000000000000000n,
    ]);
    expect(rendakuMergePairs(["はち", 8n], ["けい", 10000000000000000n])).toEqual([
      "はっけい",
      80000000000000000n,
    ]);
    expect(rendakuMergePairs(["じゅう", 10n], ["けい", 10000000000000000n])).toEqual([
      "じゅっけい",
      100000000000000000n,
    ]);
    expect(rendakuMergePairs(["ひゃく", 100n], ["けい", 10000000000000000n])).toEqual([
      "ひゃっけい",
      1000000000000000000n,
    ]);
  });
});
