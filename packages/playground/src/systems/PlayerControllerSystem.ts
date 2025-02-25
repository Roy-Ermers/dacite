import Animator from "@scout/engine/components/Animator.ts";
import Controller from "@scout/engine/components/Controller.ts";
import Force from "@scout/engine/components/Force.js";
import Renderable from "@scout/engine/components/Renderable.ts";
import Rigidbody from "@scout/engine/components/Rigidbody.ts";
import BaseSystem from "@scout/engine/systems/BaseSystem.ts";
import InputSystem from "@scout/engine/systems/InputSystem.ts";
import Random from "@scout/engine/utils/Random.ts";
import Vector2 from "@scout/engine/utils/Vector2.ts";
import { Entity } from "tick-knock";
import PLAYER_CONTROLLER from "../components/PlayerController.ts";

export default class PlayerControllerSystem extends BaseSystem {
    random: Random;

    constructor() {
        super((entity: Entity) => entity.hasTag(PLAYER_CONTROLLER) && entity.hasComponent(Rigidbody));
        this.random = new Random();
    }

    protected override onUpdate(entity: Entity): void | boolean {
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