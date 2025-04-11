function tokenize(input: string): Token[] {
  console.log("tokenize function called with input:", input);
  const lines = input.split("\n");
  const tokens: Token[] = [];
  let currentLine = 1;
  for (const line of lines) {
    const words = line.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const word = words[i].trim();
      if (!word) {
        continue;
      }
      if (word === "model") {
        tokens.push({ type: "keyword", value: word, line: currentLine });
      } else if (word === "{") {
        tokens.push({ type: "symbol", value: word, line: currentLine });
      } else if (word === "}") {
        tokens.push({ type: "symbol", value: word, line: currentLine });
      } else if (word === ":") {
        tokens.push({ type: "symbol", value: word, line: currentLine });
      } else if (word === "[") {
        tokens.push({ type: "symbol", value: word, line: currentLine });
      } else if (word === "]") {
        tokens.push({ type: "symbol", value: word, line: currentLine });
      } else if (word === "?") {
        tokens.push({ type: "symbol", value: word, line: currentLine });
      } else if (word === "=") {
        tokens.push({ type: "symbol", value: word, line: currentLine });
      } else if (word === "relation") {
        tokens.push({ type: "type", value: word, line: currentLine });
      } else if (word === "uuid") {
        tokens.push({ type: "type", value: word, line: currentLine });
      } else if (word === "string") {
        tokens.push({ type: "type", value: word, line: currentLine });
      } else if (word === "int") {
        tokens.push({ type: "type", value: word, line: currentLine });
      } else if (word === "float") {
        tokens.push({ type: "type", value: word, line: currentLine });
      } else if (word === "bool") {
        tokens.push({ type: "type", value: word, line: currentLine });
      } else if (/^"[^"]*"$/.test(word)) {
        tokens.push({ type: "string", value: word.slice(1, -1), line: currentLine });
      } else if (/^-?\d+$/.test(word)) {
        tokens.push({ type: "int", value: word, line: currentLine });
      } else if (/^-?\d+\.\d+$/.test(word)) {
        tokens.push({ type: "float", value: word, line: currentLine });
      } else if (word === "true" || word === "false") {
        tokens.push({ type: "bool", value: word, line: currentLine });
      } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)) {
        tokens.push({ type: "identifier", value: word, line: currentLine });
      } else {
        throw new UnexpectedTokenError(currentLine, word);
      }
    }
    currentLine++;
  }
  console.log("Tokens generated:", tokens);
  return tokens;
}