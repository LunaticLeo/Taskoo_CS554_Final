export const toCapitalize = (str: string): string => {
	return str?.toLowerCase().replace(/^./, l => l.toUpperCase());
};
