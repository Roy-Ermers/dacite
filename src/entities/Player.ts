import Animator from "@/components/Animator";
import Collider from "@/components/Collider";
import CircleCollider from "@/components/colliders/CircleCollider";
import Controller from "@/components/Controller";
import { Name } from "@/components/Name";
import Renderable from "@/components/Renderable";
import Rigidbody from "@/components/Rigidbody";
import { CAMERA_FOCUS, PlAYER_CONTROLLER } from "@/components/Tags";
import Transform from "@/components/Transform";
import Resources from "@/resources/Resources";
import { Entity } from "tick-knock";

export default function createPlayer() {
    const player = new Entity()
        .addComponent(new Transform())
        .addComponent(new Rigidbody({ mass: 85, fixedRotation: true }))
        .addComponent(new CircleCollider(8), Collider)
        .addComponent(new Controller(17000))
        .addComponent(new Name("player"))
        .addTag(PlAYER_CONTROLLER)
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