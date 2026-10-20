// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_it.py

import { describe, expect, test } from "bun:test";
import { asFloat, num2words } from "../src/index.ts";

const TEST_CASES_TO_CURRENCY_EUR = [
  [asFloat(1), "un euro e zero centesimi"],
  [2.01, "due euro e un centesimo"],
  [8.1, "otto euro e dieci centesimi"],
  [12.26, "dodici euro e ventisei centesimi"],
  [21.29, "ventun euro e ventinove centesimi"],
  [81.25, "ottantun euro e venticinque centesimi"],
  [asFloat(100), "cento euro e zero centesimi"],
] as const;

const TEST_CASES_TO_CURRENCY_USD = [
  [asFloat(1), "un dollaro e zero centesimi"],
  [2.01, "due dollari e un centesimo"],
  [8.1, "otto dollari e dieci centesimi"],
  [12.26, "dodici dollari e ventisei centesimi"],
  [21.29, "ventun dollari e ventinove centesimi"],
  [81.25, "ottantun dollari e venticinque centesimi"],
  [asFloat(100), "cento dollari e zero centesimi"],
] as const;

const TEST_CASES_TO_CURRENCY_GBP = [
  [asFloat(1), "una sterlina e zero penny"],
  [2.01, "due sterline e un penny"],
  [8.1, "otto sterline e dieci penny"],
  [12.26, "dodici sterline e ventisei penny"],
  [21.29, "ventun sterline e ventinove penny"],
  [81.25, "ottantun sterline e venticinque penny"],
  [asFloat(100), "cento sterline e zero penny"],
] as const;

describe("Num2WordsITTest", () => {
  test("test_negative", () => {
    const number = 648972145n;
    const posCrd = num2words(number, { lang: "it" });
    const negCrd = num2words(-number, { lang: "it" });
    const posOrd = num2words(number, { lang: "it", ordinal: true });
    const negOrd = num2words(-number, { lang: "it", ordinal: true });
    expect(`meno ${posCrd}`).toBe(negCrd);
    expect(`meno ${posOrd}`).toBe(negOrd);
  });

  test("test_float_to_cardinal", () => {
    // biome-ignore lint/suspicious/noApproximativeNumericConstant: upstream test value
    expect(num2words(3.1415, { lang: "it" })).toBe("tre virgola uno quattro uno cinque");
    expect(num2words(-5.15, { lang: "it" })).toBe("meno cinque virgola uno cinque");
    expect(num2words(-0.15, { lang: "it" })).toBe("meno zero virgola uno cinque");
  });

  test("test_float_to_ordinal", () => {
    // biome-ignore lint/suspicious/noApproximativeNumericConstant: upstream test value
    expect(num2words(3.1415, { lang: "it", ordinal: true })).toBe(
      "terzo virgola uno quattro uno cinque",
    );
    expect(num2words(-5.15, { lang: "it", ordinal: true })).toBe("meno quinto virgola uno cinque");
    expect(num2words(-0.15, { lang: "it", ordinal: true })).toBe("meno zero virgola uno cinque");
  });

  test("test_0", () => {
    expect(num2words(0n, { lang: "it" })).toBe("zero");
    expect(num2words(0n, { lang: "it", ordinal: true })).toBe("zero");
  });

  test("test_1_to_10", () => {
    expect(num2words(1n, { lang: "it" })).toBe("uno");
    expect(num2words(2n, { lang: "it" })).toBe("due");
    expect(num2words(7n, { lang: "it" })).toBe("sette");
    expect(num2words(10n, { lang: "it" })).toBe("dieci");
  });

  test("test_11_to_19", () => {
    expect(num2words(11n, { lang: "it" })).toBe("undici");
    expect(num2words(13n, { lang: "it" })).toBe("tredici");
    expect(num2words(15n, { lang: "it" })).toBe("quindici");
    expect(num2words(16n, { lang: "it" })).toBe("sedici");
    expect(num2words(19n, { lang: "it" })).toBe("diciannove");
  });

  test("test_20_to_99", () => {
    expect(num2words(20n, { lang: "it" })).toBe("venti");
    expect(num2words(21n, { lang: "it" })).toBe("ventuno");
    expect(num2words(23n, { lang: "it" })).toBe("ventitré");
    expect(num2words(28n, { lang: "it" })).toBe("ventotto");
    expect(num2words(31n, { lang: "it" })).toBe("trentuno");
    expect(num2words(40n, { lang: "it" })).toBe("quaranta");
    expect(num2words(66n, { lang: "it" })).toBe("sessantasei");
    expect(num2words(92n, { lang: "it" })).toBe("novantadue");
  });

  test("test_100_to_999", () => {
    expect(num2words(100n, { lang: "it" })).toBe("cento");
    expect(num2words(111n, { lang: "it" })).toBe("centoundici");
    expect(num2words(150n, { lang: "it" })).toBe("centocinquanta");
    expect(num2words(196n, { lang: "it" })).toBe("centonovantasei");
    expect(num2words(200n, { lang: "it" })).toBe("duecento");
    expect(num2words(210n, { lang: "it" })).toBe("duecentodieci");
    expect(num2words(701n, { lang: "it" })).toBe("settecentouno");
  });

  test("test_1000_to_9999", () => {
    expect(num2words(1000n, { lang: "it" })).toBe("mille");
    expect(num2words(1001n, { lang: "it" })).toBe("milleuno");
    expect(num2words(1500n, { lang: "it" })).toBe("millecinquecento");
    expect(num2words(7378n, { lang: "it" })).toBe("settemilatrecentosettantotto");
    expect(num2words(2000n, { lang: "it" })).toBe("duemila");
    expect(num2words(2100n, { lang: "it" })).toBe("duemilacento");
    expect(num2words(6870n, { lang: "it" })).toBe("seimilaottocentosettanta");
    expect(num2words(10000n, { lang: "it" })).toBe("diecimila");
    expect(num2words(98765n, { lang: "it" })).toBe("novantottomilasettecentosessantacinque");
    expect(num2words(100000n, { lang: "it" })).toBe("centomila");
    expect(num2words(523456n, { lang: "it" })).toBe(
      "cinquecentoventitremilaquattrocentocinquantasei",
    );
  });

  test("test_big", () => {
    expect(num2words(1000000n, { lang: "it" })).toBe("un milione");
    expect(num2words(1000007n, { lang: "it" })).toBe("un milione e sette");
    expect(num2words(1200000n, { lang: "it" })).toBe("un milione e duecentomila");
    expect(num2words(3000000n, { lang: "it" })).toBe("tre milioni");
    expect(num2words(3000005n, { lang: "it" })).toBe("tre milioni e cinque");
    expect(num2words(3800000n, { lang: "it" })).toBe("tre milioni e ottocentomila");
    expect(num2words(1000000000n, { lang: "it" })).toBe("un miliardo");
    expect(num2words(1000000017n, { lang: "it" })).toBe("un miliardo e diciassette");
    expect(num2words(2000000000n, { lang: "it" })).toBe("due miliardi");
    expect(num2words(2000001000n, { lang: "it" })).toBe("due miliardi e mille");
    expect(num2words(1234567890n, { lang: "it" })).toBe(
      "un miliardo, duecentotrentaquattro milioni e cinquecentosessantasettemilaottocentonovanta",
    );
    expect(num2words(1000000000000n, { lang: "it" })).toBe("un bilione");
    expect(num2words(123456789012345678901234567890n, { lang: "it" })).toBe(
      "centoventitré quadriliardi, quattrocentocinquantasei quadrilioni, settecentottantanove triliardi, dodici trilioni, trecentoquarantacinque biliardi, seicentosettantotto bilioni, novecentouno miliardi, duecentotrentaquattro milioni e cinquecentosessantasettemilaottocentonovanta",
    );
  });

  test("test_nth_1_to_99", () => {
    expect(num2words(1n, { lang: "it", ordinal: true })).toBe("primo");
    expect(num2words(8n, { lang: "it", ordinal: true })).toBe("ottavo");
    expect(num2words(21n, { lang: "it", ordinal: true })).toBe("ventunesimo");
    expect(num2words(23n, { lang: "it", ordinal: true })).toBe("ventitreesimo");
    expect(num2words(47n, { lang: "it", ordinal: true })).toBe("quarantasettesimo");
    expect(num2words(99n, { lang: "it", ordinal: true })).toBe("novantanovesimo");
  });

  test("test_nth_100_to_999", () => {
    expect(num2words(100n, { lang: "it", ordinal: true })).toBe("centesimo");
    expect(num2words(112n, { lang: "it", ordinal: true })).toBe("centododicesimo");
    expect(num2words(120n, { lang: "it", ordinal: true })).toBe("centoventesimo");
    expect(num2words(121n, { lang: "it", ordinal: true })).toBe("centoventunesimo");
    expect(num2words(316n, { lang: "it", ordinal: true })).toBe("trecentosedicesimo");
    expect(num2words(700n, { lang: "it", ordinal: true })).toBe("settecentesimo");
    expect(num2words(803n, { lang: "it", ordinal: true })).toBe("ottocentotreesimo");
    expect(num2words(923n, { lang: "it", ordinal: true })).toBe("novecentoventitreesimo");
  });

  test("test_nth_1000_to_999999", () => {
    expect(num2words(1000n, { lang: "it", ordinal: true })).toBe("millesimo");
    expect(num2words(1001n, { lang: "it", ordinal: true })).toBe("milleunesimo");
    expect(num2words(1003n, { lang: "it", ordinal: true })).toBe("milletreesimo");
    expect(num2words(1200n, { lang: "it", ordinal: true })).toBe("milleduecentesimo");
    expect(num2words(8640n, { lang: "it", ordinal: true })).toBe("ottomilaseicentoquarantesimo");
    expect(num2words(14000n, { lang: "it", ordinal: true })).toBe("quattordicimillesimo");
    expect(num2words(123456n, { lang: "it", ordinal: true })).toBe(
      "centoventitremilaquattrocentocinquantaseiesimo",
    );
    expect(num2words(987654n, { lang: "it", ordinal: true })).toBe(
      "novecentottantasettemilaseicentocinquantaquattresimo",
    );
  });

  test("test_nth_big", () => {
    expect(num2words(1000000001n, { lang: "it", ordinal: true })).toBe("un miliardo e unesimo");
    expect(num2words(123456789012345678901234567890n, { lang: "it", ordinal: true })).toBe(
      "centoventitré quadriliardi, quattrocentocinquantasei quadrilioni, settecentottantanove triliardi, dodici trilioni, trecentoquarantacinque biliardi, seicentosettantotto bilioni, novecentouno miliardi, duecentotrentaquattro milioni e cinquecentosessantasettemilaottocentonovantesimo",
    );
  });

  test("test_with_floats", () => {
    expect(num2words(asFloat(1), { lang: "it" })).toBe("uno virgola zero");
    expect(num2words(1.1, { lang: "it" })).toBe("uno virgola uno");
  });

  test("test_with_strings", () => {
    for (let i = 0; i < 2002; i++) {
      num2words(String(i), { lang: "it", to: "cardinal" });
      num2words(String(i), { lang: "it", to: "ordinal" });
    }
    expect(num2words("1", { lang: "it", to: "ordinal" })).toBe("primo");
    expect(num2words("100", { lang: "it", to: "ordinal" })).toBe("centesimo");
    expect(num2words("1000", { lang: "it", to: "ordinal" })).toBe("millesimo");
    expect(num2words("1234567890123456789012345678", { lang: "it", to: "ordinal" })).toBe(
      "un quadriliardo, duecentotrentaquattro quadrilioni, cinquecentosessantasette triliardi, ottocentonovanta trilioni, centoventitré biliardi, quattrocentocinquantasei bilioni, settecentottantanove miliardi, dodici milioni e trecentoquarantacinquemilaseicentosettantottesimo",
    );
  });

  test("test_currency_eur", () => {
    for (const test of TEST_CASES_TO_CURRENCY_EUR) {
      expect(num2words(test[0], { lang: "it", to: "currency", currency: "EUR" })).toBe(test[1]);
    }
  });

  test("test_currency_usd", () => {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "it", to: "currency", currency: "USD" })).toBe(test[1]);
    }
  });

  test("test_currency_gbp", () => {
    for (const test of TEST_CASES_TO_CURRENCY_GBP) {
      expect(num2words(test[0], { lang: "it", to: "currency", currency: "GBP" })).toBe(test[1]);
    }
  });
});
