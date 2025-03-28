import { EventEmitter } from "pixi.js";
import TileManager from "../tiles/TileManager.ts";

export default class TileMap extends EventEmitter<"tileChange"> {
	public tiles: Uint8Array;

	public constructor(
		public width: number,
		public height: number
	) {
		super();
		this.tiles = new Uint8Array(width * height);
	}

	public setTile(x: number, y: number, tile: string): void;
	public setTile(x: number, y: number, tile: number): void;
	public setTile(x: number, y: number, tile: number | string): void {
		const tileId = typeof tile === "string" ? TileManager.getId(tile) : tile;

		if (this.tiles[x + y * this.width] === tileId) return;

		this.tiles[x + y * this.width] = tileId;
		this.emit("tileChange", x, y, tileId);
	}

	public getTile(x: number, y: number) {
		return this.tiles[x + y * this.width];
	}

	public getTileIndex(x: number, y: number) {
		return x + y * this.width;
	}
}
