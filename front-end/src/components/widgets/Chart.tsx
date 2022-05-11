import React, { forwardRef, RefObject, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { BarChart, PieChart, SunburstChart, TreemapChart } from 'echarts/charts';
import {
	GraphicComponent,
	TooltipComponent,
	LegendComponent,
	GridComponent,
	DataZoomComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { Box } from '@mui/material';
import { ChartProps } from '@/@types/props';
import { useAppSelector } from '@/hooks/useStore';

const Chart: React.ForwardRefRenderFunction<RefObject<HTMLElement>, ChartProps> = (
	{ option, sx, height = '100%', width = '100%' },
	ref
) => {
	const chartRef = useRef<HTMLDivElement>(null);
	const colorMode = useAppSelector(state => state.colorMode.value);

	useImperativeHandle(ref, () => ({ current: chartRef.current }));

	let chart: echarts.ECharts;
	useLayoutEffect(() => {
		const resize = () => {
			chart.resize();
		};
		!chart && (chart = echarts.init(chartRef.current!, colorMode));
		chart.setOption(option);
		window.addEventListener('resize', resize);

		return () => {
			echarts.dispose(chart);
			window.removeEventListener('resize', resize);
		};
	}, [option, colorMode]);

	return <Box sx={{ ...sx, width, height }} ref={chartRef}></Box>;
};

echarts.use([
	GraphicComponent,
	CanvasRenderer,
	PieChart,
	BarChart,
	TreemapChart,
	SunburstChart,
	TooltipComponent,
	LegendComponent,
	LabelLayout,
	UniversalTransition,
	GridComponent,
	DataZoomComponent
]);

export default forwardRef(Chart);
