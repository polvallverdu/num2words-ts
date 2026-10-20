// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_ID.py

import { Num2Word_Base } from "../base.ts";
import { checkKwargs } from "../internal/kwargs.ts";
import {
  abs,
  cmp,
  eq,
  getItem,
  int,
  missingAttribute,
  OverflowError,
  type PyNum,
  str,
} from "../py.ts";

type Block = [string];
type WordBlock = [string, string[]];

/**
 * Upstream's Num2Word_ID is a plain class, not a Num2Word_Base subclass. It
 * extends Num2Word_Base here only to fit CONVERTER_CLASSES: methods upstream
 * lacks raise AttributeError, and its methods take no keyword arguments.
 */
export class Num2Word_ID extends Num2Word_Base {
  static BASE: Record<string, string[]> = {
    0: [],
    1: ["satu"],
    2: ["dua"],
    3: ["tiga"],
    4: ["empat"],
    5: ["lima"],
    6: ["enam"],
    7: ["tujuh"],
    8: ["delapan"],
    9: ["sembilan"],
  };

  static TENS_TO: Record<string, string> = {
    3: "ribu",
    6: "juta",
    9: "miliar",
    12: "triliun",
    15: "kuadriliun",
    18: "kuantiliun",
    21: "sekstiliun",
    24: "septiliun",
    27: "oktiliun",
    30: "noniliun",
    33: "desiliun",
  };

  override setup(): void {
    this.errmsgFloatord = "Cannot treat float number as ordinal";
    this.errmsgNegord = "Cannot treat negative number as ordinal";
    this.errmsgToobig = "Number is too large to convert to words (abs(%s) > %s).";
    this.MAXVAL = 10n ** 36n;
  }

  private get idCls(): typeof Num2Word_ID {
    return this.constructor as typeof Num2Word_ID;
  }

  /** `self.BASE[int(digit)]`: int() raises ValueError on a non-digit. */
  private base(digit: string): string[] {
    return getItem(this.idCls.BASE, int(digit).toString());
  }

  splitByKoma(number: PyNum): string[] {
    return str(number).split(".");
  }

  /**
   * starting here, it groups the number by three from the tail
   * '1234567' -> (('1',),('234',),('567',))
   */
  splitBy3(number: string): Block[] {
    const blocks: Block[] = [];
    const length = number.length;

    if (length < 3) {
      blocks.push([number]);
    } else {
      const lenOfFirstBlock = length % 3;

      if (lenOfFirstBlock > 0) {
        blocks.push([number.slice(0, lenOfFirstBlock)]);
      }

      for (let i = lenOfFirstBlock; i < length; i += 3) {
        blocks.push([number.slice(i, i + 3)]);
      }
    }

    return blocks;
  }

  /**
   * it adds the list of spelling to the blocks
   * (('1',),('034',)) -> (('1',['satu']),('234',['tiga', 'puluh', 'empat']))
   */
  spell(blocks: Block[]): WordBlock[] {
    const wordBlocks: WordBlock[] = [];
    const firstBlock = blocks[0] as Block;
    let spelling: string[];
    if (firstBlock[0].length === 1) {
      if (firstBlock[0] === "0") {
        spelling = ["nol"];
      } else {
        spelling = this.base(firstBlock[0]);
      }
    } else if (firstBlock[0].length === 2) {
      spelling = this.puluh(firstBlock[0]);
    } else {
      spelling = [
        ...this.ratus(firstBlock[0][0] as string),
        ...this.puluh(firstBlock[0].slice(1, 3)),
      ];
    }

    wordBlocks.push([firstBlock[0], spelling]);

    for (const block of blocks.slice(1)) {
      spelling = [...this.ratus(block[0][0] as string), ...this.puluh(block[0].slice(1, 3))];
      wordBlocks.push([block[0], spelling]);
    }

    return wordBlocks;
  }

  ratus(number: string): string[] {
    // it is used to spell
    if (number === "1") {
      return ["seratus"];
    } else if (number === "0") {
      return [];
    }
    return [...this.base(number), "ratus"];
  }

  puluh(number: string): string[] {
    // it is used to spell
    if (number[0] === "1") {
      if (number[1] === "0") {
        return ["sepuluh"];
      } else if (number[1] === "1") {
        return ["sebelas"];
      }
      return [...this.base(number[1] as string), "belas"];
    } else if (number[0] === "0") {
      return this.base(number[1] as string);
    }
    return [...this.base(number[0] as string), "puluh", ...this.base(number[1] as string)];
  }

  spellFloat(floatPart: string): string {
    // spell the float number
    const wordList: string[] = [];
    for (const n of floatPart) {
      if (n === "0") {
        wordList.push("nol");
        continue;
      }
      wordList.push(...this.base(n));
    }
    return ["", "koma", ...wordList].join(" ");
  }

  /** join the words by first join lists in the tuple */
  join(wordBlocks: WordBlock[], floatPart: string): string {
    const wordList: string[] = [];
    const length = wordBlocks.length - 1;
    const firstBlock = [wordBlocks[0] as WordBlock];
    let start = 0;

    if (length === 1 && (firstBlock[0] as WordBlock)[0] === "1") {
      wordList.push("seribu");
      start = 1;
    }

    for (let i = start; i < length + 1; i++) {
      const spelling = (wordBlocks[i] as WordBlock)[1];
      wordList.push(...spelling);
      if (!spelling.length) {
        continue;
      }
      if (i === length) {
        break;
      }
      wordList.push(getItem(this.idCls.TENS_TO, String((length - i) * 3)));
    }

    return wordList.join(" ") + floatPart;
  }

  override toCardinal(number: PyNum, options?: object): string {
    checkKwargs(options, [], "to_cardinal");
    if (cmp(number, this.MAXVAL) >= 0) {
      throw new OverflowError(
        this.errmsgToobig.replace("%s", str(number)).replace("%s", str(this.MAXVAL)),
      );
    }
    let minus = "";
    if (cmp(number, 0n) < 0) {
      minus = "min ";
    }
    let floatWord = "";
    const n = this.splitByKoma(abs(number));
    if (n.length === 2) {
      floatWord = this.spellFloat(n[1] as string);
    }
    return minus + this.join(this.spell(this.splitBy3(n[0] as string)), floatWord);
  }

  override toOrdinal(number: PyNum, options?: object): string {
    checkKwargs(options, [], "to_ordinal");
    this.verifyOrdinal(number);
    const outWord = this.toCardinal(number);
    if (outWord === "satu") {
      return "pertama";
    }
    return `ke${outWord}`;
  }

  override toOrdinalNum(number: PyNum, options?: object): string {
    checkKwargs(options, [], "to_ordinal_num");
    this.verifyOrdinal(number);
    return `ke-${str(number)}`;
  }

  override toCurrency(value: PyNum | string, options?: object): string {
    checkKwargs(options, [], "to_currency");
    return `${this.toCardinal(value as PyNum)} rupiah`;
  }

  override toYear(value: PyNum, options?: object): string {
    checkKwargs(options, [], "to_year");
    return this.toCardinal(value);
  }

  override verifyOrdinal(value: PyNum): void {
    // The messages have no %s, so `msg % value` itself raises TypeError
    // ("not all arguments converted"); either way a TypeError.
    if (!eq(value, int(value))) {
      throw new TypeError(this.errmsgFloatord);
    }
    if (!eq(abs(value), value)) {
      throw new TypeError(this.errmsgNegord);
    }
  }

  override strToNumber(_value: string): PyNum {
    throw missingAttribute("Num2Word_ID", "str_to_number");
  }
}
