// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_SV.py

import type { CurrencyOptions, WordPair } from "../base.ts";
import { checkKwargs } from "../internal/kwargs.ts";
import { NotImplementedError, type PyNum } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

export class Num2Word_SV extends Num2Word_EU {
  static override GIGA_SUFFIX: string | null = "iljarder";
  static override MEGA_SUFFIX: string | null = "iljoner";

  declare ords: Record<string, string>;

  override setHighNumwords(high: string[]): void {
    const cap = 3 + 6 * high.length;
    const cls = this.constructor as typeof Num2Word_SV;

    // zip(high, range(cap, 3, -6))
    let n = cap;
    for (const word of high) {
      if (n <= 3) break;
      if (cls.GIGA_SUFFIX) {
        this.cards.set(10n ** BigInt(n), word + cls.GIGA_SUFFIX);
      }
      if (cls.MEGA_SUFFIX) {
        this.cards.set(10n ** BigInt(n - 3), word + cls.MEGA_SUFFIX);
      }
      n -= 6;
    }
  }

  override setup(): void {
    super.setup();

    this.negword = "minus ";
    this.pointword = "komma";
    this.excludeTitle = ["och", "komma", "minus"];

    this.midNumwords = [
      [1000n, "tusen"],
      [100n, "hundra"],
      [90n, "nittio"],
      [80n, "åttio"],
      [70n, "sjuttio"],
      [60n, "sextio"],
      [50n, "femtio"],
      [40n, "förtio"],
      [30n, "trettio"],
    ];
    this.lowNumwords = [
      "tjugo",
      "nitton",
      "arton",
      "sjutton",
      "sexton",
      "femton",
      "fjorton",
      "tretton",
      "tolv",
      "elva",
      "tio",
      "nio",
      "åtta",
      "sju",
      "sex",
      "fem",
      "fyra",
      "tre",
      "två",
      "ett",
      "noll",
    ];
    this.ords = {
      noll: "nollte",
      ett: "första",
      två: "andra",
      tre: "tredje",
      fyra: "fjärde",
      fem: "femte",
      sex: "sjätte",
      sju: "sjunde",
      åtta: "åttonde",
      nio: "nionde",
      tio: "tionde",
      elva: "elfte",
      tolv: "tolfte",
      tjugo: "tjugonde",
    };
  }

  override merge(lpair: WordPair, rpair: WordPair): WordPair {
    const [ltext, lnum] = lpair;
    const [rtext, rnum] = rpair;
    if (lnum === 1n && rnum < 100n) {
      return [rtext, rnum];
    } else if (100n > lnum && lnum > rnum) {
      return [`${ltext}${rtext}`, lnum + rnum];
    } else if (lnum >= 100n && 100n > rnum) {
      return [`${ltext}${rtext}`, lnum + rnum];
    } else if (rnum >= 1000000n && lnum === 1n) {
      return [`en ${rtext.slice(0, -2)}`, lnum + rnum];
    } else if (rnum >= 1000000n && lnum > 1n) {
      return [`${ltext} ${rtext}`, lnum + rnum];
    } else if (rnum > lnum) {
      return [`${ltext}${rtext}`, lnum * rnum];
    }
    return [`${ltext} ${rtext}`, lnum + rnum];
  }

  override toOrdinal(value: PyNum, options: object = {}): string {
    checkKwargs(options, [], "to_ordinal");
    this.verifyOrdinal(value);
    const outwords = this.toCardinal(value).split(" ");
    const lastword = outwords[outwords.length - 1] as string;
    let endingLength = 0;
    let lastwordEnding: string;
    if (Object.hasOwn(this.ords, lastword.slice(-4))) {
      lastwordEnding = this.ords[lastword.slice(-4)] as string;
      endingLength = 4;
    } else if (Object.hasOwn(this.ords, lastword.slice(-3))) {
      lastwordEnding = this.ords[lastword.slice(-3)] as string;
      endingLength = 3;
    } else {
      lastwordEnding = "de";
    }
    let lastwordFirstPart: string;
    if (lastwordEnding === "de") {
      lastwordFirstPart = this.title(lastword);
    } else {
      // Python's s[:-0] is "", like slice(0, -0).
      lastwordFirstPart = this.title(lastword).slice(0, -endingLength);
    }
    const lastwordCorrect = lastwordFirstPart + lastwordEnding;
    outwords[outwords.length - 1] = lastwordCorrect;
    return outwords.join(" ");
  }

  override toOrdinalNum(_value: PyNum, options: object = {}): string {
    checkKwargs(options, [], "to_ordinal_num");
    throw new NotImplementedError("'ordinal_num' is not implemented for swedish language");
  }

  override toYear(_val: PyNum, options: { longval?: boolean } = {}): string {
    checkKwargs(options, ["longval"], "to_year");
    throw new NotImplementedError("'year' is not implemented for swedish language");
  }

  override toCurrency(
    _val: PyNum | string,
    options: CurrencyOptions & { longval?: boolean } = {},
  ): string {
    checkKwargs(options, ["longval"], "to_currency");
    throw new NotImplementedError("'currency' is not implemented for swedish language");
  }
}
