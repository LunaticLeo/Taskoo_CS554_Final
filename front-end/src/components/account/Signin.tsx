import React from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Logo from '../Logo';

const Signin: React.FC = () => {
	const { t } = useTranslation();

	return (
		<Box
			sx={{
				width: { lg: '30%', md: '40%', sm: '60%', xs: '100%' },
				height: 'fit-content',
				padding: { lg: 9, md: 6, xs: 3 }
			}}
			className='all-center'
		>
			<Stack component='form' autoComplete='off' spacing={5}>
				<Logo />
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
