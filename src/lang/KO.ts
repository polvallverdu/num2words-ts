// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_KO.py

import { type CurrencyForms, type CurrencyOptions, Num2Word_Base, type WordPair } from "../base.ts";
import { parseCurrencyParts } from "../currency.ts";
import {
  abs,
  cmp,
  eq,
  getItem,
  KeyError,
  NotImplementedError,
  type PyNum,
  str,
  ValueError,
  zip,
} from "../py.ts";

export interface YearOptions {
  suffix?: string | null;
  longval?: boolean;
}

export class Num2Word_KO extends Num2Word_Base {
  // Upstream's forms are a (unit, subunit-or-None) pair of strings.
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    KRW: ["원", null] as unknown as CurrencyForms,
    USD: ["달러", "센트"] as unknown as CurrencyForms,
    JPY: ["엔", null] as unknown as CurrencyForms,
  };

  declare ords: Record<string, string>;

  override setHighNumwords(high: string[]): void {
    const max = 4 * high.length;
    const ns: number[] = [];
    for (let n = max; n > 0; n -= 4) ns.push(n);
    for (const [word, n] of zip(high, ns)) {
      this.cards.set(10n ** BigInt(n), word);
    }
  }

  override setup(): void {
    super.setup();

    this.negword = "마이너스 ";
    this.pointword = "점";

    this.highNumwords = [
      "무량대수",
      "불가사의",
      "나유타",
      "아승기",
      "항하사",
      "극",
      "재",
      "정",
      "간",
      "구",
      "양",
      "자",
      "해",
      "경",
      "조",
      "억",
      "만",
    ];
    this.midNumwords = [
      [1000n, "천"],
      [100n, "백"],
    ];
    this.lowNumwords = ["십", "구", "팔", "칠", "육", "오", "사", "삼", "이", "일", "영"];
    this.ords = {
      일: "한",
      이: "두",
      삼: "세",
      사: "네",
      오: "다섯",
      육: "여섯",
      칠: "일곱",
      팔: "여덟",
      구: "아홉",
      십: "열",
      이십: "스물",
      삼십: "서른",
      사십: "마흔",
      오십: "쉰",
      육십: "예순",
      칠십: "일흔",
      팔십: "여든",
      구십: "아흔",
    };
  }

  override merge(lpair: WordPair, rpair: WordPair): WordPair {
    const [ltext, lnum] = lpair;
    const [rtext, rnum] = rpair;
    if (lnum === 1n && rnum <= 10000n) {
      return rpair;
    } else if (10000n > lnum && lnum > rnum) {
      return [`${ltext}${rtext}`, lnum + rnum];
    } else if (lnum >= 10000n && lnum > rnum) {
      return [`${ltext} ${rtext}`, lnum + rnum];
    }
    return [`${ltext}${rtext}`, lnum * rnum];
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    if (eq(value, 1n)) {
      return "첫 번째";
    }
    const outwords = this.toCardinal(value).split(" ");
    const lastwords = (outwords[outwords.length - 1] as string).split("백");
    const last = lastwords[lastwords.length - 1] as string;
    if (last.includes("십")) {
      const tenOne = last.split("십");
      tenOne[0] = getItem(this.ords, `${tenOne[0]}십`);
      try {
        tenOne[1] = getItem(this.ords, tenOne[1] as string);
        tenOne[0] = tenOne[0].replaceAll("스무", "스물");
      } catch (e) {
        if (!(e instanceof KeyError)) throw e;
      }
      lastwords[lastwords.length - 1] = tenOne.join("");
    } else {
      lastwords[lastwords.length - 1] = getItem(this.ords, last);
    }
    outwords[outwords.length - 1] = lastwords.join("백 ");
    return `${outwords.join(" ")} 번째`;
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)} 번째`;
  }

  override toYear(val: PyNum, options: YearOptions = {}): string {
    let suffix = options.suffix ?? null;
    if (cmp(val, 0n) < 0) {
      val = abs(val);
      suffix = !suffix ? "기원전" : suffix;
    }
    const valtext = this.toCardinal(val);
    return !suffix ? `${valtext}년` : `${suffix} ${valtext}년`;
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    const currency = options.currency ?? "KRW";
    const cents = options.cents ?? false;
    const [left, right, isNegative] = parseCurrencyParts(val, Boolean(cents));

    const forms = this.cls.CURRENCY_FORMS[currency] as unknown as
      | [string, string | null]
      | undefined;
    if (forms === undefined || !Object.hasOwn(this.cls.CURRENCY_FORMS, currency)) {
      throw new NotImplementedError(
        `Currency code "${currency}" not implemented for "${this.constructor.name}"`,
      );
    }
    const [cr1, cr2] = forms;
    if ((cents || right) && !cr2) {
      throw new ValueError(`Decimals not supported for "${currency}"`);
    }

    const minusStr = isNegative ? this.negword : "";
    return `${minusStr}${this.toCardinal(left).split(/\s+/).filter(Boolean).join("")}${cr1}${
      cr2 ? ` ${this.toCardinal(right)}` : ""
    }${cr2 ? cr2 : ""}`;
  }
}
