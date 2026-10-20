// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2018, Abdullah Alhazmy, Alhazmy13.  All Rights Reserved.
// Copyright (c) 2020, Hamidreza Kalbasi.  All Rights Reserved.
// Copyright (c) 2023, Nika Soltani Tehrani.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_FA.py

import { Num2Word_Base } from "../base.ts";
import {
  AttributeError,
  abs,
  at,
  cmp,
  Decimal,
  divmod,
  eq,
  int,
  OverflowError,
  type PyNum,
  ROUND_HALF_EVEN,
  round,
  str,
} from "../py.ts";

const farsiOnes = [
  "",
  "یک",
  "دو",
  "سه",
  "چهار",
  "پنج",
  "شش",
  "هفت",
  "هشت",
  "نه",
  "ده",
  "یازده",
  "دوازده",
  "سیزده",
  "چهارده",
  "پانزده",
  "شانزده",
  "هفده",
  "هجده",
  "نوزده",
];

const farsiTens = ["", "ده", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];

const farsiHundreds = [
  "",
  "صد",
  "دویست",
  "سیصد",
  "چهارصد",
  "پانصد",
  "ششصد",
  "هفتصد",
  "هشتصد",
  "نهصد",
];

const farsiBig = ["", " هزار", " میلیون", " میلیارد", " تریلیون", " تریلیارد"];

const farsiFrac = ["", "دهم", "صدم"];
const farsiFracBig = ["", "هزارم", "میلیونیم", "میلیاردیم"];

const farsiSeperator = " و ";

/**
 * Upstream's methods take no keyword arguments, so Python raises TypeError
 * when num2words forwards any.
 */
function noKwargs(fn: string, options: object | undefined): void {
  for (const key of Object.keys(options ?? {})) {
    throw new TypeError(`${fn}() got an unexpected keyword argument '${key}'`);
  }
}

/** Python `Decimal.__round__()`: half to even, as an int. */
function roundDecimal(d: Decimal): bigint {
  return d.quantize(new Decimal("1"), ROUND_HALF_EVEN).toBigInt();
}

/** Python `math.floor(Decimal)`. */
function floorDecimal(d: Decimal): bigint {
  const t = d.toBigInt();
  return d.compare(t) < 0 ? t - 1n : t;
}

/**
 * Upstream's class derives from `object`, not `Num2Word_Base`; it extends the
 * base here only so it fits the converter table. Everything num2words reaches
 * is overridden with upstream's behavior.
 */
export class Num2Word_FA extends Num2Word_Base {
  // Those are unused
  static MAXNUM = 10n ** 36n;

  declare number: bigint;

  override setup(): void {
    this.errmsgToobig = "Too large";
    this.number = 0n;
  }

  /** Upstream has no `str_to_number`, so num2words fails on strings. */
  override strToNumber(_value: string): PyNum {
    throw new AttributeError("'Num2Word_FA' object has no attribute 'str_to_number'");
  }

  /**
   * Upstream returns `(pre, post, self.precision)`; the base signature allows
   * a pair only, so callers read the precision from `this.precision`.
   */
  override float2tuple(value: PyNum): [bigint, bigint] {
    const pre = int(value);

    // Simple way of finding decimal places to update the precision
    this.precision = Math.abs(new Decimal(str(value)).asTuple().exponent);

    let post: bigint;
    if (typeof value === "bigint") {
      // int arithmetic: abs(value - pre) * 10**precision is an exact int.
      post = abs(value - pre) * 10n ** BigInt(this.precision);
    } else if (typeof value === "number") {
      // float * int converts the int to a float, which overflows past 1e308.
      const scale = Number(10n ** BigInt(this.precision));
      if (!Number.isFinite(scale)) {
        throw new OverflowError("int too large to convert to float");
      }
      const p = Math.abs(value - Number(pre)) * scale;
      if (Math.abs(Number(round(p)) - p) < 0.01) {
        // We generally floor all values beyond our precision (rather than
        // rounding), but in cases where we have something like 1.239999999,
        // which is probably due to python's handling of floats, we actually
        // want to consider it as 1.24 instead of 1.23
        post = round(p);
      } else {
        post = BigInt(Math.floor(p));
      }
    } else {
      const p = value
        .sub(pre)
        .abs()
        .mul(10n ** BigInt(this.precision));
      if (new Decimal(roundDecimal(p)).sub(p).abs().compare(0.01) < 0) {
        post = roundDecimal(p);
      } else {
        post = floorDecimal(p);
      }
    }
    return [pre, post];
  }

  cardinal3(number: bigint): string {
    if (number <= 19n) {
      return at(farsiOnes, Number(number));
    }
    if (number < 100n) {
      const [x, y] = divmod(number, 10n);
      if (y === 0n) {
        return at(farsiTens, Number(x));
      }
      return at(farsiTens, Number(x)) + farsiSeperator + at(farsiOnes, Number(y));
    }
    const [x, y] = divmod(number, 100n);
    if (y === 0n) {
      return at(farsiHundreds, Number(x));
    }
    return at(farsiHundreds, Number(x)) + farsiSeperator + this.cardinal3(y);
  }

  cardinalPos(number: bigint): string {
    let x = number;
    let res = "";
    for (const b of farsiBig) {
      let y: bigint;
      [x, y] = divmod(x, 1000n);
      if (y === 0n) {
        continue;
      }
      let yx = this.cardinal3(y) + b;
      if (b === " هزار" && y === 1n) {
        yx = "هزار";
      }
      if (res === "") {
        res = yx;
      } else {
        res = yx + farsiSeperator + res;
      }
    }
    return res;
  }

  fractional(number: bigint, level: number): string {
    if (number === 5n) {
      return "نیم";
    }
    const x = this.cardinalPos(number);
    const ld3 = Math.floor(level / 3);
    const lm3 = level % 3;
    const ltext = `${at(farsiFrac, lm3)} ${at(farsiFracBig, ld3)}`.trim();
    return `${x} ${ltext}`;
  }

  override toCurrency(value: PyNum | string, options?: object): string {
    noKwargs("to_currency", options);
    return `${this.toCardinal(value as PyNum)} تومان`;
  }

  override toOrdinal(number: PyNum, options?: object): string {
    noKwargs("to_ordinal", options);
    const r = this.toCardinal(number);
    if (at(r, -1) === "ه" && at(r, -2) === "س") {
      return `${r.slice(0, -1)}وم`;
    }
    return `${r}م`;
  }

  override toYear(value: PyNum, options?: object): string {
    noKwargs("to_year", options);
    return this.toCardinal(value);
  }

  override toOrdinalNum(value: PyNum, options?: object): string {
    noKwargs("to_ordinal_num", options);
    return `${str(value)}م`;
  }

  override toCardinal(number: PyNum, options?: object): string {
    noKwargs("to_cardinal", options);
    // Plain float comparisons for floats: cmp/eq would reject inf before
    // upstream's int(inf) raises OverflowError.
    if (typeof number === "number" ? number < 0 : cmp(number, 0n) < 0) {
      const neg: PyNum =
        typeof number === "bigint" ? -number : typeof number === "number" ? -number : number.neg();
      return `منفی ${this.toCardinal(neg)}`;
    }
    if (typeof number === "number" ? number === 0 : eq(number, 0n)) {
      return "صفر";
    }
    const [x, y] = this.float2tuple(number);
    const level = this.precision;
    if (y === 0n) {
      return this.cardinalPos(x);
    }
    if (x === 0n) {
      return this.fractional(y, level);
    }
    return this.cardinalPos(x) + farsiSeperator + this.fractional(y, level);
  }
}
