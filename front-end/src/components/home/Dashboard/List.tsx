import React, { useState } from 'react';
import TableList from '@/components/widgets/TableList';
import { CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';
import useFormatList from '@/hooks/useFormatList';

const header: (keyof ProjectInfo)[] = ['name', 'createTime', 'status', 'members'];

const List: React.FC = () => {
	const { t } = useTranslation();
	const [data, setData] = useState<ProjectInfo[]>([]);
	const tableData = useFormatList(data);

	return (
		<Styled.Card>
			<CardContent>
				<Styled.Title>{t('overview')}</Styled.Title>
				<TableList<ProjectInfo> showHeader size='small' header={header} data={tableData} />
			</CardContent>
		</Styled.Card>
	);
};

export default List;
