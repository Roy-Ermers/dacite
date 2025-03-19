<script lang="ts" setup>
import type { Entity } from "@dacite/ecs";
import { ref, computed } from "vue";
export interface Props {
	entities: Entity[];
}
const { entities } = defineProps<Props>();
const query = ref("");

const filteredEntities = computed(() => {
	if(!query.value)
		return entities;

	if(!Number.isNaN(Number(query.value)))
		return entities.filter((entity) => entity.id === Number(query.value));

	return entities.filter((entity) => {
			return entity.name.toLowerCase().includes(query.value.toLowerCase());
	});
});
</script>

<template>
	<scout-textbox placeholder="Search for entities" v-model="query" />
	<ul>
		<li v-for="entity of filteredEntities" :key="entity.id">
			<span class="id">{{ entity.id }}</span> {{ entity.name }}
		</li>
	</ul>
</template>
<style scoped>
	ul {
		padding-left: 0;
		list-style: none;
	}

	li {
		padding: 0.25rem;
		border-radius: var(--border-radius);
	}

	li:hover {
		background-color: var(--surface-2);
	}

	.id {
		font-size: 0.75rem;
		background-color: var(--brand);
		color: var(--text-1);
		padding: 0 0.25em;
		border-radius: var(--border-radius);
	}
</style>
