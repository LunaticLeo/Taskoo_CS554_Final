import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, IconButton, Paper, Stack, Toolbar, Typography } from '@mui/material';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { STORAGE_KEY } from '@/utils/keys';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Dashboard from './Dashboard/Dashboard';
import Nav from './Nav';
import AvatarMenu from '../widgets/AvatarMenu';
import Notification from '../widgets/Notification';
import Project from './Project/Project';
import Profile from './Profile/Profile';
import Detail from './Project/Detail';
import Search from '../widgets/Search';
import Organzation from './Organization/Organization';
import Calendar from '../calendar/Calendar';

const Home: React.FC = () => {
	const { t } = useTranslation();
	const [openDrawer, setOpenDrawer] = useState<boolean>(false);
	const { pathname } = useLocation();
	const curView = useMemo(() => {
		const title = pathname.match(/\/home\/(\w+)$/);
		return title ? title[1] : '';
	}, [pathname]);

	const [toolbarHeight, setToolbarHeight] = useState<number>(0);

	const toolbar = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		setToolbarHeight(toolbar.current?.clientHeight ?? 64);
	}, [toolbar]);

	return localStorage.getItem(STORAGE_KEY) ? (
		<Box sx={{ display: 'flex', minHeight: '100vh' }}>
			<Nav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
			<Paper component='main' square elevation={0} sx={{ flex: 1 }}>
				<Toolbar
					component='div'
					ref={toolbar}
					sx={{
						position: 'sticky',
						top: 0,
						background: theme => theme.palette.background.paper,
						zIndex: theme => theme.zIndex.appBar
					}}
				>
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
				<Box sx={{ p: 3, height: `calc(100% - ${toolbarHeight}px)` }}>
					<Routes>
						<Route path='/' element={<Navigate to='/home/dashboard' replace />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/profile' element={<Profile />} />
						<Route path='/project' element={<Project />} />
						<Route path='/project/:id' element={<Detail />} />
						<Route path='/calendar' element={<Calendar />} />
						<Route path='/organization' element={<Organzation />} />
					</Routes>
				</Box>
			</Paper>
		</Box>
	) : (
		<Navigate to='/account/signin' replace />
	);
};

export default Home;
