import { describe, expect, test } from "vitest";
import { Query, Scope } from "../src";

describe("Query", () => {
	class Position {
		constructor(
			public x: number,
			public y: number
		) {}
	}

	class Velocity {
		constructor(
			public x: number,
			public y: number
		) {}
	}

	const player = Symbol("Player");
	const scope = new Scope();
	scope.entity("Player 1");
	scope.entity("Player 2").set(new Position(10, 20));
	scope.entity("Player 3").set(new Position(30, 40)).set(new Velocity(5, 5));
	scope.entity("Player 4").setTag(player);
	scope.entity("Player 5").set(new Position(50, 60)).setTag(player);

	test("should not match anything without conditions", () => {
		const query = new Query();

		const result = Array.from(query.execute(scope, { createNew: true }));
		expect(result).toHaveLength(0);
	});

	test("should exclude world entity by default", () => {
		const query = new Query().has(player);

		const first = query.first(scope);
		expect(first?.id).not.toBe(0);
	});

	test("should match all entities with Position", () => {
		const query = new Query().has(Position);

		const result = Array.from(query.execute(scope, { createNew: true }));

		expect(result).toHaveLength(3);

		for (const entity of result) {
			expect(entity.has(Position)).toBe(true);
		}
	});

	test("should match all entities with tag player", () => {
		const query = new Query().has(player);

		const result = Array.from(query.execute(scope, { createNew: true }));

		expect(result).toHaveLength(2);

		for (const entity of result) {
			expect(entity.hasTag(player)).toBe(true);
		}
	});

	test("should match all entities not having Position", () => {
		const query = new Query().not(Position);

		const result = Array.from(query.execute(scope, { createNew: true }));

		expect(result).toHaveLength(2);

		for (const entity of result) {
			expect(entity.name).toBeOneOf(["Player 1", "Player 4"]);
		}
	});

	test("should match all entities when `.not(Component)`", () => {
		const query = new Query().not(Position);

		const result = Array.from(query.execute(scope, { createNew: true }));

		expect(result).toHaveLength(2);

		for (const entity of result) {
			expect(entity.name).toBeOneOf(["Player 1", "Player 4"]);
		}
	});

	test("should match all entities when `.not(Tag)`", () => {
		const query = new Query().not(player);

		const result = Array.from(query.execute(scope, { createNew: true }));

		expect(result).toHaveLength(3);

		for (const entity of result) {
			expect(entity.name).toBeOneOf(["Player 1", "Player 2", "Player 3"]);
			expect(entity.hasTag(player)).toBe(false);
		}
	});

	test("should match all entities with Position and Velocity", () => {
		const query = new Query().has(Position).has(Velocity);

		const result = Array.from(query.execute(scope, { createNew: true }));

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Player 3");
	});

	test("should match all entities with Position and player tag", () => {
		const query = new Query().has(Position).has(player);

		const result = Array.from(query.execute(scope, { createNew: true }));

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe("Player 5");
	});
});
