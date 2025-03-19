import { type default as Scope,  NAME_SYMBOL } from "../Scope";
import ComponentParser from "../utils/ComponentParser";
import type { Append, Type } from "../utils/Types";

export type EntityComponentType<S, T> = S extends T ? T : (T | null);

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

	public get name() {
		return this.scope.getComponentSet<string>(NAME_SYMBOL, { create: false }).get(this.id) ?? 'Unknown entity';
	}

	public set name(value: string) {
		this.scope.getComponentSet(NAME_SYMBOL).set(this.id, value);
	}

	public get isAlive() {
		return this.scope.isAlive(this.id);
	}

	/** @internal */
	constructor(id: number, scope: Scope) {
		this._id = id;
		this.scope = scope;
	}

	destroy(): void {
		this.scope.destroyEntity(this._id);
	}

	set<T extends Object>(component: T) {
		if(typeof component === 'symbol') {
			this.setTag(component);
			return this as unknown as Entity<Append<S, T>>;
		}

		const set = this.scope.getComponentSet(component.constructor, { create: true });
		if(!set.has(this.id))
			this.scope.eventbus.emit("componentadded", this, component);

		set.set(this.id, component);

		return this as unknown as Entity<Append<S, T>>;
	}

	get<T extends Object>(componentType: Type<T>): EntityComponentType<S, T> {
		const set = this.scope.getComponentSet(componentType);
		if (!set)
			return null as EntityComponentType<S, T>;

		return set.get(this.id) as EntityComponentType<S, T>;
	}

	getAll() {
		const components: unknown[] = [...this[Symbol.iterator]()];
		return components;
	}

	has<T extends Object>(component: symbol): boolean;
	has<T extends Object>(component: Type<T>): boolean;
	has<T extends Object>(component: Type<T> | symbol): boolean;
	has<T extends Object>(component: Type<T> | symbol) {
		if(typeof component == 'symbol') {
			return this.hasTag(component);
		}

		const set = this.scope.getComponentSet(component);

		if(!set) {
			return false;
		}

		return set.has(this.id);
	}

	hasAny(): boolean {
		for(const set of this.scope.components.values()) {
			if (set.has(this.id))
				return true;
		}

		return false;
	}


	setTag(tag: symbol) {
		const tags = this.scope.getTagSet();
		const existingTags = tags.get(this.id) ?? new Set();
		existingTags.add(tag);

		tags.set(this.id, existingTags);
	}

	hasTag(tag: symbol) {
		const tags = this.scope.getTagSet();
		const existingTags = tags.get(this.id);

		return existingTags?.has(tag) ?? false;
	}

	removeTag(tag: symbol) {
		const tags = this.scope.getTagSet();
		const existingTags = tags.get(this.id);

		if(existingTags) {
			existingTags.delete(tag);
		}
	}

	remove<T extends Object>(component: Type<T> | T) {
		if (typeof component !== 'function')
			component = component.constructor as Type<T>;

		const set = this.scope.getComponentSet(component);
		set.delete(this.id);
		this.scope.eventbus.emit("componentremoved",this, component);
		return this as unknown as Entity<Extract<T,S>>;
	}

	*[Symbol.iterator]() {
		for(const set of this.scope.components.values()) {
			if(set.has(this.id)) {
				yield set.get(this.id);
			}
		}
	}

	[Symbol.toPrimitive](hint: 'string' | 'number' | 'default') {
		if(hint === 'number') {
			return this.id;
		}

		return this.name;
	}

	[Symbol.toStringTag]() {
		return 'Entity';
	}
}
