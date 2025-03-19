<script lang="ts" setup>
const value = defineModel<string>();
</script>

<template>
	<input type="text" v-model="value">
</template>
<style scoped>
input {
	font: inherit;
	display: block;
	background: var(--surface-2);
	color: var(--text-2);
	border: 1px solid var(--surface-3);
	border-radius: var(--border-radius);
	width: 100%;
	padding: 0.25rem;
	transition: background-color 250ms linear, border-color 250ms linear;

	&:focus-visible {
		outline: none;
		border-color: var(--brand);
	}
}
</style>
