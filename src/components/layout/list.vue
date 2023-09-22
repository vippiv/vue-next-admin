<template>
	<div class="list-container">
		<div
			class="list_header"
			v-if="$slots.headerSearchBar || $slots.headerAction"
		>
			<div
				class="list_header_searchbar"
				v-if="$slots.headerSearchBar"
			>
				<slot name="headerSearchBar" />
			</div>
			<div
				class="list_header_action"
				v-if="$slots.headerAction"
			>
				<slot name="headerAction" />
			</div>
		</div>
		<div
			class="list_table_content"
			v-if="$slots.tableContent"
		>
			<slot name="tableContent" />
		</div>
		<div
			class="list_pagination"
			v-if="$slots.pagination"
		>
			<slot name="pagination" />
		</div>
		<div v-if="$slots.default">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.list-container {
	display: flex;
	flex: 1;
	flex-direction: column;
	background-color: white;
	.list_table_content {
		flex: 1;
	}
	.list_header_action,
	.list_header_searchbar {
		padding: 8px;
	}
	:deep(.el-pagination) {
		padding: 10px 0;
		width: 100%;
		justify-content: flex-end;
		background-color: white;
	}
}
</style>