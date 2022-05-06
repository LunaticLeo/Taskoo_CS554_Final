import React, { useEffect, useState } from 'react';
import { Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Logo from '../widgets/Logo';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toFormData } from '@/utils';
import http from '@/utils/http';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/useStore';
import { set } from '@/store/accountInfo';
import { Form } from '@/@types/form';
import { setLoading } from '@/store/loading';
import useNotification from '@/hooks/useNotification';
import useValidation from '@/hooks/useValidation';

const Signin: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const notificate = useNotification();
	const { state } = useLocation();
	const [signinForm, setSigninForm] = useState<Form.SignInForm>({ email: '', password: '' });
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const { email, password } = useValidation();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(setLoading(true));
		const formData = toFormData<Form.SignInForm>(signinForm);
		http
			.post('/account/signin', formData)
			.then(res => {
				setTimeout(() => {
					dispatch(setLoading(false));
					dispatch(set(res.data!));
					navigate('/home');
				}, 1000);
			})
			.catch(err => {
				notificate.error(err?.message ?? err);
				setTimeout(() => dispatch(setLoading(false)), 1000);
			});
	};

	const handleInputChange = (val: Partial<Form.SignInForm>) => {
		setSigninForm(preVal => ({ ...preVal, ...val }));
	};

	useEffect(() => {
		(state as any)?.email && handleInputChange({ email: (state as any).email });
	}, [state]);

	return (
		<Stack component='form' autoComplete='off' spacing={5} onSubmit={handleSubmit}>
			<Logo />
			<TextField
				id='email'
				label={t('email')}
				variant='standard'
				type='email'
				value={signinForm.email}
				{...email((e: ChangeEvent) => handleInputChange({ email: e.target.value }))}
			/>
			<TextField
				id='password'
				label={t('password')}
				variant='standard'
				type={showPassword ? 'text' : 'password'}
				value={signinForm.password}
				{...password((e: ChangeEvent) => handleInputChange({ password: e.target.value }))}
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
	);
};

export default Signin;
