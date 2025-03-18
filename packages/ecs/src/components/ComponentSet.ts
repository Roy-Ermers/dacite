import { Type } from "../utils/Types";
import ComponentSymbols from "./ComponentSymbols";
import { AllowedComponentTypes } from "./ComponentTypes";

/**
* A set of components, allows you to assign more than one of the same components to a entity.
* Main way to create one is the `create` shorthand
* @example
* class Force {
*   constructor(public direction: Vector2) {}
* }
*
* const forceComponentSet = ComponentSet.create(Force);
*
* const entity = scope.entity()
*		.set(new ForceComponentSet(new Force(Vector2.One)));
*
* const set = entity.get(ForceComponentSet);
* set.add(new Force(Vector2.Zero));
*
* for(const force of set) {
*   console.log(force.direction);
*	}
*/
export default class ComponentSet<T extends AllowedComponentTypes> {
	private components: T[] = [];
	private ids = new Map<T, number>();

	static create<T extends AllowedComponentTypes>(type: Type<T>): typeof ComponentSet<T> {
		const name = type.name + "ComponentSet";
		const incubator = {
			[name]: class extends ComponentSet<T> { }
		}
		return incubator[name];
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
		this.ids.delete(component);
	}

	[Symbol.iterator]() {
		return this.components[Symbol.iterator]();
	}

	toArray(): readonly T[] {
		return this.components.slice();
	}
}
