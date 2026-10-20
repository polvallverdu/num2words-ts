// Copyright (c) 2024, Mehedi Hasan Khondoker.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_BN.py
//
// Upstream's Num2Word_BN does not derive from Num2Word_Base; it extends it
// here only to fit the converter table's type, and overrides every method
// num2words() reaches.

import { type CurrencyOptions, Num2Word_Base } from "../base.ts";
import { checkKwargs } from "../internal/kwargs.ts";
import { abs, at, cmp, Decimal, floordiv, int, isIntegral, mod, type PyNum, str } from "../py.ts";

export const RANKING: readonly string[] = [
  "",
  "প্রথম",
  "দ্বিতীয়",
  "তৃতীয়",
  "চতুর্থ",
  "পঞ্চম",
  "ষষ্ঠ",
  "সপ্তম",
  "অষ্টম",
  "নবম",
  "দশম",
];

export const AKOK: readonly string[] = ["", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়"];

export const DOSOK: readonly string[] = [
  "দশ",
  "এগারো",
  "বারো",
  "তেরো",
  "চৌদ্দ",
  "পনের",
  "ষোল",
  "সতের",
  "আঠারো",
  "উনিশ",
  "বিশ",
  "একুশ",
  "বাইশ",
  "তেইশ",
  "চব্বিশ",
  "পঁচিশ",
  "ছাব্বিশ",
  "সাতাশ",
  "আটাশ",
  "উনত্রিশ",
  "ত্রিশ",
  "একত্রিশ",
  "বত্রিশ",
  "তেত্রিশ",
  "চৌত্রিশ",
  "পঁইত্রিশ",
  "ছত্রিশ",
  "সাতত্রিশ",
  "আটত্রিশ",
  "উনচল্লিশ",
  "চল্লিশ",
  "একচল্লিশ",
  "বিয়াল্লিশ",
  "তেতাল্লিশ",
  "চৌচল্লিশ",
  "পঁয়তাল্লিশ",
  "ছেচল্লিশ",
  "সাতচল্লিশ",
  "আটচল্লিশ",
  "উনপঞ্চাশ",
  "পঞ্চাশ",
  "একান্ন",
  "বাহান্ন",
  "তিপ্পান্ন",
  "চুয়ান্ন",
  "পঞ্চান্ন",
  "ছাপ্পান্ন",
  "সাতান্ন",
  "আটান্ন",
  "উনষাট",
  "ষাট",
  "একষট্টি",
  "বাষট্টি",
  "তেষট্টি",
  "চৌষট্টি",
  "পঁয়ষট্টি",
  "ছিষট্টি",
  "সাতষট্টি",
  "আটষট্টি",
  "উনসত্তর",
  "সত্তর",
  "একাত্তর ",
  "বাহাত্তর",
  "তিয়াত্তর",
  "চুয়াত্তর",
  "পঁচাত্তর",
  "ছিয়াত্তর",
  "সাতাত্তর",
  "আটাত্তর",
  "উনআশি",
  "আশি",
  "একাশি",
  "বিরাশি",
  "তিরাশি",
  "চুরাশি",
  "পঁচাশি",
  "ছিয়াশি",
  "সাতাশি",
  "আটাশি",
  "উননব্বই",
  "নব্বই",
  "একানব্বই",
  "বিরানব্বই",
  "তিরানব্বই",
  "চুরানব্বই",
  "পঁচানব্বই",
  "ছিয়ানব্বই",
  "সাতানব্বই",
  "আটানব্বই",
  "নিরানব্বই",
];

export const HAZAR = " হাজার ";
export const LAKH = " লাখ ";
export const KOTI = " কোটি ";
/** 307 nines. */
export const MAX_NUMBER = 10n ** 307n - 1n;

/** Custom exception for numbers that are too large. */
export class NumberTooLargeError extends Error {
  override name = "NumberTooLargeError";
}

/** `number - int(number)`, keeping the operand type like Python. */
function fraction(number: Decimal | number): Decimal | number {
  if (typeof number === "number") return number - Number(int(number));
  return number.sub(int(number));
}

export class Num2Word_BN extends Num2Word_Base {
  static strToNumber(number: PyNum | string): Decimal {
    // DIVERGENCE: Python's abs(Decimal) and Decimal subtraction round to the
    // process-wide decimal context precision. In a fresh interpreter that is
    // 28 digits, so upstream turns e.g. 10**28 + 1 into 10**28. lang_AR raises
    // the precision for good the first time it converts a long number, and the
    // parity corpus was recorded after that (languages run in sorted order),
    // so it shows exact results. The port stays exact (no rounding) to match
    // the corpus independently of which language ran first.
    return new Decimal(str(number)).abs();
  }

  // `self.str_to_number(...)` on an instance reaches the static method.
  override strToNumber(value: string): PyNum {
    return Num2Word_BN.strToNumber(value);
  }

  parseNumber(number: Decimal | number): [bigint, bigint] {
    const dosomik = str(fraction(number)).split(".").slice(1);
    const dosomikStr = dosomik.length ? dosomik.join("") : 0n;
    return [int(number), int(dosomikStr)];
  }

  parsePaisa(number: Decimal | number): [bigint, bigint] {
    // 1-99 for paisa count so two digits are valid.
    const paisa = str(fraction(number)).split(".").slice(1);
    let paisaStr: string | bigint = paisa.length ? paisa.join("") : 0n;

    // this is need, when we parse to decimal it removes trailing 0 .
    if (paisaStr) {
      paisaStr = (int(paisaStr) * 100n).toString().slice(0, 2);
    }
    return [int(number), int(paisaStr)];
  }

  _isSmallerThanMaxNumber(number: PyNum): boolean {
    if (cmp(MAX_NUMBER, number) >= 0) {
      return true;
    }
    throw new NumberTooLargeError(`Too Large number maximum value=${MAX_NUMBER}`);
  }

  _dosomikToBengaliWord(number: bigint): string {
    let word = "";
    for (const i of number.toString()) {
      word += ` ${at(AKOK, Number(i))}`;
    }
    return word;
  }

  _numberToBengaliWord(number: bigint): string {
    if (number === 0n) {
      return "শূন্য";
    }

    let words = "";

    if (number >= 10n ** 7n) {
      words += this._numberToBengaliWord(floordiv(number, 10n ** 7n)) + KOTI;
      number = mod(number, 10n ** 7n);
    }

    if (number >= 10n ** 5n) {
      words += this._numberToBengaliWord(floordiv(number, 10n ** 5n)) + LAKH;
      number = mod(number, 10n ** 5n);
    }

    if (number >= 1000n) {
      words += this._numberToBengaliWord(floordiv(number, 1000n)) + HAZAR;
      number = mod(number, 1000n);
    }

    if (number >= 100n) {
      words += `${at(AKOK, Number(floordiv(number, 100n)))}শত `;
      number = mod(number, 100n);
    }

    if (10n <= number && number <= 99n) {
      words += `${at(DOSOK, Number(number - 10n))} `;
      number = 0n;
    }

    if (0n < number && number < 10n) {
      words += `${at(AKOK, Number(number))} `;
    }

    return words.trim();
  }

  /**
   * This function represent a number to word in bangla taka and paisa.
   * example:
   * 1 = এক টাকা,
   * 101 = একশত এক টাকা,
   * 9999.15 = নয় হাজার নয়শত নিরানব্বই টাকা পনের পয়সা
   * and so on.
   */
  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    checkKwargs(options, [], "to_currency");
    let dosomikWord: string | null = null;
    const parsed = Num2Word_BN.strToNumber(val);
    const [number, decimalPart] = this.parsePaisa(parsed);
    this._isSmallerThanMaxNumber(number);

    if (decimalPart > 0n) {
      dosomikWord = ` ${this._numberToBengaliWord(decimalPart)} পয়সা`;
    }

    const words = `${this._numberToBengaliWord(number)} টাকা`;

    if (dosomikWord) {
      return (words + dosomikWord).trim();
    }
    return words.trim();
  }

  /**
   * This function represent a number to word in bangla.
   * example:
   * 1 = এক,
   * 101 = একশত এক,
   * 9999 = নয় হাজার নয়শত নিরানব্বই
   * and so on.
   */
  override toCardinal(value: PyNum | string, options: object = {}): string {
    checkKwargs(options, [], "to_cardinal");
    let dosomikWord: string | null = null;
    const parsed = Num2Word_BN.strToNumber(value);
    const [number, decimalPart] = this.parseNumber(parsed);
    this._isSmallerThanMaxNumber(number);

    if (decimalPart > 0n) {
      dosomikWord = ` দশমিক${this._dosomikToBengaliWord(decimalPart)}`;
    }

    const words = this._numberToBengaliWord(number);

    if (dosomikWord) {
      return (words + dosomikWord).trim();
    }
    return words.trim();
  }

  override toOrdinal(number: PyNum | string, options: object = {}): string {
    checkKwargs(options, [], "to_ordinal");
    return this.toCardinal(number);
  }

  /**
   * This function represent a number to ranking in bangla.
   * example:
   * 1 = প্রথম,
   * 2 = দ্বিতীয়,
   * 1001 = এক হাজার একতম
   * and so on.
   */
  override toOrdinalNum(number: PyNum, options: object = {}): string {
    checkKwargs(options, [], "to_ordinal_num");
    this._isSmallerThanMaxNumber(number);

    // `number in range(1, 11)`: equality with an int in 1..10.
    if (isIntegral(number) && cmp(number, 1n) >= 0 && cmp(number, 10n) <= 0) {
      if (typeof number !== "bigint") {
        throw new TypeError(
          `list indices must be integers or slices, not ${typeof number === "number" ? "float" : "Decimal"}`,
        );
      }
      return at(RANKING, Number(number));
    }
    const rank = this.toCardinal(int(abs(number)));
    if (rank.endsWith("ত")) {
      return `${rank}ম`;
    }
    return `${rank}তম`;
  }

  /**
   * This function represent a number to year in bangla.
   * example:
   * 2002 = দুই হাজার দুই সাল,
   * 2024 = দুই হাজার চব্বিশ সাল
   * and so on.
   */
  override toYear(number: PyNum, options: object = {}): string {
    checkKwargs(options, [], "to_year");
    this._isSmallerThanMaxNumber(number);
    return `${this.toCardinal(int(abs(number)))} সাল`;
  }
}
