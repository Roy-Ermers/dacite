import Random from "../utils/Random";
import Room from "./Room";

interface RoomyDungeonGeneratorOptions {
    seed: number;
    minimumRoomSize: number;

    minimumMapSize: [number, number];
    maximumMapSize: [number, number];
}
export default class RoomyDungeonGenerator {
    random: Random;
    rooms: Room[];

    mapSize: [number, number];

    iterations: number;
    options: RoomyDungeonGeneratorOptions;

    constructor(options: Partial<RoomyDungeonGeneratorOptions> = {}) {
        this.options = {
            seed: Math.floor(Math.random() * 100000),
            minimumRoomSize: 4,
            minimumMapSize: [128, 128],
            maximumMapSize: [256, 256],
            ...options
        };
        this.random = new Random(this.options.seed);

        const startingWidth = this.random.between(this.options.minimumMapSize[0], this.options.maximumMapSize[0]);
        const startingHeight = this.random.between(this.options.minimumMapSize[1], this.options.maximumMapSize[1]);

        this.mapSize = [startingWidth, startingHeight];

        this.rooms = [new Room(startingWidth - 1, startingHeight - 1)];
        this.iterations = this.random.between(100, 500);
    }

    start() {
        for (let i = 0; i < this.iterations; i++) {
            if (!this.iterate())
                continue;
        }

        return this.rooms;
    }

    iterate() {
        this.rooms.sort((a, b) => (b.width * b.height) - (a.width * a.height));
        const [room] = this.rooms.splice(Math.floor(Math.abs(this.random.value) ** 2) * this.rooms.length, 1);
        const { width, height, x, y } = room;
        const horizontal = this.random.between(0, 1) > height / width;

        const max = (horizontal ? width : height) - this.options.minimumRoomSize;

        if (max <= this.options.minimumRoomSize) {
            console.log("Split too small", this.options.minimumRoomSize, max);
            this.rooms.push(room);
            return false;
        }
        const split = this.random.between(this.options.minimumRoomSize, max);

        if (horizontal) {
            this.rooms.push(new Room(split, height, x, y));
            this.rooms.push(new Room(width - split, height, x + split, y));
        } else {
            this.rooms.push(new Room(width, split, x, y));
            this.rooms.push(new Room(width, height - split, x, y + split));
        }

        return true;
    }
}