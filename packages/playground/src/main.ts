import createInspector from "@dacite/ecs-inspector";
import { Renderable, Transform } from "@dacite/engine";
import Vector2 from "@dacite/engine/utils/Vector2.js";
import { Sprite } from "pixi.js";
import { Scope } from "../../ecs/dist/index.mjs";
import Resources from "./resources/Resources.ts";
import RenderSystem from "./systems/RenderSystem.ts";
// const game = new Engine();

async function init() {
	const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas");
	if (!canvas) throw new Error("Canvas not found");
	//  await game.init({
	//    canvas,
	//  });

	await Resources.load();
	//  game.addSystem(
	//    new PhysicsSystem({ gravity: new Vector2(0)}),
	//    new PlayerControllerSystem,
	//    new CameraSystem,
	//    new CollisionDebuggerSystem
	//  );

	//  TileManager.register(new TexturedTile('wall').setSolid());
	//  TileManager.register(new TexturedTile('floor'));
	//  TileManager.register(new TexturedTile('floor_embers'));
	//  TileManager.register(new TexturedTile('floor_moss'));

	//  const tileMap = new TileMap(64, 64);

	//  for (let x = 0; x < tileMap.width; x++) {
	//    for (let y = 0; y < tileMap.height; y++) {
	//      if (x === 0 || y === 0 || x === tileMap.width - 1 || y === tileMap.height - 1) {
	//        tileMap.setTile(x, y, "wall");
	//        continue;
	//      }

	//      if (Math.random() < 0.1)
	//        tileMap.setTile(x, y, 'floor_embers');
	//      else if (Math.random() < 0.2)
	//        tileMap.setTile(x, y, 'floor_moss');
	//      else
	//        tileMap.setTile(x, y, 'floor');
	//    }
	//  }

	// for (let i = 0; i < 1000; i++) {
	// 	const entity = game.newEcs.entity(`Wall`)

	// 	entity.set(new Transform(Vector2.random.multiply(640), Math.random()))
	// 	entity.set(new Renderable(Sprite.from(Resources.TileSpritesheet.textures['wall'])));

	// 	if(Math.random() < 0.2) {
	// 		entity.set(new CircleCollider(16))
	// 	}
	// }

	const scope = new Scope({ debug: true });

	const renderSystem = new RenderSystem({
		canvas
	});
	createInspector({ scope, element: canvas.parentElement! });
	const player = Sprite.from(Resources.TileSpritesheet.textures.wall);
	scope.addSystem(renderSystem);
	scope
		.entity("player")
		.set(new Transform(new Vector2(150, 150)))
		.set(new Renderable(player));

	function update() {
		scope.update();
		requestAnimationFrame(update);
	}

	update();

	globalThis.__ECS__ = scope;

	// const renderer = new TileMapRenderer(tileMap, Resources.TileSpritesheet);
	// const tileMapEntity = new Entity()
	//   .add(renderer)
	//   .add(new Renderable(renderer.container))
	//   .add(new Transform());

	// const tile = new Entity()
	//   .add(new Renderable(Sprite.from(Resources.TileSpritesheet.textures['wall'])))
	//   .add(new Transform(new Vector2(-16, 32)))
	//   .add(new Rigidbody({ type: "dynamic", mass: 10000 }))
	//   .add(new BoxCollider(64, 16), Collider);

	// game.ecs.addEntity(tile);
	// game.ecs.addEntity(tileMapEntity);
	// game.ecs.addEntity(createPlayer());
}

init();
