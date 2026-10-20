// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/__init__.py
//
// The language table of upstream's __init__.py (CONVERTER_CLASSES), in
// upstream order. Generated from upstream; keep it in sync when bumping.

import type { Num2Word_Base } from "./base.ts";
import { Num2Word_AM } from "./lang/AM.ts";
import { Num2Word_AR } from "./lang/AR.ts";
import { Num2Word_AZ } from "./lang/AZ.ts";
import { Num2Word_BE } from "./lang/BE.ts";
import { Num2Word_BN } from "./lang/BN.ts";
import { Num2Word_CA } from "./lang/CA.ts";
import { Num2Word_CE } from "./lang/CE.ts";
import { Num2Word_CS } from "./lang/CS.ts";
import { Num2Word_CY } from "./lang/CY.ts";
import { Num2Word_DA } from "./lang/DA.ts";
import { Num2Word_DE } from "./lang/DE.ts";
import { Num2Word_EN } from "./lang/EN.ts";
import { Num2Word_EN_IN } from "./lang/EN_IN.ts";
import { Num2Word_EN_NG } from "./lang/EN_NG.ts";
import { Num2Word_EO } from "./lang/EO.ts";
import { Num2Word_ES } from "./lang/ES.ts";
import { Num2Word_ES_CO } from "./lang/ES_CO.ts";
import { Num2Word_ES_CR } from "./lang/ES_CR.ts";
import { Num2Word_ES_GT } from "./lang/ES_GT.ts";
import { Num2Word_ES_NI } from "./lang/ES_NI.ts";
import { Num2Word_ES_VE } from "./lang/ES_VE.ts";
import { Num2Word_FA } from "./lang/FA.ts";
import { Num2Word_FI } from "./lang/FI.ts";
import { Num2Word_FR } from "./lang/FR.ts";
import { Num2Word_FR_BE } from "./lang/FR_BE.ts";
import { Num2Word_FR_CH } from "./lang/FR_CH.ts";
import { Num2Word_FR_DZ } from "./lang/FR_DZ.ts";
import { Num2Word_HE } from "./lang/HE.ts";
import { Num2Word_HU } from "./lang/HU.ts";
import { Num2Word_ID } from "./lang/ID.ts";
import { Num2Word_IS } from "./lang/IS.ts";
import { Num2Word_IT } from "./lang/IT.ts";
import { Num2Word_JA } from "./lang/JA.ts";
import { Num2Word_KN } from "./lang/KN.ts";
import { Num2Word_KO } from "./lang/KO.ts";
import { Num2Word_KZ } from "./lang/KZ.ts";
import { Num2Word_LT } from "./lang/LT.ts";
import { Num2Word_LV } from "./lang/LV.ts";
import { Num2Word_NL } from "./lang/NL.ts";
import { Num2Word_NO } from "./lang/NO.ts";
import { Num2Word_PL } from "./lang/PL.ts";
import { Num2Word_PT } from "./lang/PT.ts";
import { Num2Word_PT_BR } from "./lang/PT_BR.ts";
import { Num2Word_RO } from "./lang/RO.ts";
import { Num2Word_RU } from "./lang/RU.ts";
import { Num2Word_SK } from "./lang/SK.ts";
import { Num2Word_SL } from "./lang/SL.ts";
import { Num2Word_SR } from "./lang/SR.ts";
import { Num2Word_SV } from "./lang/SV.ts";
import { Num2Word_TE } from "./lang/TE.ts";
import { Num2Word_TET } from "./lang/TET.ts";
import { Num2Word_TG } from "./lang/TG.ts";
import { Num2Word_TH } from "./lang/TH.ts";
import { Num2Word_TR } from "./lang/TR.ts";
import { Num2Word_UK } from "./lang/UK.ts";
import { Num2Word_VI } from "./lang/VI.ts";

/** Converters by language code, like upstream's CONVERTER_CLASSES. */
export const CONVERTER_CLASSES: Record<string, Num2Word_Base> = {
  am: new Num2Word_AM(),
  ar: new Num2Word_AR(),
  az: new Num2Word_AZ(),
  be: new Num2Word_BE(),
  bn: new Num2Word_BN(),
  ca: new Num2Word_CA(),
  ce: new Num2Word_CE(),
  cs: new Num2Word_CS(),
  cy: new Num2Word_CY(),
  en: new Num2Word_EN(),
  en_IN: new Num2Word_EN_IN(),
  en_NG: new Num2Word_EN_NG(),
  fa: new Num2Word_FA(),
  fr: new Num2Word_FR(),
  fr_CH: new Num2Word_FR_CH(),
  fr_BE: new Num2Word_FR_BE(),
  fr_DZ: new Num2Word_FR_DZ(),
  de: new Num2Word_DE(),
  fi: new Num2Word_FI(),
  eo: new Num2Word_EO(),
  es: new Num2Word_ES(),
  es_CO: new Num2Word_ES_CO(),
  es_CR: new Num2Word_ES_CR(),
  es_GT: new Num2Word_ES_GT(),
  es_NI: new Num2Word_ES_NI(),
  es_VE: new Num2Word_ES_VE(),
  id: new Num2Word_ID(),
  ja: new Num2Word_JA(),
  kn: new Num2Word_KN(),
  ko: new Num2Word_KO(),
  kz: new Num2Word_KZ(),
  lt: new Num2Word_LT(),
  lv: new Num2Word_LV(),
  pl: new Num2Word_PL(),
  ro: new Num2Word_RO(),
  ru: new Num2Word_RU(),
  sk: new Num2Word_SK(),
  sl: new Num2Word_SL(),
  sr: new Num2Word_SR(),
  sv: new Num2Word_SV(),
  no: new Num2Word_NO(),
  da: new Num2Word_DA(),
  pt: new Num2Word_PT(),
  pt_BR: new Num2Word_PT_BR(),
  he: new Num2Word_HE(),
  it: new Num2Word_IT(),
  vi: new Num2Word_VI(),
  tg: new Num2Word_TG(),
  th: new Num2Word_TH(),
  tr: new Num2Word_TR(),
  nl: new Num2Word_NL(),
  uk: new Num2Word_UK(),
  te: new Num2Word_TE(),
  tet: new Num2Word_TET(),
  hu: new Num2Word_HU(),
  is: new Num2Word_IS(),
};
