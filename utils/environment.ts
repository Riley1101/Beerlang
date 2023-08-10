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
    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }
    errorReporter.report(
      new ReferenceError(`Undefined variable '${name.lexeme}'.`)
    );
    throw new Error("Unreachable");
  }
  ancestor(distance: number): Environment {
    let environment: Environment = this;
    for (let i = 0; i < distance; i++) {
      environment = environment.enclosing as Environment;
    }
    return environment;
  }
  assignAt(distance: number, name: Token, value: LoxObject): void {
    const environment = this.ancestor(distance);
    if (environment !== null) {
      environment.values[name.lexeme] = value;
    } else {
      errorReporter.report(
        new ReferenceError(`Undefined variable '${name.lexeme}'.`)
      );
    }
  }
  assign(name: Token, value: LoxObject): void {
      console.log("did i ever gets called")
    if (name.lexeme in this.values) {
      this.values[name.lexeme] = value;
      return;
    }
    if (this.enclosing) {
      this.enclosing.assign(name, value);
      return;
    }
    errorReporter.report(
      new ReferenceError(`Undefined variable '${name.lexeme}'.`)
    );
  }

  getAt(distance: number, name: string): LoxObject {
    return this.ancestor(distance).values[name] as LoxObject;
  }
}
