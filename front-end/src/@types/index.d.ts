/************************************************************* Account *************************************************************/
interface Account<T = string | StaticData> {
	_id: string;
	email: string;
	firstName: string;
	lastName: string;
	department: T;
	position: T;
	avatar: string;
}

type WithRole<S> = S & { role: string | StaticData };
type WithFullName<S> = S & { fullName: string };

/************************************************************* Porject *************************************************************/
interface Project {
	_id: string;
	name: string;
	description: string;
	createTime: number;
	members: Account[];
	status: StaticStatus;
	tasks: string[];
	attachments: string[];
}

type ProjectInfo = Pick<Project, 'name' | 'createTime' | 'status' | 'members'>;

// interface ContactList {
// 	email: string;
// 	position: string;
// }

// interface TaskInfo extends DBCollections {
// 	name: string;
// 	description?: string;
// 	dueTime: number;
// 	status: string;
// 	members: AccountInfo[];
// }

// interface Task extends TaskInfo {
// 	project: string;
// 	createTime: number;
// 	attachments?: string[];
// }
