import type { TokenType,LoxObject } from "./types"

export class Token {
  type: TokenType
  lexeme: string
  literal: LoxObject
  line: number

  constructor(
    type: TokenType,
    lexeme: string,
    literal: LoxObject,
    line: number
  ) {
    this.type = type
    this.lexeme = lexeme
    this.literal = literal
    this.line = line
  }

  to_string(): string {
    return `${this.type} - ${this.lexeme} - ${this.literal}`
  }
}

