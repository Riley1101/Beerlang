/**
 * @namespace Read file source 
 * @file read_source.ts
 * @description Defines functions for reading the source code of the beer file.
 */
export function read_source() {
  const file = Bun.file("test/operators.beer");
  const text = file.text();
  return text;
}
