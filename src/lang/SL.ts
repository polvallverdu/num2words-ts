// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2015, Blaz Bregar. All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_SL.py

import type { CurrencyOptions as BaseCurrencyOptions, SplitnumOptions, WordPair } from "../base.ts";
import { Decimal, eq, floordiv, int, mod, type PyNum, str, zeroPad } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

export interface CurrencyOptions extends BaseCurrencyOptions {
  longval?: boolean;
  old?: boolean;
}

export interface YearOptions {
  longval?: boolean;
}

export class Num2Word_SL extends Num2Word_EU {
  static override GIGA_SUFFIX: string | null = "ilijard";
  static override MEGA_SUFFIX: string | null = "ilijon";

  declare ords: Record<string, string>;
  declare ordflag: boolean;

  override setup(): void {
    super.setup();

    this.negword = "minus ";
    this.pointword = "celih";
    this.errmsgNonnum = "Only numbers may be converted to words.";
    this.errmsgToobig = "Number is too large to convert to words (abs(%s) > %s).";
    this.excludeTitle = [];

    this.midNumwords = [
      [1000n, "tisoč"],
      [900n, "devetsto"],
      [800n, "osemsto"],
      [700n, "sedemsto"],
      [600n, "šeststo"],
      [500n, "petsto"],
      [400n, "štiristo"],
      [300n, "tristo"],
      [200n, "dvesto"],
      [100n, "sto"],
      [90n, "devetdeset"],
      [80n, "osemdeset"],
      [70n, "sedemdeset"],
      [60n, "šestdeset"],
      [50n, "petdeset"],
      [40n, "štirideset"],
      [30n, "trideset"],
    ];
    this.lowNumwords = [
      "dvajset",
      "devetnajst",
      "osemnajst",
      "sedemnajst",
      "šestnajst",
      "petnajst",
      "štirinajst",
      "trinajst",
      "dvanajst",
      "enajst",
      "deset",
      "devet",
      "osem",
      "sedem",
      "šest",
      "pet",
      "štiri",
      "tri",
      "dve",
      "ena",
      "nič",
    ];
    this.ords = {
      ena: "prv",
      dve: "drug",
      tri: "tretj",
      štiri: "četrt",
      sedem: "sedm",
      osem: "osm",
      sto: "stot",
      tisoč: "tisoč",
      milijon: "milijont",
    };
    this.ordflag = false;
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    let [ctext, cnum] = curr;
    let [ntext, nnum] = next;

    if (ctext.endsWith("dve") && this.ordflag && nnum <= 1000000n) {
      ctext = `${ctext.slice(0, ctext.length - 1)}a`;
    }

    if (ctext === "dve" && !this.ordflag && nnum < 1000000000n) {
      ctext = "dva";
    }

    if ((ctext.endsWith("tri") || ctext.endsWith("štiri")) && nnum === 1000000n && !this.ordflag) {
      if (ctext.endsWith("štiri")) {
        ctext = ctext.slice(0, -1);
      }
      ctext = `${ctext}je`;
    }

    if (cnum >= 20n && cnum < 100n && nnum === 2n) {
      ntext = "dva";
    }

    if (ctext.endsWith("ena") && nnum >= 1000n) {
      ctext = ctext.slice(0, -1);
    }

    if (cnum === 1n) {
      if (nnum < 10n ** 6n || this.ordflag) {
        return next;
      }
      ctext = "";
    }

    let val: bigint;
    if (nnum > cnum) {
      if (nnum >= 10n ** 6n) {
        if (this.ordflag) {
          ntext += "t";
        } else if (cnum === 2n) {
          if (ntext.endsWith("d")) {
            ntext += "i";
          } else {
            ntext += "a";
          }
        } else if (2n < cnum && cnum < 5n) {
          if (ntext.endsWith("d")) {
            ntext += "e";
          } else if (!ntext.endsWith("d")) {
            ntext += "i";
          }
        } else if (ctext.endsWith("en")) {
          if (ntext.endsWith("d") || ntext.endsWith("n")) {
            ntext += "";
          }
        } else if (ctext.endsWith("dve") && ntext.endsWith("n")) {
          ctext = `${ctext.slice(0, -1)}a`;
          ntext += "a";
        } else if (ctext.endsWith("je") && ntext.endsWith("n")) {
          ntext += "i";
        } else {
          if (ntext.endsWith("d")) {
            ntext += "a";
          } else if (ntext.endsWith("n")) {
            ntext += "";
            // Upstream has a further unreachable `elif ntext.endswith("d"): ntext += "e"`.
          } else {
            ntext += "ov";
          }
        }
      }

      if (nnum >= 10n ** 2n && this.ordflag === false && ctext) {
        ctext += " ";
      }

      val = cnum * nnum;
    } else {
      if (nnum < 10n && 10n < cnum && cnum < 100n) {
        [ntext, ctext] = [ctext, `${ntext}in`];
      } else if (cnum >= 10n ** 2n && this.ordflag === false) {
        ctext += " ";
      }
      val = cnum + nnum;
    }

    const word = ctext + ntext;
    return [word, val];
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    // DIVERGENCE: restored in `finally`; upstream leaves it set when the call raises, which corrupts
    // later calls on this shared converter. Output of successful calls is unchanged.
    this.ordflag = true;
    let outword: string;
    try {
      outword = this.toCardinal(value);
    } finally {
      this.ordflag = false;
    }
    for (const key of Object.keys(this.ords)) {
      if (outword.endsWith(key)) {
        outword = outword.slice(0, outword.length - key.length) + (this.ords[key] as string);
        break;
      }
    }
    return `${outword}i`;
  }

  // Is this correct??
  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)}.`;
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    for (const key of Object.keys(options)) {
      if (key !== "longval" && key !== "old") {
        throw new TypeError(`to_currency() got an unexpected keyword argument '${key}'`);
      }
    }
    const longval = options.longval ?? true;
    const old = options.old ?? false;
    if (old) {
      return this.toSplitnum(val as PyNum, {
        hightxt: "evro/a/v",
        lowtxt: "stotin/a/i/ov",
        jointxt: "in",
        longval,
      });
    }
    // Upstream calls super().to_currency(val, jointxt="in", longval=longval),
    // which the base method does not accept.
    throw new TypeError("to_currency() got an unexpected keyword argument 'jointxt'");
  }

  // Upstream's base to_splitnum runs `divmod(val, divisor)` on a Decimal
  // (to_year, to_currency(old=True), and every string input), which keeps
  // Decimals: the quotient truncates toward zero and the remainder keeps the
  // sign and the fraction of the dividend. The shared TS base converts a
  // Decimal to an int first, so it is handled here.
  override toSplitnum(val: PyNum | [bigint, bigint], options: SplitnumOptions = {}): string {
    if (!(val instanceof Decimal)) return super.toSplitnum(val, options);
    let hightxt = options.hightxt ?? "";
    const lowtxt = options.lowtxt ?? "";
    const jointxt = options.jointxt ?? "";
    const divisor = options.divisor ?? 100n;
    const longval = options.longval ?? true;
    const cents = options.cents ?? true;
    const out: string[] = [];
    const inflect = (value: Decimal, text: string): string => {
      const parts = text.split("/");
      return eq(value, 1n) ? (parts[0] as string) : parts.join("");
    };

    const [high, low] = val.divmod(divisor);

    if (!high.isZero()) {
      hightxt = this.title(inflect(high, hightxt));
      out.push(this.toCardinal(high));
      if (!low.isZero()) {
        if (longval) {
          if (hightxt) out.push(hightxt);
          if (jointxt) out.push(this.title(jointxt));
        }
      } else if (hightxt) {
        out.push(hightxt);
      }
    }

    if (!low.isZero()) {
      if (cents) {
        out.push(this.toCardinal(low));
      } else {
        out.push(zeroPad(int(low), 2));
      }
      if (lowtxt && longval) {
        out.push(this.title(inflect(low, lowtxt)));
      }
    }

    return out.join(" ");
  }

  override toYear(val: PyNum, options: YearOptions = {}): string {
    const longval = options.longval ?? true;
    // not (val // 100) % 10
    let rem: PyNum;
    if (typeof val === "number") {
      const q = Math.floor(val / 100);
      rem = q - 10 * Math.floor(q / 10);
    } else if (val instanceof Decimal) {
      // Decimal // and % truncate toward zero; only the truth value matters.
      rem = (int(val) / 100n) % 10n;
    } else {
      rem = mod(floordiv(val, 100n), 10n);
    }
    if (rem === 0 || rem === 0n) {
      return this.toCardinal(val);
    }
    return this.toSplitnum(val, { hightxt: "hundert", longval });
  }
}
