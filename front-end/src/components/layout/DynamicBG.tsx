import React, { memo, useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';

const DynamicBG: React.FC = () => {
	const colors = ['#1c4189', '#d1504c', '#20a17d', '#e1ac35'];
	const canvasRef = useRef<HTMLCanvasElement>();
	const theme = useTheme();

	useEffect(() => {
		const { current: canvas } = canvasRef as React.MutableRefObject<HTMLCanvasElement>;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const ctx = canvas.getContext('2d')!;

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const rects: RoundSquare[] = [];
		const count = canvas.width <= theme.breakpoints.values.sm ? 10 : 20;
		for (let i = 0; i < count; i++) {
			const len = ~~(Math.random() * 50) + 20;
			const x = ~~(Math.random() * (canvas.width - len)) + len;
			const colorIndex = ~~(Math.random() * 4);
			rects.push(new RoundSquare(canvas, ctx, x, len, 8, colors[colorIndex]));
		}

		const update = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			rects.forEach(item => item.animate());

			window.requestAnimationFrame(update);
		};

		update();

		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	return <Box component='canvas' ref={canvasRef}></Box>;
};

class RoundSquare {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private x: number;
	private y: number;
	private len: number;
	private radius: number;
	private fillColor: string;

	constructor(
		canvas: HTMLCanvasElement,
		ctx: CanvasRenderingContext2D,
		x: number,
		len: number,
		radius: number,
		fillColor: string
	) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.x = x;
		this.y = canvas.height + len + ~~(Math.random() * canvas.height);
		this.len = len;
		this.radius = radius;
		this.fillColor = fillColor;
	}

	draw = () => {
		if (2 * this.radius > this.len) {
			return false;
		}

		this.ctx.save();
		this.ctx.translate(this.x, this.y);
		this.drawRoundRectPath();
		this.ctx.fillStyle = this.fillColor || '#000';
		this.ctx.fill();
		this.ctx.restore();
	};

	animate = () => {
		this.y -= 1;
		if (this.y < -this.len) {
			this.x = ~~(Math.random() * (this.canvas.width - this.len)) + this.len;
			this.y = this.canvas.height + this.len + ~~(Math.random() * this.canvas.height);
		}
		this.draw();
	};

	drawRoundRectPath = () => {
		const { ctx, len, radius } = this;
		ctx.beginPath();
		ctx.arc(len - radius, len - radius, radius, 0, Math.PI / 2);
		ctx.lineTo(radius, len);
		ctx.arc(radius, len - radius, radius, Math.PI / 2, Math.PI);
		ctx.lineTo(0, radius);
		ctx.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);
		ctx.lineTo(len - radius, 0);
		ctx.arc(len - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);
		ctx.lineTo(len, len - radius);
		ctx.closePath();
	};
}

export default memo(DynamicBG);
