// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_PT_BR.py

import { type CurrencyOptions, Num2Word_Base, type WordPair } from "../base.ts";
import {
  Decimal,
  float,
  getItem,
  int,
  OverflowError,
  type PyNum,
  ROUND_HALF_EVEN,
  ValueError,
} from "../py.ts";
import { checkKwargs, Num2Word_PT, W } from "./PT.ts";

export interface PtBrCurrencyOptions {
  longval?: boolean;
}

/** Python's `'%.2f' % val`. */
function formatFixed2(val: PyNum | string): string {
  if (typeof val === "string") {
    throw new TypeError("must be real number, not str");
  }
  if (typeof val === "bigint" && !Number.isFinite(Number(val))) {
    throw new OverflowError("int too large to convert to float");
  }
  const f = float(val);
  if (Number.isNaN(f)) return "nan";
  if (!Number.isFinite(f)) return f > 0 ? "inf" : "-inf";
  return new Decimal(f).quantize("0.01", ROUND_HALF_EVEN).toString();
}

export class Num2Word_PT_BR extends Num2Word_PT {
  override setHighNumwords(high: string[]): void {
    const max = 3 + 3 * high.length;
    let n = max;
    for (const word of high) {
      if (n <= 3) break;
      this.cards.set(10n ** BigInt(n), `${word}ilhão`);
      n -= 3;
    }
  }

  override setup(): void {
    super.setup();

    const low = this.lowNumwords as string[];
    low[1] = "dezenove";
    low[3] = "dezessete";
    low[4] = "dezesseis";

    this.thousandSeparators = {
      3: "milésimo",
      6: "milionésimo",
      9: "bilionésimo",
      12: "trilionésimo",
      15: "quadrilionésimo",
    };
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    let [ctext, cnum] = curr;
    let [ntext, nnum] = next;

    if (cnum === 1n) {
      if (nnum < 1000000n) return next;
      ctext = "um";
    } else if (cnum === 100n && nnum % 1000n !== 0n) {
      ctext = "cento";
    }

    if (nnum < cnum) {
      if (cnum < 100n) return [`${ctext} e ${ntext}`, cnum + nnum];
      return [`${ctext} e ${ntext}`, cnum + nnum];
    } else if (!(nnum % 1000000n) && cnum > 1n) {
      ntext = `${ntext.slice(0, -4)}lhões`;
    }

    if (nnum === 100n) {
      ctext = getItem(this.hundreds, cnum.toString());
      ntext = "";
    } else {
      ntext = ` ${ntext}`;
    }

    return [ctext + ntext, cnum * nnum];
  }

  override toCardinal(value: PyNum, options?: object): string {
    checkKwargs("to_cardinal", options);
    let result = Num2Word_Base.prototype.toCardinal.call(this, value);

    // Transforms "mil E cento e catorze reais" into "mil, cento e catorze
    // reais"
    for (const ext of [
      "mil",
      "milhão",
      "milhões",
      "bilhão",
      "bilhões",
      "trilhão",
      "trilhões",
      "quatrilhão",
      "quatrilhões",
    ]) {
      if (new RegExp(`^.*${ext} e ${W}*entos? (?=.*e)`, "u").test(result)) {
        result = result.replace(`${ext} e`, `${ext},`);
      }
    }

    return result;
  }

  override toCurrency(
    val: PyNum | string,
    options: PtBrCurrencyOptions & CurrencyOptions = {},
  ): string {
    // upstream's signature is to_currency(self, val, longval=True): any other
    // keyword argument is a TypeError
    for (const key of Object.keys(options)) {
      if (key !== "longval") {
        throw new TypeError(`to_currency() got an unexpected keyword argument '${key}'`);
      }
    }
    const parts = formatFixed2(val).split(".");
    if (parts.length !== 2) {
      throw new ValueError(
        parts.length < 2
          ? `not enough values to unpack (expected 2, got ${parts.length})`
          : "too many values to unpack (expected 2)",
      );
    }
    const [integerPart, decimalPart] = parts as [string, string];

    let result = this.toCardinal(int(integerPart));

    let appendedCurrency = false;
    for (const ext of [
      "milhão",
      "milhões",
      "bilhão",
      "bilhões",
      "trilhão",
      "trilhões",
      "quatrilhão",
      "quatrilhões",
    ]) {
      if (result.endsWith(ext)) {
        result += " de reais";
        appendedCurrency = true;
      }
    }

    if (["um", "menos um"].includes(result)) {
      result += " real";
      appendedCurrency = true;
    }
    if (!appendedCurrency) result += " reais";

    if (int(decimalPart)) {
      const cents = this.toCardinal(int(decimalPart));
      result += ` e ${cents}`;

      if (cents === "um") {
        result += " centavo";
      } else {
        result += " centavos";
      }
    }

    return result;
  }
}
