// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/currency.py

import { Decimal, divmod, type PyNum, ROUND_HALF_UP } from "./py.ts";

/**
 * Split a currency value into whole units, cents and sign.
 *
 * An int is taken to be in cents (when `isIntWithCents`); any other number
 * is rounded half-up to two decimals.
 */
export function parseCurrencyParts(
  value: PyNum | string,
  isIntWithCents = true,
): [bigint, bigint, boolean] {
  let integer: bigint;
  let cents: bigint;
  let negative: boolean;
  if (typeof value === "bigint") {
    if (isIntWithCents) {
      // assume cents if value is integer
      negative = value < 0n;
      const v = negative ? -value : value;
      [integer, cents] = divmod(v, 100n);
    } else {
      negative = value < 0n;
      integer = negative ? -value : value;
      cents = 0n;
    }
  } else {
    let d = new Decimal(value);
    d = d.quantize(new Decimal(".01"), ROUND_HALF_UP);
    negative = d.compare(0n) < 0;
    d = d.abs();
    const [whole, fraction] = d.divmod(1n);
    integer = whole.toBigInt();
    cents = fraction.mul(100n).toBigInt();
  }
  return [integer, cents, negative];
}

/** Prefix every form of a currency name. */
export function prefixCurrency(prefix: string, base: readonly string[]): string[] {
  return base.map((i) => `${prefix} ${i}`);
}
