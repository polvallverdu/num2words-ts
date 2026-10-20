// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_KN.py

import type { WordPair } from "../base.ts";
import { type PyNum, str } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

export class Num2Word_KN extends Num2Word_EU {
  declare modifiers: string[];

  override setHighNumwords(_high: string[]): void {
    // Upstream stores (exponent, word) pairs in high_numwords.
    for (const [n, word] of this.highNumwords as unknown as [number, string][]) {
      this.cards.set(10n ** BigInt(n), word);
    }
  }

  override setup(): void {
    this.lowNumwords = [
      "ತೊಂಬತ್ತೊಂಬತ್ತು",
      "ತೊಂಬತ್ತೆಂಟು",
      "ತೊಂಬತ್ತೇಳು",
      "ತೊಂಬತ್ತಾರು",
      "ತೊಂಬತ್ತೈದು",
      "ತೊಂಬತ್ತ ನಾಲ್ಕು",
      "ತೊಂಬತ್ತ ಮೂರು",
      "ತೊಂಬತ್ತೆರಡು",
      "ತೊಂಬತ್ತೊಂದು",
      "ತೊಂಬತ್ತು",
      "ಎಂಬತ್ತೊಂಬತ್ತು",
      "ಎಂಬತ್ತೆಂಟು",
      "ಎಂಬತ್ತೇಳು",
      "ಎಂಬತ್ತಾರು",
      "ಎಂಬತ್ತೈದು",
      "ಎಂಬತ್ತ್ ನಾಲ್ಕು",
      "ಎಂಬತ್ತ್ ಮೂರು",
      "ಎಂಬತ್ತೆರಡು",
      "ಎಂಬತ್ತೊಂದು",
      "ಎಂಬತ್ತು",
      "ಎಪ್ಪತ್ತೊಂಬತ್ತು",
      "ಎಪ್ಪತ್ತೆಂಟು",
      "ಎಪ್ಪತ್ತೇಳು",
      "ಎಪ್ಪತ್ತಾರು",
      "ಎಪ್ಪತ್ತೈದು",
      "ಎಪ್ಪತ್ತ್ ನಾಲ್ಕು",
      "ಎಪ್ಪತ್ತ್ ಮೂರು",
      "ಎಪ್ಪತ್ತೆರಡು",
      "ಎಪ್ಪತ್ತೊಂದು",
      "ಎಪ್ಪತ್ತು",
      "ಅರವತ್ತೊಂಬತ್ತು",
      "ಅರವತ್ತೆಂಟು",
      "ಅರವತ್ತೇಳು",
      "ಅರವತ್ತಾರು",
      "ಅರವತ್ತೈದು",
      "ಅರವತ್ತ್ ನಾಲ್ಕು",
      "ಅರವತ್ತ್ ಮೂರು",
      "ಅರವತ್ತೆರಡು",
      "ಅರವತ್ತೊಂದು",
      "ಅರವತ್ತು",
      "ಐವತ್ತೊಂಬತ್ತು",
      "ಐವತ್ತೆಂಟು",
      "ಐವತ್ತೇಳು",
      "ಐವತ್ತಾರು",
      "ಐವತ್ತೈದು",
      "ಐವತ್ತ್ನಾಲ್ಕು",
      "ಐವತ್ತಮೂರು",
      "ಐವತ್ತೆರಡು",
      "ಐವತ್ತೊಂದು",
      "ಐವತ್ತು",
      "ನಲವತ್ತೊಂಬತ್ತು",
      "ನಲವತ್ತೆಂಟು",
      "ನಲವತ್ತೇಳು",
      "ನಲವತ್ತಾರು",
      "ನಲವತ್ತೈದು",
      "ನಲವತ್ತ್ ನಾಲ್ಕು",
      "ನಲವತ್ತ್ ಮೂರು",
      "ನಲವತ್ತ್ ಎರಡು",
      "ನಲವತ್ತೊಂದು",
      "ನಲವತ್ತು",
      "ಮೂವತ್ತ್ ಒಂಬತ್ತು",
      "ಮೂವತ್ಎಂಟು",
      "ಮೂವತ್ಏಳು",
      "ಮೂವತ್ಆರು",
      "ಮೂವತ್ತ್ ಐದು",
      "ಮೂವತ್ತ್ ನಾಲ್ಕು",
      "ಮೂವತ್ತ್ ಮೂರು",
      "ಮೂವತ್ತ್ಎರಡು",
      "ಮೂವತ್ತ್ಒಂದು",
      "ಮೂವತ್ತು",
      "ಇಪ್ಪತ್ತ್ಒಂಬತ್ತು",
      "ಇಪ್ಪತ್ತ್ಎಂಟು",
      "ಇಪ್ಪತ್ತ್ಏಳು",
      "ಇಪ್ಪತ್ತ್ಆರು",
      "ಇಪ್ಪತ್ತ್ ಐದು",
      "ಇಪ್ಪತ್ತ್ ನಾಲ್ಕು",
      "ಇಪ್ಪತ್ತ್ ಮೂರು",
      "ಇಪ್ಪತ್ತ್ ಎರಡು",
      "ಇಪ್ಪತ್ತ್ ಒಂದು",
      "ಇಪ್ಪತ್ತು",
      "ಹತ್ತೊಂಬತ್ತು",
      "ಹದಿನೆಂಟು",
      "ಹದಿನೇಳು",
      "ಹದಿನಾರು",
      "ಹದಿನೈದು",
      "ಹದಿನಾಲ್ಕು",
      "ಹದಿಮೂರು",
      "ಹನ್ನೆರಡು",
      "ಹನ್ನೊಂದು",
      "ಹತ್ತು",
      "ಒಂಬತ್ತು",
      "ಎಂಟು",
      "ಏಳು",
      "ಆರು",
      "ಐದು",
      "ನಾಲ್ಕು",
      "ಮೂರು",
      "ಎರಡು",
      "ಒಂದು",
      "ಸೊನ್ನೆ",
    ];

    this.midNumwords = [[100n, "ನೂರು"]];

    this.highNumwords = [
      [7, "ಕೋಟಿ"],
      [5, "ಒಂದು ಲಕ್ಷ"],
      [3, "ಸಾವಿರ"],
    ] as unknown as string[];

    this.pointword = "ಬಿಂದು";

    this.modifiers = ["್", "ಾ", "ಿ", "ೀ", "ೀ", "ು", "ೂ", "ೃ", "ೆ", "ೇ", "ೈ", "ೊ", "ೋ", "ೌ", "ೕ"];
  }

  override merge(lpair: WordPair, rpair: WordPair): WordPair {
    const [ltext, lnum] = lpair;
    const [rtext, rnum] = rpair;
    if (lnum === 1n && rnum < 100n) {
      return [rtext, rnum];
    } else if (100n > lnum && lnum > rnum) {
      return [`${ltext}-${rtext}`, lnum + rnum];
    } else if (lnum >= 100n && 100n > rnum) {
      if (this.modifiers.includes(ltext.slice(-1))) {
        return [`${ltext.slice(0, -1)} ${rtext}`, lnum + rnum];
      }
      return [`${ltext}ದ ${rtext}`, lnum + rnum];
    } else if (rnum > lnum) {
      return [`${ltext} ${rtext}`, lnum * rnum];
    }
    return [`${ltext} ${rtext}`, lnum + rnum];
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)}${this.toOrdinal(value)}`;
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    let outwords = this.toCardinal(value);
    if (this.modifiers.includes(outwords.slice(-1))) {
      outwords = outwords.slice(0, -1);
    }
    const ordinalNum = `${outwords}ನೇ`;
    return ordinalNum;
  }
}
