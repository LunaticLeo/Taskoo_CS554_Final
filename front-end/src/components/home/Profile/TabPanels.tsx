import React, { useEffect, useState } from 'react';
import TableList from '@/components/widgets/TableList';
import { PageConfig, TabPanelProps, WithPage } from '@/@types/props';
import useFormatList from '@/hooks/useFormatList';
import { Page } from '@/utils';
import http from '@/utils/http';

const header: (keyof ProjectInfo)[] = ['name', 'createTime', 'status', 'members'];
export const FavoriteList: React.FC<TabPanelProps> = ({ value, hidden, ...other }) => {
	const [pageConfig, setPageConfig] = useState<PageConfig>(new Page());
	const [favoriteList, setFavoriteList] = useState<ProjectInfo[]>([]);
	const tableData = useFormatList(favoriteList, _id => `/home/project/${_id}`);

	useEffect(() => {
		const { pageNum, pageSize } = pageConfig;
		http.get<WithPage<ProjectInfo[]>>('/project/favorite/list', { pageNum, pageSize }).then(res => {
			setPageConfig(preVal => ({ ...preVal, count: res.data!.count }));
			setFavoriteList(res.data!.list);
		});
	}, [pageConfig.pageNum]);

	const handlePageChange = (_: unknown, value: number) => {
		setPageConfig(preVal => ({ ...preVal, pageNum: value }));
	};

	return (
		<div role='tabpanel' hidden={hidden} id={`tabpanel-${value}`} aria-labelledby={`tab-${value}`} {...other}>
			<TableList<ProjectInfo>
				showHeader
				header={header}
				data={tableData}
				pageConfig={pageConfig}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};
