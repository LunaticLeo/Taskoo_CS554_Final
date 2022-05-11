import React, { useCallback, useEffect, useState } from 'react';
import {
	Box,
	Button,
	Checkbox,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fab,
	Grid,
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
import Styled from '@/components/widgets/Styled';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import useAccountInfo from '@/hooks/useAccountInfo';
import http from '@/utils/http';
import { Page, toFormData } from '@/utils';
import { useSnackbar } from 'notistack';
import useFormatList from '@/hooks/useFormatList';
import { Form } from '@/@types/form';
import { PageConfig, ProjectFormDialogProps, ProjectMemberListProps, WithPage } from '@/@types/props';
import useNotification from '@/hooks/useNotification';
import { useAppDispatch } from '@/hooks/useStore';
import { setLoading } from '@/store/loading';
import useValidation from '@/hooks/useValidation';

type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
const header: (keyof ProjectInfo)[] = ['name', 'createTime', 'status', 'members'];

const Project: React.FC = () => {
	const [data, setData] = useState<ProjectInfo[]>([]);
	const [pageConfig, setPageConfig] = useState<PageConfig>(new Page({ pageSize: 15 }));
	const [permission, setPermission] = useState<boolean>(false);
	const tableData = useFormatList(data, _id => `/home/project/${_id}`);

	useEffect(() => {
		// check create permission
		http.get<boolean>('/account/permission', { category: 'projects' }).then(res => {
			setPermission(res.data!);
		});
	}, []);

	useEffect(() => {
		getProjectList();
	}, [pageConfig.pageNum]);

	const getProjectList = useCallback(() => {
		const { pageNum, pageSize } = pageConfig;
		http.get<WithPage<ProjectInfo[]>>('/project/list', { pageNum, pageSize }).then(res => {
			setData(res.data!.list);
			setPageConfig(preVal => ({ ...preVal, count: res.data!.count }));
		});
	}, [pageConfig.pageNum]);

	const handlePageChange = (_: unknown, value: number) => {
		setPageConfig(preVal => ({ ...preVal, pageNum: value }));
	};

	return (
		<>
			<Grid container spacing={2} flexDirection={{ xs: 'row', lg: 'row-reverse' }}>
				<Grid item xs={12} lg={3}>
					<ToDoList />
				</Grid>
				<Grid item xs={12} lg={9}>
					<TableList<ProjectInfo>
						showHeader
						size='small'
						header={header}
						data={tableData}
						pageConfig={pageConfig}
						sx={{ height: '85vh' }}
						onPageChange={handlePageChange}
					/>
				</Grid>
			</Grid>
			{permission && <FormDialog refresh={getProjectList} />}
		</>
	);
};

class ProjectFormClass implements Form.ProjectForm {
	name = '';
	description = '';
	members = [];
}

const FormDialog: React.FC<ProjectFormDialogProps> = ({ refresh }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const [members, setMembers] = useState<Account<string>[]>([]);
	const notificate = useNotification();
	const [projectForm, setProjectForm] = useState<Form.ProjectForm>(new ProjectFormClass());
	const accountInfo = useAccountInfo();
	const { valid } = useValidation();

	useEffect(() => {
		http.get<Account<string>[]>('/account/members').then(res => {
			const memberList = res.data!.filter(item => item._id !== accountInfo._id);
			setMembers(memberList);
		});
	}, []);

	const handleInputChange = (val: Partial<Form.ProjectForm>) => {
		setProjectForm(preVal => ({ ...preVal, ...val }));
	};

	const handleCancel = () => {
		setOpenDialog(false);
	};
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const members = projectForm.members.map(item => JSON.stringify(item));
		const formData = toFormData<Form.ProjectForm<string>>({ ...projectForm, members });
		dispatch(setLoading(true));
		http
			.post('/project/create', formData)
			.then(res => {
				refresh && refresh();
				notificate.success(res.message);
			})
			.catch(err => notificate.error(err?.message ?? err))
			.finally(() => {
				setTimeout(() => dispatch(setLoading(false)), 1000);
				setOpenDialog(false);
				setProjectForm(new ProjectFormClass());
			});
	};

	return (
		<>
			<Fab
				variant='extended'
				color='primary'
				sx={{ position: 'fixed', bottom: 24, right: 24 }}
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
										required
										id='name'
										value={projectForm.name}
										label={t('project.form.name')}
										variant='outlined'
										margin='normal'
										{...valid('Project', (e: ChangeEvent) => handleInputChange({ name: e.target.value.trim() }))}
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

const MemberList: React.FC<ProjectMemberListProps> = ({ data, members, setMembers }) => {
	const { t } = useTranslation();
	const [checked, setChecked] = useState<boolean[]>(Array(data.length).fill(false));
	const [roleList, setRoleList] = useState<StaticData[]>([]);
	const [anchorEl, setAnchorEl] = useState<{ el: null | HTMLDivElement; index: number }>({
		el: null,
		index: -1
	});

	useEffect(() => {
		http.get<StaticData[]>('/static/roles').then(res => {
			setRoleList(res.data!.filter(item => item.name !== 'Manager'));
		});
	}, []);

	const handleToggle = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		setChecked(preVal => {
			preVal[index] = e.target.checked;
			return [...preVal];
		});
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
		const exist = members.some(item => item._id === data[anchorEl.index]._id);
		if (checked[anchorEl.index] && !exist) {
			setChecked(preVal => {
				preVal[anchorEl.index] = false;
				return [...preVal];
			});
		}

		setAnchorEl({ el: null, index: -1 });
	};

	const handleAssignRole = (role: StaticData) => {
		setMembers(preVal => {
			const { members } = preVal;
			const { _id } = data[anchorEl.index];
			members.push({ _id, role });
			return { ...preVal, members };
		});
		setAnchorEl({ el: null, index: -1 });
	};

	const getRoles = (_id: string) => {
		const exist = members.find(item => item._id === _id);
		return exist ? (
			<Typography variant='body2' component='span' color='text.secondary'>
				{(exist.role as StaticData).name}
			</Typography>
		) : null;
	};

	return (
		<Stack flexGrow={1}>
			<Typography variant='h6' component='h3'>
				{t('project.members')}
			</Typography>
			<List dense sx={{ maxHeight: 240.12, overflow: 'auto' }}>
				{data.map((member, index) => (
					<ListItem
						key={member._id}
						disablePadding
						secondaryAction={
							<Stack direction='row' alignItems='center'>
								{getRoles(member._id)}
								<Checkbox
									edge='end'
									checked={checked[index]}
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

export default Project;
