// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_PL.py

import { type CurrencyForm, type CurrencyForms, Num2Word_Base } from "../base.ts";
import {
  at,
  getItem,
  int,
  isIntegral,
  mod,
  NotImplementedError,
  type PyNum,
  str,
  ValueError,
} from "../py.ts";
import { getDigitsStrictNumbers, splitbyxStrictGen } from "../utils.ts";

const ZERO = ["zero"] as const;

const ONES: Record<string, readonly string[]> = {
  1: ["jeden"],
  2: ["dwa"],
  3: ["trzy"],
  4: ["cztery"],
  5: ["pięć"],
  6: ["sześć"],
  7: ["siedem"],
  8: ["osiem"],
  9: ["dziewięć"],
};

const ONES_ORDINALS: Record<string, readonly string[]> = {
  1: ["pierwszy", "pierwszo"],
  2: ["drugi", "dwu"],
  3: ["trzeci", "trzy"],
  4: ["czwarty", "cztero"],
  5: ["piąty", "pięcio"],
  6: ["szósty", "sześcio"],
  7: ["siódmy", "siedmio"],
  8: ["ósmy", "ośmio"],
  9: ["dziewiąty", "dziewięcio"],
  10: ["dziesiąty", "dziesięcio"],
  11: ["jedenasty", "jedenasto"],
  12: ["dwunasty", "dwunasto"],
  13: ["trzynasty", "trzynasto"],
  14: ["czternasty", "czternasto"],
  15: ["piętnasty", "piętnasto"],
  16: ["szesnasty", "szesnasto"],
  17: ["siedemnasty", "siedemnasto"],
  18: ["osiemnasty", "osiemnasto"],
  19: ["dziewiętnasty", "dziewiętnasto"],
};

const TENS: Record<string, readonly string[]> = {
  0: ["dziesięć"],
  1: ["jedenaście"],
  2: ["dwanaście"],
  3: ["trzynaście"],
  4: ["czternaście"],
  5: ["piętnaście"],
  6: ["szesnaście"],
  7: ["siedemnaście"],
  8: ["osiemnaście"],
  9: ["dziewiętnaście"],
};

const TWENTIES: Record<string, readonly string[]> = {
  2: ["dwadzieścia"],
  3: ["trzydzieści"],
  4: ["czterdzieści"],
  5: ["pięćdziesiąt"],
  6: ["sześćdziesiąt"],
  7: ["siedemdziesiąt"],
  8: ["osiemdziesiąt"],
  9: ["dziewięćdziesiąt"],
};

const TWENTIES_ORDINALS: Record<string, readonly string[]> = {
  2: ["dwudziesty", "dwudziesto"],
  3: ["trzydziesty", "trzydiesto"],
  4: ["czterdziesty", "czterdziesto"],
  5: ["pięćdziesiąty", "pięćdziesięcio"],
  6: ["sześćdziesiąty", "sześćdziesięcio"],
  7: ["siedemdziesiąty", "siedemdziesięcio"],
  8: ["osiemdziesiąty", "osiemdziesięcio"],
  9: ["dziewięćdziesiąty", "dziewięćdziesięcio"],
};

const HUNDREDS: Record<string, readonly string[]> = {
  1: ["sto"],
  2: ["dwieście"],
  3: ["trzysta"],
  4: ["czterysta"],
  5: ["pięćset"],
  6: ["sześćset"],
  7: ["siedemset"],
  8: ["osiemset"],
  9: ["dziewięćset"],
};

const HUNDREDS_ORDINALS: Record<string, readonly string[]> = {
  1: ["setny", "stu"],
  2: ["dwusetny", "dwustu"],
  3: ["trzysetny", "trzystu"],
  4: ["czterysetny", "czterystu"],
  5: ["pięćsetny", "pięcset"],
  6: ["sześćsetny", "sześćset"],
  7: ["siedemsetny", "siedemset"],
  8: ["osiemsetny", "ośiemset"],
  9: ["dziewięćsetny", "dziewięćset"],
};

const THOUSANDS: Record<string, readonly string[]> = {
  1: ["tysiąc", "tysiące", "tysięcy"], // 10^3
};

const prefixesOrdinal: Record<string, string> = {
  1: "tysięczny",
  2: "milionowy",
  3: "milairdowy",
};

const prefixes = [
  // 10^(6*x)
  "mi", // 10^6
  "bi", // 10^12
  "try", // 10^18
  "kwadry", // 10^24
  "kwinty", // 10^30
  "seksty", // 10^36
  "septy", // 10^42
  "okty", // 10^48
  "nony", // 10^54
  "decy", // 10^60
];
const suffixes = ["lion", "liard"]; // 10^x or 10^(x+3)

{
  let idx = 0;
  for (const p of prefixes) {
    for (const s of suffixes) {
      const name = p + s;
      THOUSANDS[idx + 2] = [name, `${name}y`, `${name}ów`];
      idx++;
    }
  }
}

export class Num2Word_PL extends Num2Word_Base {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    PLN: [
      ["złoty", "złote", "złotych"],
      ["grosz", "grosze", "groszy"],
    ],
    EUR: [
      ["euro", "euro", "euro"],
      ["cent", "centy", "centów"],
    ],
    USD: [
      ["dolar amerykański", "dolary amerykańskie", "dolarów amerykańskich"],
      ["cent", "centy", "centów"],
    ],
  };

  override setup(): void {
    this.negword = "minus";
    this.pointword = "przecinek";
  }

  override toCardinal(number: PyNum): string {
    const n = str(number).replace(",", ".");
    if (n.includes(".")) {
      const parts = n.split(".");
      if (parts.length !== 2) throw new ValueError("too many values to unpack");
      const [left, right] = parts as [string, string];
      const leadingZeroCount = right.length - right.replace(/^0+/, "").length;
      const decimalPart = `${ZERO[0]} `.repeat(leadingZeroCount) + this._int2word(int(right));
      return `${this._int2word(int(left))} ${this.pointword} ${decimalPart}`;
    }
    return this._int2word(int(n));
  }

  override pluralize(n: bigint, forms: CurrencyForm): string {
    let form: number;
    if (n === 1n) {
      form = 0;
    } else if (5n > mod(n, 10n) && mod(n, 10n) > 1n && (mod(n, 100n) < 10n || mod(n, 100n) > 20n)) {
      form = 1;
    } else {
      form = 2;
    }
    return at(forms, form);
  }

  lastFragmentToOrdinal(last: bigint, words: string[], level: number): void {
    const [n1, n2, n3] = getDigitsStrictNumbers(last);
    const lastTwo = n2 * 10 + n1;
    if (lastTwo === 0) {
      words.push(at(getItem(HUNDREDS_ORDINALS, String(n3)), level));
    } else if (level === 1 && last === 1n) {
      return;
    } else if (lastTwo < 20) {
      if (n3 > 0) {
        words.push(at(getItem(HUNDREDS, String(n3)), level));
      }
      words.push(at(getItem(ONES_ORDINALS, String(lastTwo)), level));
    } else if (lastTwo % 10 === 0) {
      if (n3 > 0) {
        words.push(at(getItem(HUNDREDS, String(n3)), level));
      }
      words.push(at(getItem(TWENTIES_ORDINALS, String(n2)), level));
    } else {
      if (n3 > 0) {
        words.push(at(getItem(HUNDREDS, String(n3)), 0));
      }
      words.push(at(getItem(TWENTIES_ORDINALS, String(n2)), 0));
      words.push(at(getItem(ONES_ORDINALS, String(n1)), 0));
    }
  }

  override toOrdinal(number: PyNum): string {
    // number % 1 != 0 (also true for inf and nan)
    if (!isIntegral(number)) {
      throw new NotImplementedError();
    }
    const words: string[] = [];
    const fragments = [...splitbyxStrictGen(str(number), 3)];
    let level = 0;
    let last = at(fragments, -1);
    while (last === 0n) {
      level = level + 1;
      fragments.pop();
      last = at(fragments, -1);
    }
    if (fragments.length > 1) {
      const prePart = this._int2word(int(number) - last * 1000n ** BigInt(level));
      words.push(prePart);
    }
    this.lastFragmentToOrdinal(last, words, level === 0 ? 0 : 1);
    let output = words.join(" ");
    if (last === 1n && level > 0 && output !== "") {
      output = `${output} `;
    }
    if (level > 0) {
      output = output + getItem(prefixesOrdinal, String(level));
    }
    return output;
  }

  _int2word(n: bigint): string {
    if (n === 0n) {
      return ZERO[0];
    }

    const words: string[] = [];
    const chunks = [...splitbyxStrictGen(n.toString(), 3)];
    let i = chunks.length;
    for (const x of chunks) {
      i -= 1;

      if (x === 0n) {
        continue;
      }

      const [n1, n2, n3] = getDigitsStrictNumbers(x);

      if (n3 > 0) {
        words.push(at(getItem(HUNDREDS, String(n3)), 0));
      }

      if (n2 > 1) {
        words.push(at(getItem(TWENTIES, String(n2)), 0));
      }

      if (n2 === 1) {
        words.push(at(getItem(TENS, String(n1)), 0));
      } else if (n1 > 0 && !(i > 0 && x === 1n)) {
        words.push(at(getItem(ONES, String(n1)), 0));
      }

      if (i > 0) {
        words.push(this.pluralize(x, getItem(THOUSANDS, String(i))));
      }
    }

    return words.join(" ");
  }
}
