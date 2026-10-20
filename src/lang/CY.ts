// Copyright (c) 2023, Johannes Heinecke.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_CY.py

import type { CurrencyForm, CurrencyForms, CurrencyOptions } from "../base.ts";
import { parseCurrencyParts } from "../currency.ts";
import { checkKwargs } from "../internal/kwargs.ts";
import {
  AttributeError,
  at,
  cmp,
  Decimal,
  eq,
  floordiv,
  int,
  isIntegral,
  KeyError,
  mod,
  NotImplementedError,
  type PyNum,
  str,
} from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

// Welsh numerals differs to many other languages since the counted
// object does not follow the numeral but is inserted between
// e.g. "23 hours" is
//   tri awr ar hugain
//   3   hour on twenty
// in addition to that some numeral trigger a mutation on the following word
// either another numeral or the counted object
// (https://en.wikipedia.org/wiki/Consonant_mutation#Welsh)
// e.g. "23 dogs" (aspirated mutation, c -> ch)
//  tri chi ar hugain
//  3   dog on twenty
// but "22 dogs" (soft mutation, c -> g)
//  dau gi  ar hugain
//  2   dog on twenty
// and "24 dogs" (no mutation)
//  pedwar ci ar hugain
//  4      dog on twenty
// (BTW, the counted word is always in singular when following a numeral)
// numerals are mutated as well
// e.g. "300"
//    tri chant
//    3   hundred
// "200"
//    dau gant
//    2   hundred
// "500"
//    pump cant
//    5    hundreds
// the numerals for 2, 3 and 4 are different in function of gender (MASC, FEM)
//    2 cats
//    dwy gath

//    2 dogs
//    dau gi

//    2000
//    dwy fil

//    3000
//    tair mil

// to add the counted object in the correct position use
//   num2words(17, lang="cy", counted="ci", gender="masc")
//   num2words(17, lang="cy", counted="cath", gender="fem")
// if the number is > 99, use plural form of counted object
//   num2words(117, lang="cy", counted="cathod", gender="fem")

// Globals
// -------

/** A word and the mutation it triggers on the following word. */
export type Token = [string, string | null];
type Words = Record<string, Token[]>;

export const OBJ = "__OBJECT__";

export const CARDINAL_WORDS: Words = {
  // masc, fem, triggers mutation
  0: [
    ["dim", null],
    [OBJ, null],
  ],
  1: [
    ["un", null],
    [OBJ, null],
  ],
  2: [
    ["dau", "SM"],
    [OBJ, null],
  ],
  3: [
    ["tri", "AM"],
    [OBJ, null],
  ],
  4: [
    ["pedwar", null],
    [OBJ, null],
  ],
  5: [
    ["pump", null],
    [OBJ, null],
  ],
  6: [
    ["chwech", "AM"],
    [OBJ, null],
  ],
  7: [
    ["saith", null],
    [OBJ, null],
  ],
  8: [
    ["wyth", null],
    [OBJ, null],
  ],
  9: [
    ["naw", null],
    [OBJ, null],
  ],
  10: [
    ["deg", null],
    [OBJ, null],
  ],
  11: [
    ["un", null],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  12: [
    ["deuddeg", null],
    [OBJ, null],
  ],
  13: [
    ["tri", "AM"],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  14: [
    ["pedwar", null],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  15: [
    ["pymtheg", null],
    [OBJ, null],
  ],
  16: [
    ["un", null],
    [OBJ, null],
    ["ar bymtheg", null],
  ],
  17: [
    ["dau", "SM"],
    [OBJ, null],
    ["ar bymtheg", null],
  ],
  18: [
    ["deunaw", null],
    [OBJ, null],
  ],
  19: [
    ["pedwar", null],
    ["ar bymtheg", null],
  ],
};

export const CARDINAL_WORDS_FEM: Words = {
  // masc, fem, triggers mutation
  0: [
    ["dim", null],
    [OBJ, null],
  ],
  1: [
    ["un", null],
    [OBJ, null],
  ],
  2: [
    ["dwy", "SM"],
    [OBJ, null],
  ],
  3: [
    ["tair", null],
    [OBJ, null],
  ],
  4: [
    ["pedair", null],
    [OBJ, null],
  ],
  5: [
    ["pump", null],
    [OBJ, null],
  ],
  6: [
    ["chwech", "AM"],
    [OBJ, null],
  ],
  7: [
    ["saith", null],
    [OBJ, null],
  ],
  8: [
    ["wyth", null],
    [OBJ, null],
  ],
  9: [
    ["naw", null],
    [OBJ, null],
  ],
  10: [
    ["deg", null],
    [OBJ, null],
  ],
  11: [
    ["un", null],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  12: [
    ["deuddeg", null],
    [OBJ, null],
  ],
  13: [
    ["tair", null],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  14: [
    ["pedair", null],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  15: [
    ["pymtheg", null],
    [OBJ, null],
  ],
  16: [
    ["un", null],
    [OBJ, null],
    ["ar bymtheg", null],
  ],
  17: [
    ["dwy", "SM"],
    [OBJ, null],
    ["ar bymtheg", null],
  ],
  18: [
    ["deunaw", null],
    [OBJ, null],
  ],
  19: [
    ["pedair", null],
    ["ar bymtheg", null],
  ],
};

export const MILLION_WORDS: Record<string, Token> = {
  3: ["mil", null],
  6: ["miliwn", null],
  9: ["biliwn", null],
  12: ["triliwn", null],
  15: ["cwadriliwn", null],
  18: ["cwintiliwn", null],
  21: ["secsttiliwn", null],
  24: ["septiliwn", null],
  27: ["octiliwn", null],
  30: ["noniliwn", null],
  33: ["dengiliwn", null],
};

export const ORDINAL_WORDS: Words = {
  0: [
    ["dimfed", null],
    [OBJ, null],
  ],
  1: [
    [OBJ, null],
    ["cyntaf", null],
  ],
  2: [
    ["ail", "SM"],
    [OBJ, null],
  ],
  3: [
    ["trydydd", null],
    [OBJ, null],
  ],
  4: [
    ["pedwerydd", null],
    [OBJ, null],
  ],
  5: [
    ["pumed", null],
    [OBJ, null],
  ],
  6: [
    ["chweched", null],
    [OBJ, null],
  ],
  7: [
    ["saithfed", null],
    [OBJ, null],
  ],
  8: [
    ["wythfed", null],
    [OBJ, null],
  ],
  9: [
    ["nawfed", null],
    [OBJ, null],
  ],
  10: [
    ["degfed", null],
    [OBJ, null],
  ],
  11: [
    ["unfed", "SM"],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  12: [
    ["deuddegfed", null],
    [OBJ, null],
  ],
  13: [
    ["trydydd", null],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  14: [
    ["pedwerydd", null],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  15: [
    ["pymthegfed", null],
    [OBJ, null],
  ],
  16: [
    ["unfed", null],
    [OBJ, null],
    ["ar bymtheg", null],
  ],
  17: [
    ["ail", "SM"],
    [OBJ, null],
    ["ar bymtheg", null],
  ],
  18: [
    ["deunawfed", null],
    [OBJ, null],
  ],
  19: [
    ["pedwerydd", null],
    [OBJ, null],
    ["ar bymtheg", null],
  ],
};
export const ORDINAL_WORDS_FEM: Words = {
  0: [
    ["dimfed", null],
    [OBJ, null],
  ],
  1: [
    [OBJ, null],
    ["gyntaf", null],
  ],
  2: [
    ["ail", "SM"],
    [OBJ, null],
  ],
  3: [
    ["trydedd", "SM"],
    [OBJ, null],
  ],
  4: [
    ["pedwaredd", "SM"],
    [OBJ, null],
  ],
  5: [
    ["pumed", null],
    [OBJ, null],
  ],
  6: [
    ["chweched", null],
    [OBJ, null],
  ],
  7: [
    ["saithfed", null],
    [OBJ, null],
  ],
  8: [
    ["wythfed", null],
    [OBJ, null],
  ],
  9: [
    ["nawfed", null],
    [OBJ, null],
  ],
  10: [
    ["degfed", null],
    [OBJ, null],
  ],
  11: [
    ["unfed", "SM"],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  12: [
    ["deuddegfed", null],
    [OBJ, null],
  ],
  13: [
    ["trydedd", "SM"],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  14: [
    ["pedwaredd", "SM"],
    [OBJ, null],
    ["ar ddeg", null],
  ],
  15: [
    ["pymthegfed", null],
    [OBJ, null],
  ],
  16: [
    ["unfed", null],
    [OBJ, null],
    ["ar bymtheg", null],
  ],
  17: [
    ["ail", "SM"],
    [OBJ, null],
    ["ar bymtheg", null],
  ],
  18: [
    ["deunawfed", null],
    [OBJ, null],
  ],
  19: [
    ["pedwaredd", null],
    [OBJ, null],
    ["ar bymtheg", null],
  ],
};

// The script can extrapolate the missing numbers from the base forms.
export const STR_TENS: Words = {
  1: [
    ["ugain", null],
    [OBJ, null],
  ],
  2: [
    ["deugain", null],
    [OBJ, null],
  ],
  3: [
    ["trigain", null],
    [OBJ, null],
  ],
  4: [
    ["pedwar ugain", null],
    [OBJ, null],
  ],
};

export const ORD_STR_TENS: Words = {
  1: [
    ["ugainfed", null],
    [OBJ, null],
  ],
  2: [
    ["deugainfed", null],
    [OBJ, null],
  ],
  3: [
    ["trigainfed", null],
    [OBJ, null],
  ],
  4: [
    ["pedwar ugainfed", null],
    [OBJ, null],
  ],
};

export const STR_TENS_INFORMAL: Record<string, Token> = {
  1: ["undeg", null],
  2: ["dauddeg", null],
  3: ["trideg", null],
  4: ["pedwardeg", null],
  5: ["pumdeg", null],
  6: ["chwedeg", null],
  7: ["saithdeg", null],
  8: ["wythdeg", null],
  9: ["nawdeg", null],
};

export const GENERIC_DOLLARS: CurrencyForm = ["dolar", "dolarau"];
export const GENERIC_CENTS: CurrencyForm = ["ceiniog", "ceiniogau"];

export const CURRENCIES_FEM = ["GBP"];

/** `d[number]` on a dict with int keys: floats and Decimals hash like the equal int. */
function lookup<V>(d: Readonly<Record<string, V>>, key: PyNum): V {
  if (isIntegral(key)) {
    const k = int(key).toString();
    if (Object.hasOwn(d, k)) return d[k] as V;
  }
  throw new KeyError(str(key));
}

/**
 * Python raises TypeError when a method gets a keyword argument its signature
 * does not declare (e.g. `num2words(1, lang="cy", ordinal=True, counted="ci")`).
 */
export interface CardinalOptions {
  informal?: boolean;
  gender?: string;
  ordinal?: boolean;
  counted?: string | null;
  raw?: boolean;
}

export interface OrdinalOptions {
  informal?: boolean;
  gender?: string;
}

export class Num2Word_CY extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    // currency code: (sg, pl), (sg, pl)
    // in Welsh a noun after a numeral is ALWAYS in the singular
    EUR: [["euro", "euros"], GENERIC_CENTS],
    USD: [GENERIC_DOLLARS, GENERIC_CENTS],
    GBP: [
      ["punt", "punnoedd"],
      ["ceiniog", "ceiniogau"],
    ],
    CNY: [
      ["yuan", "yuans"],
      ["ffen", "ffens"],
    ],
  };

  static MINUS_PREFIX_WORD = "meinws ";
  static FLOAT_INFIX_WORD = " pwynt ";

  //    def setup(self):
  //        Num2Word_EU.setup(self)

  constructor() {
    super();
    // Upstream's __init__ is `pass`: none of the base attributes exist.
    const self = this as unknown as Record<string, unknown>;
    for (const key of Object.keys(self)) delete self[key];
  }

  override setup(): void {}

  floatToWords(floatNumber: number): string {
    // if ordinal:
    //     prefix = self.to_ordinal(int(float_number))
    // else:
    const prefix = this.toCardinal(int(floatNumber));
    const floatPart = at(str(floatNumber).split("."), 1);
    const postfix = [...floatPart]
      // Drops the trailing zero and comma
      .map((c) => this.toCardinal(int(c)))
      .join(" ");
    return prefix + Num2Word_CY.FLOAT_INFIX_WORD + postfix;
  }

  hundredGroup(
    number: bigint,
    options: { informal?: boolean; gender?: string; ordinal?: boolean } = {},
  ): Token[] {
    const gender = options.gender ?? "masc";
    const ordinal = options.ordinal ?? false;
    const hundreds = floordiv(number, 100n);
    const until100 = mod(number, 100n); // 0 - 99
    // list group of number words and mutation info (for the following word)
    const result: Token[] = [];
    let CW: Words;
    if (gender === "fem") {
      CW = CARDINAL_WORDS_FEM;
    } else {
      if (ordinal) {
        CW = ORDINAL_WORDS;
      } else {
        CW = CARDINAL_WORDS;
      }
    }

    if (hundreds > 0n) {
      if (hundreds > 1n) {
        result.push(...lookup(CARDINAL_WORDS, hundreds));
      }
      result.push(["cant", null], [OBJ, null]);
      if (until100) {
        if (
          [1n, 8n, 11n, 16n, 20n, 21n, 31n, 36n, 41n, 48n, 61n, 68n, 71n, 81n, 88n, 91n].includes(
            until100,
          )
        ) {
          result.push(["ac", null]);
        } else {
          result.push(["a", "AM"]);
        }
      }
    }
    if (until100) {
      // if informal:
      //    pass
      if (!ordinal && until100 >= 50n && until100 <= 59n) {
        const units = mod(number, 10n);
        if (hundreds > 0n) {
          if (units === 0n) {
            result.push(["hanner", null]);
          } else if (units === 1n) {
            result.push(["hanner ac un", null], [OBJ, null]);
          } else {
            result.push(["hanner a", "AM"]);
            result.push(...lookup(CW, units));
          }
        } else {
          if (units === 0n) {
            result.push(["hanner cant", null], [OBJ, null]);
          } else if (units === 1n) {
            result.push(["hanner cant ac un", null], [OBJ, null]);
          } else {
            result.push(["hanner cant a", "AM"]);
            result.push(...lookup(CW, units));
          }
        }
      } else {
        if ((number < 20n && number > 0n) || (number === 0n && hundreds === 0n)) {
          if (gender === "fem") {
            result.push(...lookup(CARDINAL_WORDS_FEM, number));
          } else {
            result.push(...lookup(CARDINAL_WORDS, number));
          }
        } else {
          const tens = floordiv(until100, 20n);
          const units = mod(number, 20n);
          const k = tens.toString();
          let degau: Token[] | undefined;
          if (ordinal && units === 0n) {
            degau = Object.hasOwn(ORD_STR_TENS, k) ? ORD_STR_TENS[k] : undefined;
          } else {
            degau = Object.hasOwn(STR_TENS, k) ? STR_TENS[k] : undefined;
          }

          if (units !== 0n) {
            if (tens > 1n) {
              result.push(...lookup(CW, units));
              if (degau?.length) {
                result.push(["a", "AM"]);
                result.push(...degau);
              }
            } else {
              result.push(...lookup(CW, units));
              if (degau?.length) {
                result.push(["ar", "SM"]);
                result.push(...degau);
              }
            }
          } else if (degau?.length) {
            result.push(...degau);
          }
        }
      }
    }
    return result;
  }

  override toOrdinal(number: PyNum, options: OrdinalOptions = {}): string {
    checkKwargs(options, ["informal", "gender"], "to_ordinal");
    const gender = options.gender ?? "masc";
    if (cmp(number, 20n) < 0) {
      return makestring(lookup(ORDINAL_WORDS, number));
    }
    if (eq(number, 100n)) {
      return "canfed";
    } else if (cmp(number, 100n) > 0) {
      throw new NotImplementedError("The given number is too large.");
    }

    return this.toCardinal(number, { informal: false, gender, ordinal: true });
  }

  override toCardinal(number: PyNum, options: CardinalOptions = {}): string {
    checkKwargs(options, ["informal", "gender", "ordinal", "counted", "raw"], "to_cardinal");
    return this._toCardinal(number, options) as string;
  }

  /** `to_cardinal`, which returns the token list when `raw` is set. */
  _toCardinal(number: PyNum, options: CardinalOptions = {}): string | Token[] {
    const informal = options.informal ?? false;
    const gender = options.gender ?? "masc";
    const ordinal = options.ordinal ?? false;
    const counted = options.counted ?? null;
    const raw = options.raw ?? false;

    let negative = false;
    if (cmp(number, 0n) < 0) {
      negative = true;
      number =
        typeof number === "bigint"
          ? -1n * number
          : typeof number === "number"
            ? -1 * number
            : number.neg();
    }
    if (eq(number, 0n)) {
      if (raw) {
        return CARDINAL_WORDS[0] as Token[];
      } else {
        return makestring(CARDINAL_WORDS[0] as Token[]);
      }
    } else if (!(cmp(number, 999n * 10n ** 33n) < 0)) {
      throw new NotImplementedError("The given number is too large.");
    } else if (typeof number === "number") {
      return this.floatToWords(number);
    }

    // A positive Decimal splits into the same groups as its integer part.
    const n = number instanceof Decimal ? number.toBigInt() : number;

    // split in groups of 10**3
    // groups of three digits starting from right (units (1 - 999),
    // thousands, millions, ...)
    const groups: [bigint, number][] = [];
    let lowestgroup: bigint | null = null; // find the lowest group of 3 digits > 0 for the ordinals
    for (const pot of [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]) {
      const gr = floordiv(mod(n, 10n ** BigInt(pot)), 10n ** BigInt(pot - 3));
      groups.push([gr, pot]);
      if (gr && !lowestgroup) lowestgroup = gr;
    }

    let result: Token[] = [];
    if (negative) result.push(["meinws", null]);

    for (const [gr, pot] of [...groups].reverse()) {
      if (gr) {
        let g: string;
        if (pot === 6) {
          g = "fem"; // mil (1000) is feminine
        } else if (pot === 3) {
          g = gender; // units depend on the following noun
        } else {
          g = "masc"; // millions etc are masculine
          // "mil" is feminine
        }
        if (gr > 1n || pot === 3) {
          const words = this.hundredGroup(gr, {
            informal,
            gender: g,
            ordinal: ordinal && lowestgroup === gr,
          });
          result = result.concat(words);
        }
        if (pot > 3) {
          result.push(MILLION_WORDS[pot - 3] as Token);
        }
      }
    }
    if (raw) {
      // need to be able trigger correct mutation on currencies
      return result;
    } else {
      if (cmp(number, 100n) < 0) {
        return makestring(result, counted);
      } else {
        if (counted) {
          result.push(["o", "SM"], [counted, null]);
        }
        return makestring(result);
      }
    }
  }

  /**
   * @param val Numeric value
   * @returns Formatted string
   */
  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    checkKwargs(options, ["currency", "cents", "separator", "adjective"], "to_currency");
    const currency = options.currency ?? "EUR";
    const cents = options.cents ?? true;
    const separator = options.separator ?? ",";
    const [left, right, isNegative] = parseCurrencyParts(val);
    const forms = Object.hasOwn(this.cls.CURRENCY_FORMS, currency)
      ? this.cls.CURRENCY_FORMS[currency]
      : undefined;
    if (!forms) {
      throw new NotImplementedError(
        `Currency code "${currency}" not implemented for "${this.constructor.name}"`,
      );
    }

    // if adjective and currency in self.CURRENCY_ADJECTIVES:
    //     cr1 = prefix_currency(self.CURRENCY_ADJECTIVES[currency], cr1)

    let minusStr = "";
    if (isNegative) {
      if (this.negword === undefined) {
        throw new AttributeError("'Num2Word_CY' object has no attribute 'negword'");
      }
      minusStr = `${this.negword.trim()} `;
    }
    const moneyStr = this._moneyVerbose(left, currency);
    const centsStr = cents
      ? this._centsVerbose(right, currency)
      : this._centsTerse(right, currency);

    if (right === 0n) {
      // no pence
      return `${minusStr}${moneyStr}`;
    } else if (left === 0n) {
      // no pounds
      return `${minusStr}${centsStr}`;
    }

    return `${minusStr}${moneyStr}${separator} ${centsStr}`;
  }

  protected override _moneyVerbose(number: bigint, currency: string): string {
    // used in super().to_currency(), we need to add gender
    // here for feminine currencies
    // if currency in CURRENCIES_FEM:  # always true in this context
    const forms = this.cls.CURRENCY_FORMS[currency] as CurrencyForms;
    if (number > 100n) {
      const m = this._toCardinal(number, { gender: "fem", raw: true }) as Token[];
      const c = forms[0][1] as string;
      m.push(["o", "SM"]);
      m.push([c, null]);
      return makestring(m);
    } else {
      const m = this._toCardinal(number, { gender: "fem", raw: true }) as Token[];
      const c = forms[0][0] as string;
      return makestring(m, c);
    }
  }

  protected override _centsVerbose(number: bigint, currency: string): string {
    if (number === 0n) {
      return "";
    } else {
      let m: Token[];
      if (number > 1n) {
        m = this._toCardinal(number, { raw: true }) as Token[];
      } else {
        m = [[OBJ, null]];
      }
      const c = (this.cls.CURRENCY_FORMS[currency] as CurrencyForms)[1][0] as string;
      return makestring(m, c);
    }
  }
}

export function makestring(result: Token[], counted: string | null = null): string {
  // concatenate numberwords with correct mutation
  const out: string[] = [];
  let lastmut: string | null = null;
  for (let [w, mut] of result) {
    if (w === OBJ) {
      if (!counted) {
        continue;
      } else {
        w = counted;
        counted = null; // only first position
      }
    }
    if (lastmut) {
      out.push(mutate(w, lastmut) as string);
    } else {
      out.push(w);
    }
    lastmut = mut;
  }
  return out.join(" ");
}

export function mutate(word: string, mutation: string): string | undefined {
  if (mutation === "SM") {
    return softmutation(word);
  } else if (mutation === "AM") {
    return aspiratedmutation(word);
  }
  // return word  # does not occur
  return undefined;
}

export function softmutation(word: string): string {
  if (at(word, 0) === "p" && at(word, 1) !== "h") {
    return `b${word.slice(1)}`;
  } else if (at(word, 0) === "t" && at(word, 1) !== "h") {
    return `d${word.slice(1)}`;
  } else if (at(word, 0) === "c" && at(word, 1) !== "h") {
    return `g${word.slice(1)}`;
  } else if (at(word, 0) === "b" || at(word, 0) === "m") {
    return `f${word.slice(1)}`;
  } else if (at(word, 0) === "d" && at(word, 1) !== "d") {
    return `d${word}`;
  } else if (word.startsWith("ll")) {
    return word.slice(1);
  } else if (word.startsWith("rh")) {
    return `r${word.slice(2)}`;
  } else if (word === "ugain") {
    return "hugain";
  } else {
    return word;
  }
}

export function aspiratedmutation(word: string): string {
  if (at(word, 0) === "p" && at(word, 1) !== "h") {
    return `ph${word.slice(1)}`;
  } else if (at(word, 0) === "t" && at(word, 1) !== "h") {
    return `th${word.slice(1)}`;
  } else if (at(word, 0) === "c" && at(word, 1) !== "h") {
    return `ch${word.slice(1)}`;
  } else {
    return word;
  }
}
