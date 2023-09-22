<template>
	<el-drawer
		v-model="detailVisible"
		title="详情"
		class="resource-detail"
		:direction="direction"
		:before-close="handleClose"
	>
		<layout-drawer>
			<template v-slot:drawContent>
				<ul>
					<li>资源名称：{{ detailData.name }}</li>
					<li>生产日期：{{ detailData.date }}</li>
					<li>生产地址：{{ detailData.address }}</li>
				</ul>
			</template>
		</layout-drawer>
	</el-drawer>
</template>

<script setup>
import { ref } from 'vue';

const detailVisible = ref(false);
const detailData = ref(null);
const direction = ref('rtl');
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