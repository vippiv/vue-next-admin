<template>
	<layout-list>
		<div class="preview-header">
			<div>总时间</div>
			<div>剩余{{ lastTime }}</div>
		</div>
		<div class="preview-main"></div>
	</layout-list>
</template>
<script setup lang="ts" name="knowledge-preview">
//#region 引用
import { ref, onBeforeMount, onMounted, onBeforeUnmount, computed } from 'vue';
import { secondToTimeDesc } from '/@/utils/date';
//#end region

//#region 参数
//#endregion

//#region 数据
const wsInterval = 15;
const playTime = ref(-1); // 每次上报后会清零
const requireTime = ref(18);
const totalWatchSeconds = ref(0);
let interval = null;
let playTimer: NodeJS.Timeout | null = null;
const lastTime = computed(() => {
	const res = secondToTimeDesc(requireTime.value - totalWatchSeconds.value - playTime.value);
	if (res <= 0) {
		clearReport();
		clearPlayTime();
		sendMessage('最后一次上报');
	}
	return res;
});
//#endregion

//#region 方法
const sendMessage = (msg) => {
	setTimeout(() => {
		totalWatchSeconds.value = totalWatchSeconds.value + playTime.value;
		playTime.value = 0;
		console.log('🚀 ~ file: index.vue:34 ~ sendMessage ~ msg:', msg);
	}, 1000);
};

const startReport = () => {
	interval = setInterval(() => {
		sendMessage(`${wsInterval}上报一次`);
	}, wsInterval * 1000);
};
const clearReport = () => {
	clearInterval(interval);
	interval = null;
};

const setPlayTime = () => {
	playTimer = setTimeout(() => {
		calcPlayTime(0.5);
		setPlayTime();
	}, 500);
};
const clearPlayTime = () => {
	if (playTimer) {
		clearTimeout(playTimer);
		playTimer = null;
	}
};
const calcPlayTime = (val: number) => {
	if (playTime.value < 0) {
		playTime.value = 0;
	}
	playTime.value += val;
};
//#endregion

//#region 周期
onBeforeMount(() => {
	sendMessage('初次上报');
});
onMounted(() => {
	startReport();
	setPlayTime();
});
onBeforeUnmount(() => {
	clearReport();
	clearPlayTime();
	sendMessage('最后一次上报');
});
//#endregion
</script>

<style lang="scss" scoped>
.preview-header {
	display: flex;
	padding: 15px 0;
}
.preview-main {
	iframe {
		width: 100%;
		height: 100vh;
	}
}
</style>
