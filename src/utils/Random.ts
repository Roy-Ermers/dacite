export default class Random {
    seed: number;

    constructor(seed?: number) {
        seed = seed ?? Math.random();

        this.seed = seed % 2147483647;

        if (this.seed <= 0)
            seed += 2147483646;
    }

    /**
     * Value between -1 and 1
     */
    public get value() {
        return (this.seed = this.seed * 16807 % 2147483647 - 1) / 2147483646;
    }

    public between(min: number, max: number) {
        return Math.floor(Math.abs(this.value) * (max - min + 1) + min);
    }
}