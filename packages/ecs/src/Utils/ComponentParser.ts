import ComponentSymbols from "../Components/ComponentSymbols";
import { ComponentTypeSymbolConstructor, AllowedComponentTypes } from "../Components/ComponentTypes";
import { Type } from "./Types";

export default class ComponentParser {
	static typeCache: Map<Type | Function, Type> = new Map();
	private static hasComponentType(component: unknown): component is ComponentTypeSymbolConstructor {
		return typeof (component as any)[ComponentSymbols.componentType] === 'function';
	}

	public static getBaseComponentType<T extends Type<AllowedComponentTypes> | Function>(component: T): Type {
		const cacheHit = this.typeCache.get(component);

		if (cacheHit)
			return cacheHit;

		const type = this.parseBaseComponentType(component);
		this.typeCache.set(component, type);

		return type;
	}

	private static parseBaseComponentType<T extends Type<AllowedComponentTypes> | Function>(component: T): Type {
		let type = component;
		// walk up the prototype chain to find the first class with a component type or the base class
		while (type.name !== '') {
			if (this.hasComponentType(type)) {
				return type[ComponentSymbols.componentType]();
			}
			const newType = Object.getPrototypeOf(type.constructor);

			if (newType.name === '') {
				return type as Type;
			}

			type = newType;
		}

		console.error(component, type);
		throw new Error("Component type not found");
	}
}
