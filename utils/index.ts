import { read_source } from "../utils/read_source";
import { Scanner } from "../utils/scanner";
import { Parser } from "./parser";

export class Gideon {
    has_error: boolean = false;
    constructor() {
        let scanner = new Scanner('a = 1')
        scanner.scan_tokens()
        let tokens = scanner.get_tokens()
        let parser = new Parser(tokens)
        const stats = parser.parse()
        console.log(stats)

        /**
            *
            read_source((contents: string) => {
            let scanner = new Scanner(contents);
            scanner.scan_tokens();
            const tokens = scanner.get_tokens();
            console.log('tokens', tokens)
            const parser = new Parser(tokens);
            parser.parse()
  
        });
            */
    }
}
