import Renderable from "@/components/Renderable";
import TileMapRenderer from "@/components/TileMapRenderer";
import createPlayer from "@/entities/Player";
import Game from "@/Game";
import TileMap from "@/grid/TileMap";
import Resources from "@/resources/Resources";
import PlayerControllerSystem from "@/systems/PlayerControllerSystem";
import RenderSystem from "@/systems/RenderSystem";
import RigidbodySystem from "@/systems/RigidbodySystem";
import TileManager from "@/tiles/TileManager";
import TexturedTile from "@/tiles/types/TexturedTile";
import { Sprite } from "pixi.js";
import { Entity } from "tick-knock";
import Collider from "./components/Collider";
import BoxCollider from "./components/colliders/BoxCollider";
import Rigidbody from "./components/Rigidbody";
import Transform from "./components/Transform";
import CameraSystem from "./systems/CameraSystem";
import ColliderSystem from "./systems/ColliderSystem";
import CollisionDebuggerSystem from "./systems/CollisionDebuggerSystem";
import Vector2 from "./utils/Vector2";


const game = new Game();
async function init() {
    await game.init();

    await Resources.load();
    game.addSystem(
        new RenderSystem,
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

    const renderer = new TileMapRenderer(tileMap, Resources.TileSpritesheet);
    const tileMapEntity = new Entity()
        .add(renderer)
        .add(new Renderable(renderer.container))
        .add(new Transform());

    const tile = new Entity()
        .add(new Renderable(Sprite.from(Resources.TileSpritesheet.textures['wall'])))
        .add(new Transform(new Vector2(-32, -32)))
        .add(new Rigidbody({ type: "dynamic", mass: 10000 }))
        .add(new BoxCollider(64, 16), Collider);

    game.ecs.addEntity(tile);
    game.ecs.addEntity(tileMapEntity);
    game.ecs.addEntity(createPlayer());
}

init();