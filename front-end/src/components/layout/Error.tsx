import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import error404 from '@/assets/404.svg';
import { useNavigate } from 'react-router-dom';

const Error: React.FC = () => {
	const navigate = useNavigate();

	return (
		<Stack className='all-center' spacing={1} alignItems='center' width='40%' height='fit-content'>
			<Box component='img' src={error404} alt='error-img'></Box>
			<Button variant='contained' sx={{ width: 'fit-content' }} onClick={() => navigate(-1)}>
				Back
			</Button>
		</Stack>
	);
};

export default Error;
