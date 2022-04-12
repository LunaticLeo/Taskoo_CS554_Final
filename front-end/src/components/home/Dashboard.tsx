import React, { useLayoutEffect, useState } from 'react';
import { Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import TableList from '../widgets/TableList';
import { useTranslation } from 'react-i18next';
import Chart, { Option } from '../widgets/Chart';

const ListCard: React.FC = () => {
	const { t } = useTranslation();
	const header: (keyof ProjectList)[] = ['name', 'createTime', 'status', 'members'];
	const [data, setData] = useState<ProjectList[]>([]);

	return (
		<Card elevation={3}>
			<CardContent>
				<Typography component='h2' variant='h5'>
					{t('overview')}
				</Typography>
				<TableList<ProjectList> header={header} data={data} />
			</CardContent>
		</Card>
	);
};

const ChartCard: React.FC = () => {
	const { t } = useTranslation();
	const [option, setOption] = useState<Option>({});
	const theme = useTheme();

	useLayoutEffect(() => {
		setOption(
			statisticChartOption({
				pending: 5,
				processing: 10,
				testing: 3,
				done: 7,
				borderColor: theme.palette.background.paper
			})
		);
	}, []);

	return (
		<Card elevation={3}>
			<CardContent>
				<Typography component='h2' variant='h5'>
					{t('statistic')}
				</Typography>
				<Chart height='300px' option={option} />
			</CardContent>
		</Card>
	);
};

const statisticChartOption = ({ pending, processing, testing, done, borderColor }: StatisticOptionInput): Option => {
	return {
		tooltip: { trigger: 'item' },
		legend: { bottom: 'bottom', left: 'center' },
		series: [
			{
				name: 'Statistic Data',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: borderColor ?? '#fff',
					borderWidth: 2
				},
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: '40',
						fontWeight: 'bold'
					}
				},
				labelLine: { show: false },
				data: [
					{ name: 'Pending', value: pending },
					{ name: 'Processing', value: processing },
					{ name: 'Testing', value: testing },
					{ name: 'Done', value: done }
				]
			}
		]
	};
};

const Dashboard: React.FC = () => {
	return (
		<Grid container spacing={1.5}>
			<Grid item xs={12} lg={8}>
				<ListCard />
			</Grid>
			<Grid item xs={12} lg={4}>
				<ChartCard />
			</Grid>
			<Grid item xs={12} lg={4}></Grid>
			<Grid item xs={12} lg={8}></Grid>
		</Grid>
	);
};

interface StatisticOptionInput {
	pending: number;
	processing: number;
	testing: number;
	done: number;
	borderColor?: string;
}

export default Dashboard;
