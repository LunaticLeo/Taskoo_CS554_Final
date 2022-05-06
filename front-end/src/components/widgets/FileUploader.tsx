import { Box, styled, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import { useTranslation } from 'react-i18next';
import { FileUploaderProps } from '@/@types/props';

const Uploader = styled(Box)(({ theme }) => ({
	width: '100%',
	borderWidth: '2px',
	borderRadius: '2px',
	borderColor: '#eeeeee',
	borderStyle: 'dashed',
	backgroundColor: theme.palette.background.paper,
	color: '#bdbdbd',
	outline: 'none',
	textAlign: 'center'
}));

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected, size = 5, sx }) => {
	const { t } = useTranslation();
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

	useEffect(() => {
		acceptedFiles.length && onFileSelected(acceptedFiles);
	}, [acceptedFiles]);

	return (
		<Uploader sx={{ p: size, ...sx }} {...getRootProps()}>
			<input {...getInputProps()} />
			<CloudUploadRoundedIcon sx={{ fontSize: 60 }} />
			<Typography>{t('file.tip')}</Typography>
		</Uploader>
	);
};

export default FileUploader;
