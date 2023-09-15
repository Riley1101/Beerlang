import { Token } from "./token";

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

  report(error: Error) {
    if (error instanceof ClientError) {
      this.hasCliError = true;
    } else if (error instanceof RuntimeError) {
      this.hasRuntimeError = true;
    } else {
      this.hasSyntaxError = true;
    }
  }
}

export const errorReporter = new ErrorReporter();
