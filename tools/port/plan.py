# Copyright (c) 2026, num2words-ts contributors
# SPDX-License-Identifier: LGPL-2.1-or-later
"""Pack the languages still to port (and their upstream tests) into work units.

A language is pending while src/lang/XX.ts still has the STUB flag; a test
file is pending while its TS port does not exist. Language families
(es -> es_CO, ...) stay in one unit. Prints JSON.

Usage: python3 -I tools/port/plan.py [--max-lines 2600]
"""

import ast
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UP = os.path.join(ROOT, ".upstream", "num2words")
max_lines = int(sys.argv[sys.argv.index("--max-lines") + 1]) if "--max-lines" in sys.argv else 2600


def lines(path):
    with open(path, encoding="utf-8") as f:
        return sum(1 for _ in f)


def lang_deps(mod):
    tree = ast.parse(open(os.path.join(UP, "num2words", f"lang_{mod}.py"), encoding="utf-8").read())
    deps = set()
    for n in ast.walk(tree):
        if isinstance(n, ast.ImportFrom):
            for name in [n.module or ""] + [a.name for a in n.names]:
                if name.startswith("lang_"):
                    deps.add(name[5:])
    return deps - {mod}


langs = sorted(f[5:-3] for f in os.listdir(os.path.join(UP, "num2words")) if f.startswith("lang_"))
pending = [m for m in langs if "static STUB = true" in open(os.path.join(ROOT, "src", "lang", f"{m}.ts")).read()]

# Test files: test_<code>.py -> language module; others are "core" tests.
tests = {}
for f in sorted(os.listdir(os.path.join(UP, "tests"))):
    if not (f.startswith("test_") and f.endswith(".py")):
        continue
    ts = f"test/{f[:-3]}.test.ts"
    if os.path.exists(os.path.join(ROOT, ts)):
        continue
    code = f[5:-3]
    mod = code.upper() if code.upper() in langs else ("PT_BR" if code == "pt_BR" else None)
    tests.setdefault(mod or "_core", []).append({"upstream": f"tests/{f}", "ts": ts, "lines": lines(os.path.join(UP, "tests", f))})

# Families: a pending language goes with the pending languages it depends on.
root_of = {}
for m in pending:
    r = m
    while True:
        parents = [d for d in lang_deps(r) if d in pending]
        if not parents:
            break
        r = parents[0]
    root_of[m] = r
families = {}
for m in pending:
    families.setdefault(root_of[m], []).append(m)

INIT = open(os.path.join(UP, "num2words", "__init__.py"), encoding="utf-8").read()
CODES = {}
for code, mod, cls in re.findall(r"'(\w+)': lang_(\w+)\.(\w+)\(\)", INIT):
    CODES.setdefault(mod, []).append({"code": code, "class": cls})


def item(mod):
    up = f"num2words/lang_{mod}.py"
    return {"module": mod, "upstream": up, "ts": f"src/lang/{mod}.ts", "lines": lines(os.path.join(UP, up)),
            "codes": [c["code"] for c in CODES.get(mod, [])], "classes": sorted({c["class"] for c in CODES.get(mod, [])})}

groups = []
for root, mods in sorted(families.items()):
    mods = sorted(mods, key=lambda m: (m != root, m))
    langs_ = [item(m) for m in mods]
    ts = [t for m in mods for t in tests.pop(m, [])]
    groups.append({"languages": langs_, "tests": ts, "lines": sum(x["lines"] for x in langs_ + ts)})
# Tests of languages already ported, and core tests.
leftover = [t for k in list(tests) for t in tests.pop(k)]
if leftover:
    groups.append({"languages": [], "tests": leftover, "lines": sum(t["lines"] for t in leftover)})

# Pack small groups together; big ones stand alone.
units, cur = [], None
for g in sorted(groups, key=lambda g: -g["lines"]):
    if g["lines"] >= max_lines or not g["languages"]:
        units.append(g)
        continue
    if cur and cur["lines"] + g["lines"] <= max_lines:
        cur["languages"] += g["languages"]
        cur["tests"] += g["tests"]
        cur["lines"] += g["lines"]
    else:
        cur = dict(g)
        units.append(cur)
for i, u in enumerate(units):
    u["id"] = f"u{i + 1:02d}"
print(json.dumps(units))
