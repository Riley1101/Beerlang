/**
 * @module Beer
 * @description Beer is an interpreter written in TypeScript.
 * It is a dynamically typed, interpreted language with a C-style syntax.
 * @version 0.0.3
 */

import { BeerRunner } from "./src/runner";
import { read_source } from "./src/read_source";
const runner = new BeerRunner();
const source = read_source();

source.then((source) => {
  runner.exec(source);
});
