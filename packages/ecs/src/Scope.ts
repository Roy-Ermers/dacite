import Entity from "./entities/Entity";
import type IUpdatingSystem from "./systems/IUpdatingSystem";
import System from "./systems/System";
import ComponentParser from "./utils/ComponentParser";
import "./utils/DevtoolsFormatters";
import EventBus from "./utils/EventBus";
import SparseSet from "./utils/SparseSet";
import type { ClassInstance, Type } from "./utils/Types";

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
	private _currentID = 0;
	/**
	 * Entity ids that currently are not in use.
	 */
	private freeEntities = new Set<number>();
	/**
	 *	@internal
	 * Contains all sparse sets for each component type.
	 */
	public readonly components = new Map<ComponentType, SparseSet<unknown>>();
	/**
	 * Contains all systems registered into this scope.
	 */
	private readonly systems = new Set<System>();
	private readonly updatingSystems = new Set<IUpdatingSystem>();

	public updateTiming = 0;

	public readonly eventbus = new EventBus<{
		entitycreated: (entity: Entity) => void;
		entitydestroyed: (entity: Entity) => void;
		componentadded: (entity: Entity<unknown>, component: ClassInstance) => void;
		componentremoved: (
			entity: Entity<unknown>,
			component: ClassInstance
		) => void;
	}>();

	public get world() {
		return this._world;
	}

	constructor({ debug } = { debug: false }) {
		this.components.set(NAME_SYMBOL, new SparseSet<string>());
		this._world = this.entity("world").set(WORLD_ENTITY);

		if (debug) {
			this.eventbus.on("*", console.log);
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

		if (name) entity.name = name;

		this.eventbus.emit("entitycreated", entity);

		return entity;
	}

	/**
	 * Get an entity by its id.
	 * @returns the entity if it exists, otherwise null.
	 */
	public getEntityById<T>(id: number): Entity<T> | null {
		if (!this.isAlive(id)) return null;

		return new Entity<T>(id, this);
	}

	/**
	 * Remove all components from an entity
	 * @param entityId entity to remove all components from
	 */
	public clearEntity(entityId: number) {
		for (const set of this.components.values()) {
			set.delete(entityId);
		}
	}

	/**
	 * Destroy an entity
	 * @param entityId entity to destroy
	 */
	public destroyEntity(entityId: number) {
		const entity = this.getEntityById(entityId);

		if (!entity) {
			return;
		}

		this.eventbus.emit("entitydestroyed", entity);
		this.clearEntity(entityId);
		this.freeEntities.add(entityId);
	}

	/**
	 * Check if a entity is alive
	 * @param entityId entity to check
	 */
	public isAlive(entityId: number) {
		return !this.freeEntities.has(entityId) && entityId < this._currentID;
	}

	/**
	 * Get the tag set
	 */
	public getTagSet(): SparseSet<Set<symbol>> {
		if (!this.components.has(TAG_SYMBOL)) {
			this.components.set(TAG_SYMBOL, new SparseSet<Set<symbol>>());
		}
		return this.components.get(TAG_SYMBOL) as SparseSet<Set<symbol>>;
	}

	/**
	 * Get a component set
	 * @param type Component type to get
	 * @param options
	 */
	public getComponentSet<T extends ClassInstance>(
		type: Type<T> | symbol,
		options?: GetComponentSetOptions
	): SparseSet<T>;
	public getComponentSet(
		type: symbol,
		options?: GetComponentSetOptions
	): SparseSet<symbol>;
	public getComponentSet<T extends ClassInstance>(
		type: Type<T>,
		options?: GetComponentSetOptions
	): SparseSet<T>;
	public getComponentSet<T extends ClassInstance>(
		type: Type<T> | symbol,
		options?: GetComponentSetOptions
	) {
		const baseType = ComponentParser.getBaseComponentType(type);
		if (!this.components.has(baseType) && options?.create) {
			this.components.set(baseType, new SparseSet());
		}

		return this.components.get(baseType) as SparseSet<T>;
	}

	/**
	 * Iterate over all entities
	 */
	public *entities<T>() {
		const entity = new Entity<T>(0, this);
		for (let i = 0; i < this._currentID; i++) {
			if (!this.isAlive(i)) continue;

			entity.id = i;
			yield entity;
		}
	}

	/**
	 * Iterate over all entity ids
	 */
	public *ids() {
		for (let i = 0; i < this._currentID; i++) {
			if (this.isAlive(i)) yield i;
		}
	}

	/**
	 * Adds a system to this scope, after this it will be enabled and updated each frame.
	 * @param system the system to add
	 * @returns current scope
	 */
	public addSystem(system: System) {
		system.setScope(this);
		this.systems.add(system);
		const onEnable = system.onEnable?.();

		if (!System.hasUpdate(system)) {
			return this;
		}

		if (onEnable instanceof Promise) {
			onEnable.then(() => {
				this.updatingSystems.add(system);
			});
			return this;
		}

		this.updatingSystems.add(system);
		return this;
	}

	/**
	 * Removes a system from this scope, after this it will no longer be updated.
	 * @param system the system to remove
	 */
	public removeSystem(system: System) {
		if (System.hasUpdate(system)) this.updatingSystems.delete(system);

		system.onDisable?.();
		system.setScope(null);

		this.systems.delete(system);
	}

	/**
	 * Updates all systems in this scope.
	 */
	public update() {
		const start = performance.now();
		for (const system of this.updatingSystems) {
			system.update();
		}

		this.updateTiming = performance.now() - start;
	}
}
