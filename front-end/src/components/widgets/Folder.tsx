import React, { useMemo } from 'react';
import { Box, Grid, Link, styled, Typography } from '@mui/material';
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

const StyledItem = styled(Grid)(({ theme }) => ({
	textAlign: 'center',
	cursor: 'pointer',
	borderRadius: theme.shape.borderRadius,
	'&:hover': {
		background: theme.palette.primary.light
	}
}));

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
			<Link href={fileUrl} target='__blank' download={fileInfo.fileName}>
				<Box
					component='img'
					sx={{ width: 50 }}
					src={`https://storage.cloud.google.com/taskoo_bucket/file_${fileInfo.fileType}.svg`}
					alt='file-icon'
				/>
				<Typography variant='subtitle2' component='div' noWrap>
					{fileInfo.fileName}
				</Typography>
			</Link>
		</Grid>
	);
};

export default Folder;
