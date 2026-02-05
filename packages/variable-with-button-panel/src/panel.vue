<script setup lang="ts">
import type { Type } from '@directus/types';
import { useStores } from '@directus/extensions-sdk';
import { computed, ref } from 'vue';

interface Props {
	type: Type;
	field: string;
	inter: string;
	dashboard: string;
	width: number;
	options?: Record<string, any>;
	showHeader?: boolean;
}

const props = defineProps<Props>();

const { useInsightsStore } = useStores();
const insightsStore = useInsightsStore();

const rawValue = ref();

const fieldWidth = computed(() => (props.width < 20 ? 'half' : 'full'));

const value = computed({
	get() {
		return rawValue.value;
	},
	set(val: any) {
		rawValue.value = val;
	},
});

const saveValue = () => {
	insightsStore.setVariable(props.field, value.value);
	insightsStore.refresh();
};
</script>

<template>
	<form
		class="variable"
		:class="{ 'show-header': showHeader }"
		@submit.prevent="saveValue"
	>
		<component
			:is="`interface-${inter}`"
			v-bind="options"
			:value="value"
			:width="fieldWidth"
			:type="type"
			:field="field"
			@input="value = $event"
		/>
		<div class="button">
			<VButton icon @click="saveValue">
				<VIcon name="check" />
			</VButton>
		</div>
	</form>
</template>

<style scoped>
.variable {
	display: flex;
	gap: 12px;
	justify-content: center;
	align-items: center;
	inline-size: 100%;
	padding: 12px;
}
.variable.show-header {
	padding-block-start: 6px;
}
.button {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
