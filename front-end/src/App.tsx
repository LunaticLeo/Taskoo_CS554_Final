import { createContext, useMemo, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, PaletteMode } from '@mui/material';
import { createTheme, darken, lighten, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import { getMediaTheme } from './utils';
import Account from './components/account/Account';
import Error from './components/layout/Error';
import Home from './components/home/Home';
import Loading from './components/widgets/Loading';
import { SnackbarProvider } from 'notistack';
import { indigo } from '@mui/material/colors';
import { Provider } from 'react-redux';
import store from '@/store';

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
						<Provider store={store}>
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
						</Provider>
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
		pending: { main: '#FB6D57', contrastText: '#fff', light: lighten('#FB6D57', 1.2), dark: darken('#FB6D57', 1.2) },
		processing: { main: '#4A6EFC', contrastText: '#fff', light: lighten('#4A6EFC', 1.2), dark: darken('#4A6EFC', 1.2) },
		testing: { main: '#F5AE42', contrastText: '#fff', light: lighten('#F5AE42', 1.2), dark: darken('#F5AE42', 1.2) },
		done: { main: '#53CC9F', contrastText: '#fff', light: lighten('#53CC9F', 1.2), dark: darken('#53CC9F', 1.2) },
		...(mode === 'light'
			? {
					// light mode
					primary: { main: indigo[500] },
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
	}
});

declare module '@mui/material/styles' {
	interface Palette {
		pending: Palette['primary'];
		processing: Palette['primary'];
		testing: Palette['primary'];
		done: Palette['primary'];
	}
	interface PaletteOptions {
		pending: Palette['primary'];
		processing: Palette['primary'];
		testing: Palette['primary'];
		done: Palette['primary'];
	}
}

export default App;
