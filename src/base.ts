// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/base.py

import { toS } from "./compat.ts";
import { parseCurrencyParts, prefixCurrency } from "./currency.ts";
import {
  abs,
  Decimal,
  divmod,
  eq,
  float,
  floatRepr,
  int,
  NotImplementedError,
  OverflowError,
  type PyNum,
  round,
  str,
  zeroPad,
} from "./py.ts";

/** A currency's names: singular, plural and any further plural forms. */
export type CurrencyForm = readonly string[];
/** Main unit and fractional unit names of a currency. */
export type CurrencyForms = readonly [CurrencyForm, CurrencyForm];

/** A word with the number it stands for, as `splitnum` and `merge` pass them. */
export type WordPair = [string, bigint];
/** The nested structure `splitnum` builds and `clean` reduces. */
export type Split = WordPair | Split[];

/** Options of `toCurrency`. */
export interface CurrencyOptions {
  /** Currency code. */
  currency?: string;
  /** Verbose cents (false prints them as two digits). */
  cents?: boolean;
  /** Cent separator. */
  separator?: string;
  /** Prefix the currency name with its adjective. */
  adjective?: boolean;
}

/** Options of `toSplitnum`. */
export interface SplitnumOptions {
  hightxt?: string;
  lowtxt?: string;
  jointxt?: string;
  divisor?: bigint;
  longval?: boolean;
  cents?: boolean;
}

function isPair(x: Split): x is WordPair {
  return x.length === 2 && typeof x[0] === "string" && typeof x[1] === "bigint";
}

/**
 * Base class of every language converter.
 *
 * Porting notes (see CONVENTIONS.md):
 * - Upstream sets most fields in `setup()`, which this constructor calls. A
 *   subclass must declare such fields with `declare` (no runtime field), or
 *   JavaScript class-field semantics would reset them after `setup()` ran.
 * - Python class attributes (`CURRENCY_FORMS`, ...) are `static`, read through
 *   `this.cls` so subclasses override them like in Python.
 * - Integers are bigints; a `number` is always a Python float.
 */
export class Num2Word_Base {
  static CURRENCY_FORMS: Record<string, CurrencyForms> = {};
  static CURRENCY_ADJECTIVES: Record<string, string> = {};

  declare isTitle: boolean;
  declare precision: number;
  declare excludeTitle: string[];
  declare negword: string;
  declare pointword: string;
  declare errmsgNonnum: string;
  declare errmsgFloatord: string;
  declare errmsgNegord: string;
  declare errmsgToobig: string;
  declare cards: Map<bigint, string>;
  declare MAXVAL: bigint;
  declare highNumwords?: string[];
  declare midNumwords?: [bigint, string][];
  declare lowNumwords?: string[];

  constructor() {
    this.isTitle = false;
    this.precision = 2;
    this.excludeTitle = [];
    this.negword = "(-) ";
    this.pointword = "(.)";
    this.errmsgNonnum = "type(%s) not in [long, int, float]";
    this.errmsgFloatord = "Cannot treat float %s as ordinal.";
    this.errmsgNegord = "Cannot treat negative num %s as ordinal.";
    this.errmsgToobig = "abs(%s) must be less than %s.";

    this.setup();

    // uses cards
    if (
      this.highNumwords !== undefined ||
      this.midNumwords !== undefined ||
      this.lowNumwords !== undefined
    ) {
      this.cards = new Map();
      this.setNumwords();
      this.MAXVAL = 1000n * (this.cards.keys().next().value as bigint);
    }
  }

  /** The class of this converter, for Python class attributes (`self.X`). */
  get cls(): typeof Num2Word_Base {
    return this.constructor as typeof Num2Word_Base;
  }

  setNumwords(): void {
    this.setHighNumwords(this.highNumwords as string[]);
    this.setMidNumwords(this.midNumwords as [bigint, string][]);
    this.setLowNumwords(this.lowNumwords as string[]);
  }

  setHighNumwords(..._args: unknown[]): void {
    throw new NotImplementedError();
  }

  setMidNumwords(mid: [bigint, string][]): void {
    for (const [key, val] of mid) {
      this.cards.set(key, val);
    }
  }

  setLowNumwords(numwords: string[]): void {
    for (let i = 0; i < numwords.length; i++) {
      this.cards.set(BigInt(numwords.length - 1 - i), numwords[i] as string);
    }
  }

  splitnum(value: bigint): Split {
    for (const elem of this.cards.keys()) {
      if (elem > value) continue;

      const out: Split[] = [];
      let div: bigint;
      let mod: bigint;
      if (value === 0n) {
        [div, mod] = [1n, 0n];
      } else {
        [div, mod] = divmod(value, elem);
      }

      if (div === 1n) {
        out.push([this.cards.get(1n) as string, 1n]);
      } else {
        if (div === value) {
          // The system tallies, eg Roman Numerals
          return [[(this.cards.get(elem) as string).repeat(Number(div)), div * elem]];
        }
        out.push(this.splitnum(div));
      }

      out.push([this.cards.get(elem) as string, elem]);

      if (mod) {
        out.push(this.splitnum(mod));
      }

      return out;
    }
    // Python falls off the loop and returns None.
    return undefined as unknown as Split;
  }

  /** Detach minus and return it as symbol with new numStr. */
  parseMinus(numStr: string): [string, string] {
    if (numStr.startsWith("-")) {
      // Extra spacing to compensate if there is no minus.
      return [`${this.negword.trim()} `, numStr.slice(1)];
    }
    return ["", numStr];
  }

  strToNumber(value: string): PyNum {
    return new Decimal(value);
  }

  toCardinal(value: PyNum, ..._rest: unknown[]): string {
    // try: assert int(value) == value
    // except (ValueError, TypeError, AssertionError): return self.to_cardinal_float(value)
    let integral: boolean;
    try {
      integral = eq(int(value), value);
    } catch (e) {
      // int(inf) raises OverflowError, which upstream does not catch.
      if (e instanceof OverflowError) throw e;
      integral = false;
    }
    if (!integral) return this.toCardinalFloat(value);

    let v = int(value);
    let out = "";
    if (v < 0n) {
      v = -v;
      out = `${this.negword.trim()} `;
    }

    if (v >= this.MAXVAL) {
      throw new OverflowError(
        this.errmsgToobig.replace("%s", str(abs(value))).replace("%s", str(this.MAXVAL)),
      );
    }

    const val = this.splitnum(v);
    const [words] = this.clean(val);
    return this.title(out + words);
  }

  float2tuple(value: number): [bigint, bigint] {
    const pre = int(value);

    // Simple way of finding decimal places to update the precision
    this.precision = Math.abs(new Decimal(floatRepr(value)).asTuple().exponent);

    let post = Math.abs(value - Number(pre)) * 10 ** this.precision;
    let postInt: bigint;
    if (Math.abs(Number(round(post)) - post) < 0.01) {
      // We generally floor all values beyond our precision (rather than
      // rounding), but in cases where we have something like 1.239999999,
      // which is probably due to python's handling of floats, we actually
      // want to consider it as 1.24 instead of 1.23
      postInt = round(post);
    } else {
      post = Math.floor(post);
      postInt = BigInt(post);
    }

    return [pre, postInt];
  }

  toCardinalFloat(value: PyNum | string, ..._rest: unknown[]): string {
    let f: number;
    try {
      f = float(value as PyNum);
    } catch {
      throw new TypeError(this.errmsgNonnum.replace("%s", str(value)));
    }

    const [pre, postInt] = this.float2tuple(f);

    let post = postInt.toString();
    post = "0".repeat(Math.max(0, this.precision - post.length)) + post;

    const out = [this.toCardinal(pre)];
    if (this.precision) {
      out.push(this.title(this.pointword));
    }

    for (let i = 0; i < this.precision; i++) {
      const curr = BigInt(post[i] as string);
      out.push(toS(this.toCardinal(curr)));
    }

    return out.join(" ");
  }

  merge(_curr: WordPair, _next: WordPair): WordPair {
    throw new NotImplementedError();
  }

  clean(val: Split): WordPair {
    let out: Split = val;
    let v: Split[] = val as Split[];
    while (v.length !== 1) {
      const next: Split[] = [];
      const [left, right] = v as [Split, Split];
      if (isPair(left) && isPair(right)) {
        next.push(this.merge(left, right));
        if (v.length > 2) {
          next.push(v.slice(2) as Split);
        }
      } else {
        for (const elem of v) {
          if (!isPair(elem)) {
            if (elem.length === 1) {
              next.push(elem[0] as Split);
            } else {
              next.push(this.clean(elem));
            }
          } else {
            next.push(elem);
          }
        }
      }
      v = next;
      out = next;
    }
    return (out as Split[])[0] as WordPair;
  }

  title(value: string): string {
    if (this.isTitle) {
      const out: string[] = [];
      for (const word of value.split(/\s+/).filter(Boolean)) {
        if (this.excludeTitle.includes(word)) {
          out.push(word);
        } else {
          const [first = "", ...rest] = [...word];
          out.push(first.toUpperCase() + rest.join(""));
        }
      }
      value = out.join(" ");
    }
    return value;
  }

  verifyOrdinal(value: PyNum): void {
    if (!eq(value, int(value))) {
      throw new TypeError(this.errmsgFloatord.replace("%s", str(value)));
    }
    if (!eq(abs(value), value)) {
      throw new TypeError(this.errmsgNegord.replace("%s", str(value)));
    }
  }

  toOrdinal(value: PyNum, ..._rest: unknown[]): string {
    return this.toCardinal(value);
  }

  toOrdinalNum(value: PyNum, ..._rest: unknown[]): string | PyNum {
    return value;
  }

  // Trivial version
  inflect(value: PyNum, text: string): string {
    const parts = text.split("/");
    if (eq(value, 1n)) return parts[0] as string;
    return parts.join("");
  }

  // //CHECK: generalise? Any others like pounds/shillings/pence?
  toSplitnum(val: PyNum | [bigint, bigint], options: SplitnumOptions = {}): string {
    let hightxt = options.hightxt ?? "";
    const lowtxt = options.lowtxt ?? "";
    const jointxt = options.jointxt ?? "";
    const divisor = options.divisor ?? 100n;
    const longval = options.longval ?? true;
    const cents = options.cents ?? true;
    const out: string[] = [];

    // Python keeps the operand's type through divmod: a Decimal with a
    // fraction keeps it in `low` (e.g. Decimal("150.5") with divisor 1).
    let high: PyNum;
    let low: PyNum;
    if (typeof val === "number") {
      [high, low] = this.float2tuple(val);
    } else if (Array.isArray(val)) {
      [high, low] = val;
    } else if (val instanceof Decimal) {
      [high, low] = val.divmod(divisor);
    } else {
      [high, low] = divmod(val, divisor);
    }
    const truthy = (x: PyNum) => !eq(x, 0n);

    if (truthy(high)) {
      hightxt = this.title(this.inflect(high, hightxt));
      out.push(this.toCardinal(high));
      if (truthy(low)) {
        if (longval) {
          if (hightxt) out.push(hightxt);
          if (jointxt) out.push(this.title(jointxt));
        }
      } else if (hightxt) {
        out.push(hightxt);
      }
    }

    if (truthy(low)) {
      if (cents) {
        out.push(this.toCardinal(low));
      } else {
        out.push(zeroPad(int(low), 2));
      }
      if (lowtxt && longval) {
        out.push(this.title(this.inflect(low, lowtxt)));
      }
    }

    return out.join(" ");
  }

  toYear(value: PyNum, ..._rest: unknown[]): string {
    return this.toCardinal(value);
  }

  /**
   * Should resolve gettext form:
   * http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html
   */
  pluralize(_n: bigint, _forms: CurrencyForm): string {
    throw new NotImplementedError();
  }

  protected _moneyVerbose(number: bigint, _currency: string): string {
    return this.toCardinal(number);
  }

  protected _centsVerbose(number: bigint, _currency: string): string {
    return this.toCardinal(number);
  }

  protected _centsTerse(number: bigint, _currency: string): string {
    return zeroPad(number, 2);
  }

  /**
   * @param val Numeric value
   * @returns Formatted string
   */
  toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    const currency = options.currency ?? "EUR";
    const cents = options.cents ?? true;
    const separator = options.separator ?? ",";
    const adjective = options.adjective ?? false;
    const [left, right, isNegative] = parseCurrencyParts(val);

    const forms = this.cls.CURRENCY_FORMS[currency];
    if (!forms) {
      throw new NotImplementedError(
        `Currency code "${currency}" not implemented for "${this.constructor.name}"`,
      );
    }
    let [cr1, cr2] = forms;

    if (adjective && currency in this.cls.CURRENCY_ADJECTIVES) {
      cr1 = prefixCurrency(this.cls.CURRENCY_ADJECTIVES[currency] as string, cr1);
    }

    const minusStr = isNegative ? `${this.negword.trim()} ` : "";
    const moneyStr = this._moneyVerbose(left, currency);
    const centsStr = cents
      ? this._centsVerbose(right, currency)
      : this._centsTerse(right, currency);

    return `${minusStr}${moneyStr} ${this.pluralize(left, cr1)}${separator} ${centsStr} ${this.pluralize(right, cr2)}`;
  }

  setup(): void {}
}
