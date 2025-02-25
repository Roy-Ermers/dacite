import Tile from "@scout/engine/tiles/types/Tile.ts";

export default class TileManager {
    private static tiles: Tile[] = [];

    public static getTile<T extends Tile>(id: number): T {
        return this.tiles[id] as T;
    }

    public static getId(tile: string): number;
    public static getId(tile: Tile): number;
    public static getId(tile: Tile | string) {
        if (typeof tile === "string") {
            return this.tiles.findIndex(t => t.name === tile);
        }

        return this.tiles.indexOf(tile);
    }

    public static register<T extends Tile>(tile: T) {
        if (this.tiles.includes(tile)) {
            throw new Error(`Tile ${tile.name} is already registered`);
        }

        this.tiles.push(tile);
    }
}

TileManager.register(new Tile("air"));