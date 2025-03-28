<script lang="ts">
export function matches(value: unknown, name: string): boolean {
	return typeof value === "number" && name === "rotation";
}
</script>
<script lang="ts" setup>
import { computed } from "vue";
const value = defineModel<number>({ default: 0 });
const RAD_TO_DEG = 180 / Math.PI;
const rotation = computed({
	get() {
		return Math.round(value.value * RAD_TO_DEG);
	},
	set(v: number) {
		value.value = Number((v || 0) / RAD_TO_DEG) || 0;
	}
});
</script>

<template>
<dacite-input-box>
	<dacite-input v-model="rotation" pattern="[0-9,\.]*"/>
	</dacite-input-box>
</template>
<style scoped>
.input::after {
	content: 'deg';
	opacity: 0.5;
}
</style>
