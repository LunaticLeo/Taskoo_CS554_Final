import { PaletteMode } from '@mui/material';
import http from './http';

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

/**
 * get the static data
 * @param {StaticCollections} collectionName
 * @param {string} id the specific id (optional)
 * @returns {Promise<StaticData | StaticData[]>}
 */
export const getStaticData = async (
	collectionName: StaticCollections,
	id?: string
): Promise<StaticData | StaticData[]> => {
	const res = await http.get<StaticData | StaticData[]>(`/static/${collectionName}`, { id });
	return res.data!;
};
