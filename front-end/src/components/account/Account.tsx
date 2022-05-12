import React,{useEffect} from 'react';
import { Box, Stack } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './Signin';
import LangButton from '../widgets/LangButton';
import ThemeSwitch from '../widgets/ThemeSwitch';
import Signup from './Signup';
import DynamicBG from '../layout/DynamicBG';
import { STORAGE_KEY } from '@/utils/keys';
import useSocket from '@/hooks/useSocket';
import { useAppDispatch } from '@/hooks/useStore';
import { clear } from '@/store/accountInfo';

const Account: React.FC = () => {
	const socket = useSocket();
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (socket) {
			socket?.on('disconnect',(msg)=>{
				dispatch(clear());
			});
		}
	}, [socket]);
	
	return localStorage.getItem(STORAGE_KEY) ? <Navigate to="/home/dashboard" replace /> : <Box sx={{ height: '100%', background: theme => theme.palette.background.default }}>
	<DynamicBG />
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
	<Box
		sx={{
			width: { lg: '30%', md: '40%', sm: '60%', xs: '100%' },
			height: 'fit-content',
			padding: { lg: 9, md: 6, xs: 3 }
		}}
		className='all-center'
	>
		<Routes>
			<Route path='/signin' element={<Signin />} />
			<Route path='/signup/:registerId' element={<Signup />} />
		</Routes>
	</Box>
</Box>
};

export default Account;
