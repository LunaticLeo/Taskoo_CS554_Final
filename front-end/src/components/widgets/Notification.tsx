import React from 'react';
import { Badge, IconButton } from '@mui/material';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';

const Notification: React.FC = () => {
	return (
		<IconButton color='primary' aria-label='notification-btn'>
			<Badge color='error' variant='dot' invisible={false}>
				<NotificationsNoneRoundedIcon fontSize='medium' color='inherit' />
			</Badge>
		</IconButton>
	);
};

export default Notification;
