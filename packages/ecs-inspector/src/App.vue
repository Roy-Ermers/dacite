<script lang="ts" setup>
import useScope from "./composables/useScope";

const { entities } = useScope();
</script>

<template>
	<header><span>Inspector</span> <input type="checkbox" class="stay-open" /></header>
	<scout-entity-list :entities />
</template>
<style scoped>
	header {
		grid-column: full;
		margin-block: 0 0.5rem;
		font-size: 1.5rem;
		padding: 0.25rem 0.5rem;
		border-block-end: 1px solid var(--surface-2);
		display: grid;
		grid-template-columns: 1fr auto;
	}
</style>
