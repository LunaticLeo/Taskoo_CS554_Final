import React from 'react';
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingProps {
	open: boolean;
}

const Loading: React.FC<LoadingProps> = ({ open }) => {
	return (
		<Backdrop sx={{ color: theme => theme.palette.primary.main, zIndex: theme => theme.zIndex.drawer + 1 }} open={open}>
			<CircularProgress color='inherit' />
		</Backdrop>
	);
};

export default Loading;
