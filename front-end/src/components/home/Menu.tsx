import React, { memo } from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Toolbar } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import Logo from '../widgets/Logo';
import { Link, useLocation } from 'react-router-dom';

export const navMenu: Menu[] = [
	{
		id: 1,
		children: [{ icon: <DashboardRoundedIcon />, text: 'Dashboard', route: '/home/dashboard' }]
	},
	{
		id: 2,
		title: 'Studio',
		children: [
			{ icon: <AssignmentRoundedIcon />, text: 'Project', route: '/home/project' },
			{ icon: <CalendarMonthRoundedIcon />, text: 'Calendar', route: '/home/calendar' },
			{ icon: <AccountTreeRoundedIcon />, text: 'Organization', route: '/home/organization' }
		]
	}
];

const Menu: React.FC = () => {
	const { pathname } = useLocation();
	console.log(pathname);

	return (
		<Box>
			<Toolbar>
				<Logo fontSize={40} />
			</Toolbar>
			{navMenu.map(list => (
				<List key={list.id} subheader={list.title ? <ListSubheader>{list.title}</ListSubheader> : null}>
					{list.children.map(item => (
						<ListItemButton to={item.route} component={Link} key={item.text} selected={pathname === item.route}>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.text} />
						</ListItemButton>
					))}
				</List>
			))}
		</Box>
	);
};

interface Menu {
	title?: string;
	id: string | number;
	children: MenuItem[];
}
interface MenuItem {
	icon: React.ReactElement;
	text: string;
	route: string;
}

export default memo(Menu);
