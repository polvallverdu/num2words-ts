// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2018, Abdullah Alhazmy, Alhazmy13.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_AR.py

import { Num2Word_Base } from "../base.ts";
import { checkKwargs } from "../internal/kwargs.ts";
import {
  at,
  cmp,
  Decimal,
  eq,
  int,
  mod,
  OverflowError,
  type PyNum,
  pyAssert,
  ROUND_HALF_EVEN,
  round,
  str,
  zeroPad,
} from "../py.ts";

type Forms = readonly [string, string, string, string];

export const CURRENCY_SR: readonly [Forms, Forms] = [
  ["ريال", "ريالان", "ريالات", "ريالاً"],
  ["هللة", "هللتان", "هللات", "هللة"],
];
export const CURRENCY_EGP: readonly [Forms, Forms] = [
  ["جنيه", "جنيهان", "جنيهات", "جنيهاً"],
  ["قرش", "قرشان", "قروش", "قرش"],
];
export const CURRENCY_KWD: readonly [Forms, Forms] = [
  ["دينار", "ديناران", "دينارات", "ديناراً"],
  ["فلس", "فلسان", "فلس", "فلس"],
];
export const CURRENCY_TND: readonly [Forms, Forms] = [
  ["دينار", "ديناران", "دينارات", "ديناراً"],
  ["مليماً", "ميلمان", "مليمات", "مليم"],
];

export const ARABIC_ONES: readonly string[] = [
  "",
  "واحد",
  "اثنان",
  "ثلاثة",
  "أربعة",
  "خمسة",
  "ستة",
  "سبعة",
  "ثمانية",
  "تسعة",
  "عشرة",
  "أحد عشر",
  "اثنا عشر",
  "ثلاثة عشر",
  "أربعة عشر",
  "خمسة عشر",
  "ستة عشر",
  "سبعة عشر",
  "ثمانية عشر",
  "تسعة عشر",
];

/**
 * Python's process-wide decimal context precision (`decimal.getcontext().prec`,
 * 28 by default). Decimal arithmetic rounds its results to it, and lang_AR
 * raises it for good the first time a number has too many digits, which
 * changes later Decimal results (see Num2Word_AR.convertToArabic).
 */
const decimalContext = { prec: 28 };

/**
 * Round an exact Decimal result to `decimalContext.prec` significant digits,
 * half to even, as Python's Decimal operations (`+`, `-`, `*`, `/`, `abs`) do.
 */
function ctxRound(d: Decimal): Decimal {
  const mag = d.coefficient < 0n ? -d.coefficient : d.coefficient;
  const extra = mag.toString().length - decimalContext.prec;
  if (extra <= 0) return d;
  return d.quantize(Decimal.of(1n, d.exponent + extra), ROUND_HALF_EVEN);
}

const EMPTY_FORMS: Forms = ["", "", "", ""];

/** Python's `"%s" % x` / `str(x)` for the numbers this module formats. */
function fmt(x: PyNum): string {
  return str(x);
}

export interface ArCurrencyOptions {
  currency?: string;
  prefix?: string;
  suffix?: string;
}

export class Num2Word_AR extends Num2Word_Base {
  static errmsgToobig = "abs(%s) must be less than %s.";
  static MAXVAL = 10n ** 51n;

  declare number: string | bigint;
  declare arabicPrefixText: string;
  declare arabicSuffixText: string;
  declare integerValue: bigint;
  declare _decimalValue: bigint | string;
  declare partPrecision: number;
  declare currencyUnit: Forms;
  declare currencySubunit: Forms;
  declare isCurrencyPartNameFeminine: boolean;
  declare isCurrencyNameFeminine: boolean;
  declare separator: string;
  declare arabicOnes: readonly string[];
  declare arabicFeminineOnes: readonly string[];
  declare arabicOrdinal: readonly string[];
  declare arabicTens: readonly string[];
  declare arabicHundreds: readonly string[];
  declare arabicAppendedTwos: readonly string[];
  declare arabicTwos: readonly string[];
  declare arabicGroup: readonly string[];
  declare arabicAppendedGroup: readonly string[];
  declare arabicPluralGroups: readonly string[];

  constructor() {
    super();
    // Class attribute MAXVAL (the base constructor does not set it: no cards).
    this.MAXVAL = Num2Word_AR.MAXVAL;

    this.number = 0n;
    this.arabicPrefixText = "";
    this.arabicSuffixText = "";
    this.integerValue = 0n;
    this._decimalValue = "";
    this.partPrecision = 2;
    this.currencyUnit = CURRENCY_SR[0];
    this.currencySubunit = CURRENCY_SR[1];
    this.isCurrencyPartNameFeminine = true;
    this.isCurrencyNameFeminine = false;
    this.separator = "و";

    this.arabicOnes = ARABIC_ONES;
    this.arabicFeminineOnes = [
      "",
      "إحدى",
      "اثنتان",
      "ثلاث",
      "أربع",
      "خمس",
      "ست",
      "سبع",
      "ثمان",
      "تسع",
      "عشر",
      "إحدى عشرة",
      "اثنتا عشرة",
      "ثلاث عشرة",
      "أربع عشرة",
      "خمس عشرة",
      "ست عشرة",
      "سبع عشرة",
      "ثماني عشرة",
      "تسع عشرة",
    ];
    this.arabicOrdinal = [
      "",
      "اول",
      "ثاني",
      "ثالث",
      "رابع",
      "خامس",
      "سادس",
      "سابع",
      "ثامن",
      "تاسع",
      "عاشر",
      "حادي عشر",
      "ثاني عشر",
      "ثالث عشر",
      "رابع عشر",
      "خامس عشر",
      "سادس عشر",
      "سابع عشر",
      "ثامن عشر",
      "تاسع عشر",
    ];
    this.arabicTens = ["عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
    this.arabicHundreds = [
      "",
      "مائة",
      "مئتان",
      "ثلاثمائة",
      "أربعمائة",
      "خمسمائة",
      "ستمائة",
      "سبعمائة",
      "ثمانمائة",
      "تسعمائة",
    ];

    this.arabicAppendedTwos = [
      "مئتا",
      "ألفا",
      "مليونا",
      "مليارا",
      "تريليونا",
      "كوادريليونا",
      "كوينتليونا",
      "سكستيليونا",
      "سبتيليونا",
      "أوكتيليونا ",
      "نونيليونا",
      "ديسيليونا",
      "أندسيليونا",
      "دوديسيليونا",
      "تريديسيليونا",
      "كوادريسيليونا",
      "كوينتينيليونا",
    ];
    this.arabicTwos = [
      "مئتان",
      "ألفان",
      "مليونان",
      "ملياران",
      "تريليونان",
      "كوادريليونان",
      "كوينتليونان",
      "سكستيليونان",
      "سبتيليونان",
      "أوكتيليونان ",
      "نونيليونان ",
      "ديسيليونان",
      "أندسيليونان",
      "دوديسيليونان",
      "تريديسيليونان",
      "كوادريسيليونان",
      "كوينتينيليونان",
    ];
    this.arabicGroup = [
      "مائة",
      "ألف",
      "مليون",
      "مليار",
      "تريليون",
      "كوادريليون",
      "كوينتليون",
      "سكستيليون",
      "سبتيليون",
      "أوكتيليون",
      "نونيليون",
      "ديسيليون",
      "أندسيليون",
      "دوديسيليون",
      "تريديسيليون",
      "كوادريسيليون",
      "كوينتينيليون",
    ];
    this.arabicAppendedGroup = [
      "",
      "ألفاً",
      "مليوناً",
      "ملياراً",
      "تريليوناً",
      "كوادريليوناً",
      "كوينتليوناً",
      "سكستيليوناً",
      "سبتيليوناً",
      "أوكتيليوناً",
      "نونيليوناً",
      "ديسيليوناً",
      "أندسيليوناً",
      "دوديسيليوناً",
      "تريديسيليوناً",
      "كوادريسيليوناً",
      "كوينتينيليوناً",
    ];
    this.arabicPluralGroups = [
      "",
      "آلاف",
      "ملايين",
      "مليارات",
      "تريليونات",
      "كوادريليونات",
      "كوينتليونات",
      "سكستيليونات",
      "سبتيليونات",
      "أوكتيليونات",
      "نونيليونات",
      "ديسيليونات",
      "أندسيليونات",
      "دوديسيليونات",
      "تريديسيليونات",
      "كوادريسيليونات",
      "كوينتينيليونات",
    ];
    pyAssert(this.arabicAppendedGroup.length === this.arabicGroup.length);
    pyAssert(this.arabicPluralGroups.length === this.arabicGroup.length);
    pyAssert(this.arabicAppendedTwos.length === this.arabicTwos.length);
  }

  numberToArabic(arabicPrefixText: string, arabicSuffixText: string): void {
    this.arabicPrefixText = arabicPrefixText;
    this.arabicSuffixText = arabicSuffixText;
    this.extractIntegerAndDecimalParts();
  }

  extractIntegerAndDecimalParts(): void {
    const splits = str(this.number).split(".");

    this.integerValue = int(splits[0] as string);
    if (splits.length > 1) {
      this._decimalValue = int(this.decimalValue(splits[1] as string));
    } else {
      this._decimalValue = 0n;
    }
  }

  decimalValue(decimalPart: string): string {
    let result: string;
    // `is not` on small ints behaves like `!=`.
    if (this.partPrecision !== decimalPart.length) {
      const decimalPartLength = decimalPart.length;

      let decimalPartBuilder = decimalPart;
      for (let i = 0; i < this.partPrecision - decimalPartLength; i++) {
        decimalPartBuilder += "0";
      }
      decimalPart = decimalPartBuilder;

      let dec: number;
      if (decimalPart.length <= this.partPrecision) {
        dec = decimalPart.length;
      } else {
        dec = this.partPrecision;
      }
      result = decimalPart.slice(0, dec);
    } else {
      result = decimalPart;
    }

    // The following is useless (never happens)
    // for i in range(len(result), self.partPrecision):
    //     result += '0'
    return result;
  }

  digitFeminineStatus(digit: bigint, groupLevel: number): string {
    if (groupLevel === -1) {
      if (this.isCurrencyPartNameFeminine) {
        return at(this.arabicFeminineOnes, Number(digit));
      }
      // Note: this never happens
      return at(this.arabicOnes, Number(digit));
    } else if (groupLevel === 0) {
      if (this.isCurrencyNameFeminine) {
        return at(this.arabicFeminineOnes, Number(digit));
      }
      return at(this.arabicOnes, Number(digit));
    }
    return at(this.arabicOnes, Number(digit));
  }

  /**
   * `group_number` is a non-negative int below 1000 here, so upstream's
   * Decimal arithmetic (`tens = Decimal(n) % 100`, `hundreds = Decimal(n) / 100`)
   * is exact; `hundreds == 0` only when the group is 0.
   */
  processArabicGroup(groupNumber: bigint, groupLevel: number, remainingNumber: bigint): string {
    let tens = groupNumber % 100n;
    const intHundreds = groupNumber / 100n;
    const hundredsIsZero = groupNumber === 0n;
    let retVal = "";

    if (intHundreds > 0n) {
      if (tens === 0n && intHundreds === 2n) {
        retVal = `${at(this.arabicAppendedTwos, 0)}`;
      } else {
        retVal = `${at(this.arabicHundreds, Number(intHundreds))}`;
        if (retVal !== "" && tens !== 0n) {
          retVal += " و ";
        }
      }
    }

    if (tens > 0n) {
      if (tens < 20n) {
        // if int(group_level) >= len(self.arabicTwos):
        //     raise OverflowError(self.errmsg_toobig %
        //                         (self.number, self.MAXVAL))
        pyAssert(groupLevel < this.arabicTwos.length);
        if (tens === 2n && intHundreds === 0n && groupLevel > 0) {
          const pow = Math.trunc(Math.log10(Number(this.integerValue)));
          if (
            this.integerValue > 10n &&
            pow % 3 === 0 &&
            this.integerValue === 2n * 10n ** BigInt(pow)
          ) {
            retVal = `${at(this.arabicAppendedTwos, groupLevel)}`;
          } else {
            retVal = `${at(this.arabicTwos, groupLevel)}`;
          }
        } else {
          if (tens === 1n && groupLevel > 0 && hundredsIsZero) {
            // Note: this never happens
            // (hundreds == 0 only if group_number is 0)
            retVal += "";
          } else if (
            (tens === 1n || tens === 2n) &&
            (groupLevel === 0 || groupLevel === -1) &&
            hundredsIsZero &&
            remainingNumber === 0n
          ) {
            // Note: this never happens (idem)
            retVal += "";
          } else if (tens === 1n && groupLevel > 0) {
            retVal += at(this.arabicGroup, groupLevel);
          } else {
            retVal += this.digitFeminineStatus(tens, groupLevel);
          }
        }
      } else {
        const ones = tens % 10n;
        // int((tens / 10) - 2) on a Decimal: truncation of a value >= 0.
        tens = tens / 10n - 2n;
        if (ones > 0n) {
          retVal += this.digitFeminineStatus(ones, groupLevel);
        }
        if (retVal !== "" && ones !== 0n) {
          retVal += " و ";
        }

        retVal += at(this.arabicTens, Number(tens));
      }
    }

    return retVal;
  }

  // We use this instead of built-in `abs` function,
  // because `abs` suffers from loss of precision for big numbers
  abs(number: PyNum): PyNum {
    if (cmp(number, 0n) >= 0) return number;
    if (typeof number === "bigint") return -number;
    if (typeof number === "number") return -number;
    return number.neg();
  }

  // We use this instead of `"{:09d}".format(number)`,
  // because the string conversion suffers from loss of
  // precision for big numbers
  toStr(number: PyNum): string {
    const integer = int(number);
    if (eq(integer, number)) {
      return integer.toString();
    }
    let decimal: bigint;
    if (typeof number === "number") {
      decimal = round((number - Number(integer)) * 10 ** 9);
    } else {
      // round(Decimal) rounds half to even.
      // Each Decimal operation rounds to the context precision.
      decimal = int(
        ctxRound(ctxRound((number as Decimal).sub(integer)).mul(10n ** 9n)).quantize(
          "1",
          ROUND_HALF_EVEN,
        ),
      );
    }
    return `${integer.toString()}.${zeroPad(decimal, 9).replace(/0+$/, "")}`;
  }

  convert(value: PyNum): string {
    this.number = this.toStr(value);
    this.numberToArabic(this.arabicPrefixText, this.arabicSuffixText);
    return this.convertToArabic();
  }

  convertToArabic(): string {
    // Decimal(self.number) raises InvalidOperation for e.g. "-1.-5".
    const tempDecimal = new Decimal(str(this.number));

    if (tempDecimal.isZero()) {
      return "صفر";
    }

    const decimalString = this.processArabicGroup(this._decimalValue as bigint, -1, 0n);
    let retVal = "";
    let group = 0;

    // Upstream works on Decimals: the first pass on Decimal(self.number), then
    // on int(temp / 1000). `%` raises InvalidOperation when the quotient has
    // more digits than the context precision (upstream then raises the
    // precision), and `/` rounds to it, which can carry into the integer part.
    let tempNumber: Decimal | bigint = tempDecimal;

    while (cmp(tempNumber, 0n) > 0) {
      const tempNumberDec = new Decimal(str(tempNumber));
      const [quotient, remainder] = tempNumberDec.divmod(1000n);
      if (int(quotient).toString().length > decimalContext.prec) {
        decimalContext.prec = tempNumberDec.asTuple().digits.length;
      }
      const numberToProcess = int(remainder);

      tempNumber = int(ctxRound(Decimal.of(tempNumberDec.coefficient, tempNumberDec.exponent - 3)));

      const groupDescription = this.processArabicGroup(numberToProcess, group, tempNumber);
      if (groupDescription !== "") {
        if (group > 0) {
          if (retVal !== "") {
            retVal = `و ${retVal}`;
          }
          if (numberToProcess !== 2n && numberToProcess !== 1n) {
            // if group >= len(self.arabicGroup):
            //     raise OverflowError(self.errmsg_toobig %
            //                         (self.number, self.MAXVAL)
            //     )
            pyAssert(group < this.arabicGroup.length);
            if (numberToProcess % 100n !== 1n) {
              if (3n <= numberToProcess && numberToProcess <= 10n) {
                retVal = `${at(this.arabicPluralGroups, group)} ${retVal}`;
              } else {
                if (retVal !== "") {
                  retVal = `${at(this.arabicAppendedGroup, group)} ${retVal}`;
                } else {
                  retVal = `${at(this.arabicGroup, group)} ${retVal}`;
                }
              }
            } else {
              retVal = `${at(this.arabicGroup, group)} ${retVal}`;
            }
          }
        }
        retVal = `${groupDescription} ${retVal}`;
      }
      group += 1;
    }
    let formattedNumber = "";
    if (this.arabicPrefixText !== "") {
      formattedNumber += `${this.arabicPrefixText} `;
    }
    formattedNumber += retVal;
    if (this.integerValue !== 0n) {
      const remaining100 = mod(this.integerValue, 100n);

      if (remaining100 === 0n) {
        formattedNumber += this.currencyUnit[0];
      } else if (remaining100 === 1n) {
        formattedNumber += this.currencyUnit[0];
      } else if (remaining100 === 2n) {
        if (this.integerValue === 2n) {
          formattedNumber += this.currencyUnit[1];
        } else {
          formattedNumber += this.currencyUnit[0];
        }
      } else if (3n <= remaining100 && remaining100 <= 10n) {
        formattedNumber += this.currencyUnit[2];
      } else if (11n <= remaining100 && remaining100 <= 99n) {
        formattedNumber += this.currencyUnit[3];
      }
    }
    const decimalValue = this._decimalValue as bigint;
    if (decimalValue !== 0n) {
      formattedNumber += ` ${this.separator} `;
      formattedNumber += decimalString;
    }

    if (decimalValue !== 0n) {
      formattedNumber += " ";
      const remaining100 = mod(decimalValue, 100n);

      if (remaining100 === 0n) {
        formattedNumber += this.currencySubunit[0];
      } else if (remaining100 === 1n) {
        formattedNumber += this.currencySubunit[0];
      } else if (remaining100 === 2n) {
        formattedNumber += this.currencySubunit[1];
      } else if (3n <= remaining100 && remaining100 <= 10n) {
        formattedNumber += this.currencySubunit[2];
      } else if (11n <= remaining100 && remaining100 <= 99n) {
        formattedNumber += this.currencySubunit[3];
      }
    }

    if (this.arabicSuffixText !== "") {
      formattedNumber += ` ${this.arabicSuffixText}`;
    }

    return formattedNumber;
  }

  validateNumber(number: PyNum): PyNum {
    if (cmp(number, this.MAXVAL) >= 0) {
      throw new OverflowError(
        Num2Word_AR.errmsgToobig.replace("%s", fmt(number)).replace("%s", fmt(this.MAXVAL)),
      );
    }
    return number;
  }

  setCurrencyPrefer(currency: string): void {
    if (currency === "TND") {
      this.currencyUnit = CURRENCY_TND[0];
      this.currencySubunit = CURRENCY_TND[1];
      this.partPrecision = 3;
    } else if (currency === "EGP") {
      this.currencyUnit = CURRENCY_EGP[0];
      this.currencySubunit = CURRENCY_EGP[1];
      this.partPrecision = 2;
    } else if (currency === "KWD") {
      this.currencyUnit = CURRENCY_KWD[0];
      this.currencySubunit = CURRENCY_KWD[1];
      this.partPrecision = 2;
    } else {
      this.currencyUnit = CURRENCY_SR[0];
      this.currencySubunit = CURRENCY_SR[1];
      this.partPrecision = 2;
    }
  }

  override toCurrency(value: PyNum | string, options: ArCurrencyOptions = {}): string {
    checkKwargs(options, ["currency", "prefix", "suffix"], "to_currency");
    const currency = options.currency ?? "SR";
    const prefix = options.prefix ?? "";
    const suffix = options.suffix ?? "";
    this.setCurrencyPrefer(currency);
    this.isCurrencyNameFeminine = false;
    this.separator = "و";
    this.arabicOnes = ARABIC_ONES;
    this.arabicPrefixText = prefix;
    this.arabicSuffixText = suffix;
    return this.convert(value as PyNum);
  }

  override toOrdinal(number: PyNum, options: { prefix?: string } = {}): string {
    checkKwargs(options, ["prefix"], "to_ordinal");
    const prefix = options.prefix ?? "";
    if (cmp(number, 19n) <= 0) {
      if (typeof number !== "bigint") {
        throw new TypeError(
          `list indices must be integers or slices, not ${typeof number === "number" ? "float" : "Decimal"}`,
        );
      }
      return `${at(this.arabicOrdinal, Number(number))}`;
    }
    if (cmp(number, 100n) < 0) {
      this.isCurrencyNameFeminine = true;
    } else {
      this.isCurrencyNameFeminine = false;
    }
    this.currencySubunit = EMPTY_FORMS;
    this.currencyUnit = EMPTY_FORMS;
    this.arabicPrefixText = prefix;
    this.arabicSuffixText = "";
    return `${this.convert(this.abs(number)).trim()}`;
  }

  override toYear(value: PyNum, options: object = {}): string {
    checkKwargs(options, [], "to_year");
    value = this.validateNumber(value);
    return this.toCardinal(value);
  }

  override toOrdinalNum(value: PyNum, options: object = {}): string {
    checkKwargs(options, [], "to_ordinal_num");
    return this.toOrdinal(value).trim();
  }

  override toCardinal(number: PyNum, options: object = {}): string {
    checkKwargs(options, [], "to_cardinal");
    this.isCurrencyNameFeminine = false;
    number = this.validateNumber(number);
    let minus = "";
    if (cmp(number, 0n) < 0) {
      minus = "سالب ";
    }
    this.separator = ",";
    this.currencySubunit = EMPTY_FORMS;
    this.currencyUnit = EMPTY_FORMS;
    this.arabicPrefixText = "";
    this.arabicSuffixText = "";
    this.arabicOnes = ARABIC_ONES;
    return minus + this.convert(this.abs(number)).trim();
  }
}
