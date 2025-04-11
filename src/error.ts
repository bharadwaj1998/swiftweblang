export class UnexpectedTokenError extends Error {
    got: any;
    constructor(public line: number, public tokenValue: string) {
      super(`Unexpected token "${tokenValue}" at line ${line}`);
      this.name = "UnexpectedTokenError";
    }
  }
  
  export class MissingTokenError extends Error {
    constructor(public line: number, public expected: string, public got?: string) {
      super(`Missing token "${expected}" at line ${line}, got "${got}"`);
      this.name = "MissingTokenError";
    }
  }
  
  export class InvalidTypeError extends Error {
      constructor(public line: number, public got: string) {
          super(`Invalid type "${got}" at line ${line}`);
          this.name = "InvalidTypeError";
      }
  }
  
  export class InvalidDefaultValueError extends Error {
      constructor(public line: number, public expected: string, public got: string) {
          super(`Invalid default value, expected type "${expected}" got "${got}" at line ${line}`);
          this.name = "InvalidDefaultValueError";
      }
  }
  