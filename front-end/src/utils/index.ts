import { PageConfig } from '@/@types/props';
import { PaletteMode, SxProps } from '@mui/material';
import React from 'react';
import http from './http';

/**
 * format the string to capitalize
 * e.g. abc -> Abc
 */
export const toCapitalize = (str: string): string => {
	return str?.toLowerCase().replace(/^./, l => l.toUpperCase());
};

/**
 * combind first name and last name to full name
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string} fullName
 */
export const toFullName = (firstName: string, lastName: string): string =>
	`${toCapitalize(firstName)} ${toCapitalize(lastName)}`;

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

/**
 * transfer obj to FormData
 * @param {T} obj
 * @returns {FormData}
 */
export const toFormData = <T extends Record<string, any>>(obj: T): FormData => {
	const formData = new FormData();
	Object.keys(obj).forEach(key => {
		if (Array.isArray(obj[key])) {
			(<string[] | File[]>obj[key]).forEach((item: string | Blob) => formData.append(key, item));
		} else {
			formData.append(key, obj[key] as string | Blob);
		}
	});
	return formData;
};

/**
 * calculate string and got a color
 * @param {string} string
 * @returns {string} color
 */
export const stringToColor = (string: string): string => {
	let hash = 0;
	let i;

	/* eslint-disable no-bitwise */
	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = '#';

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}
	/* eslint-enable no-bitwise */
	return color;
};

/**
 * get the proprity of Avatar
 * @param {string} name
 * @param {number} width the width
 * @param {number} height the height
 * @returns {{sx: SxProps, children: React.ReactNode}}
 */
export const stringAvatar = (
	name: string,
	width?: number,
	height?: number
): { sx: SxProps; children: React.ReactNode } => {
	const sx: SxProps = { bgcolor: stringToColor(name) };
	width && (sx.width = width);
	height && (sx.height = height);

	return {
		sx,
		children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
	};
};

export class Page implements PageConfig {
	pageNum = 1;
	pageSize = 10;
	count = 0;

	constructor(obj?: Partial<PageConfig>) {
		this.pageNum = obj?.pageNum ?? 1;
		this.pageSize = obj?.pageSize ?? 10;
	}
}
