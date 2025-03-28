import Entity from "../entities/Entity";
import type Query from "../queries/Query";
import type { InferQuerySet } from "../queries/Query";
import System from "./System";

export type Infer<T> = T extends EntitySystem
	? InferQuerySet<T["query"]>
	: never;
export default abstract class EntitySystem extends System {
	abstract query: Query<unknown>;
	private _entities = new Set<number>();

	/**
	 * Called when an entity is added to the system
	 * Be mindful that the entity only exists in this scope, you should copy over the entity id if you want to store it.
	 * @param entity Entity that matches query
	 */
	protected onEntityAdded?(entity: Entity): void;
	/**
	 * Called when an entity is removed from the system
	 * @param entity Entity that is removed from this query
	 */
	protected onEntityRemoved?(entity: Entity): void;
	/**
	 * called every frame for every entity.
	 * Be mindful that the entity only exists in this scope, you should copy over the entity id if you want to store it.
	 * @param entity
	 */
	protected onEntityUpdated?(entity: Entity): void;

	private iteratorEntity?: Entity;

	private eventListeners = new Set<() => void>();

	override onEnable(): Promise<void> | void {
		this._entities.clear();

		this.iteratorEntity ??= new Entity(0, this.scope);

		for (const id of this.query.ids(this.scope)) {
			this._entities.add(id);
			this.iteratorEntity.id = id;
			this.onEntityAdded?.(this.iteratorEntity);
		}

		const removeComponent = this.scope.eventbus.on(
			"componentremoved",
			(entity: Entity) => {
				if (this.query.matches(entity)) return;
				this._entities.delete(entity.id);
				this.onEntityRemoved?.(entity);
			}
		);

		const entityDestroyed = this.scope.eventbus.on(
			"entitydestroyed",
			(entity: Entity) => {
				this._entities.delete(entity.id);
				this.onEntityRemoved?.(entity);
			}
		);

		const entityAdded = this.scope.eventbus.on(
			"entitycreated",
			(entity: Entity) => {
				if (!this.query.matches(entity) || this._entities.has(entity.id))
					return;

				this._entities.add(entity.id);
				this.onEntityAdded?.(entity);
			}
		);

		const componentAdded = this.scope.eventbus.on(
			"componentadded",
			(entity: Entity) => {
				if (!this.query.matches(entity) || this._entities.has(entity.id))
					return;

				this._entities.add(entity.id);
				this.onEntityAdded?.(entity);
			}
		);

		this.eventListeners.add(removeComponent);
		this.eventListeners.add(entityDestroyed);
		this.eventListeners.add(entityAdded);
		this.eventListeners.add(componentAdded);
	}

	override onDisable(): Promise<void> | void {
		if (this.onEntityRemoved) {
			this.iteratorEntity ??= new Entity(0, this.scope);

			for (const id of this._entities) {
				this.iteratorEntity.id = id;
				this.onEntityRemoved?.(this.iteratorEntity);
			}
		}

		for (const remove of this.eventListeners) {
			remove();
		}

		this.eventListeners.clear();
		this._entities.clear();
	}

	override update(): void {
		if (!this.onEntityUpdated) return;

		this.iteratorEntity ??= new Entity(0, this.scope);
		for (const id of this._entities) {
			this.iteratorEntity.id = id;
			this.onEntityUpdated(this.iteratorEntity);
		}
	}
}
