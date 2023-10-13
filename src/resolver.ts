import { Beer } from "./interpreter";
import * as ast from "./ast";
import { Token } from "./token";
import { RuntimeError, errorReporter } from "./error";

enum FunctionType {
  None = "None",
  Function = "Function",
  Initializer = "Initializer",
  Method = "Method",
}

enum ClassType {
  None = "None",
  Class = "Class",
  SubClass = "SubClass",
}

type Scope = Map<string, boolean>;
/**
 * ScopeStack
 * @classdesc ScopeStack
 * @class ScopeStack
 * @extends {Array<Scope>}
 * @method is_empty - Check if the stack is empty
 * @peek - Get the last element of the stack
 */
class ScopeStack extends Array<Scope> {
  is_empty(): boolean {
    return this.length < 1;
  }

  peek(): Scope {
    return this[this.length - 1];
  }
}

export class BeerResolver implements ast.SyntaxVisitor<void, void> {
  private scopes: ScopeStack = new ScopeStack();
  private currentFunction = FunctionType.None;
  private currentClass = ClassType.None;
  constructor(private interpreter: Beer) {
    this.interpreter = interpreter;
  }
  /** ========================== Resolver ========================== */

  /**
   * Resolve each statements
   * @param statements - The statements to resolve
   */
  resolve(statements: ast.Stmt[]): void;
  resolve(stmt: ast.Stmt | ast.Expr): void;
  resolve(target: ast.Stmt[] | ast.Stmt | ast.Expr): void {
    if (target instanceof Array) {
      target.forEach((stmt) => this.resolve(stmt));
    } else {
      target.accept(this);
    }
  }

  private resolve_local(expr: ast.Expr, name: Token) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i].has(name.lexeme)) {
        this.interpreter.resolve(expr, this.scopes.length - 1 - i);
        return;
      }
    }
  }

  /**
   * Start scope for each statements
   * @param statements - The statements to resolve
   */
  private begin_scope() {
    this.scopes.push(new Map());
  }

  /**
   * Start scope for each statements
   * @param statements - The statements to resolve
   */
  private end_scope() {
    this.scopes.pop();
  }

  /**
   * Declare statements
   * @param name - The token to resolve
   */
  private declare(name: Token) {
    if (this.scopes.is_empty()) return;
    this.scopes.peek().set(name.lexeme, false);
  }

  /**
   * @param name - The token to resolve
   */
  private define(name: Token) {
    if (this.scopes.is_empty()) return;
    this.scopes.peek().set(name.lexeme, true);
  }

  private resolve_function(func: ast.FunctionStmt, type: FunctionType) {
    const enclosingFunction = this.currentFunction;
    this.currentFunction = type;

    this.begin_scope();
    func.params.forEach((param) => {
      this.declare(param);
      this.define(param);
    });
    this.resolve(func.body);
    this.end_scope();
    this.currentFunction = enclosingFunction;
  }

  /** ========================== Visitors ========================== */

  /**
   * @param stmt - The statements to resolve
   */
  visitClassStmt(stmt: ast.ClassStmt): void {
    const enclosingClass = this.currentClass;
    this.currentClass = ClassType.Class;
    this.declare(stmt.name);
    this.define(stmt.name);
    if (stmt.superclass !== null) {
      if (stmt.name.lexeme === stmt.superclass.name.lexeme) {
        errorReporter.report(
          new SyntaxError("A class can't inherit from itself."),
        );
      } else {
        this.currentClass = ClassType.SubClass;
        this.resolve(stmt.superclass);
        this.begin_scope();
        this.scopes.peek().set("super", true);
      }
    }

    this.begin_scope();
    this.scopes.peek().set("this", true);

    for (const method of stmt.methods) {
      let declaration = FunctionType.Method;
      if (method.name.lexeme === "init") {
        declaration = FunctionType.Initializer;
      }
      this.resolve_function(method, declaration);
    }
    this.end_scope();
    if (stmt.superclass !== null) {
      this.end_scope();
    }
    this.currentClass = enclosingClass;
  }

  /**
   * Set block scopes for each statement
   * @param statements - The statements to resolve
   */
  visitBlockStmt(stmt: ast.BlockStmt): void {
    this.begin_scope();
    this.resolve(stmt.statements);
    this.end_scope();
  }

  /**
   * @param stmt - The statements to resolve
   */
  visitVarStmt(stmt: ast.VarStmt): void {
    this.declare(stmt.name);
    if (stmt.initializer !== null) {
      this.resolve(stmt.initializer);
    }
    this.define(stmt.name);
  }

  /**
   * @param expr - Resolve variable expression
   * @throws {RuntimeError} - If the variable is not defined
   */
  visitVariableExpr(expr: ast.VariableExpr): void {
    if (
      !this.scopes.is_empty() &&
      this.scopes.peek().get(expr.name.lexeme) === false
    ) {
      errorReporter.report(
        new RuntimeError(
          expr.name,
          `Cannot read local variable in its own initializer.`,
        ),
      );
    }
    this.resolve_local(expr, expr.name);
  }

  visitAssignExpr(expr: ast.AssignExpr): void {
    this.resolve(expr.value);
    this.resolve_local(expr, expr.name);
  }

  visitSuperExpr(expr: ast.SuperExpr): void {
    if (this.currentClass === ClassType.None) {
      errorReporter.report(
        new RuntimeError(
          expr.keyword,
          "Cannot use 'super' outside of a class.",
        ),
      );
    } else if (this.currentClass !== ClassType.SubClass) {
      errorReporter.report(
        new RuntimeError(
          expr.keyword,
          "Cannot use 'super' in a class with no superclass.",
        ),
      );
    }
    this.resolve_local(expr, expr.keyword);
  }

  visitFunctionStmt(stmt: ast.FunctionStmt): void {
    this.declare(stmt.name);
    this.define(stmt.name);
    this.resolve_function(stmt, FunctionType.Function);
  }

  visitExpressionStmt(stmt: ast.ExpressionStmt): void {
    this.resolve(stmt.expression);
  }

  visitIfStmt(stmt: ast.IfStmt): void {
    this.resolve(stmt.condition);
    this.resolve(stmt.thenBranch);
    if (stmt.elseBranch !== null) this.resolve(stmt.elseBranch);
  }

  visitPrintStmt(stmt: ast.PrintStmt): void {
    this.resolve(stmt.expression);
  }

  visitReturnStmt(stmt: ast.ReturnStmt): void {
    if (stmt.value !== null) {
      if (this.currentFunction === FunctionType.Initializer) {
        errorReporter.report(
          new RuntimeError(
            stmt.keyword,
            "Cannot return a value from an initializer.",
          ),
        );
      }
      if (this.currentFunction === FunctionType.None) {
        errorReporter.report(
          new RuntimeError(stmt.keyword, "Cannot return from top-level code."),
        );
      }
      this.resolve(stmt.value);
    }
  }

  visitWhileStmt(stmt: ast.WhileStmt): void {
    this.resolve(stmt.condition);
    this.resolve(stmt.body);
  }

  visitForStmt(stmt: ast.ForStmt): void {
    if (stmt.initializer !== null) this.resolve(stmt.initializer);
    if (stmt.condition !== null) this.resolve(stmt.condition);
    if (stmt.increment !== null) this.resolve(stmt.increment);
  }

  visitBinaryExpr(expr: ast.BinaryExpr): void {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }

  visitCallExpr(expr: ast.CallExpr): void {
    this.resolve(expr.callee);
    expr.args.forEach((arg) => this.resolve(arg));
  }

  visitGroupingExpr(expr: ast.GroupingExpr): void {
    this.resolve(expr.expression);
  }

  visitLiteralExpr(_: ast.LiteralExpr): void {}

  visitUnaryExpr(expr: ast.UnaryExpr): void {
    this.resolve(expr.right);
  }
  visitLogicalExpr(expr: ast.LogicalExpr): void {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }

  visitSetExpr(expr: ast.SetExpr): void {
    this.resolve(expr.value);
    this.resolve(expr.object);
  }
  visitGetExpr(expr: ast.GetExpr): void {
    this.resolve(expr.object);
  }

  visitThisExpr(expr: ast.ThisExpr): void {
    if (this.currentClass === ClassType.None) {
      errorReporter.report(
        new RuntimeError(expr.keyword, "Cannot use 'this' outside of a class."),
      );
      return;
    }
    this.resolve_local(expr, expr.keyword);
  }
}
