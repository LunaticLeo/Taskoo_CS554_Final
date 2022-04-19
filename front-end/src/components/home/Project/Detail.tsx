import React, { useEffect, useMemo, useState } from 'react';
import http from '@/utils/http';
import { Box, Breadcrumbs, IconButton, Link, Stack, Typography } from '@mui/material';
import { useParams, Link as NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Styled from '@/components/widgets/Styled';
import dayjs from 'dayjs';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { yellow } from '@mui/material/colors';
import { useSnackbar } from 'notistack';
import { useAppDispatch } from '@/hooks/useStore';
import { getFavoriteList } from '@/store/favoriteList';

const Detail: React.FC = () => {
	const { t } = useTranslation();
	const { id } = useParams();
	const dispatch = useAppDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const [projectInfo, setProjectInfo] = useState<Project>({} as Project);
	const [favoriteStatus, setFavoriteStatus] = useState<boolean>(false);
	const allMembers = useMemo(() => projectInfo.members ?? [], [projectInfo.members]);

	useEffect(() => {
		// get project detail info
		http.get<Project>('/project/detail', { id }).then(res => {
			setProjectInfo(res.data!);
		});

		// check favorite status
		http.get<boolean>('/project/favorite/status', { id }).then(res => {
			setFavoriteStatus(res.data!);
		});
	}, []);

	const swithFavoriteStatus = () => {
		const newStatus = !favoriteStatus;
		const func = newStatus ? addToFavorite : removeFromFavorite;
		func().then(() => {
			setFavoriteStatus(newStatus);
			dispatch(getFavoriteList());
		});
	};

	const addToFavorite = () =>
		http
			.post('/project/favorite/add', { id })
			.then(res => enqueueSnackbar(res.message, { variant: 'success' }))
			.catch(err => enqueueSnackbar(err?.message ?? err, { variant: 'error' }));

	const removeFromFavorite = () =>
		http
			.delete('/project/favorite/remove', { id })
			.then(res => enqueueSnackbar(res.message, { variant: 'success' }))
			.catch(err => enqueueSnackbar(err?.message ?? err, { variant: 'error' }));
	return (
		<Box>
			<NavBreadcrumbs projectName={projectInfo?.name} />
			<Stack spacing={2} mt={2}>
				<Stack direction='row' alignItems='center'>
					<Typography component='h2' variant='h3' sx={{ fontWeight: 'bolder' }}>
						{projectInfo.name}
					</Typography>
					<Typography marginLeft='auto' marginRight={1} variant='body2' color='text.secondary'>
						{t('create')}: {dayjs(projectInfo.createTime).format('MM/DD/YYYY')}
					</Typography>
					<FavoriteButton favorite={favoriteStatus} onClick={swithFavoriteStatus} />
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

const FavoriteButton: React.FC<{ favorite: boolean; onClick?: () => void }> = ({ favorite = false, onClick }) => {
	return (
		<IconButton onClick={onClick} sx={{ color: yellow[700] }}>
			{favorite ? <StarRoundedIcon color='inherit' /> : <StarOutlineRoundedIcon color='inherit' />}
		</IconButton>
	);
};

export default Detail;
