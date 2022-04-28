import React, { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { FolderProps, FileItemProps } from '@/@types/props';

const Folder: React.FC<FolderProps> = ({ filesUrl }) => {
	return (
		<Grid container spacing={2} sx={{ minWidth: 500 }}>
			{filesUrl.map(item => (
				<FileItem key={item} fileUrl={item} />
			))}
		</Grid>
	);
};

const FileItem: React.FC<FileItemProps> = ({ fileUrl }) => {
	const fileInfo = useMemo(() => {
		const res = fileUrl.match(/.+\/(.+)\.([a-zA-Z]+)$/)!;
		return {
			fileName: res[1],
			fileType: res[2].toLowerCase()
		};
	}, [fileUrl]);

	return (
		<Grid item xs={4} flex={1} sx={{ textAlign: 'center' }}>
			<Box
				component='img'
				sx={{ width: 50 }}
				src={`https://storage.cloud.google.com/taskoo_bucket/file_${fileInfo.fileType}.svg`}
			/>
			<Typography variant='subtitle2' noWrap>
				{fileInfo.fileName}
			</Typography>
		</Grid>
	);
};

export default Folder;
