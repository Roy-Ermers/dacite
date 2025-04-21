import type { ClassInstance, Type } from "../utils/Types";
import { ComponentTypeSymbol } from "./ComponentSymbols";
// Annoying way but has to be like this for typescript to support external modules.
const symbol = ComponentTypeSymbol;

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
export default class ComponentSet<T extends ClassInstance = object> {
	private components: T[] = [];

	static create<T extends ClassInstance>(
		type: Type<T>
	): typeof ComponentSet<T> {
		const name = `${type.name}ComponentSet`;
		const incubator = {
			[name]: class extends ComponentSet<T> {}
		};
		return incubator[name] as typeof ComponentSet<T>;
	}

	get size() {
		return this.components.length;
	}

	static [symbol]() {
		// biome-ignore lint: We actually want to return the class type itself here.
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

	/**
	 * Add a new component to this set.
	 * @param component Component to add
	 */
	add(component: T) {
		const index = this.components.indexOf(component);

		if (index >= 0) {
			this.components[index] = component;
			return;
		}

		this.components.push(component);
	}

	/**
	 * Check if this set contains a component.
	 * @param component Component to check
	 */
	has(component: T): boolean {
		return this.components.includes(component);
	}

	delete(component: T) {
		const index = this.components.findIndex(x => x === component);
		const [deletedComponent] = this.components.splice(index, 1);
	}

	find(predicate: (value: T) => boolean) {
		return this.components.find(predicate);
	}

	[Symbol.iterator]() {
		return this.components[Symbol.iterator]();
	}

	toArray(): readonly T[] {
		return this.components.slice();
	}
}
