// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/__init__.py

import type { Num2Word_Base } from "./base.ts";
import { CONVERTER_CLASSES } from "./languages.ts";
import { type Decimal, NotImplementedError, type PyNum } from "./py.ts";

export { Num2Word_Base } from "./base.ts";
export { CONVERTER_CLASSES } from "./languages.ts";
export {
  AttributeError,
  Decimal,
  IndexError,
  KeyError,
  NotImplementedError,
  OverflowError,
  ValueError,
  ZeroDivisionError,
} from "./py.ts";

export const CONVERTES_TYPES = ["cardinal", "ordinal", "ordinal_num", "year", "currency"] as const;
export type ConversionType = (typeof CONVERTES_TYPES)[number];

/**
 * A number to treat as a Python float even if it has no fractional part.
 * JavaScript cannot tell `100` from `100.0`, and num2words can: `to: "currency"`
 * reads an int as cents. `num2words(asFloat(100), { to: "currency" })` matches
 * Python's `num2words(100.0, to="currency")`.
 */
export class Float {
  readonly value: number;
  constructor(value: number) {
    this.value = value;
  }
}

/** Mark a number as a float. See `Float`. */
export function asFloat(value: number): Float {
  return new Float(value);
}

/** Numbers num2words accepts. */
export type Num2WordsInput = number | bigint | string | Decimal | Float;

export interface Num2WordsOptions {
  /** Shorthand for `to: "ordinal"`. */
  ordinal?: boolean;
  /** Language code, e.g. "en", "fr", "pt_BR". Unknown regional codes fall back to their first two letters. */
  lang?: string;
  /** What to convert to. */
  to?: ConversionType;
  /** Converter-specific options (currency, gender, case, ...), camelCase. */
  [option: string]: unknown;
}

/**
 * Convert a JavaScript number to the Python type upstream would see: integers
 * become ints (bigint), other numbers floats.
 */
function toPyNum(number: Exclude<Num2WordsInput, string>): PyNum {
  if (number instanceof Float) return number.value;
  if (typeof number === "number" && Number.isInteger(number)) return BigInt(number);
  return number as PyNum;
}

function methodName(to: string): string {
  return `to${to.replace(/(^|_)([a-z])/g, (_, __, c: string) => c.toUpperCase())}`;
}

/**
 * Convert a number to words.
 *
 * @example
 * num2words(42); // "forty-two"
 * num2words(42, { to: "ordinal" }); // "forty-second"
 * num2words(1999, { to: "year" }); // "nineteen ninety-nine"
 * num2words(asFloat(10), { to: "currency", currency: "USD" }); // "ten dollars, zero cents"
 */
export function num2words(number: Num2WordsInput, options: Num2WordsOptions = {}): string {
  const { ordinal = false, to: toOption = "cardinal", ...kwargs } = options;
  let lang = options.lang ?? "en";
  delete (kwargs as Record<string, unknown>).lang;
  let to: string = toOption;

  // We try the full language first
  if (!(lang in CONVERTER_CLASSES)) {
    // ... and then try only the first 2 letters
    lang = lang.slice(0, 2);
  }
  if (!(lang in CONVERTER_CLASSES)) {
    throw new NotImplementedError();
  }
  const converter = CONVERTER_CLASSES[lang] as Num2Word_Base;

  const value: PyNum = typeof number === "string" ? converter.strToNumber(number) : toPyNum(number);

  // backwards compatible
  if (ordinal) to = "ordinal";

  if (!(CONVERTES_TYPES as readonly string[]).includes(to)) {
    throw new NotImplementedError();
  }

  const method = (converter as unknown as Record<string, (v: PyNum, o: object) => unknown>)[
    methodName(to)
  ];
  return String((method as (v: PyNum, o: object) => unknown).call(converter, value, kwargs));
}

export default num2words;
