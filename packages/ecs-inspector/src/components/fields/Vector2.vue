<script lang="ts">
import { Vector2 } from "@dacite/core";
export function matches(value: unknown): boolean {
	return value instanceof Vector2;
}
</script>
<script lang="ts" setup>
import { computed } from "vue";
const value = defineModel<Vector2>({ required: true });

const x = computed({
	get() {
		return value.value.x;
	},
	set(v: number) {
		value.value.x = v || 0;
	}
});

const y = computed({
	get() {
		return value.value.y;
	},
	set(v: number) {
		value.value.y = v || 0;
	}
});
</script>
<template>
	<div class="vector-2">
		<dacite-number-input v-model="x" />
		<dacite-number-input v-model="y" />
	</div>
</template>
<style>
	.vector-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}
</style>
