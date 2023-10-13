import { Log } from "./error";
import { SyntaxVisitor, AssignExpr, BinaryExpr, UnaryExpr, LiteralExpr, LogicalExpr, ExpressionStmt, PrintStmt, VarStmt, VariableExpr, BlockStmt, ForStmt, WhileStmt, ReturnStmt, FunctionStmt, ClassStmt, IfStmt, GroupingExpr, CallExpr, Expr, Stmt } from "./ast";

/**
 * @class BeerAstPrinter
 * @implements {SyntaxVisitor<string,string>}
 * @method {string} parenthesize - Parenthesize a string
 * @method {string} print - Print a string
 */

export class BeerAstPrinter implements SyntaxVisitor<string, string> {
    /**
     * @param expr - {AssignExpr} expression
     * @returns string
     */
    visitAssignExpr(expr: AssignExpr): string {
        return this.parenthesize(expr.name.lexeme, expr.value);
    }

    /**
     * @param expr - {BinaryExpr} expression
     * @returns string
     */
    visitBinaryExpr(expr: BinaryExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    /**
     * @param expr -  {UnaryExpr} expression
     * @returns string
     */
    visitUnaryExpr(expr: UnaryExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.right);
    }

    /**
     * @param expr - {LiteralExpr} expression
     * @returns string
     */
    visitLiteralExpr(expr: LiteralExpr): string {
        if (expr.value === null) return "nil";
        return expr.value.toString();
    }

    /**
     * @param expr - {LogicalExpr} expression
     * @returns string
     */
    visitLogicalExpr(expr: LogicalExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }
    /**
     * @param stmt - {ExpressionStmt} statement
     * @returns parenthesize version of the ast expression
     */
    visitExpressionStmt(stmt: ExpressionStmt): string {
        return this.parenthesize("expression", stmt.expression);
    }

    /**
     * @param stmt - {PrintStmt} statement
     * @returns parenthesize version of the ast print
     */
    visitPrintStmt(stmt: PrintStmt): string {
        return this.parenthesize("print", stmt.expression);
    }

    /**
     * @param stmt - {VarStmt} statement
     * @returns parenthesize version of the ast var
     */
    visitVarStmt(stmt: VarStmt): string {
        const name = new VariableExpr(stmt.name);
        if (stmt.initializer) {
            return this.parenthesize("var", name, stmt.initializer);
        }
        return this.parenthesize("var", name);
    }

    /**
     * Generate ast for the statements in the block
     * @param stmt - {BlockStmt} statement
     * @returns  parenthesize version of the ast block
     */
    visitBlockStmt(stmt: BlockStmt): string {
        let str = `(block `;
        for (const statement of stmt.statements) {
            str += "\n" + this.indent(statement.accept(this));
        }
        str += ")";
        return str;
    }

    visitForStmt(stmt: ForStmt): string {
        let result = `(for ${this.stringify(stmt.initializer)} ${this.stringify(
            stmt.condition
        )} ${this.stringify(stmt.increment)}\n`;
        const bodyResult = this.stringify(stmt.body);
        result += this.indent(bodyResult);
        result += ")";
        return result;
    }

    /**
     * Generate ast for the while statement in the block
     * @param stmt - {While Statement}
     * @returns  string ast of while statement
     */
    visitWhileStmt(stmt: WhileStmt): string {
        let result = `(while ${this.stringify(stmt.condition)}\n`;
        const bodyResult = this.stringify(stmt.body);
        result += this.indent(bodyResult);
        result += ")";
        return result;
    }

    /**
     * Generate ast for the if statements in the block
     * @param stmt - {ReturnStmt} statement
     */
    visitReturnStmt(stmt: ReturnStmt): string {
        if (stmt.value) {
            return this.parenthesize("return", stmt.value);
        }
        return this.parenthesize("return");
    }
    /**
     * Generate ast for the function statements
     * @param stmt - {FunctionStmt} statement
     * @returns parenthesize version of the ast function
     */
    visitFunctionStmt(stmt: FunctionStmt): string {
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

    /**
     * Generate ast for the class statements
     * @param stmt - {ClassStmt} statement
     * @returns string
     */
    visitClassStmt(stmt: ClassStmt): string {
        let result = `(class ${stmt.name.lexeme}`;
        stmt.methods.forEach((method) => {
            result += "\n" + this.indent(this.stringify(method));
        });
        result += ")";
        return result;
    }

    /**
     * Generate ast for if statements in the block
     * @param stmt - {IfStmt} statement
     * @returns  parenthesize version of the ast if
     */
    visitIfStmt(stmt: IfStmt): string {
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

    /**
     * @param expr - {VariableExpr} expression
     * @returns {string} name of the variable
     */
    visitVariableExpr(expr: VariableExpr): string {
        return expr.name.lexeme;
    }

    /**
     * @param expr - {GroupingExpr} expression
     * @returns string
     */
    visitGroupingExpr(expr: GroupingExpr): string {
        return this.parenthesize("group", expr.expression);
    }

    /**
     * @param expr - {CallExpr} expression
     * @returns string
     */
    visitCallExpr(expr: CallExpr): string {
        return this.parenthesize("call", expr.callee, ...expr.args);
    }

    /**
     * @param {string} - name of the expression
     * @param  {...Expr} exprs - {Expr[]} expressions
     * @returns string
     */
    private parenthesize(name: string, ...exprs: Expr[]): string {
        let str = `(${name}`;
        for (const expr of exprs) {
            str += ` ${expr.accept(this)}`;
        }
        str += ")";
        return str;
    }

    private indent(lines: string): string {
        return lines
            .split("\n")
            .map((line) => `  ${line}`)
            .join("\n");
    }

    /**
     * Print expression
     * @param expr - {Expr} expression
     */
    print(expr: Expr): string {
        return expr.accept(this);
    }

    /**
     * Print all the expressions
     * @param expr - {Expr} expression
     * @returns
     */
    stringify(target: Expr | Stmt | Stmt[] | null): string {
        if (target === null) return "nil";
        if (target instanceof Array) {
            return target.map((stmt) => stmt.accept(this)).join("\n");
        } else {
            return target.accept(this);
        }
    }

    /**
     * Print ast of the statements
     * @param stmt - {Stmt[]} statements
     */
    print_ast(stmt: Stmt[]): void {
        console.log(Log.cyan(this.stringify(stmt)));
    }
}

