import React from 'react';
import { Box } from '@mui/material';
import Info from './Info';
import Tabs from './Tabs';

const Profile: React.FC = () => {
	return (
		<Box>
			<Info />
			<Tabs />
		</Box>
	);
};

export default Profile;
