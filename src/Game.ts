import { Application, SCALE_MODES, TextureSource } from "pixi.js";
import { Engine } from "tick-knock";

export default class Game {
    public static instance: Game = null!;
    public get ticker() {
        return this.app.ticker;
    }

    public get elapsedTime() {
        return Date.now() - this.timeStart;
    }

    public readonly app: Application;
    public readonly ecs = new Engine();

    private timeStart: number = 0;

    constructor() {
        if (Game.instance) {
            throw new Error("Game is already instantiated");
        }

        Game.instance = this;
        this.app = new Application();
        this.ecs = new Engine();

        TextureSource.defaultOptions.scaleMode = "nearest";

        /* @ts-ignore-next-line To support devtools */
        globalThis.__PIXI_APP__ = this.app;
        /* @ts-ignore-next-line To support devtools */
        globalThis.__ECS__ = this.ecs;
    }

    async init() {
        await this.app.init({
            resizeTo: window,
            antialias: false,
            autoDensity: false,

            roundPixels: true,
            resolution: window.devicePixelRatio || 1,
            background: 0x000000,
        });

        this.timeStart = Date.now();

        this.app.ticker.add((ticker) => this.ecs.update(ticker.deltaMS));

        document.body.appendChild(this.app.canvas);
    }
}