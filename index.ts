import { read_source } from "./utils/read_source";
import { Scanner } from "./utils/tokens/scanner";
function run(contents: string) {
  console.log("Executing...");
  let scanner = new Scanner("print(1 + 2);");
  scanner.scan_tokens();
  console.log(scanner.log_tokens());
}

read_source(run);
