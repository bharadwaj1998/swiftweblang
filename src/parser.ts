import { UnexpectedTokenError, MissingTokenError, InvalidDefaultValueError, InvalidTypeError } from "./error";

type Token = { type: string; value: string; line: number };

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
    if (!token || token.type !== type || (value && token.value !== value) ) {
      if (token){
          throw new UnexpectedTokenError(token.line, token.value);
      } else{
          throw new MissingTokenError(tokens[i-1].line, type);
      }
    }
    i++;
    return token;
  }





  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type === 'keyword' && token.value === 'model') {
      i++; // Skip 'model'
        const name = expect('identifier').value;
      expect('symbol', '{');

      const fields: { name: string; fieldType: string; optional: boolean; defaultValue: string | number | boolean | null; isArray: boolean; relation: boolean; relatedModel: string | null }[] = [];
        let defaultValue: string | number | boolean | null = null;

        while (tokens[i].value !== '}') {
        let optional = false;
        const fieldName = expect('identifier').value;
        if (tokens[i]?.type === "symbol" && tokens[i]?.value === "?") { expect("symbol", "?"); optional = true; }
        expect("symbol", ":");        
        let isArray = false;
        let relatedModel: string | null = null;
        let relation = false;
        let fieldType = '';
        if (tokens[i].type === 'type') {
          fieldType = expect('type').value;
        } else if (tokens[i].type === 'identifier') {
          relatedModel = expect('identifier').value;
          fieldType = 'array';
        }

        if(tokens[i].value==='['){
          expect('symbol', '[');
          isArray = true;
          expect('symbol', ']');
        }

        if (tokens[i].value === "=") {
          expect("symbol", "=");
          const token = tokens[i];
          if (token.type === "bool" && fieldType === "bool") {
            let defaultValue: any = null; defaultValue = expect("bool").value === "true";
          } else if (token.type === "int" && fieldType === "int") {
            defaultValue = parseInt(expect("int").value, 10);
          } else if (token.type === "string" && fieldType === "string") {
            defaultValue = expect("string").value;
          } else if (token.type === "int" && tokens[i].type === "int" && fieldType === "float") {            
            const int1 = expect("int").value;
            const int2 = expect("int").value;
            defaultValue = parseFloat(int1+"."+int2);
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
