// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_CA.py

import type { CurrencyForm, CurrencyForms, CurrencyOptions, WordPair } from "../base.ts";
import { divmod, eq, floordiv, int, KeyError, mod, type PyNum, str } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

export const GENERIC_DOLLARS: CurrencyForm = ["dòlar", "dòlars"];
export const GENERIC_CENTS: CurrencyForm = ["centau", "centaus"];
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

/** Python `d[key]` on a dict with int keys. */
function getKey(d: Map<bigint, string>, key: bigint): string {
  const v = d.get(key);
  if (v === undefined) throw new KeyError(key.toString());
  return v;
}

export class Num2Word_CA extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    EUR: [
      ["euro", "euros"],
      ["cèntim", "cèntims"],
    ],
    ESP: [
      ["pesseta", "pessetes"],
      ["cèntim", "cèntims"],
    ],
    USD: [GENERIC_DOLLARS, ["centau", "centaus"]],
    PEN: [
      ["sol", "sols"],
      ["cèntim", "cèntims"],
    ],
    CRC: [["colón", "colons"], GENERIC_CENTS],
    AUD: [GENERIC_DOLLARS, GENERIC_CENTS],
    CAD: [GENERIC_DOLLARS, GENERIC_CENTS],
    GBP: [
      ["lliura", "lliures"],
      ["penic", "penics"],
    ],
    RUB: [
      ["ruble", "rubles"],
      ["copec", "copecs"],
    ],
    SEK: [
      ["corona", "corones"],
      ["öre", "öre"],
    ],
    NOK: [
      ["corona", "corones"],
      ["øre", "øre"],
    ],
    PLN: [
      ["zloty", "zlotys"],
      ["grosz", "groszy"],
    ],
    MXN: [["peso", "pesos"], GENERIC_CENTS],
    RON: [
      ["leu", "lei"],
      ["ban", "bani"],
    ],
    INR: [
      ["rupia", "rupies"],
      ["paisa", "paise"],
    ],
    HUF: [
      ["fòrint", "fòrints"],
      ["fillér", "fillérs"],
    ],
    FRF: [
      ["franc", "francs"],
      ["cèntim", "cèntims"],
    ],
    CNY: [
      ["iuan", "iuans"],
      ["fen", "jiao"],
    ],
    CZK: [
      ["corona", "corones"],
      ["haléř", "haléřů"],
    ],
    NIO: [["córdoba", "córdobas"], GENERIC_CENTS],
    VES: [
      ["bolívar", "bolívars"],
      ["cèntim", "cèntims"],
    ],
    BRL: [["real", "reals"], GENERIC_CENTS],
    CHF: [
      ["franc", "francs"],
      ["cèntim", "cèntims"],
    ],
    JPY: [
      ["ien", "iens"],
      ["sen", "sen"],
    ],
    KRW: [
      ["won", "wons"],
      ["jeon", "jeon"],
    ],
    KPW: [
      ["won", "wons"],
      ["chŏn", "chŏn"],
    ],
    TRY: [
      ["lira", "lires"],
      ["kuruş", "kuruş"],
    ],
    ZAR: [
      ["rand", "rands"],
      ["cèntim", "cèntims"],
    ],
    KZT: [
      ["tenge", "tenge"],
      ["tin", "tin"],
    ],
    UAH: [
      ["hrívnia", "hrívnies"],
      ["kopiika", "kopíok"],
    ],
    THB: [
      ["baht", "bahts"],
      ["satang", "satang"],
    ],
    AED: [
      ["dirham", "dirhams"],
      ["fils", "fulūs"],
    ],
    AFN: [
      ["afgani", "afganis"],
      ["puli", "puls"],
    ],
    ALL: [
      ["lek", "lekë"],
      ["qqindarka", "qindarkë"],
    ],
    AMD: [
      ["dram", "drams"],
      ["luma", "lumas"],
    ],
    ANG: [
      ["florí", "florins"],
      ["cèntim", "cèntims"],
    ],
    AOA: [
      ["kwanza", "kwanzes"],
      ["cèntim", "cèntims"],
    ],
    ARS: [["peso", "pesos"], GENERIC_CENTS],
    AWG: [["florí", "florins"], GENERIC_CENTS],
    AZN: [
      ["manat", "manats"],
      ["qəpik", "qəpik"],
    ],
    BBD: [GENERIC_DOLLARS, GENERIC_CENTS],
    BDT: [
      ["taka", "taka"],
      ["poisha", "poisha"],
    ],
    BGN: [
      ["lev", "leva"],
      ["stotinka", "stotinki"],
    ],
    BHD: [
      ["dinar", "dinars"],
      ["fils", "fulūs"],
    ],
    BIF: [
      ["franc", "francs"],
      ["cèntim", "cèntims"],
    ],
    BMD: [GENERIC_DOLLARS, GENERIC_CENTS],
    BND: [GENERIC_DOLLARS, GENERIC_CENTS],
    BOB: [["boliviano", "bolivianos"], GENERIC_CENTS],
    BSD: [GENERIC_DOLLARS, GENERIC_CENTS],
    BTN: [
      ["ngultrum", "ngultrums"],
      ["chetrum", "chetrums"],
    ],
    BWP: [
      ["pula", "pula"],
      ["thebe", "thebe"],
    ],
    BYN: [
      ["ruble", "rubles"],
      ["copec", "copecs"],
    ],
    BYR: [
      ["ruble", "rubles"],
      ["copec", "copecs"],
    ],
    BZD: [GENERIC_DOLLARS, ["cèntim", "cèntims"]],
    CDF: [
      ["franc", "francs"],
      ["cèntim", "cèntims"],
    ],
    CLP: [["peso", "pesos"], GENERIC_CENTS],
    COP: [["peso", "pesos"], GENERIC_CENTS],
    CUP: [["peso", "pesos"], GENERIC_CENTS],
    CVE: [["escut", "escuts"], GENERIC_CENTS],
    CYP: [
      ["lliura", "lliures"],
      ["cèntim", "cèntims"],
    ],
    DJF: [
      ["franc", "francs"],
      ["cèntim", "cèntims"],
    ],
    DKK: [
      ["corona", "corones"],
      ["øre", "øre"],
    ],
    DOP: [["peso", "pesos"], GENERIC_CENTS],
    DZD: [
      ["dinar", "dinars"],
      ["cèntim", "cèntims"],
    ],
    ECS: [["sucre", "sucres"], GENERIC_CENTS],
    EGP: [
      ["lliura", "lliures"],
      ["piastre", "piastres"],
    ],
    ERN: [
      ["nakfa", "nakfes"],
      ["cèntim", "cèntims"],
    ],
    ETB: [
      ["birr", "birr"],
      ["cèntim", "cèntims"],
    ],
    FJD: [GENERIC_DOLLARS, GENERIC_CENTS],
    FKP: [
      ["lliura", "lliures"],
      ["penic", "penics"],
    ],
    GEL: [
      ["lari", "laris"],
      ["tetri", "tetri"],
    ],
    GHS: [
      ["cedi", "cedis"],
      ["pesewa", "pesewas"],
    ],
    GIP: [
      ["lliura", "lliures"],
      ["penic", "penics"],
    ],
    GMD: [
      ["dalasi", "dalasis"],
      ["butut", "bututs"],
    ],
    GNF: [
      ["franc", "francs"],
      ["cèntim", "cèntims"],
    ],
    GTQ: [["quetzal", "quetzals"], GENERIC_CENTS],
    GYD: [GENERIC_DOLLARS, GENERIC_CENTS],
    HKD: [GENERIC_DOLLARS, GENERIC_CENTS],
    HNL: [["lempira", "lempires"], GENERIC_CENTS],
    HRK: [
      ["kuna", "kuna"],
      ["lipa", "lipa"],
    ],
    HTG: [
      ["gourde", "gourdes"],
      ["cèntim", "cèntims"],
    ],
    IDR: [
      ["rúpia", "rúpies"],
      ["cèntim", "cèntims"],
    ],
    ILS: [
      ["xéquel", "xéquels"],
      ["agorà", "agorot"],
    ],
    IQD: [
      ["dinar", "dinars"],
      ["fils", "fils"],
    ],
    IRR: [
      ["rial", "rials"],
      ["dinar", "dinars"],
    ],
    ISK: [
      ["corona", "corones"],
      ["eyrir", "aurar"],
    ],
    ITL: [
      ["lira", "lires"],
      ["cèntim", "cèntims"],
    ],
    JMD: [GENERIC_DOLLARS, ["cèntim", "cèntims"]],
    JOD: [
      ["dinar", "dinars"],
      ["piastra", "piastres"],
    ],
    KES: [
      ["xiling", "xílings"],
      ["cèntim", "cèntims"],
    ],
    KGS: [
      ["som", "som"],
      ["tyiyn", "tyiyn"],
    ],
    KHR: [
      ["riel", "riels"],
      ["cèntim", "cèntims"],
    ],
    KMF: [
      ["franc", "francs"],
      ["cèntim", "cèntims"],
    ],
    KWD: [
      ["dinar", "dinars"],
      ["fils", "fils"],
    ],
    KYD: [GENERIC_DOLLARS, ["cèntim", "cèntims"]],
    LAK: [
      ["kip", "kips"],
      ["at", "at"],
    ],
    LBP: [
      ["lliura", "lliures"],
      ["piastra", "piastres"],
    ],
    LKR: [
      ["rúpia", "rúpies"],
      ["cèntim", "cèntims"],
    ],
    LRD: [GENERIC_DOLLARS, ["cèntim", "cèntims"]],
    LSL: [
      ["loti", "maloti"],
      ["sente", "lisente"],
    ],
    LTL: [
      ["lita", "litai"],
      ["cèntim", "cèntims"],
    ],
    LYD: [
      ["dinar", "dinars"],
      ["dírham", "dírhams"],
    ],
    MAD: [
      ["dírham", "dirhams"],
      ["cèntim", "cèntims"],
    ],
    MDL: [
      ["leu", "lei"],
      ["ban", "bani"],
    ],
    MGA: [
      ["ariary", "ariary"],
      ["iraimbilanja", "iraimbilanja"],
    ],
    MKD: [
      ["denar", "denari"],
      ["deni", "deni"],
    ],
    MMK: [
      ["kyat", "kyats"],
      ["pya", "pyas"],
    ],
    MNT: [
      ["tögrög", "tögrög"],
      ["möngö", "möngö"],
    ],
    MOP: [
      ["pataca", "pataques"],
      ["avo", "avos"],
    ],
    MRO: [
      ["ouguiya", "ouguiya"],
      ["khoums", "khoums"],
    ],
    MRU: [
      ["ouguiya", "ouguiya"],
      ["khoums", "khoums"],
    ],
    MUR: [
      ["rupia", "rúpies"],
      ["cèntim", "cèntims"],
    ],
    MVR: [
      ["rufiyaa", "rufiyaa"],
      ["laari", "laari"],
    ],
    MWK: [
      ["kwacha", "kwacha"],
      ["tambala", "tambala"],
    ],
    MYR: [
      ["ringgit", "ringgits"],
      ["sen", "sens"],
    ],
    MZN: [["metical", "meticals"], GENERIC_CENTS],
    NAD: [GENERIC_DOLLARS, ["cèntim", "cèntims"]],
    NGN: [
      ["naira", "naires"],
      ["kobo", "kobos"],
    ],
    NPR: [
      ["rupia", "rupies"],
      ["paisa", "paises"],
    ],
    NZD: [GENERIC_DOLLARS, GENERIC_CENTS],
    OMR: [
      ["rial", "rials"],
      ["baisa", "baisa"],
    ],
    PAB: [GENERIC_DOLLARS, ["centésimo", "centésimos"]],
    PGK: [
      ["kina", "kina"],
      ["toea", "toea"],
    ],
    PHP: [["peso", "pesos"], GENERIC_CENTS],
    PKR: [
      ["rupia", "rupies"],
      ["paisa", "paise"],
    ],
    PLZ: [
      ["zloty", "zlotys"],
      ["grosz", "groszy"],
    ],
    PYG: [
      ["guaraní", "guaranís"],
      ["cèntim", "cèntims"],
    ],
    QAR: [
      ["rial", "rials"],
      ["dírham", "dírhams"],
    ],
    QTQ: [["quetzal", "quetzals"], GENERIC_CENTS],
    RSD: [
      ["dinar", "dinars"],
      ["para", "para"],
    ],
    RUR: [
      ["ruble", "rubles"],
      ["copec", "copecs"],
    ],
    RWF: [
      ["franc", "francs"],
      ["cèntim", "cèntims"],
    ],
    SAR: [
      ["riyal", "riyals"],
      ["hàl·lala", "hàl·lalat"],
    ],
    SBD: [GENERIC_DOLLARS, ["cèntim", "cèntims"]],
    SCR: [
      ["rupia", "rupies"],
      ["cèntim", "cèntims"],
    ],
    SDG: [
      ["lliura", "lliures"],
      ["piastre", "piastres"],
    ],
    SGD: [GENERIC_DOLLARS, ["cèntim", "cèntims"]],
    SHP: [
      ["lliura", "lliures"],
      ["penic", "penics"],
    ],
    SLL: [
      ["leonE", "leones"],
      ["cèntim", "cèntims"],
    ],
    SRD: [GENERIC_DOLLARS, ["cèntim", "cèntims"]],
    SSP: [
      ["lliura", "lliures"],
      ["piastre", "piastres"],
    ],
    STD: [
      ["dobra", "dobrAs"],
      ["cèntim", "cèntims"],
    ],
    SVC: [["colón", "colons"], GENERIC_CENTS],
    SYP: [
      ["lliura", "lliures"],
      ["piastre", "piastres"],
    ],
    SZL: [
      ["lilangeni", "emalangeni"],
      ["cèntim", "cèntims"],
    ],
    TJS: [
      ["somoni", "somoni"],
      ["diram", "diram"],
    ],
    TMT: [
      ["manat", "manats"],
      ["teňňesi", "teňňesi"],
    ],
    TND: [
      ["dinar", "dinars"],
      ["mil·lim", "mil·limat"],
    ],
    TOP: [
      ["paanga", "paangas"],
      ["seniti", "seniti"],
    ],
    TTD: [GENERIC_DOLLARS, ["cèntim", "cèntims"]],
    TWD: [
      ["nou dòlar", "nous dòlars"],
      ["fen", "fen"],
    ],
    TZS: [
      ["xíling", "xílings"],
      ["cèntim", "cèntims"],
    ],
    UGX: [
      ["xíling", "xílings"],
      ["cèntim", "cèntims"],
    ],
    UYU: [
      ["peso", "pesos"],
      ["centèsim", "centèsims"],
    ],
    UZS: [
      ["som", "som"],
      ["tiyin", "tiyin"],
    ],
    VND: [
      ["dong", "dongs"],
      ["xu", "xu"],
    ],
    VUV: [
      ["vatu", "vatus"],
      ["cèntim", "cèntims"],
    ],
    WST: [
      ["tala", "tala"],
      ["sene", "sene"],
    ],
    XAF: [
      ["franc CFA", "francs CFA"],
      ["cèntim", "cèntims"],
    ],
    XCD: [GENERIC_DOLLARS, ["cèntim", "cèntims"]],
    XOF: [
      ["franc CFA", "francs CFA"],
      ["cèntim", "cèntims"],
    ],
    XPF: [
      ["franc CFP", "francs CFP"],
      ["cèntim", "cèntims"],
    ],
    YER: [
      ["rial", "rials"],
      ["fils", "fils"],
    ],
    YUM: [
      ["dinar", "dinars"],
      ["para", "para"],
    ],
    ZMW: [
      ["kwacha", "kwacha"],
      ["ngwee", "ngwee"],
    ],
    ZWL: [GENERIC_DOLLARS, ["cèntim", "cèntims"]],
  };

  static override GIGA_SUFFIX: string | null = null;
  static override MEGA_SUFFIX: string | null = "ilió";

  declare genderStem: string;
  declare midNum: Map<bigint, string>;
  declare lowNum: Map<bigint, string>;
  declare ords: Map<bigint, string>;
  declare ords_2: Map<bigint, string>;
  declare ords_3: Map<bigint, string>;

  override setup(): void {
    const lows = ["quadr", "tr", "b", "m"];
    this.highNumwords = this.genHighNumwords([], [], lows);
    this.negword = "menys ";
    this.pointword = "punt";
    this.errmsgNonnum = "type(%s) no és [long, int, float]";
    this.errmsgFloatord = "El float %s no pot ser tractat com un ordinal.";
    this.errmsgNegord = "El número negatiu %s no pot ser tractat com un ordinal.";
    this.errmsgToobig = "abs(%s) ha de ser inferior a %s.";
    this.genderStem = "è";
    this.excludeTitle = ["i", "menys", "punt"];

    this.midNumwords = [
      [1000n, "mil"],
      [100n, "cent"],
      [90n, "noranta"],
      [80n, "vuitanta"],
      [70n, "setanta"],
      [60n, "seixanta"],
      [50n, "cinquanta"],
      [40n, "quaranta"],
      [30n, "trenta"],
    ];
    this.lowNumwords = [
      "vint-i-nou",
      "vint-i-vuit",
      "vint-i-set",
      "vint-i-sis",
      "vint-i-cinc",
      "vint-i-quatre",
      "vint-i-tres",
      "vint-i-dos",
      "vint-i-un",
      "vint",
      "dinou",
      "divuit",
      "disset",
      "setze",
      "quinze",
      "catorze",
      "tretze",
      "dotze",
      "onze",
      "deu",
      "nou",
      "vuit",
      "set",
      "sis",
      "cinc",
      "quatre",
      "tres",
      "dos",
      "un",
      "zero",
    ];
    this.midNum = new Map([
      [1000n, "mil"],
      [100n, "cent"],
      [90n, "noranta"],
      [80n, "vuitanta"],
      [70n, "setanta"],
      [60n, "seixanta"],
      [50n, "cinquanta"],
      [40n, "quaranta"],
      [30n, "trenta"],
      [20n, "vint"],
      [10n, "deu"],
    ]);
    this.lowNum = new Map([
      [0n, "zero"],
      [1n, "un"],
      [2n, "dos"],
      [3n, "tres"],
      [4n, "quatre"],
      [5n, "cinc"],
      [6n, "sis"],
      [7n, "set"],
      [8n, "vuit"],
      [9n, "nou"],
      [10n, "deu"],
      [11n, "onze"],
      [12n, "dotze"],
      [13n, "tretze"],
      [14n, "catorze"],
      [15n, "quinze"],
      [16n, "setze"],
      [17n, "disset"],
      [18n, "divuit"],
      [19n, "dinou"],
      [20n, "vint"],
      [21n, "vint-i-un"],
      [22n, "vint-i-dos"],
      [23n, "vint-i-tres"],
      [24n, "vint-i-quatre"],
      [25n, "vint-i-cinc"],
      [26n, "vint-i-sis"],
      [27n, "vint-i-set"],
      [28n, "vint-i-vuit"],
      [29n, "vint-i-nou"],
    ]);
    this.ords = new Map([
      [1n, "primer"],
      [2n, "segon"],
      [3n, "tercer"],
      [4n, "quart"],
      [5n, "cinqu"],
      [6n, "sis"],
      [7n, "set"],
      [8n, "vuit"],
      [9n, "nov"],
      [10n, "des"],
      [11n, "onz"],
      [12n, "dotz"],
      [13n, "tretz"],
      [14n, "catorz"],
      [15n, "quinz"],
      [16n, "setz"],
      [17n, "disset"],
      [18n, "divuit"],
      [19n, "dinov"],
      [20n, "vint"],
      [30n, "trent"],
      [40n, "quarant"],
      [50n, "cinquant"],
      [60n, "seixant"],
      [70n, "setant"],
      [80n, "vuitant"],
      [90n, "norant"],
      [100n, "cent"],
      [200n, "dos-cent"],
      [300n, "tres-cent"],
      [400n, "quatre-cent"],
      [500n, "cinc-cent"],
      [600n, "sis-cent"],
      [700n, "set-cent"],
      [800n, "vuit-cent"],
      [900n, "nou-cent"],
      [10n ** 3n, "mil"],
      [10n ** 6n, "milion"],
      [10n ** 9n, "mil milion"],
      [10n ** 12n, "bilion"],
      [10n ** 15n, "mil bilion"],
    ]);

    this.ords_2 = new Map([
      [1n, "1r"],
      [2n, "2n"],
      [3n, "3r"],
      [4n, "4t"],
    ]);
    this.ords_3 = new Map([
      [1n, "unè"],
      [2n, "dosè"],
      [3n, "tresè"],
      [4n, "quatrè"],
      [5n, "cinquè"],
      [6n, "sisè"],
      [7n, "setè"],
      [8n, "vuitè"],
      [9n, "novè"],
    ]);
  }

  override merge(curr: WordPair, next: WordPair): WordPair {
    let [ctext, cnum] = curr;
    let [ntext, nnum] = next;
    if (cnum === 1n) {
      if (nnum < 1000000n) {
        return next;
      }
      ctext = "un";
    }

    if (nnum < cnum) {
      if (cnum < 100n) {
        return [`${ctext}-${ntext}`, cnum + nnum];
      } else if (nnum === 1n) {
        return [`${ctext} ${ntext}`, cnum + nnum];
      } else if (cnum === 100n) {
        return [`${ctext} ${ntext}`, cnum + nnum];
      } else {
        return [`${ctext} ${ntext}`, cnum + nnum];
      }
    } else if (!mod(nnum, 1000000n) && cnum > 1n) {
      ntext = `${ntext.slice(0, -3)}lions`;
    }
    if (nnum === 100n) {
      ntext += "s";
      ctext += "-";
    } else {
      ntext = ` ${ntext}`;
    }
    return [ctext + ntext, cnum * nnum];
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    // verify_ordinal guarantees an integral value; int and integral float
    // behave the same from here on (dict keys, divmod, to_cardinal).
    const v = int(value);
    let text: string;
    if (v === 0n) {
      text = "";
    } else if (v < 5n) {
      text = getKey(this.ords, v);
    } else if (v <= 20n) {
      text = `${getKey(this.ords, v)}${this.genderStem}`;
    } else if (v <= 30n) {
      const frac = mod(v, 10n);
      text = `${getKey(this.ords, 20n)}-i-${getKey(this.ords_3, frac)}`;
    } else if (v < 100n) {
      const dec = floordiv(v, 10n) * 10n;
      text = `${getKey(this.ords, dec)}a-${getKey(this.ords_3, v - dec)}`;
    } else if (v === 100n) {
      text = `${getKey(this.ords, v)}${this.genderStem}`;
    } else if (v < 200n) {
      const cen = floordiv(v, 100n) * 100n;
      text = `${getKey(this.ords, cen)} ${this.toOrdinal(v - cen)}`;
    } else if (v < 1000n) {
      const cen = floordiv(v, 100n) * 100n;
      text = `${getKey(this.ords, cen)}s ${this.toOrdinal(v - cen)}`;
    } else if (v === 1000n) {
      text = `${getKey(this.ords, v)}${this.genderStem}`;
    } else if (v < 1000000n) {
      const dec = 1000n ** BigInt(Math.trunc(Math.log(Number(v)) / Math.log(1000)));
      const [highPart, lowPart] = divmod(v, dec);
      const cardinal = highPart !== 1n ? this.toCardinal(highPart) : "";
      text = `${cardinal} ${getKey(this.ords, dec)} ${this.toOrdinal(lowPart)}`;
    } else if (v < 10n ** 18n) {
      const dec = 1000n ** BigInt(Math.trunc(Math.log(Number(v)) / Math.log(1000)));
      const [highPart, lowPart] = divmod(v, dec);
      const cardinal = highPart !== 1n ? this.toCardinal(highPart) : "";
      text = `${cardinal}${getKey(this.ords, dec)}${this.genderStem} ${this.toOrdinal(lowPart)}`;
    } else {
      const part1 = this.toCardinal(value);
      text = `${part1.slice(0, -1)}onè`;
    }
    return text.trim();
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    const key = [...this.ords_2.keys()].find((k) => eq(k, value));
    if (key === undefined) {
      return `${str(value)}${this.genderStem === "è" ? "è" : "a"}`;
    }
    return this.ords_2.get(key) as string;
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    const currency = options.currency ?? "EUR";
    const cents = options.cents ?? true;
    const separator = options.separator ?? " amb";
    const adjective = options.adjective ?? false;
    let result = super.toCurrency(val, { currency, cents, separator, adjective });
    const listResult = result.split(`${separator} `);

    if (CURRENCIES_UNA.includes(currency)) {
      listResult[0] = (listResult[0] as string).replaceAll("un", "una");
      listResult[0] = listResult[0].replaceAll("dos", "dues");
      listResult[0] = listResult[0].replaceAll("cents", "centes");
    }

    listResult[0] = (listResult[0] as string).replaceAll("vint-i-un", "vint-i-un");
    listResult[0] = listResult[0].replaceAll(" i un", "-un");
    listResult[0] = listResult[0].replaceAll("un", "un");

    if (CENTS_UNA.includes(currency)) {
      listResult[1] = (listResult[1] as string).replaceAll("un", "una");
      listResult[1] = listResult[1].replaceAll("dos", "dues");
    }

    listResult[1] = (listResult[1] as string).replaceAll("vint-i-un", "vint-i-una");

    listResult[1] = listResult[1].replaceAll("un", "un");

    result = listResult.join(`${separator} `);

    return result;
  }
}
