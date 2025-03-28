import {
	type Entity,
	EntitySystem,
	type InferQuerySet,
	Query
} from "@dacite/ecs";
import { Container, Graphics } from "pixi.js";
import {
	BoxCollider,
	CircleCollider,
	Collider,
	Transform
} from "../components";
import Engine from "../core.ts";

export default class CollisionDebuggerSystem extends EntitySystem {
	get query() {
		return new Query().has(Collider).has(Transform);
	}

	selectedEntity: Entity | null = null;

	graphics: Container;
	colliderDrawer = new WeakMap<Collider, Graphics>();

	constructor() {
		super();
		this.graphics = new Container();
		this.graphics.zIndex = 1000;
		this.graphics.label = "Collision Debugger";
	}

	override onEnable(): void {
		super.onEnable();
		Engine.instance.renderSystem.scene.addChild(this.graphics);
	}

	override onDisable(): void {
		super.onDisable();
		Engine.instance.renderSystem.scene.removeChild(this.graphics);
	}

	protected override onEntityUpdated(
		entity: Entity<InferQuerySet<this["query"]>>
	) {
		const collider = entity.get(Collider);
		const transform = entity.get(Transform);

		const graphics = this.colliderDrawer.get(collider);
		if (!graphics) return;

		graphics.position.set(transform.position.x, transform.position.y);
		graphics.rotation = transform.rotation;
	}

	protected override onEntityAdded(
		entity: Entity<InferQuerySet<this["query"]>>
	): void {
		const collider = entity.get(Collider);

		const graphics = new Graphics();
		graphics.strokeStyle = { color: 0xff0000, pixelLine: true };
		this.colliderDrawer.set(collider, graphics);
		this.graphics.addChild(graphics);

		if (collider instanceof BoxCollider) {
			graphics.strokeStyle.color = 0xff0000;
			graphics.pivot.set(collider.width / 2, collider.height / 2);
			graphics.rect(0, 0, collider.width, collider.height);
			graphics.stroke();
		}

		if (collider instanceof CircleCollider) {
			graphics.strokeStyle.color = 0x00ff00;
			graphics.circle(0, 0, collider.radius);
			graphics.stroke();
		}
	}

	protected override onEntityRemoved(
		entity: Entity<InferQuerySet<this["query"]>>
	): void {
		const collider = entity.get(Collider);
		const graphics = this.colliderDrawer.get(collider);
		if (!graphics) return;
		this.graphics.removeChild(graphics);
		this.colliderDrawer.delete(collider);
	}
}
