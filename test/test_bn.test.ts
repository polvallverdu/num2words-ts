// Copyright (c) 2024, Mehedi Hasan Khondoker.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_bn.py

import { describe, expect, test } from "bun:test";
import { asFloat, Decimal, num2words } from "../src/index.ts";
import { Num2Word_BN, NumberTooLargeError } from "../src/lang/BN.ts";

describe("Num2WordsBNTest", () => {
  test("test_negative", () => {
    expect(num2words(-1n, { lang: "bn" })).toBe("এক");
  });

  test("test_0", () => {
    expect(num2words(0n, { lang: "bn" })).toBe("শূন্য");
  });

  test("test_1_to_10", () => {
    expect(num2words(1n, { lang: "bn" })).toBe("এক");
    expect(num2words(2n, { lang: "bn" })).toBe("দুই");
    expect(num2words(7n, { lang: "bn" })).toBe("সাত");
    expect(num2words(10n, { lang: "bn" })).toBe("দশ");
  });

  test("test_11_to_19", () => {
    expect(num2words(11n, { lang: "bn" })).toBe("এগারো");
    expect(num2words(13n, { lang: "bn" })).toBe("তেরো");
    expect(num2words(15n, { lang: "bn" })).toBe("পনের");
    expect(num2words(16n, { lang: "bn" })).toBe("ষোল");
    expect(num2words(19n, { lang: "bn" })).toBe("উনিশ");
  });

  test("test_20_to_99", () => {
    expect(num2words(20n, { lang: "bn" })).toBe("বিশ");
    expect(num2words(23n, { lang: "bn" })).toBe("তেইশ");
    expect(num2words(28n, { lang: "bn" })).toBe("আটাশ");
    expect(num2words(31n, { lang: "bn" })).toBe("একত্রিশ");
    expect(num2words(40n, { lang: "bn" })).toBe("চল্লিশ");
    expect(num2words(66n, { lang: "bn" })).toBe("ছিষট্টি");
    expect(num2words(92n, { lang: "bn" })).toBe("বিরানব্বই");
  });

  test("test_100_to_999", () => {
    expect(num2words(100n, { lang: "bn" })).toBe("একশত");
    expect(num2words(111n, { lang: "bn" })).toBe("একশত এগারো");
    expect(num2words(150n, { lang: "bn" })).toBe("একশত পঞ্চাশ");
    expect(num2words(196n, { lang: "bn" })).toBe("একশত ছিয়ানব্বই");
    expect(num2words(200n, { lang: "bn" })).toBe("দুইশত");
    expect(num2words(210n, { lang: "bn" })).toBe("দুইশত দশ");
    expect(num2words(701n, { lang: "bn" })).toBe("সাতশত এক");
    expect(num2words(999n, { lang: "bn" })).toBe("নয়শত নিরানব্বই");
  });

  test("test_1000_to_9999", () => {
    expect(num2words(1000n, { lang: "bn" })).toBe("এক হাজার");
    expect(num2words(1001n, { lang: "bn" })).toBe("এক হাজার এক");
    expect(num2words(1002n, { lang: "bn" })).toBe("এক হাজার দুই");
    expect(num2words(1010n, { lang: "bn" })).toBe("এক হাজার দশ");
    expect(num2words(1110n, { lang: "bn" })).toBe("এক হাজার একশত দশ");
    expect(num2words(1111n, { lang: "bn" })).toBe("এক হাজার একশত এগারো");
    expect(num2words(1500n, { lang: "bn" })).toBe("এক হাজার পাঁচশত");
    expect(num2words(2000n, { lang: "bn" })).toBe("দুই হাজার");
    expect(num2words(2042n, { lang: "bn" })).toBe("দুই হাজার বিয়াল্লিশ");
    expect(num2words(3000n, { lang: "bn" })).toBe("তিন হাজার");
    expect(num2words(3301n, { lang: "bn" })).toBe("তিন হাজার তিনশত এক");
    expect(num2words(3108n, { lang: "bn" })).toBe("তিন হাজার একশত আট");
    expect(num2words(6870n, { lang: "bn" })).toBe("ছয় হাজার আটশত সত্তর");
    expect(num2words(7378n, { lang: "bn" })).toBe("সাত হাজার তিনশত আটাত্তর");
    expect(num2words(9999n, { lang: "bn" })).toBe("নয় হাজার নয়শত নিরানব্বই");
  });

  test("test_10000_to_99999", () => {
    expect(num2words(10000n, { lang: "bn" })).toBe("দশ হাজার");
    expect(num2words(10501n, { lang: "bn" })).toBe("দশ হাজার পাঁচশত এক");
    expect(num2words(10999n, { lang: "bn" })).toBe("দশ হাজার নয়শত নিরানব্বই");
    expect(num2words(13000n, { lang: "bn" })).toBe("তেরো হাজার");
    expect(num2words(15333n, { lang: "bn" })).toBe("পনের হাজার তিনশত তেত্রিশ");
    expect(num2words(21111n, { lang: "bn" })).toBe("একুশ হাজার একশত এগারো");
    expect(num2words(21003n, { lang: "bn" })).toBe("একুশ হাজার তিন");
    expect(num2words(25020n, { lang: "bn" })).toBe("পঁচিশ হাজার বিশ");
    expect(num2words(68700n, { lang: "bn" })).toBe("আটষট্টি হাজার সাতশত");
    expect(num2words(73781n, { lang: "bn" })).toBe("তিয়াত্তর হাজার সাতশত একাশি");
    expect(num2words(99999n, { lang: "bn" })).toBe("নিরানব্বই হাজার নয়শত নিরানব্বই");
  });

  test("test_100000_to_999999", () => {
    expect(num2words(100000n, { lang: "bn" })).toBe("এক লাখ");
    expect(num2words("100000", { lang: "bn" })).toBe("এক লাখ");
    expect(num2words(199999n, { lang: "bn" })).toBe("এক লাখ নিরানব্বই হাজার নয়শত নিরানব্বই");
    expect(num2words(110000n, { lang: "bn" })).toBe("এক লাখ দশ হাজার");
    expect(num2words(150010n, { lang: "bn" })).toBe("এক লাখ পঞ্চাশ হাজার দশ");
    expect(num2words("200200", { lang: "bn" })).toBe("দুই লাখ দুইশত");
    expect(num2words(737812n, { lang: "bn" })).toBe("সাত লাখ সাতত্রিশ হাজার আটশত বারো");
    expect(num2words("999999", { lang: "bn" })).toBe("নয় লাখ নিরানব্বই হাজার নয়শত নিরানব্বই");
  });

  test("test_1000000_to_9999999999999999", () => {
    expect(num2words(1000000n, { lang: "bn" })).toBe("দশ লাখ");
    expect(num2words(20000000n, { lang: "bn" })).toBe("দুই কোটি");
    expect(num2words(300000000n, { lang: "bn" })).toBe("ত্রিশ কোটি");
    expect(num2words(4000000000n, { lang: "bn" })).toBe("চারশত কোটি");
    expect(num2words(50000000000n, { lang: "bn" })).toBe("পাঁচ হাজার কোটি");
    expect(num2words(600000000000n, { lang: "bn" })).toBe("ষাট হাজার কোটি");
    expect(num2words(7000000000000n, { lang: "bn" })).toBe("সাত লাখ কোটি");
    expect(num2words(80000000000000n, { lang: "bn" })).toBe("আশি লাখ কোটি");
    expect(num2words(900000000000000n, { lang: "bn" })).toBe("নয় কোটি কোটি");
    expect(num2words(999999999999999n, { lang: "bn" })).toBe(
      "নয় কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই",
    );
    expect(num2words(9999999999999999n, { lang: "bn" })).toBe(
      "নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই",
    );
  });

  test("test_dosomik_0_to_999999999999999999", () => {
    expect(num2words(0.56, { lang: "bn" })).toBe("শূন্য দশমিক পাঁচ ছয়");
    expect(num2words(1.11, { lang: "bn" })).toBe("এক দশমিক এক এক");
    expect(num2words(2.66, { lang: "bn" })).toBe("দুই দশমিক ছয় ছয়");
    expect(num2words(7.68, { lang: "bn" })).toBe("সাত দশমিক ছয় আট");
    expect(num2words("10.35", { lang: "bn" })).toBe("দশ দশমিক তিন পাঁচ");
    expect(num2words("11.47", { lang: "bn" })).toBe("এগারো দশমিক চার সাত");
    expect(num2words(13.69, { lang: "bn" })).toBe("তেরো দশমিক ছয় নয়");
    expect(num2words(15.96, { lang: "bn" })).toBe("পনের দশমিক নয় ছয়");
    expect(num2words(16.9999, { lang: "bn" })).toBe("ষোল দশমিক নয় নয় নয় নয়");
    expect(num2words(19.56587, { lang: "bn" })).toBe("উনিশ দশমিক পাঁচ ছয় পাঁচ আট সাত");
    expect(num2words(31.31, { lang: "bn" })).toBe("একত্রিশ দশমিক তিন এক");
    expect(num2words(40.85, { lang: "bn" })).toBe("চল্লিশ দশমিক আট পাঁচ");
    expect(num2words(66.66, { lang: "bn" })).toBe("ছিষট্টি দশমিক ছয় ছয়");
    expect(num2words(92.978, { lang: "bn" })).toBe("বিরানব্বই দশমিক নয় সাত আট");
    expect(num2words(1000001.1, { lang: "bn" })).toBe("দশ লাখ এক দশমিক এক");
    expect(num2words(20000000.22, { lang: "bn" })).toBe("দুই কোটি দশমিক দুই দুই");
    expect(num2words(300030000.33, { lang: "bn" })).toBe("ত্রিশ কোটি ত্রিশ হাজার দশমিক তিন তিন");
    expect(num2words("4004000444.44", { lang: "bn" })).toBe(
      "চারশত কোটি চল্লিশ লাখ চারশত চৌচল্লিশ দশমিক চার চার",
    );
    expect(num2words(50000000001.5, { lang: "bn" })).toBe("পাঁচ হাজার কোটি এক দশমিক পাঁচ");
    expect(num2words(600000000600.66, { lang: "bn" })).toBe("ষাট হাজার কোটি ছয়শত দশমিক ছয় ছয়");
    expect(num2words(7000000000000.77, { lang: "bn" })).toBe("সাত লাখ কোটি দশমিক সাত সাত");
    expect(num2words(80000000000888.88, { lang: "bn" })).toBe("আশি লাখ কোটি আটশত আটাশি দশমিক আট আট");
    expect(num2words(900000000000000.9, { lang: "bn" })).toBe("নয় কোটি কোটি দশমিক নয়");
    expect(num2words(999999999999999.9, { lang: "bn" })).toBe(
      "নয় কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই দশমিক নয়",
    );
    expect(num2words(asFloat(10000000000000000), { lang: "bn" })).toBe("একশত কোটি কোটি");
    expect(num2words(asFloat(100000000000000000), { lang: "bn" })).toBe("এক হাজার কোটি কোটি");
    expect(num2words("999999999999999999.9", { lang: "bn" })).toBe(
      "নয় হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই দশমিক নয়",
    );
  });

  test("test_to_currency", () => {
    const n = new Num2Word_BN();
    expect(n.toCurrency(20.0)).toBe("বিশ টাকা");
    expect(n.toCurrency(20.5)).toBe("বিশ টাকা পঞ্চাশ পয়সা");
    expect(n.toCurrency(33.51)).toBe("তেত্রিশ টাকা একান্ন পয়সা");
    expect(n.toCurrency(99.99)).toBe("নিরানব্বই টাকা নিরানব্বই পয়সা");
    expect(n.toCurrency(10000.1)).toBe("দশ হাজার টাকা দশ পয়সা");
    expect(n.toCurrency(555555.5)).toBe("পাঁচ লাখ পঞ্চান্ন হাজার পাঁচশত পঞ্চান্ন টাকা পঞ্চাশ পয়সা");
    expect(n.toCurrency(6666676n)).toBe("ছিষট্টি লাখ ছিষট্টি হাজার ছয়শত ছিয়াত্তর টাকা");
    expect(n.toCurrency(777777777n)).toBe("সাতাত্তর কোটি সাতাত্তর লাখ সাতাত্তর হাজার সাতশত সাতাত্তর টাকা");
    expect(n.toCurrency(7777777778n)).toBe("সাতশত সাতাত্তর কোটি সাতাত্তর লাখ সাতাত্তর হাজার সাতশত আটাত্তর টাকা");
    expect(n.toCurrency(97777777778n)).toBe(
      "নয় হাজার সাতশত সাতাত্তর কোটি সাতাত্তর লাখ সাতাত্তর হাজার সাতশত আটাত্তর টাকা",
    );
    expect(n.toCurrency(977777777781n)).toBe(
      "সাতানব্বই হাজার সাতশত সাতাত্তর কোটি সাতাত্তর লাখ সাতাত্তর হাজার সাতশত একাশি টাকা",
    );
    expect(n.toCurrency(9777777779781n)).toBe(
      "নয় লাখ সাতাত্তর হাজার সাতশত সাতাত্তর কোটি সাতাত্তর লাখ উনআশি হাজার সাতশত একাশি টাকা",
    );
  });

  test("test_to_cardinal", () => {
    const n = new Num2Word_BN();
    expect(n.toCardinal(0.56)).toBe("শূন্য দশমিক পাঁচ ছয়");
    expect(n.toCardinal(1.11)).toBe("এক দশমিক এক এক");
    expect(n.toCardinal(2.66)).toBe("দুই দশমিক ছয় ছয়");
    expect(n.toCardinal(7.68)).toBe("সাত দশমিক ছয় আট");
    expect(n.toCardinal("10.35")).toBe("দশ দশমিক তিন পাঁচ");
    expect(n.toCardinal("11.47")).toBe("এগারো দশমিক চার সাত");
    expect(n.toCardinal(13.69)).toBe("তেরো দশমিক ছয় নয়");
    expect(n.toCardinal(15.96)).toBe("পনের দশমিক নয় ছয়");
    expect(n.toCardinal(16.9999)).toBe("ষোল দশমিক নয় নয় নয় নয়");
    expect(n.toCardinal(19.56587)).toBe("উনিশ দশমিক পাঁচ ছয় পাঁচ আট সাত");
    expect(n.toCardinal(31.31)).toBe("একত্রিশ দশমিক তিন এক");
    expect(n.toCardinal(40.85)).toBe("চল্লিশ দশমিক আট পাঁচ");
    expect(n.toCardinal(66.66)).toBe("ছিষট্টি দশমিক ছয় ছয়");
    expect(n.toCardinal(92.978)).toBe("বিরানব্বই দশমিক নয় সাত আট");
    expect(n.toCardinal(1000001.1)).toBe("দশ লাখ এক দশমিক এক");
    expect(n.toCardinal(20000000.22)).toBe("দুই কোটি দশমিক দুই দুই");
    expect(n.toCardinal(300030000.33)).toBe("ত্রিশ কোটি ত্রিশ হাজার দশমিক তিন তিন");
    expect(n.toCardinal("4004000444.44")).toBe("চারশত কোটি চল্লিশ লাখ চারশত চৌচল্লিশ দশমিক চার চার");
    expect(n.toCardinal(50000000001.5)).toBe("পাঁচ হাজার কোটি এক দশমিক পাঁচ");
    expect(n.toCardinal(600000000600.66)).toBe("ষাট হাজার কোটি ছয়শত দশমিক ছয় ছয়");
    expect(n.toCardinal(7000000000000.77)).toBe("সাত লাখ কোটি দশমিক সাত সাত");
    expect(n.toCardinal(80000000000888.88)).toBe("আশি লাখ কোটি আটশত আটাশি দশমিক আট আট");
    expect(n.toCardinal(900000000000000.9)).toBe("নয় কোটি কোটি দশমিক নয়");
    expect(n.toCardinal(999999999999999.9)).toBe(
      "নয় কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই দশমিক নয়",
    );
    expect(n.toCardinal(1e16)).toBe("একশত কোটি কোটি");
    expect(n.toCardinal(1e17)).toBe("এক হাজার কোটি কোটি");
    expect(n.toCardinal("999999999999999999.99")).toBe(
      "নয় হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই দশমিক নয় নয়",
    );
  });

  test("test_to_ordinal", () => {
    const n = new Num2Word_BN();
    expect(n.toOrdinal(0.56)).toBe("শূন্য দশমিক পাঁচ ছয়");
    expect(n.toOrdinal(1.11)).toBe("এক দশমিক এক এক");
    expect(n.toOrdinal(2.66)).toBe("দুই দশমিক ছয় ছয়");
    expect(n.toOrdinal(7.68)).toBe("সাত দশমিক ছয় আট");
    expect(n.toOrdinal("10.35")).toBe("দশ দশমিক তিন পাঁচ");
    expect(n.toOrdinal("11.47")).toBe("এগারো দশমিক চার সাত");
    expect(n.toOrdinal(13.69)).toBe("তেরো দশমিক ছয় নয়");
    expect(n.toOrdinal(15.96)).toBe("পনের দশমিক নয় ছয়");
    expect(n.toOrdinal(16.9999)).toBe("ষোল দশমিক নয় নয় নয় নয়");
    expect(n.toOrdinal(19.56587)).toBe("উনিশ দশমিক পাঁচ ছয় পাঁচ আট সাত");
    expect(n.toOrdinal(31.31)).toBe("একত্রিশ দশমিক তিন এক");
    expect(n.toOrdinal(40.85)).toBe("চল্লিশ দশমিক আট পাঁচ");
    expect(n.toOrdinal(66.66)).toBe("ছিষট্টি দশমিক ছয় ছয়");
    expect(n.toOrdinal(92.978)).toBe("বিরানব্বই দশমিক নয় সাত আট");
    expect(n.toOrdinal(1000001.1)).toBe("দশ লাখ এক দশমিক এক");
    expect(n.toOrdinal(20000000.22)).toBe("দুই কোটি দশমিক দুই দুই");
    expect(n.toOrdinal(300030000.33)).toBe("ত্রিশ কোটি ত্রিশ হাজার দশমিক তিন তিন");
    expect(n.toOrdinal("4004000444.44")).toBe("চারশত কোটি চল্লিশ লাখ চারশত চৌচল্লিশ দশমিক চার চার");
    expect(n.toOrdinal(50000000001.5)).toBe("পাঁচ হাজার কোটি এক দশমিক পাঁচ");
    expect(n.toOrdinal(600000000600.66)).toBe("ষাট হাজার কোটি ছয়শত দশমিক ছয় ছয়");
    expect(n.toOrdinal(7000000000000.77)).toBe("সাত লাখ কোটি দশমিক সাত সাত");
    expect(n.toOrdinal(80000000000888.88)).toBe("আশি লাখ কোটি আটশত আটাশি দশমিক আট আট");
    expect(n.toOrdinal(900000000000000.9)).toBe("নয় কোটি কোটি দশমিক নয়");
    expect(n.toOrdinal(999999999999999.9)).toBe(
      "নয় কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই দশমিক নয়",
    );
    expect(n.toOrdinal(1e16)).toBe("একশত কোটি কোটি");
    expect(n.toOrdinal(1e17)).toBe("এক হাজার কোটি কোটি");
    expect(n.toOrdinal("999999999999999999.99")).toBe(
      "নয় হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই দশমিক নয় নয়",
    );
  });

  test("test_to_year", () => {
    const n = new Num2Word_BN();
    expect(n.toYear(1n)).toBe("এক সাল");
    expect(n.toYear(1000n)).toBe("এক হাজার সাল");
    expect(n.toYear(1500n)).toBe("এক হাজার পাঁচশত সাল");
    expect(n.toYear(1820n)).toBe("এক হাজার আটশত বিশ সাল");
    expect(n.toYear(1920n)).toBe("এক হাজার নয়শত বিশ সাল");
    expect(n.toYear(2024n)).toBe("দুই হাজার চব্বিশ সাল");
    expect(n.toYear(2004n)).toBe("দুই হাজার চার সাল");
  });

  test("test_to_ordinal_num", () => {
    const n = new Num2Word_BN();
    expect(n.toOrdinalNum(1n)).toBe("প্রথম");
    expect(n.toOrdinalNum(1000n)).toBe("এক হাজারতম");
    expect(n.toOrdinalNum(1500n)).toBe("এক হাজার পাঁচশতম");
    expect(n.toOrdinalNum(1820n)).toBe("এক হাজার আটশত বিশতম");
    expect(n.toOrdinalNum(1920n)).toBe("এক হাজার নয়শত বিশতম");
    expect(n.toOrdinalNum(2024n)).toBe("দুই হাজার চব্বিশতম");
    expect(n.toOrdinalNum(2004n)).toBe("দুই হাজার চারতম");
  });

  test("test_max_number_error", () => {
    const n = new Num2Word_BN();
    expect(() =>
      n.toOrdinal(
        99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999991n,
      ),
    ).toThrow(NumberTooLargeError);
    expect(() =>
      n.toCardinal(
        99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999991n,
      ),
    ).toThrow(NumberTooLargeError);
    expect(() =>
      n.toYear(
        99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999991n,
      ),
    ).toThrow(NumberTooLargeError);
    expect(() =>
      n.toOrdinalNum(
        99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999991n,
      ),
    ).toThrow(NumberTooLargeError);
    expect(() =>
      n.toCurrency(
        99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999991n,
      ),
    ).toThrow(NumberTooLargeError);
    expect(() =>
      num2words(
        99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999991n,
        { lang: "bn" },
      ),
    ).toThrow(NumberTooLargeError);
  });

  test("test_is_smaller_than_max_number", () => {
    const n = new Num2Word_BN();
    expect(n._isSmallerThanMaxNumber(55555n)).toBe(true);
  });

  test("test_is_smaller_than_max_number_error", () => {
    expect(() => {
      const n = new Num2Word_BN();
      n._isSmallerThanMaxNumber(
        99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999n,
      );
    }).toThrow(NumberTooLargeError);
  });

  test("test_parse_number", () => {
    const n = new Num2Word_BN();
    expect(n.parseNumber(new Decimal(3.25))).toEqual([3n, 25n]);
    expect(n.parseNumber(new Decimal(300.255))).toEqual([
      300n,
      2549999999999954525264911353588104248046875n,
    ]);
  });

  test("test_parse_paisa", () => {
    const n = new Num2Word_BN();
    expect(n.parsePaisa(new Decimal(3.25))).toEqual([3n, 25n]);
    expect(n.parsePaisa(300.255)).toEqual([300n, 25n]);
    expect(n.parsePaisa(100.5)).toEqual([100n, 50n]);
  });

  test("test_number_to_bengali_word", () => {
    const n = new Num2Word_BN();
    expect(n._numberToBengaliWord(3n)).toBe("তিন");
    expect(n._numberToBengaliWord(2550n)).toBe("দুই হাজার পাঁচশত পঞ্চাশ");
    expect(n._numberToBengaliWord(9999999999999999n)).toBe(
      "নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই কোটি নিরানব্বই লাখ নিরানব্বই হাজার নয়শত নিরানব্বই",
    );
  });
});
