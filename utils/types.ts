import * as Ast from "./ast";
import { Environment } from "./environment";
import { Interpreter } from "./interpreter";
import { errorReporter, RuntimeError } from "./log";
import { Token } from "./token";

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

export type LoxObject =
  | string
  | number
  | boolean
  | null
  | LoxCallable
  | LoxInstance;

export abstract class LoxCallable {
  abstract arity(): number;
  abstract call(interpreter: Interpreter, args: LoxObject[]): LoxObject;
  abstract toString(): string;
}

export class LoxClockFunction extends LoxCallable {
  override arity(): number {
    return 0;
  }
  override call(): LoxObject {
    return Date.now().valueOf() / 1000.0;
  }
  override toString(): string {
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
    if (this.is_initializer) return this.closure.getThis();

    return null;
  }

  bind(instance: LoxInstance): LoxFunction {
    const environment = new Environment(this.closure);
    environment.define("this", instance);
    return new LoxFunction(this.declaration, environment, this.is_initializer);
  }
  toString(): string {
    return `<fn ${this.declaration.name.lexeme}>`;
  }
}

export class LoxInstance {
  private klass: LoxClass;
  private fields: Record<string, LoxObject> = {};
  constructor(klass: LoxClass) {
    this.klass = klass;
  }
  set(name: Token, value: LoxObject): void {
    this.fields[name.lexeme] = value;
  }
  get(name: Token): LoxObject {
    if (name.lexeme in this.fields) {
      return this.fields[name.lexeme] as LoxObject;
    }
    const method = this.klass.findMethod(name.lexeme) as LoxFunction;
    let fun = method.bind(this);
    if (method !== null) return fun;
    throw errorReporter.report(
      new RuntimeError(name, `Undefined property '${name.lexeme}'.`),
    );
  }
  toString(): string {
    return this.klass.name + " instance";
  }
}

export class LoxClass extends LoxCallable {
  name: string;
  methods: Record<string, LoxCallable> = {};
  constructor(name: string, methods: Record<string, LoxCallable>) {
    super();
    this.name = name;
    this.methods = methods;
  }

  findMethod(name: string): LoxFunction | null {
    if (name in this.methods) {
      return this.methods[name] as LoxFunction;
    }
    return null;
  }

  override call(interpreter: Interpreter, args: LoxObject[]): LoxObject {
    const instance = new LoxInstance(this);
    const initializer = this.findMethod("init");
    if (initializer !== null) {
      initializer.bind(instance).call(interpreter, args);
    }
    return instance;
  }
  override toString(): string {
    return this.name;
  }
  override arity(): number {
    const initializer = this.findMethod("init");
    if (initializer === null) return 0;
    return initializer.arity();
  }
}
