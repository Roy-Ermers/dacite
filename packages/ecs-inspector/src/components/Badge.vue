<script lang="ts" setup>
import { computed } from "vue";

export interface Props {
	/**
	 * If assigned, generate a random color based with `variant` as seed.
	 */
	variant?: string;
}
const { variant } = defineProps<Props>();

const color = computed(() => {
	if (!variant) return "var(--brand)";
	let hash = 7;

	for (const c of variant) {
		hash = hash * 31 + c.charCodeAt(0);
	}
	const h = hash % 360;
	const l = (hash % 35) + 10;
	return `hsl(${h}deg, ${50}%, ${l % 100}%)`;
});
</script>
<template>
<span class="badge">
	<slot />
</span>
</template>
<style scoped>
.badge {
	font-size: 0.75em;
	background-color: v-bind(color);
	color: var(--text-1);
	padding: 0 0.25em;
	border-radius: var(--border-radius);
	line-height: 1em;
	vertical-align: baseline;
}
</style>
