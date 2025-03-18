import { AllowedComponentTypes } from "./components/ComponentTypes";
import Entity from "./entities/Entity";
import IUpdatingSystem from "./systems/IUpdatingSystem";
import System from "./systems/System";
import ComponentParser from "./utils/ComponentParser";
import "./utils/DevtoolsFormatters";
import EventBus from "./utils/EventBus";
import SparseSet from "./utils/SparseSet";
import { type Type } from "./utils/Types";

type ComponentType<T = unknown> = Type<T> | symbol;

interface GetComponentSetOptions {
	/**
	* Create a new set if it doesn't exist.
	*/
	create?: boolean;
}


export const WORLD_ENTITY = Symbol("World entity");
export const NAME_SYMBOL = Symbol.for("Name");
export const TAG_SYMBOL = Symbol.for("Tags");
export default class Scope {
	private _world;
	/**
	* Current max entity id.
	*/
	private _currentID: number = 0;
	/**
	* Entity ids that currently are not in use.
	*/
	private freeEntities = new Set<number>();
	/**
	*	@internal
	* Contains all sparse sets for each component type.
	*/
	public readonly components = new Map<ComponentType, SparseSet<Object>>();
	/**
	* Contains all systems registered into this scope.
	*/
	private readonly systems = new Set<System>();
	private readonly updatingSystems = new Set<IUpdatingSystem>();

	public updateTiming = 0;

	public readonly eventbus = new EventBus<{
		"entitycreated": (entity: Entity) => void;
		"entitydestroyed": (entity: Entity) => void;
		"componentadded": (entity: Entity<unknown>, component: AllowedComponentTypes) => void;
		"componentremoved": (entity: Entity<unknown>, component: AllowedComponentTypes) => void;
	}>();

	public get world() {
		return this._world;
	}

	constructor({ debug } = {debug: false}) {
		this.components.set(NAME_SYMBOL, new SparseSet<String>());
		this._world = this.entity("world").set(WORLD_ENTITY);

		if(debug) {
			this.eventbus.onAny(console.log)
		}
	}

	/**
	* Creates a new entity with no name.
	* @returns the created entity.
	*/
	public entity(): Entity;
	/**
	* Creates a new entity with a name.
	* @param name the name to assign to this entity.
	* @returns the created entity.
	*/
	public entity(name: string): Entity;
	public entity(name?: string) {
		const entity = new Entity(this._currentID++, this);

		if(name)
			entity.name = name;

		this.eventbus.emit("entitycreated", entity);

		return entity;
	}

	/**
	* Get an entity by its id.
	* @returns the entity if it exists, otherwise null.
	*/
	public getEntityById<T>(id: number): Entity<T> | null {
		if (!this.isAlive(id))
			return null;

		return new Entity<T>(id, this);
	}

	public clearEntity(entityId: number) {
		for(const set of this.components.values()) {
			set.delete(entityId);
		}
	}

	public destroyEntity(entityId: number) {
		this.eventbus.emit("entitydestroyed", this.getEntityById(entityId)!);
		this.clearEntity(entityId);
		this.freeEntities.add(entityId);
	}

	public isAlive(entityId: number) {
		return !this.freeEntities.has(entityId) && entityId < this._currentID;
	}

	public getTagSet(): SparseSet<Set<symbol>> {
		if(!this.components.has(TAG_SYMBOL)) {
			this.components.set(TAG_SYMBOL, new SparseSet<Set<symbol>>());
		}
		return this.components.get(TAG_SYMBOL) as SparseSet<Set<symbol>>;
	}

	public getComponentSet<T extends Object>(type: Type<T> | Function | symbol, options?: GetComponentSetOptions) {
		const baseType = ComponentParser.getBaseComponentType(type);
		if (!this.components.has(baseType) && options?.create) {
			this.components.set(baseType, new SparseSet());
		}

		return this.components.get(baseType)! as SparseSet<T>;
	}

	public *entities<T>() {
		const entity = new Entity<T>(0, this);
		for (let i = 0; i < this._currentID; i++) {
			if (!this.isAlive(i))
				continue;

			entity.id = i;
			yield entity;
		}
	}

	public *ids() {
		for (let i = 0; i < this._currentID; i++) {
			if(this.isAlive(i))
				yield i;
		}
	}

	public addSystem(system: System) {
		this.systems.add(system);
		system.setScope(this);
		system.onEnable?.();

		if(System.hasUpdate(system))
			this.updatingSystems.add(system);

		return this;
	}

	public removeSystem(system: System) {
		if(System.hasUpdate(system))
			this.updatingSystems.delete(system);

		system.onDisable?.();
		system.setScope(null);

		this.systems.delete(system);
	}

	public update() {
		const start = performance.now()
		for(const system of this.updatingSystems) {
			system.update();
		}

		this.updateTiming = performance.now() - start;
	}
}
