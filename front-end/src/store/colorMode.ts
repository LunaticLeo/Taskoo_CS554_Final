import { getMediaTheme } from '@/utils';
import { darken, lighten, PaletteMode, ThemeOptions } from '@mui/material';
import { indigo } from '@mui/material/colors';
import { createSlice } from '@reduxjs/toolkit';

const initialState: { value: PaletteMode } = {
	value: (window.localStorage.getItem('mode') as PaletteMode | null) ?? getMediaTheme()
};

export const colorModeSlice = createSlice({
	name: 'colorMode',
	initialState,
	reducers: {
		switchMode: state => {
			const targetMode = state.value === 'light' ? 'dark' : 'light';
			window.localStorage.setItem('mode', targetMode);
			state.value = targetMode;
		}
	}
});

export const { switchMode } = colorModeSlice.actions;

export default colorModeSlice.reducer;

// set the paramters for theme
export const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
	palette: {
		mode,
		pending: { main: '#FB6D57', contrastText: '#fff', light: lighten('#FB6D57', 0.8), dark: darken('#FB6D57', 0.8) },
		processing: { main: '#4A6EFC', contrastText: '#fff', light: lighten('#4A6EFC', 0.8), dark: darken('#4A6EFC', 0.8) },
		testing: { main: '#F5AE42', contrastText: '#fff', light: lighten('#F5AE42', 0.8), dark: darken('#F5AE42', 0.8) },
		done: { main: '#53CC9F', contrastText: '#fff', light: lighten('#53CC9F', 0.8), dark: darken('#53CC9F', 0.8) },
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
