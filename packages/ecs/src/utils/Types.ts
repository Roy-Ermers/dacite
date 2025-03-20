/**
 * A class instance.
 */
// biome-ignore lint: In this case it is necessary to use Object
export type ClassInstance = Object;

/**
 * A type that can be constructed.
 */
// biome-ignore lint: Function is used for generic types
export interface Type<T = ClassInstance> extends Function {
	new (...args: never[]): T;
}

/**
 * Append a type to another type.
 */
export type Append<T, U> = T extends null ? U : T & U;
