/**
 * @namespace Read file source
 * @file read_source.ts
 * @description Defines functions for reading the source code of the beer file.
 */

export function repl(callback: Function) {
  const prompt = "Type something: \n";
  process.stdout.write(prompt);
  process.stdin.addListener("data", (data) => {
    const text = data.toString().trim();
    callback(text);
  });
}

export function run_file(callback: Function) {
  const args = Bun.argv;
  const fileName = args[2];
  if (fileName === undefined) {
    console.log("Usage: beer [script]");
    process.exit(64);
  }
  const text = Bun.file(fileName).text();
  text.then((text) => {
    callback(text);
  });
}
