import { read_source } from "../utils/read_source";
import { Scanner } from "../utils/scanner";
import { Parser } from "./parser";

export class Gideon {
  has_error: boolean = false;
  constructor() {
    read_source((contents: string) => {
      let scanner = new Scanner(contents);
      scanner.scan_tokens();
      const tokens = scanner.get_tokens();
      const parser = new Parser(tokens);
      parser.parse()
        
    });
  }
}
