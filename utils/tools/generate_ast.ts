import fs from "fs";

function define_type(base_name: string, class_name: string, fields: string) {
  let path = `${base_name}/${class_name}.ts`;
  let contents = `// Path: ${path}
    import { Token } from "../token/token.ts";
    export class ${class_name} {
        ${fields} : ${class_name};
        constructor(${fields}) {
            ${fields
              .split(", ")
              .map((x) => `this.${x} = ${x};`)
              .join("\n")}
        }
    }
    `;
  fs.writeFileSync(path, contents);
  console.log("Finished writing " + path);
}

function define_ast(out_dir: string, base_name: string, types: string[]) {
  let path = `${out_dir}/${base_name}.ts`;
  for (let type of types) {
    let [class_name, fields] = type.split(":").map((x) => x.trim());
    define_type(base_name, class_name, fields);
  }
}

export function generate_ast(
  args: string[],
  types: [
    "Binary   : Expr left, Token operator, Expr right",
    "Grouping : Expr expression",
    "Literal  : any value",
    "Unary    : Token operator, Expr right"
  ]
) {
  if (args.length !== 1) {
    console.log("Usage: generate_ast <output directory>");
    process.exit(64);
  }
  let out_dir = args[0];
  define_ast(out_dir, "Expr", types);
}
