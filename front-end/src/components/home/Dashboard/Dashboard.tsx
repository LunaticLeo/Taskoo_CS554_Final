import React from 'react';
import { Card, Grid, Typography } from '@mui/material';
import List from './List';
import StatisticChart from './StatisticChart';
import Contacts from './Contacts';

export const DashboardCard: React.FC = ({ children }) => <Card elevation={3}>{children}</Card>;
export const DashboardTitle: React.FC = ({ children }) => (
	<Typography component='h2' variant='h5'>
		{children}
	</Typography>
);

const Dashboard: React.FC = () => {
	return (
		<Grid container spacing={1.5}>
			<Grid item xs={12} lg={8}>
				<List />
			</Grid>
			<Grid item xs={12} lg={4}>
				<StatisticChart />
			</Grid>
			<Grid item xs={12} lg={6}></Grid>
			<Grid item xs={12} lg={6}>
				<Contacts />
			</Grid>
		</Grid>
	);
};

export default Dashboard;
