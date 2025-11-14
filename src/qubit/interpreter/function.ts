// src/qubit/interpreter/function.ts
import { Function as FunctionStmt } from '../parser/ast';
import { Interpreter, QubitValue } from './interpreter';
import { Environment } from './environment';
import { QubitCallable } from './callable';

export class QubitFunction implements QubitCallable {
    constructor(private readonly declaration: FunctionStmt) {}

    arity(): number {
        return this.declaration.params.length;
    }

    call(interpreter: Interpreter, args: QubitValue[]): QubitValue {
        const environment = new Environment(interpreter.getGlobals());
        for (let i = 0; i < this.declaration.params.length; i++) {
            environment.define(this.declaration.params[i].lexeme, args[i]);
        }

        try {
            interpreter.executeBlock(this.declaration.body, environment);
        } catch (e) {
            if (e instanceof Object && Object.prototype.hasOwnProperty.call(e, 'value')) {
                return (e as { value: QubitValue }).value;
            }
            throw e;
        }
        
        return null;
    }

    toString(): string {
        return `<fn ${this.declaration.name.lexeme}>`;
    }
}
