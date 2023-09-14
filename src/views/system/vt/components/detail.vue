<template>
	<div class="detail-container">
		<ul>
			<li v-for="item in listState.list" :key="item.id">{{ item.name }}</li>
		</ul>
		<el-button type="primary" @click="handleUpdate">Update</el-button>
	</div>
</template>

<script setup>
import { inject } from 'vue';
const listState = inject('lists');
const listStateFn = inject('listsFn');

const handleUpdate = () => {
	listStateFn([
		{
			id: 200,
			name: 'zl',
		},
	]);
};
console.log('🚀 ~ file: detail.vue:12 ~ listState:', listState);
</script>