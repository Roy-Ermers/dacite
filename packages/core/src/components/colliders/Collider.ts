export default class Collider {
	protected _isSensor = false;
	/**
	 * Does this collider resolve collisions or not?
	 */
	public get isSensor() {
		return this._isSensor;
	}

	/**
	 * The friction coefficient of the collider.
	 */
	friction = 0.5;

	/**
	 * How bouncy is this collider
	 *
	 */
	restitution = 0;

	/**
	 * How dense is this collider, described in kg/m2
	 */
	density = 1;

	withFriction(value: number) {
		if (value < 0 || value > 1)
			throw new RangeError("Frition should be between 0 - 1");
		this.friction = value;

		return this;
	}

	withRestitution(value: number) {
		if (value < 0 || value > 1)
			throw new RangeError("Restitution should be between 0 - 1");
		this.restitution = value;

		return this;
	}

	withDensity(value: number) {
		if (value < 0)
			throw new RangeError("Density should be higher or equal than zero");
		this.density = value;
		return this;
	}

	public static Sensor<
		T extends Collider,
		K extends new (
			// biome-ignore lint: Expected any.
			...args: any[]
		) => InstanceType<K>
	>(
		this: K,
		...args: K extends new (...args: infer U) => T ? U : never
	): InstanceType<K> {
		// biome-ignore lint: this refers to a subtype instead of this.
		const collider = new this(...args) as Collider;
		collider._isSensor = true;

		return collider as InstanceType<K>;
	}
}
