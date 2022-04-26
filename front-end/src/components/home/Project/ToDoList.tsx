import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import TaskCard from '@/components/widgets/TaskCard';
import http from '@/utils/http';

const ToDoList: React.FC = () => {
	const [listData, setListData] = useState<TaskInfo[]>([]);

	useEffect(() => {
		http.get<TaskInfo[]>('/task/list').then(res => {
			setListData(res.data!);
		});
	}, []);

	return (
		<Stack direction={{ xs: 'row', lg: 'column' }} spacing={2}>
			{listData.map(item => (
				<TaskCard key={item._id} data={item} clickable />
			))}
		</Stack>
	);
};

export default ToDoList;
