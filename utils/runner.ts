import { Scanner } from "./scanner";
import { read_source } from "./read_source";
import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { Resolver } from "./resolver";
import { AstPrinter } from "./ast";

export class Runner {
  private interpreter: Interpreter;
  private parser: Parser;
  private resolver: Resolver;
  private scanner: Scanner;
  private ast_printer: AstPrinter;
  constructor() {
    this.interpreter = new Interpreter();
    this.parser = new Parser();
    this.resolver = new Resolver(this.interpreter);
    this.scanner = new Scanner();
    this.ast_printer = new AstPrinter();
  }

  print_ast() {
    read_source((contents: string) => {
      this.scanner.set_contents(contents);
      this.scanner.scan_tokens();
      this.parser.set_tokens(this.scanner.tokens);
      let stmts = this.parser.parse();
      console.log(this.ast_printer.strigify(stmts));
    });
  }

  exec() {
    read_source((contents: string) => {
      this.scanner.set_contents(contents);
      this.scanner.scan_tokens();
      this.parser.set_tokens(this.scanner.tokens);
      let stmts = this.parser.parse();
      this.resolver.resolve(stmts);
      let ast = this.ast_printer.strigify(stmts);
      /* console.log("================= AST STARTS =================");
      console.log(ast);
      console.log("================= AST ENDS ================="); */
      this.interpreter.interpret(stmts);
    });
  }
}
