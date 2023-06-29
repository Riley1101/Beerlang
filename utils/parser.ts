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

    private primary(): ast.Expr {
        if (this.match(TokenType.False)) return new ast.LiteralExpr(false)
        if (this.match(TokenType.True)) return new ast.LiteralExpr(true)
        if (this.match(TokenType.Nil)) return new ast.LiteralExpr(null)
        if (this.match(TokenType.Number, TokenType.String)) return new ast.LiteralExpr(this.previous().literal)
        if (this.match(TokenType.This), TokenType.This) return new ast.ThisExpr(this.previous())

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

    }
    public parse() {
    }

}

