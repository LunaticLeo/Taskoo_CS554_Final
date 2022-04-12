import React, { useMemo, useState } from 'react';
import TableList from '@/components/widgets/TableList';
import { Avatar, AvatarGroup, CardContent, Chip, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DashboardCard, DashboardTitle } from './Dashboard';
import { stringAvatar } from '@/utils';
import { Link as NavLink } from 'react-router-dom';
import * as dayjs from 'dayjs';

const header: (keyof ProjectList)[] = ['name', 'createTime', 'status', 'members'];

const List: React.FC = () => {
	const { t } = useTranslation();
	const [data, setData] = useState<ProjectList[]>([
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

	const tableData = useMemo(
		() =>
			data.map(item => {
				const { _id, name, createTime, status, members } = item;
				return {
					_id,
					name: (
						<Link component={NavLink} to='' underline='hover'>
							{name}
						</Link>
					),
					createTime: dayjs(createTime).format('MM/DD/YYYY'),
					status: <Chip label={status} color='success' variant='outlined' />,
					members: (
						<AvatarGroup max={4} sx={{ justifyContent: 'flex-end' }}>
							{members.map(member => {
								return member.avatar ? (
									<Avatar key={member.fullName} alt={member.fullName} src={member.avatar} />
								) : (
									<Avatar key={member.fullName} alt={member.fullName} {...stringAvatar(member.fullName)} />
								);
							})}
						</AvatarGroup>
					)
				};
			}),
		[data]
	);

	return (
		<DashboardCard>
			<CardContent>
				<DashboardTitle>{t('overview')}</DashboardTitle>
				<TableList<ProjectList> showHeader size='small' header={header} data={tableData} />
			</CardContent>
		</DashboardCard>
	);
};

export default List;
