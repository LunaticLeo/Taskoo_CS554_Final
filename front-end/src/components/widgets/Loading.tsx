import React from 'react';
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { LoadingProps } from '@/@types/props';

const Loading: React.FC<LoadingProps> = ({ open }) => {
	return (
		<Backdrop
			sx={{ color: theme => theme.palette.primary.main, zIndex: theme => theme.zIndex.tooltip + 1 }}
			open={open}
		>
			<CircularProgress color='inherit' />
		</Backdrop>
	);
};

export default Loading;
