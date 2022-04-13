import React from 'react';
import { Avatar, AvatarGroup, Card, Chip, Typography } from '@mui/material';
import { stringAvatar } from '@/utils';
import { useTranslation } from 'react-i18next';

const StyledCard: React.FC = ({ children }) => <Card elevation={3}>{children}</Card>;
const StyledTitle: React.FC = ({ children }) => (
	<Typography component='h2' variant='h5'>
		{children}
	</Typography>
);
const StyledStatus: React.FC<{ label: string }> = ({ label }) => {
	const { t } = useTranslation();

	const color: Record<StaticStatus, string> = {
		Pending: 'error',
		Processing: 'info',
		Testing: 'warning',
		Done: 'success'
	};

	return <Chip label={t(`status.${label.toLowerCase()}`)} color={(color as any)[label]} />;
};
const StyledAvatarGroup: React.FC<{ data: AccountInfo[]; max?: number }> = ({ data, max = 4 }) => {
	return (
		<AvatarGroup max={max} sx={{ justifyContent: 'flex-end' }}>
			{data.map(member => {
				return member.avatar ? (
					<Avatar key={member.fullName} alt={member.fullName} src={member.avatar} />
				) : (
					<Avatar key={member.fullName} alt={member.fullName} {...stringAvatar(member.fullName!)} />
				);
			})}
		</AvatarGroup>
	);
};

export default {
	Card: StyledCard,
	Title: StyledTitle,
	Status: StyledStatus,
	AvatarGroup: StyledAvatarGroup
};
