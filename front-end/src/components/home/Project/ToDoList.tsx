import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { WithPage } from '@/@types/props';
import TaskCard from '@/components/widgets/TaskCard';
import http from '@/utils/http';

const ToDoList: React.FC = () => {
	const [listData, setListData] = useState<Task[]>([]);

	useEffect(() => {
		http.get<WithPage<Task[]>>('/task/list').then(res => {
			setListData(res.data!.list);
		});
	}, []);

	return (
		<Stack direction={{ xs: 'row', lg: 'column' }} sx={{ position: 'sticky', top: 64 }} spacing={2}>
			{listData.map(item => (
				<TaskCard key={item._id} data={item} clickable />
			))}
		</Stack>
	);
};

export default ToDoList;
