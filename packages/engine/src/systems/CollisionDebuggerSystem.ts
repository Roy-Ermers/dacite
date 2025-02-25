import Engine from "@scout/engine";
import Transform from "@scout/engine/components/Transform.ts";
import BoxCollider from "@scout/engine/components/colliders/BoxCollider.ts";
import CircleCollider from "@scout/engine/components/colliders/CircleCollider.ts";
import Collider from "@scout/engine/components/colliders/Collider.ts";
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

    override onAddedToEngine(): void {
        super.onAddedToEngine();
        Engine.instance.app.stage.addChild(this.graphics);
    }

    override onRemovedFromEngine(): void {
        super.onRemovedFromEngine();
        Engine.instance.app.stage.removeChild(this.graphics);
    }

    override update(dt: number): void {
        super.update(dt);
    }

    protected override onUpdate(entity: Entity): void | boolean {
        const collider = entity.get(Collider)!;
        const transform = entity.get(Transform)!;

        const graphics = this.colliderDrawer.get(collider)!;
        graphics.position.set(transform.position.x, transform.position.y);
        graphics.rotation = transform.rotation;
    }

    protected override onEntityAdded(entity: Entity): void {
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

    protected override onEntityRemoved(entity: Entity): void {
        const collider = entity.get(Collider)!;
        const graphics = this.colliderDrawer.get(collider)!;
        this.graphics.removeChild(graphics);
        this.colliderDrawer.delete(collider);
    }
}