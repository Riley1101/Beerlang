/**
 * @namespace Environment
 * @file environment.ts
 * @description Defines the Environment class.
 */

import { BeerObject } from "./types";
import { errorReporter } from "./error";
export class Environment {
  private enclosing: Environment | null;
  private values: Map<string, BeerObject> = new Map<string, BeerObject>();

  constructor(enclosing?: Environment) {
    this.enclosing = null;
    if (enclosing) {
      this.enclosing = enclosing;
    }
  }
  /**
   * @param {string} name - string value of the variable name
   * @param {BeerObject} value - value of the variable
   */
  public define(name: string, value: BeerObject): void {
    this.values.set(name, value);
  }

  /**
   * @param {string} name - string value of the variable name
   * @returns {BeerObject} value of the variable
   */
  public get(name: string): BeerObject | never {
    if (this.values.has(name)) {
      return this.values.get(name) as BeerObject;
    }
    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }
    return errorReporter.report(
      new ReferenceError(`Undefined variable '${name}'`),
    );
  }

  /**
   * @param name - variable name to reassign
   * @param value -  variable value to reassign
   * @returns {void}
   */
  public assign(name: string, value: BeerObject): void {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }
    if (this.enclosing !== null) {
      this.enclosing.assign(name, value);
      return;
    }
    return errorReporter.report(
      new ReferenceError(`Undefined variable '${name}'`),
    );
  }

  private ancestor(distance: number): Environment {
    let environment: Environment = this;
    for (let i = 0; i < distance; i++) {
      environment = environment.enclosing as Environment;
    }
    return environment;
  }

  public get_at(distance: number, name: string): BeerObject {
    return this.ancestor(distance).values.get(name) as BeerObject;
  }

  public assign_at(distance: number, name: string, value: BeerObject): void {
    this.ancestor(distance).values.set(name, value);
  }
}
