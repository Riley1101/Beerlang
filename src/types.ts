/**
 * @namespace Types
 * @file types.ts
 * @description Defines the types used in the Beer language.
 */
import * as ast from "./ast";
import { Environment } from "./environment";
import { Token } from "./token";
import { errorReporter } from "./error";
import { Beer } from "./interpreter";

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

export type BeerObject =
  | string
  | number
  | boolean
  | null
  | BeerCallable
  | BeerInstance;

/**
 * @abstract BeerCallable
 * @method arity
 * @method call
 * @method to_string
 */
export abstract class BeerCallable {
  abstract arity(): number;
  abstract call(interpreter: Beer, args: BeerObject[]): BeerObject;
  abstract to_string(): string;
}

/**
 * Represents a Beer function.
 * @class
 * @extends BeerCallable
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
    private is_initializer = false,
  ) {
    super();
    this.declaration = declaration;
    this.closure = closure;
    this.is_initializer = is_initializer;
  }
  to_string(): string {
    return `<fun ${this.declaration.name.lexeme}>`;
  }
  arity(): number {
    return this.declaration.params.length;
  }

  bind(instance: BeerInstance): BeerFunction {
    let environment = new Environment(this.closure);
    environment.define("this", instance);
    return new BeerFunction(this.declaration, environment, this.is_initializer);
  }

  call(interpreter: Beer, args: BeerObject[]): BeerObject {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }
    try {
      interpreter.execute_block(this.declaration.body, environment);
    } catch (error) {
      if (error instanceof BeerFunction.Return) {
        if (this.is_initializer) return this.closure.get_at(0, "this");
        return error.value;
      }
      throw error;
    }

    if (this.is_initializer) return this.closure.get_at(0, "this");
    return null;
  }
}

/**
 * Native clock function
 * @class
 * @extends BeerCallable
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

/**
 * Represents a Beer class.
 * @class BeerClass
 *
 */
export class BeerClass extends BeerCallable {
  name: string;
  constructor(
    name: string,
    private methods: Map<string, BeerFunction>,
  ) {
    super();
    this.name = name;
    this.methods = methods;
  }

  find_method(name: string): BeerFunction | null {
    if (this.methods.has(name)) {
      return this.methods.get(name) as BeerFunction;
    }
    return null;
  }

  override arity(): number {
    const initializer = this.find_method("init");
    if (initializer === null) return 0;
    return initializer.arity();
  }

  override call(interpreter: Beer, args: BeerObject[]): BeerObject {
    let instance = new BeerInstance(this);
    const initializer = this.find_method("init");
    if (initializer !== null)
      initializer.bind(instance).call(interpreter, args);
    return instance;
  }
  override to_string(): string {
    return `<class ${this.name}>`;
  }
}

/**
 * Represents a Beer instance.
 * @class BeerInstance
 * @method get
 * @method to_string
 * @param {BeerClass} klass
 * @member {Map<string, BeerObject>} fields
 * @returns {BeerObject}
 */
export class BeerInstance {
  private fields: Map<string, BeerObject> = new Map();
  constructor(private klass: BeerClass) {
    this.klass = klass;
  }

  get(name: Token): BeerObject | never {
    if (this.fields.has(name.lexeme)) {
      return this.fields.get(name.lexeme) as BeerObject;
    }
    let method = this.klass.find_method(name.lexeme);
    if (method) {
      return method.bind(this);
    }

    return errorReporter.report(
      new SyntaxError(`Undefined property '${name.lexeme}'.`),
    );
  }

  set(name: Token, value: BeerObject): void {
    this.fields.set(name.lexeme, value);
  }

  to_string(): string {
    return `<instance ${this.klass.name}>`;
  }
}
