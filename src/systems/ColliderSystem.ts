import Collider from "@/components/Collider";
import BoxCollider from "@/components/colliders/BoxCollider";
import CircleCollider from "@/components/colliders/CircleCollider";
import Rigidbody from "@/components/Rigidbody";
import { Box, Circle } from "p2-es";
import type { Entity } from "tick-knock";
import BaseSystem from "./BaseSystem";

export default class ColliderSystem extends BaseSystem {
    constructor() {
        super(entity => entity.hasAll(Rigidbody, Collider));
    }

    protected onEntityAdded(entity: Entity): void {
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