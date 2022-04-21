import React, { useState } from 'react';
import { Stack } from '@mui/material';
import TaskCard from '@/components/widgets/TaskCard';

const ToDoList: React.FC = () => {
	const [listData, setListData] = useState<TaskInfo[]>([]);

	return (
		<Stack direction={{ xs: 'row', lg: 'column' }} spacing={2}>
			{listData.map(item => (
				<TaskCard key={item._id} data={item} />
			))}
		</Stack>
	);
};

export default ToDoList;
