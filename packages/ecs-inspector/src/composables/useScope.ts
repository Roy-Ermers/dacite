import { computed, inject, ref } from "vue";
import { ScopeInjectionKey } from "../utils/ScopeInjectionKey";
import { Entity } from "@dacite/ecs";

export default function useScope() {
	const scope = inject(ScopeInjectionKey)!;
	if(!scope)
		throw new Error('No scope provided, are you sure you passed one to createInspector()');

	const _entities = ref<Entity[]>([]);
	const entities = computed<Entity[]>(() => {
		if (!_entities.value) initializeEntities();
		return _entities.value as Entity[];
	});

	function initializeEntities() {
		for(const id of scope.ids()) {
			const entity = scope.getEntityById(id);
			if(entity) _entities.value.push(entity);
		}

		scope.eventbus.on("entitycreated", entity => _entities.value.push(new Entity(entity.id, scope)));
		scope.eventbus.on("entitydestroyed", entity => {
			const index = _entities.value.findIndex(e => e.id === entity.id);
			if (index !== -1) _entities.value.splice(index, 1);
		});
	}

	initializeEntities();

	return {entities};
}
