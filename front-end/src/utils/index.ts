import { PaletteMode } from '@mui/material';

/**
 * format the string to capitalize
 * e.g. abc -> Abc
 */
export const toCapitalize = (str: string): string => {
	return str?.toLowerCase().replace(/^./, l => l.toUpperCase());
};

/**
 * get the system theme mode
 * @returns {PaletteMode} 'light' | 'dark'
 */
export const getMediaTheme = (): PaletteMode => {
	const mediaTheme = window.matchMedia('(prefers-color-scheme: light)');
	return mediaTheme.matches ? 'light' : 'dark';
};
