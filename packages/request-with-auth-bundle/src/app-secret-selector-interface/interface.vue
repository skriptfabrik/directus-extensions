<script lang="ts" setup>
import type { AppSecret, AppSecretPayload } from '../types';
import { useApi } from '@directus/extensions-sdk';
import { computed, onMounted, ref } from 'vue';
import CredentialForm from './components/CredentialForm.vue';

const props = defineProps<{ value: number | null; disabled?: boolean }>();
const emit = defineEmits<{ input: [number | null] }>();

const api = useApi();

const localValue = computed<number | null, number | null>({
	get: () => props.value,
	set: (value) => emit('input', value),
});

const secretDrawerOpen = ref(false);
const secretsLoaded = ref(false);
const appSecrets = ref<AppSecret[]>([]);
const selectedSecret = computed(() =>
	appSecrets.value.find((secret) => secret.id === localValue.value),
);
const isDanglingReference = computed(
	() =>
		secretsLoaded.value && localValue.value !== null && !selectedSecret.value,
);
const selectItems = computed(() => {
	const items = appSecrets.value.map((secret) => ({
		text: `${secret.type.toUpperCase()} - ${secret.name}`,
		value: secret.id,
	}));

	if (localValue.value !== null && isDanglingReference.value) {
		items.push({
			text: `Missing credential (#${localValue.value})`,
			value: localValue.value,
		});
	}

	return items;
});
const editableSecret = ref<Partial<AppSecretPayload>>();

// Depending on the database driver, Directus returns a `json` column either
// pre-parsed (e.g. Postgres/MySQL) or as a raw JSON string (e.g. SQLite).
const parseFields = (
	fields: AppSecret['fields'] | string | null,
): AppSecret['fields'] => {
	if (typeof fields !== 'string') return fields ?? {};
	return JSON.parse(fields || '{}') as AppSecret['fields'];
};

async function fetchSecrets() {
	const response = await api.get('/items/app_secrets?limit=-1');

	appSecrets.value = (response.data.data as AppSecret[]).map(
		({ fields, ...secret }) => ({ ...secret, fields: parseFields(fields) }),
	);

	secretsLoaded.value = true;
}

const openSecretDrawer = () => {
	editableSecret.value = selectedSecret.value
		? // eslint-disable-next-line unicorn/prefer-structured-clone
			JSON.parse(JSON.stringify(selectedSecret.value))
		: {
				type: 'basic',
				fields: {},
			};

	editableSecret.value && (editableSecret.value.encrypt = []);

	secretDrawerOpen.value = true;
};

const closeAndDiscardSecretDrawer = () => {
	editableSecret.value = undefined;
	secretDrawerOpen.value = false;
};

const saveAppSecret = async () => {
	const secret = editableSecret.value;
	if (!secret) return;
	const savedSecret: { data: { data: AppSecret } } | null = await (
		secret.id
			? api.patch(`/items/app_secrets/${secret.id}`, secret)
			: api.post('/items/app_secrets', secret)
	).catch(() => null);
	if (!savedSecret) return;
	await fetchSecrets();
	localValue.value = savedSecret.data.data.id as AppSecret['id'];
	closeAndDiscardSecretDrawer();
};

onMounted(fetchSecrets);
</script>

<template>
	<div class="app-secret-interface-wrapper">
		<div class="app-secret-interface-row">
			<VSelect
				v-model="localValue"
				placeholder="Select credential"
				show-deselect
				close-on-content-click
				label
				:disabled="disabled"
				:items="selectItems"
			/>
			<VButton icon :disabled="disabled" @click="openSecretDrawer">
				<VIcon v-if="selectedSecret" name="edit" />
				<VIcon v-else name="add" />
			</VButton>
		</div>
		<VNotice v-if="isDanglingReference" type="warning">
			The selected credential no longer exists. Please select or create another
			one.
		</VNotice>
		<VDrawer
			:model-value="secretDrawerOpen"
			persistent
			icon="lock"
			@cancel="closeAndDiscardSecretDrawer"
			@apply="saveAppSecret"
		>
			<template #title>
				<h1 class="type-title">
					{{ editableSecret?.name || 'New credential' }}
				</h1>
			</template>

			<template #actions>
				<VButton v-tooltip.bottom="'save'" icon rounded @click="saveAppSecret">
					<VIcon name="check" />
				</VButton>
			</template>
			<CredentialForm v-model="editableSecret" />
		</VDrawer>
	</div>
</template>

<style scoped>
.app-secret-interface-wrapper {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.app-secret-interface-row {
	display: flex;
	align-items: center;
	gap: 8px;
}
</style>
