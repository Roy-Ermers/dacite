<script lang="ts" setup>
import useScope from "../composables/useScope";
import { NAME_SYMBOL, TAG_SYMBOL } from "@dacite/ecs";
import { getComponentName } from "@dacite/ecs/utils";
import { toRefs, computed } from "vue";
export interface Props {
	entityId: number;
}

const props = defineProps<Props>();
const { entityId } = toRefs(props);

const { createEntityRef } = useScope();
const entity = createEntityRef(entityId.value);

const name = computed(
	() =>
		entity?.value.components.find(x => x.type === NAME_SYMBOL)?.data ??
		`Entity ${entityId.value}`
);

const tags = computed(() => {
	const tagSet = (entity?.value.components.find(x => x.type === TAG_SYMBOL)
		?.data ?? new Set()) as Set<symbol>;
	return [...tagSet].map(x => getComponentName(x));
});

const components = computed(
	() =>
		entity?.value.components.filter(
			x => ![NAME_SYMBOL, TAG_SYMBOL].includes(x.type as symbol)
		) ?? []
);
</script>

<template>
<div class="entity-details">
	<h1><dacite-badge>{{ entityId}}</dacite-badge> {{name}}</h1>
	<p class="tags" v-if="tags.length">
		<dacite-badge v-for="tag in tags" :key="tag" :variant="tag">
			{{ tag }}
		</dacite-badge>
	</p>
	<dacite-component
		v-for="({type, data}) of components"
		:key="type"
		:type
		:data
	/>
</div>
</template>
<style lang="css" scoped>
.entity-details {
	display: grid;
	grid-column: full;
	grid-template-columns: subgrid;
	overflow: auto;
	min-height: 0;
	max-height: 100%;
}

.entity-details > * {
	grid-column: main;
}

h1 {
	font-size: 1.25rem;
	margin-block: 0 0.5rem;
}

p.tags {
	grid-column: full;
	padding: 0.5rem;
	margin-block: 0 0.5rem;
	border-block-end: 1px solid var(--surface-2);
}

p.tags .badge {
	margin-inline-end: 0.5rem;
}
</style>
