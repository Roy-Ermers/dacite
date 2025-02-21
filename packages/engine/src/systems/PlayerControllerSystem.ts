import Animator from "@/components/Animator";
import Controller from "@/components/Controller";
import Force from "@/components/Force";
import Renderable from "@/components/Renderable";
import Rigidbody from "@/components/Rigidbody";
import { PlAYER_CONTROLLER } from "@/components/Tags";
import InputSystem from "@/systems/InputSystem";
import Random from "@/utils/Random";
import Vector2 from "@/utils/Vector2";
import { Entity } from "tick-knock";
import BaseSystem from "./BaseSystem";

export default class PlayerControllerSystem extends BaseSystem {
    random: Random;

    constructor() {
        super((entity) => entity.hasTag(PlAYER_CONTROLLER) && entity.hasComponent(Rigidbody));
        this.random = new Random();
    }

    protected onUpdate(entity: Entity): void | boolean {
        const controller = entity.get(Controller);
        const animator = entity.get(Renderable) as Animator;

        if (!controller)
            return;

        const direction = Vector2.zero;

        if (InputSystem.instance.isDown("w")) {
            direction.y += -1;
        }
        if (InputSystem.instance.isDown("s")) {
            direction.y += 1;
        }
        if (InputSystem.instance.isDown("a")) {
            direction.x += -1;
        }
        if (InputSystem.instance.isDown("d")) {
            direction.x += 1;
        }


        entity.append(new Force(direction.normalize().multiply(controller.speed), "impulse"));

        const rigidbody = entity.get(Rigidbody);
        if (!animator || !rigidbody) return;

        if (direction.x != 0) animator.flipped = direction.x < 0;


        if ((rigidbody.velocity.x | 0) !== 0 || (rigidbody.velocity.y | 0) !== 0) {
            animator.currentStateKey = "walk";
        } else {
            if (this.random.value > 0.995) {
                animator.currentStateKey = "idle_lookaround";
            } else if (animator.currentStateKey !== "idle_lookaround") {
                animator.currentStateKey = "idle";
            }
        }

    }
}