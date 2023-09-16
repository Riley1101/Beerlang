import { Scanner } from "./src/scanner";

let input = "var a = 12";
const scanner = new Scanner(input);
scanner.scan_tokens();
scanner.get_tokens();
