// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_NL.py

import type { CurrencyForm, CurrencyForms, WordPair } from "../base.ts";
import { centuryDigitIsZeroFloatMod } from "../internal/year.ts";
import { at, type PyNum, str } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

/** Options of `toYear`. */
export interface YearOptions {
  longval?: boolean;
}

export class Num2Word_NL extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    EUR: [
      ["euro", "euro"],
      ["cent", "cent"],
    ],
    GBP: [
      ["pond", "pond"],
      ["penny", "pence"],
    ],
    USD: [
      ["dollar", "dollar"],
      ["cent", "cent"],
    ],
    CNY: [
      ["yuan", "yuan"],
      ["jiao", "fen"],
    ],
  };

  static override GIGA_SUFFIX: string | null = "iljard";
  static override MEGA_SUFFIX: string | null = "iljoen";

  declare ords: Record<string, string>;

  override setup(): void {
    super.setup();

    this.negword = "min ";
    this.pointword = "komma";
    // "Cannot treat float %s as ordinal."
    this.errmsgFloatord =
      "Het zwevende puntnummer %s kan niet omgezet worden " + "naar een ordernummer.";
    // "type(((type(%s)) ) not in [long, int, float]"
    this.errmsgNonnum = "Alleen nummers (type (%s)) kunnen naar " + "woorden omgezet worden.";
    // "Cannot treat negative num %s as ordinal."
    this.errmsgNegord = "Het negatieve getal %s kan niet omgezet " + "worden naar een ordernummer.";
    // "abs(%s) must be less than %s."
    this.errmsgToobig = "Het getal %s moet minder zijn dan %s.";
    this.excludeTitle = [];

    const lows = ["non", "okt", "sept", "sext", "quint", "quadr", "tr", "b", "m"];
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

    this.highNumwords = ["zend", ...this.genHighNumwords(units, tens, lows)];

    this.midNumwords = [
      [1000n, "duizend"],
      [100n, "honderd"],
      [90n, "negentig"],
      [80n, "tachtig"],
      [70n, "zeventig"],
      [60n, "zestig"],
      [50n, "vijftig"],
      [40n, "veertig"],
      [30n, "dertig"],
    ];

    this.lowNumwords = [
      "twintig",
      "negentien",
      "achttien",
      "zeventien",
      "zestien",
      "vijftien",
      "veertien",
      "dertien",
      "twaalf",
      "elf",
      "tien",
      "negen",
      "acht",
      "zeven",
      "zes",
      "vijf",
      "vier",
      "drie",
      "twee",
      "één",
      "nul",
    ];

    // Wiktionary says it is "nulde", not "nulte" or "nule"
    // https://en.wiktionary.org/wiki/nulde
    this.ords = {
      nul: "nuld",
      één: "eerst",
      twee: "tweed",
      drie: "derd",
      vier: "vierd",
      vijf: "vijfd",
      zes: "zesd",
      zeven: "zevend",
      acht: "achtst",
      negen: "negend",
      tien: "tiend",
      elf: "elfd",
      twaalf: "twaalfd",

      ig: "igst",
      erd: "erdst",
      end: "endst",
      joen: "joenst",
      rd: "rdst",
    };
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    let [ctext] = curr;
    const cnum = curr[1];
    let [ntext] = next;
    const nnum = next[1];

    if (cnum === 1n) {
      if (nnum < 10n ** 6n) {
        return next;
      }
      ctext = "een";
    }

    let val: bigint;
    if (nnum > cnum) {
      if (nnum >= 10n ** 6n) {
        ctext += " ";
      }
      val = cnum * nnum;
    } else {
      if (nnum < 10n && 10n < cnum && cnum < 100n) {
        if (nnum === 1n) {
          ntext = "een";
        }

        if (ntext.endsWith("e")) {
          ntext += "ën"; // "n"
        } else {
          ntext += "en";
        }
        [ntext, ctext] = [ctext, ntext]; // + "en"
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
    let outword = this.toCardinal(value);
    for (const key of Object.keys(this.ords)) {
      if (outword.endsWith(key)) {
        outword = outword.slice(0, outword.length - key.length) + (this.ords[key] as string);
        break;
      }
    }
    return `${outword}e`;
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)}e`;
  }

  /**
   * gettext form is nplurals=2; plural=(n != 1);
   * but this claims https://onzetaal.nl/taaladvies/euro-euros/
   * not sure if it's applied only to euro
   */
  override pluralize(_n: bigint, forms: CurrencyForm): string {
    return at(forms, 0);
  }

  override toYear(val: PyNum, options: YearOptions = {}): string {
    const longval = options.longval ?? true;
    if (centuryDigitIsZeroFloatMod(val)) {
      return this.toCardinal(val);
    }
    return this.toSplitnum(val, { hightxt: "honderd", longval });
  }
}
