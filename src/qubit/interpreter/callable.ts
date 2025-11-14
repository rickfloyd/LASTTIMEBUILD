// src/qubit/interpreter/callable.ts
import { Interpreter } from './interpreter';
import { QubitValue } from './interpreter';

export interface QubitCallable {
    arity(): number;
    call(interpreter: Interpreter, args: QubitValue[]): QubitValue;
}
