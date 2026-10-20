# Copyright (c) 2026, num2words-ts contributors
# SPDX-License-Identifier: LGPL-2.1-or-later
"""Generate parity fixtures by running upstream Python num2words.

For every language and conversion type, run a deterministic corpus of inputs
through the pinned upstream checkout (.upstream/num2words) and record the
output, or the exception class it raised. test/parity.test.ts replays every
case against the TypeScript port and requires identical results.

Usage: python3 -I tools/gen_fixtures.py
"""

import json
import os
import random
import signal
import sys
from decimal import Decimal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, ".upstream", "num2words"))

import num2words  # noqa: E402

OUT = os.path.join(ROOT, "test", "fixtures")

rng = random.Random(20260)


def ints():
    base = list(range(0, 130)) + [
        150, 199, 200, 201, 250, 999, 1000, 1001, 1010, 1100, 1999, 2000, 2001,
        2020, 2026, 9999, 10000, 10001, 12345, 99999, 100000, 100001, 123456,
        999999, 1000000, 1000001, 1234567, 10**7, 10**8, 10**9, 10**9 + 1,
        123456789, 10**12, 10**15, 10**18, 10**21, 10**24, 10**27, 10**30,
        10**33, 10**36, 2**53, 2**53 + 1, 2**64, 10**100,
    ]
    for digits in range(2, 40):
        base.append(rng.randrange(10 ** (digits - 1), 10 ** digits))
    negatives = [-1, -2, -10, -21, -100, -101, -1000, -1234567, -(10**15) - 7]
    return base + negatives


def floats():
    out = [0.5, 1.5, 0.1, 0.01, 0.001, 1.25, 2.5, 3.14, 3.14159, 10.01, 12.5,
           99.99, 100.5, 0.1 + 0.2, 1.239999999, 1.005, 2.675, 1234.56, -1.5,
           -0.25, 1e-5, 1.0, 2.0, 100.0, 1e16, 1e21, 123.456, 0.999]
    for _ in range(40):
        out.append(round(rng.uniform(-1000, 10000), rng.choice([1, 2, 3])))
    return out


def decimals():
    return ["1.5", "0.50", "12.345", "100", "1e3", "-3.75", "0.001", "1234567.89"]


def years():
    return [1, 9, 10, 99, 100, 101, 999, 1000, 1001, 1066, 1100, 1492, 1776,
            1800, 1900, 1901, 1905, 1999, 2000, 2001, 2005, 2010, 2017, 2020,
            2099, 2100, 9999, 10000, 12345, -1, -44, -500, -2000]


def currency_values():
    return [0, 1, 2, 99, 100, 101, 150, 1000, 123456, -100, -1, 0.0, 0.01, 0.5,
            1.0, 1.01, 1.5, 2.0, 10.25, 21.21, 100.0, 1234.56, 1000000.0, -1.5,
            -0.01, 0.005, 1.005, Decimal("1.00"), Decimal("12.34"), Decimal("150.5"),
            Decimal("0.25"), Decimal("1000000.01"), Decimal("-7.5"), "3.50", "1234.5"]


def encode(v):
    if isinstance(v, bool):
        raise TypeError(v)
    if isinstance(v, int):
        return {"kind": "int", "value": str(v)}
    if isinstance(v, float):
        return {"kind": "float", "value": repr(v)}
    if isinstance(v, Decimal):
        return {"kind": "decimal", "value": str(v)}
    if isinstance(v, str):
        return {"kind": "str", "value": v}
    raise TypeError(v)


class CaseTimeout(Exception):
    pass


def _on_alarm(signum, frame):
    raise CaseTimeout()


signal.signal(signal.SIGALRM, _on_alarm)
TIMEOUT_SECS = 0.5


def run(lang, value, to, kwargs):
    entry = {"input": encode(value), "to": to, "kwargs": kwargs}
    signal.setitimer(signal.ITIMER_REAL, TIMEOUT_SECS)
    try:
        out = num2words.num2words(value, lang=lang, to=to, **kwargs)
        # Non-str results (Base.to_ordinal_num returns the int itself, VI can
        # return None) are recorded as str(out): lossless for big ints, and
        # what the port's num2words() returns.
        entry["out"] = out if isinstance(out, str) else str(out)
    except CaseTimeout:
        # Upstream takes pathologically long (or never finishes) on this input;
        # the port is not asked to reproduce that.
        entry["skip"] = "upstream timeout"
    except Exception as e:  # noqa: BLE001 - recording whatever upstream raises
        entry["error"] = type(e).__name__
    finally:
        signal.setitimer(signal.ITIMER_REAL, 0)
    return entry


def main():
    os.makedirs(OUT, exist_ok=True)
    langs = sorted(num2words.CONVERTER_CLASSES)
    index = {}
    for lang in langs:
        conv = num2words.CONVERTER_CLASSES[lang]
        cases = []
        for v in ints():
            for to in ("cardinal", "ordinal", "ordinal_num"):
                cases.append(run(lang, v, to, {}))
        for v in floats():
            cases.append(run(lang, v, "cardinal", {}))
            cases.append(run(lang, v, "ordinal", {}))
        for v in decimals():
            cases.append(run(lang, v, "cardinal", {}))
        for v in years():
            cases.append(run(lang, v, "year", {}))
        # Default options too: some converters' to_currency takes no `currency`
        # argument at all, so only these cases exercise their currency path.
        for v in currency_values():
            cases.append(run(lang, v, "currency", {}))
        for v in currency_values():
            cases.append(run(lang, v, "currency", {"longval": False}))
        codes = sorted(getattr(conv, "CURRENCY_FORMS", {}) or {})[:6] or ["EUR"]
        for code in codes:
            for v in currency_values():
                cases.append(run(lang, v, "currency", {"currency": code}))
            for v in (1, 150, 1.5, 21.21):
                cases.append(run(lang, v, "currency", {"currency": code, "cents": False}))
                cases.append(run(lang, v, "currency", {"currency": code, "adjective": True}))
                cases.append(run(lang, v, "currency", {"currency": code, "separator": " and"}))
        with open(os.path.join(OUT, f"{lang}.json"), "w", encoding="utf-8") as f:
            json.dump(cases, f, ensure_ascii=False, separators=(",", ":"))
        index[lang] = {"class": type(conv).__name__, "cases": len(cases),
                       "skipped": sum(1 for c in cases if "skip" in c)}
        print(f"{lang}: {len(cases)} cases", flush=True)
    with open(os.path.join(OUT, "index.json"), "w", encoding="utf-8") as f:
        json.dump({"upstream": num2words_version(), "languages": index}, f, indent=2)
    total = sum(v["cases"] for v in index.values())
    print(f"{len(langs)} languages, {total} cases -> {os.path.relpath(OUT, ROOT)}")


def num2words_version():
    # bin/num2words still says 0.5.13 at tag v0.5.14; the pin is authoritative.
    with open(os.path.join(ROOT, "upstream.json")) as f:
        return json.load(f)["tag"]


if __name__ == "__main__":
    main()
