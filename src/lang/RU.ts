// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_RU.py

import {
  type CurrencyForm,
  type CurrencyForms,
  type CurrencyOptions,
  Num2Word_Base,
} from "../base.ts";
import { checkKwargs } from "../internal/kwargs.ts";
import { abs, at, Decimal, getItem, int, mod, type PyNum, str, ValueError } from "../py.ts";
import { getDigits, splitbyx } from "../utils.ts";

export const GENDER_PLURAL_INDEXES: Record<string, number> = {
  m: 0,
  masculine: 0,
  м: 0,
  мужской: 0,
  f: 1,
  feminine: 1,
  ж: 0,
  женский: 0,
  n: 2,
  neuter: 2,
  с: 0,
  средний: 0,
  p: 3,
  plural: 3,
};
export const CASE_INDEXES: Record<string, number> = {
  n: 0,
  nominative: 0,
  и: 0,
  именительный: 0,
  g: 1,
  genitive: 1,
  р: 1,
  родительный: 1,
  d: 2,
  dative: 2,
  д: 2,
  дательный: 2,
  a: 3,
  accusative: 3,
  в: 3,
  винительный: 3,
  i: 4,
  instrumental: 4,
  т: 4,
  творительный: 4,
  p: 5,
  prepositional: 5,
  п: 5,
  предложный: 5,
};
// Default values
export const D_CASE = "n";
export const D_PLURAL = false;
export const D_GENDER = "m";
export const D_ANIMATE = true;

/**
 * Python truthiness for the flag kwargs (`plural`, `animate`, `feminine`):
 * empty lists/dicts and zero Decimals are falsy, NaN is truthy.
 */
function truthy(x: unknown): boolean {
  if (typeof x === "number") return x !== 0;
  if (Array.isArray(x)) return x.length > 0;
  if (x instanceof Decimal) return !x.isZero();
  if (x instanceof Map || x instanceof Set) return x.size > 0;
  if (x !== null && typeof x === "object" && Object.getPrototypeOf(x) === Object.prototype) {
    return Object.keys(x).length > 0;
  }
  return Boolean(x);
}

/** Python's TypeError for a keyword argument the method does not take. */
const RU_KWARGS = ["case", "plural", "gender", "animate"] as const;
const CURRENCY_KWARGS = ["currency", "cents", "separator", "adjective"] as const;

/** A gender entry: text or [animate, inanimate]. */
type GenderForm = string | readonly string[];
/** A case entry: text or [gender_1 .. gender_3, plural_4]. */
type CaseForm = string | readonly GenderForm[];
/** {n : [case_1 .. case_5]} */
type Classifier = readonly CaseForm[];
type ClassifierDict = Record<string, Classifier>;

export interface ElementOptions {
  case?: string;
  plural?: unknown;
  gender?: string;
  animate?: unknown;
}

export function getNumElement(
  casesDict: ClassifierDict,
  num: number,
  options: ElementOptions = {},
): string {
  return caseClassifierElement(getItem(casesDict, String(num)), options);
}

export function caseClassifierElement(
  classifier: Classifier,
  options: ElementOptions = {},
): string {
  const caseName = options.case ?? D_CASE;
  const plural = options.plural ?? D_PLURAL;
  const genderName = options.gender ?? D_GENDER;
  const animate = options.animate ?? D_ANIMATE;

  const c = at(classifier, getItem(CASE_INDEXES, caseName));
  if (typeof c === "string") return c;

  let gender: GenderForm;
  if (truthy(plural)) {
    gender = at(c, getItem(GENDER_PLURAL_INDEXES, "plural"));
  } else {
    gender = at(c, getItem(GENDER_PLURAL_INDEXES, genderName));
  }
  if (typeof gender === "string") return gender;

  if (truthy(animate)) return at(gender, 0);
  return at(gender, 1);
}

const rep = <T>(x: T, n: number): T[] => Array.from({ length: n }, () => x);

// format:
// {n : [case_1 .. case_5]}
// case: text or [gender_1 .. gender_3 plural_4]
// gender: text or [animate, inanimate]
export const ONES: ClassifierDict = {
  0: ["ноль", "ноля", "нолю", "ноль", "нолём", "ноле"],
  1: [
    ["один", "одна", "одно", "одни"],
    ["одного", "одной", "одного", "одних"],
    ["одному", "одной", "одному", "одним"],
    [["одного", "один"], "одну", "одно", ["одних", "одни"]],
    ["одним", "одной", "одним", "одними"],
    ["одном", "одной", "одном", "одних"],
  ],
  2: [
    ["два", "две", "два", "двое"],
    [...rep("двух", 3), "двоих"],
    [...rep("двум", 3), "двоим"],
    [["двух", "два"], ["двух", "две"], "два", "двоих"],
    [...rep("двумя", 3), "двоими"],
    [...rep("двух", 3), "двоих"],
  ],
  3: [
    [...rep("три", 3), "трое"],
    [...rep("трёх", 3), "троих"],
    [...rep("трём", 3), "троим"],
    [["трёх", "три"], ["трёх", "три"], "три", "троих"],
    [...rep("тремя", 3), "троими"],
    [...rep("трёх", 3), "троих"],
  ],
  4: [
    [...rep("четыре", 3), "четверо"],
    [...rep("четырёх", 3), "четверых"],
    [...rep("четырём", 3), "четверым"],
    [["четырёх", "четыре"], ["четырёх", "четыре"], "четыре", "четверых"],
    [...rep("четырьмя", 3), "четверыми"],
    [...rep("четырёх", 3), "четверых"],
  ],
  5: ["пять", "пяти", "пяти", "пять", "пятью", "пяти"],
  6: ["шесть", "шести", "шести", "шесть", "шестью", "шести"],
  7: ["семь", "семи", "семи", "семь", "семью", "семи"],
  8: ["восемь", "восьми", "восьми", "восемь", "восемью", "восьми"],
  9: ["девять", "девяти", "девяти", "девять", "девятью", "девяти"],
};

export const ONES_ORD_PREFIXES: Record<string, string> = {
  0: "нулев",
  1: "перв",
  2: "втор",
  4: "четвёрт",
  5: "пят",
  6: "шест",
  7: "седьм",
  8: "восьм",
  9: "девят",
};
export const ONES_ORD_POSTFIXES_GROUPS: Record<string, number> = {
  0: 0,
  1: 1,
  2: 0,
  4: 1,
  5: 1,
  6: 0,
  7: 0,
  8: 0,
  9: 1,
};

/** A postfix: text, a {post_group: text} dict, or a list of either. */
type Postfix = string | Record<number, string> | readonly (string | Record<number, string>)[];
export const CASE_POSTFIXES: readonly (readonly Postfix[])[] = [
  [{ 0: "ой", 1: "ый" }, "ая", "ое", "ые"],
  ["ого", "ой", "ого", "ых"],
  ["ому", "ой", "ому", "ым"],
  [["ого", { 0: "ой", 1: "ый" }], "ую", "ое", ["ых", "ые"]],
  ["ым", "ой", "ым", "ыми"],
  ["ом", "ой", "ом", "ых"],
];

export function getCases(prefix: string, postGroup: number): CaseForm[] {
  return CASE_POSTFIXES.map((c) =>
    c.map((postfix): GenderForm => {
      if (typeof postfix === "string") return prefix + postfix;
      if (Array.isArray(postfix)) {
        return (postfix as readonly (string | Record<number, string>)[]).map((animate) =>
          typeof animate === "string"
            ? prefix + animate
            : prefix + getItem(animate as Record<string, string>, String(postGroup)),
        );
      }
      return prefix + getItem(postfix as Record<string, string>, String(postGroup));
    }),
  );
}

export function getOrdClassifier(
  prefixes: Record<string, string>,
  postGroups: number | Record<string, number>,
): ClassifierDict {
  let groups: Record<string, number>;
  if (typeof postGroups === "number") {
    const g = postGroups;
    groups = Object.fromEntries(Object.keys(prefixes).map((n) => [n, g]));
  } else {
    groups = postGroups;
  }
  return Object.fromEntries(
    Object.entries(prefixes).map(([num, prefix]) => [num, getCases(prefix, getItem(groups, num))]),
  );
}

export const ONES_ORD: ClassifierDict = {
  3: [
    ["третий", "третья", "третье", "третьи"],
    ["третьего", "третьей", "третьего", "третьих"],
    ["третьему", "третьей", "третьему", "третьим"],
    [["третьего", "третий"], "третью", "третье", ["третьих", "третьи"]],
    ["третьим", "третьей", "третьим", "третьими"],
    ["третьем", "третьей", "третьем", "третьих"],
  ],
};
Object.assign(ONES_ORD, getOrdClassifier(ONES_ORD_PREFIXES, ONES_ORD_POSTFIXES_GROUPS));

export const TENS_PREFIXES: Record<string, string> = {
  1: "один",
  2: "две",
  3: "три",
  4: "четыр",
  5: "пят",
  6: "шест",
  7: "сем",
  8: "восем",
  9: "девят",
};
export const TENS_POSTFIXES = ["надцать", "надцати", "надцати", "надцать", "надцатью", "надцати"];
export const TENS: ClassifierDict = {
  0: ["десять", "десяти", "десяти", "десять", "десятью", "десяти"],
};
for (const [num, prefix] of Object.entries(TENS_PREFIXES)) {
  TENS[num] = TENS_POSTFIXES.map((postfix) => prefix + postfix);
}

export const TENS_ORD_PREFIXES: Record<string, string> = { 0: "десят" };
for (const [num, prefix] of Object.entries(TENS_PREFIXES)) {
  TENS_ORD_PREFIXES[num] = `${prefix}надцат`;
}
export const TENS_ORD: ClassifierDict = getOrdClassifier(TENS_ORD_PREFIXES, 1);

export const TWENTIES: ClassifierDict = {
  2: ["двадцать", "двадцати", "двадцати", "двадцать", "двадцатью", "двадцати"],
  3: ["тридцать", "тридцати", "тридцати", "тридцать", "тридцатью", "тридцати"],
  4: ["сорок", "сорока", "сорока", "сорок", "сорока", "сорока"],
  5: ["пятьдесят", "пятидесяти", "пятидесяти", "пятьдесят", "пятьюдесятью", "пятидесяти"],
  6: ["шестьдесят", "шестидесяти", "шестидесяти", "шестьдесят", "шестьюдесятью", "шестидесяти"],
  7: ["семьдесят", "семидесяти", "семидесяти", "семьдесят", "семьюдесятью", "семидесяти"],
  8: [
    "восемьдесят",
    "восьмидесяти",
    "восьмидесяти",
    "восемьдесят",
    "восемьюдесятью",
    "восьмидесяти",
  ],
  9: ["девяносто", "девяноста", "девяноста", "девяносто", "девяноста", "девяноста"],
};

export const TWENTIES_ORD_PREFIXES: Record<string, string> = {
  2: "двадцат",
  3: "тридцат",
  4: "сороков",
  5: "пятидесят",
  6: "шестидесят",
  7: "семидесят",
  8: "восьмидесят",
  9: "девяност",
};
export const TWENTIES_ORD_POSTFIXES_GROUPS: Record<string, number> = {
  2: 1,
  3: 1,
  4: 0,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
  9: 1,
};
export const TWENTIES_ORD: ClassifierDict = getOrdClassifier(
  TWENTIES_ORD_PREFIXES,
  TWENTIES_ORD_POSTFIXES_GROUPS,
);

export const HUNDREDS: ClassifierDict = {
  1: ["сто", "ста", "ста", "сто", "ста", "ста"],
  2: ["двести", "двухсот", "двумстам", "двести", "двумястами", "двухстах"],
  3: ["триста", "трёхсот", "трёмстам", "триста", "тремястами", "трёхстах"],
  4: ["четыреста", "четырёхсот", "четырёмстам", "четыреста", "четырьмястами", "четырёхстах"],
  5: ["пятьсот", "пятисот", "пятистам", "пятьсот", "пятьюстами", "пятистах"],
  6: ["шестьсот", "шестисот", "шестистам", "шестьсот", "шестьюстами", "шестистах"],
  7: ["семьсот", "семисот", "семистам", "семьсот", "семьюстами", "семистах"],
  8: ["восемьсот", "восьмисот", "восьмистам", "восемьсот", "восемьюстами", "восьмистах"],
  9: ["девятьсот", "девятисот", "девятистам", "девятьсот", "девятьюстами", "девятистах"],
};

export const HUNDREDS_ORD_PREFIXES: Record<string, string> = Object.fromEntries(
  Object.entries(HUNDREDS).map(([num, c]) => [num, num !== "1" ? (c[1] as string) : "сот"]),
);
export const HUNDREDS_ORD: ClassifierDict = getOrdClassifier(HUNDREDS_ORD_PREFIXES, 1);

export const THOUSANDS_PREFIXES: Record<string, string> = {
  2: "миллион",
  3: "миллиард",
  4: "триллион",
  5: "квадриллион",
  6: "квинтиллион",
  7: "секстиллион",
  8: "септиллион",
  9: "октиллион",
  10: "нониллион",
};
export const THOUSANDS_POSTFIXES: readonly (readonly string[])[] = [
  ["", "а", "ов"],
  ["а", "ов", "ов"],
  ["у", "ам", "ам"],
  ["", "а", "ов"],
  ["ом", "ами", "ами"],
  ["е", "ах", "ах"],
];
export const THOUSANDS: Record<string, (readonly string[])[]> = {
  1: [
    ["тысяча", "тысячи", "тысяч"],
    ["тысячи", "тысяч", "тысяч"],
    ["тысяче", "тысячам", "тысячам"],
    ["тысячу", "тысячи", "тысяч"],
    ["тысячей", "тысячами", "тысячами"],
    ["тысяче", "тысячах", "тысячах"],
  ],
};
for (const [num, prefix] of Object.entries(THOUSANDS_PREFIXES)) {
  THOUSANDS[num] = THOUSANDS_POSTFIXES.map((c) => c.map((postfix) => prefix + postfix));
}

export function getThousandsElements(num: number, caseName: string): readonly string[] {
  return at(getItem(THOUSANDS, String(num)), getItem(CASE_INDEXES, caseName));
}

export const THOUSANDS_ORD_PREFIXES: Record<string, string> = { 1: "тысячн" };
for (const [num, prefix] of Object.entries(THOUSANDS_PREFIXES)) {
  THOUSANDS_ORD_PREFIXES[num] = `${prefix}н`;
}
export const THOUSANDS_ORD: ClassifierDict = getOrdClassifier(THOUSANDS_ORD_PREFIXES, 1);

export interface RuOptions {
  case?: string;
  plural?: unknown;
  gender?: string;
  animate?: unknown;
}

export interface Int2WordOptions extends RuOptions {
  feminine?: unknown;
  cardinal?: boolean;
}

export class Num2Word_RU extends Num2Word_Base {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    RUB: [
      ["рубль", "рубля", "рублей"],
      ["копейка", "копейки", "копеек"],
    ],
    EUR: [
      ["евро", "евро", "евро"],
      ["цент", "цента", "центов"],
    ],
    USD: [
      ["доллар", "доллара", "долларов"],
      ["цент", "цента", "центов"],
    ],
    UAH: [
      ["гривна", "гривны", "гривен"],
      ["копейка", "копейки", "копеек"],
    ],
    KZT: [
      ["тенге", "тенге", "тенге"],
      ["тиын", "тиына", "тиынов"],
    ],
    BYN: [
      ["белорусский рубль", "белорусских рубля", "белорусских рублей"],
      ["копейка", "копейки", "копеек"],
    ],
    UZS: [
      ["сум", "сума", "сумов"],
      ["тийин", "тийина", "тийинов"],
    ],
    PLN: [
      ["польский злотый", "польских слотых", "польских злотых"],
      ["грош", "гроша", "грошей"],
    ],
  };

  declare pointwordForms: CurrencyForm;
  declare pointwordOrd: CaseForm[];

  override setup(): void {
    this.negword = "минус";
    // Upstream stores the tuple in `self.pointword`; the base class types
    // `pointword` as a string, so the forms live in `pointwordForms` (only
    // RU's own toCardinal reads them).
    this.pointwordForms = ["целая", "целых", "целых"];
    this.pointwordOrd = getCases("цел", 1);
  }

  override toCardinal(number: PyNum, options: RuOptions = {}): string {
    checkKwargs(options, RU_KWARGS, "to_cardinal");
    const caseName = options.case ?? D_CASE;
    const plural = options.plural ?? D_PLURAL;
    const gender = options.gender ?? D_GENDER;
    const animate = options.animate ?? D_ANIMATE;
    const n = str(number).replace(/,/g, ".");
    if (n.includes(".")) {
      const parts = n.split(".");
      if (parts.length !== 2) {
        throw new ValueError(`too many values to unpack (expected 2)`);
      }
      const [left, right] = parts as [string, string];
      const decimalPart = this._int2word(int(right), { cardinal: true, gender: "f" });
      return `${this._int2word(int(left), { cardinal: true, gender: "f" })} ${this.pluralize(
        int(left),
        this.pointwordForms,
      )} ${decimalPart} ${this._decimalBitness(right)}`;
    }
    return this._int2word(int(n), {
      cardinal: true,
      case: caseName,
      plural,
      gender,
      animate,
    });
  }

  private _decimalBitness(n: string): string {
    if (n.slice(-1) === "1" && n.slice(-2) !== "11") {
      return this._int2word(10n ** BigInt(n.length), { cardinal: false, gender: "f" });
    }
    return this._int2word(10n ** BigInt(n.length), { cardinal: false, case: "g", plural: true });
  }

  override pluralize(n: bigint, forms: CurrencyForm): string {
    const m100 = mod(n, 100n);
    if (m100 === 11n || m100 === 12n || m100 === 13n || m100 === 14n) {
      return at(forms, 2);
    }
    const m10 = mod(n, 10n);
    if (m10 === 1n) return at(forms, 0);
    if (m10 === 2n || m10 === 3n || m10 === 4n) return at(forms, 1);
    return at(forms, 2);
  }

  override toOrdinal(number: PyNum, options: RuOptions = {}): string {
    checkKwargs(options, RU_KWARGS, "to_ordinal");
    const caseName = options.case ?? D_CASE;
    const plural = options.plural ?? D_PLURAL;
    const gender = options.gender ?? D_GENDER;
    const animate = options.animate ?? D_ANIMATE;
    this.verifyOrdinal(number);
    const n = str(number).replace(/,/g, ".");
    return this._int2word(int(n), { cardinal: false, case: caseName, plural, gender, animate });
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    checkKwargs(options, CURRENCY_KWARGS, "to_currency");
    return super.toCurrency(val, options);
  }

  protected override _moneyVerbose(number: bigint, currency: string): string {
    if (currency === "UAH") return this._int2word(number, { gender: "f" });
    return this._int2word(number, { gender: "m" });
  }

  protected override _centsVerbose(number: bigint, currency: string): string {
    if (currency === "UAH" || currency === "RUB" || currency === "BYN") {
      return this._int2word(number, { gender: "f" });
    }
    return this._int2word(number, { gender: "m" });
  }

  /**
   * n: number
   * feminine: not used - for backward compatibility
   * cardinal: true - cardinal, false - ordinal
   * case: 'n' - nominative, 'g' - genitive, 'd' - dative, 'a' - accusative,
   *       'i' - instrumental, 'p' - prepositional
   * plural: true - plural, false - singular
   * gender: 'f' - masculine, 'm' - feminine, 'n' - neuter
   * animate: true - animate, false - inanimate
   */
  _int2word(n: bigint, options: Int2WordOptions = {}): string {
    const feminine = options.feminine ?? false;
    const cardinal = options.cardinal ?? true;
    const caseName = options.case ?? D_CASE;
    const plural = options.plural ?? D_PLURAL;
    let gender = options.gender ?? D_GENDER;
    const animate = options.animate ?? D_ANIMATE;
    // For backward compatibility
    if (truthy(feminine)) gender = "f";

    const kwargs: ElementOptions = { case: caseName, plural, gender, animate };

    if (n < 0n) {
      return [this.negword, this._int2word(abs(n), { cardinal, ...kwargs })].join(" ");
    }

    if (n === 0n) {
      return cardinal ? getNumElement(ONES, 0, kwargs) : getNumElement(ONES_ORD, 0, kwargs);
    }

    const words: string[] = [];
    const chunks = [...splitbyx(n.toString(), 3)];
    const ordJoin = at(chunks, -1) === 0n; // join in one word if ending on 'тысячный'
    let i = chunks.length;
    let maxNonzero = -1;
    chunks.forEach((e, idx) => {
      if (e !== 0n) maxNonzero = idx;
    });
    const rightestNonzeroChunkI = i - 1 - maxNonzero;
    for (const x of chunks) {
      let chunkWords: string[] = [];
      i -= 1;

      if (x === 0n) continue;

      const [n1, n2, n3] = getDigits(x) as [number, number, number];

      if (cardinal) {
        chunkWords.push(...this._chunkCardianl(n3, n2, n1, i, kwargs));
        if (i > 0) {
          chunkWords.push(this.pluralize(x, getThousandsElements(i, caseName)));
        }
      } else if (!(ordJoin && rightestNonzeroChunkI === i)) {
        // ordinal, not joined like 'двухтысячный'
        chunkWords.push(...this._chunkOrdinal(n3, n2, n1, i, kwargs));
        if (i > 0) {
          const tCase = rightestNonzeroChunkI === i ? caseName : "n";
          chunkWords.push(this.pluralize(x, getThousandsElements(i, tCase)));
        }
      } else {
        // ordinal, joined
        chunkWords.push(...this._chunkOrdinalJoin(n3, n2, n1, i, kwargs));
        if (i > 0) {
          chunkWords.push(getNumElement(THOUSANDS_ORD, i, kwargs));
        }
        chunkWords = [chunkWords.join("")];
      }

      words.push(...chunkWords);
    }

    return words.join(" ");
  }

  private _chunkCardianl(
    hundreds: number,
    tens: number,
    ones: number,
    chunkNum: number,
    kwargs: ElementOptions,
  ): string[] {
    const words: string[] = [];
    if (hundreds > 0) words.push(getNumElement(HUNDREDS, hundreds, kwargs));

    if (tens > 1) words.push(getNumElement(TWENTIES, tens, kwargs));

    if (tens === 1) {
      words.push(getNumElement(TENS, ones, kwargs));
    } else if (ones > 0) {
      let wOnes: string;
      if (chunkNum === 0) {
        wOnes = getNumElement(ONES, ones, kwargs);
      } else if (chunkNum === 1) {
        // Thousands are feminine
        wOnes = getNumElement(ONES, ones, { ...kwargs, gender: "f" });
      } else {
        wOnes = getNumElement(ONES, ones, kwargs);
      }
      words.push(wOnes);
    }
    return words;
  }

  private _chunkOrdinal(
    hundreds: number,
    tens: number,
    ones: number,
    chunkNum: number,
    kwargs: ElementOptions,
  ): string[] {
    const words: string[] = [];
    if (hundreds > 0) {
      if (tens === 0 && ones === 0) {
        words.push(getNumElement(HUNDREDS_ORD, hundreds, kwargs));
      } else {
        words.push(getNumElement(HUNDREDS, hundreds));
      }
    }

    if (tens > 1) {
      if (ones === 0) {
        words.push(getNumElement(TWENTIES_ORD, tens, kwargs));
      } else {
        words.push(getNumElement(TWENTIES, tens));
      }
    }

    if (tens === 1) {
      words.push(getNumElement(TENS_ORD, ones, kwargs));
    } else if (ones > 0) {
      let wOnes: string | null;
      if (chunkNum === 0) {
        wOnes = getNumElement(ONES_ORD, ones, kwargs);
      } else if (chunkNum > 0 && ones === 1 && hundreds === 0 && tens === 0) {
        // тысячный, миллионнный и т.д.
        wOnes = null;
      } else if (chunkNum === 1) {
        // Thousands are feminine
        wOnes = getNumElement(ONES, ones, { gender: "f" });
      } else {
        wOnes = getNumElement(ONES, ones);
      }

      if (wOnes) words.push(wOnes);
    }

    return words;
  }

  private _chunkOrdinalJoin(
    hundreds: number,
    tens: number,
    ones: number,
    chunkNum: number,
    kwargs: ElementOptions,
  ): string[] {
    const words: string[] = [];

    if (hundreds > 1) {
      words.push(getNumElement(HUNDREDS, hundreds, { case: "g" }));
    } else if (hundreds === 1) {
      words.push(getNumElement(HUNDREDS, hundreds)); // стО, not стА
    }

    if (tens === 9) {
      words.push(getNumElement(TWENTIES, tens)); // девяностО, not А
    } else if (tens > 1) {
      words.push(getNumElement(TWENTIES, tens, { case: "g" }));
    }

    if (tens === 1) {
      words.push(getNumElement(TENS, ones, { case: "g" }));
    } else if (ones > 0) {
      let wOnes: string | null;
      if (chunkNum === 0) {
        wOnes = getNumElement(ONES_ORD, ones, kwargs);
      } else if (chunkNum > 0 && ones === 1 && tens !== 1) {
        // тысячный, миллионнный и т.д., двадцатиодномиллионный
        if (tens === 0 && hundreds === 0) {
          wOnes = null;
        } else {
          wOnes = getNumElement(ONES, 1, { gender: "n" });
        }
      } else {
        wOnes = getNumElement(ONES, ones, { case: "g" });
      }

      if (wOnes) words.push(wOnes);
    }

    return words;
  }
}
