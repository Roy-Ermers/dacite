import type Scope from "../Scope";
import Entity from "../entities/Entity";
import type SparseSet from "../utils/SparseSet";
import type { Append, ClassInstance, Type } from "../utils/Types";

export type InferQuerySet<T> = T extends Query<infer S> ? S : never;
export default class Query<S> {
	private components: Set<Type | symbol> = new Set();

	/**
	 * Add a component to the query.
	 * @param component Component to check for
	 */
	has<T extends ClassInstance>(component: Type<T> | symbol) {
		this.components.add(component);
		return this as Query<Append<S, T>>;
	}

	/**
	 * Check if entity matches this query.
	 * @param entity Entity to check
	 * @returns true or false
	 */
	matches(entity: Entity): boolean {
		for (const component of this.components) {
			if (!entity.has(component)) return false;
		}
		return true;
	}

	/**
	 * A iterator that returns all matching entity ids
	 * @param scope The scope to execute this query against
	 * @returns a iterator that returns all matching ids
	 */
	*ids(scope: Scope) {
		if (this.components.size === 0) {
			console.warn("Query matches all entities.");
			yield* scope.ids();
			return;
		}

		if (this.components.size === 1) {
			yield* this.executeFastTrack(scope, [...this.components][0]);
			return;
		}

		const sets = new Set<SparseSet<unknown>>();

		for (const component of this.components) {
			const set = scope.getComponentSet(component);

			// component is not in use yet.
			if (!set) continue;

			sets.add(set);
		}

		if (sets.size === 0) return;

		entityLoop: for (const entityId of scope.ids()) {
			for (const set of sets) {
				if (!set.has(entityId)) continue entityLoop;
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

	private *executeFastTrack(scope: Scope, component: Type | symbol) {
		const set = scope.getComponentSet(component);
		if (!set) return;
		for (const id of set.keys()) {
			yield id;
		}
	}
}
