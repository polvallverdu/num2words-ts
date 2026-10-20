// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// The slice of Python's numeric semantics num2words relies on, so ported code
// produces the same words as upstream for the same inputs.
//
// Type mapping used throughout the port:
//   Python int     -> bigint   (arbitrary precision, like Python)
//   Python float   -> number   (inside the library a `number` is ALWAYS a float)
//   Python Decimal -> Decimal  (below)
// So `isinstance(x, int)` is `typeof x === "bigint"`, `isinstance(x, float)` is
// `typeof x === "number"`.

export type PyNum = bigint | number | Decimal;

//
// Exceptions upstream raises (JavaScript already has TypeError).
//

export class NotImplementedError extends Error {
  override name = "NotImplementedError";
}

export class OverflowError extends Error {
  override name = "OverflowError";
}

export class ValueError extends Error {
  override name = "ValueError";
}

export class KeyError extends Error {
  override name = "KeyError";
}

export class IndexError extends Error {
  override name = "IndexError";
}

export class ZeroDivisionError extends Error {
  override name = "ZeroDivisionError";
}

export class AttributeError extends Error {
  override name = "AttributeError";
}

/** Python `d[key]` on a dict: throws KeyError when missing. */
export function getItem<V>(d: Readonly<Record<string, V>>, key: string): V {
  if (!Object.hasOwn(d, key)) throw new KeyError(key);
  return d[key] as V;
}

/** Python `seq[i]` with negative indices; throws IndexError when out of range. */
export function at<T>(seq: readonly T[] | string, i: number): T {
  const n = seq.length;
  const j = i < 0 ? n + i : i;
  if (j < 0 || j >= n) throw new IndexError("list index out of range");
  return seq[j] as T;
}

//
// Decimal
//

export const ROUND_HALF_UP = "ROUND_HALF_UP";
export const ROUND_HALF_EVEN = "ROUND_HALF_EVEN";
export const ROUND_DOWN = "ROUND_DOWN";
export type Rounding = typeof ROUND_HALF_UP | typeof ROUND_HALF_EVEN | typeof ROUND_DOWN;

const DECIMAL_RE = /^\s*([+-])?(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:[eE]([+-]?\d+))?\s*$/;

function bigAbs(n: bigint): bigint {
  return n < 0n ? -n : n;
}

/**
 * A finite decimal number: `coefficient * 10 ** exponent`, keeping the exponent
 * the way Python's Decimal does (`Decimal("1.50")` has exponent -2). Only the
 * operations num2words uses are implemented.
 */
export class Decimal {
  /** Signed integer coefficient. */
  readonly coefficient: bigint;
  /** Power of ten. */
  readonly exponent: number;
  /** Sign of zero, so -0 round-trips like Python's. */
  readonly negative: boolean;

  constructor(value: string | number | bigint | Decimal) {
    if (value instanceof Decimal) {
      this.coefficient = value.coefficient;
      this.exponent = value.exponent;
      this.negative = value.negative;
      return;
    }
    if (typeof value === "bigint") {
      this.coefficient = value;
      this.exponent = 0;
      this.negative = value < 0n;
      return;
    }
    if (typeof value === "number") {
      // Python's Decimal(float) is the exact value of the binary double.
      const [coefficient, exponent] = exactDecimalOfDouble(value);
      this.coefficient = coefficient;
      this.exponent = exponent;
      this.negative = value < 0 || Object.is(value, -0);
      return;
    }
    const m = DECIMAL_RE.exec(value);
    if (!m) throw new InvalidOperation(`[<class 'decimal.ConversionSyntax'>]`);
    const [, sign, intPart, fracPart, onlyFrac, exp] = m;
    const digits = onlyFrac !== undefined ? onlyFrac : `${intPart}${fracPart ?? ""}`;
    const fracLen = onlyFrac !== undefined ? onlyFrac.length : (fracPart ?? "").length;
    const magnitude = BigInt(digits);
    this.negative = sign === "-";
    this.coefficient = this.negative ? -magnitude : magnitude;
    this.exponent = Number(exp ?? 0) - fracLen;
  }

  static of(coefficient: bigint, exponent: number, negative = coefficient < 0n): Decimal {
    const d = Object.create(Decimal.prototype) as { -readonly [K in keyof Decimal]: Decimal[K] };
    d.coefficient = coefficient;
    d.exponent = exponent;
    d.negative = negative;
    return d as Decimal;
  }

  /** `as_tuple()`: sign, digits, exponent. */
  asTuple(): { sign: 0 | 1; digits: number[]; exponent: number } {
    return {
      sign: this.negative ? 1 : 0,
      digits: bigAbs(this.coefficient).toString().split("").map(Number),
      exponent: this.exponent,
    };
  }

  isZero(): boolean {
    return this.coefficient === 0n;
  }

  abs(): Decimal {
    return Decimal.of(bigAbs(this.coefficient), this.exponent, false);
  }

  neg(): Decimal {
    return Decimal.of(-this.coefficient, this.exponent, !this.negative);
  }

  /** Compare with another number: -1, 0 or 1. */
  compare(other: PyNum): number {
    const o = toDecimalExact(other);
    const e = Math.min(this.exponent, o.exponent);
    const a = this.coefficient * 10n ** BigInt(this.exponent - e);
    const b = o.coefficient * 10n ** BigInt(o.exponent - e);
    return a < b ? -1 : a > b ? 1 : 0;
  }

  add(other: PyNum): Decimal {
    const o = toDecimalExact(other);
    const e = Math.min(this.exponent, o.exponent);
    return Decimal.of(
      this.coefficient * 10n ** BigInt(this.exponent - e) +
        o.coefficient * 10n ** BigInt(o.exponent - e),
      e,
    );
  }

  sub(other: PyNum): Decimal {
    return this.add(toDecimalExact(other).neg());
  }

  mul(other: PyNum): Decimal {
    const o = toDecimalExact(other);
    return Decimal.of(this.coefficient * o.coefficient, this.exponent + o.exponent);
  }

  /** Integer part, truncated toward zero (`int(d)`). */
  toBigInt(): bigint {
    if (this.exponent >= 0) return this.coefficient * 10n ** BigInt(this.exponent);
    return this.coefficient / 10n ** BigInt(-this.exponent);
  }

  /** `divmod(d, n)` for Decimal: quotient truncated toward zero, like Python's Decimal. */
  divmod(divisor: bigint): [Decimal, Decimal] {
    const scale = 10n ** BigInt(Math.max(0, -this.exponent));
    const scaled =
      this.exponent >= 0 ? this.coefficient * 10n ** BigInt(this.exponent) : this.coefficient;
    const q = scaled / (divisor * scale);
    const r = this.sub(Decimal.of(q * divisor, 0));
    return [Decimal.of(q, 0), r];
  }

  /** `quantize(Decimal(exp), rounding)`. */
  quantize(exp: Decimal | string, rounding: Rounding = ROUND_HALF_EVEN): Decimal {
    const target = (typeof exp === "string" ? new Decimal(exp) : exp).exponent;
    if (target <= this.exponent) {
      return Decimal.of(
        this.coefficient * 10n ** BigInt(this.exponent - target),
        target,
        this.negative,
      );
    }
    const div = 10n ** BigInt(target - this.exponent);
    const mag = bigAbs(this.coefficient);
    let q = mag / div;
    const rem = mag % div;
    const twice = rem * 2n;
    if (rounding === ROUND_HALF_UP) {
      if (twice >= div) q += 1n;
    } else if (rounding === ROUND_HALF_EVEN) {
      if (twice > div || (twice === div && q % 2n === 1n)) q += 1n;
    }
    return Decimal.of(this.negative ? -q : q, target, this.negative);
  }

  toNumber(): number {
    return Number(this.toString());
  }

  /** Python's `str(Decimal)` (to-scientific-string). */
  toString(): string {
    const digits = bigAbs(this.coefficient).toString();
    const sign = this.negative ? "-" : "";
    const adjusted = this.exponent + digits.length - 1;
    if (this.exponent <= 0 && adjusted >= -6) {
      if (this.exponent === 0) return sign + digits;
      const point = digits.length + this.exponent;
      if (point > 0) return `${sign}${digits.slice(0, point)}.${digits.slice(point)}`;
      return `${sign}0.${"0".repeat(-point)}${digits}`;
    }
    const mantissa = digits.length > 1 ? `${digits[0]}.${digits.slice(1)}` : digits;
    return `${sign}${mantissa}E${adjusted >= 0 ? "+" : ""}${adjusted}`;
  }
}

export class InvalidOperation extends Error {
  override name = "InvalidOperation";
}

/** Exact decimal expansion of a double: [coefficient, exponent]. */
function exactDecimalOfDouble(x: number): [bigint, number] {
  if (!Number.isFinite(x)) throw new ValueError(`cannot convert ${x} to Decimal`);
  if (x === 0) return [0n, 0];
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, x);
  const hi = view.getUint32(0);
  const lo = view.getUint32(4);
  const sign = hi >>> 31 ? -1n : 1n;
  const biased = (hi >>> 20) & 0x7ff;
  let mantissa = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
  let exp2: number;
  if (biased === 0) {
    exp2 = -1074;
  } else {
    mantissa |= 1n << 52n;
    exp2 = biased - 1075;
  }
  while (mantissa % 2n === 0n && exp2 < 0) {
    mantissa /= 2n;
    exp2 += 1;
  }
  if (exp2 >= 0) return [sign * mantissa * 2n ** BigInt(exp2), 0];
  // m / 2^k == m * 5^k / 10^k
  return [sign * mantissa * 5n ** BigInt(-exp2), exp2];
}

/** Any PyNum as an exact Decimal (floats by their exact binary value). */
export function toDecimalExact(x: PyNum): Decimal {
  return x instanceof Decimal ? x : new Decimal(x);
}

//
// Python float repr / str
//

/** Python's `repr(float)` / `str(float)` (shortest round-trip, Python's notation). */
export function floatRepr(x: number): string {
  if (Number.isNaN(x)) return "nan";
  if (x === Number.POSITIVE_INFINITY) return "inf";
  if (x === Number.NEGATIVE_INFINITY) return "-inf";
  if (x === 0) return Object.is(x, -0) ? "-0.0" : "0.0";
  const [mant, expStr] = Math.abs(x).toExponential().split("e") as [string, string];
  const digits = mant.replace(".", "");
  const exp = Number(expStr);
  const sign = x < 0 ? "-" : "";
  if (exp < -4 || exp >= 16) {
    const m = digits.length > 1 ? `${digits[0]}.${digits.slice(1)}` : digits;
    const e = Math.abs(exp).toString().padStart(2, "0");
    return `${sign}${m}e${exp < 0 ? "-" : "+"}${e}`;
  }
  if (exp >= digits.length - 1) {
    return `${sign}${digits}${"0".repeat(exp - digits.length + 1)}.0`;
  }
  if (exp >= 0) {
    return `${sign}${digits.slice(0, exp + 1)}.${digits.slice(exp + 1)}`;
  }
  return `${sign}0.${"0".repeat(-exp - 1)}${digits}`;
}

/** Python's `str(x)` for numbers and strings. */
export function str(x: unknown): string {
  if (typeof x === "number") return floatRepr(x);
  if (typeof x === "bigint") return x.toString();
  if (typeof x === "boolean") return x ? "True" : "False";
  if (x === null || x === undefined) return "None";
  return String(x);
}

//
// Conversions and arithmetic with Python semantics
//

/** Python `int(x)`: truncates floats and Decimals toward zero; parses strings. */
export function int(x: PyNum | string): bigint {
  if (typeof x === "bigint") return x;
  if (typeof x === "number") {
    if (!Number.isFinite(x)) {
      throw Number.isNaN(x)
        ? new ValueError("cannot convert float NaN to integer")
        : new OverflowError("cannot convert float infinity to integer");
    }
    return BigInt(Math.trunc(x));
  }
  if (x instanceof Decimal) return x.toBigInt();
  const s = x.trim();
  if (!/^[+-]?\d+$/.test(s)) {
    throw new ValueError(`invalid literal for int() with base 10: '${x}'`);
  }
  return BigInt(s);
}

/** Python `float(x)`. */
export function float(x: PyNum | string): number {
  if (typeof x === "number") return x;
  if (typeof x === "bigint") return Number(x);
  if (x instanceof Decimal) return x.toNumber();
  const n = Number(x.trim());
  if (x.trim() === "" || Number.isNaN(n)) {
    throw new ValueError(`could not convert string to float: '${x}'`);
  }
  return n;
}

/** Python `abs(x)`. */
export function abs<T extends PyNum>(x: T): T {
  if (typeof x === "bigint") return (x < 0n ? -x : x) as T;
  if (typeof x === "number") return Math.abs(x) as T;
  return (x as Decimal).abs() as T;
}

/** Python `a // b` for ints (floors toward negative infinity). */
export function floordiv(a: bigint, b: bigint): bigint {
  const q = a / b;
  return a % b !== 0n && a < 0n !== b < 0n ? q - 1n : q;
}

/** Python `a % b` for ints (result has the sign of `b`). */
export function mod(a: bigint, b: bigint): bigint {
  const r = a % b;
  return r !== 0n && r < 0n !== b < 0n ? r + b : r;
}

/** Python `divmod(a, b)` for ints. */
export function divmod(a: bigint, b: bigint): [bigint, bigint] {
  return [floordiv(a, b), mod(a, b)];
}

/** Python `round(x)` with no ndigits: round half to even, returning an int. */
export function round(x: number): bigint {
  const f = Math.floor(x);
  const diff = x - f;
  if (diff > 0.5) return BigInt(f) + 1n;
  if (diff < 0.5) return BigInt(f);
  return BigInt(f) % 2n === 0n ? BigInt(f) : BigInt(f) + 1n;
}

/** Python `round(x, ndigits)` for floats (correctly rounded, like CPython). */
export function roundTo(x: number, ndigits: number): number {
  const d = new Decimal(x).quantize(Decimal.of(1n, -ndigits), ROUND_HALF_EVEN);
  return d.toNumber();
}

/** Compare two Python numbers of any type: -1, 0 or 1 (exact, like Python). */
export function cmp(a: PyNum, b: PyNum): number {
  if (typeof a === "bigint" && typeof b === "bigint") return a < b ? -1 : a > b ? 1 : 0;
  if (typeof a === "number" && typeof b === "number") return a < b ? -1 : a > b ? 1 : 0;
  if (typeof a === "number" && Number.isNaN(a)) return Number.NaN;
  if (typeof b === "number" && Number.isNaN(b)) return Number.NaN;
  return toDecimalExact(a).compare(b);
}

/** Python `a == b` across int, float and Decimal. */
export function eq(a: PyNum, b: PyNum): boolean {
  return cmp(a, b) === 0;
}

/** Whether `x` has an integral value (`int(x) == x`), for any number type. */
export function isIntegral(x: PyNum): boolean {
  if (typeof x === "bigint") return true;
  if (typeof x === "number") return Number.isFinite(x) && Number.isInteger(x);
  return eq(x.toBigInt(), x);
}

/** Python's `"%0Nd" % n`. */
export function zeroPad(n: bigint | number, width: number): string {
  const v = typeof n === "number" ? BigInt(Math.trunc(n)) : n;
  const s = (v < 0n ? -v : v).toString().padStart(width - (v < 0n ? 1 : 0), "0");
  return v < 0n ? `-${s}` : s;
}

/** `zip(a, b)`: stops at the shorter one. */
export function zip<A, B>(a: readonly A[], b: readonly B[]): [A, B][] {
  const n = Math.min(a.length, b.length);
  const out: [A, B][] = [];
  for (let i = 0; i < n; i++) out.push([a[i] as A, b[i] as B]);
  return out;
}

/** `range(start, stop, step)` as bigints or numbers. */
export function range(start: number, stop?: number, step = 1): number[] {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }
  const out: number[] = [];
  if (step > 0) for (let i = start; i < stop; i += step) out.push(i);
  else for (let i = start; i > stop; i += step) out.push(i);
  return out;
}
