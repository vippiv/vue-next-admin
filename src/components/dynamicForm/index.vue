<template>
	<div class="dynamicFormCps">
		{{ dynamicForm }}
		<slot name="header" />
		<el-form
			ref="ruleDynamicFormRef"
			:model="dynamicForm"
			:rules="dynamicFormRules"
			label-width="120px"
		>
			<template v-for="item in dynamicFormOps">
				<el-form-item
					v-if="item.type === 'input'"
					:key="item.field"
					:label="item.label"
					:prop="item.field"
					:data-field="item.field"
				>
					<el-input v-model="dynamicForm[item.vModel]" />
				</el-form-item>
				<el-form-item
					v-else-if="item.type === 'textarea'"
					:key="item.field"
					:label="item.label"
					:prop="item.field"
				>
					<el-input
						v-model="dynamicForm[item.vModel]"
						type="textarea"
					/>
				</el-form-item>
				<el-form-item
					v-else-if="item.type === 'checkbox'"
					:key="item.field"
					:label="item.label"
					:prop="item.field"
				>
					<el-checkbox-group v-model="dynamicForm[item.vModel]">
						<el-checkbox
							v-for="checkItem in item.options"
							:key="checkItem.value || checkItem.label"
							:label="checkItem.value"
							:name="checkItem.name"
						>
							{{ checkItem.label }}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item
					v-else-if="item.type === 'radio'"
					:key="item.field"
					:label="item.label"
					:prop="item.field"
				>
					<el-radio-group v-model="dynamicForm[item.vModel]">
						<el-radio
							v-for="radioItem in item.options"
							:key="radioItem.value || radioItem.label"
							:label="radioItem.value"
							:name="radioItem.name"
						>
							{{ radioItem.label }}
						</el-radio>
					</el-radio-group>
				</el-form-item>
			</template>
			<el-form-item>
				<el-button
					type="primary"
					@click="submitForm(ruleDynamicFormRef)"
				>
					确定
				</el-button>
				<el-button @click="resetForm(ruleDynamicFormRef)">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
import { ref } from 'vue';
const ruleDynamicFormRef = ref();
const props = defineProps({
	dynamicFormData: {
		type: Object,
		required: true,
		default: () => {},
	},
	dynamicFormRules: {
		type: Object,
		required: true,
		default: () => {},
	},
	dynamicFormOps: {
		type: Array,
		required: true,
		default: () => [],
	},
});
const dynamicForm = computed(() => {
	return props.dynamicFormData;
});
// const dynamicForm = ref({
// 	name: '',
// 	hoppy: [],
// 	gender: '',
// 	note: '',
// });
// const dynamicFormRules = ref({
// 	name: [
// 		{ required: true, message: '请输入姓名', trigger: 'blur' },
// 		{ min: 2, max: 5, message: '姓名应该在2-5个字之间', trigger: 'blur' },
// 	],
// 	hoppy: [{ required: true, message: '请选择爱好', trigger: 'blur' }],
// 	gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
// 	note: [
// 		{ required: true, message: '请输入备注', trigger: 'blur' },
// 		{ max: 500, message: '备注不能超过500个字', trigger: 'blur' },
// 	],
// });
// const dynamicFormOps = ref([
// 	{
// 		type: 'input',
// 		field: 'name',
// 		label: '姓名',
// 		vModel: 'name',
// 	},
// 	{
// 		type: 'checkbox',
// 		field: 'hoppy',
// 		label: '爱好',
// 		vModel: 'hoppy',
// 		options: [
// 			{
// 				label: '篮球',
// 				value: 0,
// 			},
// 			{
// 				label: '足球',
// 				value: 1,
// 			},
// 		],
// 	},
// 	{
// 		type: 'radio',
// 		field: 'gender',
// 		label: '性别',
// 		vModel: 'gender',
// 		options: [
// 			{
// 				label: '男',
// 				value: 0,
// 			},
// 			{
// 				label: '女',
// 				value: 1,
// 			},
// 		],
// 	},
// 	{
// 		type: 'textarea',
// 		field: 'note',
// 		label: '备注',
// 		vModel: 'note',
// 	},
// ]);
const submitForm = async (formEl) => {
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			console.log('submit!');
		} else {
			console.log('error submit!', fields);
		}
	});
};

const resetForm = (formEl) => {
	if (!formEl) return;
	formEl.resetFields();
};
</script>

<style lang="scss" scoped>
</style>