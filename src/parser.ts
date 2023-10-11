import { errorReporter, SyntaxError } from "./error";
import * as ast from "./ast";
import { Token } from "./token";
import { TokenType } from "./types";

/**
 * Parser class
 */
export class Parser {
  private tokens: Token[];
  private current: number;

  constructor() {
    this.tokens = [];
    this.current = 0;
  }

  public setTokens(tokens: Token[]) {
    this.tokens = tokens;
  }

  /**
   * <h3>Parse the expressions</h3>
   * @returns {ast.Expr} expression
   */
  public parse(): ast.Expr {
    try {
      return this.expression();
    } catch (e) {
      console.log(" ===== Pasing expressions error  ======");
      console.log(e);
      console.log(" ===== Pasing expressions error  ======");
      throw e;
    }
  }

  /**
   * <h3>Grammar for Equality</h3>
   * expression     → equality ;
   * equality       → comparison ( ( "!=" | "==" ) comparison )* ;
   * @returns ast.Expr equality
   */
  private equality(): ast.Expr {
    let expr = this.comparison();
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      let operator = this.previous();
      let right = this.comparison();
      expr = new ast.BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  /**
   * <h3>Grammar for Comparison</h3>
   * expression     → comparism;
   * comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
   * @returns {ast.Expr} comparison
   */
  private comparison(): ast.Expr {
    let expr = this.term();
    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      )
    ) {
      let operator = this.previous();
      let right = this.term();
      expr = new ast.BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  /**
   * <h3>Grammar for Term</h3>
   * expression     → term ;
   * term           → factor ( ( "-" | "+" ) factor )* ;
   * @returns ast.Expr term
   */
  private term(): ast.Expr {
    let expr = this.factor();
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      let operator = this.previous();
      let right = this.factor();
      expr = new ast.BinaryExpr(expr, operator, right);
    }

    return expr;
  }

  /**
   * <h3>Grammar for Factor</h3>
   * expression     → factor ;
   * factor         → unary ( ( "/" | "*" ) unary )* ;
   * @returns ast.Expr factor
   */
  private factor(): ast.Expr {
    let expr = this.unary();
    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      let operator = this.previous();
      let right = this.unary();
      expr = new ast.BinaryExpr(expr, operator, right);
    }
    return expr;
  }

  /**
   * <h3>Grammar for Unary</h3>
   * expression     → unary ;
   * unary          → ( "!" | "-" ) Unary
   *               | primary;
   * @returns ast.Expr unary
   */
  private unary(): ast.Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      let operator = this.previous();
      let right = this.unary();
      return new ast.UnaryExpr(operator, right);
    }
    return this.primary();
  }

  /**
   * <h3>Grammar for Literal</h3>
   * expression     → literal;
   * literal -> primary
   * primary → NUMBER | STRING | "true" | "false" | "nil" ;
   * @returns {ast.Expr|never} equality
   */
  private primary(): ast.Expr | never {
    if (this.match(TokenType.FALSE)) return new ast.LiteralExpr(false);
    if (this.match(TokenType.TRUE)) return new ast.LiteralExpr(true);
    if (this.match(TokenType.NIL)) return new ast.LiteralExpr(null);
    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new ast.LiteralExpr(this.previous().literal);
    }
    if (this.match(TokenType.LEFT_PAREN)) {
      let expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new ast.GroupingExpr(expr);
    }
    return errorReporter.report(
      new SyntaxError(this.peek(), "Expect expression."),
    );
  }

  /**
   * <h3>Grammar for Expression</h3>
   * expression     → equality ;
   * @returns {Token} current token
   *
   */
  private expression(): ast.Expr {
    return this.equality();
  }

  /** <h2>Helper utils</h2> */
  /**
   * @param type - {TokenType} to consume
   * @param message - {string} to throw if type is not found
   * @throws {Error | never} returns the token if found, else throws an error
   */
  private consume(type: TokenType, message: string): Token | never {
    if (this.check(type)) return this.advance();
    return errorReporter.report(new SyntaxError(this.peek(), message));
  }
  /**
   * Check if current token is in the given list of types.
   * If so, consume it and return true.
   * @param types - {TokenType[]} to match
   * @returns {boolean}
   */
  private match(...types: TokenType[]): boolean {
    for (let type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  /**
   * @param type - {TokenType} to check
   * @returns {boolean} true if the current token is of the given type
   */
  private check(type: TokenType): boolean {
    if (this.is_at_end()) return false;
    return this.peek().type === type;
  }

  /**
   * @returns {Token} consumes the current token and returns it
   */
  private advance(): Token {
    if (!this.is_at_end()) this.current++;
    return this.previous();
  }

  /**
   * @returns {Token} the previous token
   */
  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  /**
   * @returns {Token} the current token
   */
  private peek(): Token {
    return this.tokens[this.current];
  }

  /**
   * @returns {boolean} true if the current token is at the end
   */
  private is_at_end(): boolean {
    return this.peek().type === "EOF";
  }

  /**
   * Synchronize the parser after an error.
   * @returns {void}
   */
  private synchronize(): void {
    this.advance();
    while (this.is_at_end()) {
      if (this.previous().type === TokenType.SEMICOLON) return;
      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }
      this.advance();
    }
  }
}
