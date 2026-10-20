// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_es.py
//
// The test data and methods live in test_es_cases.ts so the regional Spanish
// test files can reuse them (upstream subclasses Num2WordsESTest) without
// registering this suite a second time.

import { Num2WordsESTest, runTestCase } from "./test_es_cases.ts";

runTestCase("Num2WordsESTest", Num2WordsESTest);
