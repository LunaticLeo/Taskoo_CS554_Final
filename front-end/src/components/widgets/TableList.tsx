import React from 'react';
import {
	Box,
	Pagination,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@mui/material';
import { Translation } from 'react-i18next';
import { TableListProps } from '@/@types/props';
import empty from '@/assets/empty.svg';

export default class TableList<T extends { _id: string; [prop: string]: any }> extends React.Component<
	TableListProps<T>
> {
	render() {
		const { header, data, showHeader = false, size, pageConfig, onPageChange, sx } = this.props;

		const showPagination = (pageConfig?.count ?? -Infinity) > data.length;
		const pageCount = ~~((pageConfig?.count ?? 0) / (pageConfig?.pageSize ?? 1)) + 1;
		let height = 'fit-content';
		let maxHeight = 'fit-content';
		if (showPagination) {
			// @ts-ignore
			sx?.height && (height = `calc(${sx?.height} - 40px)`);
			// @ts-ignore
			sx?.maxHeight && (maxHeight = `calc(${sx?.maxHeight} - 40px)`);
		}

		return (
			<Translation>
				{t => (
					<>
						<TableContainer sx={{ ...sx, height, maxHeight }}>
							<Table aria-label='table list' size={size}>
								{showHeader && (
									<TableHead>
										<TableRow>
											{header.map(item => (
												<TableCell key={item as string}>{t(`table.header.${item}`)}</TableCell>
											))}
										</TableRow>
									</TableHead>
								)}
								{Boolean(data.length) && (
									<TableBody>
										{data.map(row => (
											<TableRow key={row._id}>
												{header.map(item => (
													<TableCell key={item + row._id}>{row[item]}</TableCell>
												))}
											</TableRow>
										))}
									</TableBody>
								)}
							</Table>
						</TableContainer>
						{!Boolean(data.length) && (
							<Box sx={{ textAlign: 'center', width: '100%' }}>
								<Box component='img' src={empty} sx={{ width: 100, height: 100 }} />
								<Typography variant='body2' color='text.secondary'>
									{t('noData')}
								</Typography>
							</Box>
						)}
						{showPagination && (
							<StyledPagination
								color='primary'
								count={pageCount}
								page={pageConfig?.pageNum ?? 1}
								onChange={onPageChange}
							/>
						)}
					</>
				)}
			</Translation>
		);
	}
}

const StyledPagination = styled(Pagination)(({ theme }) => ({
	marginTop: theme.spacing(1),
	'& .MuiPagination-ul': {
		justifyContent: 'flex-end'
	}
}));
