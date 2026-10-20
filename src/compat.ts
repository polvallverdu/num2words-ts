// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: num2words/compat.py

import { str } from "./py.ts";

/** Python 2/3 string compatibility: `to_s(val)` is `str(val)`. */
export function toS(val: unknown): string {
  return str(val);
}
