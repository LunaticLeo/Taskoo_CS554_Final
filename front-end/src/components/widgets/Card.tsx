import React from 'react';
import { Card as MuiCard, CardContent, Typography } from '@mui/material';

interface CardProps {
	title?: string;
}

export const CardTitle: React.FC<{ component?: React.ElementType<any> }> = ({ children, component = 'h2' }) => {
	return (
		<Typography component={component} variant='h5'>
			{children}
		</Typography>
	);
};

const Card: React.FC<CardProps> = ({ title, children }) => {
	return (
		<MuiCard>
			<CardContent>
				{title && <CardTitle>{title}</CardTitle>}
				{children}
			</CardContent>
		</MuiCard>
	);
};

export default Card;
