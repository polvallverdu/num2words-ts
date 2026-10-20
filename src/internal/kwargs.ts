// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Per-method keyword-argument check for converters. `num2words()` validates options centrally
// (src/kwargs.ts), but a converter method called directly must still reject keyword arguments
// its Python signature does not take, as Python does. Not part of the public API.

/**
 * Python raises TypeError for a keyword argument the method `fn` does not take: throws
 * `<fn>() got an unexpected keyword argument '<key>'` for the first key of `options` not in
 * `allowed`. `options === undefined` (no options passed) is accepted.
 */
export function checkKwargs(
  options: object | undefined,
  allowed: readonly string[],
  fn: string,
): void {
  if (options === undefined) return;
  for (const key of Object.keys(options)) {
    if (!allowed.includes(key)) {
      throw new TypeError(`${fn}() got an unexpected keyword argument '${key}'`);
    }
  }
}
