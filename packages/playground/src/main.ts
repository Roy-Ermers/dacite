import Engine, {
	BoxCollider,
	CircleCollider,
	Renderable,
	Rigidbody,
	Transform,
	Vector2
} from "@dacite/core";
import { PlanckPhysicsSystem, RenderSystem } from "@dacite/core/systems";
import createInspector from "@dacite/ecs-inspector";
import { Sprite } from "pixi.js";
import PlaneCollider from "../../core/src/components/colliders/PlaneCollider.ts";
import { HEART } from "./components/Tags.ts";
import createPlayer from "./entities/Player.ts";
import Resources from "./resources/Resources.ts";
import CameraSystem from "./systems/CameraSystem.ts";
import HeartSystem from "./systems/HeartSystem.ts";
import PlayerControllerSystem from "./systems/PlayerControllerSystem.ts";

const game = new Engine();

async function init() {
	await game.init({
		renderSystem: new RenderSystem({
			backgroundColor: 0xffccaa
		})
	});

	await Resources.load();

	createInspector();

	game.ecs
		.addSystem(new CameraSystem())
		.addSystem(new PlayerControllerSystem())
		.addSystem(new PlanckPhysicsSystem({ gravity: new Vector2(0, -9.78) }))
		.addSystem(new HeartSystem());

	createPlayer(game.ecs);

	game.ecs
		.entity("heart")
		.set(new Transform(new Vector2(-32, 0)))
		.set(
			new Renderable(
				Sprite.from(Resources.Resources.Spritesheet.textures.heart_empty),
				-1
			)
		)
		.set(BoxCollider.Sensor(8, 8))
		.set(HEART);

	for (let i = 0; i < 10; i++) {
		const balloon = Sprite.from(
			Resources.Resources.Spritesheet.textures.balloon
		);
		game.ecs
			.entity(`balloon ${i}`)
			.set(new Transform(new Vector2(64 - Math.random() * 128, 16)))
			.set(new Renderable(balloon))
			.set(new Rigidbody({ type: "dynamic" }))
			.set(
				new CircleCollider(4)
					.withDensity(1)
					.withFriction(1)
					.withRestitution(0.75)
			);
	}

	for (let i = 0; i < 50; i++) {
		game.ecs
			.entity()
			.set(new Transform(new Vector2((i - 25) * 8, 8)))
			.set(
				new Renderable(
					Sprite.from(Resources.Resources.Spritesheet.textures.wall_top),
					-1
				)
			);
	}
	game.ecs
		.entity("floor")
		.set(new Transform(new Vector2(0, -4)))
		.set(new Rigidbody({ type: "static" }))
		.set(
			new PlaneCollider(
				new Vector2(-25 * 8, 0),
				new Vector2(25 * 8, 0)
			).withFriction(1)
		);
}

init();
