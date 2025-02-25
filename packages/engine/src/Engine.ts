import Entity from "@scout/engine/entities/Entity.ts";
import BaseSystem from "@scout/engine/systems/BaseSystem.ts";
import InputSystem from "@scout/engine/systems/InputSystem.ts";
import SpatialLookupSystem from "@scout/engine/systems/SpatialLookupSystem.ts";
import { Application, TextureSource } from "pixi.js";
import { Engine as EcsEngine } from "tick-knock";
import RenderSystem from "./systems/RenderSystem";

export default class Engine {
    public static instance: Engine = null!;
    public get ticker() {
        return this.app.ticker;
    }

    public get elapsedTime() {
        return Date.now() - this.timeStart;
    }

    public readonly app: Application;
    public readonly ecs = new EcsEngine();

    private timeStart: number = 0;

    constructor() {
        if (Engine.instance) {
            throw new Error("Game is already instantiated");
        }

        Engine.instance = this;
        this.app = new Application();

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

    createEntity(name: string) {
        const entity = new Entity(name);
        this.ecs.addEntity(entity.ecsEntity);
        return entity;
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
            .addSystem(new RenderSystem)
            .addSystem(new InputSystem)
            .addSystem(new SpatialLookupSystem);

        document.body.appendChild(this.app.canvas);

        this.app.canvas.focus();
    }
}