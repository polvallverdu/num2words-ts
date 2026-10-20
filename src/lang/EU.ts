// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_EU.py

import { type CurrencyForm, type CurrencyForms, Num2Word_Base } from "../base.ts";

export const GENERIC_DOLLARS: CurrencyForm = ["dollar", "dollars"];
export const GENERIC_CENTS: CurrencyForm = ["cent", "cents"];

export class Num2Word_EU extends Num2Word_Base {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    AUD: [GENERIC_DOLLARS, GENERIC_CENTS],
    BYN: [
      ["rouble", "roubles"],
      ["kopek", "kopeks"],
    ],
    CAD: [GENERIC_DOLLARS, GENERIC_CENTS],
    // repalced by EUR
    EEK: [
      ["kroon", "kroons"],
      ["sent", "senti"],
    ],
    EUR: [["euro", "euro"], GENERIC_CENTS],
    GBP: [
      ["pound sterling", "pounds sterling"],
      ["penny", "pence"],
    ],
    // replaced by EUR
    LTL: [["litas", "litas"], GENERIC_CENTS],
    // replaced by EUR
    LVL: [
      ["lat", "lats"],
      ["santim", "santims"],
    ],
    USD: [GENERIC_DOLLARS, GENERIC_CENTS],
    RUB: [
      ["rouble", "roubles"],
      ["kopek", "kopeks"],
    ],
    SEK: [
      ["krona", "kronor"],
      ["öre", "öre"],
    ],
    NOK: [
      ["krone", "kroner"],
      ["øre", "øre"],
    ],
    PLN: [
      ["zloty", "zlotys", "zlotu"],
      ["grosz", "groszy"],
    ],
    MXN: [["peso", "pesos"], GENERIC_CENTS],
    RON: [
      ["leu", "lei", "de lei"],
      ["ban", "bani", "de bani"],
    ],
    INR: [
      ["rupee", "rupees"],
      ["paisa", "paise"],
    ],
    HUF: [
      ["forint", "forint"],
      ["fillér", "fillér"],
    ],
    ISK: [
      ["króna", "krónur"],
      ["aur", "aurar"],
    ],
    UZS: [
      ["sum", "sums"],
      ["tiyin", "tiyins"],
    ],
    SAR: [
      ["saudi riyal", "saudi riyals"],
      ["halalah", "halalas"],
    ],
  };

  static override CURRENCY_ADJECTIVES: Record<string, string> = {
    AUD: "Australian",
    BYN: "Belarusian",
    CAD: "Canadian",
    EEK: "Estonian",
    USD: "US",
    RUB: "Russian",
    NOK: "Norwegian",
    MXN: "Mexican",
    RON: "Romanian",
    INR: "Indian",
    HUF: "Hungarian",
    ISK: "íslenskar",
    UZS: "Uzbekistan",
    SAR: "Saudi",
  };

  static GIGA_SUFFIX: string | null = "illiard";
  static MEGA_SUFFIX: string | null = "illion";

  override setHighNumwords(high: string[]): void {
    const cap = 3 + 6 * high.length;
    const cls = this.constructor as typeof Num2Word_EU;

    let n = cap;
    for (const word of high) {
      if (n <= 3) break;
      if (cls.GIGA_SUFFIX) {
        this.cards.set(10n ** BigInt(n), word + cls.GIGA_SUFFIX);
      }
      if (cls.MEGA_SUFFIX) {
        this.cards.set(10n ** BigInt(n - 3), word + cls.MEGA_SUFFIX);
      }
      n -= 6;
    }
  }

  genHighNumwords(units: string[], tens: string[], lows: string[]): string[] {
    const out: string[] = [];
    for (const t of tens) for (const u of units) out.push(u + t);
    out.reverse();
    return [...out, ...lows];
  }

  override pluralize(n: bigint, forms: CurrencyForm): string {
    const form = n === 1n ? 0 : 1;
    return forms[form] as string;
  }

  override setup(): void {
    const lows = ["non", "oct", "sept", "sext", "quint", "quadr", "tr", "b", "m"];
    const units = ["", "un", "duo", "tre", "quattuor", "quin", "sex", "sept", "octo", "novem"];
    const tens = [
      "dec",
      "vigint",
      "trigint",
      "quadragint",
      "quinquagint",
      "sexagint",
      "septuagint",
      "octogint",
      "nonagint",
    ];
    this.highNumwords = ["cent", ...this.genHighNumwords(units, tens, lows)];
  }
}
