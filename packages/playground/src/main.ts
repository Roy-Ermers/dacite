import Engine, { BoxCollider, CircleCollider, Collider, Force, Renderable, Rigidbody, TileMapRenderer, Transform } from "@scout/engine";
import CameraSystem from "@scout/engine/systems/CameraSystem.ts";
import PhysicsSystem from "@scout/engine/systems/PhysicsSystem.ts";
import TileManager from "@scout/engine/tiles/TileManager.ts";
import TexturedTile from "@scout/engine/tiles/types/TexturedTile.ts";
import Vector2 from "@scout/engine/utils/Vector2.ts";
import createPlayer from "./entities/Player";
import Resources from "./resources/Resources.ts";
import PlayerControllerSystem from "./systems/PlayerControllerSystem";
import TileMap from "@scout/engine/grid/TileMap.js";
import CollisionDebuggerSystem from "@scout/engine/systems/CollisionDebuggerSystem.js";
import { Sprite } from "pixi.js";
// import { Entity } from "tick-knock";
import { Query, Entity } from "@scout/ecs";
import RenderSystem from "./systems/TestSystem.ts";


const game = new Engine();

async function init() {
  const canvas = document.querySelector<HTMLCanvasElement>("#gameCanvas");
  if (!canvas) throw new Error("Canvas not found");
  await game.init({
    canvas,
    debug: true
  });

  await Resources.load();
  game.addSystem(
    new PhysicsSystem({ gravity: new Vector2(0)}),
    new PlayerControllerSystem,
    new CameraSystem,
    new CollisionDebuggerSystem
  );

  TileManager.register(new TexturedTile('wall').setSolid());
  TileManager.register(new TexturedTile('floor'));
  TileManager.register(new TexturedTile('floor_embers'));
  TileManager.register(new TexturedTile('floor_moss'));

  const tileMap = new TileMap(64, 64);

  for (let x = 0; x < tileMap.width; x++) {
    for (let y = 0; y < tileMap.height; y++) {
      if (x === 0 || y === 0 || x === tileMap.width - 1 || y === tileMap.height - 1) {
        tileMap.setTile(x, y, "wall");
        continue;
      }

      if (Math.random() < 0.1)
        tileMap.setTile(x, y, 'floor_embers');
      else if (Math.random() < 0.2)
        tileMap.setTile(x, y, 'floor_moss');
      else
        tileMap.setTile(x, y, 'floor');
    }
  }

	for (let i = 0; i < 1000; i++) {
		const entity = game.newEcs.entity(`Player ${i}`)

		entity.set(new Transform(Vector2.random.multiply(640), Math.random()))
		entity.set(new Renderable(Sprite.from(Resources.TileSpritesheet.textures['wall'])));

		if(Math.random() < 0.2) {
			entity.set(new CircleCollider(16))
		}
	}

	const renderSystem = new RenderSystem();
	game.newEcs.addSystem(renderSystem);

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
  game.ecs.addEntity(createPlayer());
}

init();
