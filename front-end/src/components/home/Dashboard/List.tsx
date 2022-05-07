import React, { useEffect, useMemo, useState } from 'react';
import { CardContent, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DashboardProps, PageConfig, WithPage } from '@/@types/props';
import { Page } from '@/utils';
import Styled from '@/components/widgets/Styled';
import TableList from '@/components/widgets/TableList';
import useFormatList from '@/hooks/useFormatList';
import http from '@/utils/http';
import CategorySwitch from './CategorySwitch';
import { HEIGHT } from './Dashboard';

const List: React.FC<DashboardProps> = ({ category, setCategoty }) => {
	const { t } = useTranslation();
	const [data, setData] = useState<ProjectInfo[] | TaskInfo[]>([]);
	const [pageConfig, setPageConfig] = useState<PageConfig>(new Page({ pageSize: 10 }));
	const header: (keyof ProjectInfo)[] | (keyof TaskInfo)[] = useMemo(() => {
		return category === 'project'
			? ['name', 'createTime', 'status', 'members']
			: ['name', 'createTime', 'dueTime', 'status', 'members'];
	}, [category]);
	const tableData = category === 'project' ? useFormatList(data, _id => `/home/project/${_id}`) : useFormatList(data);

	useEffect(() => {
		const { pageNum, pageSize } = pageConfig;
		http.get<WithPage<ProjectInfo[] | TaskInfo[]>>(`/${category}/list`, { pageNum, pageSize }).then(res => {
			setData(res.data!.list);
			setPageConfig(preVal => ({ ...preVal, count: res.data!.count }));
		});
	}, [category, pageConfig.pageNum]);

	const handlePageChange = (_: unknown, value: number) => {
		setPageConfig(preVal => ({ ...preVal, pageNum: value }));
	};

	return (
		<Styled.Card>
			<CardContent>
				<Stack direction='row' justifyContent='space-between'>
					<Styled.Title>{t('overview')}</Styled.Title>
					<CategorySwitch category={category} setCategoty={setCategoty} />
				</Stack>
				<TableList<ProjectInfo | TaskInfo>
					showHeader
					size='small'
					header={header as any}
					data={tableData}
					sx={{ height: HEIGHT }}
					pageConfig={pageConfig}
					onPageChange={handlePageChange}
				/>
			</CardContent>
		</Styled.Card>
	);
};

export default List;
