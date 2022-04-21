import React from 'react';
import TableList from '@/components/widgets/TableList';
import { useAppSelector } from '@/hooks/useStore';
import useFormatList from '@/hooks/useFormatList';
import { TabPanelProps } from '@/@types/props';

const header: (keyof ProjectInfo)[] = ['name', 'createTime', 'status', 'members'];
export const FavoriteList: React.FC<TabPanelProps> = ({ value, hidden, ...other }) => {
	const favoriteList = useAppSelector(state => state.favoriteList.data);
	const tableData = useFormatList(favoriteList);

	return (
		<div role='tabpanel' hidden={hidden} id={`tabpanel-${value}`} aria-labelledby={`tab-${value}`} {...other}>
			<TableList<ProjectInfo> showHeader header={header} data={tableData} />
		</div>
	);
};
