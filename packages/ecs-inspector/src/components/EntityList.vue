<script lang="ts" setup>
import type { Entity } from "@dacite/ecs";
import { ref, computed } from "vue";
export interface Props {
	entities: Entity[];
}
const { entities } = defineProps<Props>();
const query = ref("");
// biome-ignore lint: This is more readable.
const emit = defineEmits<{ (event: "click", entity: Entity): void }>();

const filteredEntities = computed(() => {
	if (!query.value) return entities;

	if (!Number.isNaN(Number(query.value)))
		return entities.filter(entity => entity.id === Number(query.value));

	return entities.filter(entity => {
		return entity.name.toLowerCase().includes(query.value.toLowerCase());
	});
});
</script>

<template>
	<div class="entity-list">
		<dacite-textbox placeholder="Search for entities" v-model="query" />
		<ul>
			<li v-for="entity of filteredEntities" :key="entity.id" >
				<button @click="emit('click', entity)">
					<dacite-badge>{{ entity.id }}</dacite-badge> {{ entity.name }}
				</button>
			</li>
		</ul>
	</div>
</template>
<style scoped>
.entity-list {
	display: grid;
	grid-column: full;
	grid-template-columns: subgrid;
}

.entity-list > * {
	grid-column: main;
}

ul {
	padding-left: 0;
	list-style: none;
}

button {
	padding: 0.25rem;
	border-radius: var(--border-radius);
	background: none;
	display: block;
	width: 100%;
	text-align: start;
	border: none;
	font: inherit;
	font-size: inherit;
	color: inherit;
}

button:hover, button:focus-visible {
	background-color: var(--surface-2);
}
</style>
