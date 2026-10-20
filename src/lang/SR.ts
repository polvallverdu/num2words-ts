// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_SR.py

import { type CurrencyForm, type CurrencyOptions, Num2Word_Base } from "../base.ts";
import { parseCurrencyParts, prefixCurrency } from "../currency.ts";
import { abs, getItem, int, mod, NotImplementedError, type PyNum, str, ValueError } from "../py.ts";
import { getDigits, splitbyx } from "../utils.ts";

const ZERO = ["nula"] as const;

const ONES: Record<string, readonly [string, string]> = {
  1: ["jedan", "jedna"],
  2: ["dva", "dve"],
  3: ["tri", "tri"],
  4: ["četiri", "četiri"],
  5: ["pet", "pet"],
  6: ["šest", "šest"],
  7: ["sedam", "sedam"],
  8: ["osam", "osam"],
  9: ["devet", "devet"],
};

const TENS: Record<string, readonly [string]> = {
  0: ["deset"],
  1: ["jedanaest"],
  2: ["dvanaest"],
  3: ["trinaest"],
  4: ["četrnaest"],
  5: ["petnaest"],
  6: ["šesnaest"],
  7: ["sedamnaest"],
  8: ["osamnaest"],
  9: ["devetnaest"],
};

const TWENTIES: Record<string, readonly [string]> = {
  2: ["dvadeset"],
  3: ["trideset"],
  4: ["četrdeset"],
  5: ["pedeset"],
  6: ["šezdeset"],
  7: ["sedamdeset"],
  8: ["osamdeset"],
  9: ["devedeset"],
};

const HUNDREDS: Record<string, readonly [string]> = {
  1: ["sto"],
  2: ["dvesta"],
  3: ["trista"],
  4: ["četristo"],
  5: ["petsto"],
  6: ["šesto"],
  7: ["sedamsto"],
  8: ["osamsto"],
  9: ["devetsto"],
};

/** Singular, paucal and plural names plus whether the counted word is feminine. */
type GenderedForm = readonly [string, string, string, boolean];

const SCALE: Record<string, GenderedForm> = {
  0: ["", "", "", false],
  1: ["hiljada", "hiljade", "hiljada", true], // 10^3
  2: ["milion", "miliona", "miliona", false], // 10^6
  3: ["bilion", "biliona", "biliona", false], // 10^9
  4: ["trilion", "triliona", "triliona", false], // 10^12
  5: ["kvadrilion", "kvadriliona", "kvadriliona", false], // 10^15
  6: ["kvintilion", "kvintiliona", "kvintiliona", false], // 10^18
  7: ["sekstilion", "sekstiliona", "sekstiliona", false], // 10^21
  8: ["septilion", "septiliona", "septiliona", false], // 10^24
  9: ["oktilion", "oktiliona", "oktiliona", false], // 10^27
  10: ["nonilion", "noniliona", "noniliona", false], // 10^30
};

export interface CardinalOptions {
  feminine?: boolean;
}

export class Num2Word_SR extends Num2Word_Base {
  // The last item of each form tells whether the word is feminine, so these
  // are not plain CurrencyForms.
  static override CURRENCY_FORMS = {
    RUB: [
      ["rublja", "rublje", "rublji", true],
      ["kopejka", "kopejke", "kopejki", true],
    ],
    EUR: [
      ["evro", "evra", "evra", false],
      ["cent", "centa", "centi", false],
    ],
    RSD: [
      ["dinar", "dinara", "dinara", false],
      ["para", "pare", "para", true],
    ],
  } as unknown as Record<string, readonly [CurrencyForm, CurrencyForm]>;

  override setup(): void {
    this.negword = "minus";
    this.pointword = "zapeta";
  }

  override toCardinal(number: PyNum, options: CardinalOptions = {}): string {
    const feminine = options.feminine ?? false;
    const n = str(number).replace(",", ".");
    if (n.includes(".")) {
      const parts = n.split(".");
      if (parts.length !== 2) throw new ValueError("too many values to unpack");
      const [left, right] = parts as [string, string];
      const leadingZeroCount = right.length - right.replace(/^0+/, "").length;
      const decimalPart =
        `${ZERO[0]} `.repeat(leadingZeroCount) + this._int2word(int(right), feminine);
      return `${this._int2word(int(left), feminine)} ${this.pointword} ${decimalPart}`;
    }
    return this._int2word(int(n), feminine);
  }

  override pluralize(number: bigint, forms: CurrencyForm): string {
    let form: number;
    if (mod(number, 100n) < 10n || mod(number, 100n) > 20n) {
      if (mod(number, 10n) === 1n) {
        form = 0;
      } else if (1n < mod(number, 10n) && mod(number, 10n) < 5n) {
        form = 1;
      } else {
        form = 2;
      }
    } else {
      form = 2;
    }
    return forms[form] as string;
  }

  override toOrdinal(_number: PyNum): string {
    throw new NotImplementedError();
  }

  protected override _centsVerbose(number: bigint, currency: string): string {
    const forms = getItem(this.cls.CURRENCY_FORMS, currency)[1] as unknown as GenderedForm;
    return this._int2word(number, forms[forms.length - 1] as boolean);
  }

  _int2word(number: bigint, feminine = false): string {
    if (number < 0n) {
      return [this.negword, this._int2word(abs(number))].join(" ");
    }

    if (number === 0n) {
      return ZERO[0];
    }

    const words: string[] = [];
    const chunks = [...splitbyx(number.toString(), 3)];
    let chunkLen = chunks.length;
    for (const chunk of chunks) {
      chunkLen -= 1;
      const [digitRight, digitMid, digitLeft] = getDigits(chunk) as [number, number, number];

      if (digitLeft > 0) {
        words.push(getItem(HUNDREDS, String(digitLeft))[0]);
      }

      if (digitMid > 1) {
        words.push(getItem(TWENTIES, String(digitMid))[0]);
      }

      if (digitMid === 1) {
        words.push(getItem(TENS, String(digitRight))[0]);
      } else if (digitRight > 0) {
        const isFeminine = feminine || getItem(SCALE, String(chunkLen))[3];
        const genderIdx = isFeminine ? 1 : 0;
        words.push(getItem(ONES, String(digitRight))[genderIdx]);
      }

      if (chunkLen > 0 && chunk !== 0n) {
        words.push(
          this.pluralize(chunk, getItem(SCALE, String(chunkLen)) as unknown as CurrencyForm),
        );
      }
    }

    return words.join(" ");
  }

  /**
   * @param val Numeric value
   * @returns Formatted string
   */
  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    const currency = options.currency ?? "EUR";
    const cents = options.cents ?? true;
    const separator = options.separator ?? ",";
    const adjective = options.adjective ?? false;
    const [left, right, isNegative] = parseCurrencyParts(val);

    const forms = this.cls.CURRENCY_FORMS[currency];
    if (!Object.hasOwn(this.cls.CURRENCY_FORMS, currency) || !forms) {
      throw new NotImplementedError(
        `Currency code "${currency}" not implemented for "${this.constructor.name}"`,
      );
    }
    let [cr1, cr2] = forms;

    if (adjective && currency in this.cls.CURRENCY_ADJECTIVES) {
      cr1 = prefixCurrency(this.cls.CURRENCY_ADJECTIVES[currency] as string, cr1);
    }

    const minusStr = isNegative ? `${this.negword} ` : "";
    const centsStr = cents
      ? this._centsVerbose(right, currency)
      : this._centsTerse(right, currency);

    const feminine = cr1[cr1.length - 1] as unknown as boolean;
    return `${minusStr}${this.toCardinal(left, { feminine })} ${this.pluralize(left, cr1)}${separator} ${centsStr} ${this.pluralize(right, cr2)}`;
  }
}
