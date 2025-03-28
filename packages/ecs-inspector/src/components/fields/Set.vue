<script lang="ts">
export function matches(value: unknown): boolean {
	return value instanceof Set;
}
</script>
<script lang="ts" setup>
const value = defineModel<Set<unknown>>();
</script>
<template>
	<ul>
		<li v-for="item of value" :key="item">
			{{ item }}
		</li>
	</ul>
</template>
