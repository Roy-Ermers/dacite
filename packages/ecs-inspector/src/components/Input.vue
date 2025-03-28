<script lang="ts" setup>
import { useTemplateRef, ref, watch, toRefs, computed } from "vue";

export interface Props {
	pattern?: string;
	placeholder?: string;
}
const props = defineProps<Props>();

const value = defineModel<string | number>({ default: "" });

const editableValue = ref(value.value);
const input = useTemplateRef("input");

const isEditing = ref(false);

watch(value, () => {
	if (!isEditing.value) {
		editableValue.value = value.value;
	}
});

const pattern = computed(() =>
	props.pattern ? new RegExp(`^${props.pattern}$`) : null
);

function onInput(e: Event) {
	const inputElement = e.target as HTMLElement;
	const textValue = inputElement.textContent || "";

	if (!input.value) return;

	if (pattern.value && !pattern.value.test(textValue)) {
		console.log("It doesn't match");
		inputElement.textContent = value.value.toString();

		e.preventDefault();
		return;
	}
	value.value = textValue;
}

function onBlur() {
	editableValue.value = value.value;
	isEditing.value = false;
}
</script>
<template>
<span
	class="input"
	ref="input"
	:data-is-empty="!value"
	:placeholder
	contenteditable="plaintext-only"
	@input="onInput"
	@focus="isEditing = true"
	@blur="onBlur"
	:pattern
>
	{{ editableValue }}
</span>
</template>
<style lang="css" scoped>
	.input {
		position: relative;
		min-height: 1lh;
		cursor: text;
	}

	.input[data-is-empty="true"]::before {
		content: attr(placeholder);
		position: absolute;
		inset: 0;
		opacity: 0.5;
	}
</style>
