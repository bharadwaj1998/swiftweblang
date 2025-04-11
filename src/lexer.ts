import { UnexpectedTokenError } from "./error"; // ADDED

type Token = { type: string; value: string; line: number }; // ADDED line

const keywords = ['model', 'route', 'input', 'logic', 'page', 'form', 'submit', 'list'];
const types = ['uuid', 'string', 'bool', 'int', 'float', 'relation'];
const symbols = ['{', '}', '(', ')', ':', ',', '?', '=', '[', ']'];

export function tokenize(input: string): Token[] {
  console.log("tokenize function called with input:", input);
  const tokens: Token[] = [];
  const lines = input.split(/\n/);
  console.log("Lines after split:", lines);
  let line = 0; // ADDED
  let afterEquals = false; // ADDED

  for (const lineContent of lines) {
    line++; // ADDED
    let currentWord = "";
    let insideString = false;
    for (let i = 0; i < lineContent.length; i++) {
      const char = lineContent[i];

      if (char === '"') {
        insideString = !insideString;
      }

      if ((char === ' ' || symbols.includes(char)) && !insideString) {
        if (currentWord !== "") {
          if (keywords.includes(currentWord)) {
            tokens.push({ type: 'keyword', value: currentWord, line }); // ADDED line
          } else if (types.includes(currentWord)) {
            tokens.push({ type: 'type', value: currentWord, line }); // ADDED line
          } else if (afterEquals){ // ADDED
            if (currentWord.match(/^(true|false)$/)) {
                tokens.push({ type: 'bool', value: currentWord, line }); // ADDED line
              } else if (currentWord.match(/^[0-9]+$/)) {
                tokens.push({ type: 'int', value: currentWord, line }); // ADDED line
              } else if (currentWord.match(/^[0-9]+\.[0-9]+$/)){
                  tokens.push({ type: 'float', value: currentWord, line }); // ADDED line
              } else if (currentWord.match(/^".*"$/)) {
                tokens.push({ type: 'string', value: currentWord.slice(1, -1), line }); // ADDED line
              } else{
                throw new UnexpectedTokenError(line, currentWord); // ADDED
              }
            afterEquals = false; // ADDED
          }else if (currentWord.match(/^(true|false)$/)) {
            tokens.push({ type: 'bool', value: currentWord, line }); // ADDED line
          } else if (currentWord.match(/^[0-9]+$/)) {
            tokens.push({ type: 'int', value: currentWord, line }); // ADDED line
          } else if (currentWord.match(/^[0-9]+\.[0-9]+$/)){
              tokens.push({ type: 'float', value: currentWord, line }); // ADDED line
          } else if (currentWord.match(/^".*"$/)) {
            tokens.push({ type: 'string', value: currentWord.slice(1, -1), line }); // ADDED line
          } else if (currentWord.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
            tokens.push({ type: 'identifier', value: currentWord, line }); // ADDED line
          } else {
            throw new UnexpectedTokenError(line, currentWord); // ADDED
          }
          currentWord = "";
        }
        if (char !== ' ') {
          if (char === "="){ // ADDED
            afterEquals = true; // ADDED
          }
          tokens.push({ type: 'symbol', value: char, line }); // ADDED line
        }
      } else {
        currentWord += char;
      }
    }
    if (currentWord !== "") {
        if (keywords.includes(currentWord)) {
            tokens.push({ type: 'keyword', value: currentWord, line }); // ADDED line
          } else if (types.includes(currentWord)) {
            tokens.push({ type: 'type', value: currentWord, line }); // ADDED line
          } else if (afterEquals){ // ADDED
            if (currentWord.match(/^(true|false)$/)) {
                tokens.push({ type: 'bool', value: currentWord, line }); // ADDED line
              } else if (currentWord.match(/^[0-9]+$/)) {
                tokens.push({ type: 'int', value: currentWord, line }); // ADDED line
              } else if (currentWord.match(/^[0-9]+\.[0-9]+$/)){
                  tokens.push({ type: 'float', value: currentWord, line }); // ADDED line
              } else if (currentWord.match(/^".*"$/)) {
                tokens.push({ type: 'string', value: currentWord.slice(1, -1), line }); // ADDED line
              } else{
                throw new UnexpectedTokenError(line, currentWord); // ADDED
              }
            afterEquals = false; // ADDED
          }else if (currentWord.match(/^(true|false)$/)) {
            tokens.push({ type: 'bool', value: currentWord, line }); // ADDED line
          } else if (currentWord.match(/^[0-9]+$/)) {
            tokens.push({ type: 'int', value: currentWord, line }); // ADDED line
          } else if (currentWord.match(/^[0-9]+\.[0-9]+$/)){
              tokens.push({ type: 'float', value: currentWord, line }); // ADDED line
          } else if (currentWord.match(/^".*"$/)) {
            tokens.push({ type: 'string', value: currentWord.slice(1, -1), line }); // ADDED line
          } else if (currentWord.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
            tokens.push({ type: 'identifier', value: currentWord, line }); // ADDED line
          } else {
            throw new UnexpectedTokenError(line, currentWord); // ADDED
          }
    }
  }
  console.log("Tokens generated:", tokens);

  return tokens;
}
