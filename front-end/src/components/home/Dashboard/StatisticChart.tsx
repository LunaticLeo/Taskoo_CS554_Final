import React, { useLayoutEffect, useState } from 'react';
import Chart from '@/components/widgets/Chart';
import { CardContent, Stack, Theme, useTheme } from '@mui/material';
import { TFunction, useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';
import { DashboardProps, Option } from '@/@types/props';
import CategorySwitch from './CategorySwitch';
import http from '@/utils/http';

const StatisticChart: React.FC<DashboardProps> = ({ category, setCategoty }) => {
	const { t } = useTranslation();
	const [option, setOption] = useState<Option>({});
	const theme = useTheme();

	useLayoutEffect(() => {
		http.get<Record<Lowercase<StaticStatus>, number>>(`/${category}/status/statistic`).then(res => {
			setOption(statisticChartOption({ ...res.data!, borderColor: theme.palette.background.paper }, t, theme));
		});
	}, [category]);

	return (
		<Styled.Card>
			<CardContent>
				<Stack direction='row' justifyContent='space-between'>
					<Styled.Title>{t('statistic')}</Styled.Title>
					<CategorySwitch category={category} setCategoty={setCategoty} />
				</Stack>
				<Chart height='230px' option={option} />
			</CardContent>
		</Styled.Card>
	);
};

const statisticChartOption = (
	{ pending, processing, testing, done, borderColor }: StatisticPieChartOptions,
	t: TFunction<'translation', undefined>,
	theme: Theme
): Option => {
	return {
		tooltip: { trigger: 'item' },
		legend: { top: 'center', right: 'right', orient: 'vertical' },
		series: [
			{
				name: t('statisticChart.statisticData') as any,
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
					{ name: t('status.pending') as any, value: pending, itemStyle: { color: theme.palette.pending.main } },
					{ name: t('status.processing'), value: processing, itemStyle: { color: theme.palette.processing.main } },
					{ name: t('status.testing'), value: testing, itemStyle: { color: theme.palette.testing.main } },
					{ name: t('status.done'), value: done, itemStyle: { color: theme.palette.done.main } }
				]
			}
		]
	};
};

export default StatisticChart;
