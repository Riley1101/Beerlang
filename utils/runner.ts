import { Scanner } from "./scanner";
import { read_source } from "./read_source";
import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { Resolver } from "./resolver";

export class Runner {
  private interpreter: Interpreter;
  private parser: Parser;
  private resolver: Resolver;
  private scanner: Scanner;
  constructor() {
    this.interpreter = new Interpreter();
    this.parser = new Parser();
    this.resolver = new Resolver(this.interpreter);
    this.scanner = new Scanner();
  }

  exec() {
    read_source((contents: string) => {
      this.scanner.set_contents(contents);
      this.scanner.scan_tokens();
      this.parser.set_tokens(this.scanner.tokens);
      let stmts = this.parser.parse();
      this.resolver.resolve(stmts);
      this.interpreter.interpret(stmts);
    });
  }
}
