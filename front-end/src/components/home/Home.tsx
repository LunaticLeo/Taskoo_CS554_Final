import React, { useMemo, useState } from 'react';
import { Box, IconButton, Paper, Toolbar, Typography } from '@mui/material';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Dashboard from './Dashboard';
import Nav from './Nav';
import { toCapitalize } from '@/utils';
import Calendar from './Calendar';

const Home: React.FC = () => {
	const [openDrawer, setOpenDrawer] = useState<boolean>(false);
	const { pathname } = useLocation();
	const curView = useMemo(() => {
		const title = pathname.match(/\/home\/(\w+)$/);
		return title ? toCapitalize(title[1]) : '';
	}, [pathname]);

	return (
		<Box sx={{ display: 'flex', height: '100vh' }}>
			<Nav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
			<Paper component='main' square elevation={0} sx={{ flex: 1 }}>
				<Toolbar>
					<IconButton
						aria-label='drawer-control'
						sx={{ mr: 2, display: { sm: 'none' } }}
						onClick={() => setOpenDrawer(true)}
					>
						<MenuRoundedIcon />
					</IconButton>
					<Typography component='h1' variant='h4'>
						{curView}
					</Typography>
				</Toolbar>
				<Routes>
					<Route path='/' element={<Navigate to='/home/dashboard' replace />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/calendar' element={<Calendar />} />
				</Routes>
			</Paper>
		</Box>
	);
};

export default Home;
