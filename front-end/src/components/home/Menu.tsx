import React, { memo, useEffect } from 'react';
import {
	Box,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Toolbar,
	Typography
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CircleIcon from '@mui/icons-material/Circle';
import Logo from '../widgets/Logo';
import { Link, useLocation } from 'react-router-dom';
import { Translation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { getFavoriteList } from '@/store/favoriteList';
import * as colors from '@mui/material/colors';

const navMenu: Menu[] = [
	{
		id: 1,
		children: [
			{ icon: <DashboardRoundedIcon />, text: 'dashboard', route: '/home/dashboard' },
			{ icon: <AssignmentIndIcon />, text: 'profile', route: '/home/profile' }
		]
	},
	{
		id: 2,
		title: 'studio',
		children: [
			{ icon: <AssignmentRoundedIcon />, text: 'project', route: '/home/project' },
			{ icon: <CalendarMonthRoundedIcon />, text: 'calendar', route: '/home/calendar' },
			{ icon: <AccountTreeRoundedIcon />, text: 'organization', route: '/home/organization' }
		]
	}
];

const palette = Object.values(colors).flatMap(item => (item as any)[500] ?? []);
const len = palette.length;

const Menu: React.FC = () => {
	const { pathname } = useLocation();
	const dispatch = useAppDispatch();
	const favoriteList = useAppSelector(state => state.favoriteList.data);

	useEffect(() => {
		dispatch(getFavoriteList());
	}, []);

	return (
		<Box>
			<Toolbar>
				<Logo fontSize={40} />
			</Toolbar>
			<Translation>
				{t => (
					<>
						{navMenu.map(list => (
							<List
								key={list.id}
								subheader={list.title ? <ListSubheader>{t(`menu.${list.title}`)}</ListSubheader> : null}
							>
								{list.children.map(item => (
									<ListItemButton to={item.route} component={Link} key={item.text} selected={pathname === item.route}>
										<ListItemIcon>{item.icon}</ListItemIcon>
										<ListItemText primary={t(`menu.${item.text}`)} />
									</ListItemButton>
								))}
							</List>
						))}
						{favoriteList.length && (
							<List subheader={<ListSubheader>{t('menu.favorite')}</ListSubheader>}>
								{favoriteList.map((item, index) => (
									<ListItemButton to={`/home/project/${item._id}`} component={Link} key={item._id}>
										<CircleIcon sx={{ color: palette[len % index], mr: 2, fontSize: 12 }} />
										<ListItemText disableTypography>
											<Typography variant='inherit' noWrap>
												{item.name}
											</Typography>
										</ListItemText>
									</ListItemButton>
								))}
							</List>
						)}
					</>
				)}
			</Translation>
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
