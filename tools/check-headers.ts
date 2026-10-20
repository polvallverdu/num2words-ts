// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Every source file carries the LGPL SPDX line. A file ported from num2words
// (a "Ported from num2words" line naming its path) must keep every copyright line of that
// upstream file, verbatim (LGPL-2.1 §1).

import { Glob } from "bun";

const OURS = "// Copyright (c) 2026, num2words-ts contributors";
const SPDX = "// SPDX-License-Identifier: LGPL-2.1-or-later";
const UPSTREAM_DIR = ".upstream/num2words";

let failures = 0;
for await (const file of new Glob("{src,test,tools}/**/*.ts").scan(".")) {
  if (file.endsWith(".d.ts")) continue;
  const head = (await Bun.file(file).text()).split("\n").slice(0, 16).join("\n");
  const problems: string[] = [];
  if (!head.includes(OURS)) problems.push("missing contributors copyright");
  if (!head.includes(SPDX)) problems.push("missing SPDX line");
  const ported = /Ported from num2words: (\S+)/.exec(head)?.[1];
  if (ported) {
    const upstream = Bun.file(`${UPSTREAM_DIR}/${ported}`);
    if (!(await upstream.exists())) {
      problems.push(`upstream file ${ported} not found`);
    } else {
      const copyrights = (await upstream.text())
        .split("\n")
        .filter((l) => /^#\s*Copyright/.test(l))
        .map((l) => `// ${l.replace(/^#\s*/, "")}`);
      for (const line of copyrights) {
        if (!head.includes(line)) problems.push(`missing upstream notice "${line.slice(3)}"`);
      }
    }
  }
  if (problems.length) {
    failures++;
    console.error(`${file}: ${problems.join(", ")}`);
  }
}
if (failures) process.exit(1);
console.log("headers ok");
