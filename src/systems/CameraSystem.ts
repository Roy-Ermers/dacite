import { CAMERA_FOCUS } from "@/components/Tags";
import Transform from "@/components/Transform";
import Game from "@/Game";
import lerp from "@/utils/Lerp";
import Vector2 from "@/utils/Vector2";
import type { Entity } from "tick-knock";
import BaseSystem from "./BaseSystem";
import InputSystem from "./InputSystem";

export default class CameraSystem extends BaseSystem {
    public speed = 1;
    public targetZoom = 1;
    private currentZoom = 1;
    private currentPosition = Vector2.zero;

    constructor() {
        super(entity => entity.hasTag(CAMERA_FOCUS));
    }

    protected onUpdate(entity: Entity, dt: number): void | boolean {
        const transform = entity.get(Transform);

        if (!transform) return;
        const stage = Game.instance.app.stage;

        this.targetZoom = Math.max(Math.abs(this.targetZoom + InputSystem.instance.wheel), 0.1);

        if (Math.abs(this.currentZoom - this.targetZoom) > 0.01) {
            this.currentZoom = lerp(this.currentZoom, this.targetZoom, this.speed * dt);

            stage.scale.set(this.currentZoom);
        }

        const distance = this.currentPosition.distance(transform.position);
        this.currentPosition = this.currentPosition.lerp(transform.position, (distance / this.speed) * dt);

        stage.position.set(
            (Game.instance.app.screen.width / 2 - this.currentPosition.x * this.currentZoom),
            (Game.instance.app.screen.height / 2 - this.currentPosition.y * this.currentZoom)
        );
    }
}