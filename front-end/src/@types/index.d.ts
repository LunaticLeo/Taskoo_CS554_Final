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

interface ProjectList extends DBCollections {
	name: string;
	createTime: number;
	status: StaticStatus;
	members: Required<AccountInfo>[];
}

interface ContactList extends AccountInfo {
	email: string;
	position: string;
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
