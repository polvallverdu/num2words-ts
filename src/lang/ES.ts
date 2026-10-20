// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_ES.py

import type { CurrencyForm, CurrencyForms, CurrencyOptions, WordPair } from "../base.ts";
import { at, cmp, divmod, eq, getItem, int, mod, type PyNum, RecursionError, str } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

/** Python's default recursion limit, for to_ordinal's unbounded recursion. */
const RECURSION_LIMIT = 1000;

export const GENERIC_DOLLARS: CurrencyForm = ["dólar", "dólares"];
export const GENERIC_CENTS: CurrencyForm = ["centavo", "centavos"];
export const CURRENCIES_UNA: readonly string[] = [
  "SLL",
  "SEK",
  "NOK",
  "CZK",
  "DKK",
  "ISK",
  "SKK",
  "GBP",
  "CYP",
  "EGP",
  "FKP",
  "GIP",
  "LBP",
  "SDG",
  "SHP",
  "SSP",
  "SYP",
  "INR",
  "IDR",
  "LKR",
  "MUR",
  "NPR",
  "PKR",
  "SCR",
  "ESP",
  "TRY",
  "ITL",
];
export const CENTS_UNA: readonly string[] = ["EGP", "JOD", "LBP", "SDG", "SSP", "SYP"];

/**
 * Python raises TypeError for a keyword argument the method does not take.
 * `num2words()` forwards every option, so the converters check them here.
 */
export function checkKwargs(options: object, allowed: readonly string[], fn: string): void {
  for (const key of Object.keys(options)) {
    if (!allowed.includes(key)) {
      throw new TypeError(`${fn}() got an unexpected keyword argument '${key}'`);
    }
  }
}

export class Num2Word_ES extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    EUR: [
      ["euro", "euros"],
      ["céntimo", "céntimos"],
    ],
    ESP: [
      ["peseta", "pesetas"],
      ["céntimo", "céntimos"],
    ],
    USD: [GENERIC_DOLLARS, GENERIC_CENTS],
    PEN: [
      ["sol", "soles"],
      ["céntimo", "céntimos"],
    ],
    CRC: [["colón", "colones"], GENERIC_CENTS],
    AUD: [GENERIC_DOLLARS, GENERIC_CENTS],
    CAD: [GENERIC_DOLLARS, GENERIC_CENTS],
    GBP: [
      ["libra", "libras"],
      ["penique", "peniques"],
    ],
    RUB: [
      ["rublo", "rublos"],
      ["kopeyka", "kopeykas"],
    ],
    SEK: [
      ["corona", "coronas"],
      ["öre", "öre"],
    ],
    NOK: [
      ["corona", "coronas"],
      ["øre", "øre"],
    ],
    PLN: [
      ["zloty", "zlotys"],
      ["grosz", "groszy"],
    ],
    MXN: [["peso", "pesos"], GENERIC_CENTS],
    RON: [
      ["leu", "leus"],
      ["ban", "bani"],
    ],
    INR: [
      ["rupia", "rupias"],
      ["paisa", "paisas"],
    ],
    HUF: [
      ["florín", "florines"],
      ["fillér", "fillér"],
    ],
    FRF: [
      ["franco", "francos"],
      ["céntimo", "céntimos"],
    ],
    CNY: [
      ["yuan", "yuanes"],
      ["fen", "jiaos"],
    ],
    CZK: [
      ["corona", "coronas"],
      ["haléř", "haléř"],
    ],
    NIO: [["córdoba", "córdobas"], GENERIC_CENTS],
    VES: [
      ["bolívar", "bolívares"],
      ["céntimo", "céntimos"],
    ],
    BRL: [["real", "reales"], GENERIC_CENTS],
    CHF: [
      ["franco", "francos"],
      ["céntimo", "céntimos"],
    ],
    JPY: [
      ["yen", "yenes"],
      ["sen", "sen"],
    ],
    KRW: [
      ["won", "wones"],
      ["jeon", "jeon"],
    ],
    KPW: [
      ["won", "wones"],
      ["chon", "chon"],
    ],
    TRY: [
      ["lira", "liras"],
      ["kuruş", "kuruş"],
    ],
    ZAR: [
      ["rand", "rands"],
      ["céntimo", "céntimos"],
    ],
    KZT: [
      ["tenge", "tenges"],
      ["tïın", "tïın"],
    ],
    UAH: [
      ["hryvnia", "hryvnias"],
      ["kopiyka", "kopiykas"],
    ],
    THB: [
      ["baht", "bahts"],
      ["satang", "satang"],
    ],
    AED: [
      ["dirham", "dirhams"],
      ["fils", "fils"],
    ],
    AFN: [
      ["afghani", "afghanis"],
      ["pul", "puls"],
    ],
    ALL: [
      ["lek ", "leke"],
      ["qindarkë", "qindarka"],
    ],
    AMD: [
      ["dram", "drams"],
      ["luma", "lumas"],
    ],
    ANG: [["florín", "florines"], GENERIC_CENTS],
    AOA: [
      ["kwanza", "kwanzas"],
      ["céntimo", "céntimos"],
    ],
    ARS: [["peso", "pesos"], GENERIC_CENTS],
    AWG: [["florín", "florines"], GENERIC_CENTS],
    AZN: [
      ["manat", "manat"],
      ["qəpik", "qəpik"],
    ],
    BBD: [GENERIC_DOLLARS, GENERIC_CENTS],
    BDT: [
      ["taka", "takas"],
      ["paisa", "paisas"],
    ],
    BGN: [
      ["lev", "leva"],
      ["stotinka", "stotinki"],
    ],
    BHD: [
      ["dinar", "dinares"],
      ["fils", "fils"],
    ],
    BIF: [
      ["franco", "francos"],
      ["céntimo", "céntimos"],
    ],
    BMD: [GENERIC_DOLLARS, GENERIC_CENTS],
    BND: [GENERIC_DOLLARS, GENERIC_CENTS],
    BOB: [["boliviano", "bolivianos"], GENERIC_CENTS],
    BSD: [GENERIC_DOLLARS, GENERIC_CENTS],
    BTN: [
      ["ngultrum", "ngultrum"],
      ["chetrum", "chetrum"],
    ],
    BWP: [
      ["pula", "pulas"],
      ["thebe", "thebes"],
    ],
    BYN: [
      ["rublo", "rublos"],
      ["kópek", "kópeks"],
    ],
    BYR: [
      ["rublo", "rublos"],
      ["kópek", "kópeks"],
    ],
    BZD: [GENERIC_DOLLARS, ["céntimo", "céntimos"]],
    CDF: [
      ["franco", "francos"],
      ["céntimo", "céntimos"],
    ],
    CLP: [["peso", "pesos"], GENERIC_CENTS],
    COP: [["peso", "pesos"], GENERIC_CENTS],
    CUP: [["peso", "pesos"], GENERIC_CENTS],
    CVE: [["escudo", "escudos"], GENERIC_CENTS],
    CYP: [
      ["libra", "libras"],
      ["céntimo", "céntimos"],
    ],
    DJF: [
      ["franco", "francos"],
      ["céntimo", "céntimos"],
    ],
    DKK: [
      ["corona", "coronas"],
      ["øre", "øre"],
    ],
    DOP: [["peso", "pesos"], GENERIC_CENTS],
    DZD: [
      ["dinar", "dinares"],
      ["céntimo", "céntimos"],
    ],
    ECS: [["sucre", "sucres"], GENERIC_CENTS],
    EGP: [
      ["libra", "libras"],
      ["piastra", "piastras"],
    ],
    ERN: [
      ["nakfa", "nakfas"],
      ["céntimo", "céntimos"],
    ],
    ETB: [
      ["birr", "birrs"],
      ["céntimo", "céntimos"],
    ],
    FJD: [GENERIC_DOLLARS, GENERIC_CENTS],
    FKP: [
      ["libra", "libras"],
      ["penique", "peniques"],
    ],
    GEL: [
      ["lari", "laris"],
      ["tetri", "tetris"],
    ],
    GHS: [
      ["cedi", "cedis"],
      ["pesewa", "pesewas"],
    ],
    GIP: [
      ["libra", "libras"],
      ["penique", "peniques"],
    ],
    GMD: [
      ["dalasi", "dalasis"],
      ["butut", "bututs"],
    ],
    GNF: [
      ["franco", "francos"],
      ["céntimo", "céntimos"],
    ],
    GTQ: [["quetzal", "quetzales"], GENERIC_CENTS],
    GYD: [GENERIC_DOLLARS, GENERIC_CENTS],
    HKD: [GENERIC_DOLLARS, GENERIC_CENTS],
    HNL: [["lempira", "lempiras"], GENERIC_CENTS],
    HRK: [
      ["kuna", "kunas"],
      ["lipa", "lipas"],
    ],
    HTG: [
      ["gourde", "gourdes"],
      ["céntimo", "céntimos"],
    ],
    IDR: [
      ["rupia", "rupias"],
      ["céntimo", "céntimos"],
    ],
    ILS: [
      ["séquel", "séqueles"],
      ["agora", "agoras"],
    ],
    IQD: [
      ["dinar", "dinares"],
      ["fils", "fils"],
    ],
    IRR: [
      ["rial", "riales"],
      ["dinar", "dinares"],
    ],
    ISK: [
      ["corona", "coronas"],
      ["eyrir", "aurar"],
    ],
    ITL: [
      ["lira", "liras"],
      ["céntimo", "céntimos"],
    ],
    JMD: [GENERIC_DOLLARS, ["céntimo", "céntimos"]],
    JOD: [
      ["dinar", "dinares"],
      ["piastra", "piastras"],
    ],
    KES: [
      ["chelín", "chelines"],
      ["céntimo", "céntimos"],
    ],
    KGS: [
      ["som", "som"],
      ["tyiyn", "tyiyn"],
    ],
    KHR: [
      ["riel", "rieles"],
      ["céntimo", "céntimos"],
    ],
    KMF: [
      ["franco", "francos"],
      ["céntimo", "céntimos"],
    ],
    KWD: [
      ["dinar", "dinares"],
      ["fils", "fils"],
    ],
    KYD: [GENERIC_DOLLARS, ["céntimo", "céntimos"]],
    LAK: [
      ["kip", "kips"],
      ["att", "att"],
    ],
    LBP: [
      ["libra", "libras"],
      ["piastra", "piastras"],
    ],
    LKR: [
      ["rupia", "rupias"],
      ["céntimo", "céntimos"],
    ],
    LRD: [GENERIC_DOLLARS, ["céntimo", "céntimos"]],
    LSL: [
      ["loti", "lotis"],
      ["céntimo", "céntimos"],
    ],
    LTL: [
      ["lita", "litas"],
      ["céntimo", "céntimos"],
    ],
    LVL: [
      ["lat", "lats"],
      ["céntimo", "céntimos"],
    ],
    LYD: [
      ["dinar", "dinares"],
      ["dírham", "dírhams"],
    ],
    MAD: [
      ["dírham", "dirhams"],
      ["céntimo", "céntimos"],
    ],
    MDL: [
      ["leu", "lei"],
      ["ban", "bani"],
    ],
    MGA: [
      ["ariary", "ariaris"],
      ["iraimbilanja", "iraimbilanja"],
    ],
    MKD: [
      ["denar", "denares"],
      ["deni", "denis"],
    ],
    MMK: [
      ["kiat", "kiats"],
      ["pya", "pyas"],
    ],
    MNT: [
      ["tugrik", "tugriks"],
      ["möngö", "möngö"],
    ],
    MOP: [
      ["pataca", "patacas"],
      ["avo", "avos"],
    ],
    MRO: [
      ["ouguiya", "ouguiyas"],
      ["khoums", "khoums"],
    ],
    MRU: [
      ["ouguiya", "ouguiyas"],
      ["khoums", "khoums"],
    ],
    MUR: [
      ["rupia", "rupias"],
      ["céntimo", "céntimos"],
    ],
    MVR: [
      ["rufiyaa", "rufiyaas"],
      ["laari", "laari"],
    ],
    MWK: [
      ["kuacha", "kuachas"],
      ["tambala", "tambalas"],
    ],
    MYR: [
      ["ringgit", "ringgit"],
      ["céntimo", "céntimos"],
    ],
    MZN: [["metical", "metical"], GENERIC_CENTS],
    NAD: [GENERIC_DOLLARS, ["céntimo", "céntimos"]],
    NGN: [
      ["naira", "nairas"],
      ["kobo", "kobo"],
    ],
    NPR: [
      ["rupia", "rupias"],
      ["paisa", "paisas"],
    ],
    NZD: [GENERIC_DOLLARS, GENERIC_CENTS],
    OMR: [
      ["rial", "riales"],
      ["baisa", "baisa"],
    ],
    PAB: [
      ["balboa", "balboas"],
      ["centésimo", "centésimos"],
    ],
    PGK: [
      ["kina", "kinas"],
      ["toea", "toea"],
    ],
    PHP: [["peso", "pesos"], GENERIC_CENTS],
    PKR: [
      ["rupia", "rupias"],
      ["paisa", "paisas"],
    ],
    PLZ: [
      ["zloty", "zlotys"],
      ["grosz", "groszy"],
    ],
    PYG: [
      ["guaraní", "guaranís"],
      ["céntimo", "céntimos"],
    ],
    QAR: [
      ["rial", "riales"],
      ["dírham", "dírhams"],
    ],
    QTQ: [["quetzal", "quetzales"], GENERIC_CENTS],
    RSD: [
      ["dinar", "dinares"],
      ["para", "para"],
    ],
    RUR: [
      ["rublo", "rublos"],
      ["kopek", "kopeks"],
    ],
    RWF: [
      ["franco", "francos"],
      ["céntimo", "céntimos"],
    ],
    SAR: [
      ["riyal", "riales"],
      ["halala", "halalas"],
    ],
    SBD: [GENERIC_DOLLARS, ["céntimo", "céntimos"]],
    SCR: [
      ["rupia", "rupias"],
      ["céntimo", "céntimos"],
    ],
    SDG: [
      ["libra", "libras"],
      ["piastra", "piastras"],
    ],
    SGD: [GENERIC_DOLLARS, ["céntimo", "céntimos"]],
    SHP: [
      ["libra", "libras"],
      ["penique", "peniques"],
    ],
    SKK: [
      ["corona", "coronas"],
      ["halier", "haliers"],
    ],
    SLL: [
      ["leona", "leonas"],
      ["céntimo", "céntimos"],
    ],
    SRD: [GENERIC_DOLLARS, ["céntimo", "céntimos"]],
    SSP: [
      ["libra", "libras"],
      ["piastra", "piastras"],
    ],
    STD: [
      ["dobra", "dobras"],
      ["céntimo", "céntimos"],
    ],
    SVC: [["colón", "colones"], GENERIC_CENTS],
    SYP: [
      ["libra", "libras"],
      ["piastra", "piastras"],
    ],
    SZL: [
      ["lilangeni", "emalangeni"],
      ["céntimo", "céntimos"],
    ],
    TJS: [
      ["somoni", "somonis"],
      ["dirame", "dirames"],
    ],
    TMT: [
      ["manat", "manat"],
      ["tenge", "tenge"],
    ],
    TND: [
      ["dinar", "dinares"],
      ["milésimo", "milésimos"],
    ],
    TOP: [
      ["paanga", "paangas"],
      ["céntimo", "céntimos"],
    ],
    TTD: [GENERIC_DOLLARS, ["céntimo", "céntimos"]],
    TWD: [
      ["nuevo dólar", "nuevos dólares"],
      ["céntimo", "céntimos"],
    ],
    TZS: [
      ["chelín", "chelines"],
      ["céntimo", "céntimos"],
    ],
    UAG: [
      ["hryvnia", "hryvnias"],
      ["kopiyka", "kopiykas"],
    ],
    UGX: [
      ["chelín", "chelines"],
      ["céntimo", "céntimos"],
    ],
    UYU: [
      ["peso", "pesos"],
      ["centésimo", "centésimos"],
    ],
    UZS: [
      ["sum", "sum"],
      ["tiyin", "tiyin"],
    ],
    VEF: [
      ["bolívar fuerte", "bolívares fuertes"],
      ["céntimo", "céntimos"],
    ],
    VND: [
      ["dong", "dongs"],
      ["xu", "xu"],
    ],
    VUV: [
      ["vatu", "vatu"],
      ["nenhum", "nenhum"],
    ],
    WST: [["tala", "tala"], GENERIC_CENTS],
    XAF: [
      ["franco CFA", "francos CFA"],
      ["céntimo", "céntimos"],
    ],
    XCD: [GENERIC_DOLLARS, ["céntimo", "céntimos"]],
    XOF: [
      ["franco CFA", "francos CFA"],
      ["céntimo", "céntimos"],
    ],
    XPF: [
      ["franco CFP", "francos CFP"],
      ["céntimo", "céntimos"],
    ],
    YER: [
      ["rial", "riales"],
      ["fils", "fils"],
    ],
    YUM: [
      ["dinar", "dinares"],
      ["para", "para"],
    ],
    ZMW: [
      ["kwacha", "kwachas"],
      ["ngwee", "ngwee"],
    ],
    ZRZ: [
      ["zaire", "zaires"],
      ["likuta", "makuta"],
    ],
    ZWL: [GENERIC_DOLLARS, ["céntimo", "céntimos"]],
  };

  // //CHECK: Is this sufficient??
  static override GIGA_SUFFIX: string | null = null;
  static override MEGA_SUFFIX: string | null = "illón";

  declare genderStem: string;
  declare ords: Record<string, string>;
  declare _ordinalDepth?: number;

  override setup(): void {
    const lows = ["cuatr", "tr", "b", "m"];
    this.highNumwords = this.genHighNumwords([], [], lows);
    this.negword = "menos ";
    this.pointword = "punto";
    this.errmsgNonnum = "type(%s) no es [long, int, float]";
    this.errmsgFloatord = "El float %s no puede ser tratado como un ordinal.";
    this.errmsgNegord = "El número negativo %s no puede ser tratado como un ordinal.";
    this.errmsgToobig = "abs(%s) deber ser inferior a %s.";
    this.genderStem = "o";
    this.excludeTitle = ["y", "menos", "punto"];
    this.midNumwords = [
      [1000n, "mil"],
      [100n, "cien"],
      [90n, "noventa"],
      [80n, "ochenta"],
      [70n, "setenta"],
      [60n, "sesenta"],
      [50n, "cincuenta"],
      [40n, "cuarenta"],
      [30n, "treinta"],
    ];
    this.lowNumwords = [
      "veintinueve",
      "veintiocho",
      "veintisiete",
      "veintiséis",
      "veinticinco",
      "veinticuatro",
      "veintitrés",
      "veintidós",
      "veintiuno",
      "veinte",
      "diecinueve",
      "dieciocho",
      "diecisiete",
      "dieciséis",
      "quince",
      "catorce",
      "trece",
      "doce",
      "once",
      "diez",
      "nueve",
      "ocho",
      "siete",
      "seis",
      "cinco",
      "cuatro",
      "tres",
      "dos",
      "uno",
      "cero",
    ];
    // Keyed by the integer value (upstream mixes int and float keys, which
    // Python treats as equal).
    this.ords = {
      "1": "primer",
      "2": "segund",
      "3": "tercer",
      "4": "cuart",
      "5": "quint",
      "6": "sext",
      "7": "séptim",
      "8": "octav",
      "9": "noven",
      "10": "décim",
      "20": "vigésim",
      "30": "trigésim",
      "40": "quadragésim",
      "50": "quincuagésim",
      "60": "sexagésim",
      "70": "septuagésim",
      "80": "octogésim",
      "90": "nonagésim",
      "100": "centésim",
      "200": "ducentésim",
      "300": "tricentésim",
      "400": "cuadrigentésim",
      "500": "quingentésim",
      "600": "sexcentésim",
      "700": "septigentésim",
      "800": "octigentésim",
      "900": "noningentésim",
      "1000": "milésim",
      "1000000": "millonésim",
      "1000000000": "billonésim",
      "1000000000000": "trillonésim",
      "1000000000000000": "cuadrillonésim",
    };
  }

  /** `self.ords[key]`, raising KeyError like a dict lookup. */
  protected _ord(key: bigint): string {
    return getItem(this.ords, key.toString());
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    let [ctext, cnum] = curr;
    let [ntext, nnum] = next;

    if (cnum === 1n) {
      if (nnum < 1000000n) {
        return next;
      }
      ctext = "un";
    } else if (cnum === 100n && mod(nnum, 1000n) !== 0n) {
      ctext += `t${this.genderStem}`;
    }

    if (nnum < cnum) {
      if (cnum < 100n) {
        return [`${ctext} y ${ntext}`, cnum + nnum];
      }
      return [`${ctext} ${ntext}`, cnum + nnum];
    } else if (!mod(nnum, 1000000n) && cnum > 1n) {
      ntext = `${ntext.slice(0, -3)}lones`;
    }

    if (nnum === 100n) {
      if (cnum === 5n) {
        ctext = "quinien";
        ntext = "";
      } else if (cnum === 7n) {
        ctext = "sete";
      } else if (cnum === 9n) {
        ctext = "nove";
      }
      ntext += `t${this.genderStem}s`;
    } else {
      ntext = ` ${ntext}`;
    }

    return [ctext + ntext, cnum * nnum];
  }

  override toOrdinal(value: PyNum, ..._rest: unknown[]): string {
    // Upstream recurses forever when math.log rounds up to the next power of
    // 1000 (e.g. 999999999999999 gives dec = 1e15 and high_part = 0), which
    // Python reports as RecursionError.
    const depth = this._ordinalDepth ?? 0;
    if (depth >= RECURSION_LIMIT) {
      throw new RecursionError("maximum recursion depth exceeded");
    }
    this._ordinalDepth = depth + 1;
    try {
      return this._toOrdinal(value);
    } finally {
      this._ordinalDepth = depth;
    }
  }

  protected _toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    // verifyOrdinal guarantees an integral, non-negative value.
    const v = int(value);
    let text: string;
    if (eq(value, 0n)) {
      text = "";
    } else if (cmp(value, 10n) <= 0) {
      text = `${this._ord(v)}${this.genderStem}`;
    } else if (cmp(value, 12n) <= 0) {
      text = `${this._ord(10n)}${this.genderStem}${this.toOrdinal(v - 10n)}`;
    } else if (cmp(value, 100n) <= 0) {
      const dec = (v / 10n) * 10n;
      text = `${this._ord(dec)}${this.genderStem} ${this.toOrdinal(v - dec)}`;
    } else if (cmp(value, 1e3) <= 0) {
      const cen = (v / 100n) * 100n;
      text = `${this._ord(cen)}${this.genderStem} ${this.toOrdinal(v - cen)}`;
    } else if (cmp(value, 1e18) < 0) {
      // Round down to the nearest 1e(3n)
      // dec contains the following:
      // [ 1e3,  1e6): 1e3
      // [ 1e6,  1e9): 1e6
      // [ 1e9, 1e12): 1e9
      // [1e12, 1e15): 1e12
      // [1e15, 1e18): 1e15
      // math.log(x, base) is log(x) / log(base) in floating point.
      const dec = 1000n ** int(Math.log(Number(v)) / Math.log(1000));

      // Split the parts before and after the word for 'dec'
      // eg (12, 345) = divmod(12_345, 1_000)
      const [highPart, lowPart] = divmod(v, dec);

      const cardinal = highPart !== 1n ? this.toCardinal(highPart) : "";
      text = `${cardinal}${this._ord(dec)}${this.genderStem} ${this.toOrdinal(lowPart)}`;
    } else {
      text = this.toCardinal(value);
    }
    return text.trim();
  }

  override toOrdinalNum(value: PyNum, ..._rest: unknown[]): string {
    this.verifyOrdinal(value);
    return `${str(value)}${this.genderStem === "o" ? "º" : "ª"}`;
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    checkKwargs(options, ["currency", "cents", "separator", "adjective"], "to_currency");
    const currency = options.currency ?? "EUR";
    const cents = options.cents ?? true;
    const separator = options.separator ?? " con";
    const adjective = options.adjective ?? false;
    let result = super.toCurrency(val, { currency, cents, separator, adjective });
    // Handle exception: In Spanish it's "un euro" and not "uno euro",
    // except in these currencies, where it's "una": leona, corona,
    // libra, lira, rupia, lempira, peseta.
    // The same goes for "veintiuna", "treinta y una"...
    // Also, this needs to be handled separately for "dollars" and
    // "cents".
    // All "cents" are masculine except for: piastra.
    // Source: https://www.rae.es/dpd/una (section 2.2)

    // split "dollars" part from "cents" part
    const listResult = result.split(`${separator} `);

    // "DOLLARS" PART (list_result[0])

    // Feminine currencies ("una libra", "trescientas libras"...)
    if (CURRENCIES_UNA.includes(currency)) {
      // "una libra", "veintiuna libras", "treinta y una libras"...
      listResult[0] = at(listResult, 0).replaceAll("uno", "una");

      // "doscientas libras", "trescientas libras"...
      listResult[0] = at(listResult, 0).replaceAll("cientos", "cientas");
    }

    // Masc.: Correct orthography for the specific case of "veintiún":
    listResult[0] = at(listResult, 0).replaceAll("veintiuno", "veintiún");

    // Masculine currencies: general case ("un euro", "treinta y un
    // euros"...):
    listResult[0] = at(listResult, 0).replaceAll("uno", "un");

    // "CENTS" PART (list_result[1])

    // Feminine "cents" ("una piastra", "veintiuna piastras"...)
    if (CENTS_UNA.includes(currency)) {
      // "una piastra", "veintiuna piastras", "treinta y una piastras"...
      listResult[1] = at(listResult, 1).replaceAll("uno", "una");
    }

    // Masc.: Correct orthography for the specific case of "veintiún":
    listResult[1] = at(listResult, 1).replaceAll("veintiuno", "veintiún");

    // Masculine "cents": general case ("un centavo", "treinta y un
    // centavos"...):
    listResult[1] = at(listResult, 1).replaceAll("uno", "un");

    // join back "dollars" part with "cents" part
    result = listResult.join(`${separator} `);

    return result;
  }
}
