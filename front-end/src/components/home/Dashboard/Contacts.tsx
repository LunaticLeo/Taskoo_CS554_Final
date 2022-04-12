import React, { useState } from 'react';
import TableList from '@/components/widgets/TableList';
import { CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DashboardCard, DashboardTitle } from './Dashboard';

const header: (keyof ContactList)[] = ['fullName', 'email', 'position'];

const Contacts: React.FC = () => {
	const { t } = useTranslation();
	const [data, setData] = useState<ContactList[]>([]);

	return (
		<DashboardCard>
			<CardContent>
				<DashboardTitle>{t('contacts')}</DashboardTitle>
				<TableList<ContactList> showHeader header={header} data={data}></TableList>
			</CardContent>
		</DashboardCard>
	);
};

export default Contacts;
