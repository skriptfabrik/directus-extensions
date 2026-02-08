<script setup lang="ts">
import type { AppField, DeepPartial } from '@directus/types';
import type { AppSecretPayload } from '../../types';
import { watchEffect } from 'vue';

const model = defineModel<Partial<AppSecretPayload>>();

const setFieldToEncrypt = (field: string) => {
	if (!model.value?.fields) return;
	delete model.value.fields[field];

	model.value.encrypt = [
		...(model.value.encrypt?.filter((f) => f !== field) ?? []),
		field,
	];
};

watchEffect(() => {
	if (
		model.value?.type === 'basic' &&
		(!model.value.fields?.password || model.value.fields.password === '')
	) {
		setFieldToEncrypt('password');
	}
});

const metaFields: DeepPartial<AppField>[] = [
	{
		field: 'type',
		name: 'Type',
		type: 'string',
		meta: {
			width: 'full',
			interface: 'select-dropdown',
			options: {
				choices: [{ text: 'Basic Auth', value: 'basic' }],
			},
		},
		schema: {
			default_value: 'basic',
		},
	},
	{
		field: 'name',
		name: 'Name',
		type: 'string',
		meta: {
			width: 'full',
			interface: 'input',
			options: {
				placeholder: 'Credential name',
			},
		},
	},
];

const basicAuthFields: DeepPartial<AppField>[] = [
	{
		field: 'user',
		name: 'User',
		type: 'string',
		meta: {
			width: 'full',
			interface: 'input',
		},
	},
	{
		field: 'password',
		name: 'Password',
		type: 'string',
		meta: {
			width: 'full',
			interface: 'app-secret-input',
		},
	},
];
</script>

<template>
	<div class="secret-forms">
		<VForm
			v-model="model"
			class="extension-options"
			:fields="metaFields"
			:initial-values="model"
			primary-key="meta"
		/>
		<VForm
			v-if="model?.type === 'basic'"
			v-model="model.fields"
			class="extension-options"
			:fields="basicAuthFields"
			:initial-values="model.fields"
			primary-key="basic"
		/>
	</div>
</template>

<style scoped>
.secret-forms {
	display: flex;
	flex-direction: column;
	gap: 52px;
	padding: 32px;
}
</style>
