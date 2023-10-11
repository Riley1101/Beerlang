import { Scanner } from "./src/scanner";
import { read_source } from "./src/read_source";
import { Parser } from "./src/parser";
import { AstPrinter } from "./src/ast";

/**
 * Init Beerlang
 */
const source = await read_source();
const scanner = new Scanner(source);
scanner.scan_tokens();
let tokens = scanner.get_tokens();
const parser = new Parser();
parser.setTokens(tokens);
let res = parser.parse();
console.log(res,"one two")
const astPrinter = new AstPrinter();
console.log("AST", astPrinter.print(res));
