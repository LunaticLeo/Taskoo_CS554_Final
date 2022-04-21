import { useMemo } from 'react';
import { Chip, Link } from '@mui/material';
import { Link as NavLink } from 'react-router-dom';
import dayjs from 'dayjs';
import Styled from '@/components/widgets/Styled';

const useFormatList = (data: ProjectInfo[], cb: (_id: string) => string) => {
	const tableData = useMemo(
		() =>
			data.map(item => {
				const { _id, name, createTime, status, members } = item;
				return {
					_id,
					name: (
						<Link component={NavLink} to={cb(_id)} underline='hover'>
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

	return tableData;
};

export default useFormatList;
