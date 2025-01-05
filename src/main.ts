import { AnimatedSprite, Assets, Sprite, Texture } from "pixi.js";
import Game from "@/Game";
import RenderSystem from "@/systems/RenderSystem";
import { Entity } from "tick-knock";
import Renderable from "@/components/Renderable";
import Position from "@/components/Position";
import TileMap from "@/grid/TileMap";
import TileMapRenderer from "./components/TileMapRenderer";
import SpritesheetImporter from "./resources/SpritesheetImporter";
import TileManager from "./resources/TileManager";
import TexturedTile from "./resources/TexturedTile";


const game = new Game();
await game.init();

game.ecs.addSystem(new RenderSystem());

const spritesheet = await new SpritesheetImporter("tiles1.png", {
  tileWidth: 16,
  tileHeight: 16,
  alias: {
    1: "floor",
    2: "moss",
  }
}).build();



game.app.stage.scale.set(2);

const tileMap = new TileMap(128, 128);
TileManager.register(new TexturedTile('floor'));
TileManager.register(new TexturedTile('moss'));

tileMap.setTile(0, 0, 1);
tileMap.setTile(0, 2, 1);
tileMap.setTile(0, 1, 2);
const renderer = new TileMapRenderer(tileMap, spritesheet);
const tileMapEntity = new Entity()
  .add(new Position(10, 10))
  .add(renderer)
  .add(new Renderable(renderer.container));

tileMapEntity.get(Renderable)!.container.on('click', () => {
  console.log('click');

  tileMap.setTile(0, 0, 2);
})
tileMapEntity.get(Renderable)!.container.eventMode = 'static';
game.ecs.addEntity(tileMapEntity);