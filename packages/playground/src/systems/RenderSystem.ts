import {
	type Entity,
	EntitySystem,
	type InferQuerySet,
	Query
} from "@dacite/ecs";
import { Renderable, Transform } from "@dacite/engine";
import {
	type AutoDetectOptions,
	Container,
	type Renderer,
	autoDetectRenderer
} from "pixi.js";

export default class RenderSystem extends EntitySystem {
	renderer!: Renderer;
	container: Container = new Container();

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

		const canvas =
			(this.renderOptions.canvas as HTMLCanvasElement) ??
			document.appendChild(document.createElement("canvas"));

		this.observer.observe(canvas);

		this.renderer = await autoDetectRenderer({
			resolution: window.devicePixelRatio,
			canvas,
			height: canvas?.clientHeight,
			width: canvas?.clientWidth,
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
		this.renderer.render({ container: this.container });
	}

	protected override onEntityAdded(
		entity: Entity<InferQuerySet<this["query"]>>
	) {
		const renderable = entity.get(Renderable);
		this.container.addChild(renderable.container);
	}

	protected override onEntityRemoved(
		entity: Entity<InferQuerySet<this["query"]>>
	) {
		const renderable = entity.get(Renderable);
		this.container.removeChild(renderable.container);
	}

	protected override onEntityUpdated(
		entity: Entity<InferQuerySet<this["query"]>>
	) {
		const renderable = entity.get<Renderable<Container>>(Renderable);
		const transform = entity.get(Transform);

		renderable.container.position.set(
			transform.position.x,
			transform.position.y
		);
		renderable.container.rotation = transform.rotation;

		transform.rotation += 0.01;
	}
}
