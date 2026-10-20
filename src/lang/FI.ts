// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_FI.py

import type { CurrencyForm, CurrencyForms, CurrencyOptions } from "../base.ts";
import {
  abs,
  at,
  cmp,
  eq,
  getItem,
  int,
  NotImplementedError,
  OverflowError,
  type PyNum,
  str,
  ValueError,
} from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

const GENERIC_CENTS: CurrencyForm = ["sentti", "senttiä"];
const GENERIC_CENTAVOS: CurrencyForm = ["centavo", "centavoa"];

// grammatical cases
const NOM = 10; // nominative: the dictionary form
const GEN = 11; // genitive: ~of/'s
const ACC = 12; // accusative: not used; either nominative or genitive
const PTV = 13; // partitive: as an object
// locative cases (internal)
const INE = 14; // inessive: in
const ELA = 15; // elative: from/out of
const ILL = 16; // illative: into
// locative cases (external)
const ADE = 17; // adessive: at/on
const ABL = 18; // ablative: from (after being at/on, not in)
const ALL = 19; // allative: to
// essive
const ESS = 20; // essive: as (in the role of)
const TRANSL = 21; // translative: to (the role of; being sth)
// rare
const INSTRUC = 22; // instructive: with (plural is the same as singular)
const ABE = 23; // abessive: without
const COM = 24; // comitative: together with (plural = singular)

const NAME_TO_CASE: Record<string, number> = {
  nominative: NOM,
  genitive: GEN,
  accusative: ACC,
  partitive: PTV,
  inessive: INE,
  elative: ELA,
  illative: ILL,
  adessive: ADE,
  ablative: ABL,
  allative: ALL,
  essive: ESS,
  translative: TRANSL,
  instructive: INSTRUC,
  abessive: ABE,
  comitative: COM,
};

// https://en.wikibooks.org/wiki/Finnish/Grammar-Vowel_harmony
const BACK_TO_FRONT: [string, string][] = [
  ["a", "ä"],
  ["o", "ö"],
  ["u", "y"],
];

/** A suffix, or a tuple of alternative suffixes (Python tuple). */
type Suffix = string | readonly string[];
/** CASE: (SINGULAR_SUFFIX+, PLURAL_SUFFIX+) */
type KotusTable = Record<number, readonly [Suffix, Suffix]>;

// https://en.wiktionary.org/wiki/Appendix:Finnish_nominal_inflection
const KOTUS_TYPE: Record<number, KotusTable> = {
  // Kotus type 5/risti, no gradation
  5: {
    // grammatical
    [NOM]: ["i", "it"],
    [GEN]: ["in", "ien"],
    [PTV]: ["ia", "eja"],
    // locative, internal
    [INE]: ["issa", "eissa"],
    [ELA]: ["ista", "eista"],
    [ILL]: ["iin", "eihin"],
    // locative, external
    [ADE]: ["illa", "eilla"],
    [ABL]: ["ilta", "eilta"],
    [ALL]: ["ille", "eille"],
    // essive
    [ESS]: ["ina", "eina"],
    [TRANSL]: ["iksi", "eiksi"],
    // rare
    [INSTRUC]: ["ein", "ein"],
    [ABE]: ["itta", "eitta"],
    [COM]: ["eine", "eine"], // works better
  },

  // Kotus type 7/ovi, no gradation
  7: {
    // grammatical
    [NOM]: ["i", "et"],
    [GEN]: ["en", "ien"],
    [PTV]: ["ea", "ia"],
    // locative, internal
    [INE]: ["essa", "issa"],
    [ELA]: ["esta", "ista"],
    [ILL]: ["een", "iin"],
    // locative, external
    [ADE]: ["ella", "illa"],
    [ABL]: ["elta", "ilta"],
    [ALL]: ["elle", "ille"],
    // essive
    [ESS]: ["ena", "ina"],
    [TRANSL]: ["eksi", "iksi"],
    // rare
    [INSTRUC]: ["in", "in"],
    [ABE]: ["etta", "itta"],
    [COM]: ["ine", "ine"], // works better
  },

  // Kotus type 8/nalle, no gradation
  8: {
    // grammatical
    [NOM]: ["e", "et"],
    [GEN]: ["en", ["ejen", "ein"]],
    [PTV]: ["ea", "eja"],
    // locative, internal
    [INE]: ["essa", "eissa"],
    [ELA]: ["esta", "eista"],
    [ILL]: ["een", "eihin"],
    // locative, external
    [ADE]: ["ella", "eilla"],
    [ABL]: ["elta", "eilta"],
    [ALL]: ["elle", "eille"],
    // essive
    [ESS]: ["ena", "eina"],
    [TRANSL]: ["eksi", "eiksi"],
    // rare
    [INSTRUC]: ["ein", "ein"],
    [ABE]: ["etta", "eitta"],
    [COM]: ["eine", "eine"], // works better
  },

  // Kotus type 9/kala, t-d gradation (sata)
  109: {
    // grammatical
    [NOM]: ["ta", "dat"],
    [GEN]: ["dan", ["tojen", "tain"]],
    [PTV]: ["taa", "toja"],
    // locative, internal
    [INE]: ["dassa", "doissa"],
    [ELA]: ["dasta", "doista"],
    [ILL]: ["taan", "toihin"],
    // locative, external
    [ADE]: ["dalla", "doilla"],
    [ABL]: ["dalta", "doilta"],
    [ALL]: ["dalle", "doille"],
    // essive
    [ESS]: ["tana", "toina"],
    [TRANSL]: ["daksi", "doiksi"],
    // rare
    [INSTRUC]: ["doin", "doin"],
    [ABE]: ["datta", "doitta"],
    [COM]: ["toine", "toine"], // works better
  },

  // Kotus type 10/koira, no gradation
  10: {
    // grammatical
    [NOM]: ["a", "at"],
    [GEN]: ["an", ["ien", "ain"]],
    [PTV]: ["aa", "ia"],
    // locative, internal
    [INE]: ["assa", "issa"],
    [ELA]: ["asta", "ista"],
    [ILL]: ["aan", "iin"],
    // locative, external
    [ADE]: ["alla", "illa"],
    [ABL]: ["alta", "ilta"],
    [ALL]: ["alle", "ille"],
    // essive
    [ESS]: ["ana", "ina"],
    [TRANSL]: ["aksi", "iksi"],
    // rare
    [INSTRUC]: ["in", "in"],
    [ABE]: ["atta", "itta"],
    [COM]: ["ine", "ine"], // works better
  },

  // Kotus type 27/käsi, t-d gradation
  27: {
    // grammatical
    [NOM]: ["si", "det"],
    [GEN]: ["den", ["sien", "tten"]],
    [PTV]: ["tta", "sia"],
    // locative, internal
    [INE]: ["dessa", "sissa"],
    [ELA]: ["desta", "sista"],
    [ILL]: ["teen", "siin"],
    // locative, external
    [ADE]: ["della", "silla"],
    [ABL]: ["delta", "silta"],
    [ALL]: ["delle", "sille"],
    // essive
    [ESS]: ["tena", "sina"],
    [TRANSL]: ["deksi", "siksi"],
    // rare
    [INSTRUC]: ["sin", "sin"],
    [ABE]: ["detta", "sitta"],
    [COM]: ["sine", "sine"], // works better
  },

  // Kotus type 31/kaksi, t-d gradation
  31: {
    // grammatical
    [NOM]: ["ksi", "hdet"],
    [GEN]: ["hden", "ksien"],
    [PTV]: ["hta", "ksia"],
    // locative, internal
    [INE]: ["hdessa", "ksissa"],
    [ELA]: ["hdesta", "ksista"],
    [ILL]: ["hteen", "ksiin"],
    // locative, external
    [ADE]: ["hdella", "ksilla"],
    [ABL]: ["hdelta", "ksilta"],
    [ALL]: ["hdelle", "ksille"],
    // essive
    [ESS]: ["htena", "ksina"],
    [TRANSL]: ["hdeksi", "ksiksi"],
    // rare
    [INSTRUC]: ["ksin", "ksin"],
    [ABE]: ["hdetta", "ksitta"],
    [COM]: ["ksine", "ksine"], // works better
  },

  // Kotus type 32/sisar, no gradation
  32: {
    // grammatical
    [NOM]: ["", "et"],
    [GEN]: ["en", ["ien", "ten"]],
    [PTV]: ["ta", "ia"],
    // locative, internal
    [INE]: ["essa", "issa"],
    [ELA]: ["esta", "ista"],
    [ILL]: ["een", "iin"],
    // locative, external
    [ADE]: ["ella", "illa"],
    [ABL]: ["elta", "ilta"],
    [ALL]: ["elle", "ille"],
    // essive
    [ESS]: ["ena", "ina"],
    [TRANSL]: ["eksi", "iksi"],
    // rare
    [INSTRUC]: ["in", "in"],
    [ABE]: ["etta", "itta"],
    [COM]: ["ine", "ine"], // works better
  },

  // Kotus type 38/nainen, no gradation
  38: {
    // grammatical
    [NOM]: ["nen", "set"],
    [GEN]: ["sen", ["sten", "sien"]],
    [PTV]: ["sta", "sia"],
    // locative, internal
    [INE]: ["sessa", "sissa"],
    [ELA]: ["sesta", "sista"],
    [ILL]: ["seen", "siin"],
    // locative, external
    [ADE]: ["sella", "silla"],
    [ABL]: ["selta", "silta"],
    [ALL]: ["selle", "sille"],
    // essive
    [ESS]: ["sena", "sina"],
    [TRANSL]: ["seksi", "siksi"],
    // rare
    [INSTRUC]: ["sin", "sin"],
    [ABE]: ["setta", "sitta"],
    [COM]: ["sine", "sine"], // works better
  },

  // Kotus type 45/kahdeksas, nt-nn gradation
  45: {
    // grammatical
    [NOM]: ["s", "nnet"],
    [GEN]: ["nnen", "nsien"],
    [PTV]: ["tta", "nsia"],
    // locative, internal
    [INE]: ["nnessa", "nsissa"],
    [ELA]: ["nnesta", "nsista"],
    [ILL]: ["nteen", "nsiin"],
    // locative, external
    [ADE]: ["nnella", "nsilla"],
    [ABL]: ["nnelta", "nsilta"],
    [ALL]: ["nnelle", "nsille"],
    // essive
    [ESS]: ["ntena", "nsina"],
    [TRANSL]: ["nneksi", "nsiksi"],
    // rare
    [INSTRUC]: ["nsin", "nsin"],
    [ABE]: ["nnetta", "nsitta"],
    [COM]: ["nsine", "nsine"], // works better
  },

  // Kotus type 46/tuhat, nt-nn gradation
  46: {
    // grammatical
    [NOM]: ["t", "nnet"],
    [GEN]: ["nnen", ["nsien", "nten"]],
    [PTV]: ["tta", "nsia"],
    // locative, internal
    [INE]: ["nnessa", "nsissa"],
    [ELA]: ["nnesta", "nsista"],
    [ILL]: ["nteen", "nsiin"],
    // locative, external
    [ADE]: ["nnella", "nsilla"],
    [ABL]: ["nnelta", "nsilta"],
    [ALL]: ["nnelle", "nsille"],
    // essive
    [ESS]: ["ntena", "nsina"],
    [TRANSL]: ["nneksi", "nsiksi"],
    // rare
    [INSTRUC]: ["nsin", "nsin"],
    [ABE]: ["nnetta", "nsitta"],
    [COM]: ["nsine", "nsine"], // works better
  },
};

// kolme
{
  const k8 = KOTUS_TYPE[8] as KotusTable;
  const k7 = KOTUS_TYPE[7] as KotusTable;
  const k108: KotusTable = {};
  for (const c of Object.keys(k8).map(Number)) {
    k108[c] = [(k8[c] as readonly [Suffix, Suffix])[0], (k7[c] as readonly [Suffix, Suffix])[1]];
  }
  k108[INSTRUC] = ["en", "in"];
  k108[ABE] = ["etta", "itta"];
  k108[COM] = ["ine", "ine"];
  KOTUS_TYPE[108] = k108;
}

// seitsemän, kahdeksan, yhdeksän
KOTUS_TYPE[110] = { ...KOTUS_TYPE[10], [NOM]: ["an", "at"] };

// kymmenen
KOTUS_TYPE[132] = { ...KOTUS_TYPE[32], [NOM]: ["en", "et"] };

/** A Python tuple `(stem, kotus_type)` or `(stem, kotus_type, case)`. */
class Part {
  readonly stem: string;
  readonly kotusType: number;
  readonly case: number | undefined;
  constructor(stem: string, kotusType: number, kase?: number) {
    this.stem = stem;
    this.kotusType = kotusType;
    this.case = kase;
  }
}

function p(stem: string, kotusType: number, kase?: number): Part {
  return new Part(stem, kotusType, kase);
}

/** A word: a tuple, plain text, or a (Python) list of those. */
type Text = Part | string | (Part | string)[];
/** A `(text, number)` pair, as splitnum and merge pass them. */
type FiPair = [Text, bigint];
/** The nested structure splitnum builds and clean reduces (`undefined` is Python's None). */
type FiSplit = FiPair | FiSplit[] | undefined;

function isPair(x: FiSplit): x is FiPair {
  return Array.isArray(x) && x.length === 2 && typeof x[1] === "bigint";
}

function isList(x: FiSplit): x is FiSplit[] {
  return Array.isArray(x) && !isPair(x);
}

function inflect(parts: Text, options: Options): string {
  const list: (Part | string)[] = Array.isArray(parts) ? parts : [parts];

  let out = "";
  for (const part of list) {
    // part is plain text, concat and continue
    if (!(part instanceof Part)) {
      out += part;
      continue;
    }
    // predefined case (kaksikymmentä, ...)
    let tmpCase = options.case;
    if (part.case !== undefined) {
      // override singular nominative only
      if (options.case === NOM && !options.plural) {
        tmpCase = part.case;
      }
    }
    // stem and suffix
    const { stem, kotusType } = part;
    const forms = getItem(
      getItem(KOTUS_TYPE as Record<string, KotusTable>, String(kotusType)) as Record<
        string,
        readonly [Suffix, Suffix]
      >,
      String(tmpCase),
    );
    let suffix: Suffix = at(forms, Number(options.plural));
    // many choices, choose preferred or first
    if (typeof suffix !== "string") {
      // set(options.prefer or set()): a string gives its characters
      const prefer = new Set<string>(options.prefer ? [...options.prefer] : []);
      const common = [...new Set(suffix)].filter((s) => prefer.has(s));
      if (common.length === 1) {
        suffix = common[0] as string;
      } else {
        suffix = suffix[0] as string;
      }
    }
    // apply vowel harmony
    if (!BACK_TO_FRONT.some(([back]) => stem.includes(back))) {
      for (const [back, front] of BACK_TO_FRONT) {
        suffix = suffix.replaceAll(back, front);
      }
    }
    // concat
    out += stem + suffix;
  }

  return out;
}

type Prefer = Iterable<string> | null | undefined;

class Options {
  ordinal: boolean;
  case: number;
  plural: boolean;
  prefer: Prefer;

  constructor(ordinal: boolean, kase: number, plural: boolean, prefer: Prefer) {
    this.ordinal = ordinal;
    this.case = kase;
    this.plural = plural;
    this.prefer = prefer;
  }

  variation(
    opts: { ordinal?: boolean; case?: number; plural?: boolean; prefer?: Prefer } = {},
  ): Options {
    return new Options(
      opts.ordinal ?? this.ordinal,
      opts.case ?? this.case,
      opts.plural ?? this.plural,
      opts.prefer ?? this.prefer,
    );
  }
}

/** Options of `toCardinal` and `toOrdinal`. */
export interface FiOptions {
  /** Grammatical case name, e.g. "genitive". */
  case?: string;
  plural?: boolean;
  /** Preferred suffixes where several exist, e.g. `["ain"]`. */
  prefer?: Iterable<string> | null;
}

/** Options of `toYear`. */
export interface YearOptions {
  suffix?: string | null;
  longval?: boolean;
}

/** Python `divmod(value, elem)` keeping the type of `value`. */
function pyDivmod(value: PyNum, elem: bigint): [PyNum, PyNum] {
  if (typeof value === "bigint") {
    const q = value / elem;
    const r = value % elem;
    // floor semantics (operands are non-negative here, but keep Python's rule)
    if (r !== 0n && r < 0n !== elem < 0n) return [q - 1n, r + elem];
    return [q, r];
  }
  if (typeof value === "number") {
    // CPython float_divmod
    const wx = Number(elem);
    let m = value % wx;
    let div = (value - m) / wx;
    if (m) {
      if (wx < 0 !== m < 0) {
        m += wx;
        div -= 1.0;
      }
    } else {
      m = wx < 0 ? -0 : 0;
    }
    let floordiv: number;
    if (div) {
      floordiv = Math.floor(div);
      if (div - floordiv > 0.5) floordiv += 1.0;
    } else {
      floordiv = value / wx < 0 ? -0 : 0;
    }
    return [floordiv, m];
  }
  return value.divmod(elem);
}

function truthy(x: PyNum): boolean {
  return !eq(x, 0n);
}

export class Num2Word_FI extends Num2Word_EU {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = (() => {
    const forms: Record<string, CurrencyForms> = {
      BRL: [["real", "realia"], GENERIC_CENTAVOS],
      CHF: [
        ["frangi", "frangia"],
        ["rappen", "rappenia"],
      ],
      CNY: [
        ["juan", "juania"],
        ["fen", "feniä"],
      ],
      EUR: [["euro", "euroa"], GENERIC_CENTS],
      FIM: [
        ["markka", "markkaa"],
        ["penni", "penniä"],
      ], // historical
      INR: [
        ["rupia", "rupiaa"],
        ["paisa", "paisaa"],
      ],
      JPY: [
        ["jeni", "jeniä"],
        ["sen", "seniä"],
      ], // rare subunit
      KRW: [
        ["won", "wonia"],
        ["jeon", "jeonia"],
      ], // rare subunit
      KPW: [
        ["won", "wonia"],
        ["chon", "chonia"],
      ], // rare subunit
      MXN: [["peso", "pesoa"], GENERIC_CENTAVOS],
      RUB: [
        ["rupla", "ruplaa"],
        ["kopeekka", "kopeekkaa"],
      ],
      TRY: [
        ["liira", "liiraa"],
        ["kuruş", "kuruşia"],
      ],
      ZAR: [["randi", "randia"], GENERIC_CENTS],
    };

    // crowns
    for (const currCode of ["DKK", "ISK", "NOK", "SEK"]) {
      forms[currCode] = [
        ["kruunu", "kruunua"],
        ["äyri", "äyriä"],
      ];
    }

    // dollars
    for (const currCode of ["AUD", "CAD", "HKD", "NZD", "SGD", "USD"]) {
      forms[currCode] = [["dollari", "dollaria"], GENERIC_CENTS];
    }

    // pounds
    for (const currCode of ["GBP"]) {
      forms[currCode] = [
        ["punta", "puntaa"],
        ["penny", "pennyä"],
      ];
    }
    return forms;
  })();

  static override CURRENCY_ADJECTIVES: Record<string, string> = {
    AUD: "Australian",
    BRL: "Brasilian",
    CAD: "Kanadan",
    CHF: "Sveitsin",
    DKK: "Tanskan",
    FIM: "Suomen", // historical
    GBP: "Englannin",
    HKD: "Hongkongin",
    INR: "Intian",
    ISK: "Islannin",
    KRW: "Etelä-Korean",
    KPW: "Pohjois-Korean",
    MXN: "Meksikon",
    NOK: "Norjan",
    NZD: "Uuden-Seelannin",
    RUB: "Venäjän",
    SEK: "Ruotsin",
    SGD: "Singaporen",
    TRY: "Turkin",
    USD: "Yhdysvaltain",
    ZAR: "Etelä-Afrikan",
  };

  declare ords: Map<bigint, Text>;
  declare midOrds: [bigint, Text][];
  declare lowOrds: [bigint, Text][];

  /** `self.cards`, whose values here are Finnish words, not strings. */
  private get fiCards(): Map<bigint, Text> {
    return this.cards as unknown as Map<bigint, Text>;
  }

  override setNumwords(): void {
    this.setHighNumwords(this.highNumwords as string[]);
    this.setMidNumwords(this.midNumwords as unknown as [bigint, Text][], this.midOrds);
    this.setLowNumwords(this.lowNumwords as unknown as [bigint, Text][], this.lowOrds);
  }

  override setHighNumwords(high: string[]): void {
    // references:
    // https://fi.wikipedia.org/wiki/Suurten_lukujen_nimet
    // https://en.wikipedia.org/wiki/Names_of_large_numbers#Standard_dictionary_numbers

    // translate to Finnish
    const replacements: [string, string][] = [
      ["qu", "kv"],
      ["x", "ks"],
      ["c", "k"],
      ["kent", "sent"], // applied after c -> k to cent
    ];
    const translated: string[] = [];
    for (let i = 0; i < high.length; i++) {
      let numword = high[i] as string;
      // notes:
      // - 1e6**9 can be either noviljoona or noniljoona
      // - 1e6**38 and above are untested

      // 1e6**6 is sekstiljoona but 1e6**16 is sedekiljoona
      if (numword.startsWith("sex") && numword !== "sext") {
        numword = numword.replaceAll("sex", "se");
      }
      // 1e6**7 is septiljoona but 1e6**17 is septendekiljoona
      else if (numword.startsWith("sept") && numword !== "sept") {
        numword = `septen${numword.slice("sept".length)}`;
      }
      // 1e6**8 is oktiljoona but 1e6**18 is duodevigintiljoona
      // (2 from 20)
      else if (numword.startsWith("octo")) {
        numword = at(high, i + -10);
        numword = `duode${numword.slice("octo".length)}`;
      }
      // 1e6**9 is noniljoona but 1e6**19 is undevigintiljoona (1 from 20)
      else if (numword.startsWith("nove")) {
        numword = at(high, i + -10);
        numword = `unde${numword.slice("nove".length + 1)}`;
      }

      // apply general replacements to all numwords
      for (const repl of replacements) {
        numword = numword.replaceAll(repl[0], repl[1]);
      }
      translated.push(numword);
    }

    const max = 6 * translated.length;
    let n = max;
    for (const word of translated) {
      if (n <= 0) break;
      if (n === 6) {
        // irregularity considering short scale and long scale
        this.fiCards.set(10n ** 9n, p("miljard", 5));
        this.ords.set(10n ** 9n, p("miljardi", 45));
      }
      this.fiCards.set(10n ** BigInt(n), p(`${word}iljoon`, 10));
      this.ords.set(10n ** BigInt(n), p(`${word}iljoona`, 45));
      n -= 6;
    }
  }

  override setMidNumwords(cards: [bigint, Text][], ords: [bigint, Text][] = []): void {
    for (const [key, val] of cards) {
      this.fiCards.set(key, val);
    }
    for (const [key, val] of ords) {
      this.ords.set(key, val);
    }
  }

  override setLowNumwords(cards: [bigint, Text][] | string[], ords: [bigint, Text][] = []): void {
    for (const [key, val] of cards as [bigint, Text][]) {
      this.fiCards.set(key, val);
    }
    for (const [key, val] of ords) {
      this.ords.set(key, val);
    }
  }

  override setup(): void {
    // Python's __init__ creates self.ords before Num2Word_Base.__init__.
    this.ords = new Map();
    super.setup();

    this.negword = "miinus ";
    this.pointword = "pilkku";
    this.excludeTitle = ["pilkku", "miinus"];

    const midNumwords: [bigint, Text][] = [
      [1000n, p("tuha", 46)],
      [100n, p("sa", 109)],
      [90n, [p("yhdeks", 110), p("kymmen", 132, PTV)]],
      [80n, [p("kahdeks", 110), p("kymmen", 132, PTV)]],
      [70n, [p("seitsem", 110), p("kymmen", 132, PTV)]],
      [60n, [p("kuu", 27), p("kymmen", 132, PTV)]],
      [50n, [p("vii", 27), p("kymmen", 132, PTV)]],
      [40n, [p("nelj", 10), p("kymmen", 132, PTV)]],
      [30n, [p("kolm", 108), p("kymmen", 132, PTV)]],
    ];
    this.midNumwords = midNumwords as unknown as [bigint, string][];

    this.midOrds = [
      [1000n, p("tuhanne", 45)],
      [100n, p("sada", 45)],
      [90n, [p("yhdeksä", 45), p("kymmene", 45)]],
      [80n, [p("kahdeksa", 45), p("kymmene", 45)]],
      [70n, [p("seitsemä", 45), p("kymmene", 45)]],
      [60n, [p("kuude", 45), p("kymmene", 45)]],
      [50n, [p("viide", 45), p("kymmene", 45)]],
      [40n, [p("neljä", 45), p("kymmene", 45)]],
      [30n, [p("kolma", 45), p("kymmene", 45)]],
    ];

    const lowNumwords: [bigint, Text][] = [
      [20n, [p("ka", 31), p("kymmen", 132, PTV)]],
      [19n, [p("yhdeks", 110), "toista"]],
      [18n, [p("kahdeks", 110), "toista"]],
      [17n, [p("seitsem", 110), "toista"]],
      [16n, [p("kuu", 27), "toista"]],
      [15n, [p("vii", 27), "toista"]],
      [14n, [p("nelj", 10), "toista"]],
      [13n, [p("kolm", 108), "toista"]],
      [12n, [p("ka", 31), "toista"]],
      [11n, [p("y", 31), "toista"]],
      [10n, p("kymmen", 132)],
      [9n, p("yhdeks", 110)],
      [8n, p("kahdeks", 110)],
      [7n, p("seitsem", 110)],
      [6n, p("kuu", 27)],
      [5n, p("vii", 27)],
      [4n, p("nelj", 10)],
      [3n, p("kolm", 108)],
      [2n, p("ka", 31)],
      [1n, p("y", 31)],
      [0n, p("noll", 10)],
    ];
    this.lowNumwords = lowNumwords as unknown as string[];

    this.lowOrds = [
      [20n, [p("kahde", 45), p("kymmene", 45)]],
      [19n, [p("yhdeksä", 45), "toista"]],
      [18n, [p("kahdeksa", 45), "toista"]],
      [17n, [p("seitsemä", 45), "toista"]],
      [16n, [p("kuude", 45), "toista"]],
      [15n, [p("viide", 45), "toista"]],
      [14n, [p("neljä", 45), "toista"]],
      [13n, [p("kolma", 45), "toista"]],
      [12n, [p("kahde", 45), "toista"]],
      [11n, [p("yhde", 45), "toista"]],
      [10n, p("kymmene", 45)],
      [9n, p("yhdeksä", 45)],
      [8n, p("kahdeksa", 45)],
      [7n, p("seitsemä", 45)],
      [6n, p("kuude", 45)],
      [5n, p("viide", 45)],
      [4n, p("neljä", 45)],
      [3n, p("kolma", 45)],
      [2n, p("toi", 38)],
      [1n, p("ensimmäi", 38)],
      [0n, p("nolla", 45)],
    ];
  }

  /** Python `merge(lpair, rpair, options)`; returns None (undefined) when lnum == rnum. */
  mergeFi(lpair: FiPair, rpair: FiPair, options: Options): FiPair | undefined {
    let [ltext, lnum] = lpair;
    let [rtext, rnum] = rpair;

    // http://www.kielitoimistonohjepankki.fi/ohje/49
    let sep = "";
    // ignore lpair if lnum is 1
    if (lnum === 1n) {
      rtext = inflect(rtext, options);
      return [rtext, rnum];
    }
    // rnum is added to lnum
    else if (lnum > rnum) {
      ltext = inflect(ltext, options);
      rtext = inflect(rtext, options);
      // separate groups with space
      if (lnum >= 1000n) {
        sep = " ";
      }
      return [`${ltext}${sep}${rtext}`, lnum + rnum];
    }
    // rnum is multiplied by lnum
    else if (lnum < rnum) {
      if (options.ordinal) {
        // kahdessadas, not toinensadas
        if (lnum === 2n) {
          ltext = p("kahde", 45);
        }
        rtext = inflect(rtext, options);
      } else {
        // kaksituhatta but kahdettuhannet
        let rcase = options.case;
        if (options.case === NOM && !options.plural) {
          rcase = PTV;
        }
        rtext = inflect(rtext, options.variation({ case: rcase }));
      }
      ltext = inflect(ltext, options);
      return [`${ltext}${rtext}`, lnum * rnum];
    }
    return undefined;
  }

  override toCardinal(value: PyNum, options: FiOptions = {}): string {
    const kase = getItem(NAME_TO_CASE, options.case ?? "nominative");
    const opts = new Options(false, kase, options.plural ?? false, options.prefer ?? null);
    let integral: boolean;
    try {
      integral = eq(int(value), value);
    } catch (e) {
      // int(inf) raises OverflowError, which upstream does not catch.
      if (!(e instanceof ValueError || e instanceof TypeError)) throw e;
      integral = false;
    }
    if (!integral) {
      if (kase !== NOM) {
        throw new NotImplementedError(
          "Cases other than nominative are not implemented for " +
            "cardinal floating point numbers.",
        );
      }
      return this.toCardinalFloat(value);
    }

    let out = "";
    if (cmp(value, 0n) < 0) {
      value = abs(value);
      out = this.negword;
    }

    if (cmp(value, this.MAXVAL) >= 0) {
      throw new OverflowError(
        this.errmsgToobig.replace("%s", str(value)).replace("%s", str(this.MAXVAL)),
      );
    }

    const val = this.splitnumFi(value, opts);
    const [words] = this.cleanFi(val, opts) as FiPair;
    return this.title(out + (words as string));
  }

  override toOrdinal(value: PyNum, options: FiOptions = {}): string {
    const kase = getItem(NAME_TO_CASE, options.case ?? "nominative");
    const opts = new Options(true, kase, options.plural ?? false, options.prefer ?? null);

    this.verifyOrdinal(value);
    if (cmp(value, this.MAXVAL) >= 0) {
      throw new OverflowError(
        this.errmsgToobig.replace("%s", str(value)).replace("%s", str(this.MAXVAL)),
      );
    }

    const val = this.splitnumFi(value, opts);
    const [words] = this.cleanFi(val, opts) as FiPair;
    return this.title(words as string);
  }

  override toOrdinalNum(_value: PyNum, options: { case?: string; plural?: boolean } = {}): string {
    getItem(NAME_TO_CASE, options.case ?? "nominative");
    throw new NotImplementedError();
  }

  override toYear(val: PyNum, options: YearOptions = {}): string {
    let suffix = options.suffix || "";
    if (cmp(val, 0n) < 0) {
      val = abs(val);
      suffix = suffix || " ennen ajanlaskun alkua";
    }
    return this.toCardinal(val).replaceAll(" ", "") + suffix;
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptions = {}): string {
    return super.toCurrency(val, {
      currency: options.currency ?? "EUR",
      cents: options.cents ?? true,
      separator: options.separator ?? " ja",
      adjective: options.adjective ?? false,
    });
  }

  /** Python `splitnum(value, options)`. */
  splitnumFi(value: PyNum, options: Options): FiSplit {
    const elems = options.ordinal ? this.ords : this.fiCards;
    for (const elem of elems.keys()) {
      if (cmp(elem, value) > 0) continue;

      const out: FiSplit[] = [];
      let div: PyNum;
      let mod: PyNum;
      if (eq(value, 0n)) {
        [div, mod] = [1n, 0n];
      } else {
        [div, mod] = pyDivmod(value, elem);
      }

      if (eq(div, 1n)) {
        out.push([elems.get(1n) as Text, 1n]);
      } else {
        if (eq(div, value)) {
          // The system tallies, eg Roman Numerals. Unreachable: every number
          // from 1 to 20 has its own word, so `div == value` needs elem 1 and
          // then div is 1.
          throw new ValueError("tally");
        }
        out.push(this.splitnumFi(div, options));
      }

      out.push([elems.get(elem) as Text, elem]);

      if (truthy(mod)) {
        out.push(this.splitnumFi(mod, options));
      }

      return out;
    }
    // Python falls off the loop and returns None.
    return undefined;
  }

  /** Python `clean(val, options)`. */
  cleanFi(val: FiSplit, options: Options): FiSplit {
    let out: FiSplit[] = val as FiSplit[];
    let v = val as FiSplit[];
    while (v.length !== 1) {
      out = [];
      const [left, right] = v;
      if (isPair(left) && isPair(right)) {
        out.push(this.mergeFi(left, right, options));
        if (v.length > 2) {
          out.push(v.slice(2));
        }
      } else {
        for (const elem of v) {
          if (isList(elem)) {
            if (elem.length === 1) {
              out.push(elem[0]);
            } else {
              out.push(this.cleanFi(elem, options));
            }
          } else {
            out.push(elem);
          }
        }
      }
      v = out;
    }
    return out[0];
  }
}
