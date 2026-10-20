// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_VI.py

import { Num2Word_Base } from "../base.ts";
import { checkKwargs } from "../internal/kwargs.ts";
import {
  at,
  Decimal,
  float,
  floordiv,
  int,
  missingAttribute,
  mod,
  OverflowError,
  type PyNum,
  ROUND_HALF_EVEN,
} from "../py.ts";

const to_19 = [
  "không",
  "một",
  "hai",
  "ba",
  "bốn",
  "năm",
  "sáu",
  "bảy",
  "tám",
  "chín",
  "mười",
  "mười một",
  "mười hai",
  "mười ba",
  "mười bốn",
  "mười lăm",
  "mười sáu",
  "mười bảy",
  "mười tám",
  "mười chín",
] as const;
const tens = [
  "hai mươi",
  "ba mươi",
  "bốn mươi",
  "năm mươi",
  "sáu mươi",
  "bảy mươi",
  "tám mươi",
  "chín mươi",
] as const;
const denom = [
  "",
  "nghìn",
  "triệu",
  "tỷ",
  "nghìn tỷ",
  "trăm nghìn tỷ",
  "Quintillion",
  "Sextillion",
  "Septillion",
  "Octillion",
  "Nonillion",
  "Decillion",
  "Undecillion",
  "Duodecillion",
  "Tredecillion",
  "Quattuordecillion",
  "Sexdecillion",
  "Septendecillion",
  "Octodecillion",
  "Novemdecillion",
  "Vigintillion",
] as const;

/** Python's `'%.2f' % number`, which converts ints and Decimals to float first. */
function formatFixed2(number: PyNum): string {
  const f = float(number);
  if (typeof number === "bigint" && !Number.isFinite(f)) {
    throw new OverflowError("int too large to convert to float");
  }
  if (Number.isNaN(f)) return "nan";
  if (!Number.isFinite(f)) return f > 0 ? "inf" : "-inf";
  // Correctly rounded from the exact binary value, like C's printf.
  return new Decimal(f).quantize(Decimal.of(1n, -2), ROUND_HALF_EVEN).toString();
}

/**
 * Upstream's Num2Word_VI is a plain class, not a Num2Word_Base subclass. It
 * extends Num2Word_Base here only to fit CONVERTER_CLASSES: methods upstream
 * lacks raise AttributeError, and its methods take no keyword arguments.
 */
export class Num2Word_VI extends Num2Word_Base {
  _convertNn(val: bigint): string {
    if (val < 20n) {
      return at(to_19, Number(val));
    }
    for (let v = 0; v < tens.length; v++) {
      const dcap = tens[v] as string;
      const dval = 20n + 10n * BigInt(v);
      if (dval + 10n > val) {
        if (mod(val, 10n)) {
          let a: string;
          if (to_19[Number(mod(val, 10n))] === "một") {
            a = "mốt";
          } else {
            a = to_19[Number(mod(val, 10n))] as string;
          }
          if (to_19[Number(mod(val, 10n))] === "năm") {
            a = "lăm";
          }
          return `${dcap} ${a}`;
        }
        return dcap;
      }
    }
    // Python falls off the loop and returns None.
    return null as unknown as string;
  }

  _convertNnn(val: bigint): string {
    let word = "";
    const [modv, rem] = [mod(val, 100n), floordiv(val, 100n)];
    if (rem > 0n) {
      word = `${at(to_19, Number(rem))} trăm`;
      if (modv > 0n) {
        word = `${word} `;
      }
    }
    if (modv > 0n && modv < 10n) {
      if (modv === 5n) {
        word = word !== "" ? `${word}lẻ năm` : `${word}năm`;
      } else {
        word = word !== "" ? `${word}lẻ ${this._convertNn(modv)}` : word + this._convertNn(modv);
      }
    }
    if (modv >= 10n) {
      word = word + this._convertNn(modv);
    }
    return word;
  }

  vietnamNumber(val: bigint): string {
    if (val < 100n) {
      return this._convertNn(val);
    }
    if (val < 1000n) {
      return this._convertNnn(val);
    }
    for (let v = 0; v < denom.length; v++) {
      const didx = v - 1;
      const dval = 1000n ** BigInt(v);
      if (dval > val) {
        const modv = 1000n ** BigInt(didx);
        const lval = floordiv(val, modv);
        const r = val - lval * modv;

        let ret = `${this._convertNnn(lval)} ${at(denom, didx)}`;
        if (99n >= r && r > 0n) {
          ret = `${this._convertNnn(lval)} ${at(denom, didx)} lẻ`;
        }
        if (r > 0n) {
          ret = `${ret} ${this.vietnamNumber(r)}`;
        }
        return ret;
      }
    }
    // Python falls off the loop and returns None.
    return null as unknown as string;
  }

  numberToText(number: PyNum): string {
    const formatted = formatFixed2(number);
    const theList = formatted.split(".");
    const startWord = this.vietnamNumber(int(theList[0] as string));
    let finalResult = startWord;
    if (theList.length > 1 && int(theList[1] as string) > 0n) {
      const endWord = this.vietnamNumber(int(theList[1] as string));
      if (finalResult === null || endWord === null) {
        throw new TypeError('can only concatenate str (not "NoneType") to str');
      }
      finalResult = `${finalResult} phẩy ${endWord}`;
    }
    return finalResult;
  }

  override toCardinal(number: PyNum, options?: object): string {
    checkKwargs(options, [], "to_cardinal");
    return this.numberToText(number);
  }

  override toOrdinal(number: PyNum, options?: object): string {
    checkKwargs(options, [], "to_ordinal");
    return this.toCardinal(number);
  }

  override toOrdinalNum(_value: PyNum): string {
    throw missingAttribute("Num2Word_VI", "to_ordinal_num");
  }

  override toYear(_value: PyNum): string {
    throw missingAttribute("Num2Word_VI", "to_year");
  }

  override toCurrency(_value: PyNum | string): string {
    throw missingAttribute("Num2Word_VI", "to_currency");
  }

  override strToNumber(_value: string): PyNum {
    throw missingAttribute("Num2Word_VI", "str_to_number");
  }
}
