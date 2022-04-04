import React, { useState } from 'react';
import { Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Logo from '../widgets/Logo';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Signin: React.FC = () => {
	const { t } = useTranslation();
	const [showPassword, setShowPassword] = useState<boolean>(false);

	return (
		<Stack component='form' autoComplete='off' spacing={5}>
			<Logo />
			<TextField id='email' label={t('email')} variant='standard' type='email' />
			<TextField
				id='password'
				label={t('password')}
				variant='standard'
				type={showPassword ? 'text' : 'password'}
				InputProps={{
					endAdornment: (
						<InputAdornment position='end'>
							<IconButton aria-label='icon-pwd' onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					)
				}}
			/>
			<Button size='large' variant='contained'>
				{t('signin')}
			</Button>
		</Stack>
	);
};

export default Signin;
