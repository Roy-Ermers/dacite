import Force from "@scout/engine/components/Force.ts";
import Rigidbody, { type RigidbodyType } from "@scout/engine/components/Rigidbody.ts";
import Transform from "@scout/engine/components/Transform.ts";
import { Body, Box, Circle, World } from "p2-es";
import { Entity } from "tick-knock";
import BaseSystem from "./BaseSystem";
import Vector2 from "../utils/Vector2";
import { BoxCollider, CircleCollider, Collider } from "../components";

const TYPE_MAP: Record<RigidbodyType, 1 | 2 | 4> = {
    "dynamic": Body.DYNAMIC,
    "static": Body.STATIC,
    "kinematic": Body.KINEMATIC
} as const

interface PhysicsSystemOptions {
	gravity?: Vector2;
}

export default class PhysicsSystem extends BaseSystem {
    physicsWorld: World;
    fixedTimeStep: number = 1 / 60;
    bodyLookup = new WeakMap<Body, Entity>();

    constructor(options: PhysicsSystemOptions = {}) {
        super((entity) => entity.hasComponent(Rigidbody));

        this.physicsWorld = new World({
            gravity: options.gravity ? [...options.gravity] : [0,0]
        });
    }

    override update(dt: number): void {
        this.physicsWorld.step(this.fixedTimeStep, dt, 10);
        super.update(dt);
    }

    protected override onUpdate(entity: Entity): void | boolean {
        const rigidbody = entity.get(Rigidbody);
        const transform = entity.get(Transform);
        if (!rigidbody?.body || !transform) {
            console.log("no rigidbody or transform", rigidbody, transform);
            return;
        }

        entity.iterate(Force, (force) => {
            if (force.type === 'force')
                rigidbody.body!.applyForce([...force.direction]);
            if (force.type === 'impulse')
                rigidbody.body!.applyImpulse([...force.direction]);

            entity.pick(force);
        });



        transform.position.x = rigidbody.body.interpolatedPosition[0];
        transform.position.y = rigidbody.body.interpolatedPosition[1];
        transform.rotation = rigidbody.body.interpolatedAngle;
    }

		private addColliders(entity: Entity, body:Body) {
			const collider = entity.get(Collider);

			if (collider instanceof BoxCollider) {
				const boxShape = new Box({
					width: collider.width,
					height: collider.height,
				});

				body.addShape(boxShape);
			} else if (collider instanceof CircleCollider) {
				const circleShape = new Circle({
					radius: collider.radius,
				});

				body.addShape(circleShape);
			}
		}

    protected override onEntityAdded(entity: Entity): void {
        const rigidbody = entity.get(Rigidbody);
        const transform = entity.get(Transform);

        if (!transform || !rigidbody)
            return;

        const body = new Body({
            position: [transform.position.x, transform.position.y],
            velocity: [rigidbody.velocity.x, rigidbody.velocity.y],
            mass: rigidbody.mass,
            fixedRotation: rigidbody.fixedRotation,
            damping: rigidbody.damping,
            angularDamping: rigidbody.damping,
            type: TYPE_MAP[rigidbody.type],
        });

				this.addColliders(entity, body);

        this.physicsWorld.addBody(body);
        this.bodyLookup.set(body, entity);

        rigidbody.body = body;
    }

    protected override onEntityRemoved(entity: Entity): void {
        const rigidbody = entity.get(Rigidbody);
        if (!rigidbody?.body)
            return;

        this.bodyLookup.delete(rigidbody?.body);
        this.physicsWorld.removeBody(rigidbody.body);
    }
}
