import type { TOKENS_TYPES } from "./types";

export class Token {
  type: TOKENS_TYPES;
  lexeme: string;
  literal: any; // !TODO - check token type later
  line: number;

  constructor(type: TOKENS_TYPES, lexeme: string, literal: any, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  public toString(): string {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}
