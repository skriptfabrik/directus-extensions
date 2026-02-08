import type { AppSecretPayload } from '../types';
import { defineHook } from '@directus/extensions-sdk';
import { AppSecretsCollection } from './AppSecretsCollection';

export default defineHook(({ filter, action }, context) => {
	const { services, getSchema, logger } = context;

	const encryptFields = async (
		fields: AppSecretPayload['fields'],
		encrypt?: AppSecretPayload['encrypt'],
	) => {
		if (!encrypt || encrypt.length === 0) return fields;
		const { PayloadService } = services;
		const payloadService = new PayloadService('app_secrets', {
			schema: await getSchema(),
			// @ts-expect-error admin is sufficient
			accountability: { admin: true },
		});

		const encryptData = async (value: string) => {
			// @ts-expect-error transformers do exist on PayloadService
			return (await payloadService.transformers
				.encrypt({
					action: 'write',
					value,
					accountability: null,
				})
				.catch(() => {
					logger.error('Error encrypting secret');
					return value;
				})) as string;
		};

		for (const index of encrypt) {
			if (!fields[index] || fields[index] === '') continue;
			fields[index] = await encryptData(fields[index]);
		}

		return fields;
	};

	filter('app_secrets.items.create', async (payload: AppSecretPayload) => {
		const fields = await encryptFields(payload.fields, payload.encrypt);
		delete payload.encrypt;
		return { ...payload, fields };
	});

	filter('app_secrets.items.update', async (payload: AppSecretPayload) => {
		if (!payload.fields) return payload;
		const fields = await encryptFields(payload.fields, payload.encrypt);
		delete payload.encrypt;
		return { ...payload, fields };
	});

	const checkSecretsCollection = async (meta: Record<string, any>) => {
		const { CollectionsService } = services;
		const collectionsService = new CollectionsService({
			schema: await getSchema(),
			// @ts-expect-error admin is sufficient
			accountability: { admin: true },
		});

		const secretsCollection = await collectionsService
			.readOne('app_secrets')
			.catch(() => null);

		if (secretsCollection) {
			logger.info(`Secrets collection found. (${meta.event})`);
			return;
		}

		await collectionsService
			.createOne(AppSecretsCollection)
			.then(() => logger.info(`Secrets collection created! (${meta.event})`))
			.catch((error) => {
				logger.error(
					`Failed to create secrets collection (${meta.event}):`,
					error,
				);
			});
	};

	action('server.start', checkSecretsCollection);
	action('extensions.installed', checkSecretsCollection);
});
