import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import i18n from '@/i18n';
import { LangButtonProps } from '@/@types/props';

const LangButton: React.FC<LangButtonProps> = ({ sx }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	return (
		<>
			<IconButton sx={sx} size='large' onClick={e => setAnchorEl(e.currentTarget)} aria-label='lang-btn'>
				<TranslateIcon />
			</IconButton>

			<Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
				<MenuItem onClick={() => i18n.changeLanguage('en')}>English (United States)</MenuItem>
				<MenuItem onClick={() => i18n.changeLanguage('cn')}>简体中文</MenuItem>
			</Menu>
		</>
	);
};

export default LangButton;
