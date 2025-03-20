export const componentType: unique symbol = Symbol("component type");

export type ComponentTypeSymbol = typeof componentType;

export default {
	componentType: componentType as ComponentTypeSymbol
};
