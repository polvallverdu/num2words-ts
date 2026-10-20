// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_EN.py

import type { WordPair } from "../base.ts";
import { abs, cmp, floordiv, int, mod, type PyNum, str } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

export interface YearOptions {
  suffix?: string | null;
  longval?: boolean;
}

export class Num2Word_EN extends Num2Word_EU {
  declare ords: Record<string, string>;

  override setHighNumwords(high: string[]): void {
    const max = 3 + 3 * high.length;
    let n = max;
    for (const word of high) {
      if (n <= 3) break;
      this.cards.set(10n ** BigInt(n), `${word}illion`);
      n -= 3;
    }
  }

  override setup(): void {
    super.setup();

    this.negword = "minus ";
    this.pointword = "point";
    this.excludeTitle = ["and", "point", "minus"];

    this.midNumwords = [
      [1000n, "thousand"],
      [100n, "hundred"],
      [90n, "ninety"],
      [80n, "eighty"],
      [70n, "seventy"],
      [60n, "sixty"],
      [50n, "fifty"],
      [40n, "forty"],
      [30n, "thirty"],
    ];
    this.lowNumwords = [
      "twenty",
      "nineteen",
      "eighteen",
      "seventeen",
      "sixteen",
      "fifteen",
      "fourteen",
      "thirteen",
      "twelve",
      "eleven",
      "ten",
      "nine",
      "eight",
      "seven",
      "six",
      "five",
      "four",
      "three",
      "two",
      "one",
      "zero",
    ];
    this.ords = {
      one: "first",
      two: "second",
      three: "third",
      four: "fourth",
      five: "fifth",
      six: "sixth",
      seven: "seventh",
      eight: "eighth",
      nine: "ninth",
      ten: "tenth",
      eleven: "eleventh",
      twelve: "twelfth",
    };
  }

  override merge(lpair: WordPair, rpair: WordPair): WordPair {
    const [ltext, lnum] = lpair;
    const [rtext, rnum] = rpair;
    if (lnum === 1n && rnum < 100n) {
      return [rtext, rnum];
    } else if (100n > lnum && lnum > rnum) {
      return [`${ltext}-${rtext}`, lnum + rnum];
    } else if (lnum >= 100n && 100n > rnum) {
      return [`${ltext} and ${rtext}`, lnum + rnum];
    } else if (rnum > lnum) {
      return [`${ltext} ${rtext}`, lnum * rnum];
    }
    return [`${ltext}, ${rtext}`, lnum + rnum];
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    const outwords = this.toCardinal(value).split(" ");
    const lastwords = (outwords[outwords.length - 1] as string).split("-");
    let lastword = (lastwords[lastwords.length - 1] as string).toLowerCase();
    const ord = Object.hasOwn(this.ords, lastword) ? this.ords[lastword] : undefined;
    if (ord !== undefined) {
      lastword = ord;
    } else {
      if (lastword[lastword.length - 1] === "y") {
        lastword = `${lastword.slice(0, -1)}ie`;
      }
      lastword += "th";
    }
    lastwords[lastwords.length - 1] = this.title(lastword);
    outwords[outwords.length - 1] = lastwords.join("-");
    return outwords.join(" ");
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)}${this.toOrdinal(value).slice(-2)}`;
  }

  override toYear(val: PyNum, options: YearOptions = {}): string {
    let suffix = options.suffix ?? null;
    if (cmp(val, 0n) < 0) {
      val = abs(val);
      suffix = !suffix ? "BC" : suffix;
    }
    // Python's // and % keep the operand type: floats stay floats.
    const [high, low]: [PyNum, PyNum] =
      typeof val === "number"
        ? [Math.floor(val / 100), val - 100 * Math.floor(val / 100)]
        : [floordiv(int(val), 100n), mod(int(val), 100n)];
    let valtext: string;
    // If year is 00XX, X00X, or beyond 9999, go cardinal.
    if (
      cmp(high, 0n) === 0 ||
      (cmp(typeof high === "number" ? high % 10 : mod(int(high), 10n), 0n) === 0 &&
        cmp(low, 10n) < 0) ||
      cmp(high, 100n) >= 0
    ) {
      valtext = this.toCardinal(val);
    } else {
      const hightext = this.toCardinal(high);
      let lowtext: string;
      if (cmp(low, 0n) === 0) {
        lowtext = "hundred";
      } else if (cmp(low, 10n) < 0) {
        lowtext = `oh-${this.toCardinal(low)}`;
      } else {
        lowtext = this.toCardinal(low);
      }
      valtext = `${hightext} ${lowtext}`;
    }
    return !suffix ? valtext : `${valtext} ${suffix}`;
  }
}
