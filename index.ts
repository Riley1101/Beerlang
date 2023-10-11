import { Scanner } from "./src/scanner";
import { read_source } from "./src/read_source";
import { Parser } from "./src/parser";
import { AstPrinter } from "./src/ast";

/**
 * Init Beerlang 
 */
const source = await read_source();
const scanner = new Scanner(source);
const parser = new Parser();
const astPrinter = new AstPrinter();
scanner.scan_tokens();
let tokens = scanner.get_tokens();
parser.setTokens(tokens);
parser.parse()
