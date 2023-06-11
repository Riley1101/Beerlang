import type { TOKENS_TYPES } from "./types";
import { Token } from "./tokens";

export class Scanner {
  private source: string;
  private tokens: Token[] = [];
  private start: number = 0;
  private current: number = 0;
  private line: number = 1;
  constructor(source: string) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  advance() {
    this.current++;
    return this.source[this.current - 1];
  }

  add_token(type: TOKENS_TYPES, literal: any = null) {
    let text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }

  log_tokens() {
    console.log(this.tokens);
  }

  is_end() {
    return this.current >= this.source.length;
  }

  scan_tokens() {
    while (!this.is_end()) {
      this.start = this.current;
      this.scan_token();
    }
    return this.tokens;
  }

  scan_token() {
    let char = this.advance();
    switch (char) {
      case "(":
        this.add_token("(");
        break;
      case ")":
        this.add_token(")");
        break;
      case "{":
        this.add_token("{");
        break;
      case "}":
        this.add_token("}");
        break;
      case ",":
        this.add_token(",");
        break;
      case ".":
        this.add_token(".");
        break;
      case "-":
        this.add_token("-");
        break;
      case "+":
        this.add_token("+");
        break;
      case ";":
        this.add_token(";");
        break;
      case "*":
        this.add_token("*");
        break;
      case "/":
        this.add_token("/");
        break;
    }
  }
}
