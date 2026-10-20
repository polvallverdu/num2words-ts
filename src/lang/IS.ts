// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_IS.py

import type { CurrencyForm, CurrencyOptions, WordPair } from "../base.ts";
import { checkKwargs } from "../internal/kwargs.ts";
import { mod, NotImplementedError, type PyNum } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

// Genders
export const KK = 0; // Karlkyn (male)
export const KVK = 1; // Kvenkyn (female)
export const HK = 2; // Hvorugkyn (neuter)

export const GENDERS: Record<string, readonly [string, string, string]> = {
  einn: ["einn", "ein", "eitt"],
  tveir: ["tveir", "tvær", "tvö"],
  þrír: ["þrír", "þrjár", "þrjú"],
  fjórir: ["fjórir", "fjórar", "fjögur"],
};

export const PLURALS: Record<string, readonly [string, string]> = {
  hundrað: ["hundrað", "hundruð"],
};

export class Num2Word_IS extends Num2Word_EU {
  static override GIGA_SUFFIX: string | null = "illjarður";
  static override MEGA_SUFFIX: string | null = "illjón";

  declare ords: Record<string, string>;

  override setup(): void {
    const lows = ["okt", "sept", "sext", "kvint", "kvaðr", "tr", "b", "m"];
    this.highNumwords = this.genHighNumwords([], [], lows);

    this.negword = "mínus ";
    this.pointword = "komma";

    // All words should be excluded, title case is not used in Icelandic
    this.excludeTitle = ["og", "komma", "mínus"];

    this.midNumwords = [
      [1000n, "þúsund"],
      [100n, "hundrað"],
      [90n, "níutíu"],
      [80n, "áttatíu"],
      [70n, "sjötíu"],
      [60n, "sextíu"],
      [50n, "fimmtíu"],
      [40n, "fjörutíu"],
      [30n, "þrjátíu"],
    ];
    this.lowNumwords = [
      "tuttugu",
      "nítján",
      "átján",
      "sautján",
      "sextán",
      "fimmtán",
      "fjórtán",
      "þrettán",
      "tólf",
      "ellefu",
      "tíu",
      "níu",
      "átta",
      "sjö",
      "sex",
      "fimm",
      "fjórir",
      "þrír",
      "tveir",
      "einn",
      "núll",
    ];
    this.ords = {
      einn: "fyrsti",
      tveir: "annar",
      þrír: "þriðji",
      fjórir: "fjórði",
      fimm: "fimmti",
      sex: "sjötti",
      sjö: "sjöundi",
      átta: "áttundi",
      níu: "níundi",
      tíu: "tíundi",
      ellefu: "ellefti",
      tólf: "tólfti",
    };
  }

  // Upstream calls this with a noun string (not currency forms).
  override pluralize(n: bigint, noun: string | CurrencyForm): string {
    const word = noun as string;
    const cls = this.constructor as typeof Num2Word_IS;
    const form = mod(n, 10n) === 1n && mod(n, 100n) !== 11n ? 0 : 1;
    if (form === 0) {
      return word;
    } else if (word.includes(cls.GIGA_SUFFIX as string)) {
      return word.replaceAll(cls.GIGA_SUFFIX as string, "illjarðar");
    } else if (word.includes(cls.MEGA_SUFFIX as string)) {
      return word.replaceAll(cls.MEGA_SUFFIX as string, "illjónir");
    } else if (!Object.hasOwn(PLURALS, word)) {
      return word;
    }
    return (PLURALS[word] as readonly [string, string])[form];
  }

  genderize(adj: string, noun: string): string {
    const parts = adj.split(/\s+/).filter(Boolean);
    const last = parts[parts.length - 1] as string;
    if (!Object.hasOwn(GENDERS, last)) {
      return adj;
    }
    let gender = KK;
    if (noun.includes("hund") || noun.includes("þús")) {
      gender = HK;
    } else if (noun.includes("illjarð")) {
      gender = KK;
    } else if (noun.includes("illjón")) {
      gender = KVK;
    }
    return adj.replaceAll(last, (GENDERS[last] as readonly string[])[gender] as string);
  }

  override merge(lpair: WordPair, rpair: WordPair): WordPair {
    let [ltext, lnum] = lpair;
    let [rtext, rnum] = rpair;

    if (lnum === 1n && rnum < 100n) {
      return [rtext, rnum];
    } else if (lnum < rnum) {
      rtext = this.pluralize(lnum, rtext);
      ltext = this.genderize(ltext, rtext);
      return [`${ltext} ${rtext}`, lnum * rnum];
    } else if (lnum > rnum && this.cards.has(rnum)) {
      rtext = this.pluralize(lnum, rtext);
      ltext = this.genderize(ltext, rtext);
      return [`${ltext} og ${rtext}`, lnum + rnum];
    }
    return [`${ltext} ${rtext}`, lnum + rnum];
  }

  override toOrdinal(_value: PyNum, options: object = {}): string {
    checkKwargs(options, [], "to_ordinal");
    throw new NotImplementedError();
  }

  override toOrdinalNum(_value: PyNum, options: object = {}): string {
    checkKwargs(options, [], "to_ordinal_num");
    throw new NotImplementedError();
  }

  override toYear(
    _val: PyNum,
    options: { suffix?: string | null; longval?: boolean } = {},
  ): string {
    checkKwargs(options, ["suffix", "longval"], "to_year");
    throw new NotImplementedError();
  }

  override toCurrency(
    _val: PyNum | string,
    options: CurrencyOptions & { longval?: boolean } = {},
  ): string {
    checkKwargs(options, ["longval"], "to_currency");
    throw new NotImplementedError();
  }
}
