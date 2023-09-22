<template>
	<el-drawer
		v-model="detailVisible"
		title="编辑"
		class="resource-edit"
		:direction="direction"
		:before-close="handleClose"
	>
		<layout-drawer>
			<template v-slot:drawContent>
				<el-form
					ref="rowDataFormRef"
					:model="rowDataForm"
					status-icon
					:rules="rules"
					label-width="120px"
					class="demo-rowDataForm"
				>
					<el-form-item
						label="资源名称"
						prop="name"
					>
						<el-input v-model="rowDataForm.name" />
					</el-form-item>
					<el-form-item
						label="生产日期"
						prop="date"
					>
						<el-date-picker
							v-model="rowDataForm.date"
							type="date"
						/>
					</el-form-item>
					<el-form-item
						label="生产地址"
						prop="address"
					>
						<el-input v-model="rowDataForm.address" />
					</el-form-item>
				</el-form>
			</template>
			<template v-slot:drawFooter>
				<el-button
					type="primary"
					@click="submitForm(rowDataFormRef)"
					>提交</el-button
				>
				<el-button @click="cancelForm">取消</el-button>
			</template>
		</layout-drawer>
	</el-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { resourceMgtApi } from '/@/api/resource/index.ts';

const emit = defineEmits(['updateRowData']);
const resourceApi = resourceMgtApi();
const rowDataFormRef = ref(null);
const detailVisible = ref(false);
const direction = ref('rtl');
const rowDataForm = ref({
	id: '',
	name: '',
	date: '',
	address: '',
});
const rules = reactive({
	name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
	date: [{ required: true, message: '请选择生产日期', trigger: 'blur' }],
	address: [{ required: true, message: '请输入生产地址', trigger: 'blur' }],
});

const openAction = (data) => {
	console.log('🚀 ~ file: edit.vue:63 ~ openAction ~ data:', data);
	toggleDrawerVisible(true);
	const { id, name, date, address } = data;
	rowDataForm.value.id = id;
	rowDataForm.value.name = name;
	rowDataForm.value.date = date;
	rowDataForm.value.address = address;
};
const submitForm = async (form) => {
	if (!form) return;
	await form.validate((valid, fields) => {
		if (valid) {
			const { id, name, date, address } = rowDataForm.value;
			const params = { id, name, date, address };
			resourceApi.save(params).then((res) => {
				console.log('🚀 ~ file: edit.vue:91 ~ resourceApi.save ~ res:', res);
			});
			emit('updateRowData', rowDataForm);
			toggleDrawerVisible(false);
		} else {
			console.log('error submit!', fields);
		}
	});
};
const cancelForm = () => {
	toggleDrawerVisible(false);
};
const handleClose = () => {
	toggleDrawerVisible(false);
};
const toggleDrawerVisible = (bool) => {
	detailVisible.value = bool;
};

defineExpose({
	openAction,
});
</script>