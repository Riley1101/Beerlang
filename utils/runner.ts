import { Scanner } from "./scanner";
import { read_source, run_prompt } from "./read_source";
import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { Resolver } from "./resolver";

type Mode = "REPL" | "FILE";

export class Runner {
  private interpreter: Interpreter;
  private parser: Parser;
  private resolver: Resolver;
  private scanner: Scanner;
  private mode: Mode;
  constructor(mode: Mode) {
    this.mode = mode;
    this.interpreter = new Interpreter();
    this.parser = new Parser();
    this.resolver = new Resolver(this.interpreter);
    this.scanner = new Scanner();
  }

  repl() {
    run_prompt((contents: string) => {
      this.scanner.set_contents(contents);
      this.scanner.scan_tokens();
      this.parser.set_tokens(this.scanner.tokens);
      let stmts = this.parser.parse();
      this.resolver.resolve(stmts);
      this.interpreter.interpret(stmts);
    });
  }

  file() {
    read_source((contents: string) => {
      this.scanner.set_contents(contents);
      this.scanner.scan_tokens();
      this.parser.set_tokens(this.scanner.tokens);
      let stmts = this.parser.parse();
      this.resolver.resolve(stmts);
      this.interpreter.interpret(stmts);
    });
  }

  exec() {
    if (this.mode === "REPL") {
      this.repl();
    } else if (this.mode === "FILE") {
      this.file();
    }
  }
}
