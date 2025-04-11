import * as fs from 'fs';
import { tokenize } from './lexer';
import { parse } from './parser';
import { generateCode } from './generator';
import { UnexpectedTokenError, MissingTokenError, InvalidDefaultValueError, InvalidTypeError } from "./error";

console.log("Starting CLI");

const source = fs.readFileSync(process.argv[3], 'utf-8');
console.log("Source read:", source);

try {
  const tokens = tokenize(source);
  console.log("Tokens after tokenize:", tokens);

  type ASTNode =
    | {
        type: "ModelDeclaration";
        name: string;
        fields: {
          name: string;
          fieldType: string;
          optional: boolean;
          defaultValue: string | number | boolean | null;
          isArray: boolean;
          relation: boolean;
          relatedModel: string | null;
        }[];
      };
  const ast: ASTNode[] = parse(tokens);
  console.log("AST generated:", ast);

  const { html, js, frontendCode } = generateCode(ast);

  const outDir = __dirname + '/../../out';
  const frontendDir = outDir + '/frontend';

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir);
  }

  fs.writeFileSync(outDir + '/index.html', html);
  fs.writeFileSync(outDir + '/script.js', js);
  fs.writeFileSync(frontendDir + '/types.ts', frontendCode);

} catch (error) {
  if (error instanceof UnexpectedTokenError) {
    console.log(`Unexpected token "${error.got}" at line ${error.line}`);
  } else if (error instanceof MissingTokenError) {
    console.log(`Missing token "${error.expected}" at line ${error.line}`);
  } else if (error instanceof InvalidDefaultValueError) {
    console.log(`Invalid default value, expected type "${error.expected}" got "${error.got}" at line ${error.line}`);
  } else if (error instanceof InvalidTypeError) {
      console.log(`Invalid Type, got "${error.got}" at line ${error.line}`);
  } else {
    console.log("Error", error);
  }
}
