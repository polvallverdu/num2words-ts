// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_NO.py

import type { CurrencyForms, CurrencyOptions, WordPair } from "../base.ts";
import { centuryDigitIsZeroExactMod, type YearOptions } from "../internal/year.ts";
import { type PyNum, str, zip } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

export class Num2Word_NO extends Num2Word_EU {
  static override GIGA_SUFFIX: string | null = "illard";
  static override MEGA_SUFFIX: string | null = "illion";
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    NOK: [
      ["krone", "kroner"],
      ["øre", "øre"],
    ],
  };

  declare ordsPl: Record<string, string>;
  declare ordsSg: Record<string, string>;

  override setHighNumwords(high: string[]): void {
    const cap = 3 + 6 * high.length;
    const cls = this.constructor as typeof Num2Word_NO;
    const ns: number[] = [];
    for (let n = cap; n > 3; n -= 6) ns.push(n);

    for (const [word, n] of zip(high, ns)) {
      if (cls.GIGA_SUFFIX) {
        this.cards.set(10n ** BigInt(n), word + cls.GIGA_SUFFIX);
      }

      if (cls.MEGA_SUFFIX) {
        this.cards.set(10n ** BigInt(n - 3), word + cls.MEGA_SUFFIX);
      }
    }
  }

  override setup(): void {
    super.setup();

    this.negword = "minus ";
    this.pointword = "komma";
    this.excludeTitle = ["og", "komma", "minus"];

    this.midNumwords = [
      [1000n, "tusen"],
      [100n, "hundre"],
      [90n, "nitti"],
      [80n, "\xe5tti"],
      [70n, "sytti"],
      [60n, "seksti"],
      [50n, "femti"],
      [40n, "f\xf8rti"],
      [30n, "tretti"],
    ];
    this.lowNumwords = [
      "tjue",
      "nitten",
      "atten",
      "sytten",
      "seksten",
      "femten",
      "fjorten",
      "tretten",
      "tolv",
      "elleve",
      "ti",
      "ni",
      "\xe5tte",
      "syv",
      "seks",
      "fem",
      "fire",
      "tre",
      "to",
      "en",
      "null",
    ];
    this.ordsPl = {
      to: "andre",
      tre: "tredje",
      fire: "fjerde",
      fem: "femte",
      seks: "sjette",
      syv: "syvende",
      "\xe5tte": "\xe5ttende",
      ni: "niende",
      ti: "tiende",
      elleve: "ellevte",
      tolv: "tolvte",
      fjorten: "fjortende",
      femten: "femtende",
      seksten: "sekstende",
      sytten: "syttende",
      atten: "attende",
      nitten: "nittende",
      tjue: "tjuende",
      hundre: "hundrede",
      tusen: "tusende",
      million: "millionte",
    };
    // this needs to be done separately to not block 13-19 to_ordinal
    this.ordsSg = { en: "f\xf8rste" };
  }

  override merge(lpair: WordPair, rpair: WordPair): WordPair {
    const [ltext, lnum] = lpair;
    const [rtext, rnum] = rpair;
    if (lnum === 1n && rnum < 100n) {
      return [rtext, rnum];
    } else if (100n > lnum && lnum > rnum) {
      return [`${ltext}${rtext}`, lnum + rnum];
    } else if (lnum >= 100n && 100n > rnum) {
      return [`${ltext} og ${rtext}`, lnum + rnum];
    } else if (rnum > lnum) {
      return [`${ltext} ${rtext}`, lnum * rnum];
    }
    return [`${ltext} ${rtext}`, lnum + rnum];
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    let outword = this.toCardinal(value);
    for (const key of Object.keys(this.ordsPl)) {
      if (outword.endsWith(key)) {
        outword = outword.slice(0, outword.length - key.length) + this.ordsPl[key];
        break;
      }
    }
    for (const key of Object.keys(this.ordsSg)) {
      if (outword.endsWith(key)) {
        outword = outword.slice(0, outword.length - key.length) + this.ordsSg[key];
        break;
      }
    }
    return outword;
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)}.`;
  }

  override toYear(val: PyNum, options: YearOptions = {}): string {
    const longval = options.longval ?? true;
    if (centuryDigitIsZeroExactMod(val)) {
      return this.toCardinal(val);
    }
    return this.toSplitnum(val, { hightxt: "hundre", jointxt: "og", longval });
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    let result = super.toCurrency(val, {
      currency: options.currency ?? "NOK",
      cents: options.cents ?? true,
      separator: options.separator ?? " og",
      adjective: options.adjective ?? false,
    });

    // do not print "og null øre"
    result = result.replaceAll(" og null øre", "");
    return result;
  }
}
