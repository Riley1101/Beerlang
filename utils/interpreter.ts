import * as Ast from './ast'
import type { LoxObject, } from './types'
import { TokenType } from './types'

export class Interpreter implements Ast.ExprVisitor<LoxObject>{

    private evaluate(expr: Ast.Expr): LoxObject {
        return expr.accept(this)
    }

    private isEqual(a: LoxObject, b: LoxObject) {
        if (a == null && b == null) return true;
        if (a == null) return false
        return a === b
    }

    visitLiteralExpr(expr: Ast.LiteralExpr): LoxObject {
        return expr.value
    }

    visitBinaryExpr(expr: Ast.BinaryExpr): LoxObject {
        let left = this.evaluate(expr.left);
        let right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case TokenType.Minus:
                return (left as number) - (right as number)
            case TokenType.Slash:
                return (left as number) / (right as number)
            case TokenType.Star:
                return (left as number) * (right as number)
            case TokenType.Greater:
                return (left as number) > (right as number)
            case TokenType.GreaterEqual:
                return (left as number) >= (right as number)
            case TokenType.Less:
                return (left as number) < (right as number)
            case TokenType.LessEqual:
                return (left as number) <= (right as number)
            case TokenType.EqualEqual:
                return this.isEqual(left, right)
            case TokenType.BangEqual:
                return !this.isEqual(left, right)
            case TokenType.Plus:
                if (typeof left === "number" && typeof right === "number") {
                    return left + right
                }
                if (typeof left === "string" && typeof right === "string") {
                    return left + right
                }
                break;
        }
        return null;
    }
    /** todo */
    visitThisExpr(expr: Ast.ThisExpr): LoxObject {

    }
    visitSuperExpr(expr: Ast.SuperExpr): LoxObject {

    }
    visitUnaryExpr(expr: Ast.UnaryExpr): LoxObject {

    }
    visitLogicalExpr(expr: Ast.LogicalExpr): LoxObject {

    }
    visitGroupingExpr(expr: Ast.GroupingExpr): LoxObject {

    }
    visitVariableExpr(expr: Ast.VariableExpr): LoxObject {

    }
    visitAssignmentExpr(expr: Ast.AssignmentExpr): LoxObject {

    }

}
