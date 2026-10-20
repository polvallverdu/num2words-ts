// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_LT.py

import { type CurrencyForm, type CurrencyForms, Num2Word_Base } from "../base.ts";
import { at, getItem, int, NotImplementedError, type PyNum, str, ValueError } from "../py.ts";
import { getDigits, splitbyxStrictList } from "../utils.ts";

const ZERO = ["nulis"] as const;

const ONES_FEMININE: Record<string, readonly string[]> = {
  1: ["viena"],
  2: ["dvi"],
  3: ["trys"],
  4: ["keturios"],
  5: ["penkios"],
  6: ["šešios"],
  7: ["septynios"],
  8: ["aštuonios"],
  9: ["devynios"],
};

const ONES: Record<string, readonly string[]> = {
  1: ["vienas"],
  2: ["du"],
  3: ["trys"],
  4: ["keturi"],
  5: ["penki"],
  6: ["šeši"],
  7: ["septyni"],
  8: ["aštuoni"],
  9: ["devyni"],
};

const TENS: Record<string, readonly string[]> = {
  0: ["dešimt"],
  1: ["vienuolika"],
  2: ["dvylika"],
  3: ["trylika"],
  4: ["keturiolika"],
  5: ["penkiolika"],
  6: ["šešiolika"],
  7: ["septyniolika"],
  8: ["aštuoniolika"],
  9: ["devyniolika"],
};

const TWENTIES: Record<string, readonly string[]> = {
  2: ["dvidešimt"],
  3: ["trisdešimt"],
  4: ["keturiasdešimt"],
  5: ["penkiasdešimt"],
  6: ["šešiasdešimt"],
  7: ["septyniasdešimt"],
  8: ["aštuoniasdešimt"],
  9: ["devyniasdešimt"],
};

const HUNDRED = ["šimtas", "šimtai"] as const;

const THOUSANDS: Record<string, CurrencyForm> = {
  1: ["tūkstantis", "tūkstančiai", "tūkstančių"],
  2: ["milijonas", "milijonai", "milijonų"],
  3: ["milijardas", "milijardai", "milijardų"],
  4: ["trilijonas", "trilijonai", "trilijonų"],
  5: ["kvadrilijonas", "kvadrilijonai", "kvadrilijonų"],
  6: ["kvintilijonas", "kvintilijonai", "kvintilijonų"],
  7: ["sikstilijonas", "sikstilijonai", "sikstilijonų"],
  8: ["septilijonas", "septilijonai", "septilijonų"],
  9: ["oktilijonas", "oktilijonai", "oktilijonų"],
  10: ["naintilijonas", "naintilijonai", "naintilijonų"],
};

const GENERIC_CENTS: CurrencyForm = ["centas", "centai", "centų"];

/** Python `list(splitbyx(s, 3))`, with Python's `int()` on each group. */
export class Num2Word_LT extends Num2Word_Base {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    LTL: [["litas", "litai", "litų"], GENERIC_CENTS],
    EUR: [["euras", "eurai", "eurų"], GENERIC_CENTS],
    USD: [["doleris", "doleriai", "dolerių"], GENERIC_CENTS],
    GBP: [
      ["svaras sterlingų", "svarai sterlingų", "svarų sterlingų"],
      ["pensas", "pensai", "pensų"],
    ],
    PLN: [
      ["zlotas", "zlotai", "zlotų"],
      ["grašis", "grašiai", "grašių"],
    ],
    RUB: [
      ["rublis", "rubliai", "rublių"],
      ["kapeika", "kapeikos", "kapeikų"],
    ],
  };

  override setup(): void {
    this.negword = "minus";
    this.pointword = "kablelis";
  }

  override pluralize(n: bigint, forms: CurrencyForm): string {
    const [n1, n2] = getDigits(n) as [number, number, number];
    if (n2 === 1 || n1 === 0 || n === 0n) {
      return at(forms, 2);
    } else if (n1 === 1) {
      return at(forms, 0);
    }
    return at(forms, 1);
  }

  override toCardinal(number: PyNum): string {
    const s = str(number).replaceAll(",", ".");
    const [baseStr, n] = this.parseMinus(s);
    if (n.includes(".")) {
      const parts = n.split(".");
      if (parts.length !== 2) {
        throw new ValueError(`too many values to unpack (expected 2, got ${parts.length})`);
      }
      const [left, right] = parts as [string, string];
      const leadingZeroCount = right.length - right.replace(/^0+/, "").length;
      const decimalPart = `${ZERO[0]} `.repeat(leadingZeroCount) + this._int2word(int(right));
      return `${baseStr}${this._int2word(int(left))} ${this.pointword} ${decimalPart}`;
    }
    return `${baseStr}${this._int2word(int(n))}`;
  }

  override toOrdinal(_number: PyNum): string {
    throw new NotImplementedError();
  }

  protected override _centsVerbose(number: bigint, currency: string): string {
    return this._int2word(number, currency === "RUB");
  }

  _int2word(n: bigint, feminine = false): string {
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

      const [n1, n2, n3] = getDigits(x) as [number, number, number];

      if (n3 > 0) {
        words.push(getItem(ONES, String(n3))[0] as string);
        if (n3 > 1) {
          words.push(HUNDRED[1]);
        } else {
          words.push(HUNDRED[0]);
        }
      }

      if (n2 > 1) {
        words.push(getItem(TWENTIES, String(n2))[0] as string);
      }

      if (n2 === 1) {
        words.push(getItem(TENS, String(n1))[0] as string);
      } else if (n1 > 0) {
        if ((i === 1 || (feminine && i === 0)) && n < 1000n) {
          words.push(getItem(ONES_FEMININE, String(n1))[0] as string);
        } else {
          words.push(getItem(ONES, String(n1))[0] as string);
        }
      }

      if (i > 0) {
        words.push(this.pluralize(x, getItem(THOUSANDS, String(i))));
      }
    }

    return words.join(" ");
  }
}
