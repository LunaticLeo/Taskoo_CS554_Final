type StaticCollections = 'departments' | 'positions' | 'roles' | 'status';

interface StaticData {
	_id: string;
	name: string;
	level?: number;
}
