// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_EN_IN.py

import { Num2Word_EN } from "./EN.ts";

export class Num2Word_EN_IN extends Num2Word_EN {
  override setHighNumwords(_high: string[]): void {
    this.cards.set(10n ** 7n, "crore");
    this.cards.set(10n ** 5n, "lakh");
  }
}
