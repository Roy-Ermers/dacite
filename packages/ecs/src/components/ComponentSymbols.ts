export const ComponentTypeSymbol: unique symbol = Symbol.for("component-type");

export type ComponentType = typeof ComponentTypeSymbol;
