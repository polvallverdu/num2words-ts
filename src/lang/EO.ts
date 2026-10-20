// Copyright (c) 2021, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_EO.py

import {
  type CurrencyForm,
  type CurrencyForms,
  type CurrencyOptions,
  Num2Word_Base,
  type WordPair,
} from "../base.ts";
import { at, type PyNum, range, str, zip } from "../py.ts";

export class Num2Word_EO extends Num2Word_Base {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    EUR: [
      ["eŭro", "eŭroj"],
      ["centimo", "centimoj"],
    ],
    USD: [
      ["dolaro", "dolaroj"],
      ["cendo", "cendoj"],
    ],
    FRF: [
      ["franko", "frankoj"],
      ["centimo", "centimoj"],
    ],
    GBP: [
      ["pundo", "pundoj"],
      ["penco", "pencoj"],
    ],
    CNY: [
      ["juano", "juanoj"],
      ["feno", "fenoj"],
    ],
  };

  static GIGA_SUFFIX: string | null = "iliardo";
  static MEGA_SUFFIX: string | null = "iliono";

  declare ords: Record<string, string>;

  override setHighNumwords(high: string[]): void {
    const cap = 3 + 6 * high.length;
    const cls = this.constructor as typeof Num2Word_EO;

    for (const [word, n] of zip(high, range(cap, 3, -6))) {
      if (cls.GIGA_SUFFIX) {
        this.cards.set(10n ** BigInt(n), word + cls.GIGA_SUFFIX);
      }

      if (cls.MEGA_SUFFIX) {
        this.cards.set(10n ** BigInt(n - 3), word + cls.MEGA_SUFFIX);
      }
    }
  }

  genHighNumwords(units: string[], tens: string[], lows: string[]): string[] {
    const out: string[] = [];
    for (const t of tens) for (const u of units) out.push(u + t);
    out.reverse();
    return [...out, ...lows];
  }

  override setup(): void {
    const lows = ["naŭ", "ok", "sep", "ses", "kvin", "kvar", "tr", "b", "m"];
    const units = ["", "un", "duo", "tre", "kvatuor", "kvin", "seks", "septen", "okto", "novem"];
    const tens = [
      "dek",
      "vigint",
      "trigint",
      "kvadragint",
      "kvinkvagint",
      "seksagint",
      "septuagint",
      "oktogint",
      "nonagint",
    ];

    this.highNumwords = ["cent", ...this.genHighNumwords(units, tens, lows)];

    this.negword = "minus ";
    this.pointword = "komo";
    this.errmsgNonnum = "Sole nombroj povas esti konvertita en vortojn.";
    this.errmsgToobig = "Tro granda nombro por esti konvertita en vortojn (abs(%s) > %s).";
    this.excludeTitle = ["kaj", "komo", "minus"];
    this.midNumwords = [
      [1000n, "mil"],
      [100n, "cent"],
      [90n, "naŭdek"],
      [80n, "okdek"],
      [70n, "sepdek"],
      [60n, "sesdek"],
      [50n, "kvindek"],
      [40n, "kvardek"],
      [30n, "tridek"],
    ];
    this.lowNumwords = [
      "dudek",
      "dek naŭ",
      "dek ok",
      "dek sep",
      "dek ses",
      "dek kvin",
      "dek kvar",
      "dek tri",
      "dek du",
      "dek unu",
      "dek",
      "naŭ",
      "ok",
      "sep",
      "ses",
      "kvin",
      "kvar",
      "tri",
      "du",
      "unu",
      "nul",
    ];
    this.ords = {
      unu: "unua",
      du: "dua",
      tri: "tria",
      kvar: "kvara",
      kvin: "kvina",
      ses: "sesa",
      sep: "sepa",
      ok: "oka",
      naŭ: "naŭa",
      dek: "deka",
    };
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    const [ctext, cnum] = curr;
    const [ntext, nnum] = next;
    if (cnum === 1n && nnum < 1000000n) {
      return next;
    }

    if (nnum >= 10n ** 6n && cnum > 1n) {
      return [`${ctext} ${ntext}j`, cnum + nnum];
    }

    if (nnum === 100n) {
      return [`${ctext}${ntext}`, cnum + nnum];
    }

    return [`${ctext} ${ntext}`, cnum + nnum];
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    let word = this.toCardinal(value);
    for (const [src, repl] of Object.entries(this.ords)) {
      if (word.endsWith(src)) {
        word = word.slice(0, -src.length) + repl;
        return word;
      }
    }

    if (word.endsWith("o")) {
      word = `${word.slice(0, -1)}a`;
    } else if (word.endsWith("oj")) {
      word = `${word.slice(0, -2)}a`;
    } else {
      word = `${word}a`;
    }
    return word;
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    let out = str(value);
    out += "a";
    return out;
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    const result = super.toCurrency(val, {
      currency: options.currency ?? "EUR",
      cents: options.cents ?? true,
      separator: options.separator ?? " kaj",
      adjective: options.adjective ?? false,
    });
    return result;
  }

  override pluralize(n: bigint, forms: CurrencyForm): string {
    const form = n <= 1n ? 0 : 1;
    return at(forms, form);
  }
}
