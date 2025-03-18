export type Type<T = any> = { new(...args: any[]): T };

export type Append<T, U> = T extends null ?  U : T & U;
