import React, { useState } from 'react';
import TableList from '@/components/widgets/TableList';
import { CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';

const Contacts: React.FC = () => {
	const { t } = useTranslation();
	const [contacts, setContacts] = useState<Account<StaticData>[]>([]);

	return (
		<Styled.Card>
			<CardContent>
				<Styled.Title>{t('contacts')}</Styled.Title>
			</CardContent>
		</Styled.Card>
	);
};

export default Contacts;
