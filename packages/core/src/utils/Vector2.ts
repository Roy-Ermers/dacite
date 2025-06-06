import lerp from "./Lerp.ts";

const DEGREE_TO_RADIAL = Math.PI / 180;

export default class Vector2 {
	static get zero() {
		return new Vector2(0, 0);
	}
	static get one() {
		return new Vector2(1, 1);
	}

	static get up() {
		return new Vector2(0, -1);
	}
	static get down() {
		return new Vector2(0, 1);
	}

	static get left() {
		return new Vector2(-1, 0);
	}
	static get right() {
		return new Vector2(1, 0);
	}

	static get random() {
		return new Vector2(Math.random(), Math.random());
	}

	get length() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	constructor(
		public x = 0,
		public y = 0
	) {}

	*[Symbol.iterator]() {
		yield this.x;
		yield this.y;
	}

	lerp(target: Vector2, amount: number, dest?: Vector2) {
		dest ??= new Vector2();
		return dest.set(
			lerp(this.x, target.x, amount),
			lerp(this.y, target.y, amount)
		);
	}

	dot(test: Vector2) {
		return this.x * test.x + this.y * test.y;
	}

	distance(goal: Vector2) {
		return Math.sqrt((goal.x - this.x) ** 2 + (goal.y - this.y) ** 2);
	}

	angle(target: Vector2) {
		return Math.atan2(target.y - this.y, target.x - this.x);
	}

	invert() {
		return this.multiply(-1);
	}

	rotate(degrees: number, dest?: Vector2) {
		dest ??= new Vector2();
		const radials = degrees * DEGREE_TO_RADIAL;

		return dest.set(
			this.x * Math.cos(radials) - this.y * Math.sin(radials),
			this.x * Math.sin(radials) + this.y * Math.cos(radials)
		);
	}

	normalize(dest?: Vector2) {
		dest ??= new Vector2();
		if (this.length === 0) return this;
		return this.divide(this.length, this.length, dest);
	}

	limit(limit = 1) {
		return new Vector2(
			Math.min(Math.abs(this.x), limit) * Math.sign(this.x),
			Math.min(Math.abs(this.y), limit) * Math.sign(this.y)
		);
	}

	multiply(x: number): Vector2;
	multiply(x: number, y: number): Vector2;
	multiply(x: number, y: number, destination: Vector2): Vector2;
	multiply(vector: Vector2): Vector2;
	multiply(vector: number | Vector2, y?: number, dest?: Vector2) {
		dest ??= new Vector2();
		if (vector instanceof Vector2)
			return dest.set(this.x * vector.x, this.y * vector.y);

		return dest.set(this.x * vector, this.y * (y ?? vector));
	}

	divide(x: number): Vector2;
	divide(x: number, y: number): Vector2;
	divide(x: number, y: number, destination: Vector2): Vector2;
	divide(vector: Vector2): Vector2;
	divide(vector: number | Vector2, y?: number, dest?: Vector2) {
		dest ??= new Vector2();
		if (vector instanceof Vector2)
			return dest.set(this.x / vector.x, this.y / vector.y);

		return dest.set(this.x / vector, this.y / (y ?? vector));
	}

	add(x: number): Vector2;
	add(x: number, y: number): Vector2;
	add(x: number, y: number, destination: Vector2): Vector2;
	add(vector: Vector2): Vector2;
	add(vector: number | Vector2, y?: number, dest?: Vector2) {
		dest ??= new Vector2();
		if (vector instanceof Vector2)
			return dest.set(this.x + vector.x, this.y + vector.y);

		return dest.set(this.x + vector, this.y + (y ?? vector));
	}

	subtract(x: number): Vector2;
	subtract(x: number, y: number): Vector2;
	subtract(x: number, y: number, destination: Vector2): Vector2;
	subtract(vector: Vector2): Vector2;
	subtract(vector: number | Vector2, y?: number, dest?: Vector2) {
		dest ??= new Vector2();
		if (vector instanceof Vector2)
			return dest.set(this.x - vector.x, this.y - vector.y);

		return dest.set(this.x - vector, this.y - (y ?? vector));
	}

	reflect(normal: Vector2, dest?: Vector2) {
		dest ??= new Vector2();
		const normalDot = 2 * this.dot(normal);
		const subtract = normal.multiply(normalDot, normalDot, dest);

		return this.subtract(subtract.x, subtract.y, dest);
	}

	set(x: number, y: number) {
		this.x = x;
		this.y = y;
		return this;
	}

	static fromAngle(angle: number) {
		const radians = angle * DEGREE_TO_RADIAL;
		return new Vector2(Math.sin(radians), -Math.cos(radians));
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	toString() {
		return `(${Math.round(this.x * 100) / 100}, ${Math.round(this.y * 100) / 100})`;
	}
}
