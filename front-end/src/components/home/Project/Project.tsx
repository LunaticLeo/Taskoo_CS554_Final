import React, { useEffect, useMemo, useState } from 'react';
import {
	Box,
	Button,
	Checkbox,
	Chip,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fab,
	Grid,
	Link,
	List,
	ListItem,
	ListItemButton,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Typography
} from '@mui/material';
import ToDoList from './ToDoList';
import { useTranslation } from 'react-i18next';
import TableList from '@/components/widgets/TableList';
import dayjs from 'dayjs';
import Styled from '@/components/widgets/Styled';
import { Link as NavLink } from 'react-router-dom';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import useAccountInfo from '@/hooks/useAccountInfo';
import http from '@/utils/http';
import { toFormData } from '@/utils';
import { useSnackbar } from 'notistack';

const header: (keyof ProjectList)[] = ['name', 'createTime', 'status', 'members'];

const Project: React.FC = () => {
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
					members: <Styled.AvatarGroup data={members} />
				};
			}),
		[data]
	);

	return (
		<>
			<Grid container spacing={2} flexDirection={{ xs: 'row', lg: 'row-reverse' }}>
				<Grid item xs={12} lg={3}>
					<ToDoList />
				</Grid>
				<Grid item xs={12} lg={9}>
					<TableList<ProjectList> showHeader size='small' header={header} data={tableData} />
				</Grid>
			</Grid>
			<FormDialog />
		</>
	);
};

class ProjectFormClass implements ProjectForm {
	name = '';
	description = '';
	members = [];
	attachments = [];
}

const FormDialog: React.FC = () => {
	const { t } = useTranslation();
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [members, setMembers] = useState<(AccountInfo & { position: string })[]>([]);
	const { enqueueSnackbar } = useSnackbar();
	const [projectForm, setProjectForm] = useState<ProjectForm>(new ProjectFormClass());
	const accountInfo = useAccountInfo();

	useEffect(() => {
		http.get<(AccountInfo & { position: string })[]>('/account/members').then(res => {
			const memberList = res.data!.filter(item => item._id !== accountInfo._id);
			setMembers(memberList);
		});
	}, []);

	const handleInputChange = (val: Partial<ProjectForm>) => {
		setProjectForm(preVal => ({ ...preVal, ...val }));
	};

	const handleCancel = () => {
		setOpenDialog(false);
	};
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		projectForm.members = projectForm.members.map(item => JSON.stringify(item)) as any;
		const formData = toFormData<ProjectFormData>(projectForm as any);
		http
			.post('/project/create', formData)
			.then(res => {
				enqueueSnackbar(res.message, { variant: 'success' });
				setOpenDialog(false);
			})
			.catch(err => enqueueSnackbar(err?.message ?? err, { variant: 'error' }))
			.finally(() => setProjectForm(new ProjectFormClass()));
	};

	return (
		<>
			<Fab
				variant='extended'
				color='primary'
				sx={{ position: 'absolute', bottom: 24, right: 24 }}
				onClick={() => setOpenDialog(true)}
			>
				<AddBoxOutlinedIcon sx={{ mr: 1 }} />
				{t('button.newProject')}
			</Fab>
			<Styled.Dialog open={openDialog} onClose={setOpenDialog}>
				<DialogTitle>{t('project.dialogTitle')}</DialogTitle>
				<form onSubmit={handleSubmit}>
					<DialogContent>
						<Stack spacing={2}>
							<Box>
								<Typography variant='h6' component='h3'>
									{t('project.manager')}
								</Typography>
								<Styled.AccountInfo {...accountInfo} />
							</Box>
							<Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.5}>
								<Stack flexGrow={1}>
									<Typography variant='h6' component='h3'>
										{t('project.info')}
									</Typography>
									<TextField
										id='name'
										value={projectForm.name}
										label={t('project.form.name')}
										variant='outlined'
										margin='normal'
										onChange={e => handleInputChange({ name: e.target.value })}
									/>
									<TextField
										id='description'
										value={projectForm.description}
										label={t('project.form.description')}
										multiline
										rows={5}
										margin='normal'
										onChange={e => handleInputChange({ description: e.target.value })}
									/>
								</Stack>
								<MemberList data={members} members={projectForm.members} setMembers={setProjectForm} />
							</Stack>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCancel}>{t('button.cancel')}</Button>
						<Button variant='contained' type='submit'>
							{t('button.submit')}
						</Button>
					</DialogActions>
				</form>
			</Styled.Dialog>
		</>
	);
};

const MemberList: React.FC<{
	data: (AccountInfo & { position: string })[];
	members: (AccountInfo & { role: string })[];
	setMembers: (value: React.SetStateAction<ProjectForm>) => void;
}> = ({ data, members, setMembers }) => {
	const { t } = useTranslation();
	const [roleList, setRoleList] = useState<StaticData[]>([]);
	const [anchorEl, setAnchorEl] = useState<{ el: null | HTMLDivElement; index: number }>({
		el: null,
		index: -1
	});

	useEffect(() => {
		http.get<StaticData[]>('/static/roles').then(res => {
			setRoleList(res.data!);
		});
	}, []);

	const handleToggle = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		if (e.target.checked) {
			setAnchorEl({ el: e.target, index });
		} else {
			setMembers(preVal => {
				const { members } = preVal;
				const _index = members.findIndex(item => item._id === data[index]._id);
				members.splice(_index, 1);

				return { ...preVal, members };
			});
			setAnchorEl({ el: null, index: -1 });
		}
	};

	const handleMenuClose = () => {
		setAnchorEl({ el: null, index: -1 });
	};

	const handleAssignRole = (role: StaticData) => {
		setMembers(preVal => {
			const { members } = preVal;
			const { fullName, _id, avatar } = data[anchorEl.index];
			members.push({
				role: role.name,
				fullName,
				_id,
				avatar
			});
			return { ...preVal, members };
		});
		setAnchorEl({ el: null, index: -1 });
	};

	const getRoles = (_id: string) => {
		const exist = members.find(item => item._id === _id);
		return exist ? (
			<Typography variant='body2' component='span' color='text.secondary'>
				{exist.role}
			</Typography>
		) : null;
	};

	return (
		<Stack flexGrow={1}>
			<Typography variant='h6' component='h3'>
				{t('project.members')}
			</Typography>
			<List dense sx={{ maxHeight: 260, overflow: 'auto' }}>
				{data.map((member, index) => (
					<ListItem
						key={member._id}
						disablePadding
						secondaryAction={
							<Stack direction='row' alignItems='center'>
								{getRoles(member._id)}
								<Checkbox
									edge='end'
									onChange={e => handleToggle(e, index)}
									inputProps={{ 'aria-labelledby': member._id }}
								/>
							</Stack>
						}
					>
						<Styled.AccountInfo {...(member as Account & { fullName: string })} component={ListItemButton} />
					</ListItem>
				))}
			</List>
			<Menu open={Boolean(anchorEl.el)} anchorEl={anchorEl.el} onClose={handleMenuClose}>
				{roleList.map(item => (
					<MenuItem key={item._id} onClick={() => handleAssignRole(item)}>
						{item.name}
					</MenuItem>
				))}
			</Menu>
		</Stack>
	);
};

// const FileUpload: React.FC<{ setAttachments: (val: Partial<ProjectForm>) => void }> = ({ setAttachments }) => {
// 	const { t } = useTranslation();
// 	const { getRootProps, getInputProps, acceptedFiles } = useDropzone({ noKeyboard: true });

// 	useEffect(() => {
// 		setAttachments({ attachments: acceptedFiles });
// 	}, [acceptedFiles]);

// 	return (
// 		<Stack flexGrow={1}>
// 			<Typography variant='h6' component='h3' sx={{ pb: 1 }}>
// 				{t('project.attachments')}
// 			</Typography>
// 			<Stack>
// 				<label {...getRootProps()}>
// 					<input style={{ display: 'none' }} {...getInputProps({ accept: 'pdf/*', multiple: true, type: 'file' })} />
// 					<Button variant='outlined' component='span' fullWidth>
// 						{t('button.upload')}
// 					</Button>
// 				</label>
// 			</Stack>
// 		</Stack>
// 	);
// };

export default Project;
