import { Sprite, type Container } from "pixi.js";
import { Entity } from "tick-knock";
import Renderable from "../components/Renderable";
import Transform from "../components/Transform";
import Engine from "../Engine";
import BaseSystem from "./BaseSystem";

export default class RenderSystem extends BaseSystem {
    constructor() {
        super((entity) => entity.has(Renderable));
    }

    protected override onUpdate(entity: Entity): void {
        const transform = entity.get(Transform);
        const renderable = entity.get<Renderable<Container>>(Renderable)!;

        if (transform) {
            renderable.container.position.set(transform.position.x, transform.position.y);
            renderable.container.rotation = transform.rotation;
        }
    }

    protected override onEntityAdded(entity: Entity) {
        const renderable = entity.get(Renderable)!;

        Engine.instance.app.stage.addChild(renderable.container as Sprite);
    }

    protected override onEntityRemoved(entity: Entity) {
        const renderable = entity.get(Renderable)!;

        Engine.instance.app.stage.removeChild(renderable.container);
    }
}