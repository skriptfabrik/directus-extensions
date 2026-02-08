import { defineOperationApp } from '@directus/extensions-sdk';

export default defineOperationApp({
	id: 'request_with_auth',
	name: 'Request with Auth',
	icon: 'shield_lock',
	description: 'Make a request to a URL with Authentication',
	overview: ({ url, method, secret }) => [
		{
			label: '$t:operations.request.url',
			text: url,
		},
		{
			label: '$t:operations.request.method',
			text: method ?? 'GET',
		},
		{
			label: 'Credential',
			text: secret ? 'Set' : 'None',
		},
	],
	options: [
		{
			field: 'secret',
			name: 'Credential',
			type: 'integer',
			meta: {
				width: 'full',
				interface: 'app-secret-selector',
				// interface: 'custom',
			},
		},
		{
			field: 'method',
			name: '$t:operations.request.method',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ value: 'GET', text: 'GET' },
						{ value: 'POST', text: 'POST' },
						{ value: 'PATCH', text: 'PATCH' },
						{ value: 'DELETE', text: 'DELETE' },
					],
					allowOther: true,
				},
			},
			schema: {
				default_value: 'GET',
			},
		},
		{
			field: 'url',
			name: '$t:operations.request.url',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				options: {
					placeholder: '$t:operations.request.url_placeholder',
				},
			},
		},
		{
			field: 'headers',
			name: '$t:operations.request.headers',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'list',
				options: {
					fields: [
						{
							field: 'header',
							name: '$t:operations.request.header',
							type: 'string',
							meta: {
								width: 'half',
								interface: 'input',
								required: true,
								options: {
									placeholder: '$t:operations.request.header_placeholder',
								},
							},
						},
						{
							field: 'value',
							name: '$t:value',
							type: 'string',
							meta: {
								width: 'half',
								interface: 'input',
								required: true,
								options: {
									placeholder: '$t:operations.request.value_placeholder',
								},
							},
						},
					],
				},
			},
		},
		{
			field: 'body',
			name: '$t:request_body',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input-multiline',
				options: {
					font: 'monospace',
					placeholder: '$t:any_string_or_json',
				},
			},
		},
		{
			field: 'retry_on_fail',
			name: 'Retry on Fail',
			type: 'boolean',
			meta: {
				interface: 'boolean',
				options: {
					label: 'Retry on Fail',
				},
				width: 'half-left',
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'retry_count',
			name: 'Number of retries',
			type: 'integer',
			meta: {
				hidden: true,
				width: 'half',
				interface: 'input',
				options: {
					placeholder: '0',
				},
				conditions: [
					{
						rule: {
							retry_on_fail: { _eq: true },
						},
						hidden: false,
					},
				],
			},
		},
		{
			field: 'retry_delay',
			name: 'Retry delay (ms)',
			type: 'integer',
			meta: {
				hidden: true,
				width: 'half',
				interface: 'input',
				options: {
					placeholder: '1000',
				},
				conditions: [
					{
						rule: {
							retry_on_fail: { _eq: true },
						},
						hidden: false,
					},
				],
			},
		},
	],
});
