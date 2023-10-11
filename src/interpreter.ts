import * as ast from "./ast";
import { errorReporter } from "./error";
import { Token } from "./token";
import { BeerObject, TokenType } from "./types";

/**
 * The interpreter class is responsible for evaluating the AST
 * @class Interpreter
 */
export class Interpreter implements ast.SyntaxVisitor<BeerObject, void> {
  /** ========================== Utility Methods ========================== */
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
    return object.toString();
  }

  /** ========================== Visitor Methods ========================== */

  /** ========================== Expressions ========================== */
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

  /** ========================== Statements ========================== */

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
   * @param stmt - The expression to be evaluated
   * @returns void;
   */
  visitExpressionStmt(stmt: ast.ExpressionStmt): void {
    this.evaluate(stmt.expression);
  }
}
