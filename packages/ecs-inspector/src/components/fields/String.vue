<script lang="ts">
export function matches(value: unknown): boolean {
	return typeof value === "string" ? 1 : 0;
}
</script>
<script lang="ts" setup>
const value = defineModel<string>();
</script>

<template>
	<dacite-textbox v-model="value" />
</template>
