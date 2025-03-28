import type Scope from "../Scope";
import Entity from "../entities/Entity";
import type SparseSet from "../utils/SparseSet";
import type { Append, ClassInstance, Type } from "../utils/Types";

export type InferQuerySet<T> = T extends Query<infer S> ? S : never;

type Condition = "has" | "hasNot";

export default class Query<S> {
	private conditions: Map<Type | symbol, Condition> = new Map();

	/**
	 * Checks if entity has a component.
	 * @param component Component to check for
	 */
	has<T extends ClassInstance>(component: Type<T> | symbol) {
		this.conditions.set(component, "has");

		return this as Query<Append<S, T>>;
	}

	/**
	 * Checks if entity does not have a component.
	 * @param component Component to check for
	 */
	hasNot<T extends ClassInstance>(component: Type<T> | symbol) {
		this.conditions.set(component, "hasNot");

		return this as Query<Append<S, T>>;
	}
	/**
	 * Remove a component from the query.
	 * @param component Component to remove
	 */
	clear() {
		this.conditions.clear();
		return this as Query<unknown>;
	}

	/**
	 * Check if entity matches this query.
	 * @param entity Entity to check
	 * @returns true or false
	 */
	matches(entity: Entity): boolean {
		for (const [component, condition] of this.conditions) {
			if (!entity.has(component) && condition === "has") return false;
			if (entity.has(component) && condition === "hasNot") return false;
		}
		return true;
	}

	/**
	 * A iterator that returns all matching entity ids
	 * @param scope The scope to execute this query against
	 * @returns a iterator that returns all matching ids
	 */
	*ids(scope: Scope) {
		if (this.conditions.size === 0) {
			console.warn("Query matches all entities.");
			yield* scope.ids();
			return;
		}

		if (this.conditions.size === 1) {
			const [[component, condition]] = [...this.conditions.entries()];

			if (condition === "has")
				yield* this.executeHasFastTrack(scope, component);
			return;
		}

		const sets = new Map<SparseSet<unknown>, Condition>();

		for (const [component, condition] of this.conditions) {
			const set = scope.getComponentSet(component);

			// component is not in use yet.
			if (!set && condition === "has") return;

			sets.set(set, condition);
		}

		if (sets.size === 0) return;

		entityLoop: for (const entityId of scope.ids()) {
			for (const [set, condition] of sets) {
				if (!set.has(entityId) && condition === "has") continue entityLoop;

				if (set.has(entityId) && condition === "hasNot") continue entityLoop;
			}

			yield entityId;
		}
	}

	/**
	 * A iterator that returns all matching entity
	 * @param scope The scope to execute this query against
	 * @returns a iterator that returns all matching entities
	 */
	*execute(scope: Scope) {
		const entity = new Entity<S>(0, scope);
		for (const id of this.ids(scope)) {
			entity.id = id;
			yield entity;
		}
	}

	private *executeHasFastTrack(scope: Scope, component: Type | symbol) {
		const set = scope.getComponentSet(component);
		if (!set) return;
		for (const id of set.keys()) {
			yield id;
		}
	}
}
