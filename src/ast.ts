import { Token } from "./token";
import { BeerObject } from "./types";

export interface Expr {
  accept<T>(visitor: ExprVisitor<T>): T;
}

export interface ExprVisitor<T> {
  visitBinaryExpr(expr: BinaryExpr): T;
  visitUnaryExpr(expr: UnaryExpr): T;
  visitLiteralExpr(expr: LiteralExpr): T;
  visitGroupingExpr(expr: GroupingExpr): T;
}

export type SyntaxVisitor<E, R> = ExprVisitor<E>;

/** class BinaryExpr */
export class BinaryExpr implements Expr {
  left: Expr;
  operator: Token;
  right: Expr;
  /**
   * @param {Expr} left - The left expression.
   * @param {Token} operator - Operator token.
   * @param {Expr} right - The right expression.
   */
  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  /**
   * @template T - Template Generic
   * @param visitor - ExprVisitor<T>
   * @returns {T} - T
   */
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}

/** class UnaryExpr */
export class UnaryExpr implements Expr {
  operator: Token;
  right: Expr;
  /**
   * @param {Token} operator - Operator token.
   * @param {Expr} right - The right expression.
   */
  constructor(operator: Token, right: Expr) {
    this.operator = operator;
    this.right = right;
  }
  /**
   * @template T - Template Generic
   * @param visitor - ExprVisitor<T>
   * @returns {T} - T
   */
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
}

/** class LiteralExpr */
export class LiteralExpr implements Expr {
  value: BeerObject;
  /**
   * @param {BeerObject} -  value
   */
  constructor(value: BeerObject) {
    this.value = value;
  }

  /**
   * @template T - Template Generic
   * @param visitor - ExprVisitor<T>
   * @returns {T} - T
   */
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitLiteralExpr(this);
  }
}

export class GroupingExpr implements Expr {
  expression: Expr;
  constructor(expression: Expr) {
    this.expression = expression;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }
}

export class AstPrinter implements ExprVisitor<string> {
  /**
   * @param expr - {BinaryExpr} expression
   * @returns string
   */
  visitBinaryExpr(expr: BinaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  /**
   * @param expr -  {UnaryExpr} expression
   * @returns string
   */
  visitUnaryExpr(expr: UnaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  /**
   * @param expr - {LiteralExpr} expression
   * @returns string
   */
  visitLiteralExpr(expr: LiteralExpr): string {
    if (expr.value === null) return "nil";
    return expr.value.toString();
  }

  /**
   * @param expr - {GroupingExpr} expression
   * @returns string
   */
  visitGroupingExpr(expr: GroupingExpr): string {
    return this.parenthesize("group", expr.expression);
  }

  /**
   * @param {string} - name of the expression
   * @param  {...Expr} exprs - {Expr[]} expressions
   * @returns string
   */
  private parenthesize(name: string, ...exprs: Expr[]): string {
    let str = `(${name}`;
    for (const expr of exprs) {
      str += ` ${expr.accept(this)}`;
    }
    str += ")";
    return str;
  }
}
