import chalk from "chalk";

console.log(chalk.blue("Building..."));
await Bun.build({
  entrypoints: ["./index.ts"],
  minify: true,
  outdir: "./beer",
});

console.log(chalk.green("Build complete!"));
console.log(chalk.green("Out Dir: ./beer"));
