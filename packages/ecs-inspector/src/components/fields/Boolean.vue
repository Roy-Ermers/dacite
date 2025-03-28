<script lang="ts">
export function matches(value: unknown): number {
	return typeof value === "boolean" ? 1 : 0;
}
</script>
<script lang="ts" setup>
const value = defineModel<boolean>({ default: false });
</script>

<template>
	<input type="checkbox" v-model="value" />
</template>
