// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_FR_BE.py

import type { WordPair } from "../base.ts";
import { at, mod } from "../py.ts";
import { Num2Word_FR } from "./FR.ts";

export class Num2Word_FR_BE extends Num2Word_FR {
  override setup(): void {
    super.setup();

    this.midNumwords = [
      [1000n, "mille"],
      [100n, "cent"],
      [90n, "nonante"],
      [80n, "quatre-vingt"],
      [70n, "septante"],
      [60n, "soixante"],
      [50n, "cinquante"],
      [40n, "quarante"],
      [30n, "trente"],
    ];
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    const [ctext, cnum] = curr;
    let [ntext, nnum] = next;

    if (cnum === 1n) {
      if (nnum < 1000000n) return next;
    }

    if (cnum < 1000n && nnum !== 1000n && at(ntext, -1) !== "s" && !mod(nnum, 100n)) {
      ntext += "s";
    }

    if (nnum < cnum && cnum < 100n) {
      if (mod(nnum, 10n) === 1n) return [`${ctext} et ${ntext}`, cnum + nnum];
      return [`${ctext}-${ntext}`, cnum + nnum];
    }
    if (nnum > cnum) return [`${ctext} ${ntext}`, cnum * nnum];
    return [`${ctext} ${ntext}`, cnum + nnum];
  }
}
