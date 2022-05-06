import React from 'react';
import { Box, Drawer, Stack, useMediaQuery, useTheme } from '@mui/material';
import Menu from './Menu';
import ThemeSwitch from '../widgets/ThemeSwitch';
import LangButton from '../widgets/LangButton';
import { NavProps } from '@/@types/props';

const drawerWidth = 300;

const Nav: React.FC<NavProps> = ({ openDrawer, setOpenDrawer }) => {
	const theme = useTheme();
	const isLgScreen = useMediaQuery(theme.breakpoints.up('lg'));

	return (
		<Box component='nav' sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }} aria-label='mailbox folders'>
			{isLgScreen ? (
				<Drawer
					variant='permanent'
					sx={{
						display: { xs: 'none', lg: 'block' },
						position: 'relative',
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
					}}
					open
				>
					<Menu />
					<ToolBox />
				</Drawer>
			) : (
				<Drawer
					container={window.document.body}
					variant='temporary'
					open={openDrawer}
					onClose={() => setOpenDrawer(!openDrawer)}
					ModalProps={{ keepMounted: true }}
					sx={{
						display: { xs: 'block', lg: 'none' },
						position: 'relative',
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
					}}
				>
					<Menu />
					<ToolBox />
				</Drawer>
			)}
		</Box>
	);
};

const ToolBox: React.FC = () => (
	<Stack
		sx={{
			position: 'absolute',
			bottom: 15,
			left: 15,
			zIndex: theme => theme.zIndex.appBar
		}}
		direction='row'
		spacing={2}
	>
		<ThemeSwitch />
		<LangButton />
	</Stack>
);

export default Nav;
