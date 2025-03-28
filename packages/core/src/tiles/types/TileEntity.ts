import { Tag } from "tick-knock";
import Tile from "./Tile";

interface TileEntity {
    onCreateTile(tile: typeof TileEntity): void;
}

class TileEntity extends Tile {
    private components: unknown[];
    constructor(name: string) {
        super(name);
        this.components = [];
    }

    protected addComponent<T extends unknown>(component: T | Tag) {
        this.components.push(component);
    }
}

export default TileEntity;