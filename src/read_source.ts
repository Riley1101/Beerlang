export function read_source() {
  const file = Bun.file("test/operators.beer");
  const text = file.text();
  return text;
}
