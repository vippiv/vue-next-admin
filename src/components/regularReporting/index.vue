<template>
	<el-dialog
		width="600px"
		@close="handleClose"
		@open="handleOpen"
		v-drag
		v-model="visible"
	>
		<layout-list>
			<div class="preview-header">
				<div>总时间 {{ requireTime }}秒，</div>
				<div>剩余 {{ lastTime > 0 ? secondToTimeDesc(lastTime) : '0秒' }}</div>
			</div>
			<div class="preview-main"></div>
		</layout-list>
	</el-dialog>
</template>
<script setup lang="ts" name="knowledge-preview">
//#region 引用
import { ref, onBeforeMount, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import { secondToTimeDesc } from '/@/utils/date';

//#end region

//#region 指令

//#end region

//#region 参数
const emits = defineEmits(['update:reportVisible']);
const props = defineProps({
	reportVisible: {
		type: Boolean,
	},
});
//#endregion

//#region 数据
const wsInterval = 15;
const playTime = ref(-1); // 每次上报后会清零
const requireTime = ref(18);
const totalWatchSeconds = ref(0);
let interval = null;
let playTimer: NodeJS.Timeout | null = null;
const lastTime = computed(() => {
	const res = requireTime.value - totalWatchSeconds.value - playTime.value;
	if (res <= 0) {
		clearReport();
		clearPlayTime();
		sendMessage('最后一次上报');
	}
	return res;
});
const visible = computed(() => props.reportVisible);
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
const startUp = () => {
	startReport();
	setPlayTime();
};
const endUp = () => {
	clearReport();
	clearPlayTime();
	sendMessage('最后一次上报');
};
const handleOpen = () => {
	sendMessage('初次上报');
	nextTick(() => {
		startUp();
	});
};
const handleClose = () => {
	endUp();
	emits('update:reportVisible', false);
};
//#endregion

//#region 周期
onBeforeMount(() => {
	// sendMessage('初次上报');
});
onMounted(() => {
	// startUp();
});
onBeforeUnmount(() => {
	endUp();
});
//#endregion
</script>

<style lang="scss" scoped>
.preview-header {
	display: flex;
	padding: 15px 0;
	justify-content: center;
	font-size: 24px;
	font-weight: bold;
}
</style>
