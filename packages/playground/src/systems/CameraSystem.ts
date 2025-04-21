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
	public targetZoom = 3;
	private currentZoom = 3;
	private currentPosition = Vector2.zero;

	get query() {
		return new Query().has(CAMERA_FOCUS).has(Transform);
	}

	override onEnable(): Promise<void> | void {
		super.onEnable();

		Engine.instance.renderSystem.scene.scale.set(this.currentZoom);
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
			this.currentZoom = lerp(
				this.currentZoom,
				this.targetZoom,
				Engine.instance.time.deltaTime / Math.max(1, Math.log(this.currentZoom))
			);

			scene.scale.set(this.currentZoom);
		}

		this.currentPosition = this.currentPosition.lerp(
			transform.position,
			Engine.instance.time.deltaTime
		);

		scene.position.set(
			canvas.clientWidth / 2 - this.currentPosition.x * this.currentZoom,
			canvas.clientHeight / 2 - this.currentPosition.y * this.currentZoom
		);
	}
}
