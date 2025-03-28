export default class Tile {
    public layer = 0;
    public isSolid = false;

    constructor(public readonly name: string) { }

    public setSolid() {
        this.isSolid = true;

        return this;
    }
}