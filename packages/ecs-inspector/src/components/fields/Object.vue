<script lang="ts">
export function matches(value: unknown): number {
	if (typeof value === "object" && !Array.isArray(value) && value !== null) {
		return 2;
	}

	return -1;
}
</script>
<script lang="ts" setup>
import { getComponentName } from "@dacite/ecs/utils";
import { computed } from "vue";
const value = defineModel<Record<string,any>>({ default: () =>({}) });
const keys = computed(()=>Object.keys(value.value).length);
</script>

<template>
	<span class="info" v-if="keys > 10">{{ getComponentName(value)}} {{ keys}} values(s)</span>
	<dacite-component v-else :type="value.constructor" :data="value" />
</template>
<style scoped>
.info {
	font-size: 0.75rem;
	color: var(--text-2);
}
</style>
