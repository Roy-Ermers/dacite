import Engine from "@/Engine";
import Transform from "@/components/Transform";
import BoxCollider from "@/components/colliders/BoxCollider";
import CircleCollider from "@/components/colliders/CircleCollider";
import Collider from "@/components/colliders/Collider";
import { Container, Graphics } from "pixi.js";
import { Entity } from "tick-knock";
import BaseSystem from "./BaseSystem";

export default class CollisionDebuggerSystem extends BaseSystem {
    _entities: Entity[] = [];
    selectedEntity: Entity | null = null;

    graphics: Container;
    colliderDrawer = new WeakMap<Collider, Graphics>();

    constructor() {
        super(entity => entity.hasComponent(Collider));
        this.graphics = new Container();
        this.graphics.zIndex = 1000;
        this.graphics.label = "Collision Debugger";
    }

    onAddedToEngine(): void {
        super.onAddedToEngine();
        Engine.instance.app.stage.addChild(this.graphics);
    }

    onRemovedFromEngine(): void {
        super.onRemovedFromEngine();
        Engine.instance.app.stage.removeChild(this.graphics);
    }

    update(dt: number): void {
        super.update(dt);
    }

    protected onUpdate(entity: Entity, dt: number): void | boolean {
        const collider = entity.get(Collider)!;
        const transform = entity.get(Transform)!;

        const graphics = this.colliderDrawer.get(collider)!;
        graphics.position.set(transform.position.x, transform.position.y);
        graphics.rotation = transform.rotation;
    }

    protected onEntityAdded(entity: Entity): void {
        const collider = entity.get(Collider)!;

        const graphics = new Graphics();
        graphics.strokeStyle = { color: 0xff0000, pixelLine: true };
        this.colliderDrawer.set(collider, graphics);
        this.graphics.addChild(graphics);

        if (collider instanceof BoxCollider) {
            graphics.strokeStyle.color = 0xff0000;
            graphics.pivot.set(collider.width / 2, collider.height / 2);
            graphics.rect(0, 0, collider.width, collider.height);
            graphics.stroke();
        }

        if (collider instanceof CircleCollider) {
            graphics.strokeStyle.color = 0x00ff00;
            graphics.circle(0, 0, collider.radius);
            graphics.stroke();
        }
    }

    protected onEntityRemoved(entity: Entity): void {
        const collider = entity.get(Collider)!;
        const graphics = this.colliderDrawer.get(collider)!;
        this.graphics.removeChild(graphics);
        this.colliderDrawer.delete(collider);
    }
}