// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/utils.py

import { zeroPad } from "./py.ts";

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
