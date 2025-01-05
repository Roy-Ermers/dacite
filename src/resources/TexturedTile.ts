import Tile from "./Tile";

export default class TexturedTile extends Tile {
    constructor(name: string, public texture: string = name) {
        super(name);
    }
}