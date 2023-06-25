import { Token } from "./token";

export interface Expr {
  accept<T>(visitor: ExprVisitor<T>): T;
}

export interface Stmt {
  accept<T>(visitor: StmtVisitor<T>): T;
}
export interface ExprVisitor<T> {
  visitBinaryExpr(expr: BinaryExpr): T;
  visitGroupingExpr(expr: GroupingExpr): T;
  visitLiteralExpr(expr: LiteralExpr): T;
  visitUnaryExpr(expr: UnaryExpr): T;
}

export type SyntaxVisitor<E, S> = ExprVisitor<E> & StmtVisitor<S>;

export interface StmtVisitor<T> {
  visitExpressionStmt(stmt: Expr): T;
}

/**
 * LiteralExpr - number, true , false, null , string
 *  GroupingExpr = ( | &
 *  BinaryExpr  = + - / *
 *  UnaryExpr  = - & !
 */

export class BinaryExpr implements Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}

export class UnaryExpr implements Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
}

export class GroupingExpr implements Expr {
  left: Expr;
  operator: Token;
  right: Expr;
  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }
}

export class LiteralExpr implements Expr {
  left: Expr;
  operator: Token;
  right: Expr;
  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitLiteralExpr(this);
  }
}

export class AstPrinter implements SyntaxVisitor<string, string> {
  strigify(expr: Expr | Stmt | Stmt[]): string {
    if (Array.isArray(expr)) {
      return expr.map((e) => e.accept(this)).join("\n");
    } else {
      return expr.accept(this);
    }
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    return `(${name} ${exprs.map((e) => e.accept(this)).join(" ")})`;
  }

  private indent(line: string): string {
    return line.split("\n").map((line) => `  ${line}`).join("\n");
  }

  visitBinaryExpr(expr: BinaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr: GroupingExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitLiteralExpr(expr: LiteralExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitUnaryExpr(expr: UnaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitExpressionStmt(stmt: Expr): string {
    return this.parenthesize("expression", stmt);
  }
}
