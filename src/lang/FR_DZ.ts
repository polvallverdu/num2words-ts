// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_FR_DZ.py

import { type CurrencyForms, type CurrencyOptions, Num2Word_Base } from "../base.ts";
import type { PyNum } from "../py.ts";
import { Num2Word_FR } from "./FR.ts";

export class Num2Word_FR_DZ extends Num2Word_FR {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    DIN: [
      ["dinard", "dinards"],
      ["centime", "centimes"],
    ],
  };

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    // super(Num2Word_FR, self).to_currency: skips Num2Word_FR's override.
    const result = Num2Word_Base.prototype.toCurrency.call(this, val, {
      currency: options.currency ?? "DIN",
      cents: options.cents ?? true,
      separator: options.separator ?? " et",
      adjective: options.adjective ?? false,
    });
    return result;
  }
}
