// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Converters are shared singletons, as upstream. A call that raises must not
// change what later calls return. Upstream leaks state here (RO, PT); the port
// restores it (see the DIVERGENCE notes in those files).

import { describe, expect, test } from "bun:test";
import { num2words } from "../src/index.ts";

function afterFailure(fail: () => unknown): void {
  expect(fail).toThrow();
}

describe("state is restored after a failing call", () => {
  test("ro: unknown currency does not change ordinals", () => {
    const before = num2words(130, { lang: "ro", to: "ordinal" });
    afterFailure(() => num2words(1, { lang: "ro", to: "currency", currency: "XXX" }));
    expect(num2words(130, { lang: "ro", to: "ordinal" })).toBe(before);
    expect(before).toBe("al o sută treizecilea");
  });

  test("pt: unknown currency does not change negword", () => {
    const before = num2words(-5, { lang: "pt", to: "currency", currency: "EUR" });
    afterFailure(() => num2words(-5, { lang: "pt", to: "currency", currency: "XXX" }));
    expect(num2words(-5, { lang: "pt", to: "currency", currency: "EUR" })).toBe(before);
  });
});
