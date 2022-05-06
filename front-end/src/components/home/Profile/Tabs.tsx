import React, { useState } from 'react';
import { Box, Tab, Tabs as MuiTabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import * as TabPanels from './TabPanels';
import { TabsProps } from '@/@types/props';

const tabs: TabsProps[] = [
	{ text: 'favorite', value: 0 },
	{ text: 'contacts', value: 1 }
];

const Tabs: React.FC = () => {
	const { t } = useTranslation();
	const [curTab, setCurTab] = useState<string | number>(1);

	const handleTabChange = (_: unknown, newVal: string | number) => {
		setCurTab(newVal);
	};

	const tabProps = (config: TabsProps) => ({
		id: `tab-${config.value}`,
		label: t(`tabs.${config.text}`),
		value: config.value,
		'aria-controls': `tabpanel-${config.value}`
	});

	return (
		<Box sx={{ mt: 2 }}>
			<Box sx={{ mb: 2 }}>
				<MuiTabs value={curTab} onChange={handleTabChange}>
					{tabs.map(item => (
						<Tab key={item.value} {...tabProps(item)} />
					))}
				</MuiTabs>
			</Box>
			<TabPanels.FavoriteList value={0} hidden={curTab !== 0} />
			<TabPanels.ContactList value={1} hidden={curTab !== 1} />
		</Box>
	);
};

export default Tabs;
