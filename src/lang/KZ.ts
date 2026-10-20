// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_KZ.py

import { type CurrencyForm, type CurrencyForms, Num2Word_Base } from "../base.ts";
import { getItem, int, NotImplementedError, type PyNum, str, ValueError } from "../py.ts";
import { getDigitsStrictNumbers, splitbyxStrictList } from "../utils.ts";

const ZERO = "нөл";

const ONES: Record<string, string> = {
  1: "бір",
  2: "екі",
  3: "үш",
  4: "төрт",
  5: "бес",
  6: "алты",
  7: "жеті",
  8: "сегіз",
  9: "тоғыз",
};

const TEN = "он";

const TWENTIES: Record<string, string> = {
  2: "жиырма",
  3: "отыз",
  4: "қырық",
  5: "елу",
  6: "алпыс",
  7: "жетпіс",
  8: "сексен",
  9: "тоқсан",
};

const HUNDRED = "жүз";

const THOUSANDS: Record<string, string> = {
  1: "мың",
  2: "миллион",
  3: "миллиард",
  4: "триллион",
  5: "квадриллион",
  6: "квинтиллион",
  7: "секстиллион",
  8: "септиллион",
  9: "октиллион",
  10: "нониллион",
};

export class Num2Word_KZ extends Num2Word_Base {
  // Upstream's forms are plain strings, not tuples; pluralize returns them as is.
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    USD: ["доллар", "цент"] as unknown as CurrencyForms,
    KZT: ["теңге", "тиын"] as unknown as CurrencyForms,
  };

  override setup(): void {
    this.negword = "минус";
    this.pointword = "бүтін";
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
      return `${this._int2word(int(left))} ${this.pointword} ${`${ZERO} `.repeat(leadingZeroCount)}${this._int2word(int(right))}`;
    }
    return this._int2word(int(n));
  }

  override pluralize(_n: bigint, form: CurrencyForm): string {
    return form as unknown as string;
  }

  protected override _centsVerbose(number: bigint, currency: string): string {
    return this._int2word(number, currency === "KZT");
  }

  _int2word(n: bigint, _feminine = false): string {
    if (n < 0n) {
      return [this.negword, this._int2word(-n)].join(" ");
    }

    if (n === 0n) {
      return ZERO;
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

      if (n3 > 0) {
        if (n3 > 1) {
          words.push(ONES[n3] as string);
        }
        words.push(HUNDRED);
      }

      if (n2 === 1) {
        words.push(TEN);
      } else if (n2 > 1) {
        words.push(TWENTIES[n2] as string);
      }

      if (n1 > 0) {
        words.push(ONES[n1] as string);
      }

      if (i > 0) {
        words.push(getItem(THOUSANDS, String(i)));
      }
    }

    return words.join(" ");
  }

  override toOrdinal(_number: PyNum): string {
    // TODO: Implement to_ordinal
    throw new NotImplementedError();
  }
}
