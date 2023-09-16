import type { Literals, TokenType } from "./types";

export interface Token {
  type: TokenType;
  lexeme: string;
  literal: Literals;
  line: number;
  to_string(): string;
}

export class Token implements Token {
  type: TokenType;
  lexeme: string;
  literal: Literals;
  line: number;
  constructor(type: TokenType, lexeme: string, literal: Literals, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }
  to_string(): string {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}
