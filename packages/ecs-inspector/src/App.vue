<script lang="ts" setup>
import { ref } from "vue";
import useScope from "./composables/useScope";
import type { Entity } from "@dacite/ecs";

const { entities } = useScope();
const selectedEntity = ref(null as Entity | null);
</script>

<template>
	<header>
		<button
			v-if="selectedEntity"
			class="close"
			@click="selectedEntity = null"
		>
			&cross;
		</button>
		<span>Inspector</span>
		<input type="checkbox" class="stay-open" />
	</header>
	<transition mode="out-in">
		<dacite-entity-list
			v-if="selectedEntity == null"
			:entities
			@click="selectedEntity = $event"
		/>
		<dacite-entity-details v-else :entity-id="selectedEntity.id" />
	</transition>
</template>
<style scoped>
	header {
		grid-column: full;
		margin-block: 0 0.5rem;
		font-size: 1.5rem;
		padding: 0.25rem 0.5rem;
		border-block-end: 1px solid var(--surface-2);
		display: flex;
	}

	header > span {
		flex: 1;
	}

	.close {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: var(--text-1);
		cursor: pointer;
		padding: 0.25rem;
		width: 1.75rem;
		height: 1.75rem;
		line-height: 1rem;
		display: inline-block;
		font-size: 1rem;
	}

	.v-enter-active,
	.v-leave-active {
		transition: translate 250ms ease, opacity 250ms ease;
	}

	.v-enter-from {
		translate: 100% 0;
		opacity: 0;
	}

	.v-leave-to {
		translate: -100% 0;
		opacity: 0;
	}

	.v-enter-to,
	.v-leave-to {
		translate: 0 0;
		opacity: 1;
	}
</style>
