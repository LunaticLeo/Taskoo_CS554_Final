import React, { useEffect, useState } from 'react';
import Styled from '@/components/widgets/Styled';
import { useTranslation } from 'react-i18next';
import { CardContent, Palette, PaletteColor, Theme, useTheme } from '@mui/material';
import Chart from '@/components/widgets/Chart';
import { Option } from '@/@types/props';
import http from '@/utils/http';
import { HEIGHT } from './Dashboard';

const Summary: React.FC = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	const [option, setOption] = useState<Option>({});

	useEffect(() => {
		http.get<StatisticBarChartOptions[]>('/project/task/statistic').then(res => {
			setOption(getOptions(res.data!, theme));
		});
	}, []);

	return (
		<Styled.Card>
			<CardContent>
				<Styled.Title>{t('summary')}</Styled.Title>
				<Chart height={HEIGHT} option={option} />
			</CardContent>
		</Styled.Card>
	);
};

const getOptions = (data: StatisticBarChartOptions[], theme: Theme): Option => {
	const status: StaticStatus[] = ['Pending', 'Processing', 'Testing', 'Done'];
	const xAxisData = data.map(item => item.name);
	const series: any = data.reduce(
		(pre, cur) => {
			const { statistic } = cur;
			Object.keys(statistic).forEach(key => {
				const index = status.findIndex(item => item.toLowerCase() === key);
				// @ts-ignore
				pre[index].data.push(statistic[key]);
			});
			return pre;
		},
		status.map(item => ({
			name: item,
			type: 'bar',
			stack: 'total',
			emphasis: { focus: 'series' },
			itemStyle: { color: (theme.palette[item.toLowerCase() as keyof Palette] as PaletteColor).main },
			data: []
		}))
	);

	return {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'shadow' }
		},
		legend: {},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '15%',
			containLabel: true
		},
		xAxis: { type: 'category', data: xAxisData },
		yAxis: { type: 'value' },
		series,
		dataZoom: [
			{ type: 'inside', start: 0, end: 50 },
			{ type: 'slider', start: 0, end: 50 }
		]
	};
};

export default Summary;
