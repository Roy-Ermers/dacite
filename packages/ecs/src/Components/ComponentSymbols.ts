export default class ComponentSymbols {
  static readonly componentName: unique symbol = Symbol("component name");
  static readonly componentType: unique symbol = Symbol("component type");
}

export type ComponentTypeSymbol = typeof ComponentSymbols.componentType;
export type ComponentNameSymbol = typeof ComponentSymbols.componentName;
