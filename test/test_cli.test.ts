// Copyright (c) 2003, Taro Ogawa.  All Rights Reserved.
// Copyright (c) 2013, Savoir-faire Linux inc.  All Rights Reserved.
// Copyright (c) 2026, num2words-ts contributors
// SPDX-License-Identifier: LGPL-2.1-or-later
//
// Ported from num2words: tests/test_cli.py

import { beforeEach, describe, expect, test } from "bun:test";
import { CONVERTER_CLASSES, CONVERTES_TYPES } from "../src/index.ts";

class CliCaller {
  readonly cmd: string;
  readonly cmdList: string[];

  constructor() {
    this.cmd = new URL("../src/cli.ts", import.meta.url).pathname;
    this.cmdList = [process.execPath, this.cmd];
  }

  runCmd(...args: unknown[]): { returnCode: number; out: string; err: string } {
    const proc = Bun.spawnSync([...this.cmdList, ...args.map((arg) => String(arg))]);
    return {
      returnCode: proc.exitCode,
      out: proc.stdout.toString(),
      err: proc.stderr.toString(),
    };
  }
}

/** Test the command line app */
describe("CliTestCase", () => {
  let cli: CliCaller;

  beforeEach(() => {
    cli = new CliCaller();
  });

  /**
   * num2words without arguments should exit with status 1
   * and show docopt's default short usage message
   */
  test("test_cli_help", () => {
    const output = cli.runCmd();
    expect(output.returnCode).toBe(1);
    expect(output.err.startsWith("Usage:")).toBe(true);
  });

  /** You should be able to list all available languages */
  test("test_cli_list_langs", () => {
    let output = cli.runCmd("--list-languages");
    expect(
      output.out
        .trim()
        .split(/\r?\n/)
        .filter((out) => out),
    ).toEqual(Object.keys(CONVERTER_CLASSES).sort());
    output = cli.runCmd("-L");
    expect(
      output.out
        .trim()
        .split(/\r?\n/)
        .filter((out) => out),
    ).toEqual(Object.keys(CONVERTER_CLASSES).sort());
  });

  /** You should be able to list all available converters */
  test("test_cli_list_converters", () => {
    let output = cli.runCmd("--list-converters");
    expect(
      output.out
        .trim()
        .split(/\r?\n/)
        .filter((out) => out),
    ).toEqual([...CONVERTES_TYPES].sort());
    output = cli.runCmd("-C");
    expect(
      output.out
        .trim()
        .split(/\r?\n/)
        .filter((out) => out),
    ).toEqual([...CONVERTES_TYPES].sort());
  });

  /** Default to english */
  test("test_cli_default_lang", () => {
    const output = cli.runCmd(150);
    expect(output.returnCode).toBe(0);
    expect(output.out.trim()).toBe("one hundred and fifty");
  });

  /** You should be able to specify a language */
  test("test_cli_with_lang", () => {
    const output = cli.runCmd(150, "--lang", "es");
    expect(output.returnCode).toBe(0);
    expect(output.out.trim()).toBe("ciento cincuenta");
  });

  /** You should be able to specify a language and currency */
  test("test_cli_with_lang_to", () => {
    const output = cli.runCmd(150.55, "--lang", "es", "--to", "currency");
    expect(output.returnCode).toBe(0);
    expect(output.out.trim()).toBe("ciento cincuenta euros con cincuenta y cinco céntimos");
  });
});
