/**
 * @namespace BeerRunner
 * @file runner.ts
 * @description  Runner for the Beer language
 * run in different modes
 */
import chalk from "chalk";

import * as ast from "./ast";
import { run_file, repl } from "./read_source";
import { BeerAstPrinter } from "./ast";
import { Beer } from "./interpreter";
import { BeerParser } from "./parser";
import { BeerResolver } from "./resolver";
import { BeerScanner } from "./scanner";

/**
 * @class BeerRunner
 * @classdesc Runner for the Beer language
 * @member interpreter - The interpreter
 * @member resolver - The resolver
 * @method exec - Execute the source code
 * @method print_ast - Print the AST
 */
export class BeerRunner {
  private interpreter: Beer;
  private resolver: BeerResolver;
  private astPrinter: BeerAstPrinter;
  private parser: BeerParser;
  private scanner: BeerScanner;
  private MODE: "REPL" | "FILE";

  constructor() {
    this.scanner = new BeerScanner();
    this.interpreter = new Beer();
    this.resolver = new BeerResolver(this.interpreter);
    this.parser = new BeerParser([]);
    this.astPrinter = new BeerAstPrinter();
    Bun.argv[2] === undefined ? (this.MODE = "REPL") : (this.MODE = "FILE");
  }

  run() {
    if (this.MODE === "FILE") {
      run_file((source: string) => {
        this.scanner.set_source(source);
        this.scanner.scan_tokens();
        const tokens = this.scanner.get_tokens();
        this.parser.set_tokens(tokens);
        const statements = this.parser.parse();
        this.resolver.resolve(statements);
        this.print_ast(statements);
        console.log(
          chalk.blue("                                                 "),
        );
        console.log(
          chalk.blue(
            "================      Compiled Output       ================",
          ),
        );
        console.log(
          chalk.blue("                                                 "),
        );
        this.interpreter.interpret(statements);
      });
    } else {
      console.log("REPL is still in progress\n");
      console.log("Usage: beer [script]");
    }
  }

  print_ast(stmts: ast.Stmt[]) {
    console.log(chalk.cyan("================      AST       ================"));
    console.log(
      chalk.cyan("                                                 "),
    );
    this.astPrinter.print_ast(stmts);
  }
}
