import { Scanner } from "./src/scanner";
import { read_source } from "./src/read_source";
import { Parser } from "./src/parser";
import { AstPrinter } from "./src/ast";
import chalk from "chalk";
import { Interpreter } from "./src/interpreter";

/**
 * Init Beerlang
 */
const source = await read_source();

/**
 * Init Scanner
 */
const scanner = new Scanner(source);
scanner.scan_tokens();
let tokens = scanner.get_tokens();
console.log(chalk.cyan("================     TOKENS     ================"));
scanner.print_tokens();
/**
 * Init Parser
 */
const parser = new Parser();
parser.setTokens(tokens);
let res = parser.parse();

console.log(chalk.cyan("================      AST       ================"));
console.log(chalk.cyan("                                                 "));
/**
 * Init AstPrinter
 */
const astPrinter = new AstPrinter();
astPrinter.print_ast(res);

console.log(chalk.blue("                                                 "));
console.log(chalk.blue("================ Compiled Output ================"));
console.log(chalk.blue("                                                 "));
/**
 * Init Interpreter
 */
const interpreter = new Interpreter();
interpreter.interpret(res);

console.log(chalk.blue("                                                 "));
