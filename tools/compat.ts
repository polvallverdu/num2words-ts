// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Runtime compatibility check of the BUILT package (dist/), i.e. what npm
// ships. Samples cases from the parity corpus for every ported language and
// runs them on Bun, Node, Deno and workerd (the Cloudflare Workers runtime).
//
//   bun run build && bun tools/compat.ts [--runtime bun,node,deno,workerd] [--per-lang 40]

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const OUT = join(ROOT, "node_modules", ".cache", "compat");
const RUNTIMES = ["bun", "node", "deno", "workerd"] as const;
type Runtime = (typeof RUNTIMES)[number];

const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const only = (flag("runtime")?.split(",") ?? RUNTIMES) as Runtime[];
const perLang = Number(flag("per-lang") ?? 40);

if (!existsSync(join(ROOT, "dist", "index.js"))) {
  console.error("dist/ not found: run `bun run build` first");
  process.exit(1);
}

// Pick cases for languages that are ported (registered and not a stub).
const { CONVERTER_CLASSES } = await import(join(ROOT, "dist", "index.js"));
const fixtures = join(ROOT, "test", "fixtures");
interface Case {
  input: { kind: string; value: string };
  to: string;
  kwargs: Record<string, unknown>;
  out?: string;
  error?: string;
  skip?: string;
}
const cases: (Case & { lang: string })[] = [];
for (const file of readdirSync(fixtures)) {
  if (!file.endsWith(".json") || file === "index.json") continue;
  const lang = file.slice(0, -5);
  const conv = CONVERTER_CLASSES[lang];
  if (!conv || conv.constructor.STUB) continue;
  const all = (JSON.parse(readFileSync(join(fixtures, file), "utf8")) as Case[]).filter(
    (c) => !c.skip,
  );
  const step = Math.max(1, Math.floor(all.length / perLang));
  for (let i = 0; i < all.length && cases.length < 100_000; i += step)
    cases.push({ ...all[i]!, lang });
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// The smoke module: imports the built package and replays the cases.
const smoke = `
import { asFloat, Decimal, num2words } from ${JSON.stringify(join(ROOT, "dist", "index.js"))};
const CASES = ${JSON.stringify(cases)};
const camel = (k) => k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
export function run() {
  const failures = [];
  for (const c of CASES) {
    const v = c.input.kind === "int" ? BigInt(c.input.value)
      : c.input.kind === "float" ? asFloat(Number(c.input.value))
      : c.input.kind === "decimal" ? new Decimal(c.input.value) : c.input.value;
    let got;
    try {
      got = num2words(v, { lang: c.lang, to: c.to, ...Object.fromEntries(Object.entries(c.kwargs).map(([k, x]) => [camel(k), x])) });
    } catch (e) { got = "!" + e.name; }
    const want = c.error !== undefined ? "!" + c.error : c.out;
    if (got !== want) failures.push(c.lang + " " + c.to + "(" + c.input.value + "): want " + want + ", got " + got);
  }
  return { ok: failures.length === 0, total: CASES.length, failures: failures.slice(0, 5) };
}
`;
await Bun.write(join(OUT, "smoke.mjs"), smoke);
await Bun.write(
  join(OUT, "main.mjs"),
  `import { run } from "./smoke.mjs"; const r = run(); console.log(JSON.stringify(r)); if (!r.ok) process.exit(1);\n`,
);
await Bun.write(
  join(OUT, "deno.mjs"),
  `import { run } from "./smoke.mjs"; const r = run(); console.log(JSON.stringify(r)); if (!r.ok) Deno.exit(1);\n`,
);

async function sh(cmd: string[], cwd = OUT): Promise<{ code: number; out: string }> {
  const proc = Bun.spawn(cmd, { cwd, stdout: "pipe", stderr: "pipe" });
  const [o, e] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  return { code: await proc.exited, out: `${o}\n${e}` };
}

function freePort(): Promise<number> {
  return new Promise((res) => {
    const srv = createServer();
    srv.listen(0, () => {
      const port = (srv.address() as { port: number }).port;
      srv.close(() => res(port));
    });
  });
}

async function runWorkerd(): Promise<{ code: number; out: string }> {
  const bin = join(ROOT, "node_modules", ".bin", "workerd");
  if (!existsSync(bin)) return { code: 1, out: "workerd not installed (bun install)" };
  const entry = join(OUT, "worker-entry.mjs");
  await Bun.write(
    entry,
    `import { run } from "./smoke.mjs";\nexport default { fetch() { try { return Response.json(run()); } catch (e) { return Response.json({ ok: false, failures: [String(e && e.stack || e)] }); } } };\n`,
  );
  const built = await Bun.build({
    entrypoints: [entry],
    outdir: join(OUT, "worker"),
    target: "browser",
    format: "esm",
    conditions: ["workerd", "worker", "browser"],
  });
  if (!built.success) return { code: 1, out: built.logs.map(String).join("\n") };
  const port = await freePort();
  await Bun.write(
    join(OUT, "worker", "config.capnp"),
    `using Workerd = import "/workerd/workerd.capnp";
const config :Workerd.Config = (
  services = [(name = "main", worker = .w)],
  sockets = [(name = "http", address = "127.0.0.1:${port}", http = (), service = "main")],
);
const w :Workerd.Worker = (
  modules = [(name = "worker-entry.js", esModule = embed "worker-entry.js")],
  compatibilityDate = "2026-10-01",
);
`,
  );
  const proc = Bun.spawn([bin, "serve", "config.capnp"], {
    cwd: join(OUT, "worker"),
    stdout: "pipe",
    stderr: "pipe",
  });
  try {
    for (let i = 0; i < 100; i++) {
      try {
        const body = await (await fetch(`http://127.0.0.1:${port}/`)).text();
        const r = JSON.parse(body);
        return { code: r.ok ? 0 : 1, out: body };
      } catch {
        await Bun.sleep(100);
      }
    }
    return { code: 1, out: "workerd did not answer" };
  } finally {
    proc.kill();
  }
}

const runners: Record<Runtime, () => Promise<{ code: number; out: string }>> = {
  bun: () => sh(["bun", "main.mjs"]),
  node: () => sh(["node", "main.mjs"]),
  deno: () => sh(["deno", "run", "--allow-read", "--no-config", "--no-lock", "deno.mjs"]),
  workerd: runWorkerd,
};

const langs = new Set(cases.map((c) => c.lang)).size;
console.log(`${cases.length} cases from ${langs} ported languages, against dist/`);
let failed = 0;
for (const rt of only) {
  const r = await runners[rt]();
  const line =
    r.out
      .trim()
      .split("\n")
      .find((l) => l.startsWith("{")) ?? r.out.trim().split("\n")[0];
  console.log(`${r.code === 0 ? "✅" : "❌"} ${rt.padEnd(8)} ${r.code === 0 ? "" : line}`);
  if (r.code !== 0) failed++;
}
process.exit(failed ? 1 : 0);
