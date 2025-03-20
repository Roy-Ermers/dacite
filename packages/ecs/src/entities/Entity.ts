import { NAME_SYMBOL, type default as Scope } from "../Scope";
import type { Append, ClassInstance, Type } from "../utils/Types";

export type EntityComponentType<S, T> = S extends T ? T : T | null;

// generic describes all possible components
export default class Entity<S = unknown> {
	private _id: number;
	public readonly scope: Scope;

	public get id() {
		return this._id;
	}

	/** @internal */
	public set id(value) {
		this._id = value;
	}

	/**
	 * The name of the entity, can be used to identify it.
	 */
	public get name() {
		return (
			this.scope
				.getComponentSet<string>(NAME_SYMBOL, { create: false })
				.get(this.id) ?? "Unknown entity"
		);
	}

	/**
	 * The name of the entity, can be used to identify it.
	 */
	public set name(value: string) {
		this.scope.getComponentSet(NAME_SYMBOL).set(this.id, value);
	}

	/**
	 * Check if the entity is alive.
	 */
	public get isAlive() {
		return this.scope.isAlive(this.id);
	}

	/** @internal */
	constructor(id: number, scope: Scope) {
		this._id = id;
		this.scope = scope;
	}

	/**
	 * Destroy this entity, after this it won't be available anymore.
	 */
	destroy(): void {
		this.scope.destroyEntity(this._id);
	}

	/**
	 * Set a component on this entity.
	 * @param component the component to add
	 * @returns current entity
	 */
	set<T extends ClassInstance>(component: T) {
		if (typeof component === "symbol") {
			this.setTag(component);
			return this as unknown as Entity<Append<S, T>>;
		}

		const set = this.scope.getComponentSet(
			component.constructor as Type<ClassInstance>,
			{
				create: true
			}
		);

		const added = !set.has(this.id);

		set.set(this.id, component);

		if (added) this.scope.eventbus.emit("componentadded", this, component);
		return this as unknown as Entity<Append<S, T>>;
	}

	/**
	 * Get a component from this entity
	 * @param componentType The component type to get
	 * @returns the component that matches T or null
	 */
	get<T extends ClassInstance>(
		componentType: Type<T>
	): EntityComponentType<S, T> {
		const set = this.scope.getComponentSet(componentType);
		if (!set) return null as EntityComponentType<S, T>;

		return set.get(this.id) as EntityComponentType<S, T>;
	}

	/**
	 * # ! Use with caution, this is not a cheap operation. !
	 *
	 * Get all components assigned to this entity.
	 * @returns All components assigned to this entity
	 */
	getAll() {
		const components: unknown[] = [...this[Symbol.iterator]()];
		return components;
	}

	/**
	 * Checks if this entity has the component
	 * @param component Component to check for
	 */
	has<T extends ClassInstance>(component: symbol): boolean;
	/**
	 * Checks if this entity has the component
	 * @param component Component to check for
	 */
	has<T extends ClassInstance>(component: Type<T>): boolean;
	/**
	 * Checks if this entity has the component
	 * @param component Component to check for
	 */
	has<T extends ClassInstance>(component: Type<T> | symbol): boolean;
	has<T extends ClassInstance>(component: Type<T> | symbol) {
		if (typeof component === "symbol") {
			return this.hasTag(component);
		}

		const set = this.scope.getComponentSet(component);

		if (!set) {
			return false;
		}

		return set.has(this.id);
	}

	/**
	 * Checks if this entity has any components. Can be used if this entity is freshly created or not.
	 */
	hasAny(): boolean {
		for (const set of this.scope.components.values()) {
			if (set.has(this.id)) return true;
		}

		return false;
	}

	/**
	 * Set a tag on the entity
	 * @param tag tag to add
	 */
	setTag(tag: symbol) {
		const tags = this.scope.getTagSet();
		const existingTags = tags.get(this.id) ?? new Set();
		existingTags.add(tag);

		tags.set(this.id, existingTags);
	}

	/**
	 * Check if this entity has a tag
	 * @param tag Tag to check for
	 * @returns a boolean
	 */
	hasTag(tag: symbol) {
		const tags = this.scope.getTagSet();
		const existingTags = tags.get(this.id);

		return existingTags?.has(tag) ?? false;
	}

	/**
	 * Remove a tag from this entity.
	 * @param tag tag to remove
	 */
	removeTag(tag: symbol) {
		const tags = this.scope.getTagSet();
		const existingTags = tags.get(this.id);

		if (existingTags) {
			existingTags.delete(tag);
		}
	}

	/**
	 * remove a component based on type from this entity
	 */
	remove<T extends ClassInstance>(component: Type<T>): Entity<Extract<S, T>>;
	/**
	 * remove a component based on instance from this entity
	 */
	remove<T extends ClassInstance>(component: T): Entity<Extract<S, T>>;
	/**
	 * remove a component from this entity
	 */
	remove<T extends ClassInstance>(
		component: T | Type<T>
	): Entity<Extract<S, T>>;
	remove<T extends ClassInstance>(component: Type<T> | T) {
		let type = component;
		if (typeof type !== "function") type = component.constructor as Type<T>;

		const set = this.scope.getComponentSet(type);
		set.delete(this.id);
		this.scope.eventbus.emit("componentremoved", this, component);
		return this as unknown as Entity<Extract<T, S>>;
	}

	*[Symbol.iterator]() {
		for (const set of this.scope.components.values()) {
			if (set.has(this.id)) {
				yield set.get(this.id);
			}
		}
	}

	[Symbol.toPrimitive](hint: "string" | "number" | "default") {
		if (hint === "number") {
			return this.id;
		}

		return this.name;
	}

	[Symbol.toStringTag]() {
		return "Entity";
	}
}
