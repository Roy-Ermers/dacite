import { Scope } from "@dacite/ecs";
import { TextureSource } from "pixi.js";
import InputSystem from "./systems/InputSystem";
import RenderSystem from "./systems/RenderSystem";
import SpatialLookupSystem from "./systems/SpatialLookupSystem";

interface EngineOptions {
	canvas?: HTMLCanvasElement;
	debug?: boolean;
}

export default class Engine {
	/* */
	// biome-ignore lint: This will be defined in the constructor
	public static instance: Engine = null!;
	// biome-ignore lint: This will be defined in the constructor
	renderSystem: RenderSystem = null!;

	public get elapsedTime() {
		return Date.now() - this.timeStart;
	}

	public readonly ecs = new Scope();

	private timeStart = 0;

	constructor() {
		if (Engine.instance) {
			throw new Error("Game is already instantiated");
		}

		Engine.instance = this;

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

		this.timeStart = Date.now();
		const canvas =
			options?.canvas ??
			document.body.appendChild(document.createElement("canvas"));

		this.renderSystem = new RenderSystem({
			canvas
		});

		this.ecs
			.addSystem(new InputSystem(canvas))
			.addSystem(this.renderSystem)
			.addSystem(new SpatialLookupSystem());
	}
}
