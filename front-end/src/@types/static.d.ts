type StaticCollections = 'departments' | 'positions' | 'roles' | 'status';
type StaticStatus = 'Pending' | 'Processing' | 'Testing' | 'Done';

interface StaticData {
	_id: string;
	name: string;
	level?: number;
	prerequire?: string | null;
	permit?: number;
}

type StatusPrerquest = Record<Lowercase<StaticStatus>, null | Lowercase<StaticStatus>>;
