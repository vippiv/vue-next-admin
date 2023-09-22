<template>
	<div class="sarchbar-container">
		<template v-for="item in searchOps">
			<template v-if="item.type === 'input'">
				<el-input
					:key="item.value"
					v-model="input"
					placeholder="Please input"
				/>
			</template>
			<template v-else-if="item.type === 'select'">
				<el-select
					:key="item.value"
					v-model="value"
					placeholder="Select"
				>
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</template>
			<template v-else-if="item.type === 'date'">
				<el-date-picker
					:key="item.value"
					v-model="value1"
					type="date"
					placeholder="Pick a day"
					:size="size"
				/>
			</template>
		</template>
		<slot />
	</div>
</template>

<script setup>
defineProps({
	searchOps: {
		type: Array,
		default: () => [],
	},
});
</script>