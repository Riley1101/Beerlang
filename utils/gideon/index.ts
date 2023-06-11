import { read_source } from "../read_source";
import { Scanner } from "../tokens/scanner";

export class Gideon {
  has_error: boolean = false;
  constructor() {
    read_source((contents: string) => {
      let scanner = new Scanner(contents);
      scanner.scan_tokens();
      scanner.log_tokens();
    });
  }
}
