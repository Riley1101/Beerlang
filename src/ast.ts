import { Token } from "./token";
import { BeerObject } from "./types";
import { Log } from "./error";

/**
 * Expression interface
 * @interface Expr
 * @method {T} accept - Accepts a visitor
 */
export interface Expr {
  accept<T>(visitor: ExprVisitor<T>): T;
}

/**
 * Statement interface
 * @interface Stmt
 * @method {T} accept - Accepts a visitor
 */
export interface Stmt {
  accept<T>(visitor: StmtVisitor<T>): T;
}

/**
 * StmtVisitor interface
 * @interface StmtVisitor
 * @method {T} visitExpressionStmt - Visits an expression Statement
 * @method {T} visitPrintStmt - Visits a print Statement
 * @method {T} visitVarStmt - Visits a var statement
 */
export interface StmtVisitor<T> {
  visitExpressionStmt(stmt: ExpressionStmt): T;
  visitPrintStmt(stmt: PrintStmt): T;
  visitVarStmt(stmt: VarStmt): T;
  visitBlockStmt(stmt: BlockStmt): T;
}

/**
 * Expression Visitor interface
 * @interface ExprVisitor
 * @method {T} visitBinaryExpr - Visits a binary expression
 * @method {T} visitUnaryExpr - Visits a unary expressions
 * @method {T} visitLiteralExpr - Visits a literal expression
 * @method {T} visitGroupingExpr - Visits a grouping expression
 * @method {T} visitVariableExpr - Visits a variable expression
 * @method {T} visitAssignExpr - Visits an assignment expression
 */
export interface ExprVisitor<T> {
  visitBinaryExpr(expr: BinaryExpr): T;
  visitUnaryExpr(expr: UnaryExpr): T;
  visitLiteralExpr(expr: LiteralExpr): T;
  visitGroupingExpr(expr: GroupingExpr): T;
  visitVariableExpr(expr: VariableExpr): T;
  visitAssignExpr(expr: AssignExpr): T;
}

/**
 * Syntax visitor for the interpreter
 * SyntaxVisitor type
 */
export type SyntaxVisitor<E, R> = ExprVisitor<E> & StmtVisitor<R>;

/**
 * Block Statement
 * @class BlockStmt
 * @implements {Stmt}
 * @member {Stmt[]} statements - The statements in the block
 * @method {T} accept - Accepts a visitor
 */
export class BlockStmt implements Stmt {
  constructor(public statements: Stmt[]) {
    this.statements = statements;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitBlockStmt(this);
  }
}

/**
 * Expressions Statement
 * @class  ExpressionStmt
 * @implements {Stmt}
 * @member {Expr} expression - The expression to be evaluated
 * @method {T} accept - Accepts a visitor
 */
export class ExpressionStmt implements Stmt {
  constructor(public expression: Expr) {
    this.expression = expression;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitExpressionStmt(this);
  }
}

/**
 * Print statement
 * @class PrintStmt
 * @implements {Stmt}
 * @member {Expr} expression - The expression to be printed
 * @method {T} accept - Accepts a visitor
 */
export class PrintStmt implements Stmt {
  constructor(public expression: Expr) {
    this.expression = expression;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitPrintStmt(this);
  }
}

/**
 * Print statement
 * @class PrintStmt
 * @implements {Stmt}
 * @member {Expr} expression - The expression to be printed
 * @method {T} accept - Accepts a visitor
 */
export class VarStmt implements Stmt {
  constructor(
    public name: Token,
    public initializer: Expr | null,
  ) {
    this.name = name;
    this.initializer = initializer;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitVarStmt(this);
  }
}

/**
 * Expressions
 **/

/** class BinaryExpr */
export class BinaryExpr implements Expr {
  left: Expr;
  operator: Token;
  right: Expr;
  /**
   * @param {Expr} left - The left expression.
   * @param {Token} operator - Operator token.
   * @param {Expr} right - The right expression.
   */
  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  /**
   * @template T - Template Generic
   * @param visitor - ExprVisitor<T>
   * @returns {T} - T
   */
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitBinaryExpr(this);
  }
}

/** class UnaryExpr */
export class UnaryExpr implements Expr {
  operator: Token;
  right: Expr;
  /**
   * @param {Token} operator - Operator token.
   * @param {Expr} right - The right expression.
   */
  constructor(operator: Token, right: Expr) {
    this.operator = operator;
    this.right = right;
  }
  /**
   * @template T - Template Generic
   * @param visitor - ExprVisitor<T>
   * @returns {T} - T
   */
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitUnaryExpr(this);
  }
}

/** class LiteralExpr */
export class LiteralExpr implements Expr {
  value: BeerObject;
  /**
   * @param {BeerObject} -  value
   */
  constructor(value: BeerObject) {
    this.value = value;
  }

  /**
   * @template T - Template Generic
   * @param visitor - ExprVisitor<T>
   * @returns {T} - T
   */
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitLiteralExpr(this);
  }
}

/**
 * @class GroupingExpr
 * @implements {Expr}
 * @member {Expr} expression- The expression to be grouped
 * @method {T} accept - Accepts a visitor
 */
export class GroupingExpr implements Expr {
  expression: Expr;
  constructor(expression: Expr) {
    this.expression = expression;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitGroupingExpr(this);
  }
}

/**
 * @class VariableExpr
 * @implements {Expr}
 * @member {Token} name - The name of the variable
 * @method {T} accept - Accepts a visitor
 */
export class VariableExpr implements Expr {
  constructor(public name: Token) {
    this.name = name;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitVariableExpr(this);
  }
}

/**
 * @class AssignExpr
 * @implements {Expr}
 * @member {Token} name - The name of the variable
 * @member {Expr} value - The value of the variable
 * @method {T} accept - Accepts a visitor
 */
export class AssignExpr implements Expr {
  constructor(
    public name: Token,
    public value: Expr,
  ) {
    this.name = name;
    this.value = value;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitAssignExpr(this);
  }
}

export class AstPrinter implements SyntaxVisitor<string, string> {
  /**
   * @param expr - {AssignExpr} expression
   * @returns string
   */
  visitAssignExpr(expr: AssignExpr): string {
    return this.parenthesize(expr.name.lexeme, expr.value);
  }

  /**
   * @param expr - {BinaryExpr} expression
   * @returns string
   */
  visitBinaryExpr(expr: BinaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  /**
   * @param expr -  {UnaryExpr} expression
   * @returns string
   */
  visitUnaryExpr(expr: UnaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  /**
   * @param expr - {LiteralExpr} expression
   * @returns string
   */
  visitLiteralExpr(expr: LiteralExpr): string {
    if (expr.value === null) return "nil";
    return expr.value.toString();
  }

  /**
   * @param stmt - {ExpressionStmt} statement
   * @returns parenthesize version of the ast expression
   */
  visitExpressionStmt(stmt: ExpressionStmt): string {
    return this.parenthesize("expression", stmt.expression);
  }

  /**
   * @param stmt - {PrintStmt} statement
   * @returns parenthesize version of the ast print
   */
  visitPrintStmt(stmt: PrintStmt): string {
    return this.parenthesize("print", stmt.expression);
  }

  /**
   * @param stmt - {VarStmt} statement
   * @returns parenthesize version of the ast var
   */
  visitVarStmt(stmt: VarStmt): string {
    const name = new VariableExpr(stmt.name);
    if (stmt.initializer) {
      return this.parenthesize("var", name, stmt.initializer);
    }
    return this.parenthesize("var", name);
  }

  /**
   * Generate ast for the statements in the block
   * @param stmt - {BlockStmt} statement
   * @returns  parenthesize version of the ast block
   */
  visitBlockStmt(stmt: BlockStmt): string {
    let str = `(block `;
    for (const statement of stmt.statements) {
      str += "\n" + this.indent(statement.accept(this));
    }
    str += ")";
    return str;
  }

  /**
   * @param expr - {VariableExpr} expression
   * @returns {string} name of the variable
   */
  visitVariableExpr(expr: VariableExpr): string {
    return expr.name.lexeme;
  }

  /**
   * @param expr - {GroupingExpr} expression
   * @returns string
   */
  visitGroupingExpr(expr: GroupingExpr): string {
    return this.parenthesize("group", expr.expression);
  }

  /**
   * @param {string} - name of the expression
   * @param  {...Expr} exprs - {Expr[]} expressions
   * @returns string
   */
  private parenthesize(name: string, ...exprs: Expr[]): string {
    let str = `(${name}`;
    for (const expr of exprs) {
      str += ` ${expr.accept(this)}`;
    }
    str += ")";
    return str;
  }

  private indent(lines: string): string {
    return lines
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n");
  }

  /**
   * Print expression
   * @param expr - {Expr} expression
   */
  print(expr: Expr): string {
    return expr.accept(this);
  }

  /**
   * Print all the expressions
   * @param expr - {Expr} expression
   * @returns
   */
  stringify(target: Expr | Stmt | Stmt[]): string {
    if (target instanceof Array) {
      return target.map((stmt) => stmt.accept(this)).join("\n");
    } else {
      return target.accept(this);
    }
  }

  /**
   * Print ast of the statements
   * @param stmt - {Stmt[]} statements
   */
  print_ast(stmt: Stmt[]): void {
    console.log(Log.cyan(this.stringify(stmt)));
  }
}
