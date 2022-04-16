interface DBCollections {
	_id: string;
}

interface AccountInfo extends DBCollections {
	fullName?: string;
	avatar: string | null;
}

interface Account extends AccountInfo {
	email: string;
	firstName: string;
	lastName: string;
	department: string;
	position: string;
	bucket: string;
}

type StoreAccountInfo = Omit<Account, 'bucket'> & { fullName: string };

interface ProjectInfo extends DBCollections {
	name: string;
	createTime: number;
	status: StaticStatus;
	members: Required<AccountInfo>[];
}

type ProjectForm = {
	name: string;
	description: string;
	members: { _id: string; role: string }[];
	attachments: File[];
};
type ProjectFormData = Record<keyof ProjectForm, string | string[] | File | File[]>;

interface ContactList extends AccountInfo {
	email: string;
	position: string;
}

interface Project extends DBCollections, Omit<ProjectForm, keyof { attachments: string[] }> {
	manager: AccountInfo & { role: string };
	task: string[];
	status: StaticStatus;
	createTime: number;
}

interface TaskInfo extends DBCollections {
	name: string;
	description?: string;
	dueTime: number;
	status: string;
	members: AccountInfo[];
}

interface Task extends TaskInfo {
	project: string;
	createTime: number;
	attachments?: string[];
}
