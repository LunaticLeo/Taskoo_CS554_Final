import React, { useEffect, useState } from 'react';
import TableList from '@/components/widgets/TableList';
import { PageConfig, TabPanelProps, WithPage } from '@/@types/props';
import useFormatList from '@/hooks/useFormatList';
import { Page, stringAvatar, toFullName } from '@/utils';
import http from '@/utils/http';
import { Avatar, Box, Card, CardActionArea, CardContent, Divider, Grid, Link, Stack, Typography } from '@mui/material';
import useAccountInfo from '@/hooks/useAccountInfo';

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
		<Box role='tabpanel' hidden={hidden} id={`tabpanel-${value}`} aria-labelledby={`tab-${value}`} {...other}>
			<TableList<ProjectInfo>
				showHeader
				header={header}
				data={tableData}
				pageConfig={pageConfig}
				onPageChange={handlePageChange}
			/>
		</Box>
	);
};

export const ContactList: React.FC<TabPanelProps> = ({ value, hidden, ...other }) => {
	const { _id } = useAccountInfo();
	const [contacts, setContacts] = useState<Account<StaticData>[]>([]);
	const avatarSize = 55;

	useEffect(() => {
		http.get<Account<StaticData>[]>('/org/members').then(res => {
			setContacts(res.data!.filter(item => item._id !== _id));
		});
	}, []);

	return (
		<Box role='tabpanel' hidden={hidden} id={`tabpanel-${value}`} aria-labelledby={`tab-${value}`} {...other}>
			<Grid container spacing={{ xs: 1, md: 2, lg: 3 }}>
				{contacts.map(contact => {
					const fullName = toFullName(contact.firstName, contact.lastName);

					return (
						<Grid key={contact._id} item xs={6} sm={4} md={3} lg={2.4}>
							<Card>
								<CardContent component={Stack} alignItems='center' spacing={1.5}>
									{contact.avatar ? (
										<Avatar alt={fullName} src={contact.avatar} sx={{ height: avatarSize, width: avatarSize }} />
									) : (
										<Avatar alt={fullName} {...stringAvatar(fullName, avatarSize, avatarSize)} />
									)}
									<Typography component={Link} underline='hover' sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
										{fullName}
									</Typography>
									<Typography noWrap>{contact.email}</Typography>
									<Typography noWrap color='text.secondary'>
										{contact.department.name}
									</Typography>
								</CardContent>
								<Divider />
								<CardActionArea sx={{ pt: 2, pb: 2, textAlign: 'center' }}>
									<Typography noWrap variant='button' color='text.secondary'>
										{contact.position.name}
									</Typography>
								</CardActionArea>
							</Card>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
};
