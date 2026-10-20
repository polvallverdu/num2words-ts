// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_TH.py

import { type CurrencyForms, Num2Word_Base, type Split } from "../base.ts";
import { parseCurrencyParts } from "../currency.ts";
import { at, cmp, Decimal, int, NotImplementedError, type PyNum, str } from "../py.ts";
import { splitbyx } from "../utils.ts";

/** Python `x < 0`, also for inf and nan (which `cmp` cannot compare). */
function isNegative(x: PyNum): boolean {
  return typeof x === "number" ? x < 0 : cmp(x, 0n) < 0;
}

export interface CurrencyOptions {
  currency?: string;
}

export class Num2Word_TH extends Num2Word_Base {
  // Upstream assigns CURRENCY_FORMS on the instance in setup().
  declare CURRENCY_FORMS: Record<string, CurrencyForms>;

  override setup(): void {
    this.negword = "ติดลบ";
    this.pointword = "จุด";

    this.CURRENCY_FORMS = {
      THB: [
        ["บาท", "บาท"],
        ["สตางค์", "สตางค์"],
      ],
      USD: [
        ["ดอลลาร์", "ดอลลาร์"],
        ["เซนต์", "เซนต์"],
      ],
      EUR: [
        ["ยูโร", "ยูโร"],
        ["เซนต์", "เซนต์"],
      ],
    };

    this.highNumwords = [];

    // Upstream keeps plain words here (indexed by digit position), not pairs.
    this.midNumwords = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"] as unknown as [
      bigint,
      string,
    ][];

    this.lowNumwords = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  }

  private get midWords(): string[] {
    return this.midNumwords as unknown as string[];
  }

  override setHighNumwords(_highNumwords: string[]): void {}

  override setMidNumwords(_midNumwords: [bigint, string][]): void {}

  // Python float2tuple on any number type: precision comes from str(value).
  override float2tuple(value: PyNum): [bigint, bigint] {
    if (typeof value === "number") return super.float2tuple(value);
    const pre = int(value);
    this.precision = Math.abs(new Decimal(str(value)).asTuple().exponent);
    if (typeof value === "bigint") return [pre, 0n];
    // A Decimal times 10 ** (its own decimal places) is integral.
    const post = value
      .sub(pre)
      .abs()
      .mul(10n ** BigInt(this.precision));
    return [pre, post.toBigInt()];
  }

  override splitnum(value: bigint): Split;
  override splitnum(sixNum: string): string;
  override splitnum(sixNum: string | bigint): Split | string {
    const digits = str(sixNum);
    const length = digits.length > 1;
    let wordNum = "";

    for (let index = 0; index < digits.length; index++) {
      const num = Number(int(digits[index] as string));
      if (num) {
        if (index) {
          wordNum = at(this.midWords, index) + wordNum;
        }

        if (length && num === 1 && index === 0) {
          wordNum += "เอ็ด";
        } else if (index === 1 && num === 2) {
          wordNum = `ยี่${wordNum}`;
        } else if (index !== 1 || num !== 1) {
          wordNum = at(this.lowNumwords as string[], num) + wordNum;
        }
      } else if (num === 0 && index === 0 && !length) {
        wordNum = at(this.lowNumwords as string[], 0);
      }
    }

    return wordNum;
  }

  splitSix(numTxt: string): string[] {
    const result = [...splitbyx(numTxt, 6, false)].reverse();
    const numberList: string[] = [];
    for (const i of result) {
      numberList.push([...i].reverse().join(""));
    }
    return numberList;
  }

  addTextMillion(wordNum: string[]): string {
    let result = "";

    const reversed = [...wordNum].reverse();
    for (let index = 0; index < reversed.length; index++) {
      const t = reversed[index] as string;
      if (index === 0) {
        result = t;
      } else {
        result = `${result}ล้าน${t}`;
      }
    }

    return result;
  }

  round2Decimal(number: PyNum | string): [string, boolean] {
    const [integerN, centsN, negative] = parseCurrencyParts(number, false);
    const integer = integerN.toString();
    let cents = centsN.toString();

    if (cents.length < 2) {
      const addZero = 2 - cents.length;
      cents = "0".repeat(addZero) + cents;
    }

    const textNum = `${integer}.${cents}`;

    return [textNum, negative];
  }

  leftNumToText(number: string): string {
    const leftNumList = this.splitSix(number);

    const leftTextList: string[] = [];
    for (const i of leftNumList) {
      leftTextList.push(this.splitnum(i));
    }

    return this.addTextMillion(leftTextList);
  }

  override toCardinal(number: PyNum): string {
    const negative = isNegative(number);

    const [preN, postN] = this.float2tuple(number);
    const precision = this.precision;
    let pre = preN.toString();
    let post = postN.toString();

    if (negative) {
      pre = pre.replace(/^-+/, "");
    }

    if (post.length < precision) {
      const addZero = precision - post.length;
      post = "0".repeat(addZero) + post;
    }

    let result = this.leftNumToText(pre);

    let rightText = "";
    if (!(post === "0")) {
      for (const c of post) {
        rightText = rightText + at(this.lowNumwords as string[], Number(int(c)));
      }
      result = `${result}จุด${rightText}`;
    }

    if (negative) {
      result = `ติดลบ${result}`;
    }

    return result;
  }

  override toOrdinal(number: PyNum): string {
    return this.toCardinal(number);
  }

  override toCurrency(number: PyNum | string, options: CurrencyOptions = {}): string {
    for (const key of Object.keys(options)) {
      if (key !== "currency") {
        throw new TypeError(`to_currency() got an unexpected keyword argument '${key}'`);
      }
    }
    const currency = options.currency ?? "THB";

    const [numberTxt, negative] = this.round2Decimal(number);

    const splitNum = numberTxt.split(".");

    const leftNum = splitNum[0] as string;
    const leftText = this.leftNumToText(leftNum);

    const rightNum = splitNum[1] as string;
    const rightText = this.splitnum([...rightNum].reverse().join("").replace(/0+$/, ""));

    const forms = this.CURRENCY_FORMS[currency];
    if (!Object.hasOwn(this.CURRENCY_FORMS, currency) || !forms) {
      throw new NotImplementedError(
        `Currency code "${currency}" not implemented for "${this.constructor.name}"`,
      );
    }
    const [cr1, cr2] = forms;

    let result: string;
    if (rightNum === "00") {
      if (currency === "THB") {
        result = `${leftText}${cr1[0]}ถ้วน`;
      } else {
        result = leftText + cr1[0];
      }
    } else {
      if (leftNum === "0") {
        result = rightText + cr2[0];
      } else {
        result = leftText + cr1[0] + rightText + cr2[0];
      }
    }

    if (negative) {
      result = this.negword + result;
    }

    return result;
  }
}
