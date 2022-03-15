import React from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Logo from '../Logo';

const Signin: React.FC = () => {
	const { t } = useTranslation();

	return (
		<Box
			sx={{
				width: { lg: '30%', md: '40%', xs: '100%' },
				height: { lg: '70%', md: '85%', xs: '100%' },
				padding: { lg: 9, md: 6, xs: 3 }
			}}
			className='all-center'
		>
			<Logo />
			<Stack component='form' autoComplete='off' spacing={5}>
				<TextField id='email' label={t('email')} variant='standard' type='email' />
				<TextField id='password' label={t('password')} variant='standard' type='password' />
				<Button size='large' variant='contained'>
					{t('signin')}
				</Button>
			</Stack>
		</Box>
	);
};

export default Signin;
