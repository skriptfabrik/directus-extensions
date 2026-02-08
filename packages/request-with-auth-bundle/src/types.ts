export interface AppSecret {
	id: number;
	name: string;
	type: 'basic' | 'header';
	fields: Record<string, string>;
}

export interface AppSecretPayload extends Omit<AppSecret, 'id'> {
	id?: AppSecret['id'];
	encrypt?: string[];
}
