// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_SK.py

import { type CurrencyForm, type CurrencyForms, Num2Word_Base } from "../base.ts";
import { getItem, int, NotImplementedError, type PyNum, str, ValueError } from "../py.ts";
import { getDigitsStrictNumbers, splitbyxStrictList } from "../utils.ts";

const ZERO = ["nula"] as const;

const ONES: Record<string, readonly [string, string, ReadonlySet<number>]> = {
  1: ["jeden", "jeden", new Set()],
  2: ["dva", "dve", new Set([1, 3, 5, 7, 9])],
  3: ["tri", "tri", new Set()],
  4: ["štyri", "štyri", new Set()],
  5: ["päť", "päť", new Set()],
  6: ["šesť", "šesť", new Set()],
  7: ["sedem", "sedem", new Set()],
  8: ["osem", "osem", new Set()],
  9: ["deväť", "deväť", new Set()],
};

const TENS: Record<string, readonly [string]> = {
  0: ["desať"],
  1: ["jedenásť"],
  2: ["dvanásť"],
  3: ["trinásť"],
  4: ["štrnásť"],
  5: ["pätnásť"],
  6: ["šestnásť"],
  7: ["sedemnásť"],
  8: ["osemnásť"],
  9: ["devätnásť"],
};

const TWENTIES: Record<string, readonly [string]> = {
  2: ["dvadsať"],
  3: ["tridsať"],
  4: ["štyridsať"],
  5: ["päťdesiat"],
  6: ["šesťdesiat"],
  7: ["sedemdesiat"],
  8: ["osemdesiat"],
  9: ["deväťdesiat"],
};

const HUNDREDS: Record<string, readonly [string]> = {
  1: ["sto"],
  2: ["dvesto"],
  3: ["tristo"],
  4: ["štyristo"],
  5: ["päťsto"],
  6: ["šesťsto"],
  7: ["sedemsto"],
  8: ["osemsto"],
  9: ["deväťsto"],
};

const THOUSANDS: Record<string, CurrencyForm> = {
  1: ["tisíc", "tisíc", "tisíc"], // 10^3
  2: ["milión", "milióny", "miliónov"], // 10^6
  3: ["miliarda", "miliardy", "miliárd"], // 10^9
  4: ["bilión", "bilióny", "biliónov"], // 10^12
  5: ["biliarda", "biliardy", "biliárd"], // 10^15
  6: ["trilión", "trilióny", "triliónov"], // 10^18
  7: ["triliarda", "triliardy", "triliárd"], // 10^21
  8: ["kvadrilión", "kvadrilióny", "kvadriliónov"], // 10^24
  9: ["kvadriliarda", "kvadriliardy", "kvadriliárd"], // 10^27
  10: ["kvintilión", "kvintillióny", "kvintiliónov"], // 10^30
};

export class Num2Word_SK extends Num2Word_Base {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    EUR: [
      ["euro", "eurá", "eur"],
      ["cent", "centy", "centov"],
    ],
  };

  override setup(): void {
    this.negword = "mínus";
    this.pointword = "celých";
  }

  override toCardinal(number: PyNum): string {
    const n = str(number).replaceAll(",", ".");
    if (n.includes(".")) {
      const parts = n.split(".");
      if (parts.length !== 2) {
        throw new ValueError(`too many values to unpack (expected 2, got ${parts.length})`);
      }
      const [left, right] = parts as [string, string];
      const leadingZeroCount = right.length - right.replace(/^0+/, "").length;
      const decimalPart = `${ZERO[0]} `.repeat(leadingZeroCount) + this._int2word(int(right));
      return `${this._int2word(int(left))} ${this.pointword} ${decimalPart}`;
    }
    return this._int2word(int(n));
  }

  override pluralize(n: bigint, forms: CurrencyForm): string {
    let form: number;
    if (n === 1n) {
      form = 0;
    } else if (0n < n && n < 5n) {
      form = 1;
    } else {
      form = 2;
    }
    return forms[form] as string;
  }

  override toOrdinal(_value: PyNum): string {
    throw new NotImplementedError();
  }

  _int2word(n: bigint): string {
    if (n === 0n) {
      return ZERO[0];
    }

    const words: string[] = [];
    const chunks = splitbyxStrictList(n.toString(), 3);
    let i = chunks.length;
    for (const x of chunks) {
      i -= 1;

      if (x === 0n) {
        continue;
      }

      const [n1, n2, n3] = getDigitsStrictNumbers(x);

      const wordChunk: string[] = [];

      if (n3 > 0) {
        wordChunk.push((HUNDREDS[n3] as readonly [string])[0]);
      }

      if (n2 > 1) {
        wordChunk.push((TWENTIES[n2] as readonly [string])[0]);
      }

      if (n2 === 1) {
        wordChunk.push((TENS[n1] as readonly [string])[0]);
      } else if (n1 > 0 && !(i > 0 && x === 1n)) {
        const ones = ONES[n1] as readonly [string, string, ReadonlySet<number>];
        if (n2 === 0 && n3 === 0 && ones[2].has(i)) {
          wordChunk.push(ones[1]);
        } else {
          wordChunk.push(ones[0]);
        }
      }
      if (i > 1 && wordChunk.length) {
        wordChunk.push(" ");
      }
      if (i > 0) {
        wordChunk.push(this.pluralize(x, getItem(THOUSANDS, String(i))));
      }
      words.push(wordChunk.join(""));
    }

    return words.slice(0, -1).join(" ") + words.slice(-1).join("");
  }
}
