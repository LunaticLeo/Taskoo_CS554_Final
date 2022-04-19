export namespace Form {
	export type SignInForm = { email: string; password: string };
	export type SignUpForm<T = string> = Omit<Account<T>, '_id' | 'avatar'> & { password: string };
	export type ProjectForm<T = WithRole<{ _id: string }>[]> = {
		name: string;
		description: string;
		members: T;
	};
}
