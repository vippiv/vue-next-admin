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
				<template #default>
					<el-button
						link
						type="primary"
						size="small"
						@click="handleClick"
						>详情</el-button
					>
					<el-button
						link
						type="primary"
						size="small"
						@click="handleEdit"
						>编辑</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<detail ref="detailRef"></detail>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import Detail from './components/detail.vue';
const mockData = {
	list: [
		{
			id: 1,
			name: '大剪刀',
			date: '2029-10-10',
			address: '加利福利亚',
		},
	],
};
const stateTableData = ref(mockData.list);
const detailRef = ref(null);

const handleClick = () => {};
const handleEdit = () => {
	detailRef.value.openAction();
	console.log('🚀 ~ file: index.vue:64 ~ handleEdit ~ detailRef:', detailRef);
};
</script>