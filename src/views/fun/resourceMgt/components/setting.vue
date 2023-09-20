<template>
	<div class="setting-container">
		<el-dialog
			v-model="dialogVisible"
			title="配置"
			width="30%"
			:before-close="handleClose"
		>
			<el-form
				ref="ruleFormRef"
				:model="productPropertyForm"
				label-width="120px"
				:rules="rules"
			>
				<el-form-item label="产品容量">
					<div class="capacity">
						<div>
							<el-input-number
								v-model="productPropertyForm.totalCapacity"
								:min="1"
								:max="99999"
								controls-position="right"
								size="default"
								class="w100"
							/>
						</div>
						<div class="unit">G</div>
					</div>
				</el-form-item>
				<el-form-item
					label="操作原因"
					prop="actionReason"
				>
					<el-select
						v-model="productPropertyForm.actionReason"
						placeholder="请选择操作原因"
						size="default"
						class="w100"
						@change="handleChange"
					>
						<el-option
							v-for="item in actionReasonOps"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				<el-form-item
					label="第三方"
					prop="other"
					v-if="productPropertyForm.actionReason == 2"
				>
					<el-select
						v-model="productPropertyForm.other"
						placeholder="请选择赠送的第三方"
						size="default"
						class="w100"
					>
						<el-option
							v-for="item in otherOps"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button
						type="primary"
						@click="submitForm(ruleFormRef)"
					>
						确定
					</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { getfilesize } from '/@/utils/toolsOther.ts';
const dialogVisible = ref(false);
const ruleFormRef = ref(null);
const productPropertyForm = ref({
	id: '',
	totalCapacity: 0,
	usedCapacity: 0,
	actionReason: '',
	other: '',
});
const rules = ref({
	actionReason: [{ required: true, message: '请选择操作原因', trigger: 'blur' }],
	other: [{ required: true, message: '请选择赠送的第三方', trigger: 'blur' }],
});
const actionReasonOps = ref([
	{
		label: '用户购买',
		value: '0',
	},
	{
		label: '平台赠送',
		value: '1',
	},
	{
		label: '第三方赠送',
		value: '2',
	},
]);
const otherOps = ref([
	{
		label: 'meta',
		value: '0',
	},
	{
		label: '富腾工程',
		value: '1',
	},
	{
		label: '魏瑞生通信',
		value: '2',
	},
	{
		label: '洪记集团',
		value: '3',
	},
]);
const emit = defineEmits(['updateSetting']);
const handleClose = () => {
	toggleDialogVisible(false);
};
const handleChange = () => {
	if (productPropertyForm.value.actionReason == 2) {
		productPropertyForm.value.other;
	}
};
const toggleDialogVisible = (bool) => {
	dialogVisible.value = bool;
};
const openAction = (rowData) => {
	const { totalCapacity, usedCapacity, id } = rowData;
	productPropertyForm.value.id = id;
	productPropertyForm.value.totalCapacity = parseFloat(getfilesize(totalCapacity, 'G'));
	productPropertyForm.value.usedCapacity = parseFloat(getfilesize(usedCapacity, 'G'));
	console.log('🚀 ~ file: setting.vue:130 ~ openAction ~ productPropertyForm.value.usedCapacity:', productPropertyForm.value.usedCapacity);
	toggleDialogVisible(true);
};
const submitForm = async (formEl) => {
	if (!formEl) return;
	await formEl.validate((valid, fields) => {
		if (valid) {
			console.log('submit!');
			emit('updateSetting', productPropertyForm);
		} else {
			console.log('error submit!', fields);
		}
	});
};
defineExpose({
	openAction,
});
</script>

<style lang="scss" scoped>
.capacity {
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 30px;
	grid-auto-rows: auto;
	.unit {
		text-align: center;
	}
}
</style>