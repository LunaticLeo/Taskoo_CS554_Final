import React, { useMemo, useState } from 'react';
import { Box, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Dashboard from './Dashboard';
import Nav from './Nav';
import { SESSION_KEY } from '@/utils/keys';
import AvatarMenu from '../widgets/AvatarMenu';

const Home: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [openDrawer, setOpenDrawer] = useState<boolean>(false);
	const { pathname } = useLocation();
	const curView = useMemo(() => {
		const title = pathname.match(/\/home\/(\w+)$/);
		return title ? title[1] : '';
	}, [pathname]);

	!sessionStorage.getItem(SESSION_KEY) && navigate('/account/signin');

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			<Nav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
			<Paper component='main' square elevation={0} sx={{ flex: 1 }}>
				<Toolbar>
					<IconButton
						aria-label='drawer-control'
						sx={{ mr: 2, display: { lg: 'none' } }}
						onClick={() => setOpenDrawer(true)}
					>
						<MenuRoundedIcon />
					</IconButton>
					<Typography component='h1' variant='h4'>
						{t(`menu.${curView}`)}
					</Typography>

					<AvatarMenu sx={{ ml: 'auto' }} />
				</Toolbar>
				<Box sx={{ p: 3 }}>
					<Routes>
						<Route path='/' element={<Navigate to='/home/dashboard' replace />} />
						<Route path='/dashboard' element={<Dashboard />} />
					</Routes>
				</Box>
			</Paper>
		</Box>
	);
};

export default Home;
