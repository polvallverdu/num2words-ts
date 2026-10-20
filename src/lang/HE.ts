// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_HE.py

import { type CurrencyForm, type CurrencyForms, Num2Word_Base } from "../base.ts";
import { toS } from "../compat.ts";
import { parseCurrencyParts } from "../currency.ts";
import {
  AssertionError,
  abs,
  at,
  cmp,
  eq,
  float,
  getItem,
  int,
  mod,
  NotImplementedError,
  OverflowError,
  type PyNum,
  str,
} from "../py.ts";
import { getDigits, splitbyx } from "../utils.ts";

export const ZERO = ["אפס"];

export const ONES: Record<number, string[]> = {
  1: ["אחת", "אחד", "אחת", "אחד", "ראשונה", "ראשון", "ראשונות", "ראשונים"],
  2: ["שתיים", "שניים", "שתי", "שני", "שנייה", "שני", "שניות", "שניים"],
  3: ["שלוש", "שלושה", "שלוש", "שלושת", "שלישית", "שלישי", "שלישיות", "שלישיים"],
  4: ["ארבע", "ארבעה", "ארבע", "ארבעת", "רביעית", "רביעי", "רביעיות", "רביעיים"],
  5: ["חמש", "חמישה", "חמש", "חמשת", "חמישית", "חמישי", "חמישיות", "חמישיים"],
  6: ["שש", "שישה", "שש", "ששת", "שישית", "שישי", "שישיות", "שישיים"],
  7: ["שבע", "שבעה", "שבע", "שבעת", "שביעית", "שביעי", "שביעיות", "שביעיים"],
  8: ["שמונה", "שמונה", "שמונה", "שמונת", "שמינית", "שמיני", "שמיניות", "שמיניים"],
  9: ["תשע", "תשעה", "תשע", "תשעת", "תשיעית", "תשיעי", "תשיעיות", "תשיעיים"],
};

export const TENS: Record<number, string[]> = {
  0: ["עשר", "עשרה", "עשר", "עשרת", "עשירית", "עשירי", "עשיריות", "עשיריים"],
  1: ["עשרה", "עשר"],
  2: ["שתים עשרה", "שנים עשר"],
};

export const TWENTIES: Record<number, string[]> = {
  2: ["עשרים"],
  3: ["שלושים"],
  4: ["ארבעים"],
  5: ["חמישים"],
  6: ["שישים"],
  7: ["שבעים"],
  8: ["שמונים"],
  9: ["תשעים"],
};

export const HUNDREDS: Record<number, string[]> = {
  1: ["מאה", "מאת"],
  2: ["מאתיים"],
  3: ["מאות"],
};

export const THOUSANDS: Record<number, string[]> = {
  1: ["אלף"],
  2: ["אלפיים"],
  3: ["אלפים", "אלפי"],
};

export const LARGE: Record<number, string[]> = {
  1: ["מיליון", "מיליוני"],
  2: ["מיליארד", "מיליארדי"],
  3: ["טריליון", "טריליוני"],
  4: ["קוודריליון", "קוודריליוני"],
  5: ["קווינטיליון", "קווינטיליוני"],
  6: ["סקסטיליון", "סקסטיליוני"],
  7: ["ספטיליון", "ספטיליוני"],
  8: ["אוקטיליון", "אוקטיליוני"],
  9: ["נוניליון", "נוניליוני"],
  10: ["דסיליון", "דסיליוני"],
  11: ["אונדסיליון", "אונדסיליוני"],
  12: ["דואודסיליון", "דואודסיליוני"],
  13: ["טרדסיליון", "טרדסיליוני"],
  14: ["קווטואורדסיליון", "קווטואורדסיליוני"],
  15: ["קווינדסיליון", "קווינדסיליוני"],
  16: ["סקסדסיליון", "סקסדסיליוני"],
  17: ["ספטנדסיליון", "ספטנדסיליוני"],
  18: ["אוקטודסיליון", "אוקטודסיליוני"],
  19: ["נובמדסיליון", "נובמדסיליוני"],
  20: ["ויגינטיליון", "ויגינטיליוני"],
};

export const AND = "ו";

export const DEF = "ה";

export const MAXVAL = BigInt(`1${"0".repeat(66)}`);

export { AssertionError };

function look(d: Record<number, string[]>, k: number): string[] {
  return getItem(d as Record<string, string[]>, String(k));
}

export interface ChunkOptions {
  gender?: string;
  construct?: boolean;
  ordinal?: boolean;
  plural?: boolean;
}

export function chunk2word(n: bigint, i: number, x: bigint, options: ChunkOptions = {}): string[] {
  const gender = options.gender ?? "f";
  const construct = options.construct ?? false;
  const ordinal = options.ordinal ?? false;
  const plural = options.plural ?? false;
  const words: string[] = [];
  const [n1, n2, n3] = getDigits(x) as [number, number, number];

  if (n3 > 0) {
    if (construct && n === 100n) {
      words.push(at(look(HUNDREDS, n3), 1));
    } else if (n3 <= 2) {
      words.push(at(look(HUNDREDS, n3), 0));
    } else {
      words.push(`${at(look(ONES, n3), 0)} ${at(look(HUNDREDS, 3), 0)}`);
    }
  }

  if (n2 > 1) {
    words.push(at(look(TWENTIES, n2), 0));
  }

  if (i === 0 || x >= 11n) {
    const male = gender === "m" || i > 0 ? 1 : 0;
    const cop =
      (2 * (construct && i === 0 ? 1 : 0) + 4 * (ordinal ? 1 : 0) + 2 * (plural ? 1 : 0)) *
      (n < 11n ? 1 : 0);
    if (n2 === 1) {
      if (n1 === 0) {
        words.push(at(look(TENS, n1), male + cop));
      } else if (n1 === 2) {
        words.push(at(look(TENS, n1), male));
      } else {
        words.push(`${at(look(ONES, n1), male)} ${at(look(TENS, 1), male)}`);
      }
    } else if (n1 > 0) {
      words.push(at(look(ONES, n1), male + cop));
    }
  }

  const constructLast = construct && mod(n, 1000n ** BigInt(i)) === 0n ? 1 : 0;

  if (i === 1) {
    if (x >= 11n) {
      words[words.length - 1] = `${at(words, -1)} ${at(look(THOUSANDS, 1), 0)}`;
    } else if (n1 === 0) {
      words.push(`${at(look(TENS, 0), 3)} ${at(look(THOUSANDS, 3), constructLast)}`);
    } else if (n1 <= 2) {
      words.push(at(look(THOUSANDS, n1), 0));
    } else {
      words.push(`${at(look(ONES, n1), 3)} ${at(look(THOUSANDS, 3), constructLast)}`);
    }
  } else if (i > 1) {
    if (x >= 11n) {
      words[words.length - 1] = `${at(words, -1)} ${at(look(LARGE, i - 1), constructLast)}`;
    } else if (n1 === 0) {
      words.push(
        `${at(look(TENS, 0), 1 + 2 * constructLast)} ${at(look(LARGE, i - 1), constructLast)}`,
      );
    } else if (n1 === 1) {
      words.push(at(look(LARGE, i - 1), 0));
    } else {
      words.push(
        `${at(look(ONES, n1), 1 + 2 * (constructLast || x === 2n ? 1 : 0))} ${at(look(LARGE, i - 1), constructLast)}`,
      );
    }
  }

  return words;
}

export interface Int2WordOptions {
  gender?: string;
  construct?: boolean;
  ordinal?: boolean;
  definite?: boolean;
  plural?: boolean;
}

export function int2word(n: bigint, options: Int2WordOptions = {}): string {
  const gender = options.gender ?? "f";
  const construct = options.construct ?? false;
  const ordinal = options.ordinal ?? false;
  const definite = options.definite ?? false;
  const plural = options.plural ?? false;
  if (!(!construct || !ordinal)) throw new AssertionError();
  if (!(ordinal || (!definite && !plural))) throw new AssertionError();
  if (n >= MAXVAL) {
    throw new OverflowError(`abs(${n}) must be less than ${MAXVAL}.`);
  }

  if (n === 0n) {
    if (ordinal) return DEF + (ZERO[0] as string);
    return ZERO[0] as string;
  }

  let words: string[] = [];

  const chunks = [...splitbyx(n.toString(), 3)];
  let i = chunks.length;
  for (const x of chunks) {
    i -= 1;

    if (x === 0n) continue;

    words = words.concat(chunk2word(n, i, x, { gender, construct, ordinal, plural }));

    // https://hebrew-academy.org.il/2017/01/30/%D7%95-%D7%94%D7%97%D7%99%D7%91%D7%95%D7%A8-%D7%91%D7%9E%D7%A1%D7%A4%D7%A8%D7%99%D7%9D
    if (words.length > 1) {
      words[words.length - 1] = AND + at(words, -1);
    }
  }

  if (ordinal && (n >= 11n || definite)) {
    words[0] = DEF + at(words, 0);
  }

  return words.join(" ");
}

export interface CardinalOptionsHE {
  gender?: string;
  construct?: boolean;
}

export interface OrdinalOptionsHE {
  gender?: string;
  definite?: boolean;
  plural?: boolean;
}

export interface CurrencyOptionsHE {
  currency?: string;
  cents?: boolean;
  separator?: string;
  adjective?: boolean;
  preferSingular?: boolean;
  preferSingularCents?: boolean;
}

export interface PluralizeOptionsHE {
  currency?: string | null;
  preferSingular?: boolean;
}

export class Num2Word_HE extends Num2Word_Base {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    ILS: [
      ["שקל", "שקלים"],
      ["אגורה", "אגורות"],
    ],
    EUR: [
      ["אירו", "אירו"],
      ["סנט", "סנטים"],
    ],
    USD: [
      ["דולר", "דולרים"],
      ["סנט", "סנטים"],
    ],
  };

  static CURRENCY_GENDERS: Record<string, [string, string]> = {
    ILS: ["m", "f"],
    EUR: ["m", "m"],
    USD: ["m", "m"],
  };

  declare makaf: string;

  constructor(makaf = "-") {
    super();
    this.makaf = makaf;
  }

  override setup(): void {
    super.setup();
    this.negword = "מינוס";
    this.pointword = "נקודה";
    this.MAXVAL = MAXVAL;
  }

  override toCardinalFloat(value: PyNum | string, options: { gender?: string } = {}): string {
    const gender = options.gender ?? "f";
    try {
      float(value);
    } catch {
      throw new TypeError(this.errmsgNonnum.replace("%s", str(value)));
    }

    const [pre, postInt] = this.float2tuple(float(value));

    let post = postInt.toString();
    post = "0".repeat(Math.max(0, this.precision - post.length)) + post;

    const out = [this.toCardinal(pre, { gender })];
    if (this.precision) {
      out.push(this.title(this.pointword));
    }

    for (let i = 0; i < this.precision; i++) {
      const curr = int(at(post, i));
      out.push(toS(this.toCardinal(curr)));
    }

    return out.join(" ");
  }

  override toCardinal(value: PyNum, options: CardinalOptionsHE = {}): string {
    const gender = options.gender ?? "f";
    const construct = options.construct ?? false;
    let integral: boolean;
    try {
      integral = eq(int(value), value);
    } catch (e) {
      // int(inf) raises OverflowError, which upstream does not catch.
      if (e instanceof OverflowError) throw e;
      integral = false;
    }
    if (!integral) {
      // https://hebrew-academy.org.il/2019/12/03/%D7%A2%D7%9C-%D7%94%D7%91%D7%A2%D7%AA-%D7%94%D7%9E%D7%A1%D7%A4%D7%A8-%D7%94%D7%9E%D7%A2%D7%95%D7%A8%D7%91
      return this.toCardinalFloat(value, { gender });
    }

    let out = "";
    if (cmp(value, 0n) < 0) {
      value = abs(value);
      out = `${this.negword.trim()} `;
    }

    if (cmp(value, this.MAXVAL) >= 0) {
      throw new OverflowError(
        this.errmsgToobig.replace("%s", str(value)).replace("%s", str(this.MAXVAL)),
      );
    }

    return out + int2word(int(value), { gender, construct });
  }

  override toOrdinal(value: PyNum, options: OrdinalOptionsHE = {}): string {
    const gender = options.gender ?? "m";
    const definite = options.definite ?? false;
    const plural = options.plural ?? false;
    this.verifyOrdinal(value);

    if (cmp(value, this.MAXVAL) >= 0) {
      throw new OverflowError(
        this.errmsgToobig.replace("%s", str(value)).replace("%s", str(this.MAXVAL)),
      );
    }

    return int2word(int(value), { gender, ordinal: true, definite, plural });
  }

  override pluralize(n: bigint, forms: CurrencyForm, options: PluralizeOptionsHE = {}): string {
    const currency = options.currency ?? null;
    const preferSingular = options.preferSingular ?? false;
    let form = 1;
    if (n === 1n || (preferSingular && (abs(n) >= 11n || n === 0n || currency !== "ILS"))) {
      form = 0;
    }
    return at(forms, form);
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptionsHE = {}): string {
    const currency = options.currency ?? "ILS";
    const cents = options.cents ?? true;
    let separator = options.separator ?? AND;
    const preferSingular = options.preferSingular ?? false;
    const preferSingularCents = options.preferSingularCents ?? false;
    const [left, right, isNegative] = parseCurrencyParts(val);

    if (!separator.startsWith(" ")) {
      separator = ` ${separator}`;
    }

    const forms = Object.hasOwn(this.cls.CURRENCY_FORMS, currency)
      ? this.cls.CURRENCY_FORMS[currency]
      : undefined;
    if (!forms) {
      throw new NotImplementedError(
        `Currency code "${currency}" not implemented for "${this.constructor.name}"`,
      );
    }
    const [cr1, cr2] = forms;

    const minusStr = isNegative ? `${this.negword.trim()} ` : "";
    const genders = (this.constructor as typeof Num2Word_HE).CURRENCY_GENDERS;
    const [gender1, gender2] = Object.hasOwn(genders, currency)
      ? (genders[currency] as [string, string])
      : ["", ""];

    const moneyStr = this.toCardinal(left, { gender: gender1, construct: left === 2n });
    let centsStr: string;
    if (cents) {
      centsStr = this.toCardinal(right, { gender: gender2, construct: right === 2n });
    } else {
      centsStr = this._centsTerse(right, currency);
      const sepParts = separator.split(/\s+/).filter(Boolean);
      if (sepParts.length && sepParts[sepParts.length - 1] === AND) {
        separator += this.makaf;
      }
    }

    const strings = [
      minusStr,
      moneyStr,
      this.pluralize(left, cr1, { currency, preferSingular }),
      separator,
      centsStr,
      this.pluralize(right, cr2, { currency, preferSingular: preferSingularCents }),
    ];
    if (left === 1n) {
      [strings[1], strings[2]] = [strings[2] as string, strings[1] as string];
    }
    if (right === 1n) {
      [strings[4], strings[5]] = [strings[5] as string, strings[4] as string];
    }
    // In Hebrew the separator is along with the following word
    const [s0, s1, s2, s3, s4, s5] = strings;
    return `${s0}${s1} ${s2}${s3}${s4} ${s5}`;
  }
}
