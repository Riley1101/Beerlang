import { read_source } from "../utils/read_source";
import { Scanner } from "../utils/scanner";

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
