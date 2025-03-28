import ComponentSymbols from "../components/ComponentSymbols";
import type { Type } from "./Types";

const typeCache: Map<
	Type<unknown> | ((...args: unknown[]) => unknown) | symbol,
	Type
> = new Map();

export interface ComponentTypeSymbolConstructor {
	[ComponentSymbols.componentType](): Type;
}

function hasComponentType(
	component: unknown
): component is ComponentTypeSymbolConstructor {
	if (typeof component !== "object" || !component) {
		return false;
	}

	if (ComponentSymbols.componentType in component)
		return typeof component[ComponentSymbols.componentType] === "function";

	return false;
}

function parseBaseComponentType<
	T extends Type<unknown> | ((...args: unknown[]) => unknown)
>(component: T): Type {
	let type = component;
	// walk up the prototype chain to find the first class with a component type or the base class
	while (type.name !== "") {
		if (hasComponentType(type)) {
			return type[ComponentSymbols.componentType]();
		}
		const newType = Object.getPrototypeOf(type);

		if (newType.name === "") {
			return type as Type;
		}

		type = newType;
	}

	console.error(component, type);
	throw new Error("Component type not found");
}

/**
 * Get the base component type from a component.
 * @param component Component to get the type from
 * @returns The base component type to match against.
 */
export function getBaseComponentType<
	T extends Type<unknown> | ((...args: unknown[]) => unknown) | symbol
>(component: T): Type | symbol {
	if (typeof component === "symbol") {
		return component;
	}

	const cacheHit = typeCache.get(component);

	if (cacheHit) return cacheHit;

	const type = parseBaseComponentType(component);
	typeCache.set(component, type);

	return type;
}

export default {
	getBaseComponentType
};
