<template>
	<section
		v-if="showCodeList?.length"
		class="l-category"
		:data-id="codeId"
	>
		<div
			class="l-category-checked-list flex"
			v-if="false"
		>
			<div
				class="l-category-checked-item none flex"
				@click="onReset"
			>
				<div class="l-category-checked-item-box flex">
					<div>{{ allLabel }}</div>
				</div>
			</div>
			<template v-if="checkedCodeList?.length">
				<div class="flex flex-wrap">
					<template v-for="(checkedItem, checkedIndex) in checkedCodeList">
						<div
							v-if="!isEnd || checkedIndex !== checkedCodeList.length - 1"
							class="l-category-checked-item flex align-center"
							:class="{
								active: checkedIndex === (isEnd ? checkedCodeList.length - 2 : checkedCodeList.length - 1),
							}"
							:key="`checked_${checkedIndex}`"
							@click="onCheckedChange(checkedIndex)"
						>
							<i class="iconfont icon-arrow-right l-category-checked-item-arrow"></i>
							<div class="l-category-checked-item-box flex align-center">
								<div>{{ checkedItem.codeName }}</div>
								<i class="iconfont icon-triangle-down l-category-checked-item-triangle"></i>
							</div>
						</div>
					</template>
				</div>
			</template>
		</div>
		<div class="all-category">
			<div class="flex category-item">
				<div class="l-category-name"><span class="text">分类:</span></div>
				<div class="flex1_hidden flex flex-wrap align-center l-category-list">
					<div
						class="l-category-item"
						:class="{
							active: checkedCate && checkedCate.codeId == item.codeId,
						}"
						v-for="(item, index) in allCategoryList"
						:key="index"
						@click="onChecked(1, item)"
					>
						{{ item.codeName }}
					</div>
				</div>
			</div>
			<div
				class="flex category-item"
				v-if="dirCategoryList.length"
			>
				<div class="l-category-name"><span class="text">方向:</span></div>
				<div class="flex1_hidden flex flex-wrap align-center l-category-list">
					<div
						class="l-category-item"
						:class="{
							active: checkedDirCate && checkedDirCate.codeId == item.codeId,
						}"
						v-for="(item, index) in dirCategoryList"
						:key="index"
						@click="onChecked(2, item)"
					>
						{{ item.codeName }}
					</div>
				</div>
			</div>
			<div
				class="flex category-item"
				v-if="themeCategoryList.length"
			>
				<div class="l-category-name"><span class="text">主题:</span></div>
				<div class="flex1_hidden flex flex-wrap align-center l-category-list">
					<div
						class="l-category-item"
						:class="{
							active: checkedThemeCate && checkedThemeCate.codeId == item.codeId,
						}"
						v-for="(item, index) in themeCategoryList"
						:key="index"
						@click="onChecked(3, item)"
					>
						{{ item.codeName }}
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script setup lang="ts" name="l-category">
//#region 组件
//#endregion

//#region 引用
import { toRefs, ref, onMounted, watch } from 'vue';
import { FindCodeItem, CateItem } from './types';
//#endregion

//#region 参数
const props = withDefaults(
	defineProps<{
		allLabel?: string;
		typeCode: string;
		codeId?: number;
		allCategory: Array;
	}>(),
	{
		allLabel: '',
		typeCode: '',
		codeId: -1,
	}
);

const { allLabel, allCategory } = toRefs(props);
const emit = defineEmits(['checked']);
//#endregion

//#region 数据
const allCategoryList = ref([]); // 所有分类
const dirCategoryList = ref([]); // 方向分类
const themeCategoryList = ref([]); // 主题分类
const checkedCate = ref<CateItem | null>(); // 选中的分类
const checkedDirCate = ref<CateItem | null>(); // 选中的方向分类
const checkedThemeCate = ref<CateItem | null>(); // 选中的主题分类

const cateLoading = ref(true);
const showCodeList = ref([]);
const checkedCodeList = ref([]);
const isEnd = ref(false);
const initCheckedCode = (codeId: number, list: Response_QueryCodeItemTree[]) => {
	if (codeId > -1 && list?.length) {
		const matchList: Response_QueryCodeItemTree[] = [];
		do {
			const result = findCodeItem(codeId, list);
			result?.current && matchList.push(result.current);
			codeId = result?.parent?.codeId || -1;
		} while (codeId > -1);

		if (matchList.length) {
			checkedCodeList.value = matchList.reverse();
			const dirCategory = allCategoryList.value.find((x) => x.codeId == matchList[0].codeId);
			const themeCategory = dirCategoryList.value.find((x) => x.codeId == matchList[1].codeId);
			if (dirCategory) {
				dirCategoryList.value = dirCategory.children || [];
			}
			if (themeCategory) {
				themeCategoryList.value = themeCategory.children || [];
			}
			checkedCate.value = matchList[0] as CateItem;
			checkedDirCate.value = matchList[1] as CateItem;
			emit('checked', checkedDirCate.value);
		}
	}
};
const findCodeItem = (codeId: number, list?: Response_QueryCodeItemTree[]): FindCodeItem | null => {
	if (!list?.length) {
		return null;
	}

	for (let item of list) {
		if (item.codeId == codeId) {
			return {
				parent: null,
				current: item,
			};
		}

		if (item.children?.length) {
			const result = findCodeItem(codeId, item.children);
			if (result) {
				result.parent = item;
				return result;
			}
		}
	}

	return null;
};
//#endregion

//#region 事件
const onReset = () => {
	emit('checked', null);
	checkedCodeList.value.splice(0);
	isEnd.value = false;
	showCodeList.value = [...allCategoryList.value];
};
const onCheckedChange = (index: number) => {
	if (isEnd.value && index < checkedCodeList.value.length - 1) {
		isEnd.value = false;
	}
	showCodeList.value = checkedCodeList.value[index].children || [];
	checkedCodeList.value.splice(index + 1);
	emit('checked', checkedCodeList.value[checkedCodeList.value.length - 1]);
};
const onChecked = (level: number, val: Response_QueryCodeItemTree) => {
	emit('checked', val);
	if (level === 1) {
		const dirCategory = allCategoryList.value.find((x) => x.codeId == val.codeId);
		if (dirCategory) {
			dirCategoryList.value = dirCategory.children || [];
		}
		checkedCate.value = val as CateItem;
		themeCategoryList.value = [];
		checkedDirCate.value = null;
		checkedThemeCate.value = null;
	} else if (level === 2) {
		const themeCategory = dirCategoryList.value.find((x) => x.codeId == val.codeId);
		if (themeCategory) {
			themeCategoryList.value = themeCategory.children || [];
		}
		checkedDirCate.value = val as CateItem;
		checkedThemeCate.value = null;
	} else if (level === 3) {
		checkedThemeCate.value = val as CateItem;
	}
};
//#endregion

//#region 周期
onMounted(async () => {
	allCategoryList.value = allCategory.value;
	cateLoading.value = false;
	showCodeList.value = [...allCategoryList.value];
});
watch(
	() => [props.codeId, cateLoading.value],
	([val1, val2]) => {
		!val2 && initCheckedCode(val1 as number, allCategoryList.value);
	},
	{ immediate: true, deep: true }
);
//#endregion
</script>

<style lang="scss" scoped>
:root {
	--primary-color-rgba: green;
}
.l-category {
	font-weight: 400;
	font-size: 14px;
	letter-spacing: 0;
	white-space: nowrap;
	.all-category {
		border: 1px solid #eee;
		.category-item {
			line-height: 26px;
			border-bottom: 1px solid #eee;
			padding: 10px 0 10px 20px;
			position: relative;
		}
		.category-item:last-child {
			border-bottom: none;
		}
	}
	&-checked-list {
	}

	&-checked-item {
		margin-bottom: 16px;
		color: var(--black-color-45);
		cursor: pointer;

		&-arrow {
			margin: 0 5px;
			font-size: 14px;
			color: var(--black-color-45);
		}

		&-box {
			padding: 3px 10px;
			border: 1px solid transparent;
			background: linear-gradient(white, white) padding-box,
				repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.15) 0, rgba(0, 0, 0, 0.15) 3px, white 0, white 6px);
			border-radius: 4px;
		}

		&-triangle {
			margin: 0 0 0 3px;
			font-size: 12px;
			color: var(--black-color-45);
		}

		&.active {
			color: rgba(var(0, 199, 112), 0.65);

			.l-category-checked-item-box {
				background: linear-gradient(white, white) padding-box,
					repeating-linear-gradient(-45deg, var(--primary-color) 0, var(--primary-color) 3px, white 0, white 6px);
			}

			.l-category-checked-item-triangle {
				opacity: 0.65;
				color: var(--primary-color);
			}
		}

		&.none {
			.l-category-checked-item-box {
				padding: 3px 0;
				background: none;
			}
		}
	}

	&-name {
		color: var(--black-color-45);
		.text {
			z-index: 1;
			position: relative;
		}
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			width: 80px;
			background: #f9f9f9;
			border-right: 1px solid #eee;
			z-index: 0;
		}
	}

	&-list {
		padding-left: 36px;
	}

	&-item {
		margin: 0 4px;
		padding: 0 12px;
		color: var(--black-color-65);
		cursor: pointer;

		&.active {
			background: #00c770;
			border-radius: 4px;
			color: #fff;
		}
	}
}
</style>