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
				</template>
			</el-table-column>
		</el-table>
		<detail ref="detailRef"></detail>
		<edit
			ref="editRef"
			@updateRowData="handleUpdateRowData"
		></edit>
	</div>
</template>

<script setup>
import { ref, inject } from 'vue';
import Detail from './components/detail.vue';
import Edit from './components/edit.vue';
const $dayjs = inject('$dayjs');
const mockData = {
	list: [
		{
			id: 1,
			name: '海康采集站',
			date: '2029-10-10',
			address: '中国上海长宁区',
		},
	],
};
const stateTableData = ref(mockData.list);
const detailRef = ref(null);
const editRef = ref(null);

const handleDetail = (rowData) => {
	detailRef.value.openAction(rowData);
};
const handleEdit = (rowData) => {
	editRef.value.openAction(rowData);
	console.log('🚀 ~ file: index.vue:64 ~ handleEdit ~ detailRef:', detailRef);
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
/**
 * 提取列表字段，凑成对象，这个对象决定了编辑，详情显示的内容
 * 详情和编辑就不需要写那么多dom
 */
</script>