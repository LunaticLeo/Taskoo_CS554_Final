import React, { useEffect, useState } from 'react';
import TableList from '@/components/widgets/TableList';
import { CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';
import ContactList from '../Organization/ContactList';
import http from '@/utils/http';
import { HEIGHT } from './Dashboard';

const Contacts: React.FC = () => {
	const { t } = useTranslation();
	const [contacts, setContacts] = useState<Account<StaticData>[]>([]);

	useEffect(() => {
		http.get<Account<StaticData>[]>('/org/members', { department: 'self' }).then(res => {
			setContacts(res.data!);
		});
	}, []);

	return (
		<Styled.Card>
			<CardContent>
				<Styled.Title>{t('contacts')}</Styled.Title>
				<ContactList dense filteable={false} data={contacts} sx={{ maxHeight: HEIGHT, overflow: 'auto' }} />
			</CardContent>
		</Styled.Card>
	);
};

export default Contacts;
