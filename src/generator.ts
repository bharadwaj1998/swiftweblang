import * as fs from 'fs';

type ASTNode =
    | {
        type: "ModelDeclaration";
        name: string;
        fields: { name: string; fieldType: string; optional: boolean; defaultValue: string | number | boolean | null; isArray: boolean; relation: boolean; relatedModel: string | null }[];
    }


function generateComponentCode(node: ASTNode) {
    if (node.type === 'ModelDeclaration') {
        let componentCode = `\n`;
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
    return frontendComponents
}

export function generateCode(ast: ASTNode[]) {
    console.log("generateCode called with AST:", ast);
    if (!fs.existsSync('generated')) fs.mkdirSync('generated');
    let backendModels = `import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';\n\n`;
    let frontendCode = "";
    let html = `<!DOCTYPE html>\n    <html lang="en">\n    <head>\n        <meta charset="UTF-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1.0">\n        <title>Generated App</title>\n    </head>\n    <body>\n    \n    </body>\n    </html>`;
    for (const node of ast) {
        if (node.type === 'ModelDeclaration') {
            backendModels += `@Entity()\nexport class ${node.name} {\n`;
            frontendCode += `export interface ${node.name} {\n`
            for (const field of node.fields) {
                const optionalSign = field.optional ? "?" : "";
                if (field.fieldType === "uuid") {
                    backendModels += `  @PrimaryGeneratedColumn("uuid")\n  ${field.name}: string;\n`;
                    frontendCode += `  ${field.name}${optionalSign}: string;\n`
                } else if (field.fieldType === "string") {
                    backendModels += `  @Column({ nullable: ${field.optional} })\n  ${field.name}${optionalSign}: string ${field.defaultValue !== null ? ` = "${field.defaultValue}"` : ""};\n`;
                    frontendCode += `  ${field.name}${optionalSign}: string;\n`
                } else if (field.fieldType === "bool") {
                    backendModels += `  @Column({ nullable: ${field.optional} })\n  ${field.name}${optionalSign}: boolean ${field.defaultValue !== null ? ` = ${field.defaultValue}` : ""};\n`;
                    frontendCode += `  ${field.name}${optionalSign}: boolean;\n`
                } else if (field.fieldType === "int") {
                    backendModels += `  @Column({ nullable: ${field.optional} })\n  ${field.name}${optionalSign}: number ${field.defaultValue !== null ? ` = ${field.defaultValue}` : ""};\n`;
                    frontendCode += `  ${field.name}${optionalSign}: number;\n`
                } else if (field.fieldType === "float") {
                    backendModels += `  @Column({ type: 'float', nullable: ${field.optional} })\n  ${field.name}${optionalSign}: number ${field.defaultValue !== null ? ` = ${field.defaultValue}` : ""};\n`;
                    frontendCode += `  ${field.name}${optionalSign}: number;\n`
                } else {
                    const isPrimitive = ["uuid", "string", "bool", "int", "float"].includes(field.fieldType);
                    const columnType = isPrimitive ? "" : `type: 'jsonb', `;
                    const tsType = isPrimitive ? field.fieldType : field.relatedModel;
                    if (field.relation) {
                        if (field.relatedModel) {
                            if (field.isArray) {
                                backendModels += `  @OneToMany(() => ${field.relatedModel}, (${field.relatedModel.toLowerCase()}) => ${field.relatedModel.toLowerCase()}.${node.name.toLowerCase()}, { nullable: ${field.optional} })\n  ${field.name}${optionalSign}: ${field.relatedModel}[];\n`;
                            } else {
                                backendModels += `  @ManyToOne(() => ${field.relatedModel}, (${field.relatedModel.toLowerCase()}) => ${field.relatedModel.toLowerCase()}.${node.name.toLowerCase()}, { nullable: ${field.optional} })\n  ${field.name}${optionalSign}: ${field.relatedModel};\n`;
                            }
                        }

                    } else {
                        if (field.isArray && field.relatedModel){
                            backendModels += `  @Column({ ${columnType} nullable: ${field.optional} })\n  ${field.name}${optionalSign}: ${tsType}[];\n`;
                        } else {
                            backendModels += `  @Column({ ${columnType} nullable: ${field.optional} })\n  ${field.name}${optionalSign}: ${tsType} ${field.defaultValue !== null ? ` = ${field.defaultValue}` : ""};\n`;
                        }
                    }

                    frontendCode += `  ${field.name}${optionalSign}: ${tsType}${field.isArray ? '[]' : ''};\n`
                }
            }
            backendModels += `}\n\n`;
            frontendCode += `}\n\n`;
        }
    }
    frontendCode = `import React from 'react';\n` + frontendCode + generateFrontendCode(ast);
    fs.writeFileSync('generated/index.tsx', frontendCode);
    return { html, backendModels, frontendCode, };
}

