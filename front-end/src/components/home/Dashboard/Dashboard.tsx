import React from 'react';
import { Grid } from '@mui/material';
import List from './List';
import StatisticChart from './StatisticChart';
import Contacts from './Contacts';

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
