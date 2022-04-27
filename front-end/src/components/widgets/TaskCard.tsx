import React, { forwardRef, useState } from 'react';
import {
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	DialogContent,
	DialogTitle,
	Divider,
	Stack,
	Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DetailDialogProps, TaskCardProps } from '@/@types/props';
import Styled from './Styled';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const TaskCard: React.ForwardRefRenderFunction<HTMLDivElement, TaskCardProps> = (
	{ data, sx, clickable = false, ...rest },
	ref
) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [open, setOpen] = useState<boolean>(false);

	const content = (
		<CardContent>
			<Stack spacing={1}>
				<Typography variant='h6' component='h2'>
					{data.name}
				</Typography>
				<Typography variant='body2' color='text.secondary' className='collapse'>
					{data.description}
				</Typography>
				<Stack direction='row' alignItems='center' justifyContent='space-between'>
					<Styled.Status label={data.status} />
					<Styled.AvatarGroup data={data.members} />
				</Stack>
				<Stack direction='row' spacing={1}>
					<Typography color='primary' variant='body2' component='span'>
						{t('dueTime')}
					</Typography>
					<Typography variant='body2' component='span'>
						{dayjs(+data.dueTime).format('MM/DD/YYYY')}
					</Typography>
				</Stack>
			</Stack>
		</CardContent>
	);

	return (
		<>
			<Card {...rest} ref={ref} sx={{ width: '100%', ...sx }}>
				{clickable ? (
					<CardActionArea onClick={() => navigate(`/home/project/${data.project}`)}>{content}</CardActionArea>
				) : (
					content
				)}
				<Divider />
				<CardActions>
					<Button color='primary' onClick={() => setOpen(true)}>
						{t('detail')}
					</Button>
				</CardActions>
			</Card>
			<DetailDialog open={open} onClose={() => setOpen(false)} data={data} />
		</>
	);
};

const DetailDialog: React.FC<DetailDialogProps> = ({ open, onClose, data }) => {
	const { t } = useTranslation();

	return (
		<Styled.Dialog open={open} onClose={onClose}>
			<DialogTitle>{data.name}</DialogTitle>
			<DialogContent>
				<Stack spacing={2}>
					<Typography variant='body2' color='text.secondary'>
						{data.description}
					</Typography>
					<Stack direction='row' alignItems='center' justifyContent='space-between'>
						<Styled.Status label={data.status} />
						<Styled.AvatarGroup data={data.members} />
					</Stack>
					<Stack direction='row' spacing={1}>
						<Typography color='primary' variant='body2' component='span'>
							{t('dueTime')}
						</Typography>
						<Typography variant='body2' component='span'>
							{dayjs(+data.dueTime).format('MM/DD/YYYY')}
						</Typography>
					</Stack>
				</Stack>
			</DialogContent>
		</Styled.Dialog>
	);
};

export default forwardRef(TaskCard);
