import type { Entity } from "@dacite/ecs";
import { type Ref, inject, readonly, ref } from "vue";
import DebugSystem from "../utils/DebugSystem";
import { ScopeInjectionKey } from "../utils/ScopeInjectionKey";

export default function useScope() {
	const scope = inject(ScopeInjectionKey);
	let system: DebugSystem | null = null;

	const _entities = ref<Entity[]>([]);

	function initializeConnection() {
		if (!scope)
			throw new Error(
				"No scope provided, are you sure you passed one to createInspector()"
			);

		system = new DebugSystem(_entities as Ref<Entity[]>);
		scope.addSystem(system);
	}

	initializeConnection();

	function createEntityRef(id: number) {
		return system?.createEntityProxy(id) ?? null;
	}

	return { entities: readonly(_entities), createEntityRef };
}
