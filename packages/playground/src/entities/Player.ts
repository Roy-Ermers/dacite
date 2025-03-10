import { Animator, CircleCollider, Collider, Controller, Renderable, Rigidbody, Transform } from "@scout/engine/components/index.ts";
import { Entity } from "tick-knock";
import PLAYER_CONTROLLER from "../components/PlayerController";
import Resources from "../resources/Resources.ts";
import { CAMERA_FOCUS } from "@scout/engine/components/Tags.js";

export default function createPlayer() {
    const player = new Entity()
        .addComponent(new Transform())
        .addComponent(new Rigidbody({ mass: 85, fixedRotation: true }))
        .addComponent(new CircleCollider(8), Collider)
        .addComponent(new Controller(340))
        .addTag(PLAYER_CONTROLLER)
        .addTag(CAMERA_FOCUS)
        .addComponent(new Animator({
            spriteSheet: Resources.PlayerSpritesheet,
            states: {
                idle: { animation: 'idle', speed: 1 },
                walk: { animation: 'walk', speed: 15 },
                dead: {
                    animation: 'dead',
                    speed: 15,
                    oneShot: true
                },
                resurection: {
                    animation: 'resurection',
                    speed: 15,
                    oneShot: {
                        next: 'idle'
                    }
                },
                idle_lookaround: {
                    animation: 'idle_lookaround',
                    speed: 0.5,
                    oneShot: {
                        next: 'idle'
                    }
                },
            },
            defaultState: 'idle',
        }), Renderable);
    return player;
}
