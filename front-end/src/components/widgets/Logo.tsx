import React, { memo, RefObject, useEffect, useRef } from 'react';
import Chart from './Chart';
import { GraphicComponentOption } from 'echarts/components';
import { ComposeOption } from 'echarts/core';
import { useTheme } from '@mui/material';
import VanillaTilt, { HTMLVanillaTiltElement } from 'vanilla-tilt';

const Logo: React.FC = () => {
	const option = createLogo({ fontSize: 50 });
	const logoRef = useRef<RefObject<HTMLElement>>(null);
	useEffect(() => {
		const { current } = logoRef.current! as RefObject<HTMLVanillaTiltElement>;
		VanillaTilt.init(current!, { max: 40, scale: 1.5 });

		return () => current!.vanillaTilt.destroy();
	});

	return (
		<Chart
			ref={logoRef}
			sx={{ minWidth: '140px', minHeight: '75px', alignSelf: 'center' }}
			height='20%'
			width='60%'
			option={option}
		/>
	);
};

type logoProps = { color?: string; fontSize: number };
export const createLogo = ({ color, fontSize }: logoProps): ComposeOption<GraphicComponentOption> => {
	const theme = useTheme();
	color = color ?? theme.palette.primary.main;

	return {
		graphic: {
			id: 'logo',
			elements: [
				{
					type: 'text',
					left: 'center',
					top: 'center',
					style: {
						text: 'Taskoo',
						fontSize,
						fontWeight: 'bold',
						lineDash: [0, 200],
						lineDashOffset: 0,
						fill: 'transparent',
						stroke: color,
						lineWidth: 1
					},
					keyframeAnimation: {
						duration: 3000,
						keyframes: [
							{
								percent: 0.7,
								style: {
									fill: 'transparent',
									lineDashOffset: 200,
									lineDash: [200, 0]
								}
							},
							{
								// Stop for a while.
								percent: 0.8,
								style: { fill: 'transparent' }
							},
							{
								percent: 1,
								style: { fill: color }
							}
						]
					}
				}
			]
		}
	};
};

export default memo(Logo);
