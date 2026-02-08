import type { AppSecret } from '../types';
import { defineOperationApi } from '@directus/extensions-sdk';
import { isValidJSON } from '@directus/utils';
import { isAxiosError } from 'axios';
import encodeUrl from 'encodeurl';
import { getAxios } from '../utils/request';

interface Options {
	url: string;
	method: string;
	body: Record<string, any> | string | null;
	headers?: { header: string; value: string }[] | null;
	secret?: number | null;
	retry_on_fail?: boolean;
	retry_count?: number;
	retry_delay?: number;
}

export default defineOperationApi<Options>({
	id: 'request_with_auth',
	handler: async (
		{
			url,
			method,
			body,
			headers,
			secret,
			retry_count,
			retry_delay,
			retry_on_fail,
		},
		context,
	) => {
		const { services, getSchema, logger } = context;
		const { ItemsService, PayloadService } = services;
		const payloadService = new PayloadService('app_secrets', {
			schema: await getSchema(),
			// @ts-expect-error admin is sufficient
			accountability: { admin: true },
		});

		const decryptString = async (value?: string) => {
			// @ts-expect-error transformers do exist on PayloadService
			return await payloadService.transformers.encrypt({
				action: 'read',
				value,
				accountability: null,
			});
		};

		const decryptSecret = async (encryptedSecret?: AppSecret) => {
			if (!secret) return null;
			const decryptedSecret = { ...encryptedSecret };

			if (
				decryptedSecret.type === 'basic' &&
				decryptedSecret.fields?.password
			) {
				decryptedSecret.fields.password = await decryptString(
					decryptedSecret.fields?.password,
				);
			}

			return decryptedSecret;
		};

		const itemsService = new ItemsService('app_secrets', {
			schema: await getSchema(),
			// @ts-expect-error admin is sufficient
			accountability: { admin: true },
		});
		let credential;

		if (secret) {
			credential = await itemsService.readOne(secret);
			credential = await decryptSecret(credential as AppSecret);
		}

		const customHeaders =
			headers?.reduce(
				(acc, { header, value }) => {
					acc[header] = value;
					return acc;
				},
				{} as Record<string, string>,
			) ?? {};

		if (
			!customHeaders['Content-Type'] &&
			(typeof body === 'object' || isValidJSON(body))
		) {
			customHeaders['Content-Type'] = 'application/json';
		}

		if (
			credential?.type === 'basic' &&
			credential?.fields?.user &&
			credential?.fields?.password
		) {
			// eslint-disable-next-line n/prefer-global/buffer
			customHeaders.Authorization = `Basic ${Buffer.from(`${credential.fields.user}:${credential.fields.password}`).toString('base64')}`;
		}

		const axios = await getAxios();

		const maxAttempts = (retry_on_fail && retry_count ? retry_count : 0) + 1;
		const delayMs = retry_delay ?? 1000;

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				const result = await axios({
					url: encodeUrl(url),
					method,
					data: body,
					headers: customHeaders,
				});

				return {
					status: result.status,
					statusText: result.statusText,
					headers: result.headers,
					data: result.data,
				};
			} catch (error) {
				if (
					attempt < maxAttempts &&
					isAxiosError(error) &&
					error.response &&
					error.response.status >= 500
				) {
					logger.warn(
						`Request failed with status ${error.response.status}, retrying...`,
					);

					await new Promise((resolve) => setTimeout(resolve, delayMs));
					continue;
				}

				throw isAxiosError(error) && error.response
					? JSON.stringify({
							status: error.response.status,
							statusText: error.response.statusText,
							headers: error.response.headers,
							data: error.response.data,
						})
					: error;
			}
		}

		return null;
	},
});
