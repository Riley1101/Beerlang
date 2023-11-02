import { BeerScanner } from "../src/scanner";
import { BeerParser } from "../src/parser";
import { BeerResolver } from "../src/resolver";
import { BeerAstPrinter } from "../src/ast";
import { Beer } from "../src/interpreter";

type CallbackFunction = (result: any) => void;

export class BeerApi {
    private interpreter: Beer;
    private resolver: BeerResolver;
    private astPrinter: BeerAstPrinter;
    private parser: BeerParser;
    private scanner: BeerScanner;

    constructor() {
        this.scanner = new BeerScanner();
        this.interpreter = new Beer();
        this.resolver = new BeerResolver(this.interpreter);
        this.parser = new BeerParser([]);
        this.astPrinter = new BeerAstPrinter();
    }

    public generate_ast(source: string, callback: CallbackFunction) {
        this.scanner.set_source(source);
        this.scanner.scan_tokens();
        this.parser.set_tokens(this.scanner.get_tokens());
        const statements = this.parser.parse();
        this.resolver.resolve(statements);
        const results = this.astPrinter.generate_ast(statements);
        this.scanner.reset_scanner();
        this.parser.reset_parser();
        callback(results);
        return results;
    }
}
