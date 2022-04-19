import React, { useContext, useState } from 'react';
import { Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Logo from '../widgets/Logo';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toFormData } from '@/utils';
import http from '@/utils/http';
import { useNavigate } from 'react-router-dom';
import { LoadingContext } from '@/App';
import { useAppDispatch } from '@/hooks/useStore';
import { set } from '@/store/accountInfo';
import { Form } from '@/@types/form';

const Signin: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [signinForm, setSigninForm] = useState<Form.SignInForm>({ email: '', password: '' });
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const { setLoading } = useContext(LoadingContext);
	const dispatch = useAppDispatch();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const formData = toFormData<Form.SignInForm>(signinForm);
		http
			.post('/account/signin', formData)
			.then(res => {
				setTimeout(() => {
					setLoading(false);
					dispatch(set(res.data!));
					navigate('/home');
				}, 1000);
			})
			.catch(() => setTimeout(() => setLoading(false), 1000));
	};
	const handleInputChange = (val: Partial<Form.SignInForm>) => {
		setSigninForm(preVal => ({ ...preVal, ...val }));
	};

	return (
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
	);
};

export default Signin;
