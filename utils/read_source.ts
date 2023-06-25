import fs from "fs";

import { error } from "./log";

type Exec = (contents: string) => void;

/**
 * @param {string} path - read the file
 */
export function run_file(path: string, exec: Exec) {
  try {
    const contents = fs.readFileSync(path);
    exec(contents.toString());
  } catch (err: any) {
    error(0, err.message);
  }
}

export function run_prompt(exec: Exec) {
  const stdin = process.openStdin();
  stdin.addListener("data", (d) => {
    exec(d.toString());
  });
}

export function read_source(exec: Exec) {
  if (process.argv.length > 2) {
    const path = process.argv[2];
    if (path) return run_file(path, exec);
    else run_prompt(exec);
  } else {
    return run_prompt(exec);
  }
}
