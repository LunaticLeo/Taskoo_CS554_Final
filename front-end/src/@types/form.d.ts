export namespace Form {
	export type SignInForm = { email: string; password: string };
	export type SignUpForm = Omit<Account<string>, '_id' | 'avatar'> & { password: string };
	export type ProjectForm<T = WithRole<{ _id: string }>[]> = {
		name: string;
		description: string;
		members: T;
	};
}
