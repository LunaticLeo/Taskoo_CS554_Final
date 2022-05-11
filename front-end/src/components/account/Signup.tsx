import React, { useEffect, useState } from 'react';
import { Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { toCapitalize, toFormData } from '@/utils';
import Logo from '../widgets/Logo';
import http from '@/utils/http';
import { Form } from '@/@types/form';
import { useAppDispatch } from '@/hooks/useStore';
import { setLoading } from '@/store/loading';
import useNotification from '@/hooks/useNotification';
import useValidation from '@/hooks/useValidation';

type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const Signup: React.FC = () => {
	const { t } = useTranslation();
	const { registerId } = useParams();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { email, password } = useValidation();
	const notificate = useNotification();
	const [signUpForm, setSignUpForm] = useState<Form.SignUpForm>({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		department: '',
		position: ''
	});
	const [displayForm, setDisplayForm] = useState<Omit<Form.SignUpForm, 'email' | 'password'>>({
		firstName: '',
		lastName: '',
		department: '',
		position: ''
	});

	useEffect(() => {
		http
			.get<Omit<Form.SignUpForm<StaticData>, 'email' | 'password'>>('/account/registerInfo', { registerId })
			.then(res => {
				const { firstName, lastName, department, position } = res.data!;
				setSignUpForm(preVal => ({
					...preVal,
					firstName,
					lastName,
					department: department._id,
					position: position._id
				}));

				setDisplayForm({
					firstName: toCapitalize(firstName),
					lastName: toCapitalize(lastName),
					department: department.name,
					position: position.name
				});
			})
			.catch(err => navigate(`/error/404/${err.message}`));
	}, []);

	const handleInputChange = (value: Partial<Form.SignUpForm>) => {
		setSignUpForm(preVal => ({ ...preVal, ...value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(setLoading(true));
		const formData = toFormData<Form.SignUpForm>(signUpForm);
		http
			.post('/account/signup', formData)
			.then(res => {
				notificate.success(res.message);
				setTimeout(() => {
					dispatch(setLoading(false));
					navigate('/account/signin', { replace: true, state: { email: res.data! } });
				}, 1000);
			})
			.catch(err => {
				notificate.error(err?.message ?? err);
				setTimeout(() => dispatch(setLoading(false)), 1000);
			});
	};

	return (
		<Stack component='form' autoComplete='off' spacing={1.5} onSubmit={handleSubmit}>
			<Logo />
			<Stack direction='row' justifyContent='space-between' spacing={1.5}>
				<TextField
					fullWidth
					id='firstname'
					label={t('firstname')}
					variant='standard'
					disabled
					value={displayForm.firstName}
				/>
				<TextField
					fullWidth
					id='lastname'
					label={t('lastname')}
					variant='standard'
					disabled
					value={displayForm.lastName}
				/>
			</Stack>
			<TextField
				required
				id='email'
				label={t('email')}
				variant='standard'
				type='email'
				value={signUpForm.email}
				{...email((e: ChangeEvent) => handleInputChange({ email: e.target.value.trim() }))}
			/>
			<TextField
				required
				id='password'
				label={t('password')}
				variant='standard'
				type='password'
				value={signUpForm.password}
				{...password((e: ChangeEvent) => handleInputChange({ password: e.target.value }))}
			/>
			<TextField id='department' label={t('department')} variant='standard' disabled value={displayForm.department} />
			<TextField id='position' label={t('position')} variant='standard' disabled value={displayForm.position} />

			<Button size='large' variant='contained' type='submit'>
				{t('signup')}
			</Button>

			<Typography variant='body2' color='text.secondary' sx={{ alignSelf: 'flex-end' }}>
				{t('signupTip')}
				<Link component={RouterLink} to='/account/signin'>
					{t('signin')}
				</Link>
			</Typography>
		</Stack>
	);
};

export default Signup;
