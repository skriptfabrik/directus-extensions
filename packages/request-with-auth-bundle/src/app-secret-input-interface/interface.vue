<script lang="ts" setup>
import { computed, ref } from 'vue';

const props = defineProps<{ value: string | null; disabled?: boolean }>();
const emit = defineEmits<{ input: [string | null] }>();

const setToEncrypt = ref(false);
const inputLocked = ref(props.value && props.value.length > 0);

const localValue = computed<string | null, string | null>({
	get: () => props.value,
	set: (value) => {
		if (value === '') {
			inputLocked.value = false;
			setToEncrypt.value = true;
		}

		emit('input', value);
	},
});
</script>

<template>
	<div class="input-wrapper">
		<VInput
			v-model="localValue"
			type="password"
			:disabled="disabled || inputLocked"
		/>
		<VButton :disabled="setToEncrypt" icon @click="localValue = ''">
			<VIcon name="edit" />
		</VButton>
	</div>
</template>

<style scoped>
.input-wrapper {
	gap: 8px;
	display: flex;
	align-items: center;
}
</style>
