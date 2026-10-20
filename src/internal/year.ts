// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// The `to_year` century test shared by several converters. Not part of the public API.

import { type Decimal, floordiv, mod, type PyNum } from "../py.ts";

/** Options of `toYear` for the converters whose `to_year` takes only `longval`. */
export interface YearOptions {
  longval?: boolean;
}

/**
 * Python `not (val // 100) % 10` for an int, float or Decimal, with a float's quotient and
 * remainder computed in float arithmetic (so floats beyond 2**53 can differ from the exact
 * result). Used by DE and NL.
 */
export function centuryDigitIsZeroFloatMod(val: PyNum): boolean {
  if (typeof val === "bigint") return mod(floordiv(val, 100n), 10n) === 0n;
  if (typeof val === "number") {
    // float // and % floor; NaN is truthy, so it is not zero.
    const q = Math.floor(val / 100);
    const r = q - 10 * Math.floor(q / 10);
    return r === 0;
  }
  // Decimal // and % truncate toward zero.
  const [q] = (val as Decimal).divmod(100n);
  return q.toBigInt() % 10n === 0n;
}

/**
 * Python `(val // 100) % 10 == 0` for an int, float or Decimal, with a finite float's floored
 * quotient converted to a bigint and its remainder taken exactly. Used by AM and NO.
 */
export function centuryDigitIsZeroExactMod(val: PyNum): boolean {
  let q: bigint;
  if (typeof val === "bigint") {
    q = floordiv(val, 100n);
  } else if (typeof val === "number") {
    // nan // 100 is nan, and nan % 10 is truthy.
    if (!Number.isFinite(val)) return false;
    q = BigInt(Math.floor(val / 100));
  } else {
    // Decimal // truncates toward zero; only divisibility by ten matters here.
    q = val.toBigInt() / 100n;
  }
  return mod(q, 10n) === 0n;
}
