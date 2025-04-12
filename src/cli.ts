import * as fs from 'fs';
import { tokenize } from './tokenizer';
import { parse } from './parser';
import { generateCode } from './generator';

function main() {
    console.log("Starting CLI");
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.error("Usage: cli.ts <command> <source>");
        process.exit(1);
    }

    const command = args[0];
    const sourcePath = args[1];

    if (command === 'build') {
        try {
            const source = fs.readFileSync(sourcePath, 'utf-8');
            console.log("Source read:", source);
            const tokens = tokenize(source);
            console.log("Tokens after tokenize:", JSON.stringify(tokens, null, 2));
            const ast = parse(tokens);
            const { html, backendModels, frontendCode } = generateCode(ast);
            fs.writeFileSync('generated/models.ts', backendModels);
            fs.writeFileSync('generated/index.tsx', frontendCode);



            console.log(`Files generated`);
            process.exit(0);

        } catch (error) {
            console.error("Error:", error);
            process.exit(1);
        }
    } else {
        console.error("Invalid command");
        process.exit(1);
    }
}

main();
