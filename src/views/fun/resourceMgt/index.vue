<template>
	<div class="resource-mgt-container">
		<el-table
			:data="stateTableData"
			style="width: 100%"
		>
			<el-table-column
				prop="name"
				label="资源名称"
			/>
			<el-table-column
				prop="date"
				label="生产日期"
			/>
			<el-table-column
				prop="address"
				label="生产地址"
			/>
			<el-table-column
				prop="totalCapacity"
				label="产品容量"
			>
				<template #default="scope"> {{ getfilesize(scope.row.usedCapacity, 'G') }} / {{ getfilesize(scope.row.totalCapacity, 'G') }} </template>
			</el-table-column>
			<el-table-column
				fixed="right"
				label="操作"
			>
				<template #default="scope">
					<el-button
						link
						type="primary"
						size="small"
						@click="handleDetail(scope.row)"
						>详情</el-button
					>
					<el-button
						link
						type="primary"
						size="small"
						@click="handleEdit(scope.row)"
						>编辑</el-button
					>
					<el-button
						link
						type="primary"
						size="small"
						@click="handleSetting(scope.row)"
						>修改配置</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			layout="prev, pager, next"
			:total="1000"
		/>
		<detail ref="detailRef"></detail>
		<edit
			ref="editRef"
			@updateRowData="handleUpdateRowData"
		></edit>
		<setting
			ref="settingRef"
			@updateSetting="handleUpdateSetting"
		></setting>
	</div>
</template>

<script setup>
import { ref, inject, onBeforeMount } from 'vue';
import { getfilesize } from '/@/utils/toolsOther.ts';
import Detail from './components/detail.vue';
import Edit from './components/edit.vue';
import Setting from './components/setting.vue';
import { resourceMgtApi } from '/@/api/resource/index.ts';
// import { storeToRefs } from 'pinia';
// import { userInfo2 } from '/@/stores/userInfo2.ts'; // TODO 这种引入方式不对
const $dayjs = inject('$dayjs');
const getResourceApi = resourceMgtApi();
const stateTableData = ref(null);
const detailRef = ref(null);
const editRef = ref(null);
const settingRef = ref(null);

// const testStore = userInfo2();
// const { counter, doubleCounter } = storeToRefs(testStore);
// const { increaseCounter } = testStore;
const getLists = () => {
	getResourceApi.getResource().then((res) => {
		if (res.code === 0) {
			stateTableData.value = res.data;
		}
	});
};
const handleDetail = (rowData) => {
	detailRef.value.openAction(rowData);
};
const handleEdit = (rowData) => {
	editRef.value.openAction(rowData);
	console.log('🚀 ~ file: index.vue:64 ~ handleEdit ~ detailRef:', detailRef);
};
const handleSetting = (rowData) => {
	settingRef.value.openAction(rowData);
	console.log('🚀 ~ file: index.vue:93 ~ handleSetting ~ rowData:', rowData);
};
const handleUpdateRowData = (newData) => {
	console.log('🚀 ~ file: index.vue:75 ~ handleUpdateRowData ~ newData:', newData.value);
	const { id, name, date, address } = newData.value;
	const target = stateTableData.value.find((item) => item.id === id);
	if (target) {
		target.name = name;
		target.date = $dayjs(date).format('YYYY-MM-DD');
		target.address = address;
	}
};
const handleUpdateSetting = (settingData) => {
	console.log('🚀 ~ file: index.vue:124 ~ handleUpdateSetting ~ settingData:', settingData);
	const target = stateTableData.value.find((item) => item.id === settingData.value.id);
	if (target) {
		target.totalCapacity = parseFloat(stateTableData.value.totalCapacity);
	}
};
onBeforeMount(() => {
	getLists();
});

/**
 * 提取列表字段，凑成对象，这个对象决定了编辑，详情显示的内容
 * 详情和编辑就不需要写那么多dom
 */
</script>

<style lang="scss" scoped>
.resource-mgt-container {
	flex: 1;
	display: flex;
	flex-direction: column;
	:deep(.el-table) {
		flex: 1;
	}
	:deep(.el-pagination) {
		padding: 10px 0;
		width: 100%;
		justify-content: flex-end;
		background-color: white;
	}
}
</style>