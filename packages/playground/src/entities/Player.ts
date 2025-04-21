import { Vector2 } from "@dacite/core";
import {
	Animator,
	CircleCollider,
	Controller,
	Rigidbody,
	Transform
} from "@dacite/core/components";
import type Scope from "@dacite/ecs";
import PLAYER_CONTROLLER from "../components/PlayerController";
import { CAMERA_FOCUS } from "../components/Tags";
import Resources from "../resources/Resources";

export default function createPlayer(scope: Scope) {
	const player = scope
		.entity("Player")
		.set(new Transform(new Vector2(0, 0)))
		.set(new Rigidbody({ fixedRotation: true }))
		.set(new CircleCollider(4).withFriction(0.5).withDensity(5))
		.set(new Controller())
		.set(PLAYER_CONTROLLER)
		.set(CAMERA_FOCUS)
		.set(
			new Animator({
				spriteSheet: Resources.Resources.Spritesheet,
				states: {
					idle: { animation: "idle", speed: 1 },
					jump: { animation: "jump", speed: 1 },
					walk: { animation: "walk", speed: 15 }
				},
				defaultState: "idle"
			})
		);

	return player;
}
