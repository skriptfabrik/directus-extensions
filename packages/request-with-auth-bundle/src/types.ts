export interface AppSecret {
	id: number;
	name: string;
	type: 'basic' | 'bearer';
	fields: Record<string, string>;
}

export interface AppSecretPayload extends Omit<AppSecret, 'id'> {
	id?: AppSecret['id'];
	encrypt?: string[];
}
