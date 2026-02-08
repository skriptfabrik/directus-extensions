import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'app-secret-selector',
	name: 'Secret Selector',
	icon: 'shield_lock',
	description: 'An interface for selecting and managing app secrets',
	component: InterfaceComponent,
	options: null,
	types: ['integer'],
});
