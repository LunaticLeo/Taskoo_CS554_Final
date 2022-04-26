import React from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { DashboardProps } from '@/@types/props';

const CategorySwitch: React.FC<DashboardProps> = ({ category, setCategoty }) => {
	return (
		<FormControl>
			<RadioGroup row value={category} onChange={e => setCategoty(e.target.value as 'project' | 'task')}>
				<FormControlLabel value='project' control={<Radio />} label='Project' />
				<FormControlLabel value='task' control={<Radio />} label='Task' />
			</RadioGroup>
		</FormControl>
	);
};

export default CategorySwitch;
