var Q0 = function () {
  const O = new Map();
  for (let [U, W] of Object.entries(q)) {
    for (let [G, H] of Object.entries(W))
      (q[G] = { open: `\x1B[${H[0]}m`, close: `\x1B[${H[1]}m` }),
        (W[G] = q[G]),
        O.set(H[0], H[1]);
    Object.defineProperty(q, U, { value: W, enumerable: !1 });
  }
  return (
    Object.defineProperty(q, "codes", { value: O, enumerable: !1 }),
    (q.color.close = "\x1B[39m"),
    (q.bgColor.close = "\x1B[49m"),
    (q.color.ansi = T()),
    (q.color.ansi256 = p()),
    (q.color.ansi16m = s()),
    (q.bgColor.ansi = T(10)),
    (q.bgColor.ansi256 = p(10)),
    (q.bgColor.ansi16m = s(10)),
    Object.defineProperties(q, {
      rgbToAnsi256: {
        value(U, W, G) {
          if (U === W && W === G) {
            if (U < 8) return 16;
            if (U > 248) return 231;
            return Math.round(((U - 8) / 247) * 24) + 232;
          }
          return (
            16 +
            36 * Math.round((U / 255) * 5) +
            6 * Math.round((W / 255) * 5) +
            Math.round((G / 255) * 5)
          );
        },
        enumerable: !1,
      },
      hexToRgb: {
        value(U) {
          const W = /[a-f\d]{6}|[a-f\d]{3}/i.exec(U.toString(16));
          if (!W) return [0, 0, 0];
          let [G] = W;
          if (G.length === 3) G = [...G].map((D) => D + D).join("");
          const H = Number.parseInt(G, 16);
          return [(H >> 16) & 255, (H >> 8) & 255, H & 255];
        },
        enumerable: !1,
      },
      hexToAnsi256: {
        value: (U) => q.rgbToAnsi256(...q.hexToRgb(U)),
        enumerable: !1,
      },
      ansi256ToAnsi: {
        value(U) {
          if (U < 8) return 30 + U;
          if (U < 16) return 90 + (U - 8);
          let W, G, H;
          if (U >= 232) (W = ((U - 232) * 10 + 8) / 255), (G = W), (H = W);
          else {
            U -= 16;
            const y = U % 36;
            (W = Math.floor(U / 36) / 5),
              (G = Math.floor(y / 6) / 5),
              (H = (y % 6) / 5);
          }
          const D = Math.max(W, G, H) * 2;
          if (D === 0) return 30;
          let Q =
            30 + ((Math.round(H) << 2) | (Math.round(G) << 1) | Math.round(W));
          if (D === 2) Q += 60;
          return Q;
        },
        enumerable: !1,
      },
      rgbToAnsi: {
        value: (U, W, G) => q.ansi256ToAnsi(q.rgbToAnsi256(U, W, G)),
        enumerable: !1,
      },
      hexToAnsi: {
        value: (U) => q.ansi256ToAnsi(q.hexToAnsi256(U)),
        enumerable: !1,
      },
    }),
    q
  );
};
var T =
    (O = 0) =>
    (U) =>
      `\x1B[${U + O}m`,
  p =
    (O = 0) =>
    (U) =>
      `\x1B[${38 + O};5;${U}m`,
  s =
    (O = 0) =>
    (U, W, G) =>
      `\x1B[${38 + O};2;${U};${W};${G}m`,
  q = {
    modifier: {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29],
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      blackBright: [90, 39],
      gray: [90, 39],
      grey: [90, 39],
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39],
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgBlackBright: [100, 49],
      bgGray: [100, 49],
      bgGrey: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49],
    },
  },
  A0 = Object.keys(q.modifier),
  J0 = Object.keys(q.color),
  K0 = Object.keys(q.bgColor),
  C0 = [...J0, ...K0],
  X0 = Q0(),
  K = X0;
var M = (() => {
    if (navigator.userAgentData) {
      const O = navigator.userAgentData.brands.find(
        ({ brand: U }) => U === "Chromium",
      );
      if (O && O.version > 93) return 3;
    }
    if (/\b(Chrome|Chromium)\//.test(navigator.userAgent)) return 1;
    return 0;
  })(),
  n = M !== 0 && { level: M, hasBasic: !0, has256: M >= 2, has16m: M >= 3 },
  Z0 = { stdout: n, stderr: n },
  o = Z0;
function t(O, U, W) {
  let G = O.indexOf(U);
  if (G === -1) return O;
  const H = U.length;
  let D = 0,
    Q = "";
  do (Q += O.slice(D, G) + U + W), (D = G + H), (G = O.indexOf(U, D));
  while (G !== -1);
  return (Q += O.slice(D)), Q;
}
function r(O, U, W, G) {
  let H = 0,
    D = "";
  do {
    const Q = O[G - 1] === "\r";
    (D += O.slice(H, Q ? G - 1 : G) + U + (Q ? "\r\n" : "\n") + W),
      (H = G + 1),
      (G = O.indexOf("\n", H));
  } while (G !== -1);
  return (D += O.slice(H)), D;
}
var L = function (O) {
  return N0(O);
};
var { stdout: e, stderr: O0 } = o,
  S = Symbol("GENERATOR"),
  w = Symbol("STYLER"),
  I = Symbol("IS_EMPTY"),
  U0 = ["ansi", "ansi", "ansi256", "ansi16m"],
  N = Object.create(null),
  w0 = (O, U = {}) => {
    if (U.level && !(Number.isInteger(U.level) && U.level >= 0 && U.level <= 3))
      throw new Error("The `level` option should be an integer from 0 to 3");
    const W = e ? e.level : 0;
    O.level = U.level === void 0 ? W : U.level;
  };
var N0 = (O) => {
  const U = (...W) => W.join(" ");
  return w0(U, O), Object.setPrototypeOf(U, L.prototype), U;
};
Object.setPrototypeOf(L.prototype, Function.prototype);
for (let [O, U] of Object.entries(K))
  N[O] = {
    get() {
      const W = Y(this, f(U.open, U.close, this[w]), this[I]);
      return Object.defineProperty(this, O, { value: W }), W;
    },
  };
N.visible = {
  get() {
    const O = Y(this, this[w], !0);
    return Object.defineProperty(this, "visible", { value: O }), O;
  },
};
var _ = (O, U, W, ...G) => {
    if (O === "rgb") {
      if (U === "ansi16m") return K[W].ansi16m(...G);
      if (U === "ansi256") return K[W].ansi256(K.rgbToAnsi256(...G));
      return K[W].ansi(K.rgbToAnsi(...G));
    }
    if (O === "hex") return _("rgb", U, W, ...K.hexToRgb(...G));
    return K[W][O](...G);
  },
  V0 = ["rgb", "hex", "ansi256"];
for (let O of V0) {
  N[O] = {
    get() {
      const { level: W } = this;
      return function (...G) {
        const H = f(_(O, U0[W], "color", ...G), K.color.close, this[w]);
        return Y(this, H, this[I]);
      };
    },
  };
  const U = "bg" + O[0].toUpperCase() + O.slice(1);
  N[U] = {
    get() {
      const { level: W } = this;
      return function (...G) {
        const H = f(_(O, U0[W], "bgColor", ...G), K.bgColor.close, this[w]);
        return Y(this, H, this[I]);
      };
    },
  };
}
var B0 = Object.defineProperties(() => {}, {
    ...N,
    level: {
      enumerable: !0,
      get() {
        return this[S].level;
      },
      set(O) {
        this[S].level = O;
      },
    },
  }),
  f = (O, U, W) => {
    let G, H;
    if (W === void 0) (G = O), (H = U);
    else (G = W.openAll + O), (H = U + W.closeAll);
    return { open: O, close: U, openAll: G, closeAll: H, parent: W };
  },
  Y = (O, U, W) => {
    const G = (...H) => I0(G, H.length === 1 ? "" + H[0] : H.join(" "));
    return Object.setPrototypeOf(G, B0), (G[S] = O), (G[w] = U), (G[I] = W), G;
  },
  I0 = (O, U) => {
    if (O.level <= 0 || !U) return O[I] ? "" : U;
    let W = O[w];
    if (W === void 0) return U;
    const { openAll: G, closeAll: H } = W;
    if (U.includes("\x1B"))
      while (W !== void 0) (U = t(U, W.close, W.open)), (W = W.parent);
    const D = U.indexOf("\n");
    if (D !== -1) U = r(U, H, G, D);
    return G + U + H;
  };
Object.defineProperties(L.prototype, N);
var L0 = L(),
  v0 = L({ level: O0 ? O0.level : 0 });
var W0 = L0;
var V = W0;
class b {
  _log;
  constructor() {
    this._log = V;
  }
  info(O) {
    if (typeof O === "object") O = JSON.stringify(O, null, 2);
    console.log(this._log.blue(O));
  }
  error(O) {
    if (typeof O === "object") O = JSON.stringify(O, null, 2);
    console.log(this._log.red(O));
  }
  warn(O) {
    if (typeof O === "object") O = JSON.stringify(O, null, 2);
    console.log(this._log.yellow(O));
  }
  debug(O) {
    if (typeof O === "object") O = JSON.stringify(O, null, 2);
    console.log(this._log.green(O));
  }
}
class h extends Error {
  constructor(O) {
    super(O);
    this.name = "ClientError";
  }
}
class v extends Error {
  token;
  constructor(O, U) {
    super(U);
    (this.token = O), (this.name = "RuntimeError");
  }
}
class X extends Error {
  token;
  constructor(O, U) {
    super(U);
    (this.token = O), (this.name = "SyntaxError");
  }
}
class $0 {
  hasCliError = !1;
  hasRuntimeError = !1;
  hasSyntaxError = !1;
  log(O) {
    if (O instanceof h) console.log(V.red(O.message));
    else if (O instanceof v) console.log(V.red(O.message));
    else console.log(V.red(O.message));
  }
  report(O) {
    if (O instanceof h) this.hasCliError = !0;
    else if (O instanceof v) this.hasRuntimeError = !0;
    else this.hasSyntaxError = !0;
    throw (this.log(O), O);
  }
}
var J = new $0();
class j {
  type;
  lexeme;
  literal;
  line;
  constructor(O, U, W, G) {
    (this.type = O), (this.lexeme = U), (this.literal = W), (this.line = G);
  }
  to_string() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}
var $;
(function (F) {
  F["LEFT_PAREN"] = "LEFT_PAREN";
  F["RIGHT_PAREN"] = "RIGHT_PAREN";
  F["LEFT_BRACE"] = "LEFT_BRACE";
  F["RIGHT_BRACE"] = "RIGHT_BRACE";
  F["LEFT_BRACKET"] = "LEFT_BRACKET";
  F["RIGHT_BRACKET"] = "RIGHT_BRACKET";
  F["COMMA"] = "COMMA";
  F["DOT"] = "DOT";
  F["MINUS"] = "MINUS";
  F["PLUS"] = "PLUS";
  F["MODULO"] = "MODULO";
  F["SEMICOLON"] = "SEMICOLON";
  F["SLASH"] = "SLASH";
  F["STAR"] = "STAR";
  F["BANG"] = "BANG";
  F["BANG_EQUAL"] = "BANG_EQUAL";
  F["EQUAL"] = "EQUAL";
  F["EQUAL_EQUAL"] = "EQUAL_EQUAL";
  F["GREATER"] = "GREATER";
  F["GREATER_EQUAL"] = "GREATER_EQUAL";
  F["LESS"] = "LESS";
  F["LESS_EQUAL"] = "LESS_EQUAL";
  F["IDENTIFIER"] = "IDENTIFIER";
  F["STRING"] = "STRING";
  F["NUMBER"] = "NUMBER";
  F["AND"] = "AND";
  F["CLASS"] = "CLASS";
  F["ELSE"] = "ELSE";
  F["FALSE"] = "FALSE";
  F["FUN"] = "FUN";
  F["FOR"] = "FOR";
  F["IF"] = "IF";
  F["NIL"] = "NIL";
  F["OR"] = "OR";
  F["PRINT"] = "PRINT";
  F["RETURN"] = "RETURN";
  F["SUPER"] = "SUPER";
  F["THIS"] = "THIS";
  F["TRUE"] = "TRUE";
  F["VAR"] = "VAR";
  F["WHILE"] = "WHILE";
  F["EOF"] = "EOF";
})($ || ($ = {}));
var F0 = {
  and: $.AND,
  class: $.CLASS,
  else: $.ELSE,
  false: $.FALSE,
  for: $.FOR,
  fun: $.FUN,
  if: $.IF,
  nil: $.NIL,
  or: $.OR,
  print: $.PRINT,
  return: $.RETURN,
  super: $.SUPER,
  this: $.THIS,
  true: $.TRUE,
  var: $.VAR,
  while: $.WHILE,
};
class u {
  logger = new b();
  tokens;
  source;
  current = 0;
  start = 0;
  line = 1;
  constructor(O) {
    (this.source = O),
      (this.tokens = []),
      (this.current = 0),
      (this.start = 0),
      (this.line = 1);
  }
  scan_tokens() {
    while (!this.is_end()) (this.start = this.current), this.scan();
    this.tokens.push(new j($.EOF, "", null, this.line));
  }
  is_end() {
    return this.current >= this.source.length;
  }
  advance() {
    return this.source.charAt(this.current++);
  }
  match(O) {
    if (this.is_end()) return !1;
    if (this.source.charAt(this.current) !== O) return !1;
    return this.current++, !0;
  }
  add_token(O, U) {
    let W = this.source.substring(this.start, this.current),
      G = new j(O, W, U, this.line);
    this.tokens.push(G);
  }
  peek() {
    return this.source.charAt(this.current);
  }
  current_char() {
    return this.source.charAt(this.current - 1);
  }
  is_digit(O) {
    return O >= "0" && O <= "9";
  }
  is_alpha(O) {
    return (O >= "a" && O <= "z") || (O >= "A" && O <= "Z") || O === "_";
  }
  is_alpha_numeric(O) {
    return this.is_alpha(O) || this.is_digit(O);
  }
  identifier() {
    while (this.is_alpha_numeric(this.peek())) this.advance();
    let O = this.source.substring(this.start, this.current);
    const U = F0[O];
    if (U !== void 0) this.add_token(U, null);
    else this.add_token($.IDENTIFIER, null);
  }
  string() {
    while (this.peek() !== '"' && !this.is_end()) {
      if (this.peek() === "\n") this.line++;
      this.advance();
    }
    if (this.is_end())
      J.report(
        new X(
          null,
          "Unterminated string.at line " +
            this.line +
            " column " +
            this.current +
            "",
        ),
      );
    this.advance();
    let O = this.source.substring(this.start + 1, this.current - 1);
    this.add_token($.STRING, O);
  }
  number() {
    while (this.is_digit(this.peek())) this.advance();
    if (this.peek() === "." && this.is_digit(this.peek())) this.advance();
    let O = this.source.substring(this.start, this.current),
      U = parseFloat(O);
    this.add_token($.NUMBER, U);
  }
  scan() {
    let O = this.advance();
    switch (O) {
      case "{":
        this.add_token($.LEFT_BRACE, null);
        break;
      case "}":
        this.add_token($.RIGHT_BRACE, null);
        break;
      case "(":
        this.add_token($.LEFT_PAREN, null);
        break;
      case ")":
        this.add_token($.RIGHT_PAREN, null);
        break;
      case "\u2795":
      case "+":
        this.add_token($.PLUS, null);
        break;
      case "\u2796":
      case "-":
        this.add_token($.MINUS, null);
        break;
      case "\u2716":
      case "\u274C":
      case "*":
        this.add_token($.STAR, null);
        break;
      case "\u2797":
      case "/":
        if (this.match("/"))
          while (this.peek() != "\n" && !this.is_end()) this.advance();
        else this.add_token($.SLASH, null);
        break;
      case "\u267B":
      case "%":
        this.add_token($.MODULO, null);
        break;
      case "\u2714":
      case "=":
        this.add_token(
          this.match("=") || this.match("\u2714") ? $.EQUAL_EQUAL : $.EQUAL,
          null,
        );
        break;
      case "o":
        if (this.match("r")) this.add_token($.OR, null);
        break;
      case ",":
        this.add_token($.COMMA, null);
        break;
      case ".":
        this.add_token($.DOT, null);
        break;
      case "\u2757":
      case "!":
        this.add_token(
          this.match("=") || this.match("\u2714") ? $.BANG_EQUAL : $.BANG,
          null,
        );
        break;
      case "<":
      case "\u2B05":
        this.add_token(
          this.match("=") || this.match("\u2714") ? $.LESS_EQUAL : $.LESS,
          null,
        );
        break;
      case ">":
      case "\u27A1":
        this.add_token(
          this.match("=") || this.match("\u2714") ? $.GREATER_EQUAL : $.GREATER,
          null,
        );
        break;
      case "\n":
        this.line++;
        break;
      case "\t":
        break;
      case '"':
        this.string();
        break;
      case " ":
      case "\r":
        break;
      case ";":
        this.add_token($.SEMICOLON, null);
        break;
      default:
        if (this.is_digit(O)) this.number();
        else if (this.is_alpha(O)) this.identifier();
        break;
    }
  }
  get_tokens() {
    return this.logger.info(this.tokens), this.tokens;
  }
}
function G0() {
  return Bun.file("test/operators.beer").text();
}
class P {
  O;
  constructor(O) {
    this.statements = O;
    this.statements = O;
  }
  accept(O) {
    return O.visitBlockStmt(this);
  }
}
class A {
  O;
  constructor(O) {
    this.expression = O;
    this.expression = O;
  }
  accept(O) {
    return O.visitExpressionStmt(this);
  }
}
class c {
  O;
  constructor(O) {
    this.expression = O;
    this.expression = O;
  }
  accept(O) {
    return O.visitPrintStmt(this);
  }
}
class d {
  O;
  U;
  W;
  constructor(O, U, W) {
    this.condition = O;
    this.thenBranch = U;
    this.elseBranch = W;
    (this.condition = O), (this.thenBranch = U), (this.elseBranch = W);
  }
  accept(O) {
    return O.visitIfStmt(this);
  }
}
class C {
  O;
  U;
  constructor(O, U) {
    this.condition = O;
    this.body = U;
    (this.condition = O), (this.body = U);
  }
  accept(O) {
    return O.visitWhileStmt(this);
  }
}
class x {
  O;
  U;
  constructor(O, U) {
    this.name = O;
    this.initializer = U;
    (this.name = O), (this.initializer = U);
  }
  accept(O) {
    return O.visitVarStmt(this);
  }
}
class B {
  left;
  operator;
  right;
  constructor(O, U, W) {
    (this.left = O), (this.operator = U), (this.right = W);
  }
  accept(O) {
    return O.visitBinaryExpr(this);
  }
}
class g {
  operator;
  right;
  constructor(O, U) {
    (this.operator = O), (this.right = U);
  }
  accept(O) {
    return O.visitUnaryExpr(this);
  }
}
class Z {
  value;
  constructor(O) {
    this.value = O;
  }
  accept(O) {
    return O.visitLiteralExpr(this);
  }
}
class m {
  expression;
  constructor(O) {
    this.expression = O;
  }
  accept(O) {
    return O.visitGroupingExpr(this);
  }
}
class z {
  O;
  constructor(O) {
    this.name = O;
    this.name = O;
  }
  accept(O) {
    return O.visitVariableExpr(this);
  }
}
class a {
  O;
  U;
  constructor(O, U) {
    this.name = O;
    this.value = U;
    (this.name = O), (this.value = U);
  }
  accept(O) {
    return O.visitAssignExpr(this);
  }
}
class E {
  O;
  U;
  W;
  constructor(O, U, W) {
    this.left = O;
    this.operator = U;
    this.right = W;
    (this.left = O), (this.operator = U), (this.right = W);
  }
  accept(O) {
    return O.visitLogicalExpr(this);
  }
}
class k {
  visitAssignExpr(O) {
    return this.parenthesize(O.name.lexeme, O.value);
  }
  visitBinaryExpr(O) {
    return this.parenthesize(O.operator.lexeme, O.left, O.right);
  }
  visitUnaryExpr(O) {
    return this.parenthesize(O.operator.lexeme, O.right);
  }
  visitLiteralExpr(O) {
    if (O.value === null) return "nil";
    return O.value.toString();
  }
  visitLogicalExpr(O) {
    return this.parenthesize(O.operator.lexeme, O.left, O.right);
  }
  visitExpressionStmt(O) {
    return this.parenthesize("expression", O.expression);
  }
  visitPrintStmt(O) {
    return this.parenthesize("print", O.expression);
  }
  visitVarStmt(O) {
    const U = new z(O.name);
    if (O.initializer) return this.parenthesize("var", U, O.initializer);
    return this.parenthesize("var", U);
  }
  visitBlockStmt(O) {
    let U = "(block ";
    for (let W of O.statements) U += "\n" + this.indent(W.accept(this));
    return (U += ")"), U;
  }
  visitForStmt(O) {
    let U = `(for ${this.stringify(O.initializer)} ${this.stringify(
      O.condition,
    )} ${this.stringify(O.increment)}\n`;
    const W = this.stringify(O.body);
    return (U += this.indent(W)), (U += ")"), U;
  }
  visitWhileStmt(O) {
    let U = `(while ${this.stringify(O.condition)}\n`;
    const W = this.stringify(O.body);
    return (U += this.indent(W)), (U += ")"), U;
  }
  visitIfStmt(O) {
    let U = `(if ${this.stringify(O.condition)}\n`;
    const W = this.stringify(O.thenBranch);
    if (((U += this.indent(W)), O.elseBranch !== null)) {
      U += "\n";
      const G = this.stringify(O.elseBranch);
      U += this.indent(G);
    }
    return (U += ")"), U;
  }
  visitVariableExpr(O) {
    return O.name.lexeme;
  }
  visitGroupingExpr(O) {
    return this.parenthesize("group", O.expression);
  }
  parenthesize(O, ...U) {
    let W = `(${O}`;
    for (let G of U) W += ` ${G.accept(this)}`;
    return (W += ")"), W;
  }
  indent(O) {
    return O.split("\n")
      .map((U) => `  ${U}`)
      .join("\n");
  }
  print(O) {
    return O.accept(this);
  }
  stringify(O) {
    if (O === null) return "nil";
    if (O instanceof Array) return O.map((U) => U.accept(this)).join("\n");
    else return O.accept(this);
  }
  print_ast(O) {
    console.log(V.cyan(this.stringify(O)));
  }
}
class i {
  tokens;
  current;
  constructor() {
    (this.tokens = []), (this.current = 0);
  }
  setTokens(O) {
    this.tokens = O;
  }
  parse() {
    const O = [];
    while (!this.is_at_end())
      try {
        O.push(this.declaration());
      } catch (U) {
        if (U instanceof X) throw J.report(U);
        this.synchronize();
      }
    return O;
  }
  declaration() {
    if (this.match($.VAR)) return this.var_declaration();
    return this.statement();
  }
  var_declaration() {
    const O = this.consume($.IDENTIFIER, "Expect variable name.");
    let U = null;
    if (this.match($.EQUAL)) U = this.expression();
    return (
      this.consume($.SEMICOLON, "Expect ';' after variable declaration."),
      new x(O, U)
    );
  }
  block() {
    const O = [];
    while (!this.check($.RIGHT_BRACE) && !this.is_at_end())
      O.push(this.declaration());
    return this.consume($.RIGHT_BRACE, "Expect '}' after block."), O;
  }
  statement() {
    if (this.match($.FOR)) return this.for_statement();
    if (this.match($.IF)) return this.if_statement();
    if (this.match($.PRINT)) return this.print_statement();
    if (this.match($.WHILE)) return this.while_statement();
    if (this.match($.LEFT_BRACE)) return new P(this.block());
    return this.expression_statement();
  }
  for_statement() {
    this.consume($.LEFT_PAREN, "Expect '(' after 'for'.");
    let O;
    if (this.match($.SEMICOLON)) O = null;
    else if (this.match($.VAR)) O = this.var_declaration();
    else O = this.expression_statement();
    let U = null;
    if (!this.check($.SEMICOLON)) U = this.expression();
    this.consume($.SEMICOLON, "Expect ';' after loop condition.");
    let W = null;
    if (!this.check($.RIGHT_PAREN)) W = this.expression();
    this.consume($.RIGHT_PAREN, "Expect ')' after for clauses.");
    let G = this.statement();
    if (W !== null) G = new P([G, new A(W)]);
    if (U === null) U = new Z(!0);
    if (((G = new C(U, G)), O !== null)) G = new P([O, G]);
    return G;
  }
  while_statement() {
    this.consume($.LEFT_PAREN, "Expect '(' after 'while'.");
    const O = this.expression();
    this.consume($.RIGHT_PAREN, "Expect ')' after condition.");
    const U = this.statement();
    return new C(O, U);
  }
  if_statement() {
    this.consume($.LEFT_PAREN, "Expect '(' after 'if'.");
    const O = this.expression();
    this.consume($.RIGHT_PAREN, "Expect ')' after if condition.");
    const U = this.statement();
    let W = null;
    if (this.match($.ELSE)) W = this.statement();
    return new d(O, U, W);
  }
  print_statement() {
    let O = this.expression();
    return this.consume($.SEMICOLON, "Expect ';' after value."), new c(O);
  }
  expression_statement() {
    const O = this.expression();
    return this.consume($.SEMICOLON, "Expect ';' after expression."), new A(O);
  }
  equality() {
    let O = this.comparison();
    while (this.match($.BANG_EQUAL, $.EQUAL_EQUAL)) {
      let U = this.previous(),
        W = this.comparison();
      O = new B(O, U, W);
    }
    return O;
  }
  comparison() {
    let O = this.term();
    while (this.match($.GREATER, $.GREATER_EQUAL, $.LESS, $.LESS_EQUAL)) {
      let U = this.previous(),
        W = this.term();
      O = new B(O, U, W);
    }
    return O;
  }
  term() {
    let O = this.factor();
    while (this.match($.MINUS, $.PLUS)) {
      let U = this.previous(),
        W = this.factor();
      O = new B(O, U, W);
    }
    return O;
  }
  factor() {
    let O = this.unary();
    while (this.match($.SLASH, $.STAR)) {
      let U = this.previous(),
        W = this.unary();
      O = new B(O, U, W);
    }
    return O;
  }
  unary() {
    if (this.match($.BANG, $.MINUS)) {
      let O = this.previous(),
        U = this.unary();
      return new g(O, U);
    }
    return this.primary();
  }
  primary() {
    if (this.match($.FALSE)) return new Z(!1);
    if (this.match($.TRUE)) return new Z(!0);
    if (this.match($.NIL)) return new Z(null);
    if (this.match($.NUMBER, $.STRING)) return new Z(this.previous().literal);
    if (this.match($.LEFT_PAREN)) {
      let O = this.expression();
      return (
        this.consume($.RIGHT_PAREN, "Expect ')' after expression."), new m(O)
      );
    }
    if (this.match($.IDENTIFIER)) return new z(this.previous());
    return J.report(new X(this.peek(), "Expect expression."));
  }
  expression() {
    return this.assignment();
  }
  assignment() {
    let O = this.or();
    if (this.match($.EQUAL)) {
      let U = this.previous(),
        W = this.assignment();
      if (O instanceof z) {
        let G = O.name;
        return new a(G, W);
      }
      J.report(new X(U, "Invalid assignment target."));
    }
    return O;
  }
  or() {
    let O = this.and();
    while (this.match($.OR)) {
      let U = this.previous(),
        W = this.and();
      O = new E(O, U, W);
    }
    return O;
  }
  and() {
    let O = this.equality();
    while (this.match($.AND)) {
      let U = this.previous(),
        W = this.equality();
      O = new E(O, U, W);
    }
    return O;
  }
  consume(O, U) {
    if (this.check(O)) return this.advance();
    return J.report(new X(this.peek(), U));
  }
  match(...O) {
    for (let U of O) if (this.check(U)) return this.advance(), !0;
    return !1;
  }
  check(O) {
    if (this.is_at_end()) return !1;
    return this.peek().type === O;
  }
  advance() {
    if (!this.is_at_end()) this.current++;
    return this.previous();
  }
  previous() {
    return this.tokens[this.current - 1];
  }
  peek() {
    return this.tokens[this.current];
  }
  is_at_end() {
    return this.peek().type === "EOF";
  }
  synchronize() {
    this.advance();
    while (this.is_at_end()) {
      if (this.previous().type === $.SEMICOLON) return;
      switch (this.peek().type) {
        case $.CLASS:
        case $.FUN:
        case $.VAR:
        case $.FOR:
        case $.IF:
        case $.WHILE:
        case $.PRINT:
        case $.RETURN:
          return;
      }
      this.advance();
    }
  }
}
class R {
  enclosing;
  values = new Map();
  constructor(O) {
    if (((this.enclosing = null), O)) this.enclosing = O;
  }
  define(O, U) {
    this.values.set(O, U);
  }
  get(O) {
    if (this.values.has(O)) return this.values.get(O);
    if (this.enclosing) return this.enclosing.get(O);
    return J.report(new ReferenceError(`Undefined variable '${O}'`));
  }
  assign(O, U) {
    if (this.values.has(O)) {
      this.values.set(O, U);
      return;
    }
    if (this.enclosing) {
      this.enclosing.assign(O, U);
      return;
    }
    return J.report(new ReferenceError(`Undefined variable '${O}'`));
  }
}
class l {
  environment = new R();
  interpret(O) {
    try {
      for (let U of O) this.execute(U);
    } catch (U) {
      throw U;
    }
  }
  execute(O) {
    O.accept(this);
  }
  evaluate(O) {
    return O.accept(this);
  }
  is_equal(O, U) {
    if (O === null && U === null) return !0;
    if (O === null) return !1;
    return O === U;
  }
  checkNumberOperands(O, U, W) {
    if (typeof U === "number" && typeof W === "number") return;
    else
      J.report(
        new SyntaxError("Operands must be numbers at " + O.line + O.lexeme),
      );
  }
  is_truthy(O) {
    if (O === null) return !1;
    if (typeof O === "boolean") return O;
    return !0;
  }
  stringify(O) {
    if (O === null) return "nil";
    if (typeof O === "number") return O.toString();
    return O.toString();
  }
  execute_block(O, U) {
    const W = this.environment;
    try {
      this.environment = U;
      for (let G of O) this.execute(G);
    } finally {
      this.environment = W;
    }
  }
  visitAssignExpr(O) {
    let U = this.evaluate(O.value);
    return this.environment.assign(O.name.lexeme, U), U;
  }
  visitBinaryExpr(O) {
    let U = this.evaluate(O.left),
      W = this.evaluate(O.right);
    switch (O.operator.type) {
      case $.GREATER:
        return this.checkNumberOperands(O.operator, U, W), U > W;
      case $.GREATER_EQUAL:
        return this.checkNumberOperands(O.operator, U, W), U >= W;
      case $.LESS:
        return this.checkNumberOperands(O.operator, U, W), U < W;
      case $.LESS_EQUAL:
        return this.checkNumberOperands(O.operator, U, W), U <= W;
      case $.MINUS:
        return this.checkNumberOperands(O.operator, U, W), U - W;
      case $.BANG_EQUAL:
        return !this.is_equal(U, W);
      case $.EQUAL_EQUAL:
        return this.is_equal(U, W);
      case $.SLASH:
        return this.checkNumberOperands(O.operator, U, W), U / W;
      case $.STAR:
        return this.checkNumberOperands(O.operator, U, W), U * W;
      case $.PLUS:
        if (typeof U === "number" && typeof W === "number") return U + W;
        if (typeof U === "string" && typeof W === "string") return U + W;
        J.report(
          new SyntaxError(
            "Operands must be two numbers or two strings at " +
              O.operator.line +
              O.operator.lexeme,
          ),
        );
    }
    return null;
  }
  visitUnaryExpr(O) {
    let U = this.evaluate(O.right);
    switch (O.operator.type) {
      case $.MINUS:
        return -U;
      case $.BANG:
        return !this.is_truthy(U);
    }
    return null;
  }
  visitLiteralExpr(O) {
    return O.value;
  }
  visitGroupingExpr(O) {
    return this.evaluate(O.expression);
  }
  visitVariableExpr(O) {
    return this.environment.get(O.name.lexeme);
  }
  visitLogicalExpr(O) {
    let U = this.evaluate(O.left);
    if (O.operator.type === $.OR) {
      if (this.is_truthy(U)) return U;
    } else if (!this.is_truthy(U)) return U;
    return this.evaluate(O.right);
  }
  visitForStmt(O) {
    if (O.initializer) this.execute(O.initializer);
    while (this.is_truthy(this.evaluate(O.condition))) {
      if ((this.execute(O.body), O.increment === null)) return;
      this.evaluate(O.increment);
    }
  }
  visitWhileStmt(O) {
    while (this.is_truthy(this.evaluate(O.condition))) this.execute(O.body);
  }
  visitPrintStmt(O) {
    let U = this.evaluate(O.expression);
    console.log(this.stringify(U));
  }
  visitExpressionStmt(O) {
    this.evaluate(O.expression);
  }
  visitVarStmt(O) {
    let U = null;
    if (O.initializer !== null) U = this.evaluate(O.initializer);
    this.environment.define(O.name.lexeme, U);
  }
  visitBlockStmt(O) {
    this.execute_block(O.statements, new R(this.environment));
  }
  visitIfStmt(O) {
    if (this.is_truthy(this.evaluate(O.condition))) this.execute(O.thenBranch);
    else if (O.elseBranch !== null) this.execute(O.elseBranch);
  }
}
var z0 = await G0(),
  H0 = new u(z0);
H0.scan_tokens();
var M0 = H0.get_tokens(),
  q0 = new i();
q0.setTokens(M0);
var D0 = q0.parse(),
  Y0 = new k();
Y0.print_ast(D0);
var j0 = new l();
j0.interpret(D0);
