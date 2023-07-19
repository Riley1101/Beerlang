import type { Token } from "./token";
import { errorReporter } from "./log";
import type { LoxObject } from "./types";

export class Environment {
  enclosing: Environment | null;
  private values: Record<string, LoxObject> = {};
  constructor(enclosing?: Environment) {
    if (enclosing) {
      this.enclosing = enclosing;
    } else {
      this.enclosing = null;
    }
  }
  define(name: string, value: LoxObject): void {
    this.values[name] = value;
  }

  get(name: Token): LoxObject {
    if (name.lexeme in this.values) {
      return this.values[name.lexeme] as LoxObject;
    }
    if (this.enclosing) {
      return this.enclosing.get(name);
    }
    errorReporter.report(
      new ReferenceError(`Undefined variable '${name.lexeme}'.`),
    );
    throw new Error("Unreachable");
  }
}
