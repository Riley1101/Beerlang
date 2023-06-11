import type { TOKENS_TYPES } from "./types";
import { identifiers } from "./constants/identifiers";
import { error } from "../log";
import { Token } from "./token";

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

  /**
   * public methods
   */
  public log_tokens() {
    console.log("Input Sorces ", this.source);
    console.log(this.tokens);
  }

  public scan_tokens() {
    while (!this.is_end()) {
      this.start = this.current;
      this.scan_token();
    }
    this.add_token("EOF", this.line);
    return this.tokens;
  }

  /**
   * private methods
   */

  private is_alpha(char: string) {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
  }

  private is_alpha_numeric(char: string) {
    return this.is_alpha(char) || this.is_digit(char);
  }

  private peek() {
    if (this.is_end()) return "\0";
    return this.source.charAt(this.current);
  }

  private match(expected: string) {
    if (this.is_end()) return false;
    if (this.source[this.current] != expected) return false;
    this.current++;
    return true;
  }
  private advance() {
    this.current++;
    return this.source[this.current - 1];
  }

  private add_token(type: TOKENS_TYPES, literal: any = null) {
    let laxeme = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, laxeme, literal, this.line));
  }

  private identifier() {
    while (this.is_alpha_numeric(this.peek())) {
      this.advance();
    }
    let text = this.source.substring(this.start, this.current);
    let type = identifiers[text];
    this.add_token("IDENTIFIER", type);
  }
  private is_end() {
    return this.current >= this.source.length;
  }

  private is_digit(char: string) {
    return char >= "0" && char <= "9";
  }

  private peekNext() {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source.charAt(this.current + 1);
  }

  private number() {
    while (this.is_digit(this.peek())) {
      this.advance();
    }
    if (this.peek() == "." && this.is_digit(this.peekNext())) {
      this.advance();
      while (this.is_digit(this.peek())) {
        this.advance();
      }
    }
    this.add_token(
      "NUMBER",
      Number(this.source.substring(this.start, this.current))
    );
  }

  private string() {
    while (this.peek() != '"' && !this.is_end()) {
      if (this.peek() == "\n") this.line++;
      this.advance();
    }
    if (this.is_end()) {
      error(this.line, "Unterminated string.");
      return;
    }
    this.advance();
    let str = this.source.substring(this.start + 1, this.current - 1);
    this.add_token("STRING", str);
  }

  private scan_token() {
    let char = this.advance();
    switch (char) {
      /**
       * string char tokens
       */
      case '"':
        this.string();
        break;
      // escape meanless whitespaces and characters
      case "\r":
      case " ":
      case "\t":
        break;
      case "\n":
        this.line++;
        break;
      // check tokens
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
        if (this.match("/")) {
          while (this.peek() != "\n" && !this.is_end()) this.advance();
        } else {
          this.add_token("/");
        }
        break;
      case "!":
        this.add_token(this.match("=") ? "!=" : "!");
        break;
      case "=":
        this.add_token(this.match("=") ? "==" : "=");
        break;
      case "<":
        this.add_token(this.match("=") ? "<=" : "<");
        break;
      case ">":
        this.add_token(this.match("=") ? ">=" : ">");
        break;
      default:
        if (this.is_digit(char)) {
          this.number();
        } else if (this.is_alpha(char)) {
          this.identifier();
        } else {
          // !TODO this will always run if the char is not a token
          break;
        }
    }
  }
}
