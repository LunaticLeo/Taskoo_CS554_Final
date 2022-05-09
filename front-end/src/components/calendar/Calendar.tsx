import React, { useLayoutEffect, useState } from 'react';
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import TuiCalendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { stringToColor } from '@/utils';
import { CalendarView } from '@/@types/props';
import { useTranslation } from 'react-i18next';
import http from '@/utils/http';
import { WithPage } from '@/@types/props';
import { randomBytes } from 'crypto';

dayjs.extend(utc);

const Calendar: React.FC = () => {
	const { t } = useTranslation();
	const [calendar, setCalendar] = useState<TuiCalendar | null>(null);
	const [view, setView] = useState<CalendarView>('day');
	const [lastClickSchedule,setLastClick]=useState({'id':'','calendarId':''});
	
	useLayoutEffect(() => {
		!calendar &&
			setCalendar(
				new TuiCalendar('#calendar', {
					defaultView: view,
					isReadOnly: true,
					disableDblClick: true,
					useDetailPopup: true
				})
			);
		return () => {
			calendar?.destroy();
			setCalendar(null);
		};
	}, []);

	useLayoutEffect(() => {
		if (!calendar) return;
		http.get<WithPage<Task[]>>('/task/todo').then(res=>{
			const tasks=res.data!.list;
			if(tasks){
				const formattask=tasks.map((task)=>{
					return createSchedule(task);
				})
				calendar.createSchedules(Object.values(formattask));
			}
		});
		// TODO get the task data from server side
		// http.get<>('').then(res => {
		//   // 1. call createSchedule to format the task
		//   // 2. call calendat.createSchedules(tasks) to add task into calendat
		// })
	}, [calendar]);

	const handleSwitchView = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newView = e.target.value as CalendarView;
		setView(newView);
		calendar?.changeView(newView);
	};

	return (
		<>
			<FormControl sx={{ mb: 1 }}>
				<FormLabel id='view-radio-group'>{t('calendar.view')}</FormLabel>
				<RadioGroup
					value={view}
					onChange={handleSwitchView}
					row
					aria-labelledby='views-radio'
					name='radio-buttons-group'
				>
					<FormControlLabel value='day' control={<Radio />} label={t<string>('calendar.day')} />
					<FormControlLabel value='week' control={<Radio />} label={t<string>('calendar.week')} />
					<FormControlLabel value='month' control={<Radio />} label={t<string>('calendar.month')} />
				</RadioGroup>
			</FormControl>
			<Box id='calendar' sx={{ width: '100%', height: '85vh' }} />
		</>
	);
};

const createSchedule = (task: Task) => {
	const { _id, name, description, createTime, dueTime, status } = task;
	let colors=["#087E8B","#BDE4A7","#B3D2B2","#9FBBCC","#A7A284","#FCBFB7","#49516F","#912F56","#BA2D0B","#A0DDFF"];

	return {
		id: _id,
		calendarId: '1',
		title: name,
		body: description,
		category: 'time',
		start: dayjs(+createTime).format(),
		end: dayjs(+dueTime).format(),
		isReadOnly: true,
		color: '#fff',
		bgColor: colors[Math.floor(Math.random()*9)],
		state: ['Pending', 'Done'].includes(status) ? 'free' : 'busy'
	};
};

export default Calendar;
