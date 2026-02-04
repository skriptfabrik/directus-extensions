import { definePanel } from '@directus/extensions-sdk';
import PanelComponent from './panel.vue';
import previewSvg from './previewSvg';
import { getDefaultInterfaceForType } from './utils/getDefaultInterfaceForType';

export default definePanel({
	id: 'variable-with-button',
	name: 'Variable with Button',
	icon: 'science',
	description:
		'Extends the global variable panel with a button to save the variable.',
	preview: previewSvg,
	component: PanelComponent,
	variable: true,
	options: (panel) => [
		{
			name: 'Variable key',
			field: 'field',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				options: {
					dbSafe: true,
					font: 'monospace',
				},
			},
		},
		{
			name: 'Type',
			field: 'type',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: '$t:string',
							value: 'string',
						},
						{
							text: '$t:text',
							value: 'text',
						},
						{ divider: true },
						{
							text: '$t:boolean',
							value: 'boolean',
						},
						{ divider: true },
						{
							text: '$t:integer',
							value: 'integer',
						},
						{
							text: '$t:bigInteger',
							value: 'bigInteger',
						},
						{
							text: '$t:float',
							value: 'float',
						},
						{
							text: '$t:decimal',
							value: 'decimal',
						},
						{ divider: true },
						{
							text: '$t:geometry.All',
							value: 'geometry',
						},
						{ divider: true },
						{
							text: '$t:timestamp',
							value: 'timestamp',
						},
						{
							text: '$t:datetime',
							value: 'dateTime',
						},
						{
							text: '$t:date',
							value: 'date',
						},
						{
							text: '$t:time',
							value: 'time',
						},
						{ divider: true },
						{
							text: '$t:json',
							value: 'json',
						},
						{
							text: '$t:csv',
							value: 'csv',
						},
						{
							text: '$t:uuid',
							value: 'uuid',
						},
						{
							text: '$t:hash',
							value: 'hash',
						},
					],
				},
			},
		},
		{
			name: 'Default value',
			field: 'defaultValue',
			type: panel.options?.type,
			meta: {
				interface: panel.options?.type
					? getDefaultInterfaceForType(panel.options.type)
					: 'input',
				readonly: !panel.options?.type,
				width: 'half',
			},
		},
		{
			name: 'Interface',
			field: 'inter',
			type: 'string',
			meta: {
				interface: 'system-interface',
				width: 'half',
				options: {
					typeField: 'type',
				},
			},
		},
		{
			name: 'Options',
			field: 'options',
			type: 'string',
			meta: {
				interface: 'system-interface-options',
				width: 'full',
				options: {
					interfaceField: 'inter',
				},
			},
		},
	],
	minWidth: 12,
	minHeight: 6,
	skipUndefinedKeys: ['options'],
});
