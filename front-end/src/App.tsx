import { createContext, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, PaletteMode } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Account from './components/account/Account';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
	const [mode, setMode] = useState<PaletteMode>('light');
	const colorMode = useMemo(
		() => ({
			// The dark mode switch would invoke this method
			toggleColorMode: () => {
				setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'));
			}
		}),
		[]
	);
	const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<Router>
					<Box sx={{ height: '100vh' }}>
						<Routes>
							<Route path='*' element={<Account />} />
							<Route path='/account' element={<Account />} />
						</Routes>
					</Box>
				</Router>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

const getDesignTokens = (mode: PaletteMode) => ({
	palette: {
		mode,
		...(mode === 'light'
			? {
					primary: { main: '#3f6af6' },
					background: { default: '#eef2f5' }
			  }
			: {
					background: { default: '#121212' }
			  })
	}
});

export default App;
