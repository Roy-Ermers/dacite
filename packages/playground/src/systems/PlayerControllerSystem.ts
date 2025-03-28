import {
	Animator,
	Controller,
	Force,
	ForceComponentSet,
	Rigidbody
} from "@dacite/core/components";
import { InputSystem } from "@dacite/core/systems";
import { Random, Vector2 } from "@dacite/core/utils";
import {
	type Entity,
	EntitySystem,
	type InferQuerySet,
	Query
} from "@dacite/ecs";
import PLAYER_CONTROLLER from "../components/PlayerController.ts";

export default class PlayerControllerSystem extends EntitySystem {
	random: Random;

	get query() {
		return new Query().has(PLAYER_CONTROLLER).has(Rigidbody).has(Controller);
	}

	constructor() {
		super();
		this.random = new Random();
	}

	override onEntityUpdated(entity: Entity<InferQuerySet<this["query"]>>) {
		const controller = entity.get(Controller);
		const animator = entity.get(Animator);

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

		let forces = entity.get(ForceComponentSet);

		if (!forces) {
			forces = new ForceComponentSet();
			entity.set(forces);
		}

		if (direction.length > 0.01) {
			forces.add(
				new Force(
					direction
						.normalize(direction)
						.multiply(controller.speed, controller.speed, direction),
					"impulse"
				)
			);
		}

		if (!animator) return;

		const rigidbody = entity.get(Rigidbody);
		if (direction.x !== 0) animator.flipped = direction.x < 0;

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
