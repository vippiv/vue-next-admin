<template>
	<div class="dynamic-form-contain">
		<dynamic-form
			:dynamicFormData="dynamicForm"
			:dynamicFormRules="dynamicFormRules"
			:dynamicFormOps="dynamicFormOps"
		></dynamic-form>
	</div>
</template>

<script setup>
import { ref } from 'vue';
const dynamicForm = ref({
	name: '',
	hoppy: [],
	gender: '',
	note: '',
});
const dynamicFormRules = ref({
	name: [
		{ required: true, message: '请输入姓名', trigger: 'blur' },
		{ min: 2, max: 5, message: '姓名应该在2-5个字之间', trigger: 'blur' },
	],
	hoppy: [{ required: true, message: '请选择爱好', trigger: 'blur' }],
	gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
	note: [
		{ required: true, message: '请输入备注', trigger: 'blur' },
		{ max: 500, message: '备注不能超过500个字', trigger: 'blur' },
	],
});
const dynamicFormOps = ref([
	{
		type: 'input',
		field: 'name',
		label: '姓名',
		vModel: 'name',
	},
	{
		type: 'checkbox',
		field: 'hoppy',
		label: '爱好',
		vModel: 'hoppy',
		options: [
			{
				label: '篮球',
				value: 0,
			},
			{
				label: '足球',
				value: 1,
			},
		],
	},
	{
		type: 'radio',
		field: 'gender',
		label: '性别',
		vModel: 'gender',
		options: [
			{
				label: '男',
				value: 0,
			},
			{
				label: '女',
				value: 1,
			},
		],
	},
	{
		type: 'textarea',
		field: 'note',
		label: '备注',
		vModel: 'note',
	},
]);
</script>

<style lang="scss" scoped>
.dynamic-form-contain {
	width: 800px !important;
	margin: 0 auto;
	padding: 20px 0;
}
</style>