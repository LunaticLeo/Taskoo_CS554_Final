import React from 'react';
import { Button, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Logo from '../widgets/Logo';

const Signin: React.FC = () => {
	const { t } = useTranslation();

	return (
		<Stack component='form' autoComplete='off' spacing={5}>
			<Logo />
			<TextField id='email' label={t('email')} variant='standard' type='email' />
			<TextField id='password' label={t('password')} variant='standard' type='password' />
			<Button size='large' variant='contained'>
				{t('signin')}
			</Button>
		</Stack>
	);
};

export default Signin;
