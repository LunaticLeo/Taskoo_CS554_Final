import React, { useState } from 'react';
import { Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Logo from '../widgets/Logo';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toFormData } from '@/utils';
import http from '@/utils/http';
import Loading from '../widgets/Loading';
import { useNavigate } from 'react-router-dom';

interface SignInForm {
	email: string;
	password: string;
}

const Signin: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [signinForm, setSigninForm] = useState<SignInForm>({ email: '', password: '' });
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const formData = toFormData<SignInForm>(signinForm);
		http
			.post('/account/signin', formData)
			.then(res => {
				sessionStorage.setItem('account', JSON.stringify(res.data));
				setLoading(false);
				navigate('/home');
			})
			.catch(() => setLoading(false));
	};
	const handleInputChange = (val: Partial<SignInForm>) => {
		setSigninForm(preVal => ({ ...preVal, ...val }));
	};

	return (
		<>
			<Stack component='form' autoComplete='off' spacing={5} onSubmit={handleSubmit}>
				<Logo />
				<TextField
					id='email'
					label={t('email')}
					variant='standard'
					type='email'
					onChange={e => handleInputChange({ email: e.target.value })}
				/>
				<TextField
					id='password'
					label={t('password')}
					variant='standard'
					type={showPassword ? 'text' : 'password'}
					onChange={e => handleInputChange({ password: e.target.value })}
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
				<Button size='large' variant='contained' type='submit'>
					{t('signin')}
				</Button>
			</Stack>

			<Loading open={loading} />
		</>
	);
};

export default Signin;
