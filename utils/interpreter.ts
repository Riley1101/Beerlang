import * as Ast from "./ast";
import { errorReporter, RuntimeError } from "./log";
import type { LoxObject } from "./types";
import { Environment } from "./environment";
import { TokenType } from "./types";
import { Token } from "./token";

export class Interpreter implements Ast.SyntaxVisitor<LoxObject, void> {
  private globals = new Environment();
  private environment = this.globals;
  private locals = new Map<Ast.Expr, number>();
  private evaluate(expr: Ast.Expr): LoxObject {
    return expr.accept(this);
  }
  resolve(expr: Ast.Expr, depth: number) {
    this.locals.set(expr, depth);
  }
  private lookUpVariable(name: Token, expr: Ast.Expr) {
    const distance = this.locals.get(expr);
    if (distance != undefined) {
      return this.environment.getAt(distance, name.lexeme);
    } else {
      return this.globals.get(name);
    }
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

  private execute(stmt: Ast.Stmt): void {
    stmt.accept(this);
  }

  private stringify(object: LoxObject): string {
    if (object == null) return "nil";
    return object.toString();
  }

  interpret(target: Ast.Expr | Ast.Stmt[]) {
    if (Array.isArray(target)) {
      for (const statement of target) {
        statement && this.execute(statement);
      }
      // expr evaulate
    } else {
      let value = this.evaluate(target);
    }
  }

  private executeBlock(statements: Ast.Stmt[], environment: Environment) {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (const statement of statements) {
        statement && this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  //statements start
  visitVarStmt(expr: Ast.VarStmt): void {
    let value: LoxObject = null;
    if (expr.initializer !== null) {
      value = this.evaluate(expr.initializer);
    }
    this.environment.define(expr.name.lexeme, value);
  }

  visitExpressionStmt(stmt: Ast.ExpressionStmt): void {
    this.evaluate(stmt.expression);
  }

  visitPrintStmt(expr: Ast.PrintStmt): void {
    const value = this.evaluate(expr.expression);
    console.log(value);
  }

  visitBlockStmt(expr: Ast.BlockStmt): void {
    let newEnvironment = new Environment(this.environment);
    this.executeBlock(expr.statements, newEnvironment);
  }

  // expr starts
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
    }
    return null;
  }

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
        return -(right as number);
    }
    return null;
  }

  visitLogicalExpr(expr: Ast.LogicalExpr): LoxObject {
    let left = this.evaluate(expr.left);
    if (expr.operator.type === TokenType.Or) {
      if (this.isTruthy(left)) return left;
    } else {
      if (!this.isTruthy(left)) return left;
    }
    return this.evaluate(expr.right);
  }

  visitGroupingExpr(expr: Ast.GroupingExpr): LoxObject {
    return this.evaluate(expr.expression);
  }
  visitVariableExpr(expr: Ast.VariableExpr): LoxObject {
    return this.lookUpVariable(expr.name, expr);
  }
  visitAssignExpr(expr: Ast.AssignExpr): LoxObject {
    let value = this.evaluate(expr.value);
    const distance = this.locals.get(expr);
    if (distance != null) {
      this.environment.assignAt(distance, expr.name, value);
    } else {
      this.globals.assign(expr.name, value);
    }
    return value;
  }

  visitIfStmt(expr: Ast.IfStmt): void {
    if (this.isTruthy(this.evaluate(expr.condition))) {
      this.execute(expr.thenBranch);
    } else if (expr.elseBranch !== null) {
      this.execute(expr.elseBranch);
    }
  }
  visitWhileStmt(expr: Ast.WhileStmt): void {
    while (this.isTruthy(this.evaluate(expr.condition))) {
      this.execute(expr.body);
    }
  }

  visitForStmt(expr: Ast.ForStmt): void {
    if (expr.initializer !== null) {
      this.evaluate(expr.initializer);
    }
    while (this.isTruthy(this.evaluate(expr.condition as Ast.Expr))) {
      this.execute(expr.body);
      this.evaluate(expr.increment as Ast.Expr);
    }
  }
}
