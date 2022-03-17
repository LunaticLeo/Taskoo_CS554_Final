import React from 'react';
import { Box, Stack } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Signin from './Signin';
import LangButton from '../LangButton';
import ThemeSwitch from '../ThemeSwitch';
import Signup from './Signup';

const Account: React.FC = () => {
	return (
		<Box sx={{ height: '100%', background: theme => theme.palette.background.default }}>
			<Stack
				sx={{
					position: 'absolute',
					top: { sm: 15, xs: 'auto' },
					right: 15,
					bottom: { sm: 'auto', xs: 15 },
					zIndex: theme => theme.zIndex.appBar
				}}
				direction='row'
				spacing={2}
			>
				<ThemeSwitch />
				<LangButton />
			</Stack>
			<Routes>
				<Route path='/' element={<Signin />} />
				<Route path='/signup/:firstname/:lastname' element={<Signup />} />
			</Routes>
		</Box>
	);
};

export default Account;
