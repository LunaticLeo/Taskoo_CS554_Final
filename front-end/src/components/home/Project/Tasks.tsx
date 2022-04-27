import React, { useEffect, useMemo, useState } from 'react';
import { Box, Divider, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TaskCard from '@/components/widgets/TaskCard';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { TaskColumnProps, TasksProps, TaskColumnData } from '@/@types/props';
import TableList from '@/components/widgets/TableList';
import useFormatList from '@/hooks/useFormatList';
import http from '@/utils/http';
import useNotification from '@/hooks/useNotification';
import { toCapitalize } from '@/utils';

const header: (keyof TaskInfo)[] = ['name', 'createTime', 'dueTime', 'status', 'members'];

const Tasks: React.FC<TasksProps> = ({ data, setData, sx }) => {
	const theme = useTheme();
	const notification = useNotification();
	const [STATUS, setSTATUS] = useState<StatusPrerquest>({} as any);
	const hideColumns = useMediaQuery(theme.breakpoints.down('md'));
	const listData = useFormatList(
		useMemo(
			() =>
				Object.values(data).reduce((pre, cur) => {
					pre.push(...cur);
					return pre;
				}, []),
			[data]
		)
	);

	useEffect(() => {
		http.get<StaticData[]>('/static/status').then(res => {
			setSTATUS(
				res.data!.reduce((pre, cur) => {
					pre[cur.name.toLowerCase()] = cur.prerequire?.toLowerCase();
					return pre;
				}, {} as any)
			);
		});
	}, []);

	const onDragEnd = (res: DropResult) => {
		const { destination, source } = res;

		if (!destination) return;
		if (destination.droppableId === source.droppableId && destination.index === source.index) return;

		if (
			source.droppableId !== destination.droppableId &&
			STATUS[destination.droppableId as keyof StatusPrerquest] !== source.droppableId
		) {
			notification.error(
				`Cannot update status from ${toCapitalize(source.droppableId)} to ${toCapitalize(destination.droppableId)}`
			);
			return;
		}

		const srcColumn = [...data[source.droppableId as keyof TaskColumnData]];
		if (source.droppableId === destination.droppableId) {
			// do the reorder only
			[srcColumn[source.index], srcColumn[destination.index]] = [srcColumn[destination.index], srcColumn[source.index]];
			setData(preVal => ({
				...preVal,
				[source.droppableId]: srcColumn
			}));
		} else {
			const draggedItem = srcColumn.splice(source.index, 1)[0];
			const targetColumn = [...data[destination.droppableId as keyof TaskColumnData]];
			targetColumn.splice(destination.index, 0, draggedItem);
			setData(preVal => ({
				...preVal,
				[source.droppableId]: srcColumn,
				[destination.droppableId]: targetColumn
			}));
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			{hideColumns ? (
				<TableList<TaskInfo> showHeader header={header} data={listData as any} />
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
		<Box sx={{ flex: 1 }}>
			<Typography variant='h6' component='div'>
				{t(`status.${status.toLowerCase()}`).toUpperCase()}
			</Typography>
			<Divider
				sx={{
					backgroundColor: theme => (theme.palette as any)[status.toLowerCase()].main,
					borderBottomWidth: 'medium',
					mt: 1,
					mb: 2
				}}
			/>
			<Droppable droppableId={status}>
				{provided => (
					<Stack spacing={2} ref={provided.innerRef} {...provided.droppableProps}>
						{data.map((item, index) => (
							<Draggable key={item._id} draggableId={item._id} index={index}>
								{provided => (
									<TaskCard
										{...provided.dragHandleProps}
										{...provided.draggableProps}
										ref={provided.innerRef}
										data={item}
									/>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</Stack>
				)}
			</Droppable>
		</Box>
	);
};

export default Tasks;
