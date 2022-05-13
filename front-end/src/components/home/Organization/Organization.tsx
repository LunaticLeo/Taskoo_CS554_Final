import React, { useEffect, useMemo, useState } from 'react';
import { Grid } from '@mui/material';
import Contacts from './Contacts';
import http from '@/utils/http';
import Register from './Register';

const Organzation: React.FC = () => {
	const [data, setData] = useState<Account<StaticData>[]>([]);
	const [permission, setPermission] = useState<boolean>(false);

	useEffect(() => {
		// get contacts
		http.get<Account<StaticData>[]>('/org/members').then(res => {
			setData(res.data!);
		});

		// check create permission
		http.get<boolean>('/account/permission', { category: 'projects' }).then(res => {
			setPermission(res.data!);
		});
	}, []);

	const layout = useMemo(() => (permission ? { xs: 12, md: 8, lg: 9 } : { xs: 12 }), [permission]);

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
				<Grid item {...layout}>
					<Contacts data={data} />
				</Grid>
				{permission && (
					<Grid item xs={12} md={4} lg={3}>
						<Register />
					</Grid>
				)}
			</Grid>
		</>
	);
};

export default Organzation;
