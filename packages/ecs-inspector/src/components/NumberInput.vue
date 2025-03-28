<script lang="ts" setup>
const value = defineModel<number>();
</script>

<template>
<dacite-input-box>
	<input type="text" inputmode="numeric" pattern="[0-9\.,]*" v-model.number="value">
</dacite-input-box>
</template>
<style scoped>

</style>
