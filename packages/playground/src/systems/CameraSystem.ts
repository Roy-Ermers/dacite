import Engine from "@dacite/core";
import { Transform } from "@dacite/core/components";
import { InputSystem } from "@dacite/core/systems";
import { Vector2, lerp } from "@dacite/core/utils";
import {
	type Entity,
	EntitySystem,
	type InferQuerySet,
	Query
} from "@dacite/ecs";
import { CAMERA_FOCUS } from "../components/Tags";

export default class CameraSystem extends EntitySystem {
	public speed = 0.5;
	public targetZoom = 1;
	private currentZoom = 1;
	private currentPosition = Vector2.zero;

	get query() {
		return new Query().has(CAMERA_FOCUS).has(Transform);
	}

	protected override onEntityUpdated(
		entity: Entity<InferQuerySet<this["query"]>>
	) {
		const transform = entity.get(Transform);

		const { scene, canvas } = Engine.instance.renderSystem;

		this.targetZoom = Math.max(
			Math.abs(this.targetZoom + InputSystem.instance.wheel),
			0.1
		);

		if (Math.abs(this.currentZoom - this.targetZoom) > 0.01) {
			this.currentZoom = lerp(this.currentZoom, this.targetZoom, this.speed);

			scene.scale.set(this.currentZoom);
		}

		const distance = this.currentPosition.distance(transform.position);
		this.currentPosition = this.currentPosition.lerp(transform.position, 0.5);

		scene.position.set(
			canvas.clientWidth / 2 - this.currentPosition.x * this.currentZoom,
			canvas.clientHeight / 2 - this.currentPosition.y * this.currentZoom
		);
	}
}
