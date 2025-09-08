import { describe, expect, test } from "vitest";
import { Scope } from "../src/";

describe("entity", () => {
	class Position {
		constructor(
			public x: number,
			public y: number
		) {}
	}

	test("should contain an id", () => {
		const scope = new Scope();
		const entity = scope.entity();

		expect(entity.id).toBe(1);
	});

	test("should attach a name", () => {
		const scope = new Scope();
		const entity = scope.entity("Hello world");

		expect(entity.name).toBe("Hello world");
	});

	test("should add components", () => {
		const scope = new Scope();
		const entity = scope.entity().set(new Position(10, 20));

		const position = entity.get(Position);
		expect(position).toBeInstanceOf(Position);
		expect(position.x).toBe(10);
		expect(position.y).toBe(20);
	});

	test("should check if an entity has a component", () => {
		const scope = new Scope();
		const entity = scope.entity().set(new Position(10, 20));
		expect(entity.has(Position)).toBe(true);
		expect(entity.has(String)).toBe(false);
	});

	test("should remove components", () => {
		const scope = new Scope();
		const entity = scope.entity().set(new Position(10, 20));

		entity.remove(Position);

		expect(entity.has(Position)).toBe(false);
		expect(entity.get(Position)).toBeNull();
	});

	test("should destroy an entity", () => {
		const scope = new Scope();
		const entity = scope.entity().set(new Position(10, 20));

		expect(entity.isAlive).toBe(true);
		entity.destroy();
		expect(entity.isAlive).toBe(false);
		expect(entity.get(Position)).toBeNull();
	});

	test("should store tag", () => {
		const scope = new Scope();
		const entity = scope.entity().set(Symbol.for("tag"));

		expect(entity.hasTag(Symbol.for("tag"))).toBe(true);
		expect(entity.hasTag(Symbol.for("other"))).toBe(false);
	});

	test("should toggle tag", () => {
		const scope = new Scope();
		const entity = scope.entity().set(Symbol.for("tag"));

		expect(entity.toggleTag(Symbol.for("tag"))).toBe(false);
		expect(entity.hasTag(Symbol.for("tag"))).toBe(false);
		expect(entity.toggleTag(Symbol.for("other"))).toBe(true);
		expect(entity.hasTag(Symbol.for("other"))).toBe(true);
	});

	test("should remove tag", () => {
		const scope = new Scope();
		const entity = scope.entity().set(Symbol.for("tag"));

		expect(entity.hasTag(Symbol.for("tag"))).toBe(true);
		entity.removeTag(Symbol.for("tag"));
		expect(entity.hasTag(Symbol.for("tag"))).toBe(false);
	});
});
