<template>
	<layout-list class="table-selection-container">
		<template v-slot:headerSearchBar>
			<search-bar></search-bar>
		</template>
		<template v-slot:headerAction>
			<el-button>新增</el-button>
			<el-button @click="tableSelectionVis = true">table selection</el-button>
		</template>
		<template v-slot:tableContent>
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
		</template>
		<template v-slot:pagination>
			<el-pagination
				layout="prev, pager, next"
				:total="1000"
			/>
		</template>
		<table-selection
			v-if="tableSelectionVis"
			v-model:chooseList="stateTableData"
			:tableDataApi="getTableSelectionApi.getTableSectionList"
			:tableSelectionVis="tableSelectionVis"
			@close="tableSelectionVis = false"
		></table-selection>
	</layout-list>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { tableSelectionApi } from '/@/api/tableSelection/index.ts';
const getTableSelectionApi = tableSelectionApi();
const stateTableData = ref(null);
const tableSelectionVis = ref(false);
const getLists = () => {
	getTableSelectionApi.getResource().then((res) => {
		if (res.code === 0) {
			// stateTableData.value = res.data;
			stateTableData.value = res.data.concat([
				{
					kbId: 22,
					name: '第二十二节课',
					date: '2039-10-11',
					sharer: '桥东',
				},
			]);
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

onBeforeMount(() => {
	getLists();
});

/**
 * 提取列表字段，凑成对象，这个对象决定了编辑，详情显示的内容
 * 详情和编辑就不需要写那么多dom
 */
</script>

<style lang="scss" scoped>
.table-selection-container {
	:deep(.list_header_action) {
		text-align: right;
	}
}
</style>