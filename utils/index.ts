import { read_source } from "../utils/read_source";
import { Scanner } from "../utils/scanner";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";

export class Gideon {
  has_error: boolean = false;
  mode: string;
  constructor() {
    this.mode = "repl";
    let interpreter = new Interpreter();

    if (this.mode === "script") {
      let scanner = new Scanner("1 + 2");
      scanner.scan_tokens();
      const tokens = scanner.get_tokens();
      const parser = new Parser(tokens);
      console.log(tokens);
      let stats = parser.parse();
      for (let stat of stats) {
        interpreter.interpret(stat);
      }
    } else {
      read_source((contents: string) => {
        let scanner = new Scanner(contents);
        scanner.scan_tokens();
        const tokens = scanner.get_tokens();
        const parser = new Parser(tokens);
        console.log(tokens);
        let stats = parser.parse();
        for (let stat of stats) {
          interpreter.interpret(stat);
        }
      });
    }
  }
}
