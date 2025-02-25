import BoxCollider from "@scout/engine/components/colliders/BoxCollider.ts";
import CircleCollider from "@scout/engine/components/colliders/CircleCollider.ts";
import Collider from "@scout/engine/components/colliders/Collider.ts";
import Rigidbody from "@scout/engine/components/Rigidbody.ts";
import { Box, Circle } from "p2-es";
import type { Entity } from "tick-knock";
import BaseSystem from "./BaseSystem";

export default class ColliderSystem extends BaseSystem {
    constructor() {
        super(entity => entity.hasAll(Rigidbody, Collider));
    }


    protected override onEntityAdded(entity: Entity): void {
        const collider = entity.get(Collider)!;
        const rigidbody = entity.get(Rigidbody)!;

        if (collider instanceof BoxCollider) {
            const boxShape = new Box({
                width: collider.width,
                height: collider.height,

            });
            rigidbody.body?.addShape(boxShape);

        } else if (collider instanceof CircleCollider) {
            const circleShape = new Circle({
                radius: collider.radius,
            });

            rigidbody.body?.addShape(circleShape);
        }
    }
}