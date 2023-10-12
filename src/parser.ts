import * as ast from "./ast";
import { errorReporter, SyntaxError } from "./error";
import { Token } from "./token";
import { TokenType } from "./types";

/**
 * Parser class
 * @class parser
 * @classdesc Parser class to parse the tokens into ast
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
   */
  public parse() {
    const statements: ast.Stmt[] = [];
    while (!this.is_at_end()) {
      try {
        statements.push(this.declaration());
      } catch (e) {
        if (e instanceof SyntaxError) {
          throw errorReporter.report(e);
        }
        this.synchronize();
      }
    }
    return statements;
  }

  /**
   * <h3>Grammar for declearation</h3>
   * declaration   → varDecl
   *             | statement ;
   * @returns ast.Stmt
   */
  private declaration() {
    if (this.match(TokenType.VAR)) {
      return this.var_declaration();
    }
    return this.statement();
  }

  /**
   * <h3>Grammar for var declaration</h3>
   *     varDecl       → "var" IDENTIFIER ( "=" expression )? ";" ;
   *     @returns ast.Stmt
   */
  private var_declaration(): ast.Stmt {
    const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");
    let initializer = null;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
    return new ast.VarStmt(name, initializer);
  }

  /**
   * <h3>Grammar for block</h3>
   * block          → "{" declaration* "}" ;
   * @returns ast.Stmt
   */
  private block(): ast.Stmt[] {
    const statements: ast.Stmt[] = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.is_at_end()) {
      statements.push(this.declaration());
    }
    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
  }

  /**
   * <h3>Ecaluation of statements</h3>
   * statement     → expressionStmt
   *            | ifStmt ;
   *            | printStmt ;
   *            | while ;
   *            | block ;
   * @returns ast.Stmt
   */
  private statement(): ast.Stmt {
    if (this.match(TokenType.IF)) return this.if_statement();
    if (this.match(TokenType.PRINT)) return this.print_statement();
    if (this.match(TokenType.WHILE)) return this.while_statement();
    if (this.match(TokenType.LEFT_BRACE))
      return new ast.BlockStmt(this.block());
    return this.expression_statement();
  }

  private while_statement(): ast.Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
    const body = this.statement();
    return new ast.WhileStmt(condition, body);
  }

  /**
   * <h3>Evaluation of if statement</h3>
   * ifStmt        → "if" "(" expression ")" statement ( "else" statement )? ;
   * @returns ast.Stmt
   */
  private if_statement(): ast.Stmt {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.");
    const then_branch = this.statement();
    let else_branch = null;
    if (this.match(TokenType.ELSE)) {
      else_branch = this.statement();
    }
    return new ast.IfStmt(condition, then_branch, else_branch);
  }

  /**
   * <h3>Evaluation of Print</h3>
   * printStmt     → expression
   *             | "print" expression
   * @returns ast.Stmt ast of print
   */
  private print_statement(): ast.Stmt {
    let value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new ast.PrintStmt(value);
  }

  /**
   * <h3>Evaluation of Expression</h3>
   * expressionStmt → expression
   * @returns ast.Stmt
   */
  private expression_statement(): ast.Stmt {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
    return new ast.ExpressionStmt(expr);
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
    if (this.match(TokenType.IDENTIFIER)) {
      return new ast.VariableExpr(this.previous());
    }
    return errorReporter.report(
      new SyntaxError(this.peek(), "Expect expression."),
    );
  }

  /**
   * <h3>Grammar for Expression</h3>
   * expression     → assignment;
   * assignment     → IDENTIFIER "=" assignment
   * @returns {Token} current token
   *
   */
  private expression(): ast.Expr {
    return this.assignment();
  }

  /**
   * <h3>Grammar for Assignment</h3>
   * assignment     → IDENTIFIER "=" assignment
   *              | logic_or ;
   * @returns {ast.Expr} assignment
   */
  private assignment(): ast.Expr {
    let expr = this.or();
    if (this.match(TokenType.EQUAL)) {
      let equals = this.previous();
      let value = this.assignment();
      if (expr instanceof ast.VariableExpr) {
        let name = expr.name;
        return new ast.AssignExpr(name, value);
      }
      errorReporter.report(
        new SyntaxError(equals, "Invalid assignment target."),
      );
    }
    return expr;
  }

  /**
   * <h3>Grammar for Logic Or</h3>
   * expression     → logic_or;
   * logic_or       → logic_and ( "or" logic_and )* ;
   * @returns {ast.Expr} logic_or
   */
  private or(): ast.Expr {
    let expr = this.and();
    while (this.match(TokenType.OR)) {
      let operator = this.previous();
      let right = this.and();
      expr = new ast.LogicalExpr(expr, operator, right);
    }
    return expr;
  }

  /**
   * <h3>Grammar for Logic And</h3>
   * expression     → logic_and;
   * logic_and      → equality ( "and" equality )* ;
   * @returns {ast.Expr} logic_and
   */
  private and(): ast.Expr {
    let expr = this.equality();
    while (this.match(TokenType.AND)) {
      let operator = this.previous();
      let right = this.equality();
      expr = new ast.LogicalExpr(expr, operator, right);
    }
    return expr;
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
