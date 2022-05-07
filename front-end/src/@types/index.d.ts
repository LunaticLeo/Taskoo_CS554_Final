interface Menu {
	title?: string;
	id: string | number;
	children: MenuItem[];
}

interface MenuItem {
	icon: React.ReactElement;
	text: string;
	route: string;
}

type RequestMethod = 'get' | 'post' | 'put' | 'delete';
interface ResponseData<T> {
	code: number;
	message: string;
	data?: T;
}
type AxiosHttp = Record<RequestMethod, <T = {}>(path: string, param?: Object) => Promise<ResponseData<T>>>;

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

type WithRole<S, U = string | StaticData> = S & { role: U };
type WithFullName<S> = S & { fullName: string };

/************************************************************* Porject *************************************************************/
interface Project {
	_id: string;
	name: string;
	description: string;
	createTime: number;
	members: WithRole<Account<StaticData>, StaticData>[];
	status: StaticStatus;
	tasks: string[];
	attachments: string[];
}

type ProjectInfo = Pick<Project, '_id' | 'name' | 'createTime' | 'status'> & {
	members: WithRole<Omit<Account, 'department' | 'position'>>[];
};

/************************************************************* Task *************************************************************/
interface Task {
	_id: string;
	name: string;
	description: string;
	project: string;
	members: WithRole<Account<StaticData>, StaticData>[];
	createTime: number;
	dueTime: number;
	status: StaticStatus;
	attachments: string[];
}

type TaskInfo = Omit<Task, 'attachments'> & {
	members: WithRole<Omit<Account, 'department' | 'position'>>[];
};

type SearchOptions = { name: string; project: string; status: StaticStatus };

/************************************************************* Chart *************************************************************/
type StatisticPieChartOptions = Record<Lowercase<StaticStatus>, number> & { borderColor?: string };
type StatisticBarChartOptions = {
	_id: string;
	name: string;
	statistic: Record<Lowercase<StaticStatus>, number>;
};

type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
