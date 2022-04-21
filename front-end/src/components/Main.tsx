import React, { useMemo } from 'react';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import Account from './account/Account';
import Home from './home/Home';
import Loading from './widgets/Loading';
import Error from './layout/Error';
import { SnackbarProvider } from 'notistack';
import { useAppSelector } from '@/hooks/useStore';
import { getDesignTokens } from '@/store/colorMode';

const Main: React.FC = () => {
	const loading = useAppSelector(state => state.loading.value);
	const mode = useAppSelector(state => state.colorMode.value);
	const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

	return (
		<ThemeProvider theme={theme}>
			<SnackbarProvider maxSnack={3}>
				<Box sx={{ height: '100vh', position: 'relative' }}>
					<Routes>
						<Route path='/' element={<Navigate to='/account/signin' replace />} />
						<Route path='/account/*' element={<Account />} />
						<Route path='/home/*' element={<Home />} />
						<Route path='/error/:code/:message' element={<Error />} />
						<Route path='*' element={<Error />} />
					</Routes>
				</Box>
				<Loading open={loading} />
			</SnackbarProvider>
		</ThemeProvider>
	);
};

export default Main;
