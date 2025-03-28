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
		.set(new Transform(new Vector2(128, 128)))
		.set(new Rigidbody({ mass: 85, fixedRotation: true }))
		.set(new CircleCollider(8))
		.set(new Controller(340))
		.set(PLAYER_CONTROLLER)
		.set(CAMERA_FOCUS)
		.set(
			new Animator({
				spriteSheet: Resources.Resources.PlayerSpritesheet,
				states: {
					idle: { animation: "idle", speed: 1 },
					walk: { animation: "walk", speed: 15 },
					dead: {
						animation: "dead",
						speed: 15,
						oneShot: true
					},
					resurection: {
						animation: "resurection",
						speed: 15,
						oneShot: {
							next: "idle"
						}
					},
					idle_lookaround: {
						animation: "idle_lookaround",
						speed: 0.5,
						oneShot: {
							next: "idle"
						}
					}
				},
				defaultState: "idle"
			})
		);

	return player;
}
