import * as ast from "./ast";
import { errorReporter } from "./error";
import { Token } from "./token";
import { BeerObject, TokenType } from "./types";

export class Interpreter implements ast.ExprVisitor<BeerObject> {
  private evaluate(expr: ast.Expr): BeerObject {
    return expr.accept(this);
  }

  private is_equal(a: BeerObject, b: BeerObject): boolean {
    if (a === null && b === null) return true
    if (a === null) return false

    return a === b
  }

  private is_truthy(object: BeerObject): boolean {
    if (object === null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }

  visitBinaryExpr(expr: ast.BinaryExpr) {
    let left = this.evaluate(expr.left);
    let right = this.evaluate(expr.right);
    let operator = expr.operator.type;
    switch (expr.operator.type) {
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) > (right as number);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) >= (right as number);
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) < (right as number);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) <= (right as number);
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) - (right as number);
      case TokenType.BANG_EQUAL:
        return !this.is_equal(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.is_equal(left, right);
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) / (right as number);
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) * (right as number);
      case TokenType.PLUS:
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }
    }
    return null;
  }

  checkNumberOperands(token: Token, left: BeerObject, right: BeerObject): void {
    if (typeof left === "number" && typeof right === "number") return;
    else errorReporter.report(new SyntaxError("Operands must be numbers"));
  }

  visitUnaryExpr(expr: ast.UnaryExpr) {
    let right = this.evaluate(expr.right) as number;
    switch (expr.operator.type) {
      case TokenType.MINUS:
        return -right;
      case TokenType.BANG:
        return !this.is_truthy(right);
    }
    return null;
  }

  visitLiteralExpr(expr: ast.LiteralExpr) {
    return expr.value;
  }

  visitGroupingExpr(expr: ast.GroupingExpr) {
    return this.evaluate(expr.expression);
  }
}
