import { Token } from "./token";

export interface Expr {
  accept<T>(visitor: ExprVisitor<T>): T;
}

export interface ExprVisitor<T> {
  visitBinaryExpr(expr: BinaryExpr): T;
}

export type SyntaxVisitor<E, R> = ExprVisitor<E>;

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

export class AstPrinter implements ExprVisitor<string> {
  visitBinaryExpr(expr: BinaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }
  private parenthesize(name: string, ...exprs: Expr[]): string {
    let str = `(${name}`;
    for (const expr of exprs) {
      str += ` ${expr.accept(this)}`;
    }
    str += ")";
    return str;
  }
}
