/**
 * @namespace Interpreter
 * @file interpreter.ts
 * @description Defines the main Interpreter class.
 */
import * as ast from "./ast";
import { Environment } from "./environment";
import { errorReporter } from "./error";
import { Token } from "./token";
import {
  BeerObject,
  TokenType,
  BeerCallable,
  BeerFunction,
  BeerClock,
  BeerClass,
  BeerInstance,
} from "./types";

/**
 * The interpreter class is responsible for evaluating the AST
 * @class BeerInterpreter
 */
export class Beer implements ast.SyntaxVisitor<BeerObject, void> {
  public globals: Environment = new Environment();

  private environment: Environment = this.globals;

  private locals: Map<ast.Expr, number> = new Map();
  /**
   * define clock native function
   * @memberof Interpreter
   */
  constructor() {
    this.globals.define("clock", new BeerClock());
  }
  /** ========================== Utility Methods ========================== */

  /**
   * Set resolved values to the locals of the interpreter
   * @param expr - ast.Expr to be interpreted
   * @param depth - The depth of the expression
   * @returns {void}
   */
  resolve(expr: ast.Expr, depth: number): void {
    this.locals.set(expr, depth);
  }

  private look_up_variable(name: Token, expr: ast.Expr): BeerObject {
    const distance = this.locals.get(expr);
    if (distance !== undefined) {
      return this.environment.get_at(distance, name.lexeme);
    } else {
      return this.globals.get(name.lexeme);
    }
  }

  /**
   * @param expr - ast.Expr to be interpreted
   * @returns {void}
   */
  public interpret(exprs: ast.Stmt[]): void {
    try {
      for (let expr of exprs) {
        this.execute(expr);
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * Analog to this.evaluate() but for statements
   * @param stmt - ast.Stmt to be executed
   * @returns {void}
   */
  private execute(stmt: ast.Stmt): void {
    stmt.accept(this);
  }

  /**
   * Evaluates the AST via visitor
   * @param expr - The expression to be evaluated
   * @returns
   */
  private evaluate(expr: ast.Expr): BeerObject {
    return expr.accept(this);
  }

  /**
   * @param a - BeerObject
   * @param b - BeerObject
   * @returns {boolean} true if a and b are equal, false otherwise
   */
  private is_equal(a: BeerObject, b: BeerObject): boolean {
    if (a === null && b === null) return true;
    if (a === null) return false;
    return a === b;
  }

  /**
   * Checks if the operands are numbers
   * @param {Token} token of the operator
   * @param {BeerObject} left
   * @param {BeerObject} right
   * @returns {void | never}
   */
  checkNumberOperands(token: Token, left: BeerObject, right: BeerObject): void {
    if (typeof left === "number" && typeof right === "number") return;
    else
      errorReporter.report(
        new SyntaxError(
          "Operands must be numbers at " + token.line + token.lexeme,
        ),
      );
  }
  /**
   * Checks if the object is truthy
   * @param object - BeerObject
   * @returns {boolean}
   */
  private is_truthy(object: BeerObject): boolean {
    if (object === null) return false;
    if (typeof object === "boolean") return object;
    return true;
  }

  /**
   * Converts the object to a string representation
   * @param object - BeerObject
   * @returns {string} string representation of the object
   */
  private stringify(object: BeerObject): string {
    if (object === null) return "nil";
    if (typeof object === "number") return object.toString();
    if (object instanceof BeerCallable) return object.to_string();
    if (object instanceof BeerInstance) return object.to_string();
    return object.toString();
  }

  /**
   * Execute a list of statements in an given environment
   * @param statements - list of statements
   * @param environment - environment to execute the statements in.
   */
  public execute_block(statements: ast.Stmt[], environment: Environment): void {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (let statement of statements) {
        statement && this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  /** ========================== Visitor Methods ========================== */

  /** ========================== Expressions ========================== */

  /**
   * Visitor for this in classes
   * @param expr - {ast.ThisExpr} expression
   * @returns
   */
  visitThisExpr(expr: ast.ThisExpr): BeerObject {
    return this.look_up_variable(expr.keyword, expr);
  }

  /**
   * @param expr - {ast.LiteralExpr} expression
   * @returns { BeerObject  }
   */
  visitAssignExpr(expr: ast.AssignExpr): BeerObject {
    let value = this.evaluate(expr.value);
    let distance = this.locals.get(expr);
    if (distance !== undefined) {
      this.environment.assign_at(distance, expr.name.lexeme, value);
    } else {
      this.globals.assign(expr.name.lexeme, value);
    }
    return value;
  }
  /**
   * @param {ast.BinaryExpr} expr - The expression to be evaluated
   * @returns { BeerObject | never }
   */
  visitBinaryExpr(expr: ast.BinaryExpr): BeerObject {
    let left = this.evaluate(expr.left);
    let right = this.evaluate(expr.right);
    let operator = expr.operator.type;
    switch (operator) {
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
        errorReporter.report(
          new SyntaxError(
            "Operands must be two numbers or two strings at " +
              expr.operator.line +
              expr.operator.lexeme,
          ),
        );
    }
    return null;
  }

  /**
   * @param expr - The expression to be evaluated
   * @returns BeerObject;
   */
  visitUnaryExpr(expr: ast.UnaryExpr): BeerObject {
    let right = this.evaluate(expr.right) as number;
    switch (expr.operator.type) {
      case TokenType.MINUS:
        return -right;
      case TokenType.BANG:
        return !this.is_truthy(right);
    }
    return null;
  }

  /**
   * @param expr - The expression to be evaluated
   * @returns BeerObject;
   */
  visitLiteralExpr(expr: ast.LiteralExpr): BeerObject {
    return expr.value;
  }

  /**
   * @param expr - The expression to be evaluated
   * @returns BeerObject;
   */
  visitGroupingExpr(expr: ast.GroupingExpr): BeerObject {
    return this.evaluate(expr.expression);
  }

  /**
   * Find the value of the variable in the environment
   * @param expr - The expression to be evaluated
   * @returns BeerObject;
   */
  visitVariableExpr(expr: ast.VariableExpr): BeerObject {
    return this.look_up_variable(expr.name, expr);
  }

  visitLogicalExpr(expr: ast.LogicalExpr): BeerObject {
    let left = this.evaluate(expr.left);
    if (expr.operator.type === TokenType.OR) {
      if (this.is_truthy(left)) return left;
    } else {
      if (!this.is_truthy(left)) return left;
    }
    return this.evaluate(expr.right);
  }

  /**
   * @param expr - TODO
   * @returns
   */
  visitCallExpr(expr: ast.CallExpr): BeerObject {
    let callee = this.evaluate(expr.callee);
    let args = [];
    for (let arg of expr.args) {
      args.push(this.evaluate(arg));
    }
    if (!(callee instanceof BeerCallable)) {
      throw errorReporter.report(
        new SyntaxError("Can only call functions and classes."),
      );
    }
    if (args.length !== callee.arity()) {
      throw errorReporter.report(
        new SyntaxError(
          `Expected ${callee.arity()} arguments but got ${args.length}.`,
        ),
      );
    }
    let func = callee;
    return func.call(this, args);
  }
  /** ========================== Statements ========================== */

  /**
   * @param stmt - The statement to be evaluated
   */
  visitClassStmt(stmt: ast.ClassStmt): void {
    let superclass = null;
    if (stmt.superclass !== null) {
      superclass = this.evaluate(stmt.superclass);
      if (!(superclass instanceof BeerClass)) {
        throw errorReporter.report(
          new SyntaxError("Superclass must be a class."),
        );
      }
    }
    this.environment.define(stmt.name.lexeme, null);
    if (stmt.superclass !== null) {
      this.environment = new Environment(this.environment);
      this.environment.define("super", superclass);
    }
    let methods = new Map<string, BeerFunction>();
    for (let method of stmt.methods) {
      let func = new BeerFunction(
        method,
        this.environment,
        method.name.lexeme === "init",
      );
      methods.set(method.name.lexeme, func);
    }
    let cls = new BeerClass(stmt.name.lexeme, methods, superclass);
    if (superclass !== null) {
      this.environment = this.environment.enclosing as Environment;
    }
    this.environment.assign(stmt.name.lexeme, cls);
  }

  /**
   * @param stmt - The statement to be evaluated
   * @returns void;
   */
  visitForStmt(stmt: ast.ForStmt): void {
    if (stmt.initializer) {
      this.execute(stmt.initializer);
    }
    while (this.is_truthy(this.evaluate(stmt.condition as ast.Expr))) {
      this.execute(stmt.body);
      if (stmt.increment === null) {
        return;
      }
      this.evaluate(stmt.increment);
    }
  }

  /**
   * @param stmt - The expression to be evaluated
   * @returns void;
   */
  visitWhileStmt(stmt: ast.WhileStmt): void {
    while (this.is_truthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
    }
  }

  /**
   * @param stmt - The expression to be evaluated
   */
  visitReturnStmt(stmt: ast.ReturnStmt): void {
    let value = null;
    if (stmt.value !== null) value = this.evaluate(stmt.value);
    throw new BeerFunction.Return(value);
  }

  /**
   * @param stmt - The expression to be evaluated
   * @returns void;
   */
  visitFunctionStmt(stmt: ast.FunctionStmt): void {
    let func = new BeerFunction(stmt, this.environment, false);
    this.environment.define(stmt.name.lexeme, func);
    return;
  }

  /**
   * Print the evaluated expression
   * @param stmt - The expression to be evaluated
   * @returns void;
   */
  visitPrintStmt(stmt: ast.PrintStmt): void {
    let value = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
  }

  /**
   * Evaluate the expression
   * @param stmt - The expression to be evaluated
   * @returns void;
   */
  visitExpressionStmt(stmt: ast.ExpressionStmt): void {
    this.evaluate(stmt.expression);
  }

  /**
   * Evaluate the stmt and define in the environment
   * @param stmt - The statment to be evaluated
   * @returns void;
   */
  visitVarStmt(stmt: ast.VarStmt): void {
    let value = null;
    if (stmt.initializer !== null) {
      value = this.evaluate(stmt.initializer);
    }
    this.environment.define(stmt.name.lexeme, value);
  }

  /**
   * @param stmt - The block statement to be evaluated
   *
   */
  visitBlockStmt(stmt: ast.BlockStmt): void {
    this.execute_block(stmt.statements, new Environment(this.environment));
  }

  /**
   * If statement visitor
   * @param stmt - The if statement to be evaluated
   */
  visitIfStmt(stmt: ast.IfStmt): void {
    if (this.is_truthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch !== null) {
      this.execute(stmt.elseBranch);
    }
  }

  /**
   * @param expr - The expression to be evaluated
   * @returns BeerObject;
   */
  visitGetExpr(expr: ast.GetExpr): BeerObject {
    let object = this.evaluate(expr.object);
    if (object instanceof BeerInstance) {
      return object.get(expr.name);
    }
    throw errorReporter.report(
      new SyntaxError("Only instances have properties."),
    );
  }

  /**
   * @param expr - visit for setExpr
   * @returns BeerObject;
   */
  visitSetExpr(expr: ast.SetExpr): BeerObject {
    let object = this.evaluate(expr.object);
    if (!(object instanceof BeerInstance)) {
      throw errorReporter.report(
        new SyntaxError("Only instances have fields."),
      );
    }
    let value = this.evaluate(expr.value);
    object.set(expr.name, value);
    return value;
  }

  /**
   * @param expr - Visitor for GetExpr
   * @returns  BeerObject;
   */
  visitSuperExpr(expr: ast.SuperExpr): BeerObject {
    let distance = this.locals.get(expr) as number;
    let superclass = this.environment.get_at(distance, "super") as BeerClass;
    let object = this.environment.get_at(distance - 1, "this") as BeerInstance;
    let method = superclass.find_method(expr.method.lexeme);
    if (method === null) {
      throw errorReporter.report(
        new SyntaxError(`Undefined property '${expr.method.lexeme}'.`),
      );
    }
    return method.bind(object);
  }
}
