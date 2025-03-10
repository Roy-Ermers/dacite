import { AllowedComponentTypes } from "./Components/ComponentTypes";
import Entity from "./Entities/Entity";
import EntityData from "./Entities/EntityData";
import IEntity from "./Entities/IEntity";
import ComponentParser from "./Utils/ComponentParser";
import "./Utils/ComponentSetFormatter";
import SparseSet from "./Utils/SparseSet";
import { type Type } from "./Utils/Types";

type ComponentType<T = unknown> = Type<T> | symbol;
export const WORLD_ENTITY = Symbol("World entity");
export default class Scope {
	private _world;
	private _currentID: number = 0;
	private components = new Map<ComponentType, SparseSet<Object>>();

	public get world() {
		return this._world;
	}

	constructor() {
		this._world = this.entity().set(WORLD_ENTITY);
	}

	public entity<T>() {
		return new Entity<T>(this._currentID++, this).set(new EntityData);
	}

	public getEntityById(id: number) {
		return new Entity(id, this);
	}

	public setComponent<T extends AllowedComponentTypes>(entityId: number, component: T) {
		const type = ComponentParser.getBaseComponentType(component.constructor);

		if (!this.components.has(type)) {
			this.components.set(type, new SparseSet());
		}

		const set = this.components.get(type)!;
		set.set(entityId, component);
	}

	_assertSparseSet<T extends AllowedComponentTypes>(set?: SparseSet<any>): set is SparseSet<T> {
		return !!set && set instanceof SparseSet;
	}

	public removeComponent(entityId: number, component: ComponentType) {
		if (!this.components.has(component)) {
			return;
		}

		const set = this.components.get(component)!;
		set.delete(entityId);
	}

	public getComponent<T extends AllowedComponentTypes>(entityId: number, component: Type<T>): T | null {
		const set = this.components.get(ComponentParser.getBaseComponentType(component));
		if (!this._assertSparseSet<T>(set)) {
			return null;
		}

		return set.get(entityId);
	}

	public getAll(entityId: number) {
		const components: Object[] = [];
		for(const [, set] of this.components.entries()) {
			if(set.has(entityId)) {
				components.push(set.get(entityId)!);
			}
		}

		return components;
	}

	public hasComponent<T>(entityId: number, component: ComponentType<T>) {
		if (!this.components.has(component)) {
			return false;
		}

		const set = this.components.get(component)!;
		return set.has(entityId);
	}
}
