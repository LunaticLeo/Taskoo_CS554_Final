import React, { useMemo, useState } from 'react';
import { Box, IconButton, Paper, Stack, Toolbar, Typography } from '@mui/material';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SESSION_KEY } from '@/utils/keys';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Dashboard from './Dashboard/Dashboard';
import Nav from './Nav';
import AvatarMenu from '../widgets/AvatarMenu';
import Notification from '../widgets/Notification';
import Project from './Project/Project';
import Profile from './Profile/Profile';
import Detail from './Project/Detail';
import Search from '../widgets/Search';

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
		<Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
					{curView && (
						<Typography component='h1' variant='h4' mr={2}>
							{t(`menu.${curView}`)}
						</Typography>
					)}
					<Search />

					<Stack direction='row' spacing={2} sx={{ ml: 'auto' }}>
						<Notification />
						<AvatarMenu />
					</Stack>
				</Toolbar>
				<Box sx={{ p: 3 }}>
					<Routes>
						<Route path='/' element={<Navigate to='/home/dashboard' replace />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/profile' element={<Profile />} />
						<Route path='/project' element={<Project />} />
						<Route path='/project/:id' element={<Detail />} />
					</Routes>
				</Box>
			</Paper>
		</Box>
	);
};

export default Home;
