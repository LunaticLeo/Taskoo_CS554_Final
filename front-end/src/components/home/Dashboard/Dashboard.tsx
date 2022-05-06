import React, { useState } from 'react';
import { Grid as MuiGrid, styled } from '@mui/material';
import List from './List';
import StatisticChart from './StatisticChart';
import Contacts from './Contacts';
import Summary from './Summary';

const Dashboard: React.FC = () => {
	const [category, setCategory] = useState<'project' | 'task'>('project');

	return (
		<Grid container spacing={1.5}>
			<Grid item xs={12} lg={8}>
				<List category={category} setCategoty={setCategory} />
			</Grid>
			<Grid item xs={12} lg={4}>
				<StatisticChart category={category} setCategoty={setCategory} />
			</Grid>
			<Grid item xs={12} lg={6}>
				<Summary />
			</Grid>
			<Grid item xs={12} lg={6}>
				<Contacts />
			</Grid>
		</Grid>
	);
};

const Grid = styled(MuiGrid)(() => ({
	'&.MuiGrid-item > .MuiCard-root': {
		height: '100%'
	}
}));

export const HEIGHT = '37.5vh';

export default Dashboard;
