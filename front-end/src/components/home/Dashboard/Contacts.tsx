import React, { useState } from 'react';
import TableList from '@/components/widgets/TableList';
import { CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';

const header: (keyof ContactList)[] = ['fullName', 'email', 'position'];

const Contacts: React.FC = () => {
	const { t } = useTranslation();
	const [data, setData] = useState<ContactList[]>([]);

	return (
		<Styled.Card>
			<CardContent>
				<Styled.Title>{t('contacts')}</Styled.Title>
				<TableList<ContactList> showHeader header={header} data={data}></TableList>
			</CardContent>
		</Styled.Card>
	);
};

export default Contacts;
