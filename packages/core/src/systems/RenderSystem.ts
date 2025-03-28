import { Renderable, Transform } from "@dacite/core";
import {
	type Entity,
	EntitySystem,
	type InferQuerySet,
	Query
} from "@dacite/ecs";
import {
	type AutoDetectOptions,
	Container,
	type Renderer,
	autoDetectRenderer
} from "pixi.js";

export default class RenderSystem extends EntitySystem {
	renderer!: Renderer;
	scene: Container = new Container();
	//biome-ignore lint: no-undef
	canvas: HTMLCanvasElement = null!;
	renderObjects = new WeakMap<Renderable, Container>();

	private renderOptions: Partial<AutoDetectOptions>;
	private observer: ResizeObserver;

	get query() {
		return new Query().has(Renderable).has(Transform);
	}

	constructor(options?: Partial<AutoDetectOptions>) {
		super();
		this.renderOptions = options ?? {};
		this.observer = new ResizeObserver(() => this.onResize());
	}

	override async onEnable() {
		await super.onEnable();

		this.canvas =
			(this.renderOptions.canvas as HTMLCanvasElement) ??
			document.body.appendChild(document.createElement("canvas"));

		this.observer.observe(this.canvas);

		this.renderer = await autoDetectRenderer({
			resolution: window.devicePixelRatio,
			canvas: this.canvas,
			height: this.canvas.clientHeight,
			width: this.canvas.clientWidth,
			eventFeatures: {
				globalMove: false,
				move: false
			},
			...this.renderOptions
		});
	}

	override onDisable() {
		this.renderer.destroy();
		this.observer.disconnect();
	}

	onResize() {
		if (!this.renderer) return;

		const width = this.renderer.canvas.clientWidth;
		const height = this.renderer.canvas.clientHeight;
		this.renderer.resize(width, height);
	}

	override update() {
		super.update();
		this.renderer.render({ container: this.scene });
	}

	protected override onEntityAdded(
		entity: Entity<InferQuerySet<this["query"]>>
	) {
		const renderable = entity.get(Renderable);
		this.scene.addChild(renderable.container);
		renderable.container.label = entity.name;
	}

	protected override onEntityRemoved(
		entity: Entity<InferQuerySet<this["query"]>>
	) {
		const renderable = entity.get(Renderable);
		this.scene.removeChild(renderable.container);
	}

	protected override onEntityUpdated(
		entity: Entity<InferQuerySet<this["query"]>>
	) {
		const renderable = entity.get(Renderable);
		const transform = entity.get(Transform);

		renderable.container.position.set(
			transform.position.x,
			transform.position.y
		);
		renderable.container.rotation = transform.rotation;
	}
}
