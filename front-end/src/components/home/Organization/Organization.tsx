import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import Contacts from './Contacts';
import http from '@/utils/http';
import Register from './Register';

const Organzation: React.FC = () => {
	const [data, setData] = useState<Account<StaticData>[]>([]);

	useEffect(() => {
		// get contacts
		http.get<Account<StaticData>[]>('/org/members').then(res => {
			setData(res.data!);
		});
	}, []);
	return (
		<>
			<Grid
				container
				sx={{
					flexDirection: { xs: 'column-reverse', md: 'row' },
					height: { xs: 'auto', md: '100%' },
					overflow: { xs: 'inherit', md: 'hidden' }
				}}
				spacing={3}
			>
				<Grid item xs={12} md={8} lg={9}>
					<Contacts data={data} />
				</Grid>
				<Grid item xs={12} md={4} lg={3}>
					<Register />
				</Grid>
			</Grid>
		</>
	);
};

export default Organzation;
