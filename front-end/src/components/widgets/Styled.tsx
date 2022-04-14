import React from 'react';
import {
	Avatar,
	AvatarGroup,
	Card,
	Chip,
	Dialog,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Slide,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import { stringAvatar } from '@/utils';
import { useTranslation } from 'react-i18next';
import { TransitionProps } from '@mui/material/transitions';
import { Box } from '@mui/system';

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
const StyledAccountInfo: React.FC<Partial<Account> & { fullName: string; component?: React.ElementType<any> }> = ({
	avatar,
	fullName,
	position,
	component = ListItem
}) => {
	return (
		<Box component={component}>
			<ListItemAvatar>
				{avatar ? <Avatar alt={fullName} src={avatar} /> : <Avatar alt={fullName} {...stringAvatar(fullName)} />}
			</ListItemAvatar>
			<ListItemText primary={fullName} secondary={position} />
		</Box>
	);
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
const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction='up' ref={ref} {...props} />;
});
const StyledDialog: React.FC<{ open: boolean; onClose: React.Dispatch<React.SetStateAction<boolean>> }> = ({
	open,
	onClose,
	children
}) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
	return (
		<Dialog
			open={open}
			onClose={() => onClose(false)}
			maxWidth='md'
			fullWidth
			fullScreen={fullScreen}
			TransitionComponent={Transition}
		>
			{children}
		</Dialog>
	);
};

export default {
	Card: StyledCard,
	Title: StyledTitle,
	Status: StyledStatus,
	AccountInfo: StyledAccountInfo,
	AvatarGroup: StyledAvatarGroup,
	Dialog: StyledDialog
};
