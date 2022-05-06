import React, { useState } from 'react';
import {
	alpha,
	Avatar,
	Badge as MuiBadge,
	Box,
	Divider,
	IconButton,
	ListItemIcon,
	Menu as MuiMenu,
	MenuItem,
	styled,
	Tooltip
} from '@mui/material';
import { stringAvatar } from '@/utils';
import useAccountInfo from '@/hooks/useAccountInfo';
import { useTranslation } from 'react-i18next';
import { AvatarMenuProps } from '@/@types/props';
import http from '@/utils/http';
import { useAppDispatch } from '@/hooks/useStore';
import { clear } from '@/store/accountInfo';
import useNotification from '@/hooks/useNotification';
import Styled from './Styled';
import { useNavigate } from 'react-router-dom';
import Logout from '@mui/icons-material/Logout';

const AvatarMenu: React.FC<AvatarMenuProps> = ({ sx }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const accountInfo = useAccountInfo();
	const dispatch = useAppDispatch();
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const { avatar, fullName } = useAccountInfo();
	const notificate = useNotification();

	const signOut = () => {
		http
			.post('/account/signout')
			.then(_ => dispatch(clear()))
			.catch(err => notificate.error(err?.message ?? err));
	};

	return (
		<Box sx={sx}>
			<Tooltip title={t('tooltip.setting') as string}>
				<IconButton onClick={e => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
					<Badge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot'>
						{avatar ? <Avatar alt={fullName} src={avatar} /> : <Avatar alt={fullName} {...stringAvatar(fullName)} />}
					</Badge>
				</IconButton>
			</Tooltip>
			<Menu
				id='menu-appbar'
				anchorEl={anchorElUser}
				keepMounted
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={Boolean(anchorElUser)}
				onClose={() => setAnchorElUser(null)}
			>
				<Styled.AccountInfo component={MenuItem} {...accountInfo} onClick={() => navigate('/home/profile')} />
				<Divider />
				<MenuItem onClick={signOut}>
					<ListItemIcon>
						<Logout fontSize='small' />
					</ListItemIcon>
					{t('signout')}
				</MenuItem>
			</Menu>
		</Box>
	);
};

const Menu = styled(MuiMenu)(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 6,
		marginTop: '45px',
		minWidth: 250,
		color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0'
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5)
			},
			'&:active': {
				backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
			}
		}
	}
}));

const Badge = styled(MuiBadge)(({ theme }) => ({
	'& .MuiBadge-badge': {
		backgroundColor: '#44b700',
		color: '#44b700',
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		'&::after': {
			position: 'absolute',
			top: -1,
			left: -1,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			animation: 'ripple 1.2s infinite ease-in-out',
			border: '1px solid currentColor',
			content: '""'
		}
	},
	'@keyframes ripple': {
		'0%': {
			transform: 'scale(.8)',
			opacity: 1
		},
		'100%': {
			transform: 'scale(2.4)',
			opacity: 0
		}
	}
}));

export default AvatarMenu;
