import { type Entity, EntitySystem, Query } from "@dacite/ecs";
import { Body, type BodyOptions, Box, Circle, Plane, World } from "p2-es";
import { BoxCollider, CircleCollider, Collider } from "../components";
import { ForceComponentSet } from "../components/Force.ts";
import Rigidbody, { type RigidbodyType } from "../components/Rigidbody.ts";
import Transform from "../components/Transform.ts";
import PlaneCollider from "../components/colliders/PlaneCollider.ts";
import Engine from "../index.ts";
import type Vector2 from "../utils/Vector2";

const TYPE_MAP: Record<RigidbodyType, 1 | 2 | 4> = {
	dynamic: Body.DYNAMIC,
	static: Body.STATIC,
	kinematic: Body.KINEMATIC
} as const;

interface PhysicsSystemOptions {
	gravity?: Vector2;
	/**
	 * Defines how much pixels are a meter
	 * @default 16
	 */
	scale?: number;
	defaults?: {
		/**
		 * The default damping value for rigidbodies.
		 * This value controls how much velocity is lost over time due to friction and other forces.
		 * @default 0.1
		 */
		damping?: number;
		/**
		 * The default angular damping value for rigidbodies.
		 * This value controls how much angular velocity is lost over time due to friction and other forces.
		 * @default 0.1
		 */
		angularDamping?: number;
		/**
		 * The default mass of a rigidbody, this unit is in kilograms
		 * @default 0
		 */
		mass?: number;
	};
}

export default class PhysicsSystem extends EntitySystem {
	get query() {
		return new Query().has(Rigidbody).has(Collider);
	}

	physicsWorld: World;
	fixedTimeStep: number = 1 / 60;
	scale: number;
	bodyLookup = new WeakMap<Rigidbody, Body>();

	defaultRigidbodyOptions: BodyOptions;

	constructor(options: PhysicsSystemOptions = {}) {
		super();
		this.physicsWorld = new World({
			gravity: options.gravity ? [...options.gravity] : [0, 0],
			islandSplit: true
		});

		this.scale = options.scale ?? 16;

		this.defaultRigidbodyOptions = {
			type: TYPE_MAP.dynamic,
			damping: options.defaults?.damping ?? 0.1,
			angularDamping: options.defaults?.angularDamping ?? 0.1,
			mass: options.defaults?.mass ?? 0
		};
	}

	override update(): void {
		this.physicsWorld.step(
			this.fixedTimeStep,
			Engine.instance.time.deltaTime,
			10
		);
		super.update();
	}

	protected override onEntityUpdated(entity: Entity) {
		const rigidbody = entity.get(Rigidbody);
		const transform = entity.get(Transform);
		if (!rigidbody?.body || !transform) {
			console.log("no rigidbody or transform", rigidbody, transform);
			return;
		}

		const forces = entity.get(ForceComponentSet);

		if (forces) {
			for (const force of forces) {
				if (force.type === "force")
					rigidbody.body.applyForce([...force.direction]);
				if (force.type === "impulse")
					rigidbody.body.applyImpulse([...force.direction]);

				forces?.delete(force);
			}
		}

		transform.position.x = rigidbody.body.interpolatedPosition[0] * this.scale;
		transform.position.y = -rigidbody.body.interpolatedPosition[1] * this.scale;
		transform.rotation = rigidbody.body.interpolatedAngle;
	}

	private addColliders(entity: Entity, body: Body) {
		const collider = entity.get(Collider);

		if (collider instanceof BoxCollider) {
			const boxShape = new Box({
				width: collider.width / this.scale,
				height: collider.height / this.scale
			});

			body.addShape(boxShape);
		} else if (collider instanceof CircleCollider) {
			const circleShape = new Circle({
				radius: collider.radius / this.scale
			});

			body.addShape(circleShape);
		} else if (collider instanceof PlaneCollider) {
			const plane = new Plane();

			body.addShape(plane);
		}
	}

	protected override onEntityAdded(entity: Entity): void {
		const rigidbody = entity.get(Rigidbody);
		const transform = entity.get(Transform);

		if (!transform || !rigidbody) return;

		let type = this.defaultRigidbodyOptions.type;

		if (rigidbody.type) {
			type = TYPE_MAP[rigidbody.type];
		}

		const body = new Body({
			position: [
				transform.position.x / this.scale,
				transform.position.y / this.scale
			],
			...this.defaultRigidbodyOptions,
			damping: rigidbody.damping ?? this.defaultRigidbodyOptions.damping,
			mass: rigidbody.mass ?? this.defaultRigidbodyOptions.mass,
			fixedRotation:
				rigidbody.fixedRotation ?? this.defaultRigidbodyOptions.fixedRotation,
			type
		});

		this.addColliders(entity, body);

		this.physicsWorld.addBody(body);
		this.bodyLookup.set(rigidbody, body);

		rigidbody.body = body;
	}

	protected override onEntityRemoved(entity: Entity): void {
		const rigidbody = entity.get(Rigidbody);
		if (!rigidbody?.body) return;

		this.bodyLookup.delete(rigidbody);
		this.physicsWorld.removeBody(rigidbody.body);
	}
}
