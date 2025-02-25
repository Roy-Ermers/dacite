import Game, { BoxCollider, Collider, Renderable, Rigidbody, Transform } from "@scout/engine";
import CameraSystem from "@scout/engine/systems/CameraSystem.ts";
import ColliderSystem from "@scout/engine/systems/ColliderSystem.ts";
import CollisionDebuggerSystem from "@scout/engine/systems/CollisionDebuggerSystem.ts";
import RigidbodySystem from "@scout/engine/systems/RigidbodySystem.ts";
import TileManager from "@scout/engine/tiles/TileManager.ts";
import TexturedTile from "@scout/engine/tiles/types/TexturedTile.ts";
import Vector2 from "@scout/engine/utils/Vector2.ts";
import createPlayer from "./entities/Player";
import Resources from "./resources/Resources.ts";
import PlayerControllerSystem from "./systems/PlayerControllerSystem";

import { Sprite } from "pixi.js";
import { Entity } from "tick-knock";

const game = new Game();

async function init() {
    await game.init();

    await Resources.load();
    game.addSystem(
        new RigidbodySystem,
        new PlayerControllerSystem,
        new CameraSystem,
        new ColliderSystem,
        new CollisionDebuggerSystem
    );

    TileManager.register(new TexturedTile('wall').setSolid());
    TileManager.register(new TexturedTile('floor'));
    TileManager.register(new TexturedTile('floor_embers'));
    TileManager.register(new TexturedTile('floor_moss'));

    // const tileMap = new TileMap(64, 64);

    // for (let x = 0; x < tileMap.width; x++) {
    //     for (let y = 0; y < tileMap.height; y++) {
    //         if (x === 0 || y === 0 || x === tileMap.width - 1 || y === tileMap.height - 1) {
    //             tileMap.setTile(x, y, "wall");
    //             continue;
    //         }

    //         if (Math.random() < 0.1)
    //             tileMap.setTile(x, y, 'floor_embers');
    //         else if (Math.random() < 0.2)
    //             tileMap.setTile(x, y, 'floor_moss');
    //         else
    //             tileMap.setTile(x, y, 'floor');
    //     }
    // }

    // const renderer = new TileMapRenderer(tileMap, Resources.TileSpritesheet);
    // const tileMapEntity = new Entity()
    //     .add(renderer)
    //     .add(new Renderable(renderer.container))
    //     .add(new Transform());

    const tile = new Entity()
        .add(new Renderable(Sprite.from(Resources.TileSpritesheet.textures['wall'])))
        .add(new Transform(new Vector2(-16, 32)))
        .add(new Rigidbody({ type: "static", mass: 10000 }))
        .add(new BoxCollider(64, 16), Collider);

    const tile2 = game.createEntity("Tile")
        .addComponent(new Renderable(Sprite.from(Resources.TileSpritesheet.textures['stairs_up'])))
        .addComponent(new Transform(new Vector2(64, 64)))
        .addComponent(new Rigidbody({ type: "dynamic", mass: 1 }))
        .addComponent(new BoxCollider(64, 16));

    console.log(tile2.toString())

    game.ecs.addEntity(tile);
    // game.ecs.addEntity(tileMapEntity);
    game.ecs.addEntity(createPlayer());
}

init();