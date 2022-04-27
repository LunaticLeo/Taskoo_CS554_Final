import React, { useEffect, useMemo, useState } from 'react';
import TableList from '@/components/widgets/TableList';
import { CardContent, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';
import useFormatList from '@/hooks/useFormatList';
import http from '@/utils/http';
import { DashboardProps } from '@/@types/props';
import CategorySwitch from './CategorySwitch';

const List: React.FC<DashboardProps> = ({ category, setCategoty }) => {
	const { t } = useTranslation();
	const [data, setData] = useState<ProjectInfo[] | TaskInfo[]>([]);
	const header: (keyof ProjectInfo)[] | (keyof TaskInfo)[] = useMemo(() => {
		return category === 'project'
			? ['name', 'createTime', 'status', 'members']
			: ['name', 'createTime', 'dueTime', 'status', 'members'];
	}, [category]);
	const tableData = category === 'project' ? useFormatList(data, _id => `/home/project/${_id}`) : useFormatList(data);

	useEffect(() => {
		http.get<ProjectInfo[] | TaskInfo[]>(`/${category}/list`).then(res => {
			setData(res.data!);
		});
	}, [category]);

	return (
		<Styled.Card>
			<CardContent>
				<Stack direction='row' justifyContent='space-between'>
					<Styled.Title>{t('overview')}</Styled.Title>
					<CategorySwitch category={category} setCategoty={setCategoty} />
				</Stack>
				<TableList<ProjectInfo | TaskInfo> showHeader size='small' header={header as any} data={tableData} />
			</CardContent>
		</Styled.Card>
	);
};

export default List;
