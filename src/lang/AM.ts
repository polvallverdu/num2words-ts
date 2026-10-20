// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_AM.py

import type { CurrencyForms, CurrencyOptions, WordPair } from "../base.ts";
import { centuryDigitIsZeroExactMod, type YearOptions } from "../internal/year.ts";
import { cmp, eq, int, OverflowError, type PyNum, str, zip } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

export class Num2Word_AM extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    ETB: [
      ["ብር", "ብር"],
      ["ሳንቲም", "ሳንቲም"],
    ],
  };

  static override GIGA_SUFFIX: string | null = "ቢሊዮን";
  static override MEGA_SUFFIX: string | null = "ሚሊዮን";

  declare ords: Record<string, string>;

  override setHighNumwords(high: string[]): void {
    const cap = 3 * (high.length + 1);
    const cls = this.constructor as typeof Num2Word_AM;
    const ns: number[] = [];
    for (let n = cap; n > 5; n -= 3) ns.push(n);

    for (const [word, n] of zip(high, ns)) {
      if (n === 9) {
        this.cards.set(10n ** BigInt(n), word + cls.GIGA_SUFFIX);
      } else {
        this.cards.set(10n ** BigInt(n), word + cls.MEGA_SUFFIX);
      }
    }
  }

  override setup(): void {
    super.setup();

    this.negword = "አሉታዊ ";
    this.pointword = "ነጥብ";
    this.excludeTitle = ["እና", "ነጥብ", "አሉታዊ"];

    this.midNumwords = [
      [1000n, "ሺህ"],
      [100n, "መቶ"],
      [90n, "ዘጠና"],
      [80n, "ሰማኒያ"],
      [70n, "ሰባ"],
      [60n, "ስድሳ"],
      [50n, "አምሳ"],
      [40n, "አርባ"],
      [30n, "ሠላሳ"],
    ];
    this.lowNumwords = [
      "ሃያ",
      "አሥራ ዘጠኝ",
      "አሥራ ስምንት",
      "አሥራ ሰባት",
      "አስራ ስድስት",
      "አሥራ አምስት",
      "አሥራ አራት",
      "አሥራ ሦስት",
      "አሥራ ሁለት",
      "አሥራ አንድ",
      "አሥር",
      "ዘጠኝ",
      "ስምንት",
      "ሰባት",
      "ስድስት",
      "አምስት",
      "አራት",
      "ሦስት",
      "ሁለት",
      "አንድ",
      "ዜሮ",
    ];
    this.ords = {
      አንድ: "አንደኛ",
      ሁለት: "ሁለተኛ",
      ሦስት: "ሦስተኛ",
      አራት: "አራተኛ",
      አምስት: "አምስተኛ",
      ስድስት: "ስድስተኛ",
      ሰባት: "ሰባተኛ",
      ስምንት: "ስምንተኛ",
      ዘጠኝ: "ዘጠነኛ",
      አሥር: "አሥረኛ",
      "አሥራ አንድ": "አሥራ አንደኛ",
      "አሥራ ሁለት": "አሥራ ሁለተኛ",
      "አሥራ ሦስት": "አሥራ ሦስተኛ",
      "አሥራ አራት": "አሥራ አራተኛ",
      "አሥራ አምስት": "አሥራ አምስተኛ",
      "አሥራ ስድስት": "አሥራ ስድስተኛ",
      "አሥራ ሰባት": "አሥራ ሰባተኛ",
      "አሥራ ስምንት": "አሥራ ስምንተኛ",
      "አሥራ ዘጠኝ": "አሥራ ዘጠነኛ",
    };
  }

  override toCardinal(value: PyNum): string {
    // try: assert int(value) == value
    // except (ValueError, TypeError, AssertionError): return self.to_cardinal_float(value)
    let integral: boolean;
    try {
      integral = eq(int(value), value);
    } catch (e) {
      if (e instanceof OverflowError) throw e;
      integral = false;
    }
    if (!integral) return this.toCardinalFloat(value);

    const out = "";
    if (cmp(value, this.MAXVAL) >= 0) {
      throw new OverflowError(
        this.errmsgToobig.replace("%s", str(value)).replace("%s", str(this.MAXVAL)),
      );
    }

    if (eq(value, 100n)) {
      return this.title(`${out}መቶ`);
    }
    // Upstream has no minus handling: splitnum of a negative number returns
    // None and clean() then fails with a TypeError.
    const val = this.splitnum(int(value));
    const [words] = this.clean(val);
    return this.title(out + words);
  }

  override merge(lpair: WordPair, rpair: WordPair): WordPair {
    const [ltext, lnum] = lpair;
    const [rtext, rnum] = rpair;
    if (lnum === 1n && rnum < 100n) {
      return [rtext, rnum];
    } else if (100n > lnum && lnum > rnum) {
      return [`${ltext} ${rtext}`, lnum + rnum];
    } else if (lnum >= 100n && 100n > rnum) {
      return [`${ltext} ${rtext}`, lnum + rnum];
    } else if (rnum > lnum) {
      return [`${ltext} ${rtext}`, lnum * rnum];
    }
    // Python falls off the end and returns None.
    return undefined as unknown as WordPair;
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    const outwords = this.toCardinal(value).split(" ");
    const lastwords = (outwords[outwords.length - 1] as string).split("-");
    let lastword = (lastwords[lastwords.length - 1] as string).toLowerCase();
    if (Object.hasOwn(this.ords, lastword)) {
      lastword = this.ords[lastword] as string;
    } else {
      lastword += "ኛ";
    }
    lastwords[lastwords.length - 1] = this.title(lastword);
    outwords[outwords.length - 1] = lastwords.join(" ");
    return outwords.join(" ");
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)}${this.toOrdinal(value).slice(-1)}`;
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    const result = super.toCurrency(val, {
      currency: options.currency ?? "ብር",
      cents: options.cents ?? true,
      separator: options.separator ?? " ከ",
      adjective: options.adjective ?? true,
    });
    return result;
  }

  override toYear(val: PyNum, options: YearOptions = {}): string {
    const longval = options.longval ?? true;
    if (centuryDigitIsZeroExactMod(val)) {
      return this.toCardinal(val);
    }
    return this.toSplitnum(val, { hightxt: "መቶ", longval });
  }
}
