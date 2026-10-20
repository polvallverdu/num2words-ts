// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/lang_TE.py

import type { WordPair } from "../base.ts";
import { type PyNum, str } from "../py.ts";
import { Num2Word_EU } from "./EU.ts";

export class Num2Word_TE extends Num2Word_EU {
  declare modifiers: string[];

  override setHighNumwords(_high: string[]): void {
    // Upstream stores (exponent, word) pairs in high_numwords.
    for (const [n, word] of this.highNumwords as unknown as [number, string][]) {
      this.cards.set(10n ** BigInt(n), word);
    }
  }

  override setup(): void {
    this.lowNumwords = [
      "తొంభై తొమ్మిది",
      "తొంభై ఎనిమిది",
      "తొంభై ఏడు",
      "తొంభై ఆరు",
      "తొంభై అయిదు",
      "తొంభై నాలుగు",
      "తొంభై మూడు",
      "తొంభై రెండు",
      "తొంభై ఒకటి",
      "తొంభై",
      "ఎనభై తొమ్మిది",
      "ఎనభై ఎనిమిది",
      "ఎనభై ఏడు",
      "ఎనభై ఆరు",
      "ఎనభై అయిదు",
      "ఎనభై నాలుగు",
      "ఎనభై మూడు",
      "ఎనభై రెండు",
      "ఎనభై ఒకటి",
      "ఎనభై",
      "డెబ్బై తొమ్మిది",
      "డెబ్బై ఎనిమిది",
      "డెబ్బై ఏడు",
      "డెబ్బై ఆరు",
      "డెబ్బై అయిదు",
      "డెబ్బై నాలుగు",
      "డెబ్బై మూడు",
      "డెబ్బై రెండు",
      "డెబ్బై ఒకటి",
      "డెబ్బై",
      "అరవై తొమ్మిది",
      "అరవై ఎనిమిది",
      "అరవై ఏడు",
      "అరవై ఆరు",
      "అరవై అయిదు",
      "అరవై నాలుగు",
      "అరవై మూడు",
      "అరవై రెండు",
      "అరవై ఒకటి",
      "అరవై",
      "యాభై తొమ్మిది",
      "యాభై ఎనిమిది",
      "యాభై ఏడు",
      "యాభై ఆరు",
      "యాభై అయిదు",
      "యాభై నాలుగు",
      "యాభై మూడు",
      "యాభై రెండు",
      "యాభై ఒకటి",
      "యాభై ",
      "నలభై తొమ్మిది",
      "నలభై ఎనిమిది",
      "నలభై ఏడు",
      "నలభై ఆరు",
      "నలభై అయిదు",
      "నలభై నాలుగు",
      "నలభై మూడు",
      "నలభై రెండు",
      "నలభై ఒకటి",
      "నలభై",
      "ముప్పై తొమ్మిది",
      "ముప్పై ఎనిమిది",
      "ముప్పై ఏడు",
      "ముప్పై ఆరు",
      "ముప్పై ఐదు",
      "ముప్పై నాలుగు",
      "ముప్పై మూడు",
      "ముప్పై రెండు",
      "ముప్పై ఒకటి",
      "ముప్పై",
      "ఇరవై తొమ్మిది",
      "ఇరవై ఎనిమిది",
      "ఇరవై ఏడు",
      "ఇరవై ఆరు",
      "ఇరవై అయిదు",
      "ఇరవై నాలుగు",
      "ఇరవై మూడు",
      "ఇరవై రెండు",
      "ఇరవై ఒకటి",
      "ఇరవై",
      "పందొమ్మిది",
      "పధ్ధెనిమిది",
      "పదిహేడు",
      "పదహారు",
      "పదునయిదు",
      "పధ్నాలుగు",
      "పదమూడు",
      "పన్నెండు",
      "పదకొండు",
      "పది",
      "తొమ్మిది",
      "ఎనిమిది",
      "ఏడు",
      "ఆరు",
      "అయిదు",
      "నాలుగు",
      "మూడు",
      "రెండు",
      "ఒకటి",
      "సున్న",
    ];

    this.midNumwords = [[100n, "వంద"]];

    this.highNumwords = [
      [7, "కోట్ల"],
      [5, "లక్ష"],
      [3, "వేయి"],
    ] as unknown as string[];

    this.pointword = "బిందువు ";

    this.modifiers = [
      " ్  ",
      "ా ",
      " ి ",
      " ీ ",
      " ు ",
      " ూ ",
      " ృ ",
      " ౄ  ",
      " ె ",
      " ే ",
      " ై ",
      " ొ",
      " ో ",
      " ౌ ",
      " ఁ ",
      " ం ",
      " ః ",
    ];
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
      return [`${ltext}ల ${rtext}`, lnum + rnum];
    } else if (rnum > lnum) {
      return [`${ltext} ${rtext}`, lnum * rnum];
    }
    return [`${ltext} ${rtext}`, lnum + rnum];
  }

  override toOrdinalNum(value: PyNum): string {
    this.verifyOrdinal(value);
    return `${str(value)}${this.toOrdinal(value).slice(-1)}`;
  }

  override toOrdinal(value: PyNum): string {
    this.verifyOrdinal(value);
    let outwords = this.toCardinal(value);
    if (this.modifiers.includes(outwords.slice(-1))) {
      outwords = outwords.slice(0, -1);
    }
    const ordinalNum = `${outwords}వ`;
    return ordinalNum;
  }
}
