<script lang="ts">
export function matches() {
	return 0;
}
</script>
<script lang="ts" setup>
export interface Props {
	name: string
}
const { name } = defineProps<Props>();

const value = defineModel<any>();
</script>

<template>
<p>
	{{ name }} Could not be displayed. ({{value?.constructor.name ?? value}})
</p>
</template>
