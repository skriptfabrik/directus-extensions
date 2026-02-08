import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'app-secret-input',
	name: 'Secret Input',
	icon: 'shield_lock',
	description: 'This is an interface to handle app secrets.',
	component: InterfaceComponent,
	options: null,
	types: ['string'],
});
