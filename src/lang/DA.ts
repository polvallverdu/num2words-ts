// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_DA.py

import type { CurrencyOptions, WordPair } from "../base.ts";
import { checkKwargs } from "../internal/kwargs.ts";
import { Decimal, eq, floordiv, int, mod, type PyNum, str } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

/** Python `val // 100` for an int, float or Decimal (Decimal truncates). */
function floordiv100(val: PyNum): PyNum {
  if (typeof val === "bigint") return floordiv(val, 100n);
  if (typeof val === "number") return Math.floor(val / 100);
  // Python's Decimal // truncates toward zero, like bigint division.
  return new Decimal((int(val) / 100n).toString());
}

/** Python `not x % 10` (true when x is a multiple of ten), for int, float or Decimal. */
function isMultipleOf10(x: PyNum): boolean {
  if (typeof x === "bigint") return mod(x, 10n) === 0n;
  if (typeof x === "number") return x % 10 === 0;
  return int(x) % 10n === 0n;
}

export class Num2Word_DA extends Num2Word_EU {
  static override GIGA_SUFFIX: string | null = "illiarder";
  static override MEGA_SUFFIX: string | null = "illioner";

  declare ords: Record<string, string>;
  declare ordflag: boolean;

  override setup(): void {
    super.setup();

    this.negword = "minus ";
    this.pointword = "komma";
    this.excludeTitle = ["og", "komma", "minus"];

    this.midNumwords = [
      [1000n, "tusind"],
      [100n, "hundrede"],
      [90n, "halvfems"],
      [80n, "firs"],
      [70n, "halvfjerds"],
      [60n, "treds"],
      [50n, "halvtreds"],
      [40n, "fyrre"],
      [30n, "tredive"],
    ];
    this.lowNumwords = [
      "tyve",
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
      "otte",
      "syv",
      "seks",
      "fem",
      "fire",
      "tre",
      "to",
      "et",
      "nul",
    ];
    this.ords = {
      nul: "nul",
      et: "f\xf8rste",
      to: "anden",
      tre: "tredje",
      fire: "fjerde",
      fem: "femte",
      seks: "sjette",
      syv: "syvende",
      otte: "ottende",
      ni: "niende",
      ti: "tiende",
      elleve: "ellevte",
      tolv: "tolvte",
      tretten: "trett",
      fjorten: "fjort",
      femten: "femt",
      seksten: "sekst",
      sytten: "sytt",
      atten: "att",
      nitten: "nitt",
      tyve: "tyv",
    };
    this.ordflag = false;
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    let [ctext, cnum] = curr;
    let [ntext, nnum] = next;
    if (next[1] === 100n || next[1] === 1000n) {
      next = [`et${next[0]}`, next[1]];
    }

    if (cnum === 1n) {
      if (nnum < 10n ** 6n || this.ordflag) {
        return next;
      }
      ctext = "en";
    }
    let val: bigint;
    if (nnum > cnum) {
      if (nnum >= 10n ** 6n) {
        ctext += " ";
      }
      val = cnum * nnum;
    } else {
      if (cnum >= 100n && cnum < 1000n) {
        ctext += " og ";
      } else if (cnum >= 1000n && cnum <= 100000n) {
        ctext += "e og ";
      }
      if (nnum < 10n && 10n < cnum && cnum < 100n) {
        if (nnum === 1n) {
          ntext = "en";
        }
        [ntext, ctext] = [ctext, `${ntext}og`];
      } else if (cnum >= 10n ** 6n) {
        ctext += " ";
      }
      val = cnum + nnum;
    }
    const word = ctext + ntext;
    return [word, val];
  }

  override toOrdinal(value: PyNum, options: object = {}): string {
    checkKwargs(options, [], "to_ordinal");
    this.verifyOrdinal(value);
    // DIVERGENCE: restored in `finally`; upstream leaves it set when the call raises, which corrupts
    // later calls on this shared converter. Output of successful calls is unchanged.
    this.ordflag = true;
    let outword: string;
    try {
      outword = this.toCardinal(value);
    } finally {
      this.ordflag = false;
    }
    for (const key of Object.keys(this.ords)) {
      if (outword.endsWith(key)) {
        outword = outword.slice(0, outword.length - key.length) + this.ords[key];
        break;
      }
    }
    // value is a non-negative integral number here (verify_ordinal).
    const rem = mod(int(value), 100n);
    if ((rem >= 30n && rem <= 39n) || rem === 0n) {
      outword += "te";
    } else if (rem > 12n || rem === 0n) {
      outword += "ende";
    }
    return outword;
  }

  override toOrdinalNum(value: PyNum, options: object = {}): string {
    checkKwargs(options, [], "to_ordinal_num");
    this.verifyOrdinal(value);
    const vaerdte = [0n, 1n, 5n, 6n, 11n, 12n];
    const rem = mod(int(value), 100n);
    if ((rem >= 30n && rem <= 39n) || vaerdte.includes(rem)) {
      return `${str(value)}te`;
    } else if (rem === 2n) {
      return `${str(value)}en`;
    }
    return `${str(value)}ende`;
  }

  override toCurrency(
    val: PyNum | string,
    options: CurrencyOptions & { longval?: boolean } = {},
  ): string {
    checkKwargs(options, ["longval"], "to_currency");
    const longval = options.longval ?? true;
    const v = val as PyNum;
    if (eq(floordiv100(v), 1n) || eq(v, 1n)) {
      const ret = this.toSplitnum(v, { hightxt: "kr", lowtxt: "\xf8re", jointxt: "og", longval });
      return `en ${ret.slice(3)}`;
    }
    return this.toSplitnum(v, { hightxt: "kr", lowtxt: "\xf8re", jointxt: "og", longval });
  }

  override toYear(val: PyNum, options: { longval?: boolean } = {}): string {
    checkKwargs(options, ["longval"], "to_year");
    const longval = options.longval ?? true;
    if (eq(val, 1n)) {
      return "en";
    }
    if (isMultipleOf10(floordiv100(val))) {
      return this.toCardinal(val);
    }
    return this.toSplitnum(val, { hightxt: "hundrede", longval });
  }
}
