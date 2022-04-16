import React, { useState } from 'react';
import TableList from '@/components/widgets/TableList';
import { CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';
import useFormatList from '@/hooks/useFormatList';

const header: (keyof ProjectInfo)[] = ['name', 'createTime', 'status', 'members'];

const List: React.FC = () => {
	const { t } = useTranslation();
	const [data, setData] = useState<ProjectInfo[]>([
		{
			_id: '1',
			name: 'Demo',
			createTime: 1649730701083,
			status: 'Pending',
			members: [
				{
					_id: '5cf94f63-9def-4dea-b058-f8d9c4bf9337',
					fullName: 'Shihao Xiong',
					avatar: 'https://storage.cloud.google.com/taskoo_bucket/IMG_0586.JPG'
				},
				{
					_id: '4bbabe1c-778e-4716-ae15-160752990ce7',
					fullName: 'Yufu Liao',
					avatar: 'https://storage.cloud.google.com/taskoo_bucket/IMG_0587.JPG'
				},
				{
					_id: '6335ffda-42e7-45c4-b568-8cdd22a1d130',
					fullName: 'Shilin Ding',
					avatar: 'https://storage.cloud.google.com/taskoo_bucket/IMG_0588.JPG'
				},
				{
					_id: '1b1fb0f3-6f8b-4077-8ed4-21c1bd38a6bf',
					fullName: 'Peixin Dai',
					avatar: 'https://storage.cloud.google.com/taskoo_bucket/IMG_0589.JPG'
				},
				{
					_id: '8aeb1eb0-d3fa-4582-ad35-78db86159a5b',
					fullName: 'Wenjing Zhou',
					avatar: 'https://storage.cloud.google.com/taskoo_bucket/IMG_0590.JPG'
				}
			]
		}
	]);
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
