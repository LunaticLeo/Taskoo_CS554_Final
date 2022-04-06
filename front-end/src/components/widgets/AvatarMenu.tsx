import React, { useMemo, useState } from 'react';
import { Avatar, Box, IconButton, Menu, MenuItem, SxProps, Theme, Tooltip, Typography } from '@mui/material';
import { SESSION_KEY } from '@/utils/keys';
import { stringAvatar, toCapitalize } from '@/utils';

const AvatarMenu: React.FC<{ sx?: SxProps<Theme> }> = ({ sx }) => {
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const { avatar, firstName, lastName } = JSON.parse(sessionStorage.getItem(SESSION_KEY)!) as Account;
	const fullName = useMemo(() => `${toCapitalize(firstName)} ${toCapitalize(lastName)}`, [firstName, lastName]);

	return (
		<Box sx={sx}>
			<Tooltip title='Open settings'>
				<IconButton onClick={e => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
					{avatar ? <Avatar alt='avatar' src={avatar} /> : <Avatar alt='avatar' {...stringAvatar(fullName)} />}
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
