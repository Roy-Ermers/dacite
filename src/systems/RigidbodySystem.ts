import Force from "@/components/Force";
import Rigidbody, { type RigidbodyType } from "@/components/Rigidbody";
import Transform from "@/components/Transform";
import { Body, World } from "p2-es";
import { Entity } from "tick-knock";
import BaseSystem from "./BaseSystem";

const TYPE_MAP: Record<RigidbodyType, 1 | 2 | 4> = {
    "dynamic": Body.DYNAMIC,
    "static": Body.STATIC,
    "kinematic": Body.KINEMATIC
} as const
export default class RigidbodySystem extends BaseSystem {
    physicsWorld: World;
    fixedTimeStep: number = 1 / 60;

    constructor() {
        super((entity) => entity.hasComponent(Rigidbody));

        this.physicsWorld = new World({
            gravity: [0, 0]
        });
        this.physicsWorld.on("postStep", () => {
            this.postUpdate();
        })
    }

    update(dt: number): void {
        this.physicsWorld.step(this.fixedTimeStep, dt, 10);
        super.update(dt);
    }

    postUpdate() {
        for (const entity of this.query.entities) {
            const forces = entity.getAll(Force);
            const rigidbody = entity.get(Rigidbody);
            const transform = entity.get(Transform);
            if (!rigidbody?.body || !transform) {
                console.log("no rigidbody or transform", rigidbody, transform);
                continue;
            }

            for (const force of forces) {
                rigidbody.body.applyForce([force.direction.x, force.direction.y]);
                entity.pick(force);
            }


            transform.position.x = rigidbody.body.interpolatedPosition[0];
            transform.position.y = rigidbody.body.interpolatedPosition[1];
            transform.rotation = rigidbody.body.interpolatedAngle;
        }
    }

    protected onUpdate(entity: Entity, dt: number): void | boolean {

    }

    protected onEntityAdded(entity: Entity): void {
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
            type: TYPE_MAP[rigidbody.type]
        });

        this.physicsWorld.addBody(body);
        rigidbody.body = body;
    }

    protected onEntityRemoved(entity: Entity): void {
        const rigidbody = entity.get(Rigidbody);
        if (rigidbody?.body)
            this.physicsWorld.removeBody(rigidbody.body);
    }
}