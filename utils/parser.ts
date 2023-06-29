import { Token } from "./token";
import { error } from "./log";
import * as ast from './ast'
import { TokenType } from "./types";

export class Parser {
    private tokens: Token[]
    private current: number;
    constructor(token: Token[]) {
        this.tokens = token
        this.current = 0
    }

    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance()
        error(this.peek().line, message)
    }

    private peek(): Token {
        return this.tokens[this.current] as Token
    }

    private previous(): Token {
        return this.tokens[this.current - 1] as Token
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++
        return this.previous()
    }

    private check(type: TokenType): boolean {
        return this.isAtEnd() ? false : this.peek().type === type
    }

    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance()
                return true
            }
        }
        return false
    }

    private logicalAnd():ast.Expr{
        let expr = this.equality();
        while(this.match(TokenType.And)){
            let operator = this.previous();
            let right = this.equality();
            expr = new ast.LogicalExpr(expr, operator, right)
        }
        return expr
    }

    private logicalOr():ast.Expr{
        let expr = this.logicalAnd();
        while(this.match(TokenType.Or)){
            let operator = this.previous();
            let right = this.logicalAnd();
            expr = new ast.LogicalExpr(expr, operator, right)
        }
        return expr
    }

    private assignment(): ast.Expr{
       let expr = this.logicalOr();
       if(this.match(TokenType.Equal)){
           const equal = this.previous()
           let value = this.assignment()
           if(expr instanceof ast.VariableExpr){
               const name = expr.name
               return new ast.AssignmentExpr(name, value)
           }
           error(equal.line, "Invalid assignment target.")
       }
       return expr
       
    }

    private expression(): ast.Expr {
        return this.assignment()
    }

    private primary(): ast.Expr {
        if (this.match(TokenType.False)) return new ast.LiteralExpr(false)
        if (this.match(TokenType.True)) return new ast.LiteralExpr(true)
        if (this.match(TokenType.Nil)) return new ast.LiteralExpr(null)
        if (this.match(TokenType.Number, TokenType.String)) return new ast.LiteralExpr(this.previous().literal)
        if (this.match(TokenType.This), TokenType.This) return new ast.ThisExpr(this.previous())
        if (this.match(TokenType.LeftParen)) {
            let expr = this.expression()
            this.consume(TokenType.RightParen, "Expect ')' after expression.")
            return new ast.GroupingExpr(expr)
        }
        error(this.peek().line, "Expect expression.")
    }


    private unary(): ast.Expr {
        if (this.match(TokenType.Bang, TokenType.Minus)) {
            let operator = this.previous()
            let right = this.unary()
            return new ast.UnaryExpr(operator, right)
        }
        return this.primary()
    }

    private factor(): ast.Expr {
        let expr = this.unary()
        while (this.match(TokenType.Slash, TokenType.Star)) {
            let operator = this.previous()
            let right = this.unary()
            expr = new ast.BinaryExpr(expr, operator, right)

        }
        return expr
    }

    private term(): ast.Expr {
        let expr = this.factor()
        while (this.match(TokenType.Minus, TokenType.Plus)) {
            let operator = this.previous()
            let right = this.factor()
            expr = new ast.BinaryExpr(expr, operator, right)
        }
        return expr
    }

    private comparism(): ast.Expr {
        let expr = this.term()
        while (this.match(TokenType.Greater, TokenType.GreaterEqual, TokenType.Less, TokenType.LessEqual)) {
            let operator = this.previous()
            let right = this.term()
            expr = new ast.BinaryExpr(expr, operator, right)
        }
        return expr
    }

    private equality() {
        let expr = this.comparism()
        while(this.match(TokenType.Equal, TokenType.EqualEqual)){
            let operator = this.previous();
            let right = this.comparism();
            expr = new ast.BinaryExpr(expr, operator, right)
        }
        return expr

    }
    public parse() {
    }

}
