import { Interpreter } from "./interpreter";
import { Environment } from "./environment";
import * as Ast from "./ast";
export enum TokenType {
  // Single character tokens
  LeftParen = "LeftParen", // '('
  RightParen = "RightParen", // ')'
  LeftBrace = "LeftBrace", // '{'
  RightBrace = "RightBrace", // '}'
  Comma = "Comma", // ','
  Dot = "Dot", // '.'
  Minus = "Minus", // '-'
  Plus = "Plus", // '+'
  Semicolon = "Semicolon", // ';'
  Slash = "Slash", // '/'
  Star = "Star", // '*'

  // One or two character tokens
  Bang = "Bang", // '!'
  BangEqual = "BangEqual", // '!='
  Equal = "Equal", // '='
  EqualEqual = "EqualEqual", // '=='
  Greater = "Greater", // '>'
  GreaterEqual = "GreaterEqual", // '>='
  Less = "Less", // '<'
  LessEqual = "LessEqual", // '<='

  // Literals
  Identifier = "Identifier",
  String = "String",
  Number = "Number",

  // Keywords
  And = "And",
  Class = "Class",
  Else = "Else",
  False = "False",
  Fun = "Fun",
  For = "For",
  If = "If",
  Nil = "Nil",
  Or = "Or",
  Print = "Print",
  Return = "Return",
  Super = "Super",
  This = "This",
  True = "True",
  Var = "Var",
  While = "While",
  EOF = "EOF",
}

export const keywords: Record<string, TokenType> = {
  and: TokenType.And,
  class: TokenType.Class,
  else: TokenType.Else,
  false: TokenType.False,
  for: TokenType.For,
  fun: TokenType.Fun,
  if: TokenType.If,
  nil: TokenType.Nil,
  or: TokenType.Or,
  print: TokenType.Print,
  return: TokenType.Return,
  super: TokenType.Super,
  this: TokenType.This,
  true: TokenType.True,
  var: TokenType.Var,
  while: TokenType.While,
};

export type LoxObject = string | number | boolean | null;

export abstract class LoxCallable {
  abstract arity(): number;
  abstract call(interpreter: Interpreter, args: LoxObject[]): LoxObject;
  abstract to_string(): string;
}

export class LoxClockFunction extends LoxCallable {
  override arity(): number {
    return 0;
  }
  override call(): LoxObject {
    return Date.now().valueOf() / 1000.0;
  }
  override to_string(): string {
    return "<native fun 'clock'>";
  }
}

export class LoxFunction extends LoxCallable {
  static Return = class Return {
    value: LoxObject;

    constructor(value: LoxObject) {
      this.value = value;
    }
  };
  private declaration: Ast.FunctionStmt;
  private closure: Environment;
  private is_initializer: boolean;
  constructor(
    dec: Ast.FunctionStmt,
    closure: Environment,
    is_initializer: boolean,
  ) {
    super();
    this.declaration = dec;
    this.closure = closure;
    this.is_initializer = is_initializer;
  }

  arity(): number {
    return this.declaration.params.length;
  }
  override call(interpreter: Interpreter, args: LoxObject[]): LoxObject {
    const env = new Environment(this.closure);
    for (const [i, param] of this.declaration.params.entries()) {
      env.define(param.lexeme, args[i] as LoxObject);
    }

    try {
      interpreter.executeBlock(this.declaration.body, env);
    } catch (e) {
      if (e instanceof LoxFunction.Return) {
        if (this.is_initializer) return this.closure.getThis();
        return e.value;
      }
    }
    return null;
  }

  to_string(): string {
    return `<fn ${this.declaration.name.lexeme}>`;
  }
}
