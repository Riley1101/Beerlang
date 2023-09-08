import { Runner } from "./runner";

export class Gideon {
  has_error: boolean = false;
  constructor() {
    let runner = new Runner();
    runner.exec();
  }
}
