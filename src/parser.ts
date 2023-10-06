import { Token } from "./token";
export class Parser {
  private tokens: Token[];
  private current: number;
  constructor() {
    this.tokens = [];
    this.current = 0;
  }

  public parse() {
    while (!this.is_at_end()) {}
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private is_at_end(): boolean {
    return this.peek().type === "EOF";
  }
}
