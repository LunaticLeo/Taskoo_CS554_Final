import React, { useCallback, useEffect, useState } from 'react';
import {Grid} from '@mui/material';
import { useTranslation } from 'react-i18next';
import http from '@/utils/http';
import useFormatList from '@/hooks/useFormatList';
import OrgChart from './OrgChart';
import OrgList from './OrgList';


const Organzation: React.FC = () => {
	const [data, setData] = useState<ProjectInfo[]>([]);
	const tableData = useFormatList(data, _id => `/home/project/${_id}`);

	useEffect(() => {
		getProjectList();
	}, []);

	const getProjectList = useCallback(() => {
		http.get<ProjectInfo[]>('/project/list').then(res => {
			setData(res.data!);
		});
	}, []);
	
	return (
		<>
			<Grid container spacing={3} >
				<Grid item xs={12} lg={5}>
					<OrgChart />
				</Grid>
				<Grid item xs={12} lg={6}>
					<OrgList />
				</Grid>
			</Grid>
		</>
	);
};



export default Organzation;
