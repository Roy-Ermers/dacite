import type { Body } from "p2-es";
import Vector2 from "../utils/Vector2.ts";

export type RigidbodyType =
	| /**
	 * Dynamic bodies are bodies that are affected by forces and collisions.
	 */
	"dynamic"
	/**
	 * Static bodies are bodies that are not affected by forces or collisions.
	 */
	| "static"
	/**
	 * Kinematic bodies are bodies that are affected by forces but are not affected by collisions.
	 */
	| "kinematic";
export default class Rigidbody {
	public damping = 0.95;
	public readonly type: RigidbodyType = "dynamic";
	public readonly mass: number = 1;
	public fixedRotation = false;
	public body?: Body;

	_velocity = Vector2.zero;

	public get velocity() {
		if (!this.body) {
			return Vector2.zero;
		}
		this._velocity.set(this.body.velocity[0], this.body.velocity[1]);

		return this._velocity;
	}

	constructor(
		settings: {
			damping?: number;
			mass?: number;
			/**
			 * The rigidbody type:
			 * - **dynamic**: Dynamic bodies are bodies that are affected by forces and collisions.
			 * - **static**: Static bodies are bodies that are not affected by forces or collisions.
			 * - **kinematic**: Kinematic bodies are bodies that are affected by forces but are not affected by collisions.
			 */
			type?: RigidbodyType;
			fixedRotation?: boolean;
		} = {}
	) {
		this.damping = settings.damping ?? this.damping;
		this.type = settings.type ?? this.type;
		this.mass = settings.mass ?? 1;
		this.fixedRotation = settings.fixedRotation ?? false;
	}
}
