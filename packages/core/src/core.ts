import { Scope } from "@dacite/ecs";
import { TextureSource } from "pixi.js";
import Time from "./Time";
import InputSystem from "./systems/InputSystem";
import RenderSystem from "./systems/RenderSystem";
import SpatialLookupSystem from "./systems/SpatialLookupSystem";

interface EngineOptions {
	canvas?: HTMLCanvasElement;
	renderSystem?: RenderSystem;
	debug?: boolean;
}

export default class Engine {
	/* */
	// biome-ignore lint: This will be defined in the constructor
	public static instance: Engine = null!;
	// biome-ignore lint: This will be defined in the constructor
	renderSystem: RenderSystem = null!;

	// biome-ignore lint: This will be defined in the constructor
	private _canvas: HTMLCanvasElement = null!;

	public get canvas() {
		return this._canvas;
	}

	private _time: Time;

	public get time() {
		return this._time;
	}

	public readonly ecs = new Scope();

	constructor() {
		if (Engine.instance) {
			throw new Error("Game is already instantiated");
		}

		Engine.instance = this;

		this._time = new Time(() => {
			this.ecs.update();
		});

		TextureSource.defaultOptions.scaleMode = "nearest";
		TextureSource.defaultOptions.mipmapFilter = "nearest";
		TextureSource.defaultOptions.minFilter = "linear";
		TextureSource.defaultOptions.magFilter = "nearest";
		TextureSource.defaultOptions.autoGenerateMipmaps = true;

		/* @ts-ignore-next-line To support devtools */
		globalThis.__ECS__ = this.ecs;
	}

	async init(options?: EngineOptions) {
		if (options?.debug) {
			console.log("Debug mode enabled");
			this.ecs.eventbus.on("*", (...args) => console.log("⚡", ...args));
		}

		this._canvas =
			options?.canvas ??
			document.body.appendChild(document.createElement("canvas"));

		this.renderSystem = options?.renderSystem ?? new RenderSystem();

		this.ecs
			.addSystem(new InputSystem(this._canvas))
			.addSystem(this.renderSystem)
			.addSystem(new SpatialLookupSystem());
	}
}
