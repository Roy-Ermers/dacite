import TileMap from "@/grid/TileMap";
import TexturedTile from "@/resources/TexturedTile";
import TileManager from "@/resources/TileManager";
import { Container, Sprite, Spritesheet } from "pixi.js";

export default class TileMapRenderer {
    container: Container;

    constructor(
        public readonly tileMap: TileMap,
        public readonly spriteSheet: Spritesheet,
        public readonly tileSize: number = 16
    ) {
        this.container = new Container({
            width: tileMap.width * tileSize,
            height: tileMap.height * tileSize,
            isRenderGroup: true,
        });
        this.container.label = 'TileMapRenderer';
        this.createTiles();
        this.tileMap.on('tileChange', (x, y, id) => this.updateTile(x, y, id));
        this.container.updateCacheTexture();
    }

    private createTiles() {
        for (let y = 0; y < this.tileMap.height; y++) {
            for (let x = 0; x < this.tileMap.width; x++) {
                const tile = this.tileMap.getTile(x, y);

                const tileData = TileManager.getTile(tile);
                if (!(tileData instanceof TexturedTile)) continue;

                const sprite = Sprite.from(this.spriteSheet.textures[tileData.texture]);
                sprite.x = x * this.tileSize;
                sprite.y = y * this.tileSize;
                sprite.label = `Tile ${tileData.name}`;
                this.container.addChild(sprite);
            }
        }
    }

    private updateTile(x: number, y: number, tile: number) {
        const tileData = TileManager.getTile(tile);
        if (!(tileData instanceof TexturedTile)) return;
        //get existing tile
        const tileSprite = this.container.children.find(
            (child) => child.x === x * this.tileSize && child.y === y * this.tileSize
        ) as Sprite;

        //if tile is not found, create a new one
        if (!tileSprite) {
            const sprite = Sprite.from(this.spriteSheet.textures[tileData.texture]);
            sprite.x = x * this.tileSize;
            sprite.y = y * this.tileSize;
            sprite.label = `Tile ${tileData.name}`;
            this.container.addChild(sprite);
            return;
        }

        //update existing tile
        tileSprite.texture = this.spriteSheet.textures[tileData.texture];
        this.container.updateCacheTexture();
    }
}