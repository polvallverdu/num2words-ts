// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_EN_NG.py

import type { CurrencyForms } from "../base.ts";
import { checkKwargs } from "../internal/kwargs.ts";
import type { PyNum } from "../py.ts";
import { Num2Word_EN } from "./EN.ts";

/** Options of `Num2Word_EN_NG.toCurrency` (`kobo` instead of `cents`). */
export interface CurrencyOptions_EN_NG {
  currency?: string;
  kobo?: boolean;
  separator?: string;
  adjective?: boolean;
}

export class Num2Word_EN_NG extends Num2Word_EN {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    NGN: [
      ["naira", "naira"],
      ["kobo", "kobo"],
    ],
  };

  static override CURRENCY_ADJECTIVES: Record<string, string> = { NGN: "Nigerian" };

  override toCurrency(val: PyNum | string, options: CurrencyOptions_EN_NG = {}): string {
    checkKwargs(options, ["currency", "kobo", "separator", "adjective"], "to_currency");
    const currency = options.currency ?? "NGN";
    const kobo = options.kobo ?? true;
    const separator = options.separator ?? ",";
    const adjective = options.adjective ?? false;
    const result = super.toCurrency(val, { currency, cents: kobo, separator, adjective });
    return result;
  }
}
