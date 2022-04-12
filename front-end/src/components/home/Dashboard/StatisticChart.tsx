import React, { useLayoutEffect, useState } from 'react';
import Chart, { Option } from '@/components/widgets/Chart';
import { CardContent, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DashboardCard, DashboardTitle } from './Dashboard';

const StatisticChart: React.FC = () => {
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
		<DashboardCard>
			<CardContent>
				<DashboardTitle>{t('statistic')}</DashboardTitle>
				<Chart height='230px' option={option} />
			</CardContent>
		</DashboardCard>
	);
};

const statisticChartOption = ({ pending, processing, testing, done, borderColor }: StatisticChartOption): Option => {
	return {
		tooltip: { trigger: 'item' },
		legend: { top: 'center', right: 'right', orient: 'vertical' },
		series: [
			{
				name: 'Statistic Data',
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['35%', '50%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 8,
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
						fontSize: '30',
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

interface StatisticChartOption {
	pending: number;
	processing: number;
	testing: number;
	done: number;
	borderColor?: string;
}

export default StatisticChart;
