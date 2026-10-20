// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2022, Sergei Ruzki.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_BE.py

import { type CurrencyForm, type CurrencyForms, Num2Word_Base } from "../base.ts";
import { abs, at, getItem, int, KeyError, mod, type PyNum, str, ValueError } from "../py.ts";
import { getDigits, splitbyx } from "../utils.ts";

const ZERO = "нуль";

export const ONES_FEMININE: Record<number, string> = {
  1: "адна",
  2: "дзве",
  3: "тры",
  4: "чатыры",
  5: "пяць",
  6: "шэсць",
  7: "сем",
  8: "восем",
  9: "дзевяць",
};

const ONES: Record<string, Record<number, string>> = {
  f: {
    1: "адна",
    2: "дзве",
    3: "тры",
    4: "чатыры",
    5: "пяць",
    6: "шэсць",
    7: "сем",
    8: "восем",
    9: "дзевяць",
  },
  m: {
    1: "адзін",
    2: "два",
    3: "тры",
    4: "чатыры",
    5: "пяць",
    6: "шэсць",
    7: "сем",
    8: "восем",
    9: "дзевяць",
  },
  n: {
    1: "адно",
    2: "два",
    3: "тры",
    4: "чатыры",
    5: "пяць",
    6: "шэсць",
    7: "сем",
    8: "восем",
    9: "дзевяць",
  },
};

const TENS: Record<number, string> = {
  0: "дзесяць",
  1: "адзінаццаць",
  2: "дванаццаць",
  3: "трынаццаць",
  4: "чатырнаццаць",
  5: "пятнаццаць",
  6: "шаснаццаць",
  7: "сямнаццаць",
  8: "васямнаццаць",
  9: "дзевятнаццаць",
};

const TWENTIES: Record<number, string> = {
  2: "дваццаць",
  3: "трыццаць",
  4: "сорак",
  5: "пяцьдзясят",
  6: "шэсцьдзясят",
  7: "семдзесят",
  8: "восемдзесят",
  9: "дзевяноста",
};

const TWENTIES_ORD: readonly (readonly [string, string])[] = [
  ["дваццаць", "дваццаці"],
  ["трыццаць", "трыццаці"],
  ["сорак", "сарака"],
  ["пяцьдзясят", "пяцідзясяці"],
  ["шэсцьдзясят", "шaсцідзясяці"],
  ["семдзесят", "сямідзесяці"],
  ["восемдзесят", "васьмідзесяці"],
  ["дзевяноста", "дзевяноста"],
];

const HUNDREDS: Record<number, string> = {
  1: "сто",
  2: "дзвесце",
  3: "трыста",
  4: "чатырыста",
  5: "пяцьсот",
  6: "шэсцьсот",
  7: "семсот",
  8: "восемсот",
  9: "дзевяцьсот",
};

const THOUSANDS: Record<number, CurrencyForm> = {
  1: ["тысяча", "тысячы", "тысяч"], // 10^3
  2: ["мільён", "мільёны", "мільёнаў"], // 10^6
  3: ["мільярд", "мільярды", "мільярдаў"], // 10^9
  4: ["трыльён", "трыльёны", "трыльёнаў"], // 10^12
  5: ["квадрыльён", "квадрыльёны", "квадрыльёнаў"], // 10^15
  6: ["квінтыльён", "квінтыльёны", "квінтыльёнаў"], // 10^18
  7: ["секстыльён", "секстыльёны", "секстыльёнаў"], // 10^21
  8: ["сэптыльён", "сэптыльёны", "сэптыльёнаў"], // 10^24
  9: ["актыльён", "актыльёны", "актыльёнаў"], // 10^27
  10: ["нанільён", "нанільёны", "нанільёнаў"], // 10^30
};

/** Python `str(k)` of a gender option, as a dict key. */
function genderKey(gender: unknown): string {
  return typeof gender === "string" ? gender : str(gender);
}

export interface GenderOptions {
  gender?: string | boolean;
}

export class Num2Word_BE extends Num2Word_Base {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    RUB: [
      ["расійскі рубель", "расійскія рублі", "расійскіх рублёў"],
      ["капейка", "капейкі", "капеек"],
    ],
    EUR: [
      ["еўра", "еўра", "еўра"],
      ["цэнт", "цэнты", "цэнтаў"],
    ],
    USD: [
      ["долар", "долары", "долараў"],
      ["цэнт", "цэнты", "цэнтаў"],
    ],
    UAH: [
      ["грыўна", "грыўны", "грыўнаў"],
      ["капейка", "капейкі", "капеек"],
    ],
    KZT: [
      ["тэнге", "тэнге", "тэнге"],
      ["тыйін", "тыйіны", "тыйінаў"],
    ],
    BYN: [
      ["беларускі рубель", "беларускія рублі", "беларускіх рублёў"],
      ["капейка", "капейкі", "капеек"],
    ],
    UZS: [
      ["сум", "сумы", "сумаў"],
      ["тыйін", "тыйіны", "тыйінаў"],
    ],
    PLN: [
      ["злоты", "злотых", "злотых"],
      ["грош", "грошы", "грошаў"],
    ],
  };

  declare ords: Record<string, string>;
  declare ordsAdjective: Record<string, string>;

  override setup(): void {
    this.negword = "мінус";
    this.pointword = "коска";
    this.ords = {
      нуль: "нулявы",
      адзін: "першы",
      два: "другі",
      тры: "трэці",
      чатыры: "чацвёрты",
      пяць: "пяты",
      шэсць: "шосты",
      сем: "сёмы",
      восем: "восьмы",
      дзевяць: "дзявяты",
      сто: "соты",
      тысяча: "тысячны",
    };

    this.ordsAdjective = {
      адзін: "адна",
      адна: "адна",
      дзве: "двух",
      тры: "трох",
      чатыры: "чатырох",
      пяць: "пяці",
      шэсць: "шасці",
      сем: "сямі",
      восем: "васьмі",
      дзевяць: "дзевяцi",
      сто: "ста",
    };
  }

  override toCardinal(number: PyNum, options: GenderOptions = {}): string {
    const gender = options.gender ?? "m";
    const n = str(number).replaceAll(",", ".");
    if (n.includes(".")) {
      const parts = n.split(".");
      if (parts.length !== 2) {
        throw new ValueError("too many values to unpack (expected 2)");
      }
      const [left, right] = parts as [string, string];
      let leadingZeroCount: number;
      if (right.length > 0 && [...right].every((c) => c === "0")) {
        leadingZeroCount = 0;
      } else {
        leadingZeroCount = right.length - right.replace(/^0+/, "").length;
      }

      const decimalPart = `${ZERO} `.repeat(leadingZeroCount) + this._int2word(int(right), gender);
      return `${this._int2word(int(left), gender)} ${this.pointword} ${decimalPart}`;
    }
    return this._int2word(int(n), gender);
  }

  override pluralize(n: bigint, forms: CurrencyForm): string {
    let form: number;
    if (mod(n, 100n) < 10n || mod(n, 100n) > 20n) {
      if (mod(n, 10n) === 1n) {
        form = 0;
      } else if (5n > mod(n, 10n) && mod(n, 10n) > 1n) {
        form = 1;
      } else {
        form = 2;
      }
    } else {
      form = 2;
    }
    return at(forms, form);
  }

  override toOrdinal(number: PyNum, options: GenderOptions = {}): string {
    this.verifyOrdinal(number);
    let gender = options.gender ?? "m";
    if (typeof gender === "boolean" && gender) gender = "f";
    let outwords = this.toCardinal(number, { gender }).split(" ");
    let lastword = at(outwords, -1).toLowerCase();
    try {
      if (outwords.length > 1) {
        const w2 = at(outwords, -2);
        if (Object.hasOwn(this.ordsAdjective, w2)) {
          outwords[outwords.length - 2] = this.ordsAdjective[w2] ?? w2;
        } else if (w2 === "дзесяць") {
          outwords[outwords.length - 2] = `${w2.slice(0, -1)}і`;
        }
      }
      if (outwords.length === 3) {
        if (["адзін", "адна"].includes(at(outwords, -3))) {
          outwords[outwords.length - 3] = "";
        }
      }
      lastword = getItem(this.ords, lastword);
    } catch (e) {
      if (!(e instanceof KeyError)) throw e;
      if (Object.hasOwn(this.ordsAdjective, lastword.slice(0, -3))) {
        lastword = `${this.ordsAdjective[lastword.slice(0, -3)] ?? lastword}соты`;
      } else if (lastword.slice(-7) === "дзесяць") {
        lastword = "дзясяты";
      } else if (lastword.slice(-9) === "семдзесят") {
        lastword = "сямідзясяты";
      } else if (at(lastword, -1) === "ь" || at(lastword, -2) === "ц") {
        lastword = `${lastword.slice(0, -2)}ты`;
      } else if (at(lastword, -1) === "к") {
        lastword = `${lastword.replaceAll("о", "а")}авы`;
      } else if (at(lastword, -2) === "ч" || at(lastword, -1) === "ч") {
        if (at(lastword, -2) === "ч") {
          lastword = `${lastword.slice(0, -1)}ны`;
        }
        if (at(lastword, -1) === "ч") {
          lastword = `${lastword}ны`;
        }
      } else if (at(lastword, -1) === "н" || at(lastword, -2) === "н") {
        lastword = `${lastword.slice(0, lastword.lastIndexOf("н") + 1)}ны`;
      } else if (lastword.slice(-3) === "наў") {
        lastword = `${lastword.slice(0, lastword.lastIndexOf("н") + 1)}ны`;
      } else if (at(lastword, -1) === "д" || at(lastword, -2) === "д") {
        lastword = `${lastword.slice(0, lastword.lastIndexOf("д") + 1)}ны`;
      }
    }

    if (gender === "f") {
      if (["ці"].includes(lastword.slice(-2))) {
        lastword = `${lastword.slice(0, -2)}цяя`;
      } else {
        lastword = `${lastword.slice(0, -1)}ая`;
      }
    }

    if (gender === "n") {
      if (["ці", "ца"].includes(lastword.slice(-2))) {
        lastword = `${lastword.slice(0, -2)}цяе`;
      } else {
        lastword = `${lastword.slice(0, -1)}ае`;
      }
    }

    outwords[outwords.length - 1] = this.title(lastword);
    if (outwords.length === 2 && at(outwords, -2).includes("адна")) {
      outwords[outwords.length - 2] = at(outwords, -1);
      outwords.pop();
    }

    if (
      outwords.length > 1 &&
      (Object.values(THOUSANDS).some((x) => at(outwords, -1).includes(x[0] as string)) ||
        at(outwords, -1).includes("тысяч"))
    ) {
      const newOutwords: string[] = [];
      for (let w of outwords) {
        const replacement = TWENTIES_ORD.find((x) => w.includes(x[0]));
        if (replacement) {
          w = w.replaceAll(replacement[0], replacement[1]);
        }
        newOutwords.push(w);
      }
      outwords = [newOutwords.join("")];
    }

    return outwords.join(" ").trim();
  }

  protected override _moneyVerbose(number: bigint, currency: string): string {
    let gender = "m";
    if (currency === "UAH") gender = "f";
    return this._int2word(number, gender);
  }

  protected override _centsVerbose(number: bigint, currency: string): string {
    let gender: string;
    if (["UAH", "RUB", "BYN"].includes(currency)) {
      gender = "f";
    } else {
      gender = "m";
    }
    return this._int2word(number, gender);
  }

  _int2word(n: bigint, gender: unknown = "m"): string {
    if (n < 0n) {
      return [this.negword, this._int2word(abs(n), gender)].join(" ");
    }

    if (n === 0n) return ZERO;

    const words: string[] = [];
    const chunks = [...splitbyx(n.toString(), 3)];
    let i = chunks.length;
    for (const x of chunks) {
      i -= 1;

      if (x === 0n) continue;

      const [n1, n2, n3] = getDigits(x) as [number, number, number];

      if (n3 > 0) words.push(getItem(HUNDREDS, String(n3)));

      if (n2 > 1) words.push(getItem(TWENTIES, String(n2)));

      if (n2 === 1) {
        words.push(getItem(TENS, String(n1)));
      } else if (n1 > 0) {
        let ones: Record<number, string>;
        if (i === 0) {
          ones = getItem(ONES, genderKey(gender));
        } else if (i === 1) {
          ones = getItem(ONES, "f"); // Thousands are feminine
        } else {
          ones = getItem(ONES, "m");
        }
        words.push(getItem(ones, String(n1)));
      }

      if (i > 0) words.push(this.pluralize(x, getItem(THOUSANDS, String(i))));
    }

    return words.join(" ");
  }
}
