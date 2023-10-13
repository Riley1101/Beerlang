import { BeerAstPrinter } from "./BeerAstPrinter";
import { BeerParser } from "./parser";
import { BeerResolver } from "./resolver";
import { Beer } from "./interpreter";
import { BeerScanner } from "./scanner";
import chalk from "chalk";
import * as ast from "./ast";

/**
 * @class BeerRunner
 */
export class BeerRunner {
  private interpreter = new Beer();
  private resolver = new BeerResolver(this.interpreter);
  exec(source: string) {
    const scanner = new BeerScanner(source);
    scanner.scan_tokens();
    const tokens = scanner.get_tokens();
    const parser = new BeerParser(tokens);
    const statements = parser.parse();
    this.resolver.resolve(statements);

    this.print_ast(statements);
    console.log(
      chalk.blue("                                                 "),
    );
    console.log(
      chalk.blue("================ Compiled Output ================"),
    );
    console.log(
      chalk.blue("                                                 "),
    );
    this.interpreter.interpret(statements);
  }

  print_ast(stmts: ast.Stmt[]) {
    console.log(chalk.cyan("================      AST       ================"));
    console.log(
      chalk.cyan("                                                 "),
    );
    const astPrinter = new BeerAstPrinter();
    astPrinter.print_ast(stmts);
  }
}
