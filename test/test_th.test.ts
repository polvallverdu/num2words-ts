// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_th.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words } from "../src/index.ts";
import { Num2Word_TH } from "../src/lang/TH.ts";

describe("TestNumWord", () => {
  test("test_0", () => {
    expect(num2words(0, { lang: "th" })).toBe("ศูนย์");
  });

  test("test_end_with_1", () => {
    expect(num2words(21, { lang: "th" })).toBe("ยี่สิบเอ็ด");
    expect(num2words(11, { lang: "th" })).toBe("สิบเอ็ด");
    expect(num2words(101, { lang: "th" })).toBe("หนึ่งร้อยเอ็ด");
    expect(num2words(1201, { lang: "th" })).toBe("หนึ่งพันสองร้อยเอ็ด");
  });

  test("test_start_20", () => {
    expect(num2words(22, { lang: "th" })).toBe("ยี่สิบสอง");
    expect(num2words(27, { lang: "th" })).toBe("ยี่สิบเจ็ด");
  });

  test("test_start_10", () => {
    expect(num2words(10, { lang: "th" })).toBe("สิบ");
    expect(num2words(18, { lang: "th" })).toBe("สิบแปด");
  });

  test("test_1_to_9", () => {
    expect(num2words(1, { lang: "th" })).toBe("หนึ่ง");
    expect(num2words(5, { lang: "th" })).toBe("ห้า");
    expect(num2words(9, { lang: "th" })).toBe("เก้า");
  });

  test("test_31_to_99", () => {
    expect(num2words(31, { lang: "th" })).toBe("สามสิบเอ็ด");
    expect(num2words(48, { lang: "th" })).toBe("สี่สิบแปด");
    expect(num2words(76, { lang: "th" })).toBe("เจ็ดสิบหก");
  });

  test("test_100_to_999", () => {
    expect(num2words(100, { lang: "th" })).toBe("หนึ่งร้อย");
    expect(num2words(123, { lang: "th" })).toBe("หนึ่งร้อยยี่สิบสาม");
    expect(num2words(456, { lang: "th" })).toBe("สี่ร้อยห้าสิบหก");
    expect(num2words(721, { lang: "th" })).toBe("เจ็ดร้อยยี่สิบเอ็ด");
  });

  test("test_1000_to_9999", () => {
    expect(num2words(1000, { lang: "th" })).toBe("หนึ่งพัน");
    expect(num2words(2175, { lang: "th" })).toBe("สองพันหนึ่งร้อยเจ็ดสิบห้า");
    expect(num2words(4582, { lang: "th" })).toBe("สี่พันห้าร้อยแปดสิบสอง");
    expect(num2words(9346, { lang: "th" })).toBe("เก้าพันสามร้อยสี่สิบหก");
  });

  test("test_10000_to_99999", () => {
    expect(num2words(11111, { lang: "th" })).toBe("หนึ่งหมื่นหนึ่งพันหนึ่งร้อยสิบเอ็ด");
    expect(num2words(22222, { lang: "th" })).toBe("สองหมื่นสองพันสองร้อยยี่สิบสอง");
    expect(num2words(84573, { lang: "th" })).toBe("แปดหมื่นสี่พันห้าร้อยเจ็ดสิบสาม");
  });

  test("test_100000_to_999999", () => {
    expect(num2words(153247, { lang: "th" })).toBe("หนึ่งแสนห้าหมื่นสามพันสองร้อยสี่สิบเจ็ด");
    expect(num2words(562442, { lang: "th" })).toBe("ห้าแสนหกหมื่นสองพันสี่ร้อยสี่สิบสอง");
    expect(num2words(999999, { lang: "th" })).toBe("เก้าแสนเก้าหมื่นเก้าพันเก้าร้อยเก้าสิบเก้า");
  });

  test("test_more_than_million", () => {
    expect(num2words(1000000, { lang: "th" })).toBe("หนึ่งล้าน");
    expect(num2words(1000001, { lang: "th" })).toBe("หนึ่งล้านเอ็ด");
    expect(num2words(42478941, { lang: "th" })).toBe("สี่สิบสองล้านสี่แสนเจ็ดหมื่นแปดพันเก้าร้อยสี่สิบเอ็ด");
    expect(num2words(712696969, { lang: "th" })).toBe("เจ็ดร้อยสิบสองล้านหกแสนเก้าหมื่นหกพันเก้าร้อยหกสิบเก้า");
    expect(num2words(1000000000000000001n, { lang: "th" })).toBe("หนึ่งล้านล้านล้านเอ็ด");
  });

  test("test_decimal", () => {
    expect(num2words(asFloat(0), { lang: "th" })).toBe("ศูนย์");
    expect(num2words(0.0038, { lang: "th" })).toBe("ศูนย์จุดศูนย์ศูนย์สามแปด");
    expect(num2words(0.01, { lang: "th" })).toBe("ศูนย์จุดศูนย์หนึ่ง");
    expect(num2words(1.123, { lang: "th" })).toBe("หนึ่งจุดหนึ่งสองสาม");
    expect(num2words(35.37, { lang: "th" })).toBe("สามสิบห้าจุดสามเจ็ด");
    expect(num2words(1000000.01, { lang: "th" })).toBe("หนึ่งล้านจุดศูนย์หนึ่ง");
  });

  test("test_currency", () => {
    expect(num2words(100, { lang: "th", to: "currency", currency: "THB" })).toBe("หนึ่งร้อยบาทถ้วน");
    expect(num2words(100, { lang: "th", to: "currency", currency: "USD" })).toBe("หนึ่งร้อยดอลลาร์");
    expect(num2words(100, { lang: "th", to: "currency", currency: "EUR" })).toBe("หนึ่งร้อยยูโร");
  });

  test("test_currency_decimal", () => {
    expect(num2words(asFloat(0), { lang: "th", to: "currency" })).toBe("ศูนย์บาทถ้วน");
    expect(num2words(0.05, { lang: "th", to: "currency" })).toBe("ห้าสตางค์");
    expect(num2words(0.5, { lang: "th", to: "currency" })).toBe("ห้าสิบสตางค์");
    expect(num2words(0.99, { lang: "th", to: "currency" })).toBe("เก้าสิบเก้าสตางค์");
    expect(num2words(asFloat(100), { lang: "th", to: "currency" })).toBe("หนึ่งร้อยบาทถ้วน");
    expect(num2words(100.23, { lang: "th", to: "currency", currency: "USD" })).toBe(
      "หนึ่งร้อยดอลลาร์ยี่สิบสามเซนต์",
    );
    expect(num2words(100.24, { lang: "th", to: "currency", currency: "EUR" })).toBe(
      "หนึ่งร้อยยูโรยี่สิบสี่เซนต์",
    );
  });

  test("test_negative", () => {
    expect(num2words(-10, { lang: "th" })).toBe("ติดลบสิบ");
    expect(num2words(-10.5, { lang: "th" })).toBe("ติดลบสิบจุดห้า");
    expect(num2words(asFloat(-100), { lang: "th", to: "currency" })).toBe("ติดลบหนึ่งร้อยบาทถ้วน");
  });

  test("test_round_2_decimal", () => {
    const n2wTH = new Num2Word_TH();
    expect(n2wTH.round2Decimal(0.004)).toEqual(["0.00", false]);
    expect(n2wTH.round2Decimal(0.005)).toEqual(["0.01", false]);
    expect(n2wTH.round2Decimal(0.006)).toEqual(["0.01", false]);
    expect(n2wTH.round2Decimal(0.0005)).toEqual(["0.00", false]);
    expect(n2wTH.round2Decimal(0.984)).toEqual(["0.98", false]);
    expect(n2wTH.round2Decimal(0.989)).toEqual(["0.99", false]);
    expect(n2wTH.round2Decimal(0.994)).toEqual(["0.99", false]);
    expect(n2wTH.round2Decimal(0.999)).toEqual(["1.00", false]);
    expect(n2wTH.round2Decimal(-0.994)).toEqual(["0.99", true]);
    expect(n2wTH.round2Decimal(-0.999)).toEqual(["1.00", true]);
  });

  test("test_split_six", () => {
    const n2wTH = new Num2Word_TH();
    expect(n2wTH.splitSix("123456789")).toEqual(["987654", "321"]);
    expect(n2wTH.splitSix("12345")).toEqual(["54321"]);
    expect(n2wTH.splitSix("1234567")).toEqual(["765432", "1"]);
  });
});
