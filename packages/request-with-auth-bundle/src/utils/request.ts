import type { AxiosInstance } from 'axios';

const _cache: { axiosInstance: AxiosInstance | null } = {
	axiosInstance: null,
};

export async function getAxios() {
	if (!_cache.axiosInstance) {
		// eslint-disable-next-line unicorn/no-await-expression-member
		const axios = (await import('axios')).default;
		const { Agent: AgentHttp } = await import('node:http');
		const { Agent: AgentHttps } = await import('node:https');

		const httpAgent = new AgentHttp();
		const httpsAgent = new AgentHttps();

		_cache.axiosInstance = axios.create({ httpAgent, httpsAgent });
	}

	return _cache.axiosInstance;
}
