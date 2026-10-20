// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_DE.py

import type { CurrencyForms, CurrencyOptions, WordPair } from "../base.ts";
import { centuryDigitIsZeroFloatMod } from "../internal/year.ts";
import { type PyNum, str } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

/** Options of `toYear`. */
export interface YearOptions {
  longval?: boolean;
}

export class Num2Word_DE extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    EUR: [
      ["Euro", "Euro"],
      ["Cent", "Cent"],
    ],
    GBP: [
      ["Pfund", "Pfund"],
      ["Penny", "Pence"],
    ],
    USD: [
      ["Dollar", "Dollar"],
      ["Cent", "Cent"],
    ],
    CNY: [
      ["Yuan", "Yuan"],
      ["Jiao", "Fen"],
    ],
    DEM: [
      ["Mark", "Mark"],
      ["Pfennig", "Pfennig"],
    ],
  };

  static override GIGA_SUFFIX: string | null = "illiarde";
  static override MEGA_SUFFIX: string | null = "illion";

  declare ords: Record<string, string>;

  override setup(): void {
    this.negword = "minus ";
    this.pointword = "Komma";
    // "Cannot treat float %s as ordinal."
    this.errmsgFloatord =
      "Die Gleitkommazahl %s kann nicht in eine Ordnungszahl " + "konvertiert werden.";
    // "type(((type(%s)) ) not in [long, int, float]"
    this.errmsgNonnum = "Nur Zahlen (type(%s)) können in Wörter konvertiert werden.";
    // "Cannot treat negative num %s as ordinal."
    this.errmsgNegord =
      "Die negative Zahl %s kann nicht in eine Ordnungszahl " + "konvertiert werden.";
    // "abs(%s) must be less than %s."
    this.errmsgToobig = "Die Zahl %s muss kleiner als %s sein.";
    this.excludeTitle = [];

    const lows = ["Non", "Okt", "Sept", "Sext", "Quint", "Quadr", "Tr", "B", "M"];
    const units = ["", "un", "duo", "tre", "quattuor", "quin", "sex", "sept", "okto", "novem"];
    const tens = [
      "dez",
      "vigint",
      "trigint",
      "quadragint",
      "quinquagint",
      "sexagint",
      "septuagint",
      "oktogint",
      "nonagint",
    ];
    this.highNumwords = ["zent", ...this.genHighNumwords(units, tens, lows)];
    this.midNumwords = [
      [1000n, "tausend"],
      [100n, "hundert"],
      [90n, "neunzig"],
      [80n, "achtzig"],
      [70n, "siebzig"],
      [60n, "sechzig"],
      [50n, "f\xFCnfzig"],
      [40n, "vierzig"],
      [30n, "drei\xDFig"],
    ];
    this.lowNumwords = [
      "zwanzig",
      "neunzehn",
      "achtzehn",
      "siebzehn",
      "sechzehn",
      "f\xFCnfzehn",
      "vierzehn",
      "dreizehn",
      "zw\xF6lf",
      "elf",
      "zehn",
      "neun",
      "acht",
      "sieben",
      "sechs",
      "f\xFCnf",
      "vier",
      "drei",
      "zwei",
      "eins",
      "null",
    ];
    this.ords = {
      eins: "ers",
      drei: "drit",
      acht: "ach",
      sieben: "sieb",
      ig: "igs",
      ert: "erts",
      end: "ends",
      ion: "ions",
      nen: "ns",
      rde: "rds",
      rden: "rds",
    };
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    let [ctext] = curr;
    const cnum = curr[1];
    let [ntext] = next;
    const nnum = next[1];

    if (cnum === 1n) {
      if (nnum === 100n || nnum === 1000n) {
        return [`ein${ntext}`, nnum];
      } else if (nnum < 10n ** 6n) {
        return next;
      }
      ctext = "eine";
    }

    let val: bigint;
    if (nnum > cnum) {
      if (nnum >= 10n ** 6n) {
        if (cnum > 1n) {
          if (ntext.endsWith("e")) {
            ntext += "n";
          } else {
            ntext += "en";
          }
        }
        ctext += " ";
      }
      val = cnum * nnum;
    } else {
      if (nnum < 10n && 10n < cnum && cnum < 100n) {
        if (nnum === 1n) {
          ntext = "ein";
        }
        [ntext, ctext] = [ctext, `${ntext}und`];
      } else if (cnum >= 10n ** 6n) {
        ctext += " ";
      }
      val = cnum + nnum;
    }

    const word = ctext + ntext;
    return [word, val];
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    let outword = this.toCardinal(value).toLowerCase();
    for (const key of Object.keys(this.ords)) {
      if (outword.endsWith(key)) {
        outword = outword.slice(0, outword.length - key.length) + (this.ords[key] as string);
        break;
      }
    }

    let res = `${outword}te`;

    // Exception: "hundertste" is usually preferred over "einhundertste"
    if (res === "eintausendste" || res === "einhundertste") {
      res = res.replace("ein", "");
    }
    // ... similarly for "millionste" etc.
    res = res.replace(/eine ([a-z]+(illion|illiard)ste)$/, (_m, g1: string) => g1);
    // Ordinals involving "Million" etc. are written without a space.
    // see https://de.wikipedia.org/wiki/Million#Sprachliches
    res = res.replace(/ ([a-z]+(illion|illiard)ste)$/, (_m, g1: string) => g1);

    return res;
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)}.`;
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    const result = super.toCurrency(val, {
      currency: options.currency ?? "EUR",
      cents: options.cents ?? true,
      separator: options.separator ?? " und",
      adjective: options.adjective ?? false,
    });
    // Handle exception, in german is "ein Euro" and not "eins Euro"
    return result.replaceAll("eins ", "ein ");
  }

  override toYear(val: PyNum, options: YearOptions = {}): string {
    const longval = options.longval ?? true;
    if (centuryDigitIsZeroFloatMod(val)) {
      return this.toCardinal(val);
    }
    return this.toSplitnum(val, { hightxt: "hundert", longval }).replaceAll(" ", "");
  }
}
