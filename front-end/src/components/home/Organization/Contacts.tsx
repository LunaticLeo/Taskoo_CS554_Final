import React, { useEffect, useMemo, useState } from 'react';
import Styled from '@/components/widgets/Styled';
import { Divider, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import http from '@/utils/http';
import { toFullName, stringAvatar } from '@/utils';
import { ContactDisplayType, ContactListItemProps, ContactListProps, ContactsProps } from '@/@types/props';

import Register from './Register';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import ContactList from './ContactList';
import RelationsChart from './RelationsChart';

const Contacts: React.FC<ContactsProps> = ({ data }) => {
	const { t } = useTranslation();
	const [type, setType] = useState<ContactDisplayType>('list');

	const types = [
		{ name: 'list', icon: <FormatListBulletedRoundedIcon />, component: <ContactList data={data} /> },
		{ name: 'treemap', icon: <TableChartRoundedIcon />, component: <RelationsChart data={data} /> },
		{ name: 'sunburst', icon: <DonutLargeRoundedIcon />, component: <RelationsChart data={data} type='sunburst' /> }
	];

	const handleSwitchType = (_: unknown, value: ContactDisplayType) => {
		setType(value);
	};

	const display = useMemo(() => types.find(item => item.name === type)?.component, [type, data]);

	return (
		<>
			<Stack direction='row'>
				<Styled.Title>{t('contacts')}</Styled.Title>
			</Stack>
			<Divider sx={{ mt: 1, mb: 3 }} />
			<ToggleButtonGroup value={type} onChange={handleSwitchType} exclusive sx={{ mb: 1.5 }}>
				{types.map(item => (
					<ToggleButton key={item.name} value={item.name}>
						{item.icon}
					</ToggleButton>
				))}
			</ToggleButtonGroup>
			{display}
		</>
	);
};

export default Contacts;
