import { Container, Sprite, type Spritesheet } from "pixi.js";
import type TileMap from "../grid/TileMap.ts";
import TileManager from "../tiles/TileManager.ts";
import TexturedTile from "../tiles/types/TexturedTile.ts";

export default class TileMapRenderer {
	container: Container<Sprite>;

	constructor(
		public readonly tileMap: TileMap,
		public readonly spriteSheet: Spritesheet,
		public readonly tileSize: number = 16
	) {
		this.container = new Container({
			width: tileMap.width * tileSize,
			height: tileMap.height * tileSize,
			isRenderGroup: true,
			interactiveChildren: false,
			eventMode: "none"
		});
		this.container.label = "TileMapRenderer";
		this.createTiles();
		this.tileMap.on("tileChange", (x, y, id) => this.updateTile(x, y, id));
	}

	private createTiles() {
		for (let y = 0; y < this.tileMap.height; y++) {
			for (let x = 0; x < this.tileMap.width; x++) {
				const tile = this.tileMap.getTile(x, y);
				this.createTile(x, y, tile);
			}
		}
		this.container.updateCacheTexture();
	}

	private createTile(x: number, y: number, tile: number) {
		const tileData = TileManager.getTile(tile);
		if (!(tileData instanceof TexturedTile)) return;

		const sprite = Sprite.from(this.spriteSheet.textures[tileData.texture]);
		sprite.x = x * this.tileSize;
		sprite.y = y * this.tileSize;
		sprite.roundPixels = true;
		sprite.label = `Tile ${tileData.name}`;
		this.container.addChild(sprite);
	}

	private updateTile(x: number, y: number, tile: number) {
		//get existing tile
		const tileSprite = this.container.children.find(
			child => child.x === x * this.tileSize && child.y === y * this.tileSize
		);

		//if tile is not found, create a new one
		if (!tileSprite) {
			this.createTile(x, y, tile);
			return;
		}

		const tileData = TileManager.getTile(tile);

		if (!(tileData instanceof TexturedTile)) {
			this.container.removeChild(tileSprite);
			return;
		}

		//update existing tile
		tileSprite.texture = this.spriteSheet.textures[tileData.texture];
		this.container.updateCacheTexture();
	}
}
