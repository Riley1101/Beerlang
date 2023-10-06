import { errorReporter, Logger, SyntaxError } from "./error";
import { Token } from "./token";
import { keywords, Literals, TokenType } from "./types";

export class Scanner implements Scanner {
  private logger: Logger = new Logger();
  private tokens: Token[];
  private source: string;
  private current: number = 0;
  private start: number = 0;
  private line: number = 1;

  constructor(source: string) {
    this.source = source;
    this.tokens = [];
    this.current = 0;
    this.start = 0;
    this.line = 1;
  }

  public scan_tokens() {
    while (!this.is_end()) {
      this.start = this.current;
      this.scan();
    }
    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
  }

  private is_end(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private match(expected: string) {
    if (this.is_end()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    this.current++;
    return true;
  }

  private add_token(type: TokenType, literal: Literals) {
    let text = this.source.substring(this.start, this.current);
    let token = new Token(type, text, literal, this.line);
    this.tokens.push(token);
  }

  private peek(): string {
    return this.source.charAt(this.current);
  }

  private current_char(): string {
    return this.source.charAt(this.current - 1);
  }

  private is_digit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private is_alpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
  }

  private is_alpha_numeric(c: string): boolean {
    return this.is_alpha(c) || this.is_digit(c);
  }

  private identifier() {
    while (this.is_alpha_numeric(this.peek())) {
      this.advance();
    }
    let text = this.source.substring(this.start, this.current);
    // map token via Records
    const token_type = keywords[text];
    if (token_type !== undefined) {
      this.add_token(token_type, null);
    } else {
      this.add_token(TokenType.IDENTIFIER, null);
    }
  }

  private string() {
    while (this.peek() !== '"' && !this.is_end()) {
      if (this.peek() === "\n") this.line++;
      this.advance();
    }
    if (this.is_end()) {
      errorReporter.report(
        new SyntaxError(
          null,
          "Unterminated string." +
            "at line " +
            this.line +
            " column " +
            this.current +
            "",
        ),
      );
    }
    this.advance();
    let value = this.source.substring(this.start + 1, this.current - 1);
    this.add_token(TokenType.STRING, value);
  }

  private number() {
    while (this.is_digit(this.peek())) {
      this.advance();
    }
    if (this.peek() === "." && this.is_digit(this.peek())) {
      this.advance();
    }
    let raw_number = this.source.substring(this.start, this.current);
    let value = parseFloat(raw_number);
    this.add_token(TokenType.NUMBER, value);
  }

  private scan() {
    let c = this.advance();
    switch (c) {
      case "➕":
      case "+":
        this.add_token(TokenType.PLUS, null);
        break;
      case "➖":
      case "-":
        this.add_token(TokenType.MINUS, null);
        break;
      case "✖":
      case "❌":
      case "*":
        this.add_token(TokenType.STAR, null);
        break;
      case "➗":
      case "/":
        if (this.match("/")) {
          while (this.peek() != "\n" && !this.is_end()) {
            this.advance();
          }
        } else {
          this.add_token(TokenType.SLASH, null);
        }
        break;
      case "♻":
      case "%":
        this.add_token(TokenType.MODULO, null);
        break;
      case "✔":
      case "=":
        this.add_token(
          this.match("=") || this.match("✔")
            ? TokenType.EQUAL_EQUAL
            : TokenType.EQUAL,
          null,
        );
        break;
      case "o":
        if (this.match("r")) {
          this.add_token(TokenType.OR, null);
        }
        break;
      case ",":
        this.add_token(TokenType.COMMA, null);
        break;
      case ".":
        this.add_token(TokenType.DOT, null);
        break;
      case "❗":
      case "!":
        this.add_token(
          this.match("=") || this.match("✔")
            ? TokenType.BANG_EQUAL
            : TokenType.BANG,
          null,
        );
        break;
      case "<":
      case "⬅":
        this.add_token(
          this.match("=") || this.match("✔")
            ? TokenType.LESS_EQUAL
            : TokenType.LESS,
          null,
        );
        break;
      case ">":
      case "➡":
        this.add_token(
          this.match("=") || this.match("✔")
            ? TokenType.GREATER_EQUAL
            : TokenType.GREATER,
          null,
        );
        break;
      case "\n":
        this.line++;
        break;
      case "\t":
        break;
      case '"':
        this.string();
        break;
      case " ":
      case "\r":
        break;
      default:
        if (this.is_digit(c)) {
          this.number();
        } else if (this.is_alpha(c)) {
          this.identifier();
        } else {
          errorReporter.report(new SyntaxError(null, "Unexpected character."));
        }
        break;
    }
  }

  get_tokens() {
    this.logger.info(this.tokens);
  }
}
