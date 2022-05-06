export namespace Form {
	export type SignInForm = { email: string; password: string };
	export type SignUpForm<T = string> = Omit<Account<T>, '_id' | 'avatar'> & { password: string };
	export type RegisterForm = Omit<Account<string>, '_id' | 'avatar'>;
	export type ProjectForm<T = WithRole<{ _id: string }>> = {
		name: string;
		description: string;
		members: T[];
	};
	export type TaskForm<T = WithRole<{ _id: string }>> = {
		name: string;
		description: string;
		project: string;
		members: T[];
		dueTime: number;
	};
}
