import { createContext, useMemo, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, PaletteMode } from '@mui/material';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import { getMediaTheme } from './utils';
import Account from './components/account/Account';
import Error from './components/layout/Error';
import Home from './components/home/Home';
import Loading from './components/widgets/Loading';
import { SnackbarProvider } from 'notistack';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const LoadingContext = createContext({ setLoading: (status: boolean) => {} });

function App() {
	// set default theme mode
	const themeMode: PaletteMode = (window.sessionStorage.getItem('mode') as PaletteMode | null) ?? getMediaTheme();
	const [mode, setMode] = useState<PaletteMode>(themeMode);
	const colorMode = useMemo(
		() => ({
			// The dark mode switch would invoke this method
			toggleColorMode: () =>
				setMode((prevMode: PaletteMode) => {
					const targetMode = prevMode === 'light' ? 'dark' : 'light';
					window.sessionStorage.setItem('mode', targetMode);
					return targetMode;
				})
		}),
		[]
	);
	const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

	const [loading, setLoading] = useState<boolean>(false);
	const setLoadingStatus = useMemo(() => ({ setLoading: (status: boolean) => setLoading(status) }), []);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<SnackbarProvider maxSnack={3}>
				<LoadingContext.Provider value={setLoadingStatus}>
					<ThemeProvider theme={theme}>
						<Router>
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
						</Router>
					</ThemeProvider>
				</LoadingContext.Provider>
			</SnackbarProvider>
		</ColorModeContext.Provider>
	);
}

// set the paramters for theme
const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
	palette: {
		mode,
		...(mode === 'light'
			? {
					// light mode
					primary: { main: '#3f6af6' },
					background: { default: '#eef2f5' }
			  }
			: {
					// dark mode
					background: { default: '#121212' }
			  })
	},
	typography: {
		fontFamily:
			"Avenir, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;"
	},
	statusPalette: {
		Pending: '#FB6D57',
		Processing: '#4A6EFC',
		Testing: '#F5AE42',
		Done: '#53CC9F'
	}
});

declare module '@mui/material/styles' {
	interface Theme {
		statusPalette: {
			Pending: string;
			Processing: string;
			Testing: string;
			Done: string;
		};
	}
	interface ThemeOptions {
		statusPalette?: {
			Pending: string;
			Processing: string;
			Testing: string;
			Done: string;
		};
	}
}

export default App;
