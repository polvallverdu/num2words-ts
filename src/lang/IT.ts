// Copyright (c) 2018-2019, Filippo Costa.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_IT.py

import type { CurrencyForm, CurrencyForms, CurrencyOptions } from "../base.ts";
import {
  AttributeError,
  at,
  cmp,
  type Decimal,
  floordiv,
  int,
  mod,
  NotImplementedError,
  type PyNum,
  str,
} from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

// Globals
// -------

export const ZERO = "zero";

export const CARDINAL_WORDS: readonly string[] = [
  ZERO,
  "uno",
  "due",
  "tre",
  "quattro",
  "cinque",
  "sei",
  "sette",
  "otto",
  "nove",
  "dieci",
  "undici",
  "dodici",
  "tredici",
  "quattordici",
  "quindici",
  "sedici",
  "diciassette",
  "diciotto",
  "diciannove",
];

export const ORDINAL_WORDS: readonly string[] = [
  ZERO,
  "primo",
  "secondo",
  "terzo",
  "quarto",
  "quinto",
  "sesto",
  "settimo",
  "ottavo",
  "nono",
  "decimo",
  "undicesimo",
  "dodicesimo",
  "tredicesimo",
  "quattordicesimo",
  "quindicesimo",
  "sedicesimo",
  "diciassettesimo",
  "diciottesimo",
  "diciannovesimo",
];

// The script can extrapolate the missing numbers from the base forms.
export const STR_TENS: Readonly<Record<string, string>> = {
  2: "venti",
  3: "trenta",
  4: "quaranta",
  6: "sessanta",
};

// These prefixes are used for extremely big numbers.
export const EXPONENT_PREFIXES: readonly string[] = [
  ZERO,
  "m",
  "b",
  "tr",
  "quadr",
  "quint",
  "sest",
  "sett",
  "ott",
  "nov",
  "dec",
];

export const GENERIC_DOLLARS: CurrencyForm = ["dollaro", "dollari"];
export const GENERIC_CENTS: CurrencyForm = ["centesimo", "centesimi"];
// Upstream writes ('GBP'), which is a string, not a tuple: `in` tests substrings.
export const CURRENCIES_UNA = "GBP";

/** Python `x % y` for the number types `to_ordinal` sees. */
function pyMod(x: PyNum, y: bigint): PyNum {
  if (typeof x === "bigint") return mod(x, y);
  if (typeof x === "number") {
    const b = Number(y);
    let r = x % b;
    if (r !== 0 && r < 0 !== b < 0) r += b;
    return r;
  }
  // Decimal's % keeps the sign of the dividend.
  return x.divmod(y)[1];
}

function neg(x: PyNum): PyNum {
  if (typeof x === "bigint") return -x;
  if (typeof x === "number") return -x;
  return x.neg();
}

// Main class
// ==========

export class Num2Word_IT extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    EUR: [["euro", "euro"], GENERIC_CENTS],
    USD: [GENERIC_DOLLARS, GENERIC_CENTS],
    GBP: [
      ["sterlina", "sterline"],
      ["penny", "penny"],
    ],
    CNY: [
      ["yuan", "yuan"],
      ["fen", "fen"],
    ],
  };
  static MINUS_PREFIX_WORD = "meno ";
  static FLOAT_INFIX_WORD = " virgola ";

  override setup(): void {
    // Upstream: `Num2Word_EU.setup(self)`. It is dead code there: __init__ is
    // `pass`, so setup() never runs (and would fail: no mid_numwords). The
    // base constructor here always calls setup(), so it does nothing.
  }

  constructor() {
    super();
    // Upstream's __init__ is `pass`: Num2Word_Base.__init__ never runs, so the
    // instance has none of the attributes it sets. The one a code path reads
    // is `negword` (to_currency of a negative amount).
    Object.defineProperty(this, "negword", {
      get(): never {
        throw new AttributeError("'Num2Word_IT' object has no attribute 'negword'");
      },
      configurable: true,
    });
  }

  floatToWords(floatNumber: number | Decimal, ordinal = false): string {
    let prefix: string;
    if (ordinal) {
      prefix = this.toOrdinal(int(floatNumber));
    } else {
      prefix = this.toCardinal(int(floatNumber));
    }
    const floatPart = at(str(floatNumber).split("."), 1);
    const postfix = [...floatPart]
      // Drops the trailing zero and comma
      .map((c) => this.toCardinal(int(c)))
      .join(" ");
    return prefix + Num2Word_IT.FLOAT_INFIX_WORD + postfix;
  }

  tensToCardinal(number: bigint): string {
    const tens = floordiv(number, 10n);
    const units = mod(number, 10n);
    let prefix: string;
    if (Object.hasOwn(STR_TENS, tens.toString())) {
      prefix = STR_TENS[tens.toString()] as string;
    } else {
      prefix = `${at(CARDINAL_WORDS, Number(tens)).slice(0, -1)}anta`;
    }
    const postfix = omittIfZero(at(CARDINAL_WORDS, Number(units)));
    return phoneticContraction(prefix + postfix);
  }

  hundredsToCardinal(number: bigint): string {
    const hundreds = floordiv(number, 100n);
    let prefix = "cento";
    if (hundreds !== 1n) {
      prefix = at(CARDINAL_WORDS, Number(hundreds)) + prefix;
    }
    const postfix = omittIfZero(this.toCardinal(mod(number, 100n)));
    return phoneticContraction(prefix + postfix);
  }

  thousandsToCardinal(number: bigint): string {
    const thousands = floordiv(number, 1000n);
    let prefix: string;
    if (thousands === 1n) {
      prefix = "mille";
    } else {
      prefix = `${this.toCardinal(thousands)}mila`;
    }
    const postfix = omittIfZero(this.toCardinal(mod(number, 1000n)));
    // "mille" and "mila" don't need any phonetic contractions
    return prefix + postfix;
  }

  bigNumberToCardinal(number: PyNum): string {
    const digits = [...str(number)];
    const length = digits.length;
    if (length >= 66) {
      throw new NotImplementedError("The given number is too large.");
    }
    // This is how many digits come before the "illion" term.
    //   cento miliardi => 3
    //   dieci milioni => 2
    //   un miliardo => 1
    const predigits = length % 3 || 3;
    const multiplier = digits.slice(0, predigits);
    const exponent = digits.slice(predigits);
    // Default infix string: "milione", "biliardo", "sestilione", ecc.
    let infix = exponentLengthToString(exponent.length);
    let prefix: string;
    if (multiplier.length === 1 && multiplier[0] === "1") {
      prefix = "un ";
    } else {
      prefix = this.toCardinal(int(multiplier.join("")));
      // Plural form      ~~~~~~~~~~~
      infix = ` ${infix.slice(0, -1)}i`;
    }
    // Read as: Does the value of exponent equal 0?
    const exponentSet = new Set(exponent);
    let postfix: string;
    if (!(exponentSet.size === 1 && exponentSet.has("0"))) {
      postfix = this.toCardinal(int(exponent.join("")));
      if (postfix.includes(" e ")) {
        infix += ", ";
      } else {
        infix += " e ";
      }
    } else {
      postfix = "";
    }
    return prefix + infix + postfix;
  }

  override toCardinal(number: PyNum): string {
    let string: string;
    if (cmp(number, 0n) < 0) {
      string = Num2Word_IT.MINUS_PREFIX_WORD + this.toCardinal(neg(number));
    } else if (typeof number === "number") {
      string = this.floatToWords(number);
    } else if (cmp(number, 20n) < 0) {
      string = at(CARDINAL_WORDS, Number(int(number)));
    } else if (cmp(number, 100n) < 0) {
      string = this.tensToCardinal(int(number));
    } else if (cmp(number, 1000n) < 0) {
      string = this.hundredsToCardinal(int(number));
    } else if (cmp(number, 1000000n) < 0) {
      string = this.thousandsToCardinal(int(number));
    } else {
      string = this.bigNumberToCardinal(number);
    }
    return accentuate(string);
  }

  override toOrdinal(number: PyNum): string {
    const tens = pyMod(number, 100n);
    // Italian grammar is poorly defined here ¯\_(ツ)_/¯:
    //   centodecimo VS centodieciesimo VS centesimo decimo?
    const isOutsideTeens = !(cmp(10n, tens) < 0 && cmp(tens, 20n) < 0);
    if (cmp(number, 0n) < 0) {
      return Num2Word_IT.MINUS_PREFIX_WORD + this.toOrdinal(neg(number));
    } else if (cmp(pyMod(number, 1n), 0n) !== 0) {
      return this.floatToWords(number as number | Decimal, true);
    } else if (cmp(number, 20n) < 0) {
      return at(ORDINAL_WORDS, Number(int(number)));
    } else if (isOutsideTeens && cmp(pyMod(tens, 10n), 3n) === 0) {
      // Gets rid of the accent
      return `${this.toCardinal(number).slice(0, -1)}eesimo`;
    } else if (isOutsideTeens && cmp(pyMod(tens, 10n), 6n) === 0) {
      return `${this.toCardinal(number)}esimo`;
    } else {
      let string = this.toCardinal(number).slice(0, -1);
      if (string.slice(-3) === "mil") {
        string += "l";
      }
      return `${string}esimo`;
    }
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    const currency = options.currency ?? "EUR";
    const cents = options.cents ?? true;
    const separator = options.separator ?? " e";
    const adjective = options.adjective ?? false;
    let result = super.toCurrency(val, { currency, cents, separator, adjective });
    // Handle exception. In italian language is "un euro",
    // "un dollaro" etc. (not "uno euro", "uno dollaro").
    // There is an exception, some currencies need "una":
    // e.g. "una sterlina"
    if (CURRENCIES_UNA.includes(currency)) {
      const listResult = result.split(" ");
      if (listResult[0] === "uno") {
        listResult[0] = listResult[0].replaceAll("uno", "una");
        result = listResult.join(" ");
      }
    }
    result = result.replaceAll("uno", "un");
    return result;
  }
}

// Utils
// =====

export function phoneticContraction(string: string): string {
  return string
    .replaceAll("oo", "o") // ex. "centootto"
    .replaceAll("ao", "o") // ex. "settantaotto"
    .replaceAll("io", "o") // ex. "ventiotto"
    .replaceAll("au", "u") // ex. "trentauno"
    .replaceAll("iu", "u"); // ex. "ventiunesimo"
}

export function exponentLengthToString(exponentLength: number): string {
  // We always assume `exponent` to be a multiple of 3. If it's not true, then
  // Num2Word_IT.big_number_to_cardinal did something wrong.
  const prefix = at(EXPONENT_PREFIXES, Math.floor(exponentLength / 6));
  if (exponentLength % 6 === 0) {
    return `${prefix}ilione`;
  }
  return `${prefix}iliardo`;
}

export function accentuate(string: string): string {
  // This is inefficient: it may do several rewritings when deleting
  // half-sentence accents. However, it is the easiest method and speed is
  // not crucial (duh), so...
  return string
    .split(/\s+/)
    .filter(Boolean)
    .map((w) =>
      // Deletes half-sentence accents and accentuates the last "tre"
      // We shouldn't accentuate a single "tre": is has to be a composite
      // word.                ~~~~~~~~~~
      w.slice(-3) === "tre" && [...w].length > 3
        ? `${w.replaceAll("tré", "tre").slice(0, -3)}tré`
        : // Deletes half-sentence accents anyway
          //     ~~~~~~~~~~~~~~~~~~~~~~
          w.replaceAll("tré", "tre"),
    )
    .join(" ");
}

export function omittIfZero(numberToString: string): string {
  return numberToString === ZERO ? "" : numberToString;
}
