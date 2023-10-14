/**
 * @module Beer
 * @description Beer is an interpreter written in TypeScript.
 * It is a dynamically typed, interpreted language with a C-style syntax.
 * @version 0.0.3
 */

import { run_file, repl } from "./src/read_source";
import { BeerRunner } from "./src/runner";

const runner = new BeerRunner();
runner.run();

/*
source.then((source) => {
  runner.exec(source);
};
*/
