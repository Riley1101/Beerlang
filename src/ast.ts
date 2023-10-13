/**
 * @namespace AST
 * @file ast.ts
 * @description Defines the AST for the Beer language
 */
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
  visitIfStmt(stmt: IfStmt): T;
  visitForStmt(stmt: ForStmt): T;
  visitWhileStmt(stmt: WhileStmt): T;
  visitFunctionStmt(stmt: FunctionStmt): T;
  visitReturnStmt(stmt: ReturnStmt): T;
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
  visitLogicalExpr(expr: LogicalExpr): T;
  visitCallExpr(expr: CallExpr): T;
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
 * If statement
 * @class IfStmt
 * @implements {Stmt}
 * @member {Expr} condition - The condition to be evaluated
 * @member {Stmt} thenBranch - The then branch
 * @member {Stmt} elseBranch - The else branch
 * @method {T} accept - Accepts a visitor
 */
export class IfStmt implements Stmt {
  constructor(
    public condition: Expr,
    public thenBranch: Stmt,
    public elseBranch: Stmt | null,
  ) {
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitIfStmt(this);
  }
}

export class ForStmt implements Stmt {
  constructor(
    public initializer: Stmt | null,
    public condition: Expr | null,
    public increment: Expr | null,
    public body: Stmt,
  ) {
    this.initializer = initializer;
    this.condition = condition;
    this.increment = increment;
    this.body = body;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitForStmt(this);
  }
}

/**
 * While statement
 * @class WhileStmt
 * @implements {Stmt}
 * @member {Expr} condition - The condition to be evaluated
 * @member {Stmt} body - The body of the while loop
 * @method {T} accept - Accepts a visitor
 */
export class WhileStmt implements Stmt {
  constructor(
    public condition: Expr,
    public body: Stmt,
  ) {
    this.condition = condition;
    this.body = body;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitWhileStmt(this);
  }
}

export class ReturnStmt implements Stmt {
  constructor(
    public keyword: Token,
    public value: Expr | null,
  ) {
    this.keyword = keyword;
    this.value = value;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitReturnStmt(this);
  }
}

/**
 * @class FunctionStmt
 * @implements {Stmt}
 * @member {Token} name - The name of the function
 * @member {Token[]} params - The parameters of the function
 * @member {Stmt[]} body - The body of the function
 * @method {T} accept - Accepts a visitor
 */
export class FunctionStmt implements Stmt {
  constructor(
    public name: Token,
    public params: Token[],
    public body: Stmt[],
  ) {
    this.name = name;
    this.params = params;
    this.body = body;
  }
  accept<T>(visitor: StmtVisitor<T>): T {
    return visitor.visitFunctionStmt(this);
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

/**
 * @class CallExpr
 * @implements {Expr}
 * @member {Expr} callee - The callee expression.
 * @member {Token} paren - The paren token.
 * @member {Expr[]} args - The arguments.
 * @method {T} accept - Accepts a visitor
 */
export class CallExpr implements Expr {
  constructor(
    public callee: Expr,
    public paren: Token,
    public args: Expr[],
  ) {
    this.callee = callee;
    this.paren = paren;
    this.args = args;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitCallExpr(this);
  }
}

/**
 * @class LogicalExpr
 * @implements {Expr}
 * @member {Expr} left - The left expression.
 * @member {Token} operator - Operator token.
 * @member {Expr} right - The right expression.
 * @method {T} accept - Accepts a visitor
 * @returns {T} - T
 */
export class LogicalExpr implements Expr {
  constructor(
    public left: Expr,
    public operator: Token,
    public right: Expr,
  ) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept<T>(visitor: ExprVisitor<T>): T {
    return visitor.visitLogicalExpr(this);
  }
}

/**
 * @class AstPrinter
 * @implements {SyntaxVisitor<string,string>}
 * @method {string} parenthesize - Parenthesize a string
 * @method {string} print - Print a string
 */
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
   * @param expr - {LogicalExpr} expression
   * @returns string
   */
  visitLogicalExpr(expr: LogicalExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
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

  visitForStmt(stmt: ForStmt): string {
    let result = `(for ${this.stringify(stmt.initializer)} ${this.stringify(
      stmt.condition,
    )} ${this.stringify(stmt.increment)}\n`;
    const bodyResult = this.stringify(stmt.body);
    result += this.indent(bodyResult);
    result += ")";
    return result;
  }

  /**
   * Generate ast for the while statement in the block
   * @param stmt - {While Statement}
   * @returns  string ast of while statement
   */
  visitWhileStmt(stmt: WhileStmt): string {
    let result = `(while ${this.stringify(stmt.condition)}\n`;
    const bodyResult = this.stringify(stmt.body);
    result += this.indent(bodyResult);
    result += ")";
    return result;
  }

  /**
   * Generate ast for the if statements in the block
   * @param stmt - {ReturnStmt} statement
   */
  visitReturnStmt(stmt: ReturnStmt): string {
    if (stmt.value) {
      return this.parenthesize("return", stmt.value);
    }
    return this.parenthesize("return");
  }
  /**
   * Generate ast for the function statements
   * @param stmt - {FunctionStmt} statement
   * @returns parenthesize version of the ast function
   */
  visitFunctionStmt(stmt: FunctionStmt): string {
    let result = `(fun ${stmt.name.lexeme} (`;
    for (const param of stmt.params) {
      result += param.lexeme + " ";
    }
    result += ")\n";
    const bodyResult = this.stringify(stmt.body);
    result += this.indent(bodyResult);
    result += ")";
    return result;
  }

  /**
   * Generate ast for if statements in the block
   * @param stmt - {IfStmt} statement
   * @returns  parenthesize version of the ast if
   */
  visitIfStmt(stmt: IfStmt): string {
    let result = `(if ${this.stringify(stmt.condition)}\n`;

    const thenBranchResult = this.stringify(stmt.thenBranch);
    result += this.indent(thenBranchResult);

    if (stmt.elseBranch !== null) {
      result += "\n";
      const elseBranchResult = this.stringify(stmt.elseBranch);
      result += this.indent(elseBranchResult);
    }
    result += ")";

    return result;
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
   * @param expr - {CallExpr} expression
   * @returns string
   */
  visitCallExpr(expr: CallExpr): string {
    return this.parenthesize("call", expr.callee, ...expr.args);
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
  stringify(target: Expr | Stmt | Stmt[] | null): string {
    if (target === null) return "nil";
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
