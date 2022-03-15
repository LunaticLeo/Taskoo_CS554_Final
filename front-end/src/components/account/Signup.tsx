import React from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Logo from '../Logo';
import { useParams } from 'react-router-dom';

const Signup: React.FC = () => {
	const { t } = useTranslation();
	const { firstname, lastname } = useParams();

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
			<Stack component='form' autoComplete='off' spacing={1.5}>
				<Stack direction='row' justifyContent='space-between' spacing={1.5}>
					<TextField id='firstname' label={t('firstname')} variant='standard' disabled value={firstname} />
					<TextField id='lastname' label={t('lastname')} variant='standard' disabled value={lastname} />
				</Stack>
				<TextField id='email' label={t('email')} variant='standard' type='email' />
				<TextField id='password' label={t('password')} variant='standard' type='password' />
				<TextField id='department' label={t('department')} variant='standard' disabled />

				<Button size='large' variant='contained'>
					{t('signup')}
				</Button>
			</Stack>
		</Box>
	);
};

export default Signup;
