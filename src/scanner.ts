import { errorReporter, Logger, SyntaxError } from "./error";
import { Token } from "./token";
import { keywords, Literals, TokenType } from "./types";

/**
 * @class Scanner
 * @classdesc Scans the source code string and returns a list of tokens.
 */
export class Scanner implements Scanner {
  private logger: Logger = new Logger();
  private tokens: Token[];
  private source: string;
  private current: number = 0;
  private start: number = 0;
  private line: number = 1;

  /**
   * @param {string} source - the source code string
   */
  constructor(source: string) {
    this.source = source;
    this.tokens = [];
    this.current = 0;
    this.start = 0;
    this.line = 1;
  }

  /**
   * Scan the source code string and return a list of tokens.
   * updates the tokens property of the class
   * @returns {void}
   */
  public scan_tokens(): void {
    while (!this.is_end()) {
      this.start = this.current;
      this.scan();
    }
    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
  }

  /**
   * Checks if the scanner
   * has reached the end of the source code string
   * @returns {boolean}
   */
  private is_end(): boolean {
    return this.current >= this.source.length;
  }

  /**
   *<p> Consume the next character in the source code string and return it.</p>
   * @returns {string} the next character
   */
  private advance(): string {
    return this.source.charAt(this.current++);
  }

  /**
   * <p>Match the current character
   * in the source code string with expected one</p>
   * @param expected - {string} the expected character
   * @returns
   */
  private match(expected: string) {
    if (this.is_end()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    this.current++;
    return true;
  }

  /**
   * <p>Accumulate tokens at the specific range of the source code string </p>
   * @param type - TokenType
   * @param literal - Literals
   */
  private add_token(type: TokenType, literal: Literals) {
    let text = this.source.substring(this.start, this.current);
    let token = new Token(type, text, literal, this.line);
    this.tokens.push(token);
  }

  /**
   * <p>Lookahead  check the next character
   * but does not consume like this.advance()</p>
   * @see this.advance()
   * @returns {string}
   */
  private peek(): string {
    return this.source.charAt(this.current);
  }

  /**
   * <p>Lookahead  check the current character</p>
   * @returns {string} current character
   */
  private current_char(): string {
    return this.source.charAt(this.current - 1);
  }

  /**
   * Check if is a digit
   * @param c - {string} the character to check
   * @returns {boolean}
   */
  private is_digit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  /**
   * Check if is a letter
   * @param c - {string} the character to check
   * @returns
   */
  private is_alpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
  }

  /**
   * Check if the character is a letter or a digit
   * @param c - {string} the character to check
   * @returns
   */
  private is_alpha_numeric(c: string): boolean {
    return this.is_alpha(c) || this.is_digit(c);
  }

  /**
   *  Look for reserved keywords or identifiers
   */
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

  /**
   * <p>Look for string literals</p>
   */
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

  /**
   * <p>Look for number literals</p>
   */
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

  /**
   * <p>Scan for tokens in the source code string</p>
   **/
  private scan() {
    let c = this.advance();
    switch (c) {
      case "{":
        this.add_token(TokenType.LEFT_BRACE, null);
        break;
      case "}":
        this.add_token(TokenType.RIGHT_BRACE, null);
        break;
      case "(":
        this.add_token(TokenType.LEFT_PAREN, null);
        break;
      case ")":
        this.add_token(TokenType.RIGHT_PAREN, null);
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
      case ";":
        this.add_token(TokenType.SEMICOLON, null);
        break;
      default:
        if (this.is_digit(c)) {
          this.number();
        } else if (this.is_alpha(c)) {
          this.identifier();
        } else {
          // errorReporter.report(new SyntaxError(null, "Unexpected character."));
        }
        break;
    }
  }

  /**
   * <p>Getter for the tokens</p>
   * @returns {Token[]} the tokens
   */
  get_tokens(): Token[] {
    this.logger.info(this.tokens);
    return this.tokens;
  }
}
