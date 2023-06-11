export type SINGLE_CHAR_TOKENS =
  | "("
  | ")"
  | "{"
  | "}"
  | ","
  | "."
  | "-"
  | "+"
  | ";"
  | "/"
  | "*";

export type ONE_OR_TWO_CHAR_TOKENS =
  | "!"
  | "!="
  | "="
  | "=="
  | ">"
  | ">="
  | "<"
  | "<=";

export type LITERAL_TOKENS = "IDENTIFIER" | "STRING" | "NUMBER" | "EOF";

export type IDENTIFIER_TOKENS =
  | "and"
  | "class"
  | "else"
  | "false"
  | "fun"
  | "for"
  | "if"
  | "nil"
  | "or"
  | "print"
  | "return"
  | "super"
  | "this"
  | "true"
  | "var"
  | "while";

export type TOKENS_TYPES =
  | SINGLE_CHAR_TOKENS
  | ONE_OR_TWO_CHAR_TOKENS
  | IDENTIFIER_TOKENS
  | LITERAL_TOKENS;
