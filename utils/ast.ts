import { Token } from "./token";

export interface Expr {
    accept<T>(visitor: ExprVisitor<T>): T;
}

export interface Stmt {
    accept<T>(visitor: StmtVisitor<T>): T;
}
export interface ExprVisitor<T> {
    visitBinaryExpr(expr: BinaryExpr): T;
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

    visitBinaryExpr(expr: BinaryExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }
}
