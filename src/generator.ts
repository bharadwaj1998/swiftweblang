import * as fs from 'fs';

type ASTNode =
  | {
      type: 'ModelDeclaration';
      name: string;
      fields: { name: string; fieldType: string; optional: boolean; defaultValue: string | null, isArray: boolean }[];
    };

function generateComponentCode(node: ASTNode) {
    if (node.type === 'ModelDeclaration') {
        let componentCode = `import React from 'react';\n\n`;
        componentCode += `export const ${node.name}Component = () => {\n`;
        componentCode += `  return (\n    <div>\n`;
        componentCode += `      <h1>${node.name}</h1>\n`;
        componentCode += `    </div>\n  );\n};\n`;
        return componentCode;
    }
    return "";
}

function generateFrontendCode(ast: ASTNode[]) {
    let frontendComponents = "";
    for (const node of ast) {
        frontendComponents += generateComponentCode(node);
    }
    fs.writeFileSync('frontend/components/index.tsx', frontendComponents);
}

export function generateCode(ast: ASTNode[]) {
    console.log("generateCode called with AST:", ast);

    let backendModels = `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';\n\n`;
    let frontendCode = "";

    for (const node of ast) {
        if (node.type === 'ModelDeclaration') {
            backendModels += `@Entity()\nexport class ${node.name} {\n`;
            frontendCode += `export interface ${node.name} {\n`
            for (const field of node.fields) {
                if(field.fieldType === "uuid"){
                    backendModels += `  @PrimaryGeneratedColumn("uuid")\n  ${field.name}: string;\n`;
                    frontendCode += `  ${field.name}: string;\n`
                } else if (field.fieldType === "string"){
                    backendModels += `  @Column()\n  ${field.name}: string;\n`;
                    frontendCode += `  ${field.name}: string;\n`
                } else if (field.fieldType === "bool"){
                    backendModels += `  @Column()\n  ${field.name}: boolean;\n`;
                    frontendCode += `  ${field.name}: boolean;\n`
                } else if (field.fieldType === "int"){
                    backendModels += `  @Column()\n  ${field.name}: number;\n`;
                    frontendCode += `  ${field.name}: number;\n`
                } else if (field.fieldType === "float"){
                    backendModels += `  @Column()\n  ${field.name}: number;\n`;
                    frontendCode += `  ${field.name}: number;\n`
                } else {
                    backendModels += `  @Column()\n  ${field.name}: ${field.fieldType};\n`;
                    frontendCode += `  ${field.name}: ${field.fieldType};\n`
                }
            }
            backendModels += `}\n\n`;
            frontendCode += `}\n\n`
        }
    }
    fs.writeFileSync('backend/models.ts', backendModels);
    generateFrontendCode(ast);

    let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated App</title>
    </head>
    <body>
    
    </body>
    </html>`;

    let js = `console.log('Generated JavaScript');`;

    return { html, js, frontendCode };
}
