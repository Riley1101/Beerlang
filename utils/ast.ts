import { Token } from "./token";
import { LoxObject } from "./types";

export interface Expr {
    accept<T>(visitor: ExprVisitor<T>): T;
}

export interface Stmt {
    accept<T>(visitor: StmtVisitor<T>): T;
}
export interface ExprVisitor<T> {
    visitBinaryExpr(expr: BinaryExpr): T;
    visitUnaryExpr(expr: UnaryExpr): T;
    visitLiteralExpr(expr: LiteralExpr): T;
    visitThisExpr(expr: ThisExpr): T;
    visitSuperExpr(expr: SuperExpr): T;
    visitLogicalExpr(expr: LogicalExpr): T;
    visitVariableExpr(expr: VariableExpr): T;
    visitAssignmentExpr(expr: AssignmentExpr): T;
    visitGroupingExpr(expr: GroupingExpr): T;
}

export type SyntaxVisitor<E, S> = ExprVisitor<E> & StmtVisitor<S>;

export interface StmtVisitor<T> { }

/**
* Expression
* Eauality
* Comparism
* Terms
* Factor 
* Unary 
* Primarry
*/

export class GroupingExpr implements Expr {
    expression: Expr;
    constructor(expression: Expr) {
        this.expression = expression
    }
    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitGroupingExpr(this)
    }
}

export class AssignmentExpr implements Expr {
    name: Token;
    value: Expr;
    constructor(name: Token, value: Expr) {
        this.name = name;
        this.value = value
    }
    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitAssignmentExpr(this)
    }
}

export class VariableExpr implements Expr {
    name: Token;
    constructor(name: Token) {
        this.name = name
    }
    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitVariableExpr(this)
    }
}

export class LogicalExpr implements Expr {
    left: Expr;
    value: Token;
    right: Expr
    constructor(left: Expr, value: Token, right: Expr) {
        this.left = left
        this.value = value
        this.right = right
    }
    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitLogicalExpr(this)
    }
}

export class SuperExpr implements Expr {
    value: Token;
    constructor(value: Token) {
        this.value = value
    }
    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitSuperExpr(this)
    }
}

export class ThisExpr implements Expr {
    value: Token
    constructor(value: Token) {
        this.value = value
    }
    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitThisExpr(this)
    }
}

export class LiteralExpr implements Expr {
    value: LoxObject
    constructor(value: LoxObject) {
        this.value = value
    }
    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitLiteralExpr(this)
    }
}

export class UnaryExpr implements Expr {
    right: Expr;
    operator: Token;

    constructor(operator: Token, right: Expr) {
        this.operator = operator
        this.right = right
    }

    accept<T>(visitor: ExprVisitor<T>): T {
        return visitor.visitUnaryExpr(this)
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
    visitGroupingExpr(expr: GroupingExpr): string {
        return this.parenthesize("group", expr.expression);
    }
    visitAssignmentExpr(expr: AssignmentExpr): string {
        return this.parenthesize(expr.name.lexeme, expr.value)
    }
    visitVariableExpr(expr: VariableExpr): string {
        return this.parenthesize(expr.name.lexeme)
    }

    visitLogicalExpr(expr: LogicalExpr): string {
        return this.parenthesize(expr.value.lexeme)
    }
    visitSuperExpr(expr: SuperExpr): string {
        return this.parenthesize(expr.value.lexeme)
    }

    visitThisExpr(expr: ThisExpr): string {
        return this.parenthesize(expr.value.lexeme)
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
        return this.parenthesize(expr.operator.lexeme, expr.right)
    }
}
