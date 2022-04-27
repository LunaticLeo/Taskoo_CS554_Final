import { useMemo } from 'react';
import { Chip, Link } from '@mui/material';
import { Link as NavLink } from 'react-router-dom';
import dayjs from 'dayjs';
import Styled from '@/components/widgets/Styled';

const useFormatList = (data: ProjectInfo[] | TaskInfo[], cb?: (_id: string) => string) => {
	const tableData = useMemo(
		() =>
			data.map(item => {
				const { _id, name, createTime, status, members } = item;
				return {
					_id,
					name: (
						<Link component={NavLink} to={cb ? cb(_id) : ''} underline='hover'>
							{name}
						</Link>
					),
					createTime: dayjs(+createTime).format('MM/DD/YYYY'),
					...((item as TaskInfo)?.dueTime ? { dueTime: dayjs(+(item as TaskInfo).dueTime).format('MM/DD/YYYY') } : {}),
					status: <Chip label={status} color={status.toLowerCase() as any} variant='outlined' />,
					members: <Styled.AvatarGroup data={members} />
				};
			}),
		[data]
	);

	return tableData;
};

export default useFormatList;
