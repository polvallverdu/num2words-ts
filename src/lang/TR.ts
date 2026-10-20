// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2017, Tufan Kaynak, Framras.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_TR.py

import { Num2Word_Base } from "../base.ts";
import {
  abs,
  at,
  cmp,
  eq,
  float,
  floordiv,
  getItem,
  int,
  OverflowError,
  type PyNum,
  str,
  ValueError,
} from "../py.ts";

/** Python's `dict.get(key, "")`. */
function get(d: Readonly<Record<string, string>>, key: string): string {
  return Object.hasOwn(d, key) ? (d[key] as string) : "";
}

/**
 * Upstream's methods take no keyword arguments, so any option num2words
 * forwards raises TypeError ("got an unexpected keyword argument").
 */
function noKwargs(options: object | undefined, name: string): void {
  if (options && Object.keys(options).length > 0) {
    throw new TypeError(
      `${name}() got an unexpected keyword argument '${Object.keys(options)[0] as string}'`,
    );
  }
}

/** Python `float(x)` for an int too large for a float raises OverflowError. */
function pyFloat(x: PyNum): number {
  const f = float(x);
  if (typeof x === "bigint" && !Number.isFinite(f)) {
    throw new OverflowError("int too large to convert to float");
  }
  return f;
}

/** Python `abs(value) >= maxval` for any number type (inf included, nan never). */
function geq(value: PyNum, maxval: bigint): boolean {
  const a = abs(value);
  if (typeof a === "number") {
    if (Number.isNaN(a)) return false;
    if (!Number.isFinite(a)) return true;
  }
  return cmp(a, maxval) >= 0;
}

/** Python `val * 10 ** precision`, keeping the operand type. */
function scale(val: PyNum, precision: number): PyNum {
  if (typeof val === "bigint") return val * 10n ** BigInt(precision);
  if (typeof val === "number") return val * Number(10n ** BigInt(precision));
  return val.mul(10n ** BigInt(precision));
}

export class Num2Word_TR extends Num2Word_Base {
  declare CURRENCY_UNIT: string;
  declare CURRENCY_SUBUNIT: string;
  declare DECIMAL_SIGN: string;
  declare ORDINAL_SIGN: string;
  declare ZERO: string;
  declare CARDINAL_ONES: Record<string, string>;
  declare ORDINAL_ONES: Record<string, string>;
  declare CARDINAL_TENS: Record<string, string>;
  declare ORDINAL_TENS: Record<string, string>;
  declare HUNDREDS: Record<string, string>;
  declare CARDINAL_HUNDRED: readonly string[];
  declare ORDINAL_HUNDRED: readonly string[];
  declare CARDINAL_TRIPLETS: Record<string, string>;
  declare ORDINAL_TRIPLETS: Record<string, string>;
  declare integersToRead: string[];
  declare totalTripletsToRead: number;
  declare totalDigitsOutsideTriplets: number;
  declare orderOfLastZeroDigit: number;

  // Upstream overrides __init__ without calling the base one; everything it
  // sets is assigned here (the base constructor then finds no numwords).
  override setup(): void {
    this.precision = 2;
    this.negword = "eksi";
    this.pointword = "virgül";
    this.CURRENCY_UNIT = "lira";
    this.CURRENCY_SUBUNIT = "kuruş";
    this.errmsgNonnum = "Sadece sayılar yazıya çevrilebilir.";
    this.errmsgFloatord = "Tam sayı olmayan {} sıralamada kullanılamaz.";
    this.errmsgNegord = "Pozitif olmayan {} sıralamada kullanılamaz.";
    this.errmsgToobig =
      "abs({}) sayı yazıya çevirmek için çok büyük. Yazıya çevrilebilecek en büyük rakam {}.";
    this.excludeTitle = [];
    this.DECIMAL_SIGN = ",";
    this.ORDINAL_SIGN = ".";
    this.ZERO = "sıfır";
    this.CARDINAL_ONES = {
      "1": "bir",
      "2": "iki",
      "3": "üç",
      "4": "dört",
      "5": "beş",
      "6": "altı",
      "7": "yedi",
      "8": "sekiz",
      "9": "dokuz",
    };
    this.ORDINAL_ONES = {
      "1": "birinci",
      "2": "ikinci",
      "3": "üçüncü",
      "4": "dördüncü",
      "5": "beşinci",
      "6": "altıncı",
      "7": "yedinci",
      "8": "sekizinci",
      "9": "dokuzuncu",
    };
    this.CARDINAL_TENS = {
      "1": "on",
      "2": "yirmi",
      "3": "otuz",
      "4": "kırk",
      "5": "elli",
      "6": "altmış",
      "7": "yetmiş",
      "8": "seksen",
      "9": "doksan",
    };
    this.ORDINAL_TENS = {
      "1": "onuncu",
      "2": "yirminci",
      "3": "otuzuncu",
      "4": "kırkıncı",
      "5": "ellinci",
      "6": "altmışıncı",
      "7": "yetmişinci",
      "8": "sekseninci",
      "9": "doksanıncı",
    };
    this.HUNDREDS = {
      "2": "iki",
      "3": "üç",
      "4": "dört",
      "5": "beş",
      "6": "altı",
      "7": "yedi",
      "8": "sekiz",
      "9": "dokuz",
    };
    this.CARDINAL_HUNDRED = ["yüz"];
    this.ORDINAL_HUNDRED = ["yüzüncü"];
    this.CARDINAL_TRIPLETS = {
      1: "bin",
      2: "milyon",
      3: "milyar",
      4: "trilyon",
      5: "katrilyon",
      6: "kentilyon",
    };
    this.ORDINAL_TRIPLETS = {
      1: "bininci",
      2: "milyonuncu",
      3: "milyarıncı",
      4: "trilyonuncu",
      5: "katrilyonuncu",
      6: "kentilyon",
    };
    this.MAXVAL = 10n ** BigInt((Object.keys(this.CARDINAL_TRIPLETS).length + 1) * 3) - 1n;

    this.integersToRead = [];
    this.totalTripletsToRead = 0;
    this.totalDigitsOutsideTriplets = 0;
    this.orderOfLastZeroDigit = 0;
  }

  override toCardinal(value: PyNum, options?: object): string {
    noKwargs(options, "to_cardinal");
    let wrd = "";
    const isCardinal = this.verifyCardinal(value);
    if (!isCardinal) return wrd;

    if (!eq(int(value), value)) return this.toCardinalFloat(value);

    let preWord: string;
    let v: number;
    if (str(value).startsWith("-")) {
      [preWord, v] = [this.negword, float(str(value).slice(1))];
    } else {
      [preWord, v] = ["", float(value)];
    }

    this.toSplitnum(v);

    const s = (): string => this.integersToRead[0] as string;
    const ch = (k: number): string => at(s(), k);
    const L = (): number => s().length;
    const CT = this.CARDINAL_TRIPLETS;

    if (this.orderOfLastZeroDigit >= L()) {
      // number like 00 and all 0s and even more, raise error
      return `${preWord}${wrd}`;
    }

    if (this.totalTripletsToRead === 1) {
      if (this.totalDigitsOutsideTriplets === 2) {
        if (this.orderOfLastZeroDigit === 1) {
          // number like x0, read cardinal x0 and return
          wrd += get(this.CARDINAL_TENS, ch(0));
          return `${preWord}${wrd}`;
        }
        if (this.orderOfLastZeroDigit === 0) {
          // number like xy, read cardinal xy and return
          wrd += get(this.CARDINAL_TENS, ch(0));
          wrd += get(this.CARDINAL_ONES, ch(1));
        }
        return `${preWord}${wrd}`;
      }

      if (this.totalDigitsOutsideTriplets === 1) {
        if (this.orderOfLastZeroDigit === 0) {
          // number like x, read cardinal x and return
          wrd += get(this.CARDINAL_ONES, ch(0));
          if (ch(0) === "0") return this.ZERO;
          return `${preWord}${wrd}`;
        }
      }

      if (this.totalDigitsOutsideTriplets === 0) {
        if (this.orderOfLastZeroDigit === 2) {
          // number like x00, read cardinal x00 and return
          wrd += get(this.HUNDREDS, ch(0));
          wrd += at(this.CARDINAL_HUNDRED, 0);
          return `${preWord}${wrd}`;
        }
        if (this.orderOfLastZeroDigit === 1) {
          // number like xy0, read cardinal xy0 and return
          wrd += get(this.HUNDREDS, ch(0));
          wrd += at(this.CARDINAL_HUNDRED, 0);
          wrd += get(this.CARDINAL_TENS, ch(1));
          return `${preWord}${wrd}`;
        }
        if (this.orderOfLastZeroDigit === 0) {
          // number like xyz, read cardinal xyz and return
          wrd += get(this.HUNDREDS, ch(0));
          wrd += at(this.CARDINAL_HUNDRED, 0);
          wrd += get(this.CARDINAL_TENS, ch(1));
          wrd += get(this.CARDINAL_ONES, ch(2));
          return `${preWord}${wrd}`;
        }
      }
    }

    if (this.totalTripletsToRead >= 2) {
      if (this.totalDigitsOutsideTriplets === 2) {
        if (this.orderOfLastZeroDigit === L() - 1) {
          // number like x0 and all 0s, read cardinal x0 0..0
          //  and return
          wrd += get(this.CARDINAL_TENS, ch(0));
          wrd += getItem(CT, String(this.totalTripletsToRead - 1));
          return `${preWord}${wrd}`;
        }
        if (this.orderOfLastZeroDigit === L() - 2) {
          // number like xy and all 0s, read cardinal xy 0..0
          //  and return
          wrd += get(this.CARDINAL_TENS, ch(0));
          wrd += get(this.CARDINAL_ONES, ch(1));
          wrd += getItem(CT, String(this.totalTripletsToRead - 1));
          return `${preWord}${wrd}`;
        }
        if (this.orderOfLastZeroDigit < L() - 2) {
          // number like xy and others, read cardinal xy n..n
          //  and return
          wrd += get(this.CARDINAL_TENS, ch(0));
          wrd += get(this.CARDINAL_ONES, ch(1));
          wrd += getItem(CT, String(this.totalTripletsToRead - 1));
        }
      }

      if (this.totalDigitsOutsideTriplets === 1) {
        if (this.orderOfLastZeroDigit === L() - 1) {
          // number like x and all 0s, read cardinal x 0..0
          //  and return
          if (!(this.totalTripletsToRead === 2 && ch(0) === "1")) {
            wrd += get(this.CARDINAL_ONES, ch(0));
          }
          wrd += getItem(CT, String(this.totalTripletsToRead - 1));
          return `${preWord}${wrd}`;
        }
        if (this.orderOfLastZeroDigit < L() - 1) {
          // number like x and others, read cardinal x n..n
          //  and return
          if (!(this.totalTripletsToRead === 2 && ch(0) === "1")) {
            wrd += get(this.CARDINAL_ONES, ch(0));
          }
          wrd += getItem(CT, String(this.totalTripletsToRead - 1));
        }
      }

      if (this.totalDigitsOutsideTriplets === 0) {
        if (this.orderOfLastZeroDigit === L() - 1) {
          // number like x00 and all 0s, read cardinal x00 0..0
          //  and return
          wrd += get(this.HUNDREDS, ch(0));
          wrd += at(this.CARDINAL_HUNDRED, 0);
          wrd += getItem(CT, String(this.totalTripletsToRead - 1));
          return `${preWord}${wrd}`;
        }
        if (this.orderOfLastZeroDigit === L() - 2) {
          // number like xy0 and all 0s, read cardinal xy0 0..0
          //  and return
          wrd += get(this.HUNDREDS, ch(0));
          wrd += at(this.CARDINAL_HUNDRED, 0);
          wrd += get(this.CARDINAL_TENS, ch(1));
          wrd += getItem(CT, String(this.totalTripletsToRead - 1));
          return `${preWord}${wrd}`;
        }
        if (this.orderOfLastZeroDigit === L() - 3) {
          // number like xyz and all 0s, read cardinal xyz 0..0
          //  and return
          wrd += get(this.HUNDREDS, ch(0));
          wrd += at(this.CARDINAL_HUNDRED, 0);
          wrd += get(this.CARDINAL_TENS, ch(1));
          wrd += get(this.CARDINAL_ONES, ch(2));
          wrd += getItem(CT, String(this.totalTripletsToRead - 1));
          return `${preWord}${wrd}`;
        }
        if (this.orderOfLastZeroDigit < L() - 3) {
          // number like xyz and all others, read cardinal xyz n..n
          wrd += get(this.HUNDREDS, ch(0));
          wrd += at(this.CARDINAL_HUNDRED, 0);
          wrd += get(this.CARDINAL_TENS, ch(1));
          if (!(this.totalTripletsToRead === 2 && ch(2) === "1")) {
            wrd += get(this.CARDINAL_ONES, ch(2));
          }
          wrd += getItem(CT, String(this.totalTripletsToRead - 1));
        }
      }

      for (let i = this.totalTripletsToRead - 1; i > 0; i--) {
        const readingTripletOrder = this.totalTripletsToRead - i;
        let lastReadDigitOrder: number;
        if (this.totalDigitsOutsideTriplets === 0) {
          lastReadDigitOrder = readingTripletOrder * 3;
        } else {
          lastReadDigitOrder = (readingTripletOrder - 1) * 3 + this.totalDigitsOutsideTriplets;
        }
        const d = lastReadDigitOrder;

        if (s().slice(d, d + 3) !== "000") {
          if (ch(d) !== "0") {
            wrd += get(this.HUNDREDS, ch(d));
            if (this.orderOfLastZeroDigit === L() - d - 1) {
              if (i === 1) {
                wrd += at(this.CARDINAL_HUNDRED, 0);
                return `${preWord}${wrd}`;
              } else if (i > 1) {
                wrd += at(this.CARDINAL_HUNDRED, 0);
                wrd += getItem(CT, String(i - 1));
                return `${preWord}${wrd}`;
              }
            } else {
              wrd += at(this.CARDINAL_HUNDRED, 0);
            }
          }

          if (ch(d + 1) !== "0") {
            if (this.orderOfLastZeroDigit === L() - d - 2) {
              if (i === 1) {
                wrd += get(this.CARDINAL_TENS, ch(d + 1));
                return `${preWord}${wrd}`;
              } else if (i > 1) {
                wrd += get(this.CARDINAL_TENS, ch(d + 1));
                wrd += getItem(CT, String(i - 1));
                return `${preWord}${wrd}`;
              }
            } else {
              wrd += get(this.CARDINAL_TENS, ch(d + 1));
            }
          }

          if (ch(d + 2) !== "0") {
            if (this.orderOfLastZeroDigit === L() - d - 3) {
              if (i === 1) {
                wrd += get(this.CARDINAL_ONES, ch(d + 2));
                return `${preWord}${wrd}`;
              }
              if (i === 2) {
                if (s().slice(d, d + 2) !== "00") {
                  wrd += get(this.CARDINAL_ONES, ch(d + 2));
                } else if (ch(d + 2) !== "1") {
                  wrd += get(this.CARDINAL_ONES, ch(d + 2));
                }
                wrd += getItem(CT, String(i - 1));
                return `${preWord}${wrd}`;
              }
              if (i > 2) {
                wrd += get(this.CARDINAL_ONES, ch(d + 2));
                wrd += getItem(CT, String(i - 1));
                return `${preWord}${wrd}`;
              }
            } else {
              if (s().slice(d, d + 2) !== "00") {
                wrd += get(this.CARDINAL_ONES, ch(d + 2));
              } else {
                if (i === 2) {
                  if (s().slice(d, d + 2) !== "00") {
                    wrd += get(this.CARDINAL_ONES, ch(d + 2));
                  } else if (ch(d + 2) !== "1") {
                    wrd += get(this.CARDINAL_ONES, ch(d + 2));
                  }
                }
              }
            }
          }

          wrd += getItem(CT, String(i - 1));
        }
      }
    }

    return `${preWord}${wrd}`;
  }

  override toCardinalFloat(value: PyNum): string {
    this.toSplitnum(value);
    let wrd = "";
    wrd += this.pointword;
    const frac = this.integersToRead[1] as string;
    if (frac.length >= 1) wrd += get(this.CARDINAL_TENS, at(frac, 0));

    if (frac.length === 2) wrd += get(this.CARDINAL_ONES, at(frac, 1));

    if (this.integersToRead[0] === "0") {
      wrd = this.ZERO + wrd;
    } else {
      wrd = this.toCardinal(int(this.integersToRead[0] as string)) + wrd;
    }
    return wrd;
  }

  verifyCardinal(value: PyNum): boolean {
    let iscardinal = true;
    let f: number;
    try {
      f = pyFloat(value);
    } catch (e) {
      if (e instanceof ValueError || e instanceof TypeError) {
        throw new TypeError(this.errmsgNonnum);
      }
      throw e;
    }
    if (!eqNum(f, value)) iscardinal = false;
    if (geq(value, this.MAXVAL)) {
      throw new OverflowError(
        this.errmsgToobig.replace("{}", str(value)).replace("{}", str(this.MAXVAL)),
      );
    }
    return iscardinal;
  }

  override verifyOrdinal(value: PyNum): boolean {
    let isordinal = true;
    try {
      if (!eq(int(value), value)) isordinal = false;
      if (!eqNum(abs(value), value)) {
        throw new TypeError(this.errmsgNegord.replace("{}", str(value)));
      }
    } catch (e) {
      if (e instanceof ValueError || e instanceof TypeError) {
        throw new TypeError(this.errmsgNonnum);
      }
      throw e;
    }
    if (geq(value, this.MAXVAL)) {
      throw new OverflowError(
        this.errmsgToobig.replace("{}", str(value)).replace("{}", str(this.MAXVAL)),
      );
    }
    return isordinal;
  }

  override toOrdinal(value: PyNum, options?: object): string {
    noKwargs(options, "to_ordinal");
    let wrd = "";
    const isordinal = this.verifyOrdinal(value);
    if (isordinal) {
      this.toSplitnum(value);

      const s = (): string => this.integersToRead[0] as string;
      const ch = (k: number): string => at(s(), k);
      const L = (): number => s().length;
      const CT = this.CARDINAL_TRIPLETS;
      const OT = this.ORDINAL_TRIPLETS;

      if (this.orderOfLastZeroDigit >= L()) {
        // number like 00 and all 0s and even more, raise error
        return wrd;
      }

      if (this.totalTripletsToRead === 1) {
        if (this.totalDigitsOutsideTriplets === 2) {
          if (this.orderOfLastZeroDigit === 1) {
            // number like x0, read ordinal x0 and return
            wrd += get(this.ORDINAL_TENS, ch(0));
            return wrd;
          }
          if (this.orderOfLastZeroDigit === 0) {
            // number like xy, read ordinal xy and return
            wrd += get(this.CARDINAL_TENS, ch(0));
            wrd += get(this.ORDINAL_ONES, ch(1));
            return wrd;
          }
        }

        if (this.totalDigitsOutsideTriplets === 1) {
          if (this.orderOfLastZeroDigit === 0) {
            // number like x, read ordinal x and return
            wrd += get(this.ORDINAL_ONES, ch(0));
            if (ch(0) === "0") return "sıfırıncı";
            return wrd;
          }
        }

        if (this.totalDigitsOutsideTriplets === 0) {
          if (this.orderOfLastZeroDigit === 2) {
            // number like x00, read ordinal x00 and return
            wrd += get(this.HUNDREDS, ch(0));
            wrd += at(this.ORDINAL_HUNDRED, 0);
            return wrd;
          }
          if (this.orderOfLastZeroDigit === 1) {
            // number like xy0, read ordinal xy0 and return
            wrd += get(this.HUNDREDS, ch(0));
            wrd += at(this.CARDINAL_HUNDRED, 0);
            wrd += get(this.ORDINAL_TENS, ch(1));
            return wrd;
          }
          if (this.orderOfLastZeroDigit === 0) {
            // number like xyz, read ordinal xyz and return
            wrd += get(this.HUNDREDS, ch(0));
            wrd += at(this.CARDINAL_HUNDRED, 0);
            wrd += get(this.CARDINAL_TENS, ch(1));
            if (ch(2) !== "0") wrd += get(this.ORDINAL_ONES, ch(2));
            return wrd;
          }
        }
      }

      if (this.totalTripletsToRead >= 2) {
        if (this.totalDigitsOutsideTriplets === 2) {
          if (this.orderOfLastZeroDigit === L() - 1) {
            // number like x0 and all 0s, read ordinal x0 0..0
            //  and return
            wrd += get(this.CARDINAL_TENS, ch(0));
            wrd += getItem(OT, String(this.totalTripletsToRead - 1));
            return wrd;
          }
          if (this.orderOfLastZeroDigit === L() - 2) {
            // number like xy and all 0s, read ordinal xy 0..0
            //  and return
            wrd += get(this.CARDINAL_TENS, ch(0));
            wrd += get(this.CARDINAL_ONES, ch(1));
            wrd += getItem(OT, String(this.totalTripletsToRead - 1));
            return wrd;
          }
          if (this.orderOfLastZeroDigit < L() - 2) {
            // number like xy and others, read cardinal xy n..n
            //  and return
            wrd += get(this.CARDINAL_TENS, ch(0));
            wrd += get(this.CARDINAL_ONES, ch(1));
            wrd += getItem(CT, String(this.totalTripletsToRead - 1));
          }
        }

        if (this.totalDigitsOutsideTriplets === 1) {
          if (this.orderOfLastZeroDigit === L() - 1) {
            // number like x and all 0s, read ordinal x 0..0
            //  and return
            if (!(this.totalTripletsToRead === 2 && ch(0) === "1")) {
              wrd += get(this.CARDINAL_ONES, ch(0));
            }
            wrd += getItem(OT, String(this.totalTripletsToRead - 1));
            return wrd;
          }
          if (this.orderOfLastZeroDigit < L() - 1) {
            // number like x and others, read cardinal x n..n
            //  and return
            if (!(this.totalTripletsToRead === 2 && ch(0) === "1")) {
              wrd += get(this.CARDINAL_ONES, ch(0));
            }
            wrd += getItem(CT, String(this.totalTripletsToRead - 1));
          }
        }

        if (this.totalDigitsOutsideTriplets === 0) {
          if (this.orderOfLastZeroDigit === L() - 1) {
            // number like x00 and all 0s, read ordinal x00 0..0
            //  and return
            wrd += get(this.HUNDREDS, ch(0));
            wrd += at(this.CARDINAL_HUNDRED, 0);
            wrd += getItem(OT, String(this.totalTripletsToRead - 1));
            return wrd;
          }
          if (this.orderOfLastZeroDigit === L() - 2) {
            // number like xy0 and all 0s, read ordinal xy0 0..0
            //  and return
            wrd += get(this.HUNDREDS, ch(0));
            wrd += at(this.CARDINAL_HUNDRED, 0);
            wrd += get(this.CARDINAL_TENS, ch(1));
            wrd += getItem(OT, String(this.totalTripletsToRead - 1));
            return wrd;
          }
          if (this.orderOfLastZeroDigit === L() - 3) {
            // number like xyz and all 0s, read ordinal xyz 0..0
            //  and return
            wrd += get(this.HUNDREDS, ch(0));
            wrd += at(this.CARDINAL_HUNDRED, 0);
            wrd += get(this.CARDINAL_TENS, ch(1));
            wrd += get(this.CARDINAL_ONES, ch(2));
            wrd += getItem(OT, String(this.totalTripletsToRead - 1));
            return wrd;
          }
          if (this.orderOfLastZeroDigit < L() - 3) {
            // number like xyz and all others, read cardinal
            //  xyz n..n
            wrd += get(this.HUNDREDS, ch(0));
            wrd += at(this.CARDINAL_HUNDRED, 0);
            wrd += get(this.CARDINAL_TENS, ch(1));
            if (!(this.totalTripletsToRead === 2 && ch(2) === "1")) {
              wrd += get(this.CARDINAL_ONES, ch(2));
            }
            wrd += getItem(CT, String(this.totalTripletsToRead - 1));
          }
        }

        for (let i = this.totalTripletsToRead - 1; i > 0; i--) {
          const readingTripletOrder = this.totalTripletsToRead - i;
          let lastReadDigitOrder: number;
          if (this.totalDigitsOutsideTriplets === 0) {
            lastReadDigitOrder = readingTripletOrder * 3;
          } else {
            lastReadDigitOrder = (readingTripletOrder - 1) * 3 + this.totalDigitsOutsideTriplets;
          }
          const d = lastReadDigitOrder;

          if (s().slice(d, d + 3) !== "000") {
            if (ch(d) !== "0") {
              if (ch(d) !== "1") {
                wrd += get(this.CARDINAL_ONES, ch(d));
              }
              if (this.orderOfLastZeroDigit === L() - d - 1) {
                if (i === 1) {
                  wrd += at(this.ORDINAL_HUNDRED, 0);
                  return wrd;
                } else if (i > 1) {
                  wrd += at(this.CARDINAL_HUNDRED, 0);
                  wrd += getItem(OT, String(i - 1));
                  return wrd;
                }
              } else {
                wrd += at(this.CARDINAL_HUNDRED, 0);
              }
            }

            if (ch(d + 1) !== "0") {
              if (this.orderOfLastZeroDigit === L() - d - 2) {
                if (i === 1) {
                  wrd += get(this.ORDINAL_TENS, ch(d + 1));
                  return wrd;
                } else if (i > 1) {
                  wrd += get(this.CARDINAL_TENS, ch(d + 1));
                  wrd += getItem(OT, String(i - 1));
                  return wrd;
                }
              } else {
                wrd += get(this.CARDINAL_TENS, ch(d + 1));
              }
            }

            if (ch(d + 2) !== "0") {
              if (this.orderOfLastZeroDigit === L() - d - 3) {
                if (i === 1) {
                  wrd += get(this.ORDINAL_ONES, ch(d + 2));
                  return wrd;
                }
                if (i === 2) {
                  if (s().slice(d, d + 2) !== "00") {
                    wrd += get(this.CARDINAL_ONES, ch(d + 2));
                  } else if (ch(d + 2) !== "1") {
                    wrd += get(this.CARDINAL_ONES, ch(d + 2));
                  }
                  wrd += getItem(OT, String(i - 1));
                  return wrd;
                }
                if (i > 2) {
                  wrd += get(this.CARDINAL_ONES, ch(d + 2));
                  wrd += getItem(OT, String(i - 1));
                  return wrd;
                }
              } else {
                if (s().slice(d, d + 2) !== "00") {
                  wrd += get(this.CARDINAL_ONES, ch(d + 2));
                } else {
                  if (s().slice(d, d + 2) !== "00") {
                    wrd += get(this.CARDINAL_ONES, ch(d + 2));
                  } else if (ch(d + 2) !== "1") {
                    wrd += get(this.CARDINAL_ONES, ch(d + 2));
                  }
                }
              }
            }

            wrd += getItem(CT, String(i - 1));
          }
        }
      }
    }

    return wrd;
  }

  override toOrdinalNum(value: PyNum, options?: object): string {
    noKwargs(options, "to_ordinal_num");
    this.verifyOrdinal(value);
    return `${str(value)}${this.toOrdinal(value).slice(-4)}`;
  }

  // Upstream's to_splitnum(val) replaces the base method's signature.
  override toSplitnum(val: PyNum): string {
    const floatDigits = str(int(scale(val, this.precision)));
    if (int(val) !== 0n) {
      this.integersToRead = [
        str(int(val)),
        // JavaScript's slice counts a negative start from the end, like Python.
        floatDigits.slice(floatDigits.length - this.precision),
      ];
    } else {
      this.integersToRead = [
        "0",
        "0".repeat(Math.max(0, this.precision - floatDigits.length)) +
          floatDigits.slice(floatDigits.length - this.precision),
      ];
    }
    const len0 = (this.integersToRead[0] as string).length;
    if (len0 % 3 > 0) {
      this.totalTripletsToRead = Number(floordiv(BigInt(len0), 3n)) + 1;
    } else if (len0 % 3 === 0) {
      this.totalTripletsToRead = Number(floordiv(BigInt(len0), 3n));
    }
    this.totalDigitsOutsideTriplets = len0 % 3;

    const okunacak = [...(this.integersToRead[0] as string)].reverse();
    this.orderOfLastZeroDigit = 0;
    let found = 0;
    for (let i = 0; i < okunacak.length - 1; i++) {
      if (int(okunacak[i] as string) === 0n && found === 0) {
        this.orderOfLastZeroDigit = i + 1;
      } else {
        found = 1;
      }
    }
    // Python returns None.
    return undefined as unknown as string;
  }

  override toCurrency(value: PyNum | string, options?: object): string {
    noKwargs(options, "to_currency");
    if (int(value) === 0n) return "bedelsiz";
    const valueparts = this.toCardinal(value as PyNum).split(this.pointword);
    if (valueparts.length === 1) return (valueparts[0] as string) + this.CURRENCY_UNIT;
    if (valueparts.length === 2) {
      return valueparts.join(this.CURRENCY_UNIT) + this.CURRENCY_SUBUNIT;
    }
    // Python falls through and returns None.
    return undefined as unknown as string;
  }
}

/** Python `a == b` where `a` may be a float (nan never equals). */
function eqNum(a: PyNum, b: PyNum): boolean {
  if (typeof a === "number" && !Number.isFinite(a)) {
    return typeof b === "number" && a === b;
  }
  if (typeof b === "number" && !Number.isFinite(b)) return false;
  return eq(a, b);
}
