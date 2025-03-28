<script lang="ts" setup>
import { computed, ref, useId } from "vue";
import type { ComponentType } from "packages/ecs/src/utils";
import { getComponentName, ComponentParser } from "@dacite/ecs/utils";

export interface Props {
	type: ComponentType<unknown>;
	// biome-ignore lint: data can be anything.
	data: any;
}
const props = defineProps<Props>();

const componentName = computed(() => getComponentName(props.data.constructor));
const componentBaseType = computed(() =>
	getComponentName(ComponentParser.getBaseComponentType(props.type))
);
const expanded = ref(false);
const id = useId();
</script>
<template>
	<button
	v-bind="$attrs"
	class="component-header"
	@click="expanded = !expanded"
	:aria-expanded="expanded"
	:aria-controls="id"
	>
		{{ componentName }}
		<dacite-badge v-if="componentName !== componentBaseType && componentBaseType" :variant="componentBaseType">
		{{ componentBaseType }}
		</dacite-badge>
	</button>
	<transition>
		<div v-show="expanded" class="details" :id="id">
			<dacite-field
				v-for="key in Object.keys(data)"
				v-model="data[key]"
				:key
				:name="key"
			/>
		</div>
	</transition>
</template>
<style>
	@property --arrow-rotation {
		syntax: "<angle>";
		inherits: true;
		initial-value: 0deg;
	}
</style>
<style scoped>
	:global(.details > .details) {
		padding-inline-start: 1rem;
		border-inline-start:  1px solid var(--surface-2);
		border-block-end:  1px solid var(--surface-2);
		padding-block-end: 0;
	}

	.component-header {
		display: block;
		grid-column: full;
		width: 100%;
		padding: 0.25rem;
		font-weight: 700;
		color: var(--text-1);
		background: var(--surface-0);
		border: none;
		font: inherit;
		font-weight: 700;
		text-align: start;
		border-start-start-radius: var(--border-radius);
		border-start-end-radius: var(--border-radius);
		--arrow-rotation: 0deg;
	}


	.component-header::before {
		display: inline-block;
		content: "▶";
		margin-inline: 0.5rem 1rem;
		rotate: var(--arrow-rotation);
		transition: rotate 250ms ease;
	}

	.component-header[aria-expanded="true"] {
		background: var(--surface-2);
		--arrow-rotation: 90deg;
	}



	.details {
		transition: max-height 250ms ease;
		max-height: 9999px;
		overflow: hidden;
		padding-block-end: 1rem;
		border-block-start: 1px solid var(--surface-2);
		border-end-start-radius: var(--border-radius);
		border-end-end-radius: var(--border-radius);
	}

	.details.v-leave-to,
	.details.v-enter-from {
		max-height: 0;
	}

	.details:empty::after {
		content: "(No data)";
		display: block;
		text-align: center;
		margin-block-start: 1rem;
		color: var(--text-2);
	}
</style>
