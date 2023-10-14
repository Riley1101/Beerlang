// node_modules/.pnpm/chalk@5.3.0/node_modules/chalk/source/vendor/ansi-styles/index.js
var assembleStyles = function() {
  const codes = new Map;
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
};
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
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
    whiteBright: [97, 39]
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
    bgWhiteBright: [107, 49]
  }
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/.pnpm/chalk@5.3.0/node_modules/chalk/source/vendor/supports-color/browser.js
var level = (() => {
  if (navigator.userAgentData) {
    const brand = navigator.userAgentData.brands.find(({ brand: brand2 }) => brand2 === "Chromium");
    if (brand && brand.version > 93) {
      return 3;
    }
  }
  if (/\b(Chrome|Chromium)\//.test(navigator.userAgent)) {
    return 1;
  }
  return 0;
})();
var colorSupport = level !== 0 && {
  level,
  hasBasic: true,
  has256: level >= 2,
  has16m: level >= 3
};
var supportsColor = {
  stdout: colorSupport,
  stderr: colorSupport
};
var browser_default = supportsColor;

// node_modules/.pnpm/chalk@5.3.0/node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// /home/arkar/Documents/Rocks/interpreter/gideon-clone/node_modules/chalk/source/index.js
var createChalk = function(options) {
  return chalkFactory(options);
};
var { stdout: stdoutColor, stderr: stderrColor } = browser_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === undefined ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk = (...strings) => strings.join(" ");
  applyOptions(chalk, options);
  Object.setPrototypeOf(chalk, createChalk.prototype);
  return chalk;
};
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level2, type, ...arguments_) => {
  if (model === "rgb") {
    if (level2 === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level2 === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level2, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level: level2 } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level2], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level: level2 } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level2], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level2) {
      this[GENERATOR].level = level2;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === undefined) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === undefined) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== undefined) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// src/read_source.ts
function run_file(callback) {
  const args = Bun.argv;
  const fileName = args[2];
  if (fileName === undefined) {
    console.log("Usage: beer [script]");
    process.exit(64);
  }
  const file = Bun.file(fileName);
  const regex = /(\.beer)$/g;
  if (!regex.test(file.name)) {
    console.log("File must have .beer extension");
    process.exit(64);
  }
  const fileContent = file.text();
  fileContent.then((text) => {
    callback(text);
  });
}

// src/error.ts
var Log = source_default;

class Logger {
  _log;
  constructor() {
    this._log = Log;
  }
  info(message) {
    if (typeof message === "object") {
      message = JSON.stringify(message, null, 2);
    }
    console.log(this._log.blue(message));
  }
  error(message) {
    if (typeof message === "object") {
      message = JSON.stringify(message, null, 2);
    }
    console.log(this._log.red(message));
  }
  warn(message) {
    if (typeof message === "object") {
      message = JSON.stringify(message, null, 2);
    }
    console.log(this._log.yellow(message));
  }
  debug(message) {
    if (typeof message === "object") {
      message = JSON.stringify(message, null, 2);
    }
    console.log(this._log.green(message));
  }
}

class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = "ClientError";
  }
}

class RuntimeError extends Error {
  token;
  constructor(token, message) {
    super(message);
    this.token = token;
    this.name = "RuntimeError";
  }
}

class SyntaxError2 extends Error {
  token;
  constructor(token, message) {
    super(message);
    this.token = token;
    this.name = "SyntaxError";
  }
}

class ErrorReporter {
  hasCliError = false;
  hasRuntimeError = false;
  hasSyntaxError = false;
  log(error) {
    if (error instanceof ClientError) {
      console.log(Log.red(error.message));
    } else if (error instanceof RuntimeError) {
      console.log(Log.red(error.message));
    } else {
      console.log(Log.red(error.message));
    }
  }
  report(error) {
    if (error instanceof ClientError) {
      this.hasCliError = true;
    } else if (error instanceof RuntimeError) {
      this.hasRuntimeError = true;
    } else {
      this.hasSyntaxError = true;
    }
    this.log(error);
    throw error;
  }
}
var errorReporter = new ErrorReporter;

// src/ast.ts
class BlockStmt {
  statements;
  constructor(statements) {
    this.statements = statements;
    this.statements = statements;
  }
  accept(visitor) {
    return visitor.visitBlockStmt(this);
  }
}

class ExpressionStmt {
  expression;
  constructor(expression) {
    this.expression = expression;
    this.expression = expression;
  }
  accept(visitor) {
    return visitor.visitExpressionStmt(this);
  }
}

class PrintStmt {
  expression;
  constructor(expression) {
    this.expression = expression;
    this.expression = expression;
  }
  accept(visitor) {
    return visitor.visitPrintStmt(this);
  }
}

class IfStmt {
  condition;
  thenBranch;
  elseBranch;
  constructor(condition, thenBranch, elseBranch) {
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
  accept(visitor) {
    return visitor.visitIfStmt(this);
  }
}
class WhileStmt {
  condition;
  body;
  constructor(condition, body) {
    this.condition = condition;
    this.body = body;
    this.condition = condition;
    this.body = body;
  }
  accept(visitor) {
    return visitor.visitWhileStmt(this);
  }
}

class ReturnStmt {
  keyword;
  value;
  constructor(keyword, value) {
    this.keyword = keyword;
    this.value = value;
    this.keyword = keyword;
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitReturnStmt(this);
  }
}

class FunctionStmt {
  name;
  params;
  body;
  constructor(name, params, body) {
    this.name = name;
    this.params = params;
    this.body = body;
    this.name = name;
    this.params = params;
    this.body = body;
  }
  accept(visitor) {
    return visitor.visitFunctionStmt(this);
  }
}

class SuperExpr {
  keyword;
  method;
  constructor(keyword, method) {
    this.keyword = keyword;
    this.method = method;
    this.keyword = keyword;
    this.method = method;
  }
  accept(visitor) {
    return visitor.visitSuperExpr(this);
  }
}

class ClassStmt {
  name;
  superclass;
  methods;
  constructor(name, superclass, methods) {
    this.name = name;
    this.superclass = superclass;
    this.methods = methods;
    this.name = name;
    this.superclass = superclass;
    this.methods = methods;
  }
  accept(visitor) {
    return visitor.visitClassStmt(this);
  }
}

class VarStmt {
  name;
  initializer;
  constructor(name, initializer) {
    this.name = name;
    this.initializer = initializer;
    this.name = name;
    this.initializer = initializer;
  }
  accept(visitor) {
    return visitor.visitVarStmt(this);
  }
}

class SetExpr {
  object;
  name;
  value;
  constructor(object, name, value) {
    this.object = object;
    this.name = name;
    this.value = value;
    this.object = object;
    this.name = name;
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitSetExpr(this);
  }
}

class ThisExpr {
  keyword;
  constructor(keyword) {
    this.keyword = keyword;
    this.keyword = keyword;
  }
  accept(visitor) {
    return visitor.visitThisExpr(this);
  }
}

class GetExpr {
  object;
  name;
  constructor(object, name) {
    this.object = object;
    this.name = name;
    this.object = object;
    this.name = name;
  }
  accept(visitor) {
    return visitor.visitGetExpr(this);
  }
}

class BinaryExpr {
  left;
  operator;
  right;
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor) {
    return visitor.visitBinaryExpr(this);
  }
}

class UnaryExpr {
  operator;
  right;
  constructor(operator, right) {
    this.operator = operator;
    this.right = right;
  }
  accept(visitor) {
    return visitor.visitUnaryExpr(this);
  }
}

class LiteralExpr {
  value;
  constructor(value) {
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitLiteralExpr(this);
  }
}

class GroupingExpr {
  expression;
  constructor(expression) {
    this.expression = expression;
  }
  accept(visitor) {
    return visitor.visitGroupingExpr(this);
  }
}

class VariableExpr {
  name;
  constructor(name) {
    this.name = name;
    this.name = name;
  }
  accept(visitor) {
    return visitor.visitVariableExpr(this);
  }
}

class AssignExpr {
  name;
  value;
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.name = name;
    this.value = value;
  }
  accept(visitor) {
    return visitor.visitAssignExpr(this);
  }
}

class CallExpr {
  callee;
  paren;
  args;
  constructor(callee, paren, args) {
    this.callee = callee;
    this.paren = paren;
    this.args = args;
    this.callee = callee;
    this.paren = paren;
    this.args = args;
  }
  accept(visitor) {
    return visitor.visitCallExpr(this);
  }
}

class LogicalExpr {
  left;
  operator;
  right;
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  accept(visitor) {
    return visitor.visitLogicalExpr(this);
  }
}

class BeerAstPrinter {
  visitSetExpr(expr) {
    return this.parenthesize(`set ${expr.name.lexeme}`, expr.value);
  }
  visitGetExpr(expr) {
    return this.parenthesize(`get ${expr.name.lexeme}`, expr.object);
  }
  visitAssignExpr(expr) {
    return this.parenthesize(expr.name.lexeme, expr.value);
  }
  visitBinaryExpr(expr) {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }
  visitUnaryExpr(expr) {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }
  visitLiteralExpr(expr) {
    if (expr.value === null)
      return "nil";
    return expr.value.toString();
  }
  visitLogicalExpr(expr) {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }
  visitExpressionStmt(stmt) {
    return this.parenthesize("expression", stmt.expression);
  }
  visitPrintStmt(stmt) {
    return this.parenthesize("print", stmt.expression);
  }
  visitVarStmt(stmt) {
    const name = new VariableExpr(stmt.name);
    if (stmt.initializer) {
      return this.parenthesize("var", name, stmt.initializer);
    }
    return this.parenthesize("var", name);
  }
  visitBlockStmt(stmt) {
    let str = `(block `;
    for (const statement of stmt.statements) {
      str += "\n" + this.indent(statement.accept(this));
    }
    str += ")";
    return str;
  }
  visitForStmt(stmt) {
    let result = `(for ${this.stringify(stmt.initializer)} ${this.stringify(stmt.condition)} ${this.stringify(stmt.increment)}\n`;
    const bodyResult = this.stringify(stmt.body);
    result += this.indent(bodyResult);
    result += ")";
    return result;
  }
  visitWhileStmt(stmt) {
    let result = `(while ${this.stringify(stmt.condition)}\n`;
    const bodyResult = this.stringify(stmt.body);
    result += this.indent(bodyResult);
    result += ")";
    return result;
  }
  visitReturnStmt(stmt) {
    if (stmt.value) {
      return this.parenthesize("return", stmt.value);
    }
    return this.parenthesize("return");
  }
  visitFunctionStmt(stmt) {
    let result = `(fun ${stmt.name.lexeme} (`;
    for (const param of stmt.params) {
      result += param.lexeme + " ";
    }
    result += ")\n";
    const bodyResult = this.stringify(stmt.body);
    result += this.indent(bodyResult);
    result += ")";
    return result;
  }
  visitClassStmt(stmt) {
    let result = `(class ${stmt.name.lexeme}`;
    stmt.methods.forEach((method) => {
      result += "\n" + this.indent(this.stringify(method));
    });
    result += ")";
    return result;
  }
  visitIfStmt(stmt) {
    let result = `(if ${this.stringify(stmt.condition)}\n`;
    const thenBranchResult = this.stringify(stmt.thenBranch);
    result += this.indent(thenBranchResult);
    if (stmt.elseBranch !== null) {
      result += "\n";
      const elseBranchResult = this.stringify(stmt.elseBranch);
      result += this.indent(elseBranchResult);
    }
    result += ")";
    return result;
  }
  visitVariableExpr(expr) {
    return expr.name.lexeme;
  }
  visitGroupingExpr(expr) {
    return this.parenthesize("group", expr.expression);
  }
  visitThisExpr(expr) {
    return expr.keyword.lexeme;
  }
  visitCallExpr(expr) {
    return this.parenthesize("call", expr.callee, ...expr.args);
  }
  visitSuperExpr(expr) {
    return expr.keyword.lexeme;
  }
  parenthesize(name, ...exprs) {
    let str = `(${name}`;
    for (const expr of exprs) {
      str += ` ${expr.accept(this)}`;
    }
    str += ")";
    return str;
  }
  indent(lines) {
    return lines.split("\n").map((line) => `  ${line}`).join("\n");
  }
  print(expr) {
    return expr.accept(this);
  }
  stringify(target) {
    if (target === null)
      return "nil";
    if (target instanceof Array) {
      return target.map((stmt) => stmt.accept(this)).join("\n");
    } else {
      return target.accept(this);
    }
  }
  print_ast(stmt) {
    console.log(Log.cyan(this.stringify(stmt)));
  }
}

// src/environment.ts
class Environment {
  enclosing;
  values = new Map;
  constructor(enclosing) {
    this.enclosing = null;
    if (enclosing) {
      this.enclosing = enclosing;
    }
  }
  define(name, value) {
    this.values.set(name, value);
  }
  get(name) {
    if (this.values.has(name)) {
      return this.values.get(name);
    }
    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }
    return errorReporter.report(new ReferenceError(`Undefined variable '${name}'`));
  }
  assign(name, value) {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }
    if (this.enclosing !== null) {
      this.enclosing.assign(name, value);
      return;
    }
    return errorReporter.report(new ReferenceError(`Undefined variable '${name}'`));
  }
  ancestor(distance) {
    let environment = this;
    for (let i = 0;i < distance; i++) {
      environment = environment.enclosing;
    }
    return environment;
  }
  get_at(distance, name) {
    return this.ancestor(distance).values.get(name);
  }
  assign_at(distance, name, value) {
    this.ancestor(distance).values.set(name, value);
  }
}

// src/types.ts
var TokenType;
(function(TokenType2) {
  TokenType2["LEFT_PAREN"] = "LEFT_PAREN";
  TokenType2["RIGHT_PAREN"] = "RIGHT_PAREN";
  TokenType2["LEFT_BRACE"] = "LEFT_BRACE";
  TokenType2["RIGHT_BRACE"] = "RIGHT_BRACE";
  TokenType2["LEFT_BRACKET"] = "LEFT_BRACKET";
  TokenType2["RIGHT_BRACKET"] = "RIGHT_BRACKET";
  TokenType2["COMMA"] = "COMMA";
  TokenType2["DOT"] = "DOT";
  TokenType2["MINUS"] = "MINUS";
  TokenType2["PLUS"] = "PLUS";
  TokenType2["MODULO"] = "MODULO";
  TokenType2["SEMICOLON"] = "SEMICOLON";
  TokenType2["SLASH"] = "SLASH";
  TokenType2["STAR"] = "STAR";
  TokenType2["BANG"] = "BANG";
  TokenType2["BANG_EQUAL"] = "BANG_EQUAL";
  TokenType2["EQUAL"] = "EQUAL";
  TokenType2["EQUAL_EQUAL"] = "EQUAL_EQUAL";
  TokenType2["GREATER"] = "GREATER";
  TokenType2["GREATER_EQUAL"] = "GREATER_EQUAL";
  TokenType2["LESS"] = "LESS";
  TokenType2["LESS_EQUAL"] = "LESS_EQUAL";
  TokenType2["IDENTIFIER"] = "IDENTIFIER";
  TokenType2["STRING"] = "STRING";
  TokenType2["NUMBER"] = "NUMBER";
  TokenType2["AND"] = "AND";
  TokenType2["CLASS"] = "CLASS";
  TokenType2["ELSE"] = "ELSE";
  TokenType2["FALSE"] = "FALSE";
  TokenType2["FUN"] = "FUN";
  TokenType2["FOR"] = "FOR";
  TokenType2["IF"] = "IF";
  TokenType2["NIL"] = "NIL";
  TokenType2["OR"] = "OR";
  TokenType2["PRINT"] = "PRINT";
  TokenType2["RETURN"] = "RETURN";
  TokenType2["SUPER"] = "SUPER";
  TokenType2["THIS"] = "THIS";
  TokenType2["TRUE"] = "TRUE";
  TokenType2["VAR"] = "VAR";
  TokenType2["WHILE"] = "WHILE";
  TokenType2["EOF"] = "EOF";
})(TokenType || (TokenType = {}));
var keywords = {
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
  while: TokenType.WHILE
};

class BeerCallable {
}

class BeerFunction extends BeerCallable {
  declaration;
  closure;
  is_initializer;
  static Return = class Return {
    value;
    constructor(value) {
      this.value = value;
    }
  };
  constructor(declaration, closure, is_initializer = false) {
    super();
    this.declaration = declaration;
    this.closure = closure;
    this.is_initializer = is_initializer;
    this.declaration = declaration;
    this.closure = closure;
    this.is_initializer = is_initializer;
  }
  to_string() {
    return `<fun ${this.declaration.name.lexeme}>`;
  }
  arity() {
    return this.declaration.params.length;
  }
  bind(instance) {
    let environment2 = new Environment(this.closure);
    environment2.define("this", instance);
    return new BeerFunction(this.declaration, environment2, this.is_initializer);
  }
  call(interpreter, args) {
    const environment2 = new Environment(this.closure);
    for (let i = 0;i < this.declaration.params.length; i++) {
      environment2.define(this.declaration.params[i].lexeme, args[i]);
    }
    try {
      interpreter.execute_block(this.declaration.body, environment2);
    } catch (error4) {
      if (error4 instanceof BeerFunction.Return) {
        if (this.is_initializer)
          return this.closure.get_at(0, "this");
        return error4.value;
      }
      throw error4;
    }
    if (this.is_initializer)
      return this.closure.get_at(0, "this");
    return null;
  }
}

class BeerClock extends BeerCallable {
  constructor() {
    super(...arguments);
  }
  arity() {
    return 0;
  }
  call() {
    return Date.now().valueOf() / 1000;
  }
  to_string() {
    return "<native fn>";
  }
}

class BeerClass extends BeerCallable {
  methods;
  superclass;
  name;
  constructor(name, methods, superclass) {
    super();
    this.methods = methods;
    this.superclass = superclass;
    this.name = name;
    this.methods = methods;
    this.superclass = superclass;
  }
  find_method(name) {
    if (this.methods.has(name)) {
      return this.methods.get(name);
    }
    if (this.superclass !== null) {
      return this.superclass.find_method(name);
    }
    return null;
  }
  arity() {
    const initializer = this.find_method("init");
    if (initializer === null)
      return 0;
    return initializer.arity();
  }
  call(interpreter, args) {
    let instance = new BeerInstance(this);
    const initializer = this.find_method("init");
    if (initializer !== null)
      initializer.bind(instance).call(interpreter, args);
    return instance;
  }
  to_string() {
    return `<class ${this.name}>`;
  }
}

class BeerInstance {
  klass;
  fields = new Map;
  constructor(klass) {
    this.klass = klass;
    this.klass = klass;
  }
  get(name) {
    if (this.fields.has(name.lexeme)) {
      return this.fields.get(name.lexeme);
    }
    let method = this.klass.find_method(name.lexeme);
    if (method) {
      return method.bind(this);
    }
    return errorReporter.report(new SyntaxError(`Undefined property '${name.lexeme}'.`));
  }
  set(name, value) {
    this.fields.set(name.lexeme, value);
  }
  to_string() {
    return `<instance ${this.klass.name}>`;
  }
}

// src/interpreter.ts
class Beer {
  globals = new Environment;
  environment = this.globals;
  locals = new Map;
  constructor() {
    this.globals.define("clock", new BeerClock);
  }
  resolve(expr, depth) {
    this.locals.set(expr, depth);
  }
  look_up_variable(name, expr) {
    const distance = this.locals.get(expr);
    if (distance !== undefined) {
      return this.environment.get_at(distance, name.lexeme);
    } else {
      return this.globals.get(name.lexeme);
    }
  }
  interpret(exprs) {
    try {
      for (let expr of exprs) {
        this.execute(expr);
      }
    } catch (e) {
      throw e;
    }
  }
  execute(stmt) {
    stmt.accept(this);
  }
  evaluate(expr) {
    return expr.accept(this);
  }
  is_equal(a, b) {
    if (a === null && b === null)
      return true;
    if (a === null)
      return false;
    return a === b;
  }
  checkNumberOperands(token, left, right) {
    if (typeof left === "number" && typeof right === "number")
      return;
    else
      errorReporter.report(new SyntaxError("Operands must be numbers at " + token.line + token.lexeme));
  }
  is_truthy(object) {
    if (object === null)
      return false;
    if (typeof object === "boolean")
      return object;
    return true;
  }
  stringify(object) {
    if (object === null)
      return "nil";
    if (typeof object === "number")
      return object.toString();
    if (object instanceof BeerCallable)
      return object.to_string();
    if (object instanceof BeerInstance)
      return object.to_string();
    return object.toString();
  }
  execute_block(statements, environment3) {
    const previous = this.environment;
    try {
      this.environment = environment3;
      for (let statement of statements) {
        statement && this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }
  visitThisExpr(expr) {
    return this.look_up_variable(expr.keyword, expr);
  }
  visitAssignExpr(expr) {
    let value = this.evaluate(expr.value);
    let distance = this.locals.get(expr);
    if (distance !== undefined) {
      this.environment.assign_at(distance, expr.name.lexeme, value);
    } else {
      this.globals.assign(expr.name.lexeme, value);
    }
    return value;
  }
  visitBinaryExpr(expr) {
    let left = this.evaluate(expr.left);
    let right = this.evaluate(expr.right);
    let operator = expr.operator.type;
    switch (operator) {
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return left > right;
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left >= right;
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return left < right;
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return left <= right;
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return left - right;
      case TokenType.BANG_EQUAL:
        return !this.is_equal(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.is_equal(left, right);
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        return left / right;
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return left * right;
      case TokenType.PLUS:
        if (typeof left === "number" && typeof right === "number") {
          return left + right;
        }
        if (typeof left === "string" && typeof right === "string") {
          return left + right;
        }
        errorReporter.report(new SyntaxError("Operands must be two numbers or two strings at " + expr.operator.line + expr.operator.lexeme));
    }
    return null;
  }
  visitUnaryExpr(expr) {
    let right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS:
        return -right;
      case TokenType.BANG:
        return !this.is_truthy(right);
    }
    return null;
  }
  visitLiteralExpr(expr) {
    return expr.value;
  }
  visitGroupingExpr(expr) {
    return this.evaluate(expr.expression);
  }
  visitVariableExpr(expr) {
    return this.look_up_variable(expr.name, expr);
  }
  visitLogicalExpr(expr) {
    let left = this.evaluate(expr.left);
    if (expr.operator.type === TokenType.OR) {
      if (this.is_truthy(left))
        return left;
    } else {
      if (!this.is_truthy(left))
        return left;
    }
    return this.evaluate(expr.right);
  }
  visitCallExpr(expr) {
    let callee = this.evaluate(expr.callee);
    let args = [];
    for (let arg of expr.args) {
      args.push(this.evaluate(arg));
    }
    if (!(callee instanceof BeerCallable)) {
      throw errorReporter.report(new SyntaxError("Can only call functions and classes."));
    }
    if (args.length !== callee.arity()) {
      throw errorReporter.report(new SyntaxError(`Expected ${callee.arity()} arguments but got ${args.length}.`));
    }
    let func = callee;
    return func.call(this, args);
  }
  visitClassStmt(stmt) {
    let superclass = null;
    if (stmt.superclass !== null) {
      superclass = this.evaluate(stmt.superclass);
      if (!(superclass instanceof BeerClass)) {
        throw errorReporter.report(new SyntaxError("Superclass must be a class."));
      }
    }
    this.environment.define(stmt.name.lexeme, null);
    if (stmt.superclass !== null) {
      this.environment = new Environment(this.environment);
      this.environment.define("super", superclass);
    }
    let methods = new Map;
    for (let method of stmt.methods) {
      let func = new BeerFunction(method, this.environment, method.name.lexeme === "init");
      methods.set(method.name.lexeme, func);
    }
    let cls = new BeerClass(stmt.name.lexeme, methods, superclass);
    if (superclass !== null) {
      this.environment = this.environment.enclosing;
    }
    this.environment.assign(stmt.name.lexeme, cls);
  }
  visitForStmt(stmt) {
    if (stmt.initializer) {
      this.execute(stmt.initializer);
    }
    while (this.is_truthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
      if (stmt.increment === null) {
        return;
      }
      this.evaluate(stmt.increment);
    }
  }
  visitWhileStmt(stmt) {
    while (this.is_truthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.body);
    }
  }
  visitReturnStmt(stmt) {
    let value = null;
    if (stmt.value !== null)
      value = this.evaluate(stmt.value);
    throw new BeerFunction.Return(value);
  }
  visitFunctionStmt(stmt) {
    let func = new BeerFunction(stmt, this.environment, false);
    this.environment.define(stmt.name.lexeme, func);
    return;
  }
  visitPrintStmt(stmt) {
    let value = this.evaluate(stmt.expression);
    console.log(this.stringify(value));
  }
  visitExpressionStmt(stmt) {
    this.evaluate(stmt.expression);
  }
  visitVarStmt(stmt) {
    let value = null;
    if (stmt.initializer !== null) {
      value = this.evaluate(stmt.initializer);
    }
    this.environment.define(stmt.name.lexeme, value);
  }
  visitBlockStmt(stmt) {
    this.execute_block(stmt.statements, new Environment(this.environment));
  }
  visitIfStmt(stmt) {
    if (this.is_truthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch !== null) {
      this.execute(stmt.elseBranch);
    }
  }
  visitGetExpr(expr) {
    let object = this.evaluate(expr.object);
    if (object instanceof BeerInstance) {
      return object.get(expr.name);
    }
    throw errorReporter.report(new SyntaxError("Only instances have properties."));
  }
  visitSetExpr(expr) {
    let object = this.evaluate(expr.object);
    if (!(object instanceof BeerInstance)) {
      throw errorReporter.report(new SyntaxError("Only instances have fields."));
    }
    let value = this.evaluate(expr.value);
    object.set(expr.name, value);
    return value;
  }
  visitSuperExpr(expr) {
    let distance = this.locals.get(expr);
    let superclass = this.environment.get_at(distance, "super");
    let object = this.environment.get_at(distance - 1, "this");
    let method = superclass.find_method(expr.method.lexeme);
    if (method === null) {
      throw errorReporter.report(new SyntaxError(`Undefined property '${expr.method.lexeme}'.`));
    }
    return method.bind(object);
  }
}

// src/parser.ts
class BeerParser {
  tokens;
  current;
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }
  reset_parser() {
    this.current = 0;
    this.tokens = [];
  }
  set_tokens(tokens) {
    this.tokens = tokens;
  }
  parse() {
    const statements = [];
    while (!this.is_at_end()) {
      try {
        statements.push(this.declaration());
      } catch (e) {
        if (e instanceof SyntaxError2) {
          throw errorReporter.report(e);
        }
        this.synchronize();
      }
    }
    return statements;
  }
  class_declaration() {
    let name = this.consume(TokenType.IDENTIFIER, "Expect class name.");
    let super_class = null;
    if (this.match(TokenType.LESS)) {
      this.consume(TokenType.IDENTIFIER, "Expect superclass name.");
      super_class = new VariableExpr(this.previous());
    }
    this.consume(TokenType.LEFT_BRACE, "Expect '{' before class body.");
    let methods = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.is_at_end()) {
      methods.push(this.function_declaration("method"));
    }
    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after class body.");
    return new ClassStmt(name, super_class, methods);
  }
  function_declaration(kind) {
    let name = this.consume(TokenType.IDENTIFIER, `Expect ${kind} name.`);
    this.consume(TokenType.LEFT_PAREN, `Expect '(' after ${kind} name.`);
    const parameters = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (parameters.length >= 255) {
          errorReporter.report(new SyntaxError2(this.peek(), "Cannot have more than 255 parameters."));
        }
        parameters.push(this.consume(TokenType.IDENTIFIER, "Expect parameter name."));
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");
    this.consume(TokenType.LEFT_BRACE, `Expect '{' before ${kind} body.`);
    const body = this.block();
    return new FunctionStmt(name, parameters, body);
  }
  declaration() {
    if (this.match(TokenType.CLASS)) {
      return this.class_declaration();
    }
    if (this.match(TokenType.FUN)) {
      return this.function_declaration("function");
    }
    if (this.match(TokenType.VAR)) {
      return this.var_declaration();
    }
    return this.statement();
  }
  var_declaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");
    let initializer = null;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
    return new VarStmt(name, initializer);
  }
  block() {
    const statements = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.is_at_end()) {
      statements.push(this.declaration());
    }
    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
  }
  statement() {
    if (this.match(TokenType.LEFT_BRACE))
      return new BlockStmt(this.block());
    if (this.match(TokenType.IF))
      return this.if_statement();
    if (this.match(TokenType.PRINT))
      return this.print_statement();
    if (this.match(TokenType.RETURN))
      return this.return_statement();
    if (this.match(TokenType.WHILE))
      return this.while_statement();
    if (this.match(TokenType.FOR))
      return this.for_statement();
    return this.expression_statement();
  }
  for_statement() {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");
    let initializer;
    if (this.match(TokenType.SEMICOLON)) {
      initializer = null;
    } else if (this.match(TokenType.VAR)) {
      initializer = this.var_declaration();
    } else {
      initializer = this.expression_statement();
    }
    let condition = null;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");
    let increment = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");
    let body = this.statement();
    if (increment !== null) {
      body = new BlockStmt([body, new ExpressionStmt(increment)]);
    }
    if (condition === null)
      condition = new LiteralExpr(true);
    body = new WhileStmt(condition, body);
    if (initializer !== null) {
      body = new BlockStmt([initializer, body]);
    }
    return body;
  }
  return_statement() {
    let keyword = this.previous();
    let value = null;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
    return new ReturnStmt(keyword, value);
  }
  while_statement() {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");
    const body = this.statement();
    return new WhileStmt(condition, body);
  }
  if_statement() {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.");
    const then_branch = this.statement();
    let else_branch = null;
    if (this.match(TokenType.ELSE)) {
      else_branch = this.statement();
    }
    return new IfStmt(condition, then_branch, else_branch);
  }
  print_statement() {
    let value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new PrintStmt(value);
  }
  expression_statement() {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
    return new ExpressionStmt(expr);
  }
  equality() {
    let expr = this.comparison();
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      let operator = this.previous();
      let right = this.comparison();
      expr = new BinaryExpr(expr, operator, right);
    }
    return expr;
  }
  comparison() {
    let expr = this.term();
    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      let operator = this.previous();
      let right = this.term();
      expr = new BinaryExpr(expr, operator, right);
    }
    return expr;
  }
  term() {
    let expr = this.factor();
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      let operator = this.previous();
      let right = this.factor();
      expr = new BinaryExpr(expr, operator, right);
    }
    return expr;
  }
  factor() {
    let expr = this.unary();
    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      let operator = this.previous();
      let right = this.unary();
      expr = new BinaryExpr(expr, operator, right);
    }
    return expr;
  }
  call() {
    let expr = this.primary();
    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finish_call(expr);
      } else if (this.match(TokenType.DOT)) {
        const name = this.consume(TokenType.IDENTIFIER, "Expect property name after '.'.");
        expr = new GetExpr(expr, name);
      } else {
        break;
      }
    }
    return expr;
  }
  finish_call(callee) {
    let args = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length >= 255) {
          return errorReporter.report(new SyntaxError2(this.peek(), "Can't have more than 255 arguments."));
        }
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }
    let paren = this.consume(TokenType.RIGHT_PAREN, "Expect ')' after arguments.");
    return new CallExpr(callee, paren, args);
  }
  unary() {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      let operator = this.previous();
      let right = this.unary();
      return new UnaryExpr(operator, right);
    }
    return this.call();
  }
  primary() {
    if (this.match(TokenType.FALSE))
      return new LiteralExpr(false);
    if (this.match(TokenType.TRUE))
      return new LiteralExpr(true);
    if (this.match(TokenType.NIL))
      return new LiteralExpr(null);
    if (this.match(TokenType.THIS))
      return new ThisExpr(this.previous());
    if (this.match(TokenType.SUPER)) {
      let keyword = this.previous();
      this.consume(TokenType.DOT, "Expect '.' after 'super'.");
      let method = this.consume(TokenType.IDENTIFIER, "Expect superclass method name.");
      return new SuperExpr(keyword, method);
    }
    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new LiteralExpr(this.previous().literal);
    }
    if (this.match(TokenType.LEFT_PAREN)) {
      let expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new GroupingExpr(expr);
    }
    if (this.match(TokenType.IDENTIFIER)) {
      return new VariableExpr(this.previous());
    }
    return errorReporter.report(new SyntaxError2(this.peek(), "Expect expression."));
  }
  expression() {
    return this.assignment();
  }
  assignment() {
    let expr = this.or();
    if (this.match(TokenType.EQUAL)) {
      let equals = this.previous();
      let value = this.assignment();
      if (expr instanceof VariableExpr) {
        let name = expr.name;
        return new AssignExpr(name, value);
      } else if (expr instanceof GetExpr) {
        let get = expr;
        return new SetExpr(get.object, get.name, value);
      }
      errorReporter.report(new SyntaxError2(equals, "Invalid assignment target."));
    }
    return expr;
  }
  or() {
    let expr = this.and();
    while (this.match(TokenType.OR)) {
      let operator = this.previous();
      let right = this.and();
      expr = new LogicalExpr(expr, operator, right);
    }
    return expr;
  }
  and() {
    let expr = this.equality();
    while (this.match(TokenType.AND)) {
      let operator = this.previous();
      let right = this.equality();
      expr = new LogicalExpr(expr, operator, right);
    }
    return expr;
  }
  consume(type, message) {
    if (this.check(type))
      return this.advance();
    return errorReporter.report(new SyntaxError2(this.peek(), message));
  }
  match(...types3) {
    for (let type of types3) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  check(type) {
    if (this.is_at_end())
      return false;
    return this.peek().type === type;
  }
  advance() {
    if (!this.is_at_end())
      this.current++;
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
      if (this.previous().type === TokenType.SEMICOLON)
        return;
      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }
      this.advance();
    }
  }
}

// src/resolver.ts
var FunctionType;
(function(FunctionType2) {
  FunctionType2["None"] = "None";
  FunctionType2["Function"] = "Function";
  FunctionType2["Initializer"] = "Initializer";
  FunctionType2["Method"] = "Method";
})(FunctionType || (FunctionType = {}));
var ClassType;
(function(ClassType2) {
  ClassType2["None"] = "None";
  ClassType2["Class"] = "Class";
  ClassType2["SubClass"] = "SubClass";
})(ClassType || (ClassType = {}));

class ScopeStack extends Array {
  constructor() {
    super(...arguments);
  }
  is_empty() {
    return this.length < 1;
  }
  peek() {
    return this[this.length - 1];
  }
}

class BeerResolver {
  interpreter;
  scopes = new ScopeStack;
  currentFunction = FunctionType.None;
  currentClass = ClassType.None;
  constructor(interpreter) {
    this.interpreter = interpreter;
    this.interpreter = interpreter;
  }
  resolve(target) {
    if (target instanceof Array) {
      target.forEach((stmt) => this.resolve(stmt));
    } else {
      target.accept(this);
    }
  }
  resolve_local(expr, name) {
    for (let i = this.scopes.length - 1;i >= 0; i--) {
      if (this.scopes[i].has(name.lexeme)) {
        this.interpreter.resolve(expr, this.scopes.length - 1 - i);
        return;
      }
    }
  }
  begin_scope() {
    this.scopes.push(new Map);
  }
  end_scope() {
    this.scopes.pop();
  }
  declare(name) {
    if (this.scopes.is_empty())
      return;
    this.scopes.peek().set(name.lexeme, false);
  }
  define(name) {
    if (this.scopes.is_empty())
      return;
    this.scopes.peek().set(name.lexeme, true);
  }
  resolve_function(func, type) {
    const enclosingFunction = this.currentFunction;
    this.currentFunction = type;
    this.begin_scope();
    func.params.forEach((param) => {
      this.declare(param);
      this.define(param);
    });
    this.resolve(func.body);
    this.end_scope();
    this.currentFunction = enclosingFunction;
  }
  visitClassStmt(stmt) {
    const enclosingClass = this.currentClass;
    this.currentClass = ClassType.Class;
    this.declare(stmt.name);
    this.define(stmt.name);
    if (stmt.superclass !== null) {
      if (stmt.name.lexeme === stmt.superclass.name.lexeme) {
        errorReporter.report(new SyntaxError("A class can't inherit from itself."));
      } else {
        this.currentClass = ClassType.SubClass;
        this.resolve(stmt.superclass);
        this.begin_scope();
        this.scopes.peek().set("super", true);
      }
    }
    this.begin_scope();
    this.scopes.peek().set("this", true);
    for (const method of stmt.methods) {
      let declaration = FunctionType.Method;
      if (method.name.lexeme === "init") {
        declaration = FunctionType.Initializer;
      }
      this.resolve_function(method, declaration);
    }
    this.end_scope();
    if (stmt.superclass !== null) {
      this.end_scope();
    }
    this.currentClass = enclosingClass;
  }
  visitBlockStmt(stmt) {
    this.begin_scope();
    this.resolve(stmt.statements);
    this.end_scope();
  }
  visitVarStmt(stmt) {
    this.declare(stmt.name);
    if (stmt.initializer !== null) {
      this.resolve(stmt.initializer);
    }
    this.define(stmt.name);
  }
  visitVariableExpr(expr) {
    if (!this.scopes.is_empty() && this.scopes.peek().get(expr.name.lexeme) === false) {
      errorReporter.report(new RuntimeError(expr.name, `Cannot read local variable in its own initializer.`));
    }
    this.resolve_local(expr, expr.name);
  }
  visitAssignExpr(expr) {
    this.resolve(expr.value);
    this.resolve_local(expr, expr.name);
  }
  visitSuperExpr(expr) {
    if (this.currentClass === ClassType.None) {
      errorReporter.report(new RuntimeError(expr.keyword, "Cannot use 'super' outside of a class."));
    } else if (this.currentClass !== ClassType.SubClass) {
      errorReporter.report(new RuntimeError(expr.keyword, "Cannot use 'super' in a class with no superclass."));
    }
    this.resolve_local(expr, expr.keyword);
  }
  visitFunctionStmt(stmt) {
    this.declare(stmt.name);
    this.define(stmt.name);
    this.resolve_function(stmt, FunctionType.Function);
  }
  visitExpressionStmt(stmt) {
    this.resolve(stmt.expression);
  }
  visitIfStmt(stmt) {
    this.resolve(stmt.condition);
    this.resolve(stmt.thenBranch);
    if (stmt.elseBranch !== null)
      this.resolve(stmt.elseBranch);
  }
  visitPrintStmt(stmt) {
    this.resolve(stmt.expression);
  }
  visitReturnStmt(stmt) {
    if (stmt.value !== null) {
      if (this.currentFunction === FunctionType.Initializer) {
        errorReporter.report(new RuntimeError(stmt.keyword, "Cannot return a value from an initializer."));
      }
      if (this.currentFunction === FunctionType.None) {
        errorReporter.report(new RuntimeError(stmt.keyword, "Cannot return from top-level code."));
      }
      this.resolve(stmt.value);
    }
  }
  visitWhileStmt(stmt) {
    this.resolve(stmt.condition);
    this.resolve(stmt.body);
  }
  visitForStmt(stmt) {
    if (stmt.initializer !== null)
      this.resolve(stmt.initializer);
    if (stmt.condition !== null)
      this.resolve(stmt.condition);
    if (stmt.increment !== null)
      this.resolve(stmt.increment);
  }
  visitBinaryExpr(expr) {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }
  visitCallExpr(expr) {
    this.resolve(expr.callee);
    expr.args.forEach((arg) => this.resolve(arg));
  }
  visitGroupingExpr(expr) {
    this.resolve(expr.expression);
  }
  visitLiteralExpr(_) {
  }
  visitUnaryExpr(expr) {
    this.resolve(expr.right);
  }
  visitLogicalExpr(expr) {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }
  visitSetExpr(expr) {
    this.resolve(expr.value);
    this.resolve(expr.object);
  }
  visitGetExpr(expr) {
    this.resolve(expr.object);
  }
  visitThisExpr(expr) {
    if (this.currentClass === ClassType.None) {
      errorReporter.report(new RuntimeError(expr.keyword, "Cannot use 'this' outside of a class."));
      return;
    }
    this.resolve_local(expr, expr.keyword);
  }
}

// src/token.ts
class Token {
  type;
  lexeme;
  literal;
  line;
  constructor(type, lexeme, literal, line) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }
  to_string() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}

// src/scanner.ts
class BeerScanner {
  logger = new Logger;
  tokens;
  source;
  current = 0;
  start = 0;
  line = 1;
  constructor() {
    this.source = "";
    this.tokens = [];
    this.current = 0;
    this.start = 0;
    this.line = 1;
  }
  add_source(source) {
    this.source += source;
    this.current = 0;
    this.start = 0;
    this.line = 1;
  }
  set_source(source) {
    this.source = source;
  }
  reset_scanner() {
    this.source = "";
    this.current = 0;
    this.start = 0;
    this.line = 1;
  }
  scan_tokens() {
    while (!this.is_end()) {
      this.start = this.current;
      this.scan();
    }
    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
  }
  is_end() {
    return this.current >= this.source.length;
  }
  advance() {
    return this.source.charAt(this.current++);
  }
  match(expected) {
    if (this.is_end())
      return false;
    if (this.source.charAt(this.current) !== expected)
      return false;
    this.current++;
    return true;
  }
  add_token(type, literal) {
    let text = this.source.substring(this.start, this.current);
    let token2 = new Token(type, text, literal, this.line);
    this.tokens.push(token2);
  }
  peek() {
    return this.source.charAt(this.current);
  }
  current_char() {
    return this.source.charAt(this.current - 1);
  }
  is_digit(c) {
    return c >= "0" && c <= "9";
  }
  is_alpha(c) {
    return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "_";
  }
  is_alpha_numeric(c) {
    return this.is_alpha(c) || this.is_digit(c);
  }
  identifier() {
    while (this.is_alpha_numeric(this.peek())) {
      this.advance();
    }
    let text = this.source.substring(this.start, this.current);
    const token_type = keywords[text];
    if (token_type !== undefined) {
      this.add_token(token_type, null);
    } else {
      this.add_token(TokenType.IDENTIFIER, null);
    }
  }
  string() {
    while (this.peek() !== '"' && !this.is_end()) {
      if (this.peek() === "\n")
        this.line++;
      this.advance();
    }
    if (this.is_end()) {
      errorReporter.report(new SyntaxError2(null, "Unterminated string.at line " + this.line + " column " + this.current + ""));
    }
    this.advance();
    let value = this.source.substring(this.start + 1, this.current - 1);
    this.add_token(TokenType.STRING, value);
  }
  number() {
    while (this.is_digit(this.peek())) {
      this.advance();
    }
    if (this.peek() === "." && this.is_digit(this.peek())) {
      this.advance();
    }
    let raw_number = this.source.substring(this.start, this.current);
    let value = parseFloat(raw_number);
    this.add_token(TokenType.NUMBER, value);
  }
  scan() {
    let c = this.advance();
    switch (c) {
      case "{":
        this.add_token(TokenType.LEFT_BRACE, null);
        break;
      case "}":
        this.add_token(TokenType.RIGHT_BRACE, null);
        break;
      case "(":
        this.add_token(TokenType.LEFT_PAREN, null);
        break;
      case ")":
        this.add_token(TokenType.RIGHT_PAREN, null);
        break;
      case "\u2795":
      case "+":
        this.add_token(TokenType.PLUS, null);
        break;
      case "\u2796":
      case "-":
        this.add_token(TokenType.MINUS, null);
        break;
      case "\u2716":
      case "\u274C":
      case "*":
        this.add_token(TokenType.STAR, null);
        break;
      case "\u2797":
      case "/":
        if (this.match("/")) {
          while (this.peek() != "\n" && !this.is_end()) {
            this.advance();
          }
        } else {
          this.add_token(TokenType.SLASH, null);
        }
        break;
      case "\u267B":
      case "%":
        this.add_token(TokenType.MODULO, null);
        break;
      case "\u2714":
        this.add_token(TokenType.EQUAL_EQUAL, null);
        break;
      case "=":
        this.add_token(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL, null);
        break;
      case "o":
        if (this.match("r")) {
          this.add_token(TokenType.OR, null);
        }
        break;
      case ",":
        this.add_token(TokenType.COMMA, null);
        break;
      case ".":
        this.add_token(TokenType.DOT, null);
        break;
      case "\u2757":
        this.add_token(TokenType.BANG_EQUAL, null);
        break;
      case "!":
        this.add_token(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG, null);
        break;
      case "\u2B05":
        this.add_token(TokenType.LESS_EQUAL, null);
        break;
      case "<":
        this.add_token(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS, null);
        break;
      case "\u27A1":
        this.add_token(TokenType.GREATER_EQUAL, null);
        break;
      case ">":
        this.add_token(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER, null);
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
        this.add_token(TokenType.SEMICOLON, null);
        break;
      default:
        if (this.is_digit(c)) {
          this.number();
        } else if (this.is_alpha(c)) {
          this.identifier();
        } else {
          errorReporter.report(new SyntaxError2(null, "Unexpected character."));
        }
        break;
    }
  }
  get_tokens() {
    return this.tokens;
  }
  print_tokens() {
    this.logger.info(this.tokens);
  }
}

// src/runner.ts
class BeerRunner {
  interpreter;
  resolver;
  astPrinter;
  parser;
  scanner;
  MODE;
  constructor() {
    this.scanner = new BeerScanner;
    this.interpreter = new Beer;
    this.resolver = new BeerResolver(this.interpreter);
    this.parser = new BeerParser([]);
    this.astPrinter = new BeerAstPrinter;
    Bun.argv[2] === undefined ? this.MODE = "REPL" : this.MODE = "FILE";
  }
  run() {
    if (this.MODE === "FILE") {
      run_file((source) => {
        this.scanner.set_source(source);
        this.scanner.scan_tokens();
        const tokens = this.scanner.get_tokens();
        this.parser.set_tokens(tokens);
        const statements = this.parser.parse();
        this.resolver.resolve(statements);
        this.print_ast(statements);
        console.log(source_default.blue("                                                 "));
        console.log(source_default.blue("================      Compiled Output       ================"));
        console.log(source_default.blue("                                                 "));
        this.interpreter.interpret(statements);
      });
    } else {
      console.log("REPL is still in progress\n");
      console.log("Usage: beer [script]");
    }
  }
  print_ast(stmts) {
    console.log(source_default.cyan("================      AST       ================"));
    console.log(source_default.cyan("                                                 "));
    this.astPrinter.print_ast(stmts);
  }
}

// index.ts
var runner2 = new BeerRunner;
runner2.run();
