import { Scanner } from "./src/scanner";
import { read_source } from "./src/read_source";

const source = await read_source();
const scanner = new Scanner(source);
scanner.scan_tokens();
scanner.get_tokens();
