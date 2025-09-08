import { Scope, type System } from "@dacite/ecs";
import { TextureSource } from "pixi.js";
import Time from "./Time";
import InputSystem from "./systems/InputSystem";
import RenderSystem from "./systems/RenderSystem";
import SpatialLookupSystem from "./systems/SpatialLookupSystem";

interface EngineOptions {
	canvas?: HTMLCanvasElement;
	systems?: System[];
	debug?: boolean;
}

export default class Engine {
	// biome-ignore lint: Should always be set.
	protected static _currentEngine: Engine = null!;

	static get $() {
		return Engine._currentEngine;
	}
	private _renderSystem: WeakRef<RenderSystem> | null = null;
	private _inputSystem: WeakRef<InputSystem> | null = null;

	get renderSystem() {
		const renderSystem = this._renderSystem?.deref();
		if (renderSystem) {
			return renderSystem;
		}

		const system = this.ecs.getSystem(RenderSystem);

		if (!system)
			throw new ReferenceError(
				"Engine has no RenderSystem. Please add one using Engine.ecs.addSystem()"
			);

		this._renderSystem = new WeakRef(system);
		return system;
	}

	get inputSystem() {
		const inputSystem = this._inputSystem?.deref();
		if (inputSystem) {
			return inputSystem;
		}

		const system = this.ecs.getSystem(InputSystem);

		if (!system)
			throw new ReferenceError(
				"Engine has no InputSystem. Please add one using Engine.ecs.addSystem()"
			);

		this._inputSystem = new WeakRef(system);
		return system;
	}

	// biome-ignore lint: This will be defined in the constructor
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
		this.setEngineContext();

		this._time = new Time(() => {
			this.setEngineContext();
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

	setEngineContext() {
		Engine._currentEngine = this;
	}

	async init(options?: EngineOptions) {
		if (options?.debug) {
			console.log("Debug mode enabled");
			this.ecs.eventbus.on("*", (...args) => console.log("⚡", ...args));
		}

		this.setEngineContext();

		this.ecs.eventbus.on("beforesystemadded", () => this.setEngineContext());
		this.ecs.eventbus.on("beforesystemremoved", () => this.setEngineContext());

		this._canvas =
			options?.canvas ??
			document.body.appendChild(document.createElement("canvas"));

		this.ecs
			.addSystem(new InputSystem(this._canvas))
			.addSystem(new SpatialLookupSystem());

		const systems = options?.systems ?? [new RenderSystem()];

		for (const system of systems) {
			this.ecs.addSystem(system);
		}

		const renderSystem = this.ecs.getSystem(RenderSystem);
		if (renderSystem) {
			this._renderSystem = new WeakRef(renderSystem);
		} else {
			this.ecs.addSystem(new RenderSystem());
		}
	}
}

Object.defineProperty(window, "__ENGINE__", {
	get() {
		return Engine.$;
	}
});
