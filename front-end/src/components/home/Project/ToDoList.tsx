import React, { useState } from 'react';
import { Stack } from '@mui/material';
import dayjs from 'dayjs';
import TaskCard from '@/components/widgets/TaskCard';

// CLEAR
const fakeData: TaskInfo[] = [
	{
		_id: '16e48965-37b7-4c6f-b9b7-c414af72dfa1',
		name: 'Example',
		description:
			'Est quis labore cupidatat aute aliquip irure ullamco nulla. Voluptate laborum enim voluptate in culpa deserunt Lorem et eu in et consequat irure eiusmod. Eiusmod officia id consectetur ea ut deserunt quis nulla deserunt. Adipisicing in dolore cillum Lorem ullamco nisi cupidatat. Irure pariatur occaecat nisi id sint dolore proident.',
		dueTime: dayjs()
			.add(~~Math.random(), 'day')
			.valueOf(),
		status: 'Processing',
		members: [
			{
				_id: '8bef36f6-ab39-4755-bbbd-d6199179a64c',
				fullName: 'Shihao Xiong',
				avatar: 'https://storage.cloud.google.com/taskoo_bucket/IMG_0586.JPG'
			},
			{
				_id: '8e7434ac-1863-4210-8d51-39f5f8a8ec63',
				fullName: 'Yufu Liao',
				avatar: 'https://storage.cloud.google.com/taskoo_bucket/IMG_0587.JPG'
			},
			{
				_id: '91f3c274-2a94-4cfa-8a48-b136538573cc',
				fullName: 'Shilin Ding',
				avatar: 'https://storage.cloud.google.com/taskoo_bucket/IMG_0588.JPG'
			}
		]
	}
];

const ToDoList: React.FC = () => {
	const [listData, setListData] = useState<TaskInfo[]>(fakeData);

	return (
		<Stack direction={{ xs: 'row', lg: 'column' }} spacing={2}>
			{listData.map(item => (
				<TaskCard key={item._id} {...item} />
			))}
		</Stack>
	);
};

export default ToDoList;
