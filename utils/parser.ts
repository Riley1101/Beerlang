import * as ast from "./ast";
import { error, errorReporter } from "./log";
import { Token } from "./token";
import { TokenType } from "./types";

export class Parser {
  private tokens: Token[];
  private current: number;

  constructor() {
    this.current = 0;
    this.tokens = [];
  }
  set_tokens(tokens: Token[]) {
    this.tokens = tokens;
  }
  public parse(): ast.Stmt[] {
    const statements: ast.Stmt[] = [];
    while (!this.isAtEnd()) {
      try {
        statements.push(this.decleration());
      } catch {
        this.synchronize();
      }
    }
    return statements;
  }

  private decleration(): ast.Stmt {
    if (this.match(TokenType.Class)) return this.classDeclearation();
    if (this.match(TokenType.Fun)) return this.funDeclearation("function");
    if (this.match(TokenType.Var)) return this.varDecleration();
    return this.statement();
  }

  private classDeclearation(): ast.Stmt {
    console.log("classDeclearation");
    const name = this.consume(TokenType.Identifier, "Expect class name.");
    this.consume(TokenType.LeftBrace, "Expect '{' before class body.");
    const methods: ast.FunctionStmt[] = [];
    while (!this.check(TokenType.RightBrace) && !this.isAtEnd()) {
      methods.push(this.funDeclearation("method"));
    }
    this.consume(TokenType.RightBrace, "Expect '}' after class body.");
    console.log("classDeclearation end");
    return new ast.ClassStmt(name, methods);
  }

  private funDeclearation(kind: string) {
    const name = this.consume(TokenType.Identifier, `Expect ${kind} name`);
    this.consume(TokenType.LeftParen, `Expect '(' after ${kind} name`);
    const params: Token[] = [];
    if (!this.check(TokenType.RightParen)) {
      do {
        if (params.length >= 255) {
          errorReporter.report(
            new Error("Can't have more than 255 parameters."),
          );
        }
        params.push(
          this.consume(TokenType.Identifier, "Expect parameter name"),
        );
      } while (this.match(TokenType.Comma));
    }
    this.consume(TokenType.RightParen, "Expect ')' after parameters.");

    this.consume(TokenType.LeftBrace, `Expect '{' before ${kind} body`);
    const body = this.block();
    return new ast.FunctionStmt(name, params, body);
  }

  private varDecleration(): ast.Stmt {
    const name = this.consume(TokenType.Identifier, "Expect variable name.");
    let initializer = null;
    if (this.match(TokenType.Equal)) {
      initializer = this.expression();
    }
    this.consume(TokenType.Semicolon, "Expect ';' after variable declaration.");
    return new ast.VarStmt(name, initializer);
  }

  private synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.Semicolon) return;
      switch (this.peek().type) {
        case TokenType.Class:
        case TokenType.Fun:
        case TokenType.Var:
        case TokenType.For:
        case TokenType.If:
        case TokenType.While:
        case TokenType.Print:
        case TokenType.Return:
          return;
      }
      this.advance();
    }
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw error(this.peek().line, message);
  }

  private peek(): Token {
    return this.tokens[this.current] as Token;
  }

  private previous(): Token {
    return this.tokens[this.current - 1] as Token;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private check(type: TokenType): boolean {
    return this.isAtEnd() ? false : this.peek().type === type;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private logicalAnd(): ast.Expr {
    let expr = this.equality();
    while (this.match(TokenType.And)) {
      let operator = this.previous();
      let right = this.equality();
      expr = new ast.LogicalExpr(expr, operator, right);
    }
    return expr;
  }

  private logicalOr(): ast.Expr {
    let expr = this.logicalAnd();
    while (this.match(TokenType.Or)) {
      let operator = this.previous();
      let right = this.logicalAnd();
      expr = new ast.LogicalExpr(expr, operator, right);
    }
    return expr;
  }

  private assignment(): ast.Expr {
    // current
    let expr = this.logicalOr();
    if (this.match(TokenType.Equal)) {
      let value = this.assignment();
      if (expr instanceof ast.VariableExpr) {
        let name = expr.name;
        return new ast.AssignExpr(name, value);
      } else if (expr instanceof ast.GetExpr) {
        return new ast.SetExpr(expr.object, expr.name, value);
      }
      error(this.peek().line, "Invalid assignment target.");
    }
    return expr;
  }

  private expression(): ast.Expr {
    return this.assignment();
  }

  private primary(): ast.Expr {
    if (this.match(TokenType.False)) return new ast.LiteralExpr(false);
    if (this.match(TokenType.True)) return new ast.LiteralExpr(true);
    if (this.match(TokenType.Nil)) return new ast.LiteralExpr(null);
    if (this.match(TokenType.Number, TokenType.String))
      return new ast.LiteralExpr(this.previous().literal);
    // if (this.match(TokenType.This), TokenType.This) return new
    // ast.ThisExpr(this.previous())
    if (this.match(TokenType.LeftParen)) {
      let expr = this.expression();
      this.consume(TokenType.RightParen, "Expect ')' after expression.");
      return new ast.GroupingExpr(expr);
    }
    if (this.match(TokenType.Identifier)) {
      return new ast.VariableExpr(this.previous());
    }
    throw error(this.peek().line, "Expect expression.");
  }

  private unary(): ast.Expr {
    if (this.match(TokenType.Bang, TokenType.Minus)) {
      let operator = this.previous();
      let right = this.unary();
      return new ast.UnaryExpr(operator, right);
    }
    return this.call();
  }

  private call(): ast.Expr {
    let expr = this.primary();
    while (true) {
      if (this.match(TokenType.LeftParen)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.Dot)) {
        const token = this.consume(
          TokenType.Identifier,
          "Expect property name after '.'.",
        );
        expr = new ast.GetExpr(expr, token);
      } else {
        break;
      }
    }
    return expr;
  }

  private finishCall(callee: ast.Expr): ast.Expr {
    const args: ast.Expr[] = [];
    if (!this.check(TokenType.RightParen)) {
      do {
        if (args.length >= 255) {
          error(this.peek().line, "Cannot have more than 255 arguments.");
        }
        args.push(this.expression());
      } while (this.match(TokenType.Comma));
    }
    let paren = this.consume(
      TokenType.RightParen,
      "Expect ')' after arguments.",
    );
    return new ast.CallExpr(callee, paren, args);
  }

  private factor(): ast.Expr {
    let expr = this.unary();
    while (this.match(TokenType.Slash, TokenType.Star)) {
      let operator = this.previous();
      let right = this.unary();
      expr = new ast.BinaryExpr(expr, operator, right);
    }
    return expr;
  }

  private term(): ast.Expr {
    let expr = this.factor();
    while (this.match(TokenType.Minus, TokenType.Plus)) {
      let operator = this.previous();
      let right = this.factor();
      expr = new ast.BinaryExpr(expr, operator, right);
    }
    return expr;
  }

  private comparism(): ast.Expr {
    let expr = this.term();
    while (
      this.match(
        TokenType.Greater,
        TokenType.GreaterEqual,
        TokenType.Less,
        TokenType.LessEqual,
      )
    ) {
      let operator = this.previous();
      let right = this.term();
      expr = new ast.BinaryExpr(expr, operator, right);
    }
    return expr;
  }

  private equality() {
    let expr = this.comparism();
    while (this.match(TokenType.BangEqual, TokenType.EqualEqual)) {
      let operator = this.previous();
      let right = this.comparism();
      expr = new ast.BinaryExpr(expr, operator, right);
    }
    return expr;
  }

  private block() {
    const statements = [];
    while (!this.check(TokenType.RightBrace) && !this.isAtEnd()) {
      statements.push(this.decleration());
    }
    this.consume(TokenType.RightBrace, "Expect '}' after block.");
    return statements;
  }

  private printStatement(): ast.Stmt {
    let value = this.expression();
    this.consume(TokenType.Semicolon, "Expect ';' after expression.");
    return new ast.PrintStmt(value);
  }

  private expressionStatement(): ast.Stmt {
    let expr = this.expression();
    this.consume(TokenType.Semicolon, "Expect ';' after expression.");
    return new ast.ExpressionStmt(expr);
  }

  private returnStatement(): ast.Stmt {
    let keyword = this.previous();
    let value = null;
    if (!this.check(TokenType.Semicolon)) {
      value = this.expression();
    }
    this.consume(TokenType.Semicolon, "Expect ';' after return value.");
    return new ast.ReturnStmt(keyword, value as ast.Expr);
  }

  private statement(): ast.Stmt {
    if (this.match(TokenType.Print)) return this.printStatement();
    if (this.match(TokenType.Return)) return this.returnStatement();
    if (this.match(TokenType.LeftBrace)) return new ast.BlockStmt(this.block());
    if (this.match(TokenType.If)) return this.ifStatement();
    if (this.match(TokenType.While)) return this.whileStatement();
    if (this.match(TokenType.For)) return this.forStatement();
    return this.expressionStatement();
  }

  private forStatement(): ast.Stmt {
    this.consume(TokenType.LeftParen, "Expect '(' after 'for'.");
    let initializer;
    if (this.match(TokenType.Semicolon)) {
      initializer = null;
    } else if (this.match(TokenType.Var)) {
      initializer = this.varDecleration();
    } else {
      initializer = this.expressionStatement();
    }
    let condition = null;
    if (!this.check(TokenType.Semicolon)) {
      condition = this.expression();
    }
    this.consume(TokenType.Semicolon, "Expect ';' after loop condition.");
    let increment = null;
    if (!this.check(TokenType.RightParen)) {
      increment = this.expression();
    }
    this.consume(TokenType.RightParen, "Expect ')' after for clauses.");
    let body = this.statement();
    if (increment !== null) {
      body = new ast.BlockStmt([body, new ast.ExpressionStmt(increment)]);
    }
    if (condition === null) condition = new ast.LiteralExpr(true);
    body = new ast.WhileStmt(condition, body);
    if (initializer !== null) {
      body = new ast.BlockStmt([initializer, body]);
    }
    return body;
  }

  private whileStatement(): ast.Stmt {
    this.consume(TokenType.LeftParen, "Expect '(' after 'while'.");
    let condition = this.expression();
    this.consume(TokenType.RightParen, "Expect ')' after condition.");
    let body = this.statement();
    return new ast.WhileStmt(condition, body);
  }
  private ifStatement(): ast.Stmt {
    this.consume(TokenType.LeftParen, "Expect '(' after 'if'.");
    let condition = this.expression();
    this.consume(TokenType.RightParen, "Expect ')' after if condition.");
    let thenBranch = this.statement();
    let elseBranch = null;
    if (this.match(TokenType.Else)) {
      elseBranch = this.statement();
    }
    return new ast.IfStmt(condition, thenBranch, elseBranch);
  }
}
