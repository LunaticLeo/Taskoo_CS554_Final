import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import error404 from '@/assets/404.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorProps, ImgSrc } from '@/@types/props';

const imgs: Record<ImgSrc, string> = { 401: '', 403: '', 404: error404, 500: '' };

const Error: React.FC<ErrorProps> = ({ message, code = 404 }) => {
	const navigate = useNavigate();
	const { code: _code, message: _message } = useParams();
	code = _code ?? code;
	message = _message ?? message;
	console.log(message);

	return (
		<Stack className='all-center' spacing={1} alignItems='center' width='40%' height='fit-content'>
			<Box component='img' src={imgs[code as ImgSrc]} alt='error-img'></Box>
			{message && (
				<Typography variant='body1' color='primary'>
					{message}
				</Typography>
			)}
			<Button variant='contained' sx={{ width: 'fit-content' }} onClick={() => navigate('/')}>
				Back To Home
			</Button>
		</Stack>
	);
};

export default Error;
