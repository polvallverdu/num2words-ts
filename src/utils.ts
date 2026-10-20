// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/utils.py

import { int, zeroPad } from "./py.ts";

/** Split the digit string `n` into groups of `x`, the first group taking the remainder. */
export function splitbyx(n: string, x: number, formatInt: false): Generator<string>;
export function splitbyx(n: string, x: number, formatInt?: true): Generator<bigint>;
export function* splitbyx(n: string, x: number, formatInt = true): Generator<bigint | string> {
  const length = n.length;
  if (length > x) {
    const start = length % x;
    if (start > 0) {
      const result = n.slice(0, start);
      yield formatInt ? BigInt(result) : result;
    }
    for (let i = start; i < length; i += x) {
      const result = n.slice(i, i + x);
      yield formatInt ? BigInt(result) : result;
    }
  } else {
    yield formatInt ? BigInt(n) : n;
  }
}

/** The last three digits of `n`, least significant first. */
export function getDigits(n: bigint): number[] {
  return zeroPad(n, 3).slice(-3).split("").reverse().map(Number);
}

//
// Strict variants: the same helpers parsing each group/digit with Python's `int()` (src/py.ts),
// as upstream does, so non-digit input (a "-" sign, "5.0", "1e+16") raises ValueError like
// Python instead of a JavaScript SyntaxError or NaN.
//

/** `splitbyx(n, x)` with Python `int()` on each group, yielded lazily (a generator, like upstream). */
export function* splitbyxStrictGen(n: string, x: number): Generator<bigint> {
  const length = n.length;
  if (length > x) {
    const start = length % x;
    if (start > 0) {
      yield int(n.slice(0, start));
    }
    for (let i = start; i < length; i += x) {
      yield int(n.slice(i, i + x));
    }
  } else {
    yield int(n);
  }
}

/** `list(splitbyx(n, x))` with Python `int()` on each group, returned eagerly as an array. */
export function splitbyxStrictList(n: string, x: number): bigint[] {
  const out: bigint[] = [];
  const length = n.length;
  if (length > x) {
    const start = length % x;
    if (start > 0) out.push(int(n.slice(0, start)));
    for (let i = start; i < length; i += x) out.push(int(n.slice(i, i + x)));
  } else {
    out.push(int(n));
  }
  return out;
}

/** `get_digits(n)` with Python `int()` on each digit (negative `n` raises ValueError), as numbers. */
export function getDigitsStrictNumbers(n: bigint): [number, number, number] {
  return zeroPad(n, 3)
    .slice(-3)
    .split("")
    .reverse()
    .map((c) => Number(int(c))) as [number, number, number];
}

/** `get_digits(n)` with Python `int()` on each digit (negative `n` raises ValueError), as bigints. */
export function getDigitsStrictBigints(n: bigint): [bigint, bigint, bigint] {
  return zeroPad(n, 3)
    .slice(-3)
    .split("")
    .reverse()
    .map((c) => int(c)) as [bigint, bigint, bigint];
}
