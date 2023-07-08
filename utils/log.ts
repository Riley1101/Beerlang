import { Token } from "./token";

/**
 * @param {number} line - report the line number
 * @param {string} message - report the message
 */
export function error(line: number, message: string): never {
  report(line, "", message, "error");
  throw new Error(message);
}

export function info(line: number, message: string) {
  report(line, "", message, "info");
}

type Log = "error" | "info";

/**
 * @param {number} line - report the line number
 * @param {string} where - report where the issue is
 * @param {string} message - report the message
 */
export function report(
  line: number,
  where: string,
  message: string,
  type: Log
) {
  console.log(`[${type}] --> [line ${line}] Error ${where}: ${message}`);
}

export class ClientError extends Error {
  override name = "ClientError";
  override message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export class SyntaxError extends Error {
  override name = "SyntaxError";
  override message: string;
  line: number;
  where: string;
  constructor(message: string, line: number, where: string) {
    super();
    this.message = message;
    this.line = line;
    this.where = where;
  }
}

export class ResolverError extends SyntaxError {
  override name = "ResolverError";
}

export class RuntimeError extends Error {
  override name = "RuntimeError";
  override message: string;
  token: Token;
  constructor(token: Token, message: string) {
    super();
    this.token = token;
    this.message = message;
  }
}
export class CliError extends Error {
  override name = "CliError";
  override message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }
}

class ErrorReporter {
  hadCliError = false;
  hadSyntaxError = false;
  hadRuntimeError = false;

  report(error: Error): void {
    let header = "";
    if (error instanceof SyntaxError && error.line) {
      header += `[${error.name} (line ${error.line}`;
      if (error.where) header += ` at ${error.where}`;
      header += ")";
    } else if (error instanceof RuntimeError) {
      header += `[${error.name} (line ${error.token.line})`;
    } else if (error instanceof CliError) {
      header += `[${error.name}`;
    } else {
      header += "[CliError";
    }
    header += "]";
    console.log(header + " " + error.message);

    if (error instanceof RuntimeError) this.hadRuntimeError = true;
    else if (error instanceof SyntaxError) this.hadSyntaxError = true;
    else this.hadCliError = true;
  }
}

export const errorReporter = new ErrorReporter();
