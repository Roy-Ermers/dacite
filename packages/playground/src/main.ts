import Engine, {
	BoxCollider,
	Collider,
	Renderable,
	Rigidbody,
	Transform,
	Vector2
} from "@dacite/core";
import { PhysicsSystem } from "@dacite/core/systems";
import createInspector from "@dacite/ecs-inspector";
import { Sprite } from "pixi.js";
import ComponentParser from "../../ecs/src/utils/ComponentParser.ts";
import createPlayer from "./entities/Player.ts";
import Resources from "./resources/Resources.ts";
import CameraSystem from "./systems/CameraSystem.ts";
import PlayerControllerSystem from "./systems/PlayerControllerSystem.ts";

const game = new Engine();

async function init() {
	const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas");
	if (!canvas) throw new Error("Canvas not found");
	await game.init({
		canvas
	});

	await Resources.load();

	createInspector();

	game.ecs
		.addSystem(new CameraSystem())
		.addSystem(new PlayerControllerSystem())
		.addSystem(new PhysicsSystem({ gravity: Vector2.zero }));

	createPlayer(game.ecs);

	console.log(ComponentParser.getBaseComponentType(Collider));

	for (let i = 0; i < 10; i++) {
		const player = Sprite.from(
			Resources.Resources.TileSpritesheet.textures.wall
		);
		game.ecs
			.entity(`wall ${i}`)
			.set(new Transform(Vector2.random.multiply(128, 128)))
			.set(new Renderable(player))
			.set(new Rigidbody({ type: "dynamic", mass: 1000 }))
			.set(new BoxCollider(16, 16));
	}

	function update() {
		game.ecs.update();
		requestAnimationFrame(update);
	}

	update();
}

init();
