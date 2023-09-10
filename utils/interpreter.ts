import * as Ast from "./ast";
import { errorReporter, RuntimeError } from "./log";
import { LoxInstance, LoxObject, LoxCallable, LoxClockFunction } from "./types";
import { Environment } from "./environment";
import { TokenType, LoxFunction, LoxClass } from "./types";
import { Token } from "./token";

export class Interpreter implements Ast.SyntaxVisitor<LoxObject, void> {
  private globals = new Environment();
  private environment = this.globals;
  private locals = new Map<Ast.Expr, number>();

  constructor() {
    this.globals.define("clock", new LoxClockFunction());
  }

  public executeBlock(statements: Ast.Stmt[], environment: Environment) {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  private evaluate(expr: Ast.Expr): LoxObject {
    return expr.accept(this);
  }
  resolve(expr: Ast.Expr, depth: number) {
    this.locals.set(expr, depth);
  }
  private lookUpVariable(name: Token, expr: Ast.Expr) {
    const distance = this.locals.get(expr);
    if (distance != undefined) {
      return this.environment.getAt(distance, name);
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
      try {
        for (const statement of target) {
          this.execute(statement);
        }
      } catch (error) {
        errorReporter.report(error as Error);
      }
    } else {
      let value = this.evaluate(target);
      console.log(value);
    }
  }

  //statements start
  visitReturnStmt(stmt: Ast.ReturnStmt): void {
    let value = null;
    if (stmt.value !== null) value = this.evaluate(stmt.value);

    throw new LoxFunction.Return(value);
  }

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
    console.log(this.stringify(value));
  }

  visitBlockStmt(expr: Ast.BlockStmt): void {
    let newEnvironment = new Environment(this.environment);
    this.executeBlock(expr.statements, newEnvironment);
  }

  // expr starts
  checkNumberOperand(operator: Token, right: LoxObject) {
    if (typeof right === "number") return;

    errorReporter.report(
      new RuntimeError(operator, "Operand must be a number"),
    );
  }
  checkNumberOperands(operator: Token, left: LoxObject, right: LoxObject) {
    if (typeof left === "number" && typeof right === "number") return;
    errorReporter.report(
      new RuntimeError(operator, "Operands must be numbers."),
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
    return this.lookUpVariable(expr.keyword, expr);
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
    /*     return this.environment.get(expr.name); */
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
    /* let value = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value; */
  }

  visitCallExpr(expr: Ast.CallExpr): LoxObject {
    const callee: any = this.evaluate(expr.callee);
    const args = expr.args.map((arg) => this.evaluate(arg));
    if (!(callee instanceof LoxCallable)) {
      errorReporter.report(
        new RuntimeError(expr.paren, "Can only call functions and classes."),
      );
    }
    if (args.length !== callee.arity()) {
      errorReporter.report(
        new RuntimeError(
          expr.paren,
          `Expected ${callee.arity()} arguments but got ${args.length}.`,
        ),
      );
    }
    return callee.call(this, args);
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
    }
  }
  visitFunctionStmt(stmt: Ast.FunctionStmt): void {
    const fun = new LoxFunction(stmt, this.environment, false);
    this.environment.define(stmt.name.lexeme, fun);
  }

  visitClassStmt(expr: Ast.ClassStmt): void {
    this.environment.define(expr.name.lexeme, null);
    let env = this.environment;
    let methods: Record<string, LoxFunction> = {};
    expr.methods.forEach((method) => {
      const fun = new LoxFunction(method, env, method.name.lexeme === "init");
      methods[method.name.lexeme] = fun;
    });
    let klass = new LoxClass(expr.name.lexeme, methods);
    this.environment.assign(expr.name, klass);
  }

  visitSetExpr(expr: Ast.SetExpr): LoxObject {
    const object = this.evaluate(expr.object);
    if (!(object instanceof LoxInstance)) {
      throw errorReporter.report(
        new RuntimeError(expr.name, "Only instances have fields."),
      );
    }
    const value = this.evaluate(expr.value);
    object.set(expr.name, value);
    return value;
  }
  visitGetExpr(expr: Ast.GetExpr): LoxObject {
    const object = this.evaluate(expr.object);
    if (object instanceof LoxInstance) {
      return object.get(expr.name);
    }
    throw errorReporter.report(
      new RuntimeError(expr.name, "Only instances have properties."),
    );
  }
}
