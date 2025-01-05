import { Tag } from "tick-knock";
import Tile from "./Tile";

export default class TileEntity extends Tile {
    private components: unknown[];
    constructor(name: string) {
        super(name);
        this.components = [];
    }

    protected onCreateTile(tile: typeof this) {

    }

    protected addComponent<T extends unknown>(component: T | Tag) {
        this.components.push(component);
    }
}