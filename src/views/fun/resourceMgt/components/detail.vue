<template>
	<div class="detail-container">
		<el-drawer
			v-model="detailVisible"
			title="详情"
			:direction="direction"
			:before-close="handleClose"
		>
			<ul>
				<li>资源名称：{{ detailData.name }}</li>
				<li>生产日期：{{ detailData.date }}</li>
				<li>生产地址：{{ detailData.address }}</li>
			</ul>
		</el-drawer>
	</div>
</template>

<script setup>
import { ref } from 'vue';
const detailVisible = ref(false);
const detailData = ref(null);
const openAction = (data) => {
	toggleDrawerVisible(true);
	detailData.value = data;
};
const toggleDrawerVisible = (bool) => {
	detailVisible.value = bool;
};
const handleClose = () => {
	toggleDrawerVisible(false);
};
defineExpose({
	openAction,
});
</script>