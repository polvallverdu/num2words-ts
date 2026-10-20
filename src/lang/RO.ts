// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_RO.py

import type { CurrencyForm, CurrencyOptions, WordPair } from "../base.ts";
import { at, Decimal, eq, mod, type PyNum, ROUND_HALF_EVEN, round, str } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

/** Options of `toYear`. */
export interface YearOptions {
  suffix?: string | null;
  longval?: boolean;
}

/** Python `int(round(val * 100))` for any number type. */
function roundCents(val: PyNum): bigint {
  if (typeof val === "bigint") return val * 100n;
  if (typeof val === "number") return round(val * 100);
  // Decimal.__round__() rounds half to even.
  return val.mul(100n).quantize(new Decimal("1"), ROUND_HALF_EVEN).toBigInt();
}

export class Num2Word_RO extends Num2Word_EU {
  static override GIGA_SUFFIX: string | null = "iliard/e";
  static override MEGA_SUFFIX: string | null = "ilion";
  // inflection for mi/billion follows different rule
  static MEGA_SUFFIX_I = "ilioane";
  static GIGA_SUFFIX_I = "iliarde";

  declare genNumwords: string[];
  declare genNumwordsN: string[];
  declare numwordsInflections: Map<bigint, string[]>;
  declare ords: Record<string, string>;

  override setup(): void {
    super.setup();

    this.negword = "minus ";
    this.pointword = "virgulă";
    this.excludeTitle = ["și", "virgulă", "minus"];
    this.errmsgToobig = "Numărul e prea mare pentru a fi convertit în cuvinte (abs(%s) > %s).";
    this.midNumwords = [
      [1000n, "mie/i"],
      [100n, "sută/e"],
      [90n, "nouăzeci"],
      [80n, "optzeci"],
      [70n, "șaptezeci"],
      [60n, "șaizeci"],
      [50n, "cincizeci"],
      [40n, "patruzeci"],
      [30n, "treizeci"],
    ];
    this.lowNumwords = [
      "douăzeci",
      "nouăsprezece",
      "optsprezece",
      "șaptesprezece",
      "șaisprezece",
      "cincisprezece",
      "paisprezece",
      "treisprezece",
      "doisprezece",
      "unsprezece",
      "zece",
      "nouă",
      "opt",
      "șapte",
      "șase",
      "cinci",
      "patru",
      "trei",
      "doi",
      "unu",
      "zero",
    ];
    this.genNumwords = ["", "o", "două", "trei", "patru", "cinci", "șase", "șapte", "opt", "nouă"];
    this.genNumwordsN = [
      "",
      "un",
      "două",
      "trei",
      "patru",
      "cinci",
      "șase",
      "șapte",
      "opt",
      "nouă",
    ];
    this.numwordsInflections = new Map([
      [100n, this.genNumwords],
      [1000n, this.genNumwords],
      [1000000n, this.genNumwordsN],
      [1000000000n, this.genNumwordsN],
    ]);
    this.ords = {
      unu: "primul",
      doi: "al doilea",
      three: "al treilea",
      cinci: "al cincilea",
      opt: "al optulea",
      nouă: "al nouălea",
      doisprezece: "al doisprezecelea",
    };
  }

  override merge(lpair: WordPair, rpair: WordPair): WordPair {
    const [ltext, lnum] = lpair;
    const [rtext, rnum] = rpair;
    let rtextI = this.inflect(rnum, rtext, lnum);
    if (1n <= lnum && lnum < 10n) {
      const infl = this.numwordsInflections.get(rnum);
      if (infl === undefined) {
        return [rtext, rnum];
      }
      rtextI = this.inflect(lnum * rnum, rtext, lnum);
      return [`${infl[Number(lnum)] as string} ${rtextI}`, rnum];
    } else if (10n < lnum && lnum < 100n) {
      if (mod(lnum, 10n) === 0n) {
        if (this.numwordsInflections.has(rnum)) {
          rtextI = this.inflect(lnum * rnum, rtext, lnum);
          return [`${ltext} ${rtextI}`, lnum * rnum];
        }
        return [`${ltext} și ${rtext}`, lnum + rnum];
      }
      rtextI = this.inflect(lnum * rnum, rtext, lnum);
      const ltextI = mod(lnum, 10n) !== 2n ? ltext : ltext.replaceAll("doi", "două");
      return [`${ltextI} ${rtextI}`, lnum * rnum];
    }
    if (this.numwordsInflections.has(rnum)) {
      rtextI = this.inflect(lnum * rnum, rtext, lnum);
    }
    return [`${ltext} ${rtextI}`, lnum * rnum];
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    if (eq(value, 1n)) {
      return "primul";
    }
    const words = this.toCardinal(value);
    return `al ${words}lea`;
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    if (eq(value, 1n)) {
      return "1-ul";
    }
    return `al ${str(value)}-lea`;
  }

  override pluralize(n: bigint, forms: CurrencyForm): string {
    let form: number;
    if (n === 1n) {
      form = 0;
    } else if (n === 0n || (mod(n, 100n) > 0n && mod(n, 100n) < 20n)) {
      form = 1;
    } else {
      form = 2;
    }
    return at(forms, form);
  }

  override inflect(_value: bigint, text: string, sideEffect: bigint = -1n): string {
    const parts = text.split("/");
    let result = parts[0] as string;
    if (parts.length > 1) {
      const first = parts[0] as string;
      const forms = [
        first,
        first.slice(0, -1) + (parts[1] as string),
        `de ${first.slice(0, -1)}${parts[1] as string}`,
      ];
      result = this.pluralize(sideEffect, forms);
    }
    const cls = this.constructor as typeof Num2Word_RO;
    // mega inflections are different
    if (sideEffect > 1n && result.endsWith(cls.MEGA_SUFFIX as string)) {
      result = result.replaceAll(cls.MEGA_SUFFIX as string, cls.MEGA_SUFFIX_I);
    } else if (sideEffect > 1n && result.endsWith("iliare")) {
      result = result.replaceAll("iliare", cls.GIGA_SUFFIX_I);
    }
    return result;
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    const currency = options.currency ?? "RON";
    const separator = options.separator ?? " și";
    const adjective = options.adjective ?? false;
    // romanian currency has a particularity for numeral: one
    // DIVERGENCE: restored in `finally`; upstream leaves it set when the call raises, which corrupts
    // later calls on this shared converter. Output of successful calls is unchanged.
    this.genNumwords[1] = "una";
    let result: string;
    try {
      result = super.toCurrency(roundCents(val as PyNum), {
        currency,
        cents: true,
        separator,
        adjective,
      });
    } finally {
      this.genNumwords[1] = "o"; // revert numeral
    }
    return result
      .replaceAll("unu leu", "un leu")
      .replaceAll("unu ban", "un ban")
      .replaceAll(`${separator} zero bani`, "");
  }

  override toYear(val: PyNum, options: YearOptions = {}): string {
    let suffix = options.suffix ?? null;
    let result = super.toYear(val, { longval: options.longval ?? true });
    // for years we want the era negation e.g. B.C., in our case
    // it's î.Hr. or î.e.n
    if (result.startsWith(this.negword)) {
      result = result.replaceAll(this.negword, "");
      suffix = !suffix ? "î.Hr." : suffix;
    }
    if (suffix) {
      result = [result, " ", suffix].join("");
    }
    return result;
  }
}
