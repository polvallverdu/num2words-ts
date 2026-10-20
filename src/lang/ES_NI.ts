// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_ES_NI.py

import { type CurrencyForms, type CurrencyOptions, Num2Word_Base } from "../base.ts";
import type { PyNum } from "../py.ts";
import { checkKwargs, Num2Word_ES } from "./ES.ts";

export class Num2Word_ES_NI extends Num2Word_ES {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    NIO: [
      ["córdoba", "córdobas"],
      ["centavo", "centavos"],
    ],
  };

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    checkKwargs(options, ["currency", "cents", "separator", "adjective"], "to_currency");
    const currency = options.currency ?? "NIO";
    const cents = options.cents ?? true;
    const separator = options.separator ?? " con";
    const adjective = options.adjective ?? false;
    // super(Num2Word_ES, self).to_currency: skips Num2Word_ES's override.
    const result = Num2Word_Base.prototype.toCurrency.call(this, val, {
      currency,
      cents,
      separator,
      adjective,
    });
    return result.replaceAll("uno", "un");
  }
}
