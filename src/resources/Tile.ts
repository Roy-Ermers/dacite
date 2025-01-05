import TileManager from "@/resources/TileManager";

export default class Tile {
    public layer = 0;

    public get id() {
        return TileManager.getId(this);
    }

    constructor(public readonly name: string) { }
}