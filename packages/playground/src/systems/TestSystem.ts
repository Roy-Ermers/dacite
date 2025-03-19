import { Entity, EntitySystem, Query, InferQuerySet } from "@dacite/ecs";
import { Renderable, Transform } from "@dacite/engine";
import Engine from "@dacite/engine/Engine.js";
import { Container } from "pixi.js";


const Clicked = Symbol.for("Clicked");

export default class RenderSystem extends EntitySystem {
	get query() {
		return new Query().has(Renderable);
	}

	protected override onEntityAdded(entity: Entity<InferQuerySet<this["query"]>>): void {
		const renderable = entity.get<Renderable<Container>>(Renderable);
		Engine.instance.app.stage.addChild(renderable.container);

		const entityId = entity.id;

		renderable.container.interactive = true;
		renderable.container.on("click", () => {
			const e = this.scope.getEntityById(entityId);
			if (!e) return;

			if (e.has(Clicked)) {
				console.log(e);
				e.destroy();
			} else
				e.set(Clicked);
		})
	}

	protected override onEntityRemoved(entity: Entity<InferQuerySet<this["query"]>>): void {
		const renderable = entity.get(Renderable);
		Engine.instance.app.stage.removeChild(renderable.container);
	}

	protected override onEntityUpdated(entity: Entity<InferQuerySet<this["query"]>>): void {
			const renderable = entity.get<Renderable<Container>>(Renderable);
			const transform = entity.get(Transform);

			if (!transform)
				return;

			renderable.container.position.set(transform.position.x, transform.position.y);
			renderable.container.rotation = transform.rotation;
			renderable.container.tint = entity.has(Clicked) ? 0xff0000 : 0xffffff;

			// if(entity.has(Clicked)) {
			// 	entity.destroy();
			// }

			transform.rotation += 0.01;
		}
	}
