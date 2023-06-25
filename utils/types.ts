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

