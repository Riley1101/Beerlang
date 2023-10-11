import { exit } from "process";
import { Token } from "./token";
import chalk from "chalk";

/**
 * The logger instance used throughout the application.
 * planned to be replaced with a native custom logger in the future
 */
export const Log: typeof chalk = chalk;
export class Logger {
  private _log: typeof chalk;
  constructor() {
    this._log = Log;
  }

  public info(message: any): void {
    if (typeof message === "object") {
      message = JSON.stringify(message, null, 2);
    }
    console.log(this._log.blue(message));
  }

  public error(message: any): void {
    if (typeof message === "object") {
      message = JSON.stringify(message, null, 2);
    }
    console.log(this._log.red(message));
  }

  public warn(message: any): void {
    if (typeof message === "object") {
      message = JSON.stringify(message, null, 2);
    }
    console.log(this._log.yellow(message));
  }

  public debug(message: any): void {
    if (typeof message === "object") {
      message = JSON.stringify(message, null, 2);
    }
    console.log(this._log.green(message));
  }
}

export class ClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientError";
  }
}

export class RuntimeError extends Error {
  token: Token;
  constructor(token: Token, message: string) {
    super(message);
    this.token = token;
    this.name = "RuntimeError";
  }
}

export class SyntaxError extends Error {
  token: Token | null;
  constructor(token: Token | null, message: string) {
    super(message);
    this.token = token;
    this.name = "SyntaxError";
  }
}

export class ErrorReporter {
  hasCliError: boolean = false;
  hasRuntimeError: boolean = false;
  hasSyntaxError: boolean = false;

  log(error: Error) {
    if (error instanceof ClientError) {
      console.log(Log.red(error.message));
    } else if (error instanceof RuntimeError) {
      console.log(Log.red(error.message));
    } else {
      console.log(Log.red(error.message));
    }
  }

  report(error: Error): never {
    if (error instanceof ClientError) {
      this.hasCliError = true;
      exit(65);
    } else if (error instanceof RuntimeError) {
      this.hasRuntimeError = true;
      exit(70);
    } else {
      this.hasSyntaxError = true;
      exit(65);
    }
  }
}

export const errorReporter = new ErrorReporter();
