// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_FR.py

import type { CurrencyForms, CurrencyOptions, WordPair } from "../base.ts";
import { at, eq, mod, type PyNum, str } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

export class Num2Word_FR extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    EUR: [
      ["euro", "euros"],
      ["centime", "centimes"],
    ],
    USD: [
      ["dollar", "dollars"],
      ["cent", "cents"],
    ],
    FRF: [
      ["franc", "francs"],
      ["centime", "centimes"],
    ],
    GBP: [
      ["livre", "livres"],
      ["penny", "pence"],
    ],
    CNY: [
      ["yuan", "yuans"],
      ["fen", "jiaos"],
    ],
  };

  declare ords: Record<string, string>;

  override setup(): void {
    super.setup();

    this.negword = "moins ";
    this.pointword = "virgule";
    this.errmsgNonnum = "Seulement des nombres peuvent être convertis en mots.";
    this.errmsgToobig = "Nombre trop grand pour être converti en mots (abs(%s) > %s).";
    this.excludeTitle = ["et", "virgule", "moins"];
    this.midNumwords = [
      [1000n, "mille"],
      [100n, "cent"],
      [80n, "quatre-vingts"],
      [60n, "soixante"],
      [50n, "cinquante"],
      [40n, "quarante"],
      [30n, "trente"],
    ];
    this.lowNumwords = [
      "vingt",
      "dix-neuf",
      "dix-huit",
      "dix-sept",
      "seize",
      "quinze",
      "quatorze",
      "treize",
      "douze",
      "onze",
      "dix",
      "neuf",
      "huit",
      "sept",
      "six",
      "cinq",
      "quatre",
      "trois",
      "deux",
      "un",
      "zéro",
    ];
    this.ords = {
      cinq: "cinquième",
      neuf: "neuvième",
    };
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    let [ctext, cnum] = curr;
    let [ntext, nnum] = next;

    if (cnum === 1n) {
      if (nnum < 1000000n) return next;
    } else {
      if (
        (!mod(cnum - 80n, 100n) || (!mod(cnum, 100n) && cnum < 1000n)) &&
        nnum < 1000000n &&
        at(ctext, -1) === "s"
      ) {
        ctext = ctext.slice(0, -1);
      }
      if (cnum < 1000n && nnum !== 1000n && at(ntext, -1) !== "s" && !mod(nnum, 100n)) {
        ntext += "s";
      }
    }

    if (nnum < cnum && cnum < 100n) {
      if (mod(nnum, 10n) === 1n && cnum !== 80n) {
        return [`${ctext} et ${ntext}`, cnum + nnum];
      }
      return [`${ctext}-${ntext}`, cnum + nnum];
    }
    if (nnum > cnum) return [`${ctext} ${ntext}`, cnum * nnum];
    return [`${ctext} ${ntext}`, cnum + nnum];
  }

  // Is this right for such things as 1001 - "mille unième" instead of
  // "mille premier"??  "millième"??

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    if (eq(value, 1n)) return "premier";
    let word = this.toCardinal(value);
    let found = false;
    for (const [src, repl] of Object.entries(this.ords)) {
      if (word.endsWith(src)) {
        word = word.slice(0, -src.length) + repl;
        found = true;
        break;
      }
    }
    if (!found) {
      if (at(word, -1) === "e") word = word.slice(0, -1);
      word = `${word}ième`;
    }
    return word;
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    let out = str(value);
    out += eq(value, 1n) ? "er" : "me";
    return out;
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    const result = super.toCurrency(val, {
      currency: options.currency ?? "EUR",
      cents: options.cents ?? true,
      separator: options.separator ?? " et",
      adjective: options.adjective ?? false,
    });
    return result;
  }
}
