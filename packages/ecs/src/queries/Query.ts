import type Scope from "../Scope";
import Entity from "../entities/Entity";
import type SparseSet from "../utils/SparseSet";
import type { Append, ClassInstance, Type } from "../utils/Types";

export type InferQuerySet<T> = T extends Query<infer S> ? S : never;

interface IterateOptions {
	/**
	 * When the query doesn't have any conditions, we show a warning message.
	 * Setting this to false will disable it.
	 */
	disableEmptyWarning?: boolean;
}

const TagConditionTypes = ["has-tag", "not-tag"] as const;
const ComponentConditionTypes = ["has-component", "not-component"] as const;
type TagConditionType = (typeof TagConditionTypes)[number];
type ComponentConditionType = (typeof ComponentConditionTypes)[number];

type TagCondition = {
	type: TagConditionType;
	value: symbol;
};

type ComponentCondition = {
	type: ComponentConditionType;
	value: Type<ClassInstance>;
};

type Condition = TagCondition | ComponentCondition;

function isTagCondition(condition: Condition): condition is TagCondition {
	return (TagConditionTypes as readonly string[]).includes(condition.type);
}

export default class Query<S> {
	private conditions: Set<Condition> = new Set();
	private sets = new Map<Condition, SparseSet<unknown>>();

	private includeWorld = false;

	/**
	 * Checks if entity has a component.
	 * @param component Component to check for
	 */
	has<T extends ClassInstance>(component: Type<T> | symbol) {
		if (typeof component === "symbol") {
			this.conditions.add({ type: "has-tag", value: component });
			return this as Query<Append<S, T>>;
		}

		this.conditions.add({ type: "has-component", value: component });
		return this as Query<Append<S, T>>;
	}

	/**
	 * Checks if entity does not have a component.
	 * @param component Component to check for
	 */
	not<T extends ClassInstance>(component: Type<T> | symbol) {
		if (typeof component === "symbol") {
			this.conditions.add({ type: "not-tag", value: component });
			return this as Query<Exclude<S, T>>;
		}

		this.conditions.add({ type: "not-component", value: component });

		return this as Query<Append<S, T>>;
	}

	includeWorldEntity() {
		this.includeWorld = true;
		return this as Query<S>;
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
		for (const condition of this.conditions) {
			if (condition.type === "has-component" && !entity.has(condition.value)) {
				return false;
			}
			if (condition.type === "not-component" && entity.has(condition.value)) {
				return false;
			}
			if (condition.type === "has-tag" && !entity.hasTag(condition.value)) {
				return false;
			}
			if (condition.type === "not-tag" && entity.hasTag(condition.value)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Searches for an entity and returns it.
	 * @param scope The scope to execute this query against
	 * @returns The first entity that matches this query
	 */
	first(scope: Scope) {
		for (const entity of this.execute(scope)) {
			return entity;
		}
		return null;
	}

	private matchesCondition(
		scope: Scope,
		entityId: number,
		condition: Condition
	) {
		switch (condition.type) {
			case "has-component":
				return scope.getComponentSet(condition.value)?.has(entityId);
			case "not-component":
				return !scope.getComponentSet(condition.value)?.has(entityId);
			case "has-tag":
				return scope.getTagSet().get(entityId)?.has(condition.value);
			case "not-tag":
				return !scope.getTagSet().get(entityId)?.has(condition.value);
			default:
				throw new Error(`Unknown condition ${condition}`);
		}
	}

	/**
	 * A iterator that returns all matching entity ids
	 * @param scope The scope to execute this query against
	 * @returns a iterator that returns all matching ids
	 */
	*ids(scope: Scope, options: IterateOptions = {}) {
		if (this.conditions.size === 0) {
			if (!options.disableEmptyWarning)
				console.warn("Query matches all entities.", this);
			return;
		}

		if (this.conditions.size === 1) {
			const [condition] = [...this.conditions.values()];

			if (condition.type === "has-component") {
				yield* this.executeHasFastTrack(scope, condition);
				return;
			}
		}

		entityLoop: for (const entityId of scope.ids()) {
			if (entityId === 0 && !this.includeWorld) continue;
			for (const condition of this.conditions) {
				if (!this.matchesCondition(scope, entityId, condition))
					continue entityLoop;
			}

			yield entityId;
		}
	}

	/**
	 * A iterator that returns all matching entity
	 * @param scope The scope to execute this query against
	 * @param options.createNew If true, a new entity will be created for each iteration
	 * @returns a iterator that returns all matching entities
	 */
	*execute(
		scope: Scope,
		options: { createNew: boolean } = { createNew: false }
	) {
		let entity = new Entity<S>(0, scope);
		for (const id of this.ids(scope)) {
			if (options.createNew) entity = entity.clone();
			entity.id = id;
			yield entity;
		}
	}

	private *executeHasFastTrack(scope: Scope, condition: Condition) {
		if (isTagCondition(condition)) {
			const set = scope.getTagSet();

			for (const id of set.keys()) {
				if (set.get(id)?.has(condition.value)) yield id;
			}

			return;
		}

		const set = scope.getComponentSet(condition.value);
		if (!set) return;
		for (const id of set.keys()) {
			yield id;
		}
	}
}
