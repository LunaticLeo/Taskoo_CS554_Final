import React, { useEffect, useCallback, useState } from 'react';
import TableList from '@/components/widgets/TableList';
import { CardContent, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';
import useFormatList from '@/hooks/useFormatList';
import http from '@/utils/http';

const header: (keyof OrgInfo)[] = ['name', 'department', 'position'];

const OrgList: React.FC = () => {
    const { t } = useTranslation();
	const [data, setData] = useState<OrgInfo[]>([]);
	//const tableData = useFormatList(data, _id => `/home/project/${_id}`);

	useEffect(() => {
		getProjectList();
	}, []);

	const getProjectList = useCallback(() => {
		http.get<OrgInfo[]>('/organzation/list').then(res => {
			setData(res.data!);
		});
	}, []);
	console.log(data);
	return (
		<>
			<Styled.Card>
			<CardContent>
				<Stack direction='row' justifyContent='space-between'>
					<Styled.Title>{t('overview')}</Styled.Title>
				</Stack>
				<TableList<OrgInfo> showHeader size='small' header={header as any} data={data} />
			</CardContent>
		</Styled.Card>
		</>
	);
};


export default OrgList;
