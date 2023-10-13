import { Interpreter } from "./interpreter";
import { Environment } from "./environment";
import * as ast from "./ast";

export type Literals = string | number | boolean | null;

export enum TokenType {
  LEFT_PAREN = "LEFT_PAREN",
  RIGHT_PAREN = "RIGHT_PAREN",
  LEFT_BRACE = "LEFT_BRACE",
  RIGHT_BRACE = "RIGHT_BRACE",
  LEFT_BRACKET = "LEFT_BRACKET",
  RIGHT_BRACKET = "RIGHT_BRACKET",
  COMMA = "COMMA",
  DOT = "DOT",
  MINUS = "MINUS",
  PLUS = "PLUS",
  MODULO = "MODULO",
  SEMICOLON = "SEMICOLON",
  SLASH = "SLASH",
  STAR = "STAR",

  // one or two character tokens
  BANG = "BANG",
  BANG_EQUAL = "BANG_EQUAL",
  EQUAL = "EQUAL",
  EQUAL_EQUAL = "EQUAL_EQUAL",
  GREATER = "GREATER",
  GREATER_EQUAL = "GREATER_EQUAL",
  LESS = "LESS",
  LESS_EQUAL = "LESS_EQUAL",

  // Literals.
  IDENTIFIER = "IDENTIFIER",
  STRING = "STRING",
  NUMBER = "NUMBER",

  // Keywords.
  AND = "AND",
  CLASS = "CLASS",
  ELSE = "ELSE",
  FALSE = "FALSE",
  FUN = "FUN",
  FOR = "FOR",
  IF = "IF",
  NIL = "NIL",
  OR = "OR",
  PRINT = "PRINT",
  RETURN = "RETURN",
  SUPER = "SUPER",
  THIS = "THIS",
  TRUE = "TRUE",
  VAR = "VAR",
  WHILE = "WHILE",
  EOF = "EOF",
}

export const keywords: Record<string, TokenType> = {
  and: TokenType.AND,
  class: TokenType.CLASS,
  else: TokenType.ELSE,
  false: TokenType.FALSE,
  for: TokenType.FOR,
  fun: TokenType.FUN,
  if: TokenType.IF,
  nil: TokenType.NIL,
  or: TokenType.OR,
  print: TokenType.PRINT,
  return: TokenType.RETURN,
  super: TokenType.SUPER,
  this: TokenType.THIS,
  true: TokenType.TRUE,
  var: TokenType.VAR,
  while: TokenType.WHILE,
};

export type BeerObject = string | number | boolean | null | BeerCallable;

/**
 * @abstract BeerCallable
 * @method arity
 * @method call
 * @method to_string
 */
export abstract class BeerCallable {
  abstract arity(): number;
  abstract call(interpreter: Interpreter, args: BeerObject[]): BeerObject;
  abstract to_string(): string;
}

/**
 * Represents a Beer function.
 * @class
 */
export class BeerFunction extends BeerCallable {
  static Return = class Return {
    value: BeerObject;
    constructor(value: BeerObject) {
      this.value = value;
    }
  };
  constructor(
    private declaration: ast.FunctionStmt,
    private closure: Environment,
  ) {
    super();
    this.declaration = declaration;
    this.closure = closure;
  }
  to_string(): string {
    return `<fun ${this.declaration.name.lexeme}>`;
  }
  arity(): number {
    return this.declaration.params.length;
  }

  call(interpreter: Interpreter, args: BeerObject[]): BeerObject {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }
    try {
      interpreter.execute_block(this.declaration.body, environment);
    } catch (error) {
      if (error instanceof BeerFunction.Return) {
        return error.value;
      }
      throw error;
    }
    return null;
  }
}

/**
 * Native clock function 
 * @class
 * @method to_string
 * @method arity
 * @method call
 */
export class BeerClock extends BeerCallable {
  arity(): number {
    return 0;
  }
  call(): BeerObject {
    return Date.now().valueOf() / 1000.0;
  }
  to_string(): string {
    return "<native fn>";
  }
}
