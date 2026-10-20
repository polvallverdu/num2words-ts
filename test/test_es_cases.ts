// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_es.py
//
// Test data and test methods of Num2WordsESTest, shared with the regional
// Spanish test files (upstream subclasses the TestCase).

import { describe, expect, test } from "bun:test";
import { asFloat, type Num2WordsInput, num2words } from "../src/index.ts";

export const TEST_CASES_CARDINAL: [Num2WordsInput, string][] = [
  [1, "uno"],
  [2, "dos"],
  [3, "tres"],
  [5.5, "cinco punto cinco"],
  [11, "once"],
  [12, "doce"],
  [16, "dieciséis"],
  [17.42, "diecisiete punto cuatro dos"],
  [19, "diecinueve"],
  [20, "veinte"],
  [21, "veintiuno"],
  [26, "veintiséis"],
  [27.312, "veintisiete punto tres uno dos"],
  [28, "veintiocho"],
  [30, "treinta"],
  [31, "treinta y uno"],
  [40, "cuarenta"],
  [44, "cuarenta y cuatro"],
  [50, "cincuenta"],
  [53.486, "cincuenta y tres punto cuatro ocho seis"],
  [55, "cincuenta y cinco"],
  [60, "sesenta"],
  [67, "sesenta y siete"],
  [70, "setenta"],
  [79, "setenta y nueve"],
  [89, "ochenta y nueve"],
  [95, "noventa y cinco"],
  [100, "cien"],
  [101, "ciento uno"],
  [199, "ciento noventa y nueve"],
  [203, "doscientos tres"],
  [287, "doscientos ochenta y siete"],
  [300.42, "trescientos punto cuatro dos"],
  [356, "trescientos cincuenta y seis"],
  [400, "cuatrocientos"],
  [434, "cuatrocientos treinta y cuatro"],
  [578, "quinientos setenta y ocho"],
  [689, "seiscientos ochenta y nueve"],
  [729, "setecientos veintinueve"],
  [894, "ochocientos noventa y cuatro"],
  [999, "novecientos noventa y nueve"],
  [1000, "mil"],
  [1001, "mil uno"],
  [1097, "mil noventa y siete"],
  [1104, "mil ciento cuatro"],
  [1243, "mil doscientos cuarenta y tres"],
  [2385, "dos mil trescientos ochenta y cinco"],
  [3766, "tres mil setecientos sesenta y seis"],
  [4196, "cuatro mil ciento noventa y seis"],
  [4196.42, "cuatro mil ciento noventa y seis punto cuatro dos"],
  [5846, "cinco mil ochocientos cuarenta y seis"],
  [6459, "seis mil cuatrocientos cincuenta y nueve"],
  [7232, "siete mil doscientos treinta y dos"],
  [8569, "ocho mil quinientos sesenta y nueve"],
  [9539, "nueve mil quinientos treinta y nueve"],
  [1000000, "un millón"],
  [1000001, "un millón uno"],
  [4000000, "cuatro millones"],
  [10000000000000, "diez billones"],
  [100000000000000, "cien billones"],
  [1000000000000000000n, "un trillón"],
  [1000000000000000000000n, "mil trillones"],
  [10000000000000000000000000n, "diez cuatrillones"],
];

export const TEST_CASES_ORDINAL: [Num2WordsInput, string][] = [
  [1, "primero"],
  [8, "octavo"],
  [12, "décimosegundo"],
  [14, "décimo cuarto"],
  [28, "vigésimo octavo"],
  [100, "centésimo"],
  [1000, "milésimo"],
  [12345, "docemilésimo tricentésimo quadragésimo quinto"],
  [1000000, "millonésimo"],
  [1000000000000000, "cuadrillonésimo"],
  [1000000000000000000n, "un trillón"],
];

export const TEST_CASES_ORDINAL_NUM: [Num2WordsInput, string][] = [
  [1, "1º"],
  [8, "8º"],
  [12, "12º"],
  [14, "14º"],
  [28, "28º"],
  [100, "100º"],
  [1000, "1000º"],
  [1000000, "1000000º"],
];

export const TEST_CASES_TO_CURRENCY: [Num2WordsInput, string][] = [
  [asFloat(1), "un euro con cero céntimos"],
  [1.01, "un euro con un céntimo"],
  [asFloat(2), "dos euros con cero céntimos"],
  [asFloat(8), "ocho euros con cero céntimos"],
  [asFloat(12), "doce euros con cero céntimos"],
  [asFloat(21), "veintiún euros con cero céntimos"],
  [81.25, "ochenta y un euros con veinticinco céntimos"],
  [350.9, "trescientos cincuenta euros con noventa céntimos"],
  [asFloat(100), "cien euros con cero céntimos"],
];

export const TEST_CASES_TO_CURRENCY_ESP: [Num2WordsInput, string][] = [
  [asFloat(1), "una peseta con cero céntimos"],
  [1.01, "una peseta con un céntimo"],
  [asFloat(2), "dos pesetas con cero céntimos"],
  [asFloat(8), "ocho pesetas con cero céntimos"],
  [asFloat(12), "doce pesetas con cero céntimos"],
  [asFloat(21), "veintiuna pesetas con cero céntimos"],
  [81.25, "ochenta y una pesetas con veinticinco céntimos"],
  [350.9, "trescientas cincuenta pesetas con noventa céntimos"],
  [asFloat(100), "cien pesetas con cero céntimos"],
];

export const TEST_CASES_TO_CURRENCY_USD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dólar con cero centavos"],
  [asFloat(2), "dos dólares con cero centavos"],
  [asFloat(8), "ocho dólares con cero centavos"],
  [asFloat(12), "doce dólares con cero centavos"],
  [asFloat(21), "veintiún dólares con cero centavos"],
  [81.25, "ochenta y un dólares con veinticinco centavos"],
  [350.9, "trescientos cincuenta dólares con noventa centavos"],
  [asFloat(100), "cien dólares con cero centavos"],
];

export const TEST_CASES_TO_CURRENCY_PEN: [Num2WordsInput, string][] = [
  [asFloat(1), "un sol con cero céntimos"],
  [asFloat(2), "dos soles con cero céntimos"],
  [asFloat(8), "ocho soles con cero céntimos"],
  [asFloat(12), "doce soles con cero céntimos"],
  [asFloat(21), "veintiún soles con cero céntimos"],
  [81.25, "ochenta y un soles con veinticinco céntimos"],
  [350.9, "trescientos cincuenta soles con noventa céntimos"],
  [asFloat(100), "cien soles con cero céntimos"],
];

export const TEST_CASES_TO_CURRENCY_CRC: [Num2WordsInput, string][] = [
  [asFloat(1), "un colón con cero centavos"],
  [asFloat(2), "dos colones con cero centavos"],
  [asFloat(8), "ocho colones con cero centavos"],
  [asFloat(12), "doce colones con cero centavos"],
  [asFloat(21), "veintiún colones con cero centavos"],
  [81.25, "ochenta y un colones con veinticinco centavos"],
  [350.9, "trescientos cincuenta colones con noventa centavos"],
  [asFloat(100), "cien colones con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta colones con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_GBP: [Num2WordsInput, string][] = [
  [asFloat(1), "una libra con cero peniques"],
  [1.01, "una libra con un penique"],
  [asFloat(2), "dos libras con cero peniques"],
  [asFloat(8), "ocho libras con cero peniques"],
  [asFloat(12), "doce libras con cero peniques"],
  [asFloat(21), "veintiuna libras con cero peniques"],
  [81.25, "ochenta y una libras con veinticinco peniques"],
  [350.9, "trescientas cincuenta libras con noventa peniques"],
  [asFloat(100), "cien libras con cero peniques"],
  [4150.83, "cuatro mil ciento cincuenta libras con ochenta y tres peniques"],
];

export const TEST_CASES_TO_CURRENCY_RUB: [Num2WordsInput, string][] = [
  [asFloat(1), "un rublo con cero kopeykas"],
  [asFloat(2), "dos rublos con cero kopeykas"],
  [asFloat(8), "ocho rublos con cero kopeykas"],
  [asFloat(12), "doce rublos con cero kopeykas"],
  [asFloat(21), "veintiún rublos con cero kopeykas"],
  [81.25, "ochenta y un rublos con veinticinco kopeykas"],
  [350.9, "trescientos cincuenta rublos con noventa kopeykas"],
  [asFloat(100), "cien rublos con cero kopeykas"],
  [4150.83, "cuatro mil ciento cincuenta rublos con ochenta y tres kopeykas"],
];

export const TEST_CASES_TO_CURRENCY_SEK: [Num2WordsInput, string][] = [
  [asFloat(1), "una corona con cero öre"],
  [asFloat(2), "dos coronas con cero öre"],
  [asFloat(8), "ocho coronas con cero öre"],
  [asFloat(12), "doce coronas con cero öre"],
  [asFloat(21), "veintiuna coronas con cero öre"],
  [81.25, "ochenta y una coronas con veinticinco öre"],
  [350.9, "trescientas cincuenta coronas con noventa öre"],
  [asFloat(100), "cien coronas con cero öre"],
  [4150.83, "cuatro mil ciento cincuenta coronas con ochenta y tres öre"],
];

export const TEST_CASES_TO_CURRENCY_NOK: [Num2WordsInput, string][] = [
  [asFloat(1), "una corona con cero øre"],
  [asFloat(2), "dos coronas con cero øre"],
  [asFloat(8), "ocho coronas con cero øre"],
  [asFloat(12), "doce coronas con cero øre"],
  [asFloat(21), "veintiuna coronas con cero øre"],
  [81.25, "ochenta y una coronas con veinticinco øre"],
  [350.9, "trescientas cincuenta coronas con noventa øre"],
  [asFloat(100), "cien coronas con cero øre"],
  [4150.83, "cuatro mil ciento cincuenta coronas con ochenta y tres øre"],
];

export const TEST_CASES_TO_CURRENCY_PLN: [Num2WordsInput, string][] = [
  [asFloat(1), "un zloty con cero groszy"],
  [asFloat(2), "dos zlotys con cero groszy"],
  [asFloat(8), "ocho zlotys con cero groszy"],
  [asFloat(12), "doce zlotys con cero groszy"],
  [asFloat(21), "veintiún zlotys con cero groszy"],
  [81.25, "ochenta y un zlotys con veinticinco groszy"],
  [350.9, "trescientos cincuenta zlotys con noventa groszy"],
  [asFloat(100), "cien zlotys con cero groszy"],
  [4150.83, "cuatro mil ciento cincuenta zlotys con ochenta y tres groszy"],
];

export const TEST_CASES_TO_CURRENCY_MXN: [Num2WordsInput, string][] = [
  [asFloat(1), "un peso con cero centavos"],
  [asFloat(2), "dos pesos con cero centavos"],
  [asFloat(8), "ocho pesos con cero centavos"],
  [asFloat(12), "doce pesos con cero centavos"],
  [asFloat(21), "veintiún pesos con cero centavos"],
  [81.25, "ochenta y un pesos con veinticinco centavos"],
  [350.9, "trescientos cincuenta pesos con noventa centavos"],
  [asFloat(100), "cien pesos con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta pesos con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_RON: [Num2WordsInput, string][] = [
  [asFloat(1), "un leu con cero bani"],
  [asFloat(2), "dos leus con cero bani"],
  [asFloat(8), "ocho leus con cero bani"],
  [asFloat(12), "doce leus con cero bani"],
  [asFloat(21), "veintiún leus con cero bani"],
  [81.25, "ochenta y un leus con veinticinco bani"],
  [350.9, "trescientos cincuenta leus con noventa bani"],
  [asFloat(100), "cien leus con cero bani"],
  [4150.83, "cuatro mil ciento cincuenta leus con ochenta y tres bani"],
];

export const TEST_CASES_TO_CURRENCY_INR: [Num2WordsInput, string][] = [
  [asFloat(1), "una rupia con cero paisas"],
  [asFloat(2), "dos rupias con cero paisas"],
  [asFloat(8), "ocho rupias con cero paisas"],
  [asFloat(12), "doce rupias con cero paisas"],
  [asFloat(21), "veintiuna rupias con cero paisas"],
  [81.25, "ochenta y una rupias con veinticinco paisas"],
  [350.9, "trescientas cincuenta rupias con noventa paisas"],
  [asFloat(100), "cien rupias con cero paisas"],
  [4150.83, "cuatro mil ciento cincuenta rupias con ochenta y tres paisas"],
];

export const TEST_CASES_TO_CURRENCY_HUF: [Num2WordsInput, string][] = [
  [asFloat(1), "un florín con cero fillér"],
  [asFloat(2), "dos florines con cero fillér"],
  [asFloat(8), "ocho florines con cero fillér"],
  [asFloat(12), "doce florines con cero fillér"],
  [asFloat(21), "veintiún florines con cero fillér"],
  [81.25, "ochenta y un florines con veinticinco fillér"],
  [350.9, "trescientos cincuenta florines con noventa fillér"],
  [asFloat(100), "cien florines con cero fillér"],
  [4150.83, "cuatro mil ciento cincuenta florines con ochenta y tres fillér"],
];

export const TEST_CASES_TO_CURRENCY_FRF: [Num2WordsInput, string][] = [
  [asFloat(1), "un franco con cero céntimos"],
  [asFloat(2), "dos francos con cero céntimos"],
  [asFloat(8), "ocho francos con cero céntimos"],
  [asFloat(12), "doce francos con cero céntimos"],
  [asFloat(21), "veintiún francos con cero céntimos"],
  [81.25, "ochenta y un francos con veinticinco céntimos"],
  [350.9, "trescientos cincuenta francos con noventa céntimos"],
  [asFloat(100), "cien francos con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta francos con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_CNY: [Num2WordsInput, string][] = [
  [asFloat(1), "un yuan con cero jiaos"],
  [asFloat(2), "dos yuanes con cero jiaos"],
  [asFloat(8), "ocho yuanes con cero jiaos"],
  [asFloat(12), "doce yuanes con cero jiaos"],
  [asFloat(21), "veintiún yuanes con cero jiaos"],
  [81.25, "ochenta y un yuanes con veinticinco jiaos"],
  [350.9, "trescientos cincuenta yuanes con noventa jiaos"],
  [asFloat(100), "cien yuanes con cero jiaos"],
  [4150.83, "cuatro mil ciento cincuenta yuanes con ochenta y tres jiaos"],
];

export const TEST_CASES_TO_CURRENCY_CZK: [Num2WordsInput, string][] = [
  [asFloat(1), "una corona con cero haléř"],
  [asFloat(2), "dos coronas con cero haléř"],
  [asFloat(8), "ocho coronas con cero haléř"],
  [asFloat(12), "doce coronas con cero haléř"],
  [asFloat(21), "veintiuna coronas con cero haléř"],
  [81.25, "ochenta y una coronas con veinticinco haléř"],
  [350.9, "trescientas cincuenta coronas con noventa haléř"],
  [asFloat(100), "cien coronas con cero haléř"],
  [4150.83, "cuatro mil ciento cincuenta coronas con ochenta y tres haléř"],
];

export const TEST_CASES_TO_CURRENCY_NIO: [Num2WordsInput, string][] = [
  [asFloat(1), "un córdoba con cero centavos"],
  [asFloat(2), "dos córdobas con cero centavos"],
  [asFloat(8), "ocho córdobas con cero centavos"],
  [asFloat(12), "doce córdobas con cero centavos"],
  [asFloat(21), "veintiún córdobas con cero centavos"],
  [81.25, "ochenta y un córdobas con veinticinco centavos"],
  [350.9, "trescientos cincuenta córdobas con noventa centavos"],
  [asFloat(100), "cien córdobas con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta córdobas con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_VES: [Num2WordsInput, string][] = [
  [asFloat(1), "un bolívar con cero céntimos"],
  [asFloat(2), "dos bolívares con cero céntimos"],
  [asFloat(8), "ocho bolívares con cero céntimos"],
  [asFloat(12), "doce bolívares con cero céntimos"],
  [asFloat(21), "veintiún bolívares con cero céntimos"],
  [81.25, "ochenta y un bolívares con veinticinco céntimos"],
  [350.9, "trescientos cincuenta bolívares con noventa céntimos"],
  [asFloat(100), "cien bolívares con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta bolívares con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_BRL: [Num2WordsInput, string][] = [
  [asFloat(1), "un real con cero centavos"],
  [asFloat(2), "dos reales con cero centavos"],
  [asFloat(8), "ocho reales con cero centavos"],
  [asFloat(12), "doce reales con cero centavos"],
  [asFloat(21), "veintiún reales con cero centavos"],
  [81.25, "ochenta y un reales con veinticinco centavos"],
  [350.9, "trescientos cincuenta reales con noventa centavos"],
  [asFloat(100), "cien reales con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta reales con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_JPY: [Num2WordsInput, string][] = [
  [asFloat(1), "un yen con cero sen"],
  [asFloat(2), "dos yenes con cero sen"],
  [asFloat(8), "ocho yenes con cero sen"],
  [asFloat(12), "doce yenes con cero sen"],
  [asFloat(21), "veintiún yenes con cero sen"],
  [81.25, "ochenta y un yenes con veinticinco sen"],
  [350.9, "trescientos cincuenta yenes con noventa sen"],
  [asFloat(100), "cien yenes con cero sen"],
  [4150.83, "cuatro mil ciento cincuenta yenes con ochenta y tres sen"],
];

export const TEST_CASES_TO_CURRENCY_KRW: [Num2WordsInput, string][] = [
  [asFloat(1), "un won con cero jeon"],
  [asFloat(2), "dos wones con cero jeon"],
  [asFloat(8), "ocho wones con cero jeon"],
  [asFloat(12), "doce wones con cero jeon"],
  [asFloat(21), "veintiún wones con cero jeon"],
  [81.25, "ochenta y un wones con veinticinco jeon"],
  [350.9, "trescientos cincuenta wones con noventa jeon"],
  [asFloat(100), "cien wones con cero jeon"],
  [4150.83, "cuatro mil ciento cincuenta wones con ochenta y tres jeon"],
];

export const TEST_CASES_TO_CURRENCY_KPW: [Num2WordsInput, string][] = [
  [asFloat(1), "un won con cero chon"],
  [asFloat(2), "dos wones con cero chon"],
  [asFloat(8), "ocho wones con cero chon"],
  [asFloat(12), "doce wones con cero chon"],
  [asFloat(21), "veintiún wones con cero chon"],
  [81.25, "ochenta y un wones con veinticinco chon"],
  [350.9, "trescientos cincuenta wones con noventa chon"],
  [asFloat(100), "cien wones con cero chon"],
  [4150.83, "cuatro mil ciento cincuenta wones con ochenta y tres chon"],
];

export const TEST_CASES_TO_CURRENCY_TRY: [Num2WordsInput, string][] = [
  [asFloat(1), "una lira con cero kuruş"],
  [asFloat(2), "dos liras con cero kuruş"],
  [asFloat(8), "ocho liras con cero kuruş"],
  [asFloat(12), "doce liras con cero kuruş"],
  [asFloat(21), "veintiuna liras con cero kuruş"],
  [81.25, "ochenta y una liras con veinticinco kuruş"],
  [350.9, "trescientas cincuenta liras con noventa kuruş"],
  [asFloat(100), "cien liras con cero kuruş"],
  [4150.83, "cuatro mil ciento cincuenta liras con ochenta y tres kuruş"],
];

export const TEST_CASES_TO_CURRENCY_ZAR: [Num2WordsInput, string][] = [
  [asFloat(1), "un rand con cero céntimos"],
  [asFloat(2), "dos rands con cero céntimos"],
  [asFloat(8), "ocho rands con cero céntimos"],
  [asFloat(12), "doce rands con cero céntimos"],
  [asFloat(21), "veintiún rands con cero céntimos"],
  [81.25, "ochenta y un rands con veinticinco céntimos"],
  [350.9, "trescientos cincuenta rands con noventa céntimos"],
  [asFloat(100), "cien rands con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta rands con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_KZT: [Num2WordsInput, string][] = [
  [asFloat(1), "un tenge con cero tïın"],
  [asFloat(2), "dos tenges con cero tïın"],
  [asFloat(8), "ocho tenges con cero tïın"],
  [asFloat(12), "doce tenges con cero tïın"],
  [asFloat(21), "veintiún tenges con cero tïın"],
  [81.25, "ochenta y un tenges con veinticinco tïın"],
  [350.9, "trescientos cincuenta tenges con noventa tïın"],
  [asFloat(100), "cien tenges con cero tïın"],
  [4150.83, "cuatro mil ciento cincuenta tenges con ochenta y tres tïın"],
];

export const TEST_CASES_TO_CURRENCY_UAH: [Num2WordsInput, string][] = [
  [asFloat(1), "un hryvnia con cero kopiykas"],
  [asFloat(2), "dos hryvnias con cero kopiykas"],
  [asFloat(8), "ocho hryvnias con cero kopiykas"],
  [asFloat(12), "doce hryvnias con cero kopiykas"],
  [asFloat(21), "veintiún hryvnias con cero kopiykas"],
  [81.25, "ochenta y un hryvnias con veinticinco kopiykas"],
  [350.9, "trescientos cincuenta hryvnias con noventa kopiykas"],
  [asFloat(100), "cien hryvnias con cero kopiykas"],
  [4150.83, "cuatro mil ciento cincuenta hryvnias con ochenta y tres kopiykas"],
];

export const TEST_CASES_TO_CURRENCY_THB: [Num2WordsInput, string][] = [
  [asFloat(1), "un baht con cero satang"],
  [asFloat(2), "dos bahts con cero satang"],
  [asFloat(8), "ocho bahts con cero satang"],
  [asFloat(12), "doce bahts con cero satang"],
  [asFloat(21), "veintiún bahts con cero satang"],
  [81.25, "ochenta y un bahts con veinticinco satang"],
  [350.9, "trescientos cincuenta bahts con noventa satang"],
  [asFloat(100), "cien bahts con cero satang"],
  [4150.83, "cuatro mil ciento cincuenta bahts con ochenta y tres satang"],
];

export const TEST_CASES_TO_CURRENCY_AED: [Num2WordsInput, string][] = [
  [asFloat(1), "un dirham con cero fils"],
  [asFloat(2), "dos dirhams con cero fils"],
  [asFloat(8), "ocho dirhams con cero fils"],
  [asFloat(12), "doce dirhams con cero fils"],
  [asFloat(21), "veintiún dirhams con cero fils"],
  [81.25, "ochenta y un dirhams con veinticinco fils"],
  [350.9, "trescientos cincuenta dirhams con noventa fils"],
  [asFloat(100), "cien dirhams con cero fils"],
  [4150.83, "cuatro mil ciento cincuenta dirhams con ochenta y tres fils"],
];

export const TEST_CASES_TO_CURRENCY_AFN: [Num2WordsInput, string][] = [
  [asFloat(1), "un afghani con cero puls"],
  [asFloat(2), "dos afghanis con cero puls"],
  [asFloat(8), "ocho afghanis con cero puls"],
  [asFloat(12), "doce afghanis con cero puls"],
  [asFloat(21), "veintiún afghanis con cero puls"],
  [81.25, "ochenta y un afghanis con veinticinco puls"],
  [350.9, "trescientos cincuenta afghanis con noventa puls"],
  [asFloat(100), "cien afghanis con cero puls"],
  [4150.83, "cuatro mil ciento cincuenta afghanis con ochenta y tres puls"],
];

export const TEST_CASES_TO_CURRENCY_ALL: [Num2WordsInput, string][] = [
  [asFloat(1), "un lek  con cero qindarka"],
  [asFloat(2), "dos leke con cero qindarka"],
  [asFloat(8), "ocho leke con cero qindarka"],
  [asFloat(12), "doce leke con cero qindarka"],
  [asFloat(21), "veintiún leke con cero qindarka"],
  [81.25, "ochenta y un leke con veinticinco qindarka"],
  [350.9, "trescientos cincuenta leke con noventa qindarka"],
  [asFloat(100), "cien leke con cero qindarka"],
  [4150.83, "cuatro mil ciento cincuenta leke con ochenta y tres qindarka"],
];

export const TEST_CASES_TO_CURRENCY_AMD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dram con cero lumas"],
  [asFloat(2), "dos drams con cero lumas"],
  [asFloat(8), "ocho drams con cero lumas"],
  [asFloat(12), "doce drams con cero lumas"],
  [asFloat(21), "veintiún drams con cero lumas"],
  [81.25, "ochenta y un drams con veinticinco lumas"],
  [350.9, "trescientos cincuenta drams con noventa lumas"],
  [asFloat(100), "cien drams con cero lumas"],
  [4150.83, "cuatro mil ciento cincuenta drams con ochenta y tres lumas"],
];

export const TEST_CASES_TO_CURRENCY_ANG: [Num2WordsInput, string][] = [
  [asFloat(1), "un florín con cero centavos"],
  [asFloat(2), "dos florines con cero centavos"],
  [asFloat(8), "ocho florines con cero centavos"],
  [asFloat(12), "doce florines con cero centavos"],
  [asFloat(21), "veintiún florines con cero centavos"],
  [81.25, "ochenta y un florines con veinticinco centavos"],
  [350.9, "trescientos cincuenta florines con noventa centavos"],
  [asFloat(100), "cien florines con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta florines con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_AOA: [Num2WordsInput, string][] = [
  [asFloat(1), "un kwanza con cero céntimos"],
  [asFloat(2), "dos kwanzas con cero céntimos"],
  [asFloat(8), "ocho kwanzas con cero céntimos"],
  [asFloat(12), "doce kwanzas con cero céntimos"],
  [asFloat(21), "veintiún kwanzas con cero céntimos"],
  [81.25, "ochenta y un kwanzas con veinticinco céntimos"],
  [350.9, "trescientos cincuenta kwanzas con noventa céntimos"],
  [asFloat(100), "cien kwanzas con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta kwanzas con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_AWG: [Num2WordsInput, string][] = [
  [asFloat(1), "un florín con cero centavos"],
  [asFloat(2), "dos florines con cero centavos"],
  [asFloat(8), "ocho florines con cero centavos"],
  [asFloat(12), "doce florines con cero centavos"],
  [asFloat(21), "veintiún florines con cero centavos"],
  [81.25, "ochenta y un florines con veinticinco centavos"],
  [350.9, "trescientos cincuenta florines con noventa centavos"],
  [asFloat(100), "cien florines con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta florines con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_AZN: [Num2WordsInput, string][] = [
  [asFloat(1), "un manat con cero qəpik"],
  [asFloat(2), "dos manat con cero qəpik"],
  [asFloat(8), "ocho manat con cero qəpik"],
  [asFloat(12), "doce manat con cero qəpik"],
  [asFloat(21), "veintiún manat con cero qəpik"],
  [81.25, "ochenta y un manat con veinticinco qəpik"],
  [350.9, "trescientos cincuenta manat con noventa qəpik"],
  [asFloat(100), "cien manat con cero qəpik"],
  [4150.83, "cuatro mil ciento cincuenta manat con ochenta y tres qəpik"],
];

export const TEST_CASES_TO_CURRENCY_BDT: [Num2WordsInput, string][] = [
  [asFloat(1), "un taka con cero paisas"],
  [asFloat(2), "dos takas con cero paisas"],
  [asFloat(8), "ocho takas con cero paisas"],
  [asFloat(12), "doce takas con cero paisas"],
  [asFloat(21), "veintiún takas con cero paisas"],
  [81.25, "ochenta y un takas con veinticinco paisas"],
  [350.9, "trescientos cincuenta takas con noventa paisas"],
  [asFloat(100), "cien takas con cero paisas"],
  [4150.83, "cuatro mil ciento cincuenta takas con ochenta y tres paisas"],
];

export const TEST_CASES_TO_CURRENCY_BGN: [Num2WordsInput, string][] = [
  [asFloat(1), "un lev con cero stotinki"],
  [asFloat(2), "dos leva con cero stotinki"],
  [asFloat(8), "ocho leva con cero stotinki"],
  [asFloat(12), "doce leva con cero stotinki"],
  [asFloat(21), "veintiún leva con cero stotinki"],
  [81.25, "ochenta y un leva con veinticinco stotinki"],
  [350.9, "trescientos cincuenta leva con noventa stotinki"],
  [asFloat(100), "cien leva con cero stotinki"],
  [4150.83, "cuatro mil ciento cincuenta leva con ochenta y tres stotinki"],
];

export const TEST_CASES_TO_CURRENCY_BHD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dinar con cero fils"],
  [asFloat(2), "dos dinares con cero fils"],
  [asFloat(8), "ocho dinares con cero fils"],
  [asFloat(12), "doce dinares con cero fils"],
  [asFloat(21), "veintiún dinares con cero fils"],
  [81.25, "ochenta y un dinares con veinticinco fils"],
  [350.9, "trescientos cincuenta dinares con noventa fils"],
  [asFloat(100), "cien dinares con cero fils"],
  [4150.83, "cuatro mil ciento cincuenta dinares con ochenta y tres fils"],
];

export const TEST_CASES_TO_CURRENCY_BOB: [Num2WordsInput, string][] = [
  [asFloat(1), "un boliviano con cero centavos"],
  [asFloat(2), "dos bolivianos con cero centavos"],
  [asFloat(8), "ocho bolivianos con cero centavos"],
  [asFloat(12), "doce bolivianos con cero centavos"],
  [asFloat(21), "veintiún bolivianos con cero centavos"],
  [81.25, "ochenta y un bolivianos con veinticinco centavos"],
  [350.9, "trescientos cincuenta bolivianos con noventa centavos"],
  [asFloat(100), "cien bolivianos con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta bolivianos con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_BTN: [Num2WordsInput, string][] = [
  [asFloat(1), "un ngultrum con cero chetrum"],
  [asFloat(2), "dos ngultrum con cero chetrum"],
  [asFloat(8), "ocho ngultrum con cero chetrum"],
  [asFloat(12), "doce ngultrum con cero chetrum"],
  [asFloat(21), "veintiún ngultrum con cero chetrum"],
  [81.25, "ochenta y un ngultrum con veinticinco chetrum"],
  [350.9, "trescientos cincuenta ngultrum con noventa chetrum"],
  [asFloat(100), "cien ngultrum con cero chetrum"],
  [4150.83, "cuatro mil ciento cincuenta ngultrum con ochenta y tres chetrum"],
];

export const TEST_CASES_TO_CURRENCY_BWP: [Num2WordsInput, string][] = [
  [asFloat(1), "un pula con cero thebes"],
  [asFloat(2), "dos pulas con cero thebes"],
  [asFloat(8), "ocho pulas con cero thebes"],
  [asFloat(12), "doce pulas con cero thebes"],
  [asFloat(21), "veintiún pulas con cero thebes"],
  [81.25, "ochenta y un pulas con veinticinco thebes"],
  [350.9, "trescientos cincuenta pulas con noventa thebes"],
  [asFloat(100), "cien pulas con cero thebes"],
  [4150.83, "cuatro mil ciento cincuenta pulas con ochenta y tres thebes"],
];

export const TEST_CASES_TO_CURRENCY_BYN: [Num2WordsInput, string][] = [
  [asFloat(1), "un rublo con cero kópeks"],
  [asFloat(2), "dos rublos con cero kópeks"],
  [asFloat(8), "ocho rublos con cero kópeks"],
  [asFloat(12), "doce rublos con cero kópeks"],
  [asFloat(21), "veintiún rublos con cero kópeks"],
  [81.25, "ochenta y un rublos con veinticinco kópeks"],
  [350.9, "trescientos cincuenta rublos con noventa kópeks"],
  [asFloat(100), "cien rublos con cero kópeks"],
  [4150.83, "cuatro mil ciento cincuenta rublos con ochenta y tres kópeks"],
];

export const TEST_CASES_TO_CURRENCY_BYR: [Num2WordsInput, string][] = [
  [asFloat(1), "un rublo con cero kópeks"],
  [asFloat(2), "dos rublos con cero kópeks"],
  [asFloat(8), "ocho rublos con cero kópeks"],
  [asFloat(12), "doce rublos con cero kópeks"],
  [asFloat(21), "veintiún rublos con cero kópeks"],
  [81.25, "ochenta y un rublos con veinticinco kópeks"],
  [350.9, "trescientos cincuenta rublos con noventa kópeks"],
  [asFloat(100), "cien rublos con cero kópeks"],
  [4150.83, "cuatro mil ciento cincuenta rublos con ochenta y tres kópeks"],
];

export const TEST_CASES_TO_CURRENCY_BZD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dólar con cero céntimos"],
  [asFloat(2), "dos dólares con cero céntimos"],
  [asFloat(8), "ocho dólares con cero céntimos"],
  [asFloat(12), "doce dólares con cero céntimos"],
  [asFloat(21), "veintiún dólares con cero céntimos"],
  [81.25, "ochenta y un dólares con veinticinco céntimos"],
  [350.9, "trescientos cincuenta dólares con noventa céntimos"],
  [asFloat(100), "cien dólares con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta dólares con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_CVE: [Num2WordsInput, string][] = [
  [asFloat(1), "un escudo con cero centavos"],
  [asFloat(2), "dos escudos con cero centavos"],
  [asFloat(8), "ocho escudos con cero centavos"],
  [asFloat(12), "doce escudos con cero centavos"],
  [asFloat(21), "veintiún escudos con cero centavos"],
  [81.25, "ochenta y un escudos con veinticinco centavos"],
  [350.9, "trescientos cincuenta escudos con noventa centavos"],
  [asFloat(100), "cien escudos con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta escudos con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_CYP: [Num2WordsInput, string][] = [
  [asFloat(1), "una libra con cero céntimos"],
  [asFloat(2), "dos libras con cero céntimos"],
  [asFloat(8), "ocho libras con cero céntimos"],
  [asFloat(12), "doce libras con cero céntimos"],
  [asFloat(21), "veintiuna libras con cero céntimos"],
  [81.25, "ochenta y una libras con veinticinco céntimos"],
  [350.9, "trescientas cincuenta libras con noventa céntimos"],
  [asFloat(100), "cien libras con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta libras con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_DKK: [Num2WordsInput, string][] = [
  [asFloat(1), "una corona con cero øre"],
  [asFloat(2), "dos coronas con cero øre"],
  [asFloat(8), "ocho coronas con cero øre"],
  [asFloat(12), "doce coronas con cero øre"],
  [asFloat(21), "veintiuna coronas con cero øre"],
  [81.25, "ochenta y una coronas con veinticinco øre"],
  [350.9, "trescientas cincuenta coronas con noventa øre"],
  [asFloat(100), "cien coronas con cero øre"],
  [4150.83, "cuatro mil ciento cincuenta coronas con ochenta y tres øre"],
];

export const TEST_CASES_TO_CURRENCY_DZD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dinar con cero céntimos"],
  [asFloat(2), "dos dinares con cero céntimos"],
  [asFloat(8), "ocho dinares con cero céntimos"],
  [asFloat(12), "doce dinares con cero céntimos"],
  [asFloat(21), "veintiún dinares con cero céntimos"],
  [81.25, "ochenta y un dinares con veinticinco céntimos"],
  [350.9, "trescientos cincuenta dinares con noventa céntimos"],
  [asFloat(100), "cien dinares con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta dinares con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_ECS: [Num2WordsInput, string][] = [
  [asFloat(1), "un sucre con cero centavos"],
  [asFloat(2), "dos sucres con cero centavos"],
  [asFloat(8), "ocho sucres con cero centavos"],
  [asFloat(12), "doce sucres con cero centavos"],
  [asFloat(21), "veintiún sucres con cero centavos"],
  [81.25, "ochenta y un sucres con veinticinco centavos"],
  [350.9, "trescientos cincuenta sucres con noventa centavos"],
  [asFloat(100), "cien sucres con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta sucres con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_EGP: [Num2WordsInput, string][] = [
  [asFloat(1), "una libra con cero piastras"],
  [asFloat(2), "dos libras con cero piastras"],
  [asFloat(8), "ocho libras con cero piastras"],
  [asFloat(12), "doce libras con cero piastras"],
  [asFloat(21), "veintiuna libras con cero piastras"],
  [81.21, "ochenta y una libras con veintiuna piastras"],
  [81.25, "ochenta y una libras con veinticinco piastras"],
  [350.9, "trescientas cincuenta libras con noventa piastras"],
  [asFloat(100), "cien libras con cero piastras"],
  [4150.83, "cuatro mil ciento cincuenta libras con ochenta y tres piastras"],
];

export const TEST_CASES_TO_CURRENCY_ERN: [Num2WordsInput, string][] = [
  [asFloat(1), "un nakfa con cero céntimos"],
  [asFloat(2), "dos nakfas con cero céntimos"],
  [asFloat(8), "ocho nakfas con cero céntimos"],
  [asFloat(12), "doce nakfas con cero céntimos"],
  [asFloat(21), "veintiún nakfas con cero céntimos"],
  [81.25, "ochenta y un nakfas con veinticinco céntimos"],
  [350.9, "trescientos cincuenta nakfas con noventa céntimos"],
  [asFloat(100), "cien nakfas con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta nakfas con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_ETB: [Num2WordsInput, string][] = [
  [asFloat(1), "un birr con cero céntimos"],
  [asFloat(2), "dos birrs con cero céntimos"],
  [asFloat(8), "ocho birrs con cero céntimos"],
  [asFloat(12), "doce birrs con cero céntimos"],
  [asFloat(21), "veintiún birrs con cero céntimos"],
  [81.25, "ochenta y un birrs con veinticinco céntimos"],
  [350.9, "trescientos cincuenta birrs con noventa céntimos"],
  [asFloat(100), "cien birrs con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta birrs con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_FKP: [Num2WordsInput, string][] = [
  [asFloat(1), "una libra con cero peniques"],
  [asFloat(2), "dos libras con cero peniques"],
  [asFloat(8), "ocho libras con cero peniques"],
  [asFloat(12), "doce libras con cero peniques"],
  [asFloat(21), "veintiuna libras con cero peniques"],
  [81.25, "ochenta y una libras con veinticinco peniques"],
  [350.9, "trescientas cincuenta libras con noventa peniques"],
  [asFloat(100), "cien libras con cero peniques"],
  [4150.83, "cuatro mil ciento cincuenta libras con ochenta y tres peniques"],
];

export const TEST_CASES_TO_CURRENCY_GEL: [Num2WordsInput, string][] = [
  [asFloat(1), "un lari con cero tetris"],
  [asFloat(2), "dos laris con cero tetris"],
  [asFloat(8), "ocho laris con cero tetris"],
  [asFloat(12), "doce laris con cero tetris"],
  [asFloat(21), "veintiún laris con cero tetris"],
  [81.25, "ochenta y un laris con veinticinco tetris"],
  [350.9, "trescientos cincuenta laris con noventa tetris"],
  [asFloat(100), "cien laris con cero tetris"],
  [4150.83, "cuatro mil ciento cincuenta laris con ochenta y tres tetris"],
];

export const TEST_CASES_TO_CURRENCY_GHS: [Num2WordsInput, string][] = [
  [asFloat(1), "un cedi con cero pesewas"],
  [asFloat(2), "dos cedis con cero pesewas"],
  [asFloat(8), "ocho cedis con cero pesewas"],
  [asFloat(12), "doce cedis con cero pesewas"],
  [asFloat(21), "veintiún cedis con cero pesewas"],
  [81.25, "ochenta y un cedis con veinticinco pesewas"],
  [350.9, "trescientos cincuenta cedis con noventa pesewas"],
  [asFloat(100), "cien cedis con cero pesewas"],
  [4150.83, "cuatro mil ciento cincuenta cedis con ochenta y tres pesewas"],
];

export const TEST_CASES_TO_CURRENCY_GMD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dalasi con cero bututs"],
  [asFloat(2), "dos dalasis con cero bututs"],
  [asFloat(8), "ocho dalasis con cero bututs"],
  [asFloat(12), "doce dalasis con cero bututs"],
  [asFloat(21), "veintiún dalasis con cero bututs"],
  [81.25, "ochenta y un dalasis con veinticinco bututs"],
  [350.9, "trescientos cincuenta dalasis con noventa bututs"],
  [asFloat(100), "cien dalasis con cero bututs"],
  [4150.83, "cuatro mil ciento cincuenta dalasis con ochenta y tres bututs"],
];

export const TEST_CASES_TO_CURRENCY_GTQ: [Num2WordsInput, string][] = [
  [asFloat(1), "un quetzal con cero centavos"],
  [asFloat(2), "dos quetzales con cero centavos"],
  [asFloat(8), "ocho quetzales con cero centavos"],
  [asFloat(12), "doce quetzales con cero centavos"],
  [asFloat(21), "veintiún quetzales con cero centavos"],
  [81.25, "ochenta y un quetzales con veinticinco centavos"],
  [350.9, "trescientos cincuenta quetzales con noventa centavos"],
  [asFloat(100), "cien quetzales con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta quetzales con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_HNL: [Num2WordsInput, string][] = [
  [asFloat(1), "un lempira con cero centavos"],
  [asFloat(2), "dos lempiras con cero centavos"],
  [asFloat(8), "ocho lempiras con cero centavos"],
  [asFloat(12), "doce lempiras con cero centavos"],
  [asFloat(21), "veintiún lempiras con cero centavos"],
  [81.25, "ochenta y un lempiras con veinticinco centavos"],
  [350.9, "trescientos cincuenta lempiras con noventa centavos"],
  [asFloat(100), "cien lempiras con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta lempiras con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_HRK: [Num2WordsInput, string][] = [
  [asFloat(1), "un kuna con cero lipas"],
  [asFloat(2), "dos kunas con cero lipas"],
  [asFloat(8), "ocho kunas con cero lipas"],
  [asFloat(12), "doce kunas con cero lipas"],
  [asFloat(21), "veintiún kunas con cero lipas"],
  [81.25, "ochenta y un kunas con veinticinco lipas"],
  [350.9, "trescientos cincuenta kunas con noventa lipas"],
  [asFloat(100), "cien kunas con cero lipas"],
  [4150.83, "cuatro mil ciento cincuenta kunas con ochenta y tres lipas"],
];

export const TEST_CASES_TO_CURRENCY_HTG: [Num2WordsInput, string][] = [
  [asFloat(1), "un gourde con cero céntimos"],
  [asFloat(2), "dos gourdes con cero céntimos"],
  [asFloat(8), "ocho gourdes con cero céntimos"],
  [asFloat(12), "doce gourdes con cero céntimos"],
  [asFloat(21), "veintiún gourdes con cero céntimos"],
  [81.25, "ochenta y un gourdes con veinticinco céntimos"],
  [350.9, "trescientos cincuenta gourdes con noventa céntimos"],
  [asFloat(100), "cien gourdes con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta gourdes con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_IDR: [Num2WordsInput, string][] = [
  [asFloat(1), "una rupia con cero céntimos"],
  [asFloat(2), "dos rupias con cero céntimos"],
  [asFloat(8), "ocho rupias con cero céntimos"],
  [asFloat(12), "doce rupias con cero céntimos"],
  [asFloat(21), "veintiuna rupias con cero céntimos"],
  [81.25, "ochenta y una rupias con veinticinco céntimos"],
  [350.9, "trescientas cincuenta rupias con noventa céntimos"],
  [asFloat(100), "cien rupias con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta rupias con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_ILS: [Num2WordsInput, string][] = [
  [asFloat(1), "un séquel con cero agoras"],
  [asFloat(2), "dos séqueles con cero agoras"],
  [asFloat(8), "ocho séqueles con cero agoras"],
  [asFloat(12), "doce séqueles con cero agoras"],
  [asFloat(21), "veintiún séqueles con cero agoras"],
  [81.25, "ochenta y un séqueles con veinticinco agoras"],
  [350.9, "trescientos cincuenta séqueles con noventa agoras"],
  [asFloat(100), "cien séqueles con cero agoras"],
  [4150.83, "cuatro mil ciento cincuenta séqueles con ochenta y tres agoras"],
];

export const TEST_CASES_TO_CURRENCY_IQD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dinar con cero fils"],
  [asFloat(2), "dos dinares con cero fils"],
  [asFloat(8), "ocho dinares con cero fils"],
  [asFloat(12), "doce dinares con cero fils"],
  [asFloat(21), "veintiún dinares con cero fils"],
  [81.25, "ochenta y un dinares con veinticinco fils"],
  [350.9, "trescientos cincuenta dinares con noventa fils"],
  [asFloat(100), "cien dinares con cero fils"],
  [4150.83, "cuatro mil ciento cincuenta dinares con ochenta y tres fils"],
];

export const TEST_CASES_TO_CURRENCY_IRR: [Num2WordsInput, string][] = [
  [asFloat(1), "un rial con cero dinares"],
  [asFloat(2), "dos riales con cero dinares"],
  [asFloat(8), "ocho riales con cero dinares"],
  [asFloat(12), "doce riales con cero dinares"],
  [asFloat(21), "veintiún riales con cero dinares"],
  [81.25, "ochenta y un riales con veinticinco dinares"],
  [350.9, "trescientos cincuenta riales con noventa dinares"],
  [asFloat(100), "cien riales con cero dinares"],
  [4150.83, "cuatro mil ciento cincuenta riales con ochenta y tres dinares"],
];

export const TEST_CASES_TO_CURRENCY_ISK: [Num2WordsInput, string][] = [
  [asFloat(1), "una corona con cero aurar"],
  [asFloat(2), "dos coronas con cero aurar"],
  [asFloat(8), "ocho coronas con cero aurar"],
  [asFloat(12), "doce coronas con cero aurar"],
  [asFloat(21), "veintiuna coronas con cero aurar"],
  [81.25, "ochenta y una coronas con veinticinco aurar"],
  [350.9, "trescientas cincuenta coronas con noventa aurar"],
  [asFloat(100), "cien coronas con cero aurar"],
  [4150.83, "cuatro mil ciento cincuenta coronas con ochenta y tres aurar"],
];

export const TEST_CASES_TO_CURRENCY_ITL: [Num2WordsInput, string][] = [
  [asFloat(1), "una lira con cero céntimos"],
  [asFloat(2), "dos liras con cero céntimos"],
  [asFloat(8), "ocho liras con cero céntimos"],
  [asFloat(12), "doce liras con cero céntimos"],
  [asFloat(21), "veintiuna liras con cero céntimos"],
  [81.25, "ochenta y una liras con veinticinco céntimos"],
  [350.9, "trescientas cincuenta liras con noventa céntimos"],
  [asFloat(100), "cien liras con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta liras con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_JOD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dinar con cero piastras"],
  [asFloat(2), "dos dinares con cero piastras"],
  [asFloat(8), "ocho dinares con cero piastras"],
  [asFloat(12), "doce dinares con cero piastras"],
  [asFloat(21), "veintiún dinares con cero piastras"],
  [81.25, "ochenta y un dinares con veinticinco piastras"],
  [350.9, "trescientos cincuenta dinares con noventa piastras"],
  [asFloat(100), "cien dinares con cero piastras"],
  [4150.83, "cuatro mil ciento cincuenta dinares con ochenta y tres piastras"],
];

export const TEST_CASES_TO_CURRENCY_KES: [Num2WordsInput, string][] = [
  [asFloat(1), "un chelín con cero céntimos"],
  [asFloat(2), "dos chelines con cero céntimos"],
  [asFloat(8), "ocho chelines con cero céntimos"],
  [asFloat(12), "doce chelines con cero céntimos"],
  [asFloat(21), "veintiún chelines con cero céntimos"],
  [81.25, "ochenta y un chelines con veinticinco céntimos"],
  [350.9, "trescientos cincuenta chelines con noventa céntimos"],
  [asFloat(100), "cien chelines con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta chelines con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_KGS: [Num2WordsInput, string][] = [
  [asFloat(1), "un som con cero tyiyn"],
  [asFloat(2), "dos som con cero tyiyn"],
  [asFloat(8), "ocho som con cero tyiyn"],
  [asFloat(12), "doce som con cero tyiyn"],
  [asFloat(21), "veintiún som con cero tyiyn"],
  [81.25, "ochenta y un som con veinticinco tyiyn"],
  [350.9, "trescientos cincuenta som con noventa tyiyn"],
  [asFloat(100), "cien som con cero tyiyn"],
  [4150.83, "cuatro mil ciento cincuenta som con ochenta y tres tyiyn"],
];

export const TEST_CASES_TO_CURRENCY_KHR: [Num2WordsInput, string][] = [
  [asFloat(1), "un riel con cero céntimos"],
  [asFloat(2), "dos rieles con cero céntimos"],
  [asFloat(8), "ocho rieles con cero céntimos"],
  [asFloat(12), "doce rieles con cero céntimos"],
  [asFloat(21), "veintiún rieles con cero céntimos"],
  [81.25, "ochenta y un rieles con veinticinco céntimos"],
  [350.9, "trescientos cincuenta rieles con noventa céntimos"],
  [asFloat(100), "cien rieles con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta rieles con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_KWD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dinar con cero fils"],
  [asFloat(2), "dos dinares con cero fils"],
  [asFloat(8), "ocho dinares con cero fils"],
  [asFloat(12), "doce dinares con cero fils"],
  [asFloat(21), "veintiún dinares con cero fils"],
  [81.25, "ochenta y un dinares con veinticinco fils"],
  [350.9, "trescientos cincuenta dinares con noventa fils"],
  [asFloat(100), "cien dinares con cero fils"],
  [4150.83, "cuatro mil ciento cincuenta dinares con ochenta y tres fils"],
];

export const TEST_CASES_TO_CURRENCY_LAK: [Num2WordsInput, string][] = [
  [asFloat(1), "un kip con cero att"],
  [asFloat(2), "dos kips con cero att"],
  [asFloat(8), "ocho kips con cero att"],
  [asFloat(12), "doce kips con cero att"],
  [asFloat(21), "veintiún kips con cero att"],
  [81.25, "ochenta y un kips con veinticinco att"],
  [350.9, "trescientos cincuenta kips con noventa att"],
  [asFloat(100), "cien kips con cero att"],
  [4150.83, "cuatro mil ciento cincuenta kips con ochenta y tres att"],
];

export const TEST_CASES_TO_CURRENCY_LKR: [Num2WordsInput, string][] = [
  [asFloat(1), "una rupia con cero céntimos"],
  [asFloat(2), "dos rupias con cero céntimos"],
  [asFloat(8), "ocho rupias con cero céntimos"],
  [asFloat(12), "doce rupias con cero céntimos"],
  [asFloat(21), "veintiuna rupias con cero céntimos"],
  [81.25, "ochenta y una rupias con veinticinco céntimos"],
  [350.9, "trescientas cincuenta rupias con noventa céntimos"],
  [asFloat(100), "cien rupias con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta rupias con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_LSL: [Num2WordsInput, string][] = [
  [asFloat(1), "un loti con cero céntimos"],
  [asFloat(2), "dos lotis con cero céntimos"],
  [asFloat(8), "ocho lotis con cero céntimos"],
  [asFloat(12), "doce lotis con cero céntimos"],
  [asFloat(21), "veintiún lotis con cero céntimos"],
  [81.25, "ochenta y un lotis con veinticinco céntimos"],
  [350.9, "trescientos cincuenta lotis con noventa céntimos"],
  [asFloat(100), "cien lotis con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta lotis con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_LTL: [Num2WordsInput, string][] = [
  [asFloat(1), "un lita con cero céntimos"],
  [asFloat(2), "dos litas con cero céntimos"],
  [asFloat(8), "ocho litas con cero céntimos"],
  [asFloat(12), "doce litas con cero céntimos"],
  [asFloat(21), "veintiún litas con cero céntimos"],
  [81.25, "ochenta y un litas con veinticinco céntimos"],
  [350.9, "trescientos cincuenta litas con noventa céntimos"],
  [asFloat(100), "cien litas con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta litas con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_LVL: [Num2WordsInput, string][] = [
  [asFloat(1), "un lat con cero céntimos"],
  [asFloat(2), "dos lats con cero céntimos"],
  [asFloat(8), "ocho lats con cero céntimos"],
  [asFloat(12), "doce lats con cero céntimos"],
  [asFloat(21), "veintiún lats con cero céntimos"],
  [81.25, "ochenta y un lats con veinticinco céntimos"],
  [350.9, "trescientos cincuenta lats con noventa céntimos"],
  [asFloat(100), "cien lats con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta lats con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_LYD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dinar con cero dírhams"],
  [asFloat(2), "dos dinares con cero dírhams"],
  [asFloat(8), "ocho dinares con cero dírhams"],
  [asFloat(12), "doce dinares con cero dírhams"],
  [asFloat(21), "veintiún dinares con cero dírhams"],
  [81.25, "ochenta y un dinares con veinticinco dírhams"],
  [350.9, "trescientos cincuenta dinares con noventa dírhams"],
  [asFloat(100), "cien dinares con cero dírhams"],
  [4150.83, "cuatro mil ciento cincuenta dinares con ochenta y tres dírhams"],
];

export const TEST_CASES_TO_CURRENCY_MAD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dírham con cero céntimos"],
  [asFloat(2), "dos dirhams con cero céntimos"],
  [asFloat(8), "ocho dirhams con cero céntimos"],
  [asFloat(12), "doce dirhams con cero céntimos"],
  [asFloat(21), "veintiún dirhams con cero céntimos"],
  [81.25, "ochenta y un dirhams con veinticinco céntimos"],
  [350.9, "trescientos cincuenta dirhams con noventa céntimos"],
  [asFloat(100), "cien dirhams con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta dirhams con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_MDL: [Num2WordsInput, string][] = [
  [asFloat(1), "un leu con cero bani"],
  [asFloat(2), "dos lei con cero bani"],
  [asFloat(8), "ocho lei con cero bani"],
  [asFloat(12), "doce lei con cero bani"],
  [asFloat(21), "veintiún lei con cero bani"],
  [81.25, "ochenta y un lei con veinticinco bani"],
  [350.9, "trescientos cincuenta lei con noventa bani"],
  [asFloat(100), "cien lei con cero bani"],
  [4150.83, "cuatro mil ciento cincuenta lei con ochenta y tres bani"],
];

export const TEST_CASES_TO_CURRENCY_MGA: [Num2WordsInput, string][] = [
  [asFloat(1), "un ariary con cero iraimbilanja"],
  [asFloat(2), "dos ariaris con cero iraimbilanja"],
  [asFloat(8), "ocho ariaris con cero iraimbilanja"],
  [asFloat(12), "doce ariaris con cero iraimbilanja"],
  [asFloat(21), "veintiún ariaris con cero iraimbilanja"],
  [81.25, "ochenta y un ariaris con veinticinco iraimbilanja"],
  [350.9, "trescientos cincuenta ariaris con noventa iraimbilanja"],
  [asFloat(100), "cien ariaris con cero iraimbilanja"],
  [4150.83, "cuatro mil ciento cincuenta ariaris con ochenta y tres iraimbilanja"],
];

export const TEST_CASES_TO_CURRENCY_MKD: [Num2WordsInput, string][] = [
  [asFloat(1), "un denar con cero denis"],
  [asFloat(2), "dos denares con cero denis"],
  [asFloat(8), "ocho denares con cero denis"],
  [asFloat(12), "doce denares con cero denis"],
  [asFloat(21), "veintiún denares con cero denis"],
  [81.25, "ochenta y un denares con veinticinco denis"],
  [350.9, "trescientos cincuenta denares con noventa denis"],
  [asFloat(100), "cien denares con cero denis"],
  [4150.83, "cuatro mil ciento cincuenta denares con ochenta y tres denis"],
];

export const TEST_CASES_TO_CURRENCY_MMK: [Num2WordsInput, string][] = [
  [asFloat(1), "un kiat con cero pyas"],
  [asFloat(2), "dos kiats con cero pyas"],
  [asFloat(8), "ocho kiats con cero pyas"],
  [asFloat(12), "doce kiats con cero pyas"],
  [asFloat(21), "veintiún kiats con cero pyas"],
  [81.25, "ochenta y un kiats con veinticinco pyas"],
  [350.9, "trescientos cincuenta kiats con noventa pyas"],
  [asFloat(100), "cien kiats con cero pyas"],
  [4150.83, "cuatro mil ciento cincuenta kiats con ochenta y tres pyas"],
];

export const TEST_CASES_TO_CURRENCY_MNT: [Num2WordsInput, string][] = [
  [asFloat(1), "un tugrik con cero möngö"],
  [asFloat(2), "dos tugriks con cero möngö"],
  [asFloat(8), "ocho tugriks con cero möngö"],
  [asFloat(12), "doce tugriks con cero möngö"],
  [asFloat(21), "veintiún tugriks con cero möngö"],
  [81.25, "ochenta y un tugriks con veinticinco möngö"],
  [350.9, "trescientos cincuenta tugriks con noventa möngö"],
  [asFloat(100), "cien tugriks con cero möngö"],
  [4150.83, "cuatro mil ciento cincuenta tugriks con ochenta y tres möngö"],
];

export const TEST_CASES_TO_CURRENCY_MOP: [Num2WordsInput, string][] = [
  [asFloat(1), "un pataca con cero avos"],
  [asFloat(2), "dos patacas con cero avos"],
  [asFloat(8), "ocho patacas con cero avos"],
  [asFloat(12), "doce patacas con cero avos"],
  [asFloat(21), "veintiún patacas con cero avos"],
  [81.25, "ochenta y un patacas con veinticinco avos"],
  [350.9, "trescientos cincuenta patacas con noventa avos"],
  [asFloat(100), "cien patacas con cero avos"],
  [4150.83, "cuatro mil ciento cincuenta patacas con ochenta y tres avos"],
];

export const TEST_CASES_TO_CURRENCY_MRO: [Num2WordsInput, string][] = [
  [asFloat(1), "un ouguiya con cero khoums"],
  [asFloat(2), "dos ouguiyas con cero khoums"],
  [asFloat(8), "ocho ouguiyas con cero khoums"],
  [asFloat(12), "doce ouguiyas con cero khoums"],
  [asFloat(21), "veintiún ouguiyas con cero khoums"],
  [81.25, "ochenta y un ouguiyas con veinticinco khoums"],
  [350.9, "trescientos cincuenta ouguiyas con noventa khoums"],
  [asFloat(100), "cien ouguiyas con cero khoums"],
  [4150.83, "cuatro mil ciento cincuenta ouguiyas con ochenta y tres khoums"],
];

export const TEST_CASES_TO_CURRENCY_MRU: [Num2WordsInput, string][] = [
  [asFloat(1), "un ouguiya con cero khoums"],
  [asFloat(2), "dos ouguiyas con cero khoums"],
  [asFloat(8), "ocho ouguiyas con cero khoums"],
  [asFloat(12), "doce ouguiyas con cero khoums"],
  [asFloat(21), "veintiún ouguiyas con cero khoums"],
  [81.25, "ochenta y un ouguiyas con veinticinco khoums"],
  [350.9, "trescientos cincuenta ouguiyas con noventa khoums"],
  [asFloat(100), "cien ouguiyas con cero khoums"],
  [4150.83, "cuatro mil ciento cincuenta ouguiyas con ochenta y tres khoums"],
];

export const TEST_CASES_TO_CURRENCY_MUR: [Num2WordsInput, string][] = [
  [asFloat(1), "una rupia con cero céntimos"],
  [asFloat(2), "dos rupias con cero céntimos"],
  [asFloat(8), "ocho rupias con cero céntimos"],
  [asFloat(12), "doce rupias con cero céntimos"],
  [asFloat(21), "veintiuna rupias con cero céntimos"],
  [81.25, "ochenta y una rupias con veinticinco céntimos"],
  [350.9, "trescientas cincuenta rupias con noventa céntimos"],
  [asFloat(100), "cien rupias con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta rupias con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_MVR: [Num2WordsInput, string][] = [
  [asFloat(1), "un rufiyaa con cero laari"],
  [asFloat(2), "dos rufiyaas con cero laari"],
  [asFloat(8), "ocho rufiyaas con cero laari"],
  [asFloat(12), "doce rufiyaas con cero laari"],
  [asFloat(21), "veintiún rufiyaas con cero laari"],
  [81.25, "ochenta y un rufiyaas con veinticinco laari"],
  [350.9, "trescientos cincuenta rufiyaas con noventa laari"],
  [asFloat(100), "cien rufiyaas con cero laari"],
  [4150.83, "cuatro mil ciento cincuenta rufiyaas con ochenta y tres laari"],
];

export const TEST_CASES_TO_CURRENCY_MWK: [Num2WordsInput, string][] = [
  [asFloat(1), "un kuacha con cero tambalas"],
  [asFloat(2), "dos kuachas con cero tambalas"],
  [asFloat(8), "ocho kuachas con cero tambalas"],
  [asFloat(12), "doce kuachas con cero tambalas"],
  [asFloat(21), "veintiún kuachas con cero tambalas"],
  [81.25, "ochenta y un kuachas con veinticinco tambalas"],
  [350.9, "trescientos cincuenta kuachas con noventa tambalas"],
  [asFloat(100), "cien kuachas con cero tambalas"],
  [4150.83, "cuatro mil ciento cincuenta kuachas con ochenta y tres tambalas"],
];

export const TEST_CASES_TO_CURRENCY_MYR: [Num2WordsInput, string][] = [
  [asFloat(1), "un ringgit con cero céntimos"],
  [asFloat(2), "dos ringgit con cero céntimos"],
  [asFloat(8), "ocho ringgit con cero céntimos"],
  [asFloat(12), "doce ringgit con cero céntimos"],
  [asFloat(21), "veintiún ringgit con cero céntimos"],
  [81.25, "ochenta y un ringgit con veinticinco céntimos"],
  [350.9, "trescientos cincuenta ringgit con noventa céntimos"],
  [asFloat(100), "cien ringgit con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta ringgit con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_MZN: [Num2WordsInput, string][] = [
  [asFloat(1), "un metical con cero centavos"],
  [asFloat(2), "dos metical con cero centavos"],
  [asFloat(8), "ocho metical con cero centavos"],
  [asFloat(12), "doce metical con cero centavos"],
  [asFloat(21), "veintiún metical con cero centavos"],
  [81.25, "ochenta y un metical con veinticinco centavos"],
  [350.9, "trescientos cincuenta metical con noventa centavos"],
  [asFloat(100), "cien metical con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta metical con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_NGN: [Num2WordsInput, string][] = [
  [asFloat(1), "un naira con cero kobo"],
  [asFloat(2), "dos nairas con cero kobo"],
  [asFloat(8), "ocho nairas con cero kobo"],
  [asFloat(12), "doce nairas con cero kobo"],
  [asFloat(21), "veintiún nairas con cero kobo"],
  [81.25, "ochenta y un nairas con veinticinco kobo"],
  [350.9, "trescientos cincuenta nairas con noventa kobo"],
  [asFloat(100), "cien nairas con cero kobo"],
  [4150.83, "cuatro mil ciento cincuenta nairas con ochenta y tres kobo"],
];

export const TEST_CASES_TO_CURRENCY_NPR: [Num2WordsInput, string][] = [
  [asFloat(1), "una rupia con cero paisas"],
  [asFloat(2), "dos rupias con cero paisas"],
  [asFloat(8), "ocho rupias con cero paisas"],
  [asFloat(12), "doce rupias con cero paisas"],
  [asFloat(21), "veintiuna rupias con cero paisas"],
  [81.25, "ochenta y una rupias con veinticinco paisas"],
  [350.9, "trescientas cincuenta rupias con noventa paisas"],
  [asFloat(100), "cien rupias con cero paisas"],
  [4150.83, "cuatro mil ciento cincuenta rupias con ochenta y tres paisas"],
];

export const TEST_CASES_TO_CURRENCY_OMR: [Num2WordsInput, string][] = [
  [asFloat(1), "un rial con cero baisa"],
  [asFloat(2), "dos riales con cero baisa"],
  [asFloat(8), "ocho riales con cero baisa"],
  [asFloat(12), "doce riales con cero baisa"],
  [asFloat(21), "veintiún riales con cero baisa"],
  [81.25, "ochenta y un riales con veinticinco baisa"],
  [350.9, "trescientos cincuenta riales con noventa baisa"],
  [asFloat(100), "cien riales con cero baisa"],
  [4150.83, "cuatro mil ciento cincuenta riales con ochenta y tres baisa"],
];

export const TEST_CASES_TO_CURRENCY_PAB: [Num2WordsInput, string][] = [
  [asFloat(1), "un balboa con cero centésimos"],
  [asFloat(2), "dos balboas con cero centésimos"],
  [asFloat(8), "ocho balboas con cero centésimos"],
  [asFloat(12), "doce balboas con cero centésimos"],
  [asFloat(21), "veintiún balboas con cero centésimos"],
  [81.25, "ochenta y un balboas con veinticinco centésimos"],
  [350.9, "trescientos cincuenta balboas con noventa centésimos"],
  [asFloat(100), "cien balboas con cero centésimos"],
  [4150.83, "cuatro mil ciento cincuenta balboas con ochenta y tres centésimos"],
];

export const TEST_CASES_TO_CURRENCY_PGK: [Num2WordsInput, string][] = [
  [asFloat(1), "un kina con cero toea"],
  [asFloat(2), "dos kinas con cero toea"],
  [asFloat(8), "ocho kinas con cero toea"],
  [asFloat(12), "doce kinas con cero toea"],
  [asFloat(21), "veintiún kinas con cero toea"],
  [81.25, "ochenta y un kinas con veinticinco toea"],
  [350.9, "trescientos cincuenta kinas con noventa toea"],
  [asFloat(100), "cien kinas con cero toea"],
  [4150.83, "cuatro mil ciento cincuenta kinas con ochenta y tres toea"],
];

export const TEST_CASES_TO_CURRENCY_PKR: [Num2WordsInput, string][] = [
  [asFloat(1), "una rupia con cero paisas"],
  [asFloat(2), "dos rupias con cero paisas"],
  [asFloat(8), "ocho rupias con cero paisas"],
  [asFloat(12), "doce rupias con cero paisas"],
  [asFloat(21), "veintiuna rupias con cero paisas"],
  [81.25, "ochenta y una rupias con veinticinco paisas"],
  [350.9, "trescientas cincuenta rupias con noventa paisas"],
  [asFloat(100), "cien rupias con cero paisas"],
  [4150.83, "cuatro mil ciento cincuenta rupias con ochenta y tres paisas"],
];

export const TEST_CASES_TO_CURRENCY_PLZ: [Num2WordsInput, string][] = [
  [asFloat(1), "un zloty con cero groszy"],
  [asFloat(2), "dos zlotys con cero groszy"],
  [asFloat(8), "ocho zlotys con cero groszy"],
  [asFloat(12), "doce zlotys con cero groszy"],
  [asFloat(21), "veintiún zlotys con cero groszy"],
  [81.25, "ochenta y un zlotys con veinticinco groszy"],
  [350.9, "trescientos cincuenta zlotys con noventa groszy"],
  [asFloat(100), "cien zlotys con cero groszy"],
  [4150.83, "cuatro mil ciento cincuenta zlotys con ochenta y tres groszy"],
];

export const TEST_CASES_TO_CURRENCY_PYG: [Num2WordsInput, string][] = [
  [asFloat(1), "un guaraní con cero céntimos"],
  [asFloat(2), "dos guaranís con cero céntimos"],
  [asFloat(8), "ocho guaranís con cero céntimos"],
  [asFloat(12), "doce guaranís con cero céntimos"],
  [asFloat(21), "veintiún guaranís con cero céntimos"],
  [81.25, "ochenta y un guaranís con veinticinco céntimos"],
  [350.9, "trescientos cincuenta guaranís con noventa céntimos"],
  [asFloat(100), "cien guaranís con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta guaranís con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_QAR: [Num2WordsInput, string][] = [
  [asFloat(1), "un rial con cero dírhams"],
  [asFloat(2), "dos riales con cero dírhams"],
  [asFloat(8), "ocho riales con cero dírhams"],
  [asFloat(12), "doce riales con cero dírhams"],
  [asFloat(21), "veintiún riales con cero dírhams"],
  [81.25, "ochenta y un riales con veinticinco dírhams"],
  [350.9, "trescientos cincuenta riales con noventa dírhams"],
  [asFloat(100), "cien riales con cero dírhams"],
  [4150.83, "cuatro mil ciento cincuenta riales con ochenta y tres dírhams"],
];

export const TEST_CASES_TO_CURRENCY_RSD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dinar con cero para"],
  [asFloat(2), "dos dinares con cero para"],
  [asFloat(8), "ocho dinares con cero para"],
  [asFloat(12), "doce dinares con cero para"],
  [asFloat(21), "veintiún dinares con cero para"],
  [81.25, "ochenta y un dinares con veinticinco para"],
  [350.9, "trescientos cincuenta dinares con noventa para"],
  [asFloat(100), "cien dinares con cero para"],
  [4150.83, "cuatro mil ciento cincuenta dinares con ochenta y tres para"],
];

export const TEST_CASES_TO_CURRENCY_RUR: [Num2WordsInput, string][] = [
  [asFloat(1), "un rublo con cero kopeks"],
  [asFloat(2), "dos rublos con cero kopeks"],
  [asFloat(8), "ocho rublos con cero kopeks"],
  [asFloat(12), "doce rublos con cero kopeks"],
  [asFloat(21), "veintiún rublos con cero kopeks"],
  [81.25, "ochenta y un rublos con veinticinco kopeks"],
  [350.9, "trescientos cincuenta rublos con noventa kopeks"],
  [asFloat(100), "cien rublos con cero kopeks"],
  [4150.83, "cuatro mil ciento cincuenta rublos con ochenta y tres kopeks"],
];

export const TEST_CASES_TO_CURRENCY_SAR: [Num2WordsInput, string][] = [
  [asFloat(1), "un riyal con cero halalas"],
  [asFloat(2), "dos riales con cero halalas"],
  [asFloat(8), "ocho riales con cero halalas"],
  [asFloat(12), "doce riales con cero halalas"],
  [asFloat(21), "veintiún riales con cero halalas"],
  [81.25, "ochenta y un riales con veinticinco halalas"],
  [350.9, "trescientos cincuenta riales con noventa halalas"],
  [asFloat(100), "cien riales con cero halalas"],
  [4150.83, "cuatro mil ciento cincuenta riales con ochenta y tres halalas"],
];

export const TEST_CASES_TO_CURRENCY_SCR: [Num2WordsInput, string][] = [
  [asFloat(1), "una rupia con cero céntimos"],
  [asFloat(2), "dos rupias con cero céntimos"],
  [asFloat(8), "ocho rupias con cero céntimos"],
  [asFloat(12), "doce rupias con cero céntimos"],
  [asFloat(21), "veintiuna rupias con cero céntimos"],
  [81.25, "ochenta y una rupias con veinticinco céntimos"],
  [350.9, "trescientas cincuenta rupias con noventa céntimos"],
  [asFloat(100), "cien rupias con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta rupias con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_SHP: [Num2WordsInput, string][] = [
  [asFloat(1), "una libra con cero peniques"],
  [asFloat(2), "dos libras con cero peniques"],
  [asFloat(8), "ocho libras con cero peniques"],
  [asFloat(12), "doce libras con cero peniques"],
  [asFloat(21), "veintiuna libras con cero peniques"],
  [81.25, "ochenta y una libras con veinticinco peniques"],
  [350.9, "trescientas cincuenta libras con noventa peniques"],
  [asFloat(100), "cien libras con cero peniques"],
  [4150.83, "cuatro mil ciento cincuenta libras con ochenta y tres peniques"],
];

export const TEST_CASES_TO_CURRENCY_SKK: [Num2WordsInput, string][] = [
  [asFloat(1), "una corona con cero haliers"],
  [asFloat(2), "dos coronas con cero haliers"],
  [asFloat(8), "ocho coronas con cero haliers"],
  [asFloat(12), "doce coronas con cero haliers"],
  [asFloat(21), "veintiuna coronas con cero haliers"],
  [81.25, "ochenta y una coronas con veinticinco haliers"],
  [350.9, "trescientas cincuenta coronas con noventa haliers"],
  [asFloat(100), "cien coronas con cero haliers"],
  [4150.83, "cuatro mil ciento cincuenta coronas con ochenta y tres haliers"],
];

export const TEST_CASES_TO_CURRENCY_SLL: [Num2WordsInput, string][] = [
  [asFloat(1), "una leona con cero céntimos"],
  [asFloat(2), "dos leonas con cero céntimos"],
  [asFloat(8), "ocho leonas con cero céntimos"],
  [asFloat(12), "doce leonas con cero céntimos"],
  [asFloat(21), "veintiuna leonas con cero céntimos"],
  [81.25, "ochenta y una leonas con veinticinco céntimos"],
  [350.9, "trescientas cincuenta leonas con noventa céntimos"],
  [asFloat(100), "cien leonas con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta leonas con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_STD: [Num2WordsInput, string][] = [
  [asFloat(1), "un dobra con cero céntimos"],
  [asFloat(2), "dos dobras con cero céntimos"],
  [asFloat(8), "ocho dobras con cero céntimos"],
  [asFloat(12), "doce dobras con cero céntimos"],
  [asFloat(21), "veintiún dobras con cero céntimos"],
  [81.25, "ochenta y un dobras con veinticinco céntimos"],
  [350.9, "trescientos cincuenta dobras con noventa céntimos"],
  [asFloat(100), "cien dobras con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta dobras con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_SVC: [Num2WordsInput, string][] = [
  [asFloat(1), "un colón con cero centavos"],
  [asFloat(2), "dos colones con cero centavos"],
  [asFloat(8), "ocho colones con cero centavos"],
  [asFloat(12), "doce colones con cero centavos"],
  [asFloat(21), "veintiún colones con cero centavos"],
  [81.25, "ochenta y un colones con veinticinco centavos"],
  [350.9, "trescientos cincuenta colones con noventa centavos"],
  [asFloat(100), "cien colones con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta colones con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_SZL: [Num2WordsInput, string][] = [
  [asFloat(1), "un lilangeni con cero céntimos"],
  [asFloat(2), "dos emalangeni con cero céntimos"],
  [asFloat(8), "ocho emalangeni con cero céntimos"],
  [asFloat(12), "doce emalangeni con cero céntimos"],
  [asFloat(21), "veintiún emalangeni con cero céntimos"],
  [81.25, "ochenta y un emalangeni con veinticinco céntimos"],
  [350.9, "trescientos cincuenta emalangeni con noventa céntimos"],
  [asFloat(100), "cien emalangeni con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta emalangeni con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_TJS: [Num2WordsInput, string][] = [
  [asFloat(1), "un somoni con cero dirames"],
  [asFloat(2), "dos somonis con cero dirames"],
  [asFloat(8), "ocho somonis con cero dirames"],
  [asFloat(12), "doce somonis con cero dirames"],
  [asFloat(21), "veintiún somonis con cero dirames"],
  [81.25, "ochenta y un somonis con veinticinco dirames"],
  [350.9, "trescientos cincuenta somonis con noventa dirames"],
  [asFloat(100), "cien somonis con cero dirames"],
  [4150.83, "cuatro mil ciento cincuenta somonis con ochenta y tres dirames"],
];

export const TEST_CASES_TO_CURRENCY_TMT: [Num2WordsInput, string][] = [
  [asFloat(1), "un manat con cero tenge"],
  [asFloat(2), "dos manat con cero tenge"],
  [asFloat(8), "ocho manat con cero tenge"],
  [asFloat(12), "doce manat con cero tenge"],
  [asFloat(21), "veintiún manat con cero tenge"],
  [81.25, "ochenta y un manat con veinticinco tenge"],
  [350.9, "trescientos cincuenta manat con noventa tenge"],
  [asFloat(100), "cien manat con cero tenge"],
  [4150.83, "cuatro mil ciento cincuenta manat con ochenta y tres tenge"],
];

export const TEST_CASES_TO_CURRENCY_TND: [Num2WordsInput, string][] = [
  [asFloat(1), "un dinar con cero milésimos"],
  [asFloat(2), "dos dinares con cero milésimos"],
  [asFloat(8), "ocho dinares con cero milésimos"],
  [asFloat(12), "doce dinares con cero milésimos"],
  [asFloat(21), "veintiún dinares con cero milésimos"],
  [81.25, "ochenta y un dinares con veinticinco milésimos"],
  [350.9, "trescientos cincuenta dinares con noventa milésimos"],
  [asFloat(100), "cien dinares con cero milésimos"],
  [4150.83, "cuatro mil ciento cincuenta dinares con ochenta y tres milésimos"],
];

export const TEST_CASES_TO_CURRENCY_TOP: [Num2WordsInput, string][] = [
  [asFloat(1), "un paanga con cero céntimos"],
  [asFloat(2), "dos paangas con cero céntimos"],
  [asFloat(8), "ocho paangas con cero céntimos"],
  [asFloat(12), "doce paangas con cero céntimos"],
  [asFloat(21), "veintiún paangas con cero céntimos"],
  [81.25, "ochenta y un paangas con veinticinco céntimos"],
  [350.9, "trescientos cincuenta paangas con noventa céntimos"],
  [asFloat(100), "cien paangas con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta paangas con ochenta y tres céntimos"],
];

let wordamount = `${"cuatro mil ciento cincuenta"} ${"nuevos dólares con ochenta y tres céntimos"}`;

export const TEST_CASES_TO_CURRENCY_TWD: [Num2WordsInput, string][] = [
  [asFloat(1), "un nuevo dólar con cero céntimos"],
  [asFloat(2), "dos nuevos dólares con cero céntimos"],
  [asFloat(8), "ocho nuevos dólares con cero céntimos"],
  [asFloat(12), "doce nuevos dólares con cero céntimos"],
  [asFloat(21), "veintiún nuevos dólares con cero céntimos"],
  [81.25, "ochenta y un nuevos dólares con veinticinco céntimos"],
  [350.9, "trescientos cincuenta nuevos dólares con noventa céntimos"],
  [asFloat(100), "cien nuevos dólares con cero céntimos"],
  [4150.83, wordamount],
];

export const TEST_CASES_TO_CURRENCY_TZS: [Num2WordsInput, string][] = [
  [asFloat(1), "un chelín con cero céntimos"],
  [asFloat(2), "dos chelines con cero céntimos"],
  [asFloat(8), "ocho chelines con cero céntimos"],
  [asFloat(12), "doce chelines con cero céntimos"],
  [asFloat(21), "veintiún chelines con cero céntimos"],
  [81.25, "ochenta y un chelines con veinticinco céntimos"],
  [350.9, "trescientos cincuenta chelines con noventa céntimos"],
  [asFloat(100), "cien chelines con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta chelines con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_UAG: [Num2WordsInput, string][] = [
  [asFloat(1), "un hryvnia con cero kopiykas"],
  [asFloat(2), "dos hryvnias con cero kopiykas"],
  [asFloat(8), "ocho hryvnias con cero kopiykas"],
  [asFloat(12), "doce hryvnias con cero kopiykas"],
  [asFloat(21), "veintiún hryvnias con cero kopiykas"],
  [81.25, "ochenta y un hryvnias con veinticinco kopiykas"],
  [350.9, "trescientos cincuenta hryvnias con noventa kopiykas"],
  [asFloat(100), "cien hryvnias con cero kopiykas"],
  [4150.83, "cuatro mil ciento cincuenta hryvnias con ochenta y tres kopiykas"],
];

export const TEST_CASES_TO_CURRENCY_UGX: [Num2WordsInput, string][] = [
  [asFloat(1), "un chelín con cero céntimos"],
  [asFloat(2), "dos chelines con cero céntimos"],
  [asFloat(8), "ocho chelines con cero céntimos"],
  [asFloat(12), "doce chelines con cero céntimos"],
  [asFloat(21), "veintiún chelines con cero céntimos"],
  [81.25, "ochenta y un chelines con veinticinco céntimos"],
  [350.9, "trescientos cincuenta chelines con noventa céntimos"],
  [asFloat(100), "cien chelines con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta chelines con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_UYU: [Num2WordsInput, string][] = [
  [asFloat(1), "un peso con cero centésimos"],
  [asFloat(2), "dos pesos con cero centésimos"],
  [asFloat(8), "ocho pesos con cero centésimos"],
  [asFloat(12), "doce pesos con cero centésimos"],
  [asFloat(21), "veintiún pesos con cero centésimos"],
  [81.25, "ochenta y un pesos con veinticinco centésimos"],
  [350.9, "trescientos cincuenta pesos con noventa centésimos"],
  [asFloat(100), "cien pesos con cero centésimos"],
  [4150.83, "cuatro mil ciento cincuenta pesos con ochenta y tres centésimos"],
];

export const TEST_CASES_TO_CURRENCY_UZS: [Num2WordsInput, string][] = [
  [asFloat(1), "un sum con cero tiyin"],
  [asFloat(2), "dos sum con cero tiyin"],
  [asFloat(8), "ocho sum con cero tiyin"],
  [asFloat(12), "doce sum con cero tiyin"],
  [asFloat(21), "veintiún sum con cero tiyin"],
  [81.25, "ochenta y un sum con veinticinco tiyin"],
  [350.9, "trescientos cincuenta sum con noventa tiyin"],
  [asFloat(100), "cien sum con cero tiyin"],
  [4150.83, "cuatro mil ciento cincuenta sum con ochenta y tres tiyin"],
];

wordamount = `${"cuatro mil ciento cincuenta"} ${"bolívares fuertes con ochenta y tres céntimos"}`;

export const TEST_CASES_TO_CURRENCY_VEF: [Num2WordsInput, string][] = [
  [asFloat(1), "un bolívar fuerte con cero céntimos"],
  [asFloat(2), "dos bolívares fuertes con cero céntimos"],
  [asFloat(8), "ocho bolívares fuertes con cero céntimos"],
  [asFloat(12), "doce bolívares fuertes con cero céntimos"],
  [asFloat(21), "veintiún bolívares fuertes con cero céntimos"],
  [81.25, "ochenta y un bolívares fuertes con veinticinco céntimos"],
  [350.9, "trescientos cincuenta bolívares fuertes con noventa céntimos"],
  [asFloat(100), "cien bolívares fuertes con cero céntimos"],
  [4150.83, wordamount],
];

export const TEST_CASES_TO_CURRENCY_VND: [Num2WordsInput, string][] = [
  [asFloat(1), "un dong con cero xu"],
  [asFloat(2), "dos dongs con cero xu"],
  [asFloat(8), "ocho dongs con cero xu"],
  [asFloat(12), "doce dongs con cero xu"],
  [asFloat(21), "veintiún dongs con cero xu"],
  [81.25, "ochenta y un dongs con veinticinco xu"],
  [350.9, "trescientos cincuenta dongs con noventa xu"],
  [asFloat(100), "cien dongs con cero xu"],
  [4150.83, "cuatro mil ciento cincuenta dongs con ochenta y tres xu"],
];

export const TEST_CASES_TO_CURRENCY_VUV: [Num2WordsInput, string][] = [
  [asFloat(1), "un vatu con cero nenhum"],
  [asFloat(2), "dos vatu con cero nenhum"],
  [asFloat(8), "ocho vatu con cero nenhum"],
  [asFloat(12), "doce vatu con cero nenhum"],
  [asFloat(21), "veintiún vatu con cero nenhum"],
  [81.25, "ochenta y un vatu con veinticinco nenhum"],
  [350.9, "trescientos cincuenta vatu con noventa nenhum"],
  [asFloat(100), "cien vatu con cero nenhum"],
  [4150.83, "cuatro mil ciento cincuenta vatu con ochenta y tres nenhum"],
];

export const TEST_CASES_TO_CURRENCY_WST: [Num2WordsInput, string][] = [
  [asFloat(1), "un tala con cero centavos"],
  [asFloat(2), "dos tala con cero centavos"],
  [asFloat(8), "ocho tala con cero centavos"],
  [asFloat(12), "doce tala con cero centavos"],
  [asFloat(21), "veintiún tala con cero centavos"],
  [81.25, "ochenta y un tala con veinticinco centavos"],
  [350.9, "trescientos cincuenta tala con noventa centavos"],
  [asFloat(100), "cien tala con cero centavos"],
  [4150.83, "cuatro mil ciento cincuenta tala con ochenta y tres centavos"],
];

export const TEST_CASES_TO_CURRENCY_XAF: [Num2WordsInput, string][] = [
  [asFloat(1), "un franco CFA con cero céntimos"],
  [asFloat(2), "dos francos CFA con cero céntimos"],
  [asFloat(8), "ocho francos CFA con cero céntimos"],
  [asFloat(12), "doce francos CFA con cero céntimos"],
  [asFloat(21), "veintiún francos CFA con cero céntimos"],
  [81.25, "ochenta y un francos CFA con veinticinco céntimos"],
  [350.9, "trescientos cincuenta francos CFA con noventa céntimos"],
  [asFloat(100), "cien francos CFA con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta francos CFA con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_XPF: [Num2WordsInput, string][] = [
  [asFloat(1), "un franco CFP con cero céntimos"],
  [asFloat(2), "dos francos CFP con cero céntimos"],
  [asFloat(8), "ocho francos CFP con cero céntimos"],
  [asFloat(12), "doce francos CFP con cero céntimos"],
  [asFloat(21), "veintiún francos CFP con cero céntimos"],
  [81.25, "ochenta y un francos CFP con veinticinco céntimos"],
  [350.9, "trescientos cincuenta francos CFP con noventa céntimos"],
  [asFloat(100), "cien francos CFP con cero céntimos"],
  [4150.83, "cuatro mil ciento cincuenta francos CFP con ochenta y tres céntimos"],
];

export const TEST_CASES_TO_CURRENCY_YER: [Num2WordsInput, string][] = [
  [asFloat(1), "un rial con cero fils"],
  [asFloat(2), "dos riales con cero fils"],
  [asFloat(8), "ocho riales con cero fils"],
  [asFloat(12), "doce riales con cero fils"],
  [asFloat(21), "veintiún riales con cero fils"],
  [81.25, "ochenta y un riales con veinticinco fils"],
  [350.9, "trescientos cincuenta riales con noventa fils"],
  [asFloat(100), "cien riales con cero fils"],
  [4150.83, "cuatro mil ciento cincuenta riales con ochenta y tres fils"],
];

export const TEST_CASES_TO_CURRENCY_YUM: [Num2WordsInput, string][] = [
  [asFloat(1), "un dinar con cero para"],
  [asFloat(2), "dos dinares con cero para"],
  [asFloat(8), "ocho dinares con cero para"],
  [asFloat(12), "doce dinares con cero para"],
  [asFloat(21), "veintiún dinares con cero para"],
  [81.25, "ochenta y un dinares con veinticinco para"],
  [350.9, "trescientos cincuenta dinares con noventa para"],
  [asFloat(100), "cien dinares con cero para"],
  [4150.83, "cuatro mil ciento cincuenta dinares con ochenta y tres para"],
];

export const TEST_CASES_TO_CURRENCY_ZMW: [Num2WordsInput, string][] = [
  [asFloat(1), "un kwacha con cero ngwee"],
  [asFloat(2), "dos kwachas con cero ngwee"],
  [asFloat(8), "ocho kwachas con cero ngwee"],
  [asFloat(12), "doce kwachas con cero ngwee"],
  [asFloat(21), "veintiún kwachas con cero ngwee"],
  [81.25, "ochenta y un kwachas con veinticinco ngwee"],
  [350.9, "trescientos cincuenta kwachas con noventa ngwee"],
  [asFloat(100), "cien kwachas con cero ngwee"],
  [4150.83, "cuatro mil ciento cincuenta kwachas con ochenta y tres ngwee"],
];

export const TEST_CASES_TO_CURRENCY_ZRZ: [Num2WordsInput, string][] = [
  [asFloat(1), "un zaire con cero makuta"],
  [asFloat(2), "dos zaires con cero makuta"],
  [asFloat(8), "ocho zaires con cero makuta"],
  [asFloat(12), "doce zaires con cero makuta"],
  [asFloat(21), "veintiún zaires con cero makuta"],
  [81.25, "ochenta y un zaires con veinticinco makuta"],
  [350.9, "trescientos cincuenta zaires con noventa makuta"],
  [asFloat(100), "cien zaires con cero makuta"],
  [4150.83, "cuatro mil ciento cincuenta zaires con ochenta y tres makuta"],
];

/** The test methods of a TestCase, by name. */
export type TestMethods = Record<string, () => void>;

/** Register a TestCase's methods as a describe block. */
export function runTestCase(name: string, methods: TestMethods): void {
  describe(name, () => {
    for (const [methodName, method] of Object.entries(methods)) test(methodName, method);
  });
}

export const Num2WordsESTest: TestMethods = {
  test_number() {
    for (const test of TEST_CASES_CARDINAL) {
      expect(num2words(test[0], { lang: "es" })).toBe(test[1]);
    }
  },
  test_ordinal() {
    for (const test of TEST_CASES_ORDINAL) {
      expect(num2words(test[0], { lang: "es", ordinal: true })).toBe(test[1]);
    }
  },
  test_ordinal_num() {
    for (const test of TEST_CASES_ORDINAL_NUM) {
      expect(num2words(test[0], { lang: "es", to: "ordinal_num" })).toBe(test[1]);
    }
  },
  test_currency() {
    for (const test of TEST_CASES_TO_CURRENCY) {
      expect(num2words(test[0], { lang: "es", to: "currency" })).toBe(test[1]);
    }
  },
  test_currency_esp() {
    for (const test of TEST_CASES_TO_CURRENCY_ESP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ESP" })).toBe(test[1]);
    }
  },
  test_currency_usd() {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "USD" })).toBe(test[1]);
    }
  },
  test_currency_pen() {
    for (const test of TEST_CASES_TO_CURRENCY_PEN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "PEN" })).toBe(test[1]);
    }
  },
  test_currency_crc() {
    for (const test of TEST_CASES_TO_CURRENCY_CRC) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "CRC" })).toBe(test[1]);
    }
  },
  test_currency_aud() {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "AUD" })).toBe(test[1]);
    }
  },
  test_currency_cad() {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "CAD" })).toBe(test[1]);
    }
  },
  test_currency_gbp() {
    for (const test of TEST_CASES_TO_CURRENCY_GBP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "GBP" })).toBe(test[1]);
    }
  },
  test_currency_rub() {
    for (const test of TEST_CASES_TO_CURRENCY_RUB) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "RUB" })).toBe(test[1]);
    }
  },
  test_currency_sek() {
    for (const test of TEST_CASES_TO_CURRENCY_SEK) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SEK" })).toBe(test[1]);
    }
  },
  test_currency_nok() {
    for (const test of TEST_CASES_TO_CURRENCY_NOK) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "NOK" })).toBe(test[1]);
    }
  },
  test_currency_pln() {
    for (const test of TEST_CASES_TO_CURRENCY_PLN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "PLN" })).toBe(test[1]);
    }
  },
  test_currency_mxn() {
    for (const test of TEST_CASES_TO_CURRENCY_MXN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MXN" })).toBe(test[1]);
    }
  },
  test_currency_ron() {
    for (const test of TEST_CASES_TO_CURRENCY_RON) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "RON" })).toBe(test[1]);
    }
  },
  test_currency_inr() {
    for (const test of TEST_CASES_TO_CURRENCY_INR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "INR" })).toBe(test[1]);
    }
  },
  test_currency_huf() {
    for (const test of TEST_CASES_TO_CURRENCY_HUF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "HUF" })).toBe(test[1]);
    }
  },
  test_currency_frf() {
    for (const test of TEST_CASES_TO_CURRENCY_FRF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "FRF" })).toBe(test[1]);
    }
  },
  test_currency_cny() {
    for (const test of TEST_CASES_TO_CURRENCY_CNY) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "CNY" })).toBe(test[1]);
    }
  },
  test_currency_czk() {
    for (const test of TEST_CASES_TO_CURRENCY_CZK) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "CZK" })).toBe(test[1]);
    }
  },
  test_currency_nio() {
    for (const test of TEST_CASES_TO_CURRENCY_NIO) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "NIO" })).toBe(test[1]);
    }
  },
  test_currency_ves() {
    for (const test of TEST_CASES_TO_CURRENCY_VES) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "VES" })).toBe(test[1]);
    }
  },
  test_currency_brl() {
    for (const test of TEST_CASES_TO_CURRENCY_BRL) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BRL" })).toBe(test[1]);
    }
  },
  test_currency_chf() {
    for (const test of TEST_CASES_TO_CURRENCY_FRF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "CHF" })).toBe(test[1]);
    }
  },
  test_currency_jpy() {
    for (const test of TEST_CASES_TO_CURRENCY_JPY) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "JPY" })).toBe(test[1]);
    }
  },
  test_currency_krw() {
    for (const test of TEST_CASES_TO_CURRENCY_KRW) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "KRW" })).toBe(test[1]);
    }
  },
  test_currency_kpw() {
    for (const test of TEST_CASES_TO_CURRENCY_KPW) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "KPW" })).toBe(test[1]);
    }
  },
  test_currency_try() {
    for (const test of TEST_CASES_TO_CURRENCY_TRY) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "TRY" })).toBe(test[1]);
    }
  },
  test_currency_zar() {
    for (const test of TEST_CASES_TO_CURRENCY_ZAR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ZAR" })).toBe(test[1]);
    }
  },
  test_currency_kzt() {
    for (const test of TEST_CASES_TO_CURRENCY_KZT) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "KZT" })).toBe(test[1]);
    }
  },
  test_currency_uah() {
    for (const test of TEST_CASES_TO_CURRENCY_UAH) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "UAH" })).toBe(test[1]);
    }
  },
  test_currency_thb() {
    for (const test of TEST_CASES_TO_CURRENCY_THB) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "THB" })).toBe(test[1]);
    }
  },
  test_currency_aed() {
    for (const test of TEST_CASES_TO_CURRENCY_AED) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "AED" })).toBe(test[1]);
    }
  },
  test_currency_afn() {
    for (const test of TEST_CASES_TO_CURRENCY_AFN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "AFN" })).toBe(test[1]);
    }
  },
  test_currency_all() {
    for (const test of TEST_CASES_TO_CURRENCY_ALL) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ALL" })).toBe(test[1]);
    }
  },
  test_currency_amd() {
    for (const test of TEST_CASES_TO_CURRENCY_AMD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "AMD" })).toBe(test[1]);
    }
  },
  test_currency_ang() {
    for (const test of TEST_CASES_TO_CURRENCY_ANG) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ANG" })).toBe(test[1]);
    }
  },
  test_currency_aoa() {
    for (const test of TEST_CASES_TO_CURRENCY_AOA) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "AOA" })).toBe(test[1]);
    }
  },
  test_currency_ars() {
    for (const test of TEST_CASES_TO_CURRENCY_MXN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ARS" })).toBe(test[1]);
    }
  },
  test_currency_awg() {
    for (const test of TEST_CASES_TO_CURRENCY_AWG) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "AWG" })).toBe(test[1]);
    }
  },
  test_currency_azn() {
    for (const test of TEST_CASES_TO_CURRENCY_AZN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "AZN" })).toBe(test[1]);
    }
  },
  test_currency_bbd() {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BBD" })).toBe(test[1]);
    }
  },
  test_currency_bdt() {
    for (const test of TEST_CASES_TO_CURRENCY_BDT) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BDT" })).toBe(test[1]);
    }
  },
  test_currency_bgn() {
    for (const test of TEST_CASES_TO_CURRENCY_BGN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BGN" })).toBe(test[1]);
    }
  },
  test_currency_bhd() {
    for (const test of TEST_CASES_TO_CURRENCY_BHD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BHD" })).toBe(test[1]);
    }
  },
  test_currency_bif() {
    for (const test of TEST_CASES_TO_CURRENCY_FRF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BIF" })).toBe(test[1]);
    }
  },
  test_currency_bmd() {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BMD" })).toBe(test[1]);
    }
  },
  test_currency_bnd() {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BND" })).toBe(test[1]);
    }
  },
  test_currency_bob() {
    for (const test of TEST_CASES_TO_CURRENCY_BOB) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BOB" })).toBe(test[1]);
    }
  },
  test_currency_bsd() {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BSD" })).toBe(test[1]);
    }
  },
  test_currency_btn() {
    for (const test of TEST_CASES_TO_CURRENCY_BTN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BTN" })).toBe(test[1]);
    }
  },
  test_currency_bwp() {
    for (const test of TEST_CASES_TO_CURRENCY_BWP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BWP" })).toBe(test[1]);
    }
  },
  test_currency_byn() {
    for (const test of TEST_CASES_TO_CURRENCY_BYN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BYN" })).toBe(test[1]);
    }
  },
  test_currency_byr() {
    for (const test of TEST_CASES_TO_CURRENCY_BYR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BYR" })).toBe(test[1]);
    }
  },
  test_currency_bzd() {
    for (const test of TEST_CASES_TO_CURRENCY_BZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "BZD" })).toBe(test[1]);
    }
  },
  test_currency_cdf() {
    for (const test of TEST_CASES_TO_CURRENCY_FRF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "CDF" })).toBe(test[1]);
    }
  },
  test_currency_clp() {
    for (const test of TEST_CASES_TO_CURRENCY_MXN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "CLP" })).toBe(test[1]);
    }
  },
  test_currency_cop() {
    for (const test of TEST_CASES_TO_CURRENCY_MXN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "COP" })).toBe(test[1]);
    }
  },
  test_currency_cup() {
    for (const test of TEST_CASES_TO_CURRENCY_MXN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "CUP" })).toBe(test[1]);
    }
  },
  test_currency_cve() {
    for (const test of TEST_CASES_TO_CURRENCY_CVE) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "CVE" })).toBe(test[1]);
    }
  },
  test_currency_cyp() {
    for (const test of TEST_CASES_TO_CURRENCY_CYP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "CYP" })).toBe(test[1]);
    }
  },
  test_currency_djf() {
    for (const test of TEST_CASES_TO_CURRENCY_FRF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "DJF" })).toBe(test[1]);
    }
  },
  test_currency_dkk() {
    for (const test of TEST_CASES_TO_CURRENCY_DKK) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "DKK" })).toBe(test[1]);
    }
  },
  test_currency_dop() {
    for (const test of TEST_CASES_TO_CURRENCY_MXN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "DOP" })).toBe(test[1]);
    }
  },
  test_currency_dzd() {
    for (const test of TEST_CASES_TO_CURRENCY_DZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "DZD" })).toBe(test[1]);
    }
  },
  test_currency_ecs() {
    for (const test of TEST_CASES_TO_CURRENCY_ECS) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ECS" })).toBe(test[1]);
    }
  },
  test_currency_egp() {
    for (const test of TEST_CASES_TO_CURRENCY_EGP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "EGP" })).toBe(test[1]);
    }
  },
  test_currency_ern() {
    for (const test of TEST_CASES_TO_CURRENCY_ERN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ERN" })).toBe(test[1]);
    }
  },
  test_currency_etb() {
    for (const test of TEST_CASES_TO_CURRENCY_ETB) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ETB" })).toBe(test[1]);
    }
  },
  test_currency_fjd() {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "FJD" })).toBe(test[1]);
    }
  },
  test_currency_fkp() {
    for (const test of TEST_CASES_TO_CURRENCY_FKP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "FKP" })).toBe(test[1]);
    }
  },
  test_currency_gel() {
    for (const test of TEST_CASES_TO_CURRENCY_GEL) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "GEL" })).toBe(test[1]);
    }
  },
  test_currency_ghs() {
    for (const test of TEST_CASES_TO_CURRENCY_GHS) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "GHS" })).toBe(test[1]);
    }
  },
  test_currency_gip() {
    for (const test of TEST_CASES_TO_CURRENCY_FKP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "GIP" })).toBe(test[1]);
    }
  },
  test_currency_gmd() {
    for (const test of TEST_CASES_TO_CURRENCY_GMD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "GMD" })).toBe(test[1]);
    }
  },
  test_currency_gnf() {
    for (const test of TEST_CASES_TO_CURRENCY_FRF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "GNF" })).toBe(test[1]);
    }
  },
  test_currency_gtq() {
    for (const test of TEST_CASES_TO_CURRENCY_GTQ) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "GTQ" })).toBe(test[1]);
    }
  },
  test_currency_gyd() {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "GYD" })).toBe(test[1]);
    }
  },
  test_currency_hkd() {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "HKD" })).toBe(test[1]);
    }
  },
  test_currency_hnl() {
    for (const test of TEST_CASES_TO_CURRENCY_HNL) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "HNL" })).toBe(test[1]);
    }
  },
  test_currency_hrk() {
    for (const test of TEST_CASES_TO_CURRENCY_HRK) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "HRK" })).toBe(test[1]);
    }
  },
  test_currency_htg() {
    for (const test of TEST_CASES_TO_CURRENCY_HTG) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "HTG" })).toBe(test[1]);
    }
  },
  test_currency_idr() {
    for (const test of TEST_CASES_TO_CURRENCY_IDR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "IDR" })).toBe(test[1]);
    }
  },
  test_currency_ils() {
    for (const test of TEST_CASES_TO_CURRENCY_ILS) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ILS" })).toBe(test[1]);
    }
  },
  test_currency_iqd() {
    for (const test of TEST_CASES_TO_CURRENCY_IQD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "IQD" })).toBe(test[1]);
    }
  },
  test_currency_irr() {
    for (const test of TEST_CASES_TO_CURRENCY_IRR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "IRR" })).toBe(test[1]);
    }
  },
  test_currency_isk() {
    for (const test of TEST_CASES_TO_CURRENCY_ISK) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ISK" })).toBe(test[1]);
    }
  },
  test_currency_itl() {
    for (const test of TEST_CASES_TO_CURRENCY_ITL) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ITL" })).toBe(test[1]);
    }
  },
  test_currency_jmd() {
    for (const test of TEST_CASES_TO_CURRENCY_BZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "JMD" })).toBe(test[1]);
    }
  },
  test_currency_jod() {
    for (const test of TEST_CASES_TO_CURRENCY_JOD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "JOD" })).toBe(test[1]);
    }
  },
  test_currency_kes() {
    for (const test of TEST_CASES_TO_CURRENCY_KES) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "KES" })).toBe(test[1]);
    }
  },
  test_currency_kgs() {
    for (const test of TEST_CASES_TO_CURRENCY_KGS) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "KGS" })).toBe(test[1]);
    }
  },
  test_currency_khr() {
    for (const test of TEST_CASES_TO_CURRENCY_KHR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "KHR" })).toBe(test[1]);
    }
  },
  test_currency_kmf() {
    for (const test of TEST_CASES_TO_CURRENCY_FRF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "KMF" })).toBe(test[1]);
    }
  },
  test_currency_kwd() {
    for (const test of TEST_CASES_TO_CURRENCY_KWD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "KWD" })).toBe(test[1]);
    }
  },
  test_currency_kyd() {
    for (const test of TEST_CASES_TO_CURRENCY_BZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "KYD" })).toBe(test[1]);
    }
  },
  test_currency_lak() {
    for (const test of TEST_CASES_TO_CURRENCY_LAK) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "LAK" })).toBe(test[1]);
    }
  },
  test_currency_lbp() {
    for (const test of TEST_CASES_TO_CURRENCY_EGP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "LBP" })).toBe(test[1]);
    }
  },
  test_currency_lkr() {
    for (const test of TEST_CASES_TO_CURRENCY_LKR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "LKR" })).toBe(test[1]);
    }
  },
  test_currency_lrd() {
    for (const test of TEST_CASES_TO_CURRENCY_BZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "LRD" })).toBe(test[1]);
    }
  },
  test_currency_lsl() {
    for (const test of TEST_CASES_TO_CURRENCY_LSL) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "LSL" })).toBe(test[1]);
    }
  },
  test_currency_ltl() {
    for (const test of TEST_CASES_TO_CURRENCY_LTL) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "LTL" })).toBe(test[1]);
    }
  },
  test_currency_lvl() {
    for (const test of TEST_CASES_TO_CURRENCY_LVL) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "LVL" })).toBe(test[1]);
    }
  },
  test_currency_lyd() {
    for (const test of TEST_CASES_TO_CURRENCY_LYD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "LYD" })).toBe(test[1]);
    }
  },
  test_currency_mad() {
    for (const test of TEST_CASES_TO_CURRENCY_MAD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MAD" })).toBe(test[1]);
    }
  },
  test_currency_mdl() {
    for (const test of TEST_CASES_TO_CURRENCY_MDL) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MDL" })).toBe(test[1]);
    }
  },
  test_currency_mga() {
    for (const test of TEST_CASES_TO_CURRENCY_MGA) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MGA" })).toBe(test[1]);
    }
  },
  test_currency_mkd() {
    for (const test of TEST_CASES_TO_CURRENCY_MKD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MKD" })).toBe(test[1]);
    }
  },
  test_currency_mmk() {
    for (const test of TEST_CASES_TO_CURRENCY_MMK) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MMK" })).toBe(test[1]);
    }
  },
  test_currency_mnt() {
    for (const test of TEST_CASES_TO_CURRENCY_MNT) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MNT" })).toBe(test[1]);
    }
  },
  test_currency_mop() {
    for (const test of TEST_CASES_TO_CURRENCY_MOP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MOP" })).toBe(test[1]);
    }
  },
  test_currency_mro() {
    for (const test of TEST_CASES_TO_CURRENCY_MRO) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MRO" })).toBe(test[1]);
    }
  },
  test_currency_mru() {
    for (const test of TEST_CASES_TO_CURRENCY_MRU) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MRU" })).toBe(test[1]);
    }
  },
  test_currency_mur() {
    for (const test of TEST_CASES_TO_CURRENCY_MUR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MUR" })).toBe(test[1]);
    }
  },
  test_currency_mvr() {
    for (const test of TEST_CASES_TO_CURRENCY_MVR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MVR" })).toBe(test[1]);
    }
  },
  test_currency_mwk() {
    for (const test of TEST_CASES_TO_CURRENCY_MWK) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MWK" })).toBe(test[1]);
    }
  },
  test_currency_myr() {
    for (const test of TEST_CASES_TO_CURRENCY_MYR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MYR" })).toBe(test[1]);
    }
  },
  test_currency_mzn() {
    for (const test of TEST_CASES_TO_CURRENCY_MZN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "MZN" })).toBe(test[1]);
    }
  },
  test_currency_nad() {
    for (const test of TEST_CASES_TO_CURRENCY_BZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "NAD" })).toBe(test[1]);
    }
  },
  test_currency_ngn() {
    for (const test of TEST_CASES_TO_CURRENCY_NGN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "NGN" })).toBe(test[1]);
    }
  },
  test_currency_npr() {
    for (const test of TEST_CASES_TO_CURRENCY_NPR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "NPR" })).toBe(test[1]);
    }
  },
  test_currency_nzd() {
    for (const test of TEST_CASES_TO_CURRENCY_USD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "NZD" })).toBe(test[1]);
    }
  },
  test_currency_omr() {
    for (const test of TEST_CASES_TO_CURRENCY_OMR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "OMR" })).toBe(test[1]);
    }
  },
  test_currency_pab() {
    for (const test of TEST_CASES_TO_CURRENCY_PAB) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "PAB" })).toBe(test[1]);
    }
  },
  test_currency_pgk() {
    for (const test of TEST_CASES_TO_CURRENCY_PGK) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "PGK" })).toBe(test[1]);
    }
  },
  test_currency_php() {
    for (const test of TEST_CASES_TO_CURRENCY_MXN) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "PHP" })).toBe(test[1]);
    }
  },
  test_currency_pkr() {
    for (const test of TEST_CASES_TO_CURRENCY_PKR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "PKR" })).toBe(test[1]);
    }
  },
  test_currency_plz() {
    for (const test of TEST_CASES_TO_CURRENCY_PLZ) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "PLZ" })).toBe(test[1]);
    }
  },
  test_currency_pyg() {
    for (const test of TEST_CASES_TO_CURRENCY_PYG) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "PYG" })).toBe(test[1]);
    }
  },
  test_currency_qar() {
    for (const test of TEST_CASES_TO_CURRENCY_QAR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "QAR" })).toBe(test[1]);
    }
  },
  test_currency_qtq() {
    for (const test of TEST_CASES_TO_CURRENCY_GTQ) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "GTQ" })).toBe(test[1]);
    }
  },
  test_currency_rsd() {
    for (const test of TEST_CASES_TO_CURRENCY_RSD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "RSD" })).toBe(test[1]);
    }
  },
  test_currency_rur() {
    for (const test of TEST_CASES_TO_CURRENCY_RUR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "RUR" })).toBe(test[1]);
    }
  },
  test_currency_rwf() {
    for (const test of TEST_CASES_TO_CURRENCY_FRF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "RWF" })).toBe(test[1]);
    }
  },
  test_currency_sar() {
    for (const test of TEST_CASES_TO_CURRENCY_SAR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SAR" })).toBe(test[1]);
    }
  },
  test_currency_sbd() {
    for (const test of TEST_CASES_TO_CURRENCY_BZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SBD" })).toBe(test[1]);
    }
  },
  test_currency_scr() {
    for (const test of TEST_CASES_TO_CURRENCY_SCR) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SCR" })).toBe(test[1]);
    }
  },
  test_currency_sdg() {
    for (const test of TEST_CASES_TO_CURRENCY_EGP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SDG" })).toBe(test[1]);
    }
  },
  test_currency_sgd() {
    for (const test of TEST_CASES_TO_CURRENCY_BZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SGD" })).toBe(test[1]);
    }
  },
  test_currency_shp() {
    for (const test of TEST_CASES_TO_CURRENCY_SHP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SHP" })).toBe(test[1]);
    }
  },
  test_currency_skk() {
    for (const test of TEST_CASES_TO_CURRENCY_SKK) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SKK" })).toBe(test[1]);
    }
  },
  test_currency_sll() {
    for (const test of TEST_CASES_TO_CURRENCY_SLL) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SLL" })).toBe(test[1]);
    }
  },
  test_currency_srd() {
    for (const test of TEST_CASES_TO_CURRENCY_BZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SRD" })).toBe(test[1]);
    }
  },
  test_currency_ssp() {
    for (const test of TEST_CASES_TO_CURRENCY_EGP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SSP" })).toBe(test[1]);
    }
  },
  test_currency_std() {
    for (const test of TEST_CASES_TO_CURRENCY_STD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "STD" })).toBe(test[1]);
    }
  },
  test_currency_svc() {
    for (const test of TEST_CASES_TO_CURRENCY_SVC) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SVC" })).toBe(test[1]);
    }
  },
  test_currency_syp() {
    for (const test of TEST_CASES_TO_CURRENCY_EGP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SYP" })).toBe(test[1]);
    }
  },
  test_currency_szl() {
    for (const test of TEST_CASES_TO_CURRENCY_SZL) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "SZL" })).toBe(test[1]);
    }
  },
  test_currency_tjs() {
    for (const test of TEST_CASES_TO_CURRENCY_TJS) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "TJS" })).toBe(test[1]);
    }
  },
  test_currency_tmt() {
    for (const test of TEST_CASES_TO_CURRENCY_TMT) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "TMT" })).toBe(test[1]);
    }
  },
  test_currency_tnd() {
    for (const test of TEST_CASES_TO_CURRENCY_TND) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "TND" })).toBe(test[1]);
    }
  },
  test_currency_top() {
    for (const test of TEST_CASES_TO_CURRENCY_TOP) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "TOP" })).toBe(test[1]);
    }
  },
  test_currency_ttd() {
    for (const test of TEST_CASES_TO_CURRENCY_BZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "TTD" })).toBe(test[1]);
    }
  },
  test_currency_twd() {
    for (const test of TEST_CASES_TO_CURRENCY_TWD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "TWD" })).toBe(test[1]);
    }
  },
  test_currency_tzs() {
    for (const test of TEST_CASES_TO_CURRENCY_TZS) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "TZS" })).toBe(test[1]);
    }
  },
  test_currency_uag() {
    for (const test of TEST_CASES_TO_CURRENCY_UAG) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "UAG" })).toBe(test[1]);
    }
  },
  test_currency_ugx() {
    for (const test of TEST_CASES_TO_CURRENCY_UGX) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "UGX" })).toBe(test[1]);
    }
  },
  test_currency_uyu() {
    for (const test of TEST_CASES_TO_CURRENCY_UYU) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "UYU" })).toBe(test[1]);
    }
  },
  test_currency_uzs() {
    for (const test of TEST_CASES_TO_CURRENCY_UZS) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "UZS" })).toBe(test[1]);
    }
  },
  test_currency_vef() {
    for (const test of TEST_CASES_TO_CURRENCY_VEF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "VEF" })).toBe(test[1]);
    }
  },
  test_currency_vnd() {
    for (const test of TEST_CASES_TO_CURRENCY_VND) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "VND" })).toBe(test[1]);
    }
  },
  test_currency_vuv() {
    for (const test of TEST_CASES_TO_CURRENCY_VUV) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "VUV" })).toBe(test[1]);
    }
  },
  test_currency_wst() {
    for (const test of TEST_CASES_TO_CURRENCY_WST) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "WST" })).toBe(test[1]);
    }
  },
  test_currency_xaf() {
    for (const test of TEST_CASES_TO_CURRENCY_XAF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "XAF" })).toBe(test[1]);
    }
  },
  test_currency_xcd() {
    for (const test of TEST_CASES_TO_CURRENCY_BZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "XCD" })).toBe(test[1]);
    }
  },
  test_currency_xof() {
    for (const test of TEST_CASES_TO_CURRENCY_XAF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "XOF" })).toBe(test[1]);
    }
  },
  test_currency_xpf() {
    for (const test of TEST_CASES_TO_CURRENCY_XPF) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "XPF" })).toBe(test[1]);
    }
  },
  test_currency_yer() {
    for (const test of TEST_CASES_TO_CURRENCY_YER) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "YER" })).toBe(test[1]);
    }
  },
  test_currency_yum() {
    for (const test of TEST_CASES_TO_CURRENCY_YUM) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "YUM" })).toBe(test[1]);
    }
  },
  test_currency_zmw() {
    for (const test of TEST_CASES_TO_CURRENCY_ZMW) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ZMW" })).toBe(test[1]);
    }
  },
  test_currency_zrz() {
    for (const test of TEST_CASES_TO_CURRENCY_ZRZ) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ZRZ" })).toBe(test[1]);
    }
  },
  test_currency_zwl() {
    for (const test of TEST_CASES_TO_CURRENCY_BZD) {
      expect(num2words(test[0], { lang: "es", to: "currency", currency: "ZWL" })).toBe(test[1]);
    }
  },
};
