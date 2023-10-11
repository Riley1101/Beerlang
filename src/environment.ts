import { BeerObject } from "./types";
import { errorReporter } from "./error";
export class Environment {
  private values: Map<string, any> = new Map<string, any>();

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
      return this.values.get(name);
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
    return errorReporter.report(
      new ReferenceError(`Undefined variable '${name}'`),
    );
  }
}
