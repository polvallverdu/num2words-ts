// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_TG.py

import type { CurrencyForm, CurrencyForms, WordPair } from "../base.ts";
import { abs, cmp, eq, int, OverflowError, type PyNum, str, zip } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

const GENERIC_DOLLARS: CurrencyForm = ["доллар", "доллар"];
const GENERIC_CENTS: CurrencyForm = ["сент", "сент"];

export class Num2Word_TG extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    // repalced by EUR
    EUR: [["евро", "евро"], GENERIC_CENTS],
    // replaced by EUR
    USD: [GENERIC_DOLLARS, GENERIC_CENTS],
    RUB: [
      ["рубл", "рубл"],
      ["копейк", "копейк"],
    ],
    TJS: [
      ["сомонӣ", "сомонӣ"],
      ["дирам", "дирам"],
    ],
  };

  static override GIGA_SUFFIX: string | null = "иллиард";
  static override MEGA_SUFFIX: string | null = "иллион";

  override setHighNumwords(high: string[]): void {
    const cap = 3 * (high.length + 1);
    const cls = this.constructor as typeof Num2Word_TG;
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

    const lows = ["квинт", "квадр", "тр", "м", "м"];
    this.highNumwords = this.genHighNumwords([], [], lows);
    this.negword = "минус ";
    this.pointword = "нуқта";
    this.excludeTitle = ["ва", "минус", "нуқта"];

    this.midNumwords = [
      [1000n, "ҳазор"],
      [100n, "сад"],
      [90n, "навад"],
      [80n, "ҳаштод"],
      [70n, "ҳафтод"],
      [60n, "шаст"],
      [50n, "панҷоҳ"],
      [40n, "чил"],
      [30n, "си"],
    ];
    this.lowNumwords = [
      "бист",
      "нуздаҳ",
      "ҳаждаҳ",
      "ҳабдаҳ",
      "шонздаҳ",
      "понздаҳ",
      "чордаҳ",
      "сенздаҳ",
      "дувоздаҳ",
      "ёздаҳ",
      "даҳ",
      "нӯҳ",
      "ҳашт",
      "ҳафт",
      "шаш",
      "панҷ",
      "чор",
      "се",
      "ду",
      "як",
      "сифр",
    ];
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

    let out = "";
    if (cmp(value, 0n) < 0) {
      value = abs(value);
      out = this.negword;
    }

    if (cmp(value, this.MAXVAL) >= 0) {
      throw new OverflowError(
        this.errmsgToobig.replace("%s", str(value)).replace("%s", str(this.MAXVAL)),
      );
    }

    if (eq(value, 100n)) {
      return this.title(`${out}сад`);
    }
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
      if (ltext === "си") {
        return [`${ltext}ю ${rtext}`, lnum + rnum];
      } else if (ltext === "панҷоҳ") {
        return [`панҷову ${rtext}`, lnum + rnum];
      }
      return [`${ltext}у ${rtext}`, lnum + rnum];
    } else if (lnum >= 100n && 100n > rnum) {
      return [`${ltext}у ${rtext}`, lnum + rnum];
    } else if (rnum > lnum) {
      if (ltext === "яксад" && !(this.lowNumwords as string[]).includes(rtext)) {
        return [`сад ${rtext}`, lnum * rnum];
      }
      if (rtext === "сад") {
        return [`${ltext}${rtext}`, lnum * rnum];
      }
      return [`${ltext} ${rtext}`, lnum * rnum];
    }
    return [`${ltext}у ${rtext}`, lnum + rnum];
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    const cardinal = this.toCardinal(value);
    const outwords = cardinal.split(" ");
    const lastword = outwords[outwords.length - 1] as string;
    if (["ду", "се", "си"].includes(lastword)) {
      return `${cardinal}юм`;
    }
    return `${cardinal}ум`;
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)}${this.toOrdinal(value).slice(-2)}`;
  }
}
