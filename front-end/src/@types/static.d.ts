type StaticCollections = 'departments' | 'positions' | 'roles' | 'status';
type StaticStatus = 'Pending' | 'Processing' | 'Testing' | 'Done';

interface StaticData {
	_id: string;
	name: string;
	level?: number;
}
