import { Entity, EntitySnapshot, IterativeSystem, Query } from "tick-knock";
import Position from "../components/Position";
import Renderable from "../components/Renderable";
import { Sprite } from "pixi.js";
import Game from "../Game";
import BaseSystem from "./BaseSystem";

export default class RenderSystem extends BaseSystem {
    constructor() {
        super((entity) => entity.has(Renderable));
    }

    protected onUpdate(entity: Entity): void {
        const position = entity.get(Position);
        const renderable = entity.get(Renderable)!;

        if (position)
            renderable.container.position.set(position.x, position.y);
    }

    protected onEntityAdded(entity: Entity) {
        const renderable = entity.get(Renderable)!;

        Game.instance.app.stage.addChild(renderable.container as Sprite);
    }

    protected onEntityRemoved(entity: Entity) {
        const renderable = entity.get(Renderable)!;

        Game.instance.app.stage.removeChild(renderable.container);
    }
}