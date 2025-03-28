import { type Entity, EntitySystem, Query } from "@dacite/ecs";
import { Body, Box, Circle, World } from "p2-es";
import { BoxCollider, CircleCollider, Collider } from "../components";
import { ForceComponentSet } from "../components/Force.ts";
import Rigidbody, { type RigidbodyType } from "../components/Rigidbody.ts";
import Transform from "../components/Transform.ts";
import type Vector2 from "../utils/Vector2";

const TYPE_MAP: Record<RigidbodyType, 1 | 2 | 4> = {
	dynamic: Body.DYNAMIC,
	static: Body.STATIC,
	kinematic: Body.KINEMATIC
} as const;

interface PhysicsSystemOptions {
	gravity?: Vector2;
}

export default class PhysicsSystem extends EntitySystem {
	get query() {
		return new Query().has(Rigidbody).has(Collider);
	}
	physicsWorld: World;
	fixedTimeStep: number = 1 / 60;
	bodyLookup = new WeakMap<Rigidbody, Body>();

	constructor(options: PhysicsSystemOptions = {}) {
		super();
		this.physicsWorld = new World({
			gravity: options.gravity ? [...options.gravity] : [0, 0]
		});
	}

	override update(): void {
		this.physicsWorld.step(this.fixedTimeStep, 0.1, 10);
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

		transform.position.x = rigidbody.body.interpolatedPosition[0];
		transform.position.y = rigidbody.body.interpolatedPosition[1];
		transform.rotation = rigidbody.body.interpolatedAngle;
	}

	private addColliders(entity: Entity, body: Body) {
		const collider = entity.get(Collider);
		console.log(collider);

		if (collider instanceof BoxCollider) {
			const boxShape = new Box({
				width: collider.width,
				height: collider.height
			});

			body.addShape(boxShape);
		} else if (collider instanceof CircleCollider) {
			const circleShape = new Circle({
				radius: collider.radius
			});

			body.addShape(circleShape);
		}
	}

	protected override onEntityAdded(entity: Entity): void {
		const rigidbody = entity.get(Rigidbody);
		const transform = entity.get(Transform);

		if (!transform || !rigidbody) return;

		const body = new Body({
			position: [transform.position.x, transform.position.y],
			velocity: [rigidbody.velocity.x, rigidbody.velocity.y],
			mass: rigidbody.mass,
			fixedRotation: rigidbody.fixedRotation,
			damping: rigidbody.damping,
			angularDamping: 1,
			type: TYPE_MAP[rigidbody.type]
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
