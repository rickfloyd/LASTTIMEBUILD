// src/qubit/interpreter/environment.ts
import { Token } from '../lexer/token';

type QubitValue = string | number | boolean | null;

class RuntimeError extends Error {
    constructor(public token: Token, message: string) {
        super(message);
    }
}

export class Environment {
    enclosing: Environment | null = null;
    private readonly values: Map<string, QubitValue> = new Map();

    constructor(enclosing?: Environment) {
        if (enclosing) {
            this.enclosing = enclosing;
        }
    }

    define(name: string, value: QubitValue): void {
        this.values.set(name, value);
    }

    get(name: Token): QubitValue {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme)!;
        }

        if (this.enclosing !== null) {
            return this.enclosing.get(name);
        }

        throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
    }

    assign(name: Token, value: QubitValue): void {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value);
            return;
        }

        if (this.enclosing !== null) {
            this.enclosing.assign(name, value);
            return;
        }

        throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
    }
}
