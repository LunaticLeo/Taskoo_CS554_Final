import React, { useState } from 'react';
import { Avatar, Box, IconButton, Menu, MenuItem, SxProps, Theme, Tooltip, Typography } from '@mui/material';
import { stringAvatar } from '@/utils';
import useAccountInfo from '@/hooks/useAccountInfo';

const AvatarMenu: React.FC<{ sx?: SxProps<Theme> }> = ({ sx }) => {
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const { avatar, fullName } = useAccountInfo();

	return (
		<Box sx={sx}>
			<Tooltip title='Open settings'>
				<IconButton onClick={e => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
					{avatar ? <Avatar alt={fullName} src={avatar} /> : <Avatar alt={fullName} {...stringAvatar(fullName)} />}
				</IconButton>
			</Tooltip>
			<Menu
				sx={{ mt: '45px' }}
				id='menu-appbar'
				anchorEl={anchorElUser}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={Boolean(anchorElUser)}
				onClose={() => setAnchorElUser(null)}
			>
				<MenuItem>
					<Typography textAlign='center'>Log out</Typography>
				</MenuItem>
			</Menu>
		</Box>
	);
};

export default AvatarMenu;
