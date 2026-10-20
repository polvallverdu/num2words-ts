// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_ES_CO.py

import type { CurrencyOptions } from "../base.ts";
import type { PyNum } from "../py.ts";
import { checkKwargs, Num2Word_ES } from "./ES.ts";

export interface CurrencyOptions_ES_CO extends CurrencyOptions {
  longval?: boolean;
  old?: boolean;
}

export class Num2Word_ES_CO extends Num2Word_ES {
  override toCurrency(val: PyNum | string, options: CurrencyOptions_ES_CO = {}): string {
    checkKwargs(options, ["longval", "old"], "to_currency");
    const longval = options.longval ?? true;
    const result = this.toSplitnum(val as PyNum, {
      hightxt: "peso/s",
      lowtxt: "centavo/s",
      divisor: 1n,
      jointxt: "y",
      longval,
    });
    // Handle exception, in spanish is "un euro" and not "uno euro"
    return result.replaceAll("uno", "un");
  }
}
