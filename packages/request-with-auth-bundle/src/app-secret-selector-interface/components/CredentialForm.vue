<script setup lang="ts">
import type { AppField, DeepPartial } from '@directus/types';
import type { AppSecretPayload } from '../../types';
import { watchEffect } from 'vue';

const model = defineModel<Partial<AppSecretPayload>>();

const fieldsByType: Record<AppSecretPayload['type'], string[]> = {
	basic: ['user', 'password'],
	bearer: ['token'],
};

const encryptFieldByType: Partial<Record<AppSecretPayload['type'], string>> = {
	basic: 'password',
	bearer: 'token',
};

watchEffect(() => {
	if (!model.value?.type || !model.value.fields) return;

	const { type, fields } = model.value;
	const allowedFields = fieldsByType[type] ?? [];

	for (const key of Object.keys(fields)) {
		if (!allowedFields.includes(key)) delete fields[key];
	}

	const encryptableField = encryptFieldByType[type];
	const encryptableValue = encryptableField
		? fields[encryptableField]
		: undefined;

	if (
		encryptableField &&
		(encryptableValue === undefined || encryptableValue === '')
	) {
		delete fields[encryptableField];
		model.value.encrypt = [encryptableField];
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
			required: true,
			options: {
				choices: [
					{ text: 'Basic Auth', value: 'basic' },
					{ text: 'Bearer Token', value: 'bearer' },
				],
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
			required: true,
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
			required: true,
		},
	},
	{
		field: 'password',
		name: 'Password',
		type: 'string',
		meta: {
			width: 'full',
			interface: 'app-secret-input',
			required: true,
		},
	},
];

const bearerAuthFields: DeepPartial<AppField>[] = [
	{
		field: 'token',
		name: 'Token',
		type: 'string',
		meta: {
			width: 'full',
			interface: 'app-secret-input',
			required: true,
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
		<VForm
			v-if="model?.type === 'bearer'"
			v-model="model.fields"
			class="extension-options"
			:fields="bearerAuthFields"
			:initial-values="model.fields"
			primary-key="bearer"
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
