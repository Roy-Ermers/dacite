import Engine from "@dacite/core";
import { ActiveCamera, Camera, Transform } from "@dacite/core/components";
import { Vector2, lerp } from "@dacite/core/utils";
import {
	type Entity,
	EntityRef,
	EntitySystem,
	type InferQuerySet,
	Query
} from "@dacite/ecs";
import { CAMERA_FOCUS } from "../components/Tags";

export default class CameraSystem extends EntitySystem {
	public speed = 0.5;
	public targetZoom = 3;

	private cameraEntity = new EntityRef();

	get query() {
		return new Query().has(CAMERA_FOCUS).has(Transform);
	}

	override onEnable(): Promise<void> | void {
		super.onEnable();

		if (this.cameraEntity.isDead) {
			this.cameraEntity.value = this.scope
				.entity("Camera")
				.set(new Camera(1))
				.set(new Transform(Vector2.zero))
				.set(ActiveCamera);
		}
	}

	override update(): void {
		super.update();

		if (Engine.$.inputSystem.isPressed("e")) {
			this.cameraEntity.value?.destroy();
		}
	}

	protected override onEntityUpdated(
		entity: Entity<InferQuerySet<this["query"]>>
	) {
		const targetTransform = entity.get(Transform);
		const cameraTransform = this.cameraEntity.value?.get(Transform) ?? null;
		const camera = this.cameraEntity.value?.get(Camera) ?? null;

		if (!camera || !cameraTransform) {
			return;
		}

		this.targetZoom = Math.max(
			Math.abs(this.targetZoom + Engine.$.inputSystem.wheel),
			0.1
		);

		if (Math.abs(camera.zoom - this.targetZoom) > 0.01) {
			camera.zoom = lerp(camera.zoom, this.targetZoom, Engine.$.time.deltaTime);
		}

		cameraTransform.position.lerp(
			targetTransform.position,
			Engine.$.time.deltaTime,
			cameraTransform.position
		);
	}
}
