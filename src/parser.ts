import { UnexpectedTokenError, MissingTokenError, InvalidDefaultValueError, InvalidTypeError } from "./error"; // ADDED

type Token = { type: string; value: string; line: number }; // ADDED line

type ASTNode =
  | {
      type: 'ModelDeclaration';
      name: string;
      fields: { name: string; fieldType: string; optional: boolean; defaultValue: string | number | boolean | null; isArray: boolean; relation: boolean; relatedModel: string | null }[];
    };

export function parse(tokens: Token[]): ASTNode[] {
  console.log("parse function called with tokens:", tokens);
  const ast: ASTNode[] = [];
  let i = 0;

  function expect(type: string, value?: string) {
    console.log(`expect called with type: ${type}, value: ${value}, current token: ${JSON.stringify(tokens[i])}`);
    const token = tokens[i];
    if (!token || token.type !== type || (value && token.value !== value)) {
      if (token){
          throw new UnexpectedTokenError(token.line, token.value);
      } else{
          throw new MissingTokenError(tokens[i-1].line, type);
      }
    }
    i++;
    return token;
  }




  function expectTypeOrIdentifier(): { type: string; relatedModel: string | null; isArray: boolean } {
    let token = tokens[i];
    let relatedModel: string | null = null;
    let isArray = false;
  
    if (token?.type === "identifier" || token?.type === "type") {
      const fieldType = token.value;
      i++;
  
      if (fieldType === "relation") {
        relatedModel = expect("identifier").value;
      } else {
        if (tokens[i]?.type === "symbol" && tokens[i]?.value === "[") {
          expect("symbol", "[");
          expect("symbol", "]");
          isArray = true;
        }
        relatedModel = fieldType;
      }
      return { type: fieldType, relatedModel, isArray };
    } else {
      throw new UnexpectedTokenError(token?.line || 0, token?.value || "");
    }
  }

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type === 'keyword' && token.value === 'model') {
      i++; // Skip 'model'
      const name = expect('identifier').value;
      expect('symbol', '{');

      const fields: { name: string; fieldType: string; optional: boolean; defaultValue: string | number | boolean | null; isArray: boolean; relation: boolean; relatedModel: string | null }[] = []; // FIX: Updated type here

      while (tokens[i].value !== '}') {
        let optional = false;
        if (tokens[i].type === "symbol" && tokens[i].value === "?"){
          expect("symbol", "?");
          optional = true;
        } else if (tokens[i].type === "symbol" && tokens[i].value === ":"){
        }
        const fieldName = expect("identifier").value;
        expect("symbol", ":");
        const { type: fieldType, relatedModel, isArray } = expectTypeOrIdentifier();
        let defaultValue: string | number | boolean | null = null; // FIX: Added type
        let relation = false;
        if (fieldType === "relation") {
          relation = true;
        }
        if (tokens[i].value === "=") {
          expect("symbol", "=");
          const token = tokens[i];
          if (token.type === "bool" && fieldType === "bool") {
            defaultValue = expect("bool").value === "true";
          } else if (token.type === "int" && fieldType === "int") {
            defaultValue = parseInt(expect("int").value, 10);
          } else if (token.type === "string" && fieldType === "string") {
            defaultValue = expect("string").value;
          } else if (token.type === "float" && fieldType === "float") {
            defaultValue = parseFloat(expect("float").value);
          } else{
            throw new InvalidDefaultValueError(tokens[i].line, "bool, int, float or string", tokens[i].value);
          }
        } else if (tokens[i-1].value === "="){
            throw new MissingTokenError(tokens[i-1].line, "default value");
        }
        fields.push({ name: fieldName, fieldType, optional, defaultValue, isArray, relation, relatedModel });
      }
      expect("symbol", "}");

      ast.push({
        type: 'ModelDeclaration',
        name,
        fields
      });
    } else {
        throw new UnexpectedTokenError(token.line, token.value);
    }
  }
  console.log("AST generated:", JSON.stringify(ast, null, 2));

  return ast;
}
