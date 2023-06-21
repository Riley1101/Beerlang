import { error } from "./log";
import { Token } from "./token";
import { TokenType, LoxObject } from "./types";

export class Scanner {
  tokens: Token[] = [];
  contents: string;
  start: number;
  end: number;
  current: number;
  line: number;
  constructor(contents: string) {
    this.contents = contents;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.end = 0;
    this.line = 1;
  }
  private _is_at_end() {
    return this.current >= this.contents.length;
  }

  private _add_token(token: TokenType, literal: LoxObject = null) {
    if (literal === null) literal = null;
    let text = this.contents.substring(this.start + 1, this.current - 1);
    this.tokens.push(new Token(token, text, literal, this.line));
  }
  private _match(expected: string) {
    if (this._is_at_end()) return false;
    if (this.contents.charAt(this.current) != expected) return false;
    this.current += 1;
    return true;
  }

  private _advance() {
    this.current += 1;
    return this.contents.charAt(this.current - 1);
  }

  private _peek() {
    if (this._is_at_end()) return "\0";
    return this.contents.charAt(this.current);
  }

  private scan_token() {
    let c = this._advance();
    console.log(c);
    switch (c) {
      case "(":
        this._add_token(TokenType.LeftParen);
        break;
      case ")":
        this._add_token(TokenType.RightParen);
        break;
      case "{":
        this._add_token(TokenType.LeftBrace);
        break;
      case "}":
        this._add_token(TokenType.RightBrace);
        break;
      case ",":
        this._add_token(TokenType.Comma);
        break;
      case ".":
        this._add_token(TokenType.Dot);
        break;
      case "-":
        this._add_token(TokenType.Minus);
        break;
      case "+":
        this._add_token(TokenType.Plus);
        break;
      case ";":
        this._add_token(TokenType.Semicolon);
        break;
      case "*":
        this._add_token(TokenType.Star);
        break;
      case "!":
        this._add_token(
          this._match("=") ? TokenType.BangEqual : TokenType.Bang
        );
        break;
      case "=":
        this._add_token(
          this._match("=") ? TokenType.EqualEqual : TokenType.Equal
        );
        break;
      case "<":
        this._add_token(
          this._match("=") ? TokenType.LessEqual : TokenType.Less
        );
        break;
      case ">":
        this._add_token(
          this._match("=") ? TokenType.GreaterEqual : TokenType.Greater
        );
        break;
      case "/":
        if (this._match("/")) {
          while (this._peek() != "\n" && !this._is_at_end()) {
            this._advance();
          }
        } else {
          this._add_token(TokenType.Slash);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.line += 1;
      case '"':
        while (this._peek() != '"' && !this._is_at_end()) {
          if (this._peek() == "\n") this.line += 1;
          this._advance();
        }
        if (this._is_at_end()) {
          error(this.line, "unexpected error default");
          return;
        }
        this._advance();
        this._add_token(TokenType.String);
        break;

      default:
        error(this.line, "unexpected error default");
        break;
    }
  }
  public scan_tokens() {
    while (!this._is_at_end()) {
      this.start = this.current;
      this.scan_token();
    }
    this.tokens.push(new Token(TokenType.EOF, "", null, this.current));
  }
  public log_tokens() {
    console.log(this.tokens);
  }
}
