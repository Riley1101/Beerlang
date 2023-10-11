import { Scanner } from "./src/scanner";
import { read_source } from "./src/read_source";
import { Parser } from "./src/parser";
import { AstPrinter } from "./src/ast";
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

/**
 * Init Parser
 */
const parser = new Parser();
parser.setTokens(tokens);
let res = parser.parse();

/**
 * Init AstPrinter
 */
const astPrinter = new AstPrinter();
astPrinter.print_ast(res);

/**
 * Init Interpreter
 */
const interpreter = new Interpreter();
interpreter.interpret(res);

