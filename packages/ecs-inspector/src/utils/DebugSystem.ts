import { Entity, EntitySystem, Query } from "@dacite/ecs";
import type { ComponentType } from "@dacite/ecs/utils";
import { type Ref, onScopeDispose, ref } from "vue";

interface ComponentRecord {
	type: ComponentType<unknown>;
	// biome-ignore lint: It is any because it can be any type of data.
	data: Ref<any>;
}
interface VueEntity {
	id: number;
	components: ComponentRecord[];
}
export default class DebugSystem extends EntitySystem {
	override query = new Query();

	links = new Map<number, Ref<VueEntity>>();

	constructor(private entityReference: Ref<Entity[]>) {
		super();
	}

	override onEnable(): Promise<void> | void {
		super.onEnable();
		this.entityReference.value = [
			...this.query.ids(this.scope).map(x => new Entity(x, this.scope))
		];
	}

	createEntityProxy(entityId: number) {
		const entity = new Entity(entityId, this.scope);
		if (!entity) return;

		const vueEntity = ref<VueEntity>({
			id: entityId,
			components: []
		});

		for (const [type, componentData] of entity.entries()) {
			const data = ref(componentData);
			// dispose.add(handle.stop);

			vueEntity.value.components.push({ type, data });
		}

		this.links.set(entityId, vueEntity);

		onScopeDispose(() => {
			this.links.delete(entityId);
		});

		return vueEntity;
	}

	override onEntityAdded(_entity: Entity) {
		// getting a new reference so that the old reference can be reused.
		const entity = this.scope.getEntityById(_entity.id);
		if (!entity) return;
		this.entityReference.value.push(entity);
	}

	override update() {
		for (const link of this.links.values()) {
			const entity = this.scope.getEntityById(link.value.id);
			if (!entity) continue;
			for (const component of link.value.components) {
				if (typeof component.type === "symbol") continue;
				// component.data.value = entity.get(component.type);
			}
		}
	}
}
