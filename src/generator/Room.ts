export default class Room {
    public x: number;
    public y: number;

    public width: number;
    public height: number;

    constructor(width: number, height: number, x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;
    }
}