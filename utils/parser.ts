import { Token } from "./token";
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

    public  parse() {
        console.log(this.peek())
        this.advance()
        console.log(this.peek())
        this.advance()
        console.log(this.peek())
        this.advance()
        console.log(this.peek())
        this.advance()
        console.log(this.peek())
    }

    
}

