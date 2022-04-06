interface DBCollections {
	_id: string;
}

interface Account extends DBCollections {
	email: string;
	firstName: string;
	lastName: string;
	department: string;
	position: string;
	bucket: string;
	avatar: string | null;
}
