import { UnexpectedTokenError } from "./error";

type Token = { type: string; value: string; line: number };

export function tokenize(input: string): Token[] {
  console.log("tokenize function called with input:", input);
  const regex = /(\"[^\"]*\"|\s+|[?=[\]]|:|[\w]+|\d+\.\d+|[{}]|\n)/g;
  const matches = input.match(regex) || [];
  const tokens: Token[] = [];
  let line = 1;
  for (const match of matches) {    const trimmedMatch = match.trim();
    if (!trimmedMatch) continue;

    const token = { line: line };
    if (trimmedMatch === "model") {
      tokens.push({ type: "keyword", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "{") {
      tokens.push({ type: "symbol", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "}") {
      tokens.push({ type: "symbol", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "[") {
      tokens.push({ type: "symbol", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "]") {
      tokens.push({ type: "symbol", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "?") {
      tokens.push({ type: "symbol", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "=") {
      tokens.push({ type: "symbol", value: trimmedMatch, line: line });
    } else if (trimmedMatch === ":") {
      tokens.push({ type: "symbol", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "relation") {
      tokens.push({ type: "type", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "uuid") {
      tokens.push({ type: "type", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "string") {
      tokens.push({ type: "type", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "int") {
      tokens.push({ type: "type", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "float") {
      tokens.push({ type: "type", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "bool") {
      tokens.push({ type: "type", value: trimmedMatch, line: line });
    } else if (/^\"[^\"]*\"$/.test(trimmedMatch)) {
      tokens.push({ type: "string", value: trimmedMatch.slice(1, -1), line: line });
    } else if (/^-?\d+$/.test(trimmedMatch)) {
      tokens.push({ type: "int", value: trimmedMatch, line: line });
    } else if (/^-?\d+\.\d+$/.test(trimmedMatch)) {
      tokens.push({ type: "float", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "true" || trimmedMatch === "false") {
      tokens.push({ type: "bool", value: trimmedMatch, line: line });
    } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedMatch)) {
      tokens.push({ type: "identifier", value: trimmedMatch, line: line });
    } else if (trimmedMatch === "\n") {
      line++;
    } else {
      throw new UnexpectedTokenError(line, trimmedMatch);
    }
  }
  console.log("Tokens generated:", tokens);
  return tokens;
}
