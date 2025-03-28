<template>
	<div class="input-box">
		<slot/>
	</div>
</template>
<style scoped>
.input-box {
	display: block;
	background: var(--surface-2);
	color: var(--text-2);
	border: 1px solid var(--surface-3);
	border-radius: var(--border-radius);
	width: 100%;
	padding: 0.25rem;
	transition: background-color 250ms linear, border-color 250ms linear;

	&:has(:focus-visible) {
		outline: none;
		border-color: var(--brand);
	}

}
:slotted(*) {
	display: block;
	width: 100%;
	height: 100%;
}

:slotted(input) {
	display: block;
	background: none;
	border: none;
	color: inherit;
	font: inherit;
}

:slotted(:focus-visible) {
	outline: none;
}
</style>
