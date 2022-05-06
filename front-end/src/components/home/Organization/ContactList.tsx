import React, { useState, useMemo, useEffect } from 'react';
import { ContactListProps, ContactListItemProps } from '@/@types/props';
import { toFullName, stringAvatar } from '@/utils';
import http from '@/utils/http';
import {
	Stack,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	List,
	ListItemButton,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Collapse,
	ListItemIcon
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const ContactList: React.FC<ContactListProps> = ({ data, dense = false, sx, filteable = true }) => {
	const { t } = useTranslation();
	const [options, setOptions] = useState<Record<'departments' | 'positions', StaticData[]>>({
		departments: [],
		positions: []
	});
	const [filter, setFilter] = useState({ department: '', position: '' });
	const listData = useMemo(() => {
		if (filter.department === '' && filter.position === '') {
			return data;
		} else if (filter.department !== '' && filter.position !== '') {
			return data.filter(item => item.department._id === filter.department && item.position._id === filter.position);
		} else if (filter.department !== '') {
			return data.filter(item => item.department._id === filter.department);
		} else {
			return data.filter(item => item.position._id === filter.position);
		}
	}, [data, filter]);

	useEffect(() => {
		http.get<StaticData[]>('/static/departments').then(res => {
			setOptions(preVal => ({ ...preVal, departments: res.data! }));
		});
		http.get<StaticData[]>('/static/positions').then(res => {
			setOptions(preVal => ({ ...preVal, positions: res.data! }));
		});
	}, []);

	const handleInputChange = (val: Partial<{ department: string; position: string }>) => {
		setFilter(preVal => ({ ...preVal, ...val }));
	};

	return (
		<>
			{filteable && (
				<Stack direction='row' spacing={1.5} mb={3}>
					{['department', 'position'].map(item => (
						<FormControl key={item} variant='filled' sx={{ minWidth: 200 }}>
							<InputLabel id={`${item}-label`}>{t(item)}</InputLabel>
							<Select
								id={item}
								labelId={`${item}-label`}
								label={t(item)}
								value={filter[item as 'department' | 'position']}
								onChange={e => handleInputChange({ [item]: e.target.value })}
							>
								<MenuItem value=''>
									<em>All</em>
								</MenuItem>
								{options[(item + 's') as 'departments' | 'positions'].map(option => (
									<MenuItem key={option._id} value={option._id}>
										{option.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					))}
				</Stack>
			)}
			<List dense={dense} sx={{ height: { xs: 'auto', md: '85%' }, overflow: { xs: 'inherit', md: 'auto' }, ...sx }}>
				{listData.map(contact => (
					<ContactListItem key={contact._id} data={contact} />
				))}
			</List>
		</>
	);
};

const ContactListItem: React.FC<ContactListItemProps> = ({ data }) => {
	const fullName = useMemo(() => toFullName(data.firstName, data.lastName), [data.firstName, data.lastName]);
	const [open, setOpen] = useState<boolean>(false);

	return (
		<>
			<ListItemButton onClick={() => setOpen(!open)}>
				<ListItem>
					<ListItemAvatar>
						{data.avatar ? (
							<Avatar alt={fullName} src={data.avatar} />
						) : (
							<Avatar alt={fullName} {...stringAvatar(fullName)} />
						)}
					</ListItemAvatar>
					<ListItemText primary={fullName} secondary={data.email} />
					{open ? <ExpandLess /> : <ExpandMore />}
				</ListItem>
			</ListItemButton>
			<Collapse in={open}>
				<List>
					{['position', 'department'].map(item => (
						<ListItemButton key={data._id + item} sx={{ pl: 10 }}>
							<ListItemIcon>{icons[item as 'department' | 'position']}</ListItemIcon>
							<ListItemText primary={data[item as 'department' | 'position'].name} />
						</ListItemButton>
					))}
				</List>
			</Collapse>
		</>
	);
};

const icons = {
	department: <AccountBalanceRoundedIcon />,
	position: <WorkRoundedIcon />
};

export default ContactList;
