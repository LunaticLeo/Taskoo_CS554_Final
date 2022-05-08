import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Card,
	Collapse,
	Container,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';
import { Form } from '@/@types/form';
import http from '@/utils/http';
import useValidation from '@/hooks/useValidation';
import useNotification from '@/hooks/useNotification';
import { toFormData } from '@/utils';
import { useAppDispatch } from '@/hooks/useStore';
import { setLoading } from '@/store/loading';
import { WithSxProp } from '@/@types/props';
import illustration from '@/assets/illustration.svg';
import useAccountInfo from '@/hooks/useAccountInfo';

class RegisterFromClass implements Form.RegisterForm {
	email = '';
	firstName = '';
	lastName = '';
	department = '';
	position = '';

	constructor(obj?: Partial<Form.RegisterForm>) {
		obj && Object.keys(obj).forEach(key => ((this as any)[key] = obj[key as keyof Form.RegisterForm]));
	}
}

const Register: React.FC<WithSxProp<{}>> = ({ sx }) => {
	const { t } = useTranslation();
	const { department } = useAccountInfo();
	const { email } = useValidation();
	const notificate = useNotification();
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const largeScreen = useMediaQuery(theme.breakpoints.up('md'));
	const [registerForm, setRegisterForm] = useState<Form.RegisterForm>(new RegisterFromClass());
	const [options, setOptions] = useState<Record<'departments' | 'positions', StaticData[]>>({
		departments: [],
		positions: []
	});

	useEffect(() => {
		http.get<StaticData[]>('/static/departments').then(res => {
			setOptions(preVal => ({ ...preVal, departments: res.data! }));
			setRegisterForm(new RegisterFromClass({ department: res.data!.find(item => item.name === department)?._id }));
		});
		http.get<StaticData[]>('/static/positions').then(res => {
			setOptions(preVal => ({ ...preVal, positions: res.data! }));
		});
	}, []);

	const handleInputChange = (val: Partial<Form.RegisterForm>) => {
		setRegisterForm(preVal => ({ ...preVal, ...val }));
	};

	const handleClear = () => {
		setRegisterForm(new RegisterFromClass());
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		for (let key in registerForm) {
			if (registerForm[key as keyof Form.RegisterForm].trim() === '') {
				notificate.error(`${t(key)} cannot be empty`);
				return;
			}
		}

		dispatch(setLoading(true));
		http
			.post('/account/register', toFormData(registerForm))
			.then(res => {
				notificate.success(res.message);
				handleClear();
			})
			.catch(err => notificate.error(err?.message ?? err))
			.finally(() => setTimeout(() => dispatch(setLoading(false)), 1000));
	};

	return (
		<>
			<Styled.Title>{t('register')}</Styled.Title>
			{largeScreen && <Box component='img' src={illustration} sx={{ mt: 2, mb: 2 }} />}
			<Stack component='form' onSubmit={handleSubmit} spacing={1.5} sx={{ flex: 1 }}>
				<TextField
					required
					id='email'
					label={t('email')}
					variant='standard'
					type='email'
					value={registerForm.email}
					{...email((e: ChangeEvent) => handleInputChange({ email: e.target.value.trim() }))}
				/>
				<Stack direction='row' justifyContent='space-between' spacing={1.5}>
					<TextField
						required
						fullWidth
						id='firstname'
						label={t('firstname')}
						variant='standard'
						value={registerForm.firstName}
						onChange={e => handleInputChange({ firstName: e.target.value })}
					/>
					<TextField
						required
						fullWidth
						id='lastname'
						label={t('lastname')}
						variant='standard'
						value={registerForm.lastName}
						onChange={e => handleInputChange({ lastName: e.target.value })}
					/>
				</Stack>
				{['department', 'position'].map(item => (
					<FormControl key={item} variant='standard' sx={{ minWidth: 200 }}>
						<InputLabel id={`${item}-label`}>{t(item)}</InputLabel>
						<Select
							id={item}
							labelId={`${item}-label`}
							label={t(item)}
							value={registerForm[item as 'department' | 'position']}
							onChange={e => handleInputChange({ [item]: e.target.value })}
						>
							{options[(item + 's') as 'departments' | 'positions'].map(option => (
								<MenuItem key={option._id} value={option._id}>
									{option.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				))}
				<Stack direction='row' justifyContent='flex-end' spacing={1}>
					<Button onClick={handleClear}>{t('button.clear')}</Button>
					<Button variant='contained' type='submit'>
						{t('button.submit')}
					</Button>
				</Stack>
			</Stack>
		</>
	);
};

export default Register;
