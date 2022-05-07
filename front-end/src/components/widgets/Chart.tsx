import React, { forwardRef, RefObject, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
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

const Chart: React.ForwardRefRenderFunction<RefObject<HTMLElement>, ChartProps> = (
	{ option, sx, height = '100%', width = '100%' },
	ref
) => {
	const chartRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => ({ current: chartRef.current }));

	let chart: echarts.ECharts;
	useLayoutEffect(() => {
		!chart && (chart = echarts.init(chartRef.current!));
		chart.setOption(option);

		return () => {
			echarts.dispose(chart);
		};
	}, [option]);

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
