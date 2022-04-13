import React from 'react';
import { Button, Card, CardActions, CardContent, Divider, Stack, SxProps, Theme, Typography } from '@mui/material';
import Styled from './Styled';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const TaskCard: React.FC<TaskInfo & { sx?: SxProps<Theme> }> = ({
	name,
	description,
	status,
	members,
	dueTime,
	sx
}) => {
	const { t } = useTranslation();

	return (
		<Card sx={{ width: '100%', ...sx }}>
			<CardContent>
				<Stack spacing={1}>
					<Typography variant='h6' component='h2'>
						{name}
					</Typography>
					<Typography variant='body2' color='text.secondary' className='collapse'>
						{description}
					</Typography>
					<Stack direction='row' justifyContent='space-between'>
						<Styled.Status label={status} />
						<Styled.AvatarGroup data={members} />
					</Stack>
					<Stack direction='row' spacing={1}>
						<Typography color='primary' variant='body2' component='span'>
							{t('dueTime')}
						</Typography>
						<Typography variant='body2' component='span'>
							{dayjs(dueTime).format('MM/DD/YYYY')}
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

export default TaskCard;
