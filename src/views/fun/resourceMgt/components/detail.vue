<template>
	<div class="detail-container">
		<el-drawer
			v-model="detailVisible"
			title="I am the title"
			:direction="direction"
			:before-close="handleClose"
		>
			<span>Hi, there!</span>
		</el-drawer>
	</div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
const detailVisible = ref(false);
const openAction = () => {
	detailVisible.value = true;
};
defineExpose({
	openAction,
});
</script>