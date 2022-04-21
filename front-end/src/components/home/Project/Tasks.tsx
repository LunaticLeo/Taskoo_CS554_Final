import React from 'react';
import { Box, Divider, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TaskCard from '@/components/widgets/TaskCard';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { DraggableTaskCardProps, TaskColumnProps, TasksProps } from '@/@types/props';

const Tasks: React.FC<TasksProps> = ({ data, sx }) => {
	const theme = useTheme();
	const hideColumns = useMediaQuery(theme.breakpoints.down('md'));
	const onDragEnd = (res: DropResult) => {
		console.log(res);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			{hideColumns ? (
				<div>hide</div>
			) : (
				<Stack direction='row' spacing={{ md: 2, lg: 5 }} sx={sx}>
					{Object.keys(data).map(item => (
						<TaskColumn key={item} status={item} data={(data as any)[item]} />
					))}
				</Stack>
			)}
		</DragDropContext>
	);
};

const TaskColumn: React.FC<TaskColumnProps> = ({ status, data }) => {
	const { t } = useTranslation();

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Typography variant='h6' mb={1} component='div'>
				{t(`status.${status.toLowerCase()}`).toUpperCase()}
			</Typography>
			<Divider
				sx={{
					backgroundColor: theme => (theme.palette as any)[status.toLowerCase()].main,
					borderBottomWidth: 'medium'
				}}
			/>
			<Droppable droppableId={status}>
				{provided => (
					<Stack spacing={2} ref={provided.innerRef} {...provided.droppableProps}>
						{data.map((item, index) => (
							<DraggableTaskCard data={item} index={index} />
						))}
						{provided.placeholder}
					</Stack>
				)}
			</Droppable>
		</Box>
	);
};

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({ data, index }) => {
	return (
		<Draggable draggableId={data._id} index={index}>
			{provided => (
				<TaskCard {...provided.draggableProps} {...provided.draggableProps} ref={provided.innerRef} data={data} />
			)}
		</Draggable>
	);
};

export default Tasks;
