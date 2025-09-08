import { describe, expect, test, vi } from "vitest";
import { Entity, Scope, System } from "../src";
import { WORLD_ENTITY } from "../src/Scope";

describe("Scope", () => {
	class Position {
		constructor(
			public x = 0,
			public y = 0
		) {}
	}

	test("should create a new entity", () => {
		const scope = new Scope();
		const entity = scope.entity("Player");

		expect(entity).toBeInstanceOf(Entity);
		expect(entity.name).toBe("Player");
	});

	test("should have a world entity", () => {
		const scope = new Scope();
		const worldEntity = scope.world;

		expect(worldEntity).toBeInstanceOf(Entity);
		expect(worldEntity.name).toBe("world");
		expect(worldEntity.id).toBe(0);
		expect(worldEntity.hasTag(WORLD_ENTITY));
	});

	test("should recycle a dead entity", () => {
		const scope = new Scope();
		const entity = scope.entity("Player");
		const id = entity.id;
		entity.destroy();

		const recycledEntity = scope.entity("Player");
		expect(recycledEntity.id).toBe(id);
		expect(recycledEntity.isAlive).toBe(true);
	});

	test("should emit entitycreated events", () => {
		const scope = new Scope();
		const events: Record<string, unknown[]> = {};

		scope.eventbus.on("*", (event, ...args) => {
			events[event] = args;
		});

		const entity = scope.entity("Player");
		expect(events).toHaveProperty("entitycreated", [entity]);
	});

	test("should emit componentadded events", () => {
		const scope = new Scope();
		const events: Record<string, unknown[]> = {};

		scope.eventbus.on("*", (event, ...args) => {
			events[event] = args;
		});

		const position = new Position();
		const entity = scope.entity("Player").set(position);
		expect(events).toHaveProperty("componentadded", [entity, position]);
	});

	test("should emit entitydestroyed events", () => {
		const scope = new Scope();
		const events: Record<string, unknown[]> = {};

		scope.eventbus.on("*", (event, ...args) => {
			events[event] = args;
		});

		const entity = scope.entity("Player");
		entity.destroy();
		expect(events).toHaveProperty("entitydestroyed", [entity]);
	});

	test("should emit componentadded events", () => {
		const scope = new Scope();
		const events: Record<string, unknown[]> = {};

		scope.eventbus.on("*", (event, ...args) => {
			events[event] = args;
		});

		const position = new Position();
		const entity = scope.entity("Player").set(position);
		entity.remove(Position);
		expect(events).toHaveProperty("componentremoved", [entity, Position]);
	});

	test("should add systems", () => {
		const scope = new Scope();
		class TestSystem extends System {}

		const system = new TestSystem();
		scope.addSystem(system);
		expect(scope.getSystem(TestSystem)).toBeInstanceOf(TestSystem);
	});

	test("should remove systems", () => {
		const scope = new Scope();
		class TestSystem extends System {}

		const system = new TestSystem();
		scope.addSystem(system);
		expect(scope.getSystem(TestSystem)).toBeInstanceOf(TestSystem);

		scope.removeSystem(system);

		expect(scope.getSystem(TestSystem)).toBeNull();
	});

	test("should update systems", () => {
		const scope = new Scope();
		class TestSystem extends System {
			override update = vi.fn();
		}

		const system = new TestSystem();
		scope.addSystem(system);
		expect(scope.getSystem(TestSystem)).toBeInstanceOf(TestSystem);

		scope.update();

		expect(system.update).toHaveBeenCalled();
	});

	test("should iterate over current ids", () => {
		const scope = new Scope();
		const entity1 = scope.entity("Player");
		const entity2 = scope.entity("Enemy");

		const ids = Array.from(scope.ids());
		expect(ids).toContain(entity1.id);
		expect(ids).toContain(entity2.id);
		expect(ids.length).toBe(3);

		entity1.destroy();
		const idsAfterDestroy = Array.from(scope.ids());
		expect(idsAfterDestroy).not.toContain(entity1.id);
		expect(idsAfterDestroy).toContain(entity2.id);
		expect(idsAfterDestroy.length).toBe(2);
	});

	test("should iterate over all entities", () => {
		const scope = new Scope();
		const entity1 = scope.entity("Player");
		scope.entity("Enemy");

		for (const entity of scope.entities()) {
			expect(entity).toBeInstanceOf(Entity);
			expect(entity.name).toBeOneOf(["world", "Player", "Enemy"]);
		}

		entity1.destroy();
		for (const entity of scope.entities()) {
			expect(entity).toBeInstanceOf(Entity);
			expect(entity.name).not.toBe("Player");
			expect(entity.name).toBeOneOf(["world", "Enemy"]);
		}
	});
});
