import React, { useMemo } from 'react';
import Chart from '@/components/widgets/Chart';
import { Option, RelationsChartProps } from '@/@types/props';
import { TreemapSeriesOption } from 'echarts';
import { toFullName } from '@/utils';

const RelationsChart: React.FC<RelationsChartProps> = ({ data, type = 'treemap' }) => {
	const chartData = useMemo(
		() =>
			data.reduce((pre, cur) => {
				const department = pre!.find(item => item.name === cur.department.name);
				const item = {
					name: toFullName(cur.firstName, cur.lastName),
					value: 100 - cur.position.level!,
					// @ts-ignore
					meta: cur
				};
				if (department) {
					department.children?.push(item);
					// @ts-ignore
					department.value += item.value;
				} else {
					pre?.push({
						name: cur.department.name,
						value: item.value,
						children: [item]
					});
				}
				return pre;
			}, [] as TreemapSeriesOption['data']),
		[data]
	);

	const option = useMemo(
		() => (type === 'treemap' ? getTreemapOption(chartData) : getSunburstOption(chartData)),
		[type, chartData]
	);

	return <Chart height='80vh' width='100%' option={option} />;
};

const getTreemapOption = (data: TreemapSeriesOption['data']): Option => ({
	backgroundColor: 'transparent',
	tooltip: {
		formatter: function (info: any) {
			const { data, marker } = info;
			return `
				${marker} <strong>${data.name}</strong><br />
				${data.meta.email}<br />
				${data.meta.position.name}<br />
				${data.meta.department.name}<br />
			`;
		}
	},
	series: [
		{
			type: 'treemap',
			id: 'treemap',
			animationDurationUpdate: 1000,
			roam: false,
			data,
			universalTransition: true,
			label: { show: true },
			breadcrumb: { show: false }
		}
	]
});

const getSunburstOption = (data: TreemapSeriesOption['data']): Option => ({
	backgroundColor: 'transparent',
	tooltip: {
		formatter: function (info: any) {
			const { data, marker } = info;
			return data.meta?.email
				? `
				${marker} <strong>${data.name}</strong><br />
				${data.meta.email}<br />
				${data.meta.position.name}<br />
				${data.meta.department.name}<br />
			`
				: `
				${marker} <strong>${data.name}</strong><br />
				`;
		}
	},
	series: [
		{
			type: 'sunburst',
			id: 'sunburst',
			radius: ['20%', '90%'],
			animationDurationUpdate: 1000,
			data,
			universalTransition: true,
			itemStyle: {
				borderWidth: 1,
				borderColor: 'rgba(255,255,255,.5)'
			},
			label: { show: true }
		}
	]
});

export default RelationsChart;
