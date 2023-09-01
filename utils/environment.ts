import type { Token } from "./token";
import { errorReporter } from "./log";
import type { LoxObject, LoxCallable } from "./types";

type EnvironmentValues = LoxObject | LoxCallable;

export class Environment {
  enclosing: Environment | null;
  private values: Record<string, EnvironmentValues> = {};
  constructor(enclosing?: Environment) {
    if (enclosing) {
      this.enclosing = enclosing;
    } else {
      this.enclosing = null;
    }
  }
  define(name: string, value: EnvironmentValues): void {
    this.values[name] = value;
  }

  get(name: Token): LoxObject {
    if (name.lexeme in this.values) {
      return this.values[name.lexeme] as LoxObject;
    }
    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }
    errorReporter.report(
      new ReferenceError(`Undefined variable '${name.lexeme}'.`),
    );
    throw new ReferenceError(`Undefined variable '${name.lexeme}'.`);
  }

  ancestor(distance: number): Environment {
    if (distance === 0) return this;
    else {
      let environment = this.enclosing || null;
      for (let i = 0; i < distance; i++) {
        environment = environment?.enclosing || null;
      }
      return environment as Environment;
    }
  }
  assignAt(distance: number, name: Token, value: LoxObject): void {
    const environment = this.ancestor(distance);
    if (environment !== null) {
      environment.values[name.lexeme] = value;
    } else {
      errorReporter.report(
        new ReferenceError(`Undefined variable '${name.lexeme}'.`),
      );
    }
  }
  assign(name: Token, value: LoxObject): void {
    if (name.lexeme in this.values) {
      this.values[name.lexeme] = value;
      return;
    }
    if (this.enclosing) {
      this.enclosing.assign(name, value);
      return;
    }
    errorReporter.report(
      new ReferenceError(`Undefined variable '${name.lexeme}'.`),
    );
  }

  getAt(distance: number, name: Token): LoxObject {
    //    return this.ancestor(distance).values[name] as LoxObject;
    const environment = this.ancestor(distance);
    if (environment !== null)
      return environment.values[name.lexeme] as LoxObject;
    errorReporter.report(
      new ReferenceError(`Undefined variable '${name.lexeme}'.`),
    );
    // TODO variable not found and this code should never been reached
    throw new ReferenceError(`Undefined variable '${name.lexeme}'.`);
  }

  getThis(): LoxObject {
    return this.values["this"] as LoxObject;
  }
}
