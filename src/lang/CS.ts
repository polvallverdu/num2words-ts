// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_CS.py

import { type CurrencyForm, type CurrencyForms, Num2Word_Base } from "../base.ts";
import { at, getItem, int, mod, NotImplementedError, type PyNum, str, ValueError } from "../py.ts";
import { getDigitsStrictBigints, splitbyxStrictList } from "../utils.ts";

const ZERO = ["nula"] as const;

const ONES: Record<string, readonly string[]> = {
  1: ["jedna"],
  2: ["dva"],
  3: ["tři"],
  4: ["čtyři"],
  5: ["pět"],
  6: ["šest"],
  7: ["sedm"],
  8: ["osm"],
  9: ["devět"],
};

const TENS: Record<string, readonly string[]> = {
  0: ["deset"],
  1: ["jedenáct"],
  2: ["dvanáct"],
  3: ["třináct"],
  4: ["čtrnáct"],
  5: ["patnáct"],
  6: ["šestnáct"],
  7: ["sedmnáct"],
  8: ["osmnáct"],
  9: ["devatenáct"],
};

const TWENTIES: Record<string, readonly string[]> = {
  2: ["dvacet"],
  3: ["třicet"],
  4: ["čtyřicet"],
  5: ["padesát"],
  6: ["šedesát"],
  7: ["sedmdesát"],
  8: ["osmdesát"],
  9: ["devadesát"],
};

const HUNDREDS: Record<string, readonly string[]> = {
  1: ["sto"],
  2: ["dvěstě"],
  3: ["třista"],
  4: ["čtyřista"],
  5: ["pětset"],
  6: ["šestset"],
  7: ["sedmset"],
  8: ["osmset"],
  9: ["devětset"],
};

const THOUSANDS: Record<string, CurrencyForm> = {
  1: ["tisíc", "tisíce", "tisíc"], // 10^3
  2: ["milion", "miliony", "milionů"], // 10^6
  3: ["miliarda", "miliardy", "miliard"], // 10^9
  4: ["bilion", "biliony", "bilionů"], // 10^12
  5: ["biliarda", "biliardy", "biliard"], // 10^15
  6: ["trilion", "triliony", "trilionů"], // 10^18
  7: ["triliarda", "triliardy", "triliard"], // 10^21
  8: ["kvadrilion", "kvadriliony", "kvadrilionů"], // 10^24
  9: ["kvadriliarda", "kvadriliardy", "kvadriliard"], // 10^27
  10: ["quintillion", "quintilliony", "quintillionů"], // 10^30
};

export class Num2Word_CS extends Num2Word_Base {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    CZK: [
      ["koruna", "koruny", "korun"],
      ["halíř", "halíře", "haléřů"],
    ],
    EUR: [
      ["euro", "euro", "euro"],
      ["cent", "centy", "centů"],
    ],
  };

  override setup(): void {
    this.negword = "mínus";
    this.pointword = "celá";
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
    } else if (5n > mod(n, 10n) && mod(n, 10n) > 1n && (mod(n, 100n) < 10n || mod(n, 100n) > 20n)) {
      form = 1;
    } else {
      form = 2;
    }
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

      const [n1, n2, n3] = getDigitsStrictBigints(x);

      if (n3 > 0n) {
        words.push(getItem(HUNDREDS, String(n3))[0] as string);
      }

      if (n2 > 1n) {
        words.push(getItem(TWENTIES, String(n2))[0] as string);
      }

      if (n2 === 1n) {
        words.push(getItem(TENS, String(n1))[0] as string);
      } else if (n1 > 0n && !(i > 0 && x === 1n)) {
        words.push(getItem(ONES, String(n1))[0] as string);
      }

      if (i > 0) {
        words.push(this.pluralize(x, getItem(THOUSANDS, String(i))));
      }
    }

    return words.join(" ");
  }
}
