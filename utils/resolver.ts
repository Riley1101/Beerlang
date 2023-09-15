import * as ast from "./ast";
import { Interpreter } from "./interpreter";
import { errorReporter, ResolverError } from "./log";
import { Token } from "./token";

enum ClassType {
  None = "None",
  Class = "Class",
  SubClass = "SubClass",
}

enum FunctionType {
  None = "None",
  Function = "Function",
  Initializer = "Initializer",
  Method = "Method",
}

type Scope = Record<string, boolean>;

class ScopeStack extends Array<Scope> {
  isEmpty(): boolean {
    return this.length < 1;
  }
  peek(): Scope {
    return this[this.length - 1] as Scope;
  }
}

export class Resolver implements ast.SyntaxVisitor<void, void> {
  private interpreter: Interpreter;
  private scopes = new ScopeStack();
  private currentFunction = FunctionType.None;
  private currentClass = ClassType.None;

  constructor(interpreter: Interpreter) {
    this.interpreter = interpreter;
  }

  private beginScope(): void {
    this.scopes.push({});
  }

  private endScope(): void {
    this.scopes.pop();
  }

  resolve(statements: ast.Stmt[]): void;
  resolve(stmt: ast.Stmt | ast.Expr): void;
  resolve(target: ast.Stmt | ast.Expr | ast.Stmt[]): void {
    if (target instanceof Array) target.forEach((stmt) => this.resolve(stmt));
    else {
      target.accept(this);
    }
  }

  private resolveLocal(expr: ast.Expr, name: Token): void {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (name.lexeme in (this.scopes[i] as Scope)) {
        this.interpreter.resolve(expr, this.scopes.length - 1 - i);
        return;
      }
    }
  }

  private declare(name: Token): void {
    if (this.scopes.isEmpty()) return;
    const scope = this.scopes.peek();
    if (name.lexeme in scope) {
      errorReporter.report(
        new ResolverError(
          "Already with a variable named " + name.lexeme,
          name.line,
          name.lexeme,
        ),
      );
    }
    scope[name.lexeme] = false;
  }

  private define(name: Token): void {
    if (this.scopes.isEmpty()) return;

    const scope = this.scopes.peek();
    scope[name.lexeme] = true;
  }

  private resolveFunction(fun: ast.FunctionStmt, type: FunctionType) {
    const enclosingFunction = this.currentFunction;
    this.currentFunction = type;
    this.beginScope();
    fun.params.forEach((param) => {
      this.declare(param);
      this.define(param);
    });
    this.resolve(fun.body);
    this.endScope();
    this.currentFunction = enclosingFunction;
  }

  visitBlockStmt(stmt: ast.BlockStmt): void {
    this.beginScope();
    this.resolve(stmt.statements);
    this.endScope();
  }

  visitVarStmt(expr: ast.VarStmt): void {
    this.declare(expr.name);
    if (expr.initializer !== null) {
      this.resolve(expr.initializer);
    }
    this.define(expr.name);
  }

  visitVariableExpr(expr: ast.VariableExpr): void {
    if (
      !this.scopes.isEmpty() &&
      this.scopes.peek()[expr.name.lexeme] === false
    )
      errorReporter.report(
        new ResolverError(
          "Cannot read local variable in its own initializer.",
          expr.name.line,
          expr.name.lexeme,
        ),
      );
    this.resolveLocal(expr, expr.name);
  }

  visitAssignExpr(expr: ast.AssignExpr): void {
    this.resolve(expr.value);

    this.resolveLocal(expr, expr.name);
  }

  visitClassStmt(stmt: ast.ClassStmt): void {
    const enclosingClass = this.currentClass;
    this.currentClass = ClassType.Class;
    this.declare(stmt.name);
    this.define(stmt.name);

    this.beginScope();
    this.scopes.peek()["this"] = true;
    stmt.methods.forEach((method) => {
      let declaration = FunctionType.Method;
      if (method.name.lexeme === "init") declaration = FunctionType.Initializer;
      this.resolveFunction(method, declaration);
    });
    this.endScope();
    this.currentClass = enclosingClass;
  }

  visitFunctionStmt(expr: ast.FunctionStmt): void {
    this.declare(expr.name);
    this.define(expr.name);
    this.resolveFunction(expr, FunctionType.Function);
  }

  visitExpressionStmt(stmt: ast.ExpressionStmt): void {
    this.resolve(stmt.expression);
  }
  visitIfStmt(stmt: ast.IfStmt): void {
    this.resolve(stmt.condition);
    this.resolve(stmt.thenBranch);
    if (stmt.elseBranch !== null) this.resolve(stmt.elseBranch);
  }

  visitReturnStmt(stmt: ast.ReturnStmt): void {
    if (this.currentFunction === FunctionType.None) {
      errorReporter.report(
        new ResolverError(
          "Cannot return value from an initializer.",
          stmt.keyword.line,
          "",
        ),
      );
    }
    if (stmt.value !== null) {
      if (this.currentFunction === FunctionType.Initializer) {
        errorReporter.report(
          new ResolverError(
            "Cannot return value from an initializer.",
            stmt.keyword.line,
            "",
          ),
        );
      }
      this.resolve(stmt.value);
    }
  }

  visitWhileStmt(expr: ast.WhileStmt): void {
    this.resolve(expr.condition);
    this.resolve(expr.body);
  }

  visitBinaryExpr(expr: ast.BinaryExpr): void {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }

  visitCallExpr(expr: ast.CallExpr): void {
    this.resolve(expr.callee);
    for (const arg of expr.args) {
      this.resolve(arg);
    }
  }

  visitGroupingExpr(expr: ast.GroupingExpr): void {
    this.resolve(expr.expression);
  }

  visitLiteralExpr(_: ast.LiteralExpr): void {
    return;
  }

  visitUnaryExpr(expr: ast.UnaryExpr): void {
    this.resolve(expr.right);
  }

  visitLogicalExpr(expr: ast.LogicalExpr): void {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }
  visitSuperExpr(expr: ast.SuperExpr): void {
    return;
  }
  visitThisExpr(expr: ast.ThisExpr): void {
    if (this.currentClass === ClassType.None) {
      errorReporter.report(
        new ResolverError(
          "Cannot use 'this' outside of a class.",
          expr.keyword.line,
          expr.keyword.lexeme,
        ),
      );
    }
    this.resolveLocal(expr, expr.keyword);
  }
  visitForStmt(expr: ast.ForStmt): void {
    if (expr) {
      this.resolve(expr.initializer);
      this.resolve(expr.condition);
      this.resolve(expr.increment);
      this.resolve(expr.body);
    }
  }
  visitPrintStmt(expr: ast.PrintStmt): void {
    this.resolve(expr.expression);
  }
  visitGetExpr(expr: ast.GetExpr): void {
    this.resolve(expr.object);
  }
  visitSetExpr(expr: ast.SetExpr): void {
    this.resolve(expr.value);
    this.resolve(expr.object);
  }
}
