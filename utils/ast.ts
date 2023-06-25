import { Token } from "./token";

export interface Expr {
  accept<T>(visitor: ExprVisitor<T>): T;
}

export interface Stmt {
  accept<T>(visitor: StmtVisitor<T>): T;
}

export interface ExprVisitor<T> {
  visitBinaryExpr(expr: BinaryExpr): T;
}

export type SynaxVisitor<T> = ExprVisitor<T> & StmtVisitor<T>;

export interface StmtVisitor<T> {
    visitExpressionStmt(stmt: Expr): T;
}

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

export class AstPrinter {}
