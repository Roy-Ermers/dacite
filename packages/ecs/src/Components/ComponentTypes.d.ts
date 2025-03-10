import { Type } from "../Utils/Types";
import ComponentSymbols, { type ComponentTypeSymbol } from "./ComponentSymbols";

export type AllowedComponentTypes = Object;

type ComponentInstance<T> = T extends Type<infer U> ? U : never;

// Infer the type of a component from a ComponentTypeSymbolConstructor
type ComponentTypeReturn<T extends ComponentTypeSymbolConstructor> = ReturnType<T[ComponentTypeSymbol]>;
/**
  Extract the type of a component
  Can be overriden using the `ComponentSymbols.componentType` method
*/
export type ExtractComponentType<T> = T extends ComponentTypeSymbolConstructor ? ComponentTypeReturn<T> : T;

export type ComponentTypeSymbolConstructor = {
  [ComponentSymbols.componentType](): Type;
}
