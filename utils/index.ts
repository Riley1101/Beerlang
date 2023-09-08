import { read_source } from "../utils/read_source";
import { Scanner } from "../utils/scanner";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";
import { Resolver } from "./resolver";

export class Gideon {
  has_error: boolean = false;
  mode: string;
  constructor() {
    this.mode = "repl";
    let interpreter = new Interpreter();
    let resolver = new Resolver(interpreter);

    if (this.mode === "script") {
      let scanner = new Scanner("1 + 2");
      scanner.scan_tokens();
      const tokens = scanner.get_tokens();
      console.log(tokens);
      const parser = new Parser(tokens);
      let stmts = parser.parse();
      resolver.resolve(stmts);
    } else {
      read_source((contents: string) => {
        let scanner = new Scanner(contents);
        scanner.scan_tokens();
        const tokens = scanner.get_tokens();
        console.log(tokens);
        const parser = new Parser(tokens);
        let stmts = parser.parse();
        resolver.resolve(stmts);
      });
    }
  }
}
