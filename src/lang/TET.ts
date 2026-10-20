// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_TET.py

import type { CurrencyForm, CurrencyForms, Split, WordPair } from "../base.ts";
import { parseCurrencyParts } from "../currency.ts";
import {
  abs,
  at,
  cmp,
  getItem,
  int,
  KeyError,
  NotImplementedError,
  type PyNum,
  str,
} from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

const DOLLAR: CurrencyForm = ["dolar", "dolar"];
const CENTS: CurrencyForm = ["sentavu", "sentavu"];

function isPair(x: Split): x is WordPair {
  return x.length === 2 && typeof x[0] === "string" && typeof x[1] === "bigint";
}

/** Python's `str.count(sub)` (non-overlapping). */
function countOf(s: string, sub: string): number {
  return s.split(sub).length - 1;
}

export interface TetCurrencyOptions {
  currency?: string;
  cents?: boolean;
}

export class Num2Word_TET extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    AUD: [DOLLAR, CENTS],
    CAD: [DOLLAR, CENTS],
    EUR: [["euro", "euros"], CENTS],
    GBP: [
      ["pound sterling", "pound sterling"],
      ["pence", "pence"],
    ],
    USD: [DOLLAR, CENTS],
  };

  static override GIGA_SUFFIX: string | null = null;
  static override MEGA_SUFFIX: string | null = "iliaun";

  declare count: number;
  declare hundreds: Record<number, string>;

  override setup(): void {
    super.setup();
    const lows = ["kuatr", "tr", "b", "m"];
    this.highNumwords = this.genHighNumwords([], [], lows);
    this.negword = "menus ";
    this.pointword = "vírgula";
    this.excludeTitle = ["resin", "vírgula", "menus"];
    this.count = 0;

    this.midNumwords = [
      [1000n, "rihun"],
      [100n, "atus"],
      [90n, "sianulu"],
      [80n, "ualunulu"],
      [70n, "hitunulu"],
      [60n, "neenulu"],
      [50n, "limanulu"],
      [40n, "haatnulu"],
      [30n, "tolunulu"],
      [20n, "ruanulu"],
    ];
    this.lowNumwords = [
      "sanulu",
      "sia",
      "ualu",
      "hitu",
      "neen",
      "lima",
      "haat",
      "tolu",
      "rua",
      "ida",
      "mamuk",
    ];
    this.hundreds = {
      1: "atus",
      2: "atus rua",
      3: "atus tolu",
      4: "atus haat",
      5: "atus lima",
      6: "atus neen",
      7: "atus hitu",
      8: "atus ualu",
      9: "atus sia",
    };
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    const [ctext, cnum] = curr;
    const [ntext, nnum] = next;

    if (cnum === 1n && nnum < 100n) return next;

    if (nnum < cnum) {
      if (nnum < 10n) {
        const valueStr = (cnum + nnum).toString();
        if (int(valueStr) > 100n) {
          const zeroList = valueStr.slice(1, -1);
          const allZero = [...zeroList].every((element) => element === "0");
          if (allZero) {
            if (this.count >= 1) {
              this.count += 0;
              return [`ho ${ctext} ${ntext}`, cnum + nnum];
            }
            this.count += 1;
            return [`${ctext} ${ntext}`, cnum + nnum];
          }
        }
        return [`${ctext} resin ${ntext}`, cnum + nnum];
      }
      return [`${ctext} ${ntext}`, cnum + nnum];
    }

    return [`${ntext} ${ctext}`, cnum * nnum];
  }

  hoResult(result: string, value: PyNum): string {
    const index = result.indexOf("ho");
    const countHo = countOf(result, "ho");

    if (index !== -1 && countHo >= 1) {
      const indexRihun = result.indexOf("rihun");
      const valueStr = str(value).length;
      if (indexRihun !== -1 && valueStr > 7) {
        result = result.replaceAll("rihun ho", "ho rihun");
      }
      const lows = ["kuatr", "tr", "b", "m"];
      const MEGA_SUFFIX = "iliaun";
      for (const low of lows) {
        result = result.replaceAll(`${low}${MEGA_SUFFIX} ho`, `ho ${low}${MEGA_SUFFIX}`);
      }
      const removeFirstHo = result.startsWith("ho");
      if (removeFirstHo) result = result.slice(3);
    }
    return result;
  }

  removeHo(result: string, value: PyNum): string {
    const valueStr = str(value);
    result = this.hoResult(result, value);
    const endValue = valueStr.slice(0, -4);
    const endTrue = endValue.endsWith("0");
    if (endTrue === false) {
      if (cmp(value, 100n) > 0) {
        if (at(valueStr, -1) !== "0" && at(valueStr, -2) === "0") {
          result = result.replaceAll("ho", "");
          result = result.replaceAll("  ", " ");
        }
      }
    }
    return result;
  }

  override toCardinal(value: PyNum): string {
    const result = super.toCardinal(value);
    const results = this.removeHo(result, value);
    return results;
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    const out = "";
    // verify_ordinal guarantees an integral value; Python's splitnum on an
    // integral float yields the same int pairs.
    let val = this.splitnum(int(value)) as Split[];
    let outs: Split[] = val;
    while (val.length !== 1) {
      outs = [];
      const [left, right] = val as [Split, Split];
      if (isPair(left) && isPair(right)) {
        outs.push(this.merge(left, right));
        if (val.length > 2) outs.push(val.slice(2) as Split);
      } else {
        for (const elem of val) {
          if (!isPair(elem)) {
            if (elem.length === 1) {
              outs.push(elem[0] as Split);
            } else {
              outs.push(this.clean(elem));
            }
          } else {
            outs.push(elem);
          }
        }
      }
      val = outs;
    }

    let [words, num] = outs[0] as WordPair;

    words = this.removeHo(words, value);

    if ([90n, 80n, 70n, 60n, 50n, 40n, 30n, 20n, 10n, 9n, 8n, 7n, 5n, 3n, 2n].includes(num)) {
      words = `da${words}k`;
    }
    if ([6n, 4n].includes(num)) words = `da${words}`;
    if (num === 1n) words = "dahuluk";
    if ([900n, 800n, 700n, 500n, 300n, 200n, 100n].includes(num)) {
      words = `dah${words}k`;
    }
    if ([600n, 400n].includes(num)) words = `dah${words}`;

    const wordsSplit = words.split(/\s+/).filter(Boolean);
    if (wordsSplit.length >= 3 && num < 100n) {
      const firstWord = `da${wordsSplit[0]}`;
      const secondWord = wordsSplit.slice(1).join(" ");
      if (secondWord.includes("haat") || secondWord.includes("neen")) {
        words = `${firstWord} ${secondWord}`;
      } else {
        words = `${firstWord} ${secondWord}k`;
      }
    }

    const wordFirst = `dah${at(wordsSplit, 0)}`;
    if (wordFirst === "dahatus" && wordsSplit.length >= 3) {
      const wordSecond = wordsSplit.slice(1).join(" ");
      if (wordSecond.includes("haat") || wordSecond.includes("neen")) {
        words = `${wordFirst} ${wordSecond}`;
      } else {
        words = `${wordFirst} ${wordSecond}k`;
      }
    }

    if (num.toString().length > 3) {
      const last = wordsSplit.slice(-1);
      if (last.includes("haat") || last.includes("neen")) {
        words = `da${words}`;
      } else {
        words = `da${words}k`;
      }
    }

    const result = this.title(out + words);

    return result;
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)}º`;
  }

  override toYear(val: PyNum, _options: { longval?: boolean } = {}): string {
    if (cmp(val, 0n) < 0) return `${this.toCardinal(abs(val))} antes Kristu`;
    return this.toCardinal(val);
  }

  /**
   * @param val Numeric value
   * @returns Formatted string
   */
  override toCurrency(val: PyNum | string, options: TetCurrencyOptions = {}): string {
    for (const key of Object.keys(options)) {
      if (key !== "currency" && key !== "cents") {
        throw new TypeError(`to_currency() got an unexpected keyword argument '${key}'`);
      }
    }
    const currency = options.currency ?? "USD";
    const cents = options.cents ?? true;
    const [left, right, isNegative] = parseCurrencyParts(val);

    let forms: CurrencyForms;
    try {
      forms = getItem(this.cls.CURRENCY_FORMS, currency);
    } catch (e) {
      if (!(e instanceof KeyError)) throw e;
      throw new NotImplementedError(
        `Currency code "${currency}" not implemented for "${this.constructor.name}"`,
      );
    }
    const [cr1, cr2] = forms;

    const minusStr = isNegative ? `${this.negword.trim()} ` : "";
    const moneyStr = this._moneyVerbose(left, currency);
    const centsStr = cents
      ? this._centsVerbose(right, currency)
      : this._centsTerse(right, currency);

    if (right === 0n) {
      return `${minusStr}${this.pluralize(left, cr1)} ${moneyStr}`;
    }
    return `${minusStr}${this.pluralize(left, cr1)} ${moneyStr} ${this.pluralize(right, cr2)} ${centsStr}`;
  }
}
