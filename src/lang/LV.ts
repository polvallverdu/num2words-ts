// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_LV.py

import { type CurrencyForm, type CurrencyForms, Num2Word_Base } from "../base.ts";
import { at, getItem, int, mod, NotImplementedError, type PyNum, str, ValueError } from "../py.ts";
import { getDigits, splitbyxStrictList } from "../utils.ts";

const ZERO = ["nulle"] as const;

const ONES: Record<string, readonly string[]> = {
  1: ["viens"],
  2: ["divi"],
  3: ["trīs"],
  4: ["četri"],
  5: ["pieci"],
  6: ["seši"],
  7: ["septiņi"],
  8: ["astoņi"],
  9: ["deviņi"],
};

const TENS: Record<string, readonly string[]> = {
  0: ["desmit"],
  1: ["vienpadsmit"],
  2: ["divpadsmit"],
  3: ["trīspadsmit"],
  4: ["četrpadsmit"],
  5: ["piecpadsmit"],
  6: ["sešpadsmit"],
  7: ["septiņpadsmit"],
  8: ["astoņpadsmit"],
  9: ["deviņpadsmit"],
};

const TWENTIES: Record<string, readonly string[]> = {
  2: ["divdesmit"],
  3: ["trīsdesmit"],
  4: ["četrdesmit"],
  5: ["piecdesmit"],
  6: ["sešdesmit"],
  7: ["septiņdesmit"],
  8: ["astoņdesmit"],
  9: ["deviņdesmit"],
};

const HUNDRED = ["simts", "simti", "simtu"] as const;

const THOUSANDS: Record<string, CurrencyForm> = {
  1: ["tūkstotis", "tūkstoši", "tūkstošu"],
  2: ["miljons", "miljoni", "miljonu"],
  3: ["miljards", "miljardi", "miljardu"],
  4: ["triljons", "triljoni", "triljonu"],
  5: ["kvadriljons", "kvadriljoni", "kvadriljonu"],
  6: ["kvintiljons", "kvintiljoni", "kvintiljonu"],
  7: ["sikstiljons", "sikstiljoni", "sikstiljonu"],
  8: ["septiljons", "septiljoni", "septiljonu"],
  9: ["oktiljons", "oktiljoni", "oktiljonu"],
  10: ["nontiljons", "nontiljoni", "nontiljonu"],
};

const GENERIC_DOLLARS: CurrencyForm = ["dolārs", "dolāri", "dolāru"];
const GENERIC_CENTS: CurrencyForm = ["cents", "centi", "centu"];

const GENERIC_KRONA: CurrencyForm = ["krona", "kronas", "kronu"];
const GENERIC_ERA: CurrencyForm = ["ēre", "ēras", "ēru"];

/** Python `list(splitbyx(s, 3))`, with Python's `int()` on each group. */
/**
 * Sadly we have a legal form (used in legal and finance documents):
 * http://www.eiro.lv/files/upload/files/Eiro_rakstiba-1.pdf
 * https://likumi.lv/doc.php?id=254741
 * http://eur-lex.europa.eu/legal-content/LV/TXT/HTML/?uri=CELEX:31998R0974&from=LV
 *
 * Source: http://publications.europa.eu/code/lv/lv-5000500.htm
 */
export class Num2Word_LV extends Num2Word_Base {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    AUD: [GENERIC_DOLLARS, GENERIC_CENTS],
    CAD: [GENERIC_DOLLARS, GENERIC_CENTS],
    // repalced by EUR
    EEK: [GENERIC_KRONA, GENERIC_CENTS],
    EUR: [["eiro", "eiro", "eiro"], GENERIC_CENTS],
    EUR_LEGAL: [["euro", "euro", "euro"], GENERIC_CENTS],
    GBP: [
      ["sterliņu mārciņa", "sterliņu mārciņas", "sterliņu mārciņu"],
      ["penss", "pensi", "pensu"],
    ],
    // replaced by EUR
    LTL: [["lits", "liti", "litu"], GENERIC_CENTS],
    // replaced by EUR
    LVL: [
      ["lats", "lati", "latu"],
      ["santīms", "santīmi", "santīmu"],
    ],
    USD: [GENERIC_DOLLARS, GENERIC_CENTS],
    RUB: [
      ["rublis", "rubļi", "rubļu"],
      ["kapeika", "kapeikas", "kapeiku"],
    ],
    SEK: [GENERIC_KRONA, GENERIC_ERA],
    NOK: [GENERIC_KRONA, GENERIC_ERA],
    PLN: [
      ["zlots", "zloti", "zlotu"],
      ["grasis", "graši", "grašu"],
    ],
  };

  static override CURRENCY_ADJECTIVES: Record<string, string> = {
    AUD: "Austrālijas",
    CAD: "Kanādas",
    EEK: "Igaunijas",
    USD: "ASV",
    RUB: "Kreivijas",
    SEK: "Zviedrijas",
    NOK: "Norvēģijas",
  };

  override setup(): void {
    this.negword = "mīnus";
    this.pointword = "komats";
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

  override pluralize(n: bigint, forms: CurrencyForm): string {
    const form = mod(n, 10n) === 1n && mod(n, 100n) !== 11n ? 0 : n !== 0n ? 1 : 2;
    return at(forms, form);
  }

  override toOrdinal(_number: PyNum): string {
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

      const [n1, n2, n3] = getDigits(x) as [number, number, number];

      if (n3 > 0) {
        if (n3 === 1 && n2 === 0 && n1 > 0) {
          words.push(HUNDRED[2]);
        } else if (n3 > 1) {
          words.push(getItem(ONES, String(n3))[0] as string);
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
      } else if (n1 > 0 && !(i > 0 && x === 1n)) {
        words.push(getItem(ONES, String(n1))[0] as string);
      }

      if (i > 0) {
        words.push(this.pluralize(x, getItem(THOUSANDS, String(i))));
      }
    }

    return words.join(" ");
  }
}
