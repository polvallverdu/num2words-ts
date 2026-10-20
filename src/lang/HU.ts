// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_HU.py

import type { CurrencyOptions } from "../base.ts";
import {
  abs,
  cmp,
  type Decimal,
  eq,
  floordiv,
  getItem,
  int,
  isIntegral,
  KeyError,
  mod,
  type PyNum,
  RecursionError,
  str,
  ValueError,
} from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

/** Python `x < 0`, also for inf and nan (which `cmp` cannot compare). */
function isNegative(x: PyNum): boolean {
  return typeof x === "number" ? x < 0 : cmp(x, 0n) < 0;
}

/** Python `x == n`, also for inf and nan (which `eq` cannot compare). */
function equals(x: PyNum, n: bigint): boolean {
  return typeof x === "number" ? x === Number(n) : eq(x, n);
}

const ZERO = "nulla";

/** Python's recursion limit, reached by upstream on some floats (e.g. 1e+16). */
const RECURSION_LIMIT = 1000;

export interface CardinalOptions {
  zero?: string;
}

export interface YearOptions {
  suffix?: string | null;
  longval?: boolean;
}

/** Python `divmod(a, b)` for floats. */
function floatDivmod(vx: number, wx: number): [number, number] {
  let m = vx % wx;
  let div = (vx - m) / wx;
  if (m) {
    if (wx < 0 !== m < 0) {
      m += wx;
      div -= 1;
    }
  } else {
    m = wx < 0 ? -0 : 0;
  }
  let fd: number;
  if (div) {
    fd = Math.floor(div);
    if (div - fd > 0.5) fd += 1;
  } else {
    fd = vx / wx < 0 ? -0 : 0;
  }
  return [fd, m];
}

/** Python `a // b` keeping the type of `a` (b is an int). */
function pyFloordiv(a: PyNum, b: bigint): PyNum {
  if (typeof a === "bigint") return floordiv(a, b);
  if (typeof a === "number") return floatDivmod(a, Number(b))[0];
  // Decimal // truncates toward zero.
  return a.divmod(b)[0];
}

/** Python `a % b` keeping the type of `a` (b is an int). */
function pyMod(a: PyNum, b: bigint): PyNum {
  if (typeof a === "bigint") return mod(a, b);
  if (typeof a === "number") return floatDivmod(a, Number(b))[1];
  // Decimal % takes the sign of the dividend.
  return a.divmod(b)[1];
}

function neg(a: PyNum): PyNum {
  if (typeof a === "bigint") return -a;
  if (typeof a === "number") return -a;
  return a.neg();
}

export class Num2Word_HU extends Num2Word_EU {
  static override GIGA_SUFFIX: string | null = "illiárd";
  static override MEGA_SUFFIX: string | null = "illió";

  declare partialOrds: Record<string, string>;
  declare _depth: number;

  override setup(): void {
    super.setup();

    this.negword = "mínusz ";
    this.pointword = "egész";

    this.midNumwords = [
      [1000n, "ezer"],
      [100n, "száz"],
      [90n, "kilencven"],
      [80n, "nyolcvan"],
      [70n, "hetven"],
      [60n, "hatvan"],
      [50n, "ötven"],
      [40n, "negyven"],
      [30n, "harminc"],
    ];

    const lowNumwords = ["kilenc", "nyolc", "hét", "hat", "öt", "négy", "három", "kettő", "egy"];
    this.lowNumwords = [...lowNumwords.map((w) => `tizen${w}`), "tíz", ...lowNumwords];
    this.lowNumwords = [...lowNumwords.map((w) => `huszon${w}`), "húsz", ...this.lowNumwords, ZERO];

    this.partialOrds = {
      nulla: "nullad",
      egy: "egyed",
      kettő: "ketted",
      három: "harmad",
      négy: "negyed",
      öt: "ötöd",
      hat: "hatod",
      hét: "heted",
      nyolc: "nyolcad",
      kilenc: "kilenced",
      tíz: "tized",
      húsz: "huszad",
      harminc: "harmincad",
      negyven: "negyvened",
      ötven: "ötvened",
      hatvan: "hatvanad",
      hetven: "hetvened",
      nyolcvan: "nyolcvanad",
      kilencven: "kilencvened",
      száz: "század",
      ezer: "ezred",
      illió: "milliomod",
      illiárd: "milliárdod",
    };
    this._depth = 0;
  }

  /** `self.cards[value]` (a float or Decimal finds the equal int key, like a dict). */
  private card(value: PyNum): string {
    if (!isIntegral(value)) throw new KeyError(str(value));
    const word = this.cards.get(int(value));
    if (word === undefined) throw new KeyError(str(value));
    return word;
  }

  override toCardinal(value: PyNum, options: CardinalOptions = {}): string {
    if (this._depth >= RECURSION_LIMIT) {
      throw new RecursionError("maximum recursion depth exceeded");
    }
    this._depth++;
    try {
      return this._toCardinal(value, options.zero ?? ZERO);
    } finally {
      this._depth--;
    }
  }

  private _toCardinal(value: PyNum, zero: string): string {
    let out: string;
    if (!eq(int(value), value)) {
      return this.toCardinalFloat(value);
    } else if (cmp(value, 0n) < 0) {
      out = this.negword + this.toCardinal(neg(value));
    } else if (eq(value, 0n)) {
      out = zero;
    } else if (zero === "" && eq(value, 2n)) {
      out = "két";
    } else if (cmp(value, 30n) < 0) {
      out = this.card(value);
    } else if (cmp(value, 100n) < 0) {
      out = this.tensToCardinal(value);
    } else if (cmp(value, 1000n) < 0) {
      out = this.hundredsToCardinal(value);
    } else if (cmp(value, 10n ** 6n) < 0) {
      out = this.thousandsToCardinal(value);
    } else {
      out = this.bigNumberToCardinal(value);
    }
    return out;
  }

  tensToCardinal(value: PyNum): string {
    try {
      return this.card(value);
    } catch (e) {
      if (!(e instanceof KeyError)) throw e;
      return this.card(mulTen(pyFloordiv(value, 10n))) + this.toCardinal(pyMod(value, 10n));
    }
  }

  hundredsToCardinal(value: PyNum): string {
    const hundreds = pyFloordiv(value, 100n);
    let prefix = "száz";
    if (!eq(hundreds, 1n)) {
      prefix = this.toCardinal(hundreds, { zero: "" }) + prefix;
    }
    const postfix = this.toCardinal(pyMod(value, 100n), { zero: "" });
    return prefix + postfix;
  }

  thousandsToCardinal(value: PyNum): string {
    const thousands = pyFloordiv(value, 1000n);
    let prefix = "ezer";
    if (!eq(thousands, 1n)) {
      prefix = this.toCardinal(thousands, { zero: "" }) + prefix;
    }
    const postfix = this.toCardinal(pyMod(value, 1000n), { zero: "" });
    return prefix + (cmp(value, 2000n) <= 0 || !postfix ? "" : "-") + postfix;
  }

  bigNumberToCardinal(value: PyNum): string {
    let digits = str(value).length;
    digits = digits % 3 !== 0 ? digits : digits - 2;
    const exp = 10n ** BigInt(Math.floor(digits / 3) * 3);
    const rest = this.toCardinal(pyMod(value, exp), { zero: "" });
    return (
      this.toCardinal(pyFloordiv(value, exp), { zero: "" }) +
      this.card(exp) +
      (rest ? `-${rest}` : "")
    );
  }

  override toOrdinal(value: PyNum): string {
    if (isNegative(value)) {
      return this.negword + this.toOrdinal(neg(value));
    }
    let out: string;
    if (equals(value, 1n)) {
      return "első";
    } else if (equals(value, 2n)) {
      return "második";
    } else {
      out = this.toCardinal(value);
      for (const [cardWord, ordWord] of Object.entries(this.partialOrds)) {
        if (out.slice(-cardWord.length) === cardWord) {
          out = out.slice(0, -cardWord.length) + ordWord;
          break;
        }
      }
    }
    return `${out}ik`;
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)}.`;
  }

  override toYear(val: PyNum, options: YearOptions = {}): string {
    const suffix = options.suffix ?? null;
    // suffix is prefix here
    let prefix = "";
    if (isNegative(val) || suffix !== null) {
      val = abs(val);
      prefix = suffix !== null ? `${suffix} ` : "i. e. ";
    }
    return prefix + this.toCardinal(val);
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    return super.toCurrency(val, {
      currency: options.currency ?? "HUF",
      cents: options.cents ?? true,
      separator: options.separator ?? ",",
      adjective: options.adjective ?? false,
    });
  }

  override toCardinalFloat(value: PyNum): string {
    if (!eq(abs(value), value)) {
      return this.negword + this.toCardinalFloat(neg(value));
    }
    const parts = str(value).split(".");
    if (parts.length !== 2) {
      throw new ValueError(
        parts.length < 2
          ? `not enough values to unpack (expected 2, got ${parts.length})`
          : "too many values to unpack (expected 2)",
      );
    }
    const [left, right] = parts as [string, string];
    return `${this.toCardinal(int(left))} egész ${this.toCardinal(int(right))} ${getItem(
      this.partialOrds,
      this.card(10n ** BigInt(right.length)),
    )}`;
  }
}

/** `x * 10` keeping the type of `x`. */
function mulTen(x: PyNum): PyNum {
  if (typeof x === "bigint") return x * 10n;
  if (typeof x === "number") return x * 10;
  return (x as Decimal).mul(10n);
}
