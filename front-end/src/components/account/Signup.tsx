import React, { useMemo } from 'react';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { toCapitalize } from '@/utils';
import Logo from '../Logo';

const Signup: React.FC = () => {
	const { t } = useTranslation();
	const { firstname, lastname } = useParams();

	const firstName = useMemo(() => toCapitalize(firstname!), [firstname]);
	const lastName = useMemo(() => toCapitalize(lastname!), [lastname]);

	return (
		<Box
			sx={{
				width: { lg: '30%', md: '40%', sm: '60%', xs: '100%' },
				height: 'fit-content',
				padding: { lg: 9, md: 6, xs: 3 }
			}}
			className='all-center'
		>
			<Stack component='form' autoComplete='off' spacing={1.5}>
				<Logo />
				<Stack direction='row' justifyContent='space-between' spacing={1.5}>
					<TextField id='firstname' label={t('firstname')} variant='standard' disabled value={firstName} />
					<TextField id='lastname' label={t('lastname')} variant='standard' disabled value={lastName} />
				</Stack>
				<TextField id='email' label={t('email')} variant='standard' type='email' />
				<TextField id='password' label={t('password')} variant='standard' type='password' />
				<TextField id='department' label={t('department')} variant='standard' disabled />

				<Button size='large' variant='contained'>
					{t('signup')}
				</Button>

				<Typography variant='body2' color='text.secondary' sx={{ alignSelf: 'flex-end' }}>
					Already have an account? Go to{' '}
					<Link component={RouterLink} to='/'>
						Sign In
					</Link>
				</Typography>
			</Stack>
		</Box>
	);
};

export default Signup;
