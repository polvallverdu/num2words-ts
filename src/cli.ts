#!/usr/bin/env node
// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: bin/num2words
//
// Upstream parses its arguments with docopt; this file reproduces the docopt
// behavior for upstream's usage text by hand (same flags, same output, same
// exit codes).

import { CONVERTER_CLASSES, CONVERTES_TYPES, num2words } from "./index.ts";

const DOC = `num2words: convert numbers into words.

Usage:
    num2words [options] <number>
    num2words --list-languages
    num2words --list-converters
    num2words --help

Arguments:
    <number>                Number you want to convert into words

Options:
    -L --list-languages     Show all languages.
    -C --list-converters    Show all converters.
    -l --lang=<lang>        Output language [default: en].
    -t --to=<to>            Output converter [default: cardinal].
    -h --help               Show this message.
    -v --version            Show version.

Examples:
    $ num2words 10001
    ten thousand and one

    $ num2words 24,120.10
    twenty-four thousand, one hundred and twenty point one

    $ num2words 24,120.10 -l es
    veinticuatro mil ciento veinte punto uno

    $num2words 2.14 -l es --to currency
    dos euros con catorce céntimos
`;

const VERSION = "0.5.13";
const LINESEP = "\n";

/** docopt's `printable_usage(doc)`: the "Usage:" section. */
const USAGE =
  `Usage:${(DOC.split(/[Uu][Ss][Aa][Gg][Ee]:/)[1] as string).split(/\n\s*\n/)[0]}`.trim();

interface OptionSpec {
  short: string;
  long: string;
  takesArg: boolean;
}

const OPTIONS: OptionSpec[] = [
  { short: "-L", long: "--list-languages", takesArg: false },
  { short: "-C", long: "--list-converters", takesArg: false },
  { short: "-l", long: "--lang", takesArg: true },
  { short: "-t", long: "--to", takesArg: true },
  { short: "-h", long: "--help", takesArg: false },
  { short: "-v", long: "--version", takesArg: false },
];

/** docopt's DocoptExit: message (if any) then the usage, on stderr, exit status 1. */
class DocoptExit extends Error {
  override name = "DocoptExit";
}

interface Parsed {
  /** Options given, by long name, in order (repeats kept to detect them). */
  options: [string, string | true][];
  positionals: string[];
  /** An unknown option was given: docopt then fails to match any pattern. */
  unknown: boolean;
}

/** docopt's `parse_argv` with `options_first=False`. */
function parseArgv(argv: string[]): Parsed {
  const parsed: Parsed = { options: [], positionals: [], unknown: false };
  let i = 0;
  while (i < argv.length) {
    const token = argv[i] as string;
    if (token === "--") {
      // docopt keeps "--" itself as an argument too.
      parsed.positionals.push(...argv.slice(i));
      break;
    }
    if (token.startsWith("--")) {
      const eqIndex = token.indexOf("=");
      const long = eqIndex === -1 ? token : token.slice(0, eqIndex);
      let value: string | undefined = eqIndex === -1 ? undefined : token.slice(eqIndex + 1);
      i++;
      let spec = OPTIONS.find((o) => o.long === long);
      if (!spec) {
        const similar = OPTIONS.filter((o) => o.long.startsWith(long));
        if (similar.length > 1) {
          throw new DocoptExit(
            `${long} is not a unique prefix: ${similar.map((o) => o.long).join(", ")}?`,
          );
        }
        spec = similar[0];
      }
      if (!spec) {
        parsed.unknown = true;
        continue;
      }
      if (spec.takesArg) {
        if (value === undefined) {
          if (i >= argv.length || argv[i] === "--") {
            throw new DocoptExit(`${spec.long} requires argument`);
          }
          value = argv[i] as string;
          i++;
        }
        parsed.options.push([spec.long, value]);
      } else {
        if (value !== undefined) {
          throw new DocoptExit(`${spec.long} must not have an argument`);
        }
        parsed.options.push([spec.long, true]);
      }
      continue;
    }
    if (token.startsWith("-") && token !== "-") {
      i++;
      let left = token.slice(1);
      while (left !== "") {
        const short = `-${left[0]}`;
        left = left.slice(1);
        const spec = OPTIONS.find((o) => o.short === short);
        if (!spec) {
          parsed.unknown = true;
          continue;
        }
        if (spec.takesArg) {
          let value: string;
          if (left === "") {
            if (i >= argv.length || argv[i] === "--") {
              throw new DocoptExit(`${short} requires argument`);
            }
            value = argv[i] as string;
            i++;
          } else {
            value = left;
            left = "";
          }
          parsed.options.push([spec.long, value]);
        } else {
          parsed.options.push([spec.long, true]);
        }
      }
      continue;
    }
    parsed.positionals.push(token);
    i++;
  }
  return parsed;
}

interface Args {
  "--list-languages": boolean;
  "--list-converters": boolean;
  "--lang": string;
  "--to": string;
  "<number>": string | undefined;
}

/** Match the parsed argv against upstream's four usage patterns. */
function match(parsed: Parsed): Args {
  const names = parsed.options.map(([name]) => name);
  if (parsed.unknown || new Set(names).size !== names.length) throw new DocoptExit();
  const get = (name: string): string | true | undefined =>
    parsed.options.find(([n]) => n === name)?.[1];

  // num2words [options] <number>
  const first = parsed.positionals.length === 1;
  // num2words --list-languages | --list-converters | --help
  const alone =
    parsed.positionals.length === 0 &&
    names.length === 1 &&
    ["--list-languages", "--list-converters", "--help"].includes(names[0] as string);
  if (!first && !alone) throw new DocoptExit();

  return {
    "--list-languages": get("--list-languages") === true,
    "--list-converters": get("--list-converters") === true,
    "--lang": (get("--lang") as string | undefined) ?? "en",
    "--to": (get("--to") as string | undefined) ?? "cardinal",
    "<number>": parsed.positionals[0],
  };
}

export function getLanguages(): string[] {
  return Object.keys(CONVERTER_CLASSES).sort();
}

export function getConverters(): string[] {
  return [...CONVERTES_TYPES].sort();
}

function pyStr(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

/** Run the CLI; returns the exit status. */
export function main(
  argv: string[],
  stdout: (s: string) => void,
  stderr: (s: string) => void,
): number {
  const version = `num2words==${VERSION}`;
  let args: Args;
  try {
    const parsed = parseArgv(argv);
    // docopt's `extras`: --help and --version win before pattern matching.
    if (parsed.options.some(([name]) => name === "--help")) {
      stdout(`${DOC.replace(/^\n+|\n+$/g, "")}\n`);
      return 0;
    }
    if (parsed.options.some(([name]) => name === "--version")) {
      stdout(`${version}\n`);
      return 0;
    }
    args = match(parsed);
  } catch (e) {
    if (!(e instanceof DocoptExit)) throw e;
    stderr(`${`${e.message}\n${USAGE}`.trim()}\n`);
    return 1;
  }

  if (args["--list-languages"]) {
    for (const lang of getLanguages()) {
      stdout(lang);
      stdout(LINESEP);
    }
    return 0;
  }
  if (args["--list-converters"]) {
    for (const cvt of getConverters()) {
      stdout(cvt);
      stdout(LINESEP);
    }
    return 0;
  }
  try {
    const words = num2words(args["<number>"] as string, {
      lang: args["--lang"],
      to: args["--to"] as never,
    });
    stdout(words + LINESEP);
    return 0;
  } catch (err) {
    stderr(String(args["<number>"]));
    stderr(pyStr(err) + LINESEP);
    stderr(DOC);
    return 1;
  }
}

declare const process: {
  argv: string[];
  exitCode?: number;
  stdout: { write(s: string): unknown };
  stderr: { write(s: string): unknown };
};

process.exitCode = main(
  process.argv.slice(2),
  (s) => process.stdout.write(s),
  (s) => process.stderr.write(s),
);
