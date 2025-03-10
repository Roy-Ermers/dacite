import { Type } from "../Utils/Types";
import ComponentSymbols from "./ComponentSymbols";
import { AllowedComponentTypes } from "./ComponentTypes";

export default class ComponentSet<T extends AllowedComponentTypes> {
	private components: T[] = [];
	private ids = new Map<T, number>();

	static create<T extends AllowedComponentTypes>(type: Type<T>): typeof ComponentSet<T> {
		const newSet = class extends ComponentSet<T> { }
		Object.assign(newSet.constructor, { name: type.constructor.name + "ComponentSet" });

		return newSet;
	}

	get size() {
		return this.components.length;
	}

	static [ComponentSymbols.componentType]() {
		return this;
	}

	constructor(...items: T[]) {
		for (const item of items) {
			this.add(item);
		}
	}

	values() {
		return this.components[Symbol.iterator]();
	}

	add(component: T): void;
	add(component: T, index: number): void;
	add(component: T, index?: number) {
		index ??= this.indexOf(component);

		if (index !== undefined) {
			this.components[index] = component;
			return;
		}

		const newIndex = this.components.push(component);
		this.ids.set(component, newIndex);
	}

	indexOf(component: T) {
		return this.ids.get(component);
	}

	has(component: T): boolean {
		return this.components.some(x => component === x);
	}


	delete(component: T) {
		const index = this.components.findIndex(x => x === component);
		this.components.splice(index, 1);
	}

	[Symbol.iterator]() {
		return this.components[Symbol.iterator]();
	}

	toArray(): readonly T[] {
		return this.components.slice();
	}
}
