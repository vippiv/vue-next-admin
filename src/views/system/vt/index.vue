<template>
	<div class="vt-container">
		<detail></detail>
	</div>
</template>

<script setup>
// how to use setup hook
import { provide, ref } from 'vue';
import Detail from './components/detail.vue';
const state = ref({
	list: [
		{
			id: 10,
			name: 'hengha',
		},
	],
});
const updateList = (val) => {
	state.value.list = val;
};
provide('lists', state);
provide('listsFn', updateList);
</script>

<style lang="scss" scoped>
</style>