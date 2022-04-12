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
