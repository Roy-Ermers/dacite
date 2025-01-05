import Tile from "./Tile";

export default class TileManager {
    private static tiles: Tile[] = [];

    public static getTile<T extends Tile>(id: number): T {
        return this.tiles[id] as T;
    }

    public static getIdByTile(tile: Tile) {
        return this.tiles.indexOf(tile);
    }
    public static getIdByName(tile: string) {
        return this.tiles.findIndex(t => t.name === tile);
    }

    public static getId(tile: Tile | string) {
        if (typeof tile === "string") {
            return this.getIdByName(tile);
        }

        return this.getIdByTile(tile);
    }

    public static register<T extends Tile>(tile: T) {
        if (this.tiles.includes(tile)) {
            throw new Error(`Tile ${tile.name} is already registered`);
        }

        this.tiles.push(tile);
    }
}

TileManager.register(new Tile("air"));