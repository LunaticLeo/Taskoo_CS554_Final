import React, { useMemo, useState } from 'react';
import Styled from '@/components/widgets/Styled';
import { Divider, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ContactDisplayType, ContactsProps } from '@/@types/props';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import ContactList from './ContactList';
import RelationsChart from './RelationsChart';

const Contacts: React.FC<ContactsProps> = ({ data }) => {
	const { t } = useTranslation();
	const [type, setType] = useState<ContactDisplayType>('list');

	const types = [
		{ name: 'list', icon: <FormatListBulletedRoundedIcon /> },
		{ name: 'treemap', icon: <TableChartRoundedIcon /> },
		{ name: 'sunburst', icon: <DonutLargeRoundedIcon /> }
	];

	const handleSwitchType = (_: unknown, value: ContactDisplayType) => {
		setType(value);
	};

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
			{type === 'list' ? <ContactList data={data} /> : <RelationsChart data={data} type={type} />}
		</>
	);
};

export default Contacts;
