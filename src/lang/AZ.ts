// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_AZ.py

import { type CurrencyForm, type CurrencyForms, Num2Word_Base } from "../base.ts";
import { abs, cmp, eq, getItem, int, type PyNum, pyAssert, str } from "../py.ts";

function fromKeys(keys: string[], value: string): Record<string, string> {
  return Object.fromEntries(keys.map((k) => [k, value]));
}

const CURRENCY_INTEGRAL: CurrencyForm = ["manat", "manat"];
const CURRENCY_FRACTION: CurrencyForm = ["qəpik", "qəpik"];

export class Num2Word_AZ extends Num2Word_Base {
  static DIGITS: Record<string, string> = {
    0: "sıfır",
    1: "bir",
    2: "iki",
    3: "üç",
    4: "dörd",
    5: "beş",
    6: "altı",
    7: "yeddi",
    8: "səkkiz",
    9: "doqquz",
  };

  static DECIMALS: Record<string, string> = {
    1: "on",
    2: "iyirmi",
    3: "otuz",
    4: "qırx",
    5: "əlli",
    6: "altmış",
    7: "yetmiş",
    8: "səksən",
    9: "doxsan",
  };

  static POWERS_OF_TEN: Record<string, string> = {
    2: "yüz",
    3: "min",
    6: "milyon",
    9: "milyard",
    12: "trilyon",
    15: "katrilyon",
    18: "kentilyon",
    21: "sekstilyon",
    24: "septilyon",
    27: "oktilyon",
    30: "nonilyon",
    33: "desilyon",
    36: "undesilyon",
    39: "dodesilyon",
    42: "tredesilyon",
    45: "katordesilyon",
    48: "kendesilyon",
    51: "seksdesilyon",
    54: "septendesilyon",
    57: "oktodesilyon",
    60: "novemdesilyon",
    63: "vigintilyon",
  };

  static VOWELS = "aıoueəiöü";
  static VOWEL_TO_CARDINAL_SUFFIX_MAP: Record<string, string> = {
    ...fromKeys(["a", "ı"], "ıncı"),
    ...fromKeys(["e", "ə", "i"], "inci"),
    ...fromKeys(["o", "u"], "uncu"),
    ...fromKeys(["ö", "ü"], "üncü"),
  };

  static VOWEL_TO_CARDINAL_NUM_SUFFIX_MAP: Record<string, string> = {
    ...fromKeys(["a", "ı"], "cı"),
    ...fromKeys(["e", "ə", "i"], "ci"),
    ...fromKeys(["o", "u"], "cu"),
    ...fromKeys(["ö", "ü"], "cü"),
  };

  static CURRENCY_INTEGRAL = CURRENCY_INTEGRAL;
  static CURRENCY_FRACTION = CURRENCY_FRACTION;
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    AZN: [CURRENCY_INTEGRAL, CURRENCY_FRACTION],
  };

  get az(): typeof Num2Word_AZ {
    return this.constructor as typeof Num2Word_AZ;
  }

  override setup(): void {
    super.setup();

    this.negword = "mənfi";
    this.pointword = "nöqtə";
  }

  override toCardinal(value: PyNum): string {
    const valueStr = str(value);
    const parts = valueStr.split(".");
    let integralPart = parts[0] as string;
    const fractionPart = parts.length > 1 ? (parts[1] as string) : "";

    if (integralPart.startsWith("-")) {
      integralPart = integralPart.slice(1); // ignore minus sign here
    }

    const integralPartInWords = this.intToWord(integralPart);
    const fractionPartInWords = !fractionPart ? "" : this.intToWord(fractionPart, true);

    let valueInWords = integralPartInWords;
    if (fractionPart) {
      valueInWords = [integralPartInWords, this.pointword, fractionPartInWords].join(" ");
    }

    if (cmp(value, 0n) < 0) {
      valueInWords = [this.negword, valueInWords].join(" ");
    }

    return valueInWords;
  }

  override toOrdinal(value: PyNum): string {
    pyAssert(eq(int(value), value));

    let cardinal = this.toCardinal(value);
    const lastVowel = this._lastVowel(cardinal);
    pyAssert(lastVowel !== undefined);
    const suffix = getItem(this.az.VOWEL_TO_CARDINAL_SUFFIX_MAP, lastVowel);

    if (this.az.VOWELS.includes(cardinal.slice(-1)) && cardinal !== "") {
      cardinal = cardinal.slice(0, -1);
    }

    return [cardinal, suffix].join("");
  }

  override toOrdinalNum(value: PyNum): string {
    pyAssert(eq(int(value), value));

    const cardinal = this.toCardinal(value);
    const lastVowel = this._lastVowel(cardinal);
    pyAssert(lastVowel !== undefined);
    const suffix = getItem(this.az.VOWEL_TO_CARDINAL_NUM_SUFFIX_MAP, lastVowel);
    return [str(value), suffix].join("-");
  }

  override toYear(value: PyNum): string {
    pyAssert(eq(int(value), value));

    let year = this.toCardinal(abs(value));
    if (cmp(value, 0n) < 0) {
      year = ["e.ə.", year].join(" ");
    }

    return year;
  }

  override pluralize(n: bigint, forms: CurrencyForm): string {
    const form = n === 1n ? 0 : 1;
    return forms[form] as string;
  }

  intToWord(numStr: string, leadingZeros = false): string {
    const words: string[] = [];
    const reversedStr = [...numStr].reverse();
    const { DIGITS, DECIMALS, POWERS_OF_TEN } = this.az;

    for (let index = 0; index < reversedStr.length; index++) {
      const digitInt = int(reversedStr[index] as string);
      // calculate remainder after dividing index by 3
      // because number is parsed by three digit chunks
      const remainderTo3 = index % 3;
      if (remainderTo3 === 0) {
        if (index > 0) {
          const chunk = new Set(reversedStr.slice(index, index + 3));
          if (!(chunk.size === 1 && chunk.has("0"))) {
            words.unshift(getItem(POWERS_OF_TEN, String(index)));
          }
        }
        if (digitInt > 0n) {
          // we say "min" not "bir min"
          if (!(digitInt === 1n && index === 3)) {
            words.unshift(getItem(DIGITS, digitInt.toString()));
          }
        }
      } else if (remainderTo3 === 1) {
        if (digitInt !== 0n) {
          words.unshift(getItem(DECIMALS, digitInt.toString()));
        }
      } else {
        // remainder is 2
        if (digitInt > 0n) {
          words.unshift(getItem(POWERS_OF_TEN, "2")); // "yüz"
        }
        if (digitInt > 1n) {
          words.unshift(getItem(DIGITS, digitInt.toString()));
        }
      }
    }

    if (numStr === "0") {
      words.push(getItem(DIGITS, "0"));
    }

    if (leadingZeros) {
      const zerosCount = numStr.length - int(numStr).toString().length;
      words.unshift(...Array<string>(Math.max(0, zerosCount)).fill(getItem(DIGITS, "0")));
    }

    return words.join(" ");
  }

  _lastVowel(value: string): string | undefined {
    for (const char of [...value].reverse()) {
      if (this.az.VOWELS.includes(char)) return char;
    }
    return undefined;
  }
}
