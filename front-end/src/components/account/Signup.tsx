import React, { useEffect, useState } from 'react';
import { Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { getStaticData, toCapitalize } from '@/utils';
import Logo from '../widgets/Logo';
import http from '@/utils/http';
import { Form } from '@/@types/form';

interface FormInfo {
	firstName: string;
	lastName: string;
	department: string;
	position: string;
}

const Signup: React.FC = () => {
	const { t } = useTranslation();
	const { registerId } = useParams();
	const navigate = useNavigate();
	const [signUpForm, setSignUpForm] = useState<Form.SignUpForm>({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		department: '',
		position: ''
	});
	const [displayForm, setDisplayForm] = useState<FormInfo>({
		firstName: '',
		lastName: '',
		department: '',
		position: ''
	});

	useEffect(() => {
		http
			.get<Form.SignUpForm>('/account/registerInfo', { registerId })
			.then(async res => {
				const data = res.data!;
				setSignUpForm(preVal => ({ ...preVal, ...data }));
				const department = ((await getStaticData('departments', data.department)) as StaticData).name;
				const position = ((await getStaticData('positions', data.position)) as StaticData).name;
				debugger;
				setDisplayForm({
					firstName: toCapitalize(data.firstName),
					lastName: toCapitalize(data.lastName),
					department,
					position
				});
			})
			.catch(err => navigate(`/error/404/${err.message}`));
	}, []);

	return (
		<Stack component='form' autoComplete='off' spacing={1.5}>
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
			<TextField id='email' label={t('email')} variant='standard' type='email' />
			<TextField id='password' label={t('password')} variant='standard' type='password' />
			<TextField id='department' label={t('department')} variant='standard' disabled value={displayForm.department} />
			<TextField id='position' label={t('position')} variant='standard' disabled value={displayForm.position} />

			<Button size='large' variant='contained'>
				{t('signup')}
			</Button>

			<Typography variant='body2' color='text.secondary' sx={{ alignSelf: 'flex-end' }}>
				{t('signupTip')}
				<Link component={RouterLink} to='/'>
					{t('signin')}
				</Link>
			</Typography>
		</Stack>
	);
};

export default Signup;
