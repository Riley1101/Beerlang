import * as Ast from "./ast";
import { errorReporter, RuntimeError } from "./log";
import type { LoxObject } from "./types";

import { TokenType } from "./types";
import { Token } from "./token";

export class Interpreter implements Ast.ExprVisitor<LoxObject> {
  private evaluate(expr: Ast.Expr): LoxObject {
    return expr.accept(this);
  }

  private isTruthy(object: LoxObject) {
    if (object == null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }

  private isEqual(a: LoxObject, b: LoxObject) {
    if (a == null && b == null) return true;
    if (a == null) return false;
    return a === b;
  }

  interpret(expr: Ast.Expr) {
    let value = this.evaluate(expr);
    console.log(value);
  }

  checkNumberOperand(operator: Token, right: LoxObject) {
    if (typeof right === "number") return;
    errorReporter.report(
      new RuntimeError(operator, "Operand must be a number")
    );
  }
  checkNumberOperands(operator: Token, left: LoxObject, right: LoxObject) {
    if (typeof left === "number" && typeof right === "number") return;
    errorReporter.report(
      new RuntimeError(operator, "Operands must be numbers.")
    );
  }

  visitLiteralExpr(expr: Ast.LiteralExpr): LoxObject {
    return expr.value;
  }

  visitBinaryExpr(expr: Ast.BinaryExpr): LoxObject {
    let left = this.evaluate(expr.left);
    let right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.Minus:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) - (right as number);
      case TokenType.Slash:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) / (right as number);
      case TokenType.Star:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) * (right as number);
      case TokenType.Greater:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) > (right as number);
      case TokenType.GreaterEqual:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) >= (right as number);
      case TokenType.Less:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) < (right as number);
      case TokenType.LessEqual:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) <= (right as number);
      case TokenType.EqualEqual:
        return this.isEqual(left, right);
      case TokenType.BangEqual:
        return !this.isEqual(left, right);
      case TokenType.Plus:
        this.checkNumberOperands(expr.operator, left, right);
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }
        break;
    }
    return null;
  }
  /** todo */
  visitThisExpr(expr: Ast.ThisExpr): LoxObject {
    return null;
  }
  visitSuperExpr(expr: Ast.SuperExpr): LoxObject {
    return null;
  }
  visitUnaryExpr(expr: Ast.UnaryExpr): LoxObject {
    let right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.Bang:
        return this.isTruthy(right);
      case TokenType.Minus:
        this.checkNumberOperand(expr.operator, right);
        console.log(right);
        return -(right as number);
    }
    return null;
  }
  visitLogicalExpr(expr: Ast.LogicalExpr): LoxObject {
    return null;
  }
  visitGroupingExpr(expr: Ast.GroupingExpr): LoxObject {
    return this.evaluate(expr.expression);
  }
  visitVariableExpr(expr: Ast.VariableExpr): LoxObject {
    return null;
  }
  visitAssignmentExpr(expr: Ast.AssignmentExpr): LoxObject {
    return null;
  }
}
