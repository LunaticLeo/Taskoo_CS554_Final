import React, { useEffect, useState } from 'react';
import { Box as MuiBox, Stack, styled, useTheme } from '@mui/material';
import { WithPage } from '@/@types/props';
import TaskCard from '@/components/widgets/TaskCard';
import http from '@/utils/http';

const ToDoList: React.FC = () => {
	const theme = useTheme();
	const [listData, setListData] = useState<Task[]>([]);

	useEffect(() => {
		http.get<WithPage<Task[]>>('/task/todo').then(res => {
			setListData(res.data!.list);
		});
	}, []);

	return (
		<Box>
			{listData.map(item => (
				<TaskCard key={item._id} data={item} clickable />
			))}
		</Box>
	);
};

const Box = styled(MuiBox)(({ theme }) => ({
	position: 'sticky',
	paddingBottom: theme.spacing(1),
	top: 64,
	overflow: 'auto',
	[theme.breakpoints.down('lg')]: {
		width: `calc(100vw - ${theme.spacing(6)})`,
		height: 'auto',
		display: 'flex',
		'& > div:not(:first-of-type)': {
			marginLeft: theme.spacing(1.5)
		},
		'& > div': {
			height: 'auto'
		}
	},
	[theme.breakpoints.up('lg')]: {
		width: 'auto',
		height: '85vh',
		paddingLeft: theme.spacing(1),
		'& > div:not(:first-of-type)': {
			marginTop: theme.spacing(1.5)
		}
	}
}));

export default ToDoList;
