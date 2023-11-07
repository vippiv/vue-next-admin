<template>
	<div class="native-dynamic-form-contain">
		<h1 class="caption">课程评估表</h1>
		<div class="title">课程评估</div>
		<div
			class="extimate"
			v-for="(question, index) in questions"
			:key="index"
		>
			<div class="question">{{ question.title }}</div>
			<div class="answer">
				<template v-if="question.type === 'radio'">
					<p>Selected Value: {{ question.selected }}</p>
					<div
						v-for="option in question.options"
						:key="option.value"
						class="extimate_item"
					>
						<label>
							<input
								type="radio"
								:value="option.value"
								v-model="question.selected"
								name="question{{ index }}"
							/>
							{{ option.label }}
						</label>
					</div>
				</template>
				<template v-if="question.type === 'textarea'">
					<p>Selected Value: {{ question.selected }}</p>
					<textarea
						v-model="question.selected"
						rows="3"
						class="textarea"
					></textarea>
				</template>
			</div>
		</div>
		<div class="submit">
			<span
				class="submit_btn"
				@click="handleSubmit"
				>提交</span
			>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
//#region 数据
const questions = ref([
	{
		type: 'radio',
		title: '1.  课程的内容是我想要学习到的',
		selected: '',
		options: [
			{
				label: '5分',
				value: 5,
			},
			{
				label: '4分',
				value: 4,
			},
			{
				label: '3分',
				value: 3,
			},
			{
				label: '2分',
				value: 2,
			},
			{
				label: '1分',
				value: 1,
			},
		],
	},
	{
		type: 'radio',
		title: '2.  我能将每一个学习目标与学习内容联系起来',
		selected: '',
		options: [
			{
				label: '5分',
				value: 5,
			},
			{
				label: '4分',
				value: 4,
			},
			{
				label: '3分',
				value: 3,
			},
			{
				label: '2分',
				value: 2,
			},
			{
				label: '1分',
				value: 1,
			},
		],
	},
	{
		type: 'radio',
		title: '3.  我从课程中得到的挑战是适度的',
		selected: '',
		options: [
			{
				label: '5分',
				value: 5,
			},
			{
				label: '4分',
				value: 4,
			},
			{
				label: '3分',
				value: 3,
			},
			{
				label: '2分',
				value: 2,
			},
			{
				label: '1分',
				value: 1,
			},
		],
	},
	{
		type: 'radio',
		title: '4.  课程内容对我工作的成功有极大的帮助',
		selected: '',
		options: [
			{
				label: '5分',
				value: 5,
			},
			{
				label: '4分',
				value: 4,
			},
			{
				label: '3分',
				value: 3,
			},
			{
				label: '2分',
				value: 2,
			},
			{
				label: '1分',
				value: 1,
			},
		],
	},
	{
		type: 'radio',
		title: '5.  课程逻辑清晰，结构分明，便于我理解记忆',
		selected: '',
		options: [
			{
				label: '5分',
				value: 5,
			},
			{
				label: '4分',
				value: 4,
			},
			{
				label: '3分',
				value: 3,
			},
			{
				label: '2分',
				value: 2,
			},
			{
				label: '1分',
				value: 1,
			},
		],
	},
	{
		type: 'radio',
		title: '6.  安排的活动，练习和范例明确易懂，有助于我理解课程内容',
		selected: '',
		options: [
			{
				label: '5分',
				value: 5,
			},
			{
				label: '4分',
				value: 4,
			},
			{
				label: '3分',
				value: 3,
			},
			{
				label: '2分',
				value: 2,
			},
			{
				label: '1分',
				value: 1,
			},
		],
	},
	{
		type: 'radio',
		title: '7.  我能投入参与培训中',
		selected: '',
		options: [
			{
				label: '5分',
				value: 5,
			},
			{
				label: '4分',
				value: 4,
			},
			{
				label: '3分',
				value: 3,
			},
			{
				label: '2分',
				value: 2,
			},
			{
				label: '1分',
				value: 1,
			},
		],
	},
	{
		type: 'radio',
		title: '8.  讲师语言表达流畅清晰',
		selected: '',
		options: [
			{
				label: '5分',
				value: 5,
			},
			{
				label: '4分',
				value: 4,
			},
			{
				label: '3分',
				value: 3,
			},
			{
				label: '2分',
				value: 2,
			},
			{
				label: '1分',
				value: 1,
			},
		],
	},
	{
		type: 'radio',
		title: '9.  讲师对授课时间的掌控非常好',
		selected: '',
		options: [
			{
				label: '5分',
				value: 5,
			},
			{
				label: '4分',
				value: 4,
			},
			{
				label: '3分',
				value: 3,
			},
			{
				label: '2分',
				value: 2,
			},
			{
				label: '1分',
				value: 1,
			},
		],
	},
	{
		type: 'radio',
		title: '10. 讲师现场气氛调节能力非常强',
		selected: '',
		options: [
			{
				label: '5分',
				value: 5,
			},
			{
				label: '4分',
				value: 4,
			},
			{
				label: '3分',
				value: 3,
			},
			{
				label: '2分',
				value: 2,
			},
			{
				label: '1分',
				value: 1,
			},
		],
	},
	{
		type: 'textarea',
		title: '关于课程，你有什么建议和想法可以让课程变得更好？',
		selected: '',
	},
]);
//#endregion

//#region 事件
const handleSubmit = () => {};
//#endregion

//#region 周期
//#endregion
</script>

<style lang="scss" scoped>
.native-dynamic-form-contain {
	width: 80% !important;
	margin: 0 auto;
	.caption {
		height: 45px;
		line-height: 45px;
		font-weight: 600;
		font-size: 24px;
		color: #333333;
		text-align: center;
		margin-top: 20px;
	}
	.title {
		height: 64px;
		line-height: 64px;
		background: #e6b20314;
		border: 1px solid #e6b20373;
		border-radius: 4px;
		font-size: 16px;
		color: #666666;
		padding-left: 20px;
		margin-bottom: 15px;
	}
	.extimate {
		.question {
			line-height: 64px;
			background: #e8edf0;
			border-radius: 4px;
			padding-left: 20px;
			color: #333333;
		}
		.answer {
			.extimate_item {
				display: inline-block;
				padding-left: 25px;
				line-height: 64px;
			}
			.textarea {
				width: 100%;
			}
		}
	}
	.submit {
		text-align: center;
		padding: 10px 0;
		.submit_btn {
			margin: 7px;
			padding: 5px 24px;
			border-radius: 4px;
			font-weight: 400;
			font-size: 14px;
			letter-spacing: 0;
			cursor: pointer;
			color: white;
			background-color: #398ee5;
			border-color: var(--el-button-border-color);
		}
	}
}
.validator-error {
	border: 1px solid red;
}
</style>