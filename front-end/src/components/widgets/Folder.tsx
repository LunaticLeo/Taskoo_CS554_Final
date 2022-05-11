import React, { useMemo } from 'react';
import { Box, Link, List, ListItem, ListItemIcon, ListItemText, styled } from '@mui/material';
import { FolderProps, FileItemProps } from '@/@types/props';

const Folder: React.FC<FolderProps> = ({ filesUrl }) => {
	return (
		<List dense sx={{ minWidth: 400, maxHeight: 240, overflow: 'auto' }}>
			{filesUrl.map(item => (
				<FileItem key={item} fileUrl={item} />
			))}
		</List>
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

	const fullFileName = useMemo(() => fileInfo.fileName + '.' + fileInfo.fileType, [fileInfo]);

	return (
		<ListItem>
			<ListItemIcon>
				<Box
					sx={{ width: 40, mr: 1 }}
					component='img'
					src={`https://storage.cloud.google.com/taskoo_bucket/file_${fileInfo.fileType}.svg`}
					alt='file-icon'
				/>
				<StyledItem
					sx={{ display: 'flex' }}
					primary={
						<Link download target='_blank' href={fileUrl} underline='hover'>
							{fullFileName}
						</Link>
					}
				/>
			</ListItemIcon>
		</ListItem>
	);
};

const StyledItem = styled(ListItemText)(() => ({
	'& .MuiListItemText-primary': {
		display: 'flex',
		alignItems: 'center'
	}
}));

export default Folder;
