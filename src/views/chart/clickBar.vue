<template>
	<div>
		<div
			v-show="clickbarVisible"
			id="clickbar"
			ref="clickbarRef"
		></div>
		<div
			v-if="clickbarChildVisible"
			id="childbar_child"
			ref="clickbarChildRef"
		></div>
		<el-icon
			class="back"
			v-if="clickbarChildVisible"
			@click="handleBack"
			><Back
		/></el-icon>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
const clickbarRef = ref();
const clickbarChildRef = ref();
const clickbarChildVisible = ref(false);
const clickbarVisible = ref(true);
let myChart = null;
let myChildChart = null;
const posList = [
	'left',
	'right',
	'top',
	'bottom',
	'inside',
	'insideTop',
	'insideLeft',
	'insideRight',
	'insideBottom',
	'insideTopLeft',
	'insideTopRight',
	'insideBottomLeft',
	'insideBottomRight',
];
app.configParameters = {
	rotate: {
		min: -90,
		max: 90,
	},
	align: {
		options: {
			left: 'left',
			center: 'center',
			right: 'right',
		},
	},
	verticalAlign: {
		options: {
			top: 'top',
			middle: 'middle',
			bottom: 'bottom',
		},
	},
	position: {
		options: posList.reduce(function (map, pos) {
			map[pos] = pos;
			return map;
		}, {}),
	},
	distance: {
		min: 0,
		max: 100,
	},
};
app.config = {
	rotate: 90,
	align: 'left',
	verticalAlign: 'middle',
	position: 'insideBottom',
	distance: 15,
	onChange: function () {
		const labelOption = {
			rotate: app.config.rotate,
			align: app.config.align,
			verticalAlign: app.config.verticalAlign,
			position: app.config.position,
			distance: app.config.distance,
		};
		myChart.setOption({
			series: [
				{
					label: labelOption,
				},
				{
					label: labelOption,
				},
				{
					label: labelOption,
				},
				{
					label: labelOption,
				},
			],
		});
	},
};
const labelOption = {
	show: false,
	position: app.config.position,
	distance: app.config.distance,
	align: app.config.align,
	verticalAlign: app.config.verticalAlign,
	rotate: app.config.rotate,
	formatter: '{c}  {name|{a}}',
	fontSize: 16,
	rich: {
		name: {},
	},
};
const option = {
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow',
		},
	},
	legend: {
		data: ['Forest', 'Steppe', 'Desert', 'Wetland'],
	},
	toolbox: {
		show: true,
		orient: 'vertical',
		left: 'right',
		top: 'center',
		feature: {
			mark: { show: true },
			dataView: { show: true, readOnly: false },
			magicType: { show: true, type: ['line', 'bar', 'stack'] },
			restore: { show: true },
			saveAsImage: { show: true },
		},
	},
	xAxis: [
		{
			type: 'category',
			axisTick: { show: false },
			data: ['2012', '2013', '2014', '2015', '2016'],
		},
	],
	yAxis: [
		{
			type: 'value',
		},
	],
	series: [
		{
			name: 'Forest',
			type: 'bar',
			barGap: 0,
			label: labelOption,
			emphasis: {
				focus: 'series',
			},
			data: [320, 332, 301, 334, 390],
			cursor: 'auto',
		},
		{
			name: 'Steppe',
			type: 'bar',
			label: labelOption,
			emphasis: {
				focus: 'series',
			},
			data: [220, 182, 191, 234, 290],
			cursor: 'auto',
		},
		{
			name: 'Desert',
			type: 'bar',
			label: labelOption,
			emphasis: {
				focus: 'series',
			},
			data: [150, 232, 201, 154, 190],
			cursor: 'auto',
		},
		{
			name: 'Wetland',
			type: 'bar',
			label: labelOption,
			emphasis: {
				focus: 'series',
			},
			data: [98, 77, 101, 99, 40],
			cursor: 'auto',
		},
	],
	dataZoom: [
		{
			type: 'inside',
			start: 0,
			end: 50,
		},
		{
			start: 0,
			end: 100,
			handleIcon: 'M0,0 v9.7h5 v-9.7h-5 Z',
			handleSize: '120%',
			handleStyle: {
				color: '#fff',
				borderColor: '#5470c6',
				borderWidth: 1,
				shadowBlur: 2,
				shadowColor: 'rgba(0, 0, 0, 0.6)',
				shadowOffsetX: 0,
				shadowOffsetY: 1,
			},
		},
	],
};
const childOption = {
	xAxis: {
		type: 'category',
		data: ['2012', '2013', '2014', '2015', '2016'],
	},
	yAxis: {
		type: 'value',
	},
	series: [
		{
			data: [120, 200, 150, 80, 70],
			type: 'bar',
		},
		{
			data: [10, 220, 50, 180, 50],
			type: 'bar',
		},
		{
			data: [50, 120, 90, 80, 60],
			type: 'bar',
		},
	],
};
const initClickBar = () => {
	myChart = echarts.init(clickbarRef.value);
	myChart.setOption(option);
};
const initChildClickBar = () => {
	myChildChart = echarts.init(clickbarChildRef.value);
	myChildChart.setOption(childOption);
};
const chartBindClickEvent = (ele) => {
	ele.on('click', function (params) {
		console.log('🚀 ~ file: clickBar.vue:226 ~ params:', params);
		const xValue = params.name; // 获取柱子的x轴数据
		console.log('🚀 ~ file: clickBar.vue:223 ~ xValue:', xValue);
		if (xValue === '2012' || xValue === '2015') {
			clickbarVisible.value = false;
			clickbarChildVisible.value = true;
			nextTick(() => {
				initChildClickBar();
			});
		}
	});
};
const chartBindHoverEvent = (ele) => {
	ele.on('mouseover', function (params) {
		console.log('🚀 ~ file: clickBar.vue:193 ~ params:', params);
		if (params.componentType === 'series' && params.seriesType === 'bar') {
			// 鼠标悬停在柱子上
			var xValue = params.name; // 获取柱子的x轴数据
			var yValue = params.data; // 获取柱子的y轴数据
			console.log('鼠标悬停在柱子上，x轴数据：' + xValue);
			console.log('鼠标悬停在柱子上，y轴数据：' + yValue);
			if (xValue === '2012' || xValue === '2015') {
				option.series.forEach((item) => {
					item.cursor = 'pointer';
				});
			} else {
				option.series.forEach((item) => {
					item.cursor = 'default';
				});
			}
			initClickBar();

			// 在这里可以执行你希望的悬停事件处理逻辑
		}
	});
	ele.on('mouseout', function (params) {
		if (params.componentType === 'series' && params.seriesType === 'bar') {
			// 鼠标移出柱子
			var xValue = params.name; // 获取柱子的x轴数据
			var yValue = params.data; // 获取柱子的y轴数据
			console.log('鼠标移出柱子，x轴数据：' + xValue);
			console.log('鼠标移出柱子，y轴数据：' + yValue);
			ele.getDom().style.cursor = 'auto';
			// 在这里可以执行你希望的移出事件处理逻辑
		}
	});
};
const handleBack = () => {
	clickbarVisible.value = true;
	clickbarChildVisible.value = false;
	myChildChart.dispose();
	myChildChart = null;
};
onMounted(() => {
	nextTick(() => {
		initClickBar();
		chartBindClickEvent(myChart);
		chartBindHoverEvent(myChart);
	});
});
</script>

<style lang="scss" scoped>
#clickbar {
	margin-top: 20px;
	// width: 600px !important;
	height: 600px;
	// margin: 0 auto;
}
#childbar_child {
	position: absolute;
	width: 100%;
	height: 600px;
	left: 0;
	top: 20px;
}
.back {
	font-size: 24px;
	position: absolute;
	top: 10px;
	right: 10px;
	cursor: pointer;
}
</style>