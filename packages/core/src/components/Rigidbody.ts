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
	public readonly damping?: number;
	public readonly type?: RigidbodyType;
	public fixedRotation;

	/** @internal */
	_velocity = Vector2.zero;

	public get velocity() {
		return this._velocity;
	}

	constructor(
		settings: {
			/**
			 * Damping is how much resistance the body has to movement.
			 */
			damping?: number;
			/**
			 * The rigidbody type:
			 * - **dynamic**: Dynamic bodies are bodies that are affected by forces and collisions.
			 * - **static**: Static bodies are bodies that are not affected by forces or collisions.
			 * - **kinematic**: Kinematic bodies are bodies that are affected by forces but are not affected by collisions.
			 */
			type?: RigidbodyType;
			/**
			 * Should this body be able to be rotated.
			 */
			fixedRotation?: boolean;
		} = {}
	) {
		this.damping = settings.damping;
		this.type = settings.type ?? "dynamic";
		this.fixedRotation = settings.fixedRotation ?? false;
	}
}
