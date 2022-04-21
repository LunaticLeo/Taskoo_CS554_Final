import React, { forwardRef } from 'react';
import { Button, Card, CardActions, CardContent, Divider, Stack, Typography } from '@mui/material';
import Styled from './Styled';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { TaskCardProps } from '@/@types/props';

const TaskCard: React.ForwardRefRenderFunction<HTMLDivElement, TaskCardProps> = ({ data, sx }, ref) => {
	const { t } = useTranslation();

	return (
		<Card ref={ref} sx={{ width: '100%', ...sx }}>
			<CardContent>
				<Stack spacing={1}>
					<Typography variant='h6' component='h2'>
						{data.name}
					</Typography>
					<Typography variant='body2' color='text.secondary' className='collapse'>
						{data.description}
					</Typography>
					<Stack direction='row' alignItems='center' justifyContent='space-between'>
						<Styled.Status label={data.status} />
						<Styled.AvatarGroup data={data.members} />
					</Stack>
					<Stack direction='row' spacing={1}>
						<Typography color='primary' variant='body2' component='span'>
							{t('dueTime')}
						</Typography>
						<Typography variant='body2' component='span'>
							{dayjs(data.dueTime).format('MM/DD/YYYY')}
						</Typography>
					</Stack>
				</Stack>
			</CardContent>
			<Divider />
			<CardActions>
				<Button color='primary'>{t('detail')}</Button>
			</CardActions>
		</Card>
	);
};

export default forwardRef(TaskCard);
