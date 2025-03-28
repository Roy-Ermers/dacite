<script lang="ts">
export function matches(value: unknown): boolean {
	return typeof value === "string";
}
</script>
<script lang="ts" setup>
const value = defineModel<string>();
</script>

<template>
	<dacite-input-box>
		<dacite-input v-model="value" v-bind="$attrs" />
	</dacite-input-box>
</template>
<style scoped>
</style>
