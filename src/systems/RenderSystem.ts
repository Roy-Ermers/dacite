import { Name } from "@/components/Name";
import { Sprite, type Container } from "pixi.js";
import { Entity } from "tick-knock";
import Renderable from "../components/Renderable";
import Transform from "../components/Transform";
import Game from "../Game";
import BaseSystem from "./BaseSystem";

export default class RenderSystem extends BaseSystem {
    constructor() {
        super((entity) => entity.has(Renderable));
    }

    protected onUpdate(entity: Entity): void {
        const transform = entity.get(Transform);
        const renderable = entity.get<Renderable<Container>>(Renderable)!;

        if (transform) {
            renderable.container.position.set(transform.position.x, transform.position.y);
            renderable.container.rotation = transform.rotation;
        }
    }

    protected onEntityAdded(entity: Entity) {
        const renderable = entity.get(Renderable)!;


        const sprite = Game.instance.app.stage.addChild(renderable.container as Sprite);
        const name = entity.get(Name);
        if (name) {
            sprite.label = name.name;
        }
    }

    protected onEntityRemoved(entity: Entity) {
        const renderable = entity.get(Renderable)!;

        Game.instance.app.stage.removeChild(renderable.container);
    }
}