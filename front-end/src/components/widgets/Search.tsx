import React, { useState } from 'react';
import {
	Autocomplete,
	Button,
	DialogActions,
	DialogContent,
	IconButton,
	InputAdornment,
	InputBase,
	lighten,
	List,
	ListItem,
	ListItemButton,
	styled,
	TextField,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { grey } from '@mui/material/colors';
import http from '@/utils/http';
import Styled from './Styled';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Search: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const theme = useTheme();
	const largeScreen = useMediaQuery(theme.breakpoints.up('lg'));
	const [value] = useState<SearchOptions | null>(null);
	const [inputValue] = useState<string>();
	const [options, setOptions] = useState<SearchOptions[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const handleInputChange = (_: unknown, searchTerm: string | null) => {
		if (!searchTerm) {
			setOptions([]);
			return;
		}

		getOptions(searchTerm);
	};
	const handleChange = (e: ChangeEvent) => {
		const searchTerm = e.target.value;
		if (!searchTerm) {
			setOptions([]);
			return;
		}

		getOptions(searchTerm);
	};

	const getOptions = (searchTerm: string) => {
		setLoading(true);
		http
			.get<SearchOptions[]>('/project/search', { searchTerm })
			.then(res => {
				setOptions(res.data!);
			})
			.finally(() => setLoading(false));
	};

	const handleSelect = (_: unknown, value: SearchOptions | null) => {
		navigate(`/home/project/${value?.project}`);
		openDialog && setOpenDialog(false);
	};

	const handleOpen = () => {
		setOptions([]);
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
	};

	return largeScreen ? (
		<Autocomplete
			value={value}
			inputValue={inputValue}
			options={options}
			loading={loading}
			onChange={handleSelect}
			onInputChange={handleInputChange}
			getOptionLabel={option => option.name}
			isOptionEqualToValue={() => false}
			renderOption={(props, option) => (
				<ListItem component='li' {...props}>
					<Styled.Status size='small' variant='outlined' sx={{ mr: 1 }} label={option.status} />
					<Typography variant='body2' noWrap>
						{option.name}
					</Typography>
				</ListItem>
			)}
			renderInput={params => (
				<SearchInput ref={params.InputProps.ref}>
					<SearchIconWrapper>
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase
						{...params.InputProps}
						placeholder='Search…'
						inputProps={{ ...params.inputProps, 'aria-label': 'search' }}
					/>
				</SearchInput>
			)}
		/>
	) : (
		<>
			<IconButton sx={{ ml: 'auto' }} onClick={handleOpen}>
				<SearchIcon />
			</IconButton>
			<Styled.Dialog maxWidth='lg' open={openDialog} onClose={handleClose}>
				<DialogContent>
					<TextField
						fullWidth
						onChange={handleChange}
						variant='standard'
						placeholder='Search...'
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<SearchIcon />
								</InputAdornment>
							)
						}}
					/>
					<List dense sx={{ maxHeight: '90vh', overflow: 'auto' }}>
						{options.map(option => (
							<ListItem key={option.name}>
								<ListItemButton onClick={() => handleSelect(null, option)}>
									<Styled.Status size='small' variant='outlined' sx={{ mr: 1 }} label={option.status} />
									<Typography variant='body2' noWrap>
										{option.name}
									</Typography>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>{t('button.close')}</Button>
				</DialogActions>
			</Styled.Dialog>
		</>
	);
};

const SearchInput = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	...(theme.palette.mode === 'light'
		? {
				backgroundColor: grey[100],
				'&:hover': {
					backgroundColor: grey[200]
				}
		  }
		: {
				backgroundColor: lighten(theme.palette.background.paper, 0.08),
				'&:hover': {
					backgroundColor: lighten(theme.palette.background.paper, 0.12)
				}
		  }),
	marginLeft: 0,
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(1),
		width: 'auto'
	}
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('xs')]: {
			width: '10ch!important',
			'&:focus': {
				width: '20ch!important'
			}
		}
	}
}));

export default Search;
