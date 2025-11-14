// src/qubit/interpreter/interpreter.ts
import {
    Assign,
    Binary,
    Call,
    Expr,
    Grouping,
    Literal,
    Logical,
    Unary,
    Variable,
    Visitor,
    Stmt,
    Expression,
    Print,
    Var,
    Block,
    If,
    While,
    Function as FunctionStmt,
    Return,
    StmtVisitor
} from '../parser/ast';
import { Token, TokenType } from '../lexer/token';
import { Environment } from './environment';
import { QubitCallable } from './callable';
import { QubitFunction } from './function';

export type QubitValue = string | number | boolean | null | QubitCallable;

class ReturnError {
    constructor(public readonly value: QubitValue) {}
}

class RuntimeError extends Error {
    constructor(public token: Token, message: string) {
        super(message);
    }
}

export class Interpreter implements Visitor<QubitValue>, StmtVisitor<void> {
    public readonly globals = new Environment();
    private environment = this.globals;

    constructor() {
        // Define native functions here if any
    }

    getGlobals(): Environment {
        return this.globals;
    }

    interpret(statements: Stmt[]): void {
        try {
            for (const statement of statements) {
                this.execute(statement);
            }
        } catch (error) {
            if (error instanceof ReturnError) {
                // This should not happen at the top level
                console.error("Error: 'return' outside of a function.");
            } else {
                console.error(error);
            }
        }
    }

    visitCallExpr(expr: Call): QubitValue {
        const callee = this.evaluate(expr.callee);

        const args: QubitValue[] = [];
        for (const arg of expr.args) {
            args.push(this.evaluate(arg));
        }

        if (!callee || typeof (callee as QubitCallable).call !== 'function') {
            throw new RuntimeError(expr.paren, "Can only call functions and classes.");
        }

        const func = callee as QubitCallable;

        if (args.length !== func.arity()) {
            throw new RuntimeError(expr.paren, `Expected ${func.arity()} arguments but got ${args.length}.`);
        }

        return func.call(this, args);
    }

    visitLiteralExpr(expr: Literal): QubitValue {
        return expr.value;
    }

    visitGroupingExpr(expr: Grouping): QubitValue {
        return this.evaluate(expr.expression);
    }

    visitUnaryExpr(expr: Unary): QubitValue {
        const right = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.MINUS:
                this.checkNumberOperand(expr.operator, right);
                return -Number(right);
            case TokenType.BANG:
                return !this.isTruthy(right);
        }

        // Unreachable.
        return null;
    }

    visitBinaryExpr(expr: Binary): QubitValue {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);

        switch (expr.operator.type) {
            case TokenType.GREATER:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) > Number(right);
            case TokenType.GREATER_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) >= Number(right);
            case TokenType.LESS:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) < Number(right);
            case TokenType.LESS_EQUAL:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) <= Number(right);
            case TokenType.BANG_EQUAL: return !this.isEqual(left, right);
            case TokenType.EQUAL_EQUAL: return this.isEqual(left, right);
            case TokenType.MINUS:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) - Number(right);
            case TokenType.PLUS:
                if (typeof left === 'number' && typeof right === 'number') {
                    return left + right;
                }
                if (typeof left === 'string' && typeof right === 'string') {
                    return left + right;
                }
                throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
            case TokenType.SLASH:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) / Number(right);
            case TokenType.STAR:
                this.checkNumberOperands(expr.operator, left, right);
                return Number(left) * Number(right);
        }

        // Unreachable.
        return null;
    }

    visitVariableExpr(expr: Variable): QubitValue {
        return this.environment.get(expr.name);
    }

    visitAssignExpr(expr: Assign): QubitValue {
        const value = this.evaluate(expr.value);
        this.environment.assign(expr.name, value);
        return value;
    }

    visitLogicalExpr(expr: Logical): QubitValue {
        const left = this.evaluate(expr.left);

        if (expr.operator.type === TokenType.OR) {
            if (this.isTruthy(left)) return left;
        } else { // AND
            if (!this.isTruthy(left)) return left;
        }

        return this.evaluate(expr.right);
    }

    visitBlockStmt(stmt: Block): void {
        this.executeBlock(stmt.statements, new Environment(this.environment));
    }

    executeBlock(statements: Stmt[], environment: Environment): void {
        const previous = this.environment;
        try {
            this.environment = environment;

            for (const statement of statements) {
                this.execute(statement);
            }
        } finally {
            this.environment = previous;
        }
    }

    visitExpressionStmt(stmt: Expression): void {
        this.evaluate(stmt.expression);
    }

    visitFunctionStmt(stmt: FunctionStmt): void {
        const func = new QubitFunction(stmt);
        this.environment.define(stmt.name.lexeme, func);
    }

    visitIfStmt(stmt: If): void {
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch !== null) {
            this.execute(stmt.elseBranch);
        }
    }

    visitPrintStmt(stmt: Print): void {
        const value = this.evaluate(stmt.expression);
        console.log(this.stringify(value));
    }

    visitReturnStmt(stmt: Return): void {
        let value: QubitValue = null;
        if (stmt.value !== null) {
            value = this.evaluate(stmt.value);
        }
        throw new ReturnError(value);
    }

    visitVarStmt(stmt: Var): void {
        let value: QubitValue = null;
        if (stmt.initializer !== null) {
            value = this.evaluate(stmt.initializer);
        }

        this.environment.define(stmt.name.lexeme, value);
    }

    visitWhileStmt(stmt: While): void {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }
    }

    private execute(stmt: Stmt) {
        stmt.accept(this);
    }

    private evaluate(expr: Expr): QubitValue {
        return expr.accept(this);
    }

    private isTruthy(object: QubitValue): boolean {
        if (object === null) return false;
        if (typeof object === 'boolean') return object;
        return true;
    }

    private isEqual(a: QubitValue, b: QubitValue): boolean {
        if (a === null && b === null) return true;
        if (a === null) return false;
        return a === b;
    }

    private stringify(object: QubitValue): string {
        if (object === null) return "nil";
        return object.toString();
    }

    private checkNumberOperand(operator: Token, operand: QubitValue): void {
        if (typeof operand === 'number') return;
        throw new RuntimeError(operator, "Operand must be a number.");
    }

    private checkNumberOperands(operator: Token, left: QubitValue, right: QubitValue): void {
        if (typeof left === 'number' && typeof right === 'number') return;
        throw new RuntimeError(operator, "Operands must be numbers.");
    }
}
