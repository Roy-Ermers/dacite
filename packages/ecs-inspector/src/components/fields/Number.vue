<script lang="ts">
export function matches(value: unknown): number {
	return typeof value === "number" ? 1 : 0;
}
</script>
<script lang="ts" setup>
const value = defineModel<number>();
</script>

<template>
	<dacite-number-input v-model="value" />
</template>
