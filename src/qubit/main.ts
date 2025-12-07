import { Lexer } from './lexer/lexer';
import { Parser } from './parser/parser';

const code = 'var myNumber = 42;';

console.log('--- Input Code ---');
console.log(code);

const lexer = new Lexer(code);
const parser = new Parser(lexer);

const ast = parser.parse();

console.log('--- Abstract Syntax Tree (AST) ---');
console.log(JSON.stringify(ast, null, 2));
