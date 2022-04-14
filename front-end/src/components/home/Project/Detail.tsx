import React, { useEffect, useMemo, useState } from 'react';
import http from '@/utils/http';
import { Box, Breadcrumbs, Link, Stack, Typography } from '@mui/material';
import { useParams, Link as NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';
import dayjs from 'dayjs';

const Detail: React.FC = () => {
	const { t } = useTranslation();
	const { id } = useParams();
	const [projectInfo, setProjectInfo] = useState<Project>({} as Project);
	const allMembers = useMemo(() => {
		return projectInfo.manager && projectInfo?.members?.length ? [projectInfo.manager, ...projectInfo.members] : [];
	}, [projectInfo.manager, projectInfo.members]);

	useEffect(() => {
		http.get<Project>('/project/detail', { id }).then(res => {
			setProjectInfo(res.data!);
		});
	}, []);

	return (
		<Box>
			<NavBreadcrumbs projectName={projectInfo?.name} />
			<Stack spacing={2} mt={2}>
				<Stack direction='row' alignItems='center'>
					<Typography component='h2' variant='h3' sx={{ fontWeight: 'bolder' }}>
						{projectInfo.name}
					</Typography>
					<Typography marginLeft='auto' variant='body2' color='text.secondary'>
						{t('create')}: {dayjs(projectInfo.createTime).format('MM/DD/YYYY')}
					</Typography>
				</Stack>
				{projectInfo?.description && (
					<Typography variant='body1' color='text.secondary'>
						{projectInfo.description}
					</Typography>
				)}
				<Styled.AvatarGroup data={allMembers} max={5} />
			</Stack>
		</Box>
	);
};

const NavBreadcrumbs: React.FC<{ projectName: string }> = ({ projectName = '' }) => {
	const { t } = useTranslation();

	return (
		<Breadcrumbs aria-label='breadcrumb'>
			<Typography color='inherit'>{t('menu.studio')}</Typography>
			<Link underline='hover' color='inherit' component={NavLink} to='/home/project'>
				{t('menu.project')}
			</Link>
			<Typography color='text.primary'>{projectName}</Typography>
		</Breadcrumbs>
	);
};

export default Detail;
