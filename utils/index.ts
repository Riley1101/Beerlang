import * as fs from "fs";

import { read_source } from "../utils/read_source";
import { Scanner } from "../utils/scanner";

export class Gideon {
  has_error: boolean = false;
  constructor() {
    /**
    read_source((contents: string) => {
      let tmp = "var a = 12;";
      let scanner = new Scanner(tmp);
      scanner.scan_tokens();
      scanner.log_tokens();
    });
    */
    let tmp = 'var a = " 12 ";';
    let scanner = new Scanner(tmp);
    scanner.scan_tokens();
    scanner.log_tokens();
  }
}
