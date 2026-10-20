// Copyright (c) 2023, Johannes Heinecke.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_CE.py

import type { CurrencyForms } from "../base.ts";
import { parseCurrencyParts } from "../currency.ts";
import {
  at,
  cmp,
  Decimal,
  floordiv,
  getItem,
  int,
  isIntegral,
  KeyError,
  mod,
  NotImplementedError,
  type PyNum,
  str,
} from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

// Chechen numbers inflect in case if without noun or
// use a special oblique ending when followed by a counted noun
// 4, 14, 40 and composites thereof agree in class (gender) with the
// noun. Chechen has 6 classes which are indicated by the initial
// letter of 4, 14 and 40. By default it is "д" but
// it can also be "б", "й" or "в".
// Indicate the needed class prefix as follows
//   num2words(4, lang='ce', case="abs", clazz="б")

const CARDINALS: Record<string, Record<string, string>> = {
  casenames: {
    abs: "Им.",
    gen: "Род.",
    dat: "Дат.",
    erg: "Эрг;",
    instr: "Твор.",
    mat: "Вещ.",
    comp: "Сравнит.",
    all: "Местн.",
  },
  casesuffix_cons: {
    gen: "аннан",
    dat: "анна",
    erg: "амма",
    instr: "анца",
    mat: "аннах",
    comp: "аннал",
    all: "анга",
    obl: "ан",
    ORD: "алгӀа",
  },
  casesuffix_voc: {
    gen: "ннан",
    dat: "нна",
    erg: "мма",
    instr: "нца",
    mat: "ннах",
    comp: "ннал",
    all: "нга",
    obl: "н",
    ORD: "лгӀа",
  },
  "0": {
    attr: "ноль",
    abs: "ноль",
    gen: "нолан",
    dat: "нолана",
    erg: "ноло",
    instr: "ноланца",
    mat: "ноланах",
    comp: "ноланал",
    all: "ноланга",
  },
  "1": {
    attr: "цхьа",
    obl: "цхьана",
    abs: "цхьаъ",
    gen: "цхьаннан",
    dat: "цхьанна",
    erg: "цхьамма",
    instr: "цхьаьнца",
    mat: "цхьаннах",
    comp: "цхьаннал",
    all: "цхаьнга",
    ORD: "цхьалгӀа",
  },
  "2": {
    attr: "ши",
    obl: "шина",
    abs: "шиъ",
    gen: "шиннан",
    dat: "шинна",
    erg: "шимма",
    instr: "шинца",
    mat: "шиннах",
    comp: "шиннал",
    all: "шинга",
    ORD: "шолгӀа",
  },
  "3": {
    attr: "кхо",
    obl: "кхона",
    abs: "кхоъ",
    gen: "кхааннан",
    dat: "кхаанна",
    erg: "кхаамма",
    instr: "кхаанца",
    mat: "кхааннах",
    comp: "кхааннал",
    all: "кхаанга",
    ORD: "кхоалгӀа",
  },
  "4": {
    attr: "д*и",
    obl: "д*еа",
    abs: "д*иъ",
    gen: "д*еаннан",
    dat: "д*еанна",
    erg: "д*еамма",
    instr: "д*еанца",
    mat: "д*еаннах",
    comp: "д*еаннал",
    all: "д*еанга",
    ORD: "д*оьалгӀа",
  },
  "5": {
    attr: "пхи",
    obl: "пхеа",
    abs: "пхиъ",
    gen: "пхеаннан",
    dat: "пхеанна",
    erg: "пхеамма",
    instr: "нхеанца",
    mat: "пхеаннах",
    comp: "пхеаннал",
    all: "пхеанга",
    ORD: "пхоьалгӀа",
  },
  "6": {
    abs: "ялх",
    attr: "ялх",
    ORD: "йолхалгӀа",
  },
  "7": {
    abs: "ворхӀ",
    attr: "ворхӀ",
    ORD: "ворхӀалгӀа",
  },
  "8": {
    abs: "бархӀ",
    attr: "бархӀ",
    ORD: "борхӀалӀа",
  },
  "9": {
    abs: "исс",
    attr: "исс",
    ORD: "уьссалгӀа",
  },
  "10": {
    attr: "итт",
    abs: "итт",
    gen: "иттаннан",
    dat: "иттанна",
    erg: "иттамма",
    instr: "иттанца",
    mat: "иттаннах",
    comp: "иттаннал",
    all: "иттанга",
    ORD: "уьтталгӀа",
  },
  "11": {
    abs: "цхьайтта",
    attr: "цхьайтта",
    ORD: "цхьайтталгӀа",
  },
  "12": {
    abs: "шийтта",
    attr: "шийтта",
    ORD: "шийтталга",
  },
  "13": {
    abs: "кхойтта",
    attr: "кхойтта",
    ORD: "кхойтталгӀа",
  },
  "14": {
    abs: "д*ейтта",
    attr: "д*ейтта",
    ORD: "д*ейтталгӀа",
  },
  "15": {
    abs: "пхийтта",
    attr: "пхийтта",
    ORD: "пхийтталгӀа",
  },
  "16": {
    abs: "ялхитта",
    attr: "ялхитта",
    ORD: "ялхитталгӀа",
  },
  "17": {
    abs: "вуьрхӀитта",
    attr: "вуьрхӀитта",
    ORD: "вуьрхӀитталгӀа",
  },
  "18": {
    abs: "берхӀитта",
    attr: "берхӀитта",
    ORD: "берхитталӀа",
  },
  "19": {
    abs: "ткъайесна",
    attr: "ткъайесна",
    ORD: "ткъаесналгӀа",
  },
  "20": {
    abs: "ткъа",
    gen: "ткъаннан",
    dat: "ткъанна",
    erg: "ткъамма",
    instr: "ткъанца",
    mat: "ткъаннах",
    comp: "ткъаннал",
    all: "ткъанга",
    attr: "ткъе",
    ORD: "ткъолгӀа",
  },
  "40": {
    abs: "шовзткъа",
    attr: "шовзткъе",
    ORD: "шовзткъалгІа",
  },
  "60": {
    abs: "кхузткъа",
    attr: "кхузткъе",
    ORD: "кхузткъалгІа",
  },
  "80": {
    abs: "дезткъа",
    attr: "дезткъе",
    ORD: "дезткъалгІа",
  },
  "100": {
    attr: "бӀе",
    abs: "бӀе",
    obl: "бӀен",
    gen: "бӀеннан",
    dat: "бӀенна",
    erg: "бӀемма",
    instr: "бӀенца",
    mat: "бӀеннах",
    comp: "бӀеннал",
    all: "бӀенга",
    ORD: "бІолгІа",
  },
  "1000": {
    attr: "эзар",
    abs: "эзар",
    obl: "эзаран",
    gen: "эзарнан",
    dat: "эзарна",
    erg: "эзарно",
    instr: "эзарнаца",
    mat: "эзарнах",
    comp: "эзарнал",
    all: "эзаранга",
    ORD: "эзарлагІа",
  },
  "1000000": {
    attr: "миллион",
    abs: "миллион",
    ORD: "миллионалгІа",
  },
};

const ILLIONS: Record<string, Record<string, string>> = {
  "6": {
    attr: "миллион",
    abs: "миллион",
    ORD: "миллионалгІа",
  },
  "9": {
    attr: "миллиард",
    abs: "миллиард",
    ORD: "миллиардалгІа",
  },
  "12": {
    attr: "биллион",
    abs: "биллион",
    ORD: "биллионалгІа",
  },
  "15": {
    attr: "биллиард",
    abs: "биллиард",
    ORD: "биллиардалгІа",
  },
  "18": {
    attr: "триллион",
    abs: "триллион",
    ORD: "триллионалгІа",
  },
  "21": {
    attr: "триллиард",
    abs: "триллиард",
    ORD: "триллиардалгІа",
  },
  "24": {
    attr: "квадриллион",
    abs: "квадриллион",
    ORD: "квадриллионалгІа",
  },
  "27": {
    attr: "квадриллиард",
    abs: "квадриллиард",
    ORD: "квадриллиардалгІа",
  },
  "30": {
    attr: "квинтиллион",
    abs: "квинтиллион",
    ORD: "квинтиллионалгІа",
  },
  "33": {
    attr: "квинтиллиард",
    abs: "квинтиллиард",
    ORD: "квинтиллиардалгІа",
  },
};

export const MINUS = "минус";
// DECIMALPOINT = "запятая"  # check !
export const DECIMALPOINT = "а";

/** Python `s.replace(old, new)`: every occurrence. */
function replaceAll(s: string, old: string, rep: string): string {
  return s.split(old).join(rep);
}

export interface CardinalOptions {
  clazz?: string;
  case?: string;
}

export interface CurrencyOptionsCE {
  currency?: string;
  cents?: boolean;
  separator?: string;
  adjective?: boolean;
  case?: string;
}

export class Num2Word_CE extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    // currency code: (sg, pl), (sg, pl)
    EUR: [
      ["Евро", "Евро"],
      ["Сент", "Сенташ"],
    ],
    RUB: [
      ["Сом", "Сомаш"],
      ["Кепек", "Кепекаш"],
    ],
    USD: [
      ["Доллар", "Доллараш"],
      ["Сент", "Сенташ"],
    ],
    GBP: [
      ["Фунт", "Фунташ"],
      ["Пенни", "Пенни"],
    ],
  };

  declare ords: Record<string, string>;

  override setup(): void {
    super.setup();
    this.negword = "минус";
    this.pointword = "запятая"; // check !
    this.midNumwords = [];
    this.lowNumwords = [];
    this.ords = {};
  }

  override toOrdinal(number: PyNum, options: CardinalOptions = {}): string {
    const clazz = options.clazz ?? "д";
    // implement here your code. number is the integer to
    // be transformed into an ordinal as a word (str)
    // which is returned
    return this.toCardinal(number, { clazz, case: "ORD" });
  }

  override toCardinal(number: PyNum, options: CardinalOptions = {}): string {
    const clazz = options.clazz ?? "д";
    const kase = options.case ?? "abs";
    if (typeof number === "number") {
      const entires = this.toCardinal(int(number));
      const floatPart = at(str(number).split("."), 1);
      // Drops the trailing zero and comma
      const postfix = [...floatPart].map((c) => this.toCardinal(int(c))).join(" ");
      return `${entires} ${DECIMALPOINT} ${postfix}`;
    }
    if (number instanceof Decimal) {
      // Upstream's arithmetic keeps a fractional Decimal fractional all the
      // way down to a CARDINALS lookup, which raises KeyError (below 10**34).
      if (!isIntegral(number)) {
        if (cmp(number, 10n ** 34n) >= 0) return "NOT IMPLEMENTED";
        throw new KeyError(str(number));
      }
      number = int(number);
    }
    const n = number;

    if (n < 20n) {
      return this.makecase(n, kase, clazz);
    } else if (n < 100n) {
      const twens = floordiv(n, 20n);
      const units = mod(n, 20n);
      const base = twens * 20n;
      if (units === 0n) {
        return this.makecase(n, kase, clazz);
      }
      const twenties = this.makecase(base, "attr", clazz);
      const rest = this.toCardinal(units, { clazz, case: kase });
      return `${twenties} ${replaceAll(rest, "д*", clazz)}`;
    } else if (n < 1000n) {
      const hundreds = floordiv(n, 100n);
      const tens = mod(n, 100n);
      let hundert: string;
      if (hundreds > 1n) {
        hundert = `${replaceAll(getItem(getItem(CARDINALS, hundreds.toString()), "attr"), "д*", clazz)} `;
      } else {
        hundert = "";
      }
      if (tens !== 0n) {
        const rest = this.toCardinal(tens, { clazz, case: kase });
        return `${hundert}${getItem(getItem(CARDINALS, "100"), "abs")} ${rest}`;
      }
      return hundert + this.makecase(100n, kase, clazz);
    } else if (n < 1000000n) {
      const thousands = floordiv(n, 1000n);
      const hundert = mod(n, 1000n);
      const tcase = hundert > 0n ? "attr" : kase;
      let tausend: string;
      if (thousands > 1n) {
        tausend = `${this.toCardinal(thousands, { clazz, case: "attr" })} ${getItem(getItem(CARDINALS, "1000"), tcase)}`;
      } else {
        tausend = this.makecase(1000n, tcase, clazz);
      }
      const rest = hundert !== 0n ? ` ${this.toCardinal(hundert, { clazz, case: kase })}` : "";
      return tausend + rest;
    } else if (n < 10n ** 34n) {
      const out: string[] = [];
      for (const pot of [6, 9, 12, 15, 18, 21, 24, 27, 30, 33].reverse()) {
        // 3 digits of billion, trillion etc
        const step = mod(floordiv(n, 10n ** BigInt(pot)), 1000n);
        if (step > 0n) {
          const words = this.toCardinal(step, { clazz, case: "attr" });
          out.push(`${words} ${getItem(getItem(ILLIONS, String(pot)), "attr")}`);
        }
      }
      const rest = mod(n, 10n ** 6n);
      if (rest) {
        out.push(this.toCardinal(rest, { clazz, case: kase }));
      }
      return out.join(" ");
    }

    return "NOT IMPLEMENTED";
  }

  protected override _moneyVerbose(number: bigint, _currency: string, kase = "abs"): string {
    let mcase = "attr";
    if (kase !== "abs") mcase = "obl";
    return this.toCardinal(number, { case: mcase });
  }

  protected override _centsVerbose(number: bigint, _currency: string, kase = "abs"): string {
    let mcase = "attr";
    if (kase !== "abs") mcase = "obl";
    return this.toCardinal(number, { case: mcase });
  }

  /**
   * @param val Numeric value
   * @returns Formatted string
   */
  override toCurrency(val: PyNum | string, options: CurrencyOptionsCE = {}): string {
    const currency = options.currency ?? "RUB";
    const cents = options.cents ?? true;
    const separator = options.separator ?? ",";
    const kase = options.case ?? "abs";
    const [left, right, isNegative] = parseCurrencyParts(val);

    const forms = Object.hasOwn(this.cls.CURRENCY_FORMS, currency)
      ? this.cls.CURRENCY_FORMS[currency]
      : undefined;
    if (!forms) {
      throw new NotImplementedError(
        `Currency code "${currency}" not implemented for "${this.constructor.name}"`,
      );
    }
    const [cr1, cr2] = forms;
    const devise = cr1[0] as string;
    const centime = cr2[0] as string;

    const minusStr = isNegative ? `${this.negword.trim()} ` : "";
    const moneyStr = this._moneyVerbose(left, currency, kase);
    const centsStr = cents
      ? this._centsVerbose(right, currency, kase)
      : this._centsTerse(right, currency);

    // devise: always singular
    return `${minusStr}${moneyStr} ${devise}${separator} ${centsStr} ${centime}`;
  }

  override toOrdinalNum(number: PyNum): string {
    this.verifyOrdinal(number);
    return `${str(number)}-й`;
  }

  override toYear(year: PyNum, options: { case?: string } = {}): string {
    const kase = options.case ?? "abs";
    return this.toCardinal(year, { case: kase });
  }

  makecase(number: bigint, kase: string, clazz: string): string {
    const entry = getItem(CARDINALS, number.toString());
    if (Object.hasOwn(entry, kase)) {
      return replaceAll(entry[kase] as string, "д*", clazz);
    }
    const abs = getItem(entry, "abs");
    if (abs.slice(-1) === "а") {
      return replaceAll(abs, "д*", clazz) + getItem(getItem(CARDINALS, "casesuffix_voc"), kase);
    }
    return replaceAll(abs, "д*", clazz) + getItem(getItem(CARDINALS, "casesuffix_cons"), kase);
  }
}
