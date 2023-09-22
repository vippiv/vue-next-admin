<template>
	<div class="draw-container">
		<div
			class="draw_content"
			v-if="$slots.drawContent"
		>
			<slot name="drawContent" />
		</div>
		<div
			class="draw_footer"
			v-if="$slots.drawFooter"
		>
			<slot name="drawFooter" />
		</div>
	</div>
</template>

<script setup name="LayoutDrawer">
</script>

<style lang="scss" scoped>
.draw-container {
	height: 100%;
	display: flex;
	flex-direction: column;
	.draw_content {
		flex: 1;
		padding: 16px 16px 0 16px;
		height: 0;
		overflow-y: auto;
	}
	.draw_footer {
		padding: 16px;
		text-align: center;
	}
}
</style>