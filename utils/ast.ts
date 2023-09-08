import { Token } from "./token";
import { LoxObject } from "./types";

export interface Expr {
  accept<T>(visitor: ExprVisitor<T>): T;
}

export interface Stmt {
  accept<T>(visitor: StmtVisitor<T>): T;
}
export interface ExprVisitor<T> {
  visitAssignExpr(expr: AssignExpr): T;
  visitBinaryExpr(expr: BinaryExpr): T;
  visitCallExpr(expr: CallExpr): T;
  visitGroupingExpr(expr: GroupingExpr): T;
  visitLiteralExpr(expr: LiteralExpr): T;
  visitLogicalExpr(expr: LogicalExpr): T;
  visitSuperExpr(expr: SuperExpr): T;
  visitThisExpr(expr: ThisExpr): T;
  visitUnaryExpr(expr: UnaryExpr): T;
  visitVariableExpr(expr: VariableExpr): T;
}

export type SyntaxVisitor<E, S> = ExprVisitor<E> & StmtVisitor<S>;

export class ReturnStmt implements Stmt {
  keyword: Token;
  value: Expr;
  constructor(keyword: Token, value: Expr) {
    this.keyword = keyword;
    this.value = value;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitReturnStmt(this);
  }
}

export class FunctionStmt implements Stmt {
  name: Token;
  params: Token[];
  body: Stmt[];

  constructor(name: Token, params: Token[], body: Stmt[]) {
    this.name = name;
    this.params = params;
    this.body = body;
  }

  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitFunctionStmt(this);
  }
}

export class ForStmt implements Stmt {
  initializer: Expr;
  condition: Expr;
  increment: Expr;
  body: Stmt;
  constructor(initializer: Expr, condition: Expr, increment: Expr, body: Stmt) {
    this.initializer = initializer;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitForStmt(this);
  }
}

export class WhileStmt implements Stmt {
  condition: Expr;
  body: Stmt;
  constructor(condition: Expr, body: Stmt) {
    this.condition = condition;
    this.body = body;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitWhileStmt(this);
  }
}

export class IfStmt implements Stmt {
  condition: Expr;
  thenBranch: Stmt;
  elseBranch: Stmt | null;
  constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitIfStmt(this);
  }
}

export class BlockStmt implements Stmt {
  statements: Stmt[];
  constructor(statements: Stmt[]) {
    this.statements = statements;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitBlockStmt(this);
  }
}

export interface StmtVisitor<T> {
  visitReturnStmt(expr: ReturnStmt): T;
  visitFunctionStmt(expr: FunctionStmt): T;
  visitExpressionStmt(expr: ExpressionStmt): T;
  visitIfStmt(expr: IfStmt): T;
  visitWhileStmt(expr: WhileStmt): T;
  visitForStmt(expr: ForStmt): T;
  visitVarStmt(expr: VarStmt): T;
  visitPrintStmt(expr: PrintStmt): T;
  visitBlockStmt(expr: BlockStmt): T;
}

export class VarStmt implements Stmt {
  name: Token;
  initializer: Expr | null;
  constructor(name: Token, initializer: Expr | null) {
    this.name = name;
    this.initializer = initializer;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitVarStmt(this);
  }
}

export class PrintStmt implements Stmt {
  expression: Expr;
  constructor(expression: Expr) {
    this.expression = expression;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitPrintStmt(this);
  }
}

// statements start
export class ExpressionStmt implements Stmt {
  expression: Expr;
  constructor(expression: Expr) {
    this.expression = expression;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitExpressionStmt(this);
  }
}

/**
 * Expression
 * Eauality
 * Comparism
 * Terms
 * Factor
 * Unary
 * Primarry
 */

export class CallExpr implements Expr {
  callee: Expr;
  paren: Token;
  args: Expr[];
  constructor(callee: Expr, paren: Token, args: Expr[]) {
    this.callee = callee;
    this.paren = paren;
    this.args = args;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitCallExpr(this);
  }
}

export class AssignExpr implements Expr {
  name: Token;
  value: Expr;

  constructor(name: Token, value: Expr) {
    this.name = name;
    this.value = value;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitAssignExpr(this);
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

export class VariableExpr implements Expr {
  name: Token;
  constructor(name: Token) {
    this.name = name;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
}

export class LogicalExpr implements Expr {
  left: Expr;
  operator: Token;
  right: Expr;
  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitLogicalExpr(this);
  }
}

export class SuperExpr implements Expr {
  value: Token;
  constructor(value: Token) {
    this.value = value;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitSuperExpr(this);
  }
}

export class ThisExpr implements Expr {
  value: Token;
  constructor(value: Token) {
    this.value = value;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitThisExpr(this);
  }
}

export class LiteralExpr implements Expr {
  value: LoxObject;
  constructor(value: LoxObject) {
    this.value = value;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitLiteralExpr(this);
  }
}

export class UnaryExpr implements Expr {
  right: Expr;
  operator: Token;

  constructor(operator: Token, right: Expr) {
    this.operator = operator;
    this.right = right;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
}

export class BinaryExpr implements Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}

export class AstPrinter implements SyntaxVisitor<string, string> {
  strigify(expr: Expr | Stmt | Stmt[]): string {
    if (Array.isArray(expr)) {
      return expr.map((e) => e.accept(this)).join("\n");
    } else {
      return expr.accept(this);
    }
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    return `(${name} ${exprs.map((e) => e.accept(this)).join(" ")})`;
  }

  private indent(line: string): string {
    return line
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n");
  }

  // statements start

  visitIfStmt(expr: IfStmt): string {
    let result = `(if ${this.strigify(expr.condition)}`;
    return result;
  }

  visitBlockStmt(stmt: BlockStmt): string {
    let result = "(block";
    stmt.statements.forEach((innerStmt) => {
      result += "\n" + this.indent(this.strigify(innerStmt));
    });
    result += ")";
    return result;
  }

  visitVarStmt(expr: VarStmt): string {
    const name = new VariableExpr(expr.name);
    if (expr.initializer) {
      return this.parenthesize("var", name, expr.initializer);
    } else {
      return this.parenthesize("var", name);
    }
  }
  visitExpressionStmt(expr: ExpressionStmt): string {
    return this.parenthesize("expression", expr.expression);
  }
  visitPrintStmt(expr: PrintStmt): string {
    return this.parenthesize("print", expr.expression);
  }
  // expressions start
  visitGroupingExpr(expr: GroupingExpr): string {
    return this.parenthesize("group", expr.expression);
  }
  visitVariableExpr(expr: VariableExpr): string {
    return this.parenthesize(expr.name.lexeme);
  }

  visitLogicalExpr(expr: LogicalExpr): string {
    return this.parenthesize(expr.operator.lexeme);
  }
  visitSuperExpr(expr: SuperExpr): string {
    return this.parenthesize(expr.value.lexeme);
  }

  visitThisExpr(expr: ThisExpr): string {
    return this.parenthesize(expr.value.lexeme);
  }

  visitLiteralExpr(expr: LiteralExpr): string {
    if (expr.value === null) return "nil";
    if (typeof expr.value === "string") return `"${expr.value}"`;
    return expr.value.toString();
  }

  visitBinaryExpr(expr: BinaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }
  visitUnaryExpr(expr: UnaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }
  visitAssignExpr(expr: AssignExpr): string {
    const name = new VariableExpr(expr.name);
    return this.parenthesize("assign", name, expr.value);
  }
  visitWhileStmt(expr: WhileStmt): string {
    let result = `(while ${this.strigify(expr.condition)}`;
    const bodyResult = this.strigify(expr.body);
    result += this.indent(bodyResult);
    return result;
  }

  visitCallExpr(expr: CallExpr): string {
    return this.parenthesize("call", expr.callee, ...expr.args);
  }
  visitFunctionStmt(expr: FunctionStmt): string {
    let result = `(fun ${expr.name.lexeme} (`;
    expr.params.forEach((param) => {
      result += param.lexeme + " ";
    });
    result += ")";
    const bodyResult = this.strigify(expr.body);
    result += this.indent(bodyResult);
    return result;
  }

  visitReturnStmt(stmt: ReturnStmt): string {
    return stmt.value !== null
      ? this.parenthesize(stmt.keyword.lexeme, stmt.value)
      : this.parenthesize(stmt.keyword.lexeme);
  }
  visitForStmt(expr: ForStmt): string {
    let bodyResult = this.strigify(expr.body);
    let result = `(for ${this.strigify(expr.initializer)} ${this.strigify(
      expr.condition,
    )} ${this.strigify(expr.increment)}`;
    result += this.indent(bodyResult);
    return result;
  }
}
