// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_PT.py

import type { CurrencyForm, CurrencyForms, CurrencyOptions, WordPair } from "../base.ts";
import { abs, cmp, getItem, int, type PyNum, str } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

const DOLLAR: CurrencyForm = ["dólar", "dólares"];
const CENTS: CurrencyForm = ["cêntimo", "cêntimos"];

/** Python's `\w` (Unicode word character) for building regexes. */
export const W = "[\\p{L}\\p{N}_]";

/**
 * Python raises TypeError when a method gets a keyword argument its signature
 * does not declare (e.g. `num2words(1, lang="pt", gender="f")`).
 */
export function checkKwargs(fn: string, options: object | undefined, allowed: string[] = []): void {
  for (const key of Object.keys(options ?? {})) {
    if (!allowed.includes(key)) {
      throw new TypeError(`${fn}() got an unexpected keyword argument '${key}'`);
    }
  }
}

export interface YearOptions {
  longval?: boolean;
}

export class Num2Word_PT extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    AUD: [DOLLAR, CENTS],
    CAD: [DOLLAR, CENTS],
    EUR: [["euro", "euros"], CENTS],
    GBP: [
      ["libra", "libras"],
      ["péni", "pence"],
    ],
    USD: [DOLLAR, CENTS],
  };

  static override GIGA_SUFFIX: string | null = null;
  static override MEGA_SUFFIX: string | null = "ilião";

  declare ords: Record<string, string>[];
  declare thousandSeparators: Record<string, string>;
  declare hundreds: Record<string, string>;

  override setup(): void {
    super.setup();
    const lows = ["quatr", "tr", "b", "m"];
    this.highNumwords = this.genHighNumwords([], [], lows);
    this.negword = "menos ";
    this.pointword = "vírgula";
    this.excludeTitle = ["e", "vírgula", "menos"];

    this.midNumwords = [
      [1000n, "mil"],
      [100n, "cem"],
      [90n, "noventa"],
      [80n, "oitenta"],
      [70n, "setenta"],
      [60n, "sessenta"],
      [50n, "cinquenta"],
      [40n, "quarenta"],
      [30n, "trinta"],
    ];
    this.lowNumwords = [
      "vinte",
      "dezanove",
      "dezoito",
      "dezassete",
      "dezasseis",
      "quinze",
      "catorze",
      "treze",
      "doze",
      "onze",
      "dez",
      "nove",
      "oito",
      "sete",
      "seis",
      "cinco",
      "quatro",
      "três",
      "dois",
      "um",
      "zero",
    ];
    this.ords = [
      {
        0: "",
        1: "primeiro",
        2: "segundo",
        3: "terceiro",
        4: "quarto",
        5: "quinto",
        6: "sexto",
        7: "sétimo",
        8: "oitavo",
        9: "nono",
      },
      {
        0: "",
        1: "décimo",
        2: "vigésimo",
        3: "trigésimo",
        4: "quadragésimo",
        5: "quinquagésimo",
        6: "sexagésimo",
        7: "septuagésimo",
        8: "octogésimo",
        9: "nonagésimo",
      },
      {
        0: "",
        1: "centésimo",
        2: "ducentésimo",
        3: "tricentésimo",
        4: "quadrigentésimo",
        5: "quingentésimo",
        6: "seiscentésimo",
        7: "septigentésimo",
        8: "octigentésimo",
        9: "nongentésimo",
      },
    ];
    this.thousandSeparators = {
      3: "milésimo",
      6: "milionésimo",
      9: "milésimo milionésimo",
      12: "bilionésimo",
      15: "milésimo bilionésimo",
    };
    this.hundreds = {
      1: "cento",
      2: "duzentos",
      3: "trezentos",
      4: "quatrocentos",
      5: "quinhentos",
      6: "seiscentos",
      7: "setecentos",
      8: "oitocentos",
      9: "novecentos",
    };
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    let [ctext, cnum] = curr;
    let [ntext, nnum] = next;

    if (cnum === 1n) {
      if (nnum < 1000000n) return next;
      ctext = "um";
    } else if (cnum === 100n && !(nnum % 1000n === 0n)) {
      ctext = "cento";
    }

    if (nnum < cnum) {
      if (cnum < 100n) return [`${ctext} e ${ntext}`, cnum + nnum];
      return [`${ctext} e ${ntext}`, cnum + nnum];
    } else if (!(nnum % 1000000000n) && cnum > 1n) {
      ntext = `${ntext.slice(0, -4)}liões`;
    } else if (!(nnum % 1000000n) && cnum > 1n) {
      ntext = `${ntext.slice(0, -4)}lhões`;
    }
    // correct "milião" to "milhão"
    if (ntext === "milião") ntext = "milhão";
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
    let result = super.toCardinal(value);

    // Transforms "mil e cento e catorze" into "mil cento e catorze"
    // Transforms "cem milhões e duzentos mil e duzentos e dez" em "cem
    // milhões duzentos mil duzentos e dez" but "cem milhões e duzentos
    // mil e duzentos" in "cem milhões duzentos mil e duzentos" and not in
    // "cem milhões duzentos mil duzentos"
    for (const ext of [
      "mil",
      "milhão",
      "milhões",
      "mil milhões",
      "bilião",
      "biliões",
      "mil biliões",
    ]) {
      if (new RegExp(`^.*${ext} e ${W}*entos? (?=.*e)`, "u").test(result)) {
        result = result.replaceAll(`${ext} e`, `${ext}`);
      }
    }

    return result;
  }

  // for the ordinal conversion the code is similar to pt_BR code,
  // although there are other rules that are probably more correct in
  // Portugal. Concerning numbers from 2000th on, saying "dois
  // milésimos" instead of "segundo milésimo" (the first number
  // would be used in the cardinal form instead of the ordinal) is better.
  // This was not implemented.
  // source:
  // https://ciberduvidas.iscte-iul.pt/consultorio/perguntas/a-forma-por-extenso-de-2000-e-de-outros-ordinais/16428
  override toOrdinal(value: PyNum, options?: object): string {
    checkKwargs("to_ordinal", options);
    // Before changing this function remember this is used by pt-BR
    // so act accordingly
    this.verifyOrdinal(value);

    const parts: string[] = [];
    const s = str(value);
    let thousandSeparator = "";

    const reversed = [...s].reverse();
    for (let idx = 0; idx < reversed.length; idx++) {
      const char = reversed[idx] as string;
      if (idx && idx % 3 === 0) {
        thousandSeparator = getItem(this.thousandSeparators, idx.toString());
      }

      if (char !== "0" && thousandSeparator) {
        // avoiding "segundo milionésimo milésimo" for 6000000,
        // for instance
        parts.push(thousandSeparator);
        thousandSeparator = "";
      }

      parts.push(getItem(this.ords[idx % 3] as Record<string, string>, int(char).toString()));
    }

    let result = parts.reverse().join(" ");
    result = result.trim();
    result = result.replace(/\s+/g, " ");

    if (result.startsWith("primeiro") && s !== "1") {
      // avoiding "primeiro milésimo", "primeiro milionésimo" and so on
      result = result.slice(9);
    }

    return result;
  }

  override toOrdinalNum(value: PyNum, options?: object): string {
    checkKwargs("to_ordinal_num", options);
    // Before changing this function remember this is used by pt-BR
    // so act accordingly
    this.verifyOrdinal(value);
    return `${str(value)}º`;
  }

  override toYear(val: PyNum, options: YearOptions = {}): string {
    checkKwargs("to_year", options, ["longval"]);
    // Before changing this function remember this is used by pt-BR
    // so act accordingly
    if (cmp(val, 0n) < 0) {
      return `${this.toCardinal(abs(val))} antes de Cristo`;
    }
    return this.toCardinal(val);
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    checkKwargs("to_currency", options, ["currency", "cents", "separator", "adjective"]);
    const currency = options.currency ?? "EUR";
    const cents = options.cents ?? true;
    const separator = options.separator ?? " e";
    const adjective = options.adjective ?? false;
    // change negword because base.to_currency() does not need space after
    // (upstream does not restore it when to_currency raises)
    const backupNegword = this.negword;
    this.negword = this.negword.slice(0, -1);
    let result = super.toCurrency(val, { currency, cents, separator, adjective });
    // undo the change on negword
    this.negword = backupNegword;

    // transforms "milhões euros" em "milhões de euros"
    const [cr1] = getItem(this.cls.CURRENCY_FORMS, currency);

    for (const ext of ["milhão", "milhões", "bilião", "biliões", "trilião", "triliões"]) {
      if (new RegExp(`^.*${ext} (?=${cr1[1]})`, "u").test(result)) {
        result = result.replace(`${ext}`, `${ext} de`);
      }
    }
    // do not print "e zero cêntimos"
    result = result.replaceAll(" e zero cêntimos", "");
    return result;
  }
}
