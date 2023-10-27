<template>
	<el-dialog
		width="80%"
		@close="handleClose"
		v-model="dialogVisible"
	>
		<template #header="{}">
			<div class="my-header">
				<div>选择知识</div>
				<div>已选知识</div>
			</div>
		</template>
		<div class="knowledge-choose">
			<div class="left">
				<el-form
					:model="queryParams"
					ref="queryFormRef"
					:inline="true"
					label-width="0"
				>
					<el-form-item label="">
						<el-input
							v-model="queryParams.name"
							placeholder="知识名称"
							clearable
							class="!w-200px"
						/>
					</el-form-item>
					<el-form-item>
						<el-button
							type="primary"
							icon="Search"
							@click="search"
							>搜索</el-button
						>
						<el-button
							icon="Refresh"
							@click="handleResetSearch"
							>重置</el-button
						>
					</el-form-item>
				</el-form>
				<el-table
					ref="multipleTableRef"
					v-loading="loading"
					:height="450"
					:data="tableData"
					row-key="kbId"
					style="width: 100%"
					@selection-change="handleSelectionChange"
				>
					<el-table-column
						type="selection"
						:reserve-selection="true"
						width="55"
					/>
					<el-table-column
						label="知识名称"
						prop="name"
					/>
					<el-table-column
						label="分享人"
						prop="sharer"
					/>
					<el-table-column
						fixed="right"
						label="操作"
						width="100"
					>
						<template #default="scope">
							<el-button
								link
								type="primary"
								size="small"
								@click="handleDownload(scope.row)"
								>下载</el-button
							>
						</template>
					</el-table-column>
				</el-table>
				<div class="relative mr-20px">
					<el-pagination
						v-show="total > 0"
						layout="prev, pager, next"
						:total="total"
						:current-page="pageParams.pageNum"
						:page-size="pageParams.pageSize"
						@current-change="handleCurrentChange"
						@size-change="search"
					/>
				</div>
			</div>
			<div class="right">
				<div>
					<div v-if="chooseList.length">
						<ul class="choosed-knowledge-container">
							<li
								v-for="(item, index) in chooseList"
								:key="index"
							>
								<div class="del-icon">
									<el-icon @click="handleDel(item)">
										<el-icon><CircleClose /></el-icon>
									</el-icon>
								</div>
								<div class="name">{{ item.name }}</div>
								<div class="duration">
									要求完成时长
									<el-input-number
										class="duration-input"
										v-model="item.requireTimeMinute"
										:step="1"
										:max="60"
										:min="0"
										size="small"
									/>
									分
									<el-input-number
										class="duration-input"
										v-model="item.requireTimeSecond"
										:step="1"
										:max="60"
										:min="0"
										size="small"
									/>
									秒
								</div>
							</li>
						</ul>
					</div>
					<div v-else>当前暂无已选中的知识</div>
				</div>
			</div>
		</div>
		<el-row justify="end">
			<el-button
				type="primary"
				@click="handleSubmit"
				>确 定</el-button
			>
		</el-row>
	</el-dialog>
</template>

<script setup>
import { getCurrentInstance, ref, reactive, onBeforeMount } from 'vue';
const props = defineProps({
	tableSelectionVis: {
		type: Boolean,
	},
	chooseList: {
		type: Array,
		default: () => [],
	},
	tableDataApi: {
		type: Function,
	},
});
const { proxy } = getCurrentInstance();
const emits = defineEmits(['update:chooseList', 'close']);
const chooseList = ref(props.chooseList);
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const dialogVisible = ref(props.tableSelectionVis);
const isTrigerTableChangeEvent = ref(true);
const queryParams = reactive({
	name: '',
	category: [],
});
const pageParams = reactive({
	pageNum: 1,
	pageSize: 5,
});

onBeforeMount(async () => {
	initData();
});

/** 数据初始化 */
const initData = () => {
	search();
};

const handleSelectionChange = (val) => {
	console.log('🚀 ~ file: index.vue:176 ~ handleSelectionChange ~ val:', val);
	if (!isTrigerTableChangeEvent.value) return;
	chooseList.value = val.map((item) => {
		return Object.assign({}, item, {
			kbId: item.kbId,
			name: item.name,
			requireTimeMinute: item.requireTimeMinute,
			requireTimeSecond: item.requireTimeSecond,
		});
	});
};

const search = () => {
	loading.value = true;
	const data = { ...queryParams };
	const params = { ...pageParams };
	props
		.tableDataApi({ ...data, ...params })
		.then((res) => {
			tableData.value = res.data;
			total.value = res.total;
			setTimeout(() => {
				checkTableDataAndStickExtendField();
			}, 500);
		})
		.finally(() => (loading.value = false));
};
const handleResetSearch = () => {
	pageParams.pageNum = 1;
	queryParams.name = '';
	queryParams.category = [];
	search();
};

/** 提交用户选择 */
const handleSubmit = () => {
	emits('update:chooseList', chooseList.value);
	dialogVisible.value = false;
	handleClose();
};

const handleDel = (obj) => {
	const target = tableData.value.find((item) => item.kbId === obj.kbId);
	console.log('🚀 ~ file: index.vue:219 ~ handleDel ~ target:', target);
	if (target) {
		proxy.$refs['multipleTableRef'].toggleRowSelection(target, false);
	} else {
		chooseList.value = chooseList.value.filter((item) => item.kbId !== obj.kbId);
		// 把已选的数据clearSelection后·重新render一下，组件内部对于不存在的selection处理不好
		checkTableDataAndStickExtendField();
	}
};

/** 下载 */
const handleDownload = (rowData) => {
	console.log('🚀 ~ file: index.vue:264 ~ handleDownload ~ rowData:', rowData);
};

/** 把已选的数据给勾选上 */
const checkTableDataAndStickExtendField = () => {
	isTrigerTableChangeEvent.value = false;
	proxy.$refs['multipleTableRef'].clearSelection();
	chooseList.value.forEach((row) => {
		const target = tableData.value.find((item) => item.kbId === row.kbId);
		console.log('🚀 ~ file: index.vue:230 ~ tableData.value.forEach ~ target:', target);
		if (target) {
			proxy.$refs['multipleTableRef'].toggleRowSelection(target, true);
		} else {
			// 这里能保证再次选择是数据不会丢失
			proxy.$refs['multipleTableRef'].toggleRowSelection(row, true);
		}
	});
	isTrigerTableChangeEvent.value = true;
};

const handleCurrentChange = (val) => {
	pageParams.pageNum = val;
	search();
};

const handleClose = () => {
	emits('close', false);
};
</script>

<style lang="scss" scoped>
.knowledge-choose {
	display: grid;
	grid-template-columns: 2fr 1fr;
	.left {
		padding-right: 5px;
	}
	.right {
		padding-left: 5px;
	}
}
.choosed-knowledge-container {
	max-height: 450px;
	overflow-y: auto;
	& > li {
		display: grid;
		grid-template-columns: 20px 1fr;
		grid-template-rows: auto auto;
		padding: 5px 0;
		border-bottom: 1px dashed #eee;
		.del-icon {
			cursor: pointer;
		}
		.name {
			width: 220px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.duration {
			grid-column: span 2;
			text-align: right;
		}
	}
}
.duration-input {
	display: inline-block;
	width: 95px;
}
.my-header {
	display: grid;
	grid-template-columns: 2fr 1fr;
}
.knowledge-edit-action {
	padding: 5px 0;
	text-align: right;
}
</style>

