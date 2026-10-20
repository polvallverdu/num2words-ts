// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_JA.py

import { type CurrencyForms, Num2Word_Base, type Split, type WordPair } from "../base.ts";
import { toS } from "../compat.ts";
import { parseCurrencyParts, prefixCurrency } from "../currency.ts";
import {
  abs,
  at,
  cmp,
  Decimal,
  divmod,
  eq,
  float,
  floordiv,
  int,
  mod,
  NotImplementedError,
  OverflowError,
  type PyNum,
  str,
  ValueError,
} from "../py.ts";

/** A word, or alternatives for it. */
export type JaWord = string | readonly string[];
/** Kanji and kana reading of a number word. */
export type JaText = readonly [JaWord, JaWord];
/** `prefer`: any iterable of strings, as upstream builds a set from it. */
export type Prefer = Iterable<string> | null | undefined;
/** `reading`: false, true or "arabic" (years). */
export type Reading = boolean | string;

/**
 * Select the correct text from the Japanese number, reading and
 * alternatives
 */
export function selectText(text: JaText, reading: Reading = false, prefer: Prefer = null): string {
  // select kanji number or kana reading
  let t: JaWord = reading ? text[1] : text[0];

  // select the preferred one or the first one from multiple alternatives
  if (typeof t !== "string") {
    const pref = new Set(prefer || []);
    const common = [...new Set(t)].filter((x) => pref.has(x));
    if (common.length === 1) {
      t = common[0] as string;
    } else {
      t = at(t, 0);
    }
  }

  return t;
}

/** Merge lpair < rpair while applying semi-irregular rendaku rules */
export function rendakuMergePairs(lpair: WordPair, rpair: WordPair): WordPair {
  let ltext = lpair[0];
  let rtext = rpair[0];
  const lnum = lpair[1];
  const rnum = rpair[1];
  if (lnum > rnum) throw new ValueError();
  const is = (p: WordPair, t: string, n: bigint) => p[0] === t && p[1] === n;

  if (is(rpair, "ひゃく", 100n)) {
    if (is(lpair, "さん", 3n)) {
      rtext = "びゃく";
    } else if (is(lpair, "ろく", 6n)) {
      ltext = "ろっ";
      rtext = "ぴゃく";
    } else if (is(lpair, "はち", 8n)) {
      ltext = "はっ";
      rtext = "ぴゃく";
    }
  } else if (is(rpair, "せん", 1000n)) {
    if (is(lpair, "さん", 3n)) {
      rtext = "ぜん";
    } else if (is(lpair, "はち", 8n)) {
      ltext = "はっ";
    }
  } else if (is(rpair, "ちょう", 10n ** 12n)) {
    if (is(lpair, "いち", 1n)) {
      ltext = "いっ";
    } else if (is(lpair, "はち", 8n)) {
      ltext = "はっ";
    } else if (is(lpair, "じゅう", 10n)) {
      ltext = "じゅっ";
    }
  } else if (is(rpair, "けい", 10n ** 16n)) {
    if (is(lpair, "いち", 1n)) {
      ltext = "いっ";
    } else if (is(lpair, "ろく", 6n)) {
      ltext = "ろっ";
    } else if (is(lpair, "はち", 8n)) {
      ltext = "はっ";
    } else if (is(lpair, "じゅう", 10n)) {
      ltext = "じゅっ";
    } else if (is(lpair, "ひゃく", 100n)) {
      ltext = "ひゃっ";
    }
  }

  return [`${ltext}${rtext}`, lnum * rnum];
}

// Source: https://www.sljfaq.org/afaq/era-list.html
// if there are multiple eras for the same year, use the last one
export const ERA_START: [bigint, [string, string]][] = [
  [645n, ["大化", "たいか"]],
  [650n, ["白雉", "はくち"]],
  [686n, ["朱鳥", "しゅちょう"]],
  [701n, ["大宝", "たいほう"]],
  [704n, ["慶雲", "けいうん"]],
  [708n, ["和銅", "わどう"]],
  [715n, ["霊亀", "れいき"]],
  [717n, ["養老", "ようろう"]],
  [724n, ["神亀", "じんき"]],
  [729n, ["天平", "てんぴょう"]],
  [749n, ["天平感宝", "てんぴょうかんぽう"]],
  [749n, ["天平勝宝", "てんぴょうしょうほう"]],
  [757n, ["天平宝字", "てんぴょうじょうじ"]],
  [765n, ["天平神護", "てんぴょうじんご"]],
  [767n, ["神護景雲", "じんごけいうん"]],
  [770n, ["宝亀", "ほうき"]],
  [781n, ["天応", "てんおう"]],
  [782n, ["延暦", "えんりゃく"]],
  [806n, ["大同", "だいどう"]],
  [810n, ["弘仁", "こうにん"]],
  [823n, ["天長", "てんちょう"]],
  [834n, ["承和", "じょうわ"]],
  [848n, ["嘉祥", "かしょう"]],
  [851n, ["仁寿", "にんじゅ"]],
  [855n, ["斉衡", "さいこう"]],
  [857n, ["天安", "てんあん"]],
  [859n, ["貞観", "じょうがん"]],
  [877n, ["元慶", "がんぎょう"]],
  [885n, ["仁和", "にんな"]],
  [889n, ["寛平", "かんぴょう"]],
  [898n, ["昌泰", "しょうたい"]],
  [901n, ["延喜", "えんぎ"]],
  [923n, ["延長", "えんちょう"]],
  [931n, ["承平", "じょうへい"]],
  [938n, ["天慶", "てんぎょう"]],
  [947n, ["天暦", "てんりゃく"]],
  [957n, ["天徳", "てんとく"]],
  [961n, ["応和", "おうわ"]],
  [964n, ["康保", "こうほう"]],
  [968n, ["安和", "あんな"]],
  [970n, ["天禄", "てんろく"]],
  [974n, ["天延", "てんえん"]],
  [976n, ["貞元", "じょうげん"]],
  [979n, ["天元", "てんげん"]],
  [983n, ["永観", "えいかん"]],
  [985n, ["寛和", "かんな"]],
  [987n, ["永延", "えいえん"]],
  [989n, ["永祚", "えいそ"]],
  [990n, ["正暦", "しょうりゃく"]],
  [995n, ["長徳", "ちょうとく"]],
  [999n, ["長保", "ちょうほう"]],
  [1004n, ["寛弘", "かんこう"]],
  [1013n, ["長和", "ちょうわ"]],
  [1017n, ["寛仁", "かんにん"]],
  [1021n, ["治安", "じあん"]],
  [1024n, ["万寿", "まんじゅ"]],
  [1028n, ["長元", "ちょうげん"]],
  [1037n, ["長暦", "ちょうりゃく"]],
  [1040n, ["長久", "ちょうきゅう"]],
  [1045n, ["寛徳", "かんとく"]],
  [1046n, ["永承", "えいしょう"]],
  [1053n, ["天喜", "てんぎ"]],
  [1058n, ["康平", "こうへい"]],
  [1065n, ["治暦", "じりゃく"]],
  [1069n, ["延久", "えんきゅう"]],
  [1074n, ["承保", "じょうほう"]],
  [1078n, ["承暦", "じょうりゃく"]],
  [1081n, ["永保", "えいほう"]],
  [1084n, ["応徳", "おうとく"]],
  [1087n, ["寛治", "かんじ"]],
  [1095n, ["嘉保", "かほう"]],
  [1097n, ["永長", "えいちょう"]],
  [1098n, ["承徳", "じょうとく"]],
  [1099n, ["康和", "こうわ"]],
  [1104n, ["長治", "ちょうじ"]],
  [1106n, ["嘉承", "かじょう"]],
  [1108n, ["天仁", "てんにん"]],
  [1110n, ["天永", "てんねい"]],
  [1113n, ["永久", "えいきゅう"]],
  [1118n, ["元永", "げんえい"]],
  [1120n, ["保安", "ほうあん"]],
  [1124n, ["天治", "てんじ"]],
  [1126n, ["大治", "だいじ"]],
  [1131n, ["天承", "てんしょう"]],
  [1132n, ["長承", "ちょうしょう"]],
  [1135n, ["保延", "ほうえん"]],
  [1141n, ["永治", "えいじ"]],
  [1142n, ["康治", "こうじ"]],
  [1144n, ["天養", "てんよう"]],
  [1145n, ["久安", "きゅうあん"]],
  [1151n, ["仁平", "にんぺい"]],
  [1154n, ["久寿", "きゅうじゅ"]],
  [1156n, ["保元", "ほうげん"]],
  [1159n, ["平治", "へいじ"]],
  [1160n, ["永暦", "えいりゃく"]],
  [1161n, ["応保", "おうほう"]],
  [1163n, ["長寛", "ちょうかん"]],
  [1165n, ["永万", "えいまん"]],
  [1166n, ["仁安", "にんあん"]],
  [1169n, ["嘉応", "かおう"]],
  [1171n, ["承安", "しょうあん"]],
  [1175n, ["安元", "あんげん"]],
  [1177n, ["治承", "じしょう"]],
  [1181n, ["養和", "ようわ"]],
  [1182n, ["寿永", "じゅえい"]],
  [1184n, ["元暦", "げんりゃく"]],
  [1185n, ["文治", "ぶんじ"]],
  [1190n, ["建久", "けんきゅう"]],
  [1199n, ["正治", "しょうじ"]],
  [1201n, ["建仁", "けんにん"]],
  [1204n, ["元久", "げんきゅう"]],
  [1206n, ["建永", "けんえい"]],
  [1207n, ["承元", "じょうげん"]],
  [1211n, ["建暦", "けんりゃく"]],
  [1214n, ["建保", "けんぽう"]],
  [1219n, ["承久", "じょうきゅう"]],
  [1222n, ["貞応", "じょうおう"]],
  [1225n, ["元仁", "げんにん"]],
  [1225n, ["嘉禄", "かろく"]],
  [1228n, ["安貞", "あんてい"]],
  [1229n, ["寛喜", "かんき"]],
  [1232n, ["貞永", "じょうえい"]],
  [1233n, ["天福", "てんぷく"]],
  [1235n, ["文暦", "ぶんりゃく"]],
  [1235n, ["嘉禎", "かてい"]],
  [1239n, ["暦仁", "りゃくにん"]],
  [1239n, ["延応", "えんおう"]],
  [1240n, ["仁治", "にんじ"]],
  [1243n, ["寛元", "かんげん"]],
  [1247n, ["宝治", "ほうじ"]],
  [1249n, ["建長", "けんちょう"]],
  [1256n, ["康元", "こうげん"]],
  [1257n, ["正嘉", "しょうか"]],
  [1259n, ["正元", "しょうげん"]],
  [1260n, ["文応", "ぶんおう"]],
  [1261n, ["弘長", "こうちょう"]],
  [1264n, ["文永", "ぶんえい"]],
  [1275n, ["健治", "けんじ"]],
  [1278n, ["弘安", "こうあん"]],
  [1288n, ["正応", "しょうおう"]],
  [1293n, ["永仁", "えいにん"]],
  [1299n, ["正安", "しょうあん"]],
  [1303n, ["乾元", "けんげん"]],
  [1303n, ["嘉元", "かげん"]],
  [1307n, ["徳治", "とくじ"]],
  [1308n, ["延慶", "えんきょう"]],
  [1311n, ["応長", "おうちょう"]],
  [1312n, ["正和", "しょうわ"]],
  [1317n, ["文保", "ぶんぽう"]],
  [1319n, ["元応", "げんおう"]],
  [1321n, ["元亨", "げんこう"]],
  [1325n, ["正中", "しょうちゅ"]],
  [1326n, ["嘉暦", "かりゃく"]],
  [1329n, ["元徳", "げんとく"]],
  [1331n, ["元弘", "げんこう"]],
  [1332n, ["正慶", "しょうけい"]],
  [1334n, ["建武", "けんむ"]],
  [1336n, ["延元", "えいげん"]],
  [1338n, ["暦応", "りゃくおう"]],
  [1340n, ["興国", "こうこく"]],
  [1342n, ["康永", "こうえい"]],
  [1345n, ["貞和", "じょうわ"]],
  [1347n, ["正平", "しょうへい"]],
  [1350n, ["観応", "かんおう"]],
  [1352n, ["文和", "ぶんな"]],
  [1356n, ["延文", "えんぶん"]],
  [1361n, ["康安", "こうあん"]],
  [1362n, ["貞治", "じょうじ"]],
  [1368n, ["応安", "おうあん"]],
  [1370n, ["建徳", "けんとく"]],
  [1372n, ["文中", "ぶんちゅう"]],
  [1375n, ["永和", "えいわ"]],
  [1375n, ["天授", "てんじゅ"]],
  [1379n, ["康暦", "こうりゃく"]],
  [1381n, ["永徳", "えいとく"]],
  [1381n, ["弘和", "こうわ"]],
  [1384n, ["至徳", "しとく"]],
  [1384n, ["元中", "げんちゅう"]],
  [1387n, ["嘉慶", "かけい"]],
  [1389n, ["康応", "こうおう"]],
  [1390n, ["明徳", "めいとく"]],
  [1394n, ["応永", "おうえい"]],
  [1428n, ["正長", "しょうちょう"]],
  [1429n, ["永享", "えいきょう"]],
  [1441n, ["嘉吉", "かきつ"]],
  [1444n, ["文安", "ぶんあん"]],
  [1449n, ["宝徳", "ほうとく"]],
  [1452n, ["享徳", "きょうとく"]],
  [1455n, ["康正", "こうしょう"]],
  [1457n, ["長禄", "ちょうろく"]],
  [1461n, ["寛正", "かんしょう"]],
  [1466n, ["文正", "ぶんしょう"]],
  [1467n, ["応仁", "おうにん"]],
  [1469n, ["文明", "ぶんめい"]],
  [1487n, ["長享", "ちょうきょう"]],
  [1489n, ["延徳", "えんとく"]],
  [1492n, ["明応", "めいおう"]],
  [1501n, ["文亀", "ぶんき"]],
  [1504n, ["永正", "えいしょう"]],
  [1521n, ["大永", "だいえい"]],
  [1528n, ["享禄", "きょうろく"]],
  [1532n, ["天文", "てんぶん"]],
  [1555n, ["弘治", "こうじ"]],
  [1558n, ["永禄", "えいろく"]],
  [1570n, ["元亀", "げんき"]],
  [1573n, ["天正", "てんしょう"]],
  [1593n, ["文禄", "ぶんろく"]],
  [1596n, ["慶長", "けいちょう"]],
  [1615n, ["元和", "げんな"]],
  [1624n, ["寛永", "かんえい"]],
  [1645n, ["正保", "しょうほう"]],
  [1648n, ["慶安", "けいあん"]],
  [1652n, ["承応", "じょうおう"]],
  [1655n, ["明暦", "めいれき"]],
  [1658n, ["万治", "まんじ"]],
  [1661n, ["寛文", "かんぶん"]],
  [1673n, ["延宝", "えんぽう"]],
  [1681n, ["天和", "てんな"]],
  [1684n, ["貞享", "じょうきょう"]],
  [1688n, ["元禄", "げんろく"]],
  [1704n, ["宝永", "ほうえい"]],
  [1711n, ["正徳", "しょうとく"]],
  [1716n, ["享保", "きょうほう"]],
  [1736n, ["元文", "げんぶん"]],
  [1741n, ["寛保", "かんぽう"]],
  [1744n, ["延享", "えんきょう"]],
  [1748n, ["寛延", "かんえん"]],
  [1751n, ["宝暦", "ほうれき"]],
  [1764n, ["明和", "めいわ"]],
  [1773n, ["安永", "あんえい"]],
  [1781n, ["天明", "てんめい"]],
  [1801n, ["寛政", "かんせい"]],
  [1802n, ["享和", "きょうわ"]],
  [1804n, ["文化", "ぶんか"]],
  [1818n, ["文政", "ぶんせい"]],
  [1831n, ["天保", "てんぽう"]],
  [1845n, ["弘化", "こうか"]],
  [1848n, ["嘉永", "かえい"]],
  [1855n, ["安政", "あんせい"]],
  [1860n, ["万延", "まんえい"]],
  [1861n, ["文久", "ぶんきゅう"]],
  [1864n, ["元治", "げんじ"]],
  [1865n, ["慶応", "けいおう"]],
  [1868n, ["明治", "めいじ"]],
  [1912n, ["大正", "たいしょう"]],
  [1926n, ["昭和", "しょうわ"]],
  [1989n, ["平成", "へいせい"]],
  [2019n, ["令和", "れいわ"]],
];

export interface CardinalOptionsJA {
  reading?: Reading;
  prefer?: Prefer;
}

export interface OrdinalOptionsJA {
  reading?: Reading;
  prefer?: Prefer;
  counter?: string;
}

export interface YearOptionsJA {
  suffix?: string | null;
  longval?: boolean;
  reading?: Reading;
  prefer?: Prefer;
  era?: boolean;
}

export interface CurrencyOptionsJA {
  currency?: string;
  cents?: boolean;
  separator?: string;
  adjective?: boolean;
  reading?: Reading;
  prefer?: Prefer;
}

/** Python `a - b + c` and `a % b` keeping the operand type (int, float or Decimal). */
function addInt(a: PyNum, b: bigint): PyNum {
  if (typeof a === "bigint") return a + b;
  if (typeof a === "number") return a + Number(b);
  return a.add(b);
}

function modInt(a: PyNum, b: bigint): PyNum {
  if (typeof a === "bigint") return mod(a, b);
  if (typeof a === "number") {
    const r = a % Number(b);
    return r !== 0 && r < 0 !== Number(b) < 0 ? r + Number(b) : r;
  }
  return a.sub(Decimal.of(a.divmod(b)[0].toBigInt() * b, 0));
}

/** `cmp` that also orders float infinities against ints, as Python does. */
function cmpInf(a: PyNum, b: PyNum): number {
  if (typeof a === "number" && !Number.isFinite(a) && !Number.isNaN(a)) {
    return typeof b === "number" ? cmp(a, b) : a > 0 ? 1 : -1;
  }
  if (typeof b === "number" && !Number.isFinite(b) && !Number.isNaN(b)) return -cmpInf(b, a);
  return cmp(a, b);
}

/** Python `divmod(x, y)` for a float `x` and an int `y` (CPython's float_divmod). */
function floatDivmod(vx: number, w: bigint): [number, number] {
  const wx = Number(w);
  let m = vx % wx;
  let div = (vx - m) / wx;
  if (m) {
    if (wx < 0 !== m < 0) {
      m += wx;
      div -= 1;
    }
  } else {
    m = wx < 0 ? -0 : 0;
  }
  let floordiv: number;
  if (div) {
    floordiv = Math.floor(div);
    if (div - floordiv > 0.5) floordiv += 1;
  } else {
    floordiv = vx / wx < 0 ? -0 : 0;
  }
  return [floordiv, m];
}

export class Num2Word_JA extends Num2Word_Base {
  static override CURRENCY_FORMS: Record<string, CurrencyForms> = {
    JPY: [["円", "えん"], []],
  };

  /** `self.cards`, whose values are kanji/kana pairs in this language. */
  get jcards(): Map<bigint, JaText> {
    return this.cards as unknown as Map<bigint, JaText>;
  }

  override setHighNumwords(high: string[]): void {
    const max = 4 * high.length;
    let n = max;
    for (const word of high) {
      if (n <= 0) break;
      this.jcards.set(10n ** BigInt(n), word as unknown as JaText);
      n -= 4;
    }
  }

  override setup(): void {
    this.negword = "マイナス";
    this.pointword = ["点", "てん"] as unknown as string;
    this.excludeTitle = ["点", "マイナス"];

    const high: JaText[] = [
      ["万", "まん"], // 10**4 man
      ["億", "おく"], // 10**8 oku
      ["兆", "ちょう"], // 10**12 chō
      ["京", "けい"], // 10**16 kei
      ["垓", "がい"], // 10**20 gai
      ["秭", "し"], // 10**24 shi
      ["穣", "じょう"], // 10**28 jō
      ["溝", "こう"], // 10**32 kō
      ["澗", "かん"], // 10**36 kan
      ["正", "せい"], // 10**40 sei
      ["載", "さい"], // 10**44 sai
      ["極", "ごく"], // 10**48 goku
    ];

    high.reverse();
    this.highNumwords = high as unknown as string[];

    this.midNumwords = [
      [1000n, ["千", "せん"]],
      [100n, ["百", "ひゃく"]],
    ] as unknown as [bigint, string][];

    this.lowNumwords = [
      ["十", "じゅう"], // 10 jū
      ["九", "きゅう"], // 9 kyū
      ["八", "はち"], // 8 hachi
      ["七", ["なな", "しち"]], // 7 nana, shichi
      ["六", "ろく"], // 6 roku
      ["五", "ご"], // 5 go
      ["四", ["よん", "し"]], // 4 yon, shi
      ["三", "さん"], // 3 san
      ["二", "に"], // 2 ni
      ["一", "いち"], // 1 ichi
      // both are alternatives, 零 doesn't map to ゼロ or 〇 to れい
      [
        ["零", "〇"],
        ["ゼロ", "れい"],
      ], // 0 ZERO, rei
    ] as unknown as string[];
  }

  override merge(lpair: WordPair, rpair: WordPair): WordPair {
    const [ltext, lnum] = lpair;
    const [rtext, rnum] = rpair;

    // ignore lpair if lnum is 1 and rnum is less than 10000
    if (lnum === 1n && rnum < 10000n) {
      return rpair;
    } else if (lnum > rnum) {
      // rnum is added to lnum
      return [`${ltext}${rtext}`, lnum + rnum];
    } else if (lnum < rnum) {
      // rnum is multiplied by lnum
      return rendakuMergePairs(lpair, rpair);
    }
    // Python falls through and returns None.
    return undefined as unknown as WordPair;
  }

  protected _ordinalSuffix(reading: Reading, counter: string): string {
    if (reading) {
      if (counter === "番") {
        return "ばんめ";
      }
      throw new NotImplementedError(`Reading not implemented for ${counter}`);
    }
    return `${counter}目`;
  }

  override toOrdinal(value: PyNum, options: OrdinalOptionsJA = {}): string {
    const reading = options.reading ?? false;
    const prefer = options.prefer ?? null;
    const counter = options.counter ?? "番";
    this.verifyOrdinal(value);
    const base = this.toCardinal(value, { reading, prefer });
    return `${base}${this._ordinalSuffix(reading, counter)}`;
  }

  override toOrdinalNum(value: PyNum, options: OrdinalOptionsJA = {}): string {
    const reading = options.reading ?? false;
    const counter = options.counter ?? "番";
    return `${str(value)}${this._ordinalSuffix(reading, counter)}`;
  }

  override toYear(val: PyNum, options: YearOptionsJA = {}): string {
    const reading = options.reading ?? false;
    const prefer = options.prefer ?? null;
    const useEra = options.era ?? true;
    let year = val;
    // Gregorian calendar
    if (!useEra) {
      let prefix = "";
      if (cmpInf(year, 0n) < 0) {
        year = abs(year);
        prefix = reading ? "きげんぜん" : "紀元前";
      }

      let yearWords = this.toCardinal(year, { reading, prefer });
      if (reading && cmpInf(modInt(year, 10n), 9n) === 0) {
        yearWords = `${yearWords.slice(0, -3)}く`;
      }

      return `${prefix}${yearWords}${reading ? "ねん" : "年"}`;
    }

    // Era calendar (default)
    const minYear = (ERA_START[0] as [bigint, [string, string]])[0];
    const lastEraIdx = ERA_START.length - 1;
    if (cmpInf(year, minYear) < 0) {
      throw new ValueError(`Can't convert years less than ${minYear} to era`);
    }

    let first = 0;
    let last = lastEraIdx;
    let eraIdx: number | null = null;
    while (eraIdx === null) {
      const mid = Number(floordiv(BigInt(first + last), 2n));
      if (
        mid === lastEraIdx ||
        (cmpInf(at(ERA_START, mid)[0], year) <= 0 && cmpInf(at(ERA_START, mid + 1)[0], year) > 0)
      ) {
        eraIdx = mid;
        // if an era lasting less than a year is preferred, choose it
        if (prefer) {
          const pref = new Set(prefer);
          let i = mid - 1;
          while (i >= 0 && cmpInf(at(ERA_START, i)[0], year) === 0) {
            // match kanji or hiragana
            if (at(ERA_START, i)[1].some((x) => pref.has(x))) {
              eraIdx = i;
              break;
            }
            i -= 1;
          }
        }
      }

      // ends up at the last index where year >= ERA_START[mid][0]
      if (cmpInf(year, at(ERA_START, mid)[0]) < 0) {
        last = mid - 1;
      } else {
        first = mid + 1;
      }
    }

    const era = at(ERA_START, eraIdx);
    let eraName = era[1][0];
    const eraYear = addInt(addInt(year, -era[0]), 1n);
    let eraYearWords: string;
    let suffix = "年";
    if (reading === "arabic") {
      eraYearWords = str(eraYear);
    } else if (reading) {
      eraName = era[1][1];
      eraYearWords =
        cmpInf(eraYear, 1n) !== 0 ? this.toCardinal(eraYear, { reading: true, prefer }) : "がん";
      if (cmpInf(modInt(eraYear, 10n), 9n) === 0) {
        eraYearWords = `${eraYearWords.slice(0, -3)}く`;
      }
      suffix = "ねん";
    } else {
      eraYearWords =
        cmpInf(eraYear, 1n) !== 0 ? this.toCardinal(eraYear, { reading: false, prefer }) : "元";
    }

    return `${eraName}${eraYearWords}${suffix}`;
  }

  override toCurrency(val: PyNum | string, options: CurrencyOptionsJA = {}): string {
    const currency = options.currency ?? "JPY";
    const cents = options.cents ?? false;
    const adjective = options.adjective ?? false;
    const reading = options.reading ?? false;
    const prefer = options.prefer ?? null;
    const [left, right, isNegative] = parseCurrencyParts(val, cents);

    const forms = Object.hasOwn(this.cls.CURRENCY_FORMS, currency)
      ? this.cls.CURRENCY_FORMS[currency]
      : undefined;
    if (!forms) {
      throw new NotImplementedError(
        `Currency code "${currency}" not implemented for "${this.constructor.name}"`,
      );
    }
    let [cr1, cr2] = forms;
    if ((cents || !eq(abs(val as PyNum), left)) && !cr2.length) {
      throw new ValueError(`Decimals not supported for "${currency}"`);
    }

    if (adjective && Object.hasOwn(this.cls.CURRENCY_ADJECTIVES, currency)) {
      cr1 = prefixCurrency(this.cls.CURRENCY_ADJECTIVES[currency] as string, cr1);
    }

    const minusStr = isNegative ? this.negword : "";

    return `${minusStr}${this.toCardinal(left, { reading, prefer })}${reading ? cr1[1] : cr1[0]}${
      cr2.length ? this.toCardinal(right, { reading, prefer }) : ""
    }${cr2.length ? (reading ? cr2[1] : cr2[0]) : ""}`;
  }

  override splitnum(
    value: bigint | number,
    reading: Reading = false,
    prefer: Prefer = null,
  ): Split {
    // Upstream passes an integral float through unchanged, so its divmod is
    // float arithmetic (inexact above 2**53).
    for (const elem of this.jcards.keys()) {
      if (cmp(elem, value) > 0) continue;

      const out: Split[] = [];
      let div: bigint | number;
      let rem: bigint | number;
      if (eq(value, 0n)) {
        [div, rem] = [1n, 0n];
      } else if (typeof value === "number") {
        [div, rem] = floatDivmod(value, elem);
      } else {
        [div, rem] = divmod(value, elem);
      }

      if (eq(div, 1n)) {
        out.push([selectText(this.jcards.get(1n) as JaText, reading, prefer), 1n]);
      } else {
        if (eq(div, value)) {
          // The system tallies, eg Roman Numerals
          if (typeof div === "number")
            throw new TypeError("can't multiply sequence by non-int of type 'float'");
          return [
            [
              selectText(this.jcards.get(elem) as JaText, reading, prefer).repeat(Number(div)),
              div * elem,
            ],
          ];
        }
        out.push(this.splitnum(div, reading, prefer));
      }

      out.push([selectText(this.jcards.get(elem) as JaText, reading, prefer), elem]);

      if (rem) {
        out.push(this.splitnum(rem, reading, prefer));
      }

      return out;
    }
    // Python falls off the loop and returns None.
    return undefined as unknown as Split;
  }

  override toCardinal(value: PyNum, options: CardinalOptionsJA = {}): string {
    const reading = options.reading ?? false;
    const prefer = options.prefer ?? null;
    let integral: boolean;
    try {
      integral = eq(int(value), value);
    } catch (e) {
      // int(inf) raises OverflowError, which upstream does not catch.
      if (e instanceof OverflowError) throw e;
      integral = false;
    }
    if (!integral) {
      return this.toCardinalFloat(value, { reading, prefer });
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

    const val = this.splitnum(typeof value === "number" ? value : int(value), reading, prefer);
    const [words] = this.clean(val);
    return this.title(out + words);
  }

  override toCardinalFloat(value: PyNum | string, options: CardinalOptionsJA = {}): string {
    const reading = options.reading ?? false;
    // Python truthiness: an empty list or string falls back too.
    const p = options.prefer;
    const prefer: Prefer =
      p && !(typeof p === "string" ? p.length === 0 : [...p].length === 0) ? p : ["れい"];
    try {
      float(value);
    } catch {
      throw new TypeError(this.errmsgNonnum.replace("%s", str(value)));
    }

    const [pre, postInt] = this.float2tuple(float(value));

    let post = postInt.toString();
    post = "0".repeat(Math.max(0, this.precision - post.length)) + post;

    const out = [this.toCardinal(pre, { reading, prefer })];
    if (this.precision) {
      const pointword = this.pointword as unknown as [string, string];
      out.push(this.title(pointword[reading ? 1 : 0]));
    }

    for (let i = 0; i < this.precision; i++) {
      const curr = int(at(post, i));
      out.push(toS(this.toCardinal(curr, { reading, prefer })));
    }

    return out.join("");
  }
}
