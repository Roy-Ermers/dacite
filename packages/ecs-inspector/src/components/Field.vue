<script lang="ts" setup>
import { type Component, computed, useId } from "vue";

const fields = import.meta.glob<{
	matches: (obj: unknown, name: string) => number | boolean;
	default: Component;
}>("./fields/*.vue", { eager: true });

export interface Props {
	name?: string;
}
const { name } = defineProps<Props>();

const value = defineModel({ required: true });

const field = computed(() => {
	let highestMatch = 0;
	let renderer = fields["./fields/Unknown.vue"].default;
	for (const field of Object.values(fields)) {
		const match = field.matches(value.value, name ?? "");
		if (typeof match === "boolean") {
			if (match) {
				return field.default;
			}
			continue;
		}

		if (match > highestMatch) {
			highestMatch = match;
			renderer = field.default;
		}
	}

	return renderer;
});
const id = useId();
</script>

<template>
	<label :for="id" v-if="name">{{name}}</label>
	<component :is="field" v-model="value" :id :name />
</template>
<style scoped>
	label {
		display: block;
		margin-block: 0.75rem 0.5rem;
		font-weight: 700;
	}
</style>
