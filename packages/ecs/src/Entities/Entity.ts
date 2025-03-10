import type { AllowedComponentTypes } from "../Components/ComponentTypes";
import type Scope from "../Scope";
import type { Append, Type } from "../Utils/Types";
import EntityData from "./EntityData";
import IEntity, { EntityComponentType, ExtendEntity } from "./IEntity";


// generic describes all possible components
export default class Entity<S extends unknown[] | unknown = unknown> implements IEntity<S> {
	private _id: number;
	private _scope: Scope;

	public get id() {
		return this._id;
	}

	public get isAlive() {
		return this.get(EntityData)?.isAlive ?? false;
	}

	/** @internal */
	public set id(value) {
		this._id = value;
	}

	/** @internal */
	constructor(id: number, scope: Scope) {
		this._id = id;
		this._scope = scope;
	}

	set<T extends AllowedComponentTypes>(component: T) {
			this._scope.setComponent(this._id, component);
			return this as unknown as ExtendEntity<S, T>;
		}

	get<T extends AllowedComponentTypes>(componentType: Type<T>) {
		const component = this._scope.getComponent<T>(this._id, componentType);
		return component as EntityComponentType<S, T>;
	}

	getAll() {
		return this._scope.getAll(this._id);
	}

	has<T extends AllowedComponentTypes>(component: Type<T>) {
		return this._scope.getComponent(this._id, component) !== null;
	}

	with<T extends readonly Type[]>(..._types: T) {
		type InferType<T> = T extends Type<infer U>[] ? U : never;
		return this as unknown as Entity<InferType<T>[]>;
	}

	remove(component: AllowedComponentTypes): this;
	remove<T extends Object>(component: Type<T>): this;
	remove<T extends AllowedComponentTypes>(component: Type<T> | symbol) {
		this._scope.removeComponent(this._id, component);
		return this;
	}
}
