<script lang="ts">
export function matches(value: unknown): number {
	return Array.isArray(value) ? 2 : 0;
}
</script>
<script lang="ts" setup>
const value = defineModel<any[]>({ default: () =>[] });
</script>

<template>
<p class="info">{{ value.length}} item(s)</p>
<ul class="elements">
	<li v-for="(_, index) in value.slice(10)" :key="index">
		<dacite-field v-model="value[index]" :name="''" />
	</li>
</ul>
</template>
<style scoped>
.info {
	font-size: 0.75rem;
	color: var(--text-2);
	border-block-end: 1px solid var(--surface-2);
	padding-block: 0.5rem;
	margin: 0;
}

.elements {
	padding: 0;
	margin: 0;
	list-style: none;
	grid-column: full;
}

.elements > li {
	padding-inline-start: 1rem;
	border-block-end: 1px solid var(--surface-2);
}
</style>
