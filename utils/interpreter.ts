import * as Ast from "./ast";
import { error } from "./log";
import type { LoxObject } from "./types";
import { TokenType } from "./types";
import { Token } from "./token";

export class Interpreter implements Ast.ExprVisitor<LoxObject> {
  private evaluate(expr: Ast.Expr): LoxObject {
    return expr.accept(this);
  }

  private isEqual(a: LoxObject, b: LoxObject) {
    if (a == null && b == null) return true;
    if (a == null) return false;
    return a === b;
  }

  interpret(expr: Ast.Expr) {
    try {
      let value = this.evaluate(expr);
      console.log(value);
    } catch (err) {
      error(0, "Run time err at interpret");
    }
  }

  checkNumberOperand(operator: Token, left: LoxObject, right: LoxObject) {
    if (typeof left === "number" && typeof right === "number") return;
    throw new Error(`Operand must be number`);
  }

  visitLiteralExpr(expr: Ast.LiteralExpr): LoxObject {
    return expr.value;
  }

  visitBinaryExpr(expr: Ast.BinaryExpr): LoxObject {
    let left = this.evaluate(expr.left);
    let right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.Minus:
        this.checkNumberOperand(expr.operator, left, right);
        return (left as number) - (right as number);
      case TokenType.Slash:
        this.checkNumberOperand(expr.operator, left, right);
        return (left as number) / (right as number);
      case TokenType.Star:
        this.checkNumberOperand(expr.operator, left, right);
        return (left as number) * (right as number);
      case TokenType.Greater:
        this.checkNumberOperand(expr.operator, left, right);
        return (left as number) > (right as number);
      case TokenType.GreaterEqual:
        this.checkNumberOperand(expr.operator, left, right);
        return (left as number) >= (right as number);
      case TokenType.Less:
        this.checkNumberOperand(expr.operator, left, right);
        return (left as number) < (right as number);
      case TokenType.LessEqual:
        this.checkNumberOperand(expr.operator, left, right);
        return (left as number) <= (right as number);
      case TokenType.EqualEqual:
        return this.isEqual(left, right);
      case TokenType.BangEqual:
        return !this.isEqual(left, right);
      case TokenType.Plus:
        this.checkNumberOperand(expr.operator, left, right);
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
    return null;
  }
  visitLogicalExpr(expr: Ast.LogicalExpr): LoxObject {
    return null;
  }
  visitGroupingExpr(expr: Ast.GroupingExpr): LoxObject {
    return null;
  }
  visitVariableExpr(expr: Ast.VariableExpr): LoxObject {
    return null;
  }
  visitAssignmentExpr(expr: Ast.AssignmentExpr): LoxObject {
    return null;
  }
}
