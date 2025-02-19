import { Application, TextureSource } from "pixi.js";
import { Engine } from "tick-knock";
import BaseSystem from "./systems/BaseSystem";
import InputSystem from "./systems/InputSystem";
import SpatialLookupSystem from "./systems/SpatialLookupSystem";

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

    addSystem(...systems: BaseSystem[]) {
        for (const system of systems) {
            this.ecs.addSystem(system);
        }
    }

    removeSystem(system: BaseSystem) {
        this.ecs.removeSystem(system);
    }

    getSystem<T extends BaseSystem>(system: new (...args: any[]) => T): T {
        return this.ecs.getSystem(system) as T;
    }

    async init() {
        await this.app.init({
            resizeTo: window,
            autoDensity: true,

            // roundPixels: true,
            resolution: window.devicePixelRatio || 1,
            background: 0x000000,
            powerPreference: "high-performance",

            eventFeatures: {
                globalMove: false,
                move: false
            }
        });

        this.timeStart = Date.now();

        this.app.ticker.add((ticker) => this.ecs.update(1 / ticker.deltaMS));

        this.ecs
            .addSystem(new InputSystem)
            .addSystem(new SpatialLookupSystem);

        document.body.appendChild(this.app.canvas);

        this.app.canvas.focus();
    }
}